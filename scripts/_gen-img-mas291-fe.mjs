import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';

const COURSE = 'MAS291';
const BASE = `${process.env.HOME}/Downloads/Đề thi các môn học ở trường/Kì 4/MAS291/FE`;
const SCRATCH = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/66c9798d-db0c-466c-8bba-c9cbb4f84581/scratchpad/mas291-fe-img';
const folders = JSON.parse(fs.readFileSync('content/exams/_work/mas291-fe-folders.json', 'utf8'));

fs.mkdirSync(SCRATCH, { recursive: true });

const only = process.argv[2] ? process.argv[2].split(',') : null;

for (const [n, info] of Object.entries(folders)) {
  if (only && !only.includes(n)) continue;
  const srcDir = path.join(BASE, info.folder);
  const files = fs.readdirSync(srcDir)
    .filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/^q?(\d+)/i)?.[1] ?? '0', 10);
      const nb = parseInt(b.match(/^q?(\d+)/i)?.[1] ?? '0', 10);
      if (na !== nb) return na - nb;
      return a.localeCompare(b);
    });
  const groups = {};
  for (const f of files) {
    const m = f.match(/^q?(\d+)/i);
    if (!m) continue;
    const qn = parseInt(m[1], 10);
    (groups[qn] ||= []).push(f);
  }
  const dDir = path.join(SCRATCH, `d${n}`);
  fs.mkdirSync(dDir, { recursive: true });
  console.log(`=== ${COURSE} FE Đề ${n} (${info.folder}) — ${Object.keys(groups).length} q, ${files.length} files ===`);
  for (const [qn, group] of Object.entries(groups)) {
    const outPng = path.join(dDir, `q${qn}.png`);
    if (group.length === 1) {
      await sharp(path.join(srcDir, group[0])).png().toFile(outPng);
    } else {
      console.log(`  q${qn}: stacking ${group.length} parts (${group.join(', ')})`);
      const bufs = await Promise.all(group.map((f) => sharp(path.join(srcDir, f)).png().toBuffer()));
      const metas = await Promise.all(bufs.map((b) => sharp(b).metadata()));
      const width = Math.max(...metas.map((m) => m.width));
      const totalHeight = metas.reduce((s, m) => s + m.height, 0) + 20 * (group.length - 1);
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
  try {
    execFileSync('node', ['scripts/crop-exam-image.mjs', '--dir', dDir], { stdio: 'inherit' });
  } catch (e) {
    console.error(`CROP FAIL D${n}: ${e.message}`);
    continue;
  }
  const outJson = `content/exams/_work/mas291-fe${n}-image-urls.json`;
  try {
    execFileSync('node', ['--env-file=.env', 'scripts/upload-exam-images.mjs', '--dir', dDir, '--prefix', `${COURSE}/D${n}`, '--out', outJson], { stdio: 'inherit' });
  } catch (e) {
    console.error(`UPLOAD FAIL D${n}: ${e.message}`);
  }
}
console.log('DONE ALL MAS291 FE');
