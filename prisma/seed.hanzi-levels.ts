/**
 * seed.hanzi-levels.ts — every JLPT and HSK character, all levels.
 *
 * Hand-writing a mnemonic per character does not scale: the two hand seeds got
 * 84 kanji (N5) and 127 hanzi (HSK1) and stopped. This seeds the FULL ladders —
 * 2,211 kanji N5→N1 and 1,800 hanzi HSK1→HSK6 — from data/hanzi-levels.json.gz,
 * which carries only what is objectively true (level, strokes, readings,
 * radical, decomposition, English gloss).
 *
 * The Vietnamese meaning, mnemonic and compound words are left to
 * scripts/hanzi-ai-enrich.mjs. Until it runs, `meaningVi` holds the English
 * gloss and `mnemonic` is null — which is also how the enricher finds its work.
 *
 * Idempotent: upsert by (language, char). Existing rows are only BACKFILLED
 * (level/strokes/readings/radical if empty) — an admin's meaning, mnemonic and
 * images are never touched, and neither are the 211 hand-written entries.
 *
 *   docker exec cuonghoangdev_backend npx tsx prisma/seed.hanzi-levels.ts [--langs ja,zh]
 */
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const val = (f: string, d: string) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const LANGS = String(val('--langs', 'ja,zh')).split(',').map((s) => s.trim()).filter(Boolean);

interface JaEntry { lv: string; s?: number | null; on?: string; kun?: string; en?: string; rad?: string; dec?: string }
interface ZhEntry { lv: string; p?: string; en?: string; rad?: string; dec?: string }

// Level order = teaching order, so `order` puts N5 before N1 in the grid.
const LEVEL_ORDER: Record<string, number> = {
  N5: 0, N4: 1, N3: 2, N2: 3, N1: 4,
  HSK1: 0, HSK2: 1, HSK3: 2, HSK4: 3, HSK5: 4, HSK6: 5,
};

async function main() {
  const file = path.join(process.cwd(), 'data', 'hanzi-levels.json.gz');
  const blob = JSON.parse(gunzipSync(await readFile(file)).toString('utf8')) as {
    ja: Record<string, JaEntry>;
    zh: Record<string, ZhEntry>;
  };

  for (const code of LANGS) {
    const lang = await prisma.language.findUnique({ where: { code }, select: { id: true } });
    if (!lang) { console.log(`[hanzi:${code}] chưa có ngôn ngữ — bỏ qua`); continue; }
    const src = code === 'ja' ? blob.ja : code === 'zh' ? blob.zh : null;
    if (!src) { console.log(`[hanzi:${code}] không có dữ liệu cấp — bỏ qua`); continue; }

    // One read instead of 2,211 findFirst calls.
    const existing = new Map(
      (await prisma.langHanziChar.findMany({
        where: { languageId: lang.id },
        select: { id: true, char: true, level: true, strokeCount: true, onyomi: true, kunyomi: true, pinyin: true, radical: true, breakdown: true },
      })).map((r) => [r.char, r]),
    );

    let created = 0, backfilled = 0, untouched = 0;
    const entries = Object.entries(src);
    // Stable order: by level, then by the source order within a level.
    entries.sort((a, b) => (LEVEL_ORDER[a[1].lv] ?? 9) - (LEVEL_ORDER[b[1].lv] ?? 9));

    const toCreate: Array<Record<string, unknown>> = [];
    for (let i = 0; i < entries.length; i++) {
      const [char, e] = entries[i];
      const ja = code === 'ja' ? (e as JaEntry) : null;
      const zh = code === 'zh' ? (e as ZhEntry) : null;
      const prev = existing.get(char);

      if (prev) {
        // Backfill only what is missing. The hand-written 211 keep their
        // Vietnamese meanings and mnemonics; an admin's edits are sacred.
        const patch: Record<string, unknown> = {};
        if (!prev.level) patch.level = e.lv;
        if (prev.strokeCount == null && ja?.s) patch.strokeCount = ja.s;
        if (!prev.onyomi && ja?.on) patch.onyomi = ja.on;
        if (!prev.kunyomi && ja?.kun) patch.kunyomi = ja.kun;
        if (!prev.pinyin && zh?.p) patch.pinyin = zh.p;
        if (!prev.radical && e.rad) patch.radical = e.rad;
        if (!prev.breakdown && e.dec) patch.breakdown = e.dec;
        if (Object.keys(patch).length) {
          await prisma.langHanziChar.update({ where: { id: prev.id }, data: patch });
          backfilled++;
        } else {
          untouched++;
        }
        continue;
      }

      toCreate.push({
        languageId: lang.id,
        char,
        level: e.lv,
        strokeCount: ja?.s ?? null,
        onyomi: ja?.on || null,
        kunyomi: ja?.kun || null,
        pinyin: zh?.p || null,
        // English gloss stands in until the AI enricher writes the Vietnamese
        // one. meaningVi is NOT NULL, and a wrong-language meaning for an hour
        // beats a character the learner cannot see at all.
        meaningVi: e.en || '(chưa có nghĩa)',
        mnemonic: null, // ← what the enricher looks for
        radical: e.rad || null,
        breakdown: e.dec || null,
        examples: [],
        images: [],
        order: i,
      });
    }

    if (toCreate.length) {
      // createMany skips the unique-constraint collisions a concurrent run
      // could cause, rather than aborting the whole batch.
      const r = await prisma.langHanziChar.createMany({ data: toCreate as never, skipDuplicates: true });
      created = r.count;
    }
    console.log(`[hanzi:${code}] ${entries.length} chữ — tạo ${created}, bổ sung ${backfilled}, giữ nguyên ${untouched}`);
  }

  const summary = await prisma.langHanziChar.groupBy({ by: ['level'], _count: { _all: true }, orderBy: { level: 'asc' } });
  console.log('[hanzi] tổng theo cấp:', summary.map((s) => `${s.level}=${s._count._all}`).join(' '));
}

main()
  .catch((e) => { console.error('[hanzi] error', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
