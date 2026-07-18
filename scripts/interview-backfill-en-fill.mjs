/**
 * interview-backfill-en-fill.mjs — fill the LEFTOVER English gaps.
 * ─────────────────────────────────────────────────────────────────────────────
 * Companion to interview-backfill-en.mjs. That script only picks questions with
 * NO English body (`body_en IS NULL/''`) and translates the whole thing. But a
 * question can have body_en yet still be MISSING reference_answer_en or
 * rubric_en — e.g. an earlier run returned an empty model answer (stored null)
 * or a rubric whose weights didn't line up (skipped, left null). Those never get
 * re-picked because the sibling filter only looks at body_en.
 *
 * This targets exactly that complement: body_en present, but reference_answer_en
 * OR rubric_en missing (with a Vietnamese source to translate). It writes ONLY
 * the missing field(s) — it never overwrites an existing translation, and never
 * touches body_en. Disjoint from the sibling's set, so both can run in parallel.
 *
 *   docker exec cuonghoangdev_backend node scripts/interview-backfill-en-fill.mjs [--limit N]
 *   docker exec ... node scripts/interview-backfill-en-fill.mjs --apply --budget 8000000
 *
 * DRY-RUN BY DEFAULT — prints a sample and writes nothing.
 */
import { PrismaClient } from '@prisma/client';

const { llmComplete } = await import('../dist/services/interview/llm/index.js');
const { looseJson } = await import('../dist/services/myLanguage.ai.service.js');

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const num = (f, d) => { const v = val(f, undefined); const n = Number(v); return v === undefined || Number.isNaN(n) ? d : n; };
const LIMIT = num('--limit', 0);
const BUDGET = num('--budget', 3_200_000);
const BATCH = 4;

// ── Shared 5h token window (skip with --budget 0 on a separate provider) ──
async function waitBudget() {
  if (BUDGET <= 0) return;
  for (;;) {
    const a = await prisma.interviewLLMCallLog.aggregate({
      where: { createdAt: { gte: new Date(Date.now() - 5 * 60 * 60 * 1000) }, success: true },
      _sum: { inputTokens: true, outputTokens: true },
    });
    const used = (a._sum.inputTokens ?? 0) + (a._sum.outputTokens ?? 0);
    if (used < BUDGET) return;
    console.log(`  [throttle] cửa sổ gần ${(BUDGET / 1e6).toFixed(1)}M — ngủ 15 phút`);
    await new Promise((r) => setTimeout(r, 15 * 60_000));
  }
}

// Candidate rows: has an English body already, but is missing the English model
// answer (with a VI source) OR the English rubric (with a non-empty VI rubric).
// Raw SQL keeps the jsonb/null semantics exact; rubric is jsonb NOT NULL default [].
const idRows = await prisma.$queryRaw`
  SELECT id FROM interview_questions
  WHERE body_en IS NOT NULL AND body_en <> ''
    AND (
      (reference_answer_en IS NULL AND reference_answer IS NOT NULL AND reference_answer <> '')
      OR (rubric_en IS NULL AND jsonb_array_length(rubric) > 0)
    )
  ORDER BY id ASC`;
const ids = idRows.map((r) => Number(r.id)).filter((n) => Number.isInteger(n));
const takeIds = LIMIT ? ids.slice(0, LIMIT) : ids;

const todo = await prisma.interviewQuestion.findMany({
  where: { id: { in: takeIds } },
  select: {
    id: true, body: true, referenceAnswer: true, rubric: true,
    bodyEn: true, referenceAnswerEn: true, rubricEn: true,
    topic: { select: { name: true } },
  },
  orderBy: { id: 'asc' },
});
console.log(`[fill] ${todo.length} câu có đề EN nhưng thiếu đáp mẫu/tiêu chí EN${APPLY ? '' : ' — CHẠY THỬ'}\n`);

