import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { LoggerService } from './common/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  // swagger
  setupSwagger(app);
  const PORT = process.env.PORT || 3000;
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT, async () => {
    LoggerService.log(`listening on port ${await app.getUrl()}`);
  });
}
bootstrap();
