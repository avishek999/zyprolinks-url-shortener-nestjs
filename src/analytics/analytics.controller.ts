import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  test() {
    return 'working...';
  }

  @Post('record-click')
  async recordClick(
    @Body()
    body: {
      shortCode: string;
      userAgent: string;
      platform: string;
      location?: string;
    },
  ): Promise<void> {
    const { shortCode, userAgent, platform, location } = body;
    try {
      await this.analyticsService.recordClick(
        shortCode,
        userAgent,
        platform,
        location,
      );
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':shortCode/count')
  async getClickCount(@Param('shortCode') shortCode: string): Promise<number> {
    return await this.analyticsService.getClickCount(shortCode);
  }

  @Get(':shortCode/details')
  async getClickDetails(@Param('shortCode') shortCode: string): Promise<any[]> {
    return await this.analyticsService.getClickDetails(shortCode);
  }
}
