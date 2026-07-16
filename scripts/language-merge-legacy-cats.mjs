/**
 * language-merge-legacy-cats.mjs — fold the untagged legacy categories into the
 * level-tagged ones.
 * ─────────────────────────────────────────────────────────────────────────────
 * The original seed left ~12 categories per language with level = NULL ("Nghề
 * nghiệp", "Giáo dục & Trường học"…). They hold the real words while their
 * level-tagged counterparts ("HSK1 · Nghề nghiệp") sit empty, so those words
 * never surface when browsing by level — and now that dedup is language-wide, a
 * word parked in an untagged category BLOCKS the tagged one from ever claiming
 * it. Left alone they would quietly hollow out the level system.
 *
 *   docker exec cuonghoangdev_backend node scripts/language-merge-legacy-cats.mjs [--langs ja,en,zh]
 *   docker exec cuonghoangdev_backend node scripts/language-merge-legacy-cats.mjs --apply
 *
 * DRY-RUN BY DEFAULT. Only `--apply` writes.
 *
 * Words move to the same-theme category at the language's ENTRY level (N5 / A1 /
 * HSK1) — the legacy seed was beginner material. Matching mirrors the roadmap's
 * (themeWords + overlap, 2 shared syllables minimum). A legacy category with no
 * confident match is LEFT UNTOUCHED, never guessed at.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
// ja/zh legacy categories are general beginner topics (Chào hỏi, Gia đình, Số
// đếm) that belong at the entry level. EN's are NOT: they are a curated
// IT/professional corpus — "Lập trình cơ bản", "OOP & Design Patterns",
// "Collocations", and a "Nghề nghiệp & Phỏng vấn" holding *upward mobility*,
// *work-life balance*, *burnout*. Folding those into A1 would stamp C1 material
// as beginner and dissolve a hand-built set into the generated one. EN is
// excluded by default; pass `--langs en` only with a level that fits its words.
const LANGS = String(val('--langs', 'ja,zh')).split(',').map((s) => s.trim()).filter(Boolean);
const ENTRY_LEVEL = { ja: 'N5', en: 'A1', zh: 'HSK1' };

// Mirrors autoAssignCategories in myLanguage.roadmap.service.ts.
const themeWords = (s) => {
  const after = s.includes('·') ? s.slice(s.lastIndexOf('·') + 1) : s;
  const stop = new Set(['từ', 'vựng', 'và', 'các', 'theo', 'chủ', 'đề', 'luyện', 'tập', 'cơ', 'bản']);
  return new Set(
    after.toLowerCase().normalize('NFC').replace(/[&·(),.–-]/g, ' ').split(/\s+/)
      .filter((w) => w.length > 1 && !stop.has(w)),
  );
};
const overlap = (a, b) => {
  if (!a.size || !b.size) return { score: 0, hits: 0 };
  let hits = 0;
  for (const w of a) if (b.has(w)) hits++;
  return { score: hits / Math.min(a.size, b.size), hits };
};
const norm = (s) => String(s ?? '').trim().toLowerCase().slice(0, 120);

// Syllable overlap picks the right home 11 times out of 12, but it has no idea
// what the words mean: "Món ăn & Nhà hàng" shares "nhà" and "ăn" with "Nhà bếp
// & nấu ăn" and lands there, when 菜/米饭 plainly belong in "Đồ ăn & thức uống".
// Where the intended home is known, say so rather than let the score decide.
const ALIAS = {
  'Món ăn & Nhà hàng': 'Đồ ăn & thức uống',
};

let movedTotal = 0, droppedTotal = 0;
for (const code of LANGS) {
  const lang = await prisma.language.findUnique({ where: { code }, select: { id: true } });
  if (!lang) continue;
  const entry = ENTRY_LEVEL[code];
  if (!entry) { console.log(`[merge] ${code}: chưa biết cấp nhập môn — bỏ qua`); continue; }

  const legacy = await prisma.langVocabCategory.findMany({
    where: { languageId: lang.id, level: null },
    include: { _count: { select: { words: true } } },
    orderBy: { id: 'asc' },
  });
  const targets = await prisma.langVocabCategory.findMany({
    where: { languageId: lang.id, level: entry },
    select: { id: true, name: true },
    orderBy: { order: 'asc' },
  });
  if (!legacy.length) { console.log(`\n=== ${code}: không có danh mục cũ ===`); continue; }

  console.log(`\n=== ${code}: ${legacy.length} danh mục cũ (level=NULL) → gộp vào cấp ${entry} ===`);
  for (const src of legacy) {
    const want = themeWords(src.name);
    let best = null;
    const alias = ALIAS[src.name];
    if (alias) {
      const t = targets.find((x) => x.name.endsWith(alias));
      if (t) best = { t, score: 1 };
    }
    if (!best) {
      for (const t of targets) {
        const { score, hits } = overlap(want, themeWords(t.name));
        if (score >= 0.5 && hits >= 2 && (!best || score > best.score)) best = { t, score };
      }
    }
    if (!best) {
      console.log(`  "${src.name}" (${src._count.words} từ) → KHÔNG tìm được danh mục cùng chủ đề · GIỮ NGUYÊN`);
      continue;
    }

    // A word already sitting in the destination (or anywhere else at this
    // language) must not be moved on top of it — it would recreate the exact
    // duplication this whole pass exists to remove.
    const existing = new Set(
      (await prisma.langVocabWord.findMany({
        where: { category: { languageId: lang.id }, NOT: { categoryId: src.id } },
        select: { word: true },
      })).map((r) => norm(r.word)),
    );
    const words = await prisma.langVocabWord.findMany({ where: { categoryId: src.id }, select: { id: true, word: true } });
    const move = words.filter((w) => !existing.has(norm(w.word)));
    const dup = words.length - move.length;

    console.log(`  "${src.name}" (${words.length} từ) → "${best.t.name}"  [chuyển ${move.length}, bỏ ${dup} trùng]`);
    if (APPLY) {
      if (move.length) {
        await prisma.langVocabWord.updateMany({ where: { id: { in: move.map((m) => m.id) } }, data: { categoryId: best.t.id } });
      }
      if (dup) await prisma.langVocabWord.deleteMany({ where: { categoryId: src.id } });
      await prisma.langVocabCategory.delete({ where: { id: src.id } }).catch((e) => console.log(`    (không xoá được vỏ danh mục: ${String(e.message).slice(0, 60)})`));
    }
    movedTotal += move.length;
    droppedTotal += dup;
  }
}

console.log(`\n[merge] ${APPLY ? 'ĐÃ' : 'SẼ'} chuyển ${movedTotal} từ, bỏ ${droppedTotal} bản trùng.${APPLY ? '' : ' Chạy lại với --apply để thực hiện.'}`);
await prisma.$disconnect();
