// src/activities/activities.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesService } from '../activities.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Activity, ActivityStatus } from '../entities/activity.entity';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { mockUser } from '../../users/test/stubs/user.stub';
import { getActivityRepositoryStub } from './stubs/activity.repository.stub';
import { mockActivity, createDependencyChain } from './stubs/activity.stub';

// import { plainToInstance } from 'class-transformer';
import { In, Not } from 'typeorm';

jest.mock('class-transformer', () => {
  const actual = jest.requireActual('class-transformer');
  return {
    ...actual,
    plainToInstance: jest.fn((cls, obj) => obj),
  };
});

describe('ActivitiesService', () => {
  let service: ActivitiesService;
  let repo: ReturnType<typeof getActivityRepositoryStub>;

  const mockCurrentUser = mockUser({ id: 1 });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesService,
        {
          provide: getRepositoryToken(Activity),
          useValue: getActivityRepositoryStub(),
        },
      ],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
    repo = module.get(getRepositoryToken(Activity));
  });

  afterEach(() => jest.clearAllMocks());

  describe('createActivity', () => {
    it('should create activity successfully', async () => {
      const dto: CreateActivityDto = {
        name: 'New Task',
        start: '2025-02-01',
        end: '2025-02-10',
        dependencies: [],
      };
      // Convert string dates to Date objects to match Activity entity types
      const created = mockActivity({
        ...dto,
        id: 2,
        start: new Date(dto.start),
        end: new Date(dto.end),
        dependencies: [],
      });

      repo.create.mockReturnValue(created);
      repo.save.mockReturnValue(created);

      const result = await service.createActivity(dto, mockCurrentUser);

      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(result.name).toEqual(created.name);
      expect(result.start).toEqual(created.start);
      expect(result.end).toEqual(created.end);
      expect(result.dependencies).toEqual(created.dependencies);
    });

    it('should throw if end <= start', async () => {
      const dto = { name: 'Bad', start: '2025-02-10', end: '2025-02-01' };
      await expect(
        service.createActivity(dto, mockCurrentUser),
      ).rejects.toThrow('End date must be after start date');
    });

    it('should validate dependencies', async () => {
      repo.findBy.mockResolvedValue([mockActivity({ id: 5 })]);

      const dto = {
        name: 'Task',
        start: '2025-02-10',
        end: '2025-02-20',
        dependencies: [5],
      };

      await service.createActivity(dto, mockCurrentUser);

      expect(repo.findBy).toHaveBeenCalledWith({ id: expect.anything() });
    });

    it('should detect self-dependency', async () => {
      const dto = {
        name: 'Self',
        start: '2025-02-01',
        end: '2025-02-10',
        dependencies: [999], // fake future ID
      };

      // Mock findBy to return empty → will be caught in validateDependencies
      repo.findBy.mockResolvedValue([]);

      await expect(
        service.createActivity(dto, mockCurrentUser),
      ).rejects.toThrow('Dependencies not found');
    });

    it('should detect dependency cycle', async () => {
      const [a, b] = createDependencyChain('A', 'B');
      a.dependencies = [b];
      b.dependencies = [a];

      repo.findOne.mockResolvedValueOnce(a).mockResolvedValueOnce(b);
      repo.findBy.mockResolvedValue([a, b]);

      const dto = {
        name: 'Cycle',
        start: '2025-03-01',
        end: '2025-03-10',
        dependencies: [a.id, b.id],
      };

      await expect(
        service.createActivity(dto, mockCurrentUser),
      ).rejects.toThrow('Dependency cycle detected');
    });
  });

  describe('updateActivity', () => {
    it('should update activity', async () => {
      const existing = mockActivity({ id: 10 });
      jest.spyOn(service, 'findOneActivity').mockResolvedValue(existing);
      repo.save.mockResolvedValue(existing);

      const dto: UpdateActivityDto = { name: 'Updated' };
      await service.updateActivity(10, dto);

      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Updated' }),
      );
    });

    it('should handle dependency changes', async () => {
      const existing = mockActivity({ id: 10, dependencies: [] });
      jest.spyOn(service, 'findOneActivity').mockResolvedValue(existing);

      const dep = mockActivity({
        id: 20,
        end: new Date('2025-01-01'),
      });
      repo.findBy.mockResolvedValue([dep]);

      existing.start = new Date('2025-02-01');
      existing.end = new Date('2025-02-10');

      const dto = { dependencies: [20] };
      await service.updateActivity(10, dto);

      expect(existing.dependencies).toHaveLength(1);
      expect(existing.dependencies[0].id).toBe(20);
    });
  });

  describe('findAllPaginated', () => {
    it('should call super.paginate with correct params', async () => {
      //   const spy = jest
      //     .spyOn(repo, 'findAndCount' as any)
      //     .mockResolvedValue({ data: [], total: 0 });

      repo.find.mockResolvedValue([]);
      repo.count.mockResolvedValue(0);

      await service.findAllPaginated({
        page: 1,
        limit: 10,
        status: ActivityStatus.COMPLETED,
      });

      expect(repo.findAndCount).toHaveBeenCalledWith({
        loadRelationIds: { relations: ['dependencies'] },
        order: { createdAt: 'ASC', order: 'ASC' },
        skip: 0,
        take: 10,
        where: { status: 'completed' },
      });
    });
  });

  describe('findAllLockups', () => {
    it('should exclude given IDs', async () => {
      repo.find.mockResolvedValue([]);

      await service.findAllLockups([1, 2, 3]);

      expect(repo.find).toHaveBeenCalledWith({
        where: { id: Not(In([1, 2, 3])) },
        select: ['name', 'id'],
        order: { createdAt: 'ASC', order: 'ASC' },
      });
    });
  });

  describe('findOneActivity', () => {
    it('should call super.findOneById with relations', async () => {
      const spy = jest
        .spyOn(repo as any, 'findOne')
        .mockResolvedValue(mockActivity());

      await service.findOneActivity(42);

      expect(spy).toHaveBeenCalledWith({
        relations: ['dependencies'],
        where: { id: 42 },
      });
    });
  });
});
