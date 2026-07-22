/**
 * codelab-seed-authored.mjs — write HAND-AUTHORED Code Lab exercises from JSON.
 * ─────────────────────────────────────────────────────────────────────────────
 * Companion to codelab-seed-oop.mjs, but generic: instead of one hard-coded
 * module it ingests a directory of JSON payload files, so content authored
 * outside the VPS (by a model with its own budget) can be committed without
 * touching the LLM gateway at all.
 *
 * PURE DATA — calls NO LLM and restarts nothing, so it is SAFE to run while the
 * AI bulk-gen / language jobs are in flight. It reuses the admin service
 * (createExercise) so slugs, the trackId denorm and the FTS tsvector stay right.
 *
 *   node scripts/codelab-seed-authored.mjs --dir /tmp/authored --dry
 *   node scripts/codelab-seed-authored.mjs --dir /tmp/authored --apply
 *   node scripts/codelab-seed-authored.mjs --file /tmp/authored/react-hooks.json --apply
 *
 * PAYLOAD SHAPE (one file = one module):
 *   {
 *     "trackSlug": "react",
 *     "moduleSlug": "react-hooks-in-depth",
 *     "exercises": [ { title, difficulty, estimatedMinutes, points, concepts[],
 *                      prerequisites[], tags[], problemHtml, inputSpec,
 *                      outputSpec, constraints, examplesJson[], hintsJson[],
 *                      starterCodeJson[], solutionCodeJson[],
 *                      solutionExplanationHtml, diagramMermaid? }, ... ]
 *   }
 *
 * FLAGS
 *   --dir D      ingest every *.json in D (default /tmp/authored)
 *   --file F     ingest a single payload file
 *   --apply      actually write (default = dry preview)
 *   --replace    delete the module's existing exercises first (default: append,
 *                skipping any exercise whose title already exists there)
 *   --move-done  after a successful apply, rename the file to *.done
 */
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const { createExercise, deleteExercise } = await import('../dist/services/codeLab.service.js');

const prisma = new PrismaClient();
const ADMIN = 1;
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };

const APPLY = has('--apply');
const REPLACE = has('--replace');
const MOVE_DONE = has('--move-done');
const DIR = val('--dir', '/tmp/authored');
const FILE = val('--file', null);

const REQUIRED = ['title', 'problemHtml', 'starterCodeJson', 'solutionCodeJson', 'solutionExplanationHtml'];

// Query / command languages where a whole correct answer is legitimately short:
// `SELECT * FROM customers;` is 24 characters and a complete solution. Judging
// these by the 200-char "too thin" rule (written for imperative code) rejects
// correct beginner SQL — so exempt a solution whose blocks are all declarative.
const QUERY_LANGS = new Set(['sql', 'postgresql', 'plpgsql', 'tsql', 'mysql', 'graphql', 'cypher',
  'yaml', 'hcl', 'json', 'bash', 'sh', 'shell', 'dockerfile', 'nginx', 'redis', 'text']);
const allDeclarative = (blocks, exLang) => {
  const arr = Array.isArray(blocks) ? blocks : [];
  if (arr.length && arr.every((b) => QUERY_LANGS.has(String(b?.language ?? '').toLowerCase()))) return true;
  return QUERY_LANGS.has(String(exLang ?? '').toLowerCase());
};

