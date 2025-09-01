import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
export class TodoWebSocketServer {
    wss;
    clients = new Map();
    constructor(server) {
        this.wss = new WebSocketServer({ server });
        this.setupWebSocket();
    }
    setupWebSocket() {
        this.wss.on('connection', (ws, request) => {
            console.log('New WebSocket connection');
            // Handle authentication
            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    if (message.type === 'authenticate') {
                        this.authenticateClient(ws, message.token);
                    }
                    else if (message.type === 'ping') {
                        ws.send(JSON.stringify({ type: 'pong' }));
                    }
                }
                catch (error) {
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
    authenticateClient(ws, token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            ws.userId = decoded.userId;
            // Add client to user's connection set
            if (!this.clients.has(decoded.userId)) {
                this.clients.set(decoded.userId, new Set());
            }
            this.clients.get(decoded.userId).add(ws);
            ws.send(JSON.stringify({ type: 'authenticated', userId: decoded.userId }));
            console.log(`WebSocket client authenticated: ${decoded.userId}`);
        }
        catch (error) {
            ws.send(JSON.stringify({ type: 'error', message: 'Authentication failed' }));
            ws.close();
        }
    }
    removeClient(ws) {
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
    broadcastToUser(userId, message) {
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
    broadcast(message) {
        const messageStr = JSON.stringify(message);
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(messageStr);
            }
        });
    }
    getConnectedUsers() {
        return Array.from(this.clients.keys());
    }
    getUserConnectionCount(userId) {
        return this.clients.get(userId)?.size || 0;
    }
}
//# sourceMappingURL=websocket.js.map