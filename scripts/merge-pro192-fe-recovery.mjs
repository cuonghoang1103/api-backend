/**
 * merge-pro192-fe-recovery.mjs — rebuild a corrupted PRO192 FE paper
 * (content/exams/PRO192-FE<N>.mjs) from freshly re-transcribed batch JSON
 * files, after a prior authoring bug (`String(undefined)` → literal
 * "undefined" text) silently corrupted every question's prompt/options/
 * explanation while leaving exam metadata and imageUrl untouched.
 *
 * Keeps existing exam-level metadata (code/title/description/imageUrl map)
 * from the current (text-corrupted but metadata-intact) file, and replaces
 * ONLY the questions array with freshly verified content from
 * scratchpad/pro192-fe-fix/FE<N>/batch-*.json.
 *
 * Hard-fails if any bogus "undefined" corruption signature is detected in
 * the new content, so this exact bug can never silently ship again.
 *
 *   node scripts/merge-pro192-fe-recovery.mjs FE6
 */
import fs from 'node:fs';
import path from 'node:path';
import hljs from 'highlight.js';

const paper = process.argv[2];
if (!paper) { console.error('usage: node scripts/merge-pro192-fe-recovery.mjs FE<N>'); process.exit(1); }

const SCRATCH = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/2c89fc57-9aa7-4c2e-8cc0-a484bfb4eb0f/scratchpad/pro192-fe-fix';
const BATCH_DIR = path.join(SCRATCH, paper);
const BATCH_FILES = ['batch-01-10.json', 'batch-11-20.json', 'batch-21-30.json', 'batch-31-40.json', 'batch-41-50.json'];
const OUT_PATH = path.resolve(import.meta.dirname, `../content/exams/PRO192-${paper}.mjs`);

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function codeBlockHtml(code) {
  const highlighted = hljs.highlight(code, { language: 'java' }).value;
  return `<pre><code class="language-java">${highlighted}</code></pre>`;
}

function buildPromptHtml(q, lang) {
  const text = lang === 'en' ? q.questionTextEn : q.questionTextVi;
  let html = `<p>${esc(text).replace(/\n/g, '<br/>')}</p>`;
  if (q.hasCode && q.codeJava) html += codeBlockHtml(q.codeJava);
  return html;
}

// ── load existing (corrupted-text but metadata-intact) exam for context ──
const existingRaw = fs.readFileSync(OUT_PATH, 'utf8');
const MARKER = 'export default ';
const markerIdx = existingRaw.indexOf(MARKER);
if (markerIdx === -1) { console.error(`✗ could not find "${MARKER}" in ${OUT_PATH}`); process.exit(1); }
const existingJson = existingRaw.slice(markerIdx + MARKER.length).replace(/;\s*$/, '');
const existingSpec = JSON.parse(existingJson);
const existingExam = existingSpec.exams[0];
const existingQuestions = existingExam.questions;

if (existingQuestions.length !== 50) {
  console.error(`✗ existing file has ${existingQuestions.length} questions, expected 50 — aborting`);
  process.exit(1);
}
const imageUrls = {};
existingQuestions.forEach((q, i) => { if (q.imageUrl) imageUrls[String(i + 1)] = q.imageUrl; });
console.log(`✓ extracted ${Object.keys(imageUrls).length} imageUrl(s) from existing file`);

// ── load + merge batches ──
let all = [];
for (const f of BATCH_FILES) {
  const p = path.join(BATCH_DIR, f);
  if (!fs.existsSync(p)) { console.error(`✗ missing batch file: ${p}`); process.exit(1); }
  const arr = JSON.parse(fs.readFileSync(p, 'utf8'));
  all = all.concat(arr);
}
all.sort((a, b) => a.n - b.n);

if (all.length !== 50) { console.error(`✗ expected 50 questions total, got ${all.length}`); process.exit(1); }
const seen = new Set();
for (const q of all) {
  if (seen.has(q.n)) { console.error(`✗ duplicate n=${q.n}`); process.exit(1); }
  seen.add(q.n);
}
for (let i = 1; i <= 50; i++) if (!seen.has(i)) { console.error(`✗ missing n=${i}`); process.exit(1); }
console.log(`✓ 50/50 questions present, n=1..50`);

// ── build questions, with a HARD guard against the exact corruption that broke this before ──
const CORRUPTION_SIGNATURES = [
  /^undefined$/,                 // a field IS just the literal word
  /<p>undefined<\/p>/,           // exact pattern seen in the original corruption
  /^undefined\|\|\|undefined$/,  // bilingual field collapsed to the bug
];
function assertNotCorrupted(fieldName, qn, value) {
  for (const re of CORRUPTION_SIGNATURES) {
    if (re.test(value)) {
      console.error(`✗ CORRUPTION DETECTED: question n=${qn} field "${fieldName}" matches ${re} — value: ${JSON.stringify(value).slice(0, 200)}`);
      process.exit(1);
    }
  }
}

let unconfident = [];
const questions = all.map((q) => {
  if (q.confident === false) unconfident.push(q.n);

  const promptEn = buildPromptHtml(q, 'en');
  const promptVi = buildPromptHtml(q, 'vi');
  const prompt = `${promptEn}|||${promptVi}`;
  assertNotCorrupted('prompt', q.n, prompt);

  if (!Array.isArray(q.options) || q.options.length < 2) {
    console.error(`✗ question n=${q.n} has invalid options: ${JSON.stringify(q.options)}`);
    process.exit(1);
  }
  const options = q.options.map((o, i) => {
    const text = `${o.en}|||${o.vi}`;
    assertNotCorrupted(`options[${i}]`, q.n, text);
    return { text };
  });

  const correctIndexes = Array.isArray(q.correctIndexes) ? q.correctIndexes : [q.correctIndex];
  if (!correctIndexes.length || correctIndexes.some((i) => i < 0 || i >= options.length)) {
    console.error(`✗ question n=${q.n} has invalid correctIndexes: ${JSON.stringify(correctIndexes)} for ${options.length} options`);
    process.exit(1);
  }

  let explanation = `${q.explanationEn}|||${q.explanationVi}`;
  assertNotCorrupted('explanation', q.n, explanation);
  if (q.confident === false && q.confidenceNote) {
    explanation += ` [[UNCERTAIN — CẦN RÀ LẠI: ${q.confidenceNote}]]`;
  }

  const imageUrl = imageUrls[String(q.n)];
  if (!imageUrl) console.warn(`⚠ question n=${q.n} has no imageUrl in the existing file`);

  return {
    kind: 'MCQ',
    points: 0.2,
    prompt,
    ...(imageUrl ? { imageUrl } : {}),
    options,
    correctIndexes,
    explanation,
  };
});

console.log(`✓ 0 corruption signatures detected across all 50 questions`);

const spec = {
  course: { courseCode: 'PRO192' },
  exams: [
    {
      ...existingExam,
      questions,
    },
  ],
};

const out = `// AUTO-GENERATED by scripts/merge-pro192-fe-recovery.mjs (data-recovery rebuild, ${new Date().toISOString().slice(0, 10)}) — do not hand-edit.
export default ${JSON.stringify(spec, null, 2)};
`;

fs.writeFileSync(OUT_PATH, out);
console.log(`✓ wrote ${path.relative(process.cwd(), OUT_PATH)} (${questions.length} questions)`);
if (unconfident.length) {
  console.log(`⚠ ${unconfident.length} question(s) marked UNCERTAIN, flagged in explanation: n=${unconfident.join(', ')}`);
}
