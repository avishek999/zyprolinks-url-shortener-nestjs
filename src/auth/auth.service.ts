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

    return user;
  }
}
