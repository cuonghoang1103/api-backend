/**
 * scripts/test-comments-pagination.ts
 * ====================================
 *
 * Smoke test for the cursor-based pagination in
 * `src/services/social.service.ts:getComments`.
 *
 * Strategy:
 * 1. Connect to a local Postgres (set TEST_DATABASE_URL).
 * 2. Pick a fresh post (create if none).
 * 3. Insert 25 top-level comments with monotonically increasing
 * `createdAt` so we can predict the ASC order.
 * 4. Walk through 3 pages of `limit: 10`:
 * - page 1: no cursor → 10 oldest
 * - page 2: cursor = page1.nextCursor → 10 next
 * - page 3: cursor = page2.nextCursor → 5 remaining
 * 5. Assert: no overlap, no misses, hasNextPage flips correctly,
 * nextCursor is null on the last page.
 * 6. Edge case: `limit: 100` returns all 25 with no nextCursor.
 * 7. Cleanup: delete the 25 inserted comments.
 *
 * Usage:
 * TEST_DATABASE_URL=postgresql://postgres:123456@localhost:5433/cuonghoangdev_test \
 * npx tsx scripts/test-comments-pagination.ts
 *
 * Exit code 0 = all assertions pass, 1 = any failure.
 */

// IMPORTANT: set DATABASE_URL BEFORE importing anything that touches Prisma.
// `src/config/database.ts` reads `process.env.DATABASE_URL` at module
// load (line 22). ES module hoisting means all `import` statements are
// evaluated *before* any top-level code runs, so we cannot set
// `process.env.DATABASE_URL` synchronously and expect the imported Prisma
// client to see it. The fix is to use dynamic `import()` inside main(),
// after we've set the env var. See the lazy import at the top of
// `main()` for the actual call.
// Usage:
// TEST_DATABASE_URL=postgresql://... npx tsx scripts/test-comments-pagination.ts
// or
// DATABASE_URL=postgresql://... npx tsx scripts/test-comments-pagination.ts

// We accept either name. Validate early so we fail fast with a useful
// message instead of a cryptic Prisma error mid-run.
if (!process.env.TEST_DATABASE_URL && !process.env.DATABASE_URL) {
 console.error(
 'No database URL provided. Set TEST_DATABASE_URL or DATABASE_URL.\n' +
 'Example:\n' +
 ' TEST_DATABASE_URL=postgresql://postgres:123456@localhost:5433/cuonghoangdev_test \\\n' +
 ' npx tsx scripts/test-comments-pagination.ts',
 );
 process.exit(2);
}
process.env.DATABASE_URL =
 process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
process.env.DATABASE_URL_OVERRIDDEN = '1';

// We import inside `main()` via dynamic `import()` so the env var
// is in place *before* `src/config/database.ts` evaluates
// `process.env.DATABASE_URL` at module load. The static imports
// below are unused but kept commented for IDEs that flag unused
// files; we only use the dynamically imported ones.
// import { prisma } from '../src/config/database.js';
// import { getComments } from '../src/services/social.service.js';


const TOTAL = 25;
const PAGE_SIZE = 10;

interface TestResult {
 name: string;
 passed: boolean;
 detail: string;
}

const results: TestResult[] = [];

function assert(name: string, condition: boolean, detail = '') {
 results.push({ name, passed: condition, detail });
 const status = condition ? '✓' : '✗';
 const colour = condition ? '\x1b[32m' : '\x1b[31m';
 console.log(` ${colour}${status}\x1b[0m ${name}${detail ? ` — ${detail}` : ''}`);
}

