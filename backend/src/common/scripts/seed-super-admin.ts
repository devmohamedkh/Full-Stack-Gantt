import { createConnection } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import * as dotenv from 'dotenv';
dotenv.config();

async function seedSuperAdmin() {
  const connection = await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
  });

  try {
    const userRepository = connection.getRepository(User);

    // Check if SUPER_ADMIN exists
    const existingSuperAdmin = await userRepository.findOne({
      where: { role: UserRole.SUPER_ADMIN },
    });

    console.log({ existingSuperAdmin });

    if (existingSuperAdmin) {
      console.log('Super Admin already exists:', existingSuperAdmin.email);
      return;
    }

    // Create SUPER_ADMIN
    const password = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin123!';
    const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@yourdomain.com';

    const superAdmin = userRepository.create({
      email,
      password,
      name: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
    });

    await userRepository.save(superAdmin);
    console.log('Super Admin created:', superAdmin.email);
  } catch (error) {
    console.error('Error seeding Super Admin:', error);
  } finally {
    await connection.close();
  }
}

seedSuperAdmin().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
