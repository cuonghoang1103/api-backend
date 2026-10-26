// dung-db-kiem-thu.js — build the TEST database from nothing: empty DB → `prisma migrate deploy` → a small fixture.
// It is the proof that the migrations rebuild a faithful schema (CHECKs and identities included — see C2).
// Run: npm run db:test   (uses ADMIN_URL, DIRECT_URL and TEST_DATABASE_URL from .env)
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';

const testUrl = new URL(process.env.TEST_DATABASE_URL);
const ten = testUrl.pathname.slice(1);
if (!/^[a-z0-9_]+_test$/.test(ten)) throw new Error(`refusing: the test database name must end in _test (got "${ten}")`);
const coMigration = existsSync('prisma/migrations') && readdirSync('prisma/migrations').some((d) => existsSync(`prisma/migrations/${d}/migration.sql`));
if (!coMigration) { console.error('✗ no migration in prisma/migrations — do C2 first: the test database is built FROM your migrations'); process.exit(1); }
const voiDb = (u, db) => { const x = new URL(u); x.pathname = `/${db}`; return x.href; };

async function chay(url, cauLenh) {
  const p = new PrismaClient({ datasourceUrl: url });
  try { for (const c of cauLenh) await p.$executeRawUnsafe(c); } finally { await p.$disconnect(); }
}

// 1 · a fresh, empty database owned by ctshop_owner; only the two roles may connect
await chay(process.env.ADMIN_URL, [`DROP DATABASE IF EXISTS ${ten} WITH (FORCE)`, `CREATE DATABASE ${ten} OWNER ctshop_owner`]);
await chay(voiDb(process.env.ADMIN_URL, ten), [
  `REVOKE ALL ON DATABASE ${ten} FROM PUBLIC`,
  `GRANT CONNECT ON DATABASE ${ten} TO ctshop_owner, ctshop_app`,
  'CREATE SCHEMA shop AUTHORIZATION ctshop_owner',
  'GRANT USAGE ON SCHEMA shop TO ctshop_app',
  'ALTER DEFAULT PRIVILEGES FOR ROLE ctshop_owner IN SCHEMA shop GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ctshop_app',
  'ALTER DEFAULT PRIVILEGES FOR ROLE ctshop_owner IN SCHEMA shop GRANT USAGE, SELECT ON SEQUENCES TO ctshop_app',
]);

// 2 · the schema = the migrations, applied by the owner (exactly what a deploy does)
execFileSync('npx', ['prisma', 'migrate', 'deploy'], {
  stdio: 'inherit', shell: process.platform === 'win32',
  env: { ...process.env, DIRECT_URL: voiDb(process.env.DIRECT_URL, ten), PRISMA_HIDE_UPDATE_MESSAGE: '1' },
});

// TODO C2 · the last test ("the app role cannot change the schema") fails until you find what the default privileges
//           of roles.sql gave the app role by accident — fix it on ctlab9 AND here, for the test database.

// 3 · a small fixture, written by the APP role (if a grant is missing, this is where it shows)
const prisma = new PrismaClient({ datasourceUrl: process.env.TEST_DATABASE_URL });
const goc = await prisma.category.create({ data: { name: 'Bút & mực' } });
const but = await prisma.category.create({ data: { name: 'Bút bi', parent_id: goc.id } });
await prisma.product.createMany({ data: [
  { sku: 'T001', name: 'Bút bi test xanh', category_id: but.id, price: 5000, stock: 100 },
  { sku: 'T002', name: 'Bút bi test đỏ', category_id: but.id, price: 6000, stock: 100 },
  { sku: 'T003', name: 'Bút gel còn 1 cây', category_id: but.id, price: 19000, stock: 1 },
  { sku: 'T004', name: 'Bút hết hàng', category_id: but.id, price: 7000, stock: 0 },
  { sku: 'T005', name: 'Bút ngừng bán', category_id: but.id, price: 8000, stock: 50, is_active: false },
  { sku: 'T006', name: 'Bút cho thử tải', category_id: but.id, price: 4000, stock: 100000 },
] });
await prisma.customer.createMany({ data: Array.from({ length: 20 }, (_, i) => ({ email: `test${i + 1}@ctshop.vn`, full_name: `Khách test ${i + 1}` })) });
console.log(`✓ ${ten}: migrations applied, fixture = 2 categories · ${await prisma.product.count()} products · ${await prisma.customer.count()} customers`);
await prisma.$disconnect();
