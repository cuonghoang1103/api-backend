#!/usr/bin/env node
/**
 * Seed / update Exam Room content (Phòng thi) from a spec file.
 *
 * Spec (default export):
 *   { course: { courseCode? , slug? }, exams: [ {
 *       kind:'FE'|'PE', peType?:'CODE'|'WRITE'|'SPEAK', code, title, description?,
 *       durationMinutes?, totalPoints?, passMark?, source?, shuffleQuestions?,
 *       shuffleOptions?, instructions?, isPublished?,
 *       questions: [ {
 *         kind:'MCQ'|'CODE'|'WRITE'|'SPEAK', points?, prompt, imageUrl?,
 *         options?:[{text}], correctIndexes?:number[], explanation?,
 *         language?, starterCode?, sampleSolution?, expectedOutput?,
 *         rubric?, speakingPrompts?:[{text}]
 *       } ]
 *   } ] }
 *
 * Idempotent: an exam is keyed by (courseId, kind, code). Re-running updates the
 * exam's metadata and rewrites its questions IN PLACE by position (question i keeps
 * its id), so user bookmarks / comments / answers that point at question ids survive.
 *
 * Usage:
 *   node scripts/academy-seed-exam.mjs --file ./content/exams/CEA201.mjs --apply
 *   (omit --apply for a dry run)
 */
import { PrismaClient, Prisma } from '@prisma/client';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const prisma = new PrismaClient();

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const APPLY = process.argv.includes('--apply');
const FILE = arg('--file');

async function main() {
  if (!FILE) throw new Error('Missing --file <spec.mjs>');
  const abs = path.resolve(process.cwd(), FILE);
  const spec = (await import(pathToFileURL(abs).href)).default;
  if (!spec?.course || !Array.isArray(spec.exams)) throw new Error('Spec must export { course, exams[] }');

  // Resolve course
  const where = spec.course.slug
    ? { slug: spec.course.slug }
    : { courseCode: spec.course.courseCode };
  const course = spec.course.slug
    ? await prisma.course.findUnique({ where: { slug: spec.course.slug } })
    : await prisma.course.findFirst({ where: { courseCode: spec.course.courseCode, academyType: 'FPT' } });
  if (!course) throw new Error(`Course not found: ${JSON.stringify(where)}`);
  console.log(`Course #${course.id} ${course.courseCode || ''} — ${course.title}`);

  for (const e of spec.exams) {
    const code = e.code || null;
    const existing = await prisma.exam.findFirst({ where: { courseId: course.id, kind: e.kind, code } });
    const data = {
      courseId: course.id,
      kind: e.kind,
      peType: e.peType ?? null,
      title: e.title,
      description: e.description ?? null,
      code,
      durationMinutes: e.durationMinutes ?? 60,
      totalPoints: e.totalPoints ?? 10,
      passMark: e.passMark ?? 4,
      shuffleQuestions: e.shuffleQuestions ?? false,
      shuffleOptions: e.shuffleOptions ?? false,
      source: e.source ?? 'SAMPLE',
      instructions: e.instructions ?? null,
      attachmentUrl: e.attachmentUrl ?? null,
      attachmentName: e.attachmentName ?? null,
      isPublished: e.isPublished ?? true,
      sortOrder: e.sortOrder ?? 0,
    };
    const qs = Array.isArray(e.questions) ? e.questions : [];
    console.log(`  ${existing ? 'UPDATE' : 'CREATE'} exam [${e.kind}${e.peType ? '/' + e.peType : ''}] ${code || ''} — ${qs.length} question(s)`);
    if (!APPLY) continue;

    let exam;
    // Cập nhật TẠI CHỖ theo thứ tự câu (09/11/2026) — trước đây deleteMany rồi tạo lại ⇒ id câu đổi mỗi deploy ⇒
    // ExamQuestionBookmark (onDelete: Cascade) của người dùng bị xoá sạch sau MỌI deploy, bài làm/bình luận trỏ id cũ.
    // Nay câu thứ i giữ nguyên id: chỉ ghi đè nội dung; thừa thì xoá đúng phần thừa, thiếu thì tạo thêm.
    const cu = existing
      ? await prisma.examQuestion.findMany({ where: { examId: existing.id }, orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }], select: { id: true } })
      : [];
    if (existing) exam = await prisma.exam.update({ where: { id: existing.id }, data });
    else exam = await prisma.exam.create({ data });
    const J = (v) => (v === undefined || v === null ? Prisma.DbNull : v);
    let order = 0;
    for (let i = 0; i < qs.length; i++) {
      const q = qs[i];
      const qd = {
        kind: q.kind ?? 'MCQ',
        sortOrder: q.sortOrder ?? order++,
        points: q.points ?? 1,
        prompt: q.prompt ?? '',
        imageUrl: q.imageUrl ?? null,
        options: J(q.options),
        correctIndexes: Array.isArray(q.correctIndexes) ? q.correctIndexes : [],
        explanation: q.explanation ?? null,
        language: q.language ?? null,
        starterCode: q.starterCode ?? null,
        sampleSolution: q.sampleSolution ?? null,
        expectedOutput: q.expectedOutput ?? null,
        rubric: J(q.rubric),
        speakingPrompts: J(q.speakingPrompts),
      };
      if (cu[i]) await prisma.examQuestion.update({ where: { id: cu[i].id }, data: qd });
      else await prisma.examQuestion.create({ data: { examId: exam.id, ...qd } });
    }
    if (cu.length > qs.length) {
      await prisma.examQuestion.deleteMany({ where: { id: { in: cu.slice(qs.length).map((x) => x.id) } } });
    }
    console.log(`    ✓ exam #${exam.id} seeded with ${qs.length} question(s)`);
  }

  console.log(APPLY ? 'DONE (applied)' : 'DRY RUN (no changes). Add --apply to write.');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
