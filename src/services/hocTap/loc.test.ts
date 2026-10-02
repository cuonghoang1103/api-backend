import { test } from 'node:test';
import assert from 'node:assert/strict';
import { locKeHoach } from './keHoachAI.js';
import { locKetQua } from './chamBangChung.js';

test('locKeHoach: dựng link từ id/slug đã kiểm, bỏ id bịa, kẹp tuần', () => {
  const bai = new Map([[101, 'fer202']]);
  const khoa = new Map([['web-foundations', 'Nền tảng web']]);
  const kq = locKeHoach({
    tomTat: 'x',
    nenTang: [{ slug: 'web-foundations', lyDo: 'thiếu nền' }, { slug: 'bia', lyDo: '' }],
    viec: [
      { tuan: 2, thu: 3, loai: 'bai_hoc', tieuDe: 'Bài 1', baiHocId: 101, thoiLuongPhut: 45 },
      { tuan: 5, loai: 'NEN_TANG', tieuDe: 'HTML', khoaNen: 'web-foundations' },
      { tuan: 5, loai: 'LAB', tieuDe: 'Lab', baiHocId: 999 },
      { tuan: 5, loai: 'LẠ', tieuDe: 'x' },
    ],
  }, bai, khoa, 4);
  assert.equal(kq.viec.length, 3);
  assert.equal(kq.viec[0].tuan, 4, 'việc bù tuần cũ dời về tuần hiện tại');
  assert.equal(kq.viec[0].lienKet, '/courses/fer202/learn?lessonId=101');
  assert.equal(kq.viec[1].lienKet, '/courses/web-foundations');
  assert.equal(kq.viec[2].lienKet, null);
  assert.equal(kq.nenTang.length, 1);
  assert.equal(kq.canhBao.length, 2);
});

test('locKetQua: kẹp điểm, cần có điểm, dat chỉ khi true thật', () => {
  const r = locKetQua({ dat: 'true', diem: 12, nhanXet: '', loiCanSua: ['a', '', 3] });
  assert.equal(r.dat, false);
  assert.equal(r.diem, 10);
  assert.deepEqual(r.loiCanSua, ['a', '3']);
  assert.throws(() => locKetQua({ dat: true }));
});
