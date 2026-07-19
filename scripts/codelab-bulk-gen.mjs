/**
 * codelab-bulk-gen.mjs — mass-generate Code Lab roadmaps + exercises with AI.
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses the SAME admin pipeline the /admin/code-lab panel uses (generateRoadmap /
 * generateExercises → commitExercises): same NTU-style English prompt, same LLM
 * gateway. This just drives it across ALL tracks/modules so you don't click 189
 * times. Runs against the COMPILED dist/ (so `npm run build` first, or run in the
 * VPS container which already ships dist).
 *
 *   # preview only, writes nothing:
 *   node scripts/codelab-bulk-gen.mjs --dry
 *   # roadmap redesign (replace EMPTY modules) + 10 exercises/module, everything:
 *   node scripts/codelab-bulk-gen.mjs --roadmap --fresh-roadmap --per-module 10
 *   # just a few flagship tracks:
 *   node scripts/codelab-bulk-gen.mjs --tracks java-core,spring-boot,sql --per-module 10
 *
 * On the VPS (strong model, own token budget — run AFTER other AI jobs finish):
 *   docker exec -e LLM_MODEL_GENERATION=claude-opus-4-8 cuonghoangdev_backend \
 *     node scripts/codelab-bulk-gen.mjs --roadmap --fresh-roadmap --per-module 10 --budget 3000000
 *
 * FLAGS
 *   --dry                 preview, write nothing (default = WRITE)
 *   --tracks a,b          only these track slugs        --groups a,b   only these group slugs
 *   --roadmap             also (re)generate modules per track before exercises
 *   --roadmap-only        stop after the roadmap phase
 *   --fresh-roadmap       in roadmap phase, DELETE modules that have 0 exercises first
 *   --modules-per-track N roadmap module count (default 8)   --titles N  hint titles/module (default 8)
 *   --per-module N        target published exercises per module (default 10)
 *   --batch N             exercises generated per LLM call (default 4)
 *   --limit-modules N     stop after touching N modules this run (0 = no cap)
 *   --budget T            token throttle over the shared 5h window (0 = off)
 *   --sleep MS            pause between LLM calls (default 1200)
 */
import { PrismaClient } from '@prisma/client';

const { generateRoadmap, generateExercises, generateExerciseBlueprint, commitExercises } = await import('../dist/services/codeLab.ai.service.js');

// Difficulty ramp by final slot position: first ~20% EASY, middle ~60% MEDIUM,
// last ~20% HARD — so a module goes from on-ramp to challenging.
function rampDifficulty(pos, total) {
  const r = pos / Math.max(1, total);
  if (r <= 0.2) return 'EASY';
  if (r <= 0.8) return 'MEDIUM';
  return 'HARD';
}
const { createModule, deleteModule } = await import('../dist/services/codeLab.service.js');

const prisma = new PrismaClient();
const ADMIN = 1;
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const num = (f, d) => { const v = val(f, undefined); const n = Number(v); return v === undefined || Number.isNaN(n) ? d : n; };
const list = (f) => String(val(f, '')).split(',').map((s) => s.trim()).filter(Boolean);

const DRY = has('--dry');
const DO_ROADMAP = has('--roadmap') || has('--roadmap-only');
const ROADMAP_ONLY = has('--roadmap-only');
const FRESH = has('--fresh-roadmap');
const TRACKS = list('--tracks');
const GROUPS = list('--groups');
const MODULES_PER_TRACK = num('--modules-per-track', 8);
const TITLES = num('--titles', 8);
const PER_MODULE = num('--per-module', 10);
const BATCH = Math.max(1, Math.min(8, num('--batch', 4)));
const LIMIT_MODULES = num('--limit-modules', 0);
const SLEEP = num('--sleep', 1200);

