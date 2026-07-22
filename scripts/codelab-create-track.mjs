/**
 * codelab-create-track.mjs — create ONE track + its module skeleton from JSON.
 * ─────────────────────────────────────────────────────────────────────────────
 * The seed catalog (codelab-seed.mjs) is a fixed list. This adds a single new
 * track without editing that file, so a hand-authored track (PostgreSQL) or an
 * AI-filled one (SQL Server, MySQL, Nginx, CI/CD) can be scaffolded on demand.
 *
 * PURE DATA — no LLM, restarts nothing. Idempotent by slug: an existing group /
 * track / module is left untouched, so re-running only fills what's missing.
 *
 *   node scripts/codelab-create-track.mjs --file /tmp/track-postgresql.json --dry
 *   node scripts/codelab-create-track.mjs --file /tmp/track-postgresql.json --apply
 *
 * FILE SHAPE:
 *   { "groupSlug":"database", "slug":"postgresql", "name":"PostgreSQL",
 *     "language":"sql", "color":"#336791", "docsUrl":"https://…",
 *     "status":"DRAFT", "level":"BEGINNER",
 *     "modules":[ {"name":"Getting Started with PostgreSQL","level":"BEGINNER"}, … ] }
 */
import fs from 'node:fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const APPLY = has('--apply');
const FILE = val('--file');
if (!FILE) { console.error('cần --file <track.json>'); process.exit(1); }

function slugify(text) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd')
    .toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

const def = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const tSlug = def.slug || slugify(def.name);
console.log(`── create-track ${tSlug} : ${APPLY ? 'APPLY' : 'DRY'} ──`);

const group = await prisma.codeGroup.findUnique({ where: { slug: def.groupSlug } });
if (!group) { console.error(`group "${def.groupSlug}" not found`); process.exit(1); }

let track = await prisma.codeTrack.findUnique({ where: { slug: tSlug } });
if (track) {
  console.log(`  = track exists (id ${track.id}, status ${track.status})`);
} else {
  const maxOrder = await prisma.codeTrack.aggregate({ where: { groupId: group.id }, _max: { sortOrder: true } });
  const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;
  console.log(`  + track ${def.name} [${def.status || 'DRAFT'}] in ${def.groupSlug} @${sortOrder}`);
  if (APPLY) track = await prisma.codeTrack.create({
    data: {
      groupId: group.id, name: def.name, slug: tSlug, language: def.language,
      color: def.color || '#336791', docsUrl: def.docsUrl || null,
      level: def.level || 'BEGINNER', sortOrder, status: def.status || 'DRAFT',
      description: def.description || null,
    },
  });
}

let mCreated = 0;
if (track) {
  const mods = def.modules || [];
  // New modules append AFTER any existing ones, so re-running to add modules to
  // an existing track keeps them in order instead of colliding on sortOrder.
  const maxMod = await prisma.codeModule.aggregate({ where: { trackId: track.id }, _max: { sortOrder: true } });
  let nextOrder = (maxMod._max.sortOrder ?? -1) + 1;
  for (let i = 0; i < mods.length; i++) {
    const m = mods[i];
    const mSlug = slugify(m.name);
    const existing = await prisma.codeModule.findFirst({ where: { trackId: track.id, slug: mSlug } });
    if (existing) { console.log(`    = module ${i}: ${m.name}`); continue; }
    mCreated++;
    const sortOrder = nextOrder++;
    console.log(`    + module @${sortOrder}: ${m.name} [${m.level || 'BEGINNER'}]`);
    if (APPLY) await prisma.codeModule.create({
      data: { trackId: track.id, name: m.name, slug: mSlug, level: m.level || 'BEGINNER', sortOrder, description: m.description || null },
    });
  }
}
console.log(`\nmodules +${mCreated}. ${APPLY ? 'Done.' : 'Dry-run — add --apply.'}`);
await prisma.$disconnect();
