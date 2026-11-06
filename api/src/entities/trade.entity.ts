import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TradingAccount } from './trandingAccount.entity';

export enum TradeSide {
  LONG = 'LONG',
  SHORT = 'SHORT',
}

@Entity('trades')
export class Trade {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'int',
  })
  tradingAccountId!: number;

  @ManyToOne(() => TradingAccount, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({
    name: 'tradingAccountId',
    foreignKeyConstraintName: 'FK_trade_tradingAccount',
  })
  trading_account_id!: TradingAccount;

  @Column({
    type: 'varchar',
    length: 255,
  })
  symbol!: string;

  @Column({
    type: 'enum',
    enum: TradeSide,
  })
  side!: TradeSide;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
  })
  quantity!: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
  })
  entryPrice!: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
  })
  exitPrice!: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
  })
  netPnl!: string;

  @Column({
    type: 'datetime',
    precision: 6,
  })
  openedAt!: Date;

  @Column({
    type: 'datetime',
    precision: 6,
  })
  closedAt!: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  note!: string | null;

  @CreateDateColumn({
    type: 'datetime',
    precision: 6,
  })
  createdAt!: Date;
}
