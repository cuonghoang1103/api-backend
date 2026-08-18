import { describe, expect, it } from 'vitest';

import { catCauDau } from './hoiOdin';

/**
 * `catCauDau` quyết định lúc nào gửi câu đầu cho máy đọc. Cắt SỚM quá thì máy
 * đọc phát ra một mẩu cụt rồi ngắt; cắt MUỘN quá thì mất hết cái lợi chạy song
 * song. Cả hai đều chỉ lộ ra khi nghe, nên phải chốt bằng phép kiểm.
 */
describe('catCauDau', () => {
  it('chưa đủ một câu thì chưa cắt', () => {
    expect(catCauDau('Mình nghĩ là')).toBeNull();
    expect(catCauDau('')).toBeNull();
  });

  it('cắt đúng câu đầu khi đã có dấu chấm và chữ tiếp theo', () => {
    expect(catCauDau('Bạn nên dùng Node.js cho việc này. Nó nhẹ hơn'))
      .toBe('Bạn nên dùng Node.js cho việc này.');
  });

  it('KHÔNG cắt ở dấu chấm THẬP PHÂN', () => {
    // "3.14" có dấu chấm nhưng không có khoảng trắng ngay sau ⇒ không phải hết câu.
    expect(catCauDau('Số pi xấp xỉ 3.14 và dùng trong hình tròn')).toBeNull();
  });

  it('câu quá NGẮN thì đợi thêm, đừng đọc một mẩu cụt', () => {
    // "Ừ." mà gửi riêng thì máy đọc phát "Ừ" rồi ngắt — nghe rời rạc hơn liền.
    expect(catCauDau('Ừ. Mình nghĩ là bạn nên thử cách khác')).toBeNull();
  });

  it('nhận cả dấu hỏi, chấm than và ba chấm', () => {
    expect(catCauDau('Bạn muốn mình giải thích thêm không? Mình sẵn sàng'))
      .toBe('Bạn muốn mình giải thích thêm không?');
    expect(catCauDau('Cái đó hay lắm đấy! Để mình kể'))
      .toBe('Cái đó hay lắm đấy!');
  });

  it('cắt đúng khi câu kết bằng dấu ngoặc kép', () => {
    expect(catCauDau('Nó báo "không tìm thấy tệp." Bạn thử lại xem'))
      .toBe('Nó báo "không tìm thấy tệp."');
  });

  it('câu cuối CHƯA có chữ theo sau thì chưa cắt — có thể còn chảy tiếp', () => {
    expect(catCauDau('Mình đã kiểm tra xong rồi.')).toBeNull();
  });
});
