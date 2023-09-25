import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/database/database.module';
import { UserModule } from './modules/user/user.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DatabaseModule, UserModule,
    ConfigModule.forRoot(),
    // ClientsModule.register({
    //   clients: [{
    //     name: 'User-Service',
    //     transport: Transport.KAFKA,
    //     options: {
    //       client: {
    //         clientId: 'user',
    //         brokers: ['kafka:29092'],
    //       },
    //       consumer: {
    //         groupId: 'user-consumer'
    //       }
    //     }
    //   }]
    // })
  ],
})
export class AppModule { }
