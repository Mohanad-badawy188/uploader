import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as fs from 'fs/promises';
import { format } from 'date-fns';
import { UserActivityService } from 'src/logging/userActivity.service';

type FileQueryOptions = {
  user: User;
  page: number;
  limit: number;
  search?: string;
  type?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  adminViewOwn?: boolean;
};

const execAsync = promisify(exec);

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly userActivityService: UserActivityService,
    @InjectQueue('file-processing') private readonly fileQueue: Queue,
  ) {}

  async handleFileUpload(file: Express.Multer.File, user: User) {
    const uploadsDir = path.dirname(file.path);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.path, ext);
    const thumbFilename = `${baseName}_thumb.jpg`;
    const thumbFullPath = path.join(uploadsDir, thumbFilename);
    let thumbnailPath: string | null = null;

    try {
      if (file.mimetype.startsWith('image/')) {
        await sharp(file.path)
          .resize(200)
          .jpeg({ quality: 80 })
          .toFile(thumbFullPath);
        thumbnailPath = thumbFullPath;
      } else if (file.mimetype === 'application/pdf') {
        await execAsync(
          `pdftoppm -jpeg -f 1 -singlefile "${file.path}" "${path.join(uploadsDir, baseName)}_thumb"`,
        );
        thumbnailPath = `${uploadsDir}/${baseName}_thumb.jpg`;
      } else if (
        file.mimetype === 'text/csv' ||
        file.mimetype ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        thumbnailPath = 'uploads/static/images/spreadsheet.png';
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(
        `Thumbnail generation failed for file ${file.originalname}: ${errorMessage}`,
      );
    }

    try {
      const createdFile = await this.prisma.file.create({
        data: {
          originalName: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size,
          status: 'pending',
          userId: user.id,
          thumbnail: thumbnailPath,
        },
      });

      await this.fileQueue.add(
        'process-file',
        {
          fileId: createdFile.id,
          path: file.path,
          mimetype: file.mimetype,
        },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      );

      await this.userActivityService.log(
        user.id,
        'UPLOAD_FILE',
        `Uploaded ${file.originalname}`,
      );

      return createdFile;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(
        `Failed to process file upload for ${file.originalname}: ${errorMessage}`,
      );
      throw err;
    }
  }
  async getUserFiles({
    user,
    page,
    limit,
    search,
    type,
    sortBy,
    sortOrder,
    adminViewOwn = false,
  }: FileQueryOptions) {
    const where: Prisma.FileWhereInput =
      user.role === 'ADMIN' && !adminViewOwn ? {} : { userId: user.id };

    if (search) {
      where.originalName = { contains: search, mode: 'insensitive' };
    }

    if (type) {
      where.mimetype = this.mapFileTypeToMimeTypes(type);
    }

    const [files, total] = await this.prisma.$transaction([
      this.prisma.file.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.file.count({ where }),
    ]);

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    const filesWithFullThumbnailUrl = files.map((file) => ({
      ...file,
      thumbnail: file.thumbnail ? `${baseUrl}/${file.thumbnail}` : null,
      path: file.path ? `${baseUrl}/${file.path}` : null,
    }));

    return {
      data: filesWithFullThumbnailUrl,
      total,
      page,
      pageSize: limit,
    };
  }

  async getFileById(fileId: string, userId: number, role: string) {
    // Query for file, considering admin role
    const file = await this.prisma.file.findFirst({
      where: role === 'ADMIN' ? { id: fileId } : { id: fileId, userId },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    const filesWithFullThumbnailUrl = {
      ...file,
      thumbnail: file.thumbnail ? `${baseUrl}/${file.thumbnail}` : null,
      path: file.path ? `${baseUrl}/${file.path}` : null,
    };

    return filesWithFullThumbnailUrl;
  }

  async deleteFile(fileId: string, userId: number, role: string) {
    const file = await this.prisma.file.findFirst({
      where: role === 'ADMIN' ? { id: fileId } : { id: fileId, userId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    try {
      await fs.unlink(file.path); // original file
      if (file.thumbnail && !file.thumbnail.includes('static')) {
        await fs.unlink(file.thumbnail);
      }
    } catch (err) {
      console.error('⚠️ Error deleting file(s) from disk:', err);
    }

    await this.prisma.file.delete({
      where: { id: file.id },
    });

    await this.userActivityService.log(
      userId,
      'DELETE_FILE',
      `Deleted ${file.originalName}`,
    );

    return { message: 'File deleted successfully' };
  }
  async getUserFileStats(user: User, type?: string, adminViewOwn = false) {
    const whereBase =
      user.role === 'ADMIN' && !adminViewOwn ? {} : { userId: user.id };
    const where = type
      ? {
          ...whereBase,
          mimetype: this.mapFileTypeToMimeTypes(type),
        }
      : whereBase;

    const [total, complete, error, processing] = await Promise.allSettled([
      this.prisma.file.count({ where }),
      this.prisma.file.count({ where: { ...where, status: 'complete' } }),
      this.prisma.file.count({ where: { ...where, status: 'error' } }),
      this.prisma.file.count({ where: { ...where, status: 'pending' } }),
    ]);

    return {
      totalFiles: total,
      completeCount: complete,
      errorCount: error,
      processingCount: processing,
    };
  }
  async getUploadTrends(user: User, adminViewOwn = false) {
    const whereBase =
      user.role === 'ADMIN' && !adminViewOwn ? {} : { userId: user.id };

    const allFiles = await this.prisma.file.findMany({
      where: { ...whereBase },
      select: { createdAt: true },
    });

    const trendsMap = new Map<string, number>();

    for (const file of allFiles) {
      const date = format(file.createdAt, 'yyyy-MM-dd'); // 👈 only the day
      trendsMap.set(date, (trendsMap.get(date) || 0) + 1);
    }

    return Array.from(trendsMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // maps abstract file types to real mimetypes
  private mapFileTypeToMimeTypes(type: string) {
    switch (type) {
      case 'image':
        return { startsWith: 'image/' };
      case 'pdf':
        return 'application/pdf';
      case 'spreadsheet':
        return {
          in: [
            'text/csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ],
        };
      default:
        return type;
    }
  }
}
