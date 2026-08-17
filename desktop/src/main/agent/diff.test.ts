/**
 * Kiểm diff — thứ người dùng NHÌN VÀO để quyết định cho agent ghi hay không.
 *
 * Diff sai không làm app đổ; nó làm người dùng duyệt một thay đổi khác với thứ
 * sắp được ghi. Đó là kiểu hỏng tệ nhất của cả tầng xin phép, và là kiểu duy
 * nhất mà nhìn màn hình không phát hiện ra được.
 */
import { describe, expect, it } from 'vitest';
import { soSanhDong } from './diff';

describe('soSanhDong', () => {
  it('không đổi gì ⇒ không có dòng nào để hiện', () => {
    const kq = soSanhDong('a\nb\nc', 'a\nb\nc');
    expect(kq.soThem).toBe(0);
    expect(kq.soBo).toBe(0);
    expect(kq.dong).toHaveLength(0);
  });

  it('đổi một dòng ⇒ đúng một bỏ, một thêm', () => {
    const kq = soSanhDong('a\nb\nc', 'a\nB\nc');
    expect(kq.soThem).toBe(1);
    expect(kq.soBo).toBe(1);
    expect(kq.dong.filter((d) => d.loai === 'bo').map((d) => d.text)).toEqual(['b']);
    expect(kq.dong.filter((d) => d.loai === 'them').map((d) => d.text)).toEqual(['B']);
  });

  it('SỐ DÒNG đúng ở cả hai bên — đây là thứ người dùng đối chiếu với editor', () => {
    const kq = soSanhDong('a\nb\nc\nd', 'a\nX\nb\nc\nd');
    const them = kq.dong.find((d) => d.loai === 'them');
    expect(them?.text).toBe('X');
    expect(them?.soCu).toBeNull();      // dòng mới thì không có số cũ
    expect(them?.soMoi).toBe(2);
    const cuoi = kq.dong.filter((d) => d.loai === 'giu' && d.text === 'd')[0];
    expect(cuoi?.soCu).toBe(4);          // lệch một dòng so với bản mới
    expect(cuoi?.soMoi).toBe(5);
  });

  it('thêm vào file rỗng ⇒ toàn dòng thêm (đường của create_file)', () => {
    const kq = soSanhDong('', 'x\ny');
    expect(kq.soBo).toBe(1);   // chuỗi rỗng vẫn là một dòng rỗng
    expect(kq.soThem).toBe(2);
  });

  it('RÚT GỌN: file dài, sửa một dòng ⇒ chỉ hiện quanh chỗ sửa', () => {
    const cu = Array.from({ length: 100 }, (_, i) => `dong ${i}`).join('\n');
    const moi = cu.replace('dong 50', 'dong 50 DA SUA');
    const kq = soSanhDong(cu, moi);

    // 1 bỏ + 1 thêm + tối đa 6 dòng ngữ cảnh + 2 dấu ngắt. Không rút gọn thì
    // đây là 101 dòng, và người dùng phải tự đi tìm chỗ khác nhau.
    expect(kq.dong.length).toBeLessThanOrEqual(10);
    expect(kq.dong.some((d) => d.loai === 'them' && d.text === 'dong 50 DA SUA')).toBe(true);
    expect(kq.dong.some((d) => d.loai === 'giu' && d.soCu === null && d.soMoi === null)).toBe(true);
  });

  it('KHÔNG rút gọn khi được yêu cầu giữ nguyên', () => {
    const cu = Array.from({ length: 30 }, (_, i) => `d${i}`).join('\n');
    const moi = cu.replace('d10', 'd10x');
    expect(soSanhDong(cu, moi, { rutGon: false }).dong).toHaveLength(31);
  });

  it('giữ được dòng trống — mất dòng trống là diff nói dối về khoảng cách', () => {
    const kq = soSanhDong('a\n\nb', 'a\n\nB');
    expect(kq.dong.some((d) => d.loai === 'giu' && d.text === '' && d.soCu === 2)).toBe(true);
  });

  it('dời một khối lên trên ⇒ vẫn nhận ra phần chung, không báo đổi hết', () => {
    const kq = soSanhDong('x\na\nb\nc', 'a\nb\nc\nx');
    // LCS thấy a,b,c là chung ⇒ chỉ 1 bỏ + 1 thêm, không phải 4+4.
    expect(kq.soBo).toBe(1);
    expect(kq.soThem).toBe(1);
  });
});
