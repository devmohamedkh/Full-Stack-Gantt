import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import {
  Activity,
  ActivityStatus,
  ActivityType,
} from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { BaseService, PaginatedResponse } from '../common/base.service';
import { ActivityPaginationParamsDto } from './dto/pagination-params.dto';
import { User } from 'src/users/entities/user.entity';
import { ActivityResponseDto } from './dto/activity-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ActivitiesService extends BaseService<Activity> {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {
    super(activityRepository);
  }

  private async hasDependencyCycle(
    activityId: number,
    dependencies: Activity[],
  ): Promise<boolean> {
    const visited = new Set<number>();

    const checkCycle = async (currentId: number): Promise<boolean> => {
      if (visited.has(currentId)) return true;
      visited.add(currentId);

      const activity = await this.activityRepository.findOne({
        where: { id: currentId },
        relations: ['dependencies'],
      });

      for (const dep of activity?.dependencies || []) {
        if (dep.id === activityId || (await checkCycle(dep.id))) {
          return true;
        }
      }

      visited.delete(currentId);
      return false;
    };

    for (const dep of dependencies) {
      if (await checkCycle(dep.id)) return true;
    }

    return false;
  }

  private async validateDependencies(
    activityId: number,
    dependencyIds: number[],
    startDate: Date,
    activityName: string,
  ): Promise<Activity[]> {
    if (!dependencyIds?.length) return [];

    if (dependencyIds.includes(activityId)) {
      throw new BadRequestException('Activity cannot depend on itself');
    }

    const dependencies = await this.activityRepository.findBy({
      id: In(dependencyIds),
    });

    if (dependencies.length !== dependencyIds.length) {
      const foundIds = dependencies.map((d) => d.id);
      const missingIds = dependencyIds.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(
        `Dependencies not found: ${missingIds.join(', ')}`,
      );
    }

    for (const dep of dependencies) {
      if (startDate < dep.end) {
        throw new BadRequestException(
          `Finish-to-start rule violated: "${activityName}" starts before dependency "${dep.name}" ends.`,
        );
      }
    }

    if (await this.hasDependencyCycle(activityId, dependencies)) {
      throw new BadRequestException('Dependency cycle detected');
    }

    return dependencies;
  }

  async createActivity(
    createActivityDto: CreateActivityDto,
    user: User,
  ): Promise<ActivityResponseDto> {
    const {
      name,
      description,
      start,
      end,
      progress,
      status,
      type,
      color,
      order,
      dependencies,
    } = createActivityDto;

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const dependencyEntities = await this.validateDependencies(
      0,
      dependencies?.map(Number) || [],
      startDate,
      name,
    );

    const activity = this.activityRepository.create({
      name,
      description,
      start: startDate,
      end: endDate,
      progress: progress ?? 0,
      status: status ?? ActivityStatus.TODO,
      type: type ?? ActivityType.TASK,
      color,
      order: order ?? 0,
      dependencies: dependencyEntities,
      createdBy: user,
    });

    const savedActivity = await this.activityRepository.save(activity);

    return plainToInstance(
      ActivityResponseDto,
      {
        ...savedActivity,
        dependencies:
          savedActivity.dependencies?.map((d) => String(d.id)) ?? [],
      },
      { excludeExtraneousValues: true },
    );
  }

  async updateActivity(
    id: number,
    updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    const activity = await this.findOneActivity(id);

    let startDate = activity.start;
    let endDate = activity.end;

    if (updateActivityDto.start) startDate = new Date(updateActivityDto.start);
    if (updateActivityDto.end) endDate = new Date(updateActivityDto.end);

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const { dependencies, ...restDto } = updateActivityDto;

    const updateData: Partial<Activity> = {
      ...restDto,
      start: startDate,
      end: endDate,
    };

    const dependencyIds =
      dependencies !== undefined
        ? dependencies.map(Number)
        : (activity.dependencies?.map((dep) => dep.id) ?? []);

    if (dependencyIds.length > 0) {
      const validatedDeps = await this.validateDependencies(
        id,
        dependencyIds,
        startDate,
        activity.name,
      );

      if (dependencies !== undefined) {
        activity.dependencies = validatedDeps;
      }
    }

    Object.assign(activity, updateData);
    await this.activityRepository.save(activity);
    return activity;
  }

  async findAllPaginated(
    params: ActivityPaginationParamsDto,
  ): Promise<PaginatedResponse<Activity>> {
    return super.paginate(params, {
      where: { status: params.status },
      loadRelationIds: { relations: ['dependencies'] },
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }

  async findAllLockups(excludedIds: number[]): Promise<Activity[]> {
    return this.activityRepository.find({
      where: excludedIds.length > 0 ? { id: Not(In(excludedIds)) } : {},
      select: ['name', 'id'],
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOneActivity(id: number): Promise<Activity> {
    return await super.findOneById(id, { relations: ['dependencies'] });
  }

  async remove(id: number): Promise<void> {
    await super.delete(id);
  }

  async findByStatus(status: ActivityStatus): Promise<Activity[]> {
    return await this.activityRepository.find({
      where: { status: status },
      relations: ['dependencies'],
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }
}
