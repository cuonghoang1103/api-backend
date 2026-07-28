#!/usr/bin/env node
/**
 * exam-check.mjs — bộ kiểm cho các file đề trong `content/exams/`.
 *
 * Hai việc, và việc thứ hai mới là việc quan trọng:
 *
 *  1. KIỂM CẤU TRÚC — mọi chuỗi hiển thị phải song ngữ, đáp án phải nằm trong
 *     tầm số option, câu lập trình phải đủ (language, starterCode,
 *     expectedOutput, sampleSolution, rubric), không sót `TODO` trong đáp án
 *     mẫu, không lọt ký tự NUL thật (bẫy cũ: '\\0' một gạch chéo trong JS =
 *     byte NUL → Postgres từ chối chuỗi UTF8).
 *
 *  2. CHẠY THẬT lời giải mẫu của TỪNG câu lập trình và so với `expectedOutput`.
 *     Đề bắt học viên khớp từng dòng output thì chính đáp án mẫu phải khớp
 *     trước — đọc mà tin là cách nhanh nhất để phát đề sai.
 *
 * Cách ghép để chạy: `starterCode` được chia bằng hai mốc
 *     // ── ĐỀ CHO SẴN — KHÔNG SỬA
 *     // ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY
 * phần "viết lời giải" bị thay bằng `sampleSolution`, phần còn lại giữ nguyên —
 * đúng như học viên nộp bài.
 *
 * Dùng:
 *   node scripts/exam-check.mjs                        # kiểm mọi file NODEJS-*
 *   node scripts/exam-check.mjs content/exams/NODEJS-PT1.mjs
 */
import { execFileSync } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const ROOT = path.resolve(import.meta.dirname, '..');
const EXAM_DIR = path.join(ROOT, 'content/exams');

const MARK_GIVEN = '── ĐỀ CHO SẴN';
const MARK_SOLVE = '── VIẾT LỜI GIẢI';

let errors = 0;
let warnings = 0;
const err = (msg) => { errors++; console.error('  ✗ ' + msg); };
const warn = (msg) => { warnings++; console.warn('  ⚠ ' + msg); };

/** Chuỗi song ngữ dạng ống phải có đúng hai nửa, không nửa nào rỗng. */
function checkBilingual(label, s) {
  if (typeof s !== 'string' || !s.trim()) return err(`${label}: rỗng`);
  const parts = s.split('|||');
  if (parts.length !== 2) return err(`${label}: phải là "EN|||VI" (đang có ${parts.length} nửa)`);
  if (!parts[0].trim() || !parts[1].trim()) err(`${label}: một nửa ngôn ngữ bị rỗng`);
}

/** Giải thích: chấp nhận cả dạng ống lẫn dạng hai khối .ml-en/.ml-vi. */
function checkExplanation(label, s) {
  if (!s) return warn(`${label}: chưa có giải thích`);
  const hasBlocks = s.includes('ml-en') && s.includes('ml-vi');
  if (!hasBlocks) checkBilingual(label, s);
}

function checkNoNul(label, s) {
  if (typeof s === 'string' && s.includes('\u0000')) err(`${label}: có byte NUL thật — Postgres sẽ từ chối`);
}

/** Ghép starterCode + sampleSolution thành đúng file học viên nộp. */
function assemble(starterCode, sampleSolution) {
  const lines = starterCode.split('\n');
  const solveAt = lines.findIndex((l) => l.includes(MARK_SOLVE));
  if (solveAt < 0) return null;
  const endAt = lines.findIndex((l, i) => i > solveAt && l.includes(MARK_GIVEN));
  if (endAt < 0) return null;
  return [
    ...lines.slice(0, solveAt + 1),
    '',
    sampleSolution.trim(),
    '',
    ...lines.slice(endAt),
  ].join('\n');
}

