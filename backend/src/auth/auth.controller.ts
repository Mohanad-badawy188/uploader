import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto';
import { JwtAuthGuard } from './guards/at.guard';
import { RequestWithUser } from 'src/common/types/RequestWithUser';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return this.authService.getProfile(req.user);
  }
}
