import { NestFactory } from '@nestjs/core';
import { WalletModule } from './wallet.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const microApp = await NestFactory.createMicroservice<MicroserviceOptions>(WalletModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
          clientId: 'wallet',
        },
        consumer: {
          groupId: 'wallet-consumer',
        },
      }
    });

  await microApp.listen();
}
bootstrap();
