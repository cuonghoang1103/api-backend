/** Dựng _track.json của nwc204-practice từ các module: node content/codelab/nwc204-practice/nguon/_dung-track.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const NGUON = path.dirname(fileURLToPath(import.meta.url));
const files = fs.readdirSync(NGUON).filter((f) => f.endsWith('.mjs') && !f.startsWith('_'));
const mods = [];
for (const f of files) mods.push((await import(pathToFileURL(path.join(NGUON, f)).href)).default);
const rank = (m) => {
  const parts = m.slug.replace(/^nwc204-/, '').split('-');
  const ch = Number(parts[0]);
  const lab = parts[1] === 'lab' ? 1 : 0;
  const sub = lab ? 0 : Number(parts[1]) || 0;
  return [ch, lab, sub];
};
mods.sort((a, b) => { const x = rank(a), y = rank(b); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; });
const MUC = { 3: 'BEGINNER', 4: 'BEGINNER', 5: 'BEGINNER', 6: 'INTERMEDIATE', 7: 'INTERMEDIATE', 8: 'INTERMEDIATE', 10: 'INTERMEDIATE', 11: 'INTERMEDIATE', 12: 'INTERMEDIATE', 13: 'ADVANCED', 14: 'INTERMEDIATE', 15: 'ADVANCED', 20: 'ADVANCED' };
const en = (t) => (typeof t === 'string' ? t : t.en);
const track = {
  groupSlug: 'fptu',
  slug: 'nwc204-practice',
  name: 'NWC204 — Luyện tập',
  language: 'javascript',
  color: '#0891b2',
  docsUrl: 'https://www.netacad.com/courses/networking',
  status: 'PUBLISHED',
  level: 'BEGINNER',
  description: 'Bộ luyện môn NWC204 (Mạng máy tính, theo giáo trình Cisco CCNA ITN) bám dạng đề FE của trường — mỗi bài học một bộ đề từ dễ đến khó, con số trong đề do bộ mô phỏng tính bằng mã (nhị phân và AND, chia subnet và VLSM, CIDR và wildcard, IPv6, bảng định tuyến khớp tiền tố dài nhất, bảng MAC và VLAN, ARP, phân mảnh IP, CRC, bắt tay TCP và cửa sổ trượt, ACL, NAT/PAT, thời gian truyền); bài khó là viết hàm mô phỏng chạy thật trong trình duyệt; ba Lab (hoạch định địa chỉ, mô phỏng router, router biên ACL + PAT) và hai đề FE thi thử cuối môn.',
  modules: mods.map((m) => ({
    slug: m.slug,
    name: m.ten,
    level: MUC[rank(m)[0]] || 'BEGINNER',
    description: `Luyện: ${m.de.map((d) => en(d.tieuDe)).join(' · ')}`,
  })),
};
fs.writeFileSync(path.join(NGUON, '..', '_track.json'), JSON.stringify(track, null, 2) + '\n');
console.log(`✓ _track.json: ${track.modules.length} module · ${mods.reduce((s, m) => s + m.de.length, 0)} đề`);
