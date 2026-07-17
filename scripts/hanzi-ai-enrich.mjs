/**
 * hanzi-ai-enrich.mjs — give every seeded character its Vietnamese half.
 * ─────────────────────────────────────────────────────────────────────────────
 * seed.hanzi-levels.ts inserts 4,011 characters with only their objective facts;
 * `mnemonic IS NULL` marks the ones still waiting for a meaning, a mnemonic,
 * a readable breakdown and compound words. This fills them in bulk.
 *
 *   docker exec cuonghoangdev_backend node scripts/hanzi-ai-enrich.mjs [--langs ja,zh] [--level N5,N4] [--limit N]
 *   docker exec ... node scripts/hanzi-ai-enrich.mjs --apply
 *
 * DRY-RUN BY DEFAULT — prints a sample and writes nothing.
 *
 * Meant for the cheap provider so it never competes with question generation:
 *   docker exec -e LLM_BASE_URL=https://modelapi.vn -e ANTHROPIC_API_KEY=$KEY \
 *     -e LLM_MODEL_GENERATION=gpt-5.6-terra cuonghoangdev_backend \
 *     node scripts/hanzi-ai-enrich.mjs --apply --budget 0
 */
import { PrismaClient } from '@prisma/client';

const { enrichChars } = await import('../dist/services/myLanguage.hanziAi.service.js');

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const num = (f, d) => { const v = val(f, undefined); const n = Number(v); return v === undefined || Number.isNaN(n) ? d : n; };
const LANGS = String(val('--langs', 'ja,zh')).split(',').map((s) => s.trim()).filter(Boolean);
// Comma-separated so two runners can split one language cleanly by level
// (`--level HSK1,HSK2,HSK3` vs `--level HSK4,HSK5,HSK6`). Without it, two
// processes on the same language each snapshot `mnemonic IS NULL` at start and
// then re-do each other's rows — harmless but pure waste.
const ONLY_LEVELS = String(val('--level', '')).split(',').map((x) => x.trim()).filter(Boolean);
const LIMIT = num('--limit', 0);
const BUDGET = num('--budget', 3_200_000);
const MODEL = process.env.LLM_MODEL_GENERATION || 'claude-opus-4-8';
const BATCH = 8; // a character's entry is ~400 tokens out; 8 keeps JSON well clear of truncation

// A quota belongs to a KEY, so only count what this model spent. --budget 0
// disables the wait entirely (separate provider, separate quota).
async function waitBudget() {
  if (BUDGET <= 0) return;
  for (;;) {
    const a = await prisma.interviewLLMCallLog.aggregate({
      where: { createdAt: { gte: new Date(Date.now() - 5 * 60 * 60 * 1000) }, success: true, model: MODEL },
      _sum: { inputTokens: true, outputTokens: true },
    });
    const used = (a._sum.inputTokens ?? 0) + (a._sum.outputTokens ?? 0);
    if (used < BUDGET) return;
    console.log(`  [throttle] ${MODEL} gần ${(BUDGET / 1e6).toFixed(1)}M — ngủ 15 phút`);
    await new Promise((r) => setTimeout(r, 15 * 60_000));
  }
}

let done = 0, failed = 0, stop = false;
// Characters the model omitted from an otherwise-successful batch. Not a batch
// error, so they never showed up in the summary — it said "0 lô lỗi" while
// leaving rows with mnemonic still null. Re-running finds them again.
let skipped = 0;

for (const code of LANGS) {
  if (stop) break;
  const lang = await prisma.language.findUnique({ where: { code }, select: { id: true } });
  if (!lang) continue;

  const todo = await prisma.langHanziChar.findMany({
    where: {
      languageId: lang.id,
      // The seed leaves mnemonic null; anything with one is either hand-written
      // or already enriched, and must not be redone.
      OR: [{ mnemonic: null }, { mnemonic: '' }],
      ...(ONLY_LEVELS.length ? { level: { in: ONLY_LEVELS } } : {}),
    },
    select: {
      id: true, char: true, level: true, strokeCount: true, onyomi: true, kunyomi: true,
      pinyin: true, radical: true, breakdown: true, meaningVi: true,
    },
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
    ...(LIMIT ? { take: LIMIT } : {}),
  });

  console.log(`\n=== ${code}${ONLY_LEVELS.length ? ` (${ONLY_LEVELS.join(',')})` : ''}: ${todo.length} chữ chưa có mẹo nhớ${APPLY ? '' : ' — CHẠY THỬ'} ===`);

  for (let i = 0; i < todo.length; i += BATCH) {
    if (stop) break;
    const chunk = todo.slice(i, i + BATCH);
    await waitBudget();

    let got;
    try {
      got = await enrichChars(1, chunk.map((c) => ({
        char: c.char,
        lang: code === 'zh' ? 'zh' : 'ja',
        level: c.level,
        strokeCount: c.strokeCount,
        onyomi: c.onyomi,
        kunyomi: c.kunyomi,
        pinyin: c.pinyin,
        radical: c.radical,
        decomposition: c.breakdown,
        // The seed parked the English gloss here; it is a hint, not the answer.
        englishGloss: c.meaningVi,
      })));
    } catch (e) {
      failed++;
      const msg = String(e?.message ?? e);
      console.error(`  [!] lô ${Math.floor(i / BATCH) + 1}: ${msg.slice(0, 90)}`);
      if (/hạn mức|AI đang tắt/i.test(msg)) { stop = true; break; }
      await new Promise((r) => setTimeout(r, 30_000));
      continue;
    }

    const missed = chunk.filter((c) => !got.has(c.char));
    if (missed.length) {
      skipped += missed.length;
      console.warn(`  [bỏ qua] lô ${Math.floor(i / BATCH) + 1}: AI không trả về ${missed.length} chữ (${missed.map((c) => c.char).join(' ')})`);
    }

    for (const c of chunk) {
      const e = got.get(c.char);
      if (!e) continue;
      if (APPLY) {
        await prisma.langHanziChar.update({
          where: { id: c.id },
          data: {
            meaningVi: e.meaningVi,
            mnemonic: e.mnemonic || null,
            breakdown: e.breakdown || c.breakdown,
            examples: e.examples,
          },
        });
      } else if (done < 3) {
        console.log(`── ${c.char} (${c.level})`);
        console.log(`   EN gốc : ${c.meaningVi}`);
        console.log(`   nghĩa VI: ${e.meaningVi}`);
        console.log(`   mẹo nhớ : ${e.mnemonic}`);
        console.log(`   chiết tự: ${e.breakdown}`);
        console.log(`   từ ghép : ${e.examples.map((x) => `${x.word} (${x.reading}) ${x.meaningVi}`).join(' · ')}\n`);
      }
      done++;
    }
    if (done % 80 < BATCH) console.log(`  … ${done} chữ`);
  }
}

console.log(`\n[hanzi-ai] ${APPLY ? 'ĐÃ viết' : 'SẼ viết'} ${done} chữ · ${failed} lô lỗi · ${skipped} chữ bị bỏ qua.${APPLY ? '' : ' Chạy lại với --apply để lưu.'}`);
if (skipped && APPLY) console.log(`[hanzi-ai] ${skipped} chữ chưa xong — CHẠY LẠI script này để viết nốt (nó tự tìm chữ thiếu mẹo nhớ).`);
await prisma.$disconnect();
