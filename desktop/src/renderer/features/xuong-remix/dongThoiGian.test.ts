/**
 * Kiểm phần tính của dòng thời gian.
 *
 * Lỗi ở đây đi THẲNG vào bản nhạc: mảnh lệch nửa ô thì bản mashup lệch nhịp,
 * mà trên màn hình nó vẫn nằm trông như đúng chỗ. Không có gì để nhìn ra, nên
 * phải chốt bằng con số.
 */
import { describe, expect, it } from 'vitest';
import { tiLeManh } from '../../../main/nhac/dung';
import type { ManhDung } from '../../../shared/ipc';
import {
  batNhip, catPhai, catTrai, daiTrenDong, giayMoiO, khungManh, lanTheoBai,
  soO, tiLeKeo, vachLuoi,
} from './dongThoiGian';

function manh(p: Partial<ManhDung> = {}): ManhDung {
  return {
    id: 'm', baiId: 'a', nguon: 'goc',
    tuGiay: 10, denGiay: 20, datGiay: 4,
    gainDb: 0, vaoGiay: 0, raGiay: 0,
    ...p,
  };
}

describe('lưới nhạc', () => {
  it('128 BPM: một ô là 1,875 giây', () => {
    expect(giayMoiO(128)).toBeCloseTo((60 / 128) * 4, 6);
  });

  it('bắt về ô gần nhất', () => {
    const o = giayMoiO(120); // 2s
    expect(batNhip(2.4, 120, 1)).toBeCloseTo(o, 6);
    expect(batNhip(3.7, 120, 1)).toBeCloseTo(o * 2, 6);
  });

  it('chia 4 thì bắt theo PHÁCH', () => {
    expect(batNhip(0.6, 120, 4)).toBeCloseTo(0.5, 6);
  });

  it('chia 0 là tắt bắt nhịp', () => {
    expect(batNhip(3.14159, 120, 0)).toBeCloseTo(3.14159, 6);
  });

  it('không bao giờ trả số âm', () => {
    expect(batNhip(-5, 120, 1)).toBe(0);
    expect(batNhip(-5, 120, 0)).toBe(0);
  });

  it('BPM = 0 thì không chia cho 0', () => {
    expect(Number.isFinite(batNhip(3, 0, 4))).toBe(true);
  });
});

describe('tỉ lệ kéo khớp với bộ dựng ở main', () => {
  it('⭐ hai bên cho CÙNG một con số', () => {
    /* Renderer không nạp được mã main nên công thức bị chép sang đây. Chép là
       mầm trôi dạt — đúng bài học `seed.ts` trong CLAUDE.md. Phép kiểm này là
       thứ duy nhất giữ hai bên khớp nhau: lệch thì mảnh VẼ RA một độ dài và
       DỰNG RA một độ dài khác. */
    for (const [a, b] of [[120, 140], [174, 128], [90, 90], [0, 128]]) {
      expect(tiLeKeo(a!, b!), `${a}→${b}`).toBeCloseTo(tiLeManh(a!, b!), 10);
    }
  });
});

describe('hình mảnh', () => {
  it('độ dài trên dòng thời gian là đoạn cắt NHÂN tỉ lệ', () => {
    expect(daiTrenDong(manh(), 0.5)).toBe(5);
  });

  it('đoạn cắt ngược đầu ra 0 chứ không ra số âm', () => {
    expect(daiTrenDong(manh({ tuGiay: 20, denGiay: 10 }), 1)).toBe(0);
  });

  it('⭐ mảnh cực ngắn vẫn rộng tối thiểu 6px', () => {
    /* Rộng 0 thì không bấm vào được để xoá — nó thành rác vĩnh viễn trên bản
       dựng, và người dùng chỉ thấy bản mashup có một tiếng lạ không biết ở
       đâu ra. */
    const k = khungManh(manh({ tuGiay: 0, denGiay: 0.01 }), 1, 10);
    expect(k.rong).toBe(6);
  });

  it('vị trí trái đi theo datGiay và mức phóng', () => {
    expect(khungManh(manh({ datGiay: 3 }), 1, 40).trai).toBe(120);
  });
});

