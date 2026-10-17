/**
 * Ô NHẬP nhiều dòng — phần THUẦN: con trỏ, xoá từ, nhảy dòng, xuống dòng.
 * Tách khỏi React để kiểm bằng test (gõ phím giả ⇒ so chuỗi + vị trí).
 *
 * `contro` đếm theo đơn vị UTF-16 của JS nhưng luôn đứng ở ranh giới KÝ TỰ
 * (không tách đôi cặp surrogate của emoji, không tách dấu tiếng Việt tổ hợp).
 */
export interface ONhap { text: string; contro: number }

export const rong = (): ONhap => ({ text: '', contro: 0 });

const kyTu = (s: string): string[] => [...new Intl.Segmenter('vi', { granularity: 'grapheme' }).segment(s)].map((x) => x.segment);

function luiMotKyTu(s: string, i: number): number {
  if (i <= 0) return 0;
  const truoc = kyTu(s.slice(0, i));
  return i - (truoc[truoc.length - 1]?.length ?? 1);
}
function toiMotKyTu(s: string, i: number): number {
  if (i >= s.length) return s.length;
  return i + (kyTu(s.slice(i))[0]?.length ?? 1);
}

export function chen(o: ONhap, chu: string): ONhap {
  // Dán từ clipboard: `\r\n` / `\r` ⇒ `\n`; tab ⇒ 2 dấu cách (tab làm lệch con trỏ).
  const sach = chu.replace(/\r\n?/g, '\n').replace(/\t/g, '  ');
  return { text: o.text.slice(0, o.contro) + sach + o.text.slice(o.contro), contro: o.contro + sach.length };
}

export function xoaLui(o: ONhap): ONhap {
  if (o.contro === 0) return o;
  const moi = luiMotKyTu(o.text, o.contro);
  return { text: o.text.slice(0, moi) + o.text.slice(o.contro), contro: moi };
}

export function xoaToi(o: ONhap): ONhap {
  if (o.contro >= o.text.length) return o;
  const het = toiMotKyTu(o.text, o.contro);
  return { text: o.text.slice(0, o.contro) + o.text.slice(het), contro: o.contro };
}

export const sangTrai = (o: ONhap): ONhap => ({ ...o, contro: luiMotKyTu(o.text, o.contro) });
export const sangPhai = (o: ONhap): ONhap => ({ ...o, contro: toiMotKyTu(o.text, o.contro) });

/** Đầu/cuối DÒNG hiện tại (ctrl+a / ctrl+e, Home/End). */
export function dauDong(o: ONhap): ONhap {
  return { ...o, contro: o.text.lastIndexOf('\n', o.contro - 1) + 1 };
}
export function cuoiDong(o: ONhap): ONhap {
  const i = o.text.indexOf('\n', o.contro);
  return { ...o, contro: i < 0 ? o.text.length : i };
}

/** ctrl+w / alt+backspace: xoá một từ trước con trỏ. */
export function xoaTu(o: ONhap): ONhap {
  const truoc = o.text.slice(0, o.contro);
  const cat = /\S*\s*$/.exec(truoc)?.[0].length || 1;
  const moi = Math.max(0, o.contro - cat);
  return { text: o.text.slice(0, moi) + o.text.slice(o.contro), contro: moi };
}

/** alt+← / alt+→: nhảy theo từ. */
export function tuTrai(o: ONhap): ONhap {
  const m = /\S*\s*$/.exec(o.text.slice(0, o.contro));
  return { ...o, contro: o.contro - (m?.[0].length || Math.min(1, o.contro)) };
}
export function tuPhai(o: ONhap): ONhap {
  const m = /^\s*\S*/.exec(o.text.slice(o.contro));
  return { ...o, contro: o.contro + (m?.[0].length || 0) };
}

/** ctrl+u: xoá từ đầu dòng tới con trỏ. ctrl+k: xoá từ con trỏ tới cuối dòng. */
export function xoaVeDau(o: ONhap): ONhap {
  const d = dauDong(o).contro;
  if (d === o.contro && d > 0) return { text: o.text.slice(0, d - 1) + o.text.slice(d), contro: d - 1 };
  return { text: o.text.slice(0, d) + o.text.slice(o.contro), contro: d };
}
export function xoaVeCuoi(o: ONhap): ONhap {
  const c = cuoiDong(o).contro;
  if (c === o.contro && c < o.text.length) return { text: o.text.slice(0, c) + o.text.slice(c + 1), contro: c };
  return { text: o.text.slice(0, o.contro) + o.text.slice(c), contro: o.contro };
}

