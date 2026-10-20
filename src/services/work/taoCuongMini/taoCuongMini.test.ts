/**
 * "Create with CuongMini" — test phần THUẦN: đọc danh sách thành viên (dán Excel/CSV/Markdown/XLSX, tên tiếng Việt +
 * MSSV), link repo/Google, lập sprint, giao việc theo trình độ, xếp lịch theo phụ thuộc, cảnh báo, ráp kế hoạch từ đầu ra
 * model, đọc JSON bị cắt, "nhờ CuongMini sửa", và đường gọi model (chính hãng ⇒ lùi modelapi) bằng phụ thuộc giả.
 *   npx tsx --test src/services/work/taoCuongMini/taoCuongMini.test.ts
 */

import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { XSheet, writeXlsx } from '../xlsxStyled.js';
import { detectDelimiter, parseLevel, parseRosterFile, parseRosterText } from './danhSach.js';
import { classifyLink, detectStack, normalizeLink, parseRepoUrl } from './lienKet.js';
import { assignItems, buildSprints, criticalPath, scheduleItems, workingDaysBetween } from './lapLich.js';
import { buildMembers, capItems, deriveKey, finalizeProject, itemsFromModel, milestonesFor, resolveProjects, uniqueKey } from './dungKeHoach.js';
import { epicOut, outlineOut, readJson, repairJson, reviseOut, understandingOut } from './nhacLenh.js';
import { setupInput, setupPlan, type PlanItem, type PlanMember, type PlanProject } from './kieu.js';
import { _datModelChoTest, goiModel } from './goiModel.js';

const input = (x: unknown = {}) => setupInput.parse(x);
const item = (o: Partial<PlanItem> & Pick<PlanItem, 'ref' | 'kind' | 'title'>): PlanItem => ({
  parentRef: null, description: '', criteria: [], points: 3, priority: 3, difficulty: 2, labels: [], component: '', area: '',
  assigneeRef: null, pairRef: null, sprintRef: null, milestoneRef: null, due: null, blockedBy: [], locked: false, ...o,
});
const member = (o: Partial<PlanMember> & Pick<PlanMember, 'ref' | 'name'>): PlanMember => ({
  studentId: '', email: '', role: '', skills: '', level: 3, hoursPerWeek: 8, prefs: '', projectRef: 'p1', leader: false,
  mapping: 'PLACEHOLDER', userId: null, why: '', ...o,
});

