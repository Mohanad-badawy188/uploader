import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { BullModule } from '@nestjs/bull';
import { NotificationModule } from './notification/notification.module';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    LoggingModule,
    PrismaModule,
    BullModule.forRoot({
      redis: process.env.REDIS_URL ?? {
        host: 'localhost',
        port: 6379,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FileModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
