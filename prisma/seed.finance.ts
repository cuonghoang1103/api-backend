/* eslint-disable */
/**
 * Prisma seed — MoneyFlow defaults for a single user.
 * Run:  npm run db:seed:finance -- [userId]     (defaults to userId 1)
 *
 * Idempotent & safe to re-run: if the user already has wallets or categories,
 * that part is skipped. Nothing is ever deleted. Seeds:
 *  - 3 default wallets (Tiền mặt, Ngân hàng, Momo)
 *  - 10 Vietnamese expense categories with emoji + colour
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const WALLETS = [
  { name: 'Tiền mặt', type: 'CASH', icon: '💵', color: '#22c55e' },
  { name: 'Ngân hàng', type: 'BANK', icon: '🏦', color: '#3b82f6' },
  { name: 'Momo', type: 'EWALLET', icon: '📱', color: '#d946ef' },
];

const CATEGORIES = [
  { name: 'Ăn uống', icon: '🍜', color: '#f97316' },
  { name: 'Đi lại', icon: '🛵', color: '#06b6d4' },
  { name: 'Nhà cửa', icon: '🏠', color: '#8b5cf6' },
  { name: 'Hóa đơn', icon: '💡', color: '#eab308' },
  { name: 'Mua sắm', icon: '🛍️', color: '#ec4899' },
  { name: 'Giải trí', icon: '🎮', color: '#a855f7' },
  { name: 'Sức khỏe', icon: '💊', color: '#ef4444' },
  { name: 'Học tập', icon: '📚', color: '#0ea5e9' },
  { name: 'Cà phê', icon: '☕', color: '#92400e' },
  { name: 'Khác', icon: '📦', color: '#64748b' },
];

async function main() {
  const userIdArg = process.argv[2];
  const userId = userIdArg ? Number(userIdArg) : 1;
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error(`Invalid userId: ${userIdArg}`);
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true } });
  if (!user) throw new Error(`User ${userId} not found — pass an existing userId: npm run db:seed:finance -- <id>`);
  console.log(`\nSeeding MoneyFlow defaults for user #${user.id} (${user.username})`);

  const existingWallets = await prisma.wallet.count({ where: { userId } });
  if (existingWallets === 0) {
    await prisma.wallet.createMany({
      data: WALLETS.map((w, i) => ({ userId, name: w.name, type: w.type, icon: w.icon, color: w.color, order: i })),
    });
    console.log(`  ✓ created ${WALLETS.length} wallets`);
  } else {
    console.log(`  • wallets already exist (${existingWallets}) — skipped`);
  }

  const existingCats = await prisma.expenseCategory.count({ where: { userId } });
  if (existingCats === 0) {
    await prisma.expenseCategory.createMany({
      data: CATEGORIES.map((c, i) => ({ userId, name: c.name, icon: c.icon, color: c.color, order: i })),
    });
    console.log(`  ✓ created ${CATEGORIES.length} expense categories`);
  } else {
    console.log(`  • categories already exist (${existingCats}) — skipped`);
  }

  console.log('Done.\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
