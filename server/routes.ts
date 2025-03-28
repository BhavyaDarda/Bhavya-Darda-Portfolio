import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve PDF with correct headers
  app.get('/resume.pdf', (req, res) => {
    const pdfPath = path.join(__dirname, '../client/public/resume.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
    res.setHeader('Content-Security-Policy', "default-src 'self'; object-src 'self'");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(pdfPath, (err) => {
      if (err) {
        console.error('Error serving PDF:', err);
        res.status(404).send('PDF not found');
      }
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
