/**
 * Đẩy PHIM GIỚI THIỆU khoá học (2–5 phút, dựng bằng ~/Documents/video-bai-giang/trailer-khoa) lên R2:
 *   hoc/veo/phim/<slug>.mp4  + ảnh bìa hoc/veo/phim/<slug>.jpg
 * Rồi thêm slug vào PHIM trong frontend/src/lib/videoMoDau.ts.
 *
 *   npx tsx scripts/phim-khoa-len-r2.mts <phim.mp4> <slug> [giây-lấy-ảnh-bìa=2]
 * Chạm bucket THẬT (không dùng STORAGE_SANDBOX) — chỉ chạy khi cố ý đưa phim lên web.
 */
import 'dotenv/config';
import { execFileSync } from 'node:child_process';
import { readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { headObject, putObject } from '../src/config/r2.js';

const [tep, slug, giay = '2'] = process.argv.slice(2);
if (!tep || !slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Dùng: npx tsx scripts/phim-khoa-len-r2.mts <phim.mp4> <slug> [giây-ảnh-bìa]');
  process.exit(2);
}
const bia = path.join(os.tmpdir(), `phim-bia-${slug}.jpg`);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', giay, '-i', tep, '-frames:v', '1', '-vf', 'scale=1280:-2', '-q:v', '3', bia]);
const KHOA = `hoc/veo/phim/${slug}`;
await putObject(`${KHOA}.mp4`, await readFile(tep), 'video/mp4', 'public, max-age=86400');
await putObject(`${KHOA}.jpg`, await readFile(bia), 'image/jpeg', 'public, max-age=86400');
await rm(bia, { force: true });
for (const k of [`${KHOA}.mp4`, `${KHOA}.jpg`]) {
  const h = await headObject(k);
  console.log(h ? `✓ ${k} (${h.size} B)` : `✗ ${k} KHÔNG thấy sau khi đẩy`);
}
