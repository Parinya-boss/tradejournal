import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TradingAccount } from './trandingAccount.entity';
import { User } from './user.entity';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  tradingAccountId!: number;

  @ManyToOne(() => TradingAccount, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({
    name: 'tradingAccountId',
    foreignKeyConstraintName: 'FK_transaction_tradingaccount',
  })
  tradingAccount!: TradingAccount;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type!: TransactionType;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
  })
  amount!: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status!: TransactionStatus;

  @Column({
    type: 'int',
    nullable: false,
  })
  requestedById!: number;

  @ManyToOne(() => User, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({
    name: 'requestedById',
    foreignKeyConstraintName: 'FK_transaction_requestuser',
  })
  requestedBy!: User;

  @Column({
    type: 'int',
    nullable: true,
  })
  reviewedById!: number | null;

  @ManyToOne(() => User, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({
    name: 'reviewedById',
    foreignKeyConstraintName: 'FK_transaction_reviewuser',
  })
  reviewedBy!: User | null;

  @CreateDateColumn({
    type: 'datetime',
    precision: 6,
  })
  createdAt!: Date;

  @Column({
    type: 'datetime',
    precision: 6,
    nullable: true,
  })
  reviewedAt!: Date | null;
}
