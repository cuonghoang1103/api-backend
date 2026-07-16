/**
 * interview-backfill-en.mjs — give the existing bank its English half.
 * ─────────────────────────────────────────────────────────────────────────────
 * The schema, session runner, grader and report have always read bodyEn /
 * referenceAnswerEn / rubricEn, but generation never wrote them: 2,226 of 2,244
 * published questions had only Vietnamese. Picking English got `?? body` — the
 * Vietnamese text, silently. This translates what is already in the bank;
 * questions generated from now on come bilingual out of the generator.
 *
 *   docker exec cuonghoangdev_backend node scripts/interview-backfill-en.mjs [--limit N]
 *   docker exec ... node scripts/interview-backfill-en.mjs --apply
 *
 * DRY-RUN BY DEFAULT — prints a sample translation and writes nothing.
 *
 * Run it on the cheap provider (terra ≈5s/call) rather than the deepen key, so
 * it never competes with question generation:
 *   docker exec -e LLM_BASE_URL=https://modelapi.vn -e ANTHROPIC_API_KEY=$KEY \
 *     -e LLM_MODEL_GENERATION=gpt-5.6-terra cuonghoangdev_backend node ... --apply --budget 0
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
const BATCH = 4; // whole questions per call: body + model answer + rubric is a lot of text

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

const todo = await prisma.interviewQuestion.findMany({
  where: { OR: [{ bodyEn: null }, { bodyEn: '' }] },
  select: { id: true, body: true, referenceAnswer: true, rubric: true, topic: { select: { name: true } } },
  orderBy: { id: 'asc' },
  ...(LIMIT ? { take: LIMIT } : {}),
});
console.log(`[backfill] ${todo.length} câu thiếu bản tiếng Anh${APPLY ? '' : ' — CHẠY THỬ'}\n`);

let done = 0, failed = 0;
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

  for (const it of items) {
    const q = chunk[Number(it?.n) - 1];
    const bodyEn = typeof it?.bodyEn === 'string' ? it.bodyEn.trim() : '';
    if (!q || !bodyEn) continue;

    // A rubric is only usable if it still lines up with the Vietnamese one:
    // same length AND same weights, or an English session would be scored
    // against criteria whose weights no longer match what they measure.
    const src = Array.isArray(q.rubric) ? q.rubric : [];
    const got = Array.isArray(it.rubricEn) ? it.rubricEn : [];
    const rubricOk = src.length > 0 && got.length === src.length &&
      got.every((r, k) => Number(r?.weight ?? 0) === Number(src[k]?.weight ?? 0));

    if (APPLY) {
      await prisma.interviewQuestion.update({
        where: { id: q.id },
        data: {
          bodyEn,
          referenceAnswerEn: typeof it.referenceAnswerEn === 'string' && it.referenceAnswerEn.trim() ? it.referenceAnswerEn.trim() : null,
          ...(rubricOk ? { rubricEn: got } : {}),
        },
      });
    } else if (done < 2) {
      console.log(`── câu #${q.id} (${q.topic?.name ?? ''})`);
      console.log(`   VI: ${q.body.slice(0, 100).replace(/\n/g, ' ')}…`);
      console.log(`   EN: ${bodyEn.slice(0, 100).replace(/\n/g, ' ')}…`);
      console.log(`   rubric: ${src.length} tiêu chí → ${rubricOk ? 'khớp ✓' : got.length ? `LỆCH (${got.length}) — bỏ` : 'không có'}\n`);
    }
    done++;
  }
  if (done % 40 < BATCH) console.log(`  … ${done}/${todo.length}`);
}

console.log(`\n[backfill] ${APPLY ? 'ĐÃ dịch' : 'SẼ dịch'} ${done} câu · ${failed} lô lỗi.${APPLY ? '' : ' Chạy lại với --apply để lưu.'}`);
await prisma.$disconnect();
