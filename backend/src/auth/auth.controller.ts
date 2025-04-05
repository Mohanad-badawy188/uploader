import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto';
import { JwtAuthGuard } from './guards/at.guard';
import { RequestWithUser } from 'src/common/types/RequestWithUser';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    const result = await this.authService.signup(dto);

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return this.authService.getProfile(req.user);
  }

  @Post('logout')
  logout() {
    // With JWT in Authorization header, no server-side logout needed
    // The frontend will handle removing the token
    return { success: true };
  }
}
