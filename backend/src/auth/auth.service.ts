import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) { }

  async validateOrCreateUser(profile: any) {
    const { googleId, email, name } = profile;

    let user = await this.prisma.user.findUnique({
      where: { googleId },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          googleId,
          email,
          name,
        },
      });
    }

    return user;
  }

  generateToken(user: any) {
    return this.jwt.sign({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }
}
