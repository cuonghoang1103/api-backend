/**
 * Vẽ "hôm nay" / "tuần" của Học tập & Lịch thành markdown gọn — cho lệnh MCP `hoc_tap` (CuongMini CLI `/hoc` đọc
 * thẳng chữ này, model đọc để trả lời "hôm nay mình học gì"). THUẦN, có test.
 *
 * Mã việc: `H<id>` = việc HỌC (chấm bằng bằng chứng — không tự tích), `C<id>` = việc CÁ NHÂN (tự đánh dấu xong).
 */

const VN = 7 * 3_600_000;
const TEN_THU = ['', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const TRANG_THAI: Record<string, string> = {
  CHUA_LAM: 'chưa làm', DANG_LAM: 'đang làm', CHO_CHAM: 'đang chấm', VAN_DAP: 'vấn đáp', DAT: 'đạt', CHUA_DAT: 'chưa đạt — nộp lại',
};
const MUC_DO: Record<string, string> = { xanh: '🟢', vang: '🟡', cam: '🟠', do: '🔴' };

/** 'HH:MM' giờ VN của một mốc (Date hoặc ISO). */
export function gioVN(t: Date | string | null | undefined): string | null {
  if (!t) return null;
  const d = typeof t === 'string' ? new Date(t) : t;
  if (Number.isNaN(d.getTime())) return null;
  return new Date(d.getTime() + VN).toISOString().slice(11, 16);
}

export interface HocGon { id: number; maMon: string; tieuDe: string; thoiLuongPhut: number; trangThai: string; gioBatDau?: Date | string | null; hanChot: Date | string; boLo?: boolean }
export interface CaNhanGon { id: number; tieuDe: string; gioBatDau: Date | string | null; ngay: string; thoiLuongPhut: number; xong: boolean; quaHan: boolean }
export interface LopGon { maMon: string; batDau: string; ketThuc: string; phong: string | null }

type Dong = { sapXep: string; chu: string };

function dongHoc(v: HocGon): Dong {
  const g = gioVN(v.gioBatDau ?? null);
  return {
    sapXep: g ?? '99:99',
    chu: `- ${g ? `**${g}**` : '—'} · \`H${v.id}\` **${v.maMon}** ${v.tieuDe} (${v.thoiLuongPhut}′, ${TRANG_THAI[v.trangThai] ?? v.trangThai})${v.boLo ? ' ⚠ đã bỏ lỡ giờ một lần' : ''}`,
  };
}

function dongCaNhan(v: CaNhanGon, homNay: string): Dong {
  const g = gioVN(v.gioBatDau);
  const ton = v.ngay < homNay ? ` · tồn từ ${v.ngay.slice(8, 10)}/${v.ngay.slice(5, 7)}` : '';
  return {
    sapXep: g ?? '99:98',
    chu: `- ${g ? `**${g}**` : '—'} · \`C${v.id}\` ${v.xong ? '~~' : ''}${v.tieuDe}${v.xong ? '~~ ✓' : ''} (${v.thoiLuongPhut}′, cá nhân${ton})`,
  };
}

export function veHomNay(d: {
  ngay: string;
  hocKy: { ten: string; tuan: number; soTuan: number; tuanThi: number } | null;
  ruiRoKy: { tyLe: number; mucDo: string };
  lop: LopGon[]; hoc: HocGon[]; quaHan: HocGon[]; choCham: number; caNhan: CaNhanGon[];
  mon: Array<{ maMon: string; tyLeTruot: number; mucDo: string; tienDo: number; kyVong: number; thiSapToi: { loai: string; conNgay: number } | null }>;
}): string {
  const [y, m, dd] = d.ngay.split('-');
  const thu = TEN_THU[((new Date(`${d.ngay}T00:00:00Z`).getUTCDay() + 6) % 7) + 1];
  const out: string[] = [`### 📅 ${thu} ${dd}/${m}/${y}${d.hocKy ? ` · ${d.hocKy.ten} · tuần ${d.hocKy.tuan}/${d.hocKy.soTuan} (thi tuần ${d.hocKy.tuanThi})` : ''}`];
  if (d.hocKy && d.mon.length) {
    out.push(`${MUC_DO[d.ruiRoKy.mucDo] ?? ''} Tỷ lệ trượt cả kỳ **${d.ruiRoKy.tyLe}%** · ${d.mon.map((x) => `${x.maMon} ${MUC_DO[x.mucDo] ?? ''}${x.tyLeTruot}% (xong ${x.tienDo}%/cần ${x.kyVong}%)${x.thiSapToi && x.thiSapToi.conNgay <= 14 ? ` · thi ${x.thiSapToi.loai} còn ${x.thiSapToi.conNgay} ngày` : ''}`).join(' · ')}`);
  } else if (!d.hocKy) {
    out.push('_Chưa có kỳ học — tạo kỳ + thêm môn ở CT Work → Học tập & Lịch._');
  }
  if (d.lop.length) out.push('', '**Lên lớp**', ...d.lop.map((l) => `- **${l.batDau}–${l.ketThuc}** ${l.maMon}${l.phong ? ` · phòng ${l.phong}` : ''}`));
  const viec = [...d.hoc.map(dongHoc), ...d.caNhan.filter((v) => !v.xong).map((v) => dongCaNhan(v, d.ngay))].sort((a, b) => a.sapXep.localeCompare(b.sapXep));
  out.push('', '**Việc hôm nay**', ...(viec.length ? viec.map((x) => x.chu) : ['- (trống) — thêm việc: `/hoc them "tên việc" 20:00 45`']));
  const daXong = d.caNhan.filter((v) => v.xong);
  if (daXong.length) out.push('', `**Đã xong (cá nhân)**: ${daXong.map((v) => v.tieuDe).join(' · ')}`);
  if (d.quaHan.length) out.push('', `**⚠ Việc học quá hạn (${d.quaHan.length})**`, ...d.quaHan.slice(0, 8).map((v) => dongHoc(v).chu));
  if (d.choCham) out.push('', `⏳ ${d.choCham} việc đang chờ AI chấm.`);
  out.push('', '_`H…` = việc học: bấm Bắt đầu rồi nộp bằng chứng trên web để được chấm (không tự tích). `C…` = việc cá nhân: tự đánh dấu xong._');
  return out.join('\n');
}

export function veTuan(d: {
  hocKy: { ten: string; tuan: number; soTuan: number } | null;
  ngay: Array<{ ngay: string; thu: number; lop: LopGon[]; hoc: HocGon[]; caNhan: CaNhanGon[] }>;
}): string {
  const out: string[] = [`### 🗓️ 7 ngày tới${d.hocKy ? ` · ${d.hocKy.ten} · tuần ${d.hocKy.tuan}/${d.hocKy.soTuan}` : ''}`];
  for (const n of d.ngay) {
    const dong = [
      ...n.lop.map((l) => ({ sapXep: l.batDau, chu: `  - **${l.batDau}–${l.ketThuc}** 🏫 ${l.maMon}${l.phong ? ` (${l.phong})` : ''}` })),
      ...n.hoc.map((v) => { const x = dongHoc(v); return { sapXep: x.sapXep, chu: `  ${x.chu}` }; }),
      ...n.caNhan.map((v) => { const x = dongCaNhan(v, n.ngay); return { sapXep: x.sapXep, chu: `  ${x.chu}` }; }),
    ].sort((a, b) => a.sapXep.localeCompare(b.sapXep));
    const tong = n.hoc.reduce((s, v) => s + v.thoiLuongPhut, 0);
    out.push('', `**${TEN_THU[n.thu]} ${n.ngay.slice(8, 10)}/${n.ngay.slice(5, 7)}**${tong ? ` — tự học ${Math.round(tong / 6) / 10} giờ` : ''}`, ...(dong.length ? dong.map((x) => x.chu) : ['  - (trống)']));
  }
  return out.join('\n');
}

/** "H12" | "C5" | "12" ⇒ { loai, id }. `macDinh` khi không có tiền tố. Sai ⇒ null. */
export function docMaViec(s: string | number | undefined | null, macDinh: 'H' | 'C'): { loai: 'H' | 'C'; id: number } | null {
  if (s === undefined || s === null) return null;
  const m = /^\s*([HhCc])?\s*(\d{1,10})\s*$/.exec(String(s));
  if (!m) return null;
  const id = Number(m[2]);
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  return { loai: (m[1]?.toUpperCase() as 'H' | 'C' | undefined) ?? macDinh, id };
}
