/**
 * course-seed.mjs — create/patch ONE general "CuongThai" course from a JSON
 * spec: CourseCategory ▸ Course(academyType=GENERAL) ▸ CourseSection ▸ Lesson.
 * ─────────────────────────────────────────────────────────────────────────────
 * Sibling of `academy-seed-course.mjs`, which is hard-wired to the FPTU
 * catalogue (academyType='FPT' + a Semester). These courses are OUR OWN
 * curriculum: no semester, no course code, they show up under the general
 * "Tất cả khoá học" tab of /courses.
 *
 * PURE DATA — no LLM. Idempotent:
 *   • Category keyed by `slug` (created if missing, else patched).
 *   • Course keyed by `slug` (created, else patched). academyType stays
 *     GENERAL and semesterId stays null so it never leaks into Academy.
 *   • Section keyed by its FIRST lesson's slug — stable across title edits
 *     (a bilingual "EN|||VI" retitle must NOT fork a duplicate section).
 *     Falls back to title match for a section that has no lessons yet.
 *   • Lesson keyed by (section, slug). Existing lessons are UPDATED in place
 *     unless --no-update; new ones append after the current last one.
 * Re-running therefore re-authors content safely and never duplicates or
 * wipes per-user progress (LessonProgress keys on lessonId, preserved).
 *
 *   node scripts/course-seed.mjs --file ./content/courses/nodejs.mjs --dry
 *   node scripts/course-seed.mjs --file ./content/courses/nodejs.mjs --apply
 *
 * SPEC SHAPE (default-exported object):
 *   {
 *     category: { slug:'backend', name:'Backend', icon?, sortOrder? },
 *     course: {
 *       slug:'nodejs-tu-zero-den-production',
 *       title:'Node.js',                       // plain EN, short (no |||)
 *       level:'BEGINNER'|'INTERMEDIATE'|'ADVANCED',
 *       thumbnailUrl, shortDescription ('EN|||VI', < 500 chars!),
 *       description, whatYouLearn, requirements, documentsNote,
 *       isFeatured?, status?:'PUBLISHED'|'DRAFT'
 *     },
 *     sections: [
 *       { title:'Section 0 — …|||Mục 0 — …', description, lessons:[
 *           { title, slug, type:'VIDEO'|'QUIZ'|'EXERCISE'|'SOLUTION',
 *             description, content:'<html>', isFreePreview:true,
 *             teachingNotes:'<html>',   // video script — admin/teacher side
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
console.log(`── course-seed ${spec.course.slug} : ${APPLY ? 'APPLY' : 'DRY'} ──`);

/* Guard: shortDescription is VarChar(500) and a bilingual "EN|||VI" string
   overflows it easily (P2000 at write time, after a long run). Fail early. */
const sd = spec.course.shortDescription;
if (sd && sd.length > 500) {
  console.error(`  ✗ shortDescription ${sd.length} ký tự > 500 (VarChar(500)) — rút ngắn trước khi seed.`);
  process.exit(1);
}
if (spec.course.title && spec.course.title.includes('|||')) {
  console.error('  ✗ course.title phải là tên tiếng Anh NGẮN, KHÔNG "|||" (hiện ở SEO/admin dạng thô).');
  process.exit(1);
}

/* 1. Category (by slug) ---------------------------------------------------- */
let category = null;
if (spec.category) {
  const cat = spec.category;
  const catSlug = cat.slug || slugify(cat.name);
  category = await prisma.courseCategory.findUnique({ where: { slug: catSlug } });
  const catData = {
    name: cat.name, description: cat.description ?? null,
    icon: cat.icon ?? null, sortOrder: cat.sortOrder ?? 0, isActive: true,
  };
  if (!category) {
    console.log(`  + category ${catSlug} "${cat.name}"`);
    if (APPLY) category = await prisma.courseCategory.create({ data: { ...catData, slug: catSlug } });
  } else {
    console.log(`  = category ${catSlug} (id ${category.id})`);
    if (APPLY) await prisma.courseCategory.update({ where: { id: category.id }, data: catData });
  }
}

