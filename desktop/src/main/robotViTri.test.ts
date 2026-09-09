/**
 * Kiểm vị trí cửa sổ robot.
 *
 * Bốn lỗi này ĐÃ ĐO trên app thật trước khi vá (xem đầu `robotViTri.ts`), nên
 * mỗi phép kiểm dưới đây dựng lại đúng con số đã đo — không phải tình huống
 * tôi nghĩ ra.
 */
import { describe, expect, it } from 'vitest';
import { kep, doiCoGiuGoc, vungChoDiem } from './robotViTri';

/** Vùng làm việc thật của máy đo: MacBook 1728×1022, mép trên 33px là menu bar. */
const VUNG = { x: 0, y: 33, width: 1728, height: 1022 };
const GON = { width: 150, height: 190 };

describe('kẹp trong màn hình', () => {
  it('⛔ kéo mạnh sang phải-dưới KHÔNG được để robot thò ra ngoài', () => {
    // Đo thật trước khi vá: keoToi(9000,9000) ⇒ x=1688 (thò 110px), y=1027
    // (mép dưới nằm 162px dưới đáy vùng làm việc).
    const r = kep({ x: 1688, y: 1027, ...GON }, VUNG);
    expect(r.x + r.width).toBeLessThanOrEqual(VUNG.x + VUNG.width);
    expect(r.y + r.height).toBeLessThanOrEqual(VUNG.y + VUNG.height);
    expect(r).toEqual({ x: 1578, y: 865, ...GON });
  });

  it('⛔ kéo mạnh sang trái-trên cũng vậy — Windows KHÔNG tự chặn', () => {
    // macOS kẹp một phần (đo được x=-110); Windows nhận đúng -5000 và con robot
    // biến mất không đường lấy lại (không khung, không thanh tác vụ).
    expect(kep({ x: -5000, y: -5000, ...GON }, VUNG)).toEqual({ x: 0, y: 33, ...GON });
  });

  it('cửa sổ TO HƠN màn hình thì ưu tiên mép trên-trái', () => {
    // Thà thò ra mép dưới-phải còn hơn đẩy phần điều khiển ra ngoài tầm với.
    const nho = { x: 0, y: 0, width: 300, height: 400 };
    expect(kep({ x: 50, y: 50, width: 380, height: 520 }, nho)).toEqual({
      x: 0, y: 0, width: 380, height: 520,
    });
  });
});

describe('đổi cỡ giữ góc gần nhất', () => {
  it('⛔ ở góc TRÊN-TRÁI, thu nhỏ KHÔNG được trôi vào giữa', () => {
    // Đo thật trước khi vá: (10,43) 150×190 → thu về 52% ⇒ (82,134), tức dịch
    // 72px sang phải và 91px xuống — rời khỏi đúng góc người dùng vừa chọn.
    const r = doiCoGiuGoc({ x: 10, y: 43, ...GON }, { width: 78, height: 99 }, VUNG);
    expect(r).toEqual({ x: 10, y: 43, width: 78, height: 99 });
  });

  it('ở góc DƯỚI-PHẢI vẫn neo dưới-phải như cũ', () => {
    // Hành vi cũ đúng cho góc này — vá không được làm hỏng nó.
    const cu = { x: 1578, y: 865, ...GON };
    const r = doiCoGiuGoc(cu, { width: 78, height: 99 }, VUNG);
    expect(r.x + r.width).toBe(cu.x + cu.width);
    expect(r.y + r.height).toBe(cu.y + cu.height);
  });

  it('⛔ mở khung chat 380×520 ở góc trên-trái KHÔNG được văng ra ngoài', () => {
    // Đo thật trước khi vá: (10,43) → (-220,-287). Khung chat nằm ngoài màn
    // hình: người dùng gõ vào một thứ họ không nhìn thấy.
    const r = doiCoGiuGoc({ x: 10, y: 43, ...GON }, { width: 380, height: 520 }, VUNG);
    expect(r).toEqual({ x: 10, y: 43, width: 380, height: 520 });
    expect(r.x).toBeGreaterThanOrEqual(VUNG.x);
    expect(r.y).toBeGreaterThanOrEqual(VUNG.y);
  });

  it('mở khung chat sát đáy thì nó mở NGƯỢC LÊN, không đâm xuống dưới', () => {
    const r = doiCoGiuGoc({ x: 1578, y: 865, ...GON }, { width: 380, height: 520 }, VUNG);
    expect(r.y + r.height).toBeLessThanOrEqual(VUNG.y + VUNG.height);
  });
});

describe('màn hình đã lưu có thể không còn', () => {
  const chinh = VUNG;
  const ngoai = { x: 1728, y: 0, width: 2560, height: 1440 };

  it('điểm nằm trên màn ngoài ⇒ lấy vùng của màn ngoài', () => {
    expect(vungChoDiem({ x: 2000, y: 500 }, [chinh, ngoai], chinh)).toBe(ngoai);
  });

  it('⛔ rút màn ngoài ra ⇒ rơi về màn chính, KHÔNG trả vùng không tồn tại', () => {
    // Không có nhánh này thì vị trí cũ trỏ vào khoảng không, và một cửa sổ
    // không khung nằm ngoài mọi màn hình là cửa sổ không lấy lại được.
    expect(vungChoDiem({ x: 2000, y: 500 }, [chinh], chinh)).toBe(chinh);
  });
});
