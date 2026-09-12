/**
 * Kiểm vòng tròn Camelot bằng bảng tra mà DJ nào cũng thuộc.
 *
 * Số Camelot tính bằng công thức chứ không tra bảng, nên một dấu sai trong
 * công thức sẽ làm LỆCH CẢ VÒNG mà vẫn ra mã trông hợp lệ — `8B` vẫn là `8B`,
 * chỉ là nó không còn là Đô trưởng nữa. Những phép kiểm dưới đây neo công thức
 * vào các cặp đã biết.
 */
import { describe, expect, it } from 'vitest';
import { ghepDuoc, hopNhau, maCamelot, soCamelot, tenTong, tuMaCamelot, type Tong } from './camelot';

const TRUONG = (pc: number): Tong => ({ chuAm: pc, the: 'truong' });
const THU = (pc: number): Tong => ({ chuAm: pc, the: 'thu' });

describe('mã Camelot', () => {
  it('neo vào bốn cặp kinh điển', () => {
    expect(maCamelot(TRUONG(0))).toBe('8B');   // Đô trưởng
    expect(maCamelot(THU(9))).toBe('8A');      // La thứ — thứ tương ứng, CÙNG số
    expect(maCamelot(TRUONG(7))).toBe('9B');   // Sol trưởng — lên quãng năm, +1
    expect(maCamelot(TRUONG(5))).toBe('7B');   // Fa trưởng — xuống quãng năm, −1
  });

  it('đi hết vòng quãng năm thì số tăng đúng 1 mỗi bước', () => {
    // Từ Đô trưởng cộng dồn quãng năm 12 lần phải quay đúng về chỗ cũ.
    for (let i = 0; i < 12; i++) {
      const mong = ((8 - 1 + i) % 12) + 1;
      expect(soCamelot(TRUONG((i * 7) % 12))).toBe(mong);
    }
  });

  it('mọi tông đều ra mã hợp lệ, và 24 tông ra đúng 24 mã khác nhau', () => {
    const ma = new Set<string>();
    for (let pc = 0; pc < 12; pc++) {
      ma.add(maCamelot(TRUONG(pc)));
      ma.add(maCamelot(THU(pc)));
    }
    expect(ma.size).toBe(24);
    for (const m of ma) expect(m).toMatch(/^(?:[1-9]|1[0-2])[AB]$/);
  });

  it('đọc ngược từ mã ra đúng tông ban đầu', () => {
    for (let pc = 0; pc < 12; pc++) {
      for (const t of [TRUONG(pc), THU(pc)]) {
        expect(tuMaCamelot(maCamelot(t))).toEqual(t);
      }
    }
  });

  it('mã sai dạng trả null chứ không đoán bừa', () => {
    expect(tuMaCamelot('13A')).toBeNull();
    expect(tuMaCamelot('0B')).toBeNull();
    expect(tuMaCamelot('8C')).toBeNull();
    expect(tuMaCamelot('')).toBeNull();
    expect(tuMaCamelot('  9a ')).toEqual(THU(4)); // có khoảng trắng và chữ thường thì vẫn đọc
  });

  it('tên tông đọc được', () => {
    expect(tenTong(TRUONG(0))).toBe('C');
    expect(tenTong(THU(9))).toBe('Am');
    expect(tenTong(THU(6))).toBe('F#m');
  });
});

describe('ghép hoà âm', () => {
  it('từ La thứ (8A) ra đúng năm lựa chọn, xếp từ an toàn nhất', () => {
    // 8A La thứ · 8B Đô trưởng (song song) · 9A Mi thứ (quãng năm)
    // · 7A Rê thứ (quãng bốn) · 10A Si thứ (nâng năng lượng)
    expect(ghepDuoc(THU(9)).map((g) => g.ma)).toEqual(['8A', '8B', '9A', '7A', '10A']);
  });

  it('thứ tương ứng luôn cùng số, khác chữ', () => {
    for (let pc = 0; pc < 12; pc++) {
      const truong = TRUONG(pc);
      const thuTuongUng = THU((pc + 9) % 12); // xuống quãng ba thứ
      expect(soCamelot(truong)).toBe(soCamelot(thuTuongUng));
      expect(hopNhau(truong, thuTuongUng)).toBe('songSong');
    }
  });

  it('hai tông xa nhau trên vòng thì KHÔNG ghép được', () => {
    // 8A và 2A cách nhau nửa vòng — xa nhất có thể.
    expect(hopNhau(THU(9), THU(3))).toBeNull();
  });

  it('mỗi gợi ý đều kèm câu giải thích cho người dùng đọc', () => {
    for (const g of ghepDuoc(TRUONG(0))) {
      expect(g.vi.length).toBeGreaterThan(10);
    }
  });
});
