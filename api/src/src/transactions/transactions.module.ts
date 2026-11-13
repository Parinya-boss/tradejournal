import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../../entities/transaction.entity';
import { TradingAccount } from '../../entities/trandingAccount.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, TradingAccount])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
