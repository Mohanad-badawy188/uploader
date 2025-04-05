import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as pdfParse from 'pdf-parse';
import * as Tesseract from 'tesseract.js';
import * as xlsx from 'xlsx';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileGateway } from './file.gateway';
import { File } from '@prisma/client';
import * as langdetect from 'langdetect';

type ProcessFileJobData = {
  fileId: string;
  path: string;
  mimetype: string;
};

type PdfParseResult = {
  text: string;
};

type LanguageDetectionResult = {
  lang: string;
  prob: number;
};

interface LangDetect {
  detect: (text: string) => LanguageDetectionResult[];
}

const detector: LangDetect = langdetect as unknown as LangDetect;

@Processor('file-processing')
@Injectable()
export class FileProcessor {
  private readonly logger = new Logger(FileProcessor.name);
  private readonly DEFAULT_ATTEMPTS = 3;
  private readonly SUPPORTED_LANGUAGES = {
    en: 'eng',
    es: 'spa',
  } as const;

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: FileGateway,
  ) {}

  @Process('process-file')
  async handleFile(job: Job<ProcessFileJobData>) {
    const { fileId, path, mimetype } = job.data;
    let file: File;

    try {
      let extractedText = '';
      let detectedLanguage = 'eng';

      if (mimetype === 'application/pdf') {
        const buffer = await readFile(path);
        const data: PdfParseResult = (await pdfParse(buffer)) as PdfParseResult;
        extractedText = this.cleanText(data.text);
        detectedLanguage = this.detectLanguage(extractedText);
      } else if (mimetype.startsWith('image/')) {
        const result = await Tesseract.recognize(path, 'eng');
        extractedText = this.cleanText(result.data.text);
        detectedLanguage = this.detectLanguage(extractedText);

        if (detectedLanguage !== 'eng') {
          const newResult = await Tesseract.recognize(path, detectedLanguage);
          extractedText = this.cleanText(newResult.data.text);
        }
      } else if (
        mimetype === 'text/csv' ||
        mimetype ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        const buffer = await readFile(path);
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const csv = xlsx.utils.sheet_to_csv(firstSheet);
        extractedText = this.cleanText(csv);
        detectedLanguage = this.detectLanguage(extractedText);
      } else {
        throw new Error('Unsupported file type');
      }

      file = await this.prisma.file.update({
        where: { id: fileId },
        data: {
          extractedText,
          status: 'complete',
        },
      });

      await this.createSuccessNotification(file);
      this.gateway.emitUpdate(file.userId, {
        fileId: file.id,
        fileName: file.originalName,
        message: `Your file "${file.originalName}" was processed successfully in ${this.getLanguageName(detectedLanguage)}.`,
        status: 'complete',
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to process file ${fileId}: ${errorMessage}`);

      file = await this.prisma.file.update({
        where: { id: fileId },
        data: {
          status: 'error',
        },
      });

      const attempts = job.opts?.attempts ?? this.DEFAULT_ATTEMPTS;
      if (job.attemptsMade >= attempts - 1) {
        await this.createErrorNotification(file, errorMessage);
        this.gateway.emitUpdate(file.userId, {
          fileId: file.id,
          fileName: file.originalName,
          message: `Your file "${file.originalName}" failed to process: ${errorMessage}`,
          status: 'error',
        });
      }

      throw error;
    }
  }

  private detectLanguage(text: string): string {
    try {
      if (!text || text.trim().length === 0) {
        return 'eng';
      }

      const detections = detector.detect(text);

      this.logger.debug('Language detections:', detections);

      for (const detection of detections) {
        const langCode = detection.lang.toLowerCase();
        if (langCode in this.SUPPORTED_LANGUAGES) {
          return this.SUPPORTED_LANGUAGES[
            langCode as keyof typeof this.SUPPORTED_LANGUAGES
          ];
        }
      }

      return 'eng';
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Language detection failed: ${errorMessage}`);
      return 'eng';
    }
  }

  private getLanguageName(langCode: string): string {
    const languageNames = {
      eng: 'English',
      spa: 'Spanish',
    } as const;
    return languageNames[langCode as keyof typeof languageNames] || 'English';
  }

  private cleanText(text: string): string {
    return text
      .split('')
      .filter((char) => {
        const code = char.charCodeAt(0);
        return (code >= 32 && code <= 126) || code === 10 || code === 13;
      })
      .join('')
      .trim();
  }

  private async createSuccessNotification(file: File) {
    await this.prisma.notification.create({
      data: {
        userId: file.userId,
        fileId: file.id,
        message: `Your file "${file.originalName}" was processed successfully.`,
      },
    });
  }

  private async createErrorNotification(file: File, errorMessage: string) {
    await this.prisma.notification.create({
      data: {
        userId: file.userId,
        fileId: file.id,
        message: `Your file "${file.originalName}" failed to process: ${errorMessage}`,
      },
    });
  }
}
