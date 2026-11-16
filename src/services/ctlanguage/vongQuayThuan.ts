/**
 * CT Language — VÒNG QUAY MAY MẮN (16/11/2026), phần THUẦN (không CSDL, không mạng) ⇒ test bằng
 * `npx tsx --test src/services/ctlanguage/vongQuayThuan.test.ts`.
 *
 * Luật (app hiện nguyên văn ở sheet "Thể lệ"):
 *   · Quà CHỈ là đồ trong app: xu (tiền của Tủ đồ trò chơi — KHÔNG mua được bằng tiền thật), x2 xu trò chơi hết ngày,
 *     một món đồ ngẫu nhiên trong Tủ đồ, thêm một lượt, hoặc "chúc may mắn lần sau". KHÔNG tiền, KHÔNG giảm giá gói Pro,
 *     KHÔNG bán lượt quay (App Store 3.1.1 / 5.3 — khuyến mãi IAP chỉ qua StoreKit offer; vòng quay ra tiền là cờ bạc).
 *   · Lượt (theo NGÀY GIỜ VIỆT NAM): 1 lượt miễn phí mỗi ngày · +1 khi đạt phút mục tiêu ngày · +1 vào ngày chuỗi học chạm
 *     mốc 7 / 14 / 21… · ô "Thêm 1 lượt" cho thêm lượt (tối đa 2 lượt thưởng mỗi ngày — hết trần thì ô đó không ra nữa).
 *   · Máy chủ chọn quà (crypto) + ghi lịch sử; app chỉ quay bánh xe tới đúng ô máy chủ trả về.
 *   · Tỉ lệ công bố đúng như bảng `QUA_VONG_QUAY` (Thể lệ in từ chính bảng này — không có tỉ lệ "ẩn").
 */

/** Ô trên bánh xe, ĐÚNG thứ tự theo chiều kim đồng hồ bắt đầu từ ô dưới kim (app vẽ theo thứ tự này). */
export const QUA_VONG_QUAY = [
  { ma: 'xu-10', nhan: '10 xu', xu: 10, tiLe: 26 },
  { ma: 'x2-xu', nhan: 'x2 xu cả ngày', xu: 0, tiLe: 12 },
  { ma: 'xu-20', nhan: '20 xu', xu: 20, tiLe: 20 },
  { ma: 'do', nhan: 'Món đồ bất ngờ', xu: 0, tiLe: 5 },
  { ma: 'xu-50', nhan: '50 xu', xu: 50, tiLe: 8 },
  { ma: 'them-luot', nhan: 'Thêm 1 lượt', xu: 0, tiLe: 10 },
  { ma: 'xu-100', nhan: '100 xu', xu: 100, tiLe: 2 },
  { ma: 'may-man', nhan: 'Chúc may mắn lần sau', xu: 0, tiLe: 17 },
] as const;

export type MaQua = (typeof QUA_VONG_QUAY)[number]['ma'];
export const MA_QUA = QUA_VONG_QUAY.map((q) => q.ma) as readonly MaQua[];

/** Quà đáng khoe ở dòng "vừa nhận" (xu nhỏ / may mắn không hiện — đỡ ồn). */
export const QUA_DANG_KHOE: readonly MaQua[] = ['xu-50', 'xu-100', 'do', 'x2-xu'];

export const NGUON_LUOT = ['ngay', 'muc-tieu', 'chuoi-7', 'thuong'] as const;
export type NguonLuot = (typeof NGUON_LUOT)[number];

/** Trần lượt thưởng (ô "Thêm 1 lượt") mỗi ngày. */
export const TRAN_LUOT_THUONG = 2;
/** Mục tiêu mặc định khi người dùng chưa có hồ sơ học (phút/ngày). */
export const MUC_TIEU_MAC_DINH = 15;

/**
 * Chọn ô theo tỉ lệ. `r` ∈ [0, 1). `choThemLuot = false` (đã hết trần lượt thưởng) ⇒ bỏ ô "Thêm 1 lượt" khỏi phép
 * bốc và chia lại tỉ lệ các ô còn lại — người dùng không bao giờ trúng một lượt mà máy chủ sẽ không cho quay.
 */
export function chonQua(r: number, choThemLuot = true): number {
  const ds = QUA_VONG_QUAY.map((q, i) => ({ i, w: !choThemLuot && q.ma === 'them-luot' ? 0 : q.tiLe }));
  const tong = ds.reduce((s, x) => s + x.w, 0);
  let x = Math.min(Math.max(r, 0), 0.999999999) * tong;
  for (const d of ds) {
    if (d.w <= 0) continue;
    if (x < d.w) return d.i;
    x -= d.w;
  }
  return ds.filter((d) => d.w > 0).at(-1)!.i;
}

export interface LuotDaDung { nguon: string; stt: number; qua: string }

export interface ChiTietLuot {
  nguon: NguonLuot;
  /** con = còn quay được · da-dung = đã quay · chua-dat = chưa đủ điều kiện */
  trangThai: 'con' | 'da-dung' | 'chua-dat';
  nhan: string;
  goiY: string;
  /** Số lượt (chỉ "thuong" có thể > 1). */
  so: number;
}

export interface TrangThaiLuot {
  con: number;
  tiep: { nguon: NguonLuot; stt: number } | null;
  chiTiet: ChiTietLuot[];
}

/**
 * Lượt hôm nay từ các lượt đã dùng hôm nay + điều kiện. Thứ tự dùng: ngay → muc-tieu → chuoi-7 → thuong.
 * Hàm thuần — máy chủ còn khoá bằng unique (user, ngày, nguồn, stt) nên bấm hai lần cùng lúc cũng chỉ một lượt ăn.
 */
