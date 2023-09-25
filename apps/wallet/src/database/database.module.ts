import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as dotenv from 'dotenv';
import { WalletEntity } from '../entities/wallet.entity';

dotenv.config({
    path: './.env'
});

export const options: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_WALLET_HOST || 'localhost',
    port: +process.env.DB_WALLET_PORT || 5433,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database:
        process.env.NODE_ENV === 'tEsT'
            ? 'test'
            : process.env.POSTGRES_DB_WALLET || 'postgres',
    entities: [WalletEntity],
    migrationsRun: true,
    synchronize: true,

};

function DatabaseOrmModule(): DynamicModule {
    return TypeOrmModule.forRoot(options);
}

@Global()
@Module({
    imports: [DatabaseOrmModule()],
})
export class DatabaseModule { }
