/**
 * language-bulk-gen.mjs — fill My Language content with AI, level-tagged.
 * ─────────────────────────────────────────────────────────────────────────────
 * Runs INSIDE the backend container (dist/ + runtime env), reusing the EXISTING
 * admin pipeline (adminGenerate → adminCommit): same prompts, dedup, immediate
 * publish. This only orchestrates it in bulk, resumably, with a token throttle.
 *
 *   docker exec cuonghoangdev_backend node scripts/language-bulk-gen.mjs \
 *     [--langs ja,en,zh] [--sections vocab,grammar,conversation,qna,reading] \
 *     [--vocab 20] [--grammar 25] [--conv 12] [--qna 12] [--reading 3] \
 *     [--limit N] [--dry] [--budget 3200000]
 *
 * Any target set to 0 means UNCAPPED — that unit keeps generating until the AI
 * stops producing new items (the pipeline's dedup decides when it's exhausted),
 * e.g. `--vocab 0` fills every category to whatever its level really holds.
 *
 * Resumable: every unit (category/level) is topped up to its target only.
 * Throttle: sleeps when the shared 5h gateway window nears --budget tokens.
 * Same LLM gateway as the interview module — run this OR interview deepen, not
 * both flat-out (they share the 4M/5h key). Stops cleanly on quota/AI-down.
 */
import { PrismaClient } from '@prisma/client';

const { adminGenerate, adminCommit } = await import('../dist/services/myLanguage.aiGen.service.js');

const prisma = new PrismaClient();
const ADMIN = 1;
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
// NB: `Number(x) || d` would swallow an explicit 0 (falsy) — and 0 is what marks
// a target as uncapped, so parse it properly.
const num = (f, d) => { const v = val(f, undefined); const n = Number(v); return v === undefined || Number.isNaN(n) ? d : n; };
const LANGS = String(val('--langs', 'ja,en,zh')).split(',').map((s) => s.trim()).filter(Boolean);
const SECTIONS = String(val('--sections', 'vocab,grammar,conversation,qna,reading')).split(',').map((s) => s.trim());
const LIMIT = num('--limit', 0);
// A target of 0 means "no cap": keep generating until the AI stops finding new
// items for that unit (the pipeline's dedup is what ends it, not a number).
const unlim = (v) => (v <= 0 ? Infinity : v);
const T = {
  vocab: unlim(num('--vocab', 20)), grammar: unlim(num('--grammar', 25)),
  conv: unlim(num('--conv', 12)), qna: unlim(num('--qna', 12)), reading: unlim(num('--reading', 3)),
};
const shown = (v) => (v === Infinity ? '∞' : v);
const BATCH = 12;

// ── Token-window throttle (shared with interview via interviewLLMCallLog) ──
const WINDOW_MS = 5 * 60 * 60 * 1000;
const BUDGET = num('--budget', 3_200_000);
async function windowUsed() {
  const a = await prisma.interviewLLMCallLog.aggregate({
    where: { createdAt: { gte: new Date(Date.now() - WINDOW_MS) }, success: true }, _sum: { inputTokens: true, outputTokens: true },
  });
  return (a._sum.inputTokens ?? 0) + (a._sum.outputTokens ?? 0);
}
async function waitBudget() {
  for (;;) {
    if (await windowUsed() < BUDGET) return;
    const oldest = await prisma.interviewLLMCallLog.findFirst({ where: { createdAt: { gte: new Date(Date.now() - WINDOW_MS) }, success: true }, orderBy: { createdAt: 'asc' }, select: { createdAt: true } });
    const wake = Math.max(10 * 60_000, (oldest ? oldest.createdAt.getTime() + WINDOW_MS : Date.now()) - Date.now() + 5 * 60_000);
    console.log(`  [throttle] window near ${(BUDGET / 1e6).toFixed(1)}M — sleep ${(wake / 60000).toFixed(0)}m`);
    await new Promise((r) => setTimeout(r, wake));
  }
}

let stop = false, totalCreated = 0, fails = 0;
const isQuotaErr = (m) => /hạn mức|AI đang tắt|quota/i.test(String(m));
// adminGenerate collapses EVERY llmComplete failure (timeout, 524, overload)
// into one "đang bận" message, so that string is a transient error, not a dry
// well. Telling the two apart is what stops a blip from ending a category.
const isTransientErr = (m) => /đang bận|chưa ra kết quả|524|529|timeout|ETIMEDOUT|ECONNRESET|fetch failed|overloaded/i.test(String(m));

/** One generate→commit round. Returns {created, kind}:
 *  'ok' new rows | 'dry' AI found nothing new | 'transient' retryable | 'quota' stop. */
async function round(langCode, section, opts) {
  await waitBudget();
  try {
    const count = Math.min(BATCH, opts.want);
    const preview = await adminGenerate(ADMIN, { languageCode: langCode, section, count, level: opts.level, topic: opts.topic, categoryId: opts.categoryId, articleId: opts.articleId });
    const items = preview?.items?.map((p) => p.data) ?? [];
    if (!items.length) return { created: 0, kind: 'dry' };
    const commit = await adminCommit(ADMIN, { languageCode: langCode, section, items, level: opts.level, categoryId: opts.categoryId, articleId: opts.articleId });
    totalCreated += commit.created;
    return { created: commit.created, kind: commit.created > 0 ? 'ok' : 'dry' };
  } catch (e) {
    fails++;
    const msg = e?.message ?? e;
    console.error(`    [!] ${langCode}/${section}/${opts.label}: ${String(msg).slice(0, 120)}`);
    if (isQuotaErr(msg)) { stop = true; return { created: 0, kind: 'quota' }; }
    if (isTransientErr(msg)) { await new Promise((r) => setTimeout(r, 60_000)); return { created: 0, kind: 'transient' }; }
    return { created: 0, kind: 'dry' };
  }
}

