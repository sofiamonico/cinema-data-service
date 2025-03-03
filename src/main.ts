import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('Cinema API')
    .setDescription('API for the cinema app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
