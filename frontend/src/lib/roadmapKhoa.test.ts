/**
 * Test bộ dựng roadmap sơ đồ đầu khoá — `npx tsx --test frontend/src/lib/roadmapKhoa.test.ts`.
 * Dùng cấu trúc THẬT của content/courses/postgresql.mjs + content/roadmap-khoa/postgresql.json.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { dungRoadmap, loaiBai, tachSo, thoiLuongChu, type ChuongVao, type MetaRoadmap } from './roadmapKhoa';

const GOC = path.resolve(__dirname, '..', '..', '..');

test('loaiBai — nhận đúng loại từ slug/tiêu đề thật', () => {
  const t = (slug: string, title: string, lessonType?: string) => loaiBai({ slug, title, lessonType });
  assert.equal(t('postgresql-2-5-quiz', '2.5 — Chapter 2 quiz|||2.5 — Kiểm tra Chương 2'), 'quiz');
  assert.equal(t('pro192-quiz-ch1', 'Chapter 1 Quiz|||Quiz chương 1', 'QUIZ'), 'quiz');
  assert.equal(t('postgresql-lab-1-luoc-do-ct-shop', 'Lab 1 — CT Shop: from ERD to a working schema|||Lab 1 — CT Shop: từ ERD'), 'lab');
  assert.equal(t('postgresql-moc-3', '🛠 Project milestone 3 — The schema|||🛠 Mốc dự án 3 — Lược đồ'), 'du-an');
  assert.equal(t('postgresql-bao-ve-du-an', '🎓 Finish & defend your course project|||🎓 Hoàn thiện & bảo vệ dự án'), 'du-an');
  assert.equal(t('postgresql-pe1-chua-tron-de', 'PE1 fully solved — 5 questions|||Chữa trọn đề PE1'), 'de-thi');
  assert.equal(t('postgresql-fe2-chua-tron-de', 'Final exam FE2 — all 50 questions, solved|||Chữa trọn đề FE2'), 'de-thi');
  assert.equal(t('pro192-slide-pro3-1', '1.B — 📑 Slide by slide · Getting Started|||1.B — 📑 Học theo slide'), 'slide');
  assert.equal(t('pro192-on-ch1', '1.H — 🧪 Practice + 🗂 Glossary|||1.H — 🧪 Luyện tập'), 'on-tap');
  assert.equal(t('pro192-bat-dau-tai-day', '⭐ Start here (1/2) — What PRO192 is|||⭐ Bắt đầu tại đây (1/2)'), 'bat-dau');
  assert.equal(t('pro192-tai-lieu-tham-khao', '📚 Course materials & references|||📚 Tài liệu tham khảo'), 'tai-lieu');
  assert.equal(t('postgresql-2-1-so', '2.1 — Numbers|||2.1 — Số: số nguyên, numeric & cạm bẫy tiền bạc'), 'bai');
  assert.equal(t('postgresql-0-3-cai-dat', '0.3 — Installing PostgreSQL|||0.3 — Cài đặt PostgreSQL'), 'bat-dau');
});

test('tachSo — số bài và tên', () => {
  assert.deepEqual(tachSo('3.2 — Khoá ngoại & toàn vẹn tham chiếu'), { so: '3.2', ten: 'Khoá ngoại & toàn vẹn tham chiếu' });
  assert.deepEqual(tachSo('Lab 1 — CT Shop: từ ERD tới lược đồ'), { so: 'Lab 1', ten: 'CT Shop: từ ERD tới lược đồ' });
  assert.deepEqual(tachSo('1.B — 📑 Học theo slide'), { so: '1.B', ten: '📑 Học theo slide' });
  assert.deepEqual(tachSo('Quiz chương 1'), { so: null, ten: 'Quiz chương 1' });
  assert.equal(thoiLuongChu(3900), '1 giờ 5 phút');
  assert.equal(thoiLuongChu(30), '1 phút');
  assert.equal(thoiLuongChu(0), '');
});

test('Không có meta ⇒ vẫn dựng đủ, lùi về mô tả + bài liền trước + thực hành cùng chương', () => {
  const sections: ChuongVao[] = [
    { id: 1, title: 'Chapter 1 — Basics|||Chương 1 — Cơ bản', sortOrder: 1, lessons: [
      { id: 11, slug: 'k-1-1', title: '1.1 — A|||1.1 — Bài A', description: 'Học A|||Học A tiếng Việt', sortOrder: 1, videoDurationSeconds: 600 },
      { id: 12, slug: 'k-1-2', title: '1.2 — B|||1.2 — Bài B', sortOrder: 2 },
      { id: 13, slug: 'k-lab-1', title: 'Lab 1 — L|||Lab 1 — Thực hành', sortOrder: 3 },
      { id: 14, slug: 'k-1-q-quiz', title: 'Quiz|||Kiểm tra chương 1', lessonType: 'QUIZ', sortOrder: 4 },
    ] },
    { id: 2, title: 'Chương 2 — Nâng cao', sortOrder: 2, lessons: [{ id: 21, slug: 'k-2-1', title: '2.1 — C', sortOrder: 1 }] },
    { id: 3, title: 'Trống', sortOrder: 3, lessons: [] },
  ];
  const r = dungRoadmap(sections, null, { xong: (id) => id === 11 });
  assert.equal(r.chang.length, 2, 'chương rỗng bị bỏ');
  assert.equal(r.tongNut, 5);
  assert.equal(r.soCoMoTa, 0);
  const [c1, c2] = r.chang;
  assert.deepEqual([c1.nhan, c1.ten], ['Chương 1', 'Cơ bản']);
  assert.deepEqual(c1.nut.map((n) => [n.id, n.ben, n.loai]), [[11, 'trai', 'bai'], [12, 'trai', 'bai'], [13, 'phai', 'lab'], [14, 'phai', 'quiz']]);
  const [a, b] = c1.nut;
  assert.equal(a.hoc, 'Học A tiếng Việt');
  assert.equal(a.trangThai, 'xong');
  assert.equal(b.trangThai, 'dang', 'bài chưa xong đầu tiên là "đang học"');
  assert.match(b.canBiet, /Bài A/);
  assert.deepEqual(b.canBietBai.map((x) => x.id), [11]);
  assert.deepEqual(b.ketHopBai.map((x) => x.id), [13, 14]);
  assert.equal(b.ketHop, '', 'thiếu mô tả ⇒ không tự bịa câu "kết hợp", chỉ có link thật');
  assert.equal(b.lamDuoc, '');
  assert.equal(c2.nut[0].canBietBai[0].id, 14, 'bài đầu chương sau nối về bài cuối chương trước');
  assert.equal(c1.trangThai, 'dang');
  assert.deepEqual(r.chang.flatMap((c) => c.nut.map((n) => n.thuTu)), [0, 1, 2, 3, 4]);
});

test('Chương toàn lý thuyết ≥3 bài ⇒ chia đôi hai bên cho cân', () => {
  const r = dungRoadmap([{ id: 1, title: 'Mục 0 — Giới thiệu', lessons: [1, 2, 3, 4, 5].map((i) => ({ id: i, slug: `x-${i}`, title: `0.${i} — Bài ${i}`, sortOrder: i })) }], null);
  assert.deepEqual(r.chang[0].nut.map((n) => n.ben), ['trai', 'trai', 'trai', 'phai', 'phai']);
  assert.equal(r.chang[0].nhan, 'Mục 0');
});

test('Khoá thật PostgreSQL + tệp meta thật: mọi bài có 4 ý, link "cần biết trước" luôn trỏ bài ĐỨNG TRƯỚC', async () => {
  const tepMeta = path.join(GOC, 'content/roadmap-khoa/postgresql.json');
  if (!fs.existsSync(tepMeta)) return;
  const spec = (await import(pathToFileURL(path.join(GOC, 'content/courses/postgresql.mjs')).href)).default;
  let id = 0;
  const sections: ChuongVao[] = spec.sections.map((s: { title: string; description?: string; lessons: Array<{ slug: string; title: string; description?: string; type?: string }> }, i: number) => ({
    id: 1000 + i, title: s.title, description: s.description, sortOrder: i,
    lessons: s.lessons.map((l, j) => ({ id: ++id, slug: l.slug, title: l.title, description: l.description, lessonType: l.type, sortOrder: j })),
  }));
  const meta: MetaRoadmap = JSON.parse(fs.readFileSync(tepMeta, 'utf8'));
  const r = dungRoadmap(sections, meta);
  assert.equal(r.tongNut, id);
  assert.equal(r.soCoMoTa, id, 'mọi bài có mô tả biên soạn');
  const viTri = new Map(r.chang.flatMap((c) => c.nut).map((n) => [n.id, n.thuTu]));
  for (const n of r.chang.flatMap((c) => c.nut)) {
    for (const y of [n.hoc, n.canBiet, n.lamDuoc, n.ketHop]) assert.ok(y.length > 10, `${n.slug}: ý rỗng`);
    for (const t of n.canBietBai) assert.ok(viTri.get(t.id)! < n.thuTu, `${n.slug}: cần biết trước trỏ bài sau (${t.ten})`);
    for (const t of n.ketHopBai) assert.notEqual(t.id, n.id);
  }
  const loai = new Set(r.chang.flatMap((c) => c.nut.map((n) => n.loai)));
  for (const l of ['bat-dau', 'bai', 'lab', 'quiz', 'du-an', 'de-thi'] as const) assert.ok(loai.has(l), `thiếu loại ${l}`);
  assert.ok(r.chang.every((c) => c.hoc.length > 10), 'mọi chương có tóm tắt');
});
