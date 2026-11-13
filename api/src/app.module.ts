import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateEnvironment } from './config/environment';
import { config } from 'process';
import { databaseOptions } from './database/database.option';
import { UsersModule } from './src/users/users.module';
import { AuthModule } from './src/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { Guard } from './src/auth/jwt-auth.guard';
import { TradingaccountsModule } from './src/tradingaccounts/tradingaccounts.module';
import { TransactionsModule } from './src/transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return databaseOptions(config);
      },
    }),
    UsersModule,
    AuthModule,
    TradingaccountsModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: Guard,
    },
  ],
})
export class AppModule {}
