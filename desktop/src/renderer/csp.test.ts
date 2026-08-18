/**
 * Chặn những thứ CSP của app sẽ chặn — bắt lúc chạy `npm test`, không phải
 * lúc người dùng bấm nút.
 *
 * Sinh ra từ một lỗi thật (19/08/2026): màn nói chuyện báo "Failed to fetch"
 * và không nói gì thêm. Thủ phạm là `fetch('data:audio/webm;base64,...')` để
 * đổi base64 thành Blob — `connect-src` không có `data:` nên CSP chặn, và
 * trình duyệt ném đúng một câu chẳng nhắc gì tới CSP. Nhìn y như mất mạng.
 *
 * Kiểu lỗi này KHÔNG hiện ra lúc biên dịch, và cũng không hiện ra ở bộ kiểm
 * đơn vị (vì ở đó không có CSP). Nó chỉ hiện ra trong bản đóng gói — tức là
 * ở tay người dùng.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

function moiTepNguon(goc: string): string[] {
  const ra: string[] = [];
  for (const ten of readdirSync(goc)) {
    const duong = join(goc, ten);
    if (statSync(duong).isDirectory()) { ra.push(...moiTepNguon(duong)); continue; }
    if (/\.(ts|tsx)$/.test(ten) && !ten.endsWith('.test.ts')) ra.push(duong);
  }
  return ra;
}

describe('CSP', () => {
  it('KHÔNG chỗ nào fetch một data: URL', () => {
    const pham: string[] = [];
    for (const tep of moiTepNguon(join(__dirname))) {
      const noi = readFileSync(tep, 'utf8');
      // Bỏ qua dòng chú thích — chúng nhắc tới lỗi này để người sau hiểu.
      for (const [i, dong] of noi.split('\n').entries()) {
        if (/^\s*(\*|\/\/)/.test(dong)) continue;
        if (/fetch\(\s*[`'"]data:/.test(dong)) pham.push(`${tep}:${i + 1}`);
      }
    }
    expect(pham, `CSP chặn data: — dùng atob() thay vì fetch. Vi phạm:\n${pham.join('\n')}`)
      .toEqual([]);
  });
});
