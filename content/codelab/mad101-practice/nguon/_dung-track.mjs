/** Dựng _track.json của mad101-practice từ các module: node content/codelab/mad101-practice/nguon/_dung-track.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const NGUON = path.dirname(fileURLToPath(import.meta.url));
const files = fs.readdirSync(NGUON).filter((f) => f.endsWith('.mjs') && !f.startsWith('_'));
const mods = [];
for (const f of files) mods.push((await import(pathToFileURL(path.join(NGUON, f)).href)).default);
const rank = (m) => {
  const parts = m.slug.replace(/^mad101-/, '').split('-');
  const ch = Number(parts[0]);
  const lab = parts[1] === 'lab' ? 1 : 0;
  const sub = lab ? 0 : Number(parts[1]) || 0;
  return [ch, lab, sub];
};
mods.sort((a, b) => { const x = rank(a), y = rank(b); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; });
const MUC = { 1: 'BEGINNER', 2: 'BEGINNER', 3: 'INTERMEDIATE', 4: 'INTERMEDIATE', 5: 'INTERMEDIATE', 6: 'INTERMEDIATE', 7: 'ADVANCED', 8: 'ADVANCED', 20: 'ADVANCED' };
const en = (t) => (typeof t === 'string' ? t : t.en);
const track = {
  groupSlug: 'fptu',
  slug: 'mad101-practice',
  name: 'MAD101 — Luyện tập',
  language: 'javascript',
  color: '#0ea5e9',
  docsUrl: 'https://www.mheducation.com/highered/product/discrete-mathematics-its-applications-rosen/M9781259676512.html',
  status: 'PUBLISHED',
  level: 'BEGINNER',
  description: 'Bộ luyện môn MAD101 (Toán rời rạc) bám giáo trình Rosen và dạng đề FE của trường — mỗi bài học một bộ đề từ dễ đến khó, con số trong đề do bộ tính bằng mã (bảng chân trị, tập hợp và hàm, Big-O, Euclid và đồng dư, truy hồi, đếm, đồ thị Dijkstra, cây khung, Huffman); bài khó là viết hàm chạy thật trong trình duyệt; mỗi chương một Lab (quan hệ và ma trận, bộ công cụ số học, đệ quy, đếm, thuật toán đồ thị, cây) và hai đề FE thi thử cuối môn.',
  modules: mods.map((m) => ({
    slug: m.slug,
    name: m.ten,
    level: MUC[rank(m)[0]] || 'BEGINNER',
    description: `Luyện: ${m.de.map((d) => en(d.tieuDe)).join(' · ')}`,
  })),
};
fs.writeFileSync(path.join(NGUON, '..', '_track.json'), JSON.stringify(track, null, 2) + '\n');
console.log(`✓ _track.json: ${track.modules.length} module · ${mods.reduce((s, m) => s + m.de.length, 0)} đề`);
