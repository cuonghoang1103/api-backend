/**
 * Script tạo khung 12 khoá mới — kiểm mục lục thật trong repo + chạy với PrismaClient GIẢ (không cần CSDL).
 *   node --test scripts/tao-khung-khoa-moi.test.mjs
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { KHOA_MOI, docKhung, taoKhung } from './tao-khung-khoa-moi.mjs';

function prismaGia(courses = []) {
  const ghi = { course: [], update: [], section: [] };
  let id = 1000;
  return {
    ghi,
    courseCategory: { async findMany() { return ['frontend', 'backend', 'cs-fundamentals', 'languages', 'career', 'ai', 'devops'].map((slug, i) => ({ id: i + 1, slug })); } },
    course: {
      async findUnique({ where }) {
        const c = courses.find((x) => x.slug === where.slug);
        return c ? { ...c, _count: { sections: c.soChuong ?? 0 } } : null;
      },
      async create({ data }) { const c = { id: ++id, ...data, soChuong: 0 }; courses.push(c); ghi.course.push(data); return { id: c.id }; },
      async update({ where, data }) { ghi.update.push({ id: where.id, ...data }); Object.assign(courses.find((c) => c.id === where.id), data); },
    },
    courseSection: {
      async create({ data }) { ghi.section.push(data); const c = courses.find((x) => x.id === data.courseId); c.soChuong = (c.soChuong ?? 0) + 1; },
    },
  };
}

test('12 mục lục thật hợp lệ: Mục 0 mở bằng 2 bài "Bắt đầu tại đây", 12–16 chương × 4–8 bài, kết bằng dự án + thi', () => {
  assert.equal(KHOA_MOI.length, 12);
  assert.equal(new Set(KHOA_MOI.map((k) => k.slug)).size, 12);
  const ma = new Set();
  for (const k of KHOA_MOI) {
    const khung = docKhung(k.slug); // ném nếu sai
    ma.add(khung.ma);
    const chuong = khung.chuong.slice(1);
    assert.ok(chuong.length >= 12 && chuong.length <= 16, `${k.slug}: ${chuong.length} chương`);
    assert.match(khung.chuong.at(-2).tieuDe, /Capstone/i, `${k.slug}: chương áp chót phải là dự án cuối khoá`);
    assert.match(khung.chuong.at(-1).tieuDe, /Final exam/i, `${k.slug}: chương cuối phải là thi cuối khoá`);
    assert.ok(k.title.includes('|||') && k.shortDescription.includes('|||'), `${k.slug}: tên/mô tả song ngữ`);
  }
  assert.equal(ma.size, 12, 'tiền tố slug bài không được trùng giữa các khoá');
});

test('CHẠY THỬ mặc định: không ghi gì', async () => {
  const p = prismaGia();
  const kq = await taoKhung(p, { log: () => {} });
  assert.equal(kq.taoMoi.length, 12);
  assert.deepEqual(p.ghi, { course: [], update: [], section: [] });
});

test('--ghi: COMING_SOON + isPublished=false, bài chưa xuất bản & không nội dung; chạy lại không ghi gì', async () => {
  const p = prismaGia();
  await taoKhung(p, { apply: true, chi: ['ios-swift-swiftui'], log: () => {} });
  const c = p.ghi.course[0];
  assert.equal(c.status, 'COMING_SOON');
  assert.equal(c.isPublished, false);
  assert.equal(c.thumbnailUrl, 'https://media.cuongthai.com/images/course-covers/ios-swift-swiftui.png?v=1');
  const bai = p.ghi.section.flatMap((s) => s.lessons.create);
  assert.ok(bai.length > 50);
  assert.ok(bai.every((b) => b.isPublished === false && !('content' in b)));
  assert.match(bai[0].title, /^Start here \(1\/2\)/);
  assert.equal(new Set(bai.map((b) => b.slug)).size, bai.length, 'slug bài không trùng');
  const truoc = JSON.stringify(p.ghi);
  const kq2 = await taoKhung(p, { apply: true, chi: ['ios-swift-swiftui'], log: () => {} });
  assert.deepEqual(kq2.giuNguyen, ['ios-swift-swiftui']);
  assert.equal(JSON.stringify(p.ghi), truoc, 'idempotent');
});

test('không bao giờ đè việc đã làm: khoá đã PUBLISHED bỏ qua; khoá COMING_SOON đã có chương thì giữ chương', async () => {
  const p = prismaGia([
    { id: 1, slug: 'golang', status: 'PUBLISHED', soChuong: 3 },
    { id: 2, slug: 'tech-lead', status: 'COMING_SOON', soChuong: 5, title: 'cũ', shortDescription: 'cũ', level: 'ADVANCED', thumbnailUrl: null, categoryId: null },
  ]);
  const kq = await taoKhung(p, { apply: true, chi: ['golang', 'tech-lead'], log: () => {} });
  assert.equal(kq.boQua.length, 1);
  assert.deepEqual(kq.capNhat, ['tech-lead']);
  assert.equal(p.ghi.section.length, 0, 'không thêm chương vào khoá đã có chương');
  assert.ok(p.ghi.update.every((u) => u.id === 2), 'khoá PUBLISHED không bị update');
});
