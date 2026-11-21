/**
 * Kiểm khối `duAn` khi seed — `node --test scripts/lib/du-an.test.mjs`. Xem scripts/lib/du-an.mjs.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { giongNhau, inKetQuaKiem, jsonOnDinh, kiemDuAn, layDuAn, moiBai } from './du-an.mjs';

const slugCua = (l) => l.slug;

/** Một spec hợp lệ tối thiểu: 5 đề tài, 2 mốc, bài đăng ký + bài bảo vệ. */
function specMau() {
  const deTai = ['shop-sneaker', 'thu-vien', 'phong-kham', 'khoa-hoc', 'quan-cafe'].map((slug, i) => ({
    slug, ten: `Topic ${i}|||Đề tài ${i}`, moTa: 'A shop.|||Một cửa hàng.', doKho: (i % 3) + 1,
    tinhNang: ['a', 'b', 'c', 'd', 'e', 'f'], banDoChuong: [{ moc: 1, dung: 'list|||danh sách' }, { moc: 2, dung: 'cart|||giỏ' }],
    thamKhaoThat: ['Shopee'], anh: null,
  }));
  return {
    course: { slug: 'khoa-mau', title: 'Mau' },
    duAn: {
      version: 1,
      gioiThieu: '<p>EN</p>|||<p>VI</p>',
      deTai,
      tuChon: { yeuCauToiThieu: ['≥ 3 pages|||≥ 3 trang'], goiYQuyMo: 'small|||vừa' },
      moc: [
        { so: 1, slug: 'mau-moc-1', ten: 'M1|||Mốc 1', yeuCau: ['x'], datKhi: ['y'], nop: ['repo'] },
        { so: 2, slug: 'mau-moc-2', ten: 'M2|||Mốc 2', yeuCau: ['x'], datKhi: ['y', 'z'], goiY: ['g'], nop: ['repo', 'demo'] },
      ],
      baoVe: { rubric: [{ tieuChi: 'Chạy được', diem: 4 }, { tieuChi: 'Hiểu code', diem: 6 }], cauHoiMau: Array.from({ length: 15 }, (_, i) => `Q${i}`), chuanBi: ['README'] },
    },
    sections: [
      { title: 'Mục 0', lessons: [{ slug: 'bat-dau', title: 'Bắt đầu', dangKyDuAn: true }] },
      { title: 'Ch1', lessons: [{ slug: 'bai-1', title: 'b1' }, { slug: 'mau-moc-1', title: 'm1', type: 'EXERCISE', mocDuAn: 1 }] },
      { title: 'Ch2', lessons: [{ slug: 'mau-moc-2', title: 'm2', type: 'EXERCISE', mocDuAn: 2 }, { slug: 'mau-bao-ve-du-an', title: 'bv', type: 'EXERCISE', baoVeDuAn: true }] },
    ],
  };
}
const kiem = (spec) => kiemDuAn(layDuAn(spec), moiBai(spec), slugCua);

test('spec hợp lệ ⇒ không lỗi, dữ liệu chuẩn hoá có bai.dangKy/baoVe và mặc định nop/nangCao', () => {
  const kq = kiem(specMau());
  assert.deepEqual(kq.loi, []);
  assert.equal(kq.coDuAn, true);
  assert.deepEqual(kq.duLieu.bai, { dangKy: ['bat-dau'], baoVe: ['mau-bao-ve-du-an'] });
  assert.equal(kq.duLieu.moc[0].nangCao.length, 0);
  assert.deepEqual(kq.duLieu.moc[1].nop, ['repo', 'demo']);
  assert.equal(kq.duLieu.deTai.length, 5);
});

test('không có duAn và không có cờ ⇒ im lặng (khoá thường)', () => {
  const s = specMau(); delete s.duAn;
  s.sections = [{ title: 'x', lessons: [{ slug: 'a', title: 'a' }] }];
  const kq = kiem(s);
  assert.equal(kq.coDuAn, false);
  assert.deepEqual(kq.loi, []);
  assert.equal(kq.duLieu, null);
});

test('có cờ bài nhưng thiếu duAn ⇒ lỗi rõ, không nuốt', () => {
  const s = specMau(); delete s.duAn;
  const kq = kiem(s);
  assert.equal(kq.loi.length, 1);
  assert.match(kq.loi[0], /KHÔNG có khối `duAn`/);
});

