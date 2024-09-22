import { NestFactory } from '@nestjs/core';
import { ScraperModule } from './scraper/scraper.module';

async function bootstrap() {
  const app = await NestFactory.create(ScraperModule);

  await app.listen(5050);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { ScraperModule } from './scraper/scraper.module';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';

// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(ScraperModule);

//   // Configurar la carpeta donde se encuentran las vistas
//   app.setBaseViewsDir(join(__dirname, '..', './src/views'));

//   // Configurar el motor de plantillas
//   app.setViewEngine('ejs');
//   await app.listen(5050);
// }
// bootstrap();
