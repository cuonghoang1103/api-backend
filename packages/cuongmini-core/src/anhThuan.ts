/**
 * ============================================================
 * `nativeImage` BẰNG JAVASCRIPT THUẦN — cho extension VS Code
 * ============================================================
 *
 * Phần agent của app desktop (`desktop/src/main/agent/anh.ts`, `anhLa.ts`)
 * gọi `nativeImage` của Electron. Extension VS Code KHÔNG có Electron cho
 * extension dùng, nên shim `electron` của extension re-export `nativeImage`
 * từ file này. Chỉ làm đúng phần hai file kia dùng:
 *   createFromBuffer · createFromBitmap · createEmpty
 *   isEmpty · getSize · resize · crop · toBitmap/getBitmap · toPNG · toJPEG
 *
 * Giải mã CHỈ PNG + JPEG (pngjs, jpeg-js — thuần JS, esbuild gói thẳng vào
 * dist, không có nhị phân theo nền tảng như `sharp`). Định dạng khác ⇒ ảnh
 * RỖNG, đúng như Electron với HEIC/AVIF/TIFF — `anhLa.ts` thấy rỗng thì tự
 * nhờ hệ điều hành chuyển sang JPEG.
 *
 * ⚠️ BITMAP LÀ **BGRA** (thứ tự byte Electron trả trên máy little-endian).
 * `ghepLenNen` trong anh.ts tô nền theo B,G,R,A; đổi sang RGBA ở đây là nền
 * đỏ thành xanh lam mà không lỗi nào. Nên bên trong cũng lưu BGRA, chỉ đổi
 * kênh ở đúng hai mép: lúc giải mã (pngjs/jpeg-js ra RGBA) và lúc mã hoá.
 *
 * Khác Electron (cố ý hoặc không đáng làm):
 *   • alpha lưu THẲNG (không nhân trước); Electron/Skia lưu nhân trước. Ảnh
 *     đục — gần như mọi ảnh agent đụng tới — giống hệt nhau từng byte.
 *   • không có scaleFactor (luôn 1) — đúng thứ `napAnh` cố tình chọn.
 *   • không quản lý màu (ICC/gAMA bị bỏ qua).
 */
import * as jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

export interface CoAnhNative { width: number; height: number }
export interface TuyChonResize { width?: number; height?: number; quality?: 'good' | 'better' | 'best' | string }
export interface KhungCrop { x: number; y: number; width: number; height: number }

/** Đủ cho ảnh 48MP: đầu ra RGBA 192MB + bộ đệm khối DCT mỗi kênh (~3 × 48MB). */
const TRAN_BO_NHO_JPEG_MB = 1536;
/** Trần điểm ảnh — 100MP như mặc định của jpeg-js; to hơn là ảnh bẫy giải nén. */
const TRAN_MP = 100;

export class NativeImage {
  /** Dùng `nativeImage.create*`; hàm dựng nhận BGRA đã đúng cỡ, không kiểm lại. */
  constructor(
    private readonly diem: Buffer,
    private readonly rong: number,
    private readonly cao: number,
  ) {}

  isEmpty(): boolean {
    return this.rong <= 0 || this.cao <= 0;
  }

  getSize(): CoAnhNative {
    return { width: this.rong, height: this.cao };
  }

  getAspectRatio(): number {
    return this.cao > 0 ? this.rong / this.cao : 1;
  }

  /** Bản SAO, như Electron — sửa buffer trả về không được làm hỏng ảnh. */
  toBitmap(): Buffer {
    return Buffer.from(this.diem);
  }

  getBitmap(): Buffer {
    return this.toBitmap();
  }