describe('danh sách thành viên', () => {
  it('dán từ Excel (tab) — tiêu đề tiếng Việt, MSSV, họ tên có dấu, trình độ chữ', () => {
    const text = [
      'STT\tHọ và tên\tMSSV\tEmail\tVai trò\tTrình độ\tGiờ/tuần',
      '1\tNguyễn Văn An\tSE183456\tan.nv@fpt.edu.vn\tLeader\tGiỏi\t10',
      '2\tTrần Thị Bích Ngọc\tse190123\tngoc@gmail.com\tBA\tKhá\t8',
      '3\tLê Hoàng Đức\tHE170001\t\tDev\tMới bắt đầu\t6 giờ',
    ].join('\n');
    const r = parseRosterText(text);
    assert.equal(r.headerFound, true);
    assert.equal(r.rows.length, 3);
    assert.deepEqual(r.rows.map((x) => x.name), ['Nguyễn Văn An', 'Trần Thị Bích Ngọc', 'Lê Hoàng Đức']);
    assert.deepEqual(r.rows.map((x) => x.studentId), ['SE183456', 'SE190123', 'HE170001']);
    assert.deepEqual(r.rows.map((x) => x.level), [4, 3, 1]);
    assert.deepEqual(r.rows.map((x) => x.hoursPerWeek), [10, 8, 6]);
    assert.equal(r.rows[2].email, '');
    assert.equal(r.rows[0].role, 'Leader');
  });

  it('CSV dấu chấm phẩy (Excel tiếng Việt) + cột Họ / Tên riêng + nhóm', () => {
    const r = parseRosterText('Họ;Tên;Mã SV;Nhóm\r\nNguyễn Thị;Mai;SE160001;1\r\nPhạm Quốc;Bảo;SE160002;2\r\n');
    assert.deepEqual(r.rows.map((x) => [x.name, x.studentId, x.group]), [['Nguyễn Thị Mai', 'SE160001', '1'], ['Phạm Quốc Bảo', 'SE160002', '2']]);
  });

  it('bảng Markdown + không trùng người', () => {
    const r = parseRosterText('| Name | Student ID | Email |\n|---|---|---|\n| Alice Nguyen | SE1 | a@x.io |\n| Alice Nguyen | SE1 | a@x.io |\n| Bob Tran | SE2 | b@x.io |');
    assert.equal(detectDelimiter(['| a | b |']), '|');
    assert.equal(r.rows.length, 2);
    assert.match(r.warnings.join(' '), /Duplicate/);
  });

  it('không tiêu đề ⇒ đoán theo nội dung ô', () => {
    const r = parseRosterText('Võ Minh Khoa, SE171234, khoa@fpt.edu.vn, Backend\nĐặng Thu Hà, SE171235, ha@fpt.edu.vn, Tester');
    assert.equal(r.headerFound, false);
    assert.deepEqual(r.rows.map((x) => [x.name, x.studentId, x.email, x.role]), [
      ['Võ Minh Khoa', 'SE171234', 'khoa@fpt.edu.vn', 'Backend'], ['Đặng Thu Hà', 'SE171235', 'ha@fpt.edu.vn', 'Tester'],
    ]);
  });

  it('tệp .xlsx (sheet có dòng tiêu đề lớn phía trên)', () => {
    const sh = new XSheet('Danh sách');
    sh.set(1, 1, 'DANH SÁCH NHÓM SWP391');
    ['STT', 'Họ tên', 'MSSV', 'Email', 'Kỹ năng'].forEach((h, i) => sh.set(3, i + 1, h));
    sh.set(4, 1, 1).set(4, 2, 'Bùi Thanh Tùng').set(4, 3, 'SE180777').set(4, 4, 'tung@fpt.edu.vn').set(4, 5, 'React, Node');
    sh.set(5, 1, 2).set(5, 2, 'Hồ Ngọc Ánh').set(5, 3, 'SE180778').set(5, 4, 'anh@fpt.edu.vn').set(5, 5, 'Java Spring');
    const r = parseRosterFile(writeXlsx([sh]), 'nhom.xlsx');
    assert.deepEqual(r.rows.map((x) => [x.name, x.studentId, x.skills]), [['Bùi Thanh Tùng', 'SE180777', 'React, Node'], ['Hồ Ngọc Ánh', 'SE180778', 'Java Spring']]);
  });

  it('trình độ: số, phân số, chữ Anh/Việt', () => {
    assert.equal(parseLevel('5'), 5);
    assert.equal(parseLevel('8/10'), 4);
    assert.equal(parseLevel('beginner'), 1);
    assert.equal(parseLevel('Trung bình'), 3);
    assert.equal(parseLevel('???'), null);
  });
});

