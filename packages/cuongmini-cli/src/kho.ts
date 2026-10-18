/**
 * KHO TRẠNG THÁI của một phiên chat — nhận sự kiện `agent:event` của lõi và
 * dựng hai phần:
 *  • `bang`: những mục ĐÃ XONG (tin người, câu trả lời, dòng tool, kết lượt…)
 *    — in một lần vào vùng cuộn của terminal (`<Static>` của Ink);
 *  • phần ĐANG SỐNG: chữ đang chảy, tool đang chạy, thẻ chờ duyệt, kế hoạch,
 *    file đã sửa — vẽ lại liên tục ở đáy màn hình.
 *
 * Luật xử lý từng loại sự kiện bám sát `webview/main.ts#xuLy` của extension
 * VS Code (cùng lõi, cùng hợp đồng `AgentUiEvent` ở `desktop/src/shared/ipc.ts`).
 * Tách khỏi React để kiểm bằng test thuần.
 */
import type { DuLieuDiff } from './diff';
import { L } from './i18n';
import { apSuKienPhu, dongAgentTreo, type AgentPhu, type LenhNen } from './viecPhu';
import { coVeHong, dichDanhThuc, tachKetQuaLenh, tienGon, TOOL_GOM, TOOL_GHI, TOOL_LENH, type Pha } from './trangThai';

export interface ViecKeHoach { ten: string; trangThai: string }
export interface WsLoi {
  path?: string | null; name?: string | null; branch?: string | null; cheDoQuyen?: string; mucNoLuc?: string; model?: string;
  /** Lõi đang cho AI dùng trình duyệt (capability `browser`). */
  choTrinhDuyet?: boolean;
}
export interface InfoLoi {
  pro?: boolean;
  model?: string | null;
  models?: Array<{
    id: string; ten: string; mo: string; dungDuoc: boolean; dat?: boolean;
    /** Cổng của model: `rambo` (cổng chính) · `modelapi` · `anthropic` (Claude chính hãng). Máy chủ cũ không khai ⇒ cổng chính. */
    cong?: 'rambo' | 'modelapi' | 'anthropic';
    /** Model cao của cổng chính hãng, chưa có vé ⇒ 🔒, chọn là hỏi mật khẩu. */
    canMoKhoa?: boolean;
    mienPhi?: boolean;
    hang?: 'free' | 'cao';
  }>;
  mucNoLuc?: Array<{ id: string; ten: string; buoc: number; viecPhu: number }>;
}

/** Một cổng trong lời mời nâng cấp (`CONG_CHINH_HONG_FREE.cacCong`, hoặc `agent:congAnthropic`). */
export interface CongNangCap {
  cong: 'anthropic' | 'modelapi';
  ten: string;
  /** Quản trị đã đặt mật khẩu cổng này chưa (chưa ⇒ người thường không mở được). */
  daBat: boolean;
  /** Chưa có vé hợp lệ ⇒ phải nhập mật khẩu. */
  canMatKhau: boolean;
  models: Array<{ id: string; ten: string; mo: string; dat?: boolean; dungDuoc: boolean }>;
}

export type MucBang =
  | { id: number; loai: 'chao' }
  | { id: number; loai: 'nguoi'; text: string; luc: number; soAnh: number }
  | { id: number; loai: 'may'; text: string }
  | {
    id: number; loai: 'tool'; ten: string; tomTat: string; duongDan?: string; lenh?: string | null;
    ra?: string; diff?: DuLieuDiff; hong: boolean; moRong: boolean; chiTiet?: string;
    /** Tham số chính (lõi đợt 3 gửi kèm) — `● Navigate(cuongthai.com/work)`. */
    thamSo?: string;
    /** Các lời gọi LIÊN TIẾP cùng tool chỉ-đọc được gom lại (`● Read 3 pages`). */
    nhom?: Array<{ thamSo?: string; tomTat: string; hong: boolean; chiTiet?: string }>;
    /** Đợt 5: tool CT Work — bảng GỌN (markdown) hiện khi mở rộng, thay cho JSON thô. */
    xemGon?: string;
  }
  /** Đợt 5: `LF-123` trong tin ⇒ lõi đã đính kèm tóm tắt thẻ (chip 📎). */
  | { id: number; loai: 'dinhKem'; khoa: string[] }
  | { id: number; loai: 'duyet'; tieuDe: string; dongY: boolean; /** Dòng TRẢ LỜI thẻ hỏi — không phải "Allowed". */ traLoi?: boolean }
  | { id: number; loai: 'keHoach'; viec: ViecKeHoach[] }
  | { id: number; loai: 'heThong'; text: string }
  | { id: number; loai: 'thongBao'; text: string; muc: 'info' | 'loi' | 'canh' | 'ok' }
  | { id: number; loai: 'ketLuot'; luc: number; thoiLuong: number; ghiChu: string }
  | { id: number; loai: 'loi'; text: string; ma?: string }
  /** Lệnh `!` người dùng tự chạy (không qua AI). */
  | { id: number; loai: 'shell'; lenh: string; ra: string; ma: number | null; giay: number; moRong: boolean; biHuy?: boolean };

