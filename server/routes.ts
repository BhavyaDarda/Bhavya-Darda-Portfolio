import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve PDF with correct headers
  app.get('/resume.pdf', (req, res) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.sendFile('public/resume.pdf', { root: 'client' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
