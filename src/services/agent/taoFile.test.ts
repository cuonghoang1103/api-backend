/**
 * Hai đoạn prompt CHỈ ĐƯỜNG cho người dùng — dễ bị xoá, và mất đi thì hỏng CÂM.
 *
 * Người dùng nhờ AI tạo file. Model trả lời "mình không có tool ghi file trong
 * phiên này, bạn copy-paste giúp" và họ tin rằng app không làm được. Sự thật:
 *   • AI Code — có `create_file`, chỉ là công tắc "Cho sửa" đang tắt.
 *   • AI Chat — có hộp cát Python, file ghi vào `/xuat/` hiện thành nút "Lưu".
 * Cả hai lần, công cụ nằm ngay đó mà model không biết.
 *
 * Bài kiểm này canh đúng phần CHỈ ĐƯỜNG. Xoá nó đi thì prompt vẫn hợp lệ, model
 * vẫn trả lời trôi chảy, và không ai phát hiện cho tới khi người dùng lại đi
 * copy-paste tay — nên phải có một phép kiểm ĐỎ thay cho người phát hiện.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { buildSystemPrompt } from './prompt.js';

test('AI Code: tắt quyền ghi ⇒ prompt phải CHỈ CÁCH BẬT, không chỉ báo là không có', () => {
  const p = buildSystemPrompt({ capabilities: ['fs_read'] });

  assert.match(p, /Cho sửa/,
    'prompt không hề nhắc tên nút "Cho sửa" — người dùng không biết bật ở đâu');
  assert.match(p, /chỉ đọc/i, 'prompt phải nói rõ phiên đang ở chế độ chỉ đọc');

  // Và phải CẤM cái kết luận sai mà model từng đưa ra.
  assert.match(p, /ĐỪNG bịa/,
    'thiếu lời cấm ⇒ model lại kết luận "app chỉ đọc được thôi" như một tính chất');
});

test('AI Code: BẬT quyền ghi ⇒ không còn đoạn chỉ đường (nó chỉ dành cho lúc tắt)', () => {
  const p = buildSystemPrompt({ capabilities: ['fs_read', 'fs_write'] });
  assert.doesNotMatch(p, /PHẢI CHỈ HỌ CÁCH BẬT/,
    'đang bật rồi mà vẫn bảo người dùng đi bật là chỉ dẫn sai');
  assert.match(p, /create_file/, 'bật rồi thì phải nói rõ tool nào dùng được');
});

test('AI Chat: prompt phải nói cho model biết hộp cát Python tạo được file', () => {
  const src = readFileSync(new URL('../ai.service.ts', import.meta.url), 'utf8');

  assert.match(src, /\/xuat\//,
    'prompt không nhắc `/xuat/` ⇒ model không biết file ghi ở đâu thì người dùng tải được');

  /*
   * Danh sách gói phải khớp thứ THẬT SỰ có trong bản dựng
   * (`desktop/src/renderer/public/pyodide/*.whl`). Hứa một gói không có nghĩa là
   * người dùng bấm Chạy rồi nhận `ModuleNotFoundError` — tệ hơn là không hứa.
   */
  for (const co of ['numpy', 'pandas', 'matplotlib', 'pillow']) {
    assert.match(src, new RegExp(co), `prompt nên nêu gói có sẵn: ${co}`);
  }
  for (const khong of ['reportlab', 'openpyxl']) {
    assert.match(src, new RegExp(`KHÔNG có[^\\n]*${khong}|${khong}`),
      `prompt phải nói RÕ là KHÔNG có ${khong}`);
  }
  assert.match(src, /savefig\("\/xuat\//,
    'phải chỉ đúng cách xuất PDF bằng matplotlib — đo thật ngày 20/08/2026 là ra file 8KB');
});
