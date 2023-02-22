import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './services/config/config.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  await app.listen(config.PORT);
}

bootstrap();
