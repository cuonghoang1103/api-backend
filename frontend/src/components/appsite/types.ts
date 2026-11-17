/**
 * Bộ "trang chủ app" dùng chung (17/11/2026) — CT Language (/language/app), CT Work (/ct-work), CT Courses sau này.
 *
 * User: "trang chủ của app, hướng dẫn, giới thiệu, công khai, diễn đàn, quảng bá… kèm logo App Store dính link tải
 * khi được duyệt" — tham khảo KHUNG của web Hanzii (trang chủ · tính năng · hướng dẫn · nâng cấp · cộng đồng · giới
 * thiệu · trợ giúp · chính sách · liên hệ · nút tải), nội dung + hình TỰ LÀM, phong cách Gấu pixel.
 *
 * Mỗi app chỉ khai MỘT object `AppSite` (dữ liệu) — giao diện dùng chung ở `components/appsite/trang/*`. Mọi câu chữ
 * phải khớp tính năng CÓ THẬT (đối chiếu chữ App Store của app: `ios-app/app-store/<app>/metadata.json`).
 */

export interface LienKet { href: string; nhan: string; moTa?: string; ngoai?: boolean }

export interface TinhNangApp {
  /** neo trong trang /tinh-nang — `#${id}` */
  id: string;
  emoji: string;
  ten: string;
  /** một câu — dùng ở thẻ trang chủ */
  ngan: string;
  /** các gạch đầu dòng ở trang Tính năng */
  chiTiet: string[];
  /** ảnh iPhone (dọc) — đường dẫn trong /public */
  anh?: string;
  /** ảnh iPad (ngang hoặc dọc) */
  anhIpad?: string;
  /** chỉ có ở Pro / có giới hạn — hiện nhãn nhỏ */
  nhan?: string;
}

export interface BuocHuongDan { ten: string; moTa: string; anh?: string; meo?: string }
export interface NhomHuongDan { id: string; emoji: string; tieuDe: string; moTa?: string; buoc: BuocHuongDan[] }

export interface DongSoSanh { muc: string; free: string; pro: string }

export interface BanCapNhat { phienBan: string; ngay: string; tieuDe?: string; muc: string[] }

export interface CauHoi { hoi: string; dap: string; nhom?: string }

export interface AppSite {
  /** gốc đường dẫn, không có "/" cuối — '/language/app', '/ct-work' */
  goc: string;
  ten: string;
  /** dòng phụ ngắn dưới tên (App Store subtitle) */
  phuDe: string;
  /** câu lớn ở hero */
  tieuDeLon: string;
  /** đoạn giới thiệu ngắn ở hero */
  moTa: string;
  icon: string;
  /** màu nhấn chính / phụ (hex) — chỉ làm điểm nhấn, chữ vẫn theo biến theme */
  mau: string;
  mau2: string;
  /** App Store id — null = chưa lên store (hiện "Sắp có trên App Store"). Trạng thái thật hỏi iTunes lúc dựng. */
  appStoreId: string | null;
  /** nền tảng: chữ hiện dưới nút tải */
  nenTang: string;
  /** các nút phụ cạnh nút App Store: dùng trên web, app máy tính… */
  nutPhu: LienKet[];
  /** con số THẬT (không trang trí) */
  conSo: { so: string; nhan: string }[];
  /** 3–4 lý do ngắn ở trang chủ */
  diemNoi: { emoji: string; ten: string; moTa: string }[];
  tinhNang: TinhNangApp[];
  /** ảnh chạy ở trang chủ (iPhone) */
  anhChay: { anh: string; nhan: string }[];
  anhIpad?: { anh: string; nhan: string }[];
  huongDan: NhomHuongDan[];
  pro?: {
    ten: string;
    moTa: string;
    gia: string;
    ghiChu: string;
    bang: DongSoSanh[];
  };
  congDong: {
    moTa: string;
    lienKet: LienKet[];
    quyTac: string[];
  };
  capNhat: BanCapNhat[];
  hoiDap: CauHoi[];
  gioiThieu: {
    doan: string[];
    giaTri: { emoji: string; ten: string; moTa: string }[];
    nguoiLam: string;
  };
  lienHe: { email: string; kenh: LienKet[] };
  chinhSach: LienKet[];
  /** linh vật Gấu pixel ở các khối (tắt được) */
  gau: boolean;
  /** câu trong bong bóng của Gấu ở hero */
  loiChao?: string;
  /** 2–4 sticker chữ dán quanh điện thoại ở hero (あ · 汉 · Aa…) */
  nhanDan?: string[];
}
