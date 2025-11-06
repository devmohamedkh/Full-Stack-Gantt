import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Activity } from './src/activities/entities/activity.entity';

config();

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number.parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'gantt_db',
  entities: [Activity],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
