import { describe, expect, it } from 'vitest';

import {
  chongGio, cotCuaThu, ghepGio, gioMay, luoiThang, maThang,
  moTaPhut, ngayDayDu, ngayMay, nhichThang, TEN_THU, tongPhut,
} from './lichThang';

describe('cột của thứ (tuần bắt đầu Thứ Hai)', () => {
  it('Thứ Hai là cột 0, Chủ Nhật là cột 6', () => {
    // 14/09/2026 là Thứ Hai.
    expect(cotCuaThu(new Date(2026, 8, 14))).toBe(0);
    expect(cotCuaThu(new Date(2026, 8, 20))).toBe(6); // Chủ Nhật
  });

  it('⛔ Chủ Nhật KHÔNG ra cột âm', () => {
    // `getDay() - 1` cho Chủ Nhật ra −1, và −1 không phải cột nào cả.
    // Lỗi này chỉ lộ ra ở những tháng bắt đầu vào Chủ Nhật.
    for (let i = 0; i < 14; i += 1) {
      const c = cotCuaThu(new Date(2026, 8, 1 + i));
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThanOrEqual(6);
    }
  });

  it('nhãn cột khớp với thứ tự đó', () => {
    expect(TEN_THU[0]).toBe('T2');
    expect(TEN_THU[6]).toBe('CN');
  });
});

describe('lưới tháng', () => {
  it('luôn đủ 42 ô, kể cả tháng chỉ cần 5 hàng', () => {
    // Lưới co giãn làm cả trang nhảy lên xuống mỗi lần đổi tháng, mà
    // mắt người đọc lịch bằng VỊ TRÍ.
    for (const [n, t] of [[2026, 2], [2026, 9], [2027, 2], [2024, 2]] as const) {
      expect(luoiThang(n, t)).toHaveLength(42);
    }
  });

  it('ô đầu tiên LUÔN là Thứ Hai', () => {
    for (let t = 1; t <= 12; t += 1) {
      const o = luoiThang(2026, t)[0]!;
      const [n, th, g] = o.ngay.split('-').map(Number);
      expect(cotCuaThu(new Date(n!, th! - 1, g!))).toBe(0);
    }
  });

  it('tháng bắt đầu đúng Thứ Hai thì KHÔNG đệm ô nào', () => {
    // 01/06/2026 là Thứ Hai. Đệm thừa một tuần ở đây là lỗi hay gặp
    // khi dùng `%7` mà không xử lý ca số 0.
    const o = luoiThang(2026, 6);
    expect(o[0]!.ngay).toBe('2026-06-01');
    expect(o[0]!.trongThang).toBe(true);
  });

  it('phân biệt được ngày trong tháng với ngày đệm', () => {
    const o = luoiThang(2026, 9);
    expect(o.filter((x) => x.trongThang)).toHaveLength(30);
    expect(o.find((x) => x.ngay === '2026-09-01')!.trongThang).toBe(true);
    expect(o.find((x) => x.ngay === '2026-08-31')!.trongThang).toBe(false);
  });

  it('tháng 2 năm nhuận có 29 ngày', () => {
    expect(luoiThang(2028, 2).filter((x) => x.trongThang)).toHaveLength(29);
    expect(luoiThang(2026, 2).filter((x) => x.trongThang)).toHaveLength(28);
  });

  it('đánh dấu cuối tuần', () => {
    const o = luoiThang(2026, 9);
    expect(o.find((x) => x.ngay === '2026-09-19')!.cuoiTuan).toBe(true);  // T7
    expect(o.find((x) => x.ngay === '2026-09-20')!.cuoiTuan).toBe(true);  // CN
    expect(o.find((x) => x.ngay === '2026-09-18')!.cuoiTuan).toBe(false); // T6
  });
});

describe('nhích tháng', () => {
  it('cuộn sang năm sau/trước', () => {
    expect(nhichThang(2026, 12, 1)).toEqual({ nam: 2027, thang: 1 });
    expect(nhichThang(2026, 1, -1)).toEqual({ nam: 2025, thang: 12 });
    expect(nhichThang(2026, 9, 0)).toEqual({ nam: 2026, thang: 9 });
  });

  it('nhích nhiều tháng một lúc vẫn đúng', () => {
    expect(nhichThang(2026, 1, -13)).toEqual({ nam: 2024, thang: 12 });
    expect(nhichThang(2026, 12, 13)).toEqual({ nam: 2028, thang: 1 });
  });
});

