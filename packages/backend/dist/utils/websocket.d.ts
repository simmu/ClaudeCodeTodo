import { Server } from 'http';
export declare class TodoWebSocketServer {
    private wss;
    private clients;
    constructor(server: Server);
    private setupWebSocket;
    private authenticateClient;
    private removeClient;
    broadcastToUser(userId: string, message: any): void;
    broadcast(message: any): void;
    getConnectedUsers(): string[];
    getUserConnectionCount(userId: string): number;
}
//# sourceMappingURL=websocket.d.ts.map