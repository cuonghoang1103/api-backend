/**
 * Kiểm phần tính của núm xoay.
 *
 * Núm sai thì không ai báo lỗi — người ta chỉ thấy "hơi khó chỉnh" rồi thôi
 * không dùng nữa. Nên mọi con số ở đây phải bị chốt.
 */
import { describe, expect, it } from 'vitest';
import { CAO_QUET, GOC_QUET, HE_MIN, chuan, cung, diem, keo, ti } from './num';

const DAI = { min: -24, max: 6, buoc: 0.5 };

describe('chuẩn hoá giá trị', () => {
  it('làm tròn về bội của bước', () => {
    expect(chuan(-3.26, DAI)).toBe(-3.5);
    expect(chuan(-3.24, DAI)).toBe(-3);
  });

  it('kẹp vào hai đầu dải', () => {
    expect(chuan(-99, DAI)).toBe(-24);
    expect(chuan(99, DAI)).toBe(6);
  });

  it('⭐ không để lòi số thực nhị phân ra giao diện', () => {
    /* `0.1 * 3` là `0.30000000000000004`. Không cắt thì con số ấy hiện nguyên
       xi cạnh cái núm, và trông như app hỏng. */
    expect(chuan(0.3, { min: 0, max: 1, buoc: 0.1 })).toBe(0.3);
    expect(String(chuan(0.7, { min: 0, max: 1, buoc: 0.1 }))).toBe('0.7');
  });
});

describe('kéo chuột', () => {
  it('⭐ kéo LÊN thì TĂNG', () => {
    /* Ngược chiều `dy` của trình duyệt, và đúng chiều mọi núm vật lý quay.
       Đảo dấu ở đây là lỗi mà ai dùng cũng thấy ngay, còn ai viết thì không. */
    expect(keo(0, -10, DAI, false)).toBeGreaterThan(0);
    expect(keo(0, 10, DAI, false)).toBeLessThan(0);
  });

  it('kéo trọn CAO_QUET quét hết dải', () => {
    expect(keo(DAI.min, -CAO_QUET, DAI, false)).toBe(DAI.max);
    expect(keo(DAI.max, CAO_QUET, DAI, false)).toBe(DAI.min);
  });

  it(`giữ Shift thì chậm đi đúng ${HE_MIN} lần`, () => {
    /* Đo trên một dải mà BƯỚC KHÔNG làm méo tỉ lệ. Bản đầu đo trên `DAI`
       (bước 0,5 dB): kéo thường ra 8,333 → làm tròn 8,5, kéo Shift ra 1,667 →
       làm tròn 1,5, tỉ lệ thành 5,67 chứ không phải 5. Phép đo sai, không phải
       mã sai — nhưng nếu chiều nó bằng cách nới ngưỡng thì phép kiểm hết gác
       được hệ số thật. Dải 0…180 bước 1 thì 50px ra đúng 50 đơn vị. */
    const min1 = { min: 0, max: 180, buoc: 1 };
    expect(keo(90, -50, min1, false) - 90).toBe(50);
    expect(keo(90, -50, min1, true) - 90).toBe(50 / HE_MIN);
  });

  it('bước nhảy vẫn được áp sau khi kéo', () => {
    /* Kéo ra 8,333 dB trên dải bước 0,5 phải rơi vào nấc gần nhất. */
    expect(keo(-10, -50, DAI, false)).toBe(-1.5);
  });

  it('không vượt ra ngoài dải dù kéo bao xa', () => {
    expect(keo(0, -9999, DAI, false)).toBe(DAI.max);
    expect(keo(0, 9999, DAI, false)).toBe(DAI.min);
  });
});

describe('tỉ lệ', () => {
  it('hai đầu là 0 và 1, giữa là 0,5', () => {
    expect(ti(-24, DAI)).toBe(0);
    expect(ti(6, DAI)).toBe(1);
    expect(ti(-9, DAI)).toBeCloseTo(0.5, 6);
  });

  it('dải rỗng thì trả 0 chứ không NaN', () => {
    expect(ti(5, { min: 5, max: 5, buoc: 1 })).toBe(0);
  });
});

describe('hình học vòng cung', () => {
  it('⭐ đầu cung ở dưới-TRÁI, cuối cung ở dưới-PHẢI', () => {
    /* Quét 270° chừa 90° ở đáy. Đặt sai gốc thì núm trông như quay ngang, và
       mắt không đọc ra đâu là nhỏ nhất. */
    const a = diem(0, 40);
    const b = diem(1, 40);
    expect(a.x).toBeLessThan(50);
    expect(a.y).toBeGreaterThan(50);
    expect(b.x).toBeGreaterThan(50);
    expect(b.y).toBeGreaterThan(50);
  });

  it('giữa dải nằm ĐỈNH núm', () => {
    const g = diem(0.5, 40);
    expect(g.x).toBeCloseTo(50, 6);
    expect(g.y).toBeCloseTo(10, 6);
  });

  it('mọi điểm đều nằm đúng trên đường tròn bán kính đã cho', () => {
    for (const t of [0, 0.2, 0.5, 0.8, 1]) {
      const p = diem(t, 40);
      expect(Math.hypot(p.x - 50, p.y - 50)).toBeCloseTo(40, 6);
    }
  });

  it('⭐ cung quá nửa vòng phải bật cờ largeArc', () => {
    /* Quên cờ này thì SVG vẽ phần BÙ của cung: núm chỉ 80% mà trông như 20%.
       Với dải 270° thì ngưỡng rơi vào tỉ lệ 2/3. */
    expect(cung(0, 0.9, 40)).toMatch(/A 40 40 0 1 1/);
    expect(cung(0, 0.4, 40)).toMatch(/A 40 40 0 0 1/);
  });

  it(`ngưỡng largeArc đúng ở ${GOC_QUET}° / 2`, () => {
    const nguong = 180 / GOC_QUET;
    expect(cung(0, nguong - 0.01, 40)).toContain(' 0 0 1 ');
    expect(cung(0, nguong + 0.01, 40)).toContain(' 0 1 1 ');
  });
});