/** Phân phối Omit lên từng nhánh của union (Omit thường gộp mất nhánh). */
type BoId<T> = T extends unknown ? Omit<T, 'id'> : never;
export type MucMoi = BoId<MucBang>;

export interface ToolDangChay { id: string; ten: string; lenh: string | null; ra: string; batDau: number; thamSo?: string }

export interface ChoDuyet {
  id: string;
  loai: 'xinPhep' | 'xinPhepLenh' | 'xinPhepMcp' | 'xinPhepGit' | 'xinPhepNote';
  duongDan?: string; taoMoi?: boolean; diff?: DuLieuDiff;
  lenh?: string; phanLoai?: { muc: 'thuong' | 'cankiem' | 'nguyhiem'; lyDo: string[]; choNho: boolean };
  server?: string; tool?: string; args?: string;
  viec?: string; chiTiet?: string;
  /** Đợt 3: tiền tố gợi ý ("Luôn cho phép `npm test …`"); thẻ của agent phụ ghi. */
  tienTo?: string; phuId?: string;
  /** Đợt 5: GHI lên CT Work — thẻ nào, việc gì, nội dung gì. */
  xemTruoc?: { the: string | null; viec: string; noiDung: string };
  ctwork?: boolean;
}

/** Đợt 3: agent hỏi bằng lựa chọn (`hoi_nguoi_dung`). */
export interface CauHoiLuaChon { cauHoi: string; tieuDe?: string; luaChon: Array<{ nhan: string; moTa?: string }>; nhieu?: boolean }

/** Mục ghi lại cho /export, /rewind (cùng hình `MucGhi` của `lenhGach.ts`). */
export interface MucGhi { kieu: string; text?: string; ten?: string; tomTat?: string; anh?: string[]; [k: string]: unknown }

export interface TrangThaiChat {
  bang: MucBang[];
  /** Đổi khi /clear — `<Static>` gắn `key` này để vẽ lại từ đầu. */
  khoaBang: number;
  dangChay: boolean;
  batDauLuot: number;
  pha: Pha;
  toolDang: string;
  toolCuoi: string;
  buoc: { nay: number; tran: number } | null;
  chuDangViet: string;
  toolChay: ToolDangChay[];
  choDuyet: ChoDuyet[];
  keHoach: ViecKeHoach[];
  fileDaSua: Record<string, { them: number; bo: number }>;
  tienPhien: number;
  soFileDaSua: number;
  nguCanh: { phanTram: number; soLuotDaBo: number } | null;
  /** Hạn mức 5 giờ đã dùng (%), lõi báo kèm sự kiện `xong`. */
  hanMucPhanTram: number | null;
  /** Thời điểm kết thúc lượt gần nhất + thời lượng — để báo thông báo lượt dài. */
  luotCuoi: { luc: number; thoiLuong: number; loi: boolean } | null;
  muc: MucGhi[];
  tieuDe: string;
  cauHoiCuoi: string;
  choDuyetKeHoach: boolean;
  /** Lượt /plan vừa xong ⇒ hiện câu hỏi "Làm theo kế hoạch?". */
  hoiDuyetKeHoach: boolean;
  daCompact: boolean;
  /** ctrl+o: in đầy đủ đầu ra tool thay vì vài dòng cuối. */
  chiTiet: boolean;
  /** Lỗi cuối cần giao diện xử lý thêm (RAMBO_BAO_TRI, 401…). Giao diện đọc xong thì xoá. */
  loiCanXuLy: { ma: string; thongDiep: string; daBat?: boolean } | null;
  /** Đang ở khung `nghi` (model nghĩ, chữ ẩn) — dòng trạng thái nói thẳng "Đang suy nghĩ" tới sự kiện kế tiếp. */
  nghiThat: boolean;
  /** Cổng chính hỏng ⇒ máy chủ tự sang CuongMini Free và mời chọn cổng mạnh hơn. Giao diện mời SAU lượt (lượt vẫn đang chạy ở Free). */
  moiCong: { cacCong: CongNangCap[] } | null;
  /** Đã mở lời mời chọn cổng trong phiên này (mời tự động một lần; sau đó nhắc /gateway). */
  daMoiCong: boolean;
  /** Cổng chính sống lại (`RAMBO_SONG_LAI`) ⇒ hỏi quay về hay ở lại cổng phụ. */
  hoiQuayVe: string | null;
  ws: WsLoi | null;
  info: InfoLoi | null;
  lenhDuAn: Array<{ ten: string; mo: string; than: string }>;
  /** Đã báo "đã mở cửa sổ trình duyệt riêng" trong phiên này chưa (chỉ báo một lần). */
  daBaoTrinhDuyet: boolean;
  /** Agent phụ (`giao_viec_phu`) đang chạy / đã xong — bảng kiểu Claude Code. */
  agentPhu: AgentPhu[];
  /** Lệnh nền (`chay_lenh_nen`) — đếm vào "N shells". */
  lenhNen: LenhNen[];
  /** Nhóm tool chỉ-đọc ĐANG GOM (chưa in) — in khi có mục khác chen vào hoặc hết lượt. */
  toolCho: Extract<MucBang, { loai: 'tool' }> | null;
  /** Token RA của lượt (từ `tienTrinh` của lõi) + số ký tự đã chảy (ước lượng khi lõi cũ). */
  tokenRa: number;
  kyTuRa: number;
  /** Lượt này đã nhận `tienTrinh` (lõi mới) ⇒ tiền đã cộng theo vòng. */
  coTienTrinh: boolean;
  tienLuot: number;
  /** Đã nhắc "ngữ cảnh sắp đầy" ở mốc nào (80 / 95) — mỗi mốc nhắc một lần. */
  daNhacNguCanh: number;
  /** Đợt 3: thẻ hỏi lựa chọn đang chờ trả lời. */
  hoi: { id: string; cauHoi: CauHoiLuaChon[] } | null;
  /** Đợt 3: việc đang CHỜ + các HẸN quay lại (toàn bộ danh sách, lõi gửi mỗi lần đổi). */
  henCho: { cho: Array<{ id: string; moTa: string; batDau: number; hetLuc: number }>; hen: Array<{ id: string; lyDo: string; luc: number; phut: number; lap: boolean; conLai: number }> };
}

