import { User, UserRole } from '../../entities/user.entity';
export const mockUser = (overrides = {}): User => ({
  id: 1,
  email: 'john@example.com',
  name: 'John Doe',
  password: 'hashed123',
  role: UserRole.EMPLOYEE,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  phone: '123-456-7890',
  address: '123 Main St, Anytown',
  personalId: 'ABC123456',
  hashPassword: () => Promise.resolve(),
  validatePassword: () => Promise.resolve(true),
  ...overrides,
});

export const mockSuperAdmin = () =>
  mockUser({
    id: 999,
    email: 'admin@system.com',
    role: UserRole.SUPER_ADMIN,
  });

export const mockAdmin = () =>
  mockUser({
    id: 100,
    email: 'admin@example.com',
    role: UserRole.ADMIN,
  });
