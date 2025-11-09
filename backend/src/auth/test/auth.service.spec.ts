import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { LoggerService } from '../../common/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../../users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { mockUser } from '../../users/test/stubs/user.stub';
import { instanceToPlain } from 'class-transformer';
import { createRefreshTokenRepositoryStub } from './stubs/refresh-token.repository.stub';
import { createUsersServiceStub } from '../../users/test/stubs/users.service.stub';

describe('AuthService - FULLY CLEAN & TYPE-SAFE', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let refreshTokenRepo: ReturnType<typeof createRefreshTokenRepositoryStub>;
  let configService: ConfigService;

  const mockUserEntity = mockUser({
    id: 1,
    email: 'test@example.com',
    role: UserRole.ADMIN,
    validatePassword: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: createUsersServiceStub() },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(), verify: jest.fn() },
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: createRefreshTokenRepositoryStub(),
        },
        {
          provide: ConfigService,
          useValue: { getOrThrow: jest.fn(() => 'secret') },
        },
        { provide: LoggerService, useValue: { error: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    refreshTokenRepo = module.get(getRepositoryToken(RefreshToken));
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('validateUser', () => {
    it('should return user data without password', async () => {
      const plainUser = {
        id: 1,
        email: 'test@example.com',
        role: UserRole.ADMIN,
        name: 'John Doe',
      };

      const validatePasswordSpy = jest
        .spyOn(mockUserEntity, 'validatePassword')
        .mockResolvedValue(true);

      jest
        .spyOn(usersService, 'findByEmailAnd')
        .mockResolvedValue(mockUserEntity);
      jest
        .spyOn(require('class-transformer'), 'instanceToPlain')
        .mockReturnValue(plainUser);

      const result = await service.validateUser('test@example.com', 'pass123');

      expect(validatePasswordSpy).toHaveBeenCalledWith('pass123');

      expect(instanceToPlain).toHaveBeenCalledWith(mockUserEntity, {
        excludePrefixes: ['password', 'createdActivities'],
      });
      expect(result).toEqual(plainUser);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw on invalid credentials', async () => {
      jest.spyOn(usersService, 'findByEmailAnd').mockResolvedValue(null);

      await expect(service.validateUser('bad', 'bad')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('should generate tokens and save refresh token', async () => {
      const accessToken = 'access.jwt';
      const refreshToken = 'refresh.jwt';
      const savedToken = { id: 1, token: refreshToken, userId: 1 };

      jest
        .spyOn(jwtService, 'sign')
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);

      jest.spyOn(configService, 'getOrThrow').mockReturnValue('refresh-secret');
      refreshTokenRepo.create.mockReturnValue(savedToken);
      refreshTokenRepo.save.mockResolvedValue(savedToken);

      const result = await service.login(mockUserEntity);

      expect(result).toEqual({
        user: mockUserEntity,
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      expect(refreshTokenRepo.save).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    const validToken = {
      id: 1,
      token: 'valid',
      user: mockUserEntity,
      expiresAt: new Date(Date.now() + 100000),
      isRevoked: false,
    };

    it('should return new access token', async () => {
      refreshTokenRepo.findOne.mockResolvedValue(validToken);
      jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: 1 });
      jest.spyOn(usersService, 'findById').mockResolvedValue(mockUserEntity);
      jest.spyOn(jwtService, 'sign').mockReturnValue('new.access');

      const result = await service.refreshToken('valid');

      expect(result.access_token).toBe('new.access');
    });

    it('should reject invalid/revoked/expired', async () => {
      refreshTokenRepo.findOne.mockResolvedValue(null);
      await expect(service.refreshToken('bad')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('revokeRefreshToken', () => {
    it('should mark token as revoked', async () => {
      const token = { id: 1, isRevoked: false };
      refreshTokenRepo.findOne.mockResolvedValue(token);
      refreshTokenRepo.save.mockResolvedValue({ ...token, isRevoked: true });

      await service.revokeRefreshToken('token');

      expect(refreshTokenRepo.save).toHaveBeenCalledWith({
        ...token,
        isRevoked: true,
      });
    });
  });
});
