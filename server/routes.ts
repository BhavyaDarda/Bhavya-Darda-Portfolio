import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from 'ws';
import crypto from 'crypto';
import { storage } from "./storage";

// Interface to track connected websocket clients with metadata
interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean;
  userId?: string;
  userTheme?: string;
  clientId: string;
}

// Broadcast to all connected clients
const broadcastToAll = (wss: WebSocketServer, message: any) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

// Broadcast to all except sender
const broadcastToOthers = (wss: WebSocketServer, sender: WebSocket, message: any) => {
  wss.clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);
  
  // Create WebSocket server on a specific path to avoid conflicts with Vite's HMR
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Set up WebSocket connection handling
  wss.on('connection', (ws: ExtendedWebSocket) => {
    // Generate a unique ID for this client
    ws.clientId = crypto.randomUUID();
    ws.isAlive = true;
    
    console.log(`New WebSocket client connected: ${ws.clientId}`);
    
    // Send welcome message and client ID
    ws.send(JSON.stringify({
      type: 'welcome',
      clientId: ws.clientId,
      message: 'Connected to portfolio WebSocket server',
      timestamp: new Date().toISOString(),
      connectedUsers: Array.from(wss.clients).length
    }));
    
    // Broadcast new user connection to everyone else
    broadcastToOthers(wss, ws, {
      type: 'userJoined',
      clientId: ws.clientId,
      timestamp: new Date().toISOString(),
      connectedUsers: Array.from(wss.clients).length
    });
    
    // Handle incoming messages
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle message types
        switch (data.type) {
          case 'pong':
            ws.isAlive = true;
            break;
            
          case 'themeChange':
            // Update client's theme
            ws.userTheme = data.theme;
            // Broadcast theme change to all other clients
            broadcastToOthers(wss, ws, {
              type: 'userThemeChange',
              clientId: ws.clientId,
              theme: data.theme,
              timestamp: new Date().toISOString()
            });
            break;
            
          case 'cursorPosition':
            // Broadcast cursor position to other clients for collaborative viewing
            broadcastToOthers(wss, ws, {
              type: 'cursorUpdate',
              clientId: ws.clientId,
              x: data.x,
              y: data.y,
              timestamp: new Date().toISOString()
            });
            break;
            
          case 'interactionEvent':
            // Broadcast interaction events like clicks, scrolls, etc.
            broadcastToOthers(wss, ws, {
              type: 'userInteraction',
              clientId: ws.clientId,
              event: data.event,
              metadata: data.metadata,
              timestamp: new Date().toISOString()
            });
            break;
            
          default:
            // Echo unhandled message types back to sender
            ws.send(JSON.stringify({
              type: 'echo',
              originalMessage: data,
              timestamp: new Date().toISOString()
            }));
        }
      } catch (error) {
        console.error('WebSocket message processing error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format',
          timestamp: new Date().toISOString()
        }));
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      console.log(`Client ${ws.clientId} disconnected`);
      // Notify other clients about the disconnection
      broadcastToAll(wss, {
        type: 'userLeft',
        clientId: ws.clientId,
        timestamp: new Date().toISOString(),
        connectedUsers: Array.from(wss.clients).length - 1
      });
    });
    
    // Mark as alive on pong response
    ws.on('pong', () => {
      ws.isAlive = true;
    });
  });
  
  // Set up a heartbeat to detect disconnected clients
  const pingInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const extWs = ws as ExtendedWebSocket;
      if (extWs.isAlive === false) {
        // Terminate inactive connections
        return ws.terminate();
      }
      
      // Mark as inactive until a pong is received
      extWs.isAlive = false;
      // Send ping
      ws.ping();
    });
  }, 30000);
  
  // Clean up interval on server close
  wss.on('close', () => {
    clearInterval(pingInterval);
  });
  
  // WebSocket status endpoint
  app.get('/api/ws-status', (req, res) => {
    res.json({
      connections: Array.from(wss.clients).length,
      status: 'running'
    });
  });

  return httpServer;
}
