import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/database/database.module';
import { UserModule } from './modules/user/user.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DatabaseModule, UserModule,
    ConfigModule.forRoot(),
    ClientsModule.register({
      clients: [{
        name: 'Wallet-Service',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'wallet',
            brokers: ['172.19.0.2:29092']
          },
          consumer: {
            groupId: 'wallet-consumer'
          }
        }

      }]
    })],
})
export class AppModule { }
