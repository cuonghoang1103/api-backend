/**
 * Ghi âm tin nhắn thoại — phần THUẦN.
 *
 * Mã nằm ở `frontend/src/components/messaging/useGhiAm.ts` và dùng chung cho
 * cả web lẫn app desktop. Phép kiểm đặt ở đây vì đây là bộ chạy kiểm duy nhất
 * với tới được cây web (qua alias `@`) — cùng lối với `chep.test.ts` bên cạnh.
 *
 * ⚠️ Thứ đáng kiểm nhất là CHỌN ĐỊNH DẠNG. Safari không ghi được `audio/webm`
 * (nó chỉ có `audio/mp4`); Chrome và Firefox thì ngược lại. Ép một kiểu là
 * `MediaRecorder` ném ngay lúc dựng trên đúng một nửa số máy — và nó ném ở
 * hàm dựng, tức trước khi có bất cứ thứ gì trên màn hình để người dùng hiểu
 * chuyện gì vừa xảy ra.
 */
import { describe, expect, it } from 'vitest';
import { dongHo, duoiTheoKieu, kieuGhiDuoc, GIAY_TOI_DA } from '@/components/messaging/useGhiAm';

describe('chọn định dạng ghi âm theo máy', () => {
  it('máy kiểu Chrome ⇒ chọn opus (nhỏ hơn nhiều ở cùng chất lượng tiếng nói)', () => {
    const hoTro = (t: string) => t === 'audio/webm;codecs=opus' || t === 'audio/webm';
    expect(kieuGhiDuoc(hoTro)).toBe('audio/webm;codecs=opus');
  });

  it('máy kiểu Safari ⇒ rơi xuống audio/mp4 thay vì chịu thua', () => {
    const hoTro = (t: string) => t === 'audio/mp4';
    expect(kieuGhiDuoc(hoTro)).toBe('audio/mp4');
  });

  it('máy kiểu Firefox ⇒ ogg/opus', () => {
    const hoTro = (t: string) => t.startsWith('audio/ogg');
    expect(kieuGhiDuoc(hoTro)).toBe('audio/ogg;codecs=opus');
  });

  it('không kiểu nào được ⇒ trả rỗng để trình duyệt TỰ chọn', () => {
    /* Rỗng chứ không phải một kiểu đoán bừa: truyền một `mimeType` mà máy
       không nhận thì `new MediaRecorder` ném, còn bỏ trống thì nó tự chọn
       kiểu mặc định và vẫn ghi được. */
    expect(kieuGhiDuoc(() => false)).toBe('');
  });

  it('`isTypeSupported` NÉM (trình duyệt cũ) ⇒ coi như không hỗ trợ, không vỡ', () => {
    expect(kieuGhiDuoc(() => { throw new Error('không có hàm này'); })).toBe('');
  });
});

describe('đuôi tệp khớp định dạng', () => {
  it('mỗi kiểu ra đúng đuôi của nó', () => {
    expect(duoiTheoKieu('audio/mp4')).toBe('m4a');
    expect(duoiTheoKieu('audio/ogg;codecs=opus')).toBe('ogg');
    expect(duoiTheoKieu('audio/webm;codecs=opus')).toBe('webm');
  });

  it('kiểu lạ ⇒ webm, không trả rỗng', () => {
    /* Tệp không có đuôi thì bộ lưu trữ đặt kiểu nội dung sai, và trình duyệt
       người nhận tải nó về thay vì phát. */
    expect(duoiTheoKieu('audio/khong-biet')).toBe('webm');
    expect(duoiTheoKieu('')).toBe('webm');
  });
});

describe('đồng hồ', () => {
  it('đếm đúng phút:giây, hai chữ số phần giây', () => {
    expect(dongHo(0)).toBe('0:00');
    expect(dongHo(7)).toBe('0:07');
    expect(dongHo(59)).toBe('0:59');
    expect(dongHo(60)).toBe('1:00');
    expect(dongHo(125)).toBe('2:05');
  });

  it('số âm hoặc lẻ ⇒ vẫn ra chuỗi hợp lệ', () => {
    expect(dongHo(-5)).toBe('0:00');
    expect(dongHo(3.7)).toBe('0:03');
  });
});

describe('trần độ dài', () => {
  it('có trần, và trần đủ dài để nói một câu tử tế', () => {
    expect(GIAY_TOI_DA).toBeGreaterThanOrEqual(30);
    /* Không có trần thì một lần bấm nhầm để lại tệp hàng chục MB mà người
       dùng không định gửi — và họ trả tiền mạng cho nó. */
    expect(GIAY_TOI_DA).toBeLessThanOrEqual(300);
  });
});