  /**
   * Co/giãn. Chỉ một chiều ⇒ chiều kia theo tỉ lệ (làm tròn), như Electron.
   * `quality` nhận cho khớp chữ ký nhưng mọi mức dùng cùng một thuật toán:
   * trung bình vùng khi thu nhỏ, song tuyến khi phóng to.
   */
  resize(o: TuyChonResize = {}): NativeImage {
    if (this.isEmpty()) return taoRong();
    const coW = typeof o.width === 'number' && Number.isFinite(o.width);
    const coH = typeof o.height === 'number' && Number.isFinite(o.height);
    let w = coW ? Math.round(o.width!) : this.rong;
    let h = coH ? Math.round(o.height!) : this.cao;
    if (coW && !coH) h = Math.round(w * this.cao / this.rong);
    else if (coH && !coW) w = Math.round(h * this.rong / this.cao);
    if (w <= 0 || h <= 0) return taoRong();
    if (w === this.rong && h === this.cao) return new NativeImage(Buffer.from(this.diem), w, h);
    return new NativeImage(coAnh(this.diem, this.rong, this.cao, w, h), w, h);
  }

  /** Khung tràn mép hoặc rỗng ⇒ ảnh RỖNG, không ném — `kepKhung` ở anh.ts dựa vào đúng hành vi này. */
  crop(k: KhungCrop): NativeImage {
    const x = Math.trunc(k?.x ?? 0);
    const y = Math.trunc(k?.y ?? 0);
    const w = Math.trunc(k?.width ?? 0);
    const h = Math.trunc(k?.height ?? 0);
    if (this.isEmpty() || !(w > 0 && h > 0) || x < 0 || y < 0 || x + w > this.rong || y + h > this.cao) {
      return taoRong();
    }
    const ra = Buffer.allocUnsafe(w * h * 4);
    for (let hang = 0; hang < h; hang += 1) {
      const tu = ((y + hang) * this.rong + x) * 4;
      this.diem.copy(ra, hang * w * 4, tu, tu + w * 4);
    }
    return new NativeImage(ra, w, h);
  }

  toPNG(): Buffer {
    if (this.isEmpty()) return Buffer.alloc(0);
    // Ảnh đục ghi RGB (colorType 2) thay vì RGBA: nhỏ hơn ~1/4 khi chưa nén,
    // mà `chuanHoaAnh` so byte PNG với trần để quyết giữ PNG hay đổi JPEG.
    const duc = laAnhDuc(this.diem);
    const png = new PNG({ width: this.rong, height: this.cao, colorType: duc ? 2 : 6, inputHasAlpha: true });
    sangRgba(this.diem, png.data, false);
    return PNG.sync.write(png, { colorType: duc ? 2 : 6, inputHasAlpha: true, deflateLevel: 6 });
  }

  /**
   * JPEG không có alpha. Electron mã hoá bitmap ĐÃ NHÂN alpha nên chỗ trong
   * suốt ra ĐEN — làm y vậy để ảnh ra giống app desktop.
   */
  toJPEG(quality: number): Buffer {
    if (this.isEmpty()) return Buffer.alloc(0);
    const q = Math.max(1, Math.min(100, Math.round(Number.isFinite(quality) ? quality : 90)));
    const rgba = Buffer.allocUnsafe(this.diem.length);
    sangRgba(this.diem, rgba, true);
    return jpeg.encode({ data: rgba, width: this.rong, height: this.cao }, q).data;
  }

  toDataURL(): string {
    return `data:image/png;base64,${this.toPNG().toString('base64')}`;
  }
}

function taoRong(): NativeImage {
  return new NativeImage(Buffer.alloc(0), 0, 0);
}

export const nativeImage = {
  createEmpty: taoRong,

  /** PNG/JPEG ⇒ ảnh; mọi thứ khác (kể cả rác, buffer cụt) ⇒ ảnh rỗng, KHÔNG ném. */
  createFromBuffer(buf: Buffer | Uint8Array, _tuyChon?: unknown): NativeImage {
    const kq = giaiMa(buf);
    return kq ? new NativeImage(kq.diem, kq.rong, kq.cao) : taoRong();
  },

  /** `buf` là BGRA đúng `width*height*4` byte; lệch cỡ thì ném như Electron. */
  createFromBitmap(buf: Buffer | Uint8Array, o: { width: number; height: number; scaleFactor?: number }): NativeImage {
    if (!(buf instanceof Uint8Array)) throw new TypeError('buffer must be a node Buffer');
    const w = Math.trunc(o?.width ?? 0);
    const h = Math.trunc(o?.height ?? 0);
    if (!(w > 0 && h > 0)) return taoRong();
    if (buf.byteLength !== w * h * 4) throw new Error('invalid buffer size');
    return new NativeImage(Buffer.from(buf), w, h);
  },
};

