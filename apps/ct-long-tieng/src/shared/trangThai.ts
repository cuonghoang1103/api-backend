/**
 * Trạng thái hiển thị của một thẻ việc = trạng thái MÁY CHỦ + việc app đang làm TẠI MÁY NÀY (tải lên, tải kết quả
 * về, tải link bằng yt-dlp). Hàm thuần — có test.
 */
import type { TrangThaiMayChu, Viec } from './hopDong';

export type LoaiChip = 'cho' | 'chay' | 'xong' | 'loi' | 'huy';

/** Việc app đang làm cho một việc, ở máy này. */
export interface CucBo {
  taiLen?: { daGui: number; tong: number } | null;
  taiVe?: { daNhan: number; tong: number; tep: string } | null;
  ytdlp?: { phanTram: number | null; buoc: string } | null;
  /** Lỗi xảy ra ở máy này (tải lên / tải về / yt-dlp) — khác `viec.loi` của trạm. */
  loiCucBo?: { loai: 'tai-len' | 'tai-ve' | 'ytdlp'; thongDiep: string } | null;
  daTaiVe?: boolean;
  thuMuc?: string | null;
}

export interface HienThi {
  nhan: string;
  chip: LoaiChip;
  buoc: string;
  /** null ⇒ thanh tiến độ chạy vô định. */
  phanTram: number | null;
  /** Còn đang chạy ở đâu đó (trạm hoặc máy này) ⇒ hỏi máy chủ nhanh hơn. */
  dangChay: boolean;
  /** Việc đã xong hẳn ở trạm (xong/lỗi/huỷ). */
  ketThuc: boolean;
}

const NHAN: Record<TrangThaiMayChu, string> = {
  cho_tai_len: 'Chờ tải lên',
  cho: 'Đang chờ trạm',
  tai: 'Trạm đang tải video',
  lam: 'Đang lồng tiếng',
  xong: 'Xong',
  loi: 'Lỗi',
  huy: 'Đã huỷ',
};

export function nhanTrangThai(t: TrangThaiMayChu): string {
  return NHAN[t] ?? t;
}

const pt = (a: number, b: number) => (b > 0 ? Math.min(100, Math.max(0, Math.round((a / b) * 100))) : null);

export function tinhHienThi(v: Pick<Viec, 'trangThai' | 'buoc' | 'phanTram' | 'loi' | 'ketQua'>, c: CucBo = {}): HienThi {
  const ketThuc = v.trangThai === 'xong' || v.trangThai === 'loi' || v.trangThai === 'huy';

  if (c.ytdlp) {
    return { nhan: 'Đang tải trên máy này', chip: 'chay', buoc: c.ytdlp.buoc, phanTram: c.ytdlp.phanTram, dangChay: true, ketThuc: false };
  }
  if (c.taiLen) {
    return {
      nhan: 'Đang tải lên', chip: 'chay', buoc: 'Gửi video lên máy chủ',
      phanTram: pt(c.taiLen.daGui, c.taiLen.tong), dangChay: true, ketThuc: false,
    };
  }
  if (c.taiVe) {
    return {
      nhan: 'Đang tải về', chip: 'chay', buoc: c.taiVe.tep,
      phanTram: pt(c.taiVe.daNhan, c.taiVe.tong), dangChay: true, ketThuc: false,
    };
  }
  if (c.loiCucBo) {
    const nhan = c.loiCucBo.loai === 'tai-len' ? 'Tải lên lỗi' : c.loiCucBo.loai === 'tai-ve' ? 'Tải về lỗi' : 'Tải trên máy lỗi';
    return { nhan, chip: 'loi', buoc: c.loiCucBo.thongDiep, phanTram: null, dangChay: false, ketThuc: true };
  }

  switch (v.trangThai) {
    case 'xong':
      return {
        nhan: c.daTaiVe ? 'Đã tải về' : v.ketQua.length ? 'Xong — chờ tải về' : 'Xong',
        chip: 'xong', buoc: c.daTaiVe ? 'Có trong Thư viện' : 'Kết quả sẵn sàng',
        phanTram: 100, dangChay: false, ketThuc,
      };
    case 'loi':
      return { nhan: 'Lỗi', chip: 'loi', buoc: v.loi ?? 'Trạm báo lỗi', phanTram: null, dangChay: false, ketThuc };
    case 'huy':
      return { nhan: 'Đã huỷ', chip: 'huy', buoc: '', phanTram: null, dangChay: false, ketThuc };
    case 'cho_tai_len':
      return { nhan: NHAN.cho_tai_len, chip: 'cho', buoc: 'Chờ gửi tệp', phanTram: null, dangChay: true, ketThuc };
    case 'cho':
      return { nhan: NHAN.cho, chip: 'cho', buoc: v.buoc ?? 'Trong hàng đợi', phanTram: null, dangChay: true, ketThuc };
    default:
      return {
        nhan: NHAN[v.trangThai], chip: 'chay', buoc: v.buoc ?? '',
        phanTram: v.phanTram, dangChay: true, ketThuc,
      };
  }
}

/**
 * Trạm báo KHÔNG TẢI ĐƯỢC LINK (YouTube chặn máy nhà…) ⇒ app đề nghị "Tải trên máy này". Trạm viết lỗi bằng chữ
 * (hợp đồng mục 3: "Hãy tải video trên máy bạn rồi kéo vào app"), nên nhận diện theo cụm từ — rộng tay, vì nút
 * chỉ hiện với việc tạo từ LINK, và bấm nhầm thì tệ nhất là tải thêm một lần.
 */
export function laLoiTaiLink(v: Pick<Viec, 'trangThai' | 'url' | 'loi'>): boolean {
  if (v.trangThai !== 'loi' || !v.url || !v.loi) return false;
  const s = v.loi.toLowerCase().normalize('NFC');
  return [
    'tải video trên máy', 'tải trên máy', 'không tải được', 'khong tai duoc', 'tải link', 'bị chặn',
    'yt-dlp', 'download', 'sign in to confirm', 'http error 403', 'unable to download',
  ].some((k) => s.includes(k));
}

/** Giây đã trôi từ `tao` tới `xong` (hoặc tới `bayGio` nếu còn chạy). */
export function giayDaTroi(tao: string, xong: string | null, bayGio: number): number {
  const a = Date.parse(tao);
  if (!Number.isFinite(a) || a <= 0) return 0;
  const b = xong ? Date.parse(xong) : bayGio;
  return Math.max(0, Math.floor(((Number.isFinite(b) ? b : bayGio) - a) / 1000));
}
