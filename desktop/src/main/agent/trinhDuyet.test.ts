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

describe('prompt phải DẠY model dùng tool trình duyệt', () => {
  /*
   * Người dùng bật "Trình duyệt: BẬT" rồi bảo "mở localhost:3000", agent vẫn
   * gọi `doc_web` — tool cũ, chặn localhost — rồi trả lời "tôi không mở được
   * localhost, bạn tự mở giúp". Tool `web_mo` CÓ trong danh sách gửi lên, quyền
   * CÓ tới máy chủ; thứ thiếu là prompt không nhắc một chữ nào về chúng, nên
   * model với lấy cái tool nó quen.
   *
   * Khai một tool là chưa đủ để nó được dùng.
   */
  const mc = readFileSync(join(goc, '../src/services/agent/prompt.ts'), 'utf8');

  it('có mục riêng cho trình duyệt, gắn theo quyền `browser`', () => {
    expect(mc, 'prompt không gắn mục nào theo quyền browser').toContain('includes(\'browser\')');
    expect(mc, 'prompt không nhắc web_mo').toContain('web_mo');
  });

  it('nói thẳng là ĐỪNG dùng doc_web khi đã có web_mo', () => {
    expect(mc, 'model sẽ tiếp tục với lấy doc_web vì nó quen hơn').toMatch(/ĐỪNG DÙNG .{0,3}doc_web/);
  });

  it('mô tả doc_web tự chỉ sang web_mo', () => {
    const t = readFileSync(join(goc, '../src/services/agent/tools.ts'), 'utf8');
    const i = t.indexOf('name: \'doc_web\'');
    expect(t.slice(i, i + 900), 'mô tả doc_web không chỉ đường sang web_mo').toContain('web_mo');
  });
});
