import {
  Controller,
  Post,
  UseGuards,
  Res,
  UnauthorizedException,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard, LocalAuthGuard } from './guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import type { Response } from 'express';
import { ApiBody } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
      required: ['email', 'password'],
    },
    description: 'Login credentials',
  })
  async login(@CurrentUser() user: User) {
    return await this.authService.login(user);
  }

  @Post('refresh')
  async refresh(@Body('refresh-token') { refreshToken }: RefreshTokenDto) {
    const result = await this.authService.refreshToken(refreshToken);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Body('refresh-token') { refreshToken }: RefreshTokenDto) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    await this.authService.revokeRefreshToken(refreshToken);

    return { message: 'Logged out successfully' };
  }
}
