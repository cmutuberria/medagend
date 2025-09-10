/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar middleware de cookies
  app.use(cookieParser());
  app.enableCors({
    origin: true, // Cambia esto si tu frontend corre en otro puerto
    credentials: true,
  });

  // No usar prefijo global que rompa la ruta de /graphql
  const port = process.env.PORT || 8080;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
