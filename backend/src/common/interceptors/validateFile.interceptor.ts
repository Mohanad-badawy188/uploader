// src/common/interceptors/file-validation.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ValidateFileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>() as Request & {
      file: Express.Multer.File;
    };
    const file = request.file;

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    const maxSize = 15 * 1024 * 1024; // 15MB

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Unsupported file type');
    }

    if (file.size > maxSize) {
      throw new BadRequestException('File too large (max 15MB)');
    }

    return next.handle();
  }
}