/* ---------------- giải mã ---------------- */

function giaiMa(b: unknown): { diem: Buffer; rong: number; cao: number } | null {
  if (!(b instanceof Uint8Array) || b.length < 8) return null;
  const buf = Buffer.isBuffer(b) ? b : Buffer.from(b.buffer, b.byteOffset, b.byteLength);
  try {
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
      // pngjs đưa mọi kiểu (bảng màu, xám, 16-bit, xen kẽ) về RGBA 8-bit.
      const p = PNG.sync.read(buf);
      if (!(p.width > 0 && p.height > 0) || p.width * p.height > TRAN_MP * 1e6) return null;
      return { diem: rgbaSangBgraTaiCho(p.data), rong: p.width, cao: p.height };
    }
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
      // jpeg-js KHÔNG xoay theo EXIF — đúng như nativeImage; anhLa.ts tự xoay theo thẻ.
      const j = jpeg.decode(buf, {
        useTArray: true,
        formatAsRGBA: true,
        tolerantDecoding: true,
        maxResolutionInMP: TRAN_MP,
        maxMemoryUsageInMB: TRAN_BO_NHO_JPEG_MB,
      });
      if (!(j.width > 0 && j.height > 0)) return null;
      const d = Buffer.from(j.data.buffer, j.data.byteOffset, j.data.byteLength);
      return { diem: rgbaSangBgraTaiCho(d), rong: j.width, cao: j.height };
    }
  } catch {
    /* rác / cụt / vượt trần ⇒ rỗng, như Electron */
  }
  return null;
}

function rgbaSangBgraTaiCho(d: Buffer): Buffer {
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i]!;
    d[i] = d[i + 2]!;
    d[i + 2] = r;
  }
  return d;
}

/** BGRA → RGBA vào `ra`. `nenDen` ⇒ trộn alpha lên nền đen (cho JPEG). */
function sangRgba(bgra: Buffer, ra: Buffer, nenDen: boolean): void {
  for (let i = 0; i < bgra.length; i += 4) {
    const a = bgra[i + 3]!;
    if (nenDen && a !== 255) {
      ra[i] = Math.round(bgra[i + 2]! * a / 255);
      ra[i + 1] = Math.round(bgra[i + 1]! * a / 255);
      ra[i + 2] = Math.round(bgra[i]! * a / 255);
      ra[i + 3] = 255;
    } else {
      ra[i] = bgra[i + 2]!;
      ra[i + 1] = bgra[i + 1]!;
      ra[i + 2] = bgra[i]!;
      ra[i + 3] = a;
    }
  }
}

function laAnhDuc(bgra: Buffer): boolean {
  for (let i = 3; i < bgra.length; i += 4) if (bgra[i] !== 255) return false;
  return true;
}

/* ---------------- co/giãn ---------------- */

/**
 * Bảng trọng số cho một trục: điểm ra `i` lấy những điểm nguồn nào, nặng bao nhiêu.
 *
 * Thu nhỏ ⇒ TRUNG BÌNH VÙNG: điểm ra phủ đoạn nguồn [i·ti, (i+1)·ti), mỗi điểm
 * nguồn góp đúng phần diện tích nó nằm trong đoạn. Song tuyến khi thu nhỏ chỉ
 * nhìn 2 điểm/trục và BỎ QUA phần còn lại ⇒ ảnh 4032 → 1568 răng cưa, chữ nhỏ
 * trong ảnh chụp tài liệu vỡ — chính thứ model cần đọc.
 * Phóng to ⇒ song tuyến (căn tâm điểm ảnh, kẹp ở mép).
 */
