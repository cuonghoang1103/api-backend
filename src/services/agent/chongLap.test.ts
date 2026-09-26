/**
 * Chống lặp phía máy chủ + việc phụ chạm trần + mã lỗi cổng (26/09/2026).
 *
 * Đo thật: mỗi lời gọi cổng chở 17k–57k token vào (p90 ~94k). Một lần agent
 * đọc lại đúng file vừa đọc, hay quay vòng "sửa → hỏng → sửa y hệt", là trả
 * trọn chừng đó tiền cho một kết quả nó đã có sẵn trong hội thoại.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CAU_TRUNG_DOC,
  NHAC_BUOC_CUOI,
  ganNhacDuoi,
  gomPhatHienViecPhu,
  maLoiCong,
  phatHienLap,
  runAgentTurn,
  type AgentEvent,
  type AgentMessage,
} from './turn.js';

let dem = 0;
/** Tin assistant gọi một (hoặc nhiều) tool. */
function goi(...ds: Array<[string, Record<string, unknown>]>): AgentMessage {
  return {
    role: 'assistant',
    content: null,
    tool_calls: ds.map(([ten, args]) => ({
      id: `c${++dem}`, type: 'function' as const, function: { name: ten, arguments: JSON.stringify(args) },
    })),
  };
}
/** Trả lời mọi tool_call của tin assistant `a`. */
function tra(a: AgentMessage, noiDung = 'kết quả'): AgentMessage[] {
  return (a as Extract<AgentMessage, { role: 'assistant' }>).tool_calls!.map((c) => ({
    role: 'tool' as const, tool_call_id: c.id, content: noiDung,
  }));
}

// ─── (a) đọc trùng ───────────────────────────────────────────────

test('đọc TRÙNG không có ghi xen giữa ⇒ máy chủ tự trả', () => {
  const a1 = goi(['read_file', { path: 'a.ts', limit: 50 }]);
  // Cùng tham số nhưng khác THỨ TỰ khoá — vẫn là cùng một lời gọi.
  const a2 = goi(['read_file', { limit: 50, path: 'a.ts' }]);
  const ds: AgentMessage[] = [{ role: 'user', content: 'xem a.ts' }, a1, ...tra(a1), a2];
  const kq = phatHienLap(ds);
  assert.equal(kq.trungDoc.length, 1);
  assert.equal(kq.trungDoc[0]!.idCu, (a1 as any).tool_calls[0].id);
});

test('có GHI xen giữa ⇒ KHÔNG coi là trùng', () => {
  const a1 = goi(['read_file', { path: 'a.ts' }]);
  const w = goi(['edit_file', { path: 'a.ts', old_string: 'x', new_string: 'y' }]);
  const a2 = goi(['read_file', { path: 'a.ts' }]);
  const ds: AgentMessage[] = [{ role: 'user', content: 'sửa' }, a1, ...tra(a1), w, ...tra(w), a2];
  assert.equal(phatHienLap(ds).trungDoc.length, 0);
});

test('ghi trong CHÍNH tin cuối ⇒ không trả thay lời đọc nào của tin đó', () => {
  const a1 = goi(['read_file', { path: 'a.ts' }]);
  const a2 = goi(['edit_file', { path: 'a.ts' }], ['read_file', { path: 'a.ts' }]);
  const ds: AgentMessage[] = [{ role: 'user', content: 'sửa' }, a1, ...tra(a1), a2];
  assert.equal(phatHienLap(ds).trungDoc.length, 0);
});

test('lần đọc cũ thuộc câu hỏi TRƯỚC ⇒ không tính', () => {
  const a1 = goi(['read_file', { path: 'a.ts' }]);
  const a2 = goi(['read_file', { path: 'a.ts' }]);
  const ds: AgentMessage[] = [
    { role: 'user', content: 'câu 1' }, a1, ...tra(a1), { role: 'assistant', content: 'xong' },
    { role: 'user', content: 'câu 2' }, a2,
  ];
  assert.equal(phatHienLap(ds).trungDoc.length, 0);
});

