import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export function generatePaginatedResponse<T>(itemType: Type<T>) {
  class PaginatedResponseClass {
    @ApiProperty({
      description: 'Array of items',
      type: [itemType], // Ensures correct type mapping in Swagger
    })
    data: T[];

    @ApiProperty({ description: 'Total number of items', example: 50 })
    total: number;

    @ApiProperty({ description: 'Current page number', example: 1 })
    page: number;

    @ApiProperty({ description: 'Number of items per page', example: 10 })
    limit: number;

    @ApiProperty({ description: 'Total number of pages', example: 5 })
    totalPages: number;
  }

  return PaginatedResponseClass;
}
