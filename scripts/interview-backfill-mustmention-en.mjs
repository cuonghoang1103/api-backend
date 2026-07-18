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
    // Only write a REAL English translation. If the model returned nothing usable
    // for this row, leave the field EMPTY (fix A hides the objective score when EN
    // keys are empty) and let a later round retry — NEVER copy the Vietnamese keys
    // in as "English": that silently poisons the language-matched objective grader
    // (an English answer can't match Vietnamese keys → a perfect answer scores ~24/100).
    const must = Array.isArray(o?.must) && o.must.length ? o.must.map(String) : null;
    if (!must) return null;
    const should = Array.isArray(o?.should) ? o.should.map(String) : [];
    return { id: r.id, mustMentionEn: must, shouldMentionEn: should };
  }).filter(Boolean);
}

let done = 0, fails = 0;
const skip = new Set(); // batch IDs that errored — never mutate their data, just don't retry
const miss = new Map(); // id -> times the model returned no usable EN (leave empty, retry, then give up)
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
    if (out.length) {
      await prisma.$transaction(out.map((o) => prisma.interviewQuestion.update({
        where: { id: o.id }, data: { mustMentionEn: o.mustMentionEn, shouldMentionEn: o.shouldMentionEn },
      })));
      done += out.length;
      console.log(`  +${out.length} (total ${done}) e.g. #${out[0].id}: ${JSON.stringify(out[0].mustMentionEn).slice(0, 80)}`);
    }
    // Rows the model didn't translate this round stay EMPTY (never VI). Retry them,
    // but give up after 3 misses so an untranslatable row can't spin the loop forever.
    const got = new Set(out.map((o) => o.id));
    for (const r of rows) {
      if (got.has(r.id)) continue;
      const c = (miss.get(r.id) ?? 0) + 1;
      miss.set(r.id, c);
      if (c >= 3) { skip.add(r.id); console.log(`  [~] #${r.id}: AI không dịch được sau 3 lần — để trống (guard ẩn điểm)`); }
    }
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
