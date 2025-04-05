import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';
import { seed } from 'prisma/seed';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: 'https://uploader-sandy.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useStaticAssets(resolve('./uploads'), {
    prefix: '/uploads',
  });
  // bull queue
  const expressAdapter = new ExpressAdapter();
  expressAdapter.setBasePath('/admin/queues');

  const fileQueue = app.get<Queue>(getQueueToken('file-processing'));

  createBullBoard({
    queues: [new BullAdapter(fileQueue)],
    serverAdapter: expressAdapter,
  });

  app.use('/admin/queues', expressAdapter.getRouter());
  // 🔥 BULL BOARD SETUP END
  await seed();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
