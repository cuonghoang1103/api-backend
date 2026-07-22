/**
 * codelab-regen-py-candidates.mjs — propose fixed solutions for broken exercises.
 * ─────────────────────────────────────────────────────────────────────────────
 * Given a list of exercise ids and the exact error each one produces when run,
 * ask the model for a corrected solution (and starter). It writes the candidates
 * to a JSON file and NEVER touches the database — a separate step verifies the
 * candidates by actually running them, and only the ones that run get applied.
 *
 * This is the half of the loop that must happen where the LLM lives (the backend
 * container); the running/verifying half happens where Python lives (local).
 *
 *   node scripts/codelab-regen-py-candidates.mjs --in /tmp/py-defects.json --out /tmp/py-candidates.json
 *
 * --in  = [{ "id": 327, "error": "SyntaxError: invalid syntax" }, ...]
 * --out = [{ "id": 327, "solution": [...], "starter": [...] }, ...]
 */
import { PrismaClient } from '@prisma/client';
import { readFileSync, writeFileSync } from 'node:fs';

const { llmComplete } = await import('../dist/services/interview/llm/index.js');
const prisma = new PrismaClient();
const args = process.argv.slice(2);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const IN = val('--in'); const OUT = val('--out');
if (!IN || !OUT) { console.error('cần --in <file> --out <file>'); process.exit(1); }

const defects = JSON.parse(readFileSync(IN, 'utf8'));
const ids = defects.map((d) => d.id);
const errById = new Map(defects.map((d) => [d.id, d.error]));

const plain = (html) => String(html || '')
  .replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|li|h[1-6]|pre|tr)>/gi, '\n')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/[ \t]+/g, ' ').trim().slice(0, 6000);
const txt = (j) => (Array.isArray(j) ? j.map((b) => `# ${b?.name ?? ''}\n${String(b?.code ?? '')}`).join('\n\n') : '');

const SYSTEM = `You are FIXING one broken Python exercise solution on a learning platform.

You are given the problem, the CURRENT solution, and the EXACT error it produces
when run. Return a corrected solution that actually runs.

Return ONLY a JSON object, no prose, no fences:
{"solution":[{"name":"file.py","language":"python","code":"…"}],
 "starter":[{"name":"file.py","language":"python","code":"…"}]}

Hard rules (output violating any is rejected):
- The solution must be COMPLETE and RUNNABLE with the standard library only, on
  Python 3.11+. No TODO/placeholder. Fix the actual cause of the given error.
- If the exercise reads input(), keep reading input() — do not hardcode. If it
  takes sys.argv, keep that; make sure running the demo in __main__ does not crash.
- Keep the same file name(s) and public API/signatures the problem describes.
- Write real characters — never HTML entities like &lt; &gt; &amp;.
- The starter must NOT contain the answer: scaffold + signature + TODO comments.
- Comment the decisions, not the syntax.`;

function parseObject(raw) {
  const t = (raw || '').trim();
  const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(t);
  const body = fenced ? fenced[1] : t;
  const a = body.indexOf('{'), b = body.lastIndexOf('}');
  if (a < 0 || b <= a) return null;
  try { return JSON.parse(body.slice(a, b + 1)); } catch { return null; }
}

const rows = await prisma.codeExercise.findMany({
  where: { id: { in: ids } },
  select: {
    id: true, title: true, language: true, difficulty: true, problemHtml: true,
    inputSpec: true, outputSpec: true, constraints: true, examplesJson: true,
    solutionCodeJson: true, track: { select: { slug: true } }, module: { select: { name: true } },
  },
});

const out = [];
for (const ex of rows) {
  const err = errById.get(ex.id) || 'the solution does not run correctly';
  const ex1 = Array.isArray(ex.examplesJson) && ex.examplesJson[0] ? ex.examplesJson[0] : null;
  const user = [
    `Module: ${ex.module?.name ?? ''}`, `Exercise: ${ex.title}`, `Difficulty: ${ex.difficulty}`,
    '', 'PROBLEM:', plain(ex.problemHtml),
    ex.inputSpec ? `\nINPUT: ${plain(ex.inputSpec).slice(0, 800)}` : '',
    ex.outputSpec ? `\nOUTPUT: ${plain(ex.outputSpec).slice(0, 800)}` : '',
    ex.constraints ? `\nCONSTRAINTS: ${plain(ex.constraints).slice(0, 600)}` : '',
    ex1 ? `\nEXAMPLE input: ${String(ex1.input).slice(0, 400)}\nEXAMPLE output: ${String(ex1.output).slice(0, 400)}` : '',
    '', 'CURRENT (BROKEN) SOLUTION:', '```python', txt(ex.solutionCodeJson).slice(0, 8000), '```',
    '', `ERROR WHEN RUN: ${err}`,
    '', 'Return the corrected solution now.',
  ].filter(Boolean).join('\n');

  let done = false, maxTokens = 8000;
  for (let attempt = 0; attempt < 3 && !done; attempt++) {
    try {
      const res = await llmComplete({
        step: 'generation', feature: 'bulk_gen', system: SYSTEM,
        messages: [{ role: 'user', content: user }], maxTokens, maxRetries: 2, timeoutMs: 420_000, userId: 1,
      });
      const obj = parseObject(res.text);
      if (!obj || !Array.isArray(obj.solution) || !obj.solution.length) {
        const truncated = res.outputTokens >= maxTokens - 8;
        console.log(`   ↻ ${ex.id} lần ${attempt + 1}: không đọc được JSON${truncated ? ' (BỊ CẮT)' : ''}`);
        if (truncated && maxTokens < 32000) maxTokens *= 2;
        continue;
      }
      out.push({ id: ex.id, title: ex.title, solution: obj.solution,
                 starter: Array.isArray(obj.starter) && obj.starter.length ? obj.starter : null });
      console.log(`   ✓ ${ex.id} ứng viên: ${obj.solution.length} file — ${ex.title.slice(0, 44)}`);
      done = true;
    } catch (e) {
      const msg = String(e?.message ?? e);
      if (/currently disabled|not available|resting|reopens|429|rate.?limit|overloaded|timeout/i.test(msg)) {
        console.log(`   … ${ex.id} AI bận — chờ 60s`); await new Promise((r) => setTimeout(r, 60_000)); attempt--; continue;
      }
      console.error(`   [!] ${ex.id}: ${msg.slice(0, 100)}`); break;
    }
  }
}

writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(`[candidates] ghi ${out.length}/${rows.length} ứng viên → ${OUT}`);
await prisma.$disconnect();
