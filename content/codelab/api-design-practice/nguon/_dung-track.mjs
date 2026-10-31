/** Dựng _track.json của api-design-practice từ các module: node content/codelab/api-design-practice/nguon/_dung-track.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const NGUON = path.dirname(fileURLToPath(import.meta.url));
const files = fs.readdirSync(NGUON).filter((f) => f.endsWith('.mjs') && !f.startsWith('_'));
const mods = [];
for (const f of files) mods.push((await import(pathToFileURL(path.join(NGUON, f)).href)).default);
// api-<chương>-<bài>-… ; Mục 0 xếp theo thứ tự học của khoá (0.8 "Bắt đầu tại đây" → 0.9 → 0.1 → 0.2 → 0.3); Lab (api-N-5-lab) sau các bài của chương.
const THU_TU_MUC0 = { 8: 0, 9: 1, 1: 2, 2: 3, 3: 4 };
const rank = (m) => {
  const [, ch, b, loai] = /^api-(\d+)-(\d+)-(lab)?/.exec(m.slug) || [];
  const chuong = Number(ch); const bai = Number(b);
  return [chuong, loai ? 1 : 0, chuong === 0 ? (THU_TU_MUC0[bai] ?? bai) : bai];
};
// Thứ tự trong khoá (manifest) thắng thứ tự đoán từ slug: từ Ch7 có bài chèn giữa (api-7-1-kiem-hop-dong là bài 7.2)
const course = (await import(pathToFileURL(path.join(NGUON, '..', '..', '..', 'courses', 'api-design.mjs')).href)).default;
const ORDER = new Map(course.sections.flatMap((s) => s.lessons.map((l) => l.slug)).map((slug, i) => [slug, i]));
const pos = (m) => ORDER.get(m.baiHoc ?? m.slug);
mods.sort((a, b) => {
  if (pos(a) !== undefined && pos(b) !== undefined) return pos(a) - pos(b);
  const x = rank(a), y = rank(b); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
});
const en = (t) => (typeof t === 'string' ? t : t.en);
const track = {
  groupSlug: 'cuongthai',
  slug: 'api-design-practice',
  name: 'API & System Design — Luyện tập',
  language: 'javascript',
  color: '#0f766e',
  docsUrl: 'https://www.rfc-editor.org/rfc/rfc9110',
  status: 'PUBLISHED',
  level: 'BEGINNER',
  description: 'Bộ luyện đi kèm khoá API & System Design (thiết kế API từ số 0, dự án xuyên khoá LabFlow API — đặt phòng lab/thiết bị): mỗi bài học một bộ đề từ dễ đến khó, đề tiếng Anh có bản tiếng Việt, dữ liệu là output CHẠY THẬT của LabFlow (Node 22 + Express 5, curl -i). Trắc nghiệm, sắp thứ tự, điền bảng để chọn đúng phương thức và mã trạng thái cho từng tình huống; bài khó là tự viết hàm từ gốc chạy thật trong trình duyệt — đọc dòng trạng thái và header HTTP, dựng lệnh curl, soát URL theo luật tài nguyên, JSON Merge Patch, kiểm dữ liệu đặt phòng trả details[], đổi snake_case sang camelCase, đọc ngày giờ có múi giờ; Lab chương 1 dựng tài nguyên báo hỏng thiết bị.',
  modules: mods.map((m) => ({
    slug: m.slug,
    name: m.ten,
    level: rank(m)[0] === 0 ? 'BEGINNER' : (rank(m)[1] ? 'INTERMEDIATE' : 'BEGINNER'),
    description: `Luyện: ${m.de.map((d) => en(d.tieuDe)).join(' · ')}`,
  })),
};
fs.writeFileSync(path.join(NGUON, '..', '_track.json'), JSON.stringify(track, null, 2) + '\n');
console.log(`✓ _track.json: ${track.modules.length} module · ${mods.reduce((s, m) => s + m.de.length, 0)} đề`);
