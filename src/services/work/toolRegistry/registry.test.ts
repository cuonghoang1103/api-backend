/**
 * CT Work đợt 3C — registry lệnh dùng chung + phần THUẦN của agent BUILTIN (không DB, không LLM):
 *   npx tsx --test src/services/work/toolRegistry/registry.test.ts
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('Registry lệnh dùng chung (đợt 3C)', async () => {
  const r = await import('./index.js');

  it('tên duy nhất; 21 tool MCP cũ đứng đầu, đúng thứ tự; tools/list của MCP = registry', async () => {
    const names = r.COMMANDS.map((t) => t.name);
    assert.equal(new Set(names).size, names.length);
    assert.equal(r.LEGACY_MCP_TOOLS.length, 21);
    assert.deepEqual(names.slice(0, 21), r.LEGACY_MCP_TOOLS);
    const { TOOLS } = await import('../../../mcp/server.js');
    assert.deepEqual(TOOLS.map((t) => t.name), r.mcpCommands().map((t) => t.name));
  });

  it('đủ lệnh mới đợt 3C: kiểm thử 5.1/5.2/5.3 + Xray, Docs, xuất tệp, sprint/họp/RAID/báo cáo tuần', () => {
    for (const n of [
      'fpt_unit_list', 'fpt_unit_get', 'fpt_unit_create_function', 'fpt_unit_add_cases', 'fpt_unit_mark', 'fpt_unit_record_results', 'fpt_unit_suggest',
      'fpt_it_list', 'fpt_it_get', 'fpt_it_create_module', 'fpt_it_add_cases', 'fpt_it_record_round',
      'test_list', 'test_get', 'test_create', 'test_cycles', 'test_run', 'test_cycle_create', 'test_run_record',
      'docs_draft_page', 'docs_update_section', 'export_file', 'sprint_current',
      'meeting_list', 'meeting_get', 'meeting_add_actions', 'meeting_create_issues', 'raid_list', 'raid_create', 'raid_update', 'weekly_report_generate',
    ]) {
      const t = r.commandByName(n);
      assert.ok(t, n);
      assert.ok(r.mcpCommands().includes(t!), `${n} có trên MCP`);
      assert.ok(r.askCommands().includes(t!), `${n} có trên Ask AI`);
      assert.ok('project' in t!.input.shape, `${n} nhận project`);
    }
  });

  it('không lệnh nào mang tên phá huỷ/quản trị (test rào chắn MCP dựa vào điều này)', () => {
    for (const t of r.COMMANDS) assert.doesNotMatch(t.name, /delete|approve|decide|finance|portal|settings/, t.name);
  });

  it('Ask AI: không có lệnh riêng agent, không có comment/update_issue/create_issue (Ask AI có hành động tương đương)', () => {
    const ask = r.askCommands().map((t) => t.name);
    for (const n of ['claim_issue', 'heartbeat', 'release_issue', 'report_usage', 'wait_events', 'attach_file', 'whoami', 'list_projects', 'my_work', 'comment', 'update_issue', 'create_issue']) {
      assert.ok(!ask.includes(n), n);
    }
    for (const n of ['get_issue', 'search_issues', 'get_page', 'transition', 'log_work']) assert.ok(ask.includes(n), n);
  });

  it('BUILTIN: runner tự lo lease/chi phí/kết thúc ⇒ model không thấy claim/heartbeat/release/report_usage/request_review/ask_lead/transition/log_work', () => {
    const b = r.builtinCommands().map((t) => t.name);
    for (const n of ['claim_issue', 'heartbeat', 'release_issue', 'report_usage', 'wait_events', 'request_review', 'ask_lead', 'transition', 'log_work', 'attach_file', 'fpt_unit_suggest']) {
      assert.ok(!b.includes(n), n);
    }
    for (const n of ['get_issue', 'comment', 'update_issue', 'create_issue', 'fpt_unit_add_cases', 'docs_draft_page', 'export_file']) assert.ok(b.includes(n), n);
  });

  it('chữ ký cho prompt bỏ `project`; mục lục đánh dấu [WRITE]', () => {
    const sig = r.signatureOf(r.commandByName('fpt_unit_add_cases')!);
    assert.match(sig, /^fpt_unit_add_cases\(function:int\|string, rows\?:/);
    assert.doesNotMatch(sig, /project/);
    const cat = r.commandCatalog([r.commandByName('fpt_unit_get')!, r.commandByName('raid_create')!]);
    assert.match(cat, /- fpt_unit_get\(function:int\|string\) — /);
    assert.match(cat, /raid_create\(type:"RISK"\|"ASSUMPTION"\|"ISSUE"\|"DEPENDENCY", title:string/);
    assert.match(cat, /\[WRITE\]/);
  });

  it('parseArgs ÉP project = dự án đang làm (model không trỏ sang dự án khác được)', () => {
    const t = r.commandByName('fpt_unit_list')!;
    assert.equal(r.parseArgs(t, { project: 'other/XX' }, 'ws/FP').project, 'ws/FP');
    assert.throws(() => r.parseArgs(r.commandByName('fpt_unit_get')!, {}, 'ws/FP'), /fpt_unit_get: function/);
  });
});

describe('export_file: tuyến tải đúng mẫu', async () => {
  const { exportRoute } = await import('./planning.js');
  const { agentRouteAllowed } = await import('../permissions.js');
  it('mỗi loại tệp ⇒ đúng tuyến REST; Project Tracking vẫn cấm agent như REST', () => {
    assert.equal(exportRoute('unit_test', { module: 'Auth' }).path, '/fpt-tests/export?report=unit&module=Auth');
    assert.equal(exportRoute('system_test', {}).path, '/fpt-tests/export?report=system');
    assert.equal(exportRoute('project_tracking', { variant: 'SEP490' }).path, '/export/project-tracking?variant=SEP490');
    assert.equal(exportRoute('weekly_report', { weeklyIds: [3, 4] }).path, '/fpt-reports/weekly/export?ids=3%2C4');
    assert.equal(exportRoute('wbs', {}).path, '/wbs/export');
    assert.equal(exportRoute('page_pdf', { page: 7 }).path, '/pages/7/export.pdf');
    assert.throws(() => exportRoute('page_docx', {}), /page/);
    assert.equal(agentRouteAllowed('GET', '/export/project-tracking'), false);
    assert.equal(agentRouteAllowed('GET', '/fpt-tests/export'), true);
  });
});

describe('Agent BUILTIN — phần thuần', async () => {
  const b = await import('../builtinAgent.service.js');
  it('đọc bước của model: call / done / blocked / rác', () => {
    assert.deepEqual(b.parseAgentStep({ thought: 't', call: { name: 'get_issue', args: { issue: 3 } } }), { thought: 't', call: { name: 'get_issue', args: { issue: 3 } } });
    assert.equal(b.parseAgentStep({ call: { name: 'x', args: [1] } })!.call!.args && Object.keys(b.parseAgentStep({ call: { name: 'x', args: [1] } })!.call!.args).length, 0);
    assert.equal(b.parseAgentStep({ done: { summary: 'ok' } })!.done!.outcome, 'review');
    assert.equal(b.parseAgentStep({ done: { summary: 'x', outcome: 'blocked', question: 'q?' } })!.done!.question, 'q?');
    assert.equal(b.parseAgentStep({ reply: 'hi' }), null);
    assert.equal(b.parseAgentStep('nope'), null);
  });
  it('đoán loại việc từ thẻ', () => {
    assert.equal(b.inferTask('Viết test case 5.1 cho hàm login', 'TASK'), 'WRITE_TESTS');
    assert.equal(b.inferTask('Write unit tests for UserService.register', 'TASK'), 'WRITE_TESTS');
    assert.equal(b.inferTask('Đặc tả màn hình đăng ký', 'STORY'), 'WRITE_SPEC');
    assert.equal(b.inferTask('Payments', 'EPIC'), 'SPLIT_EPIC');
    assert.equal(b.inferTask('Fix the header', 'BUG'), 'CUSTOM');
  });
  it('system prompt: luật cố định trước, dữ liệu dự án là untrusted, có giới hạn bước', () => {
    const s = b.systemPrompt({ agentName: 'Tester', projectKey: 'FP', issueKey: 'FP-3', maxSteps: 12, catalog: '- get_issue(issue:int)' });
    assert.match(s, /at most 12 replies/);
    assert.match(s, /untrusted="true"/);
    assert.match(s, /cannot approve, delete/);
    assert.ok(s.indexOf('Rules') < s.indexOf('- get_issue'));
  });
  it('mặc định an toàn: ≤ 2 $/lượt, 5 $/agent/ngày, 10 $/không gian/ngày, ≤ 12 bước, 3 agent/không gian', () => {
    assert.deepEqual([b.BUILTIN_DEFAULTS.runUsd, b.BUILTIN_DEFAULTS.agentDailyUsd, b.BUILTIN_DEFAULTS.workspaceDailyUsd, b.BUILTIN_DEFAULTS.maxSteps, b.BUILTIN_DEFAULTS.perWorkspace], [2, 5, 10, 12, 3]);
  });
});

describe('Cổng LLM: purpose work_agent', async () => {
  const gw = await import('../../llm/gateway.js');
  it('có trong bảng, không phải Grok, vặn được bằng env, đi modelapi (không rambo)', () => {
    assert.ok(gw.LLM_PURPOSES.includes('work_agent'));
    const old = process.env.LLM_MODEL_WORK_AGENT;
    process.env.LLM_MODEL_WORK_AGENT = 'gpt-5.6-terra';
    try { assert.equal(gw.modelFor('work_agent', { root: 'x', key: 'k', local: false, label: 'cong' }), 'gpt-5.6-terra'); } finally {
      if (old === undefined) delete process.env.LLM_MODEL_WORK_AGENT; else process.env.LLM_MODEL_WORK_AGENT = old;
    }
    const oldB = process.env.AGENT_GATEWAY_BASE_URL, oldK = process.env.AGENT_GATEWAY_API_KEY;
    process.env.AGENT_GATEWAY_BASE_URL = 'https://rambo.example/api/claude'; process.env.AGENT_GATEWAY_API_KEY = 'x';
    try { assert.notEqual(gw.endpointFor('work_agent').label, 'cong-agent'); } finally {
      if (oldB === undefined) delete process.env.AGENT_GATEWAY_BASE_URL; else process.env.AGENT_GATEWAY_BASE_URL = oldB;
      if (oldK === undefined) delete process.env.AGENT_GATEWAY_API_KEY; else process.env.AGENT_GATEWAY_API_KEY = oldK;
    }
    assert.equal(gw.uuTienCua('work_agent'), 'nen');
    assert.doesNotMatch(gw.allPurposeModels().find((x) => x.purpose === 'work_agent')!.model, /grok/);
  });
});
