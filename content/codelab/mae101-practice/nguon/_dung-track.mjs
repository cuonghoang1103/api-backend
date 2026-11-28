/** Dựng _track.json của mae101-practice (khuôn của mad101-practice) từ các module: node content/codelab/mae101-practice/nguon/_dung-track.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const NGUON = path.dirname(fileURLToPath(import.meta.url));
const files = fs.readdirSync(NGUON).filter((f) => f.endsWith('.mjs') && !f.startsWith('_'));
const mods = [];
for (const f of files) mods.push((await import(pathToFileURL(path.join(NGUON, f)).href)).default);
const rank = (m) => {
  const parts = m.slug.replace(/^mae101-/, '').split('-');
  const ch = Number(parts[0]);
  const lab = parts[1] === 'lab' ? 1 : 0;
  const sub = lab ? 0 : Number(parts[1]) || 0;
  return [ch, lab, sub];
};
mods.sort((a, b) => { const x = rank(a), y = rank(b); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; });
const MUC = { 1: 'BEGINNER', 2: 'BEGINNER', 3: 'INTERMEDIATE', 4: 'INTERMEDIATE', 5: 'BEGINNER', 6: 'BEGINNER', 7: 'INTERMEDIATE', 8: 'INTERMEDIATE', 9: 'ADVANCED' };
const en = (t) => (typeof t === 'string' ? t : t.en);
const track = {
  groupSlug: 'fptu',
  slug: 'mae101-practice',
  name: 'MAE101 — Luyện tập',
  language: 'javascript',
  color: '#0ea5e9',
  docsUrl: 'https://openstax.org/details/books/calculus-volume-1',
  status: 'PUBLISHED',
  level: 'BEGINNER',
  description: 'Bộ luyện môn MAE101 (Toán cho kỹ thuật) bám bài học của môn và dạng đề FE của trường — mỗi bài học một bộ đề từ dễ đến khó: giới hạn và liên tục, đạo hàm và các quy tắc, khảo sát hàm và tối ưu, tích phân và kỹ thuật tích phân, khử Gauss và hạng, phép toán ma trận, định thức và nghịch đảo, giá trị riêng, vector, biến đổi tuyến tính, cơ sở và số chiều. Con số trong bảng do mã tính, không gõ tay; ba Lab viết hàm chạy thật trong trình duyệt (đạo hàm/tích phân đa thức và phương pháp Newton · định thức và giải Ax = b bằng khử Gauss · hạng và độc lập tuyến tính).',
  modules: mods.map((m) => ({
    slug: m.slug,
    name: m.ten,
    level: MUC[rank(m)[0]] || 'BEGINNER',
    description: `Luyện: ${m.de.map((d) => en(d.tieuDe)).join(' · ')}`,
  })),
};
fs.writeFileSync(path.join(NGUON, '..', '_track.json'), JSON.stringify(track, null, 2) + '\n');
console.log(`✓ _track.json: ${track.modules.length} module · ${mods.reduce((s, m) => s + m.de.length, 0)} đề`);
