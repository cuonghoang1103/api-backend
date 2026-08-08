/**
 * check-project-diagrams.mjs — render every ```mermaid fence in
 * content/projects/*.md through the REAL mermaid engine and fail on any that
 * does not produce an SVG.
 * ─────────────────────────────────────────────────────────────────────────────
 *   node scripts/check-project-diagrams.mjs
 *   node scripts/check-project-diagrams.mjs --file content/projects/foo.md
 *
 * WHY THIS EXISTS
 * A broken diagram does not fail the seed, does not fail the build, and does
 * not throw in the browser: mermaidRuntime.ts deliberately degrades to showing
 * the code block, because a red error box mid-article is worse than a listing.
 * That safety net also means a syntax error is completely invisible from the
 * author's side — the page looks fine in the seed log and wrong on production.
 *
 * Counting SVG elements is NOT a check: mermaid emits its own error SVG on
 * failure, and an "svg exists" assertion passes on a diagram that renders the
 * words "Syntax error in text". So this script drives the same mermaid version
 * the site ships (frontend/node_modules/mermaid) inside a real browser via
 * Playwright, with suppressErrorRendering on, and treats a thrown parse error
 * as the failure it is.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const only = args.includes('--file') ? args[args.indexOf('--file') + 1] : null;

const MERMAID_ENTRY = path.join(ROOT, 'frontend/node_modules/mermaid/dist/mermaid.min.js');
if (!fs.existsSync(MERMAID_ENTRY)) {
  console.error(`  ✗ không thấy ${path.relative(ROOT, MERMAID_ENTRY)} — chạy npm install trong frontend/ trước.`);
  process.exit(1);
}

const CONTENT_DIR = path.join(ROOT, 'content/projects');
const files = only
  ? [path.resolve(only)]
  : fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md')).map((f) => path.join(CONTENT_DIR, f));

/* Pull every fenced mermaid block, keeping the 1-based line number so a failure
   points at a place the author can actually open. */
function extractDiagrams(md) {
  const out = [];
  const lines = md.split('\n');
  let inBlock = false;
  let buf = [];
  let startLine = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!inBlock && /^```mermaid\s*$/.test(line)) {
      inBlock = true;
      buf = [];
      startLine = i + 1;
      continue;
    }
    if (inBlock && /^```\s*$/.test(line)) {
      inBlock = false;
      out.push({ line: startLine, source: buf.join('\n') });
      continue;
    }
    if (inBlock) buf.push(line);
  }
  if (inBlock) out.push({ line: startLine, source: buf.join('\n'), unterminated: true });
  return out;
}

const jobs = [];
for (const file of files) {
  const md = fs.readFileSync(file, 'utf8');
  const diagrams = extractDiagrams(md);
  for (const d of diagrams) {
    jobs.push({ file: path.relative(ROOT, file), ...d });
  }
}

if (jobs.length === 0) {
  console.log('không có sơ đồ mermaid nào để kiểm.');
  process.exit(0);
}

console.log(`── kiểm ${jobs.length} sơ đồ trong ${files.length} file ──`);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<!doctype html><html><body><div id="out"></div></body></html>');
await page.addScriptTag({ path: MERMAID_ENTRY });

/* Same initialise options as mermaidRuntime.ts. Matching them matters:
   securityLevel: 'strict' rejects constructs that render fine on the default
   setting, so checking under looser options would pass diagrams the site
   then refuses to draw. */
await page.evaluate(() => {
  // eslint-disable-next-line no-undef
  window.mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'strict',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    suppressErrorRendering: true,
  });
});

const failures = [];
const kinds = new Map();

for (const [i, job] of jobs.entries()) {
  if (job.unterminated) {
    failures.push({ ...job, error: 'khối ```mermaid không được đóng' });
    continue;
  }

  const kind = (job.source.trim().split(/\s+/)[0] || '?').replace(/[^A-Za-z-]/g, '');
  kinds.set(kind, (kinds.get(kind) ?? 0) + 1);

  const result = await page.evaluate(async ({ source, id }) => {
    try {
      // eslint-disable-next-line no-undef
      const { svg } = await window.mermaid.render(id, source);
      // A real render produces an <svg> with actual geometry. Mermaid's own
      // error output says "Syntax error in text" — catch that too, in case a
      // future version stops throwing and starts returning it.
      if (!svg || !svg.includes('<svg')) return { ok: false, error: 'không sinh ra SVG' };
      if (/Syntax error in text/i.test(svg)) return { ok: false, error: 'mermaid trả về SVG báo lỗi cú pháp' };
      return { ok: true, bytes: svg.length };
    } catch (err) {
      return { ok: false, error: String(err?.message ?? err).split('\n')[0] };
    }
  }, { source: job.source, id: `chk-${i}` });

  if (!result.ok) {
    failures.push({ ...job, error: result.error, kind });
  }
}

await browser.close();

/* Report which diagram types are in use — a quick way to notice that, say, a
   whole batch of ERDs silently never got written. */
const kindSummary = [...kinds.entries()].sort((a, b) => b[1] - a[1])
  .map(([k, n]) => `${k}×${n}`).join(' · ');
console.log(`   loại sơ đồ: ${kindSummary}`);

if (failures.length) {
  console.error(`\n  ✗ ${failures.length}/${jobs.length} sơ đồ KHÔNG vẽ được:`);
  for (const f of failures) {
    console.error(`    ${f.file}:${f.line}  [${f.kind ?? '?'}]  ${f.error}`);
    console.error(`      ${f.source.split('\n')[0].slice(0, 70)}…`);
  }
  process.exit(1);
}

console.log(`  ✓ cả ${jobs.length} sơ đồ đều vẽ được bằng đúng mermaid + cấu hình của site.`);
