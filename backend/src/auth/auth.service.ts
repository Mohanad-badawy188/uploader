import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto';
import { getSafeUser } from 'src/common/utils/safeUser';
import { User } from '@prisma/client';
import { UserActivityService } from 'src/logging/userActivity.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly userActivityService: UserActivityService,
  ) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hash,
      },
    });

    const payload = { sub: user.id, name: user.name, role: user.role };
    const safeUser = getSafeUser(user);

    return {
      accessToken: this.jwt.sign(payload),
      user: safeUser,
    };
  }
  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    await this.userActivityService.log(
      user.id,
      'LOGIN',
      `Logged in with email ${user.email}`,
    );
    const payload = { sub: user.id, name: user.name, role: user.role };
    const safeUser = getSafeUser(user);
    return {
      accessToken: this.jwt.sign(payload),
      user: safeUser,
    };
  }
  async getProfile(user: User) {
    const validatedUser = await this.validateUser(user.email);
    const safeUser = getSafeUser(validatedUser);

    return safeUser;
  }

  private async validateUser(email: string, password?: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (password === undefined) return user;
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
