import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MudikService {
  constructor(private prisma: PrismaService) { }

  async create(userId: string, data: any) {
    const existing = await this.prisma.mudikEntry.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new BadRequestException('User already submitted mudik data');
    }

    return this.prisma.mudikEntry.create({
      data: {
        userId,
        ...data,
      },
      include: {
        provinsiAsal: true,
        kotaAsal: true,
        provinsiTujuan: true,
        kotaTujuan: true,
      }
    });
  }

  async update(userId: string, data: any) {
    return this.prisma.mudikEntry.update({
      where: { userId },
      data,
      include: {
        provinsiAsal: true,
        kotaAsal: true,
        provinsiTujuan: true,
        kotaTujuan: true,
      }
    });
  }

  async delete(userId: string) {
    return this.prisma.mudikEntry.delete({
      where: { userId },
    });
  }

  async markArrived(userId: string) {
    return this.prisma.mudikEntry.update({
      where: { userId },
      data: { status: 'SAMPAI' },
    });
  }

  async getMyEntry(userId: string) {
    return this.prisma.mudikEntry.findUnique({
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

  async getProvinsiStats() {
    return this.prisma.province.findMany({
      include: {
        _count: {
          select: { mudiksTujuan: true }
        }
      }
    });
  }
}
