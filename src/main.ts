import { NestFactory } from '@nestjs/core';
// import { ScraperModule } from './scraper/scraper.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  const descriptionDoc = `Here some about the documentation.`;
  const config = new DocumentBuilder()
    // .addBearerAuth()
    .setTitle('Documentation')
    .setDescription(descriptionDoc)
    .setVersion('1.0')
    .addTag('product')
    .build();
  // .addTag('auth')
  // .addTag('user')

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(5050);
}
bootstrap();
