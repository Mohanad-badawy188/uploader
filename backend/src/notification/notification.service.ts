import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserNotifications(userId: number) {
    const [notifications, total, unreadCount] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, status: 'unread' } }),
    ]);

    return {
      notifications,
      total,
      unreadCount,
    };
  }

  async markAllAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        status: 'unread',
      },
      data: {
        status: 'read',
      },
    });
  }
}
