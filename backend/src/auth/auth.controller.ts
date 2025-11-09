import {
  Controller,
  Post,
  UseGuards,
  UnauthorizedException,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard, LocalAuthGuard } from './guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateAuthDto } from './dto/create-auth.dto';

@ApiTags('auth')
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
  async login(@CurrentUser() user: User): Promise<CreateAuthDto> {
    return await this.authService.login(user);
  }

  @Post('refresh')
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Provide the refresh token to obtain a new access token',
  })
  async refresh(@Body() { refreshToken }: RefreshTokenDto) {
    const result = await this.authService.refreshToken(refreshToken);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Provide the refresh token to log out and revoke it',
  })
  async logout(@Body() { refreshToken }: RefreshTokenDto) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    await this.authService.revokeRefreshToken(refreshToken);

    return { message: 'Logged out successfully' };
  }
}
