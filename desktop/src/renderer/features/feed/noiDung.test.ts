/**
 * Bảng tin dựng markdown do NGƯỜI KHÁC viết. Đây là bề mặt tấn công thật sự
 * duy nhất của trang này, nên nó phải có phép kiểm — không phải vì `doanChu`
 * đáng ngờ (nó thoát HTML trước, định dạng sau), mà vì `trangTri` CHÈN THÊM
 * thẻ `<a href="...">` sau đó, và một chỗ chèn thẻ luôn là chỗ có thể sai.
 */
import assert from 'node:assert/strict';

import { describe, expect, it } from 'vitest';

import { doanChu } from '../chat/markdown';
import { maYouTube, trangTri } from './noiDung';

const dung = (s: string) => trangTri(doanChu(s));

describe('nội dung bài viết', () => {
  it('dựng markdown — đây là lỗi người dùng báo 19/08', () => {
    const html = dung('Hôm nay ta **ghép lại thành một cuộc trò chuyện thật** nhé');
    expect(html).toContain('<strong>ghép lại thành một cuộc trò chuyện thật</strong>');
    expect(html).not.toContain('**');
  });

  it('danh sách và tiêu đề ra đúng thẻ', () => {
    const html = dung('## Chào hỏi\n- **Hi!** — chào nhanh\n- **Hello.** — trung tính');
    // `doanChu` đổ MỌI cấp tiêu đề về `h4` (chú thích ở markdown.tsx:238):
    // tiêu đề của người khác không được lấn giao diện app. Phân cấp bằng CSS.
    expect(html).toContain('<h4>Chào hỏi</h4>');
    expect(html).toContain('<li>');
  });

  // ── An toàn ────────────────────────────────────────────────
  it('thẻ HTML trong bài KHÔNG thành thẻ thật', () => {
    const html = dung('<script>alert(1)</script> và <img src=x onerror=alert(2)>');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;script&gt;');
  });

  it('liên kết trần KHÔNG thoát ra ngoài thuộc tính href', () => {
    // `"` đã bị `thoat()` đổi thành `&quot;` nên nó không còn là dấu đóng
    // thuộc tính. Nếu ai đó bỏ bước thoát đó đi, phép kiểm này đỏ.
    const html = dung('xem https://x.com/a"onmouseover="alert(1) nhé');
    expect(html).not.toMatch(/"\s*onmouseover/);
    expect(html).toContain('&quot;');
  });

  it('CHỈ http/https thành liên kết — javascript: thì không', () => {
    const html = dung('bấm javascript:alert(1) đi');
    expect(html).not.toContain('<a href="javascript:');
  });

  it('không bọc liên kết hai lần trong href của liên kết markdown', () => {
    const html = dung('[trang chủ](https://cuongthai.com)');
    assert.equal((html.match(/<a /g) ?? []).length, 1, html);
  });

  // ── Hashtag / nhắc tên ─────────────────────────────────────
  it('hashtag tiếng Việt CÓ DẤU vẫn nhận', () => {
    // `\w` và `\b` không khớp chữ Việt có dấu — đây là lý do dùng \p{L}.
    expect(dung('cùng học #tiếngAnh nào')).toContain('#tiếngAnh</span>');
    expect(dung('#họcmãi')).toContain('#họcmãi</span>');
  });

  it('@nhắc tên thành thẻ riêng', () => {
    expect(dung('cảm ơn @cuong_hoang nhé')).toContain('@cuong_hoang</span>');
  });

  it('email KHÔNG bị hiểu nhầm là nhắc tên', () => {
    // `@gmail` đứng sau chữ, không sau khoảng trắng ⇒ không khớp.
    expect(dung('gửi tới ai@gmail.com')).not.toContain('ct-bt-nhac');
  });
});

describe('mã YouTube', () => {
  it('nhận mọi dạng liên kết thường gặp', () => {
    for (const u of [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ',
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
      'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    ]) expect(maYouTube(u), u).toBe('dQw4w9WgXcQ');
  });
  it('không nhận bừa', () => {
    expect(maYouTube('https://vimeo.com/123')).toBeNull();
    expect(maYouTube(null)).toBeNull();
  });
});
