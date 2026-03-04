import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatService: ChatService) { }

    async handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
        const messages = await this.chatService.getMessages();
        client.emit('init_messages', messages);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('send_message')
    async handleMessage(
        @MessageBody() data: { userId: string | null; content: string; isAdmin?: boolean },
        @ConnectedSocket() client: Socket,
    ) {
        const message = await this.chatService.createMessage(
            data.userId,
            data.content,
            data.isAdmin || false,
        );
        this.server.emit('receive_message', message);
    }
}
