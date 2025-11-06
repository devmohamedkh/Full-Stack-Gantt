import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationParamsDto } from 'src/common/dto/pagination-params.dto';
import { ActivityStatus } from '../entities/activity.entity';

export class ActivityPaginationParamsDto extends PaginationParamsDto {
  @ApiProperty({
    description: 'Filter activities by status',
    required: false,
    enum: ActivityStatus,
  })
  @IsOptional()
  status?: ActivityStatus;
}
