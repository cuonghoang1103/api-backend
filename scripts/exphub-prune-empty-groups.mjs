/**
 * exphub-prune-empty-groups.mjs — remove leftover EMPTY root groups from Exp Hub.
 * ─────────────────────────────────────────────────────────────────────────────
 * The taxonomy accumulated a few junk top-level groups that have NO technologies
 * and NO snippets under them (e.g. "Game", "Lab211", and duplicate "Next.Js" /
 * "Node.JS" placeholders that were never populated — the real Next.js/Node.js
 * belong as tech leaves under Frontend/Backend, not as empty root groups). They
 * clutter the top-level nav. This lists and (with --apply) deletes ONLY root
 * categories that are genuinely empty: 0 child categories AND 0 snippets.
 *
 *   node scripts/exphub-prune-empty-groups.mjs            # DRY — list only (default)
 *   node scripts/exphub-prune-empty-groups.mjs --apply    # actually delete them
 *   node scripts/exphub-prune-empty-groups.mjs --keep game,lab211   # never touch these slugs
 *
 * SAFE BY DESIGN: only removes roots with zero descendants and zero snippets, so
 * no doc/snippet content can be lost. Run inside the backend container (dist/).
 */
import { PrismaClient } from '@prisma/client';

const { deleteCategory } = await import('../dist/services/snippets.service.js');

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const keepIdx = args.indexOf('--keep');
const KEEP = keepIdx >= 0 ? String(args[keepIdx + 1] || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean) : [];

async function main() {
  const roots = await prisma.snippetCategory.findMany({
    where: { parentId: null },
    select: { id: true, name: true, slug: true, _count: { select: { children: true, snippets: true } } },
    orderBy: { sortOrder: 'asc' },
  });

  const empty = roots.filter(
    (r) => r._count.children === 0 && r._count.snippets === 0 && !KEEP.includes(r.slug.toLowerCase()),
  );

  console.log(`[prune] ${roots.length} root groups; ${empty.length} empty${APPLY ? '' : ' — DRY (pass --apply to delete)'}`);
  for (const r of empty) {
    if (APPLY) {
      await deleteCategory(r.id); // safe: no children, no snippets
      console.log(`  ✓ deleted "${r.name}" (${r.slug})`);
    } else {
      console.log(`  ~ would delete "${r.name}" (${r.slug})`);
    }
  }
  if (!empty.length) console.log('  (nothing to prune)');
  console.log(`[prune] done.${APPLY ? '' : ' Nothing was changed.'}`);
  await prisma.$disconnect();
}

main().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
