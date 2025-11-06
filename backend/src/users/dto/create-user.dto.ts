import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsOptional,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {

  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @ApiProperty({})
  @IsEmail()
  @IsNotEmpty()
  @Length(1, 255)
  email: string;

  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  @Length(6, 255)
  password: string;

  @ApiProperty({})
  @IsEnum(UserRole, { message: 'role must be a valid user role' })
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Length(0, 20)
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  personalId?: string;
}
