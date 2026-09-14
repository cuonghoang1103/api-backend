import { describe, expect, it, vi } from 'vitest';

import { cauImLang, docCoHanIm, TRAN_IM_LANG_MS } from './hanImLang';

/** Một bộ đọc giả: trả mẩu sau `tre` ms, hoặc không bao giờ trả. */
function docGia(tre: number | 'khongBaoGio', giaTri: unknown = { done: false, value: 'x' }) {
  return {
    read: () => (tre === 'khongBaoGio'
      ? new Promise<never>(() => { /* im lặng vĩnh viễn — đúng ca cổng chết */ })
      : new Promise((xong) => { setTimeout(() => xong(giaTri), tre); })),
  };
}

describe('đọc có hạn im lặng', () => {
  it('mẩu về KỊP ⇒ trả đúng giá trị', async () => {
    const kq = await docCoHanIm(docGia(10, { done: false, value: 'abc' }), 200);
    expect(kq).toEqual({ ok: true, giaTri: { done: false, value: 'abc' } });
  });

  it('⛔ KHÔNG BAO GIỜ về ⇒ báo im lặng, KHÔNG treo', async () => {
    /* Đây là cả lý do tệp này tồn tại. Trước bản vá, `for(;;) await doc.read()`
       gặp ca này là chờ vĩnh viễn — người dùng nhìn màn hình đứng ở bước 35/160
       suốt 159 giây và không có gì tự thoát. */
    const kq = await docCoHanIm(docGia('khongBaoGio'), 60);
    expect(kq).toEqual({ ok: false, imLang: true });
  });

  it('mẩu về ĐÚNG SAU hạn ⇒ vẫn tính là im lặng', async () => {
    const kq = await docCoHanIm(docGia(150), 50);
    expect(kq).toEqual({ ok: false, imLang: true });
  });

  it('⛔ mẩu về MUỘN không được ném unhandledRejection', async () => {
    // Lời hứa đọc không huỷ được. Bỏ mặc nó là để lại một rejection lơ lửng sẽ
    // nổ khi luồng bị đóng ngay sau đó — và nó nổ ở chỗ CHẲNG LIÊN QUAN.
    const bat = vi.fn();
    process.on('unhandledRejection', bat);
    const doc = { read: () => new Promise((_, hong) => { setTimeout(() => hong(new Error('luồng đã đóng')), 30); }) };
    expect(await docCoHanIm(doc, 10)).toEqual({ ok: false, imLang: true });
    await new Promise((r) => { setTimeout(r, 80); });
    process.off('unhandledRejection', bat);
    expect(bat).not.toHaveBeenCalled();
  });

  it('lỗi đọc THẬT vẫn ném ra ngoài, không bị nuốt thành "im lặng"', async () => {
    // Nuốt lỗi thật thành "im lặng" là chẩn sai: người dùng được bảo "cổng
    // chậm" trong khi thứ hỏng là luồng đã đóng vì lý do khác.
    const doc = { read: () => Promise.reject(new Error('socket hang up')) };
    await expect(docCoHanIm(doc, 500)).rejects.toThrow('socket hang up');
  });

  it('trần mặc định là 2 phút', () => {
    // Cổng rambo trải 308–950ms giữa hai mẩu (đo thật), nên im lặng 2 phút
    // nghĩa là đầu bên kia đã chết mà chưa đóng kết nối. Đặt quá thấp thì giết
    // oan những lượt suy luận nặng.
    expect(TRAN_IM_LANG_MS).toBe(120_000);
  });
});

describe('câu báo khi cổng tắt tiếng', () => {
  it('nói RÕ chờ bao lâu, và nói việc đã làm KHÔNG mất', () => {
    const c = cauImLang(120_000);
    expect(c).toContain('2 phút');
    expect(c).toContain('vẫn giữ nguyên');
  });

  it('⛔ không phải câu chung chung "đã xảy ra lỗi"', () => {
    // Câu chung chung là thứ khiến người dùng ngồi thử lại năm lần.
    expect(cauImLang()).toMatch(/Cổng AI/);
    expect(cauImLang()).not.toMatch(/^Đã xảy ra lỗi/);
  });
});
