/**
 * Xếp lớp đầu vào (mục 4.3) — bản máy chủ, + CHỐT CHỐNG TRÔI với bản web:
 * `npx tsx --test src/services/ielts/xepLop.test.ts`
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xepLop, xepLopChiTiet, bandTong, lamTronBandTong, viTriXaHon } from './xepLop.js';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Bản song sinh phía web — nạp động (đường dẫn biến) để tsc của backend (rootDir ./src) không kéo tệp frontend vào.
const tepFe = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../frontend/src/app/language/[code]/ielts/thi-may/xepLop.ts');
const { xepLop: xepLopWeb, xepLopChiTiet: xepLopChiTietWeb } = (await import(tepFe)) as { xepLop: typeof xepLop; xepLopChiTiet: typeof xepLopChiTiet };

test('làm tròn band tổng mục 1.5: 6.5·6.5·5.0·7.0 → 6.5; .125 xuống; .625 → .5; .75 lên', () => {
  assert.equal(bandTong([6.5, 6.5, 5, 7]), 6.5);
  assert.equal(lamTronBandTong(6.125), 6);
  assert.equal(lamTronBandTong(6.625), 6.5);
  assert.equal(lamTronBandTong(6.75), 7);
  assert.equal(bandTong([]), null);
  assert.equal(bandTong([5, null, undefined]), 5);
});

test('bảng 4.3 theo thứ tự — hàng 1 thắng mọi hàng sau', () => {
  assert.deepEqual(pick(xepLop({ sangLoc: 9, nghe: 30, doc: 30, viet: 7, noi: 7 })), [1, 1]);     // sàng lọc < 10
  assert.deepEqual(pick(xepLop({ sangLoc: 25, nghe: 7, doc: 6, viet: 6, noi: 6 })), [1, 1]);      // L và R đều < 8
  assert.deepEqual(pick(xepLop({ sangLoc: 25, nghe: 4, doc: 4, viet: 3, noi: 3 })), [1, 1]);      // Overall < 3.5
  assert.deepEqual(pick(xepLop({ sangLoc: 15, nghe: 10, doc: 10, viet: 4, noi: 4 })), [1, 7]);    // 4.0 & SL < 20
  assert.deepEqual(pick(xepLop({ sangLoc: 22, nghe: 10, doc: 10, viet: 4, noi: 4 })), [2, 1]);    // 4.0 & SL ≥ 20
  assert.deepEqual(pick(xepLop({ sangLoc: 22, nghe: 13, doc: 13, viet: 4.5, noi: 4.5 })), [2, 13]); // 4.5
  assert.deepEqual(pick(xepLop({ sangLoc: 22, nghe: 16, doc: 15, viet: 5, noi: 5 })), [3, 1]);    // 5.0
  assert.deepEqual(pick(xepLop({ sangLoc: 22, nghe: 18, doc: 19, viet: 5.5, noi: 5.5 })), [3, 16]); // 5.5
  assert.deepEqual(pick(xepLop({ sangLoc: 22, nghe: 23, doc: 23, viet: 6, noi: 6 })), [4, 1]);    // 6.0
  assert.deepEqual(pick(xepLop({ sangLoc: 22, nghe: 26, doc: 27, viet: 6.5, noi: 6.5 })), [4, 16]); // 6.5
  assert.deepEqual(pick(xepLop({ sangLoc: 28, nghe: 30, doc: 30, viet: 7, noi: 7 })), [5, 1]);    // 7.0
  assert.deepEqual(pick(xepLop({ sangLoc: 28, nghe: 32, doc: 33, viet: 7.5, noi: 7.5 })), [5, 16]); // 7.5
  assert.deepEqual(pick(xepLop({ sangLoc: 30, nghe: 36, doc: 36, viet: 8, noi: 8 })), [5, 8]);    // ≥ 8.0: chỉ luyện đề
});

test('luật kỹ năng lệch: ≥ 1.0 ⇒ đường ôn kèm; ≥ 2.0 ⇒ xếp theo kỹ năng yếu nhất', () => {
  const k = xepLopChiTiet({ sangLoc: 24, nghe: 23, doc: 23, viet: 5, noi: 6 }); // Overall 5.75 → 6.0; viet 5.0 lệch 1.0
  assert.equal(k.overall, 6);
  assert.deepEqual([k.tap, k.ngay], [4, 1]);
  assert.equal(k.theoKyNang, null);
  assert.equal(k.duongOnKem.length, 1);
  assert.match(k.duongOnKem[0], /^Writing — bài Writing của Tập 3/);
  const y = xepLopChiTiet({ sangLoc: 24, nghe: 30, doc: 30, viet: 4.5, noi: 7 }); // 7·7·4.5·7 = 6.375 → 6.5; viet 4.5 lệch 2.0
  assert.equal(y.overall, 6.5);
  assert.equal(y.theoKyNang, 'viet');
  assert.deepEqual([y.tap, y.ngay], [2, 13]);
  assert.ok(y.lyDo.some((s) => /yếu nhất/.test(s)));
  assert.ok(y.lyDo.length >= 2 && y.lyDo.length <= 3);
});

test('"chỉ đẩy lên": vị trí mới thấp hơn thì giữ cũ', () => {
  assert.deepEqual(viTriXaHon({ tap: 3, ngay: 20 }, { tap: 3, ngay: 1 }), { tap: 3, ngay: 20 });
  assert.deepEqual(viTriXaHon({ tap: 3, ngay: 20 }, { tap: 4, ngay: 1 }), { tap: 4, ngay: 1 });
  assert.deepEqual(viTriXaHon({ tap: 3, ngay: 20 }, { tap: 3, ngay: 25 }), { tap: 3, ngay: 25 });
});

test('CHỐT CHỐNG TRÔI: bản máy chủ và bản web cho cùng kết quả trên lưới đầu vào', () => {
  let n = 0;
  for (const sangLoc of [5, 12, 19, 20, 27, 30]) {
    for (const nghe of [undefined, 4, 7, 11, 16, 23, 26, 30, 33, 36]) {
      for (const doc of [undefined, 6, 10, 15, 23, 27, 30, 35]) {
        for (const viet of [undefined, 3, 4.5, 5, 6, 7.5, 8]) {
          for (const noi of [undefined, 4, 5.5, 6.5, 7]) {
            const vao = { sangLoc, nghe, doc, viet, noi };
            assert.deepEqual(xepLopWeb(vao), xepLop(vao), JSON.stringify(vao));
            assert.deepEqual(xepLopChiTietWeb(vao), xepLopChiTiet(vao), JSON.stringify(vao));
            n++;
          }
        }
      }
    }
  }
  assert.ok(n > 10_000);
});

function pick(r: { tap: number; ngay: number }) { return [r.tap, r.ngay]; }
