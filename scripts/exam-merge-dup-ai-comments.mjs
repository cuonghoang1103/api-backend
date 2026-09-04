/**
 * exam-merge-dup-ai-comments.mjs — KHÔNG AI. Gộp các bình luận GỐC của
 * CuongMini bị TRÙNG câu hỏi (cùng questionId, cùng nhãn "Hỏi:", không phân
 * biệt hoa/thường) thành MỘT gốc: giữ bản CŨ NHẤT làm gốc, các bản còn lại
 * chuyển thành REPLY của nó (giữ nguyên nội dung/thời gian, chỉ đổi parentId).
 *
 * examComment.service.ts::postAiAnswerComment() đã tự gộp NGAY LÚC đăng, nên
 * script này chỉ còn cần cho: (1) dữ liệu trùng đã lỡ tạo TRƯỚC khi vá xong
 * (04-05/09/2026), (2) lưới đỡ cho race hiếm — 2 request gần như đồng thời
 * cùng KHÔNG thấy nhau lúc kiểm gốc trùng. An toàn chạy lặp mỗi deploy.
 *
 * Bỏ qua (không gộp, chỉ log cảnh báo) bản trùng nào đã có REPLY riêng của
 * người dùng — gộp nó vào làm reply-của-reply sẽ làm listComments() (chỉ lấy
 * 1 cấp) không hiện được các reply đó nữa.
 *
 *   node scripts/exam-merge-dup-ai-comments.mjs --apply
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');
const AI_COMMENT_RE = /^\*\*Hỏi:\*\* ([\s\S]*?)\n\n\*\*CuongMini trả lời:\*\*\n([\s\S]*)$/;

const roots = await prisma.examQuestionComment.findMany({
  where: { isAi: true, parentId: null },
  select: { id: true, questionId: true, content: true, createdAt: true },
  orderBy: { createdAt: 'asc' },
});

const childCounts = new Map();
for (const row of await prisma.examQuestionComment.findMany({ where: { parentId: { not: null } }, select: { parentId: true } })) {
  childCounts.set(row.parentId, (childCounts.get(row.parentId) || 0) + 1);
}

const byKey = new Map();
for (const r of roots) {
  const m = r.content.match(AI_COMMENT_RE);
  if (!m) continue;
  const key = `${r.questionId}::${m[1].trim().toLowerCase()}`;
  if (!byKey.has(key)) byKey.set(key, []);
  byKey.get(key).push(r);
}

let merged = 0, skipped = 0;
for (const [key, group] of byKey) {
  if (group.length < 2) continue;
  const [keep, ...dups] = group; // cũ nhất giữ làm gốc (orderBy asc)
  for (const d of dups) {
    if (childCounts.get(d.id)) {
      console.log(`  bỏ qua #${d.id} (câu ${d.questionId}) — đang có ${childCounts.get(d.id)} reply riêng, không gộp`);
      skipped++;
      continue;
    }
    console.log(`  gộp #${d.id} → làm reply của #${keep.id} (câu ${d.questionId}) — ${key.split('::')[1].slice(0, 40)}`);
    if (APPLY) await prisma.examQuestionComment.update({ where: { id: d.id }, data: { parentId: keep.id } });
    merged++;
  }
}

console.log(`XONG — ${APPLY ? 'đã gộp' : 'sẽ gộp'} ${merged} bình luận trùng · bỏ qua ${skipped} (có reply riêng). APPLY=${APPLY}`);
await prisma.$disconnect();
