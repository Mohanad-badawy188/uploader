import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { BullModule } from '@nestjs/bull';
import { FileProcessor } from './file.processor';
import { FileGateway } from './file.gateway';
import { LoggingModule } from 'src/logging/logging.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'file-processing',
    }),
    LoggingModule,
  ],
  controllers: [FileController],
  providers: [FileService, FileProcessor, FileGateway],
})
export class FileModule {}
