import { RefreshToken } from '../../entities/refresh-token.entity';
import { mockUser } from '../../../users/test/stubs/user.stub';

export const mockRefreshToken = (
  overrides: Partial<RefreshToken> = {},
): RefreshToken => ({
  id: 1,
  token: 'valid-refresh-token-123456789',
  user: mockUser({ id: 1 }),
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
  isRevoked: false,
  ...overrides,
});

export const mockExpiredRefreshToken = () =>
  mockRefreshToken({
    expiresAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  });

export const mockRevokedRefreshToken = () =>
  mockRefreshToken({ isRevoked: true });