describe('ngày theo giờ MÁY', () => {
  it('⛔ KHÔNG trượt sang ngày hôm trước lúc nửa đêm', () => {
    // `toISOString().slice(0,10)` là cách viết hiển nhiên và nó SAI ở
    // Việt Nam (+07): 00:30 ngày 18 thành "2026-09-17" trong UTC, và
    // việc tạo lúc nửa đêm biến mất khỏi hôm nay ngay khi vừa tạo.
    expect(ngayMay(new Date(2026, 8, 18, 0, 30))).toBe('2026-09-18');
    expect(ngayMay(new Date(2026, 8, 18, 23, 45))).toBe('2026-09-18');
  });
});

describe('ghép ngày + giờ', () => {
  it('14:30 ngày 18/09 ra đúng 14:30 giờ máy', () => {
    const iso = ghepGio('2026-09-18', '14:30');
    const d = new Date(iso!);
    expect(d.getHours()).toBe(14);
    expect(d.getMinutes()).toBe(30);
    expect(d.getDate()).toBe(18);
  });

  it('đi vòng qua gioMay rồi quay lại thì không đổi', () => {
    const iso = ghepGio('2026-09-18', '07:05');
    expect(gioMay(iso)).toBe('07:05');
  });

  it('thiếu ngày hoặc giờ thì null, không dựng ra ngày rác', () => {
    expect(ghepGio('', '14:30')).toBeNull();
    expect(ghepGio('2026-09-18', '')).toBeNull();
    expect(ghepGio('2026-09-18', 'hai giờ chiều')).toBeNull();
  });

  it('gioMay chịu được giá trị rỗng/hỏng', () => {
    expect(gioMay(null)).toBe('');
    expect(gioMay('không phải ngày')).toBe('');
  });
});

describe('ngày đầy đủ', () => {
  it('gọi đúng tên thứ tiếng Việt', () => {
    expect(ngayDayDu('2026-09-18')).toBe('Thứ Sáu, 18/09/2026');
    expect(ngayDayDu('2026-09-20')).toBe('Chủ Nhật, 20/09/2026');
  });
  it('chuỗi hỏng thì trả lại nguyên, không ném', () => {
    expect(ngayDayDu('rác')).toBe('rác');
  });
});

describe('mô tả thời lượng', () => {
  it('viết như người nói', () => {
    expect(moTaPhut(45)).toBe('45 phút');
    expect(moTaPhut(60)).toBe('1 giờ');
    expect(moTaPhut(95)).toBe('1 giờ 35 phút');
    expect(moTaPhut(120)).toBe('2 giờ');
  });
  it('không có thì rỗng, không phải "0 phút"', () => {
    expect(moTaPhut(null)).toBe('');
    expect(moTaPhut(0)).toBe('');
  });
});

describe('tổng giờ đã xếp trong ngày', () => {
  it('cộng đúng, bỏ qua việc không đặt thời lượng', () => {
    expect(tongPhut([{ phutLam: 30 }, { phutLam: 90 }, { phutLam: null }, {}])).toBe(120);
  });
});

describe('phát hiện chồng giờ', () => {
  const v = (title: string, gio: string, phut: number) =>
    ({ title, batDauAt: ghepGio('2026-09-18', gio), phutLam: phut });

  it('hai việc gối nhau thì báo', () => {
    const c = chongGio([v('A', '14:00', 60), v('B', '14:30', 30)]);
    expect(c).toHaveLength(1);
    expect(c[0]!.map((x) => x.title)).toEqual(['A', 'B']);
  });

  it('⛔ việc dài BAO TRÙM nhiều việc sau — phải báo ĐỦ, không chỉ cặp liền kề', () => {
    // So mỗi việc với người liền trước là đủ khi các việc xếp thành
    // chuỗi, và THIẾU khi một việc dài trùm lên hai việc ngắn sau nó.
    const c = chongGio([v('Dài', '08:00', 240), v('Ngắn 1', '09:00', 30), v('Ngắn 2', '10:00', 30)]);
    expect(c).toHaveLength(2);
  });

  it('kề sát nhau KHÔNG phải chồng', () => {
    // 14:00–15:00 rồi 15:00–15:30 là lịch tốt, không phải lỗi. Báo
    // nhầm ở đây thì cảnh báo mất giá trị và người dùng bỏ qua nó.
    expect(chongGio([v('A', '14:00', 60), v('B', '15:00', 30)])).toHaveLength(0);
  });

  it('việc không đặt giờ thì không bao giờ bị tính là chồng', () => {
    expect(chongGio([
      { title: 'A', batDauAt: null, phutLam: 60 },
      { title: 'B', batDauAt: ghepGio('2026-09-18', '14:00'), phutLam: null },
      v('C', '14:00', 60),
    ])).toHaveLength(0);
  });
});

describe('mã tháng', () => {
  it('đệm số 0 để so chuỗi được', () => {
    expect(maThang(2026, 9)).toBe('2026-09');
    expect(maThang(2026, 12)).toBe('2026-12');
  });
});
