#!/usr/bin/env node
/**
 * Seed script: Create admin user
 * Usage: docker exec -i cuonghoangdev_backend node seed-admin.js
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const email = 'cuonghoang1103@gmail.com';
  const username = 'Cuong03dx';
  const password = 'Cuong123@';

  // Create ADMIN role if not exists
  let adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  if (!adminRole) {
    adminRole = await prisma.role.create({ data: { name: 'ADMIN' } });
    console.log('Created ADMIN role');
  } else {
    console.log('ADMIN role already exists');
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.log(`User ${email} already exists, updating password...`);
    await prisma.user.update({
      where: { email },
      data: { password },
    });
    // Ensure admin role
    const existingRole = await prisma.userRole.findUnique({
      where: { userId_roleId: { userId: existingUser.id, roleId: adminRole.id } },
    });
    if (!existingRole) {
      await prisma.userRole.create({
        data: { userId: existingUser.id, roleId: adminRole.id },
      });
      console.log('Added ADMIN role to existing user');
    }
  } else {
    // Create new user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,
        fullName: 'Cuong Hoang Dev',
        enabled: true,
        accountNonExpired: true,
        accountNonLocked: true,
        credentialsNonExpired: true,
        provider: 'local',
        roles: {
          create: { roleId: adminRole.id },
        },
      },
    });
    console.log(`Created admin user: ${username} / ${password}`);
    console.log(`User ID: ${user.id}`);
  }
}

main()
  .catch((e) => {
    console.error('Error:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
