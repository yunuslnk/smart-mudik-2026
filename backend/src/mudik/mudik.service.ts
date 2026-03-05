import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MudikService {
  constructor(private prisma: PrismaService) { }

  async create(userId: string, data: any) {
    const existing = await this.prisma.mudikEntry.findFirst({
      where: {
        userId,
        status: data.status || 'BERANGKAT'
      },
    });

    if (existing) {
      throw new BadRequestException(`Anda sudah terdaftar untuk status ${data.status || 'BERANGKAT'}`);
    }

    // Strip non-model fields
    const { jenis, ...prismaData } = data;

    return this.prisma.mudikEntry.create({
      data: {
        userId,
        ...prismaData,
      },
      include: {
        provinsiAsal: true,
        kotaAsal: true,
        provinsiTujuan: true,
        kotaTujuan: true,
      }
    });
  }

  async update(userId: string, status: any, data: any) {
    return this.prisma.mudikEntry.update({
      where: {
        userId_status: { userId, status }
      },
      data: (({ jenis, ...d }) => d)(data),
      include: {
        provinsiAsal: true,
        kotaAsal: true,
        provinsiTujuan: true,
        kotaTujuan: true,
      }
    });
  }

  async delete(userId: string, status: any) {
    return this.prisma.mudikEntry.delete({
      where: {
        userId_status: { userId, status }
      },
    });
  }

  async markArrived(userId: string) {
    return this.prisma.mudikEntry.update({
      where: {
        userId_status: { userId, status: 'BERANGKAT' }
      },
      data: { status: 'SAMPAI' },
    });
  }

  async getMyEntry(userId: string) {
    return this.prisma.mudikEntry.findMany({
      where: { userId },
      include: {
        provinsiAsal: true,
        kotaAsal: true,
        provinsiTujuan: true,
        kotaTujuan: true,
      }
    });
  }

  async getPublic({ page = 1, limit = 10, search = '', kotaTujuanId = '' }) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { kotaAsal: { name: { contains: search, mode: 'insensitive' } } },
        { kotaTujuan: { name: { contains: search, mode: 'insensitive' } } },
        { provinsiAsal: { name: { contains: search, mode: 'insensitive' } } },
        { provinsiTujuan: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (kotaTujuanId) {
      where.kotaTujuanId = kotaTujuanId;
    }

    const [data, total] = await Promise.all([
      this.prisma.mudikEntry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          provinsiAsal: true,
          kotaAsal: true,
          provinsiTujuan: true,
          kotaTujuan: true,
        },
      }),
      this.prisma.mudikEntry.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getRanking() {
    return this.prisma.regency.findMany({
      take: 10,
      include: {
        _count: {
          select: { mudiksTujuan: true }
        }
      },
      orderBy: {
        mudiksTujuan: {
          _count: 'desc'
        }
      }
    });
  }

  async getVehicleStats() {
    return this.prisma.mudikEntry.groupBy({
      by: ['kendaraan'],
      _count: {
        kendaraan: true,
      }
    });
  }

  async getTimelineStats() {
    // Get counts grouped by date (tanggal)
    const stats = await this.prisma.mudikEntry.groupBy({
      by: ['tanggal'],
      _count: {
        id: true,
      },
      orderBy: {
        tanggal: 'asc',
      }
    });
    return stats;
  }

  async getStatsFlow() {
    return this.prisma.mudikEntry.groupBy({
      by: ['tanggal'],
      _count: { id: true },
      where: { status: 'BERANGKAT' },
      orderBy: { tanggal: 'asc' },
    });
  }

  async getStatsReturnFlow() {
    return this.prisma.mudikEntry.groupBy({
      by: ['tanggal'],
      _count: { id: true },
      where: { status: 'BALIK' },
      orderBy: { tanggal: 'asc' },
    });
  }

  async getTop10Destinations() {
    const counts = await this.prisma.mudikEntry.groupBy({
      by: ['kotaTujuanId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    // Fetch names for labels
    return Promise.all(
      counts.map(async (item) => {
        const city = await this.prisma.regency.findUnique({
          where: { id: item.kotaTujuanId },
          select: { name: true },
        });
        return {
          name: city?.name || 'Unknown',
          count: item._count.id,
        };
      }),
    );
  }

  async getTotalCount() {
    return this.prisma.mudikEntry.count();
  }
}
