import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateRefreshTokensTable1731013000002
  implements MigrationInterface
{
  name = 'CreateRefreshTokensTable1731013000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'refresh_tokens',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'token',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'expiresAt',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'isRevoked',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'userId',
            type: 'int',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
            name: 'FK_refresh_tokens_user',
          },
        ],
      }),
      true,
    );
    await queryRunner.createIndex(
      'refresh_tokens',
      new TableIndex({
        name: 'IDX_REFRESH_TOKEN_TOKEN',
        columnNames: ['token'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
  }
}
