#!/usr/bin/env node
/**
 * Tag the ~41 kanji taught in Academy JPD113 (content/academy/JPD113.mjs
 * Chapter 7 + Lesson 3.5) with extraLevels=",JPD113," so they ALSO show
 * under the new JPD113 tab on /language/ja/hanzi without leaving N5..N1.
 *
 * Usage: node scripts/tag-jpd113-hanzi.mjs [--apply]
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

// Order matches the Academy teaching order (7.1 → 7.2 → 7.3, plus 3.5 days).
// `count` = real occurrences counted across the 420 real FE exam questions
// already in the Exam Room (see content/exams/_work bank) — omitted when no
// exact count was tallied (mostly the plain number kanji, low-stakes).
const META_LIST = [
  { char: '一', lesson: '7.1' }, { char: '二', lesson: '7.1' }, { char: '三', lesson: '7.1', count: 11 },
  { char: '人', lesson: '7.1' }, { char: '日', lesson: '7.1' }, { char: '本', lesson: '7.1' }, { char: '学', lesson: '7.1' },
  { char: '四', lesson: '7.2', count: 14 }, { char: '五', lesson: '7.2' }, { char: '六', lesson: '7.2' },
  { char: '七', lesson: '7.2', count: 4 }, { char: '八', lesson: '7.2' }, { char: '九', lesson: '7.2', count: 12 },
  { char: '十', lesson: '7.2' }, { char: '百', lesson: '7.2' }, { char: '千', lesson: '7.2' }, { char: '万', lesson: '7.2' },
  { char: '時', lesson: '7.2', count: 66 }, { char: '分', lesson: '7.2' }, { char: '間', lesson: '7.2', count: 11 },
  { char: '何', lesson: '7.2', count: 57 },
  { char: '私', lesson: '7.3', count: 86 }, { char: '生', lesson: '7.3', count: 38 }, { char: '才', lesson: '7.3', count: 36 },
  { char: '円', lesson: '7.3', count: 29 }, { char: '語', lesson: '7.3', count: 14 }, { char: '校', lesson: '7.3', count: 13 },
  { char: '食', lesson: '7.3', count: 12 }, { char: '田', lesson: '7.3', count: 5 }, { char: '中', lesson: '7.3', count: 5 },
  { char: '誕', lesson: '7.3', count: 4 }, { char: '先', lesson: '7.3', count: 4 }, { char: '字', lesson: '7.3', count: 4 },
  { char: '性', lesson: '7.3', count: 4 },
  { char: '月', lesson: '3.5', count: 26 }, { char: '火', lesson: '3.5', count: 12 }, { char: '水', lesson: '3.5', count: 4 },
  { char: '木', lesson: '3.5', count: 9 }, { char: '金', lesson: '3.5', count: 3 }, { char: '土', lesson: '3.5', count: 9 },
  { char: '曜', lesson: '3.5', count: 60 },
];
const CHARS = META_LIST.map((c) => c.char);
const META = Object.fromEntries(META_LIST.map((c) => [c.char, c]));

function studyNote(char) {
  const m = META[char];
  if (!m) return null;
  const freq = m.count
    ? `Xuất hiện ${m.count} lần trong 420 câu FE thật của JPD113 — ưu tiên học chắc.`
    : 'Kanji nền tảng của JPD113, không có số liệu tần suất riêng nhưng vẫn cần nắm chắc.';
  return `[JPD113] Học ở Academy Bài ${m.lesson}. ${freq}`;
}

async function main() {
  console.log(`── tag-jpd113-hanzi : ${APPLY ? 'APPLY' : 'DRY'} ──`);
  const lang = await prisma.language.findUnique({ where: { code: 'ja' } });
  if (!lang) throw new Error('Japanese language not found (code=ja)');

  let order = 0;
  let tagged = 0, already = 0, missing = 0;
  for (const char of CHARS) {
    const row = await prisma.langHanziChar.findUnique({
      where: { uk_lang_hanzi_lang_char: { languageId: lang.id, char } },
    });
    if (!row) {
      missing++;
      console.log(`  ! MISSING in DB: ${char}`);
      continue;
    }
    const tag = ',JPD113,';
    if (row.extraLevels?.includes(tag)) {
      already++;
      console.log(`  = already tagged: ${char} (level=${row.level})`);
    } else {
      tagged++;
      const next = row.extraLevels ? `${row.extraLevels}JPD113,` : tag;
      const note = row.note ? row.note : studyNote(char); // never overwrite an existing note
      console.log(`  + tag: ${char} (level=${row.level}) order=${order}`);
      if (APPLY) {
        await prisma.langHanziChar.update({ where: { id: row.id }, data: { extraLevels: next, note } });
      }
    }
    order++;
  }
  console.log(`\ntagged +${tagged} · already ${already} · missing ${missing}. ${APPLY ? 'Done.' : 'Dry-run — add --apply.'}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
