/**
 * academy-seed-course.mjs — create/patch ONE FPTU Academy course from a JSON
 * spec: Semester ▸ Course ▸ CourseSection ▸ Lesson (+ LessonDetail / quizData).
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE DATA — no LLM. Idempotent:
 *   • Semester keyed by `code` (created if missing).
 *   • Course keyed by `courseCode` + academyType FPT (created, else patched).
 *   • Section keyed by (courseId, title). New sections append after existing.
 *   • Lesson keyed by (course, slug). Existing lessons are UPDATED in place
 *     (content re-authored) unless --no-update; new ones are appended.
 * So re-running re-authors content safely and never duplicates or wipes
 * per-user progress (LessonProgress is keyed by lessonId, which is preserved).
 *
 *   node scripts/academy-seed-course.mjs --file ./content/academy/PRF192.mjs --dry
 *   node scripts/academy-seed-course.mjs --file ./content/academy/PRF192.mjs --apply
 *
 * SPEC SHAPE (default-exported object):
 *   {
 *     semester: { code:'KY1', name:'Kỳ 1', ordinal:1 },
 *     course: {
 *       courseCode:'PRF192', title:'PRF192 — Cơ sở lập trình',
 *       level:'BEGINNER', language:'Vietnamese', status:'PUBLISHED',
 *       shortDescription, description, whatYouLearn, requirements, documentsNote
 *     },
 *     sections: [
 *       { title:'Mục 0 — Giới thiệu & Hướng dẫn học', description, lessons:[
 *           { title, slug, type:'VIDEO'|'QUIZ'|'EXERCISE'|'SOLUTION',
 *             description, content:'<html>', isFreePreview:true,
 *             quiz:{ timeLimitSeconds, questions:[{question,options,correctIndex,points}] } },
 *       ] },
 *     ],
 *   }
 */
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const APPLY = has('--apply');
const NO_UPDATE = has('--no-update');
const FILE = val('--file');
if (!FILE) { console.error('cần --file <spec.mjs>'); process.exit(1); }

function slugify(text) {
  return String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd')
    .toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}
const TYPES = new Set(['VIDEO', 'QUIZ', 'EXERCISE', 'SOLUTION', 'DOCUMENT']);
const normType = (t) => (TYPES.has(String(t || '').toUpperCase()) ? String(t).toUpperCase() : 'VIDEO');

const spec = (await import(pathToFileURL(path.resolve(FILE)).href)).default;
console.log(`── academy-seed ${spec.course.courseCode} : ${APPLY ? 'APPLY' : 'DRY'} ──`);

/* 1. Semester (by code) ---------------------------------------------------- */
const sm = spec.semester;
let semester = await prisma.semester.findUnique({ where: { code: sm.code } });
if (!semester) {
  console.log(`  + semester ${sm.code} "${sm.name}" @${sm.ordinal}`);
  if (APPLY) semester = await prisma.semester.create({
    data: { code: sm.code, name: sm.name, ordinal: sm.ordinal ?? 0, isActive: true, description: sm.description ?? null },
  });
} else console.log(`  = semester ${sm.code} (id ${semester.id})`);

/* 2. Course (by courseCode) ------------------------------------------------ */
const c = spec.course;
const cslug = c.slug || slugify(c.title);
let course = await prisma.course.findFirst({ where: { courseCode: c.courseCode, academyType: 'FPT' } });
const courseData = {
  title: c.title, courseCode: c.courseCode, academyType: 'FPT',
  semesterId: semester?.id ?? null,
  shortDescription: c.shortDescription ?? null,
  description: c.description ?? null,
  whatYouLearn: c.whatYouLearn ?? null,
  requirements: c.requirements ?? null,
  documentsNote: c.documentsNote ?? null,
  level: c.level ?? 'BEGINNER', language: c.language ?? 'Vietnamese',
  accessType: 'FREE', isFree: true, price: 0,
  status: c.status ?? 'PUBLISHED', isPublished: (c.status ?? 'PUBLISHED') === 'PUBLISHED',
};
if (!course) {
  console.log(`  + course ${c.courseCode} "${c.title}" [${courseData.status}]`);
  if (APPLY) course = await prisma.course.create({
    data: { ...courseData, slug: cslug, publishedAt: courseData.isPublished ? new Date() : null },
    select: { id: true, slug: true },
  });
} else {
  console.log(`  ~ course ${c.courseCode} exists (id ${course.id}) → patch metadata`);
  if (APPLY) await prisma.course.update({ where: { id: course.id }, data: courseData });
}

