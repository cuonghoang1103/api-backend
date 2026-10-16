/**
 * Nhận dạng ảnh "lạ" + dựng đứng theo EXIF (16/10/2026).
 *
 * Ca thật: ảnh iPhone của người dùng là HEIC, điểm ảnh lưu NẰM NGANG 4032×3024
 * kèm thẻ hướng 6 — ảnh thật là ảnh DỌC. Thiếu bước xoay thì model đọc một
 * trang đề bài nằm nghiêng.
 */
import { describe, expect, it } from 'vitest';
import { docHuongExif, nhanDangAnh, xoayTheoExif } from './dinhDangAnh';

const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));

/** Hộp `ftyp` tối giản: [cỡ][ftyp][thương hiệu chính][phiên bản][tương thích…]. */
function ftyp(chinh: string, ...tuongThich: string[]): Uint8Array {
  const co = 16 + 4 * tuongThich.length;
  return new Uint8Array([0, 0, 0, co, ...ascii('ftyp'), ...ascii(chinh), 0, 0, 0, 0, ...tuongThich.flatMap(ascii), 0, 0, 0, 0]);
}

/** JPEG tối giản chỉ có SOI + APP1 Exif mang thẻ hướng `h` (little-endian hoặc big-endian). */
function jpegCoHuong(h: number, le = true): Uint8Array {
  const u16 = (n: number) => (le ? [n & 0xff, n >> 8] : [n >> 8, n & 0xff]);
  const u32 = (n: number) => (le ? [n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, n >>> 24] : [n >>> 24, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]);
  const tiff = [
    ...ascii(le ? 'II' : 'MM'), ...u16(42), ...u32(8),
    ...u16(1),                                          // 1 mục trong IFD0
    ...u16(0x0112), ...u16(3), ...u32(1), ...u16(h), 0, 0,
    ...u32(0),
  ];
  const app1 = [...ascii('Exif'), 0, 0, ...tiff];
  const dai = app1.length + 2;
  return new Uint8Array([0xff, 0xd8, 0xff, 0xe1, dai >> 8, dai & 0xff, ...app1, 0xff, 0xda, 0, 2]);
}

describe('nhanDangAnh', () => {
  it('HEIC iPhone (heic + mif1)', () => {
    expect(nhanDangAnh(ftyp('heic', 'mif1', 'heic'))).toBe('heic');
  });
  it('mif1 + avif ⇒ AVIF chứ KHÔNG phải HEIC (thương hiệu chung)', () => {
    expect(nhanDangAnh(ftyp('mif1', 'avif', 'mif1'))).toBe('avif');
    expect(nhanDangAnh(ftyp('avif', 'mif1'))).toBe('avif');
  });
  it('ĐỐI CHỨNG: MP4 cũng là ISO-BMFF nhưng không phải ảnh', () => {
    expect(nhanDangAnh(ftyp('isom', 'mp41'))).toBeNull();
  });
  it('các chữ ký còn lại', () => {
    const dem = (dau: number[]) => new Uint8Array([...dau, ...Array(16).fill(0)]);
    expect(nhanDangAnh(dem([0x89, ...ascii('PNG')]))).toBe('png');
    expect(nhanDangAnh(dem([0xff, 0xd8, 0xff]))).toBe('jpeg');
    expect(nhanDangAnh(dem(ascii('GIF89a')))).toBe('gif');
    expect(nhanDangAnh(dem([...ascii('RIFF'), 0, 0, 0, 0, ...ascii('WEBP')]))).toBe('webp');
    expect(nhanDangAnh(dem([...ascii('II*'), 0]))).toBe('tiff');
    expect(nhanDangAnh(dem([...ascii('MM'), 0, 42]))).toBe('tiff');
    expect(nhanDangAnh(dem(ascii('8BPS')))).toBe('psd');
    expect(nhanDangAnh(dem(ascii('BM')))).toBe('bmp');
    expect(nhanDangAnh(dem([0, 0, 1, 0]))).toBe('ico');
    expect(nhanDangAnh(dem(ascii('%PDF-1.7')))).toBeNull();
  });
});

describe('docHuongExif', () => {
  it('đọc được cả hai thứ tự byte', () => {
    expect(docHuongExif(jpegCoHuong(6, true))).toBe(6);
    expect(docHuongExif(jpegCoHuong(8, false))).toBe(8);
  });
  it('không có EXIF / không phải JPEG / giá trị lạ ⇒ 1', () => {
    expect(docHuongExif(new Uint8Array([0xff, 0xd8, 0xff, 0xda, 0, 2]))).toBe(1);
    expect(docHuongExif(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))).toBe(1);
    expect(docHuongExif(jpegCoHuong(42))).toBe(1);
  });
  it('khối cụt không làm vỡ', () => {
    expect(docHuongExif(jpegCoHuong(6).subarray(0, 20))).toBe(1);
  });
});

describe('xoayTheoExif', () => {
  /* Ảnh 3×2, mỗi điểm mang số thứ tự của nó:
       0 1 2
       3 4 5          */
  const goc = () => new Uint8Array(new Uint32Array([0, 1, 2, 3, 4, 5]).buffer);
  const doc = (r: { diem: Uint8Array; w: number; h: number }) => ({
    w: r.w, h: r.h, o: [...new Uint32Array(new Uint8Array(r.diem).buffer)],
  });

  it('6 = xoay 90° chiều kim đồng hồ (ảnh dọc iPhone)', () => {
    expect(doc(xoayTheoExif(goc(), 3, 2, 6))).toEqual({ w: 2, h: 3, o: [3, 0, 4, 1, 5, 2] });
  });
  it('8 = xoay 90° ngược chiều', () => {
    expect(doc(xoayTheoExif(goc(), 3, 2, 8))).toEqual({ w: 2, h: 3, o: [2, 5, 1, 4, 0, 3] });
  });
  it('3 = xoay 180°', () => {
    expect(doc(xoayTheoExif(goc(), 3, 2, 3))).toEqual({ w: 3, h: 2, o: [5, 4, 3, 2, 1, 0] });
  });
  it('2/4/5/7 lật và chuyển vị', () => {
    expect(doc(xoayTheoExif(goc(), 3, 2, 2)).o).toEqual([2, 1, 0, 5, 4, 3]);
    expect(doc(xoayTheoExif(goc(), 3, 2, 4)).o).toEqual([3, 4, 5, 0, 1, 2]);
    expect(doc(xoayTheoExif(goc(), 3, 2, 5)).o).toEqual([0, 3, 1, 4, 2, 5]);
    expect(doc(xoayTheoExif(goc(), 3, 2, 7)).o).toEqual([5, 2, 4, 1, 3, 0]);
  });
  it('1 / giá trị lạ ⇒ trả nguyên', () => {
    const g = goc();
    expect(xoayTheoExif(g, 3, 2, 1).diem).toBe(g);
  });
});
