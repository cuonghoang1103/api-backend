/**
 * QA đợt 4+5 (18/10/2026, mục 5c của docs/cuongmini-doi-chieu-nang-luc.md) — chạy THẬT `runAgentTurn` với cổng giả,
 * đo đúng thứ gửi lên cổng: dòng HÔM NAY + DỰ ÁN CT WORK đứng CUỐI prompt hệ thống, hai lượt liên tiếp cùng ngày ⇒
 * prompt hệ thống + danh sách tool GIỐNG HỆT TỪNG BYTE (đệm tiền tố trúng); luật CT Work chỉ khi cuộc có tool CT Work.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { runAgentTurn, type AgentEvent } from './turn.js';
import { LUAT_CTWORK } from './prompt.js';

function than(): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  return new ReadableStream({
    start(c) {
      c.enqueue(enc.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: 'ok' }, finish_reason: 'stop' }], usage: { prompt_tokens: 10, completion_tokens: 2 } })}\n\n`));
      c.enqueue(enc.encode('data: [DONE]\n\n'));
      c.close();
    },
  });
}

const TOOL_CTW = ['get_issue', 'sprint_current', 'comment'].map((t) => ({ name: `mcp__ctwork__${t}`, description: `CT Work ${t}`, parameters: { type: 'object', properties: {} } }));
const TOOL_KHAC = [{ name: 'mcp__figma__get_file', description: 'Figma', parameters: { type: 'object', properties: {} } }];

test('HÔM NAY + DỰ ÁN CT WORK ở CUỐI; hai lượt cùng ngày ⇒ system + tools giống hệt byte; LUAT_CTWORK chỉ khi có tool CT Work', async (t) => {
  const luu = ['LLM_GATEWAY_API_KEY', 'LLM_GATEWAY_BASE_URL', 'AGENT_GATEWAY_BASE_URL', 'AGENT_GATEWAY_API_KEY'].map((k) => [k, process.env[k]] as const);
  process.env.LLM_GATEWAY_API_KEY = 'sk-gia-lap-cho-kiem-thu';
  process.env.LLM_GATEWAY_BASE_URL = 'https://vi-du.test/v1';
  delete process.env.AGENT_GATEWAY_BASE_URL;
  delete process.env.AGENT_GATEWAY_API_KEY;
  t.after(() => { for (const [k, v] of luu) { if (v === undefined) delete process.env[k]; else process.env[k] = v; } });

  const goc = globalThis.fetch;
  const daGui: any[] = [];
  globalThis.fetch = (async (_url: any, init: any) => {
    daGui.push(JSON.parse(String(init.body)));
    return new Response(than(), { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
  }) as typeof fetch;
  t.after(() => { globalThis.fetch = goc; });

  const ngayGio = { ngay: '2026-10-18', thu: 0, tz: 'Asia/Ho_Chi_Minh', lechPhut: 420 };
  const ctwork = { key: 'LF', projectId: 2, workspaceId: 3, ten: 'LabFlow AI', workspace: 'LabFlow Studio', the: 'LF-18' };
  const luot = async (cau: string, toolMcp: unknown[], ctw: unknown = ctwork) => {
    const sk: AgentEvent[] = [];
    await runAgentTurn({ userId: 1, messages: [{ role: 'user', content: cau }], capabilities: ['read'], mucNoLuc: 'vua', ngayGio, ctwork: ctw, toolMcp } as any, (e) => sk.push(e), new AbortController().signal);
    assert.ok(sk.some((e) => e.type === 'done'), JSON.stringify(sk.map((e) => e.type)));
    const b = daGui.at(-1);
    const sys = b.messages[0];
    assert.equal(sys.role, 'system');
    return { sys: String(sys.content), tools: JSON.stringify(b.tools ?? []) };
  };

  const a = await luot('câu một', TOOL_CTW);
  const b = await luot('câu hai — khác hẳn', TOOL_CTW);
  assert.equal(a.sys, b.sys, 'prompt hệ thống đổi giữa hai lượt cùng ngày ⇒ đệm tiền tố trượt');
  assert.equal(a.tools, b.tools, 'danh sách tool đổi giữa hai lượt');

  // Thứ tự: … LOI_LAM_VIEC … LUAT_CTWORK … HÔM NAY … DỰ ÁN CT WORK (cuối cùng).
  const iLuat = a.sys.indexOf(LUAT_CTWORK);
  const iHomNay = a.sys.indexOf('HÔM NAY: ');
  const iDuAn = a.sys.indexOf('DỰ ÁN CT WORK của thư mục này: LF');
  assert.ok(iLuat > 0 && iHomNay > iLuat && iDuAn > iHomNay, `thứ tự sai: luật ${iLuat}, hôm nay ${iHomNay}, dự án ${iDuAn}`);
  assert.match(a.sys.slice(iHomNay), /^HÔM NAY: Chủ nhật 18\/10\/2026 \(Asia\/Ho_Chi_Minh, UTC\+7\)/);
  assert.ok(a.sys.trimEnd().endsWith('(người dùng có thể đang làm thẻ này).'), a.sys.slice(-200));

  // Không có tool CT Work ⇒ KHÔNG có luật CT Work (vẫn có dòng dự án khi app gửi `ctwork`).
  const c = await luot('câu ba', TOOL_KHAC);
  assert.equal(c.sys.indexOf(LUAT_CTWORK), -1);
  assert.ok(c.sys.includes('DỰ ÁN CT WORK của thư mục này: LF'));
  // Không gắn dự án, không tool CT Work ⇒ không dòng dự án.
  const d = await luot('câu bốn', TOOL_KHAC, null);
  assert.ok(!d.sys.includes('DỰ ÁN CT WORK'));
  // Phần TRƯỚC dòng HÔM NAY không phụ thuộc dự án (đổi thư mục không phá đệm phần lớn).
  assert.equal(c.sys.slice(0, c.sys.indexOf('HÔM NAY: ')), d.sys.slice(0, d.sys.indexOf('HÔM NAY: ')));
});
