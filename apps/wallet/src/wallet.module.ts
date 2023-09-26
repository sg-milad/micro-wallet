import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [DatabaseModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([WalletEntity]),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    ClientsModule.register([
      {
        name: 'User-Service',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'User',
            brokers: [process.env.KAFKA_BROKER],
          },
          consumer: {
            groupId: 'user-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule { }
