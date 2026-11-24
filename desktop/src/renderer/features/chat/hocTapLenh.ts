/**
 * `/hoc` — Học tập & Lịch cá nhân (24/11/2026). DÙNG CHUNG cho CuongMini CLI + app desktop (như `ctworkLenh.ts`): đọc
 * tham số thành yêu cầu cho lõi (`agent:ctworkHe` viec `hocTap` ⇒ MCP `hoc_tap`), in kết quả.
 *
 *   /hoc                      hôm nay (lớp · giờ tự học · việc cá nhân · việc học quá hạn · tỷ lệ trượt)
 *   /hoc tuan                 7 ngày tới theo giờ
 *   /hoc them "Ôn kana" mai 20:00 45     thêm việc cá nhân (ngày: mai | 26/11 | 2026-11-26; giờ: 20:00 | 20h | 20h30; phút: 45 | 45p)
 *   /hoc xong C5 · /hoc bo-xong C5       đánh dấu việc CÁ NHÂN xong / chưa xong
 *   /hoc bat-dau H12          bấm giờ một việc HỌC (việc học xong = nộp bằng chứng trên web, không tự tích)
 *   /hoc sua C5 21:00 · /hoc sua C5 "tên mới" · /hoc sua C5 khong-gio
 *   /hoc ds [26/11] [30/11]   liệt kê việc cá nhân
 */
import type { GiaoDienCtw } from './ctworkLenh';

export type HanhDongHoc = 'today' | 'week' | 'list_personal' | 'start' | 'add' | 'edit' | 'done' | 'undone';
export interface YeuCauHoc { action: HanhDongHoc; id?: string; title?: string; date?: string; time?: string; minutes?: number; note?: string; from?: string; to?: string }

const VN = 7 * 3_600_000;
const homNayVN = (now: number) => new Date(now + VN).toISOString().slice(0, 10);
const congNgay = (ymd: string, n: number) => new Date(Date.parse(`${ymd}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

/** Tách tham số, giữ cụm trong ngoặc kép ("…" hoặc “…”). */
export function tachThamSo(s: string): string[] {
  const ra: string[] = [];
  const re = /"([^"]*)"|“([^”]*)”|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) ra.push(m[1] ?? m[2] ?? m[3]!);
  return ra;
}

/** mai | nay | hom-nay | ngay-kia | 26/11 | 26/11/2026 | 2026-11-26 ⇒ YYYY-MM-DD (giờ VN). Không phải ngày ⇒ null. */
export function docNgayChu(t: string, now = Date.now()): string | null {
  const hn = homNayVN(now);
  const x = t.toLowerCase();
  if (x === 'nay' || x === 'hom-nay' || x === 'homnay' || x === 'today') return hn;
  if (x === 'mai' || x === 'tomorrow') return congNgay(hn, 1);
  if (x === 'ngay-kia' || x === 'kia') return congNgay(hn, 2);
  let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (m) return t;
  m = /^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/.exec(t);
  if (!m) return null;
  const nam = Number(m[3] ?? hn.slice(0, 4));
  const ymd = `${nam}-${m[2]!.padStart(2, '0')}-${m[1]!.padStart(2, '0')}`;
  const d = new Date(`${ymd}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== ymd) return null;
  // Không ghi năm mà ngày đã qua hơn 2 tháng ⇒ hiểu là năm sau (gõ "05/01" vào tháng 11).
  if (!m[3] && ymd < congNgay(hn, -60)) return `${nam + 1}${ymd.slice(4)}`;
  return ymd;
}

/** 20:00 | 7:05 | 20h | 20h30 | 20g ⇒ 'HH:MM'. Không phải giờ ⇒ null. */
export function docGioChu(t: string): string | null {
  const m = /^(\d{1,2})(?::|h|g)(\d{2})?$/i.exec(t) ?? /^(\d{1,2})[hg]$/i.exec(t);
  if (!m) return null;
  const h = Number(m[1]), p = Number(m[2] ?? 0);
  if (h > 23 || p > 59) return null;
  return `${String(h).padStart(2, '0')}:${String(p).padStart(2, '0')}`;
}