async function main() {
 // Dynamic imports — see comment block at top of file.
 const { prisma } = await import('../src/config/database.js');
 const { getComments } = await import('../src/services/social.service.js');

 // 1) Find or create a test post
 let post = await prisma.socialPost.findFirst({
 where: { content: { startsWith: '[test-pagination]' } },
 orderBy: { id: 'asc' },
 });
 const testUser = await prisma.user.findFirst();
 if (!testUser) {
 console.error('No user in DB. Cannot create test post.');
 process.exit(1);
 }
 if (!post) {
 post = await prisma.socialPost.create({
 data: {
 authorId: testUser.id,
 content: '[test-pagination] synthetic post for cursor pagination test',
 visibility: 'PUBLIC',
 },
 });
 console.log(` Created synthetic post id=${post.id} authorId=${testUser.id}`);
 } else {
 console.log(` Reusing existing test post id=${post.id}`);
 }

 // 2) Clean any prior test comments on this post
 const deleted = await prisma.socialComment.deleteMany({
 where: { postId: post.id },
 });
 console.log(` Cleaned ${deleted.count} prior test comment(s)`);

 // 3) Insert 25 comments with deterministic createdAt order
 const now = Date.now();
 const insertedIds: number[] = [];
 for (let i = 0; i < TOTAL; i++) {
 const c = await prisma.socialComment.create({
 data: {
 postId: post.id,
 userId: testUser.id,
 parentId: null,
 content: `[test #${i + 1}/${TOTAL}]`,
 createdAt: new Date(now + i * 1000),
 },
 });
 insertedIds.push(c.id);
 }
 console.log(` Inserted ${insertedIds.length} comments (ids ${insertedIds[0]}..${insertedIds.at(-1)})`);
 // Sanity: insertedIds must equal the ASC order we'd expect.
 // (We constructed them with increasing createdAt, so they should.)

 // 4) Walk pages
 const allReturned: number[] = [];
 let cursor: number | undefined = undefined;
 let pageNum = 0;

 while (true) {
 pageNum++;
 const page = await getComments(post.id, { limit: PAGE_SIZE, cursor });
 console.log(
 ` page ${pageNum}: returned ${page.data.length}, hasNextPage=${page.pagination.hasNextPage}, ` +
 `nextCursor=${page.pagination.nextCursor}`,
 );
 // Record the IDs in the order they were returned
 for (const c of page.data) allReturned.push(c.id);

 assert(
 `page ${pageNum} returns <= ${PAGE_SIZE} items`,
 page.data.length <= PAGE_SIZE,
 `got ${page.data.length}`,
 );

 if (page.pagination.hasNextPage) {
 assert(
 `page ${pageNum} has nextCursor when hasNextPage is true`,
 page.pagination.nextCursor != null,
 );
  // The nextCursor must point to the NEWEST item in this page
  // (the last element of `page.data`). With `orderBy: id ASC` +
  // positional `cursor: { id }` + `skip: 1`, the next call steps
  // past the last id and continues forward in ASC order.
  // (Asserting `items[0]?.id` would be wrong under ASC.)
  const newestInPage = page.data[page.data.length - 1]?.id;
  assert(
  `page ${pageNum} nextCursor === items[items.length-1].id (newest in page)`,
  page.pagination.nextCursor === newestInPage,
  `nextCursor=${page.pagination.nextCursor}, newestInPage=${newestInPage}`,
  );
 cursor = page.pagination.nextCursor ?? undefined;
 } else {
 assert(
 `page ${pageNum} nextCursor is null when hasNextPage is false`,
 page.pagination.nextCursor === null,
 );
 break;
 }
 if (pageNum > 10) {
 console.error(' Runaway pagination loop — aborting');
 process.exit(1);
 }
 }

 // 5) Aggregate assertions
 const expected = insertedIds.slice(); // ASC by construction
 assert(
 `total items returned across all pages = ${TOTAL}`,
 allReturned.length === TOTAL,
 `got ${allReturned.length}`,
 );
 assert(
 'union of pages matches inserted order (no overlap, no miss, ASC)',
 JSON.stringify(allReturned) === JSON.stringify(expected),
 );

 // 6) Edge: limit > total
 const bigPage = await getComments(post.id, { limit: 100 });
 assert(
 `limit=100 returns all ${TOTAL}`,
 bigPage.data.length === TOTAL,
 `got ${bigPage.data.length}`,
 );
 assert(
 'limit=100 hasNextPage is false',
 bigPage.pagination.hasNextPage === false,
 );
 assert(
 'limit=100 nextCursor is null',
 bigPage.pagination.nextCursor === null,
 );

 // 7) Edge: cursor pointing to a comment from page 1 boundary
 // Re-walk and check that resuming from any middle item works.
 const resumeFromId = insertedIds[5];
 const resumePage = await getComments(post.id, { limit: 10, cursor: resumeFromId });
 // We expect the cursor row itself to be excluded, so the first
 // item should be the one *older* than resumeFromId.
 // Wait — sort is ASC (oldest first). Cursor id=X. skip=1. Then
 // rows with createdAt > X.createdAt. So we get items NEWER than X.
 // That's the *new* semantics we just implemented. The previous
 // buggy semantics would have re-fetched the whole first page.
 const expectedFirstId = insertedIds[6]; // the one right after resumeFromId in ASC
 assert(
 `cursor=${resumeFromId} excludes the cursor row (first returned = ${expectedFirstId})`,
 resumePage.data[0]?.id === expectedFirstId,
 `got first id ${resumePage.data[0]?.id}`,
 );

 // 8) Cleanup
 const cleanup = await prisma.socialComment.deleteMany({
 where: { postId: post.id },
 });
 console.log(` Cleaned ${cleanup.count} test comment(s)`);
 // We keep the synthetic post around so reruns are idempotent.

 await prisma.$disconnect();

 // Summary
 const failed = results.filter((r) => !r.passed);
 console.log('');
 console.log(` Result: ${results.length - failed.length}/${results.length} passed`);
 if (failed.length > 0) {
 console.log(' Failures:');
 for (const f of failed) console.log(` - ${f.name}${f.detail ? ` (${f.detail})` : ''}`);
 process.exit(1);
 }
 process.exit(0);
}

main().catch(async (e) => {
 console.error(' Test crashed:', e);
 await prisma.$disconnect();
 process.exit(1);
});
