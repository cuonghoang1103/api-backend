/**
 * `edit_file` không khớp — chẩn đoán thay vì bắt model đoán.
 *
 * Sinh ra từ ảnh người dùng gửi 15/09/2026: bốn lần `edit_file` liên tiếp đều
 * "không khớp", rồi agent phải chạy `xxd` đọc từng byte mới tìm ra chỗ lệch.
 * Năm sáu lượt gọi cổng cho một lần sửa một dòng — và mỗi lượt là tiền thật.
 */
import { describe, expect, it } from 'vitest';
import { hienKhoangTrang, timGanDung } from './ganDung';

const FILE_TAB = 'function a() {\n\tconst x = 1;\n\treturn x;\n}\n';

describe('timGanDung', () => {
  it('file dùng TAB mà old_text dùng dấu cách ⇒ chỉ đúng nguyên nhân', () => {
    const r = timGanDung(FILE_TAB, '    const x = 1;\n    return x;');
    expect(r).not.toBeNull();
    expect(r!.lyDo).toContain('TAB');
    // Đoạn trả về phải là NGUYÊN VĂN trên đĩa — đó là thứ agent chép lại.
    expect(r!.doanThat).toBe('\tconst x = 1;\n\treturn x;');
  });

  it('khoảng trắng THỪA cuối dòng — thứ mắt không thấy', () => {
    const r = timGanDung('const a = 1;   \nconst b = 2;\n', 'const a = 1;\nconst b = 2;');
    expect(r).not.toBeNull();
    expect(r!.doanThat).toBe('const a = 1;   \nconst b = 2;');
  });

  it('thụt lề lệch số dấu cách ⇒ nói ra số cụ thể', () => {
    const r = timGanDung('  if (x) {\n    y();\n  }\n', '    if (x) {\n      y();\n    }');
    expect(r).not.toBeNull();
    expect(r!.lyDo).toMatch(/thụt lề|khoảng trắng/);
  });

  it('KHÔNG đoán hộ khi có NHIỀU chỗ khớp', () => {
    /* Đưa ra một chỗ trong hai là đoán hộ, và đoán sai ở đây là sửa nhầm đoạn
       mã — người dùng bấm duyệt một diff trông hợp lý, cái sai nằm ở chỗ khác. */
    expect(timGanDung('a();\nb();\na();\nb();\n', 'a();\nb();')).toBeNull();
  });

  it('khác NỘI DUNG thật (không phải khoảng trắng) ⇒ null', () => {
    expect(timGanDung(FILE_TAB, '\tconst y = 2;')).toBeNull();
  });

  it('old_text rỗng ⇒ null, không nổ', () => {
    expect(timGanDung(FILE_TAB, '')).toBeNull();
    expect(timGanDung('', 'x')).toBeNull();
  });
});

describe('hienKhoangTrang', () => {
  it('tab thành → , dấu cách thừa cuối dòng thành ·', () => {
    expect(hienKhoangTrang('\tx')).toBe('→x');
    expect(hienKhoangTrang('x  \ny')).toBe('x··\ny');
  });
});