describe('link', () => {
  it('repo GitHub/GitLab + nhánh', () => {
    assert.deepEqual(parseRepoUrl('https://github.com/acme/shop/tree/develop/src'), { provider: 'GITHUB', repo: 'acme/shop', branch: 'develop', webBase: 'https://github.com', apiBase: 'https://api.github.com', webUrl: 'https://github.com/acme/shop' });
    assert.equal(parseRepoUrl('git@github.com:acme/shop.git')?.repo, 'acme/shop');
    assert.equal(parseRepoUrl('github.com/acme/shop', 'main')?.branch, 'main');
    const gl = parseRepoUrl('https://gitlab.com/group/sub/proj/-/tree/feature-x');
    assert.equal(gl?.provider, 'GITLAB');
    assert.equal(gl?.repo, 'group/sub/proj');
    assert.equal(gl?.branch, 'feature-x');
    assert.equal(parseRepoUrl('https://github.com/orgs/acme'), null);
    assert.equal(parseRepoUrl('https://example.com/a/b'), null);
    assert.equal(parseRepoUrl('https://github.com/a/b', '../../etc')?.branch, null);
  });
  it('phân loại Google / web + chuẩn hoá', () => {
    assert.equal(classifyLink('https://docs.google.com/document/d/abc/edit'), 'gdoc');
    assert.equal(classifyLink('https://docs.google.com/spreadsheets/d/abc'), 'gsheet');
    assert.equal(classifyLink('https://drive.google.com/drive/folders/xyz'), 'gfolder');
    assert.equal(classifyLink('https://www.figma.com/file/abc'), 'figma');
    assert.equal(classifyLink('https://github.com/a/b'), 'repo');
    assert.equal(classifyLink('https://example.com'), 'web');
    assert.equal(normalizeLink('javascript:alert(1)'), null);
    assert.equal(normalizeLink('example.com/x'), 'https://example.com/x');
  });
  it('đoán stack từ cây + package.json/pom.xml', () => {
    const s = detectStack(['package.json', 'pom.xml', 'Dockerfile'], { 'package.json': JSON.stringify({ dependencies: { next: '1', react: '1' } }), 'pom.xml': '<artifactId>spring-boot-starter-web</artifactId>' });
    for (const x of ['Next.js', 'React', 'Spring Boot', 'Docker']) assert.ok(s.includes(x), x);
  });
});

