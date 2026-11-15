/** Dựng _track.json của dsa-interview-practice từ các module: node content/codelab/dsa-interview-practice/nguon/_dung-track.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

process.env.DSA_BO_SAI = '1'; // chỉ cần tên/đề, không thử lại sai mẫu
const NGUON = path.dirname(fileURLToPath(import.meta.url));
const files = fs.readdirSync(NGUON).filter((f) => f.endsWith('.mjs') && !f.startsWith('_'));
const mods = [];
for (const f of files) mods.push((await import(pathToFileURL(path.join(NGUON, f)).href)).default);
// Thứ tự = thứ tự bài trong khoá (manifest content/courses/dsa-interview.mjs)
const course = (await import(pathToFileURL(path.join(NGUON, '..', '..', '..', 'courses', 'dsa-interview.mjs')).href)).default;
const ORDER = new Map(course.sections.flatMap((s) => s.lessons.map((l) => l.slug)).map((slug, i) => [slug, i]));
for (const m of mods) if (!ORDER.has(m.baiHoc)) throw new Error(`module ${m.slug}: bài ${m.baiHoc} không có trong khoá`);
mods.sort((a, b) => ORDER.get(a.baiHoc) - ORDER.get(b.baiHoc));
const en = (t) => (typeof t === 'string' ? t : t.en);
const chuong = (m) => Number(/^dsa-(\d+)-/.exec(m.slug)[1]);
const track = {
  groupSlug: 'cuongthai',
  slug: 'dsa-interview-practice',
  name: 'Coding Interview Prep — Luyện tập',
  language: 'javascript',
  color: '#7c3aed',
  docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map',
  status: 'PUBLISHED',
  level: 'INTERMEDIATE',
  description: 'Bộ luyện chấm tự động đi kèm khoá Coding Interview Prep: mỗi bài dạy một mẫu (hash map, tổng tiền tố, sắp xếp, hai con trỏ, cửa sổ trượt, stack/queue, danh sách liên kết, tìm nhị phân, cây, heap, khoảng, BFS/DFS, tô-pô, quay lui, quy hoạch động) có 3–4 đề TỰ SOẠN từ dễ đến khó, bối cảnh đời thật (phòng lab FPT, đơn hàng shop, log request, lịch họp…), đề tiếng Anh có bản tiếng Việt. Viết một hàm JavaScript, máy chấm chạy thật trong trình duyệt: so sâu kết quả, có ca ẩn và một kiểm hiệu năng với đầu vào lớn — lời giải O(n²) khi đề đòi O(n) sẽ trượt.',
  modules: mods.map((m) => ({
    slug: m.slug,
    name: m.ten,
    level: chuong(m) <= 2 ? 'BEGINNER' : (chuong(m) >= 8 ? 'ADVANCED' : 'INTERMEDIATE'),
    description: `Luyện: ${m.de.map((d) => en(d.tieuDe)).join(' · ')}`,
  })),
};
fs.writeFileSync(path.join(NGUON, '..', '_track.json'), JSON.stringify(track, null, 2) + '\n');
console.log(`✓ _track.json: ${track.modules.length} module · ${mods.reduce((s, m) => s + m.de.length, 0)} đề`);
