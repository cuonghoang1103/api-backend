/**
 * codelab-regen-defective.mjs — rewrite the solution/starter of broken exercises.
 * ─────────────────────────────────────────────────────────────────────────────
 * Finds exercises whose deliverable is structurally wrong — no solution at all,
 * a "solution" still containing TODO, or a starter that simply IS the solution —
 * and asks the model for a fresh pair.
 *
 * Two things make this different from the generator that produced the defects:
 *
 * 1. IT CHECKS ITS OWN OUTPUT BEFORE WRITING. A regenerated solution that still
 *    holds a TODO, still matches its starter, or carries HTML entities is
 *    rejected and retried. Otherwise "regenerate" just recreates the same fault
 *    with different words — which is exactly how these exercises got here.
 * 2. IT REFUSES TO TOUCH HAND-WRITTEN TRACKS. lab211, java-core, sql, redis,
 *    mongodb and prisma-orm were authored and verified by hand; replacing that
 *    with unverified model output is a downgrade, however broken the row looks
 *    to a heuristic. Their defects are reported and left alone.
 *
 * The row is UPDATED, never deleted: id, slug and any CodeProgress survive.
 *
 *   node scripts/codelab-regen-defective.mjs                 # dry run
 *   node scripts/codelab-regen-defective.mjs --apply
 *   node scripts/codelab-regen-defective.mjs --apply --ids 408,467
 */
import { PrismaClient } from '@prisma/client';

const { llmComplete } = await import('../dist/services/interview/llm/index.js');

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };

const APPLY = has('--apply');
const ONLY_IDS = (val('--ids', '') || '').split(',').map((s) => Number(s.trim())).filter(Boolean);
const LIMIT = Number(val('--limit', '0')) || 0;

/** Authored by hand and verified by running. Never overwrite with model output. */
const HANDMADE = new Set(['lab211', 'java-core', 'sql', 'redis', 'mongodb', 'prisma-orm']);
/** Exercises whose SUBJECT is escaping: entities there are the lesson, not a bug. */
const TEACHES_ESCAPING = /sanitiz|escap|\bxss\b|html entit|encode|injection/i;
/**
 * Command-shaped languages. Two checks do not apply to these:
 *   - "too short": `SELECT * FROM customers;` is 24 characters and a whole answer.
 *   - "starter gives the answer away": the exercise IS typing the commands in
 *     order, so a starter that matches the solution is the format, not a leak.
 *     Confirmed by the user on 2026-07-21 for the 20 hand-written Redis exercises.
 */
const COMMAND_TRACKS = new Set(['sql', 'redis', 'git', 'docker', 'kubernetes', 'linux-bash', 'mongodb']);

