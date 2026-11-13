import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { TransactionType } from '../../../entities/transaction.entity';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsInt()
  @Min(1)
  @Max(2147483647)
  tradingAccountId!: number;

  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsString()
  @Matches(/^(?=[0-9.]*[1-9])(?:0|[1-9]\d{0,15})(?:\.\d{1,2})?$/, {
    message: 'amount ต้องมากกว่า 0 และมีทศนิยมไม่เกิน 2 ตำแหน่ง',
  })
  amount!: string;
}

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10000)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
