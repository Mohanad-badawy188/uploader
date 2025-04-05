import { RequestWithUser } from './../common/types/RequestWithUser';
import { JwtAuthGuard } from './../auth/guards/at.guard';
import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.notificationService.getUserNotifications(req.user.id);
  }
  @Patch('mark-read')
  @UseGuards(JwtAuthGuard)
  async markAllAsRead(@Req() req: RequestWithUser) {
    return this.notificationService.markAllAsRead(req.user.id);
  }
}
