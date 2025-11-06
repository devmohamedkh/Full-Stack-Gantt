import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActivityStatus, ActivityType } from '../entities/activity.entity';

export class ActivityResponseDto {
  @ApiProperty({
    description: 'Activity unique identifier',
  })
  id: string;

  @ApiProperty({
    description: 'Activity name',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Activity description',
  })
  description: string | null;

  @ApiProperty({
    description: 'Start date and time',
  })
  start: Date;

  @ApiProperty({
    description: 'End date and time',
  })
  end: Date;

  @ApiProperty({
    description: 'Progress percentage (0-100)',
    minimum: 0,
    maximum: 100,
  })
  progress: number;

  @ApiProperty({
    description: 'Activity status',
    enum: ActivityStatus,
  })
  status: ActivityStatus;

  @ApiProperty({
    description: 'Activity type',
    enum: ActivityType,
  })
  type: ActivityType;

  @ApiPropertyOptional({
    description: 'Display color (hex code)',
  })
  color: string | null;

  @ApiPropertyOptional({
    description: 'Array of activity IDs that this task depends on',
    type: [String],
  })
  dependencies: string[];

  @ApiProperty({
    description: 'Display order',
  })
  order: number;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}
