import { EntityMetadata, Repository } from 'typeorm';
import { RefreshToken } from '../../entities/refresh-token.entity';
import { mockRefreshToken } from './refresh-token.stub';

const mockMetadata: EntityMetadata = {
  target: RefreshToken,
  tableName: 'RefreshToken',
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

export type MockRefreshTokenRepository = {
  [K in keyof Repository<RefreshToken>]: jest.Mock;
} & {
  metadata: EntityMetadata;
};

export const createRefreshTokenRepositoryStub = (
  overrides: Partial<MockRefreshTokenRepository> = {},
): MockRefreshTokenRepository => {
  const defaultMocks = {
    metadata: mockMetadata,

    find: jest.fn().mockResolvedValue([mockRefreshToken()]),
    remove: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn().mockResolvedValue(mockRefreshToken()),
    hasId: jest.fn(),
    getId: jest.fn(),
    create: jest.fn().mockReturnValue(mockRefreshToken()),
    merge: jest.fn(),
    preload: jest.fn(),
    save: jest.fn().mockResolvedValue(mockRefreshToken()),
    insert: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
    softRemove: jest.fn(),
    recover: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
    count: jest.fn(),
    countBy: jest.fn(),
    findAndCount: jest.fn(),
    findBy: jest.fn(),
    findOneBy: jest.fn(),
    findOneOrFail: jest.fn(),
    findOneByOrFail: jest.fn(),
    query: jest.fn(),
    clear: jest.fn(),
    increment: jest.fn(),
    decrement: jest.fn(),
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
  } as unknown as MockRefreshTokenRepository;
};
