import { ActivitiesService } from '../../activities.service';
import { mockActivity } from './activity.stub';
import { PaginatedResponse } from '../../../common/base.service';

type MockActivitiesService = {
  [K in keyof ActivitiesService]: jest.Mock;
};

export const getActivitiesServiceStub = (
  overrides: Partial<MockActivitiesService> = {},
): MockActivitiesService => {
  const serviceStub = {
    updateActivity: jest.fn(),
    remove: jest.fn(),
    findAllLockups: jest.fn(),
    findByStatus: jest.fn(),

    createActivity: jest.fn().mockResolvedValue(mockActivity({ id: 999 })),
    findAllPaginated: jest.fn().mockResolvedValue({
      data: [mockActivity({ id: 1 }), mockActivity({ id: 2 })],
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    } satisfies PaginatedResponse<any>),
    findOneActivity: jest.fn().mockResolvedValue(mockActivity({ id: 42 })),
  };

  return { ...serviceStub, ...overrides } as unknown as MockActivitiesService;
};
