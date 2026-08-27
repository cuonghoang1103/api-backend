import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';

const BASE = `${process.env.HOME}/Downloads/Đề thi các môn học ở trường/Kì 4/MAS291/PT`;
const SCRATCH_ROOT = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/66c9798d-db0c-466c-8bba-c9cbb4f84581/scratchpad';

async function stackAndSave(srcDir, filenames, outPng) {
  if (filenames.length === 1) {
    await sharp(path.join(srcDir, filenames[0])).png().toFile(outPng);
    return;
  }
  const bufs = await Promise.all(filenames.map((f) => sharp(path.join(srcDir, f)).png().toBuffer()));
  const metas = await Promise.all(bufs.map((b) => sharp(b).metadata()));
  const width = Math.max(...metas.map((m) => m.width));
  const totalHeight = metas.reduce((s, m) => s + m.height, 0) + 20 * (bufs.length - 1);
  let top = 0;
  const composites = [];
  for (let i = 0; i < bufs.length; i++) {
    composites.push({ input: bufs[i], left: 0, top });
    top += metas[i].height + 20;
  }
  await sharp({ create: { width, height: totalHeight, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
    .composite(composites).png().toFile(outPng);
}

async function run(code, srcDir, byFileNumMap, r2Prefix) {
  const SCRATCH = path.join(SCRATCH_ROOT, `mas291-${code.toLowerCase()}-img`);
  fs.mkdirSync(SCRATCH, { recursive: true });
  const files = fs.readdirSync(srcDir).filter((f) => /^\d+\s/.test(f));
  const byNum = {};
  for (const f of files) byNum[parseInt(f.match(/^(\d+)/)[1], 10)] = f;

  for (const [n, fileNums] of Object.entries(byFileNumMap)) {
    const names = fileNums.map((num) => byNum[num]).filter(Boolean);
    if (names.length !== fileNums.length) { console.error(`${code}: MISSING file(s) for n=${n}: wanted ${fileNums}`); continue; }
    await stackAndSave(srcDir, names, path.join(SCRATCH, `q${n}.png`));
  }
  console.log(`${code}: cropped ${Object.keys(byFileNumMap).length} questions`);
  execFileSync('node', ['scripts/crop-exam-image.mjs', '--dir', SCRATCH], { stdio: 'inherit' });
  const outJson = `content/exams/_work/mas291-${code.toLowerCase()}-image-urls.json`;
  execFileSync('node', ['--env-file=.env', 'scripts/upload-exam-images.mjs', '--dir', SCRATCH, '--prefix', r2Prefix, '--out', outJson], { stdio: 'inherit' });
  console.log(`DONE ${code}`);
}

const only = process.argv[2] ? process.argv[2].split(',') : null;

// PT8: files 14/15 are swapped (file14 -> Q15, file15 -> Q14), rest 1:1
if (!only || only.includes('PT8')) {
  const map8 = {};
  for (let n = 1; n <= 13; n++) map8[n] = [n];
  map8[15] = [14];
  map8[14] = [15];
  await run('PT8', `${BASE}/Đề 10 - Đề Thi PT MAS291 - Test1 - SP 2024`, map8, 'MAS291/PT8');
}

// PT3: file06+07 both feed Q6 (scroll-split, stack), files 8-16 -> Q7-15 (offset -1)
if (!only || only.includes('PT3')) {
  const map3 = {};
  for (let n = 1; n <= 5; n++) map3[n] = [n];
  map3[6] = [6, 7];
  for (let n = 7; n <= 15; n++) map3[n] = [n + 1];
  await run('PT3', `${BASE}/Đề 4 - Đề Thi PT MAS291 - Test3 - SP 2025`, map3, 'MAS291/PT3');
}

// PT6: from the transcription agent's own mapping file
if (!only || only.includes('PT6')) {
  const raw = JSON.parse(fs.readFileSync('content/exams/_work/mas291-pt6-file-mapping.json', 'utf8'));
  const map6 = {};
  for (const [n, filename] of Object.entries(raw)) {
    const num = parseInt(filename.match(/^(\d+)/)[1], 10);
    map6[n] = [num];
  }
  await run('PT6', `${BASE}/Đề 8 - Đề Thi PT MAS291 - Test3 - SP 2024`, map6, 'MAS291/PT6');
}

// PT1: complex — some files feed two questions, some questions are duplicated across files (use first)
if (!only || only.includes('PT1')) {
  const map1 = {
    1: [1], 2: [1], 3: [2], 4: [3], 5: [3], 6: [4], 7: [4], 8: [5],
    10: [6], 11: [7], 12: [7], 13: [8], 14: [8],
    15: [12], 16: [13], 17: [13], 18: [14], 19: [15], 20: [16],
  };
  await run('PT1', `${BASE}/Đề 1 - Đề Thi PT MAS291 - SU 2025 - Quiz3`, map1, 'MAS291/PT1');
}
