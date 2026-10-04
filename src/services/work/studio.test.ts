/**
 * Lớp studio đợt S1 — luật THUẦN (không DB): loại dự án, mô-đun, quyền phê
 * duyệt/bàn giao/hàng đợi, kết quả phê duyệt, chữ ký nội dung, thứ tự giai
 * đoạn, luật luồng chuyển, JQL `team`/`stage`, ghép trạng thái khi chuyển dự án.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { ProjectRole } from './constants.js';
import { compileJql, parseJql, type JqlContext } from './jql.js';
import {
  actionableSteps, canAssignTeamIssue, canCancelApproval, canCancelHandoff, canDecideApprovalStep, canDecideHandoff,
} from './permissions.js';
import {
  approvalOutcome, assertModule, contentHash, defaultModulesFor, kindFromTemplate, mergeModules, moduleOn, modulesOf,
  projectKindOf, stableStringify, stageActivationBlocker, transitionRulesOf,
} from './studio.js';
import { mapStatus } from './issueMove.service.js';

describe('loại dự án', () => {
  it('dự án cũ (kind NULL) suy từ mẫu; phiếu khách ⇒ CLIENT; cột kind thắng', () => {
    assert.equal(kindFromTemplate('SWP391'), 'SCHOOL');
    assert.equal(kindFromTemplate('SWR302'), 'SCHOOL');
    assert.equal(kindFromTemplate('SWT301'), 'SCHOOL');
    assert.equal(kindFromTemplate('FREELANCE'), 'CLIENT');
    assert.equal(kindFromTemplate('COMPANY'), 'SOFTWARE');
    assert.equal(kindFromTemplate('BLANK'), 'SOFTWARE');
    assert.equal(projectKindOf({ kind: null, template: 'COMPANY', fromClientRequest: true }), 'CLIENT');
    assert.equal(projectKindOf({ kind: 'PERSONAL', template: 'SWP391' }), 'PERSONAL');
    assert.equal(projectKindOf({ kind: 'NONSENSE', template: 'SWP391' }), 'SCHOOL');
  });
});

describe('mô-đun', () => {
  it('dự án CŨ (settings không có modules) ⇒ mọi mô-đun TẮT', () => {
    for (const settings of [{}, null, undefined, { estimation: 'POINTS' }, { modules: 'yes' }, { modules: { teams: 'true' } }]) {
      const m = modulesOf(settings);
      assert.ok(Object.values(m).every((v) => v === false), JSON.stringify(settings));
      assert.equal(moduleOn({ settings }, 'teams'), false);
    }
  });
  it('mặc định theo loại: CLIENT bật 4 mô-đun đợt S1 + docs (S2a) + clientPortal (S2b) + CR/RAID/họp (S3b) + finance/reports (S4)', () => {
    const c = defaultModulesFor('CLIENT');
    assert.deepEqual([c.teams, c.stages, c.approvals, c.handoffs, c.docs, c.clientPortal], [true, true, true, true, true, true]);
    assert.deepEqual([c.changeRequests, c.raid, c.meetings, c.finance, c.reports], [true, true, true, true, true]);
    for (const k of ['SCHOOL', 'SOFTWARE', 'PERSONAL'] as const) {
      assert.ok(Object.values(defaultModulesFor(k)).every((v) => v === false), k);
    }
  });
  it('mergeModules chỉ nhận khoá biết + giá trị boolean', () => {
    const m = mergeModules(defaultModulesFor('SCHOOL'), { teams: true, hacker: true, stages: 'yes' as unknown as boolean });
    assert.equal(m.teams, true);
    assert.equal(m.stages, false);
    assert.equal((m as Record<string, boolean>).hacker, undefined);
  });
  it('assertModule ⇒ 403 MODULE_DISABLED kèm tên mô-đun', () => {
    assert.throws(() => assertModule({ settings: {} }, 'stages'), (e: any) => e.statusCode === 403 && e.code === 'MODULE_DISABLED' && e.data.module === 'stages');
    assert.doesNotThrow(() => assertModule({ settings: { modules: { stages: true } } }, 'stages'));
  });
});

describe('phê duyệt — ai quyết được bước nào', () => {
  const steps = [
    { id: 1, approverId: 10, position: 0, decision: 'PENDING' },
    { id: 2, approverId: 20, position: 1, decision: 'PENDING' },
  ];
  const seq = { status: 'PENDING', mode: 'SEQUENTIAL', steps };
  const par = { status: 'PENDING', mode: 'PARALLEL', steps };

  it('tuần tự: chỉ người đầu tiên còn chờ; song song: mọi người', () => {
    assert.deepEqual(actionableSteps('SEQUENTIAL', steps).map((s) => s.id), [1]);
    assert.deepEqual(actionableSteps('PARALLEL', steps).map((s) => s.id), [1, 2]);
    assert.equal(canDecideApprovalStep('MEMBER', 10, seq, 1), true);
    assert.equal(canDecideApprovalStep('MEMBER', 20, seq, 2), false, 'chưa tới lượt');
    assert.equal(canDecideApprovalStep('MEMBER', 20, par, 2), true);
    const after = { ...seq, steps: [{ ...steps[0], decision: 'APPROVED' }, steps[1]] };
    assert.equal(canDecideApprovalStep('MEMBER', 20, after, 2), true, 'người trước đã duyệt ⇒ tới lượt');
  });
  it('KHÔNG ai quyết thay người khác — kể cả ADMIN, CLIENT, GUEST', () => {
    for (const role of ['ADMIN', 'MEMBER', 'CLIENT', 'TEACHER'] as ProjectRole[]) {
      assert.equal(canDecideApprovalStep(role, 99, par, 1), false, role);
    }
  });
  it('CLIENT/TEACHER quyết được bước của CHÍNH mình; VIEWER/người ngoài thì không', () => {
    assert.equal(canDecideApprovalStep('CLIENT', 10, par, 1), true);
    assert.equal(canDecideApprovalStep('TEACHER', 20, par, 2), true);
    assert.equal(canDecideApprovalStep('VIEWER', 10, par, 1), false);
    assert.equal(canDecideApprovalStep(null, 10, par, 1), false);
  });
  it('yêu cầu đã xong/huỷ thì không quyết nữa', () => {
    assert.equal(canDecideApprovalStep('MEMBER', 10, { ...par, status: 'CANCELLED' }, 1), false);
  });
  it('huỷ: người tạo (còn quyền tạo) hoặc ADMIN', () => {
    assert.equal(canCancelApproval('MEMBER', 5, 5), true);
    assert.equal(canCancelApproval('MEMBER', 5, 6), false);
    assert.equal(canCancelApproval('ADMIN', 5, 6), true);
    assert.equal(canCancelApproval('CLIENT', 5, 5), false, 'khách không tạo được nên không huỷ được');
  });
  it('kết quả: một phiếu chống là REJECTED; đủ phiếu thuận là APPROVED', () => {
    assert.equal(approvalOutcome([{ decision: 'APPROVED' }, { decision: 'PENDING' }]), 'PENDING');
    assert.equal(approvalOutcome([{ decision: 'APPROVED' }, { decision: 'REJECTED' }]), 'REJECTED');
    assert.equal(approvalOutcome([{ decision: 'APPROVED' }, { decision: 'APPROVED' }]), 'APPROVED');
    assert.equal(approvalOutcome([]), 'PENDING');
  });
});

describe('chữ ký nội dung (SHA-256)', () => {
  it('cùng nội dung — khác thứ tự khoá ⇒ cùng hash; đổi một chữ ⇒ khác hash', () => {
    const a = { title: 'Login', description: 'x', fields: [{ fieldId: 1, value: 'must' }] };
    const b = { fields: [{ value: 'must', fieldId: 1 }], description: 'x', title: 'Login' };
    assert.equal(stableStringify(a), stableStringify(b));
    assert.equal(contentHash(a), contentHash(b));
    assert.match(contentHash(a), /^[0-9a-f]{64}$/);
    assert.notEqual(contentHash(a), contentHash({ ...a, title: 'Login!' }));
  });
});

describe('bàn giao + hàng đợi bộ phận', () => {
  it('người nhận đích danh / trưởng bộ phận nhận / ADMIN quyết được; khách/thầy/viewer thì không', () => {
    const h = { toUserId: 7, toTeamLeadIds: [8] };
    assert.equal(canDecideHandoff('MEMBER', 7, h), true);
    assert.equal(canDecideHandoff('MEMBER', 8, h), true);
    assert.equal(canDecideHandoff('MEMBER', 9, h), false);
    assert.equal(canDecideHandoff('ADMIN', 9, h), true);
    assert.equal(canDecideHandoff('CLIENT', 7, h), false);
    assert.equal(canDecideHandoff('VIEWER', 8, h), false);
  });
  it('huỷ bàn giao: người gửi hoặc ADMIN', () => {
    assert.equal(canCancelHandoff('MEMBER', 3, 3), true);
    assert.equal(canCancelHandoff('MEMBER', 3, 4), false);
    assert.equal(canCancelHandoff('ADMIN', 3, 4), true);
  });
  it('giao việc từ hàng đợi: người sửa thẻ, hoặc trưởng bộ phận (kể cả VIEWER) — không bao giờ khách/thầy', () => {
    assert.equal(canAssignTeamIssue('MEMBER', false), true);
    assert.equal(canAssignTeamIssue('VIEWER', false), false);
    assert.equal(canAssignTeamIssue('VIEWER', true), true);
    assert.equal(canAssignTeamIssue('CLIENT', true), false);
    assert.equal(canAssignTeamIssue('TEACHER', true), false);
    assert.equal(canAssignTeamIssue(null, true), false);
  });
});

describe('giai đoạn — thứ tự', () => {
  const stages = [
    { id: 1, n: 0, status: 'DONE' },
    { id: 2, n: 1, status: 'GATE_REVIEW' },
    { id: 3, n: 2, status: 'NOT_STARTED' },
  ];
  it('giai đoạn trước chưa DONE ⇒ chặn, trả đúng giai đoạn đang chặn', () => {
    assert.equal(stageActivationBlocker(stages, 2), null);
    assert.equal(stageActivationBlocker(stages, 3)?.id, 2);
    assert.equal(stageActivationBlocker(stages.map((s) => ({ ...s, status: 'DONE' })), 3), null);
  });
});

describe('luật luồng chuyển (WorkTransition.rules)', () => {
  it('chuẩn hoá, bỏ giá trị rác', () => {
    assert.deepEqual(transitionRulesOf({}), {});
    assert.deepEqual(transitionRulesOf(null), {});
    assert.deepEqual(transitionRulesOf({ requireApproval: 'yes', teamIds: ['1', -2, 3, 3] }), { teamIds: [3] });
    assert.deepEqual(transitionRulesOf({ requireApproval: true, teamIds: [] }), { requireApproval: true });
  });
});

describe('JQL — team, stage', () => {
  const ctx: JqlContext = {
    projectKey: 'YC', userId: 1, statuses: [], types: [], labels: [], components: [], members: [], sprints: [], customFields: [],
    teams: [{ id: 5, key: 'BA', name: 'Business Analysis (BA)' }, { id: 6, key: 'DEV', name: 'Engineering' }],
    stages: [{ id: 40, n: 0, slug: 'tiep-nhan', name: 'Intake' }, { id: 41, n: 1, slug: 'khao-sat', name: 'Discovery' }],
  };
  const w = (q: string) => compileJql(parseJql(q), ctx).where;
  it('team khớp mã hoặc tên; IN; IS EMPTY; !=', () => {
    assert.deepEqual(w('team = BA'), { teamId: { in: [5] } });
    assert.deepEqual(w('team = "Engineering"'), { teamId: { in: [6] } });
    assert.deepEqual(w('team IN (ba, dev)'), { teamId: { in: [5, 6] } });
    assert.deepEqual(w('team IS EMPTY'), { teamId: null });
    assert.deepEqual(w('team != BA'), { NOT: { teamId: { in: [5] } } });
    assert.throws(() => w('team = QA'), /No team "QA"/);
  });
  it('stage khớp slug, tên hoặc số thứ tự', () => {
    assert.deepEqual(w('stage = khao-sat'), { stageId: { in: [41] } });
    assert.deepEqual(w('stage = Intake'), { stageId: { in: [40] } });
    assert.deepEqual(w('stage = 1'), { stageId: { in: [41] } });
  });
  it('dự án không có bộ phận (ngữ cảnh cũ) ⇒ báo lỗi rõ, không sập', () => {
    const old: JqlContext = { ...ctx, teams: undefined };
    assert.throws(() => compileJql(parseJql('team = BA'), old), /No team "BA"/);
  });
});

describe('chuyển dự án — ghép trạng thái', () => {
  const target = [
    { id: 1, name: 'Backlog', category: 'TODO', position: 0 },
    { id: 2, name: 'Doing', category: 'IN_PROGRESS', position: 1 },
    { id: 3, name: 'In Review', category: 'IN_PROGRESS', position: 2 },
    { id: 4, name: 'Done', category: 'DONE', position: 3 },
  ];
  it('trùng tên (không phân biệt hoa thường) ⇒ giữ; không thì đầu tiên cùng nhóm', () => {
    assert.equal(mapStatus({ name: 'in review', category: 'IN_PROGRESS' }, target)?.id, 3);
    assert.equal(mapStatus({ name: 'QA', category: 'IN_PROGRESS' }, target)?.id, 2);
    assert.equal(mapStatus({ name: 'Closed', category: 'DONE' }, target)?.id, 4);
    assert.equal(mapStatus({ name: 'X', category: 'WEIRD' }, target)?.id, 1);
    assert.equal(mapStatus({ name: 'X', category: 'TODO' }, []), null);
  });
});
