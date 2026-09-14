import { describe, expect, it } from 'vitest';

import { GAN_TRAN, ganTran, nhanBuoc } from './nhanBuoc';

/** `dichP` giả: giữ nguyên câu Việt, thay chỗ trống. */
const dP = (c: string, t: Record<string, string | number>) =>
  c.replace(/\{(\w+)\}/g, (n, k: string) => (k in t ? String(t[k]) : n));

describe('nhãn bước', () => {
  it('⛔ bình thường KHÔNG hiện trần — nó bị đọc thành thanh tiến độ', () => {
    /* Người dùng đọc `35/160` là "mới 35, còn 125 nữa" và hỏi sao lắm bước thế.
       Nhưng 160 là TRẦN, không phải kế hoạch — agent thường xong ở bước 36. */
    expect(nhanBuoc(35, 160, dP)).toBe('bước 35');
    expect(nhanBuoc(1, 160, dP)).toBe('bước 1');
    expect(nhanBuoc(100, 160, dP)).toBe('bước 100');
  });

  it('GẦN TRẦN mới hiện trần — lúc đó nó mới là thông tin thật', () => {
    // Sát trần thì máy chủ sẽ CẮT ngang, và người dùng cần biết trước.
    expect(nhanBuoc(155, 160, dP)).toBe('bước 155/160');
    expect(nhanBuoc(160, 160, dP)).toBe('bước 160/160');
  });

  it('mốc chuyển đúng ở đúng chỗ', () => {
    expect(ganTran(160 - GAN_TRAN, 160)).toBe(true);
    expect(ganTran(160 - GAN_TRAN - 1, 160)).toBe(false);
  });

  it('trần NHỎ (mức "Thấp" = 8 bước) vẫn hợp lý', () => {
    // Với trần 8 thì mọi bước đều "gần trần" — và đúng là thế, người dùng cần
    // thấy ngay rằng họ chỉ có 8 bước.
    expect(nhanBuoc(2, 8, dP)).toBe('bước 2/8');
  });

  it('trần 0 hoặc vô nghĩa ⇒ chỉ hiện số bước, không chia cho rác', () => {
    expect(nhanBuoc(5, 0, dP)).toBe('bước 5');
  });
});