describe('lập lịch + giao việc', () => {
  const tl = (x: Record<string, unknown>) => input({ timeline: x }).timeline;

  it('sprint tới hạn chót; tuần thi bị bỏ; đuôi ngắn gộp vào sprint cuối', () => {
    const s = buildSprints(tl({ startDate: '2026-09-07', endDate: '2026-11-15', sprintWeeks: 2, avoid: [{ name: 'Thi giữa kỳ', from: '2026-10-05', to: '2026-10-18' }] }), '2026-09-01');
    assert.equal(s[0].start, '2026-09-07');
    assert.equal(s.at(-1)!.end, '2026-11-15');
    assert.ok(!s.some((x) => x.start === '2026-10-05'), 'không có sprint trọn trong tuần thi');
    assert.ok(s.every((x) => x.factor > 0));
    assert.equal(workingDaysBetween('2026-10-05', '2026-10-11', [1, 2, 3, 4, 5]), 5);
  });

  it('thiếu ngày ⇒ thứ Hai tới + 10 tuần', () => {
    const s = buildSprints(tl({}), '2026-10-20'); // thứ Ba
    assert.equal(s[0].start, '2026-10-26');
    assert.equal(s.length, 5);
  });

  it('việc khó ⇒ người mạnh; người mới không ôm việc khó một mình (ghép cặp)', () => {
    const ms = [member({ ref: 'a', name: 'Strong', level: 5, hoursPerWeek: 10 }), member({ ref: 'b', name: 'Mid', level: 3 }), member({ ref: 'c', name: 'New', level: 1, hoursPerWeek: 10 })];
    const items = [item({ ref: 'h1', kind: 'STORY', title: 'Hard', difficulty: 3, points: 8 }), item({ ref: 'e1', kind: 'STORY', title: 'Easy', difficulty: 1, points: 2 })];
    assignItems(items, ms, ['BY_LEVEL']);
    assert.equal(items[0].assigneeRef, 'a');
    // Chỉ có người mới ⇒ vẫn giao nhưng có cặp.
    const solo = [member({ ref: 'n', name: 'New', level: 1 }), member({ ref: 'm', name: 'Mid', level: 3 })];
    const hard = [item({ ref: 'x', kind: 'STORY', title: 'X', difficulty: 3, points: 3 }), item({ ref: 'y', kind: 'STORY', title: 'Y', difficulty: 3, points: 3 }), item({ ref: 'z', kind: 'STORY', title: 'Z', difficulty: 3, points: 3 })];
    assignItems(hard, solo, ['EQUAL_LOAD']);
    for (const h of hard) if (h.assigneeRef === 'n') assert.equal(h.pairRef, 'm');
    assert.ok(hard.some((h) => h.assigneeRef === 'n'), 'chia đều ⇒ người mới cũng nhận việc');
  });

  it('chủ mô-đun giữ các con của epic; việc con theo cha', () => {
    const ms = [member({ ref: 'a', name: 'FE dev', skills: 'React', prefs: 'frontend' }), member({ ref: 'b', name: 'BE dev', skills: 'Java Spring', prefs: 'backend' })];
    const items = [
      item({ ref: 'E1', kind: 'EPIC', title: 'UI', area: 'fe' }), item({ ref: 'E2', kind: 'EPIC', title: 'API', area: 'be' }),
      item({ ref: 's1', kind: 'STORY', title: 'Page', parentRef: 'E1', area: 'fe' }), item({ ref: 's2', kind: 'STORY', title: 'Endpoint', parentRef: 'E2', area: 'be' }),
      item({ ref: 't1', kind: 'SUBTASK', title: 'Sub', parentRef: 's2', points: null }),
    ];
    assignItems(items, ms, ['MODULE_OWNER']);
    assert.equal(items.find((i) => i.ref === 'E1')!.assigneeRef, 'a');
    assert.equal(items.find((i) => i.ref === 's1')!.assigneeRef, 'a');
    assert.equal(items.find((i) => i.ref === 's2')!.assigneeRef, 'b');
    assert.equal(items.find((i) => i.ref === 't1')!.assigneeRef, 'b');
  });

  it('xếp sprint theo phụ thuộc + sức người; tràn ⇒ sprint cuối + cảnh báo', () => {
    const sprints = [
      { ref: 's1', name: 'Sprint 1', goal: '', start: '2026-09-07', end: '2026-09-20', factor: 1 },
      { ref: 's2', name: 'Sprint 2', goal: '', start: '2026-09-21', end: '2026-10-04', factor: 1 },
    ];
    const ms = [member({ ref: 'a', name: 'A', hoursPerWeek: 8 })]; // 4 điểm/sprint
    const items = [item({ ref: 'x', kind: 'STORY', title: 'X', points: 3, assigneeRef: 'a' }), item({ ref: 'y', kind: 'STORY', title: 'Y', points: 3, assigneeRef: 'a', blockedBy: ['x'] }), item({ ref: 'z', kind: 'STORY', title: 'Z', points: 5, assigneeRef: 'a' })];
    const r = scheduleItems({ items, milestones: [{ ref: 'v1', name: 'Demo', date: '2026-09-25', description: '' }], type: 'SCRUM' }, sprints, ms, [], 2);
    const sx = items.find((i) => i.ref === 'x')!;
    const sy = items.find((i) => i.ref === 'y')!;
    assert.equal(sx.sprintRef, 's1');
    assert.notEqual(sy.sprintRef, null);
    assert.ok(sy.sprintRef! >= sx.sprintRef!, 'bị chặn ⇒ không sớm hơn thẻ chặn');
    assert.equal(sx.due, '2026-09-20');
    assert.equal(sx.milestoneRef, 'v1');
    assert.ok(r.overflow.length >= 1, 'quá sức ⇒ tràn');
    assert.deepEqual(criticalPath(items).refs, ['x', 'y']);
  });

  it('thẻ onboarding luôn ở sprint đầu; trưởng nhóm quá tải ⇒ việc khó vẫn có cặp', () => {
    const sprints = [
      { ref: 's1', name: 'Sprint 1', goal: '', start: '2026-09-07', end: '2026-09-20', factor: 1 },
      { ref: 's2', name: 'Sprint 2', goal: '', start: '2026-09-21', end: '2026-10-04', factor: 1 },
    ];
    const ms = [member({ ref: 'a', name: 'Lead', level: 5, hoursPerWeek: 2, leader: true }), member({ ref: 'b', name: 'New', level: 1, hoursPerWeek: 20 })];
    const items = [
      item({ ref: 'big', kind: 'STORY', title: 'Big', points: 8, assigneeRef: 'a', locked: true, sprintRef: 's1' }),
      item({ ref: 'ob', kind: 'TASK', title: 'Onboarding', points: 1, assigneeRef: 'a', labels: ['onboarding'] }),
      item({ ref: 'E', kind: 'EPIC', title: 'E' }),
      item({ ref: 'k1', kind: 'STORY', title: 'k1', parentRef: 'E', points: 5, difficulty: 1 }),
      item({ ref: 'k2', kind: 'STORY', title: 'k2', parentRef: 'E', points: 3, difficulty: 3 }),
    ];
    assignItems(items, ms, ['BY_LEVEL', 'LEADER_REVIEWS']);
    scheduleItems({ items, milestones: [], type: 'SCRUM' }, sprints, ms, ['BY_LEVEL', 'LEADER_REVIEWS'], 2);
    assert.equal(items.find((i) => i.ref === 'ob')!.sprintRef, 's1');
    const k2 = items.find((i) => i.ref === 'k2')!;
    assert.ok(k2.assigneeRef === 'a' || k2.pairRef === 'a', 'việc khó: người mạnh làm, hoặc người mới làm CÓ cặp người mạnh');
  });

  it('finalizeProject: cảnh báo quá tải, người mới việc khó, thiếu hạn chót', () => {
    const inp = input({ timeline: { startDate: '2026-09-07', sprintWeeks: 2 }, team: { rules: ['EQUAL_LOAD'] } });
    const p: PlanProject = setupPlan.parse({ projects: [{ ref: 'p1', name: 'P', key: 'PP', items: [
      item({ ref: 'a1', kind: 'STORY', title: 'Big', points: 40, assigneeRef: 'm1', locked: true }),
      item({ ref: 'a2', kind: 'STORY', title: 'Hard', difficulty: 3, points: 5, assigneeRef: 'm2', locked: true }),
    ] }] }).projects[0];
    const ms = [member({ ref: 'm1', name: 'Overloaded', hoursPerWeek: 2 }), member({ ref: 'm2', name: 'Newbie', level: 1 })];
    const w = finalizeProject(p, ms, inp, '2026-09-01');
    const kinds = w.map((x) => x.kind);
    for (const k of ['OVERLOAD', 'BEGINNER_HARD', 'MISSING_INFO']) assert.ok(kinds.includes(k as never), k);
  });
});

