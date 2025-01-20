import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async recordClick(
    shortCode: string,
    userAgent: string,
    platform: string,
    location?: string,
  ): Promise<void> {
    const shortUrl = await this.prisma.shortUrl.findUnique({
      where: { shortCode: shortCode },
    });

    if (!shortUrl) {
      throw new NotFoundException('Shot url not found');
    }

    await this.prisma.click.create({
      data: {
        shortUrlId: shortUrl.id,
        userAgent,
        platform,
        location,
      },
    });
  }

  async getClickCount(shortCode: string): Promise<number> {
    const shortUrl = await this.prisma.shortUrl.findUnique({
      where: { shortCode },
    });

    if (!shortUrl) {
      throw new NotFoundException('Short URL not found');
    }

    const clickCount = await this.prisma.click.count({
      where: { shortUrlId: shortUrl.id },
    });

    return clickCount;
  }

  async getClickDetails(shortCode: string): Promise<any[]> {
    const shortUrl = await this.prisma.shortUrl.findUnique({
      where: { shortCode },
    });

    if (!shortUrl) {
      throw new NotFoundException('Short URL not found');
    }

    // Fetch detailed click records
    return await this.prisma.click.findMany({
      where: { shortUrlId: shortUrl.id },
      select: {
        userAgent: true,
        platform: true,
        location: true,
        clickedAt: true,
      },
    });
  }
}
