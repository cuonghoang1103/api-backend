/**
 * CT Work 28/10/2026 — trợ lý web làm được mọi việc như trên web (phần THUẦN, không DB, không LLM):
 *   NODE_ENV=test npx tsx --test src/services/work/aiTroLyWeb.test.ts
 *
 *   W  bộ lệnh web: gồm lệnh trước đây chỉ MCP; không có lệnh agent / tải URL / tải base64; lệnh xoá vẫn personOnly
 *   F  find_commands: tìm theo tên / từ khoá (cả tiếng Việt), trả mô tả + tham số; mục lục tên đánh dấu ghi / xoá
 *   P  prompt: mục lục mới GỌN hơn bản cũ mà vẫn nhắc ĐỦ mọi lệnh người hỏi dùng được
 *   L  việc trên máy người dùng: câu chuẩn theo vỏ (web / app CuongThai / app CT Work), bộ nhận diện
 *   R  không bịa kết quả chạy test: lời gọi nào là "ghi kết quả"
 *   A  agent không đổi: BUILTIN không thấy lệnh mới; runForAgent / runForPerson từ chối lệnh ngoài bộ của mình
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

const MEMBER = { projectId: 1, workspaceId: 1, key: 'SS', role: 'MEMBER', workspaceRole: 'MEMBER', principal: 'HUMAN', agentOptions: {}, options: {}, kind: 'SCRUM', modules: { docs: true } } as never;
const TEACHER = { ...(MEMBER as object), role: 'TEACHER' } as never;

describe('W — bộ lệnh của trợ lý web', async () => {
  const r = await import('./toolRegistry/index.js');
  const web = r.webCommands();
  const names = web.map((t) => t.name);

  it('gồm lệnh trước đây chỉ MCP (sửa/xoá 5.1, họp, RAID, thành viên…) + lệnh chỉ-Ask (read_issue…)', () => {
    for (const n of ['fpt_unit_update_rows', 'fpt_unit_update_function', 'fpt_unit_delete_cases', 'fpt_it_update_cases', 'meeting_create', 'raid_delete',
      'project_member_set_role', 'sprint_create', 'docs_page_update', 'issue_link', 'srs_use_case_update', 'chat_post', 'read_issue', 'member_work', 'fpt_unit_add_cases']) {
      assert.ok(names.includes(n), n);
    }
    assert.ok(web.length >= 250, `${web.length} lệnh`);
    assert.ok(web.length > r.askCommands().length + 100, 'rộng hơn hẳn bộ Ask cũ');
  });

  it('không có lệnh riêng agent, lệnh tải từ URL / base64, lệnh trùng hành động sẵn có, lệnh ngoài dự án', () => {
    for (const n of ['claim_issue', 'heartbeat', 'release_issue', 'report_usage', 'wait_events', 'gdoc_images', 'attach_from_url', 'attach_file', 'attach_complete',
      'comment', 'update_issue', 'create_issue', 'ask_lead', 'request_review', 'whoami', 'list_projects', 'create_project', 'class_submit', 'class_admin']) {
      assert.ok(!names.includes(n), n);
    }
    for (const t of web) {
      assert.ok(!t.agentOnly, t.name);
      assert.ok('project' in t.input.shape, `${t.name} nhận project`);
      if (t.destructive) assert.equal(t.personOnly, true, `${t.name}: lệnh xoá vẫn chỉ token người`);
    }
  });

  it('không mở thêm lệnh MCP (mục lục token người vẫn ≤ 280) — find_commands là tool riêng của web', () => {
    assert.ok(r.mcpCommands().filter((t) => !t.agentOnly).length <= 280);
    assert.equal(r.commandByName('find_commands'), undefined);
  });
});

describe('F — find_commands (nạp lệnh động)', async () => {
  const r = await import('./toolRegistry/index.js');
  const { timLenh, mucLucTen, tuKhoa, chiTietLenh } = await import('./toolRegistry/timLenh.js');
  const web = r.webCommands();

  it('theo TÊN: mô tả đầy đủ + từng tham số (lồng sâu), không có `project`; tên lạ được báo', () => {
    const s = timLenh(web, { names: ['fpt_unit_update_rows', 'khong_co_lenh'] });
    assert.match(s, /^Not available to this user here: khong_co_lenh/m);
    assert.match(s, /fpt_unit_update_rows \[WRITE — propose it/);
    assert.match(s, /- rows: \(\{row:/);
    assert.match(s, /section\?:"condition"\|"confirmation"/);
    assert.doesNotMatch(s, /- project/);
  });

  it('lệnh xoá ghi rõ là yêu cầu chờ trưởng nhóm duyệt; lệnh đọc bảo dùng read_command', () => {
    assert.match(chiTietLenh(r.commandByName('fpt_unit_delete_cases')!), /DELETE — becomes a deletion request/);
    assert.match(chiTietLenh(r.commandByName('fpt_unit_get')!), /READ — run it with read_command/);
  });

  it('theo TỪ KHOÁ — tiếng Anh lẫn tiếng Việt không dấu/có dấu', () => {
    const top = (q: string) => /^(\w+)/.exec(timLenh(web, { query: q, limit: 3 }))![1];
    assert.equal(top('meeting minutes'), 'meeting_minutes_propose');
    assert.match(timLenh(web, { query: 'xoá dòng 5.1', limit: 4 }), /fpt_unit_delete_rows/);
    assert.match(timLenh(web, { query: 'sua UTCID', limit: 5 }), /fpt_unit_/);
    assert.match(timLenh(web, { query: 'rủi ro', limit: 4 }), /raid_/);
    assert.ok(tuKhoa('Xoá biên bản họp').includes('delete'));
    assert.match(timLenh(web, { query: 'zzqq' }), /No matching command/);
  });

  it('kết quả có trần độ dài; limit tối đa 10', () => {
    const s = timLenh(web, { query: 'update', limit: 50 });
    assert.ok(s.length <= 14_500, `${s.length}`);
    assert.ok((s.match(/\n {2}args:/g) ?? []).length <= 10);
  });

  it('mục lục tên: * = ghi, ! = xoá; bỏ qua lệnh đã in kèm tham số', () => {
    const idx = mucLucTen(web, new Set(['fpt_unit_get']));
    assert.match(idx, /fpt_unit_delete_cases!/);
    assert.match(idx, /fpt_unit_update_rows\*/);
    assert.doesNotMatch(idx, /\bfpt_unit_get\b/);
  });
});

