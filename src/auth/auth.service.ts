import { PrismaService } from './../prisma/prisma.service';

import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { AuthDto } from './dto';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { name: dto.name },
    });

    if (existingUser) {
      throw new ForbiddenException('name is already in used ');
    }
    // genrate the hash

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
  signin() {
    return {};
  }
}
