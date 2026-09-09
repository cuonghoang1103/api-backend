/**
 * Hai tệp CSS phải khai CÙNG nhịp chuyển động.
 *
 * ─── Vì sao cần một phép kiểm cho hai dòng CSS ───
 * Cửa sổ robot nổi nạp `odin.css` + `robot.css`, KHÔNG nạp `styles.css`. Đo
 * thật trong app đã dựng: `--ct-spring` trả về **chuỗi rỗng** ở cửa sổ đó, và
 * `animationName` của mood `vui` là **`none`**.
 *
 * Một `var()` không giải được làm hỏng CẢ khai báo `animation` rút gọn, và nó
 * bị vứt IM LẶNG — không cảnh báo, không lỗi, không gì trong `tsc` hay bộ dựng
 * thấy được. Triệu chứng duy nhất là con robot đứng im, mà "robot đứng im"
 * trông y hệt "robot đang bình thường".
 *
 * Nên `odin.css` khai lại hai biến ấy. Và vì đã chép thì phải có thứ canh cho
 * hai bản không trôi khỏi nhau — đó là tệp này.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const doc = (p: string) => readFileSync(join(__dirname, p), 'utf8');

/** Đọc giá trị một biến CSS khai ở `:root` trong một tệp. */
function bien(css: string, ten: string): string | null {
  const m = new RegExp(`--${ten}\\s*:\\s*([^;]+);`).exec(css);
  return m ? m[1]!.trim() : null;
}

describe('nhịp chuyển động khai ở hai nơi', () => {
  const odin = doc('odin.css');
  const chinh = doc('../../styles.css');

  for (const ten of ['ct-ease', 'ct-spring']) {
    it(`\`--${ten}\` có trong odin.css và KHỚP styles.css`, () => {
      const a = bien(odin, ten);
      const b = bien(chinh, ten);
      expect(a, `thiếu --${ten} trong odin.css ⇒ mọi hoạt ảnh dùng nó CHẾT CÂM ở cửa sổ robot nổi`)
        .toBeTruthy();
      expect(a).toBe(b);
    });
  }

  it('cửa sổ robot chỉ nạp odin.css + robot.css — đây là lý do phải chép', () => {
    // Nếu có ngày `robot.tsx` nạp thêm `styles.css` thì phần chép trên thành
    // thừa và nên bỏ đi. Phép kiểm này là chỗ nhắc.
    const rb = doc('../../robot.tsx');
    expect(rb).toContain("import './features/odin/odin.css'");
    expect(rb).not.toContain("import './styles.css'");
  });
});
