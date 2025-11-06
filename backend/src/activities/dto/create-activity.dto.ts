import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  IsEnum,
  IsOptional,
  IsArray,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActivityStatus, ActivityType } from '../entities/activity.entity';

export class CreateActivityDto {
  @ApiProperty({
    description: 'Activity name',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Activity description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Start date and time (ISO 8601 format)',
  })
  @IsDateString()
  @IsNotEmpty()
  start: string;

  @ApiProperty({
    description: 'End date and time (ISO 8601 format)',
  })
  @IsDateString()
  @IsNotEmpty()
  end: string;

  @ApiPropertyOptional({
    description: 'Progress percentage (0-100)',
    minimum: 0,
    maximum: 100,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({
    description: 'Activity status',
    enum: ActivityStatus,
    default: ActivityStatus.TODO,
  })
  @IsEnum(ActivityStatus)
  @IsOptional()
  status?: ActivityStatus;

  @ApiPropertyOptional({
    description: 'Activity type',
    enum: ActivityType,
    default: ActivityType.TASK,
  })
  @IsEnum(ActivityType)
  @IsOptional()
  type?: ActivityType;

  @ApiPropertyOptional({
    description: 'Display color (hex code)',
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({
    description: 'Array of activity IDs that this task depends on',
    type: [String],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  dependencies?: number[];

  @ApiPropertyOptional({
    description: 'Display order',
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order?: number;
}
