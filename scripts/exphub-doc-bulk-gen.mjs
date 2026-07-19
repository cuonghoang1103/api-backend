/**
 * exphub-doc-bulk-gen.mjs — fill Exp Hub category docs with AI (full English).
 * ─────────────────────────────────────────────────────────────────────────────
 * Runs INSIDE the backend container (dist/ + runtime env), reusing the EXISTING
 * admin pipeline (generateCategoryDoc → commitCategoryDoc): same prompt, same
 * normalization, immediate publish. This only orchestrates it in bulk, resumably,
 * with the shared token throttle.
 *
 *   docker exec cuonghoangdev_backend node scripts/exphub-doc-bulk-gen.mjs \
 *     [--roots] [--all] [--force] [--regen-thin] [--limit N] [--only slug,slug] [--dry] [--budget 3200000]
 *
 * Scope (default = every NON-root category = the technologies):
 *   --roots       also write an overview doc for the root GROUP categories
 *   --all         every category (roots + children)
 *   --only        restrict to these category slugs (comma list)
 *   --force       (re)write even categories that already have a doc
 *   --regen-thin  re-write ONLY categories whose EXISTING doc is too shallow
 *                 (below isThinDoc: <22 blocks / <4 code / <5k chars). This is the
 *                 cheap, targeted way to upgrade the old thin cheat-sheet docs to
 *                 full guides WITHOUT re-spending tokens on the already-deep ones.
 * Resumable: a category that already has a doc is SKIPPED unless --force/--regen-thin.
 * Throttle: sleeps when the shared 5h gateway window nears --budget tokens
 *   (same key/window as interview + language bulk-gen — run ONE flat-out, not all).
 */
import { PrismaClient } from '@prisma/client';

const { generateCategoryDoc, commitCategoryDoc, isThinDoc } = await import('../dist/services/snippets.aiDoc.service.js');

const prisma = new PrismaClient();
const ADMIN = 1;
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const num = (f, d) => { const v = val(f, undefined); const n = Number(v); return v === undefined || Number.isNaN(n) ? d : n; };

const DRY = has('--dry');
const FORCE = has('--force');
const REGEN_THIN = has('--regen-thin');
const ROOTS = has('--roots');
const ALL = has('--all');
const LIMIT = num('--limit', 0);
const ONLY = String(val('--only', '')).split(',').map((s) => s.trim()).filter(Boolean);

// ── Token-window throttle (shared with interview/language via interviewLLMCallLog) ──
const WINDOW_MS = 5 * 60 * 60 * 1000;
const BUDGET = num('--budget', 3_200_000);
const THROTTLE = BUDGET > 0;
const MODEL = process.env.LLM_MODEL_GENERATION || 'claude-opus-4-8';
async function windowUsed() {
  const a = await prisma.interviewLLMCallLog.aggregate({
    where: { createdAt: { gte: new Date(Date.now() - WINDOW_MS) }, success: true, model: MODEL },
    _sum: { inputTokens: true, outputTokens: true },
  });
  return (a._sum.inputTokens ?? 0) + (a._sum.outputTokens ?? 0);
}
async function waitBudget() {
  if (!THROTTLE) return;
  for (;;) {
    if (await windowUsed() < BUDGET) return;
    const oldest = await prisma.interviewLLMCallLog.findFirst({ where: { createdAt: { gte: new Date(Date.now() - WINDOW_MS) }, success: true }, orderBy: { createdAt: 'asc' }, select: { createdAt: true } });
    const wake = Math.max(10 * 60_000, (oldest ? oldest.createdAt.getTime() + WINDOW_MS : Date.now()) - Date.now() + 5 * 60_000);
    console.log(`  [throttle] window near ${(BUDGET / 1e6).toFixed(1)}M — sleep ${(wake / 60000).toFixed(0)}m`);
    await new Promise((r) => setTimeout(r, wake));
  }
}

let stop = false, done = 0, wrote = 0, skipped = 0, fails = 0;
const isQuotaErr = (m) => /hạn mức|AI đang tắt|quota/i.test(String(m));
const isTransientErr = (m) => /đang bận|chưa ra kết quả|524|529|timeout|ETIMEDOUT|ECONNRESET|fetch failed|overloaded/i.test(String(m));

async function main() {
  // Default = the technologies (non-root categories). --all/--roots also cover
  // the root GROUP categories (an "overview" doc for Backend, Frontend, …).
  const where = (ALL || ROOTS) ? {} : { parentId: { not: null } };
  let cats = await prisma.snippetCategory.findMany({
    where,
    select: { id: true, name: true, slug: true, parentId: true, docGeneratedAt: true, docBlocks: true },
    orderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }],
  });
  if (ONLY.length) cats = cats.filter((c) => ONLY.includes(c.slug));

  // Selection:
  //   --force       → every category in scope
  //   --regen-thin  → categories with NO doc OR whose existing doc is too shallow
  //   (default)     → only categories with no doc yet
  const isThin = (c) => Array.isArray(c.docBlocks) && isThinDoc(c.docBlocks);
  const todo = cats.filter((c) =>
    FORCE ? true : REGEN_THIN ? (!c.docGeneratedAt || isThin(c)) : !c.docGeneratedAt,
  );
  const thinCount = REGEN_THIN ? cats.filter((c) => c.docGeneratedAt && isThin(c)).length : 0;
  console.log(
    `[exphub-doc] ${todo.length} categories to write (${cats.length - todo.length} skipped` +
    `${REGEN_THIN ? `, incl. ${thinCount} thin docs to upgrade` : ''})${DRY ? ' — DRY' : ''}`,
  );

  for (const cat of todo) {
    if (stop) break;
    if (LIMIT && done >= LIMIT) { console.log(`[exphub-doc] hit --limit ${LIMIT}`); break; }
    await waitBudget();
    try {
      const preview = await generateCategoryDoc(ADMIN, { categoryId: cat.id });
      const blocks = preview?.blocks ?? [];
      if (!blocks.length) { skipped++; console.log(`  · ${cat.slug}: AI returned no blocks — skip`); continue; }
      if (DRY) {
        console.log(`  ~ ${cat.slug}: would write ${blocks.length} blocks (dry)`);
      } else {
        const res = await commitCategoryDoc(ADMIN, { categoryId: cat.id, blocks, model: preview.model, lang: 'EN' });
        wrote += res.blocks;
        console.log(`  ✓ ${cat.slug}: ${res.blocks} blocks`);
      }
      done++;
    } catch (e) {
      fails++;
      const msg = e?.message ?? e;
      console.error(`  [!] ${cat.slug}: ${String(msg).slice(0, 120)}`);
      if (isQuotaErr(msg)) { stop = true; break; }
      if (isTransientErr(msg)) { await new Promise((r) => setTimeout(r, 60_000)); }
    }
  }

  console.log(`[exphub-doc] DONE — wrote docs for ${done} categories (${wrote} blocks total), ${skipped} empty, ${fails} errors.`);
  await prisma.$disconnect();
}

main().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