test('kết quả cũ SẼ bị lược ở lượt sau ⇒ không trả thay (nó không còn trong hội thoại)', () => {
  const a1 = goi(['read_file', { path: 'a.ts' }]);
  const dem8: AgentMessage[] = [];
  for (let i = 0; i < 16; i++) { const g = goi(['grep', { pattern: `p${i}` }]); dem8.push(g, ...tra(g)); }
  const a2 = goi(['read_file', { path: 'a.ts' }]);
  const ds: AgentMessage[] = [{ role: 'user', content: 'x' }, a1, ...tra(a1), ...dem8, a2];
  assert.equal(phatHienLap(ds).trungDoc.length, 0);
});

test('đọc trạng thái TRÔI (doc_dau_ra_nen) KHÔNG bao giờ bị trả thay — đó là vòng chờ build', () => {
  const a1 = goi(['doc_dau_ra_nen', { id: 'n1' }]);
  const a2 = goi(['doc_dau_ra_nen', { id: 'n1' }]);
  const ds: AgentMessage[] = [{ role: 'user', content: 'build' }, a1, ...tra(a1), a2];
  const kq = phatHienLap(ds);
  assert.equal(kq.trungDoc.length, 0);
  assert.equal(kq.lap, null);
});

// ─── (b) lặp ─────────────────────────────────────────────────────

test('cùng chữ ký lần thứ 3, kể cả có ghi xen giữa ⇒ nhắc lặp', () => {
  const ds: AgentMessage[] = [{ role: 'user', content: 'chạy test' }];
  for (let i = 0; i < 3; i++) {
    const r = goi(['run_command', { command: 'npm test' }]);
    const w = goi(['edit_file', { path: 'a.ts', new_string: `v${i}` }]);
    ds.push(r, ...tra(r, 'Lệnh HỎNG, mã thoát 1'));
    if (i < 2) ds.push(w, ...tra(w));
  }
  const kq = phatHienLap(ds);
  assert.ok(kq.lap, 'phải phát hiện lặp');
  assert.equal(kq.lap!.soLan, 3);
  assert.match(kq.lap!.moTa, /run_command/);
});

test('CHUỖI k lời gọi lặp lại (k=2) ⇒ nhắc lặp', () => {
  const ds: AgentMessage[] = [{ role: 'user', content: 'sửa' }];
  for (let i = 0; i < 2; i++) {
    const w = goi(['edit_file', { path: 'a.ts', old_string: 'x', new_string: 'y' }]);
    const r = goi(['run_command', { command: 'tsc' }]);
    ds.push(w, ...tra(w), r, ...tra(r));
  }
  const kq = phatHienLap(ds);
  assert.ok(kq.lap);
  assert.match(kq.lap!.moTa, /chuỗi 2 lời gọi edit_file → run_command/);
  assert.equal(kq.lap!.soLan, 2);
});

test('hai lời gọi giống nhau liền nhau CHƯA phải lặp; làm việc bình thường không bị nhắc', () => {
  const ds: AgentMessage[] = [{ role: 'user', content: 'x' }];
  const r1 = goi(['run_command', { command: 'npm test' }]);
  const r2 = goi(['run_command', { command: 'npm test' }]);
  ds.push(r1, ...tra(r1), r2, ...tra(r2));
  assert.equal(phatHienLap(ds).lap, null);

  const ds2: AgentMessage[] = [{ role: 'user', content: 'y' }];
  for (const f of ['a', 'b', 'c', 'd']) { const g = goi(['read_file', { path: f }]); ds2.push(g, ...tra(g)); }
  assert.equal(phatHienLap(ds2).lap, null);
});

test('ganNhacDuoi: gắn vào tin tool/user CUỐI trong BẢN SAO, không sửa gốc', () => {
  const a = goi(['read_file', { path: 'a' }]);
  const goc: AgentMessage[] = [{ role: 'user', content: 'x' }, a, ...tra(a)];
  const sao = ganNhacDuoi(goc, 'NHẮC');
  assert.ok((sao[2] as { content: string }).content.endsWith('NHẮC'));
  assert.equal((goc[2] as { content: string }).content, 'kết quả', 'bản gốc bị sửa');
});

// ─── Mã lỗi ──────────────────────────────────────────────────────

