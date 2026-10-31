/** Dựng _track.json của networking-practice từ các module: node content/codelab/networking-practice/nguon/_dung-track.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const NGUON = path.dirname(fileURLToPath(import.meta.url));
const files = fs.readdirSync(NGUON).filter((f) => f.endsWith('.mjs') && !f.startsWith('_'));
const mods = [];
for (const f of files) mods.push((await import(pathToFileURL(path.join(NGUON, f)).href)).default);
// netdev-<chương>-<bài>-… ; Mục 0 xếp theo thứ tự học của khoá (0.8 "Bắt đầu tại đây" → 0.9 → 0.1 → 0.2); Lab sau các bài của chương.
const THU_TU_MUC0 = { 8: 0, 9: 1, 1: 2, 2: 3 };
const rank = (m) => {
  const [, ch, b, loai] = /^netdev-(\d+)-(\d+)-(lab)?/.exec(m.slug) || [];
  const chuong = Number(ch); const bai = Number(b);
  return [chuong, loai ? 1 : 0, chuong === 0 ? (THU_TU_MUC0[bai] ?? bai) : bai];
};
mods.sort((a, b) => { const x = rank(a), y = rank(b); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; });
const en = (t) => (typeof t === 'string' ? t : t.en);
const track = {
  groupSlug: 'cuongthai',
  slug: 'networking-practice',
  name: 'Networking for Developers — Luyện tập',
  language: 'javascript',
  color: '#7c3aed',
  docsUrl: 'https://hpbn.co/',
  status: 'PUBLISHED',
  level: 'BEGINNER',
  description: 'Bộ luyện đi kèm khoá Networking for Developers (mạng máy tính cho lập trình viên, học từ số 0): mỗi bài học một bộ đề riêng từ dễ đến khó, đề tiếng Anh có bản tiếng Việt, dữ liệu lấy từ output CHẠY THẬT trong phòng lab Docker của khoá (curl -w, tcpdump, tshark -x, ip neigh, ss). Trắc nghiệm, sắp thứ tự, điền bảng để nắm khái niệm; bài khó là tự viết hàm từ gốc chạy thật trong trình duyệt — phân loại lỗi curl, tính thời gian từng chặng của một request, đếm byte UTF-8, đọc một frame Ethernet byte theo byte, mô phỏng switch học MAC, chọn socket nhận gói; Lab chương 1 mổ xẻ trọn một request của LabFlow ở hai phía router.',
  modules: mods.map((m) => ({
    slug: m.slug,
    name: m.ten,
    level: rank(m)[0] === 0 ? 'BEGINNER' : (rank(m)[1] ? 'INTERMEDIATE' : 'BEGINNER'),
    description: `Luyện: ${m.de.map((d) => en(d.tieuDe)).join(' · ')}`,
  })),
};
fs.writeFileSync(path.join(NGUON, '..', '_track.json'), JSON.stringify(track, null, 2) + '\n');
console.log(`✓ _track.json: ${track.modules.length} module · ${mods.reduce((s, m) => s + m.de.length, 0)} đề`);
