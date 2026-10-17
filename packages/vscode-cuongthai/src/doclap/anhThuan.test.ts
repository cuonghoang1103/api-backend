/**
 * `nativeImage` thuần JS (anhThuan.ts).
 *
 * Chạy từ gốc repo:
 *   npx tsx --test packages/vscode-cuongthai/src/doclap/anhThuan.test.ts
 *
 * Phép kiểm cuối chạy THẬT `chuanHoaAnh` của app desktop (`desktop/src/main/
 * agent/anhLa.ts`) với `electron` được đổi sang chính file này — tức đúng cách
 * extension gói nó — để bắt chỗ hai bên hiểu khác nhau về BGRA/hướng xoay.
 */
import assert from 'node:assert/strict';
import Module from 'node:module';
import path from 'node:path';
import { describe, it } from 'node:test';
import * as jpeg from 'jpeg-js';
import { PNG } from 'pngjs';
import { nativeImage } from './anhThuan';

/** PNG RGBA từ danh sách điểm [r,g,b,a] theo hàng. */
function taoPng(w: number, h: number, diem: [number, number, number, number][]): Buffer {
  const p = new PNG({ width: w, height: h });
  diem.forEach((d, i) => p.data.set(d, i * 4));
  return PNG.sync.write(p);
}

/** JPEG một màu, kích thước tuỳ ý (qua jpeg-js, RGBA). */
function taoJpeg(w: number, h: number, mau: (x: number, y: number) => [number, number, number]): Buffer {
  const d = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) {
    const [r, g, b] = mau(x, y);
    d.set([r, g, b, 255], (y * w + x) * 4);
  }
  return jpeg.encode({ data: d, width: w, height: h }, 90).data;
}

/** Chèn khối APP1 "Exif" chứa đúng thẻ hướng 0x0112 ngay sau SOI. */
function ganHuongExif(jpg: Buffer, huong: number): Buffer {
  const tiff = Buffer.from([
    0x4d, 0x4d, 0x00, 0x2a, 0, 0, 0, 8,               // "MM", 42, IFD ở byte 8
    0x00, 0x01,                                       // 1 mục
    0x01, 0x12, 0x00, 0x03, 0, 0, 0, 1, 0x00, huong, 0, 0, // Orientation SHORT ×1
    0, 0, 0, 0,                                       // hết IFD
  ]);
  const than = Buffer.concat([Buffer.from('Exif\0\0', 'latin1'), tiff]);
  const dau = Buffer.from([0xff, 0xe1, (than.length + 2) >> 8, (than.length + 2) & 0xff]);
  return Buffer.concat([jpg.subarray(0, 2), dau, than, jpg.subarray(2)]);
}

describe('giải mã', () => {
  it('PNG đúng kích thước', () => {
    const anh = nativeImage.createFromBuffer(taoPng(3, 2, Array(6).fill([1, 2, 3, 255])));
    assert.equal(anh.isEmpty(), false);
    assert.deepEqual(anh.getSize(), { width: 3, height: 2 });
  });

  it('JPEG đúng kích thước', () => {
    const anh = nativeImage.createFromBuffer(taoJpeg(40, 25, () => [200, 100, 50]));
    assert.deepEqual(anh.getSize(), { width: 40, height: 25 });
  });

  it('JPEG có thẻ EXIF xoay KHÔNG bị tự xoay (giống nativeImage)', () => {
    const anh = nativeImage.createFromBuffer(ganHuongExif(taoJpeg(40, 20, () => [0, 0, 0]), 6));
    assert.deepEqual(anh.getSize(), { width: 40, height: 20 });
  });

  it('toBitmap là BGRA: PNG 2×1 đỏ | lam', () => {
    const anh = nativeImage.createFromBuffer(taoPng(2, 1, [[255, 0, 0, 255], [0, 0, 255, 255]]));
    // Đỏ ⇒ B=0 G=0 R=255; lam ⇒ B=255 G=0 R=0.
    assert.deepEqual([...anh.toBitmap()], [0, 0, 255, 255, 255, 0, 0, 255]);
    assert.deepEqual([...anh.getBitmap()], [...anh.toBitmap()]);
  });

  it('rác / cụt / GIF / không phải Buffer ⇒ ảnh rỗng, không ném', () => {
    const png = taoPng(4, 4, Array(16).fill([9, 9, 9, 255]));
    const jpg = taoJpeg(16, 16, () => [9, 9, 9]);
    const ca: unknown[] = [
      Buffer.from('không phải ảnh, chỉ là chữ'),
      Buffer.alloc(0),
      png.subarray(0, 30),
      jpg.subarray(0, 40),
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0, 1, 2, 3]),
      Buffer.from('GIF89a\x01\x00\x01\x00\x00\x00\x00;', 'latin1'),
      'chuỗi',
      null,
    ];
    for (const b of ca) {
      const anh = nativeImage.createFromBuffer(b as Buffer);
      assert.equal(anh.isEmpty(), true);
      assert.deepEqual(anh.getSize(), { width: 0, height: 0 });
      assert.equal(anh.toPNG().length, 0);
      assert.equal(anh.toJPEG(80).length, 0);
      assert.equal(anh.toBitmap().length, 0);
    }
  });
});

