/**
 * interview-fill-rubric.mjs — give questions with an EMPTY rubric a real one.
 * ─────────────────────────────────────────────────────────────────────────────
 * 163 non-MCQ questions (CONCEPTUAL/CODING/SCENARIO/SYSTEM_DESIGN/BEHAVIORAL)
 * were generated/seeded with `rubric = []`, so the AI grader has no criteria to
 * score against. This derives a 3–5 criterion rubric from each question's body +
 * model answer, weights summing to 100, in BOTH the display language (rubric) and
 * English (rubricEn, mirroring id+weight). Needs a model answer to work from, so
 * it skips the handful with an empty reference_answer.
 *
 *   docker exec cuonghoangdev_backend node scripts/interview-fill-rubric.mjs [--limit N]
 *   docker exec ... node scripts/interview-fill-rubric.mjs --apply --budget 8000000
 *
 * DRY-RUN BY DEFAULT.
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
const BATCH = 3;

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

// Empty rubric + a model answer to derive it from.
const idRows = await prisma.$queryRaw`
  SELECT id FROM interview_questions
  WHERE jsonb_array_length(rubric) = 0
    AND body IS NOT NULL AND body <> ''
    AND reference_answer IS NOT NULL AND reference_answer <> ''
  ORDER BY id ASC`;
const ids = idRows.map((r) => Number(r.id)).filter(Number.isInteger);
const takeIds = LIMIT ? ids.slice(0, LIMIT) : ids;
const todo = await prisma.interviewQuestion.findMany({
  where: { id: { in: takeIds } },
  select: { id: true, body: true, referenceAnswer: true, type: true, topic: { select: { name: true } } },
  orderBy: { id: 'asc' },
});
console.log(`[rubric] ${todo.length} câu rubric rỗng${APPLY ? '' : ' — CHẠY THỬ'}\n`);

// Keep only a rubric whose weights are sane and whose EN twin mirrors it.
function sanitize(rub, rubEn) {
  if (!Array.isArray(rub) || rub.length < 2 || rub.length > 6) return null;
  const norm = rub.map((r, k) => ({
    id: (typeof r?.id === 'string' && r.id.trim()) ? r.id.trim() : `c${k + 1}`,
    criterion: typeof r?.criterion === 'string' ? r.criterion.trim() : '',
    weight: Math.round(Number(r?.weight) || 0),
  }));
  if (norm.some((r) => !r.criterion || r.weight <= 0)) return null;
  const total = norm.reduce((s, r) => s + r.weight, 0);
  if (total < 90 || total > 110) return null; // must roughly sum to 100
  // EN mirror only if same length & same weights (else leave EN empty, not half-done).
  let en = [];
  if (Array.isArray(rubEn) && rubEn.length === norm.length) {
    const cand = rubEn.map((r, k) => ({ id: norm[k].id, criterion: typeof r?.criterion === 'string' ? r.criterion.trim() : '', weight: norm[k].weight }));
    if (cand.every((r) => r.criterion)) en = cand;
  }
  return { rubric: norm, rubricEn: en };
}

let done = 0, failed = 0, skipped = 0;
for (let i = 0; i < todo.length; i += BATCH) {
  const chunk = todo.slice(i, i + BATCH);
  await waitBudget();

  const payload = chunk.map((q, n) => ({ n: n + 1, type: q.type, topic: q.topic?.name ?? '', body: q.body, modelAnswer: (q.referenceAnswer ?? '').slice(0, 1600) }));
  const system =
    'You are a senior technical interviewer writing grading rubrics. For each item, derive a rubric that scores an answer against the model answer. ' +
    'Rules: 3 to 5 criteria; integer "weight" per criterion summing to EXACTLY 100; "id" a short kebab-case slug (e.g. "handles-concurrency"); ' +
    '"criterion" is a concrete, checkable statement of what a strong answer must do (not vague like "good understanding"). ' +
    'The question body + model answer may be Vietnamese or English. Write "rubric[].criterion" in the SAME language as the body, and "rubricEn[].criterion" as its professional English mirror — rubricEn MUST have the SAME length, SAME order, identical "id" and "weight", only the criterion translated. ' +
    'Keep technical terms as-is. Return ONLY minified JSON: {"items":[{"n":number,"rubric":[{"id":string,"criterion":string,"weight":number}],"rubricEn":[{"id":string,"criterion":string,"weight":number}]}]}. No text outside JSON.';
  const user = `Sinh rubric cho:\n${JSON.stringify(payload)}`;

  let raw = '';
  try {
    const res = await llmComplete({ step: 'generation', feature: 'bulk_gen', system, messages: [{ role: 'user', content: user }], maxTokens: Math.min(16000, chunk.length * 2400 + 1200), maxRetries: 1, timeoutMs: 180_000, userId: 1 });
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
    const clean = sanitize(it?.rubric, it?.rubricEn);
    if (!clean) { skipped++; continue; }
    if (APPLY) {
      await prisma.interviewQuestion.update({
        where: { id: q.id },
        data: { rubric: clean.rubric, ...(clean.rubricEn.length ? { rubricEn: clean.rubricEn } : {}) },
      });
      done++;
    } else if (done < 3) {
      console.log(`── #${q.id} [${q.type}] ${q.topic?.name ?? ''}`);
      console.log(`   ${clean.rubric.map((r) => `${r.criterion.slice(0, 44)} (${r.weight})`).join(' · ')}`);
      console.log(`   EN mirror: ${clean.rubricEn.length ? 'có ✓' : 'KHÔNG (để trống)'}\n`);
      done++;
    }
  }
  const missed = chunk.filter((q) => !handled.has(q.id));
  if (missed.length) { skipped += missed.length; }
  if ((done + skipped) % 30 < BATCH) console.log(`  … ${done} ok / ${skipped} bỏ / ${todo.length}`);
}
console.log(`\n[rubric] ${APPLY ? 'ĐÃ sinh' : 'SẼ sinh'} ${done}/${todo.length} · ${failed} lô lỗi · ${skipped} bỏ (weight lệch/AI không trả).${APPLY ? '' : ' Chạy --apply để lưu.'}`);
await prisma.$disconnect();
