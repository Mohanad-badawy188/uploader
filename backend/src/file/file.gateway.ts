import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FileGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const rawUserId = client.handshake.query.userId;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;
    if (userId) {
      void client.join(`user-${userId}`);
    }
  }

  emitUpdate(userId: number, payload: unknown) {
    this.server.to(`user-${userId}`).emit('fileUpdate', payload);
  }
}
