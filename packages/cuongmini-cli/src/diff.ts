/**
 * DIFF tô màu kiểu Claude Code: số dòng · `+` nền xanh · `−` nền đỏ, chữ bên
 * trong vẫn tô cú pháp theo đuôi file. Dữ liệu là `AgentDiff` lõi đã tính sẵn
 * (cùng bản app hiện trên thẻ duyệt) — CLI không tự diff lại.
 */
import { capMau, catVua, doRong, mau, mo, nen } from './mau';
import { ngonNguTuDuong, toMauCode } from './toMau';

export interface DongDiff { loai: 'giu' | 'them' | 'bo'; soCu: number | null; soMoi: number | null; text: string }
export interface DuLieuDiff { dong: DongDiff[]; soThem: number; soBo: number; quaLon: boolean }

const MAU_DIFF = {
  nenThem: '#12361f',
  nenBo: '#3f1219',
  soThem: '#4ade80',
  soBo: '#f87171',
  dauThem: '#86efac',
  dauBo: '#fca5a5',
};

export interface TuyChonDiff {
  rong: number;
  /** Đường dẫn file — để đoán ngôn ngữ mà tô cú pháp. */
  duong?: string | null;
  /** Tối đa bao nhiêu dòng (phần còn lại gộp thành "… +N dòng"). */
  toiDa?: number;
}

/** `+12 −3` có màu. */
export function demDiff(d: { soThem: number; soBo: number }): string {
  return `${mau(MAU_DIFF.soThem)(`+${d.soThem}`)} ${mau(MAU_DIFF.soBo)(`−${d.soBo}`)}`;
}

export function veDiff(diff: DuLieuDiff | undefined | null, o: TuyChonDiff): string[] {
  if (!diff?.dong?.length) return [];
  const ngonNgu = ngonNguTuDuong(o.duong);
  const toiDa = o.toiDa ?? 80;
  const ds = diff.dong.slice(0, toiDa);
  const soLon = Math.max(1, ...ds.map((d) => d.soMoi ?? d.soCu ?? 0));
  const beSo = String(soLon).length;
  const rongChu = Math.max(8, o.rong - beSo - 3);
  const ra = ds.map((d) => {
    const so = String((d.loai === 'bo' ? d.soCu : d.soMoi) ?? '').padStart(beSo);
    const dau = d.loai === 'them' ? '+' : d.loai === 'bo' ? '-' : ' ';
    const tho = catVua(d.text.replace(/\t/g, '  '), rongChu);
    if (capMau() === 0) return `${so} ${dau} ${tho}`;
    const chu = toMauCode(tho, ngonNgu);
    if (d.loai === 'giu') return `${mo(so)}   ${chu}`;
    const them = d.loai === 'them';
    const dong = `${mau(them ? MAU_DIFF.soThem : MAU_DIFF.soBo)(so)} ${mau(them ? MAU_DIFF.dauThem : MAU_DIFF.dauBo)(dau)} ${chu}`;
    // Tô nền tới hết bề ngang để thấy rõ khối thêm/bớt như trong editor.
    const du = Math.max(0, o.rong - doRong(dong));
    return nen(them ? MAU_DIFF.nenThem : MAU_DIFF.nenBo)(dong + ' '.repeat(du));
  });
  const con = diff.dong.length - ds.length;
  if (con > 0) ra.push(mo(`… +${con} dòng nữa`));
  if (diff.quaLon) ra.push(mo('(diff quá dài — chỉ hiện một phần)'));
  return ra;
}
