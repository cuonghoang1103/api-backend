/**
 * Canh `<Toaster>` của sonner luôn được dựng, và dựng ĐÚNG CHỖ, ĐÚNG CHỦ ĐỀ.
 *
 * ─── Vì sao tệp này tồn tại ───
 * Thiếu `<Toaster>` thì sonner không có chỗ vẽ và MỌI lời gọi `toast.*` im
 * lặng. Đo 24/08/2026 trên các cây web mà desktop dùng lại: **46 tệp, 226 lời
 * gọi, trong đó 143 là `toast.error`**. Người dùng bấm Lưu, việc hỏng, màn
 * hình không nói gì — hỏng câm đúng nghĩa.
 *
 * ⚠️ KHÔNG bộ kiểm nào hiện có với tới chỗ này:
 *  • `do:bo-cuc` dựng lại vỏ THỦ CÔNG trong `scripts/bo-cuc/trang-thu.tsx`,
 *    KHÔNG đi qua `App.tsx` — đúng điểm mù đã sinh ra lỗi định tuyến đường con.
 *  • `smoke.mjs` dừng ở màn đăng nhập, mà `Shell` chỉ dựng SAU khi đăng nhập.
 * Nên đây là phép kiểm ĐỌC NGUỒN, và nó nói thẳng ra giới hạn đó thay vì giả
 * vờ đã đo hành vi.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const app = readFileSync(join(__dirname, 'App.tsx'), 'utf8');

describe('Toaster cho cây web', () => {
  it('được dựng trong App.tsx', () => {
    expect(app, "thiếu `<Toaster>` — 226 lời gọi `toast.*` sẽ im lặng")
      .toMatch(/<Toaster\b/);
    expect(app, "chưa nhập Toaster từ sonner").toContain("from 'sonner'");
  });

  /*
   * Cấu hình của web (`ToasterProvider.tsx`) đặt CỨNG `theme="dark"` và nền
   * `--darkcard`. Hợp lý ở đó vì web luôn tối; app thì có cả chủ đề SÁNG, và
   * toast tối cố định trên nền sáng là đúng họ lỗi 02/07/2026 — nền cố định
   * gặp chữ theo chủ đề. Ai chép nguyên cấu hình web sang đây sẽ tái tạo nó.
   */
  it('theo CHỦ ĐỀ của app, không đặt cứng "dark"', () => {
    expect(app, 'theme phải theo `resolvedTheme`, không đặt cứng')
      .toMatch(/theme=\{resolvedTheme\}/);
    expect(app, 'đặt cứng theme="dark" là toast tối trên nền sáng')
      .not.toMatch(/<Toaster[\s\S]{0,400}theme="dark"/);
    expect(app, 'màu nền/chữ phải là biến của app, không phải hằng của web')
      .not.toMatch(/<Toaster[\s\S]{0,400}--darkcard/);
  });

  /*
   * Lề phải tính theo thanh tiêu đề CỦA APP. `--app-nav-h` là biến của web;
   * ở đây nó không tồn tại nên sonner rơi về mặc định và toast đè lên thanh
   * tiêu đề.
   */
  it('chừa đúng thanh tiêu đề của app', () => {
    /* Chỉ soi TRONG thẻ `<Toaster>`, không soi cả tệp: chú thích ngay trên nó
       có nhắc `--app-nav-h` để giải thích vì sao KHÔNG dùng biến đó, và soi cả
       tệp thì phép kiểm đỏ vì chính lời giải thích. Đã dính đúng thế một lần. */
    /* `indexOf('<Toaster')` bắt trúng chữ `<Toaster>` TRONG CHÚ THÍCH — đã
       dính. Lấy đúng phần tử JSX: nó là chỗ `<Toaster` xuống dòng rồi tới prop. */
    const dau = app.search(/<Toaster\s*\n/);
    expect(dau, 'không thấy phần tử <Toaster> thật').toBeGreaterThan(-1);
    const the = app.slice(dau, app.indexOf('/>', dau));
    expect(the, 'lề phải theo `--ct-titlebar-h`').toContain('--ct-titlebar-h');
    expect(the, '`--app-nav-h` là biến của WEB, không có trong app')
      .not.toContain('--app-nav-h');
  });

  /*
   * Đặt trong `VoWeb` thì mỗi lần đổi route lại dựng lại một bản, và cây Notes
   * (host riêng `ct-notes-host`, 11 tệp gọi toast) không đi qua `VoWeb` nên sẽ
   * bị sót hẳn.
   */
  it('dựng ở Shell — MỘT bản, phủ cả Notes', () => {
    const vo = readFileSync(join(__dirname, 'features/web/TrangWeb.tsx'), 'utf8');
    expect(vo, 'Toaster KHÔNG được đặt trong VoWeb — xem chú thích trong App.tsx')
      .not.toMatch(/<Toaster\b/);
  });
});
