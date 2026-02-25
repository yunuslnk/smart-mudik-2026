import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('regions')
export class RegionController {
    constructor(private prisma: PrismaService) { }

    @Get('provinces')
    async getProvinces() {
        return this.prisma.province.findMany({
            orderBy: { name: 'asc' },
        });
    }

    @Get('regencies/:provinceId')
    async getRegencies(@Param('provinceId') provinceId: string) {
        return this.prisma.regency.findMany({
            where: { provinceId },
            orderBy: { name: 'asc' },
        });
    }
}
