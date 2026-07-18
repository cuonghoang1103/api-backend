/**
 * interview-backfill-mustmention-en.mjs — English keyword sets for the objective grader.
 * ─────────────────────────────────────────────────────────────────────────────
 * mustMention/shouldMention were Vietnamese-only, so EN sessions scored English
 * answers against Vietnamese keys → the keyword pass failed a perfect answer.
 * This translates each question's keyword phrases to concise English and stores
 * them in must_mention_en / should_mention_en, so the objective grader matches
 * the answer's language (see session.service.submitAnswer language selection).
 *
 *   docker exec cuonghoangdev_backend node scripts/interview-backfill-mustmention-en.mjs [--batch 8] [--limit 0] [--budget 8000000]
 *
 * Resumable: only rows with VI keys AND no EN keys yet are processed. Idempotent.
 * Shares the 5h gateway token window with the other jobs (throttles at --budget).
 */
import { PrismaClient } from '@prisma/client';
const { llmComplete } = await import('../dist/services/interview/llm/index.js');
const { extractJson } = await import('../dist/services/interview/llm/index.js');

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const BATCH = Number(val('--batch', 8)) || 8;
const LIMIT = Number(val('--limit', 0)) || 0;
const BUDGET = Number(val('--budget', 8_000_000)) || 8_000_000;
const MODEL = process.env.LLM_MODEL_INTERVIEW || 'rb-sonnet-5';
const WINDOW_MS = 5 * 60 * 60 * 1000;

async function windowUsed() {
  const a = await prisma.interviewLLMCallLog.aggregate({
    where: { createdAt: { gte: new Date(Date.now() - WINDOW_MS) }, success: true, model: MODEL },
    _sum: { inputTokens: true, outputTokens: true },
  }).catch(() => null);
  return (a?._sum?.inputTokens ?? 0) + (a?._sum?.outputTokens ?? 0);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function translateBatch(rows) {
  const items = rows.map((r, i) => ({ i, must: r.mustMention, should: r.shouldMention }));
  const system =
    'You translate short technical interview keyword phrases from Vietnamese to English. ' +
    'Keep technical terms/acronyms as-is (Redis, idempotency, SHA-256, TTL…). Keep each phrase concise, ' +
    'same meaning. Return ONLY minified JSON: {"out":[{"i":number,"must":[string],"should":[string]}, ...]} ' +
    'with the SAME i values and SAME array lengths as the input.';
  const user = 'Translate to English:\n' + JSON.stringify(items);
  const res = await llmComplete({
    step: 'interview', feature: 'interview', system,
    messages: [{ role: 'user', content: user }],
    maxTokens: 1800, maxRetries: 2, timeoutMs: 60_000, userId: 1,
  });
  const parsed = extractJson(res.text);
  const byI = new Map((parsed?.out ?? []).map((o) => [o.i, o]));
  return rows.map((r, i) => {
    const o = byI.get(i);
    return {
      id: r.id,
      mustMentionEn: Array.isArray(o?.must) && o.must.length ? o.must.map(String) : r.mustMention,
      shouldMentionEn: Array.isArray(o?.should) ? o.should.map(String) : r.shouldMention,
    };
  });
}

let done = 0, fails = 0;
const skip = new Set(); // batch IDs that errored — never mutate their data, just don't retry
console.log(`[backfill-en] model=${MODEL} batch=${BATCH} budget=${(BUDGET / 1e6).toFixed(1)}M`);
while (true) {
  if (BUDGET > 0) {
    const used = await windowUsed();
    if (used >= BUDGET) { console.log(`  [throttle] ${(used / 1e6).toFixed(2)}M/${(BUDGET / 1e6).toFixed(1)}M — ngủ 15 phút`); await sleep(15 * 60 * 1000); continue; }
  }
  const where = { mustMention: { isEmpty: false }, mustMentionEn: { isEmpty: true } };
  if (skip.size) where.id = { notIn: [...skip] };
  const rows = await prisma.interviewQuestion.findMany({
    where, select: { id: true, mustMention: true, shouldMention: true }, take: BATCH, orderBy: { id: 'asc' },
  });
  if (!rows.length) { console.log(`[backfill-en] DONE — no rows left. translated=${done} skipped=${skip.size}`); break; }
  try {
    const out = await translateBatch(rows);
    await prisma.$transaction(out.map((o) => prisma.interviewQuestion.update({
      where: { id: o.id }, data: { mustMentionEn: o.mustMentionEn, shouldMentionEn: o.shouldMentionEn },
    })));
    done += out.length;
    console.log(`  +${out.length} (total ${done}) e.g. #${rows[0].id}: ${JSON.stringify(out[0].mustMentionEn).slice(0, 80)}`);
  } catch (e) {
    fails++;
    // Don't corrupt data with VI-as-EN (that would defeat the language guard).
    // Skip this batch so we don't loop; it stays VI-only and the guard protects it.
    rows.forEach((r) => skip.add(r.id));
    console.log(`  [!] batch từ #${rows[0].id} lỗi: ${e?.message || e} — skip ${rows.length} câu, để guard lo`);
  }
  if (LIMIT && done >= LIMIT) { console.log(`[backfill-en] reached --limit ${LIMIT}`); break; }
}
await prisma.$disconnect();
