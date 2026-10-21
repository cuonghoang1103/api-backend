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
    // 12/10/2026 (0bde6e11): create_project vào nhóm ghi ⇒ 22 tool "cũ", đứng cuối nhóm đó.
    assert.equal(r.LEGACY_MCP_TOOLS.length, 22);
    assert.equal(r.LEGACY_MCP_TOOLS[21], 'create_project');
    assert.deepEqual(names.slice(0, r.LEGACY_MCP_TOOLS.length), r.LEGACY_MCP_TOOLS);
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

  it('không lệnh nào mang tên duyệt/tài chính/cổng khách/cấu hình; lệnh xoá chỉ token NGƯỜI (test rào chắn MCP dựa vào điều này)', () => {
    for (const t of r.COMMANDS) assert.doesNotMatch(t.name, /approve|decide|finance|portal|settings/, t.name);
    // 21/10/2026: CuongMini ngang quyền người ⇒ CÓ lệnh xoá, nhưng: destructive (client luôn hỏi), personOnly (agent không
    // thấy + bị chặn), không ở Ask AI / agent dựng sẵn.
    const del = r.COMMANDS.filter((t) => /delete/.test(t.name));
    assert.ok(del.length >= 15, `${del.length} lệnh xoá`);
    for (const t of del) {
      assert.equal(t.destructive, true, `${t.name} destructive`);
      assert.equal(t.personOnly, true, `${t.name} personOnly`);
      assert.ok(!r.askCommands().includes(t) && !r.builtinCommands().includes(t), `${t.name} không ở Ask/BUILTIN`);
      assert.match(t.description, /^DESTRUCTIVE/, `${t.name} mô tả nói rõ là xoá`);
    }
  });

  it('21/10/2026 — CuongMini ngang quyền người: đủ lệnh sửa/xoá 5.1/5.2/5.3, thẻ, Docs, Xray, repo', () => {
    const mcp = r.mcpCommands().map((t) => t.name);
    for (const n of [
      'fpt_unit_update_function', 'fpt_unit_update_rows', 'fpt_unit_delete_rows', 'fpt_unit_delete_cases', 'fpt_unit_move', 'fpt_unit_duplicate_function',
      'fpt_unit_delete_function', 'fpt_doc_get', 'fpt_doc_update', 'fpt_change_add', 'fpt_change_update', 'fpt_change_delete',
      'fpt_it_update_module', 'fpt_it_update_cases', 'fpt_it_delete_cases', 'fpt_it_move_case', 'fpt_it_delete_module',
      'issue_delete', 'issue_restore', 'issue_clone', 'comment_edit', 'comment_delete', 'attachment_delete', 'issue_web_link_remove',
      'issue_custom_fields_set', 'worklog_delete', 'sprint_update', 'sprint_delete', 'docs_page_update', 'docs_page_move', 'docs_page_delete',
      'docs_page_restore', 'test_update', 'test_cycle_update', 'test_cycle_delete', 'test_run_defect', 'raid_delete', 'meeting_create',
      'meeting_update', 'meeting_delete', 'qna_update', 'qna_delete', 'diagram_delete', 'chat_edit', 'chat_delete', 'resource_add',
      'resource_update', 'resource_delete', 'project_repos', 'docs_page_link_issue', 'docs_page_version_restore',
      'srs_actor_update', 'srs_use_case_update', 'srs_rule_update', 'srs_screen_update', 'srs_function_update', 'srs_delete',
    ]) assert.ok(mcp.includes(n), `${n} có trên MCP`);
    // Executed By / LOC… của hàm 5.1 (lý do của đợt này)
    for (const f of ['executedBy', 'createdBy', 'loc', 'description', 'preCondition', 'testRequirement', 'codeRef']) {
      assert.ok(f in r.commandByName('fpt_unit_update_function')!.input.shape, f);
    }
    // Trang Docs: AI không tự đặt APPROVED (duyệt là việc của người, qua Approvals)
    assert.equal(r.commandByName('docs_page_update')!.input.shape.status.safeParse('APPROVED').success, false);
    assert.equal(r.commandByName('project_repos')!.write, false);
    // Đợt 2 (21/10/2026)
    for (const n of [
      'swr_glossary_update', 'swr_dictionary_update', 'swr_priority_update', 'swr_survey_update', 'swr_mockup_update', 'swr_delete', 'trace_links', 'trace_link_remove',
      'change_requests', 'change_request_manage', 'change_request_delete', 'chat_channel_manage', 'chat_message_act', 'docs_comments', 'docs_comment_resolve',
      'docs_comment_delete', 'meeting_attendees_set', 'meeting_agenda_set', 'test_plans', 'test_plan_manage', 'test_plan_delete', 'test_designs', 'test_design_save',
      'test_design_export', 'test_design_delete', 'fpt_import_excel', 'poker_session', 'retro_session', 'agile_delete', 'reviews', 'review_manage', 'review_delete',
      'versions', 'version_manage', 'version_delete', 'class_content', 'class_post', 'class_material', 'class_assignment', 'class_content_delete',
    ]) assert.ok(mcp.includes(n), `${n} có trên MCP`);
    // Quyết định vẫn của người: CR không có action duyệt; review không có `decision`.
    assert.ok(!(r.commandByName('change_request_manage')!.input.shape.action.options as string[]).some((x) => /approve|reject/.test(x)));
    assert.ok(!('decision' in r.commandByName('review_manage')!.input.shape));
    assert.equal(r.commandByName('fpt_import_excel')!.destructive, true, 'replace ghi đè ⇒ luôn hỏi');
    assert.ok(!('status' in r.commandByName('srs_use_case_update')!.input.shape), 'AI không tự duyệt use case');
    assert.ok(!('status' in r.commandByName('srs_rule_update')!.input.shape), 'AI không tự duyệt business rule');
  });

  it('Ask AI: không có lệnh riêng agent, không có comment/update_issue/create_issue (Ask AI có hành động tương đương)', () => {
    const ask = r.askCommands().map((t) => t.name);
    for (const n of ['claim_issue', 'heartbeat', 'release_issue', 'report_usage', 'wait_events', 'attach_file', 'whoami', 'list_projects', 'my_work', 'comment', 'update_issue', 'create_issue']) {
      assert.ok(!ask.includes(n), n);
    }
    for (const n of ['get_issue', 'search_issues', 'get_page', 'transition', 'log_work']) assert.ok(ask.includes(n), n);
    // 18/10/2026 — lệnh đọc của trợ lý mentor: CHỈ đường Ask (không MCP, không BUILTIN), đều là lệnh ĐỌC.
    const mcp = r.mcpCommands().map((t) => t.name);
    const builtin = r.builtinCommands().map((t) => t.name);
    for (const n of ['read_issue', 'read_attachment', 'list_resources', 'member_work']) {
      assert.ok(ask.includes(n), `${n} có trên Ask AI`);
      assert.ok(!mcp.includes(n) && !builtin.includes(n), `${n} không lên MCP/BUILTIN`);
      assert.equal(r.commandByName(n)!.write, false, `${n} chỉ đọc`);
    }
  });

  it('BUILTIN: runner tự lo lease/chi phí/kết thúc ⇒ model không thấy claim/heartbeat/release/report_usage/request_review/ask_lead/transition/log_work', () => {
    const b = r.builtinCommands().map((t) => t.name);
    for (const n of ['claim_issue', 'heartbeat', 'release_issue', 'report_usage', 'wait_events', 'request_review', 'ask_lead', 'transition', 'log_work', 'attach_file', 'fpt_unit_suggest']) {
      assert.ok(!b.includes(n), n);
    }
    for (const n of ['get_issue', 'comment', 'update_issue', 'create_issue', 'fpt_unit_add_cases', 'docs_draft_page', 'export_file']) assert.ok(b.includes(n), n);
  });

  it('19/10/2026 — làm thay người: tool mới có trên MCP; quản trị (thành viên/mời/sprint) chỉ token NGƯỜI, không vào BUILTIN', async () => {
    const mcp = r.mcpCommands().map((t) => t.name);
    const builtin = r.builtinCommands().map((t) => t.name);
    const ask = r.askCommands().map((t) => t.name);
    for (const n of ['gdoc_images', 'attach_from_url', 'issue_link', 'issue_unlink', 'issue_flag', 'issue_watch', 'issue_web_link_add',
      'project_member_add', 'project_member_set_role', 'project_member_remove', 'workspace_invite', 'sprint_create', 'sprint_start', 'sprint_complete']) {
      assert.ok(mcp.includes(n), `${n} có trên MCP`);
    }
    const nguoi = ['project_member_add', 'project_member_set_role', 'project_member_remove', 'workspace_invite', 'sprint_create', 'sprint_start', 'sprint_complete'];
    for (const n of nguoi) {
      assert.equal(r.commandByName(n)!.personOnly, true, `${n} personOnly`);
      assert.ok(!builtin.includes(n), `${n} không vào BUILTIN`);
    }
    // Tải từ link chạy trên máy chủ ⇒ không mở cho Ask AI / BUILTIN (model đọc nội dung untrusted có thể bị dụ gọi URL lạ).
    for (const n of ['gdoc_images', 'attach_from_url']) assert.ok(!ask.includes(n) && !builtin.includes(n), n);
    assert.equal(r.commandByName('gdoc_images')!.write, false);
    // tools/list theo token: agent không thấy tool personOnly, người thì thấy.
    const { TOOLS } = await import('../../../mcp/server.js');
    const thay = (agent: boolean) => TOOLS.filter((t) => (!t.agentOnly || agent) && (!t.personOnly || !agent)).map((t) => t.name);
    for (const n of nguoi) assert.ok(thay(false).includes(n) && !thay(true).includes(n), n);
    // update_issue / create_issue nhận trường của người (assignee, priority, sprint…); comment chọn được visibility.
    for (const [tool, fields] of [['update_issue', ['assignee', 'priority', 'sprint', 'parent', 'startDate', 'originalEstimateMinutes', 'components', 'fixVersion']],
      ['create_issue', ['assignee', 'priority', 'storyPoints', 'dueDate', 'sprint']], ['comment', ['visibility']], ['transition', ['commentVisibility']]] as const) {
      for (const f of fields) assert.ok(f in r.commandByName(tool)!.input.shape, `${tool}.${f}`);
    }
    assert.doesNotMatch(r.commandByName('update_issue')!.description, /assigned to you/);
  });

  it('mục lục MCP cho token người còn dưới trần 300 của máy chủ (parseMucLucMcp) — có chỗ thở', () => {
    const nguoi = r.mcpCommands().filter((t) => !t.agentOnly);
    assert.ok(nguoi.length <= 280, `${nguoi.length} lệnh cho token người — sát trần 300 của mục lục ⇒ nâng trần (tools.ts) hoặc gộp lệnh`);
  });

  it('chữ ký cho prompt bỏ `project`; mục lục đánh dấu [WRITE]', () => {
    const sig = r.signatureOf(r.commandByName('fpt_unit_add_cases')!);
    assert.match(sig, /^fpt_unit_add_cases\(function:int\|string, rows\?:/);
    assert.doesNotMatch(sig, /project/);
    const cat = r.commandCatalog([r.commandByName('fpt_unit_get')!, r.commandByName('raid_create')!]);
    assert.match(cat, /- fpt_unit_get\(function:int\|string\) — /);
    assert.match(cat, /raid_create\(type:"RISK"\|"ASSUMPTION"\|"ISSUE"\|"DEPENDENCY"\|"QUESTION", title:string/);
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
  });  it('mô tả export_file nói rõ giới hạn Mermaid khi xuất page_docx/page_pdf (QA 10/10 P2-6)', async () => {
    const r = await import('./index.js');
    const d = r.commandByName('export_file')!.description;
    assert.match(d, /Mermaid diagram blocks come out as their source code/);
    assert.match(d, /export from the page in the web app/);
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
    const old = process.env.LLM_MODEL_WORK_AGENT, oldG = process.env.LLM_GATEWAY_API_KEY_GPT;
    process.env.LLM_MODEL_WORK_AGENT = 'gpt-5.6-terra';
    // Không có khoá nhóm GPT thì gateway LÙI về Claude (đúng thiết kế) ⇒ đặt khoá giả, không dựa vào .env của máy chạy.
    process.env.LLM_GATEWAY_API_KEY_GPT = 'sk-test-gpt';
    try { assert.equal(gw.modelFor('work_agent', { root: 'x', key: 'k', local: false, label: 'cong' }), 'gpt-5.6-terra'); } finally {
      if (old === undefined) delete process.env.LLM_MODEL_WORK_AGENT; else process.env.LLM_MODEL_WORK_AGENT = old;
      if (oldG === undefined) delete process.env.LLM_GATEWAY_API_KEY_GPT; else process.env.LLM_GATEWAY_API_KEY_GPT = oldG;
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
