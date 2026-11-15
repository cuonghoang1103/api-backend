/**
 * CT Language — ĐỒNG BỘ SỔ TAY (15/11/2026): khuôn bản ghi + luật kiểm + luật gộp. THUẦN — không CSDL.
 *
 * Sổ tay của app iOS (`KhoSoTu`: các sổ, thẻ từ + trạng thái SM-2, các ngày đã học) đồng bộ HAI CHIỀU theo tài khoản.
 * Mỗi mục là một BẢN GHI `{loai, khoa, capNhat, xoa?, duLieu?}`:
 *   · `so`   — một sổ tay; khoa = id sổ (UUID do app sinh).
 *   · `the`  — một thẻ từ + SRS (hệ số, khoảng ôn, số lần đúng/quên, hạn ôn, lần ôn cuối, các sổ chứa nó);
 *              khoa = `<nn>-<id mục từ>` (id âm = từ ngoài từ điển / bộ từ soạn sẵn).
 *   · `ngay` — một ngày đã học (chuỗi ngày); khoa = yyyy-MM-dd. CHỈ THÊM (tập tăng dần), không xoá.
 * Xoá = bia mộ (`xoa: true`, không duLieu) — giữ để máy khác biết mà xoá theo.
 * Xung đột: BẢN MỚI HƠN THẮNG theo từng bản ghi (`capNhat` do app ghi lúc sửa); bằng nhau ⇒ giữ bản đang có (gửi lại
 * vô hại). `capNhat` ở tương lai quá 2 phút (đồng hồ máy lệch) bị kéo về "bây giờ" để không thắng mãi.
 * Kéo về theo `phienBan` (dãy số máy chủ cấp mỗi lần ghi) chứ không theo giờ — không lệ thuộc đồng hồ máy người dùng.
 * Dịch vụ CSDL: `soTuDongBo.ts`. Tuyến: `routes/ctlanguage.soTu.routes.ts`.
 */

export const LOAI_SO_TU = ['so', 'the', 'ngay'] as const;
export type LoaiSoTu = (typeof LOAI_SO_TU)[number];

/** Trần số bản ghi CÒN SỐNG mỗi loại / người (Pro hay không — giới hạn 200 từ của bản miễn phí là việc của app). */
export const GIOI_HAN_SO_TU: Record<LoaiSoTu, number> = { the: 20_000, so: 500, ngay: 4_000 };
/** Trần tổng số dòng (cả bia mộ) / người — chạm thì dọn bia mộ cũ hơn 90 ngày trước. */
export const TONG_DONG_TOI_DA = 40_000;
/** Một lần đẩy tối đa ngần này bản ghi. */
export const LO_TOI_DA = 500;
/** Một lần kéo tối đa ngần này bản ghi (app kéo tiếp khi `conNua`). */
export const KEO_TOI_DA = 2_000;
const LECH_DONG_HO_MS = 2 * 60_000;
const NN = ['en', 'ja', 'zh'] as const;

export interface BanGhiVao {
  loai: LoaiSoTu;
  khoa: string;
  capNhat: Date;
  xoa: boolean;
  duLieu: Record<string, unknown> | null;
}

export interface LoiBanGhi { loai?: string; khoa?: string; ly: string }

const laSo = (v: unknown, a: number, b: number): v is number => typeof v === 'number' && Number.isFinite(v) && v >= a && v <= b;
const laNguyen = (v: unknown, a: number, b: number): v is number => laSo(v, a, b) && Number.isInteger(v);
const chuoiTuyChon = (v: unknown, toiDa: number): string | null | undefined => {
  if (v === undefined || v === null) return null;
  if (typeof v !== 'string' || v.length > toiDa) return undefined;
  return v;
};
/** ISO / số giây không chấp nhận — chỉ chuỗi ngày giờ hợp lệ trong [2020, 2200]. */
function ngayGio(v: unknown): Date | null {
  if (typeof v !== 'string' || v.length > 40) return null;
  const d = new Date(v);
  const t = d.getTime();
  if (!Number.isFinite(t) || t < Date.UTC(2020, 0, 1) || t > Date.UTC(2200, 0, 1)) return null;
  return d;
}

