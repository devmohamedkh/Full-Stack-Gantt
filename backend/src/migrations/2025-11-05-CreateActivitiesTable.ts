import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateActivitiesTable20251105 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'activities',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'start_date',
            type: 'timestamp',
          },
          {
            name: 'end_date',
            type: 'timestamp',
          },
          {
            name: 'progress',
            type: 'int',
            default: 0,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['todo', 'in_progress', 'completed', 'blocked'],
            default: "'todo'",
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['task', 'project', 'milestone'],
            default: "'task'",
          },
          {
            name: 'color',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'order',
            type: 'int',
            default: 0,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create indexes for better query performance
    await queryRunner.createIndex(
      'activities',
      new TableIndex({
        name: 'IDX_ACTIVITIES_STATUS',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'activities',
      new TableIndex({
        name: 'IDX_ACTIVITIES_TYPE',
        columnNames: ['type'],
      }),
    );

    await queryRunner.createIndex(
      'activities',
      new TableIndex({
        name: 'IDX_ACTIVITIES_ORDER',
        columnNames: ['order'],
      }),
    );

    // Create join table for ManyToMany dependencies relation
    await queryRunner.createTable(
      new Table({
        name: 'activity_dependencies',
        columns: [
          {
            name: 'activity_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'dependency_id',
            type: 'uuid',
            isPrimary: true,
          },
        ],
      }),
      true,
    );

    // Add foreign keys for dependencies join table
    await queryRunner.createForeignKey(
      'activity_dependencies',
      new TableForeignKey({
        columnNames: ['activity_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'activities',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'activity_dependencies',
      new TableForeignKey({
        columnNames: ['dependency_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'activities',
        onDelete: 'CASCADE',
      }),
    );

    // Create indexes on join table
    await queryRunner.createIndex(
      'activity_dependencies',
      new TableIndex({
        name: 'IDX_ACTIVITY_DEPENDENCIES_ACTIVITY_ID',
        columnNames: ['activity_id'],
      }),
    );

    await queryRunner.createIndex(
      'activity_dependencies',
      new TableIndex({
        name: 'IDX_ACTIVITY_DEPENDENCIES_DEPENDENCY_ID',
        columnNames: ['dependency_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop join table first
    await queryRunner.dropTable('activity_dependencies');
    await queryRunner.dropTable('activities');
  }
}
