/**
 * exam-reapply-chapters.mjs — KHÔNG AI. Khôi phục ExamQuestion.sectionId từ
 * BẢN ĐỒ BỀN (ExamChapterMap) theo nội dung câu (promptHash) → sortOrder chương
 * → sectionId hiện tại. Idempotent, an toàn chạy lặp (cron gọi định kỳ) → sau
 * mỗi lần re-seed đề, sectionId tự lành trong vài giây, không tốn AI.
 *
 *   node scripts/exam-reapply-chapters.mjs --course SWR302          # dry run
 *   node scripts/exam-reapply-chapters.mjs --course SWR302 --apply
 *   node scripts/exam-reapply-chapters.mjs --all --apply            # mọi khoá có map
 */
import { PrismaClient } from '@prisma/client';
import { promptHash } from './_exam-hash.mjs';

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const APPLY = has('--apply');
const ALL = has('--all');
const ONE = val('--course', '');

async function coursesToDo() {
  if (ONE) return [ONE];
  if (ALL) {
    const rows = await prisma.examChapterMap.findMany({ distinct: ['courseCode'], select: { courseCode: true } });
    return rows.map((r) => r.courseCode);
  }
  console.error('Cần --course <MÃ> hoặc --all'); process.exit(1);
}

async function reapplyCourse(courseCode) {
  const course = await prisma.course.findFirst({ where: { courseCode }, select: { id: true } });
  if (!course) { console.log(`  ${courseCode}: không có course`); return; }

  // sortOrder → sectionId hiện tại
  const secs = await prisma.courseSection.findMany({ where: { courseId: course.id }, select: { id: true, sortOrder: true } });
  const orderToId = new Map(secs.map((s) => [s.sortOrder, s.id]));

  // promptHash → sortOrder (bản đồ bền)
  const maps = await prisma.examChapterMap.findMany({ where: { courseCode }, select: { promptHash: true, sectionOrder: true } });
  const hashToOrder = new Map(maps.map((m) => [m.promptHash, m.sectionOrder]));

  // câu hiện tại
  const qs = await prisma.examQuestion.findMany({
    where: { exam: { courseId: course.id } },
    select: { id: true, prompt: true, sectionId: true },
  });

  let restored = 0, unmapped = 0, already = 0, noSection = 0;
  for (const q of qs) {
    const order = hashToOrder.get(promptHash(q.prompt));
    if (order == null) { unmapped++; continue; }
    const sid = orderToId.get(order);
    if (sid == null) { noSection++; continue; }
    if (q.sectionId === sid) { already++; continue; }
    if (APPLY) await prisma.examQuestion.update({ where: { id: q.id }, data: { sectionId: sid } });
    restored++;
  }
  console.log(`  ${courseCode}: ${APPLY ? 'khôi phục' : 'sẽ khôi phục'} ${restored} · đã đúng ${already} · chưa có map ${unmapped} · map hỏng sortOrder ${noSection} / ${qs.length} câu`);
}

const list = await coursesToDo();
console.log(`Reapply ${list.length} khoá. APPLY=${APPLY}`);
for (const cc of list) await reapplyCourse(cc);
console.log('XONG');
await prisma.$disconnect();
