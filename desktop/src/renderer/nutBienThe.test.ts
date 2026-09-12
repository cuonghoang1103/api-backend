/**
 * Chốt: lớp BIẾN THỂ của nút không bao giờ được dùng MỘT MÌNH.
 *
 * ─── Vì sao cần một phép kiểm cho chuyện tưởng như hiển nhiên ───
 * `.ct-btn-ghost` chỉ khai `background`, `border-color`, `color`. Toàn bộ hình
 * hài của nút — `display: inline-flex`, khoảng đệm, bo góc, khoảng cách giữa
 * icon và chữ — nằm ở `.ct-btn`. Thiếu `.ct-btn` thì nút rơi về mặc định của
 * trình duyệt: icon nằm TRÊN chữ, không viền, không đệm.
 *
 * Nó không nổ, không tràn, không sai một dòng TypeScript nào — nên `tsc` im,
 * và `npm run do:bo-cuc` cũng im (một nút không có viền thì càng không tràn
 * ngang). Đo thật 12/09/2026: bốn nút "Mở thư mục" của Xưởng Remix đã hiện
 * sai như thế từ giai đoạn 2, qua ba lượt kiểm bố cục, và chỉ lộ ra khi CHỤP
 * MÀN HÌNH lên nhìn bằng mắt.
 *
 * Bài học rộng hơn: bộ đo trả lời được "có tràn không", không trả lời được
 * "trông có ổn không". Phép kiểm này lấp đúng một mẩu của khoảng cách đó —
 * mẩu duy nhất diễn đạt được thành luật.
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const GOC = join(__dirname);

/** Mọi biến thể chỉ đổi màu; chúng vô nghĩa nếu thiếu lớp nền `.ct-btn`. */
const BIEN_THE = ['ct-btn-ghost', 'ct-btn-nguy', 'ct-btn-nho'];

function moiTep(thuMuc: string): string[] {
  const ra: string[] = [];
  for (const ten of readdirSync(thuMuc)) {
    const d = join(thuMuc, ten);
    if (statSync(d).isDirectory()) { ra.push(...moiTep(d)); continue; }
    if (/\.tsx?$/.test(ten) && !/\.test\.tsx?$/.test(ten)) ra.push(d);
  }
  return ra;
}

describe('lớp biến thể của nút', () => {
  it('⭐ không chỗ nào dùng biến thể mà thiếu `ct-btn`', () => {
    const pham: string[] = [];
    for (const tep of moiTep(GOC)) {
      const noi = readFileSync(tep, 'utf8');
      // Bắt cả `className="x"` lẫn `className={`x ${y}`}` và `clsx('x', …)`.
      for (const khop of noi.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
        const lop = (khop[1] ?? khop[2] ?? '');
        const co = BIEN_THE.find((b) => new RegExp(`(^|[\\s'"\`])${b}([\\s'"\`]|$)`).test(lop));
        if (co && !/(^|\s)ct-btn(\s|$)/.test(lop)) {
          pham.push(`${tep.slice(GOC.length + 1)}: className="${lop}"`);
        }
      }
    }
    expect(
      pham,
      'Biến thể nút dùng MỘT MÌNH ⇒ nút mất hình hài: icon nằm trên chữ, '
      + 'không viền, không đệm. Thêm `ct-btn` vào trước nó.\n' + pham.join('\n'),
    ).toEqual([]);
  });
});
