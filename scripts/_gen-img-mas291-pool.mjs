import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';

const BASE = `${process.env.HOME}/Downloads/Đề thi các môn học ở trường/Kì 4/MAS291/PT`;
const SCRATCH_ROOT = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/66c9798d-db0c-466c-8bba-c9cbb4f84581/scratchpad';

const DECKS = {
  PT2Bank: `${BASE}/Đề 2 - Đề Thi PT MAS291 - Test2 - SP 2025`,
  PT5Bank: `${BASE}/Đề 5 - Đề Thi PT MAS291 - Test3 - SU 2024`,
};

for (const [code, folder] of Object.entries(DECKS)) {
  const SCRATCH = path.join(SCRATCH_ROOT, `mas291-${code.toLowerCase()}-img`);
  fs.mkdirSync(SCRATCH, { recursive: true });
  const files = fs.readdirSync(folder).filter((f) => /^\d+\s/.test(f));
  const byNum = {};
  for (const f of files) byNum[parseInt(f.match(/^(\d+)/)[1], 10)] = f;
  console.log(`=== ${code} — ${files.length} files ===`);
  for (let n = 1; n <= 125; n++) {
    const f = byNum[n];
    if (!f) { console.error(`MISSING file for n=${n}`); continue; }
    await sharp(path.join(folder, f)).png().toFile(path.join(SCRATCH, `q${n}.png`));
  }
  execFileSync('node', ['scripts/crop-exam-image.mjs', '--dir', SCRATCH], { stdio: 'inherit' });
  const outJson = `content/exams/_work/mas291-${code.toLowerCase()}-image-urls.json`;
  execFileSync('node', ['--env-file=.env', 'scripts/upload-exam-images.mjs', '--dir', SCRATCH, '--prefix', `MAS291/${code}`, '--out', outJson], { stdio: 'inherit' });
  console.log(`DONE ${code}`);
}