test('< 5 đề tài ⇒ lỗi', () => {
  const s = specMau(); s.duAn.deTai = s.duAn.deTai.slice(0, 4);
  assert.ok(kiem(s).loi.some((e) => /≥ 5 đề tài/.test(e)));
});

test('slug mốc không khớp bài thật ⇒ lỗi; mocDuAn lệch số ⇒ lỗi; bài có mocDuAn không nằm trong duAn.moc ⇒ lỗi', () => {
  const s = specMau(); s.duAn.moc[1].slug = 'mau-moc-99';
  const loi = kiem(s).loi.join('\n');
  assert.match(loi, /"mau-moc-99" KHÔNG khớp bài nào/);
  assert.match(loi, /bài "mau-moc-2" có mocDuAn = 2 nhưng không có trong duAn.moc/);

  const s2 = specMau(); s2.sections[1].lessons[1].mocDuAn = 3;
  assert.ok(kiem(s2).loi.some((e) => /mocDuAn = 3 nhưng duAn.moc\[0\].so = 1/.test(e)));
});

test('rubric phải tổng 10, mốc tăng dần, banDoChuong trỏ mốc có thật, slug đề tài trùng', () => {
  const s = specMau();
  s.duAn.baoVe.rubric[0].diem = 3;
  s.duAn.deTai[1].slug = 'shop-sneaker';
  s.duAn.deTai[2].banDoChuong = [{ moc: 7, dung: 'x' }];
  const loi = kiem(s).loi.join('\n');
  assert.match(loi, /tổng điểm rubric = 9/);
  assert.match(loi, /"shop-sneaker" bị trùng/);
  assert.match(loi, /banDoChuong\[0\]\.moc = 7/);

  const s2 = specMau(); s2.duAn.moc.reverse();
  assert.ok(kiem(s2).loi.some((e) => /không tăng dần/.test(e)));
});

test('thiếu bài đăng ký / bảo vệ ⇒ lỗi; thiếu tuChon.yeuCauToiThieu ⇒ lỗi', () => {
  const s = specMau();
  delete s.sections[0].lessons[0].dangKyDuAn;
  delete s.sections[2].lessons[1].baoVeDuAn;
  delete s.duAn.tuChon;
  const loi = kiem(s).loi.join('\n');
  assert.match(loi, /dangKyDuAn: true/);
  assert.match(loi, /baoVeDuAn: true/);
  assert.match(loi, /yeuCauToiThieu/);
});

test('cảnh báo (không chặn): tinhNang ngoài 6–12, cauHoiMau < 15, type bài mốc khác EXERCISE', () => {
  const s = specMau();
  s.duAn.deTai[0].tinhNang = ['a', 'b', 'c'];
  s.duAn.baoVe.cauHoiMau = ['1', '2', '3', '4', '5'];
  s.sections[1].lessons[1].type = 'VIDEO';
  const kq = kiem(s);
  assert.deepEqual(kq.loi, []);
  assert.ok(kq.canhBao.length >= 3);
});

test('duAn đặt nhầm trong course vẫn được đọc; sections trong course (Academy cũ) vẫn được dò', () => {
  const s = specMau();
  s.course.duAn = s.duAn; delete s.duAn;
  s.course.sections = s.sections; delete s.sections;
  assert.deepEqual(kiem(s).loi, []);
});

test('giongNhau bỏ qua thứ tự khoá (jsonb của Postgres tự sắp lại)', () => {
  assert.ok(giongNhau({ b: 1, a: [{ y: 2, x: 1 }] }, { a: [{ x: 1, y: 2 }], b: 1 }));
  assert.ok(!giongNhau({ a: 1 }, { a: 2 }));
  assert.ok(giongNhau(null, undefined));
  assert.equal(jsonOnDinh({ b: undefined, a: 1 }), '{"a":1}');
});

test('inKetQuaKiem in "✗" (bộ dò lỗi deploy.sh bắt) và trả về true khi có lỗi', () => {
  const dong = [];
  const log = { warn: (m) => dong.push(m), error: (m) => dong.push(m) };
  assert.equal(inKetQuaKiem({ loi: ['x'], canhBao: ['y'] }, log), true);
  assert.ok(dong.some((d) => d.includes('✗ duAn: x')));
  assert.ok(dong.some((d) => d.includes('! duAn: y')));
  assert.equal(inKetQuaKiem({ loi: [], canhBao: [] }, log), false);
});