describe('P — prompt gọn mà đủ', async () => {
  const ai = await import('./ai.service.js');
  const r = await import('./toolRegistry/index.js');

  it('câu hỏi có ghi: mục lục < 16k ký tự (bản cũ ~35k + ~6k lệnh xoá) và nhắc TÊN mọi lệnh MEMBER dùng được', async () => {
    const doc = await ai.commandsDoc(MEMBER, { writes: true });
    assert.ok(doc.length < 16_000, `${doc.length} ký tự`);
    assert.match(doc, /find_commands/);
    assert.match(doc, /fpt_unit_add_cases\(function:/, 'lệnh hay dùng có tham số');
    assert.match(doc, /WRITE commands — you can NOT run them/);
    const visible = r.webCommands().filter((t) => t.name !== 'get_issue' && t.name !== 'code_review' && t.name !== 'review_queue');
    for (const t of visible) assert.ok(new RegExp(`\\b${t.name}\\b`).test(doc), `${t.name} có trong prompt`);
  });

  it('câu hỏi chỉ để hiểu: không lệnh ghi, < 6k ký tự', async () => {
    const doc = await ai.commandsDoc(MEMBER, { writes: false });
    assert.ok(doc.length < 6_000, `${doc.length}`);
    assert.doesNotMatch(doc, /WRITE commands — you can NOT run them/);
    assert.doesNotMatch(doc, /fpt_unit_delete_cases/);
  });

  it('giảng viên (không sửa được thẻ): lệnh ghi duy nhất là code_review (luật review code 27/10), không lệnh ghi nào khác', async () => {
    const doc = await ai.commandsDoc(TEACHER, { writes: true });
    assert.match(doc, /code_review\(/);
    assert.doesNotMatch(doc, /fpt_unit_add_cases|fpt_unit_delete|[a-z]\*(\s|$)|[a-z]!(\s|$)/m);
  });

  it('tool gốc có find_commands; parseReads / tool call ⇒ mục tra lệnh', async () => {
    const { congCuDoc, readsTuToolCalls } = await import('./aiTraLoi.js');
    assert.ok(congCuDoc({ docs: false }).some((t) => t.name === 'find_commands'));
    const raw = readsTuToolCalls([{ name: 'find_commands', input: { names: ['raid_delete'] } }]);
    assert.deepEqual(ai.parseReads(raw).reads, [{ tool: 'find', names: ['raid_delete'], query: null }]);
    assert.deepEqual(ai.parseReads([{ tool: 'find_commands', query: 'risk' }]).reads, [{ tool: 'find', query: 'risk' }]);
    assert.deepEqual(ai.parseReads([{ tool: 'find', names: 'raid_list' }]).reads, [{ tool: 'find', names: ['raid_list'] }]);
  });

  it('runFindCommands theo quyền người hỏi: giảng viên không thấy lệnh ghi', async () => {
    const s = await ai.runFindCommands(TEACHER, 1, [{ names: ['fpt_unit_add_cases', 'fpt_unit_get'] }]);
    assert.match(s, /Not available to this user here: fpt_unit_add_cases/);
    assert.match(s, /fpt_unit_get \[READ/);
  });
});

describe('L — việc trên máy người dùng', async () => {
  const m = await import('./aiTroLyWeb.js');

  it('câu chuẩn theo vỏ', () => {
    assert.equal(m.cauMayCucBo('web'), 'Phần này mình không làm được trên web vì code nằm trên máy bạn — bạn mở **app desktop CuongThai (mục AI Code)** hoặc **CuongMini CLI** rồi kết nối CT Work (`/ctwork`) nhé.');
    assert.match(m.cauMayCucBo('desktop'), /mở \*\*AI Code\*\* ngay trong app này/);
    assert.doesNotMatch(m.cauMayCucBo('desktop'), /CLI/, 'trong app CuongThai: không bảo cài thêm gì');
    assert.equal(m.cauMayCucBo('ctwork-desktop'), m.cauMayCucBo('web'), 'app CT Work riêng không có AI Code');
    assert.match(m.cauMayCucBo('web', 'en'), /^I can't do this part from the web because the code is on your computer/);
    assert.equal(m.voTroLy('desktop'), 'desktop');
    assert.equal(m.voTroLy('ios'), 'web');
    assert.equal(m.voTroLy(undefined), 'web');
  });

  it('khối system prompt: chứa đúng câu chuẩn, /ctwork, tên dự án', () => {
    const k = m.khoiMayCucBo('desktop', 'swt301/SS');
    assert.ok(k.includes(m.cauMayCucBo('desktop', 'vi')));
    assert.ok(k.includes(m.cauMayCucBo('desktop', 'en')));
    assert.match(k, /`\/ctwork`/);
    assert.match(k, /swt301\/SS/);
  });

  it('nhận diện việc trên máy (chạy test, git, sửa code local) — không bắt nhầm câu hỏi thường', () => {
    for (const q of ['Chạy JUnit cho UserServiceTest giúp mình', 'git push code lên nhánh feature/login', 'chạy test rồi điền kết quả vào 5.1', 'run playwright tests',
      'commit code giúp tôi', 'sửa code hàm login trên máy tôi', 'npm run test đi']) assert.ok(m.laViecMayCucBo(q), q);
    for (const q of ['Việc của tôi tuần này?', 'Điền 3 UTCID cho hàm register', 'Giải thích SS-12', 'tạo cuộc họp thứ 6', 'xoá risk R3']) assert.ok(!m.laViecMayCucBo(q), q);
  });
});

describe('R — không bịa kết quả chạy test', async () => {
  const { ghiKetQuaChay, LENH_GHI_KET_QUA, KHOI_KET_QUA_THAT } = await import('./aiTroLyWeb.js');

  it('soạn case KHÔNG kèm kết quả ⇒ không phải ghi kết quả', () => {
    assert.equal(ghiKetQuaChay('fpt_unit_add_cases', { cases: [{ type: 'N', O: [1] }, { type: 'A', O: [2], result: null }] }), false);
    assert.equal(ghiKetQuaChay('fpt_it_add_cases', { cases: [{ description: 'x', expected: 'y' }] }), false);
    assert.equal(ghiKetQuaChay('fpt_unit_record_results', { results: [{ case: 1, type: 'B', note: 'n' }] }), false);
    assert.equal(ghiKetQuaChay('fpt_unit_record_results', { results: [{ case: 1, result: null }] }), false, 'xoá kết quả');
    assert.equal(ghiKetQuaChay('fpt_unit_update_function', { description: 'd' }), false);
    assert.equal(ghiKetQuaChay('fpt_it_record_round', { results: [{ case: 1, round: 1, status: 'Pending' }] }), false);
    assert.equal(ghiKetQuaChay('test_run_record', { status: 'IN_PROGRESS' }), false);
    assert.equal(ghiKetQuaChay('raid_create', { title: 'x' }), false);
  });

  it('P/F, ngày chạy, người chạy, actual, trạng thái vòng/lượt ⇒ ghi kết quả', () => {
    assert.equal(ghiKetQuaChay('fpt_unit_add_cases', { cases: [{ type: 'N', O: [1], result: 'P' }] }), true);
    assert.equal(ghiKetQuaChay('fpt_unit_record_results', { results: [{ case: 1, result: 'F' }] }), true);
    assert.equal(ghiKetQuaChay('fpt_unit_record_results', { results: [{ case: 1, executedAt: '2026-10-28' }] }), true);
    assert.equal(ghiKetQuaChay('fpt_unit_update_function', { executedBy: 'Cuong' }), true);
    assert.equal(ghiKetQuaChay('fpt_it_record_round', { results: [{ case: 'AT01', round: 1, status: 'Passed' }] }), true);
    assert.equal(ghiKetQuaChay('fpt_it_update_cases', { cases: [{ case: 1, actual: 'OK' }] }), true);
    assert.equal(ghiKetQuaChay('test_run_record', { steps: [{ step: 1, status: 'PASS' }] }), true);
    assert.equal(LENH_GHI_KET_QUA.length, 6);
  });

  it('lời dặn model: không bịa, đưa hai lựa chọn trung thực', () => {
    assert.match(KHOI_KET_QUA_THAT, /never invent them/);
    assert.match(KHOI_KET_QUA_THAT, /result columns EMPTY/);
    assert.match(KHOI_KET_QUA_THAT, /AI Code \/ CuongMini CLI/);
  });
});

describe('A — agent thành viên KHÔNG đổi', async () => {
  const r = await import('./toolRegistry/index.js');

  it('BUILTIN không thấy lệnh xoá / personOnly / lệnh mới mở cho web', () => {
    const b = r.builtinCommands().map((t) => t.name);
    for (const n of ['fpt_unit_delete_cases', 'fpt_unit_update_rows', 'meeting_create', 'project_member_set_role', 'raid_delete', 'sprint_create']) assert.ok(!b.includes(n), n);
    for (const t of r.builtinCommands()) assert.ok(!t.destructive && !t.personOnly, t.name);
  });

  it('runForAgent từ chối lệnh không thuộc bộ BUILTIN (trước khi chạm DB)', async () => {
    const ctx = { userId: 1, agent: { id: 1 } as never, scopes: ['read', 'write'], tokenId: 1, signal: new AbortController().signal } as never;
    const out = await r.runForAgent(ctx, 'ws/SS', 'fpt_unit_delete_cases', { function: 1, cases: [1] });
    assert.equal(out.ok, false);
    assert.match(out.text, /Unknown command/);
  });

  it('runForPerson từ chối lệnh ngoài bộ web (tải URL, lệnh agent)', async () => {
    for (const n of ['gdoc_images', 'claim_issue', 'attach_from_url']) {
      await assert.rejects(r.runForPerson(1, 1, n, {}, 'read'), /Unknown command/);
    }
  });
});
