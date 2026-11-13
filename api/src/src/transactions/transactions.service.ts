import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../../entities/transaction.entity';
import { DataSource, Repository } from 'typeorm';
import { TradingAccount } from '../../entities/trandingAccount.entity';
import { CreateTransactionDto, PaginationDto } from './dto/transactions.dto';
import Decimal from 'decimal.js';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(TradingAccount)
    private readonly tradingAccountRepository: Repository<TradingAccount>,

    private readonly dataSource: DataSource,
  ) {}

  async createTransaction(userId: number, dto: CreateTransactionDto) {
    const getTradingAccount = await this.tradingAccountRepository
      .createQueryBuilder('tradingaccount')
      .where('tradingaccount.id = :id', { id: dto.tradingAccountId })
      .andWhere('tradingaccount.userId = :userId', { userId: userId })
      .getOne();

    if (!getTradingAccount) {
      throw new NotFoundException('ไม่พบบัญชี');
    }

    const createTransaction = this.transactionRepository.create({
      tradingAccountId: getTradingAccount.id,
      type: dto.type,
      amount: dto.amount,
      requestedById: userId,
    });

    return this.transactionRepository.save(createTransaction);
  }

  async getMyTransaction(userId: number) {
    const getMyTransaction = await this.transactionRepository.findBy({
      requestedById: userId,
    });

    return getMyTransaction;
  }

  async getPendingTransaction(pagination: PaginationDto) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where: {
          status: TransactionStatus.PENDING,
        },
        order: {
          createdAt: 'ASC',
          id: 'ASC',
        },
        skip,
        take: limit,
      },
    );

    return {
      data: transactions,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async rejectTransaction(transactionId: number, adminId: number) {
    return this.dataSource.transaction(async (manager) => {
      const gettransaction = await manager.findOne(Transaction, {
        where: {
          id: transactionId,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!gettransaction) {
        throw new NotFoundException('ไม่พบรายการที่ต้องการปฏิเสธ');
      }

      if (gettransaction.status !== TransactionStatus.PENDING) {
        throw new ConflictException('รายการนี้ได้รับการพิจารณาแล้ว');
      }

      gettransaction.status = TransactionStatus.REJECTED;
      gettransaction.reviewedById = adminId;
      gettransaction.reviewedAt = new Date();

      return manager.save(Transaction, gettransaction);
    });
  }

  async approveTransaction(transactionId: number, adminId: number) {
    return this.dataSource.transaction(async (manager) => {
      const getTransaction = await manager.findOne(Transaction, {
        where: {
          id: transactionId,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!getTransaction) {
        throw new NotFoundException('ไม่พบรายการที่ต้องการอนุมัติ');
      }

      if (getTransaction.status !== TransactionStatus.PENDING) {
        throw new ConflictException('รายการนี้ได้รับการพิจารณาแล้ว');
      }

      const getTradingAccount = await manager.findOne(TradingAccount, {
        where: {
          id: getTransaction.tradingAccountId,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!getTradingAccount) {
        throw new NotFoundException('ไม่พบบัญชีเทรด');
      }

      const balance = new Decimal(getTradingAccount.balance);
      const amount = new Decimal(getTransaction.amount);
      const maxBalance = new Decimal('9999999999999999.99');

      if (!amount.isFinite() || amount.lte(0) || amount.decimalPlaces() > 2) {
        throw new ConflictException('จำนวนเงินในรายการไม่ถูกต้อง');
      }

      let newBalance = balance;

      if (getTransaction.type === TransactionType.DEPOSIT) {
        newBalance = balance.plus(amount);

        if (newBalance.gt(maxBalance)) {
          throw new ConflictException('ยอดเงินหลังฝากเกินขนาดที่กำหนด');
        }
      } else if (getTransaction.type === TransactionType.WITHDRAW) {
        if (balance.lt(amount)) {
          throw new ConflictException('ยอดเงินไม่เพียงพอ');
        }

        newBalance = balance.minus(amount);
      } else {
        throw new ConflictException('ประเภทรายการไม่ถูกต้อง');
      }

      getTradingAccount.balance = newBalance.toFixed(2);
      await manager.save(TradingAccount, getTradingAccount);

      getTransaction.status = TransactionStatus.APPROVED;
      getTransaction.reviewedById = adminId;
      getTransaction.reviewedAt = new Date();

      return manager.save(Transaction, getTransaction);
    });
  }
}
