# Redis_PubSub_Example

## Why
이 프로젝트는 Redis의 Pub/Sub 기능을 학습하고, 실시간 메시지 처리 시스템을 구현하기 위한 연습 프로젝트입니다. 이를 통해 실시간 데이터 송수신 구조에 대한 이해를 높이고, Redis Pub/Sub의 장단점 및 실무 적용 가능성을 파악하는 것을 목표로 합니다.

## What
Redis의 Pub/Sub 기능을 사용하여 간단한 실시간 메시지 처리 시스템을 구현합니다. 이 프로젝트를 통해 Pub/Sub의 동작 원리를 이해하고, 이를 실시간 알림 시스템이나 채팅 애플리케이션과 같은 서비스에 어떻게 적용할 수 있는지 학습합니다.

### 주요 기능
- **Message Publish**: 서버에서 메시지를 특정 채널에 발행합니다.
- **Message Subscribe**: 클라이언트에서 해당 채널을 구독하여 실시간으로 메시지를 수신합니다.
- **WebSocket 연동**: `socket.io`를 사용하여 서버와 클라이언트 간의 실시간 통신을 처리합니다.

## How
### 기능 구현
1. **Redis Pub/Sub 설정**
   - Redis 서버에서 클라이언트가 구독할 수 있는 채널을 생성하고, 해당 채널에 메시지를 발행합니다.
   - 구독한 클라이언트는 실시간으로 발행된 메시지를 수신합니다.

2. **서버 구현 (Nest.js)**
   - `ioredis` 패키지를 사용하여 Redis 서버와 연결하고, Pub/Sub 기능을 구현합니다.
   - `socket.io`를 사용하여 클라이언트와 실시간으로 메시지를 주고받는 WebSocket 서버를 설정합니다.

3. **클라이언트 구현 (React)**
   - WebSocket을 통해 서버에서 발행된 메시지를 실시간으로 수신하고, UI에 표시합니다.
   - 사용자가 메시지를 입력하면 서버에 메시지를 발행합니다.

### 코드 예시
```javascript
// 서버 측 (Nest.js)
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
```

```javascript
// 클라이언트 측 (React)
const socket = io('http://localhost:4000');

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('message', (message) => {
  console.log('New message:', message);
});
```

### Trouble Shooting
#### WebSocket 연결 문제
- **문제**: WebSocket 연결이 간헐적으로 끊기거나 수립되지 않는 문제가 발생했습니다.
- **해결 방법**: `socket.io` 서버와 클라이언트의 버전 호환성을 확인하고, 적절한 CORS 설정을 추가하여 문제를 해결했습니다.

#### Redis 메시지 유실 문제
- **문제**: Redis Pub/Sub에서 메시지가 간헐적으로 유실되는 문제가 발생했습니다.
- **해결 방법**: Redis 클러스터 환경에서는 메시지 유실 가능성이 있기 때문에, 안정성을 높이기 위해 `Redis Streams`와 같은 대안을 고려할 수 있습니다.

## Pub/Sub 장단점 및 실무 적용 가능성

### 장점
- **빠른 실시간 메시지 처리**: 메시지를 발행하면 구독자에게 즉시 전송되어 빠른 실시간 처리가 가능합니다.
- **단순한 구조**: 설정과 사용이 간단하여 빠르게 실시간 통신을 구현할 수 있습니다.

### 단점
- **확장성 한계**: Redis Pub/Sub은 확장성에 제한이 있어, 수많은 구독자를 처리하기 위한 수평 확장이 어렵습니다.
- **메시지 유실 가능성**: Redis는 기본적으로 메시지 큐가 아니므로, 메시지를 놓치는 경우가 발생할 수 있습니다.

### 실무 적용 가능성
- **알림 시스템**: 실시간으로 사용자에게 알림을 전송하는 시스템에 적합합니다.
- **채팅 애플리케이션**: 다수의 사용자가 실시간으로 메시지를 주고받는 시스템을 구현할 때 유용합니다.

## Conclusion
이 프로젝트를 통해 Redis Pub/Sub의 기본 개념과 사용법을 학습하였으며, 이를 실시간 메시징 시스템에 적용할 수 있는 방법을 익혔습니다. Pub/Sub의 구조적 장점과 실무 적용 가능성을 이해함으로써, 더 나은 실시간 통신 시스템을 구축하는 데에 도움이 될 것입니다.

## Version
- **Back-end**: Nest.js 10.0.0
- **Front-end**: React 18.3.1

## 실행 방식
1. **서버 실행**
   - Redis 서버가 실행 중인지 확인합니다.
   - Nest.js 서버를 시작합니다:
     ```bash
     npm run start:dev
     ```

2. **클라이언트 실행**
   - React 애플리케이션을 실행합니다:
     ```bash
     npm start
     ```
     
