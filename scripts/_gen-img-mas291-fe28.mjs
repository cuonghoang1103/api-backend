import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';

const SRC = `${process.env.HOME}/Downloads/Đề thi các môn học ở trường/Kì 4/MAS291/FE/Đề 28 - Đề Thi FE MAS291 - SU 2023 - Block 5 - RE`;
const SCRATCH = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/66c9798d-db0c-466c-8bba-c9cbb4f84581/scratchpad/mas291-fe28-img';

// Q -> source file number(s), from the transcription agent's exact mapping
const map = {};
for (let q = 1; q <= 22; q++) map[q] = [q];
map[23] = [23]; map[24] = [25]; map[25] = [26]; map[26] = [27]; map[27] = [28];
map[28] = [29];
map[29] = [31, 32];
map[30] = [33]; map[31] = [34]; map[32] = [35]; map[33] = [36];
map[34] = [37, 38, 39];
map[35] = [40]; map[36] = [42]; map[37] = [43];
map[38] = [44]; map[39] = [46]; map[40] = [47];
map[41] = [48, 49];
map[42] = [50]; map[43] = [51]; map[44] = [52]; map[45] = [53];
map[46] = [54]; map[47] = [57]; map[48] = [58]; map[49] = [59];

fs.mkdirSync(SCRATCH, { recursive: true });

const files = fs.readdirSync(SRC).filter((f) => /^\d+\s/.test(f));
const byFileNum = {};
for (const f of files) {
  const n = parseInt(f.match(/^(\d+)/)[1], 10);
  byFileNum[n] = f;
}

for (const [q, fileNums] of Object.entries(map)) {
  const outPng = path.join(SCRATCH, `q${q}.png`);
  const srcFiles = fileNums.map((n) => byFileNum[n]).filter(Boolean);
  if (srcFiles.length !== fileNums.length) {
    console.error(`MISSING source file(s) for Q${q}: wanted ${fileNums}, found ${srcFiles}`);
    continue;
  }
  if (srcFiles.length === 1) {
    await sharp(path.join(SRC, srcFiles[0])).png().toFile(outPng);
  } else {
    console.log(`q${q}: stacking ${srcFiles.length} parts (${srcFiles.join(', ')})`);
    const bufs = await Promise.all(srcFiles.map((f) => sharp(path.join(SRC, f)).png().toBuffer()));
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
      .composite(composites)
      .png()
      .toFile(outPng);
  }
}

console.log('cropped', Object.keys(map).length, 'questions');
execFileSync('node', ['scripts/crop-exam-image.mjs', '--dir', SCRATCH], { stdio: 'inherit' });
execFileSync('node', ['--env-file=.env', 'scripts/upload-exam-images.mjs', '--dir', SCRATCH, '--prefix', 'MAS291/D28', '--out', 'content/exams/_work/mas291-fe28-image-urls.json'], { stdio: 'inherit' });
console.log('DONE FE28');
