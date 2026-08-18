import { describe, expect, it } from 'vitest';

import { tachCau } from './tachCau';

/**
 * Tách sai chỉ lộ ra khi NGHE: máy đọc phát "ba chấm" rồi ngắt giữa chừng.
 * Nên phần lớn phép kiểm dưới đây là chống tách NHẦM.
 */
describe('tachCau', () => {
  it('tách đúng câu thường', () => {
    expect(tachCau('Câu một ở đây. Câu hai ở đây.'))
      .toEqual(['Câu một ở đây.', 'Câu hai ở đây.']);
  });

  it('KHÔNG tách ở số thập phân', () => {
    expect(tachCau('Số pi xấp xỉ 3.14 và dùng cho hình tròn.')).toHaveLength(1);
  });

  it('KHÔNG tách ở tên riêng có chấm', () => {
    expect(tachCau('Node.js chạy trên V8 và rất nhanh.')).toHaveLength(1);
  });

  it('nối câu quá NGẮN vào câu trước, không để đứng riêng', () => {
    const r = tachCau('Đây là một câu đủ dài để đứng riêng. Ừ.');
    expect(r).toHaveLength(1);
    expect(r[0]).toContain('Ừ.');
  });

  it('câu cuối KHÔNG có dấu chấm vẫn lấy được', () => {
    expect(tachCau('Câu đầu tiên ở đây. Câu cuối không có dấu'))
      .toEqual(['Câu đầu tiên ở đây.', 'Câu cuối không có dấu']);
  });

  it('nhận dấu hỏi và dấu than', () => {
    expect(tachCau('Bạn muốn mình giải thích thêm không? Mình sẵn sàng giúp.'))
      .toHaveLength(2);
  });

  it('giữ dấu ngoặc kép ở cuối câu', () => {
    const r = tachCau('Nó báo "không tìm thấy tệp." Bạn thử lại xem sao.');
    expect(r[0]).toContain('"');
    expect(r).toHaveLength(2);
  });

  it('GIỮ dấu phẩy trong câu — máy đọc dựa vào đó để ngắt nhịp', () => {
    expect(tachCau('Trước hết, bạn mở tệp lên.')[0]).toContain(',');
  });

  it('chuỗi rỗng trả mảng rỗng', () => {
    expect(tachCau('')).toEqual([]);
    expect(tachCau('   ')).toEqual([]);
  });

  it('câu trả lời THẬT của model tách ra hợp lý', () => {
    const r = tachCau(
      'Spring Boot là framework Java giúp xây dựng ứng dụng web nhanh chóng. '
      + 'Nó tự động cấu hình nhiều thứ, nên bạn đỡ phải khai báo tay. '
      + 'Bạn muốn mình chỉ cách tạo dự án đầu tiên không?',
    );
    expect(r).toHaveLength(3);
    for (const c of r) expect(c.length).toBeGreaterThan(20);
  });
});
