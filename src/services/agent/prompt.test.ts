/**
 * Kiểm PROMPT HỆ THỐNG của agent.
 *
 * Prompt là thứ không có kiểu, không có bộ dựng, và sai thì không ai thấy —
 * nó chỉ hiện ra dưới dạng "model cứ viết lệnh hỏng" mấy tuần sau.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { buildSystemPrompt } from './prompt.js';

const dung = (platform: string, capabilities: string[]): string =>
  buildSystemPrompt({ capabilities, workspace: { name: 'du-an', platform } } as never);

/*
 * App chạy lệnh bằng `spawn(lenh, { shell: true })`. Trên Windows đó là
 * **cmd.exe** (`%ComSpec%`), không phải PowerShell và càng không phải bash.
 * Trước 09/09/2026 prompt chỉ nói "Hệ điều hành: win32." — model vẫn viết
 * `ls`, `rm -rf`, `$(...)`, nháy đơn; cmd.exe không hiểu cái nào, và người
 * dùng Windows nhận một chuỗi lệnh hỏng mà không có gì giải thích vì sao.
 */
test('Windows + quyền chạy lệnh ⇒ prompt nói rõ là cmd.exe', () => {
  const p = dung('win32', ['fs_read', 'shell']);
  assert.match(p, /cmd\.exe/, 'không nhắc cmd.exe — model sẽ viết cú pháp POSIX');
  assert.match(p, /powershell -NoProfile -Command/, 'không chỉ đường sang PowerShell');
});

test('KHÔNG có quyền chạy lệnh ⇒ không nhồi luật shell vào prompt', () => {
  // Mỗi dòng thừa trong prompt là token trả tiền mỗi lượt, và là một luật nữa
  // để model phải cân nhắc trong khi nó còn chẳng gọi được tool nào như thế.
  assert.doesNotMatch(dung('win32', ['fs_read']), /cmd\.exe/);
});

test('macOS/Linux KHÔNG bị dặn cú pháp cmd', () => {
  for (const nen of ['darwin', 'linux']) {
    assert.doesNotMatch(dung(nen, ['fs_read', 'shell']), /cmd\.exe/, nen);
  }
});
