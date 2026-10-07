/**
 * Chấm đề phòng thi máy tính — HÀM THUẦN, kiểm bằng `cham.test.ts` (chạy trong `npm test` ở gốc repo).
 *
 * Chấm như đề thật:
 *  - Dạng gõ chữ: chính tả phải đúng; VƯỢT giới hạn số từ là SAI (kể cả khi có
 *    chứa đáp án) — "ONE WORD ONLY" mà viết "the forest" là mất điểm thật.
 *    Chỉ tha: hoa/thường, khoảng trắng thừa, dấu câu ở hai đầu, dấu phẩy
 *    hàng nghìn ("1,500" = "1500").
 *  - Chọn hai đáp án (mcq2): mỗi lựa chọn đúng được một điểm, không phụ thuộc thứ tự.
 */
import type { DapAn, DangCau, GioiHan, Nhom, DeDoc, DeNghe } from './de/types';
import { DANG_GO } from './de/types';

export function chuanHoa(s: string): string {
  return s
    .normalize('NFC')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .toLowerCase()
    .replace(/(\d),(\d{3})\b/g, '$1$2')
    .replace(/[£$€]\s*(?=\d)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[\s.,;:!?"'()]+|[\s.,;:!?"'()]+$/g, '');
}

/** Số "từ" theo cách đề thật đếm: tách theo khoảng trắng; từ nối gạch (well-known) là một từ; số là "số". */
export function demTu(s: string): { tu: number; so: number } {
  const ds = chuanHoa(s).split(' ').filter(Boolean);
  let so = 0, tu = 0, truocLaSo = false;
  for (const x of ds) {
    const laSo = /^\d[\d.,:/%]*(st|nd|rd|th|am|pm|km|m|kg|cm)?$/.test(x);
    // Các nhóm chữ số liền nhau ("07945 812 663") là MỘT số (số điện thoại, mã bưu chính).
    if (laSo) { if (!truocLaSo) so++; } else tu++;
    truocLaSo = laSo;
  }
  return { tu, so };
}

/** Câu trả lời có vượt giới hạn số từ không. */
export function vuotGioiHan(traLoi: string, gh?: GioiHan): boolean {
  if (!gh || !traLoi.trim()) return false;
  const { tu, so } = demTu(traLoi);
  if (gh.chiSo) return tu > 0 || so > 1;
  if (gh.so) return tu > gh.tu || so > 1;
  return tu + so > gh.tu;
}

export function dungCauGo(traLoi: string, da: DapAn, gh?: GioiHan): boolean {
  const t = chuanHoa(traLoi);
  if (!t) return false;
  if (vuotGioiHan(traLoi, gh)) return false;
  return da.a.some((x) => chuanHoa(x) === t);
}

export function dungCauChon(traLoi: string, da: DapAn): boolean {
  const t = traLoi.trim().toUpperCase();
  return !!t && da.a.some((x) => x.trim().toUpperCase() === t);
}

/** Danh sách mọi câu của một đề: số câu → nhóm chứa nó. */
export function cauTheoSo(nhomDs: Nhom[]): Map<number, Nhom> {
  const m = new Map<number, Nhom>();
  for (const g of nhomDs) for (let n = g.tu; n <= g.den; n++) m.set(n, g);
  return m;
}

export type KetQuaCau = { n: number; dung: boolean; traLoi: string; dapAn: string; dang: DangCau; nhomId: string };

/**
 * Chấm các câu trong `nhomDs` (một đề hoặc vài phần luyện lẻ).
 * `ans[n]` là câu trả lời; với mcq2, `ans[n]` của từng câu là MỘT chữ cái đã chọn.
 */
export function chamNhom(nhomDs: Nhom[], dapAn: Record<number, DapAn>, ans: Record<number, string>): KetQuaCau[] {
  const ra: KetQuaCau[] = [];
  for (const g of nhomDs) {
    if (g.dang === 'mcq2' && g.nhieu) {
      // Đáp án đúng của cả cặp = hợp các đáp án khai ở từng câu (thường cùng một tập).
      const dung = new Set(g.nhieu.ns.flatMap((n) => dapAn[n]?.a ?? []).map((x) => x.toUpperCase()));
      const daDung = new Set<string>();
      const chon = g.nhieu.ns.map((n) => (ans[n] ?? '').trim().toUpperCase());
      const conLai = [...dung];
      g.nhieu.ns.forEach((n, i) => {
        const c = chon[i];
        const ok = !!c && dung.has(c) && !daDung.has(c);
        if (ok) daDung.add(c);
        ra.push({ n, dung: ok, traLoi: chon[i], dapAn: '', dang: g.dang, nhomId: g.id });
      });
      // Gán "đáp án" hiển thị: câu đúng hiện chính chữ đó, câu sai hiện chữ đúng còn lại.
      const thua = conLai.filter((x) => !daDung.has(x));
      for (const r of ra.filter((x) => x.nhomId === g.id)) r.dapAn = r.dung ? r.traLoi : (thua.shift() ?? conLai.join(' / '));
      continue;
    }
    for (let n = g.tu; n <= g.den; n++) {
      const da = dapAn[n];
      if (!da) continue;
      const t = ans[n] ?? '';
      const ok = DANG_GO.has(g.dang) ? dungCauGo(t, da, g.gioiHan) : dungCauChon(t, da);
      ra.push({ n, dung: ok, traLoi: t, dapAn: da.a[0], dang: g.dang, nhomId: g.id });
    }
  }
  return ra.sort((a, b) => a.n - b.n);
}

export function nhomCuaDe(de: DeDoc | DeNghe, chiPhan?: number[]): Nhom[] {
  const ps = (de.phan as { so: number; nhom: Nhom[] }[]).filter((p) => !chiPhan || chiPhan.includes(p.so));
  return ps.flatMap((p) => p.nhom);
}

/* ── Quy đổi band (bảng phổ biến, thang 40 câu) — ƯỚC TÍNH ─────────── */
const BANG_DOC: [number, number][] = [[39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5]];
const BANG_NGHE: [number, number][] = [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [11, 4], [8, 3.5], [6, 3], [4, 2.5]];
export function bandTuDiem(dung: number, kyNang: 'doc' | 'nghe'): number {
  for (const [nguong, b] of kyNang === 'doc' ? BANG_DOC : BANG_NGHE) if (dung >= nguong) return b;
  return dung > 0 ? 2 : 0;
}

/* ── Gợi ý LÝ DO sai cho Sổ lỗi (người học sửa lại được) ───────────── */
function khoangCach(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)] as number[]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[a.length][b.length];
}

