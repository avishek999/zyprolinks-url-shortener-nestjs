import { PrismaService } from './../prisma/prisma.service';

import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private Jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { name: dto.name },
    });

    if (existingUser) {
      throw new ForbiddenException('name is already in used ');
    }
    // generate the hash

    const hash = await argon.hash(dto.password);

    //save the user in db
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        hash,
      },

      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
    // return the saved user

    return user;
  }
  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { name: dto.name },
    });

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    // verify the password
    const valid = await argon.verify(user.hash, dto.password);
    if (!valid) {
      throw new ForbiddenException('Invalid credentials');
    }
    delete user.hash;

    return this.signToken(user.id, user.name);
  }

  async signToken(
    userId: string,
    name: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      name: name,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.Jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
