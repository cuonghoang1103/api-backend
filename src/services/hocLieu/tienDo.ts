/**
 * TIẾN ĐỘ & ĐÁNH GIÁ HỌC TẬP — phần THUẦN (không DB) để test được (24/11/2026). `tienDo.service.ts` gom số liệu từ dữ liệu
 * SẴN CÓ của chính người hỏi (việc CT Work có hạn, việc học /hoc-tap + điểm AI chấm, tiến độ khoá, Code Lab, Exam Room,
 * worklog) rồi gọi các hàm ở đây để chấm: đúng lịch hay chậm, xu hướng tuần này so với tuần trước, điểm yếu, chuỗi ngày
 * học, và lời khuyên cụ thể kèm link.
 *
 * Giờ Việt Nam (UTC+7) cho mọi mốc ngày/tuần — người học sống theo giờ VN, không theo UTC của máy chủ.
 */

export const VN_MS = 7 * 3_600_000;
export const LINK_NHAN_XET_TIENG_ANH = 'https://cuongthai.com/language/en/nhan-xet-tuan';
/** 'YYYY-MM-DD' theo giờ VN. */
export const ngayVN = (d: Date | number) => new Date((typeof d === 'number' ? d : d.getTime()) + VN_MS).toISOString().slice(0, 10);
/** Thứ Hai (YYYY-MM-DD, giờ VN) của tuần chứa ngày d. */
export function dauTuanVN(d: Date | number): string {
  const t = new Date((typeof d === 'number' ? d : d.getTime()) + VN_MS);
  const thu = (t.getUTCDay() + 6) % 7; // 0 = thứ Hai
  t.setUTCDate(t.getUTCDate() - thu);
  return t.toISOString().slice(0, 10);
}

export type XuHuong = 'tang' | 'ngang' | 'giam' | 'chua_du';
/** So tuần này với tuần trước (số việc xong / điểm TB…). Lệch < 10% (hoặc < 1 đơn vị) ⇒ ngang. */
export function xuHuong(tuanNay: number | null, tuanTruoc: number | null): XuHuong {
  if (tuanNay === null || tuanTruoc === null) return 'chua_du';
  if (tuanTruoc === 0 && tuanNay === 0) return 'chua_du';
  const lech = tuanNay - tuanTruoc;
  const nguong = Math.max(1, Math.abs(tuanTruoc) * 0.1);
  if (Math.abs(lech) < nguong) return 'ngang';
  return lech > 0 ? 'tang' : 'giam';
}
export const MUI_TEN: Record<XuHuong, string> = { tang: '↗ tiến bộ', ngang: '→ giữ nhịp', giam: '↘ đi xuống', chua_du: '· chưa đủ dữ liệu' };

export type TrangThaiLich = 'dung_lich' | 'cham' | 'cham_nhieu' | 'chua_toi_han';
/**
 * Đúng lịch hay chậm: so số việc ĐÃ XONG với số việc ĐÃ TỚI HẠN (hạn ≤ hôm nay).
 * Không có việc nào tới hạn ⇒ chua_toi_han. Quá hạn 0 hoặc xong ≥ 90% ⇒ đúng lịch; < 60% ⇒ chậm nhiều.
 */
export function trangThaiLich(xongTrongHan: number, toiHan: number, quaHan: number): TrangThaiLich {
  if (toiHan <= 0) return 'chua_toi_han';
  if (quaHan === 0) return 'dung_lich';
  const r = xongTrongHan / toiHan;
  if (r >= 0.9) return 'dung_lich';
  return r < 0.6 ? 'cham_nhieu' : 'cham';
}
export const NHAN_LICH: Record<TrangThaiLich, string> = { dung_lich: '✅ đúng lịch', cham: '⚠️ chậm', cham_nhieu: '🔴 chậm nhiều', chua_toi_han: '· chưa tới hạn' };

