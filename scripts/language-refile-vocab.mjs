/**
 * language-refile-vocab.mjs — put every word in the topic it belongs to.
 * ─────────────────────────────────────────────────────────────────────────────
 * While generation was uncapped and deduped per-category, a topic pushed past
 * its natural end got padded from its neighbours: "Gia đình & con người" ended
 * up holding 警察/护士/司机. Neither rule we tried can undo this — the legacy
 * categorisation calls 果物 food when "Rau củ & trái cây" is the better home,
 * and rank only knows insertion order. Which topic a word belongs to is a
 * question about meaning, so it goes to the model.
 *
 *   docker exec cuonghoangdev_backend node scripts/language-refile-vocab.mjs [--langs ja,zh,en] [--level N5]
 *   docker exec cuonghoangdev_backend node scripts/language-refile-vocab.mjs --apply
 *
 * DRY-RUN BY DEFAULT. Only `--apply` moves anything.
 *
 * The model may only choose from the categories that already exist at that
 * level, and only says "move" when the current home is plainly wrong — a word
 * that fits both stays where it is. Anything it names that we cannot resolve is
 * skipped, never guessed at.
 */
import { PrismaClient } from '@prisma/client';

const { llmComplete } = await import('../dist/services/interview/llm/index.js');
const { looseJson } = await import('../dist/services/myLanguage.ai.service.js');

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const LANGS = String(val('--langs', 'ja,zh')).split(',').map((s) => s.trim()).filter(Boolean);
const ONLY_LEVEL = val('--level', '');
const BATCH = 30;
const LANG_NAME = { ja: 'Japanese', zh: 'Chinese (Mandarin)', en: 'English' };

let moved = 0, checked = 0, failed = 0;

for (const code of LANGS) {
  const lang = await prisma.language.findUnique({ where: { code }, select: { id: true } });
  if (!lang) continue;

  const levels = [...new Set(
    (await prisma.langVocabCategory.findMany({
      where: { languageId: lang.id, level: { not: null } },
      select: { level: true }, distinct: ['level'],
    })).map((x) => x.level),
  )].filter((lv) => !ONLY_LEVEL || lv === ONLY_LEVEL);

  for (const level of levels) {
    const cats = await prisma.langVocabCategory.findMany({
      where: { languageId: lang.id, level },
      select: { id: true, name: true, _count: { select: { words: true } } },
      orderBy: { order: 'asc' },
    });
    if (cats.length < 2) continue;
    // Theme only — the model should not have to parse "HSK1 · " on every line.
    const theme = (n) => (n.includes('·') ? n.slice(n.lastIndexOf('·') + 1).trim() : n);
    const catList = cats.map((c, i) => `${i + 1}. ${theme(c.name)}`).join('\n');

    const words = await prisma.langVocabWord.findMany({
      where: { category: { languageId: lang.id, level } },
      select: { id: true, word: true, meaningVi: true, categoryId: true },
      orderBy: { id: 'asc' },
    });
    if (!words.length) continue;
    const catById = new Map(cats.map((c) => [c.id, c]));
    const idxByName = new Map(cats.map((c, i) => [theme(c.name).toLowerCase(), i]));

    console.log(`\n=== ${code} ${level}: ${words.length} từ / ${cats.length} danh mục ===`);

    for (let i = 0; i < words.length; i += BATCH) {
      const chunk = words.slice(i, i + BATCH);
      const lines = chunk.map((w, j) => `${j + 1}. ${w.word} = ${String(w.meaningVi || '').slice(0, 40)} [đang ở: ${theme(catById.get(w.categoryId)?.name || '?')}]`).join('\n');
      const system =
        `You are organising a ${LANG_NAME[code] || code} vocabulary catalogue for Vietnamese learners. ` +
        `Each word sits in a topic. Some were mis-filed: a topic that ran out of its own words got padded with words from other topics. ` +
        'For EACH word decide whether its current topic is where a learner would look for it. ' +
        'Only report a word when its current topic is plainly WRONG. If the word fits its current topic — even if another topic would also fit — leave it alone and do NOT report it. ' +
        'Choose ONLY from the numbered topic list; never invent a topic. ' +
        'Return ONLY a minified JSON object: {"moves":[{"n": number (the word number), "to": number (the topic number)}]}. ' +
        'An empty "moves" array is a valid and common answer. No text outside the JSON.';
      const user = `CÁC CHỦ ĐỀ CÓ SẴN (cấp ${level}):\n${catList}\n\nCÁC TỪ CẦN XÉT:\n${lines}`;

      let raw = '';
      try {
        const res = await llmComplete({ step: 'generation', feature: 'bulk_gen', system, messages: [{ role: 'user', content: user }], maxTokens: 1200, maxRetries: 1, timeoutMs: 60_000, userId: 1 });
        raw = res.text;
      } catch (e) {
        failed++;
        console.log(`  [!] lô ${i / BATCH + 1}: ${String(e?.message ?? e).slice(0, 70)}`);
        continue;
      }
      checked += chunk.length;

      const parsed = looseJson(raw);
      const moves = Array.isArray(parsed.moves) ? parsed.moves : [];
      for (const m of moves) {
        const w = chunk[Number(m?.n) - 1];
        const target = cats[Number(m?.to) - 1];
        // A hallucinated index or a no-op move is dropped rather than acted on.
        if (!w || !target || target.id === w.categoryId) continue;
        console.log(`  ${w.word.padEnd(10)} "${theme(catById.get(w.categoryId)?.name || '?')}" → "${theme(target.name)}"`);
        if (APPLY) await prisma.langVocabWord.update({ where: { id: w.id }, data: { categoryId: target.id } });
        moved++;
      }
    }
  }
}

console.log(`\n[refile] xét ${checked} từ · ${APPLY ? 'ĐÃ chuyển' : 'SẼ chuyển'} ${moved} từ · ${failed} lô lỗi.${APPLY ? '' : ' Chạy lại với --apply để sửa thật.'}`);
await prisma.$disconnect();
