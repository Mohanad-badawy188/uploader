import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserActivityService {
  constructor(private prisma: PrismaService) {}

  async log(userId: number, action: string, details?: string) {
    await this.prisma.userActivity.create({
      data: {
        userId,
        action,
        details,
      },
    });
  }
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [logs, total] = await this.prisma.$transaction([
      this.prisma.userActivity.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, email: true, name: true },
          },
        },
      }),
      this.prisma.userActivity.count(),
    ]);

    return {
      data: logs,
      total,
      page,
      pageSize: limit,
    };
  }
}
