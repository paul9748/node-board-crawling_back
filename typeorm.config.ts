import 'dotenv/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_URL,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWD,
  database: process.env.MYSQL_DATABASENAME,
  entities: [join(__dirname, '..', 'dist/src/entities/*.{ts,js}')],
  migrations: [join(__dirname, '..', 'dist/src/entities/*.{ts,js}')],
  synchronize: true,
  timezone: 'Z',

};

export default typeOrmConfig;
