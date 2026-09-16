/**
 * Cây cầu nối mạch gia sư giữa cửa sổ chính và cửa sổ robot.
 *
 * Mỗi phép kiểm ứng với MỘT cách hỏng im lặng — không cách nào trong số đó làm
 * đỏ `tsc` hay bản dựng, và cả ba đều chỉ lộ ra khi người dùng đang học.
 */
import { describe, expect, it } from 'vitest';
import { luotCanGui, type LuotKho } from './dongBoGiaSu';

const hoi = (content: string): LuotKho => ({ role: 'user', content });
const dap = (content: string, them: Partial<LuotKho> = {}): LuotKho =>
  ({ role: 'assistant', content, ...them });

describe('lượt cần gửi sang cửa sổ kia', () => {
  it('mạch trống ⇒ không gửi gì', () => {
    expect(luotCanGui([], 0)).toEqual({ gui: [], moc: 0 });
  });

  it('một cặp hỏi–đáp mới ⇒ gửi đúng cặp đó', () => {
    const ds = [hoi('Bài này học gì?'), dap('Học về hooks.')];
    expect(luotCanGui(ds, 0)).toEqual({
      gui: [{ hoi: 'Bài này học gì?', dap: 'Học về hooks.' }],
      moc: 2,
    });
  });

  it('⭐ lượt ĐÃ gửi rồi thì KHÔNG gửi lại — đây là chốt chặn vòng lặp', () => {
    // Lượt do robot hỏi cũng làm kho dài ra. Không có mốc thì bộ theo dõi đẩy
    // ngược nó về robot, robot ghép thêm lần nữa, và câu hỏi nhân đôi mãi.
    const ds = [hoi('a'), dap('A')];
    expect(luotCanGui(ds, 2).gui).toEqual([]);
  });

  it('⭐ câu trả lời ĐANG CHẢY thì chưa gửi, VÀ mốc dừng lại ở nó', () => {
    // Gửi sớm là robot nhận một câu cụt. Nhưng bỏ qua mà vẫn đẩy mốc đi thì
    // còn tệ hơn — xem phép kiểm ngay dưới.
    const ds = [hoi('a'), dap('Đang gõ…', { streaming: true })];
    expect(luotCanGui(ds, 0)).toEqual({ gui: [], moc: 1 });
  });

  it('⭐⭐ chảy XONG ở lần gọi sau thì PHẢI gửi được', () => {
    // Đây là lỗi bản đầu của chính hàm này: nó luôn trả `moc: ds.length`, nên
    // mốc trỏ qua lượt đang chảy; chữ chảy xong thì `ds.length <= daGui` và
    // câu trả lời hoàn chỉnh VĨNH VIỄN không qua cầu. Triệu chứng ngoài đời là
    // "thỉnh thoảng robot không thấy câu trả lời" — gần như không tả lại được.
    const dangChay = [hoi('a'), dap('Đang gõ…', { streaming: true })];
    const { moc } = luotCanGui(dangChay, 0);
    const xong = [hoi('a'), dap('Xong rồi.')];
    expect(luotCanGui(xong, moc).gui).toEqual([{ hoi: 'a', dap: 'Xong rồi.' }]);
  });

  it('lượt sau một câu đang chảy cũng phải ĐỢI, không được vượt lên trước', () => {
    // Giữ đúng thứ tự hội thoại: gửi lượt sau trước thì robot hiện câu trả lời
    // của câu hỏi thứ hai bên trên câu trả lời của câu hỏi thứ nhất.
    const ds = [hoi('1'), dap('Đang gõ…', { streaming: true }), hoi('2'), dap('hai')];
    expect(luotCanGui(ds, 0)).toEqual({ gui: [], moc: 1 });
  });

  it('lượt người dùng CHƯA có đáp án ⇒ không gửi (robot khỏi hiện câu hỏi treo)', () => {
    const ds = [hoi('Chưa trả lời')];
    expect(luotCanGui(ds, 0).gui).toEqual([]);
  });

  it('dùng `srcQuestion` khi có — đúng cả khi có lượt chen giữa', () => {
    const ds = [hoi('x'), dap('X'), dap('Bản tiếng Anh', { srcQuestion: 'x' })];
    expect(luotCanGui(ds, 2).gui).toEqual([{ hoi: 'x', dap: 'Bản tiếng Anh' }]);
  });

  it('⭐ kho NGẮN LẠI (đổi bài / xoá cuộc) ⇒ hạ mốc, không kẹt vĩnh viễn', () => {
    // Giữ mốc cũ thì nó luôn lớn hơn độ dài và mọi lượt sau đều bị bỏ qua —
    // cây cầu chết câm mà không có dấu hiệu gì.
    expect(luotCanGui([], 8)).toEqual({ gui: [], moc: 0 });
    const sau = [hoi('mới'), dap('MỚI')];
    expect(luotCanGui(sau, 0).gui).toEqual([{ hoi: 'mới', dap: 'MỚI' }]);
  });

  it('nhiều cặp cùng lúc ⇒ gửi đủ, đúng thứ tự', () => {
    const ds = [hoi('1'), dap('một'), hoi('2'), dap('hai')];
    expect(luotCanGui(ds, 0).gui).toEqual([
      { hoi: '1', dap: 'một' },
      { hoi: '2', dap: 'hai' },
    ]);
  });

  it('câu trả lời RỖNG không được gửi', () => {
    expect(luotCanGui([hoi('a'), dap('')], 0).gui).toEqual([]);
  });
});
