import { describe, expect, it } from 'vitest';
/* Kiểm TỆP DÙNG CHUNG `frontend/src/lib/tinNhan/chep.ts` — web và desktop cùng
   nạp nó. Test nằm bên desktop vì đây là gói duy nhất có bộ chạy. */
import { chepDuoc, chuMotTin, chuNhieuTin, gioNgan, NHAN_ANH } from '@/lib/tinNhan/chep';
import type { TinDeChep } from '@/lib/tinNhan/chep';

/** ISO của hôm nay lúc `hh:mm` giờ MÁY — để `gioNgan` không phụ thuộc múi giờ. */
const luc = (hh: number, mm: number) => new Date(2026, 8, 14, hh, mm).toISOString();

const t = (p: Partial<TinDeChep>): TinDeChep =>
  ({ senderId: 1, createdAt: luc(10, 5), ...p });

describe('chữ của một tin', () => {
  it('cắt khoảng trắng thừa hai đầu', () => {
    expect(chuMotTin(t({ content: '  chào bạn \n' }))).toBe('chào bạn');
  });

  it('giữ nguyên xuống dòng BÊN TRONG', () => {
    // Tin nhiều dòng là lý do chính người ta cần nút chép — bôi đen tay hay
    // rụng mất dòng cuối.
    expect(chuMotTin(t({ content: 'dòng 1\ndòng 2' }))).toBe('dòng 1\ndòng 2');
  });

  it('⛔ tin ĐÃ THU HỒI trả rỗng, dù dữ liệu còn nguyên nội dung', () => {
    // Máy chủ vẫn gửi `content` xuống. Chép nó ra là đi ngược đúng điều người
    // gửi vừa yêu cầu, và giao diện đang hiện "đã thu hồi" nên người chép
    // không hề ngờ mình vừa lấy được câu thật.
    expect(chuMotTin(t({ content: 'câu lỡ lời', recalled: true }))).toBe('');
    expect(chuMotTin(t({ content: 'câu lỡ lời', deleted: true }))).toBe('');
    expect(chepDuoc(t({ content: 'câu lỡ lời', recalled: true }))).toBe(false);
  });

  it('tin chỉ có ảnh ⇒ không có CHỮ để chép', () => {
    expect(chepDuoc(t({ mediaUrl: 'https://x/y.jpg' }))).toBe(false);
  });

  it('nội dung toàn khoảng trắng cũng là không chép được', () => {
    expect(chepDuoc(t({ content: '   \n  ' }))).toBe(false);
  });
});

describe('giờ ngắn', () => {
  it('đệm 0 cho cả giờ lẫn phút', () => {
    expect(gioNgan(luc(9, 5))).toBe('09:05');
    expect(gioNgan(luc(14, 30))).toBe('14:30');
  });

  it('chuỗi hỏng ⇒ rỗng, không ra "NaN:NaN"', () => {
    expect(gioNgan('không phải ngày')).toBe('');
  });
});

describe('chép nhiều tin', () => {
  const ten = (id: number) => (id === 1 ? 'An' : 'Bình');

  it('mỗi tin một khối: "Tên · giờ" rồi tới nội dung', () => {
    expect(chuNhieuTin([
      t({ senderId: 1, content: 'câu đầu', createdAt: luc(10, 5) }),
      t({ senderId: 2, content: 'câu sau', createdAt: luc(10, 6) }),
    ], ten)).toBe('An · 10:05\ncâu đầu\n\nBình · 10:06\ncâu sau');
  });

  it('⛔ tin đã thu hồi bị BỎ HẲN, không để lại khối rỗng', () => {
    expect(chuNhieuTin([
      t({ senderId: 1, content: 'giữ lại', createdAt: luc(10, 5) }),
      t({ senderId: 2, content: 'rút lại', recalled: true, createdAt: luc(10, 6) }),
      t({ senderId: 1, content: 'giữ nữa', createdAt: luc(10, 7) }),
    ], ten)).toBe('An · 10:05\ngiữ lại\n\nAn · 10:07\ngiữ nữa');
  });

  it('tin chỉ có ảnh thành [ảnh], KHÔNG bị bỏ', () => {
    // Bỏ hẳn thì hai câu nói VỀ tấm ảnh bỗng đứng cạnh nhau và đoạn chép mất
    // nhịp — người đọc lại tưởng mình chép thiếu.
    const ra = chuNhieuTin([
      t({ senderId: 1, content: 'xem này', createdAt: luc(10, 5) }),
      t({ senderId: 1, mediaUrl: 'https://x/y.jpg', createdAt: luc(10, 6) }),
      t({ senderId: 2, content: 'đẹp đấy', createdAt: luc(10, 7) }),
    ], ten);
    expect(ra).toContain(NHAN_ANH);
    expect(ra.split('\n\n')).toHaveLength(3);
  });

  it('danh sách rỗng ⇒ chuỗi rỗng', () => {
    expect(chuNhieuTin([], ten)).toBe('');
  });

  it('toàn tin đã thu hồi ⇒ chuỗi rỗng, không ra một đống xuống dòng', () => {
    expect(chuNhieuTin([
      t({ content: 'a', recalled: true }), t({ content: 'b', deleted: true }),
    ], ten)).toBe('');
  });
});
