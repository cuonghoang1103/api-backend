/**
 * Kiểm luật gộp chữ của bảng ghi agent.
 *
 * Vì sao đáng một file test riêng: đây là chỗ duy nhất trong màn hình có TRẠNG
 * THÁI phụ thuộc thứ tự, và nó chỉ hỏng khi có một dòng công cụ chen vào giữa
 * hai đợt chữ — đúng cái tình huống mà thử tay sẽ bỏ sót, vì lượt đầu tiên
 * người ta thử thường không gọi tool nào.
 */
import { describe, expect, it } from 'vitest';
import { gopChu, type MucHienThi } from './useAgent';

describe('gopChu — gộp delta chữ vào bảng ghi', () => {
  it('mở bong bóng mới khi bảng ghi rỗng', () => {
    expect(gopChu([], 'Xin')).toEqual([{ kieu: 'may', text: 'Xin' }]);
  });

  it('nối các delta liên tiếp vào CÙNG một bong bóng', () => {
    let muc: MucHienThi[] = [];
    for (const d of ['Cổng ', 'là ', '4242']) muc = gopChu(muc, d);
    expect(muc).toEqual([{ kieu: 'may', text: 'Cổng là 4242' }]);
  });

  it('mở bong bóng MỚI sau một dòng công cụ', () => {
    let muc: MucHienThi[] = [{ kieu: 'may', text: 'Để tôi xem.' }];
    muc = [...muc, { kieu: 'tool', ten: 'read_file', tomTat: '40 dòng', vong: 'may' }];
    muc = gopChu(muc, 'File này ');
    muc = gopChu(muc, 'có 40 dòng.');

    expect(muc).toHaveLength(3);
    expect(muc[0]).toEqual({ kieu: 'may', text: 'Để tôi xem.' });
    expect(muc[1]?.kieu).toBe('tool');
    expect(muc[2]).toEqual({ kieu: 'may', text: 'File này có 40 dòng.' });
  });

  it('mở bong bóng mới sau câu hỏi của người dùng', () => {
    const muc = gopChu([{ kieu: 'nguoi', text: 'chào' }], 'Chào bạn');
    expect(muc).toHaveLength(2);
    expect(muc[1]).toEqual({ kieu: 'may', text: 'Chào bạn' });
  });

  it('mở bong bóng mới sau một dòng lỗi — câu trả lời sau lỗi không được dính vào lỗi', () => {
    const muc = gopChu([{ kieu: 'loi', text: 'Hết hạn mức.' }], 'Thử lại nhé');
    expect(muc).toHaveLength(2);
    expect(muc[1]).toEqual({ kieu: 'may', text: 'Thử lại nhé' });
  });

  it('KHÔNG sửa mảng cũ tại chỗ — React so sánh theo tham chiếu để quyết định vẽ lại', () => {
    const cu: MucHienThi[] = [{ kieu: 'may', text: 'a' }];
    const moi = gopChu(cu, 'b');
    expect(cu).toEqual([{ kieu: 'may', text: 'a' }]);
    expect(moi).not.toBe(cu);
  });
});