export function trangThaiDau(): TrangThaiChat {
  return {
    bang: [], khoaBang: 0, dangChay: false, batDauLuot: 0, pha: 'cho', toolDang: '', toolCuoi: '', buoc: null,
    chuDangViet: '', toolChay: [], choDuyet: [], keHoach: [], fileDaSua: {}, tienPhien: 0, soFileDaSua: 0,
    nguCanh: null, hanMucPhanTram: null, luotCuoi: null, muc: [], tieuDe: '', cauHoiCuoi: '', choDuyetKeHoach: false, hoiDuyetKeHoach: false,
    daCompact: false, chiTiet: false, loiCanXuLy: null, nghiThat: false, moiCong: null, daMoiCong: false, hoiQuayVe: null, ws: null, info: null, lenhDuAn: [], daBaoTrinhDuyet: false, agentPhu: [], lenhNen: [],
    toolCho: null, tokenRa: 0, kyTuRa: 0, coTienTrinh: false, tienLuot: 0, hoi: null, henCho: { cho: [], hen: [] }, daNhacNguCanh: 0,
  };
}

/** Mã lỗi thật ra là THÔNG BÁO (đổi cổng, tự compact…) — không kết lượt. */
export const LOI_THONG_BAO = new Set(['DOI_CONG', 'KHOI_PHUC', 'LAM_TIEP', 'COMPACT', 'DOI_CHE_DO', 'TU_GO_ANH', 'CONG_CHINH_HONG_FREE', 'RAMBO_SONG_LAI']);
/** Lỗi cổng Claude chính hãng giao diện phải xử lý thêm (hỏi mật khẩu / mời modelapi). */
export const LOI_CONG_ANTHROPIC = new Set(['CONG_ANTHROPIC_KHOA', 'CONG_ANTHROPIC_HET_HAN_MUC', 'CONG_ANTHROPIC_HET_KEY']);
export const LOI_HET_PHIEN = new Set(['401', 'UNAUTHORIZED', 'NO_SESSION']);
const TRAN_RA = 20_000;

export class KhoChat {
  S: TrangThaiChat = trangThaiDau();
  private dem = 0;
  private nguoiNghe = new Set<() => void>();
  private hen: NodeJS.Timeout | null = null;
  phienBan = 0;
  /** `false` ở chế độ in (-p): không có menu ⇒ không hứa "sẽ mời chọn cổng". */
  coGiaoDien = true;
  /** `true` trong test: báo ngay, không gộp. */
  constructor(private baoNgay = false) {}

  nghe(f: () => void): () => void {
    this.nguoiNghe.add(f);
    return () => { this.nguoiNghe.delete(f); };
  }

  /** Gộp các lần đổi trong ~33ms (chữ chảy vài chục mẩu/giây) thành một lần vẽ. */
  bao(ngay = false): void {
    if (this.baoNgay || ngay) { this.phat(); return; }
    if (this.hen) return;
    this.hen = setTimeout(() => this.phat(), 33);
  }

  private phat(): void {
    if (this.hen) { clearTimeout(this.hen); this.hen = null; }
    this.phienBan += 1;
    for (const f of this.nguoiNghe) f();
  }

  them(m: MucMoi): void {
    this.dayNhom();
    this.themTho(m);
  }

  private themTho(m: MucMoi): void {
    this.dem += 1;
    this.S.bang = [...this.S.bang, { ...m, id: this.dem } as MucBang];
  }

  /** In nhóm tool đang gom (nếu có) vào bảng ghi. */
  dayNhom(): void {
    const g = this.S.toolCho;
    if (!g) return;
    this.S.toolCho = null;
    const { id: _bo, ...con } = g;
    this.themTho(con as MucMoi);
  }

  /** Câu trả lời của lệnh `/` chạy CỤC BỘ — không vào hội thoại gửi model. */
  traLoi(text: string): void { this.them({ loai: 'heThong', text }); this.bao(true); }
  thongBao(text: string, muc: 'info' | 'loi' | 'canh' | 'ok' = 'info'): void { this.them({ loai: 'thongBao', text, muc }); this.bao(true); }

