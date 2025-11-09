import { AuthService } from '../../auth.service';
import { mockUser } from '../../../users/test/stubs/user.stub';

type MockAuthService = {
  [K in keyof AuthService]: jest.Mock;
};

let authServiceStub: MockAuthService | null = null;

export const createAuthServiceStub = (
  overrides: Partial<MockAuthService> = {},
): MockAuthService => {
  if (!authServiceStub) {
    authServiceStub = {
      validateUser: jest.fn().mockResolvedValue({
        id: 1,
        email: 'admin@example.com',
        role: 'SUPER_ADMIN',
      }),

      login: jest.fn().mockResolvedValue({
        user: mockUser({
          id: 1,
          email: 'admin@example.com',
          password: undefined,
        }),
        access_token: 'access-token-abc123',
        refresh_token: 'refresh-token-xyz789',
      }),

      refreshToken: jest.fn().mockResolvedValue({
        access_token: 'new-access-token-456',
      }),

      revokeRefreshToken: jest.fn().mockResolvedValue(undefined),
    };
  }

  return { ...authServiceStub, ...overrides };
};
