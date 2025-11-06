import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginatedResponse } from '../common/base.service';
import { PaginationParamsDto } from '../common/dto/pagination-params.dto';
import { CreateUserDto, UpdateUserDto } from './dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { JwtAuthGuard } from 'src/auth/guard';
import { CurrentUser, Roles } from 'src/common/decorators';

@ApiTags('users')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: User,
    isArray: true,
  })
  findAll(
    @Query() params: PaginationParamsDto,
  ): Promise<PaginatedResponse<User>> {
    return this.usersService.findAllPaginated(params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User details', type: User })
  findOneById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created', type: User })
  create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.usersService.createUser(createUserDto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated', type: User })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto, user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.delete(id);
  }
}
