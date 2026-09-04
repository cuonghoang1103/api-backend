/**
 * fix-exam-code-html.mjs — repair pass that operates DIRECTLY on already-built
 * content/exams/*.mjs prompt/explanation HTML (regardless of which builder
 * produced it), fixing code/XML snippets that were never wrapped in a real
 * <pre><code> hljs block. Two cases, detected per <p> paragraph:
 *
 *   A) DUPLICATE — the paragraph's text is (near-)identical to a <pre> block
 *      that already exists later in the same field (e.g. PRO192-FE1: raw
 *      question text repeats the code verbatim, then a correctly-highlighted
 *      <pre> follows). Fix: strip the duplicated lines from the <p>, keep
 *      only the lead sentence.
 *   B) UNWRAPPED — the paragraph itself looks like code/XML and there is no
 *      corresponding <pre> anywhere in the field (e.g. PRJ301/CSD201/DBI202:
 *      web.xml / servlet / SQL typed as <br/>-joined plain text). Fix: wrap
 *      the code-looking lines in a real hljs <pre><code> block, keep any
 *      leading prose lines as their own <p>.
 *
 * Never touches options/correctIndexes/points/imageUrl — only prompt and
 * explanation HTML strings. Safe to re-run (idempotent — already-wrapped
 * content is left alone).
 *
 *   node scripts/fix-exam-code-html.mjs --glob "content/exams/PRO192-FE*.mjs" --report
 *   node scripts/fix-exam-code-html.mjs --glob "content/exams/PRO192-FE*.mjs" --apply
 */
import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'node:fs';
import hljs from 'highlight.js';

const args = process.argv.slice(2);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const GLOB = val('--glob');
const APPLY = args.includes('--apply');
const VERBOSE = args.includes('--verbose');

if (!GLOB) {
  console.error('cần --glob "content/exams/COURSE-*.mjs" (và --report hoặc --apply)');
  process.exit(1);
}

function decodeEntities(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}
function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function stripTags(s) {
  return decodeEntities(s.replace(/<[^>]+>/g, ''));
}
function norm(s) {
  return s.replace(/\s+/g, ' ').trim();
}

