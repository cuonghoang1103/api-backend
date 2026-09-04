/**
 * exam-reapply-comments.mjs — KHÔNG AI. Nối lại ExamQuestionComment.questionId
 * sau khi "Exam Room seed" xoá+tạo lại ExamQuestion (id đổi, nội dung câu giữ
 * nguyên) — khớp theo (examId, promptHash) đã lưu ngay trên chính dòng bình
 * luận lúc đăng (xem src/services/examComment.service.ts). Idempotent, an
 * toàn chạy lặp mỗi deploy (xem deploy.sh, chạy ngay sau exam-reapply-chapters
 * cùng cơ chế). Bình luận của câu KHÔNG còn tồn tại nữa (nội dung câu đổi/bị
 * xoá khỏi đề) giữ questionId=null — vẫn còn dữ liệu, chỉ tạm không hiện
 * dưới câu nào cho tới khi khớp lại được.
 *
 *   node scripts/exam-reapply-comments.mjs --apply
 */
import { PrismaClient } from '@prisma/client';
import { promptHash } from './_exam-hash.mjs';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

// Mọi exam đang có ít nhất 1 bình luận cần nối lại.
const examIds = (
  await prisma.examQuestionComment.findMany({ distinct: ['examId'], select: { examId: true } })
).map((r) => r.examId);

console.log(`Reapply bình luận cho ${examIds.length} đề. APPLY=${APPLY}`);

let totalRestored = 0, totalUnmapped = 0, totalAlready = 0;
for (const examId of examIds) {
  const questions = await prisma.examQuestion.findMany({ where: { examId }, select: { id: true, prompt: true } });
  const hashToId = new Map(questions.map((q) => [promptHash(q.prompt), q.id]));

  const comments = await prisma.examQuestionComment.findMany({
    where: { examId },
    select: { id: true, promptHash: true, questionId: true },
  });

  let restored = 0, unmapped = 0, already = 0;
  for (const c of comments) {
    const currentId = hashToId.get(c.promptHash) ?? null;
    if (currentId === null) { unmapped++; continue; }
    if (c.questionId === currentId) { already++; continue; }
    if (APPLY) await prisma.examQuestionComment.update({ where: { id: c.id }, data: { questionId: currentId } });
    restored++;
  }
  totalRestored += restored; totalUnmapped += unmapped; totalAlready += already;
  console.log(`  exam #${examId}: ${APPLY ? 'nối lại' : 'sẽ nối lại'} ${restored} · đã đúng ${already} · không khớp câu nào (câu đã đổi/xoá) ${unmapped} / ${comments.length} bình luận`);
}

console.log(`XONG — tổng: nối lại ${totalRestored} · đã đúng ${totalAlready} · không khớp ${totalUnmapped}`);
await prisma.$disconnect();