/** Chuẩn hoá duLieu của thẻ: chỉ giữ trường đã biết, kiểm khoảng giá trị. `string` = lý do sai. */
function chuanThe(khoa: string, d: Record<string, unknown>): Record<string, unknown> | string {
  const nn = d.nn;
  if (typeof nn !== 'string' || !(NN as readonly string[]).includes(nn)) return 'nn sai';
  const m = d.muc;
  if (!m || typeof m !== 'object' || Array.isArray(m)) return 'thiếu muc';
  const mm = m as Record<string, unknown>;
  if (!laNguyen(mm.id, -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)) return 'muc.id sai';
  if (khoa !== `${nn}-${mm.id}`) return 'khoa phải là <nn>-<muc.id>';
  if (typeof mm.chu !== 'string' || !mm.chu.trim() || mm.chu.length > 160) return 'muc.chu sai';
  const muc: Record<string, unknown> = { id: mm.id, chu: mm.chu };
  for (const [k, toiDa] of [['chuPhu', 160], ['doc', 240], ['hanViet', 160], ['nghiaVi', 2000], ['nghiaEn', 2000]] as const) {
    const v = chuoiTuyChon(mm[k], toiDa);
    if (v === undefined) return `muc.${k} sai`;
    if (v !== null) muc[k] = v;
  }
  if (mm.thongDung !== undefined && mm.thongDung !== null) {
    if (typeof mm.thongDung !== 'boolean') return 'muc.thongDung sai';
    muc.thongDung = mm.thongDung;
  }
  const themLuc = ngayGio(d.themLuc), denHan = ngayGio(d.denHan);
  if (!themLuc) return 'themLuc sai';
  if (!denHan) return 'denHan sai';
  let lanOnCuoi: Date | null = null;
  if (d.lanOnCuoi !== undefined && d.lanOnCuoi !== null) {
    lanOnCuoi = ngayGio(d.lanOnCuoi);
    if (!lanOnCuoi) return 'lanOnCuoi sai';
  }
  if (!laSo(d.heSo, 1, 5)) return 'heSo sai';
  if (!laSo(d.khoangNgay, 0, 36_500)) return 'khoangNgay sai';
  if (!laNguyen(d.lanDung, 0, 1_000_000)) return 'lanDung sai';
  if (!laNguyen(d.lanQuen, 0, 1_000_000)) return 'lanQuen sai';
  let so: string[] | null = null;
  if (d.so !== undefined && d.so !== null) {
    if (!Array.isArray(d.so) || d.so.length > 100 || !d.so.every((x) => typeof x === 'string' && KHOA_SO.test(x))) return 'so sai';
    so = [...new Set(d.so as string[])];
  }
  return {
    muc, nn, themLuc: themLuc.toISOString(), heSo: d.heSo, khoangNgay: d.khoangNgay, lanDung: d.lanDung, lanQuen: d.lanQuen,
    denHan: denHan.toISOString(), lanOnCuoi: lanOnCuoi?.toISOString() ?? null, so: so?.length ? so : null,
  };
}

function chuanSo(d: Record<string, unknown>): Record<string, unknown> | string {
  if (typeof d.ten !== 'string' || !d.ten.trim() || d.ten.length > 60) return 'ten sai (1–60 ký tự)';
  if (typeof d.nn !== 'string' || !(NN as readonly string[]).includes(d.nn)) return 'nn sai';
  const taoLuc = ngayGio(d.taoLuc);
  if (!taoLuc) return 'taoLuc sai';
  const nguon = chuoiTuyChon(d.nguon, 80);
  if (nguon === undefined) return 'nguon sai';
  return { ten: d.ten.trim(), nn: d.nn, taoLuc: taoLuc.toISOString(), nguon };
}

const KHOA_SO = /^[A-Za-z0-9-]{1,64}$/;
// id thẻ đến hết số nguyên an toàn của JSON (16 chữ số). Trước 15/11/2026 trần là 10 chữ số ⇒ từ lưu từ màn Dịch
// (−2e12…) và từ nhận qua Chia sẻ (−1e12…) bị từ chối câm, không bao giờ lên tài khoản (docs/so-loi.md).
const KHOA_THE = /^(en|ja|zh)--?\d{1,16}$/;
const KHOA_NGAY = /^(20[2-9]\d|2[1]\d\d)-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/**
 * Kiểm + chuẩn hoá MỘT bản ghi app gửi. Sai ⇒ `{ ly }` (bản ghi đó bị bỏ, các bản khác vẫn nhận).
 * `bayGio` dùng để kéo `capNhat` tương lai về.
 */
