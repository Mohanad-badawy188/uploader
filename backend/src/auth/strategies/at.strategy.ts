import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service'; // adjust import as needed

export interface JwtPayload {
  sub: string;
  name: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secret = config.get<string>('JWT_SECRET');
    if (typeof secret !== 'string') {
      throw new Error('JWT_SECRET is not defined or invalid');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request & { cookies: Record<string, string> }): string | null => {
          const token = req.cookies?.token;
          return typeof token === 'string' ? token : null;
        },
      ]),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: +payload.sub },
    });

    if (!user) throw new UnauthorizedException();
    return user;
  }
}
