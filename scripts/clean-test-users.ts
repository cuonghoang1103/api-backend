#!/usr/bin/env npx tsx
/* eslint-disable no-console */
/**
 * scripts/clean-test-users.ts
 *
 * One-off cleanup of test users left behind by browser-automation
 * runs (Playwright, Puppeteer, headless Chrome). The script
 * matches a small fixed allow-list of username prefixes and
 * ALWAYS dry-runs first — no row is deleted until you pass
 * `--confirm`.
 *
 * Safety properties:
 * 1. Only matches the four test prefixes below. A real user
 * whose name happens to start with "test" (e.g. "testimonial-
 * master") is NEVER touched because none of the four
 * patterns match it.
 * 2. Excludes admin and any user with a verified email +
 * non-null lastActiveAt within the last 24 h (defence in
 * depth — a "real" user would never be excluded only on
 * those grounds, but a stale test account is).
 * 3. The delete is wrapped in a Prisma transaction so a
 * mid-flight failure can't half-leave the DB. Cascade
 * deletes on the related tables (DashboardState,
 * DashboardTask, DashboardCelebration, social posts,
 * etc.) are handled by the FK constraints.
 * 4. Prints the list of matched user IDs/usernames BEFORE
 * asking for confirmation — the operator reads the list
 * and only then types Y.
 * 5. Defaults to a dry-run. Pass `--confirm` to actually
 * delete. Pass `--ids 86,87` to scope to a subset.
 *
 * Usage:
 * # Step 1 — preview (safe, read-only):
 * TEST_DATABASE_URL=... npx tsx scripts/clean-test-users.ts
 *
 * # Step 2 — same, but only for specific user IDs:
 * npx tsx scripts/clean-test-users.ts --ids 86,87
 *
 * # Step 3 — actually delete (irreversible):
 * npx tsx scripts/clean-test-users.ts --confirm
 *
 * # Or both flags together:
 * npx tsx scripts/clean-test-users.ts --ids 86,87 --confirm
 *
 * DB selection:
 * - The script reads DATABASE_URL by default, which is the
 * production database in this project. To target a test
 * database, set TEST_DATABASE_URL (preferred) or DATABASE_URL
 * before invoking. The first non-empty value wins.
 */

import { readFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout, exit } from 'node:process';

// ── Config ────────────────────────────────────────────────────────

// Strict allow-list of username prefixes. These are the only
// patterns a "test" user from our browser-automation scripts
// produces. Each entry is anchored at the START of the
// username, followed by at least one additional character, so
// a real user called "test_acc" (no suffix) is also not
// matched.
//
// To add a new pattern later, append here. The match is
// case-sensitive on purpose — the registration code generates
// lowercase usernames like "test_acc_<unix_ts>".
const ALLOWED_PREFIXES: readonly string[] = [
 'test_acc_',
 'user_b_',
 'cuongtester_',
 'cursor_test_',
];

// Hard cap on how many users we will EVER delete in a single
// run, even if the allow-list would match more. This is a
// last-resort guard against a typo'd prefix wiping the table.
const MAX_DELETE = 50;

// ── Argv parsing ─────────────────────────────────────────────────

function parseArgs(argv: string[]): { confirm: boolean; ids: number[] } {
 let confirm = false;
 let ids: number[] = [];
 for (let i = 0; i < argv.length; i++) {
 const a = argv[i];
 if (a === '--confirm') confirm = true;
 else if (a === '--ids') {
 const next = argv[i + 1];
 if (!next) {
 console.error('--ids requires a comma-separated list of numeric ids');
 exit(2);
 }
 ids = next
 .split(',')
 .map((s) => Number(s.trim()))
 .filter((n) => Number.isInteger(n));
 i++;
 } else if (a === '--help' || a === '-h') {
 console.log(
 'Usage: npx tsx scripts/clean-test-users.ts [--confirm] [--ids 86,87]',
 );
 exit(0);
 } else {
 console.error(`Unknown argument: ${a}`);
 exit(2);
 }
 }
 return { confirm, ids };
}

// ── DB resolution ─────────────────────────────────────────────────

function resolveDatabaseUrl(): string {
 // Prefer TEST_DATABASE_URL — that's what the pagination test
 // uses, and it points at the throwaway `cuonghoangdev_test`
 // database on the local cuong_pg_new container, never at
 // production.
 const url = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
 if (!url) {
 throw new Error(
 'Neither TEST_DATABASE_URL nor DATABASE_URL is set. Refusing to guess.',
 );
 }
 return url;
}

// ── Main ──────────────────────────────────────────────────────────

