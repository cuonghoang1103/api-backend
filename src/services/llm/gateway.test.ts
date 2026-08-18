/**
 * ============================================================
 * BẢN ĐỒ MODEL — BỘ KIỂM
 * ============================================================
 *
 * Bộ kiểm này sinh ra từ một lỗi thật (18/08/2026): `endpointFor()` gọi
 * `modelFor()` để biết dùng khoá nào, còn `modelFor()` gọi `endpointFor()` để
 * biết việc này có chạy ở máy nhà không. Vòng tròn. `npx tsc --noEmit` XANH
 * SẠCH — kiểu không nói được gì về việc ai gọi ai — và nó chỉ nổ khi chạy
 * thật, bằng câu "Maximum call stack size exceeded" chẳng nhắc gì tới model
 * hay khoá.
 *
 * Nên phép kiểm ở đây rất tầm thường: GỌI THẬT mọi việc một lượt. Cái rẻ nhất
 * bắt được cái khó thấy nhất.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { allPurposeModels, goiDuocModel, modelFor, endpointFor, LLM_PURPOSES } from './gateway.js';

test('mọi việc đều tra được model mà không gọi vòng', () => {
  for (const p of LLM_PURPOSES) {
    const m = modelFor(p);
    assert.equal(typeof m, 'string', `${p} không ra model`);
    assert.ok(m.length > 0, `${p} ra model rỗng`);
    assert.ok(endpointFor(p).root.length > 0, `${p} không ra địa chỉ`);
  }
});

test('thiếu khoá NHÓM GPT thì LÙI, không trả về model gọi không được', () => {
  // ⚠️ Phép kiểm này TỰ DỰNG môi trường, không mượn `.env`. Bản đầu tiên chỉ
  // xoá khoá GPT rồi khẳng định "mọi model đều gọi được" — ở máy nhà nó XANH
  // nhờ khoá thật trong `.env` (`config/env.ts` gọi `dotenv.config()`), còn
  // trên CI không có `.env` nên KHÔNG khoá nào tồn tại và nó ĐỎ. Cả hai kết
  // quả đều không nói gì về mã: điều cần kiểm là "mất khoá GPT thì có lùi về
  // nhóm mặc định không", nên nhóm mặc định BẮT BUỘC phải có khoá.
  const luu = {
    gpt: process.env.LLM_GATEWAY_API_KEY_GPT,
    mac: process.env.LLM_GATEWAY_API_KEY,
    compat: process.env.OPENAI_COMPAT_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
  };
  delete process.env.LLM_GATEWAY_API_KEY_GPT;
  delete process.env.OPENAI_COMPAT_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  process.env.LLM_GATEWAY_API_KEY = 'sk-gia-lap-nhom-mac-dinh';
  try {
    for (const { purpose } of allPurposeModels()) {
      const m = modelFor(purpose);
      assert.ok(
        goiDuocModel(m),
        `${purpose} trả về "${m}" — nhóm của nó chưa có khoá, lời gọi sẽ ăn 503`,
      );
    }
  } finally {
    for (const [ten, gt] of [
      ['LLM_GATEWAY_API_KEY_GPT', luu.gpt],
      ['LLM_GATEWAY_API_KEY', luu.mac],
      ['OPENAI_COMPAT_API_KEY', luu.compat],
      ['ANTHROPIC_API_KEY', luu.anthropic],
    ] as const) {
      if (gt === undefined) delete process.env[ten];
      else process.env[ten] = gt;
    }
  }
});

test('KHÔNG có khoá nào thì không model nào gọi được — và đó KHÔNG phải lỗi mã', () => {
  // Chốt lại đúng ranh giới mà phép kiểm trên từng vượt qua nhầm.
  const luu = [
    'LLM_GATEWAY_API_KEY_GPT',
    'LLM_GATEWAY_API_KEY',
    'OPENAI_COMPAT_API_KEY',
    'ANTHROPIC_API_KEY',
  ].map((t) => [t, process.env[t]] as const);
  for (const [t] of luu) delete process.env[t];
  try {
    assert.equal(goiDuocModel('claude-sonnet-5'), false);
    assert.equal(goiDuocModel('gpt-5.6-sol'), false);
    // vẫn phải trả về MỘT model, không được ném
    assert.ok(modelFor('chat_pro').length > 0);
  } finally {
    for (const [t, gt] of luu) if (gt !== undefined) process.env[t] = gt;
  }
});

test('có khoá của nhóm thì dùng ĐÚNG model đã phân, không lùi', () => {
  const cu = process.env.LLM_GATEWAY_API_KEY_GPT;
  process.env.LLM_GATEWAY_API_KEY_GPT = 'sk-gia-lap-cho-kiem-thu';
  try {
    // `chat_max` là việc đã cố ý chuyển sang GPT. Có khoá mà vẫn ra Claude
    // nghĩa là lưới đỡ đang nuốt luôn cấu hình thật.
    assert.equal(modelFor('chat_max'), 'gpt-5.6-sol');
    assert.equal(modelFor('cv_parse'), 'gpt-5.4-mini');
  } finally {
    if (cu === undefined) delete process.env.LLM_GATEWAY_API_KEY_GPT;
    else process.env.LLM_GATEWAY_API_KEY_GPT = cu;
  }
});

test('việc gọi tool KHÔNG được phân cho model đã loại', () => {
  // Grok bị loại vì một lý do ĐO ĐƯỢC VÀ LẶP LẠI ĐƯỢC: nó không tôn trọng
  // `max_tokens` (vượt 30–41×), nên mọi trần chi phí của web mất tác dụng.
  //
  // ⚠️ `gpt-5.6-terra` KHÔNG có trong danh sách này, dù một lượt đo từng thấy
  // nó trả "Upstream stream ended without a terminal response event" giữa vòng
  // lặp. Lượt đó chạy chồng lên một phép đo khác; đo lại lúc không có gì chạy
  // song song thì nó hoàn thành 5 lời gọi tool và trả lời đúng. Một lần hỏng
  // dưới tải KHÔNG đủ để kết luận về model — ghi lại ở đây để lần sau ai thấy
  // lỗi đó thì đi kiểm tải trước, đừng đổ cho model.
  const LOAI = new Set(['grok-4.5', 'grok-4.6']);
  assert.ok(!LOAI.has(modelFor('agent_code')), 'agent_code đang trỏ vào model đã loại');
});
