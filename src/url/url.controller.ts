import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Redirect,
  NotFoundException,
} from '@nestjs/common';
import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
  constructor(private readonly shortUrlService: UrlService) {}

  @Post()
  async createShortUrl(
    @Body('originalUrl') originalUrl: string,
    @Body('userId') userId: string,
  ) {
    if (!originalUrl) {
      throw new Error('Original URL is required');
    }

    const shortUrl = await this.shortUrlService.createShortUrl(
      originalUrl,
      userId,
    );

    return {
      originalUrl: shortUrl.originalUrl,
      shortCode: shortUrl.shortCode,
    };
  }

  @Get()
  async getAllUrl() {
    const url = await this.shortUrlService.getAllUrl();

    return url;
  }

  @Get(':shortCode')
  @Redirect()
  async getOriginalUrl(@Param('shortCode') shortCode: string) {
    try {
      const originalUrl = await this.shortUrlService.getOriginalUrl(shortCode);

      return { url: originalUrl };
    } catch (error) {
      throw new NotFoundException('Short URL not found');
    }
  }
}
