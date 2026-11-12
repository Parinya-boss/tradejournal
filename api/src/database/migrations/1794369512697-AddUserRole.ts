import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRole1794369512697 implements MigrationInterface {
    name = 'AddUserRole1794369512697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`role\` enum ('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`role\``);
    }

}
