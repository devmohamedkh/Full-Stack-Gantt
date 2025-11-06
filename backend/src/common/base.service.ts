import { Injectable } from '@nestjs/common';
import {
  Repository,
  FindManyOptions,
  DeepPartial,
  ObjectLiteral,
  FindOptionsWhere,
} from 'typeorm';

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export abstract class BaseService<T extends ObjectLiteral> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async paginate(
    params: PaginationParams = {},
    options?: FindManyOptions<T>,
  ): Promise<PaginatedResponse<T>> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 10));
    const skip = (page - 1) * limit;

    const [data, total] = await this.repository.findAndCount({
      skip,
      take: limit,
      ...options,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAll(options: FindManyOptions<T> = {}): Promise<T[]> {
    return this.repository.find({
      ...options,
    });
  }

  async findOneById(id: number): Promise<T> {
    const where: FindOptionsWhere<T> = { id } as unknown as FindOptionsWhere<T>;

    const entity = await this.repository.findOne({ where });

    if (!entity) {
      throw new Error(`${this.repository.metadata.tableName} not found`);
    }

    return entity;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number, data: DeepPartial<T>): Promise<T> {
    const where = { id } as unknown as FindOptionsWhere<T>;

    const entity = await this.repository.findOne({ where });

    if (!entity) {
      throw new Error(`${this.repository.metadata.tableName} not found`);
    }

    await this.repository.update(where, data as any);

    return this.findOneById(id);
  }

  async delete(id: number): Promise<void> {
    const where: FindOptionsWhere<T> = { id } as unknown as FindOptionsWhere<T>;

    const result = await this.repository.delete(where);

    if (result.affected === 0) {
      throw new Error(`${this.repository.metadata.tableName} not found`);
    }
  }
}
