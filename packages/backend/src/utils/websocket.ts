import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { Server } from 'http';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
}

export class TodoWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, Set<AuthenticatedWebSocket>> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: AuthenticatedWebSocket, request) => {
      console.log('New WebSocket connection');

      // Handle authentication
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());

          if (message.type === 'authenticate') {
            this.authenticateClient(ws, message.token);
          } else if (message.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong' }));
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        this.removeClient(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.removeClient(ws);
      });
    });
  }

  private authenticateClient(ws: AuthenticatedWebSocket, token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      ws.userId = decoded.userId;

      // Add client to user's connection set
      if (!this.clients.has(decoded.userId)) {
        this.clients.set(decoded.userId, new Set());
      }
      this.clients.get(decoded.userId)!.add(ws);

      ws.send(JSON.stringify({ type: 'authenticated', userId: decoded.userId }));
      console.log(`WebSocket client authenticated: ${decoded.userId}`);
    } catch (error) {
      ws.send(JSON.stringify({ type: 'error', message: 'Authentication failed' }));
      ws.close();
    }
  }

  private removeClient(ws: AuthenticatedWebSocket) {
    if (ws.userId) {
      const userClients = this.clients.get(ws.userId);
      if (userClients) {
        userClients.delete(ws);
        if (userClients.size === 0) {
          this.clients.delete(ws.userId);
        }
      }
      console.log(`WebSocket client disconnected: ${ws.userId}`);
    }
  }

  // Broadcast todo update to all user's connected clients
  public broadcastToUser(userId: string, message: any) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      const messageStr = JSON.stringify(message);
      userClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageStr);
        }
      });
    }
  }

  // Broadcast to all connected clients (admin use)
  public broadcast(message: any) {
    const messageStr = JSON.stringify(message);
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  public getConnectedUsers(): string[] {
    return Array.from(this.clients.keys());
  }

  public getUserConnectionCount(userId: string): number {
    return this.clients.get(userId)?.size || 0;
  }
}