/**
 * codelab-dedupe.mjs — find & remove near-duplicate exercises WITHIN each module.
 * The old exercise generator re-converged on one canonical problem per module
 * (10 near-identical variants). This clusters by title+concept similarity and
 * keeps the best few per cluster; re-run the improved bulk-gen afterwards to
 * refill to PER_MODULE with DISTINCT, difficulty-ramped exercises.
 *
 *   node scripts/codelab-dedupe.mjs --track java-core            # DRY (preview)
 *   node scripts/codelab-dedupe.mjs --track java-core --apply    # actually delete
 *   flags: --track slug (or all) · --threshold 0.55 · --keep 1 · --apply
 */
import { PrismaClient } from '@prisma/client';
const { deleteExercise } = await import('../dist/services/codeLab.service.js');
const prisma = new PrismaClient();

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const num = (f, d) => { const v = Number(val(f, undefined)); return Number.isNaN(v) ? d : v; };
const APPLY = has('--apply');
const TRACK = val('--track', 'all');
const THRESHOLD = num('--threshold', 0.55);
const KEEP = Math.max(1, num('--keep', 1));

const STOP = new Set(['a', 'an', 'the', 'and', 'or', 'to', 'of', 'in', 'with', 'for', 'using', 'use', 'implement', 'create', 'build', 'write', 'class', 'system', 'program', 'application', 'app']);
function tokens(s) {
  return new Set(String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)));
}
function jaccard(a, b) {
  if (!a.size && !b.size) return 1;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}
function sim(a, b) {
  const t = jaccard(tokens(a.title), tokens(b.title));
  const c = jaccard(new Set((a.concepts || []).map((x) => String(x).toLowerCase())), new Set((b.concepts || []).map((x) => String(x).toLowerCase())));
  return Math.max(t, 0.5 * t + 0.5 * c);
}

const where = TRACK === 'all' ? {} : { track: { slug: TRACK } };
const modules = await prisma.codeModule.findMany({
  where,
  select: { id: true, name: true, track: { select: { slug: true } },
    exercises: { select: { id: true, title: true, concepts: true, points: true, createdAt: true }, orderBy: { createdAt: 'asc' } } },
  orderBy: [{ trackId: 'asc' }, { sortOrder: 'asc' }],
});

let totalDel = 0, modsAffected = 0;
for (const mod of modules) {
  const exs = mod.exercises;
  if (exs.length < 2) continue;
  // greedy clustering: each exercise joins the first kept cluster it is similar to
  const clusters = [];
  for (const ex of exs) {
    let placed = false;
    for (const cl of clusters) {
      if (sim(ex, cl.rep) >= THRESHOLD) { cl.members.push(ex); placed = true; break; }
    }
    if (!placed) clusters.push({ rep: ex, members: [ex] });
  }
  // in each cluster keep the KEEP best (by points, then earliest); delete the rest
  const toDelete = [];
  for (const cl of clusters) {
    if (cl.members.length <= KEEP) continue;
    const sorted = [...cl.members].sort((a, b) => (b.points - a.points) || (a.createdAt - b.createdAt));
    toDelete.push(...sorted.slice(KEEP));
  }
  if (!toDelete.length) continue;
  modsAffected++;
  console.log(`\n${mod.track.slug}/${mod.name} — ${exs.length} exercises, ${clusters.length} distinct cluster(s), delete ${toDelete.length}:`);
  for (const cl of clusters) console.log(`   • keep: "${cl.rep.title}"  (cluster of ${cl.members.length})`);
  for (const ex of toDelete) {
    console.log(`   ${APPLY ? 'DEL' : '~del'} #${ex.id} "${ex.title}"`);
    if (APPLY) { try { await deleteExercise(ex.id); totalDel++; } catch (e) { console.error(`     ERR ${ex.id}: ${String(e?.message || e).slice(0, 100)}`); } }
    else totalDel++;
  }
}
console.log(`\n[dedupe] ${APPLY ? 'DELETED' : 'would delete'} ${totalDel} exercise(s) across ${modsAffected} module(s)${APPLY ? '' : '  (DRY — pass --apply to delete)'}`);
await prisma.$disconnect();
