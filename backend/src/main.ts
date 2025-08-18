import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {rawBody:true});
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // app.enableCors({ origin: 'http://localhost:5500' });
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap()

