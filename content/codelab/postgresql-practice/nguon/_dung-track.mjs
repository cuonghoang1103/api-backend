/** Dựng _track.json của postgresql-practice từ các module: node content/codelab/postgresql-practice/nguon/_dung-track.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const NGUON = path.dirname(fileURLToPath(import.meta.url));
const files = fs.readdirSync(NGUON).filter((f) => f.endsWith('.mjs') && !f.startsWith('_'));
const mods = [];
for (const f of files) mods.push((await import(pathToFileURL(path.join(NGUON, f)).href)).default);
// Thứ tự = thứ tự bài trong khoá (manifest, đã chèn lab trước quiz) — module slug = slug bài học.
const course = (await import(pathToFileURL(path.join(NGUON, '..', '..', '..', 'courses', 'postgresql.mjs')).href)).default;
const ORDER = new Map(course.sections.flatMap((s) => s.lessons.map((l) => l.slug)).map((slug, i) => [slug, i]));
for (const m of mods) if (!ORDER.has(m.baiHoc ?? m.slug)) throw new Error(`module ${m.slug}: không có bài học "${m.baiHoc ?? m.slug}" trong khoá`);
mods.sort((a, b) => ORDER.get(a.baiHoc ?? a.slug) - ORDER.get(b.baiHoc ?? b.slug));
const en = (t) => (typeof t === 'string' ? t : t.en);
const chuong = (m) => Number((/^\s*(\d+)\./.exec(m.ten) || [])[1] ?? 0);
const track = {
  groupSlug: 'cuongthai',
  slug: 'postgresql-practice',
  name: 'PostgreSQL — Luyện tập SQL chấm thật',
  language: 'sql',
  color: '#336791',
  docsUrl: 'https://www.postgresql.org/docs/current/',
  status: 'PUBLISHED',
  level: 'BEGINNER',
  description: 'Bộ luyện đi kèm khoá PostgreSQL: mỗi bài học một bộ đề dễ → khó, mỗi chương một Lab lớn, chấm bằng MÁY CHẤM SQL THẬT ngay trong trình duyệt — PostgreSQL 18 (WASM) nguyên bản: RETURNING, ON CONFLICT, DISTINCT ON, CTE đệ quy, hàm cửa sổ, JSONB, full-text search, EXCLUDE, chỉ mục và kế hoạch EXPLAIN, PL/pgSQL, trigger, view, phân mảnh đều chạy và được chấm như máy chủ thật. Dữ liệu là bảng của chính bài giảng và CT Shop mini (lát cắt của dữ liệu lab). Phần không chạy được trong trình duyệt (đồng thời thật, sao lưu, nhân bản, pg_trgm) học bằng câu hỏi tình huống hoặc bài chạy trên máy bạn rồi tự đánh dấu. Kiểm ẩn đổi dữ liệu để bắt lời giải chép cứng.',
  modules: mods.map((m) => ({
    slug: m.slug,
    name: m.ten,
    level: chuong(m) <= 4 ? 'BEGINNER' : chuong(m) <= 10 ? 'INTERMEDIATE' : 'ADVANCED',
    description: `Luyện: ${m.de.map((d) => en(d.tieuDe)).join(' · ')}`,
  })),
};
fs.writeFileSync(path.join(NGUON, '..', '_track.json'), JSON.stringify(track, null, 2) + '\n');
console.log(`✓ _track.json: ${track.modules.length} module · ${mods.reduce((s, m) => s + m.de.length, 0)} đề`);
