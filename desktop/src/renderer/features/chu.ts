/**
 * Mấy phép biến đổi CHỮ dùng chung cho mọi trang học.
 *
 * Gom về một chỗ vì cả năm trang (Học viện · Khoá học · Code Lab · Phòng thi ·
 * Mẫu AI) đều cần đúng những hàm này. Mỗi trang chép một bản thì tới trang thứ
 * ba là chúng bắt đầu lệch nhau — và lệch kiểu này không ai thấy: chữ vẫn hiện
 * ra, chỉ là sai ở một trang.
 */

/**
 * Tách chữ song ngữ `en|||vi`, lấy bản tiếng Việt.
 *
 * Cùng luật với `pickLang` của web. Quên tách là người dùng nhìn thấy nguyên
 * dấu ngăn lẫn bản tiếng Anh — trông như dữ liệu hỏng. Không có bản Việt thì
 * LÙI về tiếng Anh chứ KHÔNG để trống.
 */
export function chuVi(text: string | null | undefined): string {
  if (!text) return '';
  const i = text.indexOf('|||');
  if (i === -1) return text;
  const en = text.slice(0, i).trim();
  const vi = text.slice(i + 3).trim();
  return vi || en;
}

/** Bỏ dấu để gõ "co so du lieu" ra "Cơ sở dữ liệu". */
export function fold(t: string): string {
  return t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

/**
 * Dấu "đã kiểm chất lượng" mà admin gắn vào đầu mô tả track Code Lab.
 *
 * Nó là DỮ LIỆU, không phải cột riêng — web cũng đọc y như vậy (xem
 * `parseVerified` trong `components/code-lab/shared.tsx`). Không bóc ra thì
 * người dùng đọc thấy một cụm ký tự lạ ở đầu mọi mô tả.
 */
const DAU_KIEM = '⟦ctv⟧';

export function bocDauKiem(mo: string | null | undefined): { daKiem: boolean; chu: string } {
  const d = (mo ?? '').trimStart();
  if (d.startsWith(DAU_KIEM)) return { daKiem: true, chu: chuVi(d.slice(DAU_KIEM.length).trim()) };
  return { daKiem: false, chu: chuVi(mo) };
}

/**
 * Đưa một trường "có thể là mảng, có thể là chuỗi" về mảng dòng đọc được.
 *
 * ─── Vì sao phức tạp thế ───
 * Web tách bằng `split('\n')`. Nhưng đo dữ liệu thật 20/08/2026: CEA201 có
 * **0 xuống dòng và 10 dấu chấm phẩy** — trên web nó hiện thành MỘT dòng dài.
 * Người viết nội dung dùng chấm phẩy để ngăn ý.
 *
 * Nên: có xuống dòng thì theo xuống dòng (khớp web), không thì theo chấm phẩy.
 * Và VIẾT HOA chữ đầu — thiếu bước này thì ra một loạt mẩu chữ thường cụt đầu,
 * đọc như câu bị chặt vụn, và người dùng hỏi "sao nó cứ tách tách ra thế?".
 *
 * ⛔ KHÔNG tách theo dấu chấm: câu tiếng Việt đầy dấu chấm trong tên viết tắt
 * ("I/O (polling/interrupt/DMA)") và số thứ tự.
 */
export function raDanhSach(v: string[] | string | null | undefined): string[] {
  if (!v) return [];
  const tho = Array.isArray(v)
    ? v.map(chuVi)
    : (() => {
        const c = chuVi(v);
        return c.includes('\n') ? c.split('\n') : c.split(';');
      })();
  return tho
    .map((x) => x.trim().replace(/[.;]+$/, ''))
    .filter(Boolean)
    .map((x) => x.charAt(0).toLocaleUpperCase('vi') + x.slice(1));
}

/** `3661` → `1:01:01`, `185` → `3:05`. Rỗng khi không có gì để hiện. */
export function thoiLuong(giay: number | null | undefined): string | null {
  if (!giay || giay <= 0) return null;
  const h = Math.floor(giay / 3600);
  const p = Math.floor((giay % 3600) / 60);
  const s = Math.floor(giay % 60);
  return h > 0
    ? `${h}:${String(p).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${p}:${String(s).padStart(2, '0')}`;
}

/** Ngày kiểu Việt. Chuỗi hỏng thì trả rỗng chứ không in "Invalid Date". */
export function ngayVi(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('vi-VN');
}

export const NHAN_BAC: Record<string, string> = {
  BEGINNER: 'Cơ bản',
  INTERMEDIATE: 'Trung cấp',
  ADVANCED: 'Nâng cao',
  EASY: 'Dễ',
  MEDIUM: 'Vừa',
  HARD: 'Khó',
};

/** Mở một địa chỉ bằng trình duyệt hệ thống. */
export function moNgoai(url: string): void {
  void window.cuongthai?.app.openExternal(url);
}

export const WEB = 'https://cuongthai.com';
