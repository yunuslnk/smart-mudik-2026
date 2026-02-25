import { Module } from '@nestjs/common';
import { RegionController } from './region.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [RegionController],
})
export class RegionModule { }
