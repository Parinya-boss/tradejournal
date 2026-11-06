import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TradingAccount } from './trandingAccount.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  display_name!: string;

  @Column({
    type: 'varchar',
    length: 255,
    select: false,
  })
  password_hash!: string;

  @CreateDateColumn({
    type: 'datetime',
    precision: 6,
  })
  createdAt!: Date;

  @OneToMany(() => TradingAccount, (account) => account.user)
  tradingAccounts!: TradingAccount[];
}
