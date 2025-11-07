import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
  ParseArrayPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivityResponseDto } from './dto/activity-response.dto';
import { ActivityStatus } from './entities/activity.entity';
import { ActivityPaginationParamsDto } from './dto/pagination-params.dto';
import { JwtAuthGuard } from 'src/auth/guard';

@ApiTags('activities')
@UseGuards(JwtAuthGuard)
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new activity' })
  @ApiCreatedResponse({
    description: 'Activity successfully created',
    type: ActivityResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or validation failed',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.createActivity(createActivityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all activities' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ActivityStatus,
    description: 'Filter activities by status',
  })
  @ApiOkResponse({
    description: 'List of activities retrieved successfully',
    type: [ActivityResponseDto],
  })
  findAll(@Query() params: ActivityPaginationParamsDto) {
    return this.activitiesService.findAllPaginated(params);
  }

  @Get('/lockups')
  @ApiOperation({ summary: 'Get all activities' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ActivityStatus,
    description: 'Filter activities by status',
  })
  @ApiOkResponse({
    description: 'List of activities retrieved successfully',
    type: [ActivityResponseDto],
  })
  findAllLockups(
    @Query(
      'excludedIds',
      new ParseArrayPipe({ items: Number, separator: ',', optional: true }),
    )
    excludedIds: number[] = [],
  ) {
    return this.activitiesService.findAllLockups(excludedIds);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single activity by ID' })
  @ApiParam({
    name: 'id',
    description: 'Activity id',
  })
  @ApiOkResponse({
    description: 'Activity retrieved successfully',
    type: ActivityResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Activity not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.findOneActivity(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an activity',
    description:
      'Update activity fields. Supports partial updates. Useful for drag/resize operations on the Gantt chart.',
  })
  @ApiParam({
    name: 'id',
    description: 'Activity UUID',
  })
  @ApiOkResponse({
    description: 'Activity updated successfully',
    type: ActivityResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or validation failed',
  })
  @ApiNotFoundResponse({ description: 'Activity not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activitiesService.updateActivity(id, updateActivityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an activity' })
  @ApiParam({
    name: 'id',
    description: 'Activity id',
  })
  @ApiNoContentResponse({ description: 'Activity deleted successfully' })
  @ApiNotFoundResponse({ description: 'Activity not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.remove(id);
  }
}
