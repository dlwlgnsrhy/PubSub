import { OnGatewayConnection } from '@nestjs/websockets';
import { Server } from 'socket.io';
export declare class ChatGateway implements OnGatewayConnection {
    server: Server;
    private publisher;
    private subscriber;
    constructor();
    handleMessage(message: string): void;
    handleConnection(): void;
}
