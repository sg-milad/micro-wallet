import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
            brokers: ['localhost:9092']
          },
          consumer: {
            groupId: 'wallet-consumer'
          }
        }

      }]
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
