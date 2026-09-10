/**
 * ⛔ KHÔNG được gọi `t()` ở TẦM MÔ-ĐUN.
 *
 * ─── Vì sao đáng một phép kiểm riêng ───
 * Tôi dính đúng bẫy này HAI lần trong năm phút khi nối `t()` vào khung app:
 *
 * ```ts
 * const MODE_LABEL = { full: dich('Thu gọn thành biểu tượng'), … };   // ⛔
 * const TITLES     = { [ROUTES.settings]: dich('Cài đặt'), … };        // ⛔
 * ```
 *
 * Hằng tầm mô-đun tính **đúng một lần**, lúc tệp được nạp. Nên chuỗi ấy đông
 * cứng ở ngôn ngữ đang có lúc khởi động: đổi sang tiếng Anh xong, ba nhãn kia
 * vẫn tiếng Việt cho tới khi khởi động lại app.
 *
 * Đây là kiểu hỏng tệ nhất của việc đa ngôn ngữ — **một phần** giao diện đổi,
 * phần còn lại không, và người dùng kết luận là tính năng hỏng. `tsc` không
 * thấy được (mã hợp lệ hoàn toàn), mắt nhìn cũng khó thấy (chỉ lộ ra khi thật
 * sự bấm đổi ngôn ngữ và soi đúng ba nhãn đó).
 *
 * ✅ Cách đúng: giữ tiếng Việt trong hằng, gọi `dich(HANG[khoa])` tại chỗ DỰNG.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const GOC = join(__dirname, '..');

function moiTep(thuMuc: string, ra: string[] = []): string[] {
  for (const ten of readdirSync(thuMuc)) {
    const duong = join(thuMuc, ten);
    if (statSync(duong).isDirectory()) { moiTep(duong, ra); continue; }
    if (/\.tsx?$/.test(ten) && !/\.test\./.test(ten)) ra.push(duong);
  }
  return ra;
}

/**
 * Tìm `t(` nằm trong một KHAI BÁO HẰNG Ở TẦM MÔ-ĐUN.
 *
 * ⚠️ Bản đầu của phép dò này đếm ngoặc nhọn để đoán "có đang trong thân hàm
 * không" — và nó SAI: báo nhầm mọi dòng JSX bên trong component, đồng thời
 * chính phép tự kiểm của nó cũng đỏ. Một bộ dò báo bừa còn tệ hơn không có,
 * vì người ta sẽ tắt nó đi.
 *
 * Nay dò đúng HÌNH DẠNG của lỗi thật, hẹp và chắc: một dòng bắt đầu bằng
 * `const`/`let`/`var` (có thể có `export`) ở CỘT 0 — tức khai báo tầm mô-đun —
 * rồi quét phần khởi tạo của nó tới khi đóng hết ngoặc. `t(` nằm trong đó là
 * lỗi. Hàm khai bằng `const X = () => {` bị loại trừ: thân nó chạy mỗi lần gọi.
 */
function goiTTamModun(ma: string): string[] {
  const sach = ma.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const dong = sach.split('\n');
  const loi: string[] = [];
  const LA_T = /(?<![A-Za-z0-9_$.])dichP?\(\s*['"`]/;

  for (let i = 0; i < dong.length; i++) {
    const d = dong[i]!;
    if (!/^(export\s+)?(const|let|var)\s/.test(d)) continue;
    // Hàm mũi tên / hàm thường: thân chạy lúc GỌI, không phải lúc nạp tệp.
    if (/=>|\bfunction\b/.test(d)) continue;

    let sau = 0;
    for (let k = i; k < dong.length; k++) {
      const dk = dong[k]!;
      if (LA_T.test(dk)) loi.push(dk.trim());
      sau += (dk.match(/[{[(]/g) ?? []).length - (dk.match(/[}\])]/g) ?? []).length;
      if (k > i || sau === 0) { if (sau <= 0) { i = k; break; } }
    }
  }
  return loi;
}

describe('t() không được gọi ở tầm mô-đun', () => {
  it('không tệp renderer nào dịch trong một hằng khai ở đầu tệp', () => {
    const xau: string[] = [];
    for (const tep of moiTep(GOC)) {
      const ma = readFileSync(tep, 'utf8');
      if (!/\bfrom '[^']*i18n'/.test(ma)) continue;   // tệp không dùng t()
      for (const dong of goiTTamModun(ma)) {
        xau.push(`${tep.slice(GOC.length + 1)}: ${dong}`);
      }
    }
    expect(
      xau,
      'Dịch ở tầm mô-đun ⇒ chuỗi đông cứng ở ngôn ngữ lúc khởi động.\n'
      + 'Giữ tiếng Việt trong hằng, gọi dich(HANG[khoa]) tại chỗ dựng.\n'
      + xau.join('\n'),
    ).toEqual([]);
  });

  it('BỘ DÒ CÓ HOẠT ĐỘNG — bắt được đúng dạng đã dính', () => {
    // Kiểm bộ kiểm trước nội dung: một phép dò luôn trả rỗng thì nó chứng nhận
    // mọi thứ, kể cả lúc mã đang sai.
    const xau = goiTTamModun([
      "import { useDich } from '../i18n';",
      "const NHAN = {",
      "  full: dich('Thu gọn thành biểu tượng'),",
      '};',
      'export function X() {',
      '  const { dich } = useDich();',
      "  return <span title={dich('Cài đặt')}>{dich('Thu gọn')}</span>;",
      '}',
    ].join('\n'));
    expect(xau, 'phải bắt hằng tầm mô-đun, và CHỈ nó').toHaveLength(1);
    expect(xau[0]).toContain('Thu gọn thành biểu tượng');
  });
});
