import { describe, expect, it } from 'vitest';
/* Kiểm tệp DÙNG CHUNG `frontend/src/lib/tinNhan/anh.ts`. */
import { tenAnhTuUrl } from '@/lib/tinNhan/anh';

const luc = new Date(2026, 8, 14, 5, 7, 9);

describe('đặt tên khi lưu ảnh', () => {
  it('lấy phần cuối đường dẫn, bỏ tham số truy vấn', () => {
    expect(tenAnhTuUrl('https://cdn.x/a/b/meo.png?w=800&h=600')).toBe('meo.png');
  });

  it('giải mã %20 thành khoảng trắng', () => {
    expect(tenAnhTuUrl('https://cdn.x/anh%20cua%20toi.jpg')).toBe('anh cua toi.jpg');
  });

  it('⛔ không để lọt ".." — schema chặn, mà lỗi hiện ra rất khó đoán', () => {
    const t = tenAnhTuUrl('https://cdn.x/a/..%2F..%2Fetc%2Fpasswd.png');
    expect(t).not.toContain('..');
    expect(t).not.toContain('/');
  });

  it('⛔ không để lọt dấu phân cách đường dẫn', () => {
    expect(tenAnhTuUrl('https://cdn.x/a%2Fb%5Cc.png')).not.toMatch(/[/\\]/);
  });

  it('thiếu đuôi thì thêm đuôi suy từ đường dẫn', () => {
    expect(tenAnhTuUrl('https://cdn.x/abc')).toBe('abc.jpg');
  });

  it('đuôi lạ KHÔNG được tin — thêm .jpg', () => {
    // `.php` ở cuối đường dẫn ảnh là chuyện có thật với vài CDN.
    expect(tenAnhTuUrl('https://cdn.x/lay-anh.php')).toBe('lay-anh.php.jpg');
  });

  it('không đoán được tên ⇒ tên theo giờ, KHÔNG để trống', () => {
    expect(tenAnhTuUrl('https://cdn.x/', luc)).toBe('anh-20260914-050709.jpg');
    expect(tenAnhTuUrl('', luc)).toBe('anh-20260914-050709.jpg');
  });

  it('tên bắt đầu bằng dấu chấm cũng thành tên theo giờ', () => {
    // `.hoso` là tệp ẩn, không phải tên ảnh — người dùng sẽ không thấy nó.
    expect(tenAnhTuUrl('https://cdn.x/.hoso', luc)).toBe('anh-20260914-050709.jpg');
  });

  it('tên dài bị cắt về 200 ký tự (trần của schema)', () => {
    expect(tenAnhTuUrl(`https://cdn.x/${'a'.repeat(400)}.png`).length).toBeLessThanOrEqual(200);
  });
});
