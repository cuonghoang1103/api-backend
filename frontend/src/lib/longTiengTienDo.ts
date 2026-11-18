/**
 * CT Lồng Tiếng — hàm THUẦN cho thẻ tiến độ (18/11/2026): đổi `trangThai/buoc/phanTram` của việc thành 6 chặng hiển thị,
 * ước lượng thời gian còn lại từ tốc độ tiến thật, và câu CuongMini nói. Không import gì của React/Next ⇒ test bằng
 *   npx tsx --test frontend/src/lib/longTiengTienDo.test.ts
 *
 * Mốc % và chữ `buoc` lấy ĐÚNG từ trạm (`tools/long-tieng-tram/tram.mts › baoTienDo`):
 *   tai  0–12  'Trạm đã nhận việc' · 'Tải video từ link' (yt-dlp % × 0,1) · 'Tải video lên trạm' · 'Tải nhạc nền' (10)
 *   lam 12–25  'Tách giọng gốc khỏi nhạc nền'
 *       25–35  'Nghe & chép lời gốc'
 *       35–50  'Lập từ điển thuật ngữ' (35, video dài) · 'Dịch k/n câu'
 *       50–82  'Giọng bạn đang đọc N mẩu' · 'Đọc lại N mẩu chưa đạt (lượt k)'  (50 + lượt × 8, tự nghe lại bằng Whisper)
 *       82–100 'Canh giọng theo hình' · 'Kéo dài hình k/n đoạn' · 'Ghép tiếng + xuất video' (92) · 'Đẩy kết quả lên kho' (96)
 * Trạm đổi chữ ⇒ vẫn rơi về theo %, không vỡ.
 */

export type MaChang = 'tai' | 'tach' | 'nghe' | 'dich' | 'long' | 'ghep';
export type TrangThaiChang = 'xong' | 'dang' | 'cho' | 'loi';
export type Pha = 'tai-len' | 'xep-hang' | 'chay' | 'xong' | 'loi' | 'huy';

export interface Chang { ma: MaChang; ten: string; phu: string; tu: number; den: number }

export const CHANG: readonly Chang[] = [
  { ma: 'tai', ten: 'Tải video', phu: 'về trạm máy nhà', tu: 0, den: 12 },
  { ma: 'tach', ten: 'Tách giọng', phu: 'khỏi nhạc nền', tu: 12, den: 25 },
  { ma: 'nghe', ten: 'Nghe & chép lời', phu: 'mốc từng từ', tu: 25, den: 35 },
  { ma: 'dich', ten: 'Dịch', phu: 'sang tiếng Việt', tu: 35, den: 50 },
  { ma: 'long', ten: 'Lồng tiếng', phu: 'đọc + tự nghe lại', tu: 50, den: 82 },
  { ma: 'ghep', ten: 'Ghép video', phu: 'canh hình, xuất', tu: 82, den: 100 },
];

const THEO_CHU: Array<[RegExp, MaChang]> = [
  [/tách giọng/i, 'tach'],
  [/nghe\s*&\s*chép|chép lời/i, 'nghe'],
  [/^dịch\b|từ điển/i, 'dich'],
  [/đang đọc|đọc lại|mẩu/i, 'long'],
  [/canh giọng|kéo dài hình|ghép tiếng|xuất video|đẩy kết quả/i, 'ghep'],
  [/tải video|tải nhạc|trạm đã nhận|tải lên/i, 'tai'],
];

/** Chặng theo chữ `buoc` của trạm; không khớp ⇒ null. */
export function changTheoChu(buoc: string | null | undefined): MaChang | null {
  const b = (buoc ?? '').trim();
  if (!b) return null;
  for (const [re, ma] of THEO_CHU) if (re.test(b)) return ma;
  return null;
}

/** Chặng theo % (dùng khi chữ lạ). */
export function changTheoPhanTram(p: number): MaChang {
  const x = Math.max(0, Math.min(100, Number(p) || 0));
  for (const c of CHANG) if (x < c.den) return c.ma;
  return 'ghep';
}

export interface ViecTienDo { trangThai: string; buoc: string | null; phanTram: number }
export interface TienDo {
  pha: Pha;
  /** Chỉ số chặng đang làm / hỏng (−1 khi chưa vào chặng nào hoặc đã xong). */
  hienTai: number;
  chang: Array<Chang & { trangThai: TrangThaiChang; /** % trong riêng chặng này, 0..100 */ phanTram: number }>;
  /** % toàn việc, 0..100 */
  tong: number;
}

