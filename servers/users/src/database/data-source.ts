import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_DB_PORT || '5432', 10),
  username: process.env.POSTGRES_DB_USERNAME || 'postgres',
  password: process.env.POSTGRES_DB_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB_NAME || 'users',
  entities: ['src/entities/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
