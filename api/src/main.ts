import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerUtil } from './util';
import * as session from 'express-session';
import * as express from 'express';

async function bootstrap() {
  const swaggerUtil = new SwaggerUtil();
  const app = await NestFactory.create(AppModule);
  const paths = process.cwd() + "/src/views/";
  //Middleware
  app.enableCors();
  app.use('/views', express.static(paths));
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.setGlobalPrefix('api');
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,
  //   }),
  // );

  //swagger documentation setup
  swaggerUtil.setup(app);
  await app
    .listen(process.env.PORT)
    .then(() => console.log(`server running on port ${process.env.PORT}`));
}
bootstrap();