export function tinhTienDo(v: ViecTienDo): TienDo {
  const p = Math.max(0, Math.min(100, Math.round(Number(v.phanTram) || 0)));
  const pha: Pha = v.trangThai === 'cho_tai_len' ? 'tai-len'
    : v.trangThai === 'cho' ? 'xep-hang'
    : v.trangThai === 'xong' ? 'xong'
    : v.trangThai === 'loi' ? 'loi'
    : v.trangThai === 'huy' ? 'huy'
    : 'chay';
  let hienTai = -1;
  if (pha === 'tai-len') hienTai = 0;
  else if (pha === 'chay' || pha === 'loi') {
    const ma = changTheoChu(v.buoc) ?? changTheoPhanTram(p);
    hienTai = CHANG.findIndex((c) => c.ma === ma);
  }
  const chang = CHANG.map((c, k) => {
    let trangThai: TrangThaiChang = 'cho';
    let phan = 0;
    if (pha === 'xong' || (hienTai >= 0 && k < hienTai)) { trangThai = 'xong'; phan = 100; }
    else if (k === hienTai) {
      trangThai = pha === 'loi' ? 'loi' : 'dang';
      phan = pha === 'tai-len' ? 0 : Math.round(Math.max(0, Math.min(1, (p - c.tu) / (c.den - c.tu))) * 100);
    }
    return { ...c, trangThai, phanTram: phan };
  });
  const tong = pha === 'xong' ? 100 : pha === 'xep-hang' || pha === 'tai-len' || pha === 'huy' ? 0 : p;
  return { pha, hienTai, chang, tong };
}

// ─── Ước lượng thời gian còn lại ──────────────────────────────────────────

export interface Mau { /** ms */ t: number; /** % */ p: number }

/** Thêm mẫu (t, p): chỉ giữ khi % đổi hoặc đã cách mẫu cuối ≥ 30 s; giữ tối đa `toiDa` mẫu mới nhất. % lùi (thử lại) ⇒ bắt đầu lại. */
export function themMau(ds: readonly Mau[], m: Mau, toiDa = 80): Mau[] {
  const cuoi = ds[ds.length - 1];
  if (cuoi && m.p < cuoi.p) return [m];
  if (cuoi && m.p === cuoi.p && m.t - cuoi.t < 30_000) return [...ds];
  const moi = [...ds, m];
  return moi.length > toiDa ? [moi[0]!, ...moi.slice(moi.length - toiDa + 1)] : moi;
}

/** Cửa sổ "gần đây" để bắt tốc độ của chặng đang chạy. */
const CUA_SO_GAN_MS = 10 * 60_000;

/**
 * Giây còn lại, hoặc null khi CHƯA đủ dữ liệu (cần ≥ 60 s quan sát và tiến ≥ 3 %) ⇒ giao diện ghi "đang ước lượng…".
 * Tốc độ = trung bình của tốc độ toàn cục (từ mẫu đầu) và tốc độ 10 phút gần nhất, TÍNH TỚI `now` (không tới mẫu cuối) —
 * nên khi % đứng yên lâu (GPU đang đọc một lượt dài) tốc độ tự tụt và ETA tự dài ra, không đứng im báo sai.
 * Sàn 60 s: chưa xong thì không bao giờ hứa "0 phút".
 */
export function uocLuongConLai(ds: readonly Mau[], phanTram: number, now: number): number | null {
  if (phanTram >= 100) return 0;
  const dau = ds[0];
  if (!dau) return null;
  const quaGiay = (now - dau.t) / 1000;
  const tien = phanTram - dau.p;
  if (quaGiay < 60 || tien < 3) return null;
  const tocDoChung = tien / quaGiay;
  const gan = ds.find((m) => now - m.t <= CUA_SO_GAN_MS);
  let tocDo = tocDoChung;
  if (gan && gan !== dau && (now - gan.t) / 1000 >= 60 && phanTram - gan.p >= 1) {
    tocDo = 0.5 * tocDoChung + 0.5 * ((phanTram - gan.p) / ((now - gan.t) / 1000));
  }
  if (!(tocDo > 0)) return null;
  return Math.max(60, Math.round((100 - phanTram) / tocDo));
}

export interface EtaMuot { giay: number; luc: number }

/** Làm mượt con số hiển thị: số cũ trừ thời gian đã trôi, pha 65/35 với số mới — không nhảy 4 phút ↔ 11 phút mỗi lần làm mới. */
export function lamMuotEta(cu: EtaMuot | null, moi: number | null, now: number): EtaMuot | null {
  if (moi == null) {
    if (!cu) return null;
    return { giay: Math.max(60, cu.giay - (now - cu.luc) / 1000), luc: now };
  }
  if (!cu) return { giay: moi, luc: now };
  const truDi = Math.max(0, cu.giay - (now - cu.luc) / 1000);
  return { giay: Math.max(60, Math.round(0.65 * truDi + 0.35 * moi)), luc: now };
}

