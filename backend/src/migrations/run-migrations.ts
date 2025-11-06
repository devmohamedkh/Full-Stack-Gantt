import { dataSource } from '../../data-source';

async function runMigrations() {
  try {
    console.log('Initializing database connection...');
    await dataSource.initialize();

    console.log('Running migrations...');
    const migrations = await dataSource.runMigrations();

    if (migrations.length === 0) {
      console.log('No migrations to run. Database is up to date.');
    } else {
      console.log(`Successfully ran ${migrations.length} migration(s):`);

      for (const migration of migrations) {
        console.log(`  - ${migration.name}`);
      }
    }

    await dataSource.destroy();
    console.log('Migrations completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

void runMigrations();
