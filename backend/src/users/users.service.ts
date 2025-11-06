import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import {
  BaseService,
  PaginationParams,
  PaginatedResponse,
} from '../common/base.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }

  async findAllPaginated(
    params: PaginationParams,
  ): Promise<PaginatedResponse<User>> {
    return this.paginate(params, {
      where: [
        { name: Like(`%${params.search || ''}%`) },
        { email: Like(`%${params.search || ''}%`) },
      ],
    });
  }

  async findByRole(
    role: UserRole,
    params: PaginationParams,
  ): Promise<PaginatedResponse<User>> {
    return this.paginate(params, { where: { role } });
  }

  async createUser(
    createUserDto: CreateUserDto,
    currentUser: User,
  ): Promise<User> {
    this.isSuperAdminCreating(createUserDto, currentUser);

    const user = await super.create(createUserDto);
    const { password, ...curUser } = user;
    return curUser as User;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    requestingUser: User,
  ): Promise<User> {
    const { ...userDataToUpdate } = updateUserDto;
    const userToUpdate = await this.findOneById(id);

    this.canUpdateUser(id, userToUpdate, requestingUser);

    return super.update(id, userDataToUpdate);
  }

  async findByEmailAnd(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role'],
    });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.findOneById(id);
  }

  isSuperAdminCreating(dto: CreateUserDto, currentUser: User): void {
    if (
      dto.role === UserRole.SUPER_ADMIN &&
      currentUser.role !== UserRole.SUPER_ADMIN
    ) {
      throw new BadRequestException('role is not valid');
    }
  }

  private canUpdateUser(
    id: number,
    userToUpdate: User,
    currentUser: User,
  ): void {
    const isOwner = userToUpdate.id === id;
    const isAdmin = currentUser.role === UserRole.ADMIN;
    const isSuperAdmin = currentUser.role === UserRole.SUPER_ADMIN;

    if (!isOwner && !isAdmin && !isSuperAdmin) {
      throw new ForbiddenException('You can only update your own data');
    }
  }
}
