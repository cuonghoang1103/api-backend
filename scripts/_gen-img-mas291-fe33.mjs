import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';

const SRC = `${process.env.HOME}/Downloads/Đề thi các môn học ở trường/Kì 4/MAS291/FE/Đề 33 - Đề Thi FE MAS291 - FA 2022 - FE - 02`;
const SCRATCH = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/66c9798d-db0c-466c-8bba-c9cbb4f84581/scratchpad/mas291-fe33-img';

// n (real exam question number) -> source file number, from the transcription agent's table
const fileForQ = {
  1: 1, 2: 2, 5: 3, 6: 4, 7: 5, 8: 6, 9: 7, 10: 8, 11: 9, 12: 10, 13: 11,
  15: 12, 16: 13, 17: 14, 18: 15, 20: 16, 21: 17, 22: 19, 23: 20, 24: 24,
  25: 25, 26: 26, 27: 27, 28: 28, 29: 29, 31: 30, 32: 31, 33: 32, 34: 33,
  35: 34, 36: 35, 37: 36, 38: 37, 39: 38, 40: 39, 41: 40, 42: 41, 43: 42,
  44: 43, 45: 44, 46: 45, 47: 46, 48: 47, 49: 48, 50: 49,
  3: 21, 4: 22, 19: 23,
};

fs.mkdirSync(SCRATCH, { recursive: true });

const files = fs.readdirSync(SRC).filter((f) => /^\d+\s/.test(f));
const byFileNum = {};
for (const f of files) {
  const n = parseInt(f.match(/^(\d+)/)[1], 10);
  byFileNum[n] = f;
}

let missing = [];
for (const [q, fnum] of Object.entries(fileForQ)) {
  const f = byFileNum[fnum];
  if (!f) { missing.push(q); continue; }
  const outPng = path.join(SCRATCH, `q${q}.png`);
  await sharp(path.join(SRC, f)).png().toFile(outPng);
}
console.log('missing:', missing, '| total mapped:', Object.keys(fileForQ).length - missing.length);

execFileSync('node', ['scripts/crop-exam-image.mjs', '--dir', SCRATCH], { stdio: 'inherit' });
execFileSync('node', ['--env-file=.env', 'scripts/upload-exam-images.mjs', '--dir', SCRATCH, '--prefix', 'MAS291/D33', '--out', 'content/exams/_work/mas291-fe33-image-urls.json'], { stdio: 'inherit' });
console.log('DONE FE33');
