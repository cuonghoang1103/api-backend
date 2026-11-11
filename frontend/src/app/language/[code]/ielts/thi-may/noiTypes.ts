/**
 * Kiểu dữ liệu phòng thi SPEAKING (giám khảo AI) — 12/11/2026. HỢP ĐỒNG CỐ ĐỊNH với trung tâm thi (`ThiMay.tsx`):
 *   <PhongNoi de={DeNoi} cheDo="thi" | "luyen" onXong={(kq: KetQuaNoi) => …} />
 * `onXong` được gọi khi người học bấm "Hoàn tất" trên màn xem lại (sau khi AI chấm xong) — không gọi sớm hơn,
 * để trung tâm thi có thể tháo phòng ngay trong `onXong` mà người học vẫn đã xem được kết quả.
 * Máy chủ: `src/services/ielts/thiNoi.service.ts` · route `/ielts/thi-may/noi/*` (ielts.hoc.routes.ts).
 */
import type { DeNoi } from './de/types';

/** Kết quả trả cho trung tâm thi. */
export type KetQuaNoi = {
  /** Band Speaking tổng (trung bình 4 tiêu chí, làm tròn XUỐNG .5 — mục 4.3). */
  band: number;
  tieuChi: { fc: number; lr: number; gra: number; p: number };
  /** Nhận xét tiếng Việt tổng kết. */
  nhanXet: string;
  banGhi?: { part: 1 | 2 | 3; cau: string; transcript: string }[];
};

export type CheDoNoi = 'thi' | 'luyen';

export type PhongNoiProps = { de: DeNoi; cheDo: CheDoNoi; onXong: (kq: KetQuaNoi) => void };

/* ── Dữ liệu trao đổi với máy chủ ─────────────────────────────────────── */

/** Điểm Azure (0–100) của MỘT câu — 45 giây đầu, chấm unscripted. */
export type PhatAmCau = { chinhXac: number; troiChay: number; tong: number; soTu: number };

/** Máy chủ trả sau mỗi câu (`POST /ielts/thi-may/noi/luot`). */
export type KetQuaLuotNoi = {
  transcript: string;
  imLang: boolean;
  giay: number;
  phatAm: PhatAmCau | null;
  lyDo?: 'stt_unavailable' | 'het_luot_ngay';
};

/** Một câu đã ghi (web giữ; gửi lên khi chấm cả bài — không gửi audio). */
export type BanGhiCau = {
  part: 1 | 2 | 3;
  cau: string;
  transcript: string;
  giay: number;
  phatAm: PhatAmCau | null;
  imLang: boolean;
};

/** Kết quả chấm cả bài (`POST /ielts/thi-may/noi/cham` → poll). */
export type KetQuaChamNoi = {
  band: number;
  tieuChi: { fc: number; lr: number; gra: number; p: number };
  nhanXetTieuChi: { fc: string; lr: string; gra: string; p: string };
  nhanXet: string;
  loi: { part: 1 | 2 | 3; goc: string; sua: string; vi: string }[];
  noiLai: { part: 1 | 2 | 3; cau: string; goc: string; tot: string }[];
  pNguon: 'azure+ai' | 'ai' | 'im-lang';
  banGhi: BanGhiCau[];
  /** id dòng `ielts_cdt_attempts` (kyNang 'noi') máy chủ đã lưu; null nếu lưu hỏng. */
  luotId: number | null;
};

/* ── Xếp lớp (Việc 2) ─────────────────────────────────────────────────── */

export type XepLopHienHanh = { tap: number; ngay: number; overall: number | null; tuNgay: string; lyDo: string[]; duongOnKem: string[] };
export type XepLopDong = {
  id: number; deId: string | null; sangLoc: number; nghe: number | null; doc: number | null; viet: number | null; noi: number | null;
  overall: number | null; tap: number; ngay: number; tapHieuLuc: number; ngayHieuLuc: number; lyDo: string[]; duongOnKem: string[]; createdAt: string;
};
export type XepLopTraVe = { hienHanh: XepLopHienHanh | null; lichSu: XepLopDong[]; duocLamLai: boolean; conLaiNgay: number; lamLaiTu: string | null };
export type XepLopLuuTraVe = {
  id: number; tap: number; ngay: number; lyDo: string[]; duongOnKem: string[]; overall: number | null;
  band: { nghe: number | null; doc: number | null; viet: number | null; noi: number | null };
  theoKyNang: 'nghe' | 'doc' | 'viet' | 'noi' | null;
  /** Vị trí hiệu lực sau luật "chỉ đẩy lên"; `giuCu` = lần này thấp hơn nên giữ vị trí cũ. */
  hieuLuc: { tap: number; ngay: number; giuCu: boolean };
  ghiChu?: string;
  createdAt: string;
};
