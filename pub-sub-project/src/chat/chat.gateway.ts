import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import Redis from 'ioredis';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'], //이후의 CORS설정 관련
    credential: true, //쿠키 허용
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  private publisher: Redis;
  private subscriber: Redis;

  constructor() {
    this.publisher = new Redis({ host: 'localhost', port: 6379 });
    this.subscriber = new Redis({ host: 'localhost', port: 6379 });

    // Redis 구독 채널 설정
    this.subscriber.subscribe('chat-channel');
    this.subscriber.on('message', (channel, message) => {
      // 구독된 채널에서 메시지가 도착하면 WebSocket 클라이언트에 전송
      this.server.emit('newMessage', message);
    });
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    // Redis 채널에 메시지 발행
    this.publisher.publish('chat-channel', message);
  }

  handleConnection() {
    console.log('New client connected');
  }
}
