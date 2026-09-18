import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendContactEmail } from "./email";
import { contactFormSchema, type ContactFormData } from "@shared/schema";

const CONTACT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const CONTACT_RATE_LIMIT_MAX = 5;
const contactRateLimit = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(clientKey: string): { limited: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const current = contactRateLimit.get(clientKey);

  if (!current || current.resetAt <= now) {
    contactRateLimit.set(clientKey, {
      count: 1,
      resetAt: now + CONTACT_RATE_LIMIT_WINDOW_MS,
    });
    return { limited: false };
  }

  current.count += 1;
  if (current.count > CONTACT_RATE_LIMIT_MAX) {
    return {
      limited: true,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  return { limited: false };
}

function pruneRateLimitEntries(): void {
  const now = Date.now();
  contactRateLimit.forEach((entry, key) => {
    if (entry.resetAt <= now) {
      contactRateLimit.delete(key);
    }
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get(['/healthz', '/api/healthz'], (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Contact form endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      // Validate request body using Zod schema
      const validationResult = contactFormSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: validationResult.error.issues 
        });
      }

      const formData: ContactFormData = validationResult.data;

      if (formData.website) {
        return res.status(400).json({ error: 'Invalid submission.' });
      }

      pruneRateLimitEntries();
      const rateLimitKey = req.ip || 'unknown-client';
      const rateLimitResult = isRateLimited(rateLimitKey);
      if (rateLimitResult.limited) {
        res.set('Retry-After', String(rateLimitResult.retryAfterSeconds));
        return res.status(429).json({
          error: 'Too many messages from this connection. Please try again later.',
        });
      }

      // Send email
      const emailResult = await sendContactEmail(formData);
      
      if (emailResult.success) {
        res.json({ 
          success: true, 
          message: 'Your message was analyzed and sent successfully. I\'ll get back to you soon.' 
        });
      } else {
        res.status(500).json({ 
          error: emailResult.code === 'ai'
            ? 'The inquiry could not be analyzed right now. Please try again later.'
            : 'Failed to send email. Please try again later.'
        });
      }
    } catch (error) {
      console.error('Contact endpoint error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
