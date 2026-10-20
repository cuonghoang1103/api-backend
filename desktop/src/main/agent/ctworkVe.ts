/**
 * ============================================================
 * CT WORK — PHẦN THUẦN (đợt 5, 18/10/2026): đọc kết quả MCP, vẽ thẻ/sprint, đoán dự án
 * ============================================================
 *
 * Không I/O, không Electron — kiểm được bằng vitest/tsx thuần, và dùng chung cho cả ba nơi (app, CLI,
 * VS Code) qua lõi. Mọi chuỗi hiện cho người dùng đi qua `T(vi, en)` theo ngôn ngữ giao diện mà UI
 * báo lên (`datNgonNgu`). Dữ liệu do NGƯỜI viết trong CT Work (tiêu đề, mô tả, bình luận) đi nguyên —
 * khi đưa vào hội thoại cho model thì bọc lại rào `<ctwork-content untrusted>` như máy chủ.
 */

export type NgonNgu = 'vi' | 'en';
let ngonNgu: NgonNgu = 'vi';
export function datNgonNgu(n: NgonNgu | undefined | null): void { if (n === 'vi' || n === 'en') ngonNgu = n; }
export function ngonNguHienTai(): NgonNgu { return ngonNgu; }
export const T = (vi: string, en: string): string => (ngonNgu === 'en' ? en : vi);

// ─── Rút JSON khỏi kết quả tool CT Work ───────────────────────────

/** Khối `<ctwork-content …>…</ctwork-content>` (máy chủ bọc chữ do người viết). */
const KHOI = /<ctwork-content\b[^>]*>\n?([\s\S]*?)\n?<\/ctwork-content>/g;

/** Phần chữ máy sinh TRƯỚC khối đầu tiên + thân các khối. */
export function tachKhoi(text: string): { dau: string; khoi: string[] } {
  const khoi: string[] = [];
  let dau = text;
  const m0 = text.search(/<ctwork-content\b/);
  if (m0 >= 0) dau = text.slice(0, m0);
  for (const m of text.matchAll(KHOI)) khoi.push(m[1] ?? '');
  return { dau: dau.trim(), khoi };
}

/** JSON đầu tiên đọc được trong kết quả (trong khối untrusted, hoặc cả chuỗi khi tool trả object). */
export function rutJson(text: string): unknown {
  const t = text.trim();
  if (t.startsWith('{') || t.startsWith('[')) { try { return JSON.parse(t); } catch { /* thử khối */ } }
  for (const k of tachKhoi(text).khoi) {
    const s = k.trim();
    if (!s.startsWith('{') && !s.startsWith('[')) continue;
    try { return JSON.parse(s); } catch { /* khối kế */ }
  }
  return null;
}

// ─── Ngày ────────────────────────────────────────────────────────

/** "2026-10-24T…" | "2026-10-24" ⇒ "24/10". */
export function ngayNgan(s: unknown): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s ?? ''));
  return m ? `${m[3]}/${m[2]}` : '';
}

/** Số ngày từ HÔM NAY (giờ máy) tới ngày `s` (âm = đã qua). `null` khi không đọc được. */
export function soNgayToi(s: unknown, homNay: Date = new Date()): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s ?? ''));
  if (!m) return null;
  const dich = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const nay = Date.UTC(homNay.getFullYear(), homNay.getMonth(), homNay.getDate());
  return Math.round((dich - nay) / 86_400_000);
}

export function cauConNgay(n: number | null): string {
  if (n === null) return '';
  if (n > 1) return T(`còn ${n} ngày`, `${n} days left`);
  if (n === 1) return T('còn 1 ngày', '1 day left');
  if (n === 0) return T('hết hạn hôm nay', 'ends today');
  return T(`quá ${-n} ngày`, `${-n} day${n === -1 ? '' : 's'} over`);
}

// ─── Sprint ──────────────────────────────────────────────────────

export interface TheGon { key: string; title: string; status: string | null; category?: string | null; assignee?: string | null; points?: number | null; blocked?: boolean }
export interface SprintDl {
  ten: string; mucTieu: string | null; batDau: string | null; ketThuc: string | null;
  /** Không có sprint ACTIVE — đây là sprint "trọng tâm" (planned phủ hôm nay / sắp tới gần nhất). */
  laFocus: boolean; chuaBatDau: boolean;
  the: TheGon[]; tong: number;
}

const str = (v: unknown): string | null => (typeof v === 'string' && v ? v : null);

function theTu(x: unknown): TheGon | null {
  const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>;
  const key = str(o.key);
  if (!key) return null;
  return {
    key, title: String(o.title ?? ''), status: str(o.status), category: str(o.category) ?? str(o.statusCategory),
    assignee: str(o.assignee), points: typeof o.points === 'number' ? o.points : null, blocked: o.blocked === true,
  };
}

