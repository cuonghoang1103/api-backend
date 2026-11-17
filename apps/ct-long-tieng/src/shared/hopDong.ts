/**
 * Hợp đồng với web — `docs/long-tieng-hop-dong.md` mục 1 (`/api/v1/long-tieng`).
 *
 * Máy chủ có thể bọc dữ liệu trong `{ success, data }` (thói quen của backend này) hoặc trả thẳng; mọi chỗ đọc
 * phản hồi đi qua `boc()` ở `chuanHoa.ts` nên hai kiểu đều chạy. Tên trường lạ hoặc thiếu ⇒ giá trị mặc định,
 * không ném lỗi: app phải sống được khi máy chủ thêm trường mới.
 */

export type TrangThaiMayChu = 'cho_tai_len' | 'cho' | 'tai' | 'lam' | 'xong' | 'loi' | 'huy';

export type LoaiKetQua = 'vi' | 'vi-goc' | 'srt-vi' | 'srt-goc' | 'thong-tin';

export type NgonNgu = 'auto' | 'zh' | 'en';

/** Nhịp đọc (bổ sung hợp đồng 18/11): `cho-giong` = video chờ giọng, tự kéo dài chỗ cần (mặc định); `tang-toc` = giữ đúng thời lượng gốc. */
export type Nhip = 'cho-giong' | 'tang-toc';

/**
 * Nhạc nền (bổ sung hợp đồng 18/11 03:40). `goc` = giữ nhạc nền gốc đã tách (mặc định); `thu-vien` = bài trong
 * `GET /nhac` (cần `id`); `tep` = nhạc của tôi (tải lên như video); `khong` = không nhạc. `amLuong` 0..1.
 *
 * ⚠️ GIẢ ĐỊNH (hợp đồng chưa chốt chi tiết): với `tep`, app gửi `nhacNen.tep: { ten, kichThuoc, kieu }` và máy chủ
 * trả `taiLenNhac: { url, het }` cạnh `taiLen`; việc ở `cho_tai_len` tới khi app gửi xong MỌI tệp rồi gọi
 * `POST /jobs/:id/da-tai-len`.
 */
export type LoaiNhacNen = 'goc' | 'thu-vien' | 'tep' | 'khong';

export interface NhacNen {
  loai: LoaiNhacNen;
  id?: string;
  amLuong?: number;
  tep?: { ten: string; kichThuoc: number; kieu: string };
}

/** Một bài trong thư viện nhạc miễn phí bản quyền (`GET /nhac`). */
export interface BaiNhac {
  id: string;
  ten: string;
  tamTrang: string | null;
  giay: number | null;
  /** URL nghe thử. */
  nghiThu: string | null;
  nguon: string | null;
  giayPhep: string | null;
}

export interface TepKetQua {
  loai: LoaiKetQua;
  ten: string;
  kichThuoc: number;
  /** GET ký sẵn, sống 1 giờ. */
  url: string;
}

export interface Viec {
  id: string;
  url: string | null;
  /** Tên tệp gốc khi việc tạo từ tệp tải lên. */
  tenTep: string | null;
  tenVideo: string | null;
  lang: NgonNgu;
  goc: number;
  nhip: Nhip;
  trangThai: TrangThaiMayChu;
  buoc: string | null;
  phanTram: number | null;
  loi: string | null;
  ketQua: TepKetQua[];
  thoiLuong: number | null;
  tao: string;
  xong: string | null;
}

export interface TaoViecVao {
  url?: string;
  tep?: { ten: string; kichThuoc: number; kieu: string };
  lang: NgonNgu;
  goc: number;
  nhip?: Nhip;
  nhacNen?: NhacNen;
  tenVideo?: string;
}

export interface PhieuTaiLen {
  url: string;
  het: string | null;
}

export interface TaoViecRa {
  viec: Viec;
  taiLen: PhieuTaiLen | null;
  taiLenNhac: PhieuTaiLen | null;
}

/** Đường dẫn tương đối dưới gốc API. */
export const DUONG_API = '/api/v1/long-tieng';
export const MAY_CHU_MAC_DINH = 'https://cuongthai.com';
