import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'mongodb+srv://avishekprasad0999:1tPRmSnHaHqxeJCs@zypro-links.fdrn5.mongodb.net/?retryWrites=true&w=majority&appName=zypro-links',
        },
      },
    });
  }
}
