const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  let adminRole = await prisma.role.findUnique({ where: { name: "admin" } });
  if (!adminRole) {
    adminRole = await prisma.role.create({ data: { name: "admin" } });
    console.log("Created admin role");
  } else {
    console.log("admin role already exists");
  }

  const email = "cuong03dx@gmail.com";
  const username = "Cuong03dx";
  const password = "Cuong123";
  const hash = await bcrypt.hash(password, 12);

  const existingByEmail = await prisma.user.findUnique({ where: { email } });
  const existingByUsername = await prisma.user.findUnique({ where: { username } });
  const existing = existingByEmail || existingByUsername;

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        email: existingByEmail ? undefined : email,
        username: existingByUsername ? undefined : username,
        password: hash,
        fullName: existing.fullName || "Cuong03dx",
        enabled: true,
        accountNonExpired: true,
        accountNonLocked: true,
        credentialsNonExpired: true,
      }
    });
    const ur = await prisma.userRole.findUnique({
      where: { userId_roleId: { userId: existing.id, roleId: adminRole.id } }
    });
    if (!ur) {
      await prisma.userRole.create({ data: { userId: existing.id, roleId: adminRole.id } });
    }
    console.log("Updated user: " + username + " / " + password + " (ID: " + existing.id + ")");
  } else {
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hash,
        fullName: "Cuong03dx",
        enabled: true,
        accountNonExpired: true,
        accountNonLocked: true,
        credentialsNonExpired: true,
        provider: "local",
        roles: { create: { roleId: adminRole.id } }
      }
    });
    console.log("Created admin: " + username + " / " + password + " (ID: " + user.id + ")");
  }
}

main()
  .catch((e) => {
    console.error("Seed error:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
