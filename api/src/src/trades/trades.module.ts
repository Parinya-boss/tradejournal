import { Module } from '@nestjs/common';
import { TradesService } from './trades.service';
import { TradesController } from './trades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from '../../entities/trade.entity';
import { TradingAccount } from '../../entities/trandingAccount.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trade, TradingAccount])],
  controllers: [TradesController],
  providers: [TradesService],
})
export class TradesModule {}
