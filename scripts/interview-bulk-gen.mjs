/**
 * interview-bulk-gen.mjs — fill empty interview topics with AI-generated questions.
 * ─────────────────────────────────────────────────────────────────────────────
 * Runs INSIDE the backend container (dist/ + full runtime env present):
 *   docker exec cuonghoangdev_backend node scripts/interview-bulk-gen.mjs [--limit N] [--dry]
 *
 * Reuses the EXISTING admin pipeline (generateQuestions → commitQuestions):
 * same prompt template, RAG grounding when KB coverage exists, anti-duplication,
 * zod-lenient parsing. This script only orchestrates it in bulk:
 *   1. Pick PUBLISHED topics that have ZERO questions (any status) — idempotent:
 *      re-running skips topics that got questions in a previous run.
 *   2. One call per topic: level MID, count 6 (the session sampler's level
 *      ladder serves MID questions to nearby levels, so one solid MID set makes
 *      the topic immediately usable at every level).
 *   3. Validate each committed question (body/rubric/mustMention/refAnswer
 *      minimums) and PUBLISH the ones that pass; failures stay DRAFT for admin
 *      review in /admin/interview. rubricReviewed stays false either way.
 *
 * Sequential on purpose (gateway-friendly); ~30-60s/topic. Safe to Ctrl-C and
 * resume. --limit N processes only the first N topics (cost control), --dry
 * lists what would be processed without calling the LLM.
 */
import { PrismaClient } from '@prisma/client';

const { generateQuestions, commitQuestions } = await import('../dist/services/interview/questionGen.service.js');

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx >= 0 ? Number(args[limitIdx + 1]) || 0 : 0;
const ADMIN_USER_ID = 1; // real admin (Cuong03dx) — quota + authorship attribution

// Publish gate — a question must be substantial enough to grade honestly.
function isPublishable(q) {
  return (
    typeof q.body === 'string' && q.body.trim().length >= 30 &&
    typeof q.referenceAnswer === 'string' && q.referenceAnswer.trim().length >= 80 &&
    Array.isArray(q.rubric) && q.rubric.length >= 2 &&
    Array.isArray(q.mustMention) && q.mustMention.length >= 2
  );
}

const topics = await prisma.interviewTopic.findMany({
  where: { status: 'PUBLISHED', questions: { none: {} } },
  orderBy: [{ trackId: 'asc' }, { sortOrder: 'asc' }],
  select: { id: true, slug: true, nameVi: true, track: { select: { slug: true } } },
});
const work = LIMIT > 0 ? topics.slice(0, LIMIT) : topics;
console.log(`[bulk-gen] empty topics: ${topics.length}; processing: ${work.length}${DRY ? ' (DRY RUN)' : ''}`);

let done = 0, published = 0, drafts = 0, failed = 0;
for (const tp of work) {
  const tag = `${tp.track.slug}/${tp.slug}`;
  if (DRY) { console.log(`  would generate → ${tag}`); continue; }
  try {
    const preview = await generateQuestions({
      userId: ADMIN_USER_ID, topicId: tp.id, level: 'MID', count: 6, language: 'VI', useKnowledge: true,
    });
    const commit = await commitQuestions({
      topicId: tp.id, level: 'MID', questions: preview.questions, authorId: ADMIN_USER_ID,
    });
    // Publish the committed questions that pass the substance gate.
    const rows = await prisma.interviewQuestion.findMany({
      where: { id: { in: commit.ids } },
      select: { id: true, body: true, referenceAnswer: true, rubric: true, mustMention: true },
    });
    const publishIds = rows.filter(isPublishable).map((r) => r.id);
    if (publishIds.length) {
      await prisma.interviewQuestion.updateMany({ where: { id: { in: publishIds } }, data: { status: 'PUBLISHED' } });
    }
    published += publishIds.length;
    drafts += commit.ids.length - publishIds.length;
    done++;
    console.log(`  [${done}/${work.length}] ${tag}: +${commit.ids.length} (${publishIds.length} published, grounded=${preview.grounded})`);
  } catch (e) {
    failed++;
    console.error(`  [!] ${tag}: ${e?.message ?? e}`);
    // Quota reached / AI down → stop cleanly; the run is resumable.
    if (String(e?.message ?? '').includes('hạn mức') || String(e?.message ?? '').includes('AI đang tắt')) break;
  }
}

console.log(`[bulk-gen] DONE topics=${done} published=${published} draft=${drafts} failed=${failed}`);
await prisma.$disconnect();
