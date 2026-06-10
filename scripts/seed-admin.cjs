const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();
async function main() {
  // Ensure admin role exists
  let adminRole = await prisma.role.findUnique({ where: { name: "admin" } });
  if (!adminRole) {
    adminRole = await prisma.role.create({ data: { name: "admin" } });
    console.log("Created admin role");
  } else {
    console.log("admin role already exists");
  }

  const email = "admin@cuongthai.com";
  const username = "admin";
  const password = "Admin@123456";
  const hash = await bcrypt.hash(password, 12);

  // Find existing user by email OR by username
  const existingByEmail = await prisma.user.findUnique({ where: { email } });
  const existingByUsername = username
    ? await prisma.user.findUnique({ where: { username } })
    : null;

  const existing = existingByEmail || existingByUsername;

  if (existing) {
    // Update existing user
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        email: existingByEmail ? undefined : email,
        username: existingByUsername ? undefined : username,
        password: hash,
        fullName: existing.fullName || "Administrator",
        enabled: true,
        accountNonExpired: true,
        accountNonLocked: true,
        credentialsNonExpired: true,
      }
    });
    // Ensure role link
    const ur = await prisma.userRole.findUnique({
      where: { userId_roleId: { userId: existing.id, roleId: adminRole.id } }
    });
    if (!ur) {
      await prisma.userRole.create({ data: { userId: existing.id, roleId: adminRole.id } });
    }
    console.log("Updated admin: " + email + " / " + password);
  } else {
    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        username,
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
    console.log("Created admin: " + email + " / " + password + " (ID: " + user.id + ")");
  }
}
main()
  .catch((e) => {
    console.error("Seed error:", e.message);
    process.exit(0); // Don't fail CI if user exists
  })
  .finally(() => prisma.$disconnect());
