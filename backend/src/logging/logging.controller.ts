import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/at.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserActivityService } from './userActivity.service';

@Controller('logs')
export class UserActivityController {
  constructor(private readonly UserActivityService: UserActivityService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  getAllLogs(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.UserActivityService.findAll(+page, +limit);
  }
}
