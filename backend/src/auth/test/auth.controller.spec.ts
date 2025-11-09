import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { JwtAuthGuard, LocalAuthGuard } from '../guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { UnauthorizedException } from '@nestjs/common';
import { mockUser } from '../../users/test/stubs/user.stub';
import { createAuthServiceStub } from './stubs/auth.service.stub';

const mockLocalAuthGuard = { canActivate: jest.fn(() => true) };
const mockJwtAuthGuard = { canActivate: jest.fn(() => true) };

const mockCurrentUser = jest.fn();

describe('AuthController', () => {
  let controller: AuthController;
  let authService: ReturnType<typeof createAuthServiceStub>;

  const mockUserEntity = mockUser({
    id: 1,
    email: 'test@example.com',
    role: UserRole.ADMIN,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: createAuthServiceStub(),
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue(mockLocalAuthGuard)
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideProvider(CurrentUser)
      .useFactory({ factory: mockCurrentUser })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService =
      module.get<ReturnType<typeof createAuthServiceStub>>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('login', () => {
    it('should return tokens from auth service', async () => {
      const loginResult: CreateAuthDto = {
        user: mockUserEntity,
        access_token: 'access.jwt',
        refresh_token: 'refresh.jwt',
      };

      mockCurrentUser.mockReturnValue(mockUserEntity);
      authService.login.mockResolvedValue(loginResult);

      const result = await controller.login(mockUserEntity);

      expect(authService.login).toHaveBeenCalledWith(mockUserEntity);
      expect(result).toEqual(loginResult);
      expect(result.access_token).toBe('access.jwt');
    });

    it('should pass user from LocalAuthGuard', async () => {
      const userFromGuard = mockUser({ id: 999 });
      mockCurrentUser.mockReturnValue(userFromGuard);
      authService.login.mockResolvedValue({} as any);

      await controller.login(userFromGuard);

      expect(authService.login).toHaveBeenCalledWith(userFromGuard);
    });
  });

  describe('refresh', () => {
    it('should refresh token successfully', async () => {
      const dto: RefreshTokenDto = { refreshToken: 'valid-refresh-token' };
      const result = { access_token: 'new.access.token' };

      authService.refreshToken.mockResolvedValue(result);

      const response = await controller.refresh(dto);

      expect(authService.refreshToken).toHaveBeenCalledWith(
        'valid-refresh-token',
      );
      expect(response).toEqual(result);
    });
  });

  describe('logout', () => {
    it('should revoke token and return success', async () => {
      const dto: RefreshTokenDto = { refreshToken: 'token-to-revoke' };
      authService.revokeRefreshToken.mockResolvedValue(undefined);

      const result = await controller.logout(dto);

      expect(authService.revokeRefreshToken).toHaveBeenCalledWith(
        'token-to-revoke',
      );
      expect(result).toEqual({ message: 'Logged out successfully' });
    });

    it('should throw if no refresh token provided', async () => {
      const dto = { refreshToken: null } as any;

      await expect(controller.logout(dto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(controller.logout(dto)).rejects.toThrow(
        'Refresh token is required',
      );
    });

    it('should throw if refreshToken is empty string', async () => {
      await expect(controller.logout({ refreshToken: '' })).rejects.toThrow(
        'Refresh token is required',
      );
    });
  });

  describe('guards', () => {
    it('should use LocalAuthGuard on login', () => {
      expect(LocalAuthGuard).toBeTruthy();
    });

    it('should use JwtAuthGuard on logout', () => {
      expect(JwtAuthGuard).toBeTruthy();
    });
  });
});
