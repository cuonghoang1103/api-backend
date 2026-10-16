/**
 * Nhận dạng ảnh + đọc thẻ xoay EXIF — THUẦN, chạy được ở cả main lẫn renderer
 * (chỉ dùng `Uint8Array`/`DataView`, không `Buffer`). Main dùng trong
 * `agent/anhLa.ts`; renderer dùng khi đính kèm ảnh (`chat/anhChoAI.ts`).
 * Một nguồn duy nhất để hai phía không phán khác nhau về cùng một tấm ảnh.
 */

export type LoaiAnh = 'png' | 'jpeg' | 'gif' | 'webp' | 'heic' | 'avif' | 'tiff' | 'bmp' | 'ico' | 'psd';

/** Bốn loại cổng model nhận thẳng. */
export const LOAI_CONG_NHAN: ReadonlySet<LoaiAnh> = new Set<LoaiAnh>(['png', 'jpeg', 'gif', 'webp']);

/** Đuôi file ảnh "lạ" mà app tự chuyển đổi. */
export const DUOI_ANH_LA: ReadonlySet<string> = new Set([
  '.heic', '.heif', '.hif', '.avif', '.tif', '.tiff', '.bmp', '.dib', '.ico', '.psd',
]);

function chu(b: Uint8Array, tu: number, den: number): string {
  let s = '';
  for (let i = tu; i < den && i < b.length; i += 1) s += String.fromCharCode(b[i]!);
  return s;
}

/**
 * Nhận dạng theo BYTE ĐẦU, không theo đuôi: ảnh dán từ clipboard không có
 * tên, và `File.type` của HEIC trên Chromium thường RỖNG.
 */
export function nhanDangAnh(b: Uint8Array): LoaiAnh | null {
  if (b.length < 12) return null;
  if (b[0] === 0x89 && chu(b, 1, 4) === 'PNG') return 'png';
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpeg';
  if (chu(b, 0, 4) === 'GIF8') return 'gif';
  if (chu(b, 0, 4) === 'RIFF' && chu(b, 8, 12) === 'WEBP') return 'webp';
  if (chu(b, 0, 4) === 'II*\0' || chu(b, 0, 4) === 'MM\0*') return 'tiff';
  if (chu(b, 0, 4) === '8BPS') return 'psd';
  if (b[0] === 0x42 && b[1] === 0x4d) return 'bmp';
  if (b[0] === 0 && b[1] === 0 && b[2] === 1 && b[3] === 0) return 'ico';
  if (chu(b, 4, 8) === 'ftyp') {
    /* ISO-BMFF: thương hiệu chính ở byte 8–12, byte 12–16 là số phiên bản,
       các thương hiệu tương thích nối sau tới hết hộp `ftyp`. `mif1` dùng
       chung cho cả HEIC lẫn AVIF, nên tìm `avif` TRƯỚC khi kết luận HEIC. */
    const coHop = new DataView(b.buffer, b.byteOffset, b.byteLength).getUint32(0);
    const het = Math.min(b.length, coHop || 32, 256);
    const nhan: string[] = [];
    for (let i = 8; i + 4 <= het; i += 4) if (i !== 12) nhan.push(chu(b, i, i + 4));
    if (nhan.some((n) => n === 'avif' || n === 'avis')) return 'avif';
    if (nhan.some((n) => ['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'hevm', 'hevs', 'mif1', 'msf1'].includes(n))) return 'heic';
  }
  return null;
}

/**
 * Thẻ hướng EXIF (0x0112) của một JPEG, 1–8. Không có thẻ ⇒ 1 (đứng thẳng).
 * Chỉ đọc khối APP1 "Exif" — đủ cho ảnh điện thoại và ảnh `sips` xuất ra.
 */
export function docHuongExif(b: Uint8Array): number {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return 1;
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  let i = 2;
  while (i + 4 <= b.length && b[i] === 0xff) {
    const ma = b[i + 1]!;
    if (ma === 0xda || ma === 0xd9) break;              // tới dữ liệu ảnh / hết ảnh
    const dai = v.getUint16(i + 2);
    if (ma === 0xe1 && chu(b, i + 4, i + 10) === 'Exif\0\0') {
      const t = i + 10;                                   // đầu khối TIFF
      if (t + 8 > b.length) return 1;
      const le = chu(b, t, t + 2) === 'II';
      const ifd = t + v.getUint32(t + 4, le);
      if (ifd + 2 > b.length) return 1;
      const so = v.getUint16(ifd, le);
      for (let k = 0; k < so; k += 1) {
        const o = ifd + 2 + k * 12;
        if (o + 12 > b.length) return 1;
        if (v.getUint16(o, le) === 0x0112) {
          const h = v.getUint16(o + 8, le);
          return h >= 1 && h <= 8 ? h : 1;
        }
      }
      return 1;
    }
    i += 2 + dai;
  }
  return 1;
}

/**
 * Xoay/lật điểm ảnh 32-bit theo thẻ hướng EXIF 1–8, cho ra ảnh ĐỨNG THẲNG.
 *
 * Ánh xạ điểm (x, y) của ảnh gốc w×h sang ảnh ra:
 *   2 lật ngang · 3 xoay 180° · 4 lật dọc · 5 chuyển vị
 *   6 xoay 90° chiều kim đồng hồ · 7 chuyển vị ngược · 8 xoay 90° ngược chiều
 */
export function xoayTheoExif(
  diem: Uint8Array, w: number, h: number, huong: number,
): { diem: Uint8Array; w: number; h: number } {
  if (huong <= 1 || huong > 8) return { diem, w, h };
  const doi = huong >= 5;                                 // 5–8 đổi chỗ rộng/cao
  const W = doi ? h : w;
  const H = doi ? w : h;
  // Chép sang mảng mới để chắc chắn căn lề 4 byte cho Uint32Array.
  const vao = new Uint32Array(new Uint8Array(diem).buffer, 0, w * h);
  const ra = new Uint32Array(W * H);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      let X: number; let Y: number;
      switch (huong) {
        case 2: X = w - 1 - x; Y = y; break;
        case 3: X = w - 1 - x; Y = h - 1 - y; break;
        case 4: X = x; Y = h - 1 - y; break;
        case 5: X = y; Y = x; break;
        case 6: X = h - 1 - y; Y = x; break;
        case 7: X = h - 1 - y; Y = w - 1 - x; break;
        default: X = y; Y = w - 1 - x; break;             // 8
      }
      ra[Y * W + X] = vao[y * w + x]!;
    }
  }
  return { diem: new Uint8Array(ra.buffer), w: W, h: H };
}