describe('createFromBitmap / mã hoá', () => {
  it('khứ hồi createFromBitmap → toPNG → createFromBuffer giữ nguyên từng byte', () => {
    const bgra = Buffer.from([
      10, 20, 30, 255, 40, 50, 60, 128,
      70, 80, 90, 0, 1, 2, 3, 255,
      200, 150, 100, 255, 0, 0, 0, 255,
    ]);
    const anh = nativeImage.createFromBitmap(bgra, { width: 2, height: 3 });
    const lai = nativeImage.createFromBuffer(anh.toPNG());
    assert.deepEqual(lai.getSize(), { width: 2, height: 3 });
    assert.deepEqual([...lai.toBitmap()], [...bgra]);
  });

  it('ảnh đục cũng khứ hồi đúng (đường ghi PNG RGB)', () => {
    const bgra = Buffer.alloc(5 * 4 * 4);
    for (let i = 0; i < bgra.length; i += 4) bgra.set([i % 256, (i * 3) % 256, (i * 7) % 256, 255], i);
    const lai = nativeImage.createFromBuffer(nativeImage.createFromBitmap(bgra, { width: 5, height: 4 }).toPNG());
    assert.deepEqual([...lai.toBitmap()], [...bgra]);
  });

  it('createFromBitmap lệch cỡ buffer thì ném, cạnh 0 thì rỗng', () => {
    assert.throws(() => nativeImage.createFromBitmap(Buffer.alloc(7), { width: 1, height: 2 }), /invalid buffer size/);
    assert.equal(nativeImage.createFromBitmap(Buffer.alloc(0), { width: 0, height: 5 }).isEmpty(), true);
  });

  it('toBitmap trả bản sao — sửa nó không làm hỏng ảnh', () => {
    const anh = nativeImage.createFromBitmap(Buffer.from([1, 2, 3, 255]), { width: 1, height: 1 });
    anh.toBitmap().fill(0);
    assert.deepEqual([...anh.toBitmap()], [1, 2, 3, 255]);
  });

  it('JPEG chất lượng thấp nhỏ hơn chất lượng cao', () => {
    const anh = nativeImage.createFromBuffer(
      taoJpeg(160, 120, (x, y) => [(x * 7 + y * 3) % 256, (x * x + y) % 256, (y * 11) % 256]),
    );
    const thap = anh.toJPEG(20);
    const cao = anh.toJPEG(95);
    assert.ok(thap.length < cao.length, `${thap.length} phải < ${cao.length}`);
    assert.deepEqual(nativeImage.createFromBuffer(thap).getSize(), { width: 160, height: 120 });
  });

  it('toJPEG giữ đúng màu (không đảo kênh)', () => {
    const do_ = nativeImage.createFromBitmap(Buffer.alloc(16 * 16 * 4).fill(Buffer.from([0, 0, 255, 255])), { width: 16, height: 16 });
    const lai = nativeImage.createFromBuffer(do_.toJPEG(95)).toBitmap();
    assert.ok(lai[2]! > 240 && lai[0]! < 15 && lai[1]! < 15, `điểm đầu ${[...lai.subarray(0, 4)]}`);
  });
});

