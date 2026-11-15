#!/usr/bin/env node
/**
 * Dựng file tiếng câu đệm cho robot Odin — xem data/makerlab/cau-dem/cau.json.
 *
 *   ssh -N -L 18090:127.0.0.1:8090 linux-nha &      # dịch vụ đọc chữ ở máy nhà
 *   node scripts/makerlab-dung-cau-dem.mjs [http://127.0.0.1:18090] [--de]
 *
 * Mặc định bỏ qua file đã có (dựng lại: --de). Trả PCM 16 kHz mono 16-bit — đúng
 * khuôn bo phát, backend đẩy thẳng không qua ffmpeg.
 */
import fs from 'node:fs';
import path from 'node:path';

const goc = (process.argv.find((a) => a.startsWith('http')) || 'http://127.0.0.1:18090').replace(/\/+$/, '');
const de = process.argv.includes('--de');
const thuMuc = path.join(process.cwd(), 'data', 'makerlab', 'cau-dem');
const cfg = JSON.parse(fs.readFileSync(path.join(thuMuc, 'cau.json'), 'utf8'));

let loi = 0;
for (const giong of cfg.giong) {
  fs.mkdirSync(path.join(thuMuc, giong), { recursive: true });
  for (const c of cfg.cau) {
    const ra = path.join(thuMuc, giong, `${c.id}.pcm`);
    if (!de && fs.existsSync(ra) && fs.statSync(ra).size > 0) { console.log(`= ${giong}/${c.id}`); continue; }
    const t = Date.now();
    const res = await fetch(`${goc}/tts-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: c.chu, voice: giong, style: 'tu_nhien' }),
    });
    const b = Buffer.from(await res.arrayBuffer());
    if (!res.ok || b.length < 16_000) { loi++; console.error(`✗ ${giong}/${c.id}: HTTP ${res.status}, ${b.length} byte`); continue; }
    fs.writeFileSync(ra, b);
    console.log(`✓ ${giong}/${c.id}: ${(b.length / 32_000).toFixed(2)} s tiếng, ${((Date.now() - t) / 1000).toFixed(1)} s sinh`);
  }
}
process.exit(loi ? 1 : 0);
