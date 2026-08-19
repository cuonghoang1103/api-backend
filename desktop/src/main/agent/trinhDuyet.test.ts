/**
 * Quyền trình duyệt: mở/đọc/console TỰ DO, bấm/gõ PHẢI DUYỆT.
 *
 * Ranh giới này do người dùng chốt 19/08/2026, và lý do nằm ở chỗ trang đang
 * mở chạy bằng phiên đăng nhập THẬT của họ: một cú `web_bam` trúng nút xoá
 * thì không có `git checkout` nào lấy lại được. Ngược lại, bắt duyệt cả việc
 * ĐỌC thì agent hỏi năm câu cho một lần xem trang — người dùng sẽ bấm bừa, và
 * lúc đó cái duyệt ở `web_bam` cũng mất giá trị.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const goc = join(import.meta.dirname, '../../..');
const nguon = readFileSync(join(goc, 'src/main/agent/tools.ts'), 'utf8');

describe('quyền trình duyệt', () => {
  it('bấm/gõ đi qua hoiNguoiDung', () => {
    const i = nguon.indexOf('async function toolWebTacDong');
    expect(i, 'không còn hàm toolWebTacDong').toBeGreaterThan(-1);
    const than = nguon.slice(i, i + 2600);
    expect(than, 'web_bam/web_go KHÔNG xin duyệt — một cú bấm nhầm là không hoàn tác được')
      .toContain('hoiNguoiDung');
    expect(than, 'không được cho NHỚ: cùng bộ chọn trên hai trang là hai việc khác nhau')
      .toContain('choNho: false');
  });

  it('mở/đọc/console/chụp KHÔNG xin duyệt', () => {
    for (const ten of ['toolWebMo', 'toolWebDoc', 'toolWebConsole', 'toolWebAnh']) {
      const i = nguon.indexOf(`async function ${ten}`);
      expect(i, `không thấy ${ten}`).toBeGreaterThan(-1);
      const than = nguon.slice(i, nguon.indexOf('\n}', i));
      expect(than, `${ten} đang xin duyệt — việc chỉ QUAN SÁT thì không nên hỏi`)
        .not.toContain('hoiNguoiDung');
    }
  });

  it('máy chủ khai đủ 6 tool trình duyệt, đều thuộc quyền `browser`', () => {
    const mc = readFileSync(join(goc, '../src/services/agent/tools.ts'), 'utf8');
    for (const t of ['web_mo', 'web_doc', 'web_anh', 'web_console', 'web_bam', 'web_go']) {
      const i = mc.indexOf(`name: '${t}'`);
      expect(i, `máy chủ chưa khai ${t}`).toBeGreaterThan(-1);
      expect(mc.slice(i, i + 400), 'thiếu capability browser: ' + t).toContain('capability: \'browser\'');
    }
  });

  it('app chạy được mọi tool máy chủ khai — thiếu một cái là model gọi vào hư không', () => {
    const mc = readFileSync(join(goc, '../src/services/agent/tools.ts'), 'utf8');
    const khai = [...mc.matchAll(/name: '(web_[a-z]+)'/g)].map((m) => m[1]!);
    const thieu = khai.filter((t) => !nguon.includes(`case '${t}'`));
    expect(thieu, `app không cài: ${thieu.join(', ')}`).toEqual([]);
  });
});

describe('ảnh chụp trang', () => {
  it('web_anh chặn ảnh quá lớn — máy chủ BỎ IM LẶNG nếu vượt trần', () => {
    const i = nguon.indexOf('async function toolWebAnh');
    expect(i, 'không thấy toolWebAnh').toBeGreaterThan(-1);
    const than = nguon.slice(i, nguon.indexOf('\n}', i));
    expect(than, 'không kiểm cỡ ảnh ⇒ máy chủ lọc bỏ và model tưởng đã xem rồi bịa bố cục')
      .toContain('5_600_000');
    expect(than).toContain('anh: [{ media_type');
  });
});