describe('resize / crop', () => {
  const nen = nativeImage.createFromBitmap(Buffer.alloc(400 * 300 * 4, 255), { width: 400, height: 300 });

  it('chỉ một chiều ⇒ chiều kia theo tỉ lệ', () => {
    assert.deepEqual(nen.resize({ width: 200 }).getSize(), { width: 200, height: 150 });
    assert.deepEqual(nen.resize({ height: 100, quality: 'best' }).getSize(), { width: 133, height: 100 });
    assert.deepEqual(nen.resize({ width: 1000 }).getSize(), { width: 1000, height: 750 });
    assert.deepEqual(nen.resize({ width: 120, height: 40 }).getSize(), { width: 120, height: 40 });
    assert.equal(nen.resize({ width: 0 }).isEmpty(), true);
  });

  it('thu nhỏ = trung bình vùng: bàn cờ đen/trắng 1px ⇒ xám đều', () => {
    const w = 64; const d = Buffer.alloc(w * w * 4);
    for (let y = 0; y < w; y += 1) for (let x = 0; x < w; x += 1) {
      const v = (x + y) % 2 ? 255 : 0;
      d.set([v, v, v, 255], (y * w + x) * 4);
    }
    const nho = nativeImage.createFromBitmap(d, { width: w, height: w }).resize({ width: 16 }).toBitmap();
    for (let i = 0; i < nho.length; i += 4) {
      assert.ok(Math.abs(nho[i]! - 128) <= 1, `điểm ${i / 4} = ${nho[i]}`);
      assert.equal(nho[i + 3], 255);
    }
  });

  it('thu nhỏ không lem màu của điểm trong suốt (trộn trên màu đã nhân alpha)', () => {
    // 2×1: đỏ đục | XANH LAM trong suốt hẳn. Trộn màu thẳng sẽ ra tím.
    const anh = nativeImage.createFromBitmap(Buffer.from([0, 0, 255, 255, 255, 0, 0, 0]), { width: 2, height: 1 });
    const [b, g, r, a] = anh.resize({ width: 1 }).toBitmap();
    assert.deepEqual([b, g, r], [0, 0, 255]);
    assert.ok(Math.abs(a! - 128) <= 1);
  });

  it('crop đúng vùng; khung tràn mép ⇒ rỗng như Electron', () => {
    const d = Buffer.alloc(4 * 3 * 4);
    for (let i = 0; i < 12; i += 1) d.set([i, i, i, 255], i * 4);   // 4×3, giá trị = chỉ số điểm
    const anh = nativeImage.createFromBitmap(d, { width: 4, height: 3 });
    const cat = anh.crop({ x: 1, y: 1, width: 2, height: 2 });
    assert.deepEqual(cat.getSize(), { width: 2, height: 2 });
    assert.deepEqual([...cat.toBitmap()].filter((_, i) => i % 4 === 0), [5, 6, 9, 10]);
    assert.equal(anh.crop({ x: 3, y: 0, width: 2, height: 1 }).isEmpty(), true);
    assert.equal(anh.crop({ x: -1, y: 0, width: 2, height: 1 }).isEmpty(), true);
    assert.equal(anh.crop({ x: 0, y: 0, width: 0, height: 1 }).isEmpty(), true);
    assert.deepEqual(anh.crop({ x: 0, y: 0, width: 4, height: 3 }).getSize(), { width: 4, height: 3 });
  });

  it('ảnh 4032×3024 thu về 1568 trong < 1,5 s', () => {
    const w = 4032; const h = 3024;
    const d = Buffer.allocUnsafe(w * h * 4);
    for (let i = 0; i < d.length; i += 4) { d[i] = i & 255; d[i + 1] = (i >> 8) & 255; d[i + 2] = (i >> 16) & 255; d[i + 3] = 255; }
    const anh = nativeImage.createFromBitmap(d, { width: w, height: h });
    const t = performance.now();
    const nho = anh.resize({ width: 1568, height: 1176, quality: 'best' });
    const ms = performance.now() - t;
    console.log(`  thu nhỏ 4032×3024 → 1568×1176: ${ms.toFixed(0)} ms`);
    assert.deepEqual(nho.getSize(), { width: 1568, height: 1176 });
    assert.ok(ms < 1500, `${ms.toFixed(0)} ms`);
  });
});

