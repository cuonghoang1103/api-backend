/**
 * Kiểm luật kẹp con robot trong app.
 *
 * Cỡ dùng ở đây là cỡ ĐO ĐƯỢC của `.odin-dock` trong Chromium với đúng
 * `odin.css` của app: **104×136** ở nấc 100% (robot 104×102 + khe 8 + micro
 * 26), rồi 85×111 · 69×90 · 54×71 ở ba nấc thu nhỏ. Thanh trạng thái 30px.
 * Luật cũ kẹp bằng hằng `80` — dưới đây là ba chỗ hằng ấy sai.
 */
import { describe, expect, it } from 'vitest';
import { kepDock, ngoaiKhung, type KhungKep } from './viTriDock';

const K: KhungKep = {
  rong: 104, cao: 136, cuaRong: 1200, cuaCao: 800, thanhTrangThai: 30,
};

describe('kẹp trong cửa sổ', () => {
  it('⛔ kéo hết sang TRÁI thì mép trái vẫn phải ở trong cửa sổ', () => {
    // Đo thật trong Chromium ở cửa sổ 1024 rộng: luật cũ cho mép trái = **-24px**,
    // tức 24px con robot nằm ngoài mép trái cửa sổ.
    const r = kepDock(99_999, 20, K);
    expect(K.cuaRong - r.phai - K.rong).toBeGreaterThanOrEqual(0);
    expect(r.phai).toBe(1092);
  });

  it('⛔ kéo hết LÊN TRÊN thì đỉnh đầu không được cắt cụt', () => {
    // Đo thật: luật cũ cho mép trên = **-86px** trên con robot cao 136 — tức
    // 63% con robot nằm bên trên mép cửa sổ, và nó KHÔNG kéo xuống lại được
    // vì phần bấm được đã ra ngoài vùng nhìn thấy.
    const r = kepDock(99_999, 99_999, K);
    expect(K.cuaCao - K.thanhTrangThai - r.duoi - K.cao).toBeGreaterThanOrEqual(0);
    expect(r.duoi).toBe(630);
  });

  it('trần DỌC phải trừ cả thanh trạng thái', () => {
    // Bỏ quên `thanhTrangThai` là lệch đúng 30px — vừa đủ để cắt mất đỉnh đầu
    // mà nhìn thoáng qua tưởng là "hơi lệch tí".
    const khong = kepDock(99_999, 99_999, { ...K, thanhTrangThai: 0 });
    expect(khong.duoi - kepDock(99_999, 99_999, K).duoi).toBe(30);
  });

  it('giá trị bình thường thì để nguyên', () => {
    expect(kepDock(22, 16, K)).toEqual({ phai: 22, duoi: 16 });
  });

  it('cửa sổ HẸP hơn con robot ⇒ dính mép phải/dưới, không trả số âm', () => {
    const r = kepDock(500, 500, { ...K, cuaRong: 60, cuaCao: 100 });
    expect(r.phai).toBeGreaterThanOrEqual(0);
    expect(r.duoi).toBeGreaterThanOrEqual(0);
  });
});

describe('đổi cỡ cửa sổ', () => {
  it('⛔ thu nhỏ cửa sổ ⇒ nhận ra robot đã ra ngoài', () => {
    // Không có nhánh này thì robot nằm ngoài vùng nhìn thấy vĩnh viễn: cử chỉ
    // mở khoá kéo nằm trên chính con robot, nên không còn đường lôi nó về.
    expect(ngoaiKhung(900, 16, K)).toBe(false);
    expect(ngoaiKhung(900, 16, { ...K, cuaRong: 600 })).toBe(true);
    expect(ngoaiKhung(22, 700, { ...K, cuaCao: 400 })).toBe(true);
  });
});
