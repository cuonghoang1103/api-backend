/**
 * Cổng vòng OAuth — canh bốn chốt bảo mật và MỘT lỗi đã trúng thật.
 *
 * ⚠️ Phép kiểm ĐỌC NGUỒN. Phần HÀNH VI đã đo trên bản đóng gói (24/08/2026,
 * Playwright + `_electron.launch`, chặn `shell.openExternal` để bắt URL):
 *   • URL mở ra mang `dt_cong` khớp cổng thật, `dt_nonce` 48 ký tự hex, `dt_nha`
 *   • nonce sai → 400 · thiếu token → 400 · đường lạ → 404 · `oauth.huy()` → đóng
 *   • lượt đúng → 200, cửa sổ APP nhận `{token}`, cửa sổ ROBOT nhận rỗng
 *   • gọi lại lần hai → kết nối bị từ chối
 * Cái không đo lại được ở đây là các chốt dưới, nên chúng bị neo vào nguồn.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const nguon = readFileSync(join(__dirname, 'oauthVong.ts'), 'utf8');

describe('cổng vòng OAuth', () => {
  /*
   * ⛔ LỖI ĐÃ TRÚNG THẬT. App có HAI cửa sổ và `getAllWindows()` KHÔNG có thứ tự
   * cố định — đo thật thì `index.html` nằm ở vị trí 1, tức `[0]` là cửa sổ
   * robot. Token bay vào con robot, trình duyệt báo "Đã đăng nhập" còn app
   * đứng nguyên ở màn đăng nhập, không một dòng lỗi nào.
   */
  it('trả token về ĐÚNG cửa sổ đã bấm, KHÔNG dùng getAllWindows()[0]', () => {
    expect(nguon, 'getAllWindows()[0] có thể là cửa sổ robot ⇒ đăng nhập chết câm')
      .not.toMatch(/getAllWindows\(\)\[0\]\s*\?\.\s*webContents/);
    expect(nguon, 'phải nhớ cửa sổ gọi qua event.sender')
      .toMatch(/BrowserWindow\.fromWebContents\(event\.sender\)/);
    expect(nguon, 'và gửi lại đúng cửa sổ đó').toMatch(/dangCho\.cuaSo\.webContents\.send/);
    expect(nguon, 'cửa sổ có thể đã đóng trong 5 phút chờ').toMatch(/isDestroyed\(\)/);
  });

  /*
   * `close()` chỉ ngừng nhận kết nối MỚI. Đo thật: sau lượt đầu, `fetch` dùng
   * lại kết nối keep-alive cũ và VẪN VÀO ĐƯỢC — cổng tưởng đóng thực ra còn mở.
   */
  it('ĐÓNG CẢ kết nối đang mở, không chỉ close()', () => {
    /* ⚠️ Neo vào CÂU LỆNH `dangCho.may.…`, không phải chữ `closeAllConnections`
       trần: chữ đó cũng nằm trong khối chú thích ngay trên nó, nên phép kiểm
       lỏng hơn sẽ XANH cả khi dòng lệnh đã bị xoá. Đúng bẫy này đã bắt được
       lúc thử lùi mã về bản hỏng để kiểm chính phép kiểm. */
    expect(nguon, 'thiếu closeAllConnections ⇒ cổng còn phục vụ sau lượt đầu')
      .toMatch(/dangCho\.may\.closeAllConnections\(\)/);
    const iCat = nguon.indexOf('dangCho.may.closeAllConnections()');
    const iDong = nguon.indexOf('dangCho.may.close()');
    expect(iCat, 'phải cắt kết nối TRƯỚC khi close()').toBeLessThan(iDong);
  });

  it('CHỈ nghe 127.0.0.1 và để hệ điều hành chọn cổng', () => {
    expect(nguon).toMatch(/listen\(0, '127\.0\.0\.1'/);
    expect(nguon, 'nghe 0.0.0.0 là cả mạng LAN gửi được').not.toContain("'0.0.0.0'");
  });

  it('nonce ngẫu nhiên mỗi lượt, và lượt đã đóng thì nonce đúng cũng vô giá trị', () => {
    expect(nguon).toMatch(/randomBytes\(24\)\.toString\('hex'\)/);
    expect(nguon, 'dangCho null ⇒ không còn lượt nào để nhận').toMatch(/Boolean\(dangCho\)/);
  });

  it('có HẾT GIỜ, và mở lượt mới thì đóng lượt cũ', () => {
    expect(nguon).toMatch(/setTimeout\(dongLuot, HET_GIO_MS\)/);
    const iBatDau = nguon.indexOf("handle('oauth:batDau'");
    const iDongCu = nguon.indexOf('dongLuot();', iBatDau);
    const iTaoMay = nguon.indexOf('createServer(', iBatDau);
    expect(iDongCu, 'phải đóng lượt cũ TRƯỚC khi dựng máy mới').toBeLessThan(iTaoMay);
  });
});
