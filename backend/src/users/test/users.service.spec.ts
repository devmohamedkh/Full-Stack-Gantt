import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { createUsersRepositoryStub } from './stubs/users.repository.stub';
import { mockUser, mockSuperAdmin, mockAdmin } from './stubs/user.stub';
import { Like } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repo: ReturnType<typeof createUsersRepositoryStub>;

  beforeEach(async () => {
    repo = createUsersRepositoryStub();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAllPaginated', () => {
    it('should search by name and email', async () => {
      const params = { page: 1, limit: 10, search: 'john' };
      const users = [mockUser()];
      repo.find.mockResolvedValue(users);
      repo.count.mockResolvedValue(1);

      const result = await service.findAllPaginated(params);

      expect(repo.findAndCount).toHaveBeenCalledWith({
        where: [
          { name: Like(`%${params.search}%`) },
          { email: Like(`%${params.search}%`) },
        ],
        skip: 0,
        take: 10,
      });

      expect(result).toMatchObject({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: expect.arrayContaining([expect.any(Object)]),
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('findByRole', () => {
    it('should filter by role', async () => {
      repo.find.mockResolvedValue([mockAdmin()]);
      repo.count.mockResolvedValue(1);

      await service.findByRole(UserRole.ADMIN, { page: 1, limit: 10 });

      expect(repo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { role: UserRole.ADMIN },
        }),
      );
    });
  });

  describe('createUser', () => {
    it('allows super admin to create super admin', async () => {
      const dto: CreateUserDto = {
        name: 'system',
        email: 'sa@system.com',
        role: UserRole.SUPER_ADMIN,
        password: 'password',
      };
      const currentUser = mockSuperAdmin();
      const created = mockUser({ ...dto, id: 2 });

      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

      const result = await service.createUser(dto, currentUser);

      expect(repo.save).toHaveBeenCalledWith(created);
      expect(result.role).toBe(UserRole.SUPER_ADMIN);
      expect(result.password).toBeUndefined();
    });

    it('blocks non-super-admin from creating super admin', async () => {
      const dto: CreateUserDto = {
        name: 'system',
        email: 'sa@system.com',
        role: UserRole.SUPER_ADMIN,
        password: 'password',
      };
      const currentUser = mockAdmin();

      await expect(service.createUser(dto, currentUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateUser', () => {
    it('allows owner to update', async () => {
      const user = mockUser({ id: 1 });
      const requestingUser = mockUser({ id: 1 });
      jest.spyOn(repo, 'findOne').mockResolvedValue(user);
      repo.save.mockResolvedValue({ ...user, name: 'New Name' });

      await service.updateUser(1, { name: 'New Name' }, requestingUser);

      expect(repo.update).toHaveBeenCalled();
    });

    it('blocks user from updating others', async () => {
      const target = mockUser({ id: 2 });
      const requester = mockUser({ id: 1 });

      jest.spyOn(service as any, 'findOneById').mockResolvedValue(target);

      await expect(
        service.updateUser(2, { name: 'hack' }, requester),
      ).rejects.toThrow(Error);
    });
  });

  describe('findByEmailAnd', () => {
    it('finds user with password', async () => {
      const user = mockUser();
      repo.findOne.mockResolvedValue(user);

      const result = await service.findByEmailAnd('john@example.com');

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
        select: ['id', 'email', 'password', 'role'],
      });
      expect(result).toEqual(user);
    });
  });

  describe('private methods', () => {
    it('isSuperAdminCreating throws correctly', () => {
      const dto = { role: UserRole.SUPER_ADMIN } as CreateUserDto;
      const user = mockAdmin();

      expect(() => service.isSuperAdminCreating(dto, user)).toThrow(
        BadRequestException,
      );
    });
  });
});