/* 2. Course (by slug) ------------------------------------------------------ */
const c = spec.course;
const cslug = c.slug || slugify(c.title);
let course = await prisma.course.findUnique({ where: { slug: cslug }, select: { id: true, slug: true, academyType: true } });
if (course && course.academyType !== 'GENERAL') {
  console.error(`  ✗ course slug "${cslug}" đã tồn tại nhưng academyType=${course.academyType} (khoá Academy) — đổi slug để khỏi ghi đè.`);
  process.exit(1);
}
const courseData = {
  title: c.title, academyType: 'GENERAL', semesterId: null, courseCode: c.courseCode ?? null,
  categoryId: category?.id ?? null,
  shortDescription: c.shortDescription ?? null,
  description: c.description ?? null,
  whatYouLearn: c.whatYouLearn ?? null,
  requirements: c.requirements ?? null,
  documentsNote: c.documentsNote ?? null,
  thumbnailUrl: c.thumbnailUrl ?? null,
  level: c.level ?? 'BEGINNER', language: c.language ?? 'Vietnamese',
  accessType: 'FREE', isFree: true, price: 0,
  isFeatured: c.isFeatured ?? false,
  status: c.status ?? 'PUBLISHED', isPublished: (c.status ?? 'PUBLISHED') === 'PUBLISHED',
};
if (!course) {
  console.log(`  + course "${c.title}" /${cslug} [${courseData.status}]`);
  if (APPLY) course = await prisma.course.create({
    data: { ...courseData, slug: cslug, publishedAt: courseData.isPublished ? new Date() : null },
    select: { id: true, slug: true, academyType: true },
  });
} else {
  console.log(`  ~ course "${c.title}" exists (id ${course.id}) → patch metadata`);
  if (APPLY) await prisma.course.update({ where: { id: course.id }, data: courseData });
}

/* 3. Sections + lessons ---------------------------------------------------- */
let secN = 0, lesNew = 0, lesUpd = 0;
if (course) {
  const secs = spec.sections || [];
  const maxSec = await prisma.courseSection.aggregate({ where: { courseId: course.id }, _max: { sortOrder: true } });
  let secOrder = (maxSec._max.sortOrder ?? -1) + 1;

  for (const s of secs) {
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
      // Simulation video, when the lesson has one:
      //   video: { url, platform, durationSeconds }
      // `platform: 'DIRECT'` is what makes the learn page use the native
      // <video> player instead of the YouTube embed path. Written to BOTH
      // Lesson and LessonDetail because the learn page reads the detail
      // first and falls back to the lesson row, and the course card totals
      // read videoDurationSeconds off the lesson.
      const video = l.video?.url
        ? {
            url: l.video.url,
            platform: l.video.platform ?? 'DIRECT',
            durationSeconds: Math.max(0, Math.round(l.video.durationSeconds ?? 0)),
          }
        : null;

      const lessonCore = {
        title: l.title, description: l.description ?? null, content: l.content ?? null,
        lessonType: normType(l.type), isFreePreview: l.isFreePreview ?? false, isPublished: l.isPublished ?? true,
        // Only set when present: re-seeding a lesson whose video has not been
        // rendered yet must NOT wipe a video attached in an earlier pass.
        ...(video ? { videoUrl: video.url, videoDurationSeconds: video.durationSeconds } : {}),
      };
      // LessonDetail carries the teaching notes (the on-camera script), the
      // quiz payload and the video pointer. All optional and patched, never
      // blanked.
      const detailPatch = {
        ...(quizData ? { quizData } : {}),
        ...(l.teachingNotes ? { teachingNotes: l.teachingNotes } : {}),
        ...(video ? { videoUrl: video.url, videoPlatform: video.platform } : {}),
      };

      const existing = section ? await prisma.lesson.findFirst({ where: { sectionId: section.id, slug: lslug } }) : null;
      if (!existing) {
        const lo = lesOrder++; lesNew++;
        console.log(`      + lesson @${lo} [${lessonCore.lessonType}]: ${l.title}`);
        if (APPLY && section) await prisma.lesson.create({
          data: {
            sectionId: section.id, slug: lslug, sortOrder: lo, ...lessonCore,
            details: { create: { videoPlatform: 'EMBED', ...detailPatch } },
          },
        });
      } else if (!NO_UPDATE) {
        lesUpd++;
        console.log(`      ~ lesson [${lessonCore.lessonType}]: ${l.title} (re-author)`);
        if (APPLY) {
          await prisma.lesson.update({ where: { id: existing.id }, data: lessonCore });
          await prisma.lessonDetail.upsert({
            where: { lessonId: existing.id },
            create: { lessonId: existing.id, videoPlatform: 'EMBED', ...detailPatch },
            update: detailPatch,
          });
        }
      } else {
        console.log(`      = lesson (skip): ${l.title}`);
      }
    }
  }

  /* 4. Roll up counters shown on the course card (lessons / duration). ------
     totalLessons is displayed on every CourseCard; leaving it at 0 makes a
     60-lesson course advertise "0 lessons". */
  if (APPLY) {
    const total = await prisma.lesson.count({ where: { section: { courseId: course.id }, isPublished: true } });
    await prisma.course.update({ where: { id: course.id }, data: { totalLessons: total } });
    console.log(`  · totalLessons = ${total}`);
  }
}

console.log(`\nsections +${secN} · lessons +${lesNew} ~${lesUpd}. ${APPLY ? 'Done.' : 'Dry-run — add --apply.'}`);
await prisma.$disconnect();