// Generic code/markup signals — safe case-insensitive (no overlap with
// common English/Vietnamese prose).
const CODE_LINE_RE_CI = /^\s*(public|private|protected|static|void|import|package|class|interface|int|char|double|float|boolean)\s+\w|[{};]\s*$|<%[@!]?|<\/?[A-Za-z][\w-]*(\s|>|$)|@\w+\(|System\.(out|err)\.|^\s*for\s*\(|^\s*while\s*\(|^\s*if\s*\(|<jsp:\w+|<c:\w+|<%=|#define\b|pinMode\s*\(|digitalRead\s*\(|digitalWrite\s*\(|analogRead\s*\(|Serial\.\w+\(/;
// SQL keywords — MUST be upper-case (matches bank convention); lower-case
// "where"/"from"/"group"/"order" are extremely common in plain English
// questions ("...where 1 is 5V...") and must NOT trigger the classifier.
const CODE_LINE_RE_CS = /\bSELECT\b|\bFROM\b|\bWHERE\b|\bGROUP\s+BY\b|\bORDER\s+BY\b|\bJOIN\b|\bINSERT\s+INTO\b|\bUPDATE\s+\w+\s+SET\b|\bCREATE\s+(TABLE|VIEW)\b|\bDELETE\s+FROM\b|\bDECLARE\b/;
// A line that reads like an English/Vietnamese sentence (several stopwords)
// is NEVER code, even if it happens to mention a tag name inline — e.g.
// "What does the <rtexprvalue> element specify in the TLD?" is prose, not
// a markup line, despite containing something that looks like a tag.
const PROSE_STOP_RE = /\b(the|is|are|what|which|does|do|following|suppose|consider|given|when|how|why|will|would|can|could|should|specify|element|explain|describe|discuss)\b/gi;
function isProseSentence(l) {
  return ((l.match(PROSE_STOP_RE) || []).length) >= 3;
}
const CODE_LINE_RE = { test: (l) => !isProseSentence(l) && (CODE_LINE_RE_CI.test(l) || CODE_LINE_RE_CS.test(l)) };

function looksLikeCode(lines) {
  if (lines.length < 2) return false;
  const hits = lines.filter((l) => CODE_LINE_RE.test(l)).length;
  return hits >= 2;
}

function codeBlockHtml(code) {
  let highlighted;
  try { highlighted = hljs.highlightAuto(code).value; } catch { highlighted = escHtml(code); }
  return `<pre><code>${highlighted}</code></pre>`;
}

// Extract plain-text content of every <pre>...</pre> in the field, for
// duplicate detection.
function extractPreTexts(field) {
  const out = [];
  const re = /<pre[^>]*>([\s\S]*?)<\/pre>/g;
  let m;
  while ((m = re.exec(field))) out.push(norm(stripTags(m[1])));
  return out;
}

// Process ONE <p>...</p> inner HTML. Returns replacement HTML (may be
// multiple <p>/<pre> elements) or null if unchanged.
function processParagraph(inner, preTexts) {
  const lines = decodeEntities(inner.replace(/<br\s*\/?>/g, '\n')).split('\n').map((l) => l.trim()).filter((l) => l.length);
  if (lines.length < 2) return null;

  // Case A: some of this paragraph's lines are already present verbatim
  // (whitespace-insensitive) in a <pre> block elsewhere in the field — drop
  // ONLY those duplicated lines, keep every other line (lead, trailing
  // question, or a genuinely unique line sandwiched between two duplicate
  // runs — e.g. "Suppose the array a is given by: int[] a = {...};" where
  // only the function above is duplicated, not the array literal).
  const joined = norm(lines.join(' '));
  const isDupLine = (l, preTight) => {
    const tight = l.replace(/\s+/g, '');
    if (!tight) return false;
    if (/^[{}();]+$/.test(tight)) return preTight.includes(tight);
    return tight.length >= 4 && preTight.includes(tight);
  };
  for (const pre of preTexts) {
    if (!pre) continue;
    if (!(pre.includes(joined) || (joined.length > 40 && joined.includes(pre.slice(0, Math.min(pre.length, 60)))))) continue;
    const preTight = pre.replace(/\s+/g, '');
    const flags = lines.map((l) => isDupLine(l, preTight));
    if (!flags.some(Boolean)) continue; // coarse overlap check was a false hit

    // Rebuild: runs of non-duplicate lines each become their own <p>; runs
    // of duplicate lines are dropped (their content already lives in <pre>).
    const segments = [];
    let i = 0;
    while (i < lines.length) {
      if (flags[i]) { i++; continue; }
      let j = i;
      while (j < lines.length && !flags[j]) j++;
      segments.push(lines.slice(i, j));
      i = j;
    }
    return segments.map((seg) => `<p>${escHtml(seg.join(' '))}</p>`).join('');
  }

  // Case B: no matching <pre> — if it looks like code, wrap the code-looking
  // run in a real <pre><code>, keep any leading/trailing prose line(s)
  // separate (e.g. a trailing "What is the output?" question after the code).
  if (!looksLikeCode(lines)) return null;
  // Peel every leading line that doesn't itself look like code — some
  // questions stack 2-3 prose sentences before the snippet starts.
  let leadEnd = 0;
  while (leadEnd < lines.length && !CODE_LINE_RE.test(lines[leadEnd])) leadEnd++;
  if (leadEnd >= lines.length) return null; // no code-looking line at all

  let lastCodeIdx = -1;
  for (let i = lines.length - 1; i >= leadEnd; i--) {
    if (CODE_LINE_RE.test(lines[i])) { lastCodeIdx = i; break; }
  }
  if (lastCodeIdx === -1) return null;

  const lead = lines.slice(0, leadEnd);
  const code = lines.slice(leadEnd, lastCodeIdx + 1);
  const tail = lines.slice(lastCodeIdx + 1);
  if (code.length < 2) return null;
  const leadHtml = lead.length ? `<p>${escHtml(lead.join(' '))}</p>` : '';
  const tailHtml = tail.length ? `<p>${escHtml(tail.join(' '))}</p>` : '';
  return leadHtml + codeBlockHtml(code.join('\n')) + tailHtml;
}

// Some banks embed REAL rich HTML (data tables, lists, bold labels) inside
// prose — matches build-fe-exam.mjs's own SAFE_HTML_SEG allowlist. Protect
// it from the code-classifier (a bare "<table>"/"<tr>" tag otherwise looks
// exactly like an XML/JSP code line) by swapping it for an opaque token
// before paragraph processing, then restoring it verbatim afterward.
const RICH_HTML_RE = /<table[^>]*>[\s\S]*?<\/table>|<ul>[\s\S]*?<\/ul>|<strong>[\s\S]*?<\/strong>/g;
function protectRichHtml(field) {
  const store = [];
  const out = field.replace(RICH_HTML_RE, (m) => {
    store.push(m);
    return ` RICH${store.length - 1} `;
  });
  return { out, store };
}
function restoreRichHtml(field, store) {
  return field.replace(/ RICH(\d+) /g, (_, i) => store[Number(i)]);
}

function processField(field) {
  const { out: protectedField, store } = protectRichHtml(field);
  const preTexts = extractPreTexts(protectedField);
  let changed = false;
  let out = protectedField.replace(/<p>([\s\S]*?)<\/p>/g, (whole, inner) => {
    const repl = processParagraph(inner, preTexts);
    if (repl === null) return whole;
    changed = true;
    return repl;
  });
  // Merge immediately-adjacent <pre> blocks (a bank paragraph split inside
  // one continuous code listing shouldn't render as two separate snippets).
  out = out.replace(/<\/code><\/pre><pre><code(?:\s+class="[^"]*")?>/g, '\n');
  out = restoreRichHtml(out, store);
  return { out, changed };
}

const files = globSync(GLOB).sort();
if (!files.length) { console.error(`✗ no files matched: ${GLOB}`); process.exit(1); }

let totalQChanged = 0;
let totalFileChanged = 0;

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const firstLine = src.split('\n')[0];
  const banner = firstLine.trim().startsWith('//') ? firstLine + '\n' : '';
  const abs = 'file://' + path.resolve(file);
  const spec = (await import(`${abs}?t=${Date.now()}`)).default;

  let fileQChanged = 0;
  for (const exam of spec.exams) {
    for (const q of exam.questions) {
      let qChanged = false;
      if (typeof q.prompt === 'string') {
        const { out, changed } = processField(q.prompt);
        if (changed) { q.prompt = out; qChanged = true; }
      }
      if (typeof q.explanation === 'string') {
        const { out, changed } = processField(q.explanation);
        if (changed) { q.explanation = out; qChanged = true; }
      }
      if (qChanged) fileQChanged++;
    }
  }

  if (fileQChanged) {
    totalFileChanged++;
    totalQChanged += fileQChanged;
    console.log(`${APPLY ? '✓ vá' : '  sẽ vá'} ${file} — ${fileQChanged} câu`);
    if (APPLY) {
      const out = banner + 'export default ' + JSON.stringify(spec, null, 2) + ';\n';
      fs.writeFileSync(file, out);
    }
  } else if (VERBOSE) {
    console.log(`  (không đổi) ${file}`);
  }
}

console.log(`\n${APPLY ? 'Đã vá' : 'Sẽ vá'} ${totalQChanged} câu trong ${totalFileChanged}/${files.length} file.`);
if (!APPLY) console.log('(chạy lại với --apply để ghi thật)');