const ENTITY = /&(lt|gt|amp|quot|#39);/;
/**
 * A TODO marker only counts when it is IN A COMMENT.
 *
 * The obvious /\bTODO\b/i is wrong several ways over, and it cost a whole
 * regeneration run to find out: it flags "Build an Interactive Todo List"
 * (the app's subject), TODO = 'TODO' (an enum value), TODO.md (a filename),
 * echo "TODO: ..." (a shell exercise writing that text into a file) and
 * XXX-XXX-XXXX (a phone format). Twenty-six exercises looked broken; six
 * actually were, and the model kept "failing" this check by writing correct
 * code. Verify the checker before trusting what it reports.
 */
function hasTodoMarker(code) {
  for (const line of String(code).split('\n')) {
    const c = /(\/\/|#|\/\*|^\s*\*|--|<!--)/.exec(line);
    if (!c) continue;                                   // not a comment line
    const after = line.slice(c.index);
    const t = /\b(TODO|FIXME)\b(?!\.[a-zA-Z])/.exec(after);    // not TODO.md
    if (!t) continue;
    const before = after.slice(0, t.index);
    const quotes = (before.match(/"/g) || []).length + (before.match(/'/g) || []).length;
    if (quotes % 2 === 1) continue;                      // inside a string
    return true;
  }
  return /your code here|implement this here/i.test(code);
}
const txt = (j) => (Array.isArray(j) ? j.map((b) => String(b?.code ?? '')).join('\n') : '');
const norm = (s) => s.replace(/\s+/g, ' ').trim();

function defectsOf(ex) {
  const sol = txt(ex.solutionCodeJson);
  const st = txt(ex.starterCodeJson);
  const out = [];
  if (!sol.trim()) out.push('thiếu lời giải');
  else {
    if (hasTodoMarker(sol)) out.push('lời giải còn TODO');
    if (ENTITY.test(sol) && !TEACHES_ESCAPING.test(ex.title)) out.push('mã bị HTML-escape');
    if (sol.trim().length < 120 && !COMMAND_TRACKS.has(ex.track.slug)) out.push('lời giải quá ngắn');
    if (st.trim() && norm(st) === norm(sol) && !COMMAND_TRACKS.has(ex.track.slug)) out.push('starter lộ đáp án');
  }
  return out;
}

const SYSTEM = `You are fixing ONE broken programming exercise in a learning platform.

Return ONLY a JSON object, no prose, no fences:
{"solution":[{"name":"file.ext","language":"…","code":"…"}],
 "starter":[{"name":"file.ext","language":"…","code":"…"}]}

Hard rules — output violating any of these is rejected and thrown away:
- The SOLUTION must be complete and runnable. It must contain NO "TODO", no
  "FIXME", no "your code here" and no placeholder of any kind. It is the answer.
- The STARTER must NOT contain the answer. It is scaffolding: imports, the
  signature, a worked-out shape, and clearly marked TODO comments where the
  learner writes the interesting part. It must differ substantially from the
  solution.
- Write real source text. NEVER write HTML entities such as &lt; &gt; &amp; —
  the code goes straight into a file, so those characters must be literal.
- Solve the brief that is given, in the language that is given. Keep whatever
  file names the existing code used when they still make sense.
- Comment the decisions, not the syntax.`;

function parseObject(raw) {
  const t = (raw || '').trim();
  const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(t);
  const body = fenced ? fenced[1] : t;
  const a = body.indexOf('{'), b = body.lastIndexOf('}');
  if (a < 0 || b <= a) return null;
  try { return JSON.parse(body.slice(a, b + 1)); } catch { return null; }
}

/** Reject output that reproduces the fault we are here to fix. */
function checkRegen(obj, track, teachesEscaping = false) {
  const errs = [];
  const sol = txt(obj?.solution), st = txt(obj?.starter);
  if (!Array.isArray(obj?.solution) || !obj.solution.length || !sol.trim()) errs.push('không có lời giải');
  if (hasTodoMarker(sol)) errs.push('lời giải vẫn còn TODO');
  if ((ENTITY.test(sol) || ENTITY.test(st)) && !teachesEscaping) errs.push('vẫn còn HTML entity');
  if (sol.trim().length < 120 && !COMMAND_TRACKS.has(track)) errs.push('lời giải quá ngắn');
  if (st.trim() && norm(st) === norm(sol)) errs.push('starter vẫn lộ đáp án');
  for (const b of [...(obj?.solution ?? []), ...(obj?.starter ?? [])]) {
    if (!b || typeof b.code !== 'string' || !b.name) { errs.push('khối thiếu name/code'); break; }
  }
  return errs;
}

const plain = (html) => String(html || '')
  .replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|li|h[1-6]|pre|tr)>/gi, '\n')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/[ \t]+/g, ' ').trim().slice(0, 8000);

const where = ONLY_IDS.length ? { id: { in: ONLY_IDS } } : {};
const rows = await prisma.codeExercise.findMany({
  where,
  select: {
    id: true, title: true, language: true, difficulty: true, problemHtml: true,
    inputSpec: true, outputSpec: true, constraints: true,
    solutionCodeJson: true, starterCodeJson: true,
    track: { select: { slug: true } }, module: { select: { name: true } },
  },
});

const broken = rows.map((r) => ({ ...r, defects: defectsOf(r) })).filter((r) => r.defects.length);
const handmade = broken.filter((r) => HANDMADE.has(r.track.slug));
let todo = broken.filter((r) => !HANDMADE.has(r.track.slug));
if (LIMIT) todo = todo.slice(0, LIMIT);

console.log(`[regen] ${broken.length} bài lỗi — ${todo.length} sẽ sinh lại, ${handmade.length} SOẠN TAY nên bỏ qua`);
for (const h of handmade) console.log(`   ⊘ ${h.id} [${h.track.slug}] ${h.defects.join(', ')} — ${h.title.slice(0, 46)}`);
if (!APPLY) console.log('[regen] CHẠY KHÔ — thêm --apply để ghi thật');

let ok = 0, failed = 0;
for (const ex of todo) {
  const user = [
    `Track: ${ex.track.slug}`, `Module: ${ex.module?.name ?? ''}`,
    `Exercise: ${ex.title}`, `Language: ${ex.language}`, `Difficulty: ${ex.difficulty}`,
    '', 'BRIEF:', plain(ex.problemHtml),
    ex.inputSpec ? `\nINPUT: ${plain(ex.inputSpec).slice(0, 800)}` : '',
    ex.outputSpec ? `\nOUTPUT: ${plain(ex.outputSpec).slice(0, 800)}` : '',
    ex.constraints ? `\nCONSTRAINTS: ${plain(ex.constraints).slice(0, 800)}` : '',
    '', `WHAT IS WRONG WITH THE CURRENT VERSION: ${ex.defects.join('; ')}`,
  ].filter(Boolean).join('\n');

  let done = false;
  for (let attempt = 0; attempt < 2 && !done; attempt++) {
    try {
      const res = await llmComplete({
        step: 'generation', feature: 'bulk_gen', system: SYSTEM,
        messages: [{ role: 'user', content: user }],
        maxTokens: 16000, maxRetries: 2, timeoutMs: 420_000, userId: 1,
      });
      const obj = parseObject(res.text);
      if (!obj) console.log(`      (kết quả dài ${res.text.length} ký tự, ${res.outputTokens} token — nhiều khả năng bị cắt)`);
      const errs = obj ? checkRegen(obj, ex.track.slug, TEACHES_ESCAPING.test(ex.title)) : ['không đọc được JSON'];
      if (errs.length) {
        console.log(`   ↻ ${ex.id} lần ${attempt + 1} bị loại: ${errs.join(', ')}`);
        continue;
      }
      if (APPLY) {
        await prisma.codeExercise.update({
          where: { id: ex.id },
          data: {
            solutionCodeJson: obj.solution,
            ...(Array.isArray(obj.starter) && obj.starter.length ? { starterCodeJson: obj.starter } : {}),
          },
        });
      }
      console.log(`   ${APPLY ? '✓' : '~'} ${ex.id} [${ex.track.slug}] ${ex.defects.join(', ')} → ${obj.solution.length} file — ${ex.title.slice(0, 42)}`);
      ok++; done = true;
    } catch (e) {
      const msg = String(e?.message ?? e);
      // A resting breaker or a 429 is not a reason to abandon the run.
      if (/currently disabled|not available|resting|reopens|429|rate.?limit|overloaded|timeout/i.test(msg)) {
        console.log(`   … ${ex.id} AI bận (${msg.slice(0, 60)}) — chờ 60s`);
        await new Promise((r) => setTimeout(r, 60_000));
        attempt--;                                   // this attempt did not count
        continue;
      }
      console.error(`   [!] ${ex.id}: ${msg.slice(0, 100)}`);
      break;
    }
  }
  if (!done) failed++;
}

console.log(`[regen] xong: ${ok} sinh lại được, ${failed} thất bại, ${handmade.length} bỏ qua vì soạn tay`);
await prisma.$disconnect();
