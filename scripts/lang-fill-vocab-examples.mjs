/**
 * lang-fill-vocab-examples.mjs — give vocab words that lack an example one.
 * ─────────────────────────────────────────────────────────────────────────────
 * A handful of vocab rows have a word + Vietnamese meaning but no
 * example_sentence. This writes a natural example sentence in the word's own
 * language plus its Vietnamese meaning (example_meaning). Small, one pass.
 *
 *   docker exec cuonghoangdev_backend node scripts/lang-fill-vocab-examples.mjs [--limit N]
 *   docker exec ... node scripts/lang-fill-vocab-examples.mjs --apply --budget 8000000
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
const BATCH = 8;
const LANG_NAME = { en: 'English', ja: 'Japanese', zh: 'Chinese' };

async function waitBudget() {
  if (BUDGET <= 0) return;
  for (;;) {
    const a = await prisma.interviewLLMCallLog.aggregate({ where: { createdAt: { gte: new Date(Date.now() - 5 * 60 * 60 * 1000) }, success: true }, _sum: { inputTokens: true, outputTokens: true } });
    if (((a._sum.inputTokens ?? 0) + (a._sum.outputTokens ?? 0)) < BUDGET) return;
    console.log('  [throttle] ngủ 15 phút'); await new Promise((r) => setTimeout(r, 15 * 60_000));
  }
}

const rows = await prisma.$queryRaw`
  SELECT w.id, w.word, w.meaning_vi AS meaning, l.code AS lang
  FROM lang_vocab_words w
  JOIN lang_vocab_categories c ON c.id = w.category_id
  JOIN languages l ON l.id = c.language_id
  WHERE w.example_sentence IS NULL OR trim(w.example_sentence) = ''
  ORDER BY w.id ASC`;
const todo = (LIMIT ? rows.slice(0, LIMIT) : rows).map((r) => ({ id: Number(r.id), word: r.word, meaning: r.meaning ?? '', lang: r.lang }));
console.log(`[vocab-ex] ${todo.length} từ thiếu ví dụ${APPLY ? '' : ' — CHẠY THỬ'}\n`);

let done = 0, failed = 0, skipped = 0;
for (let i = 0; i < todo.length; i += BATCH) {
  const chunk = todo.slice(i, i + BATCH);
  await waitBudget();
  const payload = chunk.map((w, n) => ({ n: n + 1, language: LANG_NAME[w.lang] ?? w.lang, word: w.word, meaning_vi: w.meaning }));
  const system =
    'You write vocabulary example sentences for learners. For each item, write ONE natural, everyday example sentence in the item\'s "language" that uses the "word" correctly, plus its Vietnamese translation. ' +
    'Keep the sentence short (≤ 14 words) and level-appropriate. For Japanese/Chinese, write in native script. ' +
    'Return ONLY minified JSON: {"items":[{"n":number,"example":string,"exampleMeaning":string}]}. "example" is the sentence in the target language, "exampleMeaning" is its Vietnamese meaning. No text outside JSON.';
  const user = `Viết ví dụ cho:\n${JSON.stringify(payload)}`;

  let raw = '';
  try {
    const res = await llmComplete({ step: 'generation', feature: 'bulk_gen', system, messages: [{ role: 'user', content: user }], maxTokens: 3000, maxRetries: 1, timeoutMs: 120_000, userId: 1 });
    raw = res.text;
  } catch (e) {
    failed++; console.error(`  [!] lô ${i / BATCH + 1}: ${String(e?.message ?? e).slice(0, 80)}`);
    if (/hạn mức|AI đang tắt/i.test(String(e?.message))) break;
    await new Promise((r) => setTimeout(r, 30_000)); continue;
  }
  const items = looseJson(raw)?.items;
  if (!Array.isArray(items) || !items.length) { failed++; console.error(`  [!] lô ${i / BATCH + 1}: không đọc được`); continue; }
  const byN = new Map(items.map((o) => [Number(o?.n), o]));
  for (let k = 0; k < chunk.length; k++) {
    const w = chunk[k]; const o = byN.get(k + 1);
    const ex = typeof o?.example === 'string' ? o.example.trim() : '';
    if (!ex) { skipped++; continue; }
    const exM = typeof o?.exampleMeaning === 'string' ? o.exampleMeaning.trim() : null;
    if (APPLY) {
      await prisma.langVocabWord.update({ where: { id: w.id }, data: { exampleSentence: ex, ...(exM ? { exampleMeaning: exM } : {}) } });
      done++;
    } else if (done < 3) { console.log(`── ${w.lang} ${w.word}: ${ex} (${exM ?? ''})`); done++; }
  }
}
console.log(`\n[vocab-ex] ${APPLY ? 'ĐÃ điền' : 'SẼ điền'} ${done}/${todo.length} · ${failed} lô lỗi · ${skipped} bỏ.`);
await prisma.$disconnect();
