/**
 * interview-deepen-gen.mjs — deepen every topic to ≥TARGET published questions,
 * split evenly across levels (default INTERN→SENIOR), for the chosen domains.
 * ─────────────────────────────────────────────────────────────────────────────
 * Runs INSIDE the backend container:
 *   docker exec cuonghoangdev_backend node scripts/interview-deepen-gen.mjs \
 *     [--domains backend,frontend,…] [--target 50] [--limit N] [--dry]
 *
 * Per topic, per level: count existing PUBLISHED questions at that level; while
 * below the per-level share (target/levels), call the admin pipeline
 * (generateQuestions → commitQuestions → substance-gate → publish) in batches
 * of ≤6. Levels within a topic run with small concurrency; topics sequential.
 * Fully resumable — re-running skips whatever is already filled. Stops cleanly
 * on quota/AI-down. Anti-duplication is inside the pipeline itself.
 */
import { PrismaClient } from '@prisma/client';

const { generateQuestions, commitQuestions } = await import('../dist/services/interview/questionGen.service.js');

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const val = (flag, dflt) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : dflt; };
const TARGET = Number(val('--target', '50')) || 50;
const LIMIT = Number(val('--limit', '0')) || 0;
const DOMAINS = String(val('--domains', 'backend,frontend,database,devops,cloud,networking,data,security,qa,system-design'))
  .split(',').map((s) => s.trim()).filter(Boolean);
const LEVELS = ['INTERN', 'FRESHER', 'JUNIOR', 'MID', 'SENIOR'];
const PER_LEVEL = Math.ceil(TARGET / LEVELS.length); // 50 → 10 per level
const BATCH = 6;                                     // questions per LLM call (stable, no truncation)
const LEVEL_CONCURRENCY = 3;                         // parallel level-calls within one topic
const ADMIN_USER_ID = 1;

// ── Token-window throttle ────────────────────────────────────────────────
// The gateway key allows ~4M tokens per rolling 5h window, shared with the
// site's other AI features. We self-limit to WINDOW_BUDGET from the interview
// call log and SLEEP until the window drains — the run is autonomous across
// as many windows as it needs.
const WINDOW_MS = 5 * 60 * 60 * 1000;
const WINDOW_BUDGET = Number(val('--budget', '3200000')) || 3_200_000;
async function windowUsed() {
  const agg = await prisma.interviewLLMCallLog.aggregate({
    where: { createdAt: { gte: new Date(Date.now() - WINDOW_MS) }, success: true },
    _sum: { inputTokens: true, outputTokens: true },
  });
  return (agg._sum.inputTokens ?? 0) + (agg._sum.outputTokens ?? 0);
}
async function waitForBudget() {
  for (;;) {
    const used = await windowUsed();
    if (used < WINDOW_BUDGET) return;
    // Sleep until the oldest call inside the window ages out (min 10 minutes).
    const oldest = await prisma.interviewLLMCallLog.findFirst({
      where: { createdAt: { gte: new Date(Date.now() - WINDOW_MS) }, success: true },
      orderBy: { createdAt: 'asc' }, select: { createdAt: true },
    });
    const wakeIn = Math.max(10 * 60_000, (oldest ? oldest.createdAt.getTime() + WINDOW_MS : Date.now()) - Date.now() + 5 * 60_000);
    console.log(`  [throttle] cửa sổ 5h đã dùng ${(used / 1e6).toFixed(2)}M/${(WINDOW_BUDGET / 1e6).toFixed(1)}M token — ngủ ${(wakeIn / 60000).toFixed(0)} phút rồi chạy tiếp…`);
    await new Promise((r) => setTimeout(r, wakeIn));
  }
}

function isPublishable(q) {
  return (
    typeof q.body === 'string' && q.body.trim().length >= 30 &&
    typeof q.referenceAnswer === 'string' && q.referenceAnswer.trim().length >= 80 &&
    Array.isArray(q.rubric) && q.rubric.length >= 2 &&
    Array.isArray(q.mustMention) && q.mustMention.length >= 2
  );
}

