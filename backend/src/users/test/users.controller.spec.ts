import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { User, UserRole } from '../entities/user.entity';
import { PaginatedResponse } from '../../common/base.service';
import { PaginationParamsDto } from '../../common/dto/pagination-params.dto';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { mockUser } from './stubs/user.stub';
import { createUsersRepositoryStub } from './stubs/users.repository.stub';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { createUsersServiceStub } from './stubs/users.service.stub';

const mockJwtAuthGuard = () => ({ canActivate: jest.fn(() => true) });
const mockRoleGuard = () => ({ canActivate: jest.fn(() => true) });

const mockCurrentUser = () => mockUser({ id: 999, role: UserRole.SUPER_ADMIN });
const mockRoles = () => jest.fn();

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: createUsersRepositoryStub(),
        },
        {
          provide: UsersService,
          useValue: createUsersServiceStub(),
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard())
      .overrideGuard(RoleGuard)
      .useValue(mockRoleGuard())
      .overrideProvider(CurrentUser)
      .useValue(mockCurrentUser())
      .overrideProvider(Roles)
      .useValue(mockRoles())
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return paginated users', async () => {
      const params: PaginationParamsDto = {
        page: 1,
        limit: 10,
        search: 'john',
      };
      const paginatedResult: PaginatedResponse<User> = {
        data: [
          mockUser({ id: 1 }),
          mockUser({ id: 2, email: 'jane@test.com' }),
        ],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      const findAllPaginatedSpy = jest
        .spyOn(service, 'findAllPaginated')
        .mockResolvedValue(paginatedResult);

      const result = await controller.findAll(params);

      expect(findAllPaginatedSpy).toHaveBeenCalledWith(params);
      expect(result).toEqual(paginatedResult);
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toMatchObject({
        id: 1,
        email: 'john@example.com',
      });
    });
  });

  describe('findOneById()', () => {
    it('should return a user by ID', async () => {
      const user = mockUser({ id: 42 });
      const findOneByIdSpy = jest
        .spyOn(service, 'findOneById')
        .mockResolvedValue(user);

      const result = await controller.findOneById(42);

      expect(findOneByIdSpy).toHaveBeenCalledWith(42);
      expect(result).toEqual(user);
      expect(result.id).toBe(42);
    });
  });

  describe('create()', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = {
        email: 'new@admin.com',
        name: 'New Admin',
        role: UserRole.ADMIN,
        password: 'password',
      };
      const createdUser = mockUser({ ...dto, id: 100 });
      const currentUser = mockCurrentUser();

      const createUserSpy = jest
        .spyOn(service, 'createUser')
        .mockResolvedValue(createdUser);

      const result = await controller.create(dto, currentUser);

      expect(createUserSpy).toHaveBeenCalledWith(dto, currentUser);
      expect(result).toEqual(createdUser);
      expect(result.role).toBe(UserRole.ADMIN);
    });
  });

  describe('update()', () => {
    it('should update a user', async () => {
      const updateDto: UpdateUserDto = { name: 'Updated Name' };
      const updatedUser = mockUser({ id: 5, name: 'Updated Name' });
      const currentUser = mockCurrentUser();

      const updateUserSpy = jest
        .spyOn(service, 'updateUser')
        .mockResolvedValue(updatedUser);

      const result = await controller.update(5, updateDto, currentUser);

      expect(updateUserSpy).toHaveBeenCalledWith(5, updateDto, currentUser);
      expect(result.name).toBe('Updated Name');
    });
  });

  describe('delete()', () => {
    it('should delete a user', async () => {
      const deleteSpy = jest
        .spyOn(service, 'delete')
        .mockResolvedValue(undefined);

      await controller.delete(10);

      expect(deleteSpy).toHaveBeenCalledWith(10);
    });
  });
});
