import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { type ContactFormData } from '@shared/schema';
import { analyzeContactInquiry, GeminiAnalysisError, type InquiryAnalysis } from './gemini';

function safeFilename(value: string): string {
  return value.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'inquiry';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function htmlText(value: string): string {
  return escapeHtml(value).replace(/\n/g, '<br>');
}

function pdfText(value: string): string {
  return value.replace(/\u0000/g, '').trim();
}

export type ContactEmailResult =
  | { success: true }
  | { success: false; code: 'configuration' | 'ai' | 'email' };

export async function createContactPDF(
  formData: ContactFormData,
  analysis: InquiryAnalysis,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const filename = `contact-${Date.now()}-${safeFilename(formData.subject)}.pdf`;
    const filepath = path.join('/tmp', filename);

    doc.pipe(fs.createWriteStream(filepath));

    const primaryColor = '#c87532';
    const darkText = '#1a1a2e';
    const mutedText = '#6b7280';
    const lightBg = '#fff7ed';
    const borderColor = '#fed7aa';
    const margin = 50;
    const contentWidth = doc.page.width - margin * 2;

    // Header bar
    doc.rect(0, 0, doc.page.width, 90).fill(primaryColor);

    doc.fillColor('#ffffff')
       .fontSize(22)
       .font('Helvetica-Bold')
       .text('New Contact Inquiry', margin, 28);

    doc.fillColor('rgba(255,255,255,0.75)')
       .fontSize(10)
       .font('Helvetica')
       .text('AI-structured intake brief — portfolio contact form', margin, 56);

    doc.fillColor('rgba(255,255,255,0.6)')
       .fontSize(9)
       .text(`Generated: ${new Date().toLocaleString('en-IN', {
         day: '2-digit', month: 'long', year: 'numeric',
         hour: '2-digit', minute: '2-digit'
        })}`, margin, 70);

    let y = 115;

    // Section helper
    const sectionLabel = (label: string, yPos: number) => {
      doc.fillColor(primaryColor)
         .fontSize(9)
         .font('Helvetica-Bold')
         .text(label.toUpperCase(), margin, yPos);
      doc.moveTo(margin, yPos + 14).lineTo(doc.page.width - margin, yPos + 14)
         .strokeColor(borderColor).lineWidth(0.5).stroke();
    };

    const ensureSpace = (minimumHeight: number) => {
      if (y > doc.page.height - margin - minimumHeight) {
        doc.addPage();
        y = margin;
      }
    };

    const writeField = (label: string, value: string) => {
      ensureSpace(70);
      sectionLabel(label, y);
      y += 22;
      doc.fillColor(mutedText)
        .fontSize(9)
        .font('Helvetica')
        .text(pdfText(value), margin, y, { width: contentWidth });
      y = doc.y + 20;
    };

    const writeContactField = (label: string, value: string, x: number, width: number) => {
      doc.fillColor(darkText)
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(pdfText(value), x, y + 13, { width });
    };

    // Contact Details section
    sectionLabel('Contact Details', y);
    y += 22;

    // Name & Email side by side
    doc.fillColor(mutedText).fontSize(9).font('Helvetica').text('FROM', margin, y);
    doc.fillColor(mutedText).fontSize(9).font('Helvetica').text('EMAIL', 300, y);
    writeContactField('FROM', formData.name, margin, 220);
    writeContactField('EMAIL', formData.email, 300, 245);
    y += 44;

    // Subject
    doc.fillColor(mutedText).fontSize(9).font('Helvetica').text('SUBJECT', margin, y);
    doc.fillColor(darkText).fontSize(12).font('Helvetica-Bold').text(pdfText(formData.subject), margin, y + 13, {
      width: contentWidth,
    });
    y += 50;

    writeField('Inquiry Type', analysis.inquiryType);
    writeField('Priority', analysis.priority.toUpperCase());
    writeField('Executive Summary', analysis.executiveSummary);
    writeField('Project or Idea', analysis.projectOrIdea);
    writeField('Goals', analysis.goals);
    writeField('Requested Deliverables', analysis.requestedDeliverables);
    writeField('Requirements', analysis.requirements);
    writeField('Timeline', analysis.timeline);
    writeField('Budget', analysis.budget);
    writeField('Constraints', analysis.constraints);
    writeField('Missing Information', analysis.missingInformation);
    writeField('Recommended Next Step', analysis.recommendedNextStep);

    ensureSpace(130);
    sectionLabel('Original Message', y);
    y += 22;
    const messageText = pdfText(formData.message);
    doc.fontSize(11);
    const messageHeight = Math.max(
      doc.heightOfString(messageText, { width: contentWidth - 30 }) + 30,
      60,
    );

    doc.rect(margin, y, contentWidth, messageHeight).fillAndStroke(lightBg, borderColor);
    doc.fillColor(darkText)
      .fontSize(11)
      .font('Helvetica')
      .text(messageText, margin + 15, y + 15, {
        width: contentWidth - 30,
        lineGap: 3,
      });
    y += messageHeight + 30;

    // Footer divider
    ensureSpace(55);
    doc.moveTo(margin, y).lineTo(doc.page.width - margin, y)
       .strokeColor(borderColor).lineWidth(0.5).stroke();
    y += 12;

    doc.fillColor(mutedText)
       .fontSize(8)
       .font('Helvetica')
       .text('This PDF was automatically generated from your portfolio contact form.', 50, y, {
         align: 'center',
          width: contentWidth
       });

    doc.fillColor(primaryColor)
       .fontSize(8)
       .font('Helvetica-Bold')
       .text('workbhavya404@gmail.com  ·  github.com/BhavyaDarda', margin, y + 13, {
         align: 'center',
         width: contentWidth
       });

    doc.end();
    doc.on('end', () => resolve(filepath));
    doc.on('error', reject);
  });
}

