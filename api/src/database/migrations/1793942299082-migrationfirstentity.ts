import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrationfirstentity1793942299082 implements MigrationInterface {
  name = 'Migrationfirstentity1793942299082';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`trades\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tradingAccountId\` int NOT NULL, \`symbol\` varchar(255) NOT NULL, \`side\` enum ('LONG', 'SHORT') NOT NULL, \`quantity\` decimal(18,2) NOT NULL, \`entryPrice\` decimal(18,2) NOT NULL, \`exitPrice\` decimal(18,2) NOT NULL, \`netPnl\` decimal(18,2) NOT NULL, \`openedAt\` datetime(6) NOT NULL, \`closedAt\` datetime(6) NOT NULL, \`note\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`trading_accounts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`currency\` varchar(255) NOT NULL DEFAULT 'USD', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`display_name\` varchar(255) NOT NULL, \`password_hash\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`trades\` ADD CONSTRAINT \`FK_trade_tradingAccount\` FOREIGN KEY (\`tradingAccountId\`) REFERENCES \`trading_accounts\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`trading_accounts\` ADD CONSTRAINT \`FK_tradingAccount_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE trades ADD CONSTRAINT chk_trades_closed_at CHECK (closedAt >= openedAt), ADD CONSTRAINT chk_trades_quantity CHECK (quantity > 0)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`trading_accounts\` DROP FOREIGN KEY \`FK_tradingAccount_user\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`trades\` DROP FOREIGN KEY \`FK_trade_tradingAccount\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`trading_accounts\``);
    await queryRunner.query(`DROP TABLE \`trades\``);
  }
}