  /**
   * Đợt 4 — tin gõ GIỮA lượt đã được lõi nhận (`agent:chenTin`): in như tin người dùng (đánh dấu ↳)
   * nhưng KHÔNG mở lượt mới; model đọc nó ở mốc tool kế tiếp (sự kiện `daChen`).
   */
  themChen(text: string, bayGio = Date.now()): void {
    this.chotChu();
    this.them({ loai: 'nguoi', text: `↳ ${text}`, luc: bayGio, soAnh: 0 });
    this.S.muc.push({ kieu: 'nguoi', text, luc: bayGio });
    this.bao(true);
  }

  /** Bắt đầu một lượt: in tin người dùng, bật trạng thái chạy. */
  batDauLuot(hienThi: string, soAnh: number, cauGui: string, bayGio = Date.now()): void {
    const S = this.S;
    this.them({ loai: 'nguoi', text: hienThi, luc: bayGio, soAnh });
    S.muc.push({ kieu: 'nguoi', text: hienThi, luc: bayGio });
    if (!S.tieuDe) S.tieuDe = hienThi.replace(/\s+/g, ' ').trim().slice(0, 80);
    S.cauHoiCuoi = cauGui;
    S.dangChay = true;
    S.batDauLuot = bayGio;
    S.tokenRa = 0;
    S.kyTuRa = 0;
    S.coTienTrinh = false;
    S.tienLuot = 0;
    // Kế hoạch của lượt TRƯỚC đã xong hết ⇒ cất đi: không treo "☒ ☒ ☒" cũ dưới một việc mới không liên quan.
    if (S.keHoach.length && S.keHoach.every((v) => v.trangThai === 'xong')) S.keHoach = [];
    S.pha = 'cho';
    S.buoc = null;
    S.chuDangViet = '';
    S.hoiDuyetKeHoach = false;
    this.bao(true);
  }

  /** Đẩy chữ đang chảy thành mục cố định (trước tool, thẻ duyệt, cuối lượt). */
  private chotChu(): void {
    const S = this.S;
    const t = S.chuDangViet;
    S.chuDangViet = '';
    if (!t.trim()) return;
    this.them({ loai: 'may', text: t });
    S.muc.push({ kieu: 'may', text: t });
  }

  /** Cộng tiền ĐÃ TIÊU của lượt đang dở (từ `tienTrinh`) vào tiền của việc — khi lượt kết thúc không qua `xong`. */
  private chotTienLuot(): number {
    const t = this.S.tienLuot;
    this.S.tienPhien += t;
    this.S.tienLuot = 0;
    return t;
  }

  /** Kết lượt: tắt trạng thái chạy, in dòng giờ xong + thời lượng (như Claude Code). */
  ketLuot(ghiChu: string, loi = false, bayGio = Date.now()): void {
    const S = this.S;
    const tong = S.batDauLuot ? bayGio - S.batDauLuot : 0;
    this.dayNhom();
    S.dangChay = false;
    S.pha = 'cho';
    S.toolDang = '';
    S.toolCuoi = '';
    S.batDauLuot = 0;
    S.toolChay = [];
    S.choDuyet = [];
    S.hoi = null;
    dongAgentTreo(S, bayGio);
    S.luotCuoi = { luc: bayGio, thoiLuong: tong, loi };
    if (!loi) this.them({ loai: 'ketLuot', luc: bayGio, thoiLuong: tong, ghiChu });
  }

  /**
   * Cắt bảng ghi từ câu hỏi thứ `n` (đếm từ 1) trở đi — sau `/rewind`. Đổi
   * `khoaBang` để `<Static>` vẽ lại từ đầu (phần đã in không xoá được từng dòng,
   * nên giao diện xoá màn hình rồi in lại bảng đã cắt).
   */
  catBangTuCau(n: number): boolean {
    const S = this.S;
    let dem = 0;
    const i = S.bang.findIndex((m) => m.loai === 'nguoi' && ++dem === n);
    if (i < 0) return false;
    S.bang = S.bang.slice(0, i);
    S.khoaBang += 1;
    let dem2 = 0;
    const j = S.muc.findIndex((m) => m.kieu === 'nguoi' && ++dem2 === n);
    if (j >= 0) S.muc.splice(j);
    this.bao(true);
    return true;
  }

  /** In lại toàn bộ bảng ghi (sau khi xoá màn hình / đổi theme). */
  veLai(): void { this.S.khoaBang += 1; this.bao(true); }

