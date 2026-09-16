/**
 * Bộ đếm cú bấm của con robot nổi.
 *
 * Mỗi phép kiểm ở đây tương ứng một cách hỏng ĐÃ XẢY RA hoặc suýt xảy ra —
 * không có phép nào chỉ để tăng con số độ phủ.
 */
import { describe, it, expect } from 'vitest';
import { taoBoDem } from './demCuBam';

const CUA_SO = 600;
const LECH = 12;

/** Cú bấm với `detail` do trình duyệt cấp. */
function bam(detail: number, x = 100, y = 100) {
  return { detail, screenX: x, screenY: y };
}

describe('đếm cú bấm robot', () => {
  it('trình duyệt đếm đúng ⇒ trả đúng con số của trình duyệt', () => {
    const d = taoBoDem(CUA_SO, LECH);
    expect(d.dem(bam(1), 0)).toBe(1);
    expect(d.dem(bam(2), 100)).toBe(2);
    expect(d.dem(bam(3), 200)).toBe(3);
    expect(d.dem(bam(4), 300)).toBe(4);
  });

  it('⭐ LỖI WINDOWS: `detail` kẹt ở 1 vì cửa sổ trượt ⇒ vẫn đếm tới 3 rồi 4', () => {
    // Đúng cảnh người dùng báo: chế độ kéo đang BẬT, mỗi cú bấm kéo cửa sổ đi
    // một chút, Chromium thấy khoảng cách trong-cửa-sổ quá xa nên trả `detail`
    // về 1 mãi. Con trỏ thì đứng yên trên MÀN HÌNH.
    const d = taoBoDem(CUA_SO, LECH);
    expect(d.dem(bam(1), 0)).toBe(1);
    expect(d.dem(bam(1), 120)).toBe(2);
    expect(d.dem(bam(1), 240)).toBe(3);   // ← chỗ bản cũ đứng lại ở 1
    expect(d.dem(bam(1), 360)).toBe(4);
  });

  it('con trỏ xê dịch quá ngưỡng ⇒ là chuỗi MỚI, không phải cú tiếp theo', () => {
    // Bấm vào robot rồi bấm vào một chỗ khác hẳn không được cộng dồn — nếu
    // không, hai lần bấm rời nhau vào hai đầu màn hình thành "nhấp đúp".
    const d = taoBoDem(CUA_SO, LECH);
    expect(d.dem(bam(1, 100, 100), 0)).toBe(1);
    expect(d.dem(bam(1, 100 + LECH + 1, 100), 100)).toBe(1);
  });

  it('xê dịch TRONG ngưỡng vẫn tính là liên tiếp — tay người không đứng yên tuyệt đối', () => {
    const d = taoBoDem(CUA_SO, LECH);
    expect(d.dem(bam(1, 100, 100), 0)).toBe(1);
    expect(d.dem(bam(1, 100 + LECH, 100 - LECH), 100)).toBe(2);
  });

  it('cách nhau quá cửa sổ thời gian ⇒ đếm lại từ 1', () => {
    const d = taoBoDem(CUA_SO, LECH);
    expect(d.dem(bam(1), 0)).toBe(1);
    expect(d.dem(bam(1), CUA_SO + 1)).toBe(1);
  });

  it('⭐ khepLai() cắt chuỗi ⇒ hai cử chỉ RỜI không bị gộp thành nhấp đúp', () => {
    // Cửa sổ đếm (600ms) rộng hơn nhịp hoãn của cử chỉ (260ms) một cách cố ý.
    // Không khép lại thì: bấm mở khung chat → 260ms sau khung mở → bấm lần nữa
    // để đóng, và bộ đếm nói "2" ⇒ nhảy sang cửa sổ chính thay vì đóng khung.
    const d = taoBoDem(CUA_SO, LECH);
    expect(d.dem(bam(1), 0)).toBe(1);
    d.khepLai();
    expect(d.dem(bam(1), 300)).toBe(1);
  });

  it('bấm bằng bàn phím (`detail` = 0) vẫn tính là một cú, không phải không cú', () => {
    const d = taoBoDem(CUA_SO, LECH);
    expect(d.dem(bam(0), 0)).toBe(1);
  });

  it('lấy số LỚN HƠN trong hai cách đếm — không cách nào một mình đủ', () => {
    // Ngưỡng nhấp đúp của máy người dùng dài hơn cửa sổ tự đếm: tự đếm trả 1,
    // trình duyệt trả 3, và câu trả lời đúng là 3.
    const d = taoBoDem(CUA_SO, LECH);
    d.dem(bam(1), 0);
    expect(d.dem(bam(3), CUA_SO + 50)).toBe(3);
  });
});