let done = 0, failed = 0, skipped = 0;
for (let i = 0; i < todo.length; i += BATCH) {
  const chunk = todo.slice(i, i + BATCH);
  await waitBudget();

  const payload = chunk.map((q, n) => ({
    n: n + 1,
    topic: q.topic?.name ?? '',
    body: q.body,
    referenceAnswer: q.referenceAnswer ?? '',
    rubric: (Array.isArray(q.rubric) ? q.rubric : []).map((r) => ({ id: r?.id ?? '', criterion: r?.criterion ?? '', weight: r?.weight ?? 0 })),
  }));

  const system =
    'You translate technical interview material from Vietnamese into professional English for an international engineering audience. ' +
    'Write the English a real interviewer would say — idiomatic and natural, NOT a literal gloss. ' +
    'Keep every technical term, code snippet, identifier and proper noun exactly as-is (deadlock, race condition, `useEffect`, N+1, Redis…); never translate an established English term into something else. ' +
    'Preserve markdown and code fences exactly. ' +
    'For each item return the same rubric array: SAME length and order, identical "id" and "weight" — translate only "criterion". ' +
    'Return ONLY a minified JSON object: {"items":[{"n": number, "bodyEn": string, "referenceAnswerEn": string, "rubricEn":[{"id":string,"criterion":string,"weight":number}]}]}. ' +
    'Escape any double-quote inside a string as \\". No text outside the JSON.';
  const user = `Dịch sang tiếng Anh:\n${JSON.stringify(payload)}`;

  let raw = '';
  try {
    const res = await llmComplete({
      step: 'generation', feature: 'bulk_gen', system, messages: [{ role: 'user', content: user }],
      maxTokens: Math.min(16000, chunk.length * 2600 + 1500), maxRetries: 1, timeoutMs: 180_000, userId: 1,
    });
    raw = res.text;
  } catch (e) {
    failed++;
    console.error(`  [!] lô ${i / BATCH + 1}: ${String(e?.message ?? e).slice(0, 90)}`);
    if (/hạn mức|AI đang tắt/i.test(String(e?.message))) break;
    await new Promise((r) => setTimeout(r, 30_000));
    continue;
  }

  const items = looseJson(raw)?.items;
  if (!Array.isArray(items) || !items.length) { failed++; console.error(`  [!] lô ${i / BATCH + 1}: không đọc được kết quả`); continue; }

  const handled = new Set();
  for (const it of items) {
    const q = chunk[Number(it?.n) - 1];
    if (!q) continue;
    handled.add(q.id);

    // Fill ONLY the missing pieces — never overwrite an existing translation,
    // never touch body_en (this set already has it).
    const data = {};
    if (!q.referenceAnswerEn && typeof it?.referenceAnswerEn === 'string' && it.referenceAnswerEn.trim()) {
      data.referenceAnswerEn = it.referenceAnswerEn.trim();
    }
    // A rubric is only usable if it still lines up with the Vietnamese one:
    // same length AND same weights, else an English session would be scored
    // against criteria whose weights no longer match what they measure.
    const src = Array.isArray(q.rubric) ? q.rubric : [];
    const got = Array.isArray(it?.rubricEn) ? it.rubricEn : [];
    const rubricOk = src.length > 0 && got.length === src.length &&
      got.every((r, k) => Number(r?.weight ?? 0) === Number(src[k]?.weight ?? 0));
    if (q.rubricEn == null && rubricOk) data.rubricEn = got;

    if (APPLY) {
      if (Object.keys(data).length) {
        await prisma.interviewQuestion.update({ where: { id: q.id }, data });
        done++;
      } else {
        skipped++; // model returned nothing usable for this row's gap
      }
    } else if (done < 3) {
      console.log(`── câu #${q.id} (${q.topic?.name ?? ''})`);
      console.log(`   thiếu: ${[!q.referenceAnswerEn ? 'ref' : null, q.rubricEn == null ? 'rubric' : null].filter(Boolean).join('+') || '(?)'}`);
      console.log(`   sẽ ghi: ${Object.keys(data).join(', ') || 'KHÔNG (AI trả không dùng được)'}`);
      console.log(`   rubric: ${src.length} tiêu chí → ${rubricOk ? 'khớp ✓' : got.length ? `LỆCH (${got.length}) — bỏ` : 'không có'}\n`);
      done++;
    }
  }
  const missed = chunk.filter((q) => !handled.has(q.id));
  if (missed.length) { skipped += missed.length; console.warn(`  [bỏ qua] lô ${i / BATCH + 1}: AI không trả về ${missed.length} câu (id ${missed.map((q) => q.id).join(', ')})`); }
  if ((done + skipped) % 40 < BATCH) console.log(`  … ${done} ghi / ${skipped} bỏ / ${todo.length}`);
}

console.log(`\n[fill] ${APPLY ? 'ĐÃ lấp' : 'SẼ lấp'} ${done}/${todo.length} câu · ${failed} lô lỗi · ${skipped} câu không lấp được.${APPLY ? '' : ' Chạy lại với --apply để lưu.'}`);
if (skipped && APPLY) console.log(`[fill] ${skipped} câu chưa lấp (AI trả không dùng được / rubric lệch weight) — chạy lại để thử tiếp.`);
await prisma.$disconnect();
