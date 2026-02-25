import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DonationService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, amount: number) {
        // QRIS simulation string: 00020101021126610014ID.CO.QRIS.WWW011893600000000000000002030005102035204000053033605802ID59016...
        const qrContent = `SMART-MUDIK-DONATION-${userId}-${Date.now()}`;

        return this.prisma.donation.create({
            data: {
                userId,
                amount,
                qrContent,
                status: 'PENDING',
            },
        });
    }

    async getMyDonations(userId: string) {
        return this.prisma.donation.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getStats() {
        const total = await this.prisma.donation.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                status: 'SUCCESS', // In a real app we'd filter by success
            }
        });

        return {
            totalAmount: total._sum.amount || 0,
        };
    }
}
