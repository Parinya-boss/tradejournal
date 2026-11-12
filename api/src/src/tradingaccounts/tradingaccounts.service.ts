import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TradingAccount } from '../../entities/trandingAccount.entity';
import { Repository } from 'typeorm';
import { handleDatabaseError } from '../../common/database-error';
import { CreateAccountDto, UpdateAccountDto } from './dto/tradingAccount.dto';
import { AuthUser } from '../auth/auth-user.type';
import { UserRole } from '../../entities/user.entity';

@Injectable()
export class TradingaccountsService {
  constructor(
    @InjectRepository(TradingAccount)
    private readonly tradingAccountRepository: Repository<TradingAccount>,
  ) {}

  async getAllAccount() {
    const getTradingAccount = await this.tradingAccountRepository.find();
    return getTradingAccount;
  }

  async getOneAccount(id: number) {
    const getOneAccount = await this.tradingAccountRepository.findOneBy({
      id: id,
    });

    if (!getOneAccount) {
      throw new NotFoundException('ไม่พบ Account ที่ค้นหา');
    }

    return getOneAccount;
  }

  async getMeAccount(userId: number) {
    const getMeAccount = await this.tradingAccountRepository.findBy({
      userId: userId,
    });

    return getMeAccount;
  }

  async createTradingAccount(userId: number, dto: CreateAccountDto) {
    try {
      const createTradingAccount = this.tradingAccountRepository.create({
        userId: userId,
        name: dto.name,
      });
      return await this.tradingAccountRepository.save(createTradingAccount);
    } catch (error) {
      handleDatabaseError(
        error,
        'มีบัญชีนี้อยู่แล้ว',
        'ข้อมูลที่เกี่ยวข้องผิดพลาด',
      );
    }
  }

  async updateName(user: AuthUser, id: number, dto: UpdateAccountDto) {
    const getAccount = await this.getOneAccount(id);

    if (user.role !== UserRole.ADMIN && getAccount.userId !== user.id) {
      throw new NotFoundException('ไม่พบบัญชีที่คุณต้องการแก้ไข');
    }

    getAccount.name = dto.name;

    const saveAccount = await this.tradingAccountRepository.save(getAccount);

    return saveAccount;
  }

  async deleteTradingAccount(userId: number, id: number) {
    const getAccount = await this.getOneAccount(id);

    if (getAccount.userId !== userId) {
      throw new NotFoundException('ข้อมูล user ไม่ถูกต้อง');
    }

    try {
      const result = await this.tradingAccountRepository.delete({ id: id });

      if (result.affected === 0) {
        throw new NotFoundException('ไม่พบบัญชีเทรด ที่คุณต้องการลบ');
      }

      return { message: 'ลบบัญชีเรียบร้อย' };
    } catch (error: unknown) {
      handleDatabaseError(
        error,
        'ข้อมูลซ้ำ',
        'ไม่สามารถลบได้ เนื่องจากยังมีข้อมูลที่เกี่ยวข้อง',
      );
    }
  }
}
