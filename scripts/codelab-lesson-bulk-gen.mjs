/**
 * codelab-lesson-bulk-gen.mjs — generate NTU-style LESSONS for Code Lab modules.
 * Runs INSIDE the backend container (dist/ + runtime env). Reuses the admin
 * pipeline (generateLesson → commitLesson). Resumable (skips modules that already
 * have a lesson unless --force), throttled on the shared 5h gateway window.
 *
 *   docker exec -d cuonghoangdev_backend sh -c "node scripts/codelab-lesson-bulk-gen.mjs --budget 8000000 > /tmp/codelab-lessons.log 2>&1"
 *
 * FLAGS: --force  --limit N  --tracks a,b  --shard i/n (only modules where id%n==i)
 *        --dry  --budget T (0 = no throttle)  --sleep MS
 */
import { PrismaClient } from '@prisma/client';
const { generateLesson, commitLesson } = await import('../dist/services/codeLab.lesson.service.js');

const prisma = new PrismaClient();
const ADMIN = 1;
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const num = (f, d) => { const v = val(f, undefined); const n = Number(v); return v === undefined || Number.isNaN(n) ? d : n; };
const list = (f) => String(val(f, '')).split(',').map((s) => s.trim()).filter(Boolean);

const DRY = has('--dry');
const FORCE = has('--force');
const LIMIT = num('--limit', 0);
const TRACKS = list('--tracks');
const SLEEP = num('--sleep', 1000);
const shardStr = val('--shard', '');
let SHARD_I = -1, SHARD_N = 0;
if (shardStr && /^\d+\/\d+$/.test(shardStr)) { const [i, n] = shardStr.split('/').map(Number); SHARD_I = i; SHARD_N = n; }

const WINDOW_MS = 5 * 60 * 60 * 1000;
const BUDGET = num('--budget', 0);
const MODEL = process.env.LLM_MODEL_GENERATION || 'claude-opus-4-8';
async function windowUsed() {
  const a = await prisma.interviewLLMCallLog.aggregate({ where: { createdAt: { gte: new Date(Date.now() - WINDOW_MS) }, success: true, model: MODEL }, _sum: { inputTokens: true, outputTokens: true } });
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
const isQuota = (m) => /hạn mức|AI đang tắt|disabled|Daily AI limit|quota/i.test(String(m));
const isTransient = (m) => /busy|đang bận|returned nothing|chưa ra kết quả|524|529|timeout|ETIMEDOUT|ECONNRESET|fetch failed|overloaded/i.test(String(m));

let stop = false, done = 0, wrote = 0, fails = 0;

async function main() {
  const where = {};
  if (TRACKS.length) where.track = { slug: { in: TRACKS } };
  let mods = await prisma.codeModule.findMany({ where, select: { id: true, name: true, lessonGeneratedAt: true, track: { select: { slug: true } } }, orderBy: [{ trackId: 'asc' }, { sortOrder: 'asc' }] });
  if (SHARD_N > 0) mods = mods.filter((m) => m.id % SHARD_N === SHARD_I);
  const todo = mods.filter((m) => FORCE || !m.lessonGeneratedAt);
  console.log(`[codelab-lessons] ${todo.length} module(s) to write${SHARD_N ? ` (shard ${SHARD_I}/${SHARD_N})` : ''}${DRY ? ' — DRY' : ''}`);

  for (const mod of todo) {
    if (stop) break;
    if (LIMIT && done >= LIMIT) { console.log(`[limit] ${LIMIT}`); break; }
    await waitBudget();
    try {
      const res = await generateLesson(ADMIN, { moduleId: mod.id });
      const blocks = res?.blocks ?? [];
      if (!blocks.length) { console.log(`  · ${mod.track.slug}/${mod.id}: empty — skip`); continue; }
      if (DRY) { console.log(`  ~ ${mod.track.slug}/${mod.id} "${mod.name}": ${blocks.length} blocks (dry)`); }
      else { const c = await commitLesson(ADMIN, { moduleId: mod.id, blocks, model: res.model }); wrote += c.blocks; console.log(`  ✓ ${mod.track.slug}/${mod.id} "${mod.name}": ${c.blocks} blocks`); }
      done++;
    } catch (e) {
      fails++;
      const msg = e?.message ?? e;
      console.error(`  [!] ${mod.id}: ${String(msg).slice(0, 120)}`);
      if (isQuota(msg)) { stop = true; break; }
      if (isTransient(msg)) await sleep(15_000);
    }
    await sleep(SLEEP);
  }
  console.log(`[codelab-lessons] DONE — wrote ${done} lessons (${wrote} blocks), ${fails} errors.`);
  await prisma.$disconnect();
}
main().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
