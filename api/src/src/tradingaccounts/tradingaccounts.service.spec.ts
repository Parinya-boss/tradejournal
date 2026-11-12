import { Test, TestingModule } from '@nestjs/testing';
import { TradingaccountsService } from './tradingaccounts.service';

describe('TradingaccountsService', () => {
  let service: TradingaccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradingaccountsService],
    }).compile();

    service = module.get<TradingaccountsService>(TradingaccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