/** Top a (unit) up to `target` published rows, `countFn` re-reads the live count.
 *  target=Infinity → runs until a round yields nothing new (the AI is dry). The
 *  guard only bounds the uncapped case so one unit can't loop forever. */
async function fill(langCode, section, unit, target, countFn) {
  let have = await countFn();
  let guard = 0, softFails = 0;
  const maxRounds = target === Infinity ? 60 : 8;
  while (have < target && !stop && guard < maxRounds) {
    guard++;
    const { created, kind } = await round(langCode, section, { ...unit, want: target - have });
    if (kind === 'transient') {
      // round() already backed off; retry a few times before leaving the unit,
      // otherwise a gateway blip reads as "exhausted" and skips the category.
      if (++softFails >= 3) { console.log(`    ↳ bỏ qua sau 3 lần lỗi tạm thời`); break; }
      continue;
    }
    softFails = 0;
    if (kind === 'dry') break; // AI genuinely has nothing new for this unit
    have += created;
  }
  return have;
}

for (const code of LANGS) {
  if (stop) break;
  const lang = await prisma.language.findUnique({ where: { code }, select: { id: true } });
  if (!lang) { console.log(`[bulk] skip ${code}`); continue; }
  console.log(`\n=== ${code} ===`);

  // VOCAB — per level-tagged category up to T.vocab words.
  if (SECTIONS.includes('vocab')) {
    let cats = await prisma.langVocabCategory.findMany({ where: { languageId: lang.id, level: { not: null } }, orderBy: [{ order: 'asc' }, { id: 'asc' }], select: { id: true, name: true, level: true } });
    if (LIMIT) cats = cats.slice(0, LIMIT);
    for (const c of cats) {
      if (stop) break;
      if (DRY) { console.log(`  would fill vocab ${c.name}`); continue; }
      const n = await fill(code, 'vocab', { level: c.level, topic: c.name.replace(/^[^·]*·\s*/, ''), categoryId: c.id, label: c.name }, T.vocab,
        () => prisma.langVocabWord.count({ where: { categoryId: c.id } }));
      console.log(`  vocab ${c.name}: ${n}/${shown(T.vocab)}`);
    }
  }

  // Level list for the other sections = distinct category levels for the lang.
  const levels = [...new Set((await prisma.langVocabCategory.findMany({ where: { languageId: lang.id, level: { not: null } }, select: { level: true }, distinct: ['level'] })).map((x) => x.level).filter(Boolean))];

  if (SECTIONS.includes('grammar')) {
    for (const level of levels) {
      if (stop) break;
      if (DRY) { console.log(`  would fill grammar ${level}`); continue; }
      const n = await fill(code, 'grammar', { level, topic: `trình độ ${level}`, label: `grammar ${level}` }, T.grammar,
        () => prisma.langGrammarPoint.count({ where: { languageId: lang.id, level } }));
      console.log(`  grammar ${level}: ${n}/${shown(T.grammar)}`);
    }
  }
  if (SECTIONS.includes('conversation')) {
    for (const level of levels) {
      if (stop) break;
      if (DRY) { console.log(`  would fill conversation ${level}`); continue; }
      const n = await fill(code, 'conversation', { level, topic: `hội thoại đời sống trình độ ${level}`, label: `conv ${level}` }, T.conv,
        () => prisma.langConversationItem.count({ where: { languageId: lang.id, level } }));
      console.log(`  conversation ${level}: ${n}/${shown(T.conv)}`);
    }
  }
  if (SECTIONS.includes('qna')) {
    for (const level of levels) {
      if (stop) break;
      if (DRY) { console.log(`  would fill qna ${level}`); continue; }
      const n = await fill(code, 'qna', { level, topic: `hỏi đáp thông dụng trình độ ${level}`, label: `qna ${level}` }, T.qna,
        () => prisma.langQnaItem.count({ where: { languageId: lang.id, level } }));
      console.log(`  qna ${level}: ${n}/${shown(T.qna)}`);
    }
  }
  if (SECTIONS.includes('reading')) {
    for (const level of levels) {
      if (stop) break;
      if (DRY) { console.log(`  would fill reading ${level}`); continue; }
      // reading-article generates whole passages (capped 4/call); loop to target.
      let have = await prisma.langReadingArticle.count({ where: { languageId: lang.id, level } });
      let guard = 0, softFails = 0;
      const maxRounds = T.reading === Infinity ? 20 : 4;
      while (have < T.reading && !stop && guard < maxRounds) {
        guard++;
        await waitBudget();
        try {
          const preview = await adminGenerate(ADMIN, { languageCode: code, section: 'reading-article', level, topic: `bài đọc trình độ ${level}`, count: Math.min(3, T.reading - have) });
          const items = preview?.items?.map((p) => p.data) ?? [];
          if (!items.length) break;
          const commit = await adminCommit(ADMIN, { languageCode: code, section: 'reading-article', items, level });
          totalCreated += commit.created; have += commit.created;
          if (commit.created === 0) break;
          softFails = 0;
        } catch (e) {
          fails++;
          const msg = e?.message ?? e;
          console.error(`    [!] ${code}/reading/${level}: ${String(msg).slice(0, 120)}`);
          if (isQuotaErr(msg)) { stop = true; break; }
          if (isTransientErr(msg) && ++softFails < 3) { await new Promise((r) => setTimeout(r, 60_000)); continue; }
          break;
        }
      }
      console.log(`  reading ${level}: ${have}/${shown(T.reading)}`);
    }
  }
}

console.log(`\n[bulk] ${stop ? 'STOPPED (quota — resumable)' : 'DONE'} created=${totalCreated} fails=${fails}`);
await prisma.$disconnect();
