/** Dựng _track.json của dbi202-practice từ các module: node content/codelab/dbi202-practice/nguon/_dung-track.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const NGUON = path.dirname(fileURLToPath(import.meta.url));
const files = fs.readdirSync(NGUON).filter((f) => f.endsWith('.mjs') && !f.startsWith('_'));
const mods = [];
for (const f of files) mods.push((await import(pathToFileURL(path.join(NGUON, f)).href)).default);
// Thứ tự = thứ tự bài trong khoá; module Lab/PE (slug riêng) đứng NGAY SAU bài học nó gắn (baiHoc).
const course = (await import(pathToFileURL(path.join(NGUON, '..', '..', '..', 'academy', 'DBI202.mjs')).href)).default;
const ORDER = new Map(course.sections.flatMap((s) => s.lessons.map((l) => l.slug)).map((slug, i) => [slug, i]));
for (const m of mods) if (!ORDER.has(m.baiHoc ?? m.slug)) throw new Error(`module ${m.slug}: không có bài học "${m.baiHoc ?? m.slug}" trong khoá`);
const viTri = (m) => ORDER.get(m.baiHoc ?? m.slug) + (m.slug === (m.baiHoc ?? m.slug) ? 0 : 0.5);
mods.sort((a, b) => viTri(a) - viTri(b) || a.slug.localeCompare(b.slug));
const cu = JSON.parse(fs.readFileSync(path.join(NGUON, '..', '_track.json'), 'utf8'));
const moTaCu = new Map(cu.modules.map((m) => [m.slug, m.description]));
const mucCu = new Map(cu.modules.map((m) => [m.slug, m.level]));
const en = (t) => (typeof t === 'string' ? t : t.en);
const muc = (m) => {
  const s = m.slug;
  if (/-(5|6|7|8|9)-lab-|-lab-|-pe-|pe\d-sp26|fe\d+-|cs\d-on|cs\d+-|-cau-noi/.test(s)) return 'ADVANCED';
  if (/-(on-ch[1-4]|buoi|csdl|mo-hinh|dai-so|slide-dbi[2-6]|er-|xuong|chuan|bao-dong|phan-ra|rang-buoc-quan)/.test(s)) return 'BEGINNER';
  return 'INTERMEDIATE';
};
const track = {
  ...cu,
  description: 'Bộ luyện môn DBI202 (Database Systems) phủ MỌI bài học của khoá: đại số quan hệ, ERD → bảng, phụ thuộc hàm và chuẩn hoá (câu hỏi/bảng chấm tự động), SQL chấm bằng MÁY CHẤM SQL THẬT ngay trong trình duyệt — PostgreSQL 18 (WASM) ở chế độ giống SQL Server: so chuỗi không phân biệt hoa thường, AVG số nguyên, GROUP BY chặt. Viết SQL chuẩn chạy cả SQL Server lẫn PostgreSQL; cú pháp riêng một hệ bị báo rõ. Phần T-SQL thuần (stored procedure, function, trigger, cursor, giao dịch, chỉ mục CLUSTERED) chạy trên SQL Server của bạn với tệp tự kiểm check.sql in PASS/FAIL. CSDL mẫu FUHCompany của môn, mỗi bài học một bộ đề dễ → khó (kiểm ẩn đổi dữ liệu), Lab chương dạng bản in và đề luyện PE theo dạng SP26.',
  modules: mods.map((m) => ({
    slug: m.slug,
    name: m.ten,
    level: mucCu.get(m.slug) ?? muc(m),
    description: moTaCu.get(m.slug) ?? `Luyện: ${m.de.map((d) => en(d.tieuDe)).join(' · ')}`,
  })),
};
fs.writeFileSync(path.join(NGUON, '..', '_track.json'), JSON.stringify(track, null, 2) + '\n');
console.log(`✓ _track.json: ${track.modules.length} module · ${mods.reduce((s, m) => s + m.de.length, 0)} đề`);
