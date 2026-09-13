import { describe, expect, it } from 'vitest';

import { KHUNG_SLOT, docNhapNhanh, quetThanhChu } from './nhapNhanhLich';

describe('khung giờ slot', () => {
  /* Ghim từng con số. Bảng này có BA bản sao (backend `docAnhLich.ts`, iOS
     `SlotFAP.khung`, và bản này) vì ba ngôn ngữ không import được nhau. Lệch
     một bản là người dùng tới lớp sai giờ mà không có gì đỏ lên — nên nó phải
     đỏ ở đây. */
  it('đúng 5 slot, đúng giờ FAP', () => {
    expect(KHUNG_SLOT).toEqual({
      1: ['07:30', '09:50'],
      2: ['10:00', '12:20'],
      3: ['12:50', '15:10'],
      4: ['15:20', '17:40'],
      5: ['17:50', '20:10'],
    });
  });
});

describe('đọc khối chữ nhập nhanh', () => {
  it('dòng đủ bốn phần ⇒ có phòng, có giờ suy từ slot', () => {
    const [d] = docNhapNhanh('2 | 2 | SWR302 | BE-210');
    expect(d).toMatchObject({
      so: 1, thu: 2, slot: 2, mon: 'SWR302', phong: 'BE-210',
      batDau: '10:00', ketThuc: '12:20', loi: null,
    });
  });

  it('thiếu phòng vẫn hợp lệ', () => {
    const [d] = docNhapNhanh('6 | 1 | MAD101');
    expect(d!.loi).toBeNull();
    expect(d!.phong).toBe('');
  });

  it('bỏ qua dòng trống và dòng chú thích, nhưng SỐ DÒNG vẫn theo ô chữ', () => {
    // Số dòng phải là vị trí thật trong ô chữ, không phải thứ tự sau khi lọc —
    // nếu không thì câu "dòng 2 sai" trỏ vào một dòng khác với chỗ người dùng
    // đang nhìn.
    const ds = docNhapNhanh('# kỳ hè\n\n2 | 1 | PRF192\n\n3 | 9 | XXX');
    expect(ds).toHaveLength(2);
    expect(ds[0]!.so).toBe(3);
    expect(ds[1]!.so).toBe(5);
  });

  it('⛔ dòng HỎNG vẫn trả về, không bị lọc mất', () => {
    // Lọc đi thì dòng gõ sai lặng lẽ biến khỏi bản xem trước và người dùng
    // tưởng mình gõ thiếu.
    const ds = docNhapNhanh('2 | 1 | PRF192\nlung tung');
    expect(ds).toHaveLength(2);
    expect(ds[1]!.loi).toBe('cần ít nhất: thứ | slot | môn');
  });

  it('thứ ngoài 2–8 và slot ngoài 1–5 đều có câu lỗi riêng', () => {
    expect(docNhapNhanh('1 | 1 | A')[0]!.loi).toBe('thứ phải từ 2 đến 8');
    expect(docNhapNhanh('9 | 1 | A')[0]!.loi).toBe('thứ phải từ 2 đến 8');
    expect(docNhapNhanh('2 | 0 | A')[0]!.loi).toBe('slot phải là 1–5');
    expect(docNhapNhanh('2 | 6 | A')[0]!.loi).toBe('slot phải là 1–5');
  });

  it('⛔ "2x" KHÔNG được ép thành 2, và "" không thành 0', () => {
    // `Number('2x')` là NaN nhưng `Number('')` là 0 và `parseInt('2x')` là 2 —
    // cả hai kiểu ép đều cho ra một lịch sai mà trông hợp lệ.
    expect(docNhapNhanh('2x | 1 | A')[0]!.loi).toBe('thứ phải từ 2 đến 8');
    expect(docNhapNhanh(' | 1 | A')[0]!.loi).toBe('thứ phải từ 2 đến 8');
    expect(docNhapNhanh('2 | 1x | A')[0]!.loi).toBe('slot phải là 1–5');
  });

  it('thiếu tên môn thì nói THIẾU MÔN, không nói lại cả cú pháp', () => {
    // `'2 | 1 |'` cắt ra BA phần (phần cuối rỗng) nên nó qua được cửa "đủ ba
    // phần" — và câu đúng để nói lúc đó là chỗ còn thiếu, chứ không phải đọc
    // lại cú pháp cho người đã gõ gần đúng.
    expect(docNhapNhanh('2 | 1 |')[0]!.loi).toBe('thiếu tên môn');
    expect(docNhapNhanh('2 | 1 |  | BE-210')[0]!.loi).toBe('thiếu tên môn');
    // Thiếu HẲN một cột thì mới đọc lại cú pháp.
    expect(docNhapNhanh('2 | 1')[0]!.loi).toBe('cần ít nhất: thứ | slot | môn');
  });

  it('ô chữ rỗng ⇒ không dòng nào', () => {
    expect(docNhapNhanh('')).toEqual([]);
    expect(docNhapNhanh('\n\n  \n')).toEqual([]);
  });
});

describe('đổi kết quả quét ảnh sang khối chữ', () => {
  const b = (thu: number, slot: number, monHoc: string, phong: string | null) =>
    ({ thu, slot, monHoc, phong, giaoVien: null, batDau: '', ketThuc: '' });

  it('có phòng thì bốn cột, không phòng thì ba', () => {
    expect(quetThanhChu([b(2, 1, 'PRF192', 'AL-R201'), b(4, 3, 'MAD101', null)]))
      .toBe('2 | 1 | PRF192 | AL-R201\n4 | 3 | MAD101');
  });

  it('phòng chỉ có khoảng trắng tính là KHÔNG có', () => {
    expect(quetThanhChu([b(2, 1, 'PRF192', '   ')])).toBe('2 | 1 | PRF192');
  });

  it('vòng tròn: quét ra chữ rồi đọc lại phải nguyên vẹn', () => {
    // Đây là phép kiểm đáng giá nhất ở đây — nó chứng minh hai đường vào
    // (quét ảnh và gõ tay) thật sự gặp nhau ở cùng một bộ luật đọc.
    const chu = quetThanhChu([b(2, 1, 'PRF192', 'AL-R201'), b(7, 5, 'SWR302', null)]);
    const ds = docNhapNhanh(chu);
    expect(ds.map((d) => [d.thu, d.slot, d.mon, d.phong, d.loi]))
      .toEqual([[2, 1, 'PRF192', 'AL-R201', null], [7, 5, 'SWR302', '', null]]);
  });
});
