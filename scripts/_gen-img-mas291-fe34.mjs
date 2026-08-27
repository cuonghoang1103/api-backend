import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';

const SRC = `${process.env.HOME}/Downloads/Đề thi các môn học ở trường/Kì 4/MAS291/FE/Đề 34 - Đề Thi FE MAS291 - FA 2022 - FE - 01`;
const SCRATCH = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/66c9798d-db0c-466c-8bba-c9cbb4f84581/scratchpad/mas291-fe34-img';

// bank n (renumbered 1..30 sequential, per the transcription agent's table) -> source file(s).
// n=1..26 happen to line up 1:1 with file 1..26 (both sequences skip the same missing
// exam questions in the same relative order); n=27 is the scroll-split Q46 (files 27+28
// stacked); n=28..30 shift by the one extra file the split consumed.
const map = {};
for (let n = 1; n <= 26; n++) map[n] = [n];
map[27] = [27, 28];
map[28] = [29];
map[29] = [30];
map[30] = [31];

fs.mkdirSync(SCRATCH, { recursive: true });

const files = fs.readdirSync(SRC).filter((f) => /^\d+\s/.test(f));
const byFileNum = {};
for (const f of files) {
  const n = parseInt(f.match(/^(\d+)/)[1], 10);
  byFileNum[n] = f;
}

for (const [n, fileNums] of Object.entries(map)) {
  const outPng = path.join(SCRATCH, `q${n}.png`);
  const srcFiles = fileNums.map((num) => byFileNum[num]).filter(Boolean);
  if (srcFiles.length !== fileNums.length) {
    console.error(`MISSING source file(s) for n=${n}: wanted ${fileNums}`);
    continue;
  }
  if (srcFiles.length === 1) {
    await sharp(path.join(SRC, srcFiles[0])).png().toFile(outPng);
  } else {
    console.log(`n=${n}: stacking ${srcFiles.length} parts (${srcFiles.join(', ')})`);
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
execFileSync('node', ['--env-file=.env', 'scripts/upload-exam-images.mjs', '--dir', SCRATCH, '--prefix', 'MAS291/D34', '--out', 'content/exams/_work/mas291-fe34-image-urls.json'], { stdio: 'inherit' });
console.log('DONE FE34');
