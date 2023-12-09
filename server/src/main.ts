import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  try {
    await app.listen(process.env.PORT, () => {
      console.log(`App is running on http://localhost:${process.env.PORT}/`);
    });
  } catch (errors) {
    console.log(errors);
  }
}
bootstrap();