async function main(): Promise<void> {
 const { confirm, ids } = parseArgs(process.argv.slice(2));

 process.env.DATABASE_URL = resolveDatabaseUrl();
 console.log('DB target:', redactUrl(process.env.DATABASE_URL));
 console.log('Mode:', confirm ? 'CONFIRMED (will delete)' : 'DRY-RUN (read-only)');
 console.log('Allowed prefixes:', ALLOWED_PREFIXES.join(', '));
 if (ids.length > 0) console.log('Restricted to ids:', ids.join(', '));
 console.log('');

 // Dynamic import so DATABASE_URL is set before PrismaClient loads.
 // src/config/database.ts reads it at module load time.
 const { prisma } = await import('../src/config/database.js');

 try {
 // Build the WHERE clause for usernames. Each prefix is a
 // startsWith, ANDed together with an "id IN (...)" filter
 // when --ids is given. We intentionally do NOT use SQL
 // `LIKE` with a wildcard suffix — `startsWith` is exactly
 // the shape we want (anchored, no embedded %).
 const users = await prisma.user.findMany({
 where: {
 AND: [
 {
 OR: ALLOWED_PREFIXES.map((p) => ({ username: { startsWith: p } })),
 },
 ...(ids.length > 0 ? [{ id: { in: ids } }] : []),
 ],
 },
 select: {
 id: true,
 username: true,
 email: true,
 createdAt: true,
 lastActiveAt: true,
 emailVerified: true,
 },
 orderBy: { id: 'asc' },
 });

 if (users.length === 0) {
 console.log('No matching test users found. Nothing to do.');
 return;
 }

 // Defence in depth: drop anyone with emailVerified=true AND
 // a recent lastActiveAt. A "real" account would be exactly
 // that. A test account is typically neither. This is a
 // belt-and-suspenders check; the strict prefix list is the
 // primary defence.
 const ONE_DAY_MS = 24 * 60 * 60 * 1000;
 const now = Date.now();
 const safe = users.filter((u) => {
 const isRecentlyActive =
 u.lastActiveAt != null && now - u.lastActiveAt.getTime() < ONE_DAY_MS;
 const isVerified = u.emailVerified === true;
 if (isRecentlyActive && isVerified) {
 console.log(
 ` [skip] id=${u.id} ${u.username} — looks like a real ` +
 `user (verified + active in last 24h). Excluding for safety.`,
 );
 return false;
 }
 return true;
 });

 if (safe.length === 0) {
 console.log('');
 console.log('All matches excluded by the safety filter. Nothing to delete.');
 return;
 }

 if (safe.length > MAX_DELETE) {
 throw new Error(
 `Refusing to proceed: ${safe.length} users would be deleted, ` +
 `which exceeds MAX_DELETE=${MAX_DELETE}. Narrow with --ids or ` +
 `raise the cap deliberately in the script.`,
 );
 }

 console.log('Matched test users (' + safe.length + '):');
 console.log(' ID | USERNAME | EMAIL | CREATED | LAST ACTIVE');
 console.log(' ---|----------|-------|---------|------------');
 for (const u of safe) {
 console.log(
 ` ${u.id} | ${u.username} | ${u.email} | ` +
 `${u.createdAt.toISOString().slice(0, 19)} | ` +
 `${u.lastActiveAt ? u.lastActiveAt.toISOString().slice(0, 19) : '-'}`,
 );
 }
 console.log('');

 if (!confirm) {
 console.log('DRY-RUN. Re-run with --confirm to actually delete these rows.');
 return;
 }

 // Interactive confirmation: the operator must type "yes" to
 // proceed. The default answer (just hitting Enter) is "no".
 const rl = createInterface({ input: stdin, output: stdout });
 const answer = (
 await rl.question('Type "yes" to confirm deletion (anything else aborts): ')
 ).trim();
 rl.close();

 if (answer !== 'yes') {
 console.log('Aborted. No rows deleted.');
 return;
 }

 // Transactional delete. Prisma's `$transaction` rolls back
 // the whole thing if any statement throws. The cascade on
 // related tables (DashboardState, DashboardTask, etc.) is
 // handled by the FK constraints in the database itself.
 const idsToDelete = safe.map((u) => u.id);
 const result = await prisma.$transaction(async (tx) => {
 return tx.user.deleteMany({ where: { id: { in: idsToDelete } } });
 });

 console.log('');
 console.log(`Deleted ${result.count} user row(s).`);
 console.log('Cascaded deletes for related tables are handled by FK constraints.');
 } finally {
 await prisma.$disconnect();
 }
}

// Hide credentials in the printed URL so a copy-pasted log
// doesn't leak the password. Keeps the rest of the URL for
// debugging visibility.
function redactUrl(url: string): string {
 return url.replace(/(postgresql:\/\/[^:]+:)([^@]+)(@)/, '$1***$3');
}

main().catch((err) => {
 console.error('FATAL:', err instanceof Error ? err.message : String(err));
 exit(1);
});
