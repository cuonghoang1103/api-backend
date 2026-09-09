/**
 * ⛔ `hover:` PHẢI CÓ Ở CẢ HAI BIẾN THỂ SÁNG VÀ TỐI.
 *
 * Lỗi thật, 16 chỗ cùng lúc trong cây Notes (09/09/2026):
 *
 *     hover:bg-slate-100 dark:bg-white/[0.04]
 *                        ↑ thiếu `hover:`
 *
 * Ở theme SÁNG thì đúng. Ở theme TỐI thì mọi hàng mang nền xám **thường
 * trực** — cả danh sách thành một bức tường ô hộp giống hệt nhau, và rê chuột
 * không có phản hồi nào. Người dùng mô tả đúng cảm giác đó: "rất khó nhìn,
 * không nổi bật để phân biệt".
 *
 * Hỏng CÂM và hỏng LỆCH THEO CHỦ ĐỀ: ai chỉ thử ở chế độ sáng thì không bao
 * giờ thấy, và bộ đo bố cục cũng đứng ở chế độ sáng (Notes có bộ chuyển chủ đề
 * riêng, mặc định Trắng) nên nó cũng không thấy.
 *
 * Chốt này bắt cả LỚP lỗi, không chỉ 16 chỗ đã sửa: bất kỳ cặp
 * `hover:<gì đó>` + `dark:<cùng thuộc tính>` mà bản dark thiếu `hover:`.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const GOC_WEB = path.resolve(__dirname, '../../../../..', 'frontend/src');
const THU_MUC = [
  path.join(GOC_WEB, 'components/notes'),
  path.join(GOC_WEB, 'app/notes'),
];

function moiFile(d: string): string[] {
  const ra: string[] = [];
  const di = (t: string): void => {
    for (const m of fs.readdirSync(t, { withFileTypes: true })) {
      const p = path.join(t, m.name);
      if (m.isDirectory()) di(p);
      else if (/\.tsx?$/.test(m.name)) ra.push(p);
    }
  };
  di(d);
  return ra;
}

/**
 * `hover:bg-X … dark:bg-Y` trong CÙNG một chuỗi class, mà `dark:bg-Y` không có
 * `hover:`. Chỉ soi `bg-` — đó là chỗ lỗi này gây hại nhất (nền hàng), và mở
 * rộng sang mọi thuộc tính sẽ đẻ ra báo oan (ví dụ `dark:text-…` làm màu chữ
 * nền chứ không phải trạng thái rê chuột).
 */
const MAU = /hover:bg-[\w[\]/.-]+(?:\s+[\w:[\]/.-]+)*?\s+dark:bg-[\w[\]/.-]+/g;

describe('biến thể hover ở theme tối', () => {
  it('⛔ KHÔNG có `hover:bg-… dark:bg-…` nào thiếu `hover:` ở bản tối', () => {
    const pham: string[] = [];
    for (const d of THU_MUC) {
      for (const f of moiFile(d)) {
        const tho = fs.readFileSync(f, 'utf8');
        for (const m of tho.match(MAU) ?? []) {
          pham.push(`${path.relative(GOC_WEB, f)} → ${m.trim()}`);
        }
      }
    }
    expect(pham).toEqual([]);
  });

  it('bộ đo này THẬT SỰ đọc được mã web', () => {
    // Đổi đường dẫn một lần là phép kiểm trên xanh vĩnh viễn vì không soi tệp
    // nào. Xem [[feedback_phep_kiem_dat_vi_ly_do_sai]].
    expect(THU_MUC.reduce((t, d) => t + moiFile(d).length, 0)).toBeGreaterThan(20);
  });

  it('mẫu regex BẮT được đúng cái nó phải bắt', () => {
    // Kiểm chính bộ kiểm: mẫu sai thì phép kiểm đầu xanh mà chẳng gác gì.
    expect('hover:bg-slate-100 dark:bg-white/[0.04]'.match(MAU)).toHaveLength(1);
    expect('hover:bg-slate-100 dark:hover:bg-white/[0.04]'.match(MAU)).toBeNull();
    expect('hover:bg-slate-100 dark:text-slate-200'.match(MAU)).toBeNull();
  });
});
