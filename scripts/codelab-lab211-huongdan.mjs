/**
 * codelab-lab211-huongdan.mjs — module "Hướng dẫn của thầy — đọc từng trang"
 * cho track LAB211 (id 39), sortOrder 0 (ĐẦU TIÊN của track).
 *
 * Nội dung nằm ở scripts/data/lab211-huongdan.mjs — dùng chung với chương
 * Academy, nên hai nơi không thể lệch nhau.
 *
 *   node scripts/codelab-lab211-huongdan.mjs           # thử khô
 *   node scripts/codelab-lab211-huongdan.mjs --apply
 */
import { PrismaClient } from '@prisma/client';
import { BLOCKS } from './data/lab211-huongdan.mjs';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');
const TRACK_ID = 39;
const SLUG = 'lab211-huong-dan-thay';

const soAnh = BLOCKS.filter((b) => b.type === 'image').length;
const soChu = BLOCKS.reduce((a, b) => a + JSON.stringify(b).length, 0);
console.log(`Module "${SLUG}" — ${BLOCKS.length} block · ${soAnh} ảnh · ${soChu.toLocaleString('vi-VN')} ký tự`);
for (const b of BLOCKS) if (b.type === 'part') console.log(`   PHẦN ${b.number}: ${b.textVi}`);

const cu = await prisma.codeModule.findFirst({ where: { trackId: TRACK_ID, slug: SLUG } });
console.log(cu ? `Module đã tồn tại (id ${cu.id}) — ghi đè lessonBlocks.` : 'Module chưa có — tạo mới ở sortOrder 0.');

if (!APPLY) {
  console.log('\n(thử khô — thêm --apply để ghi thật)');
} else if (cu) {
  await prisma.codeModule.update({
    where: { id: cu.id },
    data: { lessonBlocks: BLOCKS, lessonGeneratedAt: new Date(), sortOrder: 0 },
  });
  console.log(`✅ Đã cập nhật module ${cu.id}.`);
} else {
  const m = await prisma.codeModule.create({
    data: {
      trackId: TRACK_ID,
      name: 'Hướng dẫn của thầy — đọc từng trang tài liệu',
      slug: SLUG,
      description:
        'Bốn tài liệu thầy phát, đọc từng trang: ảnh gốc · nguyên văn chữ trên trang · nghĩa là gì với bạn · việc phải làm. Đây là thứ định nghĩa đạt và không đạt — đọc trước khi gõ dòng code đầu tiên.',
      level: 'BEGINNER', sortOrder: 0,
      lessonBlocks: BLOCKS, lessonGeneratedAt: new Date(),
    },
  });
  console.log(`✅ Đã tạo module ${m.id} ở sortOrder 0.`);
}
await prisma.$disconnect();
