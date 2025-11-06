import {
  Controller,
  Post,
  Request,
  UseGuards,
  Headers,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard, LocalAuthGuard } from './guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import type { Response } from 'express';
import { ApiBody } from '@nestjs/swagger';

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
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.login(user, res);
  }

  @Post('refresh')
  async refresh(
    @Headers('x-refresh-token') headerToken: string,
    @Res() res: Response,
  ) {
    const refreshToken = headerToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const result = await this.authService.refreshToken(refreshToken);
    return res.json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Headers('x-refresh-token') headerToken: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const refreshToken = headerToken || req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    await this.authService.revokeRefreshToken(refreshToken);

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return res.json({ message: 'Logged out successfully' });
  }
}
