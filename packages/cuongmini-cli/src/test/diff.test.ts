import assert from 'node:assert/strict';
import { test } from 'node:test';
import { datNgonNgu } from '../i18n';
import { veDiff } from '../diff';
import { boMau, datCapMau, doRong } from '../mau';

// Các phép kiểm dưới so chữ giao diện tiếng Việt.
datNgonNgu('vi');

const DIFF = {
  soThem: 2, soBo: 1, quaLon: false,
  dong: [
    { loai: 'giu' as const, soCu: 9, soMoi: 9, text: 'const a = 1;' },
    { loai: 'bo' as const, soCu: 10, soMoi: null, text: 'const b = 2;' },
    { loai: 'them' as const, soCu: null, soMoi: 10, text: 'const b = 3;' },
    { loai: 'them' as const, soCu: null, soMoi: 11, text: '// mới' },
  ],
};

test('diff: số dòng + dấu, nền xanh/đỏ phủ cả hàng', () => {
  datCapMau(3);
  const ra = veDiff(DIFF, { rong: 40, duong: 'a.ts' });
  assert.deepEqual(ra.map((d) => boMau(d).trimEnd()), [' 9   const a = 1;', '10 - const b = 2;', '10 + const b = 3;', '11 + // mới']);
  assert.match(ra[1]!, /^\x1b\[48;2;63;18;25m/); // nền đỏ #3f1219
  assert.match(ra[2]!, /^\x1b\[48;2;18;54;31m/); // nền xanh #12361f
  assert.equal(doRong(ra[2]!), 40);
  assert.match(ra[2]!, /38;2;198;120;221mconst/, 'vẫn tô cú pháp trên nền diff');
});

test('diff: cắt bớt dòng, không màu thì chỉ còn dấu', () => {
  datCapMau(0);
  const ra = veDiff(DIFF, { rong: 40, toiDa: 2 });
  assert.deepEqual(ra, [' 9   const a = 1;', '10 - const b = 2;', '… +2 dòng nữa']);
  assert.deepEqual(veDiff(null, { rong: 40 }), []);
});