describe('ráp kế hoạch', () => {
  it('mã dự án: bỏ dấu, không trùng', () => {
    assert.equal(deriveKey('Đồ án Nhà trọ'), 'DANT');
    assert.equal(deriveKey('Website'), 'WEB');
    const taken = new Set(['SWP']);
    assert.equal(uniqueKey('SWP', taken), 'SWP2');
    assert.equal(uniqueKey('SWP', taken), 'SWP3');
  });

  it('chế độ không gian: nhóm theo cột "nhóm"; ghép tài khoản trong không gian theo email', () => {
    const inp = input({ overview: { courseCode: 'SWP391' }, team: { members: [
      { name: 'An', group: '1', email: 'an@x.io' }, { name: 'Bình', group: '1', role: 'Leader' }, { name: 'Chi', group: '2' }, { name: 'Dũng' },
    ] } });
    const { projects, warnings } = resolveProjects(inp, ['SN1'], 'WORKSPACE');
    assert.equal(projects.length, 2);
    assert.equal(projects[0].name, 'SWP391 1');
    assert.notEqual(projects[0].key, 'SN1');
    assert.deepEqual(projects[0].rows.map((r) => r.name), ['An', 'Bình']);
    assert.match(warnings[0].message, /không khớp nhóm/);
    const ms = buildMembers(projects, null, [{ id: 7, email: 'AN@x.io', username: 'an', fullName: null, displayName: null }], true);
    assert.equal(ms[0].mapping, 'USER');
    assert.equal(ms[0].userId, 7);
    assert.equal(ms.find((m) => m.name === 'Bình')!.leader, true);
    assert.equal(ms.find((m) => m.name === 'Chi')!.mapping, 'PLACEHOLDER');
  });

  it('khung + epic ⇒ thẻ; phụ thuộc giữa epic; việc con; trần thẻ', () => {
    const outline = outlineOut.parse({ epics: [{ key: 'E1', title: 'Auth' }, { key: 'E2', title: 'Orders', dependsOn: ['E1'] }] });
    const e1 = epicOut.parse({ items: [{ key: 'E1-1', title: 'Login', points: 3, subtasks: ['UI', { title: 'API' }] }, { key: 'E1-2', title: 'Logout', blockedBy: ['E1-1'] }] });
    const e2 = epicOut.parse({ items: [{ key: 'E2-1', title: 'Cart', kind: 'story' }] });
    const { items, keyMap } = itemsFromModel(outline, [{ key: 'E1', out: e1 }, { key: 'E2', out: e2 }], 'SUBTASKS');
    assert.equal(items.filter((i) => i.kind === 'EPIC').length, 2);
    assert.equal(items.filter((i) => i.kind === 'SUBTASK').length, 2);
    const logout = items.find((i) => i.title === 'Logout')!;
    assert.deepEqual(logout.blockedBy, [keyMap.get('E1-1')]);
    assert.deepEqual(items.find((i) => i.title === 'Cart')!.blockedBy, [logout.ref]);
    const capped = capItems(items, 4);
    assert.equal(capped.items.length, 4);
    assert.equal(capped.items.filter((i) => i.kind === 'SUBTASK').length, 0, 'việc con bị bỏ trước');
  });

  it('mốc từ form + hạn deliverable (DD/MM/YYYY)', () => {
    const inp = input({ timeline: { milestones: [{ name: 'Report 1', date: '2026-09-20' }] } });
    const ms = milestonesFor(inp, { deliverables: [{ name: 'Final demo', due: '15/11/2026', criteria: '' }] } as never, '2026-11-20');
    assert.deepEqual(ms.map((m) => [m.name, m.date]), [['Report 1', '2026-09-20'], ['Final demo', '2026-11-15'], ['Final delivery', '2026-11-20']]);
  });
});