test('maLoiCong: lỗi tất định tách khỏi lỗi tạm', () => {
  assert.equal(maLoiCong('HTTP 400 {"error":"prompt is too long"}'), 'LLM_ERROR_4XX');
  assert.equal(maLoiCong('HTTP 401 invalid key'), 'LLM_ERROR_4XX');
  assert.equal(maLoiCong('HTTP 413 too large'), 'LLM_ERROR_4XX');
  assert.equal(maLoiCong('Cổng trả lỗi: {"type":"invalid_request_error"}'), 'LLM_ERROR_4XX');
  assert.equal(maLoiCong('HTTP 429 rate limited'), 'LLM_ERROR');
  assert.equal(maLoiCong('HTTP 529 overloaded'), 'LLM_ERROR');
  assert.equal(maLoiCong('Cổng trả lỗi: {"type":"overloaded_error"}'), 'LLM_ERROR');
  assert.equal(maLoiCong('HTTP 400 unknown provider for model x'), 'LLM_NO_PROVIDER');
  assert.equal(maLoiCong('This operation was aborted'), 'CONNECTION_LOST');
});

// ─── Việc phụ chạm trần ─────────────────────────────────────────

test('gomPhatHienViecPhu: gom mọi đoạn chữ việc phụ đã viết', () => {
  const a1 = { ...goi(['read_file', { path: 'src/boot.ts' }]), content: 'boot.ts nạp cấu hình ở dòng 40.' } as AgentMessage;
  const a2 = { ...goi(['grep', { pattern: 'initDb' }]), content: 'initDb được gọi 2 chỗ.' } as AgentMessage;
  const ds: AgentMessage[] = [{ role: 'user', content: 'tìm chỗ nạp DB' }, a1, ...tra(a1), a2, ...tra(a2)];
  const nd = gomPhatHienViecPhu(ds, 10);
  assert.ok(nd.includes('boot.ts nạp cấu hình ở dòng 40.'));
  assert.ok(nd.includes('initDb được gọi 2 chỗ.'));
  assert.ok(nd.includes('read_file src/boot.ts'));
});

// ─── Chạy THẬT runAgentTurn với cổng giả ─────────────────────────

function than(mau: Array<Record<string, unknown>>): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  return new ReadableStream({
    start(c) {
      for (const m of mau) c.enqueue(enc.encode(`data: ${JSON.stringify(m)}\n\n`));
      c.enqueue(enc.encode('data: [DONE]\n\n'));
      c.close();
    },
  });
}

/** Môi trường cổng giả tuyến OpenAI — tự dựng, không mượn `.env`. */
function dungMoiTruong(t: { after: (f: () => void) => void }): void {
  const luu = ['LLM_GATEWAY_API_KEY', 'LLM_GATEWAY_BASE_URL', 'AGENT_GATEWAY_BASE_URL', 'AGENT_GATEWAY_API_KEY']
    .map((k) => [k, process.env[k]] as const);
  process.env.LLM_GATEWAY_API_KEY = 'sk-gia-lap-cho-kiem-thu';
  process.env.LLM_GATEWAY_BASE_URL = 'https://vi-du.test/v1';
  delete process.env.AGENT_GATEWAY_BASE_URL;
  delete process.env.AGENT_GATEWAY_API_KEY;
  t.after(() => { for (const [k, v] of luu) { if (v === undefined) delete process.env[k]; else process.env[k] = v; } });
}

test('việc phụ CHẠM TRẦN ⇒ nội dung trả về là các phát hiện, không phải câu cố định', async (t) => {
  dungMoiTruong(t);
  const ds: AgentMessage[] = [{ role: 'user', content: 'tìm lỗi' }];
  for (let i = 0; i < 10; i++) {
    const a = { ...goi(['read_file', { path: `f${i}.ts` }]), content: `Phát hiện số ${i}.` } as AgentMessage;
    ds.push(a, ...tra(a));
  }
  const sk: AgentEvent[] = [];
  await runAgentTurn({ userId: 1, messages: ds, capabilities: ['fs_read'], laPhu: true } as any, (e) => sk.push(e), new AbortController().signal);
  const xong = sk.find((e) => e.type === 'done') as Extract<AgentEvent, { type: 'done' }>;
  assert.equal(xong.stop, 'max_steps');
  const nd = String(xong.append[xong.append.length - 1]!.content);
  assert.ok(nd.includes('Phát hiện số 0.') && nd.includes('Phát hiện số 9.'), nd.slice(0, 300));
});

