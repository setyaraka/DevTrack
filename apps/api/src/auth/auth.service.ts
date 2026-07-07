import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

interface TokenPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      passwordHash,
    });

    return this.createSession(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email.toLowerCase());

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createSession(user);
  }

  async refresh(refreshToken: string) {
    const tokenRecords = await this.prisma.refreshToken.findMany({
      where: {
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    const matchingToken = await this.findMatchingRefreshToken(refreshToken, tokenRecords);

    if (!matchingToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: matchingToken.id },
      data: { revokedAt: new Date() },
    });

    return this.createSession(matchingToken.user);
  }

  async logout(userId: string, refreshToken: string) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { userId, revokedAt: null },
    });
    const matchingToken = await this.findMatchingRefreshToken(refreshToken, tokens);

    if (matchingToken) {
      await this.prisma.refreshToken.update({
        where: { id: matchingToken.id },
        data: { revokedAt: new Date() },
      });
    }

    return { success: true };
  }

  private async createSession(user: { id: string; email: string; name: string; createdAt: Date }) {
    const payload: TokenPayload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d',
    });

    await this.prisma.refreshToken.create({
      data: {
        tokenHash: await bcrypt.hash(refreshToken, 12),
        userId: user.id,
        expiresAt: this.getRefreshExpiry(),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  private async findMatchingRefreshToken<T extends { tokenHash: string }>(
    refreshToken: string,
    records: T[],
  ) {
    for (const record of records) {
      if (await bcrypt.compare(refreshToken, record.tokenHash)) {
        return record;
      }
    }

    return null;
  }

  private getRefreshExpiry() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return expiry;
  }
}
