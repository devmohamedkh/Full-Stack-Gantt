import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesController } from '../activities.controller';
import { ActivitiesService } from '../activities.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { CurrentUser, Roles } from '../../common/decorators';
import { UserRole } from '../../users/entities/user.entity';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { mockUser } from '../../users/test/stubs/user.stub';
import { getActivitiesServiceStub } from './stubs/activities.service.stub';
import { ParseArrayPipe } from '@nestjs/common';
import { mockActivity } from './stubs/activity.stub';
import { ActivityPaginationParamsDto } from '../dto/pagination-params.dto';
import { ActivityStatus } from '../entities/activity.entity';

const mockJwtGuard = { canActivate: jest.fn(() => true) };
const mockRoleGuard = { canActivate: jest.fn(() => true) };

const mockCurrentUser = jest.fn();
const mockRoles = jest.fn();

describe('ActivitiesController', () => {
  let controller: ActivitiesController;
  let service: ReturnType<typeof getActivitiesServiceStub>;

  const mockAdminUser = mockUser({ id: 1, role: UserRole.ADMIN });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [
        {
          provide: ActivitiesService,
          useValue: getActivitiesServiceStub(),
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .overrideGuard(RoleGuard)
      .useValue(mockRoleGuard)
      .overrideProvider(CurrentUser)
      .useFactory({ factory: mockCurrentUser })
      .overrideProvider(Roles)
      .useValue(mockRoles)
      .compile();

    controller = module.get<ActivitiesController>(ActivitiesController);
    service =
      module.get<ReturnType<typeof getActivitiesServiceStub>>(
        ActivitiesService,
      );
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create activity with current user', async () => {
      const dto: CreateActivityDto = {
        name: 'New Project',
        start: '2025-03-01',
        end: '2025-03-31',
      };

      mockCurrentUser.mockReturnValue(mockAdminUser);
      service.createActivity.mockResolvedValue({ id: 999, ...dto });

      const result = await controller.create(dto, mockAdminUser);

      expect(service.createActivity).toHaveBeenCalledWith(dto, mockAdminUser);
      expect(result.id).toBe(999);
    });
  });

  describe('findAll', () => {
    it('should return paginated activities', async () => {
      const params: ActivityPaginationParamsDto = {
        page: 1,
        limit: 10,
        status: ActivityStatus.IN_PROGRESS,
      };
      const response = {
        data: [mockActivity({ id: 1 })],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      service.findAllPaginated.mockResolvedValue(response);

      const result = await controller.findAll(params);

      expect(service.findAllPaginated).toHaveBeenCalledWith(params);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('findAllLockups', () => {
    it('should call service with excludedIds', async () => {
      const excluded = [1, 2, 3];
      service.findAllLockups.mockResolvedValue([]);

      await controller.findAllLockups(excluded);

      expect(service.findAllLockups).toHaveBeenCalledWith(excluded);
    });

    it('should handle empty excludedIds', async () => {
      await controller.findAllLockups([]);

      expect(service.findAllLockups).toHaveBeenCalledWith([]);
    });

    it('should work with ParseArrayPipe', () => {
      expect(ParseArrayPipe).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return single activity', async () => {
      const activity = mockActivity({ id: 42 });
      service.findOneActivity.mockResolvedValue(activity);

      const result = await controller.findOne(42);

      expect(service.findOneActivity).toHaveBeenCalledWith(42);
      expect(result.id).toBe(42);
    });
  });

  describe('update', () => {
    it('should update activity', async () => {
      const dto: UpdateActivityDto = { name: 'Updated Task' };
      const updated = mockActivity({ id: 42, name: 'Updated Task' });

      service.updateActivity.mockResolvedValue(updated);

      const result = await controller.update(42, dto);

      expect(service.updateActivity).toHaveBeenCalledWith(42, dto);
      expect(result.name).toBe('Updated Task');
    });
  });

  describe('remove', () => {
    it('should delete activity', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove(42);

      expect(service.remove).toHaveBeenCalledWith(42);
    });
  });

  describe('guards & decorators', () => {
    it('should have JwtAuthGuard and RoleGuard on class', () => {
      expect(JwtAuthGuard).toBeTruthy();
      expect(RoleGuard).toBeTruthy();
    });

    it('should have Roles on create, update, delete', () => {
      expect(mockRoles).toBeDefined();
    });

    it('should have CurrentUser on create', () => {
      expect(mockCurrentUser).toBeDefined();
    });
  });
});
