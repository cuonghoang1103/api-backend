/**
 * Canh hai bản vá CSS làm trang web vừa khít vỏ app.
 *
 * Chúng là bản vá THEO LỚP TAILWIND, không phải theo component — nên không có
 * chỗ nào trong TypeScript nhắc tới chúng, và `tsc` không thấy gì cả. Ai đó
 * dọn `styles.css` gỡ nhầm là trang phỏng vấn quay lại 64px trống ở đỉnh và
 * 74px cuộn thừa, mà không phép kiểm nào hiện có kêu: `do:bo-cuc` chỉ đo TRÀN
 * NGANG, chính nó ghi rõ "không đo màu, không đo khoảng cách".
 *
 * Đo thật 22/08/2026 (1280×900, cả hai chủ đề), trước → sau:
 *   padding-top 64px → 0 · phần tử gốc 900px → 826px · cuộn thừa 74px → 0
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(join(__dirname, '../../styles.css'), 'utf8');

describe('vỏ app ôm đúng trang web dùng lại', () => {
  it('gỡ chỗ chừa cho thanh nav của web, và chỉ ở phần tử GỐC', () => {
    expect(css, 'mất bản vá pt-16 — trang sẽ có 64px trống ở đỉnh')
      .toContain('.ct-web-host > .pt-16');
  });

  it('hạ min-h-screen về chiều cao KHUNG, và chỉ ở phần tử GỐC', () => {
    expect(css, 'mất bản vá min-h-screen — mọi trang thừa 74px cuộn')
      .toContain('.ct-web-host > .min-h-screen');
  });

  /*
   * Chốt QUAN TRỌNG NHẤT của tệp này.
   *
   * `/language` dùng `py-16` cho khoảng thở BÊN TRONG, và nó cũng tính ra
   * padding-top 64px. Ai đó thấy hai bản vá trên rồi "gọn hoá" thành
   * `.ct-web-host .pt-16` (bỏ dấu `>`) hay tệ hơn là nhắm padding-top nói
   * chung, thì sẽ bóp nát bố cục một trang đang chạy tốt — và bóp im lặng,
   * vì không có gì tràn ra ngoài để `do:bo-cuc` bắt được.
   */
  it('trừ đúng 4rem nav cho pt-20/pt-24, không xoá sạch', () => {
    /* Hai lớp này là chừa-cho-nav CỘNG khoảng thở cố ý. Xoá sạch là bóp mất
       phần thứ hai; giữ nguyên là để lại 80-96px trống ở đỉnh. */
    expect(css).toMatch(/\.ct-web-host > \.pt-20\s*\{\s*padding-top:\s*1rem/);
    expect(css).toMatch(/\.ct-web-host > \.pt-24\s*\{\s*padding-top:\s*2rem/);
  });

  it('KHÔNG được nhắm rộng hơn con trực tiếp', () => {
    for (const lop of ['pt-16', 'pt-20', 'pt-24', 'min-h-screen']) {
      const rong = new RegExp(`\\.ct-web-host\\s+\\.${lop.replace('-', '\\-')}`);
      expect(rong.test(css), `\`.ct-web-host .${lop}\` (thiếu dấu >) chạm cả bố cục BÊN TRONG trang`)
        .toBe(false);
    }
    expect(css, 'đừng nhắm padding-top nói chung — `py-16` của Ngoại ngữ cũng dính')
      .not.toMatch(/\.ct-web-host\s*>\s*\*\s*\{[^}]*padding-top/);
  });
});
