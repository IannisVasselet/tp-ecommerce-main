import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Product } from '../product/entities/product.entity';
import { Stock } from '../stock/entities/stock.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST', 'localhost'),
  port: configService.get('DATABASE_PORT', 5432),
  username: configService.get('DATABASE_USERNAME', 'postgres'),
  password: configService.get('DATABASE_PASSWORD', 'mysecretpassword'),
  database: configService.get('DATABASE_NAME', 'postgres'),
  entities: [Product, Stock],
  migrations: ['src/database/migrations/*.ts', 'src/database/seeds/*.ts'],
  synchronize: false,
});
