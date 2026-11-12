import { Module } from '@nestjs/common';
import { TradingaccountsService } from './tradingaccounts.service';
import { TradingaccountsController } from './tradingaccounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradingAccount } from '../../entities/trandingAccount.entity';
import { CustomerGuard } from '../auth/customer.guard';

@Module({
  imports: [TypeOrmModule.forFeature([TradingAccount])],
  controllers: [TradingaccountsController],
  providers: [TradingaccountsService, CustomerGuard],
})
export class TradingaccountsModule {}
