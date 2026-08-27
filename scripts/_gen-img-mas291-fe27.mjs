import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';

const SRC = `${process.env.HOME}/Downloads/Đề thi các môn học ở trường/Kì 4/MAS291/FE/Đề 27 - Đề Thi FE MAS291 - FA 2023 - FE`;
const SCRATCH = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/66c9798d-db0c-466c-8bba-c9cbb4f84581/scratchpad/mas291-fe27-img';
const map = JSON.parse(fs.readFileSync('content/exams/_work/mas291-fe27-file-mapping.json', 'utf8'));

fs.mkdirSync(SCRATCH, { recursive: true });

for (const [n, filename] of Object.entries(map)) {
  const outPng = path.join(SCRATCH, `q${n}.png`);
  await sharp(path.join(SRC, filename)).png().toFile(outPng);
}
console.log('cropped', Object.keys(map).length, 'questions');

execFileSync('node', ['scripts/crop-exam-image.mjs', '--dir', SCRATCH], { stdio: 'inherit' });
execFileSync('node', ['--env-file=.env', 'scripts/upload-exam-images.mjs', '--dir', SCRATCH, '--prefix', 'MAS291/D27', '--out', 'content/exams/_work/mas291-fe27-image-urls.json'], { stdio: 'inherit' });
console.log('DONE FE27');
