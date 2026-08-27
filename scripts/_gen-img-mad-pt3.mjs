import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';

const SRC = `${process.env.HOME}/Downloads/Đề thi các môn học ở trường/Kì 2/MAD101/PT/MAD -PT3`;
const SCRATCH = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/66c9798d-db0c-466c-8bba-c9cbb4f84581/scratchpad/mad101-pt3-img';

// Q1..125 -> file001..125 ; Q126..130 -> specific su2025 files (parsed from build-mad101-pt3.py comments)
const map = {};
for (let i = 1; i <= 125; i++) map[i] = i;
const extra = { 126: 127, 127: 133, 128: 135, 129: 139, 130: 140 };
Object.assign(map, extra);

fs.mkdirSync(SCRATCH, { recursive: true });

const files = fs.readdirSync(SRC).filter((f) => /^\d+\s/.test(f));
const byFileNum = {};
for (const f of files) {
  const n = parseInt(f.match(/^(\d+)/)[1], 10);
  byFileNum[n] = f;
}

let missing = [];
for (const [qn, fnum] of Object.entries(map)) {
  const f = byFileNum[fnum];
  if (!f) { missing.push(qn); continue; }
  const outPng = path.join(SCRATCH, `q${qn}.png`);
  await sharp(path.join(SRC, f)).png().toFile(outPng);
}
console.log('missing source files for Q:', missing);
console.log('total mapped:', Object.keys(map).length - missing.length);

execFileSync('node', ['scripts/crop-exam-image.mjs', '--dir', SCRATCH], { stdio: 'inherit' });
execFileSync('node', ['--env-file=.env', 'scripts/upload-exam-images.mjs', '--dir', SCRATCH, '--prefix', 'MAD101/PT3', '--out', 'content/exams/_work/mad101-pt3-image-urls.json'], { stdio: 'inherit' });
console.log('DONE PT3');
