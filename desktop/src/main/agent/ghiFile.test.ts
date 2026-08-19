/**
 * Agent KHÔNG được ghi file bằng lệnh shell.
 *
 * Lỗi thật 19/08/2026, và nó phá mã của người dùng theo hai cách cùng lúc.
 * Agent gọi `create_file`, nhận "đã tồn tại", rồi thay vì dùng `edit_file` nó
 * đi vòng qua PowerShell `WriteAllText`. Kết quả trong Visual Studio:
 *
 *   [Route('[controller]')]          ← dấu " bị lớp thoát của shell nuốt thành '
 *   r?e?t?u?r?n? ?E?n?u?m?...        ← PowerShell ghi UTF-16, đọc lại bằng UTF-8
 *
 * Cả hai đều KHÔNG hoàn tác được bằng nút Hoàn tác: nút đó chỉ theo dõi thay
 * đổi do `edit_file` gây ra, mà đây là shell ghi thẳng lên đĩa.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const goc = join(import.meta.dirname, '../../..');
const prompt = readFileSync(join(goc, '../src/services/agent/prompt.ts'), 'utf8');
const toolMC = readFileSync(join(goc, '../src/services/agent/tools.ts'), 'utf8');
const toolApp = readFileSync(join(goc, 'src/main/agent/tools.ts'), 'utf8');

describe('cấm ghi file bằng shell', () => {
  it('prompt cấm thẳng, và kể tên các lệnh cụ thể', () => {
    expect(prompt, 'prompt không cấm ghi file bằng lệnh').toMatch(/ĐỪNG GHI FILE BẰNG LỆNH/);
    for (const lenh of ['Out-File', 'Set-Content', 'WriteAllText', 'sed -i']) {
      expect(prompt, `prompt không kể tên ${lenh} — model sẽ nghĩ lệnh của nó là ngoại lệ`)
        .toContain(lenh);
    }
  });

  it('prompt nói rõ create_file "đã tồn tại" KHÔNG phải lời mời đi vòng', () => {
    expect(prompt).toMatch(/create_file.{0,40}đã tồn tại/s);
  });

  it('mô tả run_command cũng cấm — model đọc mô tả tool nhiều hơn đọc prompt', () => {
    const i = toolMC.indexOf('name: \'run_command\'');
    expect(toolMC.slice(i, i + 1400)).toMatch(/KHÔNG GHI FILE BẰNG LỆNH/);
  });

  it('create_file chỉ thẳng sang edit_file khi file đã có', () => {
    const i = toolApp.indexOf('đã tồn tại');
    expect(toolApp.slice(i - 200, i + 500), 'thông báo không chỉ đường sang edit_file')
      .toContain('edit_file');
  });
});
