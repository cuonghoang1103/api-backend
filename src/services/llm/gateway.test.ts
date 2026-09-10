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

import {
  allPurposeModels,
  baoRamboHong,
  baoRamboOk,
  endpointFor,
  goiDuocModel,
  LLM_PURPOSES,
  modelFor,
  RAMBO_PURPOSES_CO_DINH,
  ramboDangNghi,
} from './gateway.js';

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

test('Phòng Lab đi cổng rambo, và KHÔNG lùi sang modelapi khi cầu dao mở', () => {
  // ⚠️ Vì sao phép kiểm này tồn tại. `lab_room` là việc DUY NHẤT của Phòng Lab
  // gọi model, và modelapi KHÔNG phục vụ được model Claude nào (đo thật
  // 20/08: liệt kê đủ 6 cái, gọi thì 500/503/hết giờ). Gỡ `lab_room` khỏi
  // `RAMBO_PURPOSES_CO_DINH` thì mã vẫn biên dịch, `tsc` vẫn xanh, và hỏng chỉ
  // lộ ra vào đúng lúc rambo nghỉ một lát: cả Phòng Lab trả lời TRỐNG, không
  // câu lỗi nào nhắc tới "model" hay "cổng".
  //
  // Phép kiểm TỰ DỰNG môi trường, không mượn `.env` — bài học của phép kiểm
  // khoá GPT ngay bên trên: xanh ở máy nhà nhờ khoá thật, đỏ trên CI vì không
  // có, và cả hai kết quả đều không nói gì về mã.
  const luu = [
    'AGENT_GATEWAY_BASE_URL',
    'AGENT_GATEWAY_API_KEY',
    'LLM_LOCAL_BASE_URL',
    'LLM_LOCAL_API_KEY',
  ].map((t) => [t, process.env[t]] as const);
  delete process.env.LLM_LOCAL_BASE_URL;
  delete process.env.LLM_LOCAL_API_KEY;
  process.env.AGENT_GATEWAY_BASE_URL = 'https://rambo.ai.vn/api/claude';
  process.env.AGENT_GATEWAY_API_KEY = 'sk-gia-lap-rambo';
  try {
    const ep = endpointFor('lab_room');
    assert.equal(ep.label, 'cong-agent', 'lab_room không đi cổng rambo');
    assert.equal(ep.giaoThuc, 'anthropic', 'lab_room gửi body sai khung ⇒ hỏng CÂM');
    // Bẫy đã ghi 19/08: gốc `/v1` của rambo trả 200 KỂ CẢ khi không có khoá,
    // nên đường đúng bắt buộc mang `/api/claude`.
    assert.match(ep.root, /\/api\/claude$/, 'đường rambo mất phần /api/claude');

    // Người dùng chốt "dùng opus 4.8 max, đừng giới hạn nó" cho Phòng Lab.
    assert.equal(modelFor('lab_room'), 'claude-opus-4-8');

    // ─── phần đáng kiểm nhất: CẦU DAO ĐANG MỞ ───
    baoRamboHong();
    try {
      assert.ok(ramboDangNghi(), 'cầu dao đáng lẽ đang mở — phép kiểm dưới vô nghĩa');
      assert.equal(
        endpointFor('lab_room').label,
        'cong-agent',
        'lab_room lùi sang modelapi, nơi không có model Claude nào gọi được',
      );
      // KIỂM BỘ KIỂM: một việc KHÔNG cố định thì PHẢI lùi. Thiếu dòng này thì
      // dòng trên vẫn xanh cả khi cầu dao mất tác dụng hoàn toàn.
      assert.notEqual(
        endpointFor('chat_pro').label,
        'cong-agent',
        'cầu dao không có tác dụng ⇒ khẳng định phía trên không chứng minh gì',
      );
    } finally {
      baoRamboOk();
    }

    // Cuối cùng: `lab_room` không được lọt vào `VIEC_CHI_OPENAI` — nằm trong đó
    // thì nó không bao giờ tới rambo, dù `RAMBO_PURPOSES_CO_DINH` có nó.
    assert.ok(RAMBO_PURPOSES_CO_DINH.has('lab_room'));
  } finally {
    for (const [t, gt] of luu) {
      if (gt === undefined) delete process.env[t];
      else process.env[t] = gt;
    }
  }
});
