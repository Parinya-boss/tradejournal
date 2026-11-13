import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTransactions1794534564912 implements MigrationInterface {
  name = 'AddTransactions1794534564912';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`transactions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tradingAccountId\` int NOT NULL, \`type\` enum ('DEPOSIT', 'WITHDRAW') NOT NULL, \`amount\` decimal(18,2) NOT NULL, \`status\` enum ('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING', \`requestedById\` int NOT NULL, \`reviewedById\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`reviewedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`trading_accounts\` ADD \`balance\` decimal(18,2) NOT NULL DEFAULT '0.00'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_transaction_tradingaccount\` FOREIGN KEY (\`tradingAccountId\`) REFERENCES \`trading_accounts\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_transaction_requestuser\` FOREIGN KEY (\`requestedById\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_transaction_reviewuser\` FOREIGN KEY (\`reviewedById\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE transactions ADD CONSTRAINT chk_transaction_amount CHECK (amount > 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE trading_accounts ADD CONSTRAINT chk_trading_account_balance CHECK (balance >= 0.00)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_transaction_reviewuser\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_transaction_requestuser\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_transaction_tradingaccount\``,
    );
    await queryRunner.query(
      `ALTER TABLE trading_accounts DROP CONSTRAINT chk_trading_account_balance`,
    );
    await queryRunner.query(
      `ALTER TABLE transactions DROP CONSTRAINT chk_transaction_amount`,
    );
    await queryRunner.query(
      `ALTER TABLE \`trading_accounts\` DROP COLUMN \`balance\``,
    );
    await queryRunner.query(`DROP TABLE \`transactions\``);
  }
}