  /** Một sự kiện của lõi. */
  xuLy(e: { loai: string; [k: string]: unknown }, bayGio = Date.now()): void {
    const S = this.S;
    // Bảng agent phụ / lệnh nền. Lệnh nền chỉ biết CÂU LỆNH qua thẻ xin phép trước đó (đã gắn vào tool đang chạy).
    const choPhu = e.loai === 'tool' && e.ten === 'chay_lenh_nen' ? { ...e, lenhNen: S.toolChay.find((t) => t.id === e.id)?.lenh ?? '' } : e;
    if (apSuKienPhu(S, choPhu, bayGio)) { this.bao(); return; }
    S.nghiThat = e.loai === 'nghi';
    switch (e.loai) {
      case 'nghi':
        S.dangChay = true;
        if (!S.batDauLuot) S.batDauLuot = bayGio;
        if (S.pha !== 'duyet') S.pha = 'nghi';
        break;
      case 'batDau':
        S.dangChay = true;
        if (!S.batDauLuot) S.batDauLuot = bayGio;
        if (S.pha === 'cho' || S.pha === 'tool' || S.pha === 'viet') S.pha = 'nghi';
        if (typeof e.buoc === 'number') S.buoc = { nay: e.buoc, tran: Number(e.tranBuoc ?? 0) };
        break;
      case 'chu':
        S.pha = 'viet';
        S.chuDangViet += String(e.delta ?? '');
        S.kyTuRa += String(e.delta ?? '').length;
        break;
      case 'tienTrinh': {
        // Lõi đợt 3: sau MỖI vòng — token ra thật + ngữ cảnh % từ usage thật (không đợi hết lượt).
        S.tokenRa += Number(e.tokenRa ?? 0);
        const nc = e.nguCanh as { phanTram?: number; soLuotDaBo?: number } | undefined;
        if (nc && typeof nc.phanTram === 'number') { S.nguCanh = { phanTram: nc.phanTram, soLuotDaBo: Number(nc.soLuotDaBo ?? 0) }; this.nhacNguCanh(); }
        // Tiền của vòng — chỉ để hiện SỐNG trong lúc chạy; tổng thật của lượt đến cùng `xong`.
        S.coTienTrinh = true;
        S.tienLuot += Number(e.tienUsd ?? 0);
        break;
      }
      case 'toolBatDau': {
        this.chotChu();
        if (!S.daBaoTrinhDuyet && /^web_/.test(String(e.ten ?? ''))) {
          // Một cửa sổ Chrome/Edge sắp hiện lên — nói trước để người dùng không giật mình (và yên tâm về hồ sơ).
          S.daBaoTrinhDuyet = true;
          this.them({ loai: 'thongBao', text: L('🌐 Đã mở cửa sổ trình duyệt riêng của CuongMini (hồ sơ riêng, không đụng Chrome của bạn)', '🌐 Opened CuongMini\'s own browser window (separate profile — your Chrome is untouched)'), muc: 'info' });
        }
        S.pha = 'tool';
        S.toolDang = String(e.ten ?? '');
        S.toolChay = [...S.toolChay, { id: String(e.id ?? ''), ten: S.toolDang, lenh: null, ra: '', batDau: bayGio, ...(typeof e.thamSo === 'string' ? { thamSo: e.thamSo } : {}) }];
        break;
      }
      case 'tool': {
        this.chotChu();
        S.pha = 'nghi';
        const ten = String(e.ten ?? '');
        S.toolCuoi = ten;
        const tomTat = String(e.tomTat ?? '');
        // Tóm tắt LÚC GIAO việc phụ (lõi phát không id, nhiệm vụ cắt 60 ký tự): bảng agent phụ đã nhận — in vào
        // bảng ghi là một khối "● Task ⎿ nhiệm vụ…" trùng với dòng tool thật in khi agent phụ xong (QA 18/10).
        if ((ten === 'giao_viec_phu' || ten === 'giao_viec_ghi') && !e.id) break;
        S.muc.push({ kieu: 'tool', ten, tomTat });
        const i = e.id ? S.toolChay.findIndex((t) => t.id === e.id) : -1;
        const dang = i >= 0 ? S.toolChay[i] : undefined;
        if (i >= 0) S.toolChay = S.toolChay.filter((_, k) => k !== i);
        const chiTiet = typeof e.chiTiet === 'string' ? e.chiTiet : undefined;
        const tach = TOOL_LENH.has(ten) ? tachKetQuaLenh(chiTiet) : { lenh: null, ra: '' };
        const diff = e.diff as DuLieuDiff | undefined;
        const duongDan = typeof e.duongDan === 'string' ? e.duongDan : undefined;
        const hong = coVeHong(tomTat);
        const thamSo = typeof e.thamSo === 'string' ? e.thamSo : dang?.thamSo;
        // Kế hoạch đã có bảng riêng — KHÔNG in thành một dòng tool ("Plan 0/5 việc").
        if (ten === 'cap_nhat_ke_hoach') { S.muc.pop(); break; }
        if (TOOL_GOM.has(ten) && !hong) {
          const motLan = { ...(thamSo ? { thamSo } : {}), tomTat, hong, ...(chiTiet ? { chiTiet } : {}) };
          const g = S.toolCho;
          if (g && g.ten === ten) {
            g.nhom = [...(g.nhom ?? []), motLan];
            g.tomTat = tomTat;
            S.toolCho = { ...g };
          } else {
            this.dayNhom();
            this.dem += 1;
            S.toolCho = {
              id: this.dem, loai: 'tool', ten, tomTat, hong, moRong: S.chiTiet, nhom: [motLan],
              ...(duongDan ? { duongDan } : {}), ...(thamSo ? { thamSo } : {}), ...(chiTiet ? { chiTiet } : {}),
            };
          }
          break;
        }
        if (diff && duongDan && TOOL_GHI.has(ten) && !hong) {
          const cu = S.fileDaSua[duongDan] ?? { them: 0, bo: 0 };
          S.fileDaSua = { ...S.fileDaSua, [duongDan]: { them: cu.them + diff.soThem, bo: cu.bo + diff.soBo } };
        }
        this.them({
          loai: 'tool', ten, tomTat, duongDan, hong, moRong: S.chiTiet, diff, ...(thamSo ? { thamSo } : {}),
          lenh: tach.lenh ?? dang?.lenh ?? null,
          ra: TOOL_LENH.has(ten) ? (tach.ra || dang?.ra || '') : undefined,
          chiTiet: TOOL_LENH.has(ten) ? undefined : chiTiet,
          ...(typeof e.xemGon === 'string' && e.xemGon ? { xemGon: e.xemGon } : {}),
        });
        break;
      }
      case 'dinhKemCtwork': {
        const khoa = Array.isArray(e.khoa) ? (e.khoa as unknown[]).filter((x): x is string => typeof x === 'string') : [];
        if (khoa.length) this.them({ loai: 'dinhKem', khoa });
        break;
      }
      case 'lenhRa': {
        const mau = String(e.mau ?? '');
        let i = S.toolChay.length - 1;
        while (i >= 0 && !TOOL_LENH.has(S.toolChay[i]!.ten)) i -= 1;
        if (i < 0) {
          S.toolChay = [...S.toolChay, { id: '', ten: 'run_command', lenh: null, ra: '', batDau: bayGio }];
          i = S.toolChay.length - 1;
        }
        const t = S.toolChay[i]!;
        if (S.pha !== 'duyet') { S.pha = 'tool'; S.toolDang = t.ten; }
        S.toolChay = S.toolChay.map((x, k) => (k === i ? { ...t, ra: (t.ra + mau).slice(-TRAN_RA) } : x));
        break;
      }
      case 'xinPhep': case 'xinPhepLenh': case 'xinPhepMcp': case 'xinPhepGit': case 'xinPhepNote': {
        this.chotChu();
        S.pha = 'duyet';
        const d = { ...(e as unknown as ChoDuyet), loai: e.loai as ChoDuyet['loai'] };
        if (!S.choDuyet.some((x) => x.id === d.id)) S.choDuyet = [...S.choDuyet, d];
        if (e.loai === 'xinPhepLenh') {
          // Lệnh chỉ được biết lúc xin phép — gắn vào dòng "Lệnh(…)" đang chạy.
          let k = S.toolChay.length - 1;
          while (k >= 0 && !TOOL_LENH.has(S.toolChay[k]!.ten)) k -= 1;
          if (k >= 0) S.toolChay = S.toolChay.map((x, j) => (j === k ? { ...x, lenh: String(e.lenh ?? '') } : x));
        }
        break;
      }
      case 'xongXinPhep': {
        // Thẻ duyệt lệnh: duyệt xong thì lệnh CHẠY TIẾP — pha là "tool", không phải "đang nghĩ".
        const dangChayTool = S.toolChay[S.toolChay.length - 1];
        if (dangChayTool) { S.pha = 'tool'; S.toolDang = dangChayTool.ten; } else S.pha = 'nghi';
        const d = S.choDuyet.find((x) => x.id === e.id);
        S.choDuyet = S.choDuyet.filter((x) => x.id !== e.id);
        if (d) this.them({ loai: 'duyet', tieuDe: tieuDeDuyet(d), dongY: e.dongY === true });
        break;
      }
      /* ── Đợt 3 ── */
      case 'hoiLuaChon':
        this.chotChu();
        S.pha = 'duyet';
        S.hoi = { id: String(e.id ?? ''), cauHoi: Array.isArray(e.cauHoi) ? e.cauHoi as CauHoiLuaChon[] : [] };
        break;
      case 'xongHoi':
        if (S.hoi?.id === e.id) {
          const tt = String(e.tomTat ?? '');
          const boQua = !tt || tt === 'không trả lời'; // i18n-bo-qua: chữ của lõi
          this.them({ loai: 'duyet', traLoi: true, dongY: !boQua, tieuDe: boQua ? L('Bạn bỏ qua câu hỏi', 'You skipped the question') : `${L('Bạn trả lời', 'You answered')}: ${tt}` });
          S.hoi = null;
          S.pha = 'nghi';
        }
        break;
      case 'henCho': {
        const cho = Array.isArray(e.cho) ? e.cho as TrangThaiChat['henCho']['cho'] : [];
        const hen = Array.isArray(e.hen) ? e.hen as TrangThaiChat['henCho']['hen'] : [];
        S.henCho = { cho, hen };
        break;
      }
      case 'tinPhien': {
        const tu = (e.tu ?? {}) as { id?: string; ten?: string; noi?: string };
        const noiDung = String(e.noiDung ?? '');
        this.them({ loai: 'heThong', text: `📨 **${L('Tin từ phiên', 'Message from session')} ${tu.ten ?? '?'}** (${tu.noi ?? ''} · \`${tu.id ?? ''}\`) — ${L('agent đọc ở lượt kế', 'the agent reads it next turn')}\n\n${noiDung.split('\n').slice(0, 12).map((d) => `> ${d}`).join('\n')}` });
        this.bao(true);
        return;
      }
      case 'daChen': {
        // Đợt 4: lõi đã nối tin gõ giữa lượt vào lượt đang chạy (model đọc ngay ở vòng sau).
        this.them({ loai: 'thongBao', muc: 'ok', text: e.cach === 'cuoiLuot'
          ? L('↳ Đã chèn tin của bạn — agent làm tiếp với nó', '↳ Your message was inserted — the agent continues with it')
          : L('↳ Đã chèn tin của bạn vào lượt đang chạy (sau tool vừa xong)', '↳ Your message was inserted into the running turn (after the last tool)') });
        this.bao(true);
        return;
      }
      case 'tuDanhThuc': {
        // App tự mở lượt theo lời hẹn của agent — vẽ như một câu hỏi (dòng đầu) + bật trạng thái chạy.
        const cau = String(e.cauHoi ?? '');
        this.batDauLuot(`⏰ ${dichDanhThuc(cau.split('\n')[0] ?? cau)}`, 0, cau, bayGio);
        return;
      }
      case 'keHoach':
        this.chotChu();
        S.keHoach = Array.isArray(e.viec) ? (e.viec as ViecKeHoach[]).map((v) => ({ ten: String(v.ten), trangThai: String(v.trangThai) })) : [];
        break;
      case 'xong': {
        this.chotChu();
        // Lõi đợt 3: `xong.tienUsd` = TỔNG cả lượt (mọi vòng + agent phụ). Lõi cũ chỉ gửi vòng cuối
        // (lỗi đếm thiếu 18/10: hiện ~$0.25 trong khi sổ máy chủ 3,42 $) ⇒ lấy số lớn hơn.
        const tongLuot = Math.max(Number(e.tienUsd ?? 0), S.tienLuot);
        S.tienPhien += tongLuot;
        S.tienLuot = 0;
        S.soFileDaSua = Number(e.soFileDaSua ?? S.soFileDaSua);
        const nc = e.nguCanh as { phanTram?: number; soLuotDaBo?: number } | undefined;
        if (nc && typeof nc.phanTram === 'number') { S.nguCanh = { phanTram: nc.phanTram, soLuotDaBo: Number(nc.soLuotDaBo ?? 0) }; this.nhacNguCanh(); }
        const hm = e.hanMuc as { phanTram?: number } | null | undefined;
        if (hm && typeof hm.phanTram === 'number') S.hanMucPhanTram = hm.phanTram;
        const soFile = Object.keys(S.fileDaSua).length || S.soFileDaSua;
        const tien = tongLuot;
        const ghi = [soFile ? L(`${soFile} file đã sửa`, `${soFile} file${soFile > 1 ? 's' : ''} changed`) : '', tien > 0 ? tienGon(tien) : ''].filter(Boolean).join(' · ');
        this.ketLuot(ghi, false, bayGio);
        if (S.choDuyetKeHoach) { S.choDuyetKeHoach = false; S.hoiDuyetKeHoach = true; }
        break;
      }
      case 'loi': {
        this.chotChu();
        const ma = String(e.ma ?? '');
        const thongDiep = String(e.thongDiep ?? L('Có lỗi.', 'Something went wrong.'));
        if (LOI_THONG_BAO.has(ma)) {
          if (ma === 'COMPACT') S.daCompact = true;
          if (ma === 'CONG_CHINH_HONG_FREE') {
            // Lượt VẪN CHẠY (ở Free) — chỉ báo + ghi lời mời; giao diện mở lời mời khi lượt xong.
            this.them({ loai: 'thongBao', text: L(thongDiep, 'The main gateway is having problems — switching to the CuongMini Free model automatically.'), muc: 'info' });
            const cacCong = Array.isArray(e.cacCong) ? (e.cacCong as CongNangCap[]) : [];
            if (e.moiNangCap !== false && cacCong.length && this.coGiaoDien) {
              S.moiCong = { cacCong };
              this.them({
                loai: 'thongBao', muc: 'info',
                text: S.daMoiCong
                  ? L('↳ Gõ /gateway để chọn cổng mạnh hơn (Claude chính hãng / modelapi).', '↳ Type /gateway to pick a stronger gateway (official Claude / modelapi).')
                  : L('↳ Lượt này vẫn chạy tiếp. Xong lượt, CuongMini sẽ mời bạn chọn cổng mạnh hơn (Claude chính hãng / modelapi) — hoặc gõ /gateway bất cứ lúc nào.', '↳ This turn keeps running. When it finishes you can pick a stronger gateway (official Claude / modelapi) — or type /gateway any time.'),
              });
            }
            break;
          }
          if (ma === 'RAMBO_SONG_LAI') {
            S.hoiQuayVe = thongDiep;
            this.them({ loai: 'thongBao', text: L(thongDiep, 'The CuongMini main gateway is back. Continue on the main gateway or stay on the current one?'), muc: 'info' });
            break;
          }
          this.them({ loai: 'thongBao', text: thongDiep, muc: 'info' });
          break;
        }
        // Lượt hỏng giữa chừng: các vòng TRƯỚC đó đã tính tiền ở máy chủ ⇒ vẫn cộng vào việc (/cost, chân trang).
        this.chotTienLuot();
        this.ketLuot('', true, bayGio);
        S.choDuyetKeHoach = false;
        S.muc.push({ kieu: 'loi', text: thongDiep });
        this.them({ loai: 'loi', text: thongDiep, ma: ma || undefined });
        if (ma === 'RAMBO_BAO_TRI' || ma === 'PRO_REQUIRED' || LOI_HET_PHIEN.has(ma) || LOI_CONG_ANTHROPIC.has(ma)) {
          S.loiCanXuLy = { ma, thongDiep, ...(typeof e.daBat === 'boolean' ? { daBat: e.daBat } : {}) };
        }
        break;
      }
      case 'huy': {
        this.chotChu();
        S.choDuyetKeHoach = false;
        // Dừng giữa lượt (esc): lõi không gửi `xong` ⇒ tiền các vòng đã chạy (đến qua `tienTrinh`) phải cộng ở đây —
        // trước đây mất trắng: /cost báo ~$0.000 trong khi sổ máy chủ ghi 0,84 $ (QA 18/10).
        const tien = this.chotTienLuot();
        this.ketLuot([L('đã dừng', 'interrupted'), tien > 0 ? tienGon(tien) : ''].filter(Boolean).join(' · '), false, bayGio);
        break;
      }
      case 'daXoa':
        this.xoaBang();
        break;
      default:
        return;
    }
    this.bao();
  }

