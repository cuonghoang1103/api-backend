/**
 * Seed admin user — production-safe version.
 *
 * Reads email/username/password from CLI args or env vars instead of
 * hardcoding weak defaults. Run with:
 *
 *   node scripts/seed-admin.cjs --email admin@x.com --username admin
 *   # then enter password at the prompt
 *
 * Or non-interactive (CI/scripted):
 *
 *   ADMIN_EMAIL=admin@x.com ADMIN_USERNAME=admin ADMIN_PASSWORD='strong-pw' \
 *     node scripts/seed-admin.cjs
 *
 * Password rules:
 *   - Minimum 12 characters (NIST 800-63B baseline)
 *   - Must include at least one letter and one digit
 *   - Refuses to use the value of a known weak default
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const readline = require("readline");
const prisma = new PrismaClient();

const WEAK_PASSWORDS = new Set([
  "Admin@123456",
  "admin",
  "password",
  "123456",
  "123456789",
  "qwerty",
  "Cuong123",
  "Cuong123@",
]);

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, "");
    out[key] = args[i + 1];
  }
  return out;
}

function promptHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    process.stdout.write(question);
    let muted = false;
    const handler = (char) => {
      const c = char + "";
      switch (c) {
        case "\n":
        case "\r":
        case "\u0004":
          process.stdout.write("\n");
          rl.close();
          break;
        default:
          if (!muted) process.stdout.write("*");
          break;
      }
    };
    rl.on("line", (line) => {
      resolve(line.trim());
    });
    process.stdin.on("data", handler);
    rl._writeToOutput = () => {};
  });
}

function validatePassword(pw) {
  if (!pw || pw.length < 12) {
    return "Password must be at least 12 characters";
  }
  if (!/[a-zA-Z]/.test(pw)) {
    return "Password must contain at least one letter";
  }
  if (!/\d/.test(pw)) {
    return "Password must contain at least one digit";
  }
  if (WEAK_PASSWORDS.has(pw)) {
    return "Password matches a known weak default — pick a different one";
  }
  return null;
}

async function getCredentials() {
  const args = parseArgs();
  const email = args.email || process.env.ADMIN_EMAIL;
  const username = args.username || process.env.ADMIN_USERNAME;
  let password = args.password || process.env.ADMIN_PASSWORD;

  if (!email) throw new Error("Missing --email (or ADMIN_EMAIL env)");
  if (!username) throw new Error("Missing --username (or ADMIN_USERNAME env)");

  if (!password) {
    if (!process.stdin.isTTY) {
      throw new Error("No password provided and stdin is not a TTY for interactive prompt");
    }
    password = await promptHidden("Admin password (min 12 chars): ");
  }

  const validationError = validatePassword(password);
  if (validationError) throw new Error(validationError);

  return { email, username, password };
}

async function main() {
  const { email, username, password } = await getCredentials();

  // Ensure admin role exists
  let adminRole = await prisma.role.findUnique({ where: { name: "admin" } });
  if (!adminRole) {
    adminRole = await prisma.role.create({ data: { name: "admin" } });
    console.log("Created admin role");
  } else {
    console.log("admin role already exists");
  }

  const hash = await bcrypt.hash(password, 12);

  // Find existing user by email OR by username
  const existingByEmail = await prisma.user.findUnique({ where: { email } });
  const existingByUsername = username
    ? await prisma.user.findUnique({ where: { username } })
    : null;
  const existing = existingByEmail || existingByUsername;

  if (existing) {
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
      },
    });
    const ur = await prisma.userRole.findUnique({
      where: { userId_roleId: { userId: existing.id, roleId: adminRole.id } },
    });
    if (!ur) {
      await prisma.userRole.create({ data: { userId: existing.id, roleId: adminRole.id } });
    }
    console.log("Updated admin: " + email + " (password rotated)");
  } else {
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
        roles: { create: { roleId: adminRole.id } },
      },
    });
    console.log("Created admin: " + email + " (ID: " + user.id + ")");
  }
  console.log("Save the password securely — it is NOT echoed back.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
