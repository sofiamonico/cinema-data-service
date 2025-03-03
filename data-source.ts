import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/modules/user/user.entity';
import { Role } from './src/modules/role/role.entity';
import { Film } from './src/modules/film/film.entity';

dotenv.config(); // Cargar variables de entorno

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Role, Film],
  migrations: ['src/migrations/*.ts'],
  synchronize: process.env.NODE_ENV === 'development',
  migrationsRun: process.env.NODE_ENV === 'production',
});

export default AppDataSource;