// ── Token-window throttle (shared gateway window, same as other bulk jobs) ──
const WINDOW_MS = 5 * 60 * 60 * 1000;
const BUDGET = num('--budget', 0);
const MODEL = process.env.LLM_MODEL_GENERATION || 'claude-opus-4-8';
async function windowUsed() {
  const a = await prisma.interviewLLMCallLog.aggregate({
    where: { createdAt: { gte: new Date(Date.now() - WINDOW_MS) }, success: true, model: MODEL },
    _sum: { inputTokens: true, outputTokens: true },
  });
  return (a._sum.inputTokens ?? 0) + (a._sum.outputTokens ?? 0);
}
async function waitBudget() {
  if (BUDGET <= 0) return;
  for (;;) {
    if ((await windowUsed()) < BUDGET) return;
    const oldest = await prisma.interviewLLMCallLog.findFirst({ where: { createdAt: { gte: new Date(Date.now() - WINDOW_MS) }, success: true }, orderBy: { createdAt: 'asc' }, select: { createdAt: true } });
    const wake = Math.max(10 * 60_000, (oldest ? oldest.createdAt.getTime() + WINDOW_MS : Date.now()) - Date.now() + 5 * 60_000);
    console.log(`  [throttle] window near ${(BUDGET / 1e6).toFixed(1)}M — sleep ${(wake / 60000).toFixed(0)}m`);
    await new Promise((r) => setTimeout(r, wake));
  }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isQuotaErr = (m) => /hạn mức|AI đang tắt|disabled|Daily AI limit|quota/i.test(String(m));
const isTransientErr = (m) => /busy|đang bận|returned nothing|chưa ra kết quả|524|529|timeout|ETIMEDOUT|ECONNRESET|fetch failed|overloaded/i.test(String(m));

let stop = false, modulesTouched = 0, exWrote = 0, modWrote = 0, fails = 0;

async function selectedTracks() {
  const where = {};
  if (TRACKS.length) where.slug = { in: TRACKS };
  if (GROUPS.length) where.group = { slug: { in: GROUPS } };
  return prisma.codeTrack.findMany({ where, orderBy: [{ groupId: 'asc' }, { sortOrder: 'asc' }], select: { id: true, name: true, slug: true } });
}

// ── Phase 1: roadmap (modules) per track ───────────────────────────────────
async function roadmapPhase(tracks) {
  for (const t of tracks) {
    if (stop) break;
    if (FRESH) {
      const empties = await prisma.codeModule.findMany({ where: { trackId: t.id, exercises: { none: {} } }, select: { id: true } });
      if (empties.length) {
        console.log(`  [roadmap] ${t.slug}: ${DRY ? 'would delete' : 'deleting'} ${empties.length} empty module(s)`);
        if (!DRY) for (const m of empties) await deleteModule(m.id);
      }
    }
    await waitBudget();
    try {
      // EXTEND: only generate the modules still needed to reach the target, and
      // tell the AI what already exists so it adds deeper/advanced topics only.
      const existingMods = await prisma.codeModule.findMany({ where: { trackId: t.id }, select: { slug: true, name: true } });
      const need = MODULES_PER_TRACK - existingMods.length;
      if (need <= 0) { console.log(`  · [roadmap] ${t.slug}: already ${existingMods.length}/${MODULES_PER_TRACK} modules — skip`); await sleep(SLEEP); continue; }
      const res = await generateRoadmap(ADMIN, {
        trackId: t.id,
        moduleCount: need,
        titlesPerModule: TITLES,
        existingNames: existingMods.map((m) => m.name),
      });
      const existing = new Set(existingMods.map((m) => m.slug));
      const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
      let order = existingMods.length;
      let added = 0;
      for (const m of res.modules) {
        const sl = slugify(m.name);
        if (existing.has(sl)) continue;
        existing.add(sl);
        added++;
        if (!DRY) await createModule({ trackId: t.id, name: m.name, description: m.description, level: m.level, sortOrder: order++ });
      }
      modWrote += added;
      console.log(`  ${DRY ? '~' : '✓'} [roadmap] ${t.slug}: ${existingMods.length} existing, ${DRY ? 'would add' : 'added'} ${added} (target ${MODULES_PER_TRACK})`);
    } catch (e) {
      fails++;
      const msg = String(e?.message ?? e);
      console.error(`  [!] roadmap ${t.slug}: ${msg.slice(0, 120)}`);
      if (isQuotaErr(msg)) { stop = true; console.log('  [stop] quota/AI off — stopping'); }
      else if (isTransientErr(msg)) await sleep(15_000);
    }
    await sleep(SLEEP);
  }
}

// ── Phase 2: exercises per module (top up to PER_MODULE) ────────────────────
async function exercisePhase(tracks) {
  for (const t of tracks) {
    if (stop) break;
    const modules = await prisma.codeModule.findMany({ where: { trackId: t.id }, orderBy: { sortOrder: 'asc' }, select: { id: true, name: true, slug: true } });
    for (const mod of modules) {
      if (stop) break;
      if (LIMIT_MODULES && modulesTouched >= LIMIT_MODULES) { console.log(`[limit] hit --limit-modules ${LIMIT_MODULES}`); stop = true; break; }
      const existing = await prisma.codeExercise.findMany({ where: { moduleId: mod.id }, select: { title: true } });
      const have = existing.length;
      const need = PER_MODULE - have;
      if (need <= 0) continue;
      modulesTouched++;
      const seen = new Set(existing.map((e) => e.title));       // avoid re-skinning these
      console.log(`  · ${t.slug}/${mod.slug}: have ${have}, need ${need}`);
      // Blueprint of DISTINCT sub-topics so each new exercise is a different facet,
      // not a re-skin of one canonical problem.
      let blueprint = [];
      try { await waitBudget(); blueprint = await generateExerciseBlueprint(ADMIN, { moduleId: mod.id, count: need, avoidTitles: [...seen] }); }
      catch { blueprint = []; }
      for (let k = 0; k < need && !stop; k++) {
        const pos = have + k + 1;                               // final 1-indexed slot
        const difficulty = rampDifficulty(pos, PER_MODULE);
        const topic = blueprint[k] || undefined;
        await waitBudget();
        try {
          const gen = await generateExercises(ADMIN, { moduleId: mod.id, count: 1, difficulty, topic, avoidTitles: [...seen] });
          gen.exercises.forEach((e) => seen.add(e.title));       // future calls must avoid these too
          if (DRY) {
            console.log(`    ~ [${difficulty}] ${topic ? '(' + topic + ') ' : ''}${gen.exercises.map((e) => e.title).join(' | ').slice(0, 90)}`);
          } else {
            const res = await commitExercises(ADMIN, { moduleId: mod.id, exercises: gen.exercises });
            exWrote += res.created;
            console.log(`    ✓ [${difficulty}] +${res.created} ${topic ? topic + ' ' : ''}(${pos}/${PER_MODULE})`);
          }
        } catch (e) {
          fails++;
          const msg = String(e?.message ?? e);
          console.error(`    [!] ${mod.slug} slot ${pos}: ${msg.slice(0, 120)}`);
          if (isQuotaErr(msg)) { stop = true; console.log('  [stop] quota/AI off — stopping'); break; }
          if (isTransientErr(msg)) { await sleep(15_000); k--; continue; }   // retry same slot
          // non-transient: skip this slot, continue to next
        }
        await sleep(SLEEP);
      }
    }
  }
}

async function main() {
  const tracks = await selectedTracks();
  console.log(`[codelab-bulk] ${tracks.length} track(s)${DRY ? ' — DRY' : ''}; per-module=${PER_MODULE}, batch=${BATCH}, roadmap=${DO_ROADMAP}${FRESH ? '(fresh)' : ''}, model=${MODEL}`);
  if (!tracks.length) { console.log('No tracks matched. Seed first: node scripts/codelab-seed.mjs --apply'); await prisma.$disconnect(); return; }

  if (DO_ROADMAP) await roadmapPhase(tracks);
  if (!ROADMAP_ONLY) await exercisePhase(tracks);

  console.log(`\n[codelab-bulk] done. modules +${modWrote}, exercises +${exWrote}, modules touched ${modulesTouched}, failures ${fails}${DRY ? ' (DRY — nothing written)' : ''}`);
  await prisma.$disconnect();
}

main().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