export function tinhLuot(daDung: LuotDaDung[], dk: { datMucTieu: boolean; chuoi: number; phutHomNay: number; mucTieu: number }): TrangThaiLuot {
  const dung = (n: NguonLuot) => daDung.filter((x) => x.nguon === n).length;
  const chiTiet: ChiTietLuot[] = [];
  const hangDoi: { nguon: NguonLuot; stt: number }[] = [];

  const ngayDung = dung('ngay') > 0;
  chiTiet.push({ nguon: 'ngay', trangThai: ngayDung ? 'da-dung' : 'con', nhan: 'Lượt miễn phí hôm nay', goiY: 'Mỗi ngày một lượt', so: 1 });
  if (!ngayDung) hangDoi.push({ nguon: 'ngay', stt: 1 });

  const mtDung = dung('muc-tieu') > 0;
  const conPhut = Math.max(0, dk.mucTieu - dk.phutHomNay);
  chiTiet.push({
    nguon: 'muc-tieu', trangThai: mtDung ? 'da-dung' : dk.datMucTieu ? 'con' : 'chua-dat', nhan: 'Đạt mục tiêu ngày',
    goiY: dk.datMucTieu ? `Đã học đủ ${dk.mucTieu} phút` : `Học thêm ${conPhut} phút nữa`, so: 1,
  });
  if (!mtDung && dk.datMucTieu) hangDoi.push({ nguon: 'muc-tieu', stt: 1 });

  const mocChuoi = dk.chuoi >= 7 && dk.chuoi % 7 === 0;
  const c7Dung = dung('chuoi-7') > 0;
  const mocTiep = (Math.floor(Math.max(0, dk.chuoi) / 7) + 1) * 7;
  chiTiet.push({
    nguon: 'chuoi-7', trangThai: c7Dung ? 'da-dung' : mocChuoi ? 'con' : 'chua-dat', nhan: 'Chuỗi 7 ngày',
    goiY: mocChuoi || c7Dung ? `Chuỗi ${dk.chuoi} ngày — thưởng thêm` : `Còn ${mocTiep - Math.max(0, dk.chuoi)} ngày tới mốc ${mocTiep}`, so: 1,
  });
  if (!c7Dung && mocChuoi) hangDoi.push({ nguon: 'chuoi-7', stt: 1 });

  const duocThuong = Math.min(TRAN_LUOT_THUONG, daDung.filter((x) => x.qua === 'them-luot').length);
  const daThuong = dung('thuong');
  if (duocThuong > 0) {
    chiTiet.push({
      nguon: 'thuong', trangThai: daThuong >= duocThuong ? 'da-dung' : 'con', nhan: 'Lượt thưởng',
      goiY: `Trúng ô "Thêm 1 lượt" (tối đa ${TRAN_LUOT_THUONG}/ngày)`, so: duocThuong,
    });
    for (let s = daThuong + 1; s <= duocThuong; s++) hangDoi.push({ nguon: 'thuong', stt: s });
  }

  return { con: hangDoi.length, tiep: hangDoi[0] ?? null, chiTiet };
}

/** Đã dùng đủ lượt thưởng của ngày (tính cả lượt đang quay) ⇒ ô "Thêm 1 lượt" không được ra. */
export function conChoThemLuot(daDung: LuotDaDung[]): boolean {
  return daDung.filter((x) => x.qua === 'them-luot').length < TRAN_LUOT_THUONG;
}

/** Chuỗi ngày học liên tiếp KẾT THÚC HÔM NAY (hôm nay chưa học ⇒ 0 — thưởng chuỗi chỉ ra vào ngày đang học). */
export function chuoiDenHomNay(ngayHoc: Iterable<string>, homNay: string): number {
  const s = new Set(ngayHoc);
  let n = 0;
  let d = homNay;
  while (s.has(d)) {
    n++;
    d = new Date(new Date(`${d}T00:00:00.000Z`).getTime() - 86_400_000).toISOString().slice(0, 10);
  }
  return n;
}

/** Đạt mục tiêu khi MỘT ngôn ngữ đang học có phút hôm nay ≥ mục tiêu của chính ngôn ngữ đó. */
export function datMucTieu(giayTheoNn: Record<string, number>, mucTieuTheoNn: Record<string, number>, nnChinh: string): { dat: boolean; phut: number; mucTieu: number } {
  const muc = (nn: string) => mucTieuTheoNn[nn] ?? MUC_TIEU_MAC_DINH;
  const dat = Object.entries(giayTheoNn).some(([nn, g]) => g >= muc(nn) * 60);
  // Phút hiển thị: của ngôn ngữ chính; đã đạt ở ngôn ngữ khác thì hiện ngôn ngữ đó.
  const nnHien = dat ? Object.entries(giayTheoNn).find(([nn, g]) => g >= muc(nn) * 60)![0] : nnChinh;
  return { dat, phut: Math.floor((giayTheoNn[nnHien] ?? 0) / 60), mucTieu: muc(nnHien) };
}

/** "Hoàng Văn Cường" ⇒ "Cường H." · "minh" ⇒ "Minh" — dòng "vừa nhận" không lộ tên đầy đủ. */
export function anTen(ten: string | null | undefined): string {
  const ds = (ten ?? '').trim().split(/\s+/).filter(Boolean);
  if (!ds.length) return 'Một bạn học';
  const hoa = (s: string) => s.charAt(0).toLocaleUpperCase('vi') + s.slice(1);
  const cuoi = hoa(ds[ds.length - 1]!);
  return ds.length > 1 ? `${cuoi} ${ds[0]!.charAt(0).toLocaleUpperCase('vi')}.` : cuoi;
}