export async function sendContactEmail(formData: ContactFormData, generatePDF: boolean = true): Promise<ContactEmailResult> {
  let pdfPath: string | null = null;

  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Gmail credentials not configured');
      return { success: false, code: 'configuration' };
    }

    const analysis = await analyzeContactInquiry(formData);
    if (generatePDF) {
      pdfPath = await createContactPDF(formData, analysis);
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'workbhavya404@gmail.com',
      subject: `[${analysis.inquiryType}] ${formData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #a6531d 0%, #d18442 100%); color: white; padding: 28px 30px; border-radius: 10px 10px 0 0;">
            <h2 style="margin: 0 0 6px 0; font-size: 22px;">New ${escapeHtml(analysis.inquiryType)}</h2>
            <p style="margin: 0; opacity: 0.8; font-size: 13px;">Received via your portfolio contact form</p>
          </div>

          <div style="background: #f8f9fa; padding: 28px 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; width: 50%;">
                  <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase; margin-bottom: 4px;">From</div>
                  <div style="font-size: 15px; font-weight: 600; color: #111827;">${escapeHtml(formData.name)}</div>
                </td>
                <td style="padding: 8px 0;">
                  <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase; margin-bottom: 4px;">Email</div>
                  <div style="font-size: 15px; font-weight: 600; color: #7C3AED;">
                    <a href="mailto:${escapeHtml(formData.email)}" style="color: #7C3AED; text-decoration: none;">${escapeHtml(formData.email)}</a>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 8px 0; border-top: 1px solid #e5e7eb;">
                  <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase; margin-bottom: 4px;">Subject</div>
                  <div style="font-size: 16px; font-weight: 700; color: #111827;">${escapeHtml(formData.subject)}</div>
                </td>
              </tr>
            </table>

            <div style="background: white; border: 1px solid #fed7aa; border-left: 4px solid #c87532; border-radius: 6px; padding: 20px;">
              <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase; margin-bottom: 10px;">Executive Summary</div>
              <p style="margin: 0; line-height: 1.7; color: #374151; font-size: 14px;">${htmlText(analysis.executiveSummary)}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr><td style="padding: 8px 0; color: #9ca3af; font-size: 11px; text-transform: uppercase; width: 35%;">Type</td><td style="padding: 8px 0; color: #111827; font-weight: 600;">${escapeHtml(analysis.inquiryType)}</td></tr>
              <tr><td style="padding: 8px 0; color: #9ca3af; font-size: 11px; text-transform: uppercase;">Priority</td><td style="padding: 8px 0; color: #111827; font-weight: 600;">${escapeHtml(analysis.priority.toUpperCase())}</td></tr>
              <tr><td style="padding: 8px 0; color: #9ca3af; font-size: 11px; text-transform: uppercase;">Next Step</td><td style="padding: 8px 0; color: #111827;">${htmlText(analysis.recommendedNextStep)}</td></tr>
            </table>

            <div style="margin-top: 20px; padding: 16px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 6px;">
              <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase; margin-bottom: 10px;">Original Message</div>
              <p style="margin: 0; line-height: 1.7; color: #374151; font-size: 14px;">${htmlText(formData.message)}</p>
            </div>

            <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
              🕒 ${new Date().toLocaleString('en-IN')} &nbsp;·&nbsp; 📎 Structured PDF attached
            </div>
          </div>
        </div>
      `,
      replyTo: formData.email,
      attachments: pdfPath ? [{
        filename: `inquiry-${safeFilename(formData.name)}.pdf`,
        path: pdfPath
      }] : []
    };

    await transporter.sendMail(mailOptions);
    console.log('Contact form email sent successfully');
    return { success: true };
  } catch (error) {
    if (error instanceof GeminiAnalysisError) {
      console.error('Gemini inquiry analysis error:', error.message);
      return { success: false, code: 'ai' };
    }

    console.error('Contact email sending error:', error);
    return { success: false, code: 'email' };
  } finally {
    if (pdfPath) {
      try { fs.unlinkSync(pdfPath); } catch {}
    }
  }
}