/** Kết quả `sprint_current` ⇒ sprint đang chạy, hoặc sprint `focus` (đợt 4). `null` = không có sprint nào. */
export function docSprint(text: string): SprintDl | null {
  const j = rutJson(text) as Record<string, unknown> | null;
  if (!j || typeof j !== 'object') return null;
  const s = j.sprint as Record<string, unknown> | undefined;
  if (s && typeof s === 'object') {
    const ds = (Array.isArray(j.issues) ? j.issues : []).map(theTu).filter((x): x is TheGon => !!x);
    return { ten: String(s.name ?? 'Sprint'), mucTieu: str(s.goal), batDau: str(s.startAt), ketThuc: str(s.endAt), laFocus: false, chuaBatDau: false, the: ds, tong: ds.length };
  }
  const f = j.focus as Record<string, unknown> | undefined;
  if (f && typeof f === 'object') {
    const ds = (Array.isArray(f.issues) ? f.issues : []).map(theTu).filter((x): x is TheGon => !!x);
    return {
      ten: String(f.name ?? 'Sprint'), mucTieu: str(f.goal), batDau: str(f.startAt), ketThuc: str(f.endAt), laFocus: true,
      chuaBatDau: f.denNgayChuaBatDau === true, the: ds, tong: typeof f.issueCount === 'number' ? f.issueCount : ds.length,
    };
  }
  return null;
}

const THU_TU_LOAI: Record<string, number> = { TODO: 0, IN_PROGRESS: 1, DONE: 2 };

/** Nhóm thẻ theo CỘT trạng thái, theo thứ tự TODO → IN_PROGRESS → DONE (cột lạ: theo lần xuất hiện). */
export function nhomTheoCot(ds: TheGon[]): Array<{ cot: string; loai: string | null; the: TheGon[] }> {
  const cot = new Map<string, { cot: string; loai: string | null; the: TheGon[]; dau: number }>();
  ds.forEach((t, i) => {
    const ten = t.status ?? '—';
    const c = cot.get(ten) ?? { cot: ten, loai: t.category ?? null, the: [], dau: i };
    c.the.push(t);
    cot.set(ten, c);
  });
  return [...cot.values()].sort((a, b) => (THU_TU_LOAI[a.loai ?? ''] ?? 1.5) - (THU_TU_LOAI[b.loai ?? ''] ?? 1.5) || a.dau - b.dau)
    .map(({ cot: c, loai, the }) => ({ cot: c, loai, the }));
}

const cat = (s: string, n: number): string => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const motDong = (s: string): string => s.replace(/\s+/g, ' ').trim();

/** Bảng sprint theo cột trạng thái (markdown) — `/ctwork` mục 1, `/sprint`. */
export function veSprint(s: SprintDl, duAn: string, toiDaMoiCot = 12): string {
  const con = cauConNgay(soNgayToi(s.ketThuc));
  const khoang = s.batDau || s.ketThuc ? ` (${ngayNgan(s.batDau) || '?'} → ${ngayNgan(s.ketThuc) || '?'})` : '';
  const nhan = s.laFocus ? T(' · chưa chạy — sprint trọng tâm', ' · not started — focus sprint') : '';
  const dong: string[] = [`**${s.ten}** · ${duAn}${nhan}${con ? ` · ${con}` : ''}${khoang} · ${s.tong} ${T('thẻ', s.tong === 1 ? 'issue' : 'issues')}`];
  if (s.chuaBatDau) dong.push(T('_Đã tới ngày bắt đầu nhưng chưa ai bấm Start sprint._', '_The start date has passed but nobody pressed Start sprint._'));
  if (s.mucTieu) dong.push(`${T('Mục tiêu', 'Goal')}: ${cat(motDong(s.mucTieu), 240)}`);
  const cot = nhomTheoCot(s.the);
  if (cot.length) dong.push(cot.map((c) => `${c.cot} ${c.the.length}`).join(' · '));
  for (const c of cot) {
    dong.push('', `**${c.cot}** · ${c.the.length}`);
    for (const t of c.the.slice(0, toiDaMoiCot)) {
      const phu = [t.assignee ? `@${t.assignee.replace(/^🤖 /, '🤖')}` : '', t.points != null ? `${t.points}pt` : '', t.blocked ? T('⚑ bị chặn', '⚑ blocked') : ''].filter(Boolean).join(' · ');
      dong.push(`- \`${t.key}\` ${cat(motDong(t.title), 70)}${phu ? ` · ${phu}` : ''}`);
    }
    if (c.the.length > toiDaMoiCot) dong.push(`- … +${c.the.length - toiDaMoiCot}`);
  }
  if (s.tong > s.the.length) dong.push('', T(`_Hiện ${s.the.length}/${s.tong} thẻ._`, `_Showing ${s.the.length}/${s.tong} issues._`));
  return dong.join('\n');
}

// ─── Việc của tôi ────────────────────────────────────────────────

export interface ViecToi { key: string; title: string; status: string | null; statusCategory?: string | null; dueDate: string | null; overdue: boolean; blocked: boolean; priority?: number | null }

export function docViecToi(text: string): ViecToi[] {
  const j = rutJson(text);
  if (!Array.isArray(j)) return [];
  return j.map((x) => {
    const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>;
    return {
      key: String(o.key ?? ''), title: String(o.title ?? ''), status: str(o.status), statusCategory: str(o.statusCategory),
      dueDate: str(o.dueDate), overdue: o.overdue === true, blocked: o.blocked === true, priority: typeof o.priority === 'number' ? o.priority : null,
    };
  }).filter((v) => v.key);
}