  /**
   * NHẮC NGỮ CẢNH SẮP ĐẦY (đợt 3 — như Claude Code "Context left until auto-compact"): mốc 80% và 95%,
   * mỗi mốc một lần mỗi việc. Không tự /compact giữa lượt — chỉ gợi ý.
   */
  private nhacNguCanh(): void {
    const p = this.S.nguCanh?.phanTram ?? 0;
    const moc = p >= 95 ? 95 : p >= 80 ? 80 : 0;
    if (!moc || moc <= this.S.daNhacNguCanh) return;
    this.S.daNhacNguCanh = moc;
    this.them({ loai: 'thongBao', muc: 'canh', text: L(`Ngữ cảnh đã dùng ${p}% — gõ /compact (kèm điều cần giữ) để tóm tắt phần cũ, hoặc /clear bắt đầu việc mới. Máy chủ sẽ tự cắt lượt cũ khi đầy.`, `Context is ${p}% full — run /compact (with what to keep) to summarize older turns, or /clear to start fresh. The server trims old turns automatically when full.`) });
  }

  /** /clear (hoặc lõi xoá hội thoại): dọn bảng + số liệu của việc. */
  xoaBang(): void {
    const S = this.S;
    S.bang = [];
    S.khoaBang += 1;
    S.muc = [];
    S.tieuDe = '';
    S.tienPhien = 0;
    S.soFileDaSua = 0;
    S.fileDaSua = {};
    S.keHoach = [];
    S.daCompact = false;
    S.nguCanh = null;
    S.daNhacNguCanh = 0;
    S.chuDangViet = '';
    S.hoiDuyetKeHoach = false;
    S.agentPhu = [];
    S.toolCho = null;
    S.lenhNen = S.lenhNen.filter((x) => x.dangChay);
    this.bao(true);
  }
}

