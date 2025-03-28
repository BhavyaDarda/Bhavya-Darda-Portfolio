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
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Accept-Ranges', 'bytes');
    res.sendFile(pdfPath, (err) => {
      if (err) {
        console.error('Error serving PDF:', err);
        res.status(404).send('PDF not found');
      }
    });
  });

  app.post('/api/chat', async (req, res) => {
    const { message, language = 'en' } = req.body;
    // TODO: Implement chat request handling with language support here.  This includes
    //       - Receiving the user's message.
    //       - Determining the appropriate language model based on `language`.
    //       - Sending the message to the language model.
    //       - Receiving the response from the language model.
    //       - Sending the response back to the client.
    //       - Error handling.
    res.send({ response: "Chat response placeholder" });
  });


  const httpServer = createServer(app);

  return httpServer;
}