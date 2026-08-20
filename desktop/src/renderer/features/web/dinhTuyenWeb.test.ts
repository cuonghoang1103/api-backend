import { describe, expect, it } from 'vitest';
import { TUYEN_WEB, khopTuyenWeb, thuocCayWeb } from './dinhTuyenWeb';

describe('khopTuyenWeb', () => {
  it('khớp đường dẫn tĩnh', () => {
    expect(khopTuyenWeb('/language')?.tuyen.mau).toBe('/language');
    expect(khopTuyenWeb('/roadmap')?.tuyen.mau).toBe('/roadmap');
  });

  it('rút được tham số động', () => {
    expect(khopTuyenWeb('/language/ja')?.thamSo).toEqual({ code: 'ja' });
    expect(khopTuyenWeb('/roadmap/frontend')?.thamSo).toEqual({ slug: 'frontend' });
    const s = khopTuyenWeb('/language/zh/hanzi');
    expect(s?.tuyen.mau).toBe('/language/:code/hanzi');
    expect(s?.thamSo).toEqual({ code: 'zh' });
  });

  /**
   * Chốt quan trọng nhất của tệp này. `/language/notebook` cùng hình dạng với
   * `/language/:code`; nhận nhầm là trang sổ tay gọi API với `code=notebook`
   * rồi hiện "không tìm thấy ngôn ngữ" — hỏng câm, không lỗi nào để thấy.
   */
  it('TĨNH thắng ĐỘNG: /language/notebook không bị đọc thành mã ngôn ngữ', () => {
    const k = khopTuyenWeb('/language/notebook');
    expect(k?.tuyen.mau).toBe('/language/notebook');
    expect(k?.thamSo).toEqual({});
  });

  it('cùng lý do: các trang con có tên cố định thắng /language/:code', () => {
    // `/language/:code` dài 2 đoạn, `/language/:code/vocab` dài 3 — nhưng nếu
    // ai đó thêm `/language/:code/:muc` thì thứ tự mảng là thứ giữ đúng.
    expect(khopTuyenWeb('/language/ja/vocab')?.tuyen.mau).toBe('/language/:code/vocab');
  });

  it('không khớp thì trả null, không đoán bừa', () => {
    expect(khopTuyenWeb('/language/ja/khong-co-trang-nay')).toBeNull();
    expect(khopTuyenWeb('/chat')).toBeNull();
    expect(khopTuyenWeb('/')).toBeNull();
  });

  it('giải mã đoạn có ký tự đặc biệt', () => {
    expect(khopTuyenWeb('/roadmap/c%2B%2B')?.thamSo).toEqual({ slug: 'c++' });
  });

  it('mọi mẫu trong bảng đều tự khớp lại chính nó', () => {
    for (const t of TUYEN_WEB) {
      const mau = t.mau.replace(/:([a-z]+)/g, 'x');
      const k = khopTuyenWeb(mau);
      expect(k, `không khớp lại: ${t.mau}`).not.toBeNull();
    }
  });

  it('không có mẫu nào trùng nhau', () => {
    const thay = new Set<string>();
    for (const t of TUYEN_WEB) {
      expect(thay.has(t.mau), `mẫu trùng: ${t.mau}`).toBe(false);
      thay.add(t.mau);
    }
    expect(thay.size).toBe(21);
  });
});

describe('thuocCayWeb', () => {
  it('nhận cả gốc lẫn trang con', () => {
    expect(thuocCayWeb('/language')).toBe(true);
    expect(thuocCayWeb('/language/ja/vocab')).toBe(true);
    expect(thuocCayWeb('/roadmap/frontend')).toBe(true);
  });

  it('KHÔNG nhận route chỉ trùng tiền tố chuỗi', () => {
    // `/languages` bắt đầu bằng `/language` nếu so chuỗi trần — phải so theo
    // ranh giới đoạn, không thì một route khác bị nuốt vào cây Ngoại ngữ.
    expect(thuocCayWeb('/languages')).toBe(false);
    expect(thuocCayWeb('/roadmapper')).toBe(false);
    expect(thuocCayWeb('/chat')).toBe(false);
  });
});
