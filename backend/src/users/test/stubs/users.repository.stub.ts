import { EntityMetadata, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { mockUser } from './user.stub';

const mockMetadata: EntityMetadata = {
  target: User,
  tableName: 'users',
  columns: [],
  relations: [],
  connection: {
    //@ts-expect-error partial mock
    manager: {},
    //@ts-expect-error partial mock
    options: {},
    createQueryRunner: jest.fn(),
    query: jest.fn(),
    name: 'default',
    isInitialized: true,
  },
  propertiesMap: {},
  primaryColumns: [],
  hasMultiplePrimaryKeys: false,
};

export type MockUsersRepository = {
  [K in keyof Repository<User>]: jest.Mock;
} & {
  metadata: EntityMetadata;
};

export const createUsersRepositoryStub = (
  overrides: Partial<MockUsersRepository> = {},
): MockUsersRepository => {
  const defaultMocks = {
    metadata: mockMetadata,
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    count: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    softDelete: jest.fn(),
    update: jest.fn(),
    findAndCount: jest
      .fn()
      .mockResolvedValue([
        [mockUser(), mockUser({ id: 2, email: 'jane@example.com' })],
        2,
      ]),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getManyAndCount: jest.fn(),
      getOne: jest.fn(),
      select: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
    })),
  };

  return {
    ...defaultMocks,
    ...overrides,
  } as unknown as MockUsersRepository;
};
