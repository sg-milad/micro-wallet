import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/database/database.module';
import { UserModule } from './modules/user/user.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [DatabaseModule, UserModule,
    ClientsModule.register({
      clients: [{
        name: 'Wallet-Service',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'wallet',
            brokers: [process.env.KAFKA_BROKERS]
          },
          consumer: {
            groupId: 'wallet-consumer'
          }
        }

      }]
    })],
})
export class AppModule { }
