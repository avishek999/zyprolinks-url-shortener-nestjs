import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserModule } from './user/user.module';
import { UrlModule } from './url/url.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PrismaModule } from './prisma/prisma.module';
import { AnlyticsService } from './anlytics/anlytics.service';

@Module({
  imports: [UserModule, UrlModule, AnalyticsModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, AnlyticsService],
})
export class AppModule {}
