import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './create-activity.dto';

/**
 * DTO for updating an activity.
 * All fields from CreateActivityDto are optional.
 * Useful for partial updates, especially for drag/resize operations on the Gantt chart.
 */
export class UpdateActivityDto extends PartialType(CreateActivityDto) {}

