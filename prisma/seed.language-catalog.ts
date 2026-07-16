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

/** tier 1 = everyday concrete (present from the very first level), 2 = practical
 *  situations, 3 = abstract/specialised. A theme appears at every level whose
 *  tier reaches it, so "Động vật" exists at N5 AND N2 — same theme, harder words. */
type Cat = { theme: string; icon: string; tier: 1 | 2 | 3 };

// Dictionary-style coverage: the themes a learner actually meets in daily life,
// not a token sample. Order within a tier is the display order.
const CORE: Cat[] = [
  // ── tier 1 — mọi cấp đều có, kể cả sơ cấp ──
  { theme: 'Chào hỏi & giao tiếp', icon: '👋', tier: 1 },
  { theme: 'Gia đình & con người', icon: '👪', tier: 1 },
  { theme: 'Số đếm & thời gian', icon: '🕐', tier: 1 },
  { theme: 'Ngày tháng & lịch', icon: '📅', tier: 1 },
  { theme: 'Đồ ăn & thức uống', icon: '🍜', tier: 1 },
  { theme: 'Rau củ & trái cây', icon: '🍎', tier: 1 },
  { theme: 'Động vật', icon: '🐶', tier: 1 },
  { theme: 'Cây cối & hoa lá', icon: '🌳', tier: 1 },
  { theme: 'Côn trùng & sinh vật nhỏ', icon: '🐝', tier: 1 },
  { theme: 'Nhà cửa & đồ vật', icon: '🏠', tier: 1 },
  { theme: 'Nhà bếp & nấu ăn', icon: '🍳', tier: 1 },
  { theme: 'Quần áo & phụ kiện', icon: '👕', tier: 1 },
  { theme: 'Đồ dùng cá nhân', icon: '🧴', tier: 1 },
  { theme: 'Cơ thể & sức khoẻ', icon: '🩺', tier: 1 },
  { theme: 'Màu sắc & hình dạng', icon: '🎨', tier: 1 },
  { theme: 'Mua sắm & tiền bạc', icon: '🛒', tier: 1 },
  { theme: 'Đi lại & phương hướng', icon: '🚆', tier: 1 },
  { theme: 'Thời tiết & mùa', icon: '🌤️', tier: 1 },
  { theme: 'Học tập & trường lớp', icon: '📚', tier: 1 },
  { theme: 'Nghề nghiệp', icon: '💼', tier: 1 },
  { theme: 'Sở thích & giải trí', icon: '🎮', tier: 1 },
  { theme: 'Cảm xúc & tính cách', icon: '😊', tier: 1 },
  { theme: 'Bạn bè & quan hệ', icon: '🤝', tier: 1 },
  { theme: 'Thành phố & địa điểm', icon: '🏙️', tier: 1 },
  { theme: 'Điện thoại & internet', icon: '📱', tier: 1 },
  { theme: 'Động từ thông dụng hằng ngày', icon: '🏃', tier: 1 },
  { theme: 'Tính từ mô tả thường gặp', icon: '🔤', tier: 1 },
  // ── tier 2 — tình huống thực tế, từ sơ-trung cấp trở lên ──
  { theme: 'Nhà hàng & gọi món', icon: '🍽️', tier: 2 },
  { theme: 'Du lịch & khách sạn', icon: '✈️', tier: 2 },
  { theme: 'Giao thông & phương tiện', icon: '🚗', tier: 2 },
  { theme: 'Bệnh viện & khám bệnh', icon: '🏥', tier: 2 },
  { theme: 'Ngân hàng & thủ tục', icon: '🏦', tier: 2 },
  { theme: 'Bưu điện & hành chính', icon: '📮', tier: 2 },
  { theme: 'Nhà ở & thuê nhà', icon: '🔑', tier: 2 },
  { theme: 'Thể thao', icon: '⚽', tier: 2 },
  { theme: 'Âm nhạc & phim ảnh', icon: '🎬', tier: 2 },
  { theme: 'Lễ hội & phong tục', icon: '🎊', tier: 2 },
  { theme: 'Ẩm thực & đặc sản', icon: '🍱', tier: 2 },
  { theme: 'Công việc & văn phòng', icon: '🏢', tier: 2 },
  { theme: 'Phỏng vấn & xin việc', icon: '📝', tier: 2 },
  { theme: 'Thiên nhiên & địa lý', icon: '🏔️', tier: 2 },
  { theme: 'Biển cả & sông nước', icon: '🌊', tier: 2 },
  { theme: 'Nông nghiệp & đồng quê', icon: '🌾', tier: 2 },
  { theme: 'Xã hội & tin tức', icon: '📰', tier: 2 },
  { theme: 'Dịch vụ & sửa chữa', icon: '🧾', tier: 2 },
  { theme: 'An toàn & khẩn cấp', icon: '🚨', tier: 2 },
  { theme: 'Trạng từ & liên từ', icon: '🔗', tier: 2 },
  // ── tier 3 — trừu tượng & chuyên sâu, từ trung cấp trở lên ──
  { theme: 'Kinh tế & kinh doanh', icon: '📈', tier: 3 },
  { theme: 'Tài chính & đầu tư', icon: '💰', tier: 3 },
  { theme: 'Khoa học & công nghệ', icon: '🔬', tier: 3 },
  { theme: 'Y học & sinh học', icon: '🧬', tier: 3 },
  { theme: 'Vũ trụ & thiên văn', icon: '🔭', tier: 3 },
  { theme: 'Môi trường & khí hậu', icon: '🌍', tier: 3 },
  { theme: 'Chính trị & pháp luật', icon: '⚖️', tier: 3 },
  { theme: 'Lịch sử & địa danh', icon: '🏛️', tier: 3 },
  { theme: 'Văn hoá & nghệ thuật', icon: '🎭', tier: 3 },
  { theme: 'Văn học & thành ngữ', icon: '📖', tier: 3 },
  { theme: 'Tâm lý & hành vi', icon: '🧠', tier: 3 },
  { theme: 'Giáo dục & nghiên cứu', icon: '🎓', tier: 3 },
  { theme: 'Truyền thông & quảng cáo', icon: '📢', tier: 3 },
  { theme: 'Công nghiệp & sản xuất', icon: '🏭', tier: 3 },
  { theme: 'Triết học & tư tưởng', icon: '💭', tier: 3 },
];

