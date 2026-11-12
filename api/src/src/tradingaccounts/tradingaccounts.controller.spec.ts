import { Test, TestingModule } from '@nestjs/testing';
import { TradingaccountsController } from './tradingaccounts.controller';
import { TradingaccountsService } from './tradingaccounts.service';

describe('TradingaccountsController', () => {
  let controller: TradingaccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradingaccountsController],
      providers: [TradingaccountsService],
    }).compile();

    controller = module.get<TradingaccountsController>(TradingaccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
