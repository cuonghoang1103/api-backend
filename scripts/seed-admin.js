const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();
async function main() {
  // The DB uses "admin" (lowercase) as role name
  let adminRole = await prisma.role.findUnique({ where: { name: "admin" } });
  if (!adminRole) {
    adminRole = await prisma.role.create({ data: { name: "admin" } });
    console.log("Created admin role");
  } else {
    console.log("admin role already exists");
  }
  const email = "admin@cuongthai.com";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const hash = await bcrypt.hash("Admin@123456", 12);
    await prisma.user.update({
      where: { email },
      data: { username: "admin", password: hash, enabled: true, accountNonLocked: true }
    });
    const ur = await prisma.userRole.findUnique({
      where: { userId_roleId: { userId: existing.id, roleId: adminRole.id } }
    });
    if (!ur) {
      await prisma.userRole.create({ data: { userId: existing.id, roleId: adminRole.id } });
    }
    console.log("Updated admin: admin / Admin@123456");
  } else {
    const hash = await bcrypt.hash("Admin@123456", 12);
    const user = await prisma.user.create({
      data: {
        username: "admin",
        email,
        password: hash,
        fullName: "Administrator",
        enabled: true,
        accountNonExpired: true,
        accountNonLocked: true,
        credentialsNonExpired: true,
        provider: "local",
        roles: { create: { roleId: adminRole.id } }
      }
    });
    console.log("Created admin: admin / Admin@123456 (ID: " + user.id + ")");
  }
}
main()
  .catch((e) => { console.error(e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
