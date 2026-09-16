/**
 * ============================================================
 * ⭐ GIAO DIỆN TRANG BÀI HỌC — HAI LỖI NHÌN MỚI THẤY
 * ============================================================
 *
 * Người dùng 17/09/2026, kèm ảnh: *"giao diện từng bài trong academy đang đè
 * nhau và giao diện AI xấu quá tối đen khó nhìn và không muốn học + các khung
 * đè lên nhau bố cục xấu… khung nó đậm đậm thô"*.
 *
 * Cả hai lỗi đều KHÔNG làm đỏ thứ gì: `tsc` xanh, bản dựng xanh, không một
 * cảnh báo nào. Chúng chỉ hiện ra khi nhìn đúng trang đó. Nên phải chốt bằng
 * phép kiểm đọc thẳng CSS — thứ rẻ nhất mua được mà không cần mắt người.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = path.dirname(fileURLToPath(import.meta.url));
const CSS = fs.readFileSync(path.resolve(here, '../../styles.css'), 'utf8');
const WEB = path.resolve(here, '../../../../../frontend/src');

/** Mọi `var(--x)` mà một tệp gọi tới. */
function bienDung(tep: string): Set<string> {
  const chu = fs.readFileSync(tep, 'utf8');
  return new Set([...chu.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)].map((m) => m[1]!));
}

/**
 * Khối khai báo cầu nối biến chủ đề web → token app.
 *
 * ⚠️ Cắt tới dấu `}` ĐẦU TIÊN sau selector, không cắt tới `.ct-hv-noidung {`:
 * chuỗi đó nằm NGAY TRONG danh sách selector của chính khối này
 * (`.ct-hv-bai-doc,\n.ct-hv-noidung {`), nên cắt như thế ra một lát rỗng và
 * phép kiểm báo "thiếu tất cả" — sai vì lý do sai.
 */
const _dau = CSS.indexOf('.ct-hv-bai-doc,');
const CAU_NOI = CSS.slice(_dau, CSS.indexOf('}', _dau));

describe('⭐ khối "Hỏi AI" phải ăn theo chủ đề của app', () => {
  /**
   * `CourseTutor` và `ChapterQuiz` là component CỦA WEB, tô màu bằng
   * `style={{ background: 'var(--bg-card)' }}`. Trong app những biến đó chỉ
   * tồn tại nếu CSS của app khai chúng trên một tổ tiên.
   *
   * ⚠️ `var()` không giải được VÀ không có giá trị lùi ⇒ trình duyệt VỨT CẢ
   * KHAI BÁO. Khối mất nền (rơi về nền trang — đen kịt) và mất màu viền (rơi
   * về `currentColor` — dày và thô). Đúng hai chữ người dùng dùng.
   */
  const TEP = [
    path.join(WEB, 'components/academy/CourseTutor.tsx'),
    path.join(WEB, 'components/academy/ChapterQuiz.tsx'),
  ];

  it('cầu nối biến khai trên GỐC trang bài, không chỉ trên phần nội dung', () => {
    // Gia sư và đề luyện là ANH EM của `.ct-hv-noidung`, nằm NGOÀI nó. Khai
    // biến trên phần nội dung thôi thì chúng không thừa kế được gì.
    expect(CAU_NOI).toContain('.ct-hv-bai-doc');
  });

  it('⭐ MỌI biến chủ đề web mà hai component đó gọi đều được khai', () => {
    const thieu: string[] = [];
    for (const tep of TEP) {
      if (!fs.existsSync(tep)) continue;   // web đổi cây thư mục thì bỏ qua, đừng đỏ oan
      for (const bien of bienDung(tep)) {
        // Token của chính app (`--ct-*`) thì không cần cầu nối.
        if (bien.startsWith('--ct-')) continue;
        if (!CAU_NOI.includes(`${bien}:`)) thieu.push(`${path.basename(tep)} → ${bien}`);
      }
    }
    expect(thieu, 'biến không được khai ⇒ trình duyệt vứt cả khai báo').toEqual([]);
  });
});

describe('⭐ con robot nổi không được đè lên nội dung', () => {
  /**
   * `.odin-dock` là `position: fixed` ở góc dưới-phải, nên nó không chiếm chỗ
   * trong dòng chảy: cuộn xuống đáy thì thứ cuối cùng của trang nằm DƯỚI nó.
   * Trong ảnh người dùng gửi, nó đè đúng lên nút "Bài tiếp theo".
   */
  it('có biến chừa chỗ, và nó chỉ bật khi robot thật sự được dựng', () => {
    expect(CSS).toMatch(/--ct-robot-h:\s*0px/);
    expect(CSS).toMatch(/\.ct-shell:has\(\.odin-dock\)\s*\{\s*--ct-robot-h:\s*var\(--ct-robot-h-thuc\)/);
  });

  it('⭐ `.ct-page` dùng biến đó làm đệm đáy', () => {
    const khoi = CSS.slice(CSS.indexOf('.ct-page {'), CSS.indexOf('}', CSS.indexOf('.ct-page {')));
    expect(khoi).toContain('--ct-robot-h');
    // Phải đặt SAU `padding` viết tắt, không thì bị nó ghi đè về 26px.
    expect(khoi.indexOf('padding-bottom')).toBeGreaterThan(khoi.indexOf('padding:'));
  });

  it('robot tắt ⇒ KHÔNG chừa chỗ (không để lại khoảng trống vô nghĩa)', () => {
    // `--ct-robot-h` mặc định 0px, nên trang không robot vẫn giữ đệm 26px cũ.
    expect(CSS).toMatch(/--ct-robot-h:\s*0px/);
  });
});