/** 45 | 45p | 45ph | 45' | 45′ — chỉ phút (5–600). `coDonVi`: có hậu tố phút (không thể là một phần tên). */
function docPhut(t: string): { phut: number; coDonVi: boolean } | null {
  const m = /^(\d{1,3})(p|ph|phut|m|min|'|′)?$/i.exec(t);
  if (!m) return null;
  const n = Number(m[1]);
  return n >= 5 && n <= 600 ? { phut: n, coDonVi: !!m[2] } : null;
}

const maViec = (t: string | undefined) => (t && /^[HhCc]?\d{1,10}$/.test(t) ? t.toUpperCase() : undefined);

/** Đọc phần đuôi (tên / ngày / giờ / phút) — chữ không phải ngày/giờ/phút ghép thành tên. */
function docDuoi(ds: string[], now: number): { title?: string; date?: string; time?: string; minutes?: number; khongGio?: boolean } {
  const ten: string[] = [];
  const o: { title?: string; date?: string; time?: string; minutes?: number; khongGio?: boolean } = {};
  /** Phía sau chỉ còn ngày/giờ/khong-gio ⇒ số trơn ở đây là thời lượng ("Ôn kana 45 20:00"), không thì là chữ của tên ("Học 30 từ"). */
  const chiConMoc = (i: number) => ds.slice(i + 1).every((x) => x === 'khong-gio' || x === 'ca-ngay' || docNgayChu(x, now) || docGioChu(x));
  ds.forEach((t, i) => {
    if (t === 'khong-gio' || t === 'ca-ngay') { o.khongGio = true; return; }
    const ngay = !o.date ? docNgayChu(t, now) : null;
    if (ngay) { o.date = ngay; return; }
    const gio = !o.time ? docGioChu(t) : null;
    if (gio) { o.time = gio; return; }
    const p = o.minutes === undefined && ten.length ? docPhut(t) : null;
    if (p && (p.coDonVi || chiConMoc(i))) { o.minutes = p.phut; return; }
    ten.push(t);
  });
  if (ten.length) o.title = ten.join(' ').trim();
  return o;
}

/** `/hoc …` ⇒ yêu cầu cho lõi, hoặc `{ troGiup: true }`, hoặc lỗi cú pháp. THUẦN. */
export function docLenhHoc(thamSo: string, now = Date.now()): YeuCauHoc | { troGiup: true } | { loi: string } {
  const [lenh = '', ...con] = tachThamSo(thamSo.trim());
  switch (lenh.toLowerCase()) {
    case '': case 'hom-nay': case 'homnay': case 'nay': case 'today': return { action: 'today' };
    case 'tuan': case 'week': case '7': return { action: 'week' };
    case 'help': case 'tro-giup': case '?': return { troGiup: true };
    case 'ds': case 'list': {
      const tu = con[0] ? docNgayChu(con[0], now) : null;
      const den = con[1] ? docNgayChu(con[1], now) : null;
      if ((con[0] && !tu) || (con[1] && !den)) return { loi: 'Ngày không hiểu được — dùng `26/11`, `mai` hoặc `2026-11-26`.' };
      return { action: 'list_personal', ...(tu ? { from: tu } : {}), ...(den ? { to: den } : {}) };
    }
    case 'bat-dau': case 'start': {
      const id = maViec(con[0]);
      return id ? { action: 'start', id } : { loi: 'Cần mã việc học: `/hoc bat-dau H12`.' };
    }
    case 'xong': case 'done': case 'bo-xong': case 'chua-xong': case 'undone': {
      const id = maViec(con[0]);
      if (!id) return { loi: `Cần mã việc cá nhân: \`/hoc ${lenh} C5\`.` };
      return { action: /^(bo-xong|chua-xong|undone)$/.test(lenh) ? 'undone' : 'done', id };
    }
    case 'them': case 'add': case '+': {
      const o = docDuoi(con, now);
      if (!o.title) return { loi: 'Cần tên việc: `/hoc them "Ôn kana" mai 20:00 45`.' };
      return { action: 'add', title: o.title, ...(o.date ? { date: o.date } : {}), ...(o.time ? { time: o.time } : {}), ...(o.minutes ? { minutes: o.minutes } : {}) };
    }
    case 'sua': case 'edit': {
      const id = maViec(con[0]);
      if (!id) return { loi: 'Cần mã việc cá nhân: `/hoc sua C5 21:00`.' };
      const o = docDuoi(con.slice(1), now);
      const y: YeuCauHoc = { action: 'edit', id, ...(o.title ? { title: o.title } : {}), ...(o.date ? { date: o.date } : {}), ...(o.minutes ? { minutes: o.minutes } : {}) };
      if (o.khongGio) y.time = ''; else if (o.time) y.time = o.time;
      if (Object.keys(y).length === 2) return { loi: 'Không có gì để sửa — thêm tên mới, ngày, giờ, phút hoặc `khong-gio`.' };
      return y;
    }
    default: {
      // "/hoc Ôn kana 20:00" — không có lệnh con mà có giờ/ngày ⇒ hiểu là thêm.
      const o = docDuoi([lenh, ...con], now);
      if (o.title && (o.time || o.date)) return { action: 'add', title: o.title, ...(o.date ? { date: o.date } : {}), ...(o.time ? { time: o.time } : {}), ...(o.minutes ? { minutes: o.minutes } : {}) };
      return { troGiup: true };
    }
  }
}

export function troGiupHoc(ngonNgu: 'vi' | 'en'): string {
  return ngonNgu === 'en'
    ? ['**/hoc — study plan & personal schedule** (CT Work → Study & schedule, private)', '',
      '- `/hoc` — today · `/hoc tuan` — next 7 days by hour',
      '- `/hoc them "Review kana" mai 20:00 45` — add a personal task (date: mai | 26/11 | 2026-11-26 · time 20:00 | 20h · minutes)',
      '- `/hoc xong C5` · `/hoc bo-xong C5` — tick a personal task',
      '- `/hoc bat-dau H12` — start a study task (study tasks are graded from evidence on the web, never ticked)',
      '- `/hoc sua C5 21:00` · `/hoc sua C5 khong-gio` · `/hoc ds 26/11 30/11`', '',
      'You can also just ask: "what do I study today?"'].join('\n')
    : ['**/hoc — Học tập & Lịch cá nhân** (CT Work → Học tập & Lịch, chỉ bạn thấy)', '',
      '- `/hoc` — hôm nay · `/hoc tuan` — 7 ngày tới theo giờ',
      '- `/hoc them "Ôn kana" mai 20:00 45` — thêm việc cá nhân (ngày: mai | 26/11 | 2026-11-26 · giờ 20:00 | 20h · phút)',
      '- `/hoc xong C5` · `/hoc bo-xong C5` — đánh dấu việc cá nhân',
      '- `/hoc bat-dau H12` — bấm giờ việc học (việc học xong = nộp bằng chứng trên web để AI chấm, không tự tích)',
      '- `/hoc sua C5 21:00` · `/hoc sua C5 khong-gio` · `/hoc ds 26/11 30/11`', '',
      'Hoặc hỏi thẳng: "hôm nay mình học gì?"'].join('\n');
}

/** Chạy `/hoc` trên giao diện chung (CLI / app). */
export async function lenhHocTap(thamSo: string, g: GiaoDienCtw): Promise<void> {
  const y = docLenhHoc(thamSo);
  if ('troGiup' in y) { g.traLoi(troGiupHoc(g.ngonNgu)); return; }
  if ('loi' in y) { g.traLoi(`⚠ ${y.loi}`); return; }
  type Ra = { ok: boolean; md?: string; loi?: string };
  const r = await g.goi<Ra>('agent:ctworkHe', { viec: 'hocTap', ngonNgu: g.ngonNgu, hocTap: { ...y } })
    .catch((e: Error): Ra => ({ ok: false, loi: e.message }));
  if (!r?.ok) { g.traLoi(`⚠ ${r?.loi ?? '?'}`); return; }
  g.traLoi(r.md ?? '');
  if (y.action !== 'today' && y.action !== 'week' && y.action !== 'list_personal') g.lamMoiDong?.();
}
