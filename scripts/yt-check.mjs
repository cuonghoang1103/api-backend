/**
 * yt-check.mjs — xác minh ID video YouTube CÓ THẬT và nhúng được, in ra tên kênh
 * + tiêu đề THẬT để đối chiếu chủ đề.
 *   node scripts/yt-check.mjs <id|url> [<id|url> ...]
 *   node scripts/yt-check.mjs --stdin   (mỗi dòng một id/url)
 * ⚠️ ID YouTube là 11 ký tự ngẫu nhiên — model KHÔNG nhớ được. Mọi id phải qua
 * đây trước khi ghi vào content/course-videos/*.mjs.
 */
import fs from 'fs';

const args = process.argv.slice(2);
const idOf = (s) => {
  s = String(s).trim();
  const m = s.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  return /^[A-Za-z0-9_-]{11}$/.test(s) ? s : null;
};
let raw = args.filter((a) => a !== '--stdin');
if (args.includes('--stdin')) {
  raw = raw.concat(fs.readFileSync(0, 'utf8').split('\n').filter(Boolean));
}
const ids = [...new Set(raw.map(idOf).filter(Boolean))];
if (!ids.length) { console.error('không có id hợp lệ'); process.exit(1); }

let ok = 0, bad = 0;
const chunk = 6;
for (let i = 0; i < ids.length; i += chunk) {
  await Promise.all(ids.slice(i, i + chunk).map(async (id) => {
    const u = `https://www.youtube.com/oembed?url=${encodeURIComponent('https://www.youtube.com/watch?v=' + id)}&format=json`;
    try {
      const r = await fetch(u, { signal: AbortSignal.timeout(15000) });
      if (!r.ok) { console.log(`✗ ${id}  HTTP ${r.status} — KHÔNG tồn tại / không nhúng được`); bad++; return; }
      const j = await r.json();
      console.log(`✓ ${id}  ${j.author_name} — ${j.title}`);
      ok++;
    } catch (e) { console.log(`✗ ${id}  lỗi mạng: ${e.message}`); bad++; }
  }));
}
console.log(`\nTổng: ${ids.length} · sống ${ok} · hỏng ${bad}`);
if (bad) process.exit(2);
