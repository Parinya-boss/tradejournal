import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trade, TradeSide } from '../../entities/trade.entity';
import { DataSource, Repository } from 'typeorm';
import { TradingAccount } from '../../entities/trandingAccount.entity';
import { CreateTradeDto, UpdateTradeDto } from './dto/trades.dto';
import Decimal from 'decimal.js';

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trade)
    private readonly tradeRepository: Repository<Trade>,

    @InjectRepository(TradingAccount)
    private readonly tradingAcoountRepository: Repository<TradingAccount>,

    private readonly dataSource: DataSource,
  ) {}

  calculateNetPnl(dto: CreateTradeDto) {
    const TradeDecimal = Decimal.clone({ precision: 40 });

    const entryPrice = new TradeDecimal(dto.entryPrice);
    const exitPrice = new TradeDecimal(dto.exitPrice);
    const quantity = new TradeDecimal(dto.quantity);

    let priceDifference: Decimal;

    if (dto.side === TradeSide.LONG) {
      priceDifference = exitPrice.minus(entryPrice);
    } else if (dto.side === TradeSide.SHORT) {
      priceDifference = entryPrice.minus(exitPrice);
    } else {
      throw new BadRequestException('ประเภทการเทรดไม่ถูกต้อง');
    }

    const netPnl = priceDifference.mul(quantity).mul(100);
    const maxNetPnl = new TradeDecimal('9999999999999999.99');

    if (netPnl.abs().gt(maxNetPnl)) {
      throw new BadRequestException('กำไรหรือขาดทุนเกินขนาดที่ระบบรองรับ');
    }

    return netPnl.toFixed(2);
  }

  validateTradeTimes(dto: CreateTradeDto) {
    const openedAt = new Date(dto.openedAt);
    const closedAt = new Date(dto.closedAt);

    const dateNow = new Date();

    if (
      Number.isNaN(openedAt.getTime()) ||
      Number.isNaN(closedAt.getTime()) ||
      openedAt.getTime() > closedAt.getTime() ||
      closedAt.getTime() > dateNow.getTime()
    ) {
      throw new BadRequestException('เวลาในการเปิด/ปิด ผิดพลาด');
    }

    return {
      openedAt: openedAt,
      closedAt: closedAt,
    };
  }

  async createTrade(userId: number, dto: CreateTradeDto) {
    const validateTime = this.validateTradeTimes(dto);
    const calculateNet = this.calculateNetPnl(dto);

    return this.dataSource.transaction(async (manager) => {
      const getTradingAccount = await manager.findOne(TradingAccount, {
        where: { id: dto.tradingAccountId, userId: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!getTradingAccount) {
        throw new NotFoundException('ไม่พบบัญชีเทรด');
      }

      const balance = Decimal(getTradingAccount.balance);
      const newBalance = balance.plus(calculateNet);
      const maxBalance = new Decimal('9999999999999999.99');

      if (newBalance.lt(0)) {
        throw new BadRequestException('ยอดเงินไม่เพียงพอสำหรับผลขาดทุน');
      }
      if (newBalance.gt(maxBalance)) {
        throw new BadRequestException('จำนวนเงินเกินที่ระบบรองรับ');
      }

      const createTrade = manager.create(Trade, {
        tradingAccountId: dto.tradingAccountId,
        symbol: dto.symbol,
        side: dto.side,
        quantity: dto.quantity,
        entryPrice: dto.entryPrice,
        exitPrice: dto.exitPrice,
        netPnl: calculateNet,
        openedAt: validateTime.openedAt,
        closedAt: validateTime.closedAt,
        note: dto.note ?? null,
      });

      getTradingAccount.balance = newBalance.toFixed(2);

      const savedTrade = await manager.save(Trade, createTrade);
      await manager.save(TradingAccount, getTradingAccount);

      return savedTrade;
    });
  }

  async getMyTrades(userId: number, tradingAccountId: number) {
    const getTradingAccount = await this.tradingAcoountRepository
      .createQueryBuilder('tradingAccount')
      .where('tradingAccount.id = :id', { id: tradingAccountId })
      .andWhere('tradingAccount.userId = :userId', { userId: userId })
      .getOne();

    if (!getTradingAccount) {
      throw new NotFoundException('ไม่พบบัญชีที่ค้นหา');
    }

    const getMyTrade = await this.tradeRepository.find({
      where: { tradingAccountId: getTradingAccount.id },
      order: { closedAt: 'DESC', id: 'DESC' },
    });

    return getMyTrade;
  }

  async deleteTrade(userId: number, tradeId: number) {
    return this.dataSource.transaction(async (manager) => {
      const getTrade = await manager.findOne(Trade, {
        where: { id: tradeId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!getTrade) {
        throw new NotFoundException('ไม่พบรายการเทรดที่เลือก');
      }

      const getTradingAccount = await manager.findOne(TradingAccount, {
        where: { id: getTrade.tradingAccountId, userId: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!getTradingAccount) {
        throw new NotFoundException('ไม่พบรายการเทรดที่เลือก');
      }

      const balance = Decimal(getTradingAccount.balance);
      const netPnl = Decimal(getTrade.netPnl);
      const newBalance = balance.minus(netPnl);
      const maxBalance = new Decimal('9999999999999999.99');

      if (newBalance.gt(maxBalance) || newBalance.lt(0)) {
        throw new BadRequestException(
          'ยอดเงินต้องไม่ติดลบ และไม่เกิน 9999999999999999.99',
        );
      }

      getTradingAccount.balance = newBalance.toFixed(2);
      await manager.save(TradingAccount, getTradingAccount);

      await manager.delete(Trade, tradeId);

      return 'ลบสำเร็จ';
    });
  }

  mergeTradeUpdate(getTrade: Trade, dto: UpdateTradeDto): CreateTradeDto {
    return {
      tradingAccountId: getTrade.tradingAccountId,
      symbol: dto.symbol ?? getTrade.symbol,
      side: dto.side ?? getTrade.side,
      quantity: dto.quantity ?? getTrade.quantity,
      entryPrice: dto.entryPrice ?? getTrade.entryPrice,
      exitPrice: dto.exitPrice ?? getTrade.exitPrice,
      openedAt: dto.openedAt ?? getTrade.openedAt.toISOString(),
      closedAt: dto.closedAt ?? getTrade.closedAt.toISOString(),
      note: dto.note === undefined ? getTrade.note : dto.note,
    };
  }

  async updateTrade(userId: number, tradeId: number, dto: UpdateTradeDto) {
    return this.dataSource.transaction(async (manager) => {
      const getTrade = await manager.findOne(Trade, {
        where: { id: tradeId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!getTrade) {
        throw new NotFoundException('ไม่พบรายการเทรดที่เลือก');
      }

      const getTradingAccount = await manager.findOne(TradingAccount, {
        where: {
          id: getTrade.tradingAccountId,
          userId: userId,
        },
        lock: { mode: 'pessimistic_write' },
      });

      if (!getTradingAccount) {
        throw new NotFoundException('ไม่พบรายการเทรดที่เลือก');
      }

      const mergedTrade = this.mergeTradeUpdate(getTrade, dto);
      const validateTime = this.validateTradeTimes(mergedTrade);
      const calculateNet = this.calculateNetPnl(mergedTrade);

      const balance = new Decimal(getTradingAccount.balance);
      const oldNetPnl = new Decimal(getTrade.netPnl);
      const newBalance = balance.minus(oldNetPnl).plus(calculateNet);
      const maxBalance = new Decimal('9999999999999999.99');

      if (newBalance.lt(0) || newBalance.gt(maxBalance)) {
        throw new BadRequestException(
          'ยอดเงินต้องไม่ติดลบ และไม่เกิน 9999999999999999.99',
        );
      }

      getTrade.symbol = mergedTrade.symbol;
      getTrade.side = mergedTrade.side;
      getTrade.quantity = mergedTrade.quantity;
      getTrade.entryPrice = mergedTrade.entryPrice;
      getTrade.exitPrice = mergedTrade.exitPrice;
      getTrade.openedAt = validateTime.openedAt;
      getTrade.closedAt = validateTime.closedAt;
      getTrade.note = mergedTrade.note ?? null;
      getTrade.netPnl = calculateNet;

      getTradingAccount.balance = newBalance.toFixed(2);

      await manager.save(TradingAccount, getTradingAccount);
      const savedTrade = await manager.save(Trade, getTrade);

      return savedTrade;
    });
  }
}
