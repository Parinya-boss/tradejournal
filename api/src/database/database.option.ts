import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import { TradingAccount } from '../entities/trandingAccount.entity';
import { Trade } from '../entities/trade.entity';

export function databaseOptions(config: ConfigService): DataSourceOptions {
  return {
    type: 'mariadb',
    port: config.getOrThrow<number>('DB_PORT'),
    username: config.getOrThrow<string>('DB_USERNAME'),
    password: config.getOrThrow<string>('DB_PASSWORD'),
    database: config.getOrThrow<string>('DB_DATABASE'),
    entities: [User, TradingAccount, Trade],
    synchronize: false,
    migrationsRun: false,
  };
}
