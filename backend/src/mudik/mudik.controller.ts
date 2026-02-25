import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MudikService } from './mudik.service';

@Controller('mudik')
export class MudikController {
  constructor(private mudikService: MudikService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Req() req, @Body() body) {
    return this.mudikService.create(req.user.userId, body);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  update(@Req() req, @Body() body) {
    return this.mudikService.update(req.user.userId, body);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  delete(@Req() req) {
    return this.mudikService.delete(req.user.userId);
  }

  @Post('arrived')
  @UseGuards(AuthGuard('jwt'))
  markArrived(@Req() req) {
    return this.mudikService.markArrived(req.user.userId);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMyEntry(@Req() req) {
    return this.mudikService.getMyEntry(req.user.userId);
  }

  // PUBLIC LIST
  @Get('public')
  getPublic(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('kotaTujuanId') kotaTujuanId?: string,
  ) {
    return this.mudikService.getPublic({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      kotaTujuanId,
    });
  }

  @Get('ranking')
  getRanking() {
    return this.mudikService.getRanking();
  }

  @Get('stats/vehicles')
  getVehicleStats() {
    return this.mudikService.getVehicleStats();
  }

  @Get('stats/timeline')
  getTimelineStats() {
    return this.mudikService.getTimelineStats();
  }

  @Get('stats/provinsi')
  getProvinsiStats() {
    return this.mudikService.getProvinsiStats();
  }
}
