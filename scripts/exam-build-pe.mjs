#!/usr/bin/env node
/**
 * exam-build-pe.mjs — sinh `content/exams/NODEJS-PE.mjs` từ ngân hàng đề PE.
 *
 * Vì sao phải có bước sinh: `expectedOutput` của một đề thực hành là thứ học
 * viên phải khớp từng dòng. Gõ tay nó là cách chắc chắn nhất để phát đề sai.
 * Script này CHẠY từng `solution` với `stdin` của nó bằng `node`, lấy đúng
 * stdout, rồi mới ghi ra file seed. Không có con số nào trong đề là do phỏng
 * đoán — và chạy lại script là kiểm lại toàn bộ.
 *
 * Khuôn `expectedOutput` (cũng là khuôn `scripts/exam-check.mjs` hiểu để chạy
 * kiểm lại sau này):
 *     INPUT:
 *     <những gì gõ vào stdin>
 *     OUTPUT:
 *     <những gì chương trình in ra>
 *
 * Dùng:  node scripts/exam-build-pe.mjs
 */
import { execFileSync } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'content/exams/NODEJS-PE.mjs');

const banks = [];
for (const n of [1, 2, 3]) {
  const mod = await import(path.join(ROOT, `content/exams/_lib/nodejs-pe-bank-${n}.mjs`));
  banks.push(...mod.default);
}