/* 3. Sections + lessons ---------------------------------------------------- */
let secN = 0, lesNew = 0, lesUpd = 0;
if (course) {
  const secs = spec.sections || [];
  const maxSec = await prisma.courseSection.aggregate({ where: { courseId: course.id }, _max: { sortOrder: true } });
  let secOrder = (maxSec._max.sortOrder ?? -1) + 1;

  for (const s of secs) {
    // Identify an existing section by its FIRST lesson's slug — stable across
    // title edits (e.g. switching a section title to bilingual "EN|||VI").
    // Keying by title alone would create a duplicate section every time a
    // title changes. Fall back to title match for a section with no lessons.
    const firstLes = (s.lessons || [])[0];
    const anchorSlug = firstLes ? (firstLes.slug || slugify(firstLes.title)) : null;
    let section = null;
    if (anchorSlug) {
      const anchor = await prisma.lesson.findFirst({
        where: { slug: anchorSlug, section: { courseId: course.id } },
        select: { sectionId: true },
      });
      if (anchor) section = await prisma.courseSection.findUnique({ where: { id: anchor.sectionId } });
    }
    if (!section) section = await prisma.courseSection.findFirst({ where: { courseId: course.id, title: s.title } });
    if (!section) {
      const so = secOrder++; secN++;
      console.log(`    + section @${so}: ${s.title}`);
      if (APPLY) section = await prisma.courseSection.create({
        data: { courseId: course.id, title: s.title, description: s.description ?? null, sortOrder: so },
      });
    } else {
      console.log(`    = section: ${s.title}`);
      if (APPLY) await prisma.courseSection.update({ where: { id: section.id }, data: { title: s.title, description: s.description ?? null } });
    }

    const maxLes = section ? await prisma.lesson.aggregate({ where: { sectionId: section.id }, _max: { sortOrder: true } }) : { _max: { sortOrder: -1 } };
    let lesOrder = (maxLes._max.sortOrder ?? -1) + 1;

    for (const l of (s.lessons || [])) {
      const lslug = l.slug || slugify(l.title);
      const quizData = l.quiz ? {
        timeLimitSeconds: l.quiz.timeLimitSeconds ?? 600,
        questions: (l.quiz.questions || []).map((q, i) => ({
          id: q.id ?? `q${i + 1}`, question: q.question,
          options: q.options, correctIndex: q.correctIndex, points: q.points ?? 1,
        })),
      } : undefined;
      const lessonCore = {
        title: l.title, description: l.description ?? null, content: l.content ?? null,
        lessonType: normType(l.type), isFreePreview: l.isFreePreview ?? false, isPublished: l.isPublished ?? true,
      };

      const existing = section ? await prisma.lesson.findFirst({ where: { sectionId: section.id, slug: lslug } }) : null;
      if (!existing) {
        const lo = lesOrder++; lesNew++;
        console.log(`      + lesson @${lo} [${lessonCore.lessonType}]: ${l.title}`);
        if (APPLY && section) await prisma.lesson.create({
          data: {
            sectionId: section.id, slug: lslug, sortOrder: lo, ...lessonCore,
            details: { create: { videoPlatform: 'EMBED', ...(quizData ? { quizData } : {}) } },
          },
        });
      } else if (!NO_UPDATE) {
        lesUpd++;
        console.log(`      ~ lesson [${lessonCore.lessonType}]: ${l.title} (re-author)`);
        if (APPLY) {
          await prisma.lesson.update({ where: { id: existing.id }, data: lessonCore });
          await prisma.lessonDetail.upsert({
            where: { lessonId: existing.id },
            create: { lessonId: existing.id, videoPlatform: 'EMBED', ...(quizData ? { quizData } : {}) },
            update: { ...(quizData ? { quizData } : {}) },
          });
        }
      } else {
        console.log(`      = lesson (skip): ${l.title}`);
      }
    }
  }
}

console.log(`\nsections +${secN} · lessons +${lesNew} ~${lesUpd}. ${APPLY ? 'Done.' : 'Dry-run — add --apply.'}`);
await prisma.$disconnect();