describe('chuanHoaAnh THẬT của app desktop, electron = anhThuan', () => {
  // Đổi `require('electron')` sang chính file này — đúng như esbuild alias của
  // extension. anhLa.ts dưới tsx nạp theo CommonJS (desktop/ không khai "type").
  const goc = (Module as unknown as { _resolveFilename: (...a: unknown[]) => string })._resolveFilename;
  const thay = path.join(__dirname, 'anhThuan.ts');
  (Module as unknown as { _resolveFilename: (...a: unknown[]) => string })._resolveFilename = function (yeuCau: unknown, ...con: unknown[]) {
    return yeuCau === 'electron' ? thay : goc.call(this, yeuCau, ...con);
  };
  const duongAnhLa = path.resolve(__dirname, '../../../../desktop/src/main/agent/anhLa.ts');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const napAnhLa = () => require(duongAnhLa) as typeof import('../../../../desktop/src/main/agent/anhLa');

  it('PNG nhỏ đứng thẳng đi NGUYÊN BYTE', async () => {
    const { chuanHoaAnh } = napAnhLa();
    const png = taoPng(2, 2, Array(4).fill([1, 2, 3, 255]));
    const kq = await chuanHoaAnh(png);
    assert.equal(kq.daDoi, false);
    assert.equal(kq.data, png);
    assert.equal(kq.media, 'image/png');
  });

  it('JPEG to nằm ngang + EXIF 6 ⇒ thu nhỏ + xoay đứng, màu đúng chỗ', async () => {
    const { chuanHoaAnh } = napAnhLa();
    // Lưu nằm ngang 2000×1000: nửa trái ĐỎ, nửa phải LAM. Hướng 6 = xoay 90°
    // chiều kim đồng hồ ⇒ ảnh đứng: nửa trái lên TRÊN.
    const jpg = ganHuongExif(taoJpeg(2000, 1000, (x) => (x < 1000 ? [255, 0, 0] : [0, 0, 255])), 6);
    const kq = await chuanHoaAnh(jpg);
    assert.equal(kq.daDoi, true);
    assert.equal(kq.media, 'image/jpeg');
    assert.deepEqual([kq.rong, kq.cao], [784, 1568]);
    const ra = nativeImage.createFromBuffer(kq.data);
    assert.deepEqual(ra.getSize(), { width: 784, height: 1568 });
    const bm = ra.toBitmap();
    const diem = (x: number, y: number) => [...bm.subarray((y * 784 + x) * 4, (y * 784 + x) * 4 + 3)];
    const [b1, , r1] = diem(392, 200);                 // phần trên ⇒ đỏ
    const [b2, , r2] = diem(392, 1368);                // phần dưới ⇒ lam
    assert.ok(r1! > 200 && b1! < 60, `trên = ${diem(392, 200)}`);
    assert.ok(b2! > 200 && r2! < 60, `dưới = ${diem(392, 1368)}`);
  });

  it('PNG to giữ PNG sau khi thu nhỏ', async () => {
    const { chuanHoaAnh } = napAnhLa();
    const w = 2400; const h = 600;
    const d = Buffer.alloc(w * h * 4, 255);
    const png = nativeImage.createFromBitmap(d, { width: w, height: h }).toPNG();
    const kq = await chuanHoaAnh(png);
    assert.equal(kq.media, 'image/png');
    assert.deepEqual([kq.rong, kq.cao], [1568, 392]);
  });
});
