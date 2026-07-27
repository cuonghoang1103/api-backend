#!/usr/bin/env node
/**
 * Seed the "JPD113" Japanese vocab level in My Language (LangVocabCategory
 * level='JPD113', sits alongside N5..N1). Idempotent: matches category by
 * (languageId, level, name), word by (categoryId, word) — safe to re-run.
 *
 * Usage:
 *   node scripts/seed-jpd113-vocab.mjs           # dry run
 *   node scripts/seed-jpd113-vocab.mjs --apply   # write to DB
 */
import { PrismaClient } from '@prisma/client';
import { CATEGORIES, WORDS } from '../content/vocab/jpd113-vocab.mjs';
import { kanaToRomaji } from '../content/vocab/kana2romaji.mjs';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

async function main() {
  console.log(`── seed-jpd113-vocab : ${APPLY ? 'APPLY' : 'DRY'} ──`);
  const lang = await prisma.language.findUnique({ where: { code: 'ja' } });
  if (!lang) throw new Error('Japanese language not found (code=ja)');

  // Order JPD113 categories right after any existing max order for ja,
  // so they render as their own group in the level chip bar (position
  // doesn't matter functionally — the chip bar just lists distinct levels).
  const maxOrder = await prisma.langVocabCategory.aggregate({
    where: { languageId: lang.id },
    _max: { order: true },
  });
  let order = (maxOrder._max.order ?? -1) + 1;

  const catIdByKey = {};
  let catNew = 0, wordNew = 0, wordSkip = 0;

  for (const c of CATEGORIES) {
    const name = c.name;
    let cat = await prisma.langVocabCategory.findFirst({
      where: { languageId: lang.id, level: 'JPD113', name },
    });
    if (!cat) {
      catNew++;
      console.log(`  + category @${order}: ${name}`);
      if (APPLY) {
        cat = await prisma.langVocabCategory.create({
          data: { languageId: lang.id, name, level: 'JPD113', icon: c.icon, order },
        });
      }
      order++;
    } else {
      console.log(`  = category: ${name} (id ${cat.id})`);
    }
    if (cat) catIdByKey[c.key] = cat.id;
  }

  for (const w of WORDS) {
    const categoryId = catIdByKey[w.cat];
    if (!categoryId) {
      console.log(`  ! SKIP (no category, dry-run) ${w.word}`);
      continue;
    }
    const existing = await prisma.langVocabWord.findFirst({
      where: { categoryId, word: w.word },
    });
    if (existing) {
      wordSkip++;
      continue;
    }
    wordNew++;
    console.log(`    + word [${w.cat}]: ${w.word} (${w.kana})`);
    if (APPLY) {
      const romaji = kanaToRomaji(w.kana);
      await prisma.langVocabWord.create({
        data: {
          categoryId,
          word: w.word,
          meaningVi: w.meaning,
          exampleSentence: w.ex ?? null,
          exampleMeaning: w.exVi ?? null,
          note: w.note ?? null,
          pronunciations: {
            create: [
              { type: 'hiragana', value: w.kana.replace(/～/g, ''), order: 0 },
              { type: 'romaji', value: romaji, order: 1 },
            ],
          },
        },
      });
    }
  }

  console.log(`\ncategories +${catNew} · words +${wordNew} skip ${wordSkip}. ${APPLY ? 'Done.' : 'Dry-run — add --apply.'}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
