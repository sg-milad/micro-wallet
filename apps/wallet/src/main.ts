import { NestFactory } from '@nestjs/core';
import { WalletModule } from './wallet.module';

async function bootstrap() {
  const app = await NestFactory.create(WalletModule);
  await app.listen(3001);
}
bootstrap();
