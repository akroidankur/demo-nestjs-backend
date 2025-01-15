import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  config();
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.use((req: Request, res: Response, next: NextFunction) => {
    const allowedOrigins = [
      'http://localhost:4200', // for local
      'https://demo-angular-frontend.vercel.app',  // for stage
    ];

    const origin = req.headers.origin as string;

    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  app.enableCors({
    origin: false,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
}

bootstrap();
