import { ConfigService } from "@nestjs/config";
import { DataSourceOptions } from "typeorm";

export function databaseOptions(config: ConfigService): DataSourceOptions {
    return {
        type: 'mariadb',
        port: config.getOrThrow<number>('DB_PORT'),
        username: config.getOrThrow<string>('DB_USERNAME'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_DATABASE'),
        entities: [],
        synchronize: false,
        migrationsRun: false,
    }
}