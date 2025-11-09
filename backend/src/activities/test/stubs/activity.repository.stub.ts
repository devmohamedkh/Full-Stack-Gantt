import { Repository } from 'typeorm';
import { Activity } from '../../entities/activity.entity';
import { mockActivity } from './activity.stub';

type MockActivityRepository = {
  [K in keyof Repository<Activity>]: jest.Mock;
};

export const getActivityRepositoryStub = (
  overrides: Partial<MockActivityRepository> = {},
): MockActivityRepository => {
  const defaultMocks = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    })),

    findBy: jest.fn().mockResolvedValue([mockActivity()]),
    findAndCount: jest
      .fn()
      .mockResolvedValue([
        [mockActivity(), mockActivity({ id: 2, name: 'Activity 2' })],
        2,
      ]),

    findOne: jest.fn().mockResolvedValue(mockActivity()),

    save: jest.fn().mockResolvedValue(mockActivity()),

    create: jest.fn().mockReturnValue(mockActivity()),
    count: jest.fn(),
  };

  return { ...defaultMocks, ...overrides } as unknown as MockActivityRepository;
};
