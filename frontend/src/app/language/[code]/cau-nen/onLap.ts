/**
 * Ôn lặp ngắt quãng của "1000 câu nền" — hộp Leitner 0…5, HÀM THUẦN.
 *
 * Mỗi câu một thẻ: dịch đúng ⇒ lên một hộp (mỗi NGÀY lên tối đa một hộp — làm đúng 3 lần trong một buổi
 * không có nghĩa là đã nhớ lâu); sai ⇒ về hộp 0, đến hạn ngay hôm sau. Khoảng cách theo hộp:
 * 1 · 3 · 7 · 14 · 30 ngày — đúng nhịp "câu của 1, 3, 7 ngày trước" mà người học được hứa.
 *
 * "Đã thuộc" = hộp ≥ 3: đã dịch đúng ở ít nhất ba ngày cách nhau (≈ 1 tuần sau lần đầu).
 */

export type The = {
  /** Hộp 0–5. */
  h: number;
  /** Ngày đến hạn ôn, YYYY-MM-DD. */
  han: string;
  /** Số lần đúng / sai (cộng dồn). */
  d: number;
  s: number;
  /** Ngày gần nhất được LÊN hộp (chặn lên nhiều hộp trong một ngày). */
  len?: string;
};

export const KHOANG = [1, 1, 3, 7, 14, 30];
export const HOP_THUOC = 3;

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const homNay = (): string => iso(new Date());
export function congNgay(ngay: string, n: number): string {
  const [y, m, d] = ngay.split('-').map(Number);
  const t = new Date(y, m - 1, d);
  t.setDate(t.getDate() + n);
  return iso(t);
}

/** Ghi một lượt trả lời. `hom` = hôm nay (truyền vào để test được). */
export function ghiLuot(cu: The | undefined, dung: boolean, hom: string): The {
  const t: The = cu ? { ...cu } : { h: 0, han: hom, d: 0, s: 0 };
  if (dung) {
    t.d += 1;
    if (t.len !== hom) {
      t.h = Math.min(5, t.h + 1);
      t.len = hom;
      t.han = congNgay(hom, KHOANG[t.h]);
    }
  } else {
    t.s += 1;
    t.h = 0;
    t.len = undefined;
    t.han = congNgay(hom, 1);
  }
  return t;
}

export const daThuoc = (t?: The): boolean => !!t && t.h >= HOP_THUOC;
export const denHan = (t: The | undefined, hom: string): boolean => !!t && t.han <= hom;

/** Gộp bản trên máy với bản trên máy chủ: lấy thẻ có NHIỀU lượt hơn (bằng nhau ⇒ hạn muộn hơn). */
export function gopThe(a?: The, b?: The): The | undefined {
  if (!a) return b;
  if (!b) return a;
  const la = a.d + a.s, lb = b.d + b.s;
  if (la !== lb) return la > lb ? a : b;
  return a.han >= b.han ? a : b;
}

/* ── Nén để gửi máy chủ (ghiChu ≤ 2000 ký tự / ngày) ──
 * Một ngày ~34 thẻ × "07:3,20261205,4,1|" ≈ 25 ký tự ⇒ ~850 ký tự. */
export function nenThe(ds: Record<string, The>): string {
  return Object.entries(ds)
    .map(([so, t]) => `${so}:${t.h},${t.han.replace(/-/g, '')},${t.d},${t.s}${t.len ? `,${t.len.replace(/-/g, '')}` : ''}`)
    .join('|');
}
const raNgay = (x: string) => (/^\d{8}$/.test(x) ? `${x.slice(0, 4)}-${x.slice(4, 6)}-${x.slice(6, 8)}` : '');
export function moThe(chuoi: string): Record<string, The> {
  const out: Record<string, The> = {};
  for (const p of (chuoi || '').split('|')) {
    const [so, v] = p.split(':');
    if (!so || !v) continue;
    const [h, han, d, s, len] = v.split(',');
    const hanIso = raNgay(han);
    if (!hanIso) continue;
    out[so] = { h: Math.max(0, Math.min(5, Number(h) || 0)), han: hanIso, d: Number(d) || 0, s: Number(s) || 0, ...(len && raNgay(len) ? { len: raNgay(len) } : {}) };
  }
  return out;
}

/** Xáo trộn có hạt giống (cùng ngày ⇒ cùng thứ tự, tải lại trang không đảo lung tung). */
export function xao<T>(arr: T[], hat: number): T[] {
  const a = [...arr];
  let x = hat || 1;
  for (let i = a.length - 1; i > 0; i--) {
    x = (x * 1103515245 + 12345) % 2147483648;
    const j = x % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export const hatTu = (s: string): number => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 2147483647, 7);
