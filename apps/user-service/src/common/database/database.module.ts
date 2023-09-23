import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as dotenv from 'dotenv';
import { UserEntity } from '../../entities/user.entity';

dotenv.config({
    path: './.env'
});

export const options: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +process.env.DB_PORT || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database:
        process.env.NODE_ENV === 'tEsT'
            ? 'test'
            : process.env.POSTGRES_DB || 'postgres',
    entities: [UserEntity],
    migrationsRun: true,
    synchronize: true,

};
// console.log(options);

function DatabaseOrmModule(): DynamicModule {
    return TypeOrmModule.forRoot(options);
}

@Global()
@Module({
    imports: [DatabaseOrmModule()],
})
export class DatabaseModule { }