describe('đầu ra model', () => {
  it('JSON bị cắt giữa chừng ⇒ giữ phần đã viết xong', () => {
    const cut = '```json\n{"items":[{"key":"E1-1","title":"A","points":3},{"key":"E1-2","title":"B","crit';
    assert.ok(repairJson(cut));
    const r = readJson(cut, epicOut)!;
    assert.equal(r.items[0].title, 'A');
    assert.ok(r.items.length >= 1);
  });
  it('kiểu sai ⇒ mặc định, không vứt cả lượt', () => {
    const u = readJson('{"goal":"Build","team":[{"name":"An","proposedRole":"Dev"}],"questions":["Deadline?"],"scopeIn":"one"}', understandingOut)!;
    assert.equal(u.goal, 'Build');
    assert.deepEqual(u.scopeIn, ['one']);
    assert.equal(u.questions[0].q, 'Deadline?');
    const e = epicOut.parse({ items: [{ title: 'X', points: 'abc', priority: 99, difficulty: 0, kind: 'weird' }] });
    assert.equal(e.items[0].points, null);
    assert.equal(e.items[0].priority, 5);
    assert.equal(e.items[0].difficulty, 1);
    assert.equal(e.items[0].kind, 'STORY');
  });
  it('lệnh sửa của model đọc được', () => {
    const r = reviseOut.parse({ note: 'ok', ops: [{ op: 'UPDATE', ref: 'P:i1', set: { points: 5 } }, { op: 'remove', ref: 'P:i2' }, { op: 'add', item: { title: 'New', parentRef: 'P:i1' } }] });
    assert.deepEqual(r.ops.map((o) => o.op), ['update', 'remove', 'add']);
  });
});

