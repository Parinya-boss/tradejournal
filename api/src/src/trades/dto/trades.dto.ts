import {
  Equals,
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { TradeSide } from '../../../entities/trade.entity';
import { OmitType, PartialType } from '@nestjs/mapped-types';

const positiveDecimalPattern =
  /^(?=[0-9.]*[1-9])(?:0|[1-9]\d{0,15})(?:\.\d{1,2})?$/;

const utcDateTimePattern =
  /^[1-9]\d{3}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

export class CreateTradeDto {
  @IsInt()
  @Min(1)
  @Max(2147483647)
  tradingAccountId!: number;

  @IsString()
  @Equals('XAUUSD', { message: 'symbol ต้องเป็น XAUUSD' })
  symbol!: string;

  @IsEnum(TradeSide)
  side!: TradeSide;

  @IsString()
  @Matches(positiveDecimalPattern, {
    message: 'quantity ต้องมากกว่า 0 และมีทศนิยมไม่เกิน 2 ตำแหน่ง',
  })
  quantity!: string;

  @IsString()
  @Matches(positiveDecimalPattern, {
    message: 'entryPrice ต้องมากกว่า 0 และมีทศนิยมไม่เกิน 2 ตำแหน่ง',
  })
  entryPrice!: string;

  @IsString()
  @Matches(positiveDecimalPattern, {
    message: 'exitPrice ต้องมากกว่า 0 และมีทศนิยมไม่เกิน 2 ตำแหน่ง',
  })
  exitPrice!: string;

  @IsString()
  @IsISO8601(
    { strict: true, strictSeparator: true },
    { message: 'openedAt ต้องเป็นวันที่และเวลาที่ถูกต้อง' },
  )
  @Matches(utcDateTimePattern, {
    message: 'openedAt ต้องเป็นเวลา UTC และลงท้ายด้วย Z',
  })
  openedAt!: string;

  @IsString()
  @IsISO8601(
    { strict: true, strictSeparator: true },
    { message: 'closedAt ต้องเป็นวันที่และเวลาที่ถูกต้อง' },
  )
  @Matches(utcDateTimePattern, {
    message: 'closedAt ต้องเป็นเวลา UTC และลงท้ายด้วย Z',
  })
  closedAt!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string | null;
}

export class UpdateTradeDto extends PartialType(
  OmitType(CreateTradeDto, ['tradingAccountId'] as const),
  { skipNullProperties: false },
) {}
