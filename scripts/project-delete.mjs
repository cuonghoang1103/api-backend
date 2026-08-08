/**
 * project-delete.mjs — remove a case-study row (and its four child tables) by
 * slug. Companion to project-seed.mjs, which can create and re-author a project
 * but never delete one.
 * ─────────────────────────────────────────────────────────────────────────────
 *   node scripts/project-delete.mjs --slug foo --slug bar        # DRY, default
 *   node scripts/project-delete.mjs --slug foo --apply           # actually delete
 *
 * WHY A SCRIPT AND NOT THE ADMIN UI
 * The rows to remove live in the production database, which is not reachable
 * from a dev machine. Everything else that mutates prod content is a script
 * invoked by deploy.sh on the VPS, and a deletion should not be the one
 * exception that requires clicking through an editor.
 *
 * IDEMPOTENT BY DESIGN — a slug that is already gone is reported and skipped
 * with exit 0. That is what makes it safe to leave the call in deploy.sh: the
 * first deploy removes the row, every later deploy is a no-op. It also means a
 * typo'd slug fails quietly, so the DRY output (which prints exactly what it
 * matched) is the thing to read before adding --apply.
 *
 * Children (milestones / features / resources / list items / likes) all declare
 * onDelete: Cascade, so the single delete removes them too. The counts are
 * printed first because a case-study with real traffic is worth a second look
 * before it disappears — viewCount and likeCount cannot be recovered.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');

/* --slug can repeat; that is the whole interface. */
const slugs = args.reduce((acc, a, i) => {
  if (a === '--slug' && args[i + 1]) acc.push(args[i + 1]);
  return acc;
}, []);

if (!slugs.length) {
  console.error('cần ít nhất một --slug <slug>');
  console.error('  ví dụ: node scripts/project-delete.mjs --slug cuongthaicom --apply');
  process.exit(1);
}

console.log(`── project-delete : ${APPLY ? 'APPLY' : 'DRY'} · ${slugs.length} slug ──`);

let deleted = 0;
let missing = 0;

for (const slug of slugs) {
  const project = await prisma.project.findUnique({
    where: { slug },
    select: {
      id: true, title: true, viewCount: true, likeCount: true,
      bodyMdx: true, isPublished: true,
      _count: { select: { milestones: true, features: true, resources: true, listItems: true, likes: true } },
    },
  });

  if (!project) {
    console.log(`   • ${slug} — không có trong DB, bỏ qua`);
    missing++;
    continue;
  }

  const c = project._count;
  const bodyKb = ((project.bodyMdx?.length ?? 0) / 1024).toFixed(1);
  console.log(`   • ${slug} → #${project.id} "${project.title}"`);
  console.log(`     ${project.viewCount} lượt xem · ${project.likeCount} thích · bodyMdx ${bodyKb}KB · ${c.milestones} mốc / ${c.features} tính năng / ${c.resources} tài nguyên / ${c.listItems} mục / ${c.likes} like`);

  if (!APPLY) {
    console.log('     DRY: sẽ XOÁ (kèm toàn bộ bản ghi con qua cascade)');
    continue;
  }

  await prisma.project.delete({ where: { id: project.id } });

  /* Read back: a delete that silently did nothing looks identical to a
     successful one in the log, and this script runs unattended in deploy.sh. */
  const still = await prisma.project.findUnique({ where: { slug }, select: { id: true } });
  if (still) {
    console.error(`     ✗ xoá xong nhưng đọc lại VẪN thấy #${still.id}`);
    await prisma.$disconnect();
    process.exit(1);
  }
  console.log('     ✓ đã xoá');
  deleted++;
}

console.log(APPLY
  ? `  ✓ xoá ${deleted} dự án · ${missing} slug không tồn tại (đã bỏ qua)`
  : `  DRY: ${slugs.length - missing} dự án sẽ bị xoá · chạy lại với --apply để thực hiện`);

await prisma.$disconnect();
