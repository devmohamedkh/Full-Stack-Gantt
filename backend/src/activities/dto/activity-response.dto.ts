import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActivityStatus, ActivityType } from '../entities/activity.entity';
import { Expose } from 'class-transformer';

export class ActivityResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Activity unique identifier',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Activity name',
  })
  name: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Activity description',
  })
  description: string;

  @Expose()
  @ApiProperty({
    description: 'Start date and time',
  })
  start: Date;

  @Expose()
  @ApiProperty({
    description: 'End date and time',
  })
  end: Date;

  @Expose()
  @ApiProperty({
    description: 'Progress percentage (0-100)',
    minimum: 0,
    maximum: 100,
  })
  progress: number;

  @Expose()
  @ApiProperty({
    description: 'Activity status',
    enum: ActivityStatus,
  })
  status: ActivityStatus;

  @Expose()
  @ApiProperty({
    description: 'Activity type',
    enum: ActivityType,
  })
  type: ActivityType;

  @Expose()
  @ApiPropertyOptional({
    description: 'Display color (hex code)',
  })
  color: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Array of activity IDs that this task depends on',
    type: [String],
  })
  dependencies: string[];

  @Expose()
  @ApiProperty({
    description: 'Display order',
  })
  order: number;

  @Expose()
  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}
