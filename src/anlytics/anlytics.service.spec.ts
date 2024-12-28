import { Test, TestingModule } from '@nestjs/testing';
import { AnlyticsService } from './anlytics.service';

describe('AnlyticsService', () => {
  let service: AnlyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnlyticsService],
    }).compile();

    service = module.get<AnlyticsService>(AnlyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
