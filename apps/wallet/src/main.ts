import { NestFactory } from '@nestjs/core';
import { WalletModule } from './wallet.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { setupSwagger } from './swagger';
import { LoggerService } from 'apps/user-service/src/common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(WalletModule);
  app.setGlobalPrefix('/api');

  setupSwagger(app);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER],
        // clientId: 'user',
      },
      consumer: {
        groupId: 'wallet-consumer',
      },
    }
  });
  await app.startAllMicroservices();
  await app.listen(3001, () => {
    LoggerService.log(`listening on port ${3001}`);
  });
}
bootstrap();
