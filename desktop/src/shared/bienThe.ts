/**
 * BIẾN THỂ của app desktop — một mã nguồn, hai sản phẩm (13/10/2026).
 *
 *   • `cuongthai` — app đầy đủ (Tổng quan, Học tập, AI Code, Nhạc, CT Work…).
 *   • `ctwork`    — app RIÊNG chỉ có CT Work. Sinh viên, giảng viên, mentor ở
 *                   trường và các anh chị ở FPT Software dùng CT Work làm việc
 *                   nhóm/đồ án/quản lý dự án và chỉ cần đúng nó — họ đề nghị
 *                   một app không lẫn các trang khác.
 *
 * Chọn lúc DỰNG bằng biến môi trường `CT_BIEN_THE=ctwork`; Vite thay hằng
 * `__CT_BIEN_THE__` bằng chuỗi thật (`define` trong `vite.config.ts` và
 * `vite.main.config.ts`), nên nhánh của biến thể kia bị bỏ khỏi bản dựng chứ
 * không chỉ bị tắt lúc chạy. Vitest không `define` ⇒ rơi về `cuongthai`, đúng
 * với mọi test hiện có.
 *
 * ⚠️ Vì sao KHÔNG phải một app thứ hai sao chép mã: CT Work trong app đầy đủ đã
 * là nguyên cây `/work` của web (`features/work/CtWorkPage.tsx`). Chép ra là hai
 * bản phải sửa song song; dựng hai biến thể thì mọi bản vá CT Work có ở cả hai.
 *
 * ⚠️ Hai app có appId, tên, thư mục dữ liệu, scheme deep-link và KHO PHÁT HÀNH
 * riêng — cài song song được. Kho phát hành PHẢI riêng: electron-updater đọc
 * `/releases/latest`, hai app chung một kho sẽ tải nhầm bản của nhau.
 */

declare const __CT_BIEN_THE__: string | undefined;

export type BienThe = 'cuongthai' | 'ctwork';

export const BIEN_THE: BienThe =
  typeof __CT_BIEN_THE__ !== 'undefined' && __CT_BIEN_THE__ === 'ctwork' ? 'ctwork' : 'cuongthai';

/** Đang chạy bản app RIÊNG của CT Work. */
export const LA_CTWORK = BIEN_THE === 'ctwork';

export interface ThongTinBienThe {
  /** Tên hiển thị — khớp `productName` trong cấu hình electron-builder. */
  tenSanPham: string;
  /** Tiền tố tên tệp cài (`artifactName` = `${productName}-…`, khoảng trắng thành `-`). */
  tienToTep: string;
  /** Kho GitHub PUBLIC chứa bản phát hành. */
  khoPhatHanh: string;
  /** Scheme deep-link. */
  scheme: string;
  /** Trang mở đầu khi chưa có trang nào được nhớ. */
  trangDau: string;
}

const BANG: Record<BienThe, ThongTinBienThe> = {
  cuongthai: {
    tenSanPham: 'CuongThai',
    tienToTep: 'CuongThai',
    khoPhatHanh: 'cuonghoang1103/cuongthai-desktop',
    scheme: 'cuongthai',
    trangDau: '/dashboard',
  },
  ctwork: {
    tenSanPham: 'CT Work',
    /* Tên tệp KHÔNG khoảng trắng — `artifactName` đặt tay trong
       electron-builder.ctwork.yml. GitHub đổi khoảng trắng trong tên tệp đính kèm
       thành dấu chấm, và `latest*.yml` sẽ trỏ vào tệp không tồn tại. */
    tienToTep: 'CT-Work',
    khoPhatHanh: 'cuonghoang1103/ctwork-desktop',
    scheme: 'ctwork',
    trangDau: '/work',
  },
};

export const THONG_TIN_BIEN_THE: ThongTinBienThe = BANG[BIEN_THE];

/**
 * Đường dẫn này có thuộc CT Work không. Ở bản `ctwork`, mọi đường ngoài cây này
 * (hồ sơ, tin nhắn, ghi chú…) được mở trên cuongthai.com bằng trình duyệt thay
 * vì dựng trong app.
 */
export function thuocCtWork(duong: string): boolean {
  return duong === '/work' || duong.startsWith('/work/') || duong.startsWith('/work?');
}
