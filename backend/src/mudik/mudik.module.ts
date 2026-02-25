import { Module } from '@nestjs/common';
import { MudikController } from './mudik.controller';
import { MudikService } from './mudik.service';

@Module({
  controllers: [MudikController],
  providers: [MudikService]
})
export class MudikModule {}