function bangTrongSo(nguon: number, dich: number): { buoc: number; chiSo: Int32Array; heSo: Float32Array } {
  const ti = nguon / dich;
  const buoc = ti > 1 ? Math.ceil(ti) + 1 : 2;
  const chiSo = new Int32Array(dich * buoc);
  const heSo = new Float32Array(dich * buoc);           // ô thừa giữ hệ số 0 ⇒ vô hại
  for (let i = 0; i < dich; i += 1) {
    const goc = i * buoc;
    if (ti > 1) {
      const dau = i * ti;
      const cuoi = Math.min(nguon, (i + 1) * ti);
      let k = 0;
      for (let j = Math.floor(dau); j < cuoi && k < buoc; j += 1, k += 1) {
        chiSo[goc + k] = j;
        heSo[goc + k] = (Math.min(cuoi, j + 1) - Math.max(dau, j)) / ti;
      }
    } else {
      const tam = (i + 0.5) * ti - 0.5;
      const j0 = Math.floor(tam);
      const t = tam - j0;
      chiSo[goc] = Math.min(nguon - 1, Math.max(0, j0));
      chiSo[goc + 1] = Math.min(nguon - 1, Math.max(0, j0 + 1));
      heSo[goc] = 1 - t;
      heSo[goc + 1] = t;
    }
  }
  return { buoc, chiSo, heSo };
}

/**
 * Co/giãn tách trục: ngang trước (w0×h0 → w1×h0) rồi dọc (→ w1×h1).
 * Trộn trên màu ĐÃ NHÂN alpha: trộn màu thẳng thì điểm trong suốt (thường mang
 * màu rác, hay là đen) lem thành viền tối quanh logo/ảnh chụp màn hình.
 */
function coAnh(src: Buffer, w0: number, h0: number, w1: number, h1: number): Buffer {
  const ngang = bangTrongSo(w0, w1);
  const doc = bangTrongSo(h0, h1);
  const giua = new Float32Array(w1 * h0 * 4);

  for (let y = 0; y < h0; y += 1) {
    const dongNguon = y * w0 * 4;
    let o = y * w1 * 4;
    for (let x = 0; x < w1; x += 1, o += 4) {
      let b = 0; let g = 0; let r = 0; let a = 0;
      const goc = x * ngang.buoc;
      for (let k = 0; k < ngang.buoc; k += 1) {
        const ts = ngang.heSo[goc + k]!;
        if (ts === 0) continue;
        const p = dongNguon + ngang.chiSo[goc + k]! * 4;
        const al = src[p + 3]! * ts;
        b += src[p]! * al;
        g += src[p + 1]! * al;
        r += src[p + 2]! * al;
        a += al;
      }
      giua[o] = b; giua[o + 1] = g; giua[o + 2] = r; giua[o + 3] = a;
    }
  }

  const ra = Buffer.allocUnsafe(w1 * h1 * 4);
  const tong = new Float32Array(w1 * 4);
  const dai = w1 * 4;
  for (let y = 0; y < h1; y += 1) {
    tong.fill(0);
    const goc = y * doc.buoc;
    for (let k = 0; k < doc.buoc; k += 1) {
      const ts = doc.heSo[goc + k]!;
      if (ts === 0) continue;
      const dong = doc.chiSo[goc + k]! * dai;
      for (let i = 0; i < dai; i += 1) tong[i] = tong[i]! + giua[dong + i]! * ts;
    }
    const o = y * dai;
    for (let i = 0; i < dai; i += 4) {
      const a = tong[i + 3]!;
      if (a <= 0.5) {                                     // gần như trong suốt hẳn
        ra[o + i] = 0; ra[o + i + 1] = 0; ra[o + i + 2] = 0; ra[o + i + 3] = 0;
        continue;
      }
      ra[o + i] = kep(tong[i]! / a);
      ra[o + i + 1] = kep(tong[i + 1]! / a);
      ra[o + i + 2] = kep(tong[i + 2]! / a);
      ra[o + i + 3] = kep(a);
    }
  }
  return ra;
}

function kep(v: number): number {
  return v <= 0 ? 0 : v >= 255 ? 255 : Math.round(v);
}