export function tieuDeDuyet(d: ChoDuyet): string {
  const phu = d.phuId ? `🤖 ${L('Agent phụ', 'Subagent')} · ` : '';
  return phu + tieuDeDuyetGoc(d);
}

function tieuDeDuyetGoc(d: ChoDuyet): string {
  switch (d.loai) {
    case 'xinPhep': return `${d.taoMoi ? L('Tạo file', 'Create file') : L('Sửa file', 'Edit file')} ${d.duongDan ?? ''}`;
    case 'xinPhepLenh': {
      const tin = /^📨 → (.*?):/u.exec(d.lenh ?? '');
      if (tin) return `${L('Nhắn phiên', 'Message to')} ${tin[1]}`;
      return `${L('Chạy lệnh', 'Run command')} ${(d.lenh ?? '').split('\n')[0]}`;
    }
    case 'xinPhepMcp': return d.xemTruoc ? `CT Work · ${d.xemTruoc.viec}${d.xemTruoc.the ? ` → ${d.xemTruoc.the}` : ''}` : `${L('Công cụ', 'Tool')} ${d.server ?? ''} · ${d.tool ?? ''}`;
    case 'xinPhepGit': return tenViecGit(d.viec);
    case 'xinPhepNote': return d.viec === 'tao' ? L('Tạo ghi chú', 'Create note') : L('Ghi vào ghi chú', 'Write to note');
    default: return L('Yêu cầu', 'Request');
  }
}

/** Tên việc git trên thẻ duyệt. */
export function tenViecGit(viec: string | undefined): string {
  switch (viec) {
    case 'commit': return 'Commit';
    case 'pr': return L('Đẩy nhánh + mở Pull Request', 'Push branch + open pull request');
    case 'day': return L('Đẩy lên GitHub', 'Push to GitHub');
    case 'cai': return L('Cài công cụ', 'Install tool');
    case 'gop': return L('Gộp thay đổi của agent phụ vào dự án', 'Merge the subagent\'s changes into the project');
    default: return 'Git';
  }
}