export function chuanBanGhi(x: unknown, bayGio: Date = new Date()): BanGhiVao | LoiBanGhi {
  if (!x || typeof x !== 'object' || Array.isArray(x)) return { ly: 'không phải đối tượng' };
  const r = x as Record<string, unknown>;
  const loai = r.loai, khoa = r.khoa;
  if (typeof loai !== 'string' || !(LOAI_SO_TU as readonly string[]).includes(loai)) return { ly: 'loai sai' };
  if (typeof khoa !== 'string') return { loai, ly: 'thiếu khoa' };
  const loi = (ly: string): LoiBanGhi => ({ loai, khoa: khoa.slice(0, 100), ly });
  const re = loai === 'so' ? KHOA_SO : loai === 'the' ? KHOA_THE : KHOA_NGAY;
  if (!re.test(khoa)) return loi('khoa sai');
  if (loai === 'ngay' && Number.isNaN(Date.parse(`${khoa}T00:00:00Z`))) return loi('ngày không tồn tại');
  const cap = ngayGio(r.capNhat);
  if (!cap) return loi('capNhat sai');
  const capNhat = cap.getTime() > bayGio.getTime() + LECH_DONG_HO_MS ? new Date(bayGio) : cap;
  const xoa = r.xoa === true;
  if (xoa) {
    if (loai === 'ngay') return loi('ngày đã học không xoá được');
    return { loai: loai as LoaiSoTu, khoa, capNhat, xoa: true, duLieu: null };
  }
  if (loai === 'ngay') return { loai, khoa, capNhat, xoa: false, duLieu: {} };
  const d = r.duLieu;
  if (!d || typeof d !== 'object' || Array.isArray(d)) return loi('thiếu duLieu');
  const chuan = loai === 'the' ? chuanThe(khoa, d as Record<string, unknown>) : chuanSo(d as Record<string, unknown>);
  if (typeof chuan === 'string') return loi(chuan);
  if (JSON.stringify(chuan).length > 8_000) return loi('duLieu quá lớn');
  return { loai: loai as LoaiSoTu, khoa, capNhat, xoa: false, duLieu: chuan };
}

/** Chuẩn hoá cả lô: bỏ bản sai, gộp bản trùng khoá trong lô (giữ bản mới nhất — cùng giờ thì bản sau). */
export function chuanLo(ds: unknown, bayGio: Date = new Date()): { nhan: BanGhiVao[]; loi: LoiBanGhi[] } {
  const loi: LoiBanGhi[] = [];
  const theoKhoa = new Map<string, BanGhiVao>();
  if (!Array.isArray(ds)) return { nhan: [], loi: [{ ly: 'muc phải là mảng' }] };
  for (const x of ds) {
    const b = chuanBanGhi(x, bayGio);
    if (!('capNhat' in b)) { loi.push(b); continue; }
    const k = `${b.loai}\u0000${b.khoa}`;
    const cu = theoKhoa.get(k);
    if (!cu || b.capNhat.getTime() >= cu.capNhat.getTime()) theoKhoa.set(k, b);
  }
  return { nhan: [...theoKhoa.values()], loi };
}

/** Bản ghi đang có trên máy chủ (để quyết định thắng / trần). */
export interface BanGhiCo { capNhat: Date; xoa: boolean }

/** Bản vào có thắng bản đang có không: mới hơn THẬT SỰ (bằng ⇒ giữ bản cũ). */
export const thang = (vao: { capNhat: Date }, co: BanGhiCo | undefined) => !co || vao.capNhat.getTime() > co.capNhat.getTime();

/**
 * Áp trần số bản ghi còn sống. `dangSong` = số dòng còn sống theo loại hiện có, `tongDong` = tổng dòng (cả bia mộ).
 * Bản ghi thua (cũ hơn bản đang có) bị BỎ QUA (không phải lỗi). Bản sẽ tạo dòng sống MỚI mà vượt trần ⇒ lỗi
 * `CTL_SO_TU_DAY` theo từng bản. Xử lý bia mộ trước (giải phóng chỗ), rồi sửa bản đã có, rồi bản mới.
 */
export function apTran(
  nhan: BanGhiVao[], co: Map<string, BanGhiCo>, dangSong: Record<LoaiSoTu, number>, tongDong: number,
): { ghi: BanGhiVao[]; boQua: number; day: LoiBanGhi[] } {
  const song = { ...dangSong };
  let tong = tongDong;
  const ghi: BanGhiVao[] = [];
  const day: LoiBanGhi[] = [];
  let boQua = 0;
  const k = (b: BanGhiVao) => `${b.loai}\u0000${b.khoa}`;
  const hang = (b: BanGhiVao) => (b.xoa ? 0 : co.has(k(b)) && !co.get(k(b))!.xoa ? 1 : 2);
  for (const b of [...nhan].sort((a, c) => hang(a) - hang(c))) {
    const cu = co.get(k(b));
    if (!thang(b, cu)) { boQua++; continue; }
    const songTruoc = !!cu && !cu.xoa;
    if (!b.xoa && !songTruoc) {
      if (song[b.loai] >= GIOI_HAN_SO_TU[b.loai] || (!cu && tong >= TONG_DONG_TOI_DA)) {
        day.push({ loai: b.loai, khoa: b.khoa, ly: `CTL_SO_TU_DAY: tối đa ${GIOI_HAN_SO_TU[b.loai]} mục loại "${b.loai}"` });
        continue;
      }
      song[b.loai]++;
    } else if (b.xoa && songTruoc) song[b.loai]--;
    if (!cu) tong++;
    ghi.push(b);
  }
  return { ghi, boQua, day };
}
