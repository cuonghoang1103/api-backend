/**
 * seed.language-catalog.ts — level-tagged vocab CATEGORIES for the 3 priority
 * languages (Japanese, English, Chinese). Deterministic (no AI): it only
 * creates/updates the category shells (name + level + icon + order); the words
 * inside are filled afterwards by scripts/language-bulk-gen.mjs.
 *
 * Idempotent: upsert-by-(languageId, name). Never deletes. Safe to re-run.
 *   docker exec cuonghoangdev_backend npx tsx prisma/seed.language-catalog.ts
 *
 * Category naming convention: "<LEVEL> · <Chủ đề>" so the level chip bar and the
 * roadmap grouping read naturally.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Cat = { theme: string; icon: string };
// A compact, standard thematic set repeated (as relevant) per level. Themes are
// ordered basic→abstract so lower levels lean concrete, higher levels abstract.
const CORE: Cat[] = [
  { theme: 'Chào hỏi & giao tiếp', icon: '👋' },
  { theme: 'Gia đình & con người', icon: '👪' },
  { theme: 'Số đếm & thời gian', icon: '🕐' },
  { theme: 'Đồ ăn & thức uống', icon: '🍜' },
  { theme: 'Nhà cửa & đồ vật', icon: '🏠' },
  { theme: 'Cơ thể & sức khoẻ', icon: '🩺' },
  { theme: 'Mua sắm & tiền bạc', icon: '🛒' },
  { theme: 'Đi lại & phương hướng', icon: '🚆' },
  { theme: 'Thời tiết & thiên nhiên', icon: '🌤️' },
  { theme: 'Học tập & trường lớp', icon: '📚' },
  { theme: 'Công việc & nghề nghiệp', icon: '💼' },
  { theme: 'Sở thích & giải trí', icon: '🎨' },
  { theme: 'Cảm xúc & tính cách', icon: '😊' },
  { theme: 'Xã hội & tin tức', icon: '📰' },
  { theme: 'Kinh tế & kinh doanh', icon: '📈' },
  { theme: 'Khoa học & công nghệ', icon: '🔬' },
  { theme: 'Môi trường & xã hội', icon: '🌍' },
  { theme: 'Văn hoá & nghệ thuật', icon: '🎭' },
];

// How many themes (from the top of CORE) each level gets — grows with level.
const PER_LEVEL_THEMES: Record<string, number> = {
  // JLPT
  N5: 8, N4: 10, N3: 12, N2: 14, N1: 16,
  // CEFR
  A1: 8, A2: 10, B1: 12, B2: 14, C1: 16, C2: 18,
  // HSK
  HSK1: 6, HSK2: 8, HSK3: 10, HSK4: 12, HSK5: 14, HSK6: 16,
};

const LANG_LEVELS: Record<string, string[]> = {
  ja: ['N5', 'N4', 'N3', 'N2'],
  en: ['A1', 'A2', 'B1', 'B2', 'C1'],
  zh: ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5'],
};

async function main() {
  let created = 0, updated = 0, langs = 0;
  for (const [code, levels] of Object.entries(LANG_LEVELS)) {
    const lang = await prisma.language.findUnique({ where: { code }, select: { id: true } });
    if (!lang) { console.log(`[catalog] skip ${code} (language not found)`); continue; }
    langs++;
    let order = 0;
    for (const level of levels) {
      const n = PER_LEVEL_THEMES[level] ?? 10;
      for (const cat of CORE.slice(0, n)) {
        const name = `${level} · ${cat.theme}`;
        const existing = await prisma.langVocabCategory.findFirst({
          where: { languageId: lang.id, name }, select: { id: true },
        });
        if (existing) {
          await prisma.langVocabCategory.update({ where: { id: existing.id }, data: { level, icon: cat.icon, order } });
          updated++;
        } else {
          await prisma.langVocabCategory.create({ data: { languageId: lang.id, name, level, icon: cat.icon, order } });
          created++;
        }
        order++;
      }
    }
    console.log(`[catalog] ${code}: ${levels.length} levels → categories ensured`);
  }
  console.log(`[catalog] DONE langs=${langs} created=${created} updated=${updated}`);
}

main()
  .catch((e) => { console.error('[catalog] error', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