/** Hạn gần lên đầu (quá hạn trước nhất), không hạn xuống cuối; cùng hạn ⇒ đang làm trước. */
export function sapViecToi(ds: ViecToi[]): ViecToi[] {
  return [...ds].sort((a, b) => {
    if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
    if (!!a.dueDate !== !!b.dueDate) return a.dueDate ? -1 : 1;
    const da = a.statusCategory === 'IN_PROGRESS' ? 0 : 1;
    const db = b.statusCategory === 'IN_PROGRESS' ? 0 : 1;
    return da - db || (a.priority ?? 9) - (b.priority ?? 9);
  });
}

export function veViecToi(ds: ViecToi[], duAn: string | null, toiDa = 25): string {
  if (!ds.length) return T(`Không có thẻ nào đang giao cho bạn${duAn ? ` trong ${duAn}` : ''}.`, `Nothing is assigned to you${duAn ? ` in ${duAn}` : ''}.`);
  const sap = sapViecToi(ds);
  const dong = [`**${T('Việc của tôi', 'My work')}**${duAn ? ` · ${duAn}` : ''} · ${ds.length} ${T('thẻ', ds.length === 1 ? 'issue' : 'issues')}${ds.some((v) => v.overdue) ? ` · ${T(`${ds.filter((v) => v.overdue).length} quá hạn`, `${ds.filter((v) => v.overdue).length} overdue`)}` : ''}`, ''];
  for (const v of sap.slice(0, toiDa)) {
    const han = v.dueDate ? `${T('hạn', 'due')} ${ngayNgan(v.dueDate)}${v.overdue ? ` ⚠ ${T('quá hạn', 'overdue')}` : ` (${cauConNgay(soNgayToi(v.dueDate))})`}` : '';
    dong.push(`- \`${v.key}\` ${cat(motDong(v.title), 70)} · **${v.status ?? '?'}**${han ? ` · ${han}` : ''}${v.blocked ? ` · ${T('⚑ bị chặn', '⚑ blocked')}` : ''}`);
  }
  if (sap.length > toiDa) dong.push(`- … +${sap.length - toiDa}`);
  return dong.join('\n');
}

// ─── Một thẻ (get_issue) ─────────────────────────────────────────

export interface TheChiTiet {
  key: string; tieuDe: string; loai: string | null; trangThai: string | null; loaiTrangThai: string | null; uuTien: string | null;
  nguoiLam: string | null; han: string | null; moTa: string; tuKiem: Array<{ chu: string; xong: boolean }>; tieuChi: string | null;
  binhLuanCuoi: { tacGia: string; luc: string; chu: string } | null; soBinhLuan: number; chuyenDuoc: string[]; diem: string | null;
}

