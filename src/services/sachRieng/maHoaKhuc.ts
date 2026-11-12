/**
 * "SR2" — mã hoá CHIA KHÚC cho tệp lớn cần tua (video/audio tài liệu riêng IELTS, 12/11/2026).
 * ─────────────────────────────────────────────────────────────────────────
 * SR1 (maHoa.ts) là MỘT khối AES-256-GCM: muốn đọc byte thứ 300 triệu phải tải + giải mã cả tệp, và tag
 * chỉ kiểm được ở cuối. Video vài trăm MB mà trình duyệt tua bằng `Range` thì cần đọc được một KHOẢNG.
 *
 * Khuôn tệp (mọi số nguyên big-endian):
 *
 *   ┌ đầu 28 byte ───────────────────────────────────────────────────────────┐
 *   │ "SR2" (3) · phiên bản = 1 (1) · cỡ khúc (u32) · kích thước gốc (u64) · iv gốc (12) │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *   khúc 0: bản mã (cỡ khúc byte) · tag (16)
 *   khúc 1: …
 *   khúc n-1: bản mã (phần còn lại, 0 < … ≤ cỡ khúc; tệp rỗng ⇒ 0 byte) · tag (16)
 *
 *   số khúc n = max(1, ceil(kích thước gốc / cỡ khúc))
 *   vị trí khúc i trong tệp mã hoá = 28 + i·(cỡ khúc + 16)
 *   iv khúc i = iv gốc với 8 byte cuối CỘNG i (mod 2^64)       — không bao giờ lặp iv dưới cùng một khoá
 *   AAD khúc i = 28 byte đầu ‖ u32(i)                            — đổi đầu (kích thước, cỡ khúc, iv) hoặc
 *                                                                  tráo thứ tự khúc ⇒ lỗi xác thực
 *
 * Mỗi khúc tự xác thực ⇒ đọc khoảng [a, b] chỉ cần tải các khúc phủ khoảng đó (GetObject có Range) rồi giải
 * mã từng khúc. Mã hoá dạng stream (`taoLuongMaHoaSR2`) nên tệp vài trăm MB không nạp hết vào RAM.
 */
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { Transform, type TransformCallback } from 'node:stream';

export const DAU_SR2 = Buffer.from('SR2');
export const PHIEN_BAN_SR2 = 1;
export const CO_DAU_SR2 = 28;
export const TAG = 16;
export const CO_KHUC_MAC_DINH = 1024 * 1024; // 1 MiB

export type DauSR2 = {
  coKhuc: number;
  kichThuoc: number;
  iv: Buffer;
  soKhuc: number;
  /** 28 byte đầu nguyên văn — dùng làm AAD. */
  tho: Buffer;
};

export const soKhucCua = (kichThuoc: number, coKhuc: number) => Math.max(1, Math.ceil(kichThuoc / coKhuc));

/** Kích thước tệp SR2 cho một tệp gốc `kichThuoc` byte (để đặt Content-Length khi PUT dạng luồng). */
export const kichThuocSR2 = (kichThuoc: number, coKhuc = CO_KHUC_MAC_DINH) => CO_DAU_SR2 + kichThuoc + soKhucCua(kichThuoc, coKhuc) * TAG;

function kiemCoKhuc(coKhuc: number) {
  if (!Number.isInteger(coKhuc) || coKhuc < 16 || coKhuc > 64 * 1024 * 1024) throw new Error(`Cỡ khúc SR2 không hợp lệ: ${coKhuc}`);
}

export function taoDau(kichThuoc: number, coKhuc = CO_KHUC_MAC_DINH, iv = randomBytes(12)): DauSR2 {
  kiemCoKhuc(coKhuc);
  if (!Number.isSafeInteger(kichThuoc) || kichThuoc < 0) throw new Error(`Kích thước gốc không hợp lệ: ${kichThuoc}`);
  const tho = Buffer.alloc(CO_DAU_SR2);
  DAU_SR2.copy(tho, 0);
  tho.writeUInt8(PHIEN_BAN_SR2, 3);
  tho.writeUInt32BE(coKhuc, 4);
  tho.writeBigUInt64BE(BigInt(kichThuoc), 8);
  iv.copy(tho, 16);
  return { coKhuc, kichThuoc, iv: Buffer.from(iv), soKhuc: soKhucCua(kichThuoc, coKhuc), tho };
}