// Highest theme tier each level receives (level 1 = concrete only; mid+ = all).
const LEVEL_TIER: Record<string, 1 | 2 | 3> = {
  // JLPT
  N5: 1, N4: 2, N3: 3, N2: 3, N1: 3,
  // CEFR
  A1: 1, A2: 2, B1: 3, B2: 3, C1: 3, C2: 3,
  // HSK
  HSK1: 1, HSK2: 2, HSK3: 3, HSK4: 3, HSK5: 3, HSK6: 3,
};

// Full ladders — these must match the roadmap v2 levels (EN→C2, JA→N1, ZH→HSK6),
// otherwise a roadmap node has no categories to bind to.
const LANG_LEVELS: Record<string, string[]> = {
  ja: ['N5', 'N4', 'N3', 'N2', 'N1'],
  en: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  zh: ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'],
};

async function main() {
  let created = 0, updated = 0, langs = 0;
  for (const [code, levels] of Object.entries(LANG_LEVELS)) {
    const lang = await prisma.language.findUnique({ where: { code }, select: { id: true } });
    if (!lang) { console.log(`[catalog] skip ${code} (language not found)`); continue; }
    langs++;
    let order = 0;
    for (const level of levels) {
      const maxTier = LEVEL_TIER[level] ?? 3;
      for (const cat of CORE.filter((c) => c.tier <= maxTier)) {
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
    console.log(`[catalog] ${code}: ${levels.length} levels → ${order} categories ensured`);
  }
  console.log(`[catalog] DONE langs=${langs} created=${created} updated=${updated}`);
}

main()
  .catch((e) => { console.error('[catalog] error', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