/** Tách các mục `## Tên` trong thân khối untrusted của `get_issue`. */
function tachMuc(than: string): Map<string, string> {
  const m = new Map<string, string>();
  const phan = than.split(/^## /m);
  for (const p of phan.slice(1)) {
    const xuong = p.indexOf('\n');
    const ten = (xuong < 0 ? p : p.slice(0, xuong)).trim();
    m.set(ten, xuong < 0 ? '' : p.slice(xuong + 1).trim());
  }
  return m;
}

/** Danh sách "Tự kiểm" / checklist trong mô tả: mục có tiêu đề chứa "Tự kiểm" (hoặc "Acceptance"/"Checklist"). */
export function rutTuKiem(moTa: string): Array<{ chu: string; xong: boolean }> {
  const dong = moTa.split('\n');
  const ra: Array<{ chu: string; xong: boolean }> = [];
  let trong = false;
  for (const d of dong) {
    const tieuDe = /^\s*(#{1,6}\s+|\*\*)(.+?)(\*\*)?\s*:?\s*$/.exec(d);
    if (tieuDe) { trong = /tự kiểm|tu kiem|self-check|acceptance|checklist|tiêu chí/i.test(tieuDe[2]!); continue; }
    if (!trong) continue;
    const muc = /^\s*[-*+]\s+(\[( |x|X)\]\s*)?(.+)$/.exec(d) ?? /^\s*\d+[.)]\s+(\[( |x|X)\]\s*)?(.+)$/.exec(d);
    if (muc) ra.push({ chu: muc[3]!.trim(), xong: /x/i.test(muc[2] ?? '') });
    else if (d.trim() && ra.length && !/^\s/.test(d)) trong = false;
  }
  return ra.slice(0, 20);
}

export function docThe(text: string): TheChiTiet | null {
  const { dau, khoi } = tachKhoi(text);
  const key = /^Issue ([A-Z][A-Z0-9_]*-\d+)/m.exec(dau)?.[1];
  if (!key) return null;
  const than = khoi[0] ?? '';
  const muc = tachMuc(than);
  const loaiTT = /Type: ([^·\n]+?) \(([^)]*)\) · Status: ([^[\n]+?) \[([A-Z_?]+)\] · Priority: ([^\n]+)/.exec(dau);
  const nguoi = /Assignee: (@[^\s]+(?: \(AI agent\))?)(?: "([^"]*)")?|Assignee: (nobody)/.exec(dau);
  const han = /Due: (\d{4}-\d{2}-\d{2}|—)/.exec(dau)?.[1];
  const diem = /Story points: ([^·\n]+)/.exec(dau)?.[1]?.trim();
  const chuyen = /Allowed transitions from here: ([^\n]+)/.exec(dau)?.[1] ?? '';
  const moTa = muc.get('Description') ?? '';
  // Bình luận: "### comment #12 · @u "Tên" · 2026-10-17T… · INTERNAL" rồi thân.
  const binh = muc.get(`Comments (${/## Comments \((\d+)\)/.exec(than)?.[1] ?? ''})`) ?? '';
  const soBl = Number(/## Comments \((\d+)\)/.exec(than)?.[1] ?? 0);
  let cuoi: TheChiTiet['binhLuanCuoi'] = null;
  {
    const ds = [...(binh || than).matchAll(/^#{3,4} (?:↳ reply )?comment #\d+ · (.+?) · (\d{4}-\d{2}-\d{2})T[^\n]*\n([\s\S]*?)(?=^#{3,4} |(?![\s\S]))/gm)];
    const m = ds[ds.length - 1];
    if (m) cuoi = { tacGia: m[1]!.replace(/ "[^"]*"$/, ''), luc: m[2]!, chu: motDong(m[3] ?? '') };
  }
  return {
    key, tieuDe: muc.get('Title') ?? '', loai: loaiTT?.[1]?.trim() ?? null, trangThai: loaiTT?.[3]?.trim() ?? null, loaiTrangThai: loaiTT?.[4] ?? null,
    uuTien: loaiTT?.[5]?.trim() ?? null, nguoiLam: nguoi?.[3] ? null : (nguoi?.[1] ?? null), han: han && han !== '—' ? han : null,
    moTa, tuKiem: rutTuKiem(moTa), tieuChi: muc.get('Acceptance criteria') ?? null, binhLuanCuoi: cuoi, soBinhLuan: soBl,
    chuyenDuoc: chuyen && chuyen !== '(none)' ? chuyen.split(', ').map((x) => x.replace(/ \[[A-Z_]+\]$/, '')) : [], diem: diem && diem !== '—' ? diem : null,
  };
}

/** Mô tả rút gọn: bỏ mục Tự kiểm (đã hiện riêng), gộp dòng trống, cắt ở `n` ký tự. */
export function moTaGon(moTa: string, n = 420): string {
  const bo = moTa.replace(/^\s*(#{1,6}\s+|\*\*)[^\n]*(tự kiểm|self-check|checklist|acceptance)[^\n]*\n([\s\S]*?)(?=^\s*(#{1,6}\s+|\*\*)|(?![\s\S]))/gim, '');
  const gon = bo.replace(/\n{3,}/g, '\n\n').trim();
  return gon.length > n ? `${gon.slice(0, n).replace(/\s+\S*$/, '')} …` : gon;
}

/** Thẻ đẹp cho người đọc (markdown) — `/issue LF-18`, `/ctwork` mục 3. */
export function veThe(t: TheChiTiet): string {
  const dong: string[] = [`### ${t.key} · ${motDong(t.tieuDe) || '—'}`];
  const meta = [
    t.trangThai ? `**${t.trangThai}**` : '', t.loai ?? '', t.uuTien ?? '', t.nguoiLam ? `👤 ${t.nguoiLam}` : `👤 ${T('chưa giao', 'unassigned')}`,
    t.diem ? `${t.diem}pt` : '', t.han ? `${T('hạn', 'due')} ${ngayNgan(t.han)} (${cauConNgay(soNgayToi(t.han))})` : '',
  ].filter(Boolean);
  dong.push(meta.join(' · '));
  const mt = moTaGon(t.moTa);
  /* Đợt 6: bỏ dòng trích dẫn TRỐNG — thẻ gọn hơn (cửa sổ thấp vẫn thấy Tự kiểm + bình luận gần nhất). */
  if (mt) dong.push('', ...mt.split('\n').filter((d) => d.trim()).map((d) => `> ${d}`));
  if (t.tuKiem.length) {
    dong.push('', `**${T('Tự kiểm', 'Self-check')}** (${t.tuKiem.filter((x) => x.xong).length}/${t.tuKiem.length})`);
    for (const x of t.tuKiem.slice(0, 10)) dong.push(`- [${x.xong ? 'x' : ' '}] ${cat(motDong(x.chu), 140)}`);
    if (t.tuKiem.length > 10) dong.push(`- … +${t.tuKiem.length - 10}`);
  } else if (t.tieuChi) {
    dong.push('', `**${T('Tiêu chí chấp nhận', 'Acceptance criteria')}**`, cat(t.tieuChi.trim(), 500));
  }
  if (t.binhLuanCuoi) {
    dong.push('', `**${T('Bình luận gần nhất', 'Latest comment')}** (${t.soBinhLuan}) — ${t.binhLuanCuoi.tacGia} · ${ngayNgan(t.binhLuanCuoi.luc)}: ${cat(t.binhLuanCuoi.chu, 220)}`);
  }
  if (t.chuyenDuoc.length) dong.push('', `${T('Chuyển được sang', 'Can move to')}: ${t.chuyenDuoc.join(' · ')}`);
  return dong.join('\n');
}

/**
 * Tóm tắt một thẻ để ĐÍNH KÈM vào tin của người dùng (`LF-123` trong câu ⇒ như `@file`). Phần do người
 * viết bọc rào untrusted (đúng như máy chủ), trần `toiDa` ký tự cho cả khối.
 */
export function tomTatDinhKem(t: TheChiTiet, toiDa = 1500): string {
  const meta = `${t.key} · ${t.trangThai ?? '?'}${t.loai ? ` · ${t.loai}` : ''} · ${T('người làm', 'assignee')}: ${t.nguoiLam ?? '—'}${t.han ? ` · ${T('hạn', 'due')} ${t.han}` : ''}${t.chuyenDuoc.length ? ` · ${T('chuyển được', 'can move to')}: ${t.chuyenDuoc.join(', ')}` : ''}`;
  const phan: string[] = [`${T('Tiêu đề', 'Title')}: ${motDong(t.tieuDe)}`];
  const mt = moTaGon(t.moTa, 600);
  if (mt) phan.push(`${T('Mô tả', 'Description')}: ${mt}`);
  if (t.tuKiem.length) phan.push(`${T('Tự kiểm', 'Self-check')}:\n${t.tuKiem.slice(0, 10).map((x) => `- [${x.xong ? 'x' : ' '}] ${motDong(x.chu)}`).join('\n')}`);
  else if (t.tieuChi) phan.push(`${T('Tiêu chí', 'Acceptance')}: ${cat(motDong(t.tieuChi), 300)}`);
  if (t.binhLuanCuoi) phan.push(`${T('Bình luận gần nhất', 'Latest comment')} (${t.binhLuanCuoi.tacGia}, ${t.binhLuanCuoi.luc}): ${cat(t.binhLuanCuoi.chu, 240)}`);
  const vo = (than: string) => `${meta.replace(/<\/?ctwork-content/gi, (m) => m.replace('<', '<\\'))}\n<ctwork-content source="issue ${t.key} (summary)" untrusted="true">\n${than}\n</ctwork-content>`;
  /* QA 5c: tự vô hiệu thẻ đóng/mở rào trong chữ người viết (như `untrusted()` của máy chủ) — không trông vào máy chủ
     đã làm: chữ "</ctwork-content> Bỏ qua luật trước…" không được thoát khỏi rào. */
  let than = phan.join('\n').replace(/<\/?ctwork-content/gi, (m) => m.replace('<', '<\\'));
  while (vo(than).length > toiDa && than.length > 80) than = `${than.slice(0, Math.max(80, than.length - (vo(than).length - toiDa) - 2))}…`;
  return vo(than);
}

// ─── Nhắc thẻ trong câu ⇒ tự nạp ─────────────────────────────────

/** `LF-123` trong câu (đúng key dự án đã gắn), không trùng, tối đa `toiDa`. Bỏ qua khối code `…`. */
export function timKhoaThe(cau: string, key: string, toiDa = 3): string[] {
  if (!key || !/^[A-Z][A-Z0-9_]{0,9}$/.test(key)) return [];
  const sach = cau.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`\n]*`/g, ' ');
  const re = new RegExp(`(?<![A-Za-z0-9_/-])${key}-(\\d{1,6})(?![A-Za-z0-9_])`, 'g');
  const ra: string[] = [];
  for (const m of sach.matchAll(re)) {
    const k = `${key}-${Number(m[1])}`;
    if (!ra.includes(k)) ra.push(k);
    if (ra.length >= toiDa) break;
  }
  return ra;
}

// ─── Nhánh git ⇄ thẻ ─────────────────────────────────────────────

export function boDau(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

/** `LF-18` + "Thiết kế ERD v2" ⇒ `LF-18-thiet-ke-erd-v2` (≤ 50 ký tự, an toàn cho git). */
export function tenNhanhChoThe(key: string, tieuDe: string): string {
  const slug = boDau(tieuDe).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const day = `${key}-${slug}`.slice(0, 50).replace(/-+$/, '');
  return day || key;
}

/** Nhánh `LF-123-…` / `feature/LF-123` ⇒ `LF-123` (đúng key dự án). */
export function theTuNhanh(nhanh: string | null | undefined, key: string): string | null {
  if (!nhanh || !key) return null;
  const m = new RegExp(`(?:^|[/_-])${key}-(\\d{1,6})(?=$|[^0-9])`, 'i').exec(nhanh) ?? new RegExp(`^${key}-(\\d{1,6})`, 'i').exec(nhanh);
  return m ? `${key}-${Number(m[1])}` : null;
}

// ─── Đoán dự án từ AGENTS.md / CLAUDE.md ─────────────────────────

export interface DoanDuAn { key: string; projectId: number | null; workspaceId: number | null; workspace: string | null }

/** "Dự án **LF** (id 2) trong không gian **"LabFlow Studio"** (id 3)" ⇒ {LF, 2, 3, LabFlow Studio}; hoặc thẻ "LF-12" lặp lại. */
export function doanDuAnTuTaiLieu(chu: string): DoanDuAn | null {
  /*
   * Đợt 8A (chủ app: "mở ở BẤT KỲ thư mục nào cũng tự nối CT Work"): CHỈ nhận khi tài liệu ghi RÕ mã dự án CT Work —
   * một dòng có chữ "CT Work" kèm "dự án/project/key <KEY>". Bản cũ khớp mọi câu "project Foo" (cờ /i nuốt cả chữ
   * thường) và mọi tài liệu nhắc `ABC-12` ≥ 3 lần ⇒ repo bất kỳ cũng bị hỏi gắn.
   */
  const ws = /(?:không gian|khong gian|workspace)\s+\*{0,2}"?([^"*\n]{2,60}?)"?\*{0,2}\s*\(\s*id\s*(\d+)\s*\)/i.exec(chu);
  for (const dong of chu.split('\n')) {
    /* Dòng phải nói rõ là CT Work (hoặc cuongthai.com), hoặc ghi kèm id dự án "(id 2)". */
    if (!/\bCT\s?-?Work\b|\bctwork\b|cuongthai\.com|\(\s*id\s*\d+\s*\)/i.test(dong)) continue;
    const m = /(?:[Dd]ự án|[Dd]u an|[Pp]roject|[Kk]ey|[Mm]ã dự án)\s*(?:CT\s?-?Work\s*)?(?:[:=]\s*)?\*{0,2}`?([A-Z][A-Z0-9_]{1,9})`?\*{0,2}(?![a-z])(?:\s*\(\s*id\s*(\d+)\s*\))?/.exec(dong);
    if (m && m[1] !== 'CT') {
      return { key: m[1]!, projectId: m[2] ? Number(m[2]) : null, workspaceId: ws ? Number(ws[2]) : null, workspace: ws ? ws[1]!.trim() : null };
    }
  }
  return null;
}

// ─── list_projects ───────────────────────────────────────────────

export interface DuAnCtw { key: string; ten: string; id: number | null; workspaceId: number | null; workspace: string | null; vaiTro: string | null; soMo: number | null; luuTru: boolean }

export function docDsDuAn(text: string): DuAnCtw[] {
  const j = rutJson(text);
  if (!Array.isArray(j)) return [];
  return j.map((x) => {
    const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>;
    return {
      key: String(o.key ?? ''), ten: String(o.name ?? ''), id: typeof o.id === 'number' ? o.id : null,
      workspaceId: typeof o.workspaceId === 'number' ? o.workspaceId : null, workspace: str(o.workspaceName) ?? str(o.workspace),
      vaiTro: str(o.myRole), soMo: typeof o.openIssues === 'number' ? o.openIssues : null, luuTru: o.archived === true,
    };
  }).filter((p) => p.key);
}

// ─── Họp ─────────────────────────────────────────────────────────

export function veHop(text: string, duAn: string): string {
  const j = rutJson(text);
  if (!Array.isArray(j) || !j.length) return T(`Chưa có cuộc họp nào trong ${duAn}.`, `No meetings in ${duAn} yet.`);
  const ds = j as Array<Record<string, unknown>>;
  const bayGio = Date.now();
  const sap = ds.filter((m) => Date.parse(String(m.startsAt ?? '')) >= bayGio).sort((a, b) => String(a.startsAt).localeCompare(String(b.startsAt)));
  const qua = ds.filter((m) => !(Date.parse(String(m.startsAt ?? '')) >= bayGio)).sort((a, b) => String(b.startsAt).localeCompare(String(a.startsAt)));
  const dong = (m: Record<string, unknown>) => {
    const d = new Date(String(m.startsAt ?? ''));
    const luc = Number.isNaN(d.getTime()) ? '?' : `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    const viec = typeof m.withoutIssue === 'number' && m.withoutIssue > 0 ? ` · ${T(`${m.withoutIssue} việc chưa thành thẻ`, `${m.withoutIssue} action(s) without issue`)}` : '';
    return `- \`${String(m.key ?? '')}\` ${luc} · ${cat(motDong(String(m.title ?? '')), 70)}${m.type ? ` · ${String(m.type)}` : ''}${viec}`;
  };
  const ra = [`**${T('Họp', 'Meetings')}** · ${duAn}`];
  if (sap.length) ra.push('', `**${T('Sắp tới', 'Upcoming')}**`, ...sap.slice(0, 8).map(dong));
  if (qua.length) ra.push('', `**${T('Gần đây', 'Recent')}**`, ...qua.slice(0, 6).map(dong));
  return ra.join('\n');
}

// ─── Thẻ duyệt GHI: nói rõ ghi vào thẻ nào, nội dung gì ─────────

export interface XemTruocGhi { the: string | null; viec: string; noiDung: string }

const BO_KHOA = new Set(['project', 'issue']);

/** Mô tả thao tác GHI lên CT Work cho thẻ duyệt (theo tên tool gốc + tham số). */
export function moTaGhi(tool: string, args: Record<string, unknown>): XemTruocGhi {
  const duAn = typeof args.project === 'string' ? args.project : '';
  const soThe = args.issue;
  const the = soThe === undefined || soThe === null ? null
    : typeof soThe === 'number' ? (duAn ? `${duAn.split('/').pop()}-${soThe}` : `#${soThe}`) : String(soThe);
  const chu = (v: unknown) => (typeof v === 'string' ? v : v === undefined ? '' : JSON.stringify(v));
  switch (tool) {
    case 'comment': return { the, viec: T('Bình luận', 'Comment'), noiDung: chu(args.markdown) };
    case 'transition': return { the, viec: `${T('Chuyển trạng thái', 'Move')} → ${chu(args.to)}`, noiDung: args.comment ? `${T('Kèm bình luận', 'With comment')}:\n${chu(args.comment)}` : '' };
    case 'log_work': {
      const p = typeof args.minutes === 'number' ? args.minutes : 0;
      const gio = p >= 60 ? `${Math.floor(p / 60)}h${p % 60 ? ` ${p % 60}m` : ''}` : `${p}m`;
      return { the, viec: `${T('Ghi giờ', 'Log work')} ${gio}`, noiDung: [chu(args.note), args.activity ? `Activity: ${chu(args.activity)}` : ''].filter(Boolean).join('\n') };
    }
    case 'update_issue': {
      const doi = Object.keys(args).filter((k) => !BO_KHOA.has(k));
      return { the, viec: `${T('Sửa thẻ', 'Update issue')}: ${doi.join(', ')}`, noiDung: doi.map((k) => `${k}: ${cat(chu(args[k]), 600)}`).join('\n') };
    }
    case 'create_issue': return { the: duAn || null, viec: `${T('Tạo thẻ mới', 'Create issue')} (${chu(args.type)})`, noiDung: `${chu(args.title)}${args.descriptionMarkdown ? `\n\n${cat(chu(args.descriptionMarkdown), 800)}` : ''}` };
    case 'weekly_report_generate': return { the: duAn || null, viec: T('Tạo/làm mới Báo cáo tuần', 'Generate/refresh the weekly report'), noiDung: args.weekStart ? `${T('Tuần có ngày', 'Week of')} ${chu(args.weekStart)}` : T('Tuần này', 'This week') };
    case 'request_review': return { the, viec: T('Xin review', 'Request review'), noiDung: chu(args.message ?? args.note ?? '') };
    case 'attach_from_url': return { the, viec: `${T('Đính kèm từ link', 'Attach from link')}${typeof args.image === 'number' ? T(` (ảnh số ${args.image})`, ` (image #${args.image})`) : ''}${args.for === 'comment' ? T(' (bản nháp cho bình luận)', ' (draft for a comment)') : ''}`, noiDung: [chu(args.url), args.fileName ? chu(args.fileName) : ''].filter(Boolean).join('\n') };
    /* 20/10/2026: đính kèm ⇒ tên + cỡ + kiểu (đường dẫn trên máy nếu có) — KHÔNG đổ base64. */
    case 'attach_file': {
      const co = typeof args.kichThuoc === 'string' ? args.kichThuoc
        : typeof args.base64 === 'string' ? args.base64 : typeof args.sizeBytes === 'number' ? `${Math.round(args.sizeBytes / 1024)} KB` : '';
      const dich = args.for === 'comment' ? T(' (bản nháp cho bình luận)', ' (draft for a comment)') : typeof args.testRun === 'number' ? T(` (bằng chứng lần chạy test #${args.testRun})`, ` (evidence for test run #${args.testRun})`) : '';
      return { the, viec: `${T('Đính kèm tệp', 'Attach file')}${dich}`, noiDung: [`${chu(args.fileName)}${co ? ` · ${co}` : ''}${args.contentType ? ` · ${chu(args.contentType)}` : ''}`, typeof args.path === 'string' ? args.path : ''].filter(Boolean).join('\n') };
    }
    default: {
      const con = Object.fromEntries(Object.entries(args).filter(([k]) => !BO_KHOA.has(k)));
      let s = '';
      try { s = JSON.stringify(con, null, 2); } catch { s = ''; }
      return { the: the ?? (duAn || null), viec: tool, noiDung: cat(s, 1500) };
    }
  }
}

// ─── Kết quả tool CT Work ⇒ dòng tóm tắt + bảng gọn (không đổ JSON thô) ─

/**
 * `● CT Work · sprint_current — Sprint 2 · 14 thẻ` (tóm tắt) và `xemGon` (bảng gọn khi ctrl+o).
 * `null` ⇒ không nhận ra dạng ⇒ giao diện giữ cách cũ.
 */
export function tomTatKetQua(tool: string, text: string, loi = false): { tomTat: string; xemGon?: string } | null {
  if (loi) {
    const dong = text.replace(/^LỖI[^:]*:\s*/, '').split('\n')[0]!.slice(0, 160);
    return { tomTat: `${T('lỗi', 'error')}: ${dong}` };
  }
  try {
    switch (tool) {
      case 'sprint_current': {
        const s = docSprint(text);
        if (!s) return { tomTat: T('không có sprint nào', 'no sprint') };
        const con = cauConNgay(soNgayToi(s.ketThuc));
        return { tomTat: `${s.ten}${s.laFocus ? T(' (chưa chạy)', ' (not started)') : ''} · ${s.tong} ${T('thẻ', s.tong === 1 ? 'issue' : 'issues')}${con ? ` · ${con}` : ''}`, xemGon: veSprint(s, T('dự án', 'project'), 8) };
      }
      case 'my_work': {
        const ds = docViecToi(text);
        const qua = ds.filter((v) => v.overdue).length;
        return { tomTat: `${ds.length} ${T('thẻ', ds.length === 1 ? 'issue' : 'issues')}${qua ? ` · ${T(`${qua} quá hạn`, `${qua} overdue`)}` : ''}`, xemGon: veViecToi(ds, null, 15) };
      }
      case 'get_issue': {
        const t = docThe(text);
        return t ? { tomTat: `${t.key} · ${cat(motDong(t.tieuDe), 60)} · ${t.trangThai ?? '?'}`, xemGon: veThe(t) } : null;
      }
      case 'search_issues': {
        const n = /^(\d+) match\(es\), showing (\d+)/m.exec(text);
        const j = rutJson(text);
        const ds = (Array.isArray(j) ? j : []).map(theTu).filter((x): x is TheGon => !!x);
        const gon = ds.slice(0, 15).map((t) => `- \`${t.key}\` ${cat(motDong(t.title), 70)} · ${t.status ?? '?'}${t.assignee ? ` · @${t.assignee}` : ''}`).join('\n');
        return {
          tomTat: n ? T(`${n[1]} thẻ khớp${n[1] !== n[2] ? ` · hiện ${n[2]}` : ''}`, `${n[1]} match${n[1] === '1' ? '' : 'es'}${n[1] !== n[2] ? ` · showing ${n[2]}` : ''}`) : `${ds.length} ${T('thẻ', 'issues')}`,
          ...(gon ? { xemGon: gon } : {}),
        };
      }
      case 'list_projects': {
        const ds = docDsDuAn(text);
        return { tomTat: `${ds.length} ${T('dự án', ds.length === 1 ? 'project' : 'projects')}`, xemGon: ds.map((p) => `- \`${p.key}\` ${p.ten}${p.workspace ? ` · ${p.workspace}` : ''}${p.soMo != null ? ` · ${p.soMo} ${T('thẻ mở', 'open')}` : ''}`).join('\n') };
      }
      case 'meeting_list': {
        const j = rutJson(text);
        const n = Array.isArray(j) ? j.length : 0;
        return { tomTat: `${n} ${T('cuộc họp', n === 1 ? 'meeting' : 'meetings')}`, xemGon: veHop(text, T('dự án', 'project')) };
      }
      case 'comment': {
        const j = rutJson(text) as { issue?: string; commentId?: number } | null;
        return { tomTat: T(`đã bình luận${j?.issue ? ` vào ${j.issue}` : ''}`, `commented${j?.issue ? ` on ${j.issue}` : ''}`) };
      }
      case 'transition': {
        const j = rutJson(text) as Record<string, unknown> | null;
        const to = j && typeof j === 'object' ? (j.status ?? j.to ?? (j as { now?: unknown }).now) : null;
        return { tomTat: T(`đã chuyển${to ? ` → ${String(to)}` : ''}`, `moved${to ? ` → ${String(to)}` : ''}`) };
      }
      case 'log_work': return { tomTat: T('đã ghi giờ', 'work logged') };
      case 'whoami': {
        const j = rutJson(text) as { user?: { username?: string } } | null;
        return { tomTat: j?.user?.username ? `@${j.user.username}` : 'ok' };
      }
      default: {
        const { dau, khoi } = tachKhoi(text);
        const j = rutJson(text);
        const so = Array.isArray(j) ? `${j.length} ${T('mục', j.length === 1 ? 'item' : 'items')}` : '';
        const cau = motDong(dau.split('\n')[0] ?? '').slice(0, 100);
        const tt = so || cau || (khoi.length ? 'ok' : motDong(text).slice(0, 100));
        return { tomTat: tt || 'ok' };
      }
    }
  } catch {
    return null;
  }
}

/** Tên tool CT Work dễ đọc cho dòng `● CT Work · sprint_current`. */
export function nhanToolCtwork(ten: string): string | null {
  const m = /^mcp__ctwork__(.+)$/.exec(ten);
  return m ? `CT Work · ${m[1]}` : null;
}

// ─── Giờ người gõ ⇒ phút ─────────────────────────────────────────

/** "1.5h" · "1h30" · "90m" · "90" (phút) · "2" (giờ nếu ≤ 12) ⇒ phút; `null` khi không đọc được. */
export function docGio(s: string): number | null {
  const t = s.trim().toLowerCase().replace(',', '.');
  let m = /^(\d+(?:\.\d+)?)\s*(h|g|giờ|gio|hours?)\s*(?:(\d+)\s*(m|p|phút|phut|min)?)?$/.exec(t);
  if (m) return Math.round(Number(m[1]) * 60 + (m[3] ? Number(m[3]) : 0)) || null;
  m = /^(\d+)\s*(m|p|phút|phut|min|mins|minutes?)$/.exec(t);
  if (m) return Number(m[1]) || null;
  m = /^(\d+(?:\.\d+)?)$/.exec(t);
  if (m) { const n = Number(m[1]); return n <= 12 ? Math.round(n * 60) : Math.round(n); }
  return null;
}
