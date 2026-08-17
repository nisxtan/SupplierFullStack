import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Supplier } from '../entities/Supplier';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: false,
  logging: false,
  entities: [Supplier],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
