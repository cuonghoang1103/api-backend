/**
 * ⛔ CÂY NOTES KHÔNG ĐƯỢC DÙNG `window.prompt` / `window.alert`.
 *
 * Trang Notes của desktop DÙNG LẠI nguyên mã web (`NotesPage.tsx`), và Electron
 * không hỗ trợ hai hàm đó. Đo thật trong bản app đã build (09/09/2026):
 *
 *     typeof window.prompt : function
 *     gọi thử trả về       : null
 *     có ném không         : Error: prompt() is not supported.
 *
 * Nó **NÉM**, không phải trả `null` — nên mọi câu lệnh sau nó trong cùng hàm
 * cũng không chạy. Trên web hộp thoại hiện ra bình thường; trên desktop người
 * dùng bấm nút và KHÔNG CÓ GÌ XẢY RA, không lỗi nào trên màn hình. Sáu chỗ đã
 * hỏng như thế cùng lúc (đổi tên ở thanh bên, tạo/đổi tên khung nhìn database,
 * chèn liên kết, bookmark, nhúng) mà không ai báo, vì "không có gì xảy ra" thì
 * chẳng có gì để báo.
 *
 * Thay bằng `HoiMotDong` / `hoiMotDong()` — chạy giống hệt ở cả hai bản.
 *
 * `confirm` thì Electron CÓ hỗ trợ (đã đo trong cùng lượt), nên các chỗ xác
 * nhận xoá để nguyên và chốt này không đụng tới.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const GOC_WEB = path.resolve(__dirname, '../../../../..', 'frontend/src');
const THU_MUC = [
  path.join(GOC_WEB, 'components/notes'),
  path.join(GOC_WEB, 'app/notes'),
];

function moiFile(thuMuc: string): string[] {
  const ra: string[] = [];
  const di = (d: string): void => {
    for (const m of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, m.name);
      if (m.isDirectory()) di(p);
      else if (/\.(tsx?|jsx?)$/.test(m.name)) ra.push(p);
    }
  };
  di(thuMuc);
  return ra;
}

/** Bỏ chú thích trước khi tìm — cả tệp này lẫn mã đều NHẮC TỚI `window.prompt`. */
function boChuThich(tho: string): string {
  return tho.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

describe('cây Notes dùng chung với desktop', () => {
  it('⛔ KHÔNG còn `window.prompt` / `window.alert` nào', () => {
    const pham: string[] = [];
    for (const d of THU_MUC) {
      for (const f of moiFile(d)) {
        const ma = boChuThich(fs.readFileSync(f, 'utf8'));
        const m = /window\.(prompt|alert)\s*\(/.exec(ma);
        if (m) pham.push(`${path.relative(GOC_WEB, f)} → window.${m[1]}()`);
      }
    }
    expect(pham).toEqual([]);
  });

  it('bộ đo này THẬT SỰ đọc được mã web (không phải quét thư mục rỗng)', () => {
    // Không có chốt này thì đổi đường dẫn một lần là phép kiểm trên xanh vĩnh
    // viễn vì nó không soi tệp nào cả. Xem [[feedback_phep_kiem_dat_vi_ly_do_sai]].
    const so = THU_MUC.reduce((t, d) => t + moiFile(d).length, 0);
    expect(so).toBeGreaterThan(20);
  });
});
