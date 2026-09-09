/**
 * Kiểm câu trạng thái "Odin đang…".
 *
 * Ba thứ đáng kiểm, và cả ba đều là chỗ mắt thường bỏ sót:
 *   1. Đang chờ NGƯỜI DÙNG thì KHÔNG được nói "đang chạy" — nếu không, thanh
 *      quay bảo người ta ngồi đợi chính họ.
 *   2. Chỉ soi lượt hiện tại. Thẻ duyệt bị bỏ dở nằm lại mãi trong bảng ghi;
 *      soi cả bảng thì mọi lượt sau đều kẹt ở "đang chờ bạn duyệt".
 *   3. Khoảng lặng giữa hai vòng vẫn phải ra chữ — đó chính là chỗ màn hình
 *      từng đứng im và người dùng tưởng app đứt kết nối.
 */
import { describe, expect, it } from 'vitest';
import { viecDangLam, viecCuaTool } from './viecDangLam';
import type { MucHienThi } from './useAgent';

const nguoi: MucHienThi = { kieu: 'nguoi', text: 'sửa hộ tôi' };
const pl = (muc: 'thuong' | 'cankiem' | 'nguyhiem') => ({ muc, lyDo: [], choNho: muc !== 'nguyhiem' });
const tool = (ten: string, dangChay?: boolean): MucHienThi =>
  ({ kieu: 'tool', ten, tomTat: '', vong: 'may', ...(dangChay ? { dangChay } : {}) });

describe('đang chờ người dùng', () => {
  it('thẻ duyệt chưa trả lời ⇒ "chờ bạn duyệt", KHÔNG quay', () => {
    const v = viecDangLam([nguoi, { kieu: 'xinPhepLenh', id: '1', lenh: 'rm -rf x', phanLoai: pl('nguyhiem') }], false);
    expect(v.kieu).toBe('cho');
    expect(v.chu).toContain('chờ bạn duyệt');
  });

  it('thẻ ĐÃ trả lời thì thôi — quay tiếp', () => {
    const v = viecDangLam([
      nguoi,
      { kieu: 'xinPhepLenh', id: '1', lenh: 'npm test', phanLoai: pl('thuong'), xong: 'dongY' },
      tool('run_command', true),
    ], false);
    expect(v.kieu).toBe('lam');
    expect(v.chu).toContain('đang chạy lệnh');
  });

  it('⛔ thẻ bỏ dở của LƯỢT TRƯỚC không làm kẹt lượt này', () => {
    // Người dùng bấm Dừng lúc agent đang hỏi ⇒ thẻ ở lại với `xong` rỗng. Soi
    // cả bảng thì lượt sau nào cũng báo "đang chờ bạn duyệt" trong khi màn hình
    // không có nút nào để bấm.
    const v = viecDangLam([
      { kieu: 'nguoi', text: 'lượt cũ' },
      { kieu: 'xinPhep', the: { id: 'cu', ten: 'edit_file', duongDan: 'a.ts' } as never },
      nguoi,
      tool('read_file', true),
    ], false);
    expect(v.kieu).toBe('lam');
    expect(v.chu).toContain('đang đọc file');
  });
});

describe('khoảng lặng giữa hai vòng — chỗ màn hình từng đứng im', () => {
  it('tool GHI vừa xong ⇒ "Odin đang code…"', () => {
    expect(viecDangLam([nguoi, tool('edit_file')], false).chu).toBe('Odin đang code…');
  });

  it('lệnh vừa xong ⇒ nói là đang xem kết quả, không nói "đang code"', () => {
    expect(viecDangLam([nguoi, tool('run_command')], false).chu).toContain('kết quả lệnh');
  });

  it('mới chỉ đọc ⇒ "đang đọc mã dự án"', () => {
    expect(viecDangLam([nguoi, tool('grep')], false).chu).toContain('đọc mã dự án');
  });

  it('chưa gọi tool nào vẫn RA CHỮ — không bao giờ trả về câu rỗng', () => {
    expect(viecDangLam([nguoi], true).chu).toBeTruthy();
    expect(viecDangLam([nguoi], false).chu).toBeTruthy();
    expect(viecDangLam([], false).chu).toBeTruthy();
  });
});

describe('tool đang chạy thắng tool đã xong', () => {
  it('lấy tool ĐANG chạy chứ không lấy cái vừa xong', () => {
    const v = viecDangLam([nguoi, tool('edit_file'), tool('run_command', true)], false);
    expect(v.chu).toContain('đang chạy lệnh');
  });
});

describe('viecCuaTool', () => {
  it('tool lạ vẫn ra câu, MCP có câu riêng', () => {
    expect(viecCuaTool('mcp__abc__xyz')).toContain('công cụ ngoài');
    expect(viecCuaTool('mot_tool_chua_tung_co')).toBe('đang chạy…');
  });
});
