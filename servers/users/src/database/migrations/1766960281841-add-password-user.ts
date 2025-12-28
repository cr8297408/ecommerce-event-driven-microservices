import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordUser1766960281841 implements MigrationInterface {
    name = 'AddPasswordUser1766960281841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "password"`);
    }

}
