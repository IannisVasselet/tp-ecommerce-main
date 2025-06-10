import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrdersAndOrderItems1749564874520 implements MigrationInterface {
    name = 'CreateOrdersAndOrderItems1749564874520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create orders table
        await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying(255) NOT NULL,
                "totalPrice" numeric(10,2) NOT NULL,
                "status" character varying NOT NULL DEFAULT 'PENDING',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_orders" PRIMARY KEY ("id")
            )
        `);

        // Create order_items table
        await queryRunner.query(`
            CREATE TABLE "order_items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "orderId" uuid NOT NULL,
                "productId" character varying(255) NOT NULL,
                "quantity" integer NOT NULL,
                "price" numeric(10,2) NOT NULL,
                CONSTRAINT "PK_order_items" PRIMARY KEY ("id"),
                CONSTRAINT "FK_order_items_orderId" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE
            )
        `);

        // Create index for better performance
        await queryRunner.query(`CREATE INDEX "IDX_order_items_orderId" ON "order_items" ("orderId")`);
        await queryRunner.query(`CREATE INDEX "IDX_orders_userId" ON "orders" ("userId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_orders_userId"`);
        await queryRunner.query(`DROP INDEX "IDX_order_items_orderId"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "orders"`);
    }
}
