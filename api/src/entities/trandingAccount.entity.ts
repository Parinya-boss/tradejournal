import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Trade } from './trade.entity';

@Entity('trading_accounts')
export class TradingAccount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'int',
  })
  userId!: number;

  @ManyToOne(() => User, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({
    name: 'userId',
    foreignKeyConstraintName: 'FK_tradingAccount_user',
  })
  user!: User;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name!: string;

  @Column({
    type: 'varchar',
    default: 'USD',
  })
  currency!: string;

  @CreateDateColumn({
    type: 'datetime',
    precision: 6,
  })
  createdAt!: Date;

  @OneToMany(() => Trade, (trade) => trade.trading_account_id)
  trade!: Trade[];
}