/** "khoảng 6 phút" · "khoảng 1 giờ 15 phút" · null ⇒ null. */
export function chuThoiGian(giay: number | null): string | null {
  if (giay == null || !Number.isFinite(giay)) return null;
  const phut = Math.max(1, Math.round(giay / 60));
  if (phut < 60) return `khoảng ${phut} phút`;
  const gio = Math.floor(phut / 60);
  const du = Math.round((phut % 60) / 5) * 5;
  if (du === 60) return `khoảng ${gio + 1} giờ`;
  return du ? `khoảng ${gio} giờ ${du} phút` : `khoảng ${gio} giờ`;
}

/** Đồng hồ đã chạy: 45 giây · 12 phút · 1 giờ 05 phút. */
export function chuDaChay(giay: number): string {
  const s = Math.max(0, Math.floor(giay));
  if (s < 60) return `${s} giây`;
  const p = Math.floor(s / 60);
  if (p < 60) return `${p} phút`;
  return `${Math.floor(p / 60)} giờ ${String(p % 60).padStart(2, '0')} phút`;
}

// ─── Lời CuongMini ────────────────────────────────────────────────────────

const LOI: Record<MaChang, readonly string[]> = {
  tai: [
    'Mình đang tải video về trạm',
    'Mình đang kéo video về máy nhà — mạng nhanh thì xong liền',
  ],
  tach: [
    'Mình đang tách giọng gốc khỏi nhạc nền',
    'Mình đang gỡ giọng người nói ra để giữ lại nhạc nền gốc',
  ],
  nghe: [
    'Mình đang nghe và chép lại từng câu',
    'Mình đang ghi lời gốc kèm mốc thời gian của từng từ',
  ],
  dich: [
    'Mình đang dịch sang tiếng Việt cho tự nhiên',
    'Mình đang dịch, giữ nguyên thuật ngữ quen như CPU, API, Docker',
  ],
  long: [
    'Giọng bạn đang đọc từng câu',
    'Đọc xong mình tự nghe lại — câu nào chưa chuẩn thì đọc lại',
  ],
  ghep: [
    'Mình đang canh giọng cho khớp hình',
    'Sắp xong rồi — mình đang ghép tiếng và xuất video',
  ],
};

/** Câu trong bong bóng: lời theo chặng (xoay vòng theo `lan`) + thời gian còn lại. */
export function cauNoi(tien: TienDo, lan: number, eta: number | null, taiLenPhanTram?: number | null): string {
  if (tien.pha === 'tai-len') {
    return taiLenPhanTram != null
      ? `Mình đang đưa video của bạn lên kho (${taiLenPhanTram}%), bạn đừng đóng tab nhé.`
      : 'Đang chờ tệp tải lên xong — bạn giữ tab này mở nhé.';
  }
  if (tien.pha === 'xep-hang') return 'Việc đã vào hàng — trạm ở máy nhà rảnh là mình làm ngay, bạn đợi xíu nhé.';
  if (tien.pha === 'xong') return 'Xong rồi! Video đã lồng tiếng xong, mời bạn xem thử nhé.';
  if (tien.pha === 'huy') return 'Việc này đã huỷ.';
  const c = CHANG[Math.max(0, tien.hienTai)]!;
  if (tien.pha === 'loi') return `Ôi, mình vấp ở bước "${c.ten}". Bạn xem lỗi bên dưới rồi bấm Thử lại nhé — các bước đã xong được giữ nguyên.`;
  const ds = LOI[c.ma];
  const loi = ds[((lan % ds.length) + ds.length) % ds.length]!;
  const tg = chuThoiGian(eta);
  return tg ? `${loi}, bạn đợi xíu nhé — ${tg} nữa xong.` : `${loi}, bạn đợi xíu nhé — mình đang ước lượng thời gian…`;
}

/** Mô tả kết quả theo lựa chọn "Xuất ra" (dòng xem trước cạnh thanh giọng gốc). */
export function moTaBanRa(banRa: 'ca-hai' | 'vi' | 'vi-goc', goc: number): string {
  const pt = Math.round(goc * 100);
  if (banRa === 'vi') return 'Kết quả: 1 video — chỉ giọng Việt';
  if (banRa === 'vi-goc') return `Kết quả: 1 video — song ngữ (giọng Việt + giọng gốc nhỏ ${pt}%)`;
  return `Kết quả: 2 video — chỉ giọng Việt · song ngữ (giọng gốc nhỏ ${pt}%)`;
}
