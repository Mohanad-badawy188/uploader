import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  Get,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/at.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Express } from 'express';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { FileService } from './file.service';
import { RequestWithUser } from 'src/common/types/RequestWithUser';

const multerStorage: MulterOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (
      _req: Express.Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ): void => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
};

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerStorage))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    return this.fileService.handleFileUpload(file, req.user);
  }

  @Get()
  async getAll(
    @Req() req: RequestWithUser,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    return this.fileService.getUserFiles({
      user: req.user,
      page: +page,
      limit: +limit,
      search,
      type,
      sortBy,
      sortOrder,
    });
  }

  @Get('userFileStats')
  async getFileStats(
    @Req() req: RequestWithUser,
    @Query('type') type?: string,
  ) {
    const user = req.user;
    return this.fileService.getUserFileStats(user, type);
  }

  @Get('upload-trends')
  async getUploadTrends(@Req() req: RequestWithUser) {
    return this.fileService.getUploadTrends(req.user);
  }

  @Get(':id')
  async getOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.fileService.getFileById(id, req.user.id);
  }

  @Delete(':id')
  async DeleteFile(@Req() req: RequestWithUser, @Param('id') id: string) {
    const user = req.user;
    return this.fileService.deleteFile(id, user.id);
  }
}