/** Chuỗi ngày học liên tiếp tính đến hôm nay (hôm nay chưa học vẫn giữ chuỗi tới hôm qua). */
export function chuoiNgay(ngayCoHoc: Iterable<string>, homNay: string): number {
  const s = new Set(ngayCoHoc);
  const lui = (d: string) => { const t = new Date(`${d}T00:00:00Z`); t.setUTCDate(t.getUTCDate() - 1); return t.toISOString().slice(0, 10); };
  let d = s.has(homNay) ? homNay : lui(homNay);
  let n = 0;
  while (s.has(d)) { n++; d = lui(d); }
  return n;
}

export interface Diem { ten: string; diem: number; toiDa: number; link?: string }
/** Điểm yếu: các lần thi/bài có tỷ lệ < 60%, thấp nhất trước (tối đa `n`). */
export function diemYeu(ds: Diem[], n = 5): Array<Diem & { phanTram: number }> {
  return ds
    .filter((d) => d.toiDa > 0)
    .map((d) => ({ ...d, phanTram: Math.round((d.diem / d.toiDa) * 100) }))
    .filter((d) => d.phanTram < 60)
    .sort((a, b) => a.phanTram - b.phanTram)
    .slice(0, n);
}

export interface MonTienDo {
  ma: string;               // khoá nhóm: không gian CT Work / mã môn
  ten: string;
  nguon: 'ctwork' | 'hoc_tap' | 'khoa_hoc';
  tong: number;             // tổng việc / bài
  xong: number;
  toiHan: number;           // việc có hạn ≤ hôm nay
  xongTrongHan: number;     // trong số tới hạn, đã xong
  quaHan: number;
  xongTuanNay: number;
  xongTuanTruoc: number;
  sapToi7Ngay: number;
  diemTBTuanNay?: number | null;
  diemTBTuanTruoc?: number | null;
  ruiRoTruot?: number | null; // % (hoc-tap)
  link?: string;
  viecQuaHan?: Array<{ ten: string; han: string; link?: string }>;
}

export interface DanhGiaMon extends MonTienDo { phanTram: number; lich: TrangThaiLich; xuHuong: XuHuong }
export function danhGiaMon(m: MonTienDo): DanhGiaMon {
  const coDiem = m.diemTBTuanNay != null && m.diemTBTuanTruoc != null;
  return {
    ...m,
    phanTram: m.tong ? Math.round((m.xong / m.tong) * 100) : 0,
    lich: trangThaiLich(m.xongTrongHan, m.toiHan, m.quaHan),
    xuHuong: coDiem ? xuHuong(m.diemTBTuanNay!, m.diemTBTuanTruoc!) : (m.xongTuanNay + m.xongTuanTruoc > 0 ? xuHuong(m.xongTuanNay, m.xongTuanTruoc) : 'chua_du'),
  };
}

export interface CodeLabTongHop { track: string; nop: number; dat: number; link?: string }
export interface TongHop {
  homNay: string;
  mon: DanhGiaMon[];
  codeLab: CodeLabTongHop[];
  thi: Diem[];
  thiTuanNay: number | null; thiTuanTruoc: number | null; // % TB
  gioTuanNay: number; gioTuanTruoc: number;
  chuoi: number;
  ngayHocTuanNay: number;
}

