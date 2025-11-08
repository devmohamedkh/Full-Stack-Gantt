import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { LoggerService } from '../common/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { instanceToPlain } from 'class-transformer';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<User> | null> {
    const user = await this.usersService.findByEmailAnd(email);

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return instanceToPlain(user, {
      excludePrefixes: ['password', 'createdActivities'],
    });
  }

  async login(user: User): Promise<CreateAuthDto> {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      user,
      access_token: accessToken,
      refresh_token: refreshToken.token,
    };
  }

  private generateAccessToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  private async generateRefreshToken(user: User): Promise<RefreshToken> {
    const token = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshToken = this.refreshTokenRepository.create({
      token,
      user,
      expiresAt,
    });

    return this.refreshTokenRepository.save(refreshToken);
  }

  async refreshToken(refreshToken: string) {
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });

    if (
      !tokenEntity ||
      tokenEntity.isRevoked ||
      tokenEntity.expiresAt < new Date()
    ) {
      this.logger.error(`Invalid or expired refresh token: ${refreshToken}`);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const decoded = this.jwtService.verify<{ sub: number }>(refreshToken, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });

    const user = await this.usersService.findById(decoded.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const newAccessToken = this.generateAccessToken(user);

    return { access_token: newAccessToken };
  }

  async revokeRefreshToken(refreshToken: string) {
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
    });

    if (tokenEntity) {
      tokenEntity.isRevoked = true;
      await this.refreshTokenRepository.save(tokenEntity);
    }
  }
}