describe('cắt mép', () => {
  it('⭐ kéo mép TRÁI đổi CẢ tuGiay LẪN datGiay', () => {
    /* Đổi mỗi `tuGiay` thì mảnh TRƯỢT đi thay vì bị cắt — hai thao tác trông
       giống hệt nhau trên màn hình mà kết quả khác hẳn: một cái giữ nguyên
       chỗ mảnh phát ra, cái kia dời nó. */
    const m = catTrai(manh({ tuGiay: 10, denGiay: 20, datGiay: 4 }), 2, 1);
    expect(m.tuGiay).toBeCloseTo(12, 6);
    expect(m.datGiay).toBeCloseTo(6, 6);
    expect(m.denGiay).toBe(20);
  });

  it('mép trái quy đổi qua tỉ lệ kéo', () => {
    /* Kéo 2 giây trên dòng thời gian, mảnh đang bị nén còn nửa ⇒ trong bài
       gốc là 4 giây. */
    const m = catTrai(manh({ tuGiay: 10, denGiay: 30, datGiay: 0 }), 2, 0.5);
    expect(m.tuGiay).toBeCloseTo(14, 6);
    expect(m.datGiay).toBeCloseTo(2, 6);
  });

  it('mép trái không vượt qua mép phải', () => {
    const m = catTrai(manh({ tuGiay: 10, denGiay: 20 }), 999, 1);
    expect(m.tuGiay).toBeLessThan(m.denGiay);
  });

  it('mép trái không lùi trước đầu bài, và datGiay không âm', () => {
    const m = catTrai(manh({ tuGiay: 1, denGiay: 20, datGiay: 0 }), -99, 1);
    expect(m.tuGiay).toBe(0);
    expect(m.datGiay).toBeGreaterThanOrEqual(0);
  });

  it('⭐ mép phải KHÔNG đổi datGiay', () => {
    const m = catPhai(manh({ tuGiay: 10, denGiay: 20, datGiay: 4 }), -3, 1, 60);
    expect(m.denGiay).toBeCloseTo(17, 6);
    expect(m.datGiay).toBe(4);
    expect(m.tuGiay).toBe(10);
  });

  it('mép phải không vượt quá cuối bài', () => {
    expect(catPhai(manh({ denGiay: 20 }), 999, 1, 25).denGiay).toBe(25);
  });

  it('mép phải không lùi qua mép trái', () => {
    const m = catPhai(manh({ tuGiay: 10, denGiay: 20 }), -999, 1, 60);
    expect(m.denGiay).toBeGreaterThan(m.tuGiay);
  });
});

describe('làn theo bài', () => {
  it('một làn mỗi bài, theo thứ tự xuất hiện lần đầu', () => {
    const ds = lanTheoBai([
      manh({ baiId: 'b' }), manh({ baiId: 'a' }), manh({ baiId: 'b' }),
    ]);
    expect(ds).toEqual(['b', 'a']);
  });

  it('rỗng thì không có làn nào', () => {
    expect(lanTheoBai([])).toEqual([]);
  });
});

describe('vạch lưới', () => {
  it('phóng to thì mỗi ô một vạch', () => {
    const v = vachLuoi(8, 120, 60);   // ô = 2s = 120px
    expect(v).toEqual([0, 2, 4, 6, 8]);
  });

  it('⭐ thu nhỏ thì lưới THƯA dần, không thành mảng xám đặc', () => {
    /* Ở 2px một ô mà vẫn vẽ mỗi ô một vạch thì đó không còn là lưới. */
    const day = vachLuoi(600, 120, 60).length;
    const thua = vachLuoi(600, 120, 1).length;
    expect(thua).toBeLessThan(day / 4);
    expect(thua).toBeGreaterThan(1);
  });

  it('độ dài 0 hay BPM 0 thì không treo và trả mảng rỗng', () => {
    expect(vachLuoi(0, 120, 40)).toEqual([]);
    expect(vachLuoi(10, 0, 40)).toEqual([]);
  });

  it('đếm ô từ 1 như mọi DAW', () => {
    expect(soO(0, 120)).toBe(1);
    expect(soO(2, 120)).toBe(2);
    expect(soO(8, 120)).toBe(5);
  });
});
