import { Module } from '@nestjs/common';
import { UserEntity } from '../../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]),
    ClientsModule.register([
        {
            name: 'Wallet-Service',
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId: 'wallet',
                    brokers: ['kafka:29092'],
                },
                consumer: {
                    groupId: 'wallet-consumer',
                },
            },
        },
    ]),
    ],
    controllers: [UserController],
    providers: [UserService,],
})
export class UserModule { }
