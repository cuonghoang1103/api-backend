import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';

const BASE = `${process.env.HOME}/Downloads/Đề thi các môn học ở trường/Kì 4/MAS291`;
const SCRATCH_ROOT = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/66c9798d-db0c-466c-8bba-c9cbb4f84581/scratchpad';

// deck code -> { folder (absolute), r2Prefix }
const DECKS = {
  PT2: { folder: `${BASE}/PT/Đề 3 - Đề Thi PT MAS291 - SP 2025 - BL3 - Quiz1` },
  PT4: { folder: `${BASE}/PT/Đề 6 - Đề Thi PT MAS291 - Test2 - SU 2024` },
  PT5: { folder: `${BASE}/PT/Đề 7 - Đề Thi PT MAS291 - Test1 - SU 2024` },
  PT7: { folder: `${BASE}/PT/Đề 9 - Đề Thi PT MAS291 - Test2 - SP 2024` },
  PT9: { folder: `${BASE}/PT/Đề 11 - Đề Thi PT MAS291 - Test2 - SU 2023 - No2` },
  PT10: { folder: `${BASE}/PT/Đề 12 - Đề Thi PT MAS291 - Test2 - SU 2023 - No1` },
};

const only = process.argv[2] ? process.argv[2].split(',') : null;

for (const [code, info] of Object.entries(DECKS)) {
  if (only && !only.includes(code)) continue;
  const SCRATCH = path.join(SCRATCH_ROOT, `mas291-${code.toLowerCase()}-img`);
  fs.mkdirSync(SCRATCH, { recursive: true });
  const files = fs.readdirSync(info.folder)
    .filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/^q?(\d+)/i)?.[1] ?? '0', 10);
      const nb = parseInt(b.match(/^q?(\d+)/i)?.[1] ?? '0', 10);
      return na - nb;
    });
  console.log(`=== MAS291 ${code} — ${files.length} files ===`);
  for (const f of files) {
    const m = f.match(/^q?(\d+)/i);
    if (!m) continue;
    const n = parseInt(m[1], 10);
    await sharp(path.join(info.folder, f)).png().toFile(path.join(SCRATCH, `q${n}.png`));
  }
  try {
    execFileSync('node', ['scripts/crop-exam-image.mjs', '--dir', SCRATCH], { stdio: 'inherit' });
  } catch (e) {
    console.error(`CROP FAIL ${code}: ${e.message}`);
    continue;
  }
  const outJson = `content/exams/_work/mas291-${code.toLowerCase()}-image-urls.json`;
  try {
    execFileSync('node', ['--env-file=.env', 'scripts/upload-exam-images.mjs', '--dir', SCRATCH, '--prefix', `MAS291/${code}`, '--out', outJson], { stdio: 'inherit' });
  } catch (e) {
    console.error(`UPLOAD FAIL ${code}: ${e.message}`);
  }
}
console.log('DONE ALL MAS291 PT (clean-mapping decks)');
