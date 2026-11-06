import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { validateEnvironment } from '../config/environment';
import { databaseOptions } from './database.option';

const config = new ConfigService(validateEnvironment(process.env));

export default new DataSource({
  ...databaseOptions(config),
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