/** Chạy một lời giải với stdin của nó, trả về stdout đã cắt khoảng trắng cuối. */
async function runSolution(source, stdin) {
  const dir = await mkdtemp(path.join(tmpdir(), 'pe-build-'));
  const file = path.join(dir, 'solution.cjs');
  try {
    await writeFile(file, source, 'utf8');
    // execFileSync (không phải execFile bất đồng bộ) vì chỉ bản SYNC mới nhận
    // `input` để bơm vào stdin — bản async sẽ treo ở readFileSync(0).
    const stdout = execFileSync(process.execPath, [file], {
      input: stdin ?? '', timeout: 30_000, maxBuffer: 8 << 20, encoding: 'utf8',
    });
    return stdout.replace(/\s+$/, '');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

const esc = (s) => JSON.stringify(String(s));

const RUBRIC = `[
    { id: 'correct', criterion: B('The program produces exactly the expected output for the given input, including the edge cases named in the problem.', 'Chương trình cho đúng kết quả kỳ vọng với dữ liệu vào đã cho, kể cả các ca biên nêu trong đề.'), weight: 3, maxScore: 4 },
    { id: 'logic', criterion: B('The approach matches what the problem asks for — parallel where it says parallel, bounded where it says bounded, no hidden per-item query where it forbids one.', 'Cách làm đúng như đề yêu cầu — song song ở chỗ đề nói song song, có giới hạn ở chỗ đề nói giới hạn, không lén truy vấn theo từng phần tử ở chỗ đề cấm.'), weight: 2, maxScore: 4 },
    { id: 'quality', criterion: B('Readable Node.js: clear names, no dead code, no dependency beyond the standard library.', 'Mã Node.js dễ đọc: đặt tên rõ, không có mã thừa, không dùng thư viện ngoài thư viện chuẩn.'), weight: 1, maxScore: 4 },
  ]`;

const instructions = (n) =>
  `'<div class="ml-en"><p><b>How to take this exam.</b></p><ol>' +
        '<li>Create five files named <code>Q1.js … Q5.js</code> in your own editor — one per question, plain Node.js, <b>no npm packages</b>.</li>' +
        '<li>Each program reads its input from <b>stdin</b> and writes the answer to <b>stdout</b>. Test it with <code>node Q1.js &lt; input.txt</code>, or just paste the input and press Ctrl+D.</li>' +
        '<li>The "expected output" block of every question shows the exact input used and the exact output required — match it line for line.</li>' +
        '<li>When you are done, compress the five files into <b>one .zip</b> and upload it in the submit box. AI grades each question against the problem, the expected output and a reference solution.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi.</b></p><ol>' +
        '<li>Tạo năm file tên <code>Q1.js … Q5.js</code> bằng trình soạn thảo của bạn — mỗi câu một file, Node.js thuần, <b>không dùng gói npm nào</b>.</li>' +
        '<li>Mỗi chương trình đọc dữ liệu từ <b>stdin</b> và in kết quả ra <b>stdout</b>. Chạy thử bằng <code>node Q1.js &lt; input.txt</code>, hoặc dán dữ liệu vào rồi bấm Ctrl+D.</li>' +
        '<li>Khối "kết quả mong đợi" của mỗi câu ghi rõ dữ liệu vào đã dùng và kết quả bắt buộc phải ra — hãy khớp từng dòng.</li>' +
        '<li>Xong xuôi, nén năm file thành <b>một file .zip</b> rồi tải lên ô nộp bài. AI chấm từng câu theo đề, kết quả mong đợi và một đáp án mẫu.</li>' +
        '</ol></div>'`;

let questionCount = 0;
const parts = [];

for (const [i, paper] of banks.entries()) {
  const qs = [];
  for (const [qi, q] of paper.questions.entries()) {
    const stdout = await runSolution(q.solution, q.stdin);
    questionCount++;
    const expected = `INPUT:\n${(q.stdin ?? '').replace(/\s+$/, '')}\nOUTPUT:\n${stdout}`;
    console.log(`  ✓ ${paper.code} Q${qi + 1}: ${stdout.split('\n').length} dòng output`);
    qs.push(
      `        {\n` +
      `          kind: 'CODE', points: ${q.points}, language: 'javascript',\n` +
      `          prompt: B(\n            ${esc(q.en)},\n            ${esc(q.vi)},\n          ),\n` +
      `          expectedOutput: ${esc(expected)},\n` +
      `          sampleSolution: ${esc(q.solution)},\n` +
      `          rubric: RUBRIC,\n` +
      `        },`,
    );
  }
  parts.push(
    `    {\n` +
    `      kind: 'PE', peType: 'CODE',\n` +
    `      code: '${paper.code}',\n` +
    `      source: 'SAMPLE',\n` +
    `      sortOrder: ${10 + i},\n` +
    `      title: B(${esc(paper.title.en)}, ${esc(paper.title.vi)}),\n` +
    `      description: B(${esc(paper.desc.en)}, ${esc(paper.desc.vi)}),\n` +
    `      durationMinutes: 90,\n      totalPoints: 10,\n      passMark: 4,\n      isPublished: true,\n` +
    `      instructions: ${instructions(paper.code)},\n` +
    `      questions: [\n${qs.join('\n')}\n      ],\n` +
    `    },`,
  );
}

const file =
  `/**\n` +
  ` * Node.js — 10 đề thi thực hành (PE), mỗi đề 5 câu.\n` +
  ` *\n` +
  ` * ⚠️ FILE NÀY ĐƯỢC SINH TỰ ĐỘNG — đừng sửa tay.\n` +
  ` * Nguồn: content/exams/_lib/nodejs-pe-bank-{1,2,3}.mjs\n` +
  ` * Sinh lại: node scripts/exam-build-pe.mjs\n` +
  ` *\n` +
  ` * Mọi \`expectedOutput\` dưới đây là stdout THẬT của \`sampleSolution\` tương ứng\n` +
  ` * khi chạy bằng \`node\` với đúng phần INPUT ghi kèm.\n` +
  ` *\n` +
  ` * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NODEJS-PE.mjs --apply\n` +
  ` */\n` +
  `import { B } from './_lib/nodejs-exam-kit.mjs';\n\n` +
  `const RUBRIC = ${RUBRIC};\n\n` +
  `export default {\n  course: { slug: 'nodejs' },\n  exams: [\n${parts.join('\n')}\n  ],\n};\n`;

writeFileSync(OUT, file, 'utf8');
console.log(`\n✓ ${banks.length} đề · ${questionCount} câu → ${path.relative(ROOT, OUT)}`);
