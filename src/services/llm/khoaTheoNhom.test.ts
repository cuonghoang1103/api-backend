/**
 * MỘT KHOÁ CHỈ THUỘC MỘT NHÓM — và chỗ gọi phải chọn khoá theo model.
 *
 * Bậc "CuongMini Max" chết câm trên production 20/08/2026: `claudeChat.ts` lấy
 * khoá MẶC ĐỊNH cho mọi model, mà khoá mặc định thuộc nhóm `claude`. Gọi
 * `gpt-5.6-sol` bằng nó trả `503 No available channel … under group claude`.
 * Pro (claude-sonnet-5) trùng nhóm nên vẫn chạy — nên nhìn từ ngoài chỉ thấy
 * "Max không phản hồi", không có gì chỉ tới cái khoá.
 *
 * Phép kiểm này canh đúng chỗ đó: nhóm khác nhau ⇒ khoá khác nhau.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { gatewayKeyFor } from './gateway.js';

test('model gpt-* lấy khoá của nhóm GPT, model claude-* lấy khoá mặc định', () => {
  const cu = { ...process.env };
  process.env.OPENAI_COMPAT_API_KEY = 'khoa-mac-dinh';
  process.env.LLM_GATEWAY_API_KEY_GPT = 'khoa-gpt';
  delete process.env.LLM_GATEWAY_API_KEY;

  assert.equal(gatewayKeyFor('gpt-5.6-sol'), 'khoa-gpt', 'Max phải dùng khoá nhóm GPT');
  assert.equal(gatewayKeyFor('gpt-5.6-terra'), 'khoa-gpt');
  assert.equal(gatewayKeyFor('claude-sonnet-5'), 'khoa-mac-dinh', 'Pro dùng khoá mặc định');

  // Thiếu khoá nhóm ⇒ rơi về mặc định (và người dùng sẽ thấy 503 nói rõ nhóm).
  delete process.env.LLM_GATEWAY_API_KEY_GPT;
  assert.equal(gatewayKeyFor('gpt-5.6-sol'), 'khoa-mac-dinh');

  process.env = cu;
});

test('claudeChat.ts KHÔNG được lấy khoá mặc định cho mọi model', () => {
  const src = readFileSync(new URL('../claudeChat.ts', import.meta.url), 'utf8');

  assert.doesNotMatch(src, /requireKey\(\)/,
    'còn chỗ gọi `requireKey()` không truyền model ⇒ model gpt-* sẽ dùng nhầm khoá nhóm claude và trả 503');
  assert.match(src, /gatewayKeyFor/,
    'phải chọn khoá theo nhóm của model, không dùng khoá mặc định cho tất cả');
});
