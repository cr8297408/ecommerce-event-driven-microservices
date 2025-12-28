import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAndAddress1766953970627 implements MigrationInterface {
    name = 'AddUserAndAddress1766953970627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "address_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "address_name" character varying NOT NULL, "google_address_id" character varying NOT NULL, "formated_address" character varying NOT NULL, "is_default" character varying NOT NULL, "active" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_9caf3f954ed5bc66e3fa35eb7e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email_address" character varying NOT NULL, "phone_number" character varying NOT NULL, "profile_image_key" character varying NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_73a8881d772ebc92bc3fed3c45a" UNIQUE ("email_address"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "address_entity" ADD CONSTRAINT "FK_9ab5f1a587a098fe9084ee4766e" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address_entity" DROP CONSTRAINT "FK_9ab5f1a587a098fe9084ee4766e"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "address_entity"`);
    }

}
