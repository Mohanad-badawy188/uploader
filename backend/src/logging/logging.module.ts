import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserActivityService } from './userActivity.service';
import { UserActivityController } from './logging.controller';

@Module({
  imports: [PrismaModule],
  providers: [UserActivityService],
  controllers: [UserActivityController],
  exports: [UserActivityService],
})
export class LoggingModule {}