describe('gọi model: chính hãng ⇒ tự lùi modelapi', () => {
  afterEach(() => _datModelChoTest(null));
  const base = {
    coKey: async () => true, congHong: () => false, baoHong: () => undefined, hanMuc: async () => ({ het: false }),
    moKhoaCao: async () => false, khoaDaBat: async () => true, laAdmin: async () => false, kiemDuPhong: async () => undefined,
    duPhong: async () => ({ text: '{"ok":1}', model: 'gpt-6-sol', inputTokens: 100, outputTokens: 50 }),
  };
  const call = (modelId: 'cm-sonic' | 'cm-optimum', ve?: string) => goiModel({ userId: 1, modelId, ve, step: 's', system: 'x', user: 'y', maxTokens: 100 });

  it('Sonic chạy cổng chính hãng khi đủ điều kiện', async () => {
    let seen = '';
    _datModelChoTest({ ...base, chinhHang: async (o) => { seen = o.model; return { text: '{"a":1}', biCat: false, usd: 0.01 }; } });
    const r = await call('cm-sonic');
    assert.equal(r.call.path, 'chinh_hang');
    assert.equal(seen, 'claude-sonnet-5-5');
    assert.equal(r.call.model, 'cm-sonic', 'sổ chỉ mang tên CuongMini');
  });
  it('cổng chính hãng lỗi ⇒ lùi gpt-6-sol, đánh dấu cổng hỏng', async () => {
    let hong = 0;
    _datModelChoTest({ ...base, baoHong: () => { hong += 1; }, chinhHang: async () => { throw new Error('HTTP 529'); } });
    const r = await call('cm-sonic');
    assert.equal(r.call.path, 'modelapi');
    assert.equal(hong, 1);
    assert.ok(r.call.usd > 0);
  });
  it('hết hạn mức Sonic / không có key ⇒ đi thẳng modelapi, không thử chính hãng', async () => {
    let tried = false;
    _datModelChoTest({ ...base, hanMuc: async () => ({ het: true }), chinhHang: async () => { tried = true; return { text: 'x', biCat: false, usd: 0 }; } });
    assert.equal((await call('cm-sonic')).call.path, 'modelapi');
    _datModelChoTest({ ...base, coKey: async () => false, chinhHang: async () => { tried = true; return { text: 'x', biCat: false, usd: 0 }; } });
    assert.equal((await call('cm-sonic')).call.path, 'modelapi');
    assert.equal(tried, false);
  });
  it('Optimum: chưa có vé ⇒ WORK_SETUP_KEY_REQUIRED (không âm thầm hạ model); có vé ⇒ Opus', async () => {
    let seen = '';
    _datModelChoTest({ ...base, chinhHang: async (o) => { seen = o.model; return { text: '{}', biCat: false, usd: 0.2 }; } });
    await assert.rejects(call('cm-optimum'), (e: { code?: string }) => e.code === 'WORK_SETUP_KEY_REQUIRED');
    _datModelChoTest({ ...base, moKhoaCao: async (_u, ve) => ve === 'good', chinhHang: async (o) => { seen = o.model; return { text: '{}', biCat: false, usd: 0.2 }; } });
    await call('cm-optimum', 'good');
    assert.equal(seen, 'claude-opus-5-5');
    _datModelChoTest({ ...base, khoaDaBat: async () => false });
    await assert.rejects(call('cm-optimum', 'good'), (e: { code?: string }) => e.code === 'WORK_SETUP_MODEL_UNAVAILABLE');
    _datModelChoTest({ ...base, laAdmin: async () => true, hanMuc: async () => ({ het: true, message: 'limit' }) });
    await assert.rejects(call('cm-optimum'), (e: { code?: string }) => e.code === 'WORK_SETUP_MODEL_LIMIT');
  });
});

it('lỗi mạng thoáng qua ở cổng dự phòng ⇒ tự thử lại (terminated, 5xx); lỗi khác ném ngay', async () => {
  const gm = await import('./goiModel.js');
  assert.equal(gm.laLoiThoangQua(new Error('terminated')), true);
  assert.equal(gm.laLoiThoangQua(Object.assign(new Error('x'), { status: 503 })), true);
  assert.equal(gm.laLoiThoangQua(Object.assign(new Error('Bad request'), { status: 400 })), false);
  let lan = 0;
  gm._datModelChoTest({
    coKey: async () => false, congHong: () => false, kiemDuPhong: async () => undefined, hanMuc: async () => ({ het: false }),
    duPhong: async () => { lan++; if (lan === 1) throw new Error('terminated'); return { text: '{"ok":1}', model: 'gpt-6-sol', inputTokens: 1, outputTokens: 1 }; },
  });
  try {
    const r = await gm.goiModel({ userId: 1, modelId: 'cm-sonic', step: 't', system: 's', user: 'u', maxTokens: 100 });
    assert.equal(r.text, '{"ok":1}');
    assert.equal(lan, 2);
  } finally { gm._datModelChoTest(null); }
});
