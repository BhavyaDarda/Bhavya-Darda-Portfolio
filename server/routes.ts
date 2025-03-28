import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from 'path';

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve PDF with correct headers
  app.get('/resume.pdf', (req, res) => {
    const pdfPath = path.join(__dirname, '../client/public/resume.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(pdfPath);
  });

  const httpServer = createServer(app);

  return httpServer;
}
