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

@Controller('url') // Define the base route for the short URL API
export class UrlController {
  constructor(private readonly shortUrlService: UrlService) {}

  // Endpoint to create a short URL
  @Post()
  async createShortUrl(
    @Body('originalUrl') originalUrl: string, // Extract original URL from request body
    @Body('userId') userId: string, // Extract userId from request body
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

  // Endpoint to get the original URL based on the short code
  @Get(':shortCode')
  @Redirect() // This decorator is used to handle the redirect
  async getOriginalUrl(@Param('shortCode') shortCode: string) {
    try {
      const originalUrl = await this.shortUrlService.getOriginalUrl(shortCode);
      return { url: originalUrl }; // Return the original URL for redirection
    } catch (error) {
      throw new NotFoundException('Short URL not found');
    }
  }
}
