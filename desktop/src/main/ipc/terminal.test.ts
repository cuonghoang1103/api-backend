/**
 * Bảng chạy lệnh — canh hai quyết định dễ bị gỡ mất nhất.
 *
 * ⚠️ Phép kiểm ĐỌC NGUỒN. Phần HÀNH VI đã đo trong bản đóng gói: gọi
 * `window.cuongthai.terminal.chay('cuoc-thu', 'echo hello')` khi chưa mở dự án
 * trả đúng `{ok:false, loi:'Chưa chọn thư mục dự án…'}`, và nhóm `terminal` có
 * mặt trong cầu nối. Cái không đo được ở đó là hai chốt dưới đây.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const nguon = readFileSync(join(__dirname, 'terminal.ts'), 'utf8');

describe('bảng chạy lệnh', () => {
  /*
   * `docDauRaNen` trả phần MỚI rồi ĐẨY con trỏ đọc lên. Bảng này và agent cùng
   * đọc một lệnh thì chúng ăn mất đầu ra của nhau — mỗi bên thấy một nửa log,
   * không bên nào biết mình thiếu. Tiền tố tách hẳn hai không gian.
   */
  it('cuocId ĐƯỢC ĐỔI TIỀN TỐ để không giẫm lên lệnh nền của agent', () => {
    expect(nguon, 'mất tiền tố ⇒ bảng lệnh và agent ăn mất đầu ra của nhau')
      .toMatch(/term:\$\{cuocId\}/);
    expect(nguon, 'phải dùng hàm khoá, không truyền cuocId trần vào batLenhNen')
      .toMatch(/cuocId: khoaCuoc\(cuocId\)/);
  });

  /*
   * Không có gốc thì `cwd` rơi về thư mục đang chạy app — với bản đã cài đó là
   * `/Applications/…`. Lệnh chạy đúng ở SAI CHỖ là kiểu hỏng tệ nhất: nó
   * "thành công".
   */
  it('TỪ CHỐI khi chưa mở dự án, không âm thầm chạy ở thư mục app', () => {
    expect(nguon).toMatch(/if \(!goc\)/);
    expect(nguon, 'phải nói RÕ vì sao từ chối').toContain('Chưa chọn thư mục dự án');
    const iTuChoi = nguon.indexOf('if (!goc)');
    const iChay = nguon.indexOf('batLenhNen(');
    expect(iTuChoi, 'chốt phải đứng TRƯỚC lời gọi chạy').toBeLessThan(iChay);
  });

  it('dùng lại lenhNen chứ KHÔNG tự spawn', () => {
    /* Tự spawn là chép lại trần số tiến trình, dọn theo cuộc, và giết CẢ NHÓM
       tiến trình — rồi quên một cái. */
    expect(nguon).toContain("from '../agent/lenhNen'");
    expect(nguon, 'không được tự gọi spawn ở đây').not.toContain('child_process');
  });
});
