import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Activity,
  ActivityStatus,
  ActivityType,
} from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import {
  BaseService,
  PaginatedResponse,
  PaginationParams,
} from '../common/base.service';
import { ActivityPaginationParamsDto } from './dto/pagination-params.dto';

@Injectable()
export class ActivitiesService extends BaseService<Activity> {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {
    super(activityRepository);
  }

  async createActivity(
    createActivityDto: CreateActivityDto,
  ): Promise<Activity> {
    const startDate = new Date(createActivityDto.start);
    const endDate = new Date(createActivityDto.end);

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const activity = this.activityRepository.create({
      name: createActivityDto.name,
      description: createActivityDto.description,
      start: startDate,
      end: endDate,
      progress: createActivityDto.progress ?? 0,
      status: createActivityDto.status ?? ActivityStatus.TODO,
      type: createActivityDto.type ?? ActivityType.TASK,
      color: createActivityDto.color,
      order: createActivityDto.order ?? 0,
    });

    // Handle dependencies - load Activity entities
    if (
      createActivityDto.dependencies &&
      createActivityDto.dependencies.length > 0
    ) {
      const dependencyIds = createActivityDto.dependencies.map(Number);
      const dependencies =
        await this.activityRepository.findByIds(dependencyIds);
      if (dependencies.length !== dependencyIds.length) {
        const foundIds = dependencies.map((d) => d.id);
        const missingIds = dependencyIds.filter((id) => !foundIds.includes(id));
        throw new NotFoundException(
          `Dependencies not found: ${missingIds.join(', ')}`,
        );
      }
      activity.dependencies = dependencies;
    } else {
      activity.dependencies = [];
    }

    return await super.create(activity);
  }

  async findAllPaginated(
    params: ActivityPaginationParamsDto,
  ): Promise<PaginatedResponse<Activity>> {
    return super.paginate(params, {
      where: { status: params.status },
      loadRelationIds: {
        relations: ['dependencies'],
      },
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOneActivity(id: number): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      where: { id },
      relations: ['dependencies'],
    });
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    return activity;
  }

  async updateActivity(
    id: number,
    updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    const activity = await this.findOneActivity(id);

    if (updateActivityDto.start && updateActivityDto.end) {
      const startDate = new Date(updateActivityDto.start);
      const endDate = new Date(updateActivityDto.end);
      if (endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    const updateData: Partial<Activity> = {};
    if (updateActivityDto.name !== undefined)
      updateData.name = updateActivityDto.name;
    if (updateActivityDto.description !== undefined)
      updateData.description = updateActivityDto.description;
    if (updateActivityDto.start !== undefined)
      updateData.start = new Date(updateActivityDto.start);
    if (updateActivityDto.end !== undefined)
      updateData.end = new Date(updateActivityDto.end);
    if (updateActivityDto.progress !== undefined)
      updateData.progress = updateActivityDto.progress;
    if (updateActivityDto.status !== undefined)
      updateData.status = updateActivityDto.status;
    if (updateActivityDto.type !== undefined)
      updateData.type = updateActivityDto.type;
    if (updateActivityDto.color !== undefined)
      updateData.color = updateActivityDto.color;
    if (updateActivityDto.order !== undefined)
      updateData.order = updateActivityDto.order;

    // Handle dependencies - load Activity entities
    if (updateActivityDto.dependencies !== undefined) {
      const dependencyIds = updateActivityDto.dependencies;
      if (dependencyIds.length > 0) {
        // Prevent self-dependency
        if (dependencyIds.includes(id)) {
          throw new BadRequestException('Activity cannot depend on itself');
        }
        const dependencies = await this.activityRepository.findByIds(
          dependencyIds.map(Number),
        );
        if (dependencies.length !== dependencyIds.length) {
          const foundIds = dependencies.map((d) => d.id);
          const missingIds = dependencyIds.filter(
            (depId) => !foundIds.includes(depId),
          );
          throw new NotFoundException(
            `Dependencies not found: ${missingIds.join(', ')}`,
          );
        }
        activity.dependencies = dependencies;
      } else {
        activity.dependencies = [];
      }
    }

    Object.assign(activity, updateData);

    await this.activityRepository.save(activity);
    return activity;
  }

  async remove(id: number): Promise<void> {
    await this.delete(id);
  }

  async findByStatus(status: ActivityStatus): Promise<Activity[]> {
    return await this.activityRepository.find({
      where: { status: status },
      relations: ['dependencies'],
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }
}
