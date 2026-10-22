/**
 * Script gán chương trình đào tạo — chạy với PrismaClient GIẢ (không cần CSDL).
 *   node --test scripts/gan-chuong-trinh-khoa-hoc.test.mjs
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { ganChuongTrinh, kiemKhung } from './gan-chuong-trinh-khoa-hoc.mjs';

const khungThat = JSON.parse(readFileSync(new URL('./chuong-trinh-15-ky.json', import.meta.url), 'utf8'));

function prismaGia(rows) {
  const ghi = [];
  return {
    ghi,
    course: {
      async findMany() { return rows.map((r) => ({ ...r })); },
      async update({ where, data }) {
        ghi.push({ id: where.id, ...data });
        const r = rows.find((x) => x.id === where.id);
        Object.assign(r, data);
        return r;
      },
    },
  };
}

const khungNho = [
  { ky: 1, mon: [{ thuTu: 1, slug: 'git' }, { thuTu: 2, slug: 'khong-ton-tai' }] },
  { ky: 2, mon: [{ thuTu: 1, slug: 'react' }, { thuTu: 2, slug: 'mon-academy' }] },
];
const rowsGoc = () => [
  { id: 1, slug: 'git', isPublished: true, semesterId: null, loTrinhKy: null, loTrinhThuTu: null },
  { id: 2, slug: 'react', isPublished: false, semesterId: null, loTrinhKy: 2, loTrinhThuTu: 1 },
  { id: 3, slug: 'mon-academy', isPublished: true, semesterId: 7, loTrinhKy: null, loTrinhThuTu: null },
  { id: 4, slug: 'admin-gan-tay', isPublished: true, semesterId: null, loTrinhKy: 5, loTrinhThuTu: 3 },
];

test('JSON thật của repo hợp lệ: 15 kỳ, không slug trùng', () => {
  assert.deepEqual(kiemKhung(khungThat), []);
  assert.equal(khungThat.length, 15);
});

test('kiemKhung bắt kỳ sai, slug trùng, thuTu lặp', () => {
  const loi = kiemKhung([
    { ky: 0, mon: [] },
    { ky: 1, mon: [{ thuTu: 1, slug: 'a' }, { thuTu: 1, slug: 'b' }] },
    { ky: 2, mon: [{ thuTu: 1, slug: 'a' }] },
  ]);
  assert.ok(loi.some((l) => l.includes('kỳ không hợp lệ')));
  assert.ok(loi.some((l) => l.includes('thuTu 1 lặp')));
  assert.ok(loi.some((l) => l.includes('slug "a"')));
});

test('CHẠY THỬ mặc định: không ghi gì, nhưng báo đủ slug lạ / Academy / chưa xuất bản / gán ngoài JSON', async () => {
  const p = prismaGia(rowsGoc());
  const kq = await ganChuongTrinh(p, khungNho, { log: () => {} });
  assert.equal(p.ghi.length, 0, 'chạy thử tuyệt đối không update');
  assert.deepEqual(kq.khongCo, ['khong-ton-tai']);
  assert.deepEqual(kq.academy, ['mon-academy']);
  assert.deepEqual(kq.chuaXuatBan, ['react']);
  assert.deepEqual(kq.ngoaiJson, ['admin-gan-tay (kỳ 5)'], 'gán tay của admin được báo, KHÔNG bị gỡ');
  assert.equal(kq.ghi, 2, 'git + mon-academy cần ghi; react đã đúng sẵn');
  assert.equal(kq.khongDoi, 1);
});

test('--ghi: ghi đúng kỳ/thứ tự; chạy lần hai không ghi gì (idempotent)', async () => {
  const rows = rowsGoc();
  const p = prismaGia(rows);
  await ganChuongTrinh(p, khungNho, { apply: true, log: () => {} });
  assert.deepEqual(p.ghi, [
    { id: 1, loTrinhKy: 1, loTrinhThuTu: 1 },
    { id: 3, loTrinhKy: 2, loTrinhThuTu: 2 },
  ]);
  assert.equal(rows.find((r) => r.id === 4).loTrinhKy, 5, 'khoá ngoài JSON giữ nguyên');
  const p2 = prismaGia(rows);
  const kq2 = await ganChuongTrinh(p2, khungNho, { apply: true, log: () => {} });
  assert.equal(p2.ghi.length, 0);
  assert.equal(kq2.khongDoi, 3);
});

test('JSON hỏng ⇒ ném lỗi TRƯỚC khi đọc CSDL', async () => {
  let daDoc = false;
  const p = { course: { async findMany() { daDoc = true; return []; }, async update() {} } };
  await assert.rejects(ganChuongTrinh(p, [{ ky: 40, mon: [] }]), /JSON chương trình sai/);
  assert.equal(daDoc, false);
});
