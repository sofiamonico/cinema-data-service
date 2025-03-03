import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  // Config of global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Delete properties not decorated in the DTOs
      forbidNonWhitelisted: true, // Throw error if properties not allowed are sent
      transform: true, // Transform the received data to the specified type
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