/** Lời khuyên CỤ THỂ, xếp theo mức gấp. Mỗi dòng một việc làm được ngay, có link khi có. */
export function deXuat(t: TongHop): string[] {
  const ra: Array<{ uu: number; s: string }> = [];
  for (const m of t.mon) {
    if (m.lich === 'cham_nhieu' || m.lich === 'cham') {
      const vd = (m.viecQuaHan ?? []).slice(0, 3).map((v) => v.ten).join('; ');
      ra.push({ uu: m.lich === 'cham_nhieu' ? 0 : 1, s: `${m.ten}: chậm ${m.quaHan} việc so với lịch${vd ? ` (${vd})` : ''} — bù tối nay hoặc dời hạn trên CT Work để lịch còn thật.${m.link ? ` ${m.link}` : ''}` });
    }
    if (m.ruiRoTruot != null && m.ruiRoTruot >= 50) ra.push({ uu: 0, s: `${m.ten}: nguy cơ trượt ${m.ruiRoTruot}% — ưu tiên môn này, làm các việc trọng số cao trước.` });
    if (m.xuHuong === 'giam' && m.lich !== 'chua_toi_han') ra.push({ uu: 2, s: `${m.ten}: tuần này làm/điểm giảm so với tuần trước — giữ nhịp tối thiểu mỗi ngày một việc.` });
  }
  for (const c of t.codeLab) {
    if (c.nop >= 3 && c.dat / c.nop < 0.5) ra.push({ uu: 2, s: `Code Lab ${c.track}: đạt ${Math.round((c.dat / c.nop) * 100)}% lượt nộp — đọc lại bài giảng liên quan rồi làm lại các bài chưa đạt.${c.link ? ` ${c.link}` : ''}` });
  }
  for (const d of diemYeu(t.thi, 3)) ra.push({ uu: 1, s: `Điểm yếu: "${d.ten}" chỉ ${d.phanTram}% — xem lại lượt thi, ôn đúng phần sai rồi làm lại.${d.link ? ` ${d.link}` : ''}` });
  if (t.chuoi === 0) ra.push({ uu: 3, s: 'Chuỗi ngày học đang 0 — hôm nay làm ít nhất một việc 25 phút để bắt đầu lại chuỗi.' });
  if (t.gioTuanNay < t.gioTuanTruoc * 0.7 && t.gioTuanTruoc >= 2) ra.push({ uu: 3, s: `Giờ học tuần này (${t.gioTuanNay.toFixed(1)} giờ) ít hơn tuần trước (${t.gioTuanTruoc.toFixed(1)} giờ).` });
  if (!ra.length) ra.push({ uu: 9, s: 'Đang đúng nhịp — giữ lịch hiện tại, làm trước các việc của tuần sau nếu còn thời gian.' });
  return ra.sort((a, b) => a.uu - b.uu).map((x) => x.s);
}

/** Báo cáo markdown tiếng Việt ngắn gọn (cho CuongMini đọc lại cho người học). */
export function veBaoCao(t: TongHop): string {
  const dong: string[] = [`# Tiến độ & đánh giá — ${t.homNay}`,
    `**Tuần này:** ${t.gioTuanNay.toFixed(1)} giờ (tuần trước ${t.gioTuanTruoc.toFixed(1)}) · học ${t.ngayHocTuanNay}/7 ngày · chuỗi ${t.chuoi} ngày liên tiếp.`];
  if (t.mon.length) {
    dong.push('## Theo môn / dự án học');
    for (const m of t.mon) {
      dong.push(`- **${m.ten}** — ${m.xong}/${m.tong} (${m.phanTram}%) · ${NHAN_LICH[m.lich]}${m.quaHan ? ` (quá hạn ${m.quaHan})` : ''} · ${MUI_TEN[m.xuHuong]} · tuần này xong ${m.xongTuanNay} (tuần trước ${m.xongTuanTruoc}) · 7 ngày tới ${m.sapToi7Ngay} việc${m.diemTBTuanNay != null ? ` · điểm TB tuần ${m.diemTBTuanNay.toFixed(1)}` : ''}${m.ruiRoTruot != null ? ` · nguy cơ trượt ${m.ruiRoTruot}%` : ''}${m.link ? ` · ${m.link}` : ''}`);
    }
  }
  if (t.codeLab.length) dong.push('## Code Lab (14 ngày)\n' + t.codeLab.map((c) => `- ${c.track}: nộp ${c.nop}, đạt ${c.dat} (${Math.round((c.dat / Math.max(1, c.nop)) * 100)}%)`).join('\n'));
  if (t.thi.length) dong.push(`## Thi / kiểm tra\nTB tuần này ${t.thiTuanNay ?? '—'}% · tuần trước ${t.thiTuanTruoc ?? '—'}% · ${MUI_TEN[xuHuong(t.thiTuanNay, t.thiTuanTruoc)]}`);
  dong.push('## Nên làm gì tiếp\n' + deXuat(t).map((s) => `- ${s}`).join('\n'));
  // Tiếng Anh do phiên CT Language chấm riêng (nhận xét tuần) — không gộp số liệu app tiếng Anh vào đây.
  dong.push(`_Tiếng Anh: xem nhận xét tuần ở ${LINK_NHAN_XET_TIENG_ANH}_`);
  return dong.join('\n\n');
}
