import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';

const BASE = `${process.env.HOME}/Downloads/Đề thi các môn học ở trường/Kì 1/MAE101/FE`;
const SCRATCH_ROOT = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/66c9798d-db0c-466c-8bba-c9cbb4f84581/scratchpad';

const DECKS = {
  1: 'Đề 1',
  2: 'Đề 2',
  3: 'Đề 3',
  4: 'Đề 4 SP26 - C2FE',
  5: 'Đề 5 SP26_C1FE ',
  6: 'Đề 6 FA25 - RE',
  7: 'Đề 7 FA25 ',
  8: 'Đề 8 SU25 - B5 - RE',
  9: 'Đề 9 SU25 - Final Exam',
};

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

for (const [n, folder] of Object.entries(DECKS)) {
  const srcDir = path.join(BASE, folder);
  const SCRATCH = path.join(SCRATCH_ROOT, `mae101-de${n}-img`);
  fs.mkdirSync(SCRATCH, { recursive: true });
  const files = fs.readdirSync(srcDir).filter((f) => /^q?\d+[a-z]?\s/.test(f) || /^q?\d+[a-z]?\[/.test(f) || /^q?\d+[a-z]?\./.test(f));
  const groups = {};
  for (const f of files) {
    const m = f.match(/^q?(\d+)/i);
    if (!m) continue;
    const qn = parseInt(m[1], 10);
    (groups[qn] ||= []).push(f);
  }
  for (const g of Object.values(groups)) g.sort();
  console.log(`=== MAE101 de${n} (${folder}) — ${Object.keys(groups).length} questions, ${files.length} files ===`);
  for (const [qn, group] of Object.entries(groups)) {
    if (group.length > 1) console.log(`  q${qn}: stacking ${group.length} parts (${group.join(', ')})`);
    await stackAndSave(srcDir, group, path.join(SCRATCH, `q${qn}.png`));
  }
  try {
    execFileSync('node', ['scripts/crop-exam-image.mjs', '--dir', SCRATCH], { stdio: 'inherit' });
  } catch (e) {
    console.error(`CROP FAIL de${n}: ${e.message}`);
    continue;
  }
  const outJson = `content/exams/_work/mae101-de${n}-image-urls.json`;
  try {
    execFileSync('node', ['--env-file=.env', 'scripts/upload-exam-images.mjs', '--dir', SCRATCH, '--prefix', `MAE101/D${n}`, '--out', outJson], { stdio: 'inherit' });
  } catch (e) {
    console.error(`UPLOAD FAIL de${n}: ${e.message}`);
  }
}
console.log('DONE ALL MAE101 old-deck images');
