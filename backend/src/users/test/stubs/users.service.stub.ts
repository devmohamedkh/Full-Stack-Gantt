import { UsersService } from '../../users.service';
import { mockUser } from './user.stub';
import { PaginatedResponse } from '../../../common/base.service';
import { User } from '../../entities/user.entity';

type MockUsersService = {
  [K in keyof UsersService]: jest.Mock;
};

export const createUsersServiceStub = (
  overrides: Partial<MockUsersService> = {},
): MockUsersService => {
  const defaultMocks = {
    findByRole: jest.fn(),
    findByEmailAnd: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),

    findAllPaginated: jest.fn().mockResolvedValue({
      data: [mockUser({ id: 1 }), mockUser({ id: 2, email: 'jane@test.com' })],
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    } satisfies PaginatedResponse<User>),

    findOneById: jest
      .fn()
      .mockImplementation((id: number) => Promise.resolve(mockUser({ id }))),

    createUser: jest.fn().mockResolvedValue(
      mockUser({
        id: 100,
        email: 'new@admin.com',
        name: 'New Admin',
        role: 'ADMIN',
        password: 'password',
      }),
    ),

    updateUser: jest.fn().mockResolvedValue(
      mockUser({
        id: 5,
        name: 'Updated Name',
      }),
    ),
  };

  return {
    ...defaultMocks,
    ...overrides,
  } as unknown as MockUsersService;
};
