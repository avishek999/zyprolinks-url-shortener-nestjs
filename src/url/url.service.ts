import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Adjust import path
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UrlService {
  constructor(private prisma: PrismaService) {}

  async createShortUrl(originalUrl: string, userId: string) {
    const shortCode = uuidv4().slice(0, 8); // Generate short code

    return this.prisma.shortUrl.create({
      data: {
        originalUrl,
        shortCode,
        createdById: userId, // Store the user who created it
      },
    });
  }

  async getOriginalUrl(shortCode: string): Promise<string> {
    const shortUrl = await this.prisma.shortUrl.findUnique({
      where: { shortCode },
    });

    if (!shortUrl) {
      throw new NotFoundException('Short URL not found');
    }

    return shortUrl.originalUrl; // Return the original URL
  }
}
