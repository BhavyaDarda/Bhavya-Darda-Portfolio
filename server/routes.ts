import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve PDF with correct headers
  app.get('/resume.pdf', (req, res) => {
    const filePath = path.resolve(__dirname, '../client/public/resume.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending PDF:', err);
        res.status(404).send('PDF not found');
      }
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
