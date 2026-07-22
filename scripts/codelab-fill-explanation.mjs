/**
 * codelab-fill-explanation.mjs — write the missing solution walkthrough only.
 * ─────────────────────────────────────────────────────────────────────────────
 * A handful of exercises came out of the generator with a complete problem,
 * examples, starter and a verified solution — but an EMPTY
 * solutionExplanationHtml. The code is fine; only the walkthrough is missing.
 *
 * This script fills that one field and NOTHING else. It never rewrites the
 * solution or starter (those may be hand-verified), so it takes the existing
 * solution as ground truth and explains IT, rather than regenerating anything.
 *
 * It refuses to overwrite an explanation that already exists — pass an id whose
 * explanation is present and it is skipped, so re-runs are safe.
 *
 *   node scripts/codelab-fill-explanation.mjs --ids 2888,4981          # dry run
 *   node scripts/codelab-fill-explanation.mjs --ids 2888,4981 --apply
 */
import { PrismaClient } from '@prisma/client';

const { llmComplete } = await import('../dist/services/interview/llm/index.js');

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };

const APPLY = has('--apply');
const ONLY_IDS = (val('--ids', '') || '').split(',').map((s) => Number(s.trim())).filter(Boolean);
if (!ONLY_IDS.length) { console.error('Cần --ids <danh sách id>. Ví dụ: --ids 2888,4981'); process.exit(1); }

const ALLOWED = '<p><ul><ol><li><strong><em><code><pre><a href>';
const txt = (j) => (Array.isArray(j) ? j.map((b) => `// ${b?.name ?? ''}\n${String(b?.code ?? '')}`).join('\n\n') : '');
const plain = (html) => String(html || '')
  .replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|li|h[1-6]|pre|tr)>/gi, '\n')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/[ \t]+/g, ' ').trim().slice(0, 6000);

const SYSTEM = `You are writing the SOLUTION WALKTHROUGH for one programming exercise on a learning platform.

You are GIVEN the official solution — it is correct and final. Explain THAT solution;
do not propose a different one, do not rewrite it, do not output any code files.

Return ONLY a JSON object, no prose, no fences:
{"solutionExplanationHtml":"…"}

Rules for solutionExplanationHtml (output violating any is rejected):
- Clean HTML using ONLY these tags: ${ALLOWED}. No <script>, <style>, <div>, headings or inline styles.
- Walk through the given solution: the approach, why it works, the key steps, and the
  edge cases / complexity where relevant. Reference the actual code with <code>.
- Write real characters — NEVER HTML entities like &lt; &gt; &amp; inside <pre>/<code>.
- Substantial but focused: a few short paragraphs, not one line and not an essay.`;

function parseObject(raw) {
  const t = (raw || '').trim();
  const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(t);
  const body = fenced ? fenced[1] : t;
  const a = body.indexOf('{'), b = body.lastIndexOf('}');
  if (a < 0 || b <= a) return null;
  try { return JSON.parse(body.slice(a, b + 1)); } catch { return null; }
}

function checkExpl(html) {
  const errs = [];
  const s = String(html || '');
  if (s.trim().length < 60) errs.push('giải thích quá ngắn');
  if (/&(lt|gt|amp|quot|#39);/.test(s.replace(/<pre>[\s\S]*?<\/pre>|<code>[\s\S]*?<\/code>/g, ''))) {
    // entities are only allowed if they sit inside code; outside, they read as raw text
  }
  if (/<script|<style|<div|style=/i.test(s)) errs.push('có thẻ không cho phép');
  return errs;
}

const rows = await prisma.codeExercise.findMany({
  where: { id: { in: ONLY_IDS } },
  select: {
    id: true, title: true, language: true, difficulty: true,
    problemHtml: true, inputSpec: true, outputSpec: true, constraints: true,
    solutionCodeJson: true, solutionExplanationHtml: true,
    track: { select: { slug: true } }, module: { select: { name: true } },
  },
});
const found = new Set(rows.map((r) => r.id));
for (const id of ONLY_IDS) if (!found.has(id)) console.log(`   ? ${id} không tồn tại`);

let ok = 0, failed = 0, skipped = 0;
for (const ex of rows) {
  if ((ex.solutionExplanationHtml || '').trim().length >= 30) {
    console.log(`   ⊘ ${ex.id} đã có giải thích (${ex.solutionExplanationHtml.length} ký tự) — bỏ qua`);
    skipped++; continue;
  }
  const sol = txt(ex.solutionCodeJson);
  if (!sol.trim()) { console.log(`   [!] ${ex.id} không có lời giải để giải thích — bỏ qua`); failed++; continue; }

  const user = [
    `Track: ${ex.track.slug}`, `Module: ${ex.module?.name ?? ''}`,
    `Exercise: ${ex.title}`, `Language: ${ex.language}`, `Difficulty: ${ex.difficulty}`,
    '', 'PROBLEM:', plain(ex.problemHtml),
    ex.inputSpec ? `\nINPUT: ${plain(ex.inputSpec).slice(0, 600)}` : '',
    ex.outputSpec ? `\nOUTPUT: ${plain(ex.outputSpec).slice(0, 600)}` : '',
    ex.constraints ? `\nCONSTRAINTS: ${plain(ex.constraints).slice(0, 600)}` : '',
    '', 'OFFICIAL SOLUTION (explain this exactly):', '```', sol.slice(0, 9000), '```',
  ].filter(Boolean).join('\n');

  let done = false;
  let maxTokens = 4000;
  for (let attempt = 0; attempt < 3 && !done; attempt++) {
    try {
      const res = await llmComplete({
        step: 'generation', feature: 'bulk_gen', system: SYSTEM,
        messages: [{ role: 'user', content: user }],
        maxTokens, maxRetries: 2, timeoutMs: 300_000, userId: 1,
      });
      const obj = parseObject(res.text);
      if (!obj) {
        const truncated = res.outputTokens >= maxTokens - 8;
        console.log(`      (kết quả ${res.text.length} ký tự, ${res.outputTokens}/${maxTokens} token${truncated ? ' — BỊ CẮT' : ''})`);
        if (truncated && maxTokens < 16000) { maxTokens *= 2; console.log(`      → nâng trần ${maxTokens} rồi thử lại`); }
      }
      const html = obj?.solutionExplanationHtml;
      const errs = obj ? checkExpl(html) : ['không đọc được JSON'];
      if (errs.length) { console.log(`   ↻ ${ex.id} lần ${attempt + 1} bị loại: ${errs.join(', ')}`); continue; }
      if (APPLY) {
        await prisma.codeExercise.update({ where: { id: ex.id }, data: { solutionExplanationHtml: html } });
      }
      console.log(`   ${APPLY ? '✓' : '~'} ${ex.id} [${ex.track.slug}] → ${html.length} ký tự — ${ex.title.slice(0, 46)}`);
      ok++; done = true;
    } catch (e) {
      const msg = String(e?.message ?? e);
      if (/currently disabled|not available|resting|reopens|429|rate.?limit|overloaded|timeout/i.test(msg)) {
        console.log(`   … ${ex.id} AI bận (${msg.slice(0, 60)}) — chờ 60s`);
        await new Promise((r) => setTimeout(r, 60_000)); attempt--; continue;
      }
      console.error(`   [!] ${ex.id}: ${msg.slice(0, 120)}`); break;
    }
  }
  if (!done) failed++;
}

console.log(`[fill-expl] xong: ${ok} viết được, ${failed} thất bại, ${skipped} bỏ qua (đã có)`);
if (!APPLY) console.log('[fill-expl] CHẠY KHÔ — thêm --apply để ghi thật');
await prisma.$disconnect();
