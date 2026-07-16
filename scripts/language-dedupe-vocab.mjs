/**
 * language-dedupe-vocab.mjs — one word, one home.
 * ─────────────────────────────────────────────────────────────────────────────
 * Generation used to dedup per-category, so a word could be filed under several
 * topics at once (几 sat in 4). Worse, once dedup went language-wide a
 * mis-filed copy would BLOCK the right category from ever claiming the word —
 * 警察 stuck in "Gia đình" means "Nghề nghiệp" can never have it. This removes
 * the surplus copies so the catalogue can heal.
 *
 *   docker exec cuonghoangdev_backend node scripts/language-dedupe-vocab.mjs [--langs ja,en,zh]
 *   docker exec cuonghoangdev_backend node scripts/language-dedupe-vocab.mjs --apply
 *
 * DRY-RUN BY DEFAULT — prints what it would delete and changes nothing.
 * Only `--apply` deletes.
 *
 * Which copy survives: the one sitting EARLIEST within its own category. The
 * padding this cleans up happens at the tail of a fill — a topic's real words
 * come first, and the borrowed ones arrive once it has run dry. So a low
 * in-category rank is evidence the word belongs there. 警察 is word #6 of
 * "Nghề nghiệp" but #127 of "Gia đình"; rank keeps the former.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const LANGS = String(val('--langs', 'ja,en,zh')).split(',').map((s) => s.trim()).filter(Boolean);

// Must mirror norm() in myLanguage.aiGen.service.ts — a cleanup that groups
// differently from the generator's dedup would leave "duplicates" it still
// blocks, or delete rows it never considered dupes.
const norm = (s) => String(s ?? '').trim().toLowerCase().slice(0, 120);

let totalDel = 0;
for (const code of LANGS) {
  const lang = await prisma.language.findUnique({ where: { code }, select: { id: true } });
  if (!lang) { console.log(`[dedupe] bỏ qua ${code}`); continue; }

  const rows = await prisma.langVocabWord.findMany({
    where: { category: { languageId: lang.id } },
    select: { id: true, word: true, meaningVi: true, categoryId: true, category: { select: { name: true } } },
    orderBy: { id: 'asc' },
  });

  // Rank within its own category (0 = first word added to that category).
  const rankInCat = new Map();
  const seenPerCat = new Map();
  for (const r of rows) {
    const n = seenPerCat.get(r.categoryId) ?? 0;
    rankInCat.set(r.id, n);
    seenPerCat.set(r.categoryId, n + 1);
  }

  const groups = new Map();
  for (const r of rows) {
    const k = norm(r.word);
    if (!k) continue;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(r);
  }

  const dupes = [...groups.entries()].filter(([, v]) => v.length > 1);
  if (!dupes.length) { console.log(`\n=== ${code}: không có từ trùng ===`); continue; }

  console.log(`\n=== ${code}: ${dupes.length} từ bị lặp → xoá ${dupes.reduce((s, [, v]) => s + v.length - 1, 0)} bản ghi thừa ===`);
  const delIds = [];
  for (const [, copies] of dupes) {
    const sorted = [...copies].sort((a, b) => (rankInCat.get(a.id) - rankInCat.get(b.id)) || (a.id - b.id));
    const keep = sorted[0];
    const drop = sorted.slice(1);
    delIds.push(...drop.map((d) => d.id));
    console.log(
      `  ${keep.word.padEnd(8)} GIỮ ở "${keep.category.name}" (#${rankInCat.get(keep.id) + 1})` +
      `  ✗ xoá: ${drop.map((d) => `"${d.category.name}" (#${rankInCat.get(d.id) + 1})`).join(', ')}`,
    );
  }

  if (APPLY) {
    const res = await prisma.langVocabWord.deleteMany({ where: { id: { in: delIds } } });
    console.log(`  → ĐÃ XOÁ ${res.count} bản ghi`);
    totalDel += res.count;
  } else {
    totalDel += delIds.length;
  }
}

console.log(`\n[dedupe] ${APPLY ? `ĐÃ XOÁ ${totalDel} bản ghi.` : `THỬ NGHIỆM: sẽ xoá ${totalDel} bản ghi. Chạy lại với --apply để xoá thật.`}`);
await prisma.$disconnect();
