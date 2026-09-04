import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';

const COURSE = 'PRJ301';
const R2_PREFIX = 'PRJ301';
const BASE = `${process.env.HOME}/Downloads/Đề thi các môn học ở trường/Kì 4/${COURSE}/FE`;
const SCRATCH = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/38f20845-0710-41f5-b2d4-2c1cef65b0ae/scratchpad/prj301-img';
const folders = JSON.parse(fs.readFileSync('content/exams/_work/prj301-fe-folders.json', 'utf8'));

fs.mkdirSync(SCRATCH, { recursive: true });

for (const [n, info] of Object.entries(folders)) {
  const srcDir = path.join(BASE, info.folder);
  const files = fs.readdirSync(srcDir)
    .filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/^(\d+)/)?.[1] ?? '0', 10);
      const nb = parseInt(b.match(/^(\d+)/)?.[1] ?? '0', 10);
      return na - nb;
    });
  const dDir = path.join(SCRATCH, `d${n}`);
  fs.mkdirSync(dDir, { recursive: true });
  console.log(`=== ${COURSE} D${n} (${info.folder}) — ${files.length} files ===`);
  for (const f of files) {
    const m = f.match(/^(\d+)/);
    if (!m) continue;
    const qn = parseInt(m[1], 10);
    const outPng = path.join(dDir, `q${qn}.png`);
    await sharp(path.join(srcDir, f)).png().toFile(outPng);
  }
  try {
    execFileSync('node', ['scripts/crop-exam-image.mjs', '--dir', dDir], { stdio: 'inherit' });
  } catch (e) {
    console.error(`CROP FAIL D${n}: ${e.message}`);
    continue;
  }
  const outJson = `content/exams/_work/prj301-fe${n}-image-urls.json`;
  try {
    execFileSync('node', ['scripts/upload-exam-images.mjs', '--dir', dDir, '--prefix', `${R2_PREFIX}/FE${n}`, '--out', outJson], { stdio: 'inherit' });
  } catch (e) {
    console.error(`UPLOAD FAIL D${n}: ${e.message}`);
  }
}
console.log('DONE ALL');
