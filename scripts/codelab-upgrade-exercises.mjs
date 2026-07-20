/**
 * codelab-upgrade-exercises.mjs — patch EXISTING exercises in place.
 * ─────────────────────────────────────────────────────────────────────────────
 * The sibling seeder (codelab-seed-authored.mjs) can append or `--replace`, and
 * replace means delete-then-recreate. That is fine for a module nobody has
 * touched, but it throws away the exercise row — and with it the learner's
 * CodeProgress and the public slug. When the goal is "this exercise is fine but
 * needs a second worked example", the row must survive.
 *
 * So this script matches an existing exercise by slug (or, failing that, by
 * exact title within the module) and updates only the fields present in the
 * patch. Anything omitted is left exactly as it was.
 *
 *   node scripts/codelab-upgrade-exercises.mjs --dir /tmp/upgrades --dry
 *   node scripts/codelab-upgrade-exercises.mjs --dir /tmp/upgrades --apply
 *
 * PAYLOAD (one file = one module):
 *   {
 *     "trackSlug": "java-core",
 *     "moduleSlug": "control-flow-methods",
 *     "patches": [
 *       { "slug": "...", "title": "...",        // slug preferred; title is the fallback
 *         "problemHtml": "...",                  // optional
 *         "examplesJson": [ {input,output,explanation}, ... ],   // optional
 *         "hintsJson": ["...", ...] }            // optional
 *     ]
 *   }
 *
 * PURE DATA: no LLM, no restart — safe to run while AI jobs are in flight.
 */
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const { updateExercise } = await import('../dist/services/codeLab.service.js');

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };

const APPLY = has('--apply');
const DIR = val('--dir', '/tmp/upgrades');
const FILE = val('--file', null);

/** Guard rails: a patch must improve the exercise, never hollow it out. */
function validatePatch(p, i) {
  const errs = [];
  if (!p.slug && !p.title) errs.push('needs slug or title');
  if (p.examplesJson !== undefined) {
    if (!Array.isArray(p.examplesJson) || p.examplesJson.length < 2) errs.push('examplesJson must have >= 2 entries');
    else for (const e of p.examplesJson) {
      if (!e || typeof e.input !== 'string' || typeof e.output !== 'string') { errs.push('example needs string input+output'); break; }
    }
  }
  if (p.hintsJson !== undefined && (!Array.isArray(p.hintsJson) || p.hintsJson.length < 4)) {
    errs.push('hintsJson must have >= 4 entries');
  }
  for (const k of ['solutionCodeJson', 'starterCodeJson']) {
    if (p[k] === undefined) continue;
    if (!Array.isArray(p[k]) || !p[k].length) { errs.push(`${k} must be a non-empty array`); continue; }
    for (const b of p[k]) {
      if (!b || typeof b.code !== 'string' || b.code.length < 40) { errs.push(`${k} block needs a real code string`); break; }
    }
  }
  if (p.problemHtml !== undefined && String(p.problemHtml).length < 900) {
    errs.push(`problemHtml too thin (${String(p.problemHtml).length} < 900)`);
  }
  return errs.length ? `#${i + 1} "${p.slug || p.title}": ${errs.join(', ')}` : null;
}

const files = FILE
  ? [FILE]
  : (fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => path.join(DIR, f)).sort() : []);

if (!files.length) { console.log(`[upgrade] no payload files (dir=${DIR})`); await prisma.$disconnect(); process.exit(0); }
console.log(`[upgrade] ${files.length} file(s); mode=${APPLY ? 'APPLY' : 'DRY'}`);

let patched = 0, skipped = 0, failed = 0, notFound = 0;

for (const f of files) {
  let payload;
  try { payload = JSON.parse(fs.readFileSync(f, 'utf8')); }
  catch (e) { console.log(`  ✗ ${path.basename(f)}: bad JSON — ${e.message}`); failed++; continue; }

  const { trackSlug, moduleSlug, patches } = payload;
  if (!trackSlug || !moduleSlug || !Array.isArray(patches)) {
    console.log(`  ✗ ${path.basename(f)}: needs trackSlug, moduleSlug, patches[]`); failed++; continue;
  }

  const track = await prisma.codeTrack.findUnique({ where: { slug: trackSlug }, select: { id: true } });
  if (!track) { console.log(`  ✗ track "${trackSlug}" not found`); failed++; continue; }
  const mod = await prisma.codeModule.findFirst({
    where: { trackId: track.id, slug: moduleSlug }, select: { id: true, name: true },
  });
  if (!mod) { console.log(`  ✗ module "${moduleSlug}" not in ${trackSlug}`); failed++; continue; }

  const errs = patches.map(validatePatch).filter(Boolean);
  if (errs.length) {
    console.log(`  ✗ ${trackSlug}/${moduleSlug}: ${errs.length} invalid patch(es)`);
    for (const e of errs) console.log(`      ${e}`);
    failed++; continue;
  }

  const existing = await prisma.codeExercise.findMany({
    where: { moduleId: mod.id },
    select: { id: true, slug: true, title: true },
  });
  const bySlug = new Map(existing.map((e) => [e.slug, e]));
  const byTitle = new Map(existing.map((e) => [e.title.trim().toLowerCase(), e]));

  console.log(`  · ${trackSlug}/${moduleSlug} (${mod.name}): ${patches.length} patch(es) over ${existing.length} exercise(s)`);

  for (const p of patches) {
    const target = (p.slug && bySlug.get(p.slug)) || (p.title && byTitle.get(String(p.title).trim().toLowerCase()));
    if (!target) {
      notFound++;
      console.log(`      ? not found: ${p.slug || p.title}`);
      continue;
    }
    const data = {};
    if (p.problemHtml !== undefined) data.problemHtml = p.problemHtml;
    if (p.examplesJson !== undefined) data.examplesJson = p.examplesJson;
    if (p.hintsJson !== undefined) data.hintsJson = p.hintsJson;
    if (p.constraints !== undefined) data.constraints = p.constraints;
    if (p.inputSpec !== undefined) data.inputSpec = p.inputSpec;
    if (p.outputSpec !== undefined) data.outputSpec = p.outputSpec;
    if (p.solutionExplanationHtml !== undefined) data.solutionExplanationHtml = p.solutionExplanationHtml;
    // Code fields are allowed but deliberately last in the list: patching a
    // solution is how you repair an exercise whose official answer does not
    // compile, and that has to be possible — but the caller must have compiled
    // the replacement first, because "reveal solution" is the one place a
    // learner cannot tell our mistake from their own.
    if (p.solutionCodeJson !== undefined) data.solutionCodeJson = p.solutionCodeJson;
    if (p.starterCodeJson !== undefined) data.starterCodeJson = p.starterCodeJson;
    if (!Object.keys(data).length) { skipped++; continue; }

    if (!APPLY) { skipped++; console.log(`      ~ would patch [${Object.keys(data).join(', ')}] ${target.title}`); continue; }
    try {
      await updateExercise(target.id, data);
      patched++;
      console.log(`      ✓ ${Object.keys(data).join(', ')} — ${target.title}`);
    } catch (e) {
      failed++;
      console.log(`      ✗ ${target.title}: ${e.message}`);
    }
  }
}

console.log(`[upgrade] done — patched=${patched} previewed=${skipped} notFound=${notFound} failed=${failed}`);
await prisma.$disconnect();