async function runSnippet(source, stdin) {
  const dir = await mkdtemp(path.join(tmpdir(), 'exam-check-'));
  const file = path.join(dir, 'answer.cjs');
  try {
    await writeFile(file, source, 'utf8');
    // execFileSync, không phải bản async: chỉ bản SYNC mới bơm được `input`
    // vào stdin — bản async sẽ treo ở readFileSync(0) của đề PE.
    const stdout = execFileSync(process.execPath, [file], {
      input: stdin ?? '', timeout: 20_000, maxBuffer: 8 << 20, encoding: 'utf8',
    });
    return stdout.replace(/\s+$/, '');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/**
 * Đề PE ghi dữ liệu vào và kết quả mong đợi trong CÙNG trường expectedOutput
 * theo khuôn dưới đây (do `scripts/exam-build-pe.mjs` sinh ra). Tách nó ra để
 * chạy lại lời giải mẫu với đúng stdin ấy.
 *     INPUT:
 *     …
 *     OUTPUT:
 *     …
 */
function splitIoBlock(expectedOutput) {
  const m = /^INPUT:\n([\s\S]*?)\nOUTPUT:\n([\s\S]*)$/.exec(expectedOutput ?? '');
  if (!m) return null;
  return { stdin: m[1] === '' ? '' : m[1] + '\n', expected: m[2].replace(/\s+$/, '') };
}

async function checkFile(file) {
  console.log(`\n▸ ${path.relative(ROOT, file)}`);
  const spec = (await import(pathToFileURL(file).href)).default;
  if (!spec?.course || !Array.isArray(spec.exams)) return err('spec phải export { course, exams[] }');

  for (const exam of spec.exams) {
    const qs = exam.questions ?? [];
    console.log(`  [${exam.kind}${exam.peType ? '/' + exam.peType : ''}] ${exam.code} — ${qs.length} câu`);
    checkBilingual(`${exam.code}.title`, exam.title);
    if (exam.description) checkBilingual(`${exam.code}.description`, exam.description);
    if (!exam.instructions) warn(`${exam.code}: chưa có instructions`);

    let mcqPoints = 0, codePoints = 0;
    for (const [i, q] of qs.entries()) {
      const at = `${exam.code} câu ${i + 1}`;
      checkNoNul(at, q.prompt);

      if (q.kind === 'MCQ') {
        mcqPoints += Number(q.points ?? 1);
        checkBilingual(`${at}.prompt`, q.prompt);
        const opts = q.options ?? [];
        if (opts.length < 2 || opts.length > 6) err(`${at}: ${opts.length} lựa chọn (phải 2–6)`);
        opts.forEach((o, oi) => checkBilingual(`${at}.option ${oi + 1}`, o.text));
        const key = q.correctIndexes ?? [];
        if (!key.length) err(`${at}: chưa có đáp án đúng`);
        if (key.some((k) => k < 0 || k >= opts.length)) err(`${at}: đáp án ${JSON.stringify(key)} nằm ngoài số lựa chọn`);
        if (new Set(key).size !== key.length) err(`${at}: đáp án trùng nhau`);
        // Đáp án dài hơn hẳn các lựa chọn khác là một dạng "lộ đáp án".
        const lens = opts.map((o) => o.text.split('|||')[0].length);
        const longest = Math.max(...lens);
        if (key.length === 1 && lens[key[0]] === longest && longest > 2.2 * (lens.reduce((s, n) => s + n, 0) - longest) / (lens.length - 1)) {
          warn(`${at}: đáp án đúng dài gấp >2,2 lần trung bình các lựa chọn còn lại — dễ đoán`);
        }
        checkExplanation(`${at}.explanation`, q.explanation);
        continue;
      }

      if (q.kind === 'CODE') {
        codePoints += Number(q.points ?? 1);
        checkBilingual(`${at}.prompt`, q.prompt);
        const needed = splitIoBlock(q.expectedOutput)
          ? ['language', 'expectedOutput', 'sampleSolution']          // PE: nộp .zip, không có khung sẵn
          : ['language', 'starterCode', 'expectedOutput', 'sampleSolution'];
        for (const f of needed) {
          if (!q[f]) err(`${at}: thiếu ${f}`);
        }
        if (!Array.isArray(q.rubric) || !q.rubric.length) err(`${at}: thiếu rubric`);
        else q.rubric.forEach((c, ci) => checkBilingual(`${at}.rubric ${ci + 1}`, c.criterion));
        if (/\bTODO\b/.test(q.sampleSolution ?? '')) err(`${at}: đáp án mẫu còn TODO`);
        if (!q.sampleSolution || !q.expectedOutput) continue;

        // Hai khuôn câu lập trình: PT/FE có starterCode (ghép lời giải vào giữa),
        // PE thì lời giải là một chương trình trọn vẹn đọc stdin.
        const io = splitIoBlock(q.expectedOutput);
        const source = io ? q.sampleSolution : assemble(q.starterCode ?? '', q.sampleSolution);
        if (!source) { err(`${at}: starterCode thiếu mốc "${MARK_SOLVE}" hoặc "${MARK_GIVEN}"`); continue; }
        try {
          const got = await runSnippet(source, io?.stdin);
          const want = io ? io.expected : q.expectedOutput.replace(/\s+$/, '');
          if (got !== want) {
            err(`${at}: đáp án mẫu CHẠY RA KHÁC expectedOutput`);
            console.error('    --- expected ---\n' + want.split('\n').map((l) => '    ' + l).join('\n'));
            console.error('    --- actual   ---\n' + got.split('\n').map((l) => '    ' + l).join('\n'));
          } else {
            console.log(`  ✓ ${at}: đáp án mẫu chạy khớp expectedOutput (${want.split('\n').length} dòng)`);
          }
        } catch (e) {
          err(`${at}: đáp án mẫu KHÔNG CHẠY ĐƯỢC — ${String(e.stderr || e.message).split('\n').slice(0, 4).join(' / ')}`);
        }
        continue;
      }

      // PE WRITE/SPEAK dùng khuôn khác — chỉ kiểm phần chung.
      checkBilingual(`${at}.prompt`, q.prompt);
    }
    if (mcqPoints && codePoints) {
      const total = mcqPoints + codePoints;
      console.log(`    điểm thô: ${mcqPoints} trắc nghiệm + ${codePoints} lập trình = ${total} (lập trình chiếm ${Math.round(codePoints / total * 100)}%)`);
    }
  }
}

const args = process.argv.slice(2);
const files = args.length
  ? args.map((f) => path.resolve(ROOT, f))
  : readdirSync(EXAM_DIR).filter((f) => /^NODEJS-.*\.mjs$/.test(f)).sort().map((f) => path.join(EXAM_DIR, f));

if (!files.length) {
  console.log('Không tìm thấy file đề nào để kiểm.');
  process.exit(0);
}
for (const f of files) await checkFile(f);

console.log(`\n${errors ? '✗' : '✓'} ${files.length} file · ${errors} lỗi · ${warnings} cảnh báo`);
process.exit(errors ? 1 : 0);