export function docDauSR2(b: Buffer): DauSR2 {
  if (b.length < CO_DAU_SR2 || !b.subarray(0, 3).equals(DAU_SR2)) throw new Error('Tệp không phải khuôn SR2');
  if (b.readUInt8(3) !== PHIEN_BAN_SR2) throw new Error(`SR2 phiên bản lạ: ${b.readUInt8(3)}`);
  const coKhuc = b.readUInt32BE(4);
  kiemCoKhuc(coKhuc);
  const k = b.readBigUInt64BE(8);
  if (k > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('SR2: kích thước gốc quá lớn');
  const kichThuoc = Number(k);
  const tho = Buffer.from(b.subarray(0, CO_DAU_SR2));
  return { coKhuc, kichThuoc, iv: Buffer.from(tho.subarray(16, 28)), soKhuc: soKhucCua(kichThuoc, coKhuc), tho };
}

function ivKhuc(iv: Buffer, i: number): Buffer {
  const r = Buffer.from(iv);
  r.writeBigUInt64BE((r.readBigUInt64BE(4) + BigInt(i)) & 0xffff_ffff_ffff_ffffn, 4);
  return r;
}
function aad(dau: DauSR2, i: number): Buffer {
  const so = Buffer.alloc(4);
  so.writeUInt32BE(i, 0);
  return Buffer.concat([dau.tho, so]);
}
/** Số byte BẢN RÕ của khúc i. */
export const coBanRoKhuc = (dau: DauSR2, i: number) => (i < dau.soKhuc - 1 ? dau.coKhuc : dau.kichThuoc - (dau.soKhuc - 1) * dau.coKhuc);
/** Vị trí (byte) khúc i trong tệp SR2. */
export const viTriKhuc = (dau: DauSR2, i: number) => CO_DAU_SR2 + i * (dau.coKhuc + TAG);

function maHoaKhuc(khoa: Buffer, dau: DauSR2, i: number, ro: Buffer): Buffer {
  const c = createCipheriv('aes-256-gcm', khoa, ivKhuc(dau.iv, i));
  c.setAAD(aad(dau, i));
  return Buffer.concat([c.update(ro), c.final(), c.getAuthTag()]);
}

/** Giải mã MỘT khúc (bản mã + tag liền nhau). Sai khoá / sửa byte / tráo khúc ⇒ ném lỗi. */
export function giaiMaKhuc(khoa: Buffer, dau: DauSR2, i: number, goi: Buffer): Buffer {
  if (i < 0 || i >= dau.soKhuc) throw new Error(`SR2: khúc ${i} ngoài phạm vi`);
  const can = coBanRoKhuc(dau, i) + TAG;
  if (goi.length !== can) throw new Error(`SR2: khúc ${i} dài ${goi.length}, cần ${can}`);
  const d = createDecipheriv('aes-256-gcm', khoa, ivKhuc(dau.iv, i));
  d.setAAD(aad(dau, i));
  d.setAuthTag(goi.subarray(goi.length - TAG));
  return Buffer.concat([d.update(goi.subarray(0, goi.length - TAG)), d.final()]);
}

/** Mã hoá cả một Buffer (tệp nhỏ, test). Tệp lớn dùng `taoLuongMaHoaSR2`. */
export function maHoaSR2(du: Buffer, khoa: Buffer, coKhuc = CO_KHUC_MAC_DINH): Buffer {
  const dau = taoDau(du.length, coKhuc);
  const ra: Buffer[] = [dau.tho];
  for (let i = 0; i < dau.soKhuc; i++) ra.push(maHoaKhuc(khoa, dau, i, du.subarray(i * coKhuc, i * coKhuc + coBanRoKhuc(dau, i))));
  return Buffer.concat(ra);
}

/**
 * Luồng mã hoá: ghi bản rõ vào, đọc SR2 ra. PHẢI biết trước kích thước gốc (nó nằm trong đầu tệp, đi trước dữ
 * liệu) — luồng ném lỗi nếu số byte thật khác số đã khai. Bộ nhớ ~ 1 khúc.
 */
export function taoLuongMaHoaSR2(khoa: Buffer, kichThuoc: number, coKhuc = CO_KHUC_MAC_DINH): Transform {
  const dau = taoDau(kichThuoc, coKhuc);
  let doi: Buffer[] = [];
  let doiDai = 0;
  let i = 0;
  let daGhiDau = false;
  let tong = 0;
  const xa = (t: Transform, ro: Buffer) => { t.push(maHoaKhuc(khoa, dau, i, ro)); i++; };
  return new Transform({
    transform(chunk: Buffer, _enc, cb: TransformCallback) {
      try {
        if (!daGhiDau) { this.push(dau.tho); daGhiDau = true; }
        tong += chunk.length;
        if (tong > kichThuoc) throw new Error(`SR2: dữ liệu vào dài hơn kích thước đã khai (${kichThuoc})`);
        doi.push(chunk);
        doiDai += chunk.length;
        if (doiDai >= coKhuc) {
          let gop = Buffer.concat(doi, doiDai);
          let o = 0;
          while (gop.length - o >= coKhuc && i < dau.soKhuc - 1) { xa(this, gop.subarray(o, o + coKhuc)); o += coKhuc; }
          gop = gop.subarray(o);
          doi = gop.length ? [Buffer.from(gop)] : [];
          doiDai = gop.length;
        }
        cb();
      } catch (e) { cb(e as Error); }
    },
    flush(cb: TransformCallback) {
      try {
        if (!daGhiDau) { this.push(dau.tho); daGhiDau = true; }
        if (tong !== kichThuoc) throw new Error(`SR2: dữ liệu vào dài ${tong}, đã khai ${kichThuoc}`);
        const con = Buffer.concat(doi, doiDai);
        if (i !== dau.soKhuc - 1 || con.length !== coBanRoKhuc(dau, i)) throw new Error('SR2: lệch số khúc khi kết thúc');
        xa(this, con);
        cb();
      } catch (e) { cb(e as Error); }
    },
  });
}

/** Khoảng byte trong tệp SR2 cần tải để có bản rõ [a, b] (đã kẹp vào tệp), + khúc đầu/cuối. */
export function khoangCanTai(dau: DauSR2, a: number, b: number) {
  const ka = Math.floor(a / dau.coKhuc);
  const kb = Math.floor(b / dau.coKhuc);
  return { ka, kb, tu: viTriKhuc(dau, ka), den: viTriKhuc(dau, kb) + coBanRoKhuc(dau, kb) + TAG - 1 };
}

export type DocByte = (tu: number, den: number) => Promise<Buffer>;

/**
 * Đọc bản rõ [a, b] (gồm cả hai đầu). `b` bị kẹp vào cuối tệp VÀ vào `toiDaKhuc` khúc tính từ khúc chứa `a`
 * (trình duyệt xin `bytes=0-` thì trả tối đa toiDaKhuc MiB, nó tự xin tiếp). Trả về khoảng thật đã đọc.
 * `docByte(tu, den)` tải nguyên văn byte [tu, den] của tệp SR2 (vd GetObject có Range).
 */
export async function docKhoangSR2(
  khoa: Buffer, dau: DauSR2, a: number, b: number, docByte: DocByte, toiDaKhuc = Number.POSITIVE_INFINITY,
): Promise<{ a: number; b: number; du: Buffer }> {
  if (dau.kichThuoc === 0 || a < 0 || a >= dau.kichThuoc || b < a) throw new RangeError('Khoảng ngoài tệp');
  let cuoi = Math.min(b, dau.kichThuoc - 1);
  const ka = Math.floor(a / dau.coKhuc);
  if (Number.isFinite(toiDaKhuc)) cuoi = Math.min(cuoi, (ka + Math.max(1, toiDaKhuc)) * dau.coKhuc - 1);
  const k = khoangCanTai(dau, a, cuoi);
  const goi = await docByte(k.tu, k.den);
  if (goi.length !== k.den - k.tu + 1) throw new Error(`SR2: tải được ${goi.length} byte, cần ${k.den - k.tu + 1}`);
  const ro: Buffer[] = [];
  let o = 0;
  for (let i = k.ka; i <= k.kb; i++) {
    const dai = coBanRoKhuc(dau, i) + TAG;
    ro.push(giaiMaKhuc(khoa, dau, i, goi.subarray(o, o + dai)));
    o += dai;
  }
  const tat = Buffer.concat(ro);
  const dauKhuc = k.ka * dau.coKhuc;
  return { a, b: cuoi, du: tat.subarray(a - dauKhuc, cuoi - dauKhuc + 1) };
}

/** Giải mã cả tệp SR2 trong bộ nhớ (test / tệp nhỏ). */
export function giaiMaSR2(goi: Buffer, khoa: Buffer): Buffer {
  const dau = docDauSR2(goi);
  if (goi.length !== kichThuocSR2(dau.kichThuoc, dau.coKhuc)) throw new Error('SR2: độ dài tệp sai');
  const ra: Buffer[] = [];
  for (let i = 0; i < dau.soKhuc; i++) {
    const tu = viTriKhuc(dau, i);
    ra.push(giaiMaKhuc(khoa, dau, i, goi.subarray(tu, tu + coBanRoKhuc(dau, i) + TAG)));
  }
  return Buffer.concat(ra);
}

/**
 * Phân tích header `Range` của trình duyệt cho tệp `kichThuoc` byte. Chỉ nhận MỘT khoảng (`bytes=a-b`, `a-`, `-n`).
 * null = không có / không hiểu (⇒ trả cả tệp); 'ngoai' = 416.
 */
export function phanTichRange(h: string | undefined, kichThuoc: number): { a: number; b: number } | null | 'ngoai' {
  const m = /^bytes=(\d*)-(\d*)$/.exec(String(h ?? '').trim());
  if (!m || (!m[1] && !m[2])) return null;
  if (!m[1]) {
    const n = Number(m[2]);
    if (n === 0 || kichThuoc === 0) return 'ngoai';
    return { a: Math.max(0, kichThuoc - n), b: kichThuoc - 1 };
  }
  const a = Number(m[1]);
  const b = m[2] ? Math.min(Number(m[2]), kichThuoc - 1) : kichThuoc - 1;
  if (a >= kichThuoc || b < a) return 'ngoai';
  return { a, b };
}
