import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateActivitiesTable1731013000001 implements MigrationInterface {
  name = 'CreateActivitiesTable1731013000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'activities',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'start_date',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'end_date',
            type: 'timestamp',
            isNullable: false,
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
            default: `'todo'`,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['task', 'project', 'milestone'],
            default: `'task'`,
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
            name: 'createdById',
            type: 'int',
            isNullable: true,
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

    await queryRunner.createForeignKey(
      'activities',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        name: 'FK_activities_createdById',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'activity_dependencies',
        columns: [
          {
            name: 'activity_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'dependency_id',
            type: 'int',
            isPrimary: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['activity_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'activities',
            onDelete: 'CASCADE',
            name: 'FK_activity_dependencies_activity',
          },
          {
            columnNames: ['dependency_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'activities',
            onDelete: 'CASCADE',
            name: 'FK_activity_dependencies_dependency',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('activity_dependencies');
    await queryRunner.dropForeignKey('activities', 'FK_activities_createdById');
    await queryRunner.dropTable('activities');
  }
}