export function doanLyDo(kq: KetQuaCau, da: DapAn | undefined, gh: GioiHan | undefined, kyNang: 'doc' | 'nghe'): string | null {
  const t = chuanHoa(kq.traLoi);
  if (!t) return 'het-gio';
  if (DANG_GO.has(kq.dang)) {
    if (vuotGioiHan(kq.traLoi, gh)) return 'so-tu';
    const gan = (da?.a ?? []).map((x) => chuanHoa(x));
    if (gan.some((x) => x.replace(/s$/, '') === t.replace(/s$/, ''))) return 'ngu-phap';
    if (gan.some((x) => x.length > 3 && khoangCach(x, t) <= 2)) return 'chinh-ta';
    return kyNang === 'nghe' ? 'nghe-sot' : 'paraphrase';
  }
  if ((kq.dang === 'tfng' || kq.dang === 'ynng') && (/NOT GIVEN/i.test(kq.dapAn) || /NOT GIVEN/i.test(kq.traLoi))) return 'ng-false';
  if (kq.dang === 'tfng' || kq.dang === 'ynng' || kq.dang === 'mcq' || kq.dang === 'mcq2' || kq.dang === 'heading') return kyNang === 'nghe' ? 'nghe-sot' : 'paraphrase';
  return null;
}

/** Thời gian dạng 00:59:58. */
export function dinhDangGio(giay: number): string {
  const g = Math.max(0, Math.floor(giay));
  const h = Math.floor(g / 3600), m = Math.floor((g % 3600) / 60), s = g % 60;
  return [h, m, s].map((x) => String(x).padStart(2, '0')).join(':');
}
