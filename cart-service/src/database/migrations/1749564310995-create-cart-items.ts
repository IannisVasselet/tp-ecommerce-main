import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCartItems1749564310995 implements MigrationInterface {
    name = 'CreateCartItems1749564310995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "cart_items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying(255) NOT NULL,
                "productId" character varying(255) NOT NULL,
                "quantity" integer NOT NULL DEFAULT '1',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_cart_items_userId_productId" UNIQUE ("userId", "productId"),
                CONSTRAINT "PK_cart_items" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "cart_items"`);
    }
}
