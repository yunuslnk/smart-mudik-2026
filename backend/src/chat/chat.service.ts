import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) { }

    async createMessage(userId: string | null, content: string, isAdmin: boolean = false) {
        return this.prisma.chatMessage.create({
            data: {
                userId,
                content,
                isAdmin,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async getMessages() {
        return this.prisma.chatMessage.findMany({
            orderBy: {
                createdAt: 'asc',
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            take: 50,
        });
    }
}