function validate(ex, i) {
  const errs = [];
  for (const k of REQUIRED) if (!ex[k] || (Array.isArray(ex[k]) && !ex[k].length)) errs.push(`missing ${k}`);
  if (ex.difficulty && !['EASY', 'MEDIUM', 'HARD'].includes(ex.difficulty)) errs.push(`bad difficulty ${ex.difficulty}`);
  if (!Array.isArray(ex.hintsJson) || ex.hintsJson.length < 2) errs.push('needs >= 2 hints');
  if (!Array.isArray(ex.examplesJson) || ex.examplesJson.length < 1) errs.push('needs >= 1 example');
  if (String(ex.problemHtml || '').length < 300) errs.push('problemHtml too thin (<300 chars)');
  const sol = (ex.solutionCodeJson || []).map((b) => b.code || '').join('');
  if (sol.length < 200 && !allDeclarative(ex.solutionCodeJson, ex.language)) errs.push('solution code too thin (<200 chars)');
  // Only flag genuine "unfinished work" markers. Two traps to avoid: a bare "..." is legal
  // JS/TS (spread/rest) and legal Python (Ellipsis), and the word "todo" is ordinary DATA in
  // a to-do app — so require an uppercase marker sitting inside a COMMENT.
  if (/(\/\/|#|\/\*|\*)\s*(TODO|FIXME)\b/.test(sol)
      || /…|(\/\/|#)\s*\.\.\.\s*$|rest omitted|omitted for brevity|implementation left/im.test(sol)) {
    errs.push('solution still contains an unfinished-work marker');
  }
  return errs.length ? `#${i + 1} "${ex.title || '?'}": ${errs.join(', ')}` : null;
}

const files = FILE
  ? [FILE]
  : (fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => path.join(DIR, f)).sort() : []);

if (!files.length) { console.log(`[authored] no payload files (dir=${DIR})`); await prisma.$disconnect(); process.exit(0); }
console.log(`[authored] ${files.length} payload file(s); mode=${APPLY ? 'APPLY' : 'DRY'}${REPLACE ? ' replace' : ' append'}`);

let written = 0, skipped = 0, failed = 0;

for (const f of files) {
  let payload;
  try { payload = JSON.parse(fs.readFileSync(f, 'utf8')); }
  catch (e) { console.log(`  ✗ ${path.basename(f)}: bad JSON — ${e.message}`); failed++; continue; }

  const { trackSlug, moduleSlug, exercises } = payload;
  if (!trackSlug || !moduleSlug || !Array.isArray(exercises)) {
    console.log(`  ✗ ${path.basename(f)}: needs trackSlug, moduleSlug, exercises[]`); failed++; continue;
  }

  const track = await prisma.codeTrack.findUnique({ where: { slug: trackSlug }, select: { id: true, language: true } });
  if (!track) { console.log(`  ✗ ${path.basename(f)}: track "${trackSlug}" not found`); failed++; continue; }
  const mod = await prisma.codeModule.findFirst({
    where: { trackId: track.id, slug: moduleSlug },
    select: { id: true, name: true },
  });
  if (!mod) { console.log(`  ✗ ${path.basename(f)}: module "${moduleSlug}" not in ${trackSlug}`); failed++; continue; }

  const errs = exercises.map(validate).filter(Boolean);
  if (errs.length) {
    console.log(`  ✗ ${trackSlug}/${moduleSlug}: ${errs.length} invalid exercise(s)`);
    for (const e of errs) console.log(`      ${e}`);
    failed++; continue;
  }

  const existing = await prisma.codeExercise.findMany({ where: { moduleId: mod.id }, select: { id: true, title: true, sortOrder: true } });
  const haveTitles = new Set(existing.map((e) => e.title.trim().toLowerCase()));
  const fresh = REPLACE ? exercises : exercises.filter((e) => !haveTitles.has(e.title.trim().toLowerCase()));
  const dropped = exercises.length - fresh.length;

  console.log(`  · ${trackSlug}/${moduleSlug} (${mod.name}): have ${existing.length}, +${fresh.length}${dropped ? ` (${dropped} dup title skipped)` : ''}`);
  if (!APPLY) { skipped += fresh.length; continue; }

  if (REPLACE && existing.length) {
    for (const e of existing) await deleteExercise(e.id);
    console.log(`      – deleted ${existing.length} existing`);
  }
  let order = REPLACE ? 0 : (existing.reduce((m, e) => Math.max(m, e.sortOrder), 0) + 1);
  for (const ex of fresh) {
    try {
      await createExercise({
        moduleId: mod.id,
        title: ex.title,
        language: (ex.language || track.language || 'text').toLowerCase(),
        difficulty: ex.difficulty || 'MEDIUM',
        status: 'PUBLISHED',
        sortOrder: order++,
        problemHtml: ex.problemHtml,
        concepts: ex.concepts || [],
        prerequisites: ex.prerequisites || [],
        inputSpec: ex.inputSpec ?? null,
        outputSpec: ex.outputSpec ?? null,
        constraints: ex.constraints ?? null,
        examplesJson: ex.examplesJson || [],
        hintsJson: ex.hintsJson || [],
        starterCodeJson: ex.starterCodeJson || [],
        solutionCodeJson: ex.solutionCodeJson || [],
        solutionExplanationHtml: ex.solutionExplanationHtml,
        diagramMermaid: ex.diagramMermaid ?? null,
        referenceUrl: ex.referenceUrl ?? null,
        tags: ex.tags || [],
        estimatedMinutes: ex.estimatedMinutes ?? null,
        points: ex.points ?? 10,
      }, ADMIN);
      written++;
      console.log(`      ✓ [${ex.difficulty || 'MEDIUM'}] ${ex.title}`);
    } catch (e) {
      failed++;
      console.log(`      ✗ ${ex.title}: ${e.message}`);
    }
  }
  if (MOVE_DONE) fs.renameSync(f, f + '.done');
}

console.log(`[authored] done — written=${written} previewed=${skipped} failed=${failed}`);
await prisma.$disconnect();
