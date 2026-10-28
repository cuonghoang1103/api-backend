/**
 * 28/10/2026 — `xin_quyen_thu_muc` chỉ mời app ĐÃ khai `thu_muc_ngoai` (app cũ không có tool này thì không bao giờ được mời).
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseCapabilities, toolsForGateway } from './tools.js';

test('xin_quyen_thu_muc: có khả năng ⇒ có tool (path + ly_do bắt buộc); app cũ ⇒ không', () => {
  const ten = (caps: string[]) => toolsForGateway(parseCapabilities(caps), []).map((t: { function?: { name?: string }; name?: string }) => t.function?.name ?? t.name);
  assert.ok(ten(['fs_read', 'thu_muc_ngoai']).includes('xin_quyen_thu_muc'));
  assert.ok(!ten(['fs_read', 'git_read', 'fs_write']).includes('xin_quyen_thu_muc'));
  assert.deepEqual(parseCapabilities(['thu_muc_ngoai', 'la']), ['thu_muc_ngoai']);
  const def = toolsForGateway(parseCapabilities(['thu_muc_ngoai']), []).find((t: { function?: { name?: string } }) => t.function?.name === 'xin_quyen_thu_muc') as unknown as { function: { parameters: { required: string[] }; description: string } };
  assert.deepEqual(def.function.parameters.required, ['path', 'ly_do']);
  assert.match(def.function.description, /THAY VÌ bảo người dùng kéo thư mục vào/);
});
