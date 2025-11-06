import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActivityStatus, ActivityType } from '../entities/activity.entity';

export class ActivityResponseDto {
  @ApiProperty({
    description: 'Activity unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Activity name',
    example: 'Design UI Mockups',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Activity description',
    example: 'Create wireframes and mockups for the dashboard',
  })
  description: string | null;

  @ApiProperty({
    description: 'Start date and time',
    example: '2024-01-15T00:00:00.000Z',
  })
  start: Date;

  @ApiProperty({
    description: 'End date and time',
    example: '2024-01-20T23:59:59.000Z',
  })
  end: Date;

  @ApiProperty({
    description: 'Progress percentage (0-100)',
    example: 0,
    minimum: 0,
    maximum: 100,
  })
  progress: number;

  @ApiProperty({
    description: 'Activity status',
    enum: ActivityStatus,
    example: ActivityStatus.TODO,
  })
  status: ActivityStatus;

  @ApiProperty({
    description: 'Activity type',
    enum: ActivityType,
    example: ActivityType.TASK,
  })
  type: ActivityType;

  @ApiPropertyOptional({
    description: 'Display color (hex code)',
    example: '#3498db',
  })
  color: string | null;

  @ApiPropertyOptional({
    description: 'Array of activity IDs that this task depends on',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
  })
  dependencies: string[];

  @ApiProperty({
    description: 'Display order',
    example: 0,
  })
  order: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-10T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-10T12:00:00.000Z',
  })
  updatedAt: Date;
}