const topics = await prisma.interviewTopic.findMany({
  where: { status: 'PUBLISHED', track: { status: 'PUBLISHED', domain: { slug: { in: DOMAINS } } } },
  orderBy: [{ trackId: 'asc' }, { sortOrder: 'asc' }],
  select: { id: true, slug: true, track: { select: { slug: true, domain: { select: { slug: true } } } } },
});
const work = LIMIT > 0 ? topics.slice(0, LIMIT) : topics;
console.log(`[deepen] domains=${DOMAINS.join(',')} target=${TARGET} (${PER_LEVEL}/level) topics=${work.length}${DRY ? ' (DRY)' : ''}`);

let stop = false;
let grandPublished = 0, grandDraft = 0, callFails = 0;

/** Fill one (topic, level) up to PER_LEVEL published questions. */
async function fillLevel(tp, level) {
  let have = await prisma.interviewQuestion.count({ where: { topicId: tp.id, level, status: 'PUBLISHED' } });
  let guard = 0;
  while (have < PER_LEVEL && !stop && guard < 5) {
    guard++;
    const want = Math.min(BATCH, PER_LEVEL - have);
    try {
      await waitForBudget(); // token-window throttle — sleeps across quota windows
      const preview = await generateQuestions({ userId: ADMIN_USER_ID, topicId: tp.id, level, count: want, language: 'VI', useKnowledge: true });
      const commit = await commitQuestions({ topicId: tp.id, level, questions: preview.questions, authorId: ADMIN_USER_ID });
      if (!commit.ids.length) break; // everything was a duplicate — the well is dry at this level
      const rows = await prisma.interviewQuestion.findMany({
        where: { id: { in: commit.ids } },
        select: { id: true, body: true, referenceAnswer: true, rubric: true, mustMention: true },
      });
      const pub = rows.filter(isPublishable).map((r) => r.id);
      if (pub.length) await prisma.interviewQuestion.updateMany({ where: { id: { in: pub } }, data: { status: 'PUBLISHED' } });
      grandPublished += pub.length;
      grandDraft += commit.ids.length - pub.length;
      have += pub.length;
    } catch (e) {
      callFails++;
      const msg = String(e?.message ?? e);
      console.error(`    [!] ${tp.track.slug}/${tp.slug} ${level}: ${msg.slice(0, 140)}`);
      if (msg.includes('hạn mức') || msg.includes('AI đang tắt')) { stop = true; }
      break; // don't hammer a failing (topic, level); resumable later
    }
  }
  return have;
}

let done = 0;
for (const tp of work) {
  if (stop) break;
  const counts = await prisma.interviewQuestion.groupBy({
    by: ['level'], where: { topicId: tp.id, status: 'PUBLISHED' }, _count: { _all: true },
  });
  const byLevel = Object.fromEntries(counts.map((c) => [c.level, c._count._all]));
  const missing = LEVELS.filter((lv) => (byLevel[lv] ?? 0) < PER_LEVEL);
  if (!missing.length) { done++; continue; }
  if (DRY) { console.log(`  would deepen ${tp.track.domain.slug}/${tp.track.slug}/${tp.slug} → levels ${missing.join(',')}`); continue; }

  // Fill missing levels with small concurrency.
  const results = {};
  for (let i = 0; i < missing.length; i += LEVEL_CONCURRENCY) {
    const chunk = missing.slice(i, i + LEVEL_CONCURRENCY);
    const filled = await Promise.all(chunk.map((lv) => fillLevel(tp, lv)));
    chunk.forEach((lv, j) => { results[lv] = filled[j]; });
    if (stop) break;
  }
  done++;
  const total = await prisma.interviewQuestion.count({ where: { topicId: tp.id, status: 'PUBLISHED' } });
  console.log(`  [${done}/${work.length}] ${tp.track.slug}/${tp.slug}: now ${total} published (${Object.entries(results).map(([l, n]) => `${l}:${n}`).join(' ')})`);
}

console.log(`[deepen] ${stop ? 'STOPPED (quota/AI-down — resumable)' : 'DONE'} topics=${done}/${work.length} +published=${grandPublished} +draft=${grandDraft} callFails=${callFails}`);
await prisma.$disconnect();
