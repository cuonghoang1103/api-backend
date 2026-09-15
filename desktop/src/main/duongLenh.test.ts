/**
 * Gộp PATH — phần tính toán của bản vá "agent không thấy node/docker/psql".
 *
 * Phần HỎI SHELL không kiểm được ở đây (nó phụ thuộc `.zshrc` của từng máy),
 * nhưng đã đo thật trên máy người dùng 15/09/2026, giả lập đúng cách app mở
 * từ Dock (`env -i PATH=/usr/bin:/bin:/usr/sbin:/sbin`):
 *
 *     trước:  node❌ npm❌ npx❌ docker❌ psql❌ brew❌ pg_ctl❌ git✔   (1/8)
 *     sau:    node✔ npm✔ npx✔ docker✔ psql✔ brew✔ pg_ctl✔ git✔      (8/8), 1,57s
 *
 * Phép kiểm dưới đây gác phần còn lại: việc gộp phải KHÔNG BAO GIỜ làm mất
 * một đường đang có. Mất một đường là app tự tay gỡ một công cụ khỏi tầm với
 * của agent — tệ hơn hẳn trạng thái trước khi vá.
 */
import { describe, expect, it } from 'vitest';
import { gopPath } from './duongLenh';

describe('gopPath', () => {
  it('GIỮ NGUYÊN thứ tự cũ rồi mới thêm phần mới', () => {
    // Thứ tự quyết định BẢN NÀO được chạy khi có hai bản cùng tên. Đẩy đường
    // mới lên trước là đổi ngầm `node` mà người dùng vẫn dùng sang bản khác.
    expect(gopPath('/usr/bin:/bin', ['/opt/homebrew/bin']))
      .toBe('/usr/bin:/bin:/opt/homebrew/bin');
  });

  it('không làm mất đường nào đang có', () => {
    const cu = '/usr/bin:/bin:/usr/sbin:/sbin';
    const ra = gopPath(cu, ['/opt/homebrew/bin', '/usr/local/bin']).split(':');
    for (const d of cu.split(':')) expect(ra).toContain(d);
  });

  it('bỏ trùng, giữ lần xuất hiện ĐẦU', () => {
    expect(gopPath('/usr/bin:/usr/local/bin', ['/usr/local/bin', '/opt/homebrew/bin']))
      .toBe('/usr/bin:/usr/local/bin:/opt/homebrew/bin');
  });

  it('bỏ mục rỗng — một dấu hai chấm thừa nghĩa là "thư mục hiện tại"', () => {
    // PATH có mục rỗng là lỗ bảo mật cổ điển: chạy `ls` trong một thư mục lạ
    // có thể chạy phải `./ls` của thư mục đó.
    expect(gopPath('/usr/bin::/bin:', ['  ', '/opt/homebrew/bin']))
      .toBe('/usr/bin:/bin:/opt/homebrew/bin');
  });

  it('PATH cũ rỗng thì vẫn ra kết quả dùng được', () => {
    expect(gopPath('', ['/opt/homebrew/bin'])).toBe('/opt/homebrew/bin');
  });
});