test('việc phụ ở bước CUỐI ⇒ bản gửi cổng mang lời nhắc "bước CUỐI"', async (t) => {
  dungMoiTruong(t);
  const goc = globalThis.fetch;
  const daGui: any[] = [];
  globalThis.fetch = (async (_u: any, init: any) => {
    daGui.push(JSON.parse(String(init.body)));
    return new Response(than([{ choices: [{ delta: { content: 'Tóm tắt.' }, finish_reason: 'stop' }], usage: { prompt_tokens: 10, completion_tokens: 2 } }]), { status: 200 });
  }) as typeof fetch;
  t.after(() => { globalThis.fetch = goc; });

  const ds: AgentMessage[] = [{ role: 'user', content: 'tìm lỗi' }];
  for (let i = 0; i < 9; i++) { const a = goi(['read_file', { path: `f${i}.ts` }]); ds.push(a, ...tra(a)); }
  await runAgentTurn({ userId: 1, messages: ds, capabilities: ['fs_read'], laPhu: true } as any, () => {}, new AbortController().signal);
  const cuoi = daGui[0].messages[daGui[0].messages.length - 1];
  assert.ok(String(cuoi.content).includes(NHAC_BUOC_CUOI), 'thiếu lời nhắc bước cuối ở đuôi');
});

test('đọc trùng: KHÔNG phát tool_call xuống app, tự trả rồi gọi cổng tiếp', async (t) => {
  dungMoiTruong(t);
  const goc = globalThis.fetch;
  let lan = 0;
  globalThis.fetch = (async () => {
    lan += 1;
    const mau = lan === 1
      ? [{ choices: [{ delta: { tool_calls: [{ index: 0, id: 'moi', function: { name: 'read_file', arguments: '{"path":"a.ts"}' } }] }, finish_reason: 'tool_calls' }] }]
      : [{ choices: [{ delta: { content: 'a.ts có hàm main.' }, finish_reason: 'stop' }] }];
    return new Response(than(mau), { status: 200 });
  }) as typeof fetch;
  t.after(() => { globalThis.fetch = goc; });

  const a1 = goi(['read_file', { path: 'a.ts' }]);
  const ds: AgentMessage[] = [{ role: 'user', content: 'a.ts làm gì?' }, a1, ...tra(a1, 'function main() {}')];
  const sk: AgentEvent[] = [];
  await runAgentTurn({ userId: 1, messages: ds, capabilities: ['fs_read'], mucNoLuc: 'vua' } as any, (e) => sk.push(e), new AbortController().signal);

  assert.ok(!sk.some((e) => e.type === 'tool_call'), 'không được phát tool_call cho lời đọc trùng');
  const xong = sk.find((e) => e.type === 'done') as Extract<AgentEvent, { type: 'done' }>;
  assert.equal(xong.stop, 'end');
  const traLoi = xong.append.find((m) => m.role === 'tool') as { tool_call_id: string; content: string };
  assert.equal(traLoi.tool_call_id, 'moi', 'tool_call phải có đúng một tin trả lời');
  assert.equal(traLoi.content, CAU_TRUNG_DOC);
  assert.equal(lan, 2);
});

test('cổng trả HTTP 400 ⇒ mã LLM_ERROR_4XX (app không thử lại)', async (t) => {
  dungMoiTruong(t);
  const goc = globalThis.fetch;
  globalThis.fetch = (async () => new Response('{"error":"prompt is too long"}', { status: 400 })) as typeof fetch;
  t.after(() => { globalThis.fetch = goc; });
  const sk: AgentEvent[] = [];
  await runAgentTurn({ userId: 1, messages: [{ role: 'user', content: 'x' }], capabilities: [], mucNoLuc: 'vua' } as any, (e) => sk.push(e), new AbortController().signal);
  const loi = sk.find((e) => e.type === 'error') as Extract<AgentEvent, { type: 'error' }>;
  assert.equal(loi?.code, 'LLM_ERROR_4XX');
});
