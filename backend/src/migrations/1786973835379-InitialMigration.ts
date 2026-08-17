import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1786973835379 implements MigrationInterface {
    name = 'InitialMigration1786973835379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "supplier" ("id" varchar PRIMARY KEY NOT NULL, "companyName" varchar NOT NULL, "vatId" varchar NOT NULL, "country" varchar NOT NULL, "contactEmail" varchar NOT NULL, "status" varchar NOT NULL DEFAULT ('DRAFT'), "createdBy" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "approvedBy" varchar, "rejectedBy" varchar, "rejectionReason" varchar, CONSTRAINT "UQ_bc3b3af8f9b4239272e9d54186e" UNIQUE ("vatId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "supplier"`);
    }

}
