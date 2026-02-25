import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res: Response) {
    const user = await this.authService.validateOrCreateUser(req.user);

    const token = this.authService.generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:20261';
    return res.redirect(frontendUrl);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }
}