/** Dòng/cột của con trỏ. */
export function viTri(o: ONhap): { dong: number; cot: number; soDong: number } {
  const truoc = o.text.slice(0, o.contro);
  const dong = truoc.split('\n').length - 1;
  return { dong, cot: o.contro - (truoc.lastIndexOf('\n') + 1), soDong: o.text.split('\n').length };
}

/** ↑/↓ trong ô nhiều dòng. `null` = đã ở dòng đầu/cuối (để ô nhập chuyển sang lịch sử). */
export function lenDong(o: ONhap): ONhap | null {
  const { dong, cot } = viTri(o);
  if (dong === 0) return null;
  const ds = o.text.split('\n');
  const dau = ds.slice(0, dong - 1).reduce((a, d) => a + d.length + 1, 0);
  return { ...o, contro: dau + Math.min(cot, ds[dong - 1]!.length) };
}
export function xuongDong(o: ONhap): ONhap | null {
  const { dong, cot, soDong } = viTri(o);
  if (dong >= soDong - 1) return null;
  const ds = o.text.split('\n');
  const dau = ds.slice(0, dong + 1).reduce((a, d) => a + d.length + 1, 0);
  return { ...o, contro: dau + Math.min(cot, ds[dong + 1]!.length) };
}

/**
 * Enter: `\` ngay trước con trỏ ⇒ đổi thành xuống dòng (kiểu shell), trả
 * `{ guiDi: false }`. Còn lại ⇒ gửi.
 */
export function enter(o: ONhap): { o: ONhap; guiDi: boolean } {
  if (o.contro > 0 && o.text[o.contro - 1] === '\\') {
    return { o: { text: `${o.text.slice(0, o.contro - 1)}\n${o.text.slice(o.contro)}`, contro: o.contro }, guiDi: false };
  }
  return { o, guiDi: true };
}

/** Thay đoạn [dau, contro) bằng `chu` (chọn gợi ý `/` hoặc `@`). */
export function thayDoan(o: ONhap, dau: number, chu: string): ONhap {
  return { text: o.text.slice(0, dau) + chu + o.text.slice(o.contro), contro: dau + chu.length };
}

// ─── Lịch sử câu đã gửi ──────────────────────────────────────────

export class LichSu {
  private viTri = -1;
  private nhap = '';
  constructor(public ds: string[] = [], private tran = 500) {}

  them(t: string): void {
    const s = t.trim();
    if (!s) return;
    if (this.ds[this.ds.length - 1] !== s) this.ds.push(s);
    if (this.ds.length > this.tran) this.ds.splice(0, this.ds.length - this.tran);
    this.datLai();
  }

  datLai(): void { this.viTri = -1; this.nhap = ''; }

  /** Đang lật lịch sử (đã bấm ↑) — lúc đó ↓ là "câu mới hơn", không phải "vào bảng agent phụ". */
  dangDuyet(): boolean { return this.viTri !== -1; }

  /** ↑: câu cũ hơn. `hienTai` = chữ đang gõ dở (giữ lại để ↓ về được). */
  truoc(hienTai: string): string | null {
    if (!this.ds.length) return null;
    if (this.viTri === -1) { this.nhap = hienTai; this.viTri = this.ds.length; }
    if (this.viTri === 0) return null;
    this.viTri -= 1;
    return this.ds[this.viTri]!;
  }

  /** ↓: câu mới hơn; qua câu mới nhất ⇒ trả lại chữ đang gõ dở. */
  sau(): string | null {
    if (this.viTri === -1) return null;
    this.viTri += 1;
    if (this.viTri >= this.ds.length) { const t = this.nhap; this.datLai(); return t; }
    return this.ds[this.viTri]!;
  }
}

/** File lịch sử: mỗi câu một "dòng" — xuống dòng bên trong mã hoá thành `\n` chữ. */
export const maHoaDong = (s: string): string => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
export const giaiMaDong = (s: string): string => s.replace(/\\(\\|n)/g, (_, c: string) => (c === 'n' ? '\n' : '\\'));
