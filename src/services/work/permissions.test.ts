import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { ProjectRole, WorkspaceRole } from './constants.js';
import {
  can, canDeleteIssue, canModifyComment, canWorkspace, effectiveProjectRole, projectOptionsOf, type ProjectAction,
} from './permissions.js';

describe('vai trò hiệu lực trong dự án', () => {
  const cases: Array<[WorkspaceRole | null, ProjectRole | null, 'WORKSPACE' | 'PRIVATE', ProjectRole | null, string]> = [
    [null, 'ADMIN', 'WORKSPACE', null, 'rời không gian là mất hết, kể cả còn sót dòng dự án'],
    ['OWNER', null, 'PRIVATE', 'ADMIN', 'chủ không gian luôn là ADMIN, kể cả dự án riêng'],
    ['ADMIN', 'VIEWER', 'WORKSPACE', 'ADMIN', 'quản trị không gian không bị hạ quyền bởi dòng dự án'],
    ['MEMBER', null, 'WORKSPACE', 'MEMBER', 'dự án mở cho không gian'],
    ['MEMBER', null, 'PRIVATE', null, 'dự án riêng, không có tên'],
    ['MEMBER', 'VIEWER', 'WORKSPACE', 'VIEWER', 'dòng dự án thắng mặc định'],
    ['GUEST', null, 'WORKSPACE', null, 'khách không thấy dự án chưa được thêm tên'],
    ['GUEST', 'TEACHER', 'PRIVATE', 'TEACHER', 'giảng viên được thêm vào dự án riêng'],
    ['GUEST', 'CLIENT', 'WORKSPACE', 'CLIENT', 'khách hàng'],
  ];
  for (const [ws, pr, vis, want, why] of cases) {
    it(why, () => {
      assert.equal(effectiveProjectRole({ workspaceRole: ws, projectRole: pr, visibility: vis }), want);
    });
  }
});

describe('bảng quyền dự án', () => {
  // Hàng = hành động; cột theo thứ tự ADMIN, MEMBER, VIEWER, TEACHER, CLIENT.
  // Viết lại bằng tay (không đọc từ MATRIX) để test bắt được khi ai đó sửa nhầm bảng.
  const roles: ProjectRole[] = ['ADMIN', 'MEMBER', 'VIEWER', 'TEACHER', 'CLIENT'];
  const expected: Record<ProjectAction, [boolean, boolean, boolean, boolean, boolean]> = {
    'project.view':     [true,  true,  true,  true,  true ],
    'project.settings': [true,  false, false, false, false],
    'project.members':  [true,  false, false, false, false],
    'project.delete':   [true,  false, false, false, false],
    'issue.create':     [true,  true,  false, false, true ],
    'issue.edit':       [true,  true,  false, false, false],
    'issue.transition': [true,  true,  false, false, false],
    'issue.delete':     [true,  false, false, false, false],
    'comment.create':   [true,  true,  false, true,  true ],
    'comment.moderate': [true,  false, false, false, false],
    'attachment.add':   [true,  true,  false, false, true ],
    'sprint.manage':    [true,  false, false, false, false],
    'ai.use':           [true,  true,  false, false, false],
    // Lớp studio (đợt S1)
    'studio.configure':  [true,  false, false, false, false],
    'stage.manage':      [true,  false, false, false, false],
    'stage.requestGate': [true,  true,  false, false, false],
    'approval.create':   [true,  true,  false, false, false],
    'approval.decide':   [true,  true,  false, true,  true ],
    'approval.manage':   [true,  false, false, false, false],
    'handoff.create':    [true,  true,  false, false, false],
    'handoff.manage':    [true,  false, false, false, false],
    // Tài liệu dự án (đợt S2a) — CLIENT/GUEST còn bị siết thêm ở docAccess (pages.test.ts)
    'page.edit':         [true,  true,  false, false, false],
    'page.manage':       [true,  false, false, false, false],
  };
  for (const [action, row] of Object.entries(expected) as Array<[ProjectAction, boolean[]]>) {
    it(action, () => {
      roles.forEach((r, i) => assert.equal(can(r, action), row[i], `${r} → ${action}`));
      assert.equal(can(null, action), false, 'người ngoài không làm được gì');
    });
  }

  it('VIEWER chỉ xem, không một quyền ghi nào', () => {
    const writes = (Object.keys(expected) as ProjectAction[]).filter((a) => a !== 'project.view');
    for (const a of writes) assert.equal(can('VIEWER', a), false, a);
  });
});

describe('tuỳ chọn "Allow members to manage sprints"', () => {
  it('bật ⇒ MEMBER quản lý được sprint; vai trò khác không đổi', () => {
    const on = projectOptionsOf({ membersManageSprints: true });
    assert.equal(can('MEMBER', 'sprint.manage', on), true);
    assert.equal(can('VIEWER', 'sprint.manage', on), false);
    assert.equal(can('TEACHER', 'sprint.manage', on), false);
    assert.equal(can('CLIENT', 'sprint.manage', on), false);
    assert.equal(can(null, 'sprint.manage', on), false);
    // Chỉ nới đúng một quyền — không kéo theo quyền cài đặt.
    assert.equal(can('MEMBER', 'project.settings', on), false);
  });
  it('tắt / thiếu / sai kiểu ⇒ mặc định chặt', () => {
    assert.equal(can('MEMBER', 'sprint.manage', projectOptionsOf({})), false);
    assert.equal(can('MEMBER', 'sprint.manage', projectOptionsOf(null)), false);
    assert.equal(can('MEMBER', 'sprint.manage', projectOptionsOf({ membersManageSprints: 'true' })), false);
    assert.equal(can('ADMIN', 'sprint.manage', projectOptionsOf({ membersManageSprints: false })), true);
  });
});

describe('quyền theo chủ sở hữu', () => {
  it('người báo tự xoá thẻ mình khi còn quyền sửa', () => {
    assert.equal(canDeleteIssue('MEMBER', 7, 7), true);
    assert.equal(canDeleteIssue('MEMBER', 7, 8), false);
    assert.equal(canDeleteIssue('ADMIN', 7, 8), true);
    // Khách hàng tạo được thẻ nhưng không có quyền sửa ⇒ không tự xoá được.
    assert.equal(canDeleteIssue('CLIENT', 7, 7), false);
    assert.equal(canDeleteIssue('MEMBER', 7, null), false);
  });

  it('tác giả sửa bình luận của mình; ADMIN xoá được của người khác', () => {
    assert.equal(canModifyComment('TEACHER', 3, 3), true);
    assert.equal(canModifyComment('MEMBER', 3, 4), false);
    assert.equal(canModifyComment('ADMIN', 3, 4), true);
    // Bình luận của AI (authorId null) chỉ ADMIN dọn được.
    assert.equal(canModifyComment('MEMBER', 3, null), false);
    assert.equal(canModifyComment('ADMIN', 3, null), true);
    // Bị hạ xuống VIEWER thì mất luôn quyền sửa bình luận cũ.
    assert.equal(canModifyComment('VIEWER', 3, 3), false);
  });
});

describe('bảng quyền không gian', () => {
  it('chỉ OWNER xoá được không gian', () => {
    assert.equal(canWorkspace('OWNER', 'workspace.delete'), true);
    assert.equal(canWorkspace('ADMIN', 'workspace.delete'), false);
  });
  it('GUEST không tạo dự án, không quản lý thành viên', () => {
    assert.equal(canWorkspace('GUEST', 'workspace.createProject'), false);
    assert.equal(canWorkspace('GUEST', 'workspace.members'), false);
    assert.equal(canWorkspace('GUEST', 'workspace.view'), true);
  });
  it('người ngoài không thấy gì', () => {
    assert.equal(canWorkspace(null, 'workspace.view'), false);
  });
  it('bộ phận: chỉ OWNER/ADMIN tạo/sửa', () => {
    assert.equal(canWorkspace('OWNER', 'workspace.teams'), true);
    assert.equal(canWorkspace('ADMIN', 'workspace.teams'), true);
    assert.equal(canWorkspace('MEMBER', 'workspace.teams'), false);
    assert.equal(canWorkspace('GUEST', 'workspace.teams'), false);
  });
});

// ─── CTW-28: AI agent — rào chắn tầng TUYẾN + hàm thuần (tầng HÀNH ĐỘNG có bảng riêng ở work.agents.db.test.ts) ───

describe('AI agent — tuyến đối ngoại dưới /projects/:pid bị chặn (agentRouteAllowed)', async () => {
  const { agentRouteAllowed } = await import('./permissions.js');
  /** Mọi tuyến có tác dụng đối ngoại (khách, tiền, xoá, cấu hình, duyệt) hiện có. Thêm tuyến loại này ⇒ thêm vào đây. */
  const denied: Array<[string, string]> = [
    // Tiền & báo cáo khách
    ['GET', '/finance/summary'], ['POST', '/finance/rates'], ['PATCH', '/finance/payments/3'], ['POST', '/finance/timesheets/9/approve'],
    ['POST', '/finance/timesheets/9/reopen'], ['POST', '/finance/timesheets/submit'], ['GET', '/finance/export.xlsx'],
    ['POST', '/reports/client-weekly/send'], ['POST', '/reports/client-weekly/polish'], ['PUT', '/reports/client-weekly/schedule'], ['GET', '/reports/client-weekly/schedule'],
    // Cổng khách & chia sẻ
    ['GET', '/portal/overview'], ['POST', '/portal/invite'], ['POST', '/portal/uat'], ['POST', '/portal/uat/4/decide'], ['POST', '/portal/requests'],
    ['POST', '/share-links'], ['DELETE', '/share-links/2'],
    ['PUT', '/issues/12/client-visible'], ['PATCH', '/attachments/5/client'], ['PUT', '/changes/2/client-visible'], ['POST', '/changes/2/approval'],
    ['POST', '/meetings/3/share'], ['POST', '/meetings/3/invites'],
    // Duyệt / quyết
    ['POST', '/approvals/7/decide'], ['POST', '/stages/2/request-gate'], ['POST', '/stages/2/activate'],
    // Xuất / nhập / tích hợp
    ['GET', '/export'], ['GET', '/export/project-tracking'], ['POST', '/exports'], ['POST', '/exports/1/link'], ['POST', '/import'],
    ['POST', '/chat-hooks'], ['POST', '/github'], ['DELETE', '/gitlab'], ['POST', '/automation'], ['PATCH', '/automation/4'],
    // CTW đợt 7c: sổ tài sản — agent chỉ đọc; xuất tệp giấy phép cấm.
    ['POST', '/assets'], ['PATCH', '/assets/3'], ['DELETE', '/assets/3'], ['PUT', '/assets/3/links'], ['GET', '/assets-export'],
    // Cấu hình / thành viên / xoá
    ['PATCH', ''], ['DELETE', ''], ['POST', '/archive'], ['PUT', '/members/8'], ['DELETE', '/members/8'],
    ['POST', '/labels'], ['PATCH', '/components/1'], ['POST', '/workflows'], ['PUT', '/workflows/1/transitions'], ['PATCH', '/statuses/3'],
    ['POST', '/issue-types'], ['PUT', '/issue-templates/BUG'], ['POST', '/custom-fields'], ['PUT', '/board-columns'], ['PUT', '/studio'],
    ['POST', '/studio/apply-defaults'], ['PUT', '/desk/settings'], ['PUT', '/spec-settings'], ['PUT', '/agent-settings'], ['GET', '/agent-settings'],
    ['POST', '/avatar/presign'], ['POST', '/sample-data'], ['PUT', '/capacity/4'], ['POST', '/tests/enable'],
    ['POST', '/versions/2/release'], ['DELETE', '/versions/2'],
    ['DELETE', '/issues/12'], ['POST', '/issues/12/move-project'], ['POST', '/issues/bulk'], ['GET', '/trash'], ['POST', '/trash/3/restore'],
    ['PUT', '/edit-lock'], ['POST', '/ai/chat'], ['GET', '/ai/threads'],
    // Đợt 3C: agent không tự khởi động / dừng agent dựng sẵn (tiền LLM của web)
    ['POST', '/issues/12/agent-runs'], ['GET', '/issues/12/agent-runs'], ['POST', '/agent-runs/5/cancel'],
    // CTW Đóng góp: agent không đọc số liệu người, không chấm chéo, không xuất
    ['GET', '/contrib/summary'], ['GET', '/contrib/members/3'], ['GET', '/contrib/export.xlsx'], ['PUT', '/contrib/peer/rounds/2/reviews/3'], ['GET', '/contrib'],    // CTW K-2: ghi âm / điểm danh / RSVP / cấu hình họp / duyệt biên bản AI
    ['POST', '/meetings/3/recordings'], ['POST', '/meetings/3/recordings/2/chunks'], ['GET', '/meetings/3/recordings/2/chunks/0/audio'],
    ['DELETE', '/meetings/3/recordings/2/audio'], ['PUT', '/meetings/3/attendance'], ['POST', '/meetings/3/rsvp'], ['POST', '/meetings/3/join'],
    ['PUT', '/meeting-settings'], ['POST', '/meetings/3/minutes-ai/4/apply'], ['POST', '/meetings/3/minutes-ai/4/dismiss'],
    // CTW đợt 7b
    ['POST', '/forms/F-1/status'], ['POST', '/forms/2/rotate'], ['DELETE', '/forms/F-1'], ['POST', '/imports'], ['GET', '/intake/channels'],
    ['POST', '/intake/channels/3/simulate'], ['POST', '/intake/proposals/4/decide'], ['POST', '/kb/articles'], ['DELETE', '/kb/categories/2'],
  ];
  /** Việc thường ngày của agent — phải MỞ. */
  const allowed: Array<[string, string]> = [
    ['GET', ''], ['GET', '/board'], ['GET', '/issues'], ['GET', '/issues/12'], ['POST', '/issues'], ['PATCH', '/issues/12'],
    ['POST', '/issues/12/move'], ['POST', '/issues/12/comments'], ['GET', '/issues/12/history'], ['POST', '/issues/12/worklogs'],
    ['POST', '/issues/12/attachments/presign'], ['POST', '/issues/12/attachments/complete'], ['PUT', '/issues/12/flag'],
    ['POST', '/issues/12/claim'], ['POST', '/approvals'], ['GET', '/approvals/7'], ['POST', '/issues/12/handoffs'],
    ['POST', '/handoffs/3/accept'], ['GET', '/pages'], ['GET', '/pages/2/markdown'], ['GET', '/search'], ['GET', '/raid'],
    ['GET', '/meetings/3'], ['GET', '/reports/burndown'], ['HEAD', '/board'],
    ['GET', '/meetings/3/transcript'], ['POST', '/meetings/3/minutes-ai'], ['GET', '/meetings/3/room'],
    ['GET', '/forms'], ['POST', '/forms'], ['GET', '/forms/F-1/responses'], ['GET', '/intake/proposals'], ['GET', '/kb'],
  ];
  it(`${denied.length} tuyến đối ngoại ⇒ cấm`, () => {
    assert.ok(denied.length >= 25);
    for (const [m, p] of denied) assert.equal(agentRouteAllowed(m, p), false, `${m} ${p || '(project)'}`);
  });
  it('việc thường ngày ⇒ mở', () => {
    for (const [m, p] of allowed) assert.equal(agentRouteAllowed(m, p), true, `${m} ${p || '(project)'}`);
  });
  it('dấu / cuối không lách được', () => {
    assert.equal(agentRouteAllowed('POST', '/approvals/7/decide/'), false);
    assert.equal(agentRouteAllowed('GET', '/finance/'), false);
  });
});

describe('AI agent — tuyến ngoài dự án là DANH SÁCH TRẮNG (agentTopRouteAllowed)', async () => {
  const { agentTopRouteAllowed } = await import('./permissions.js');
  it('chỉ đọc không gian/thành viên/dự án/bộ phận, việc của tôi, tìm, /agents/me/**', () => {
    for (const [m, p] of [['GET', '/workspaces'], ['GET', '/workspaces/3'], ['GET', '/workspaces/3/members'], ['GET', '/workspaces/3/projects'],
      ['GET', '/workspaces/3/teams'], ['GET', '/workspaces/by-slug/fp'], ['GET', '/me/work'], ['GET', '/me/approvals'], ['GET', '/search'],
      ['GET', '/resolve/fp/FP'], ['GET', '/agents/me'], ['GET', '/agents/me/events'], ['POST', '/agents/me/leases/3/heartbeat'],
      ['POST', '/projects/4/issues/2/claim']] as const) {
      assert.equal(agentTopRouteAllowed(m, p), true, `${m} ${p}`);
    }
  });
  it('quản trị / tự nhân bản / tài khoản ⇒ cấm', () => {
    for (const [m, p] of [['POST', '/workspaces'], ['PATCH', '/workspaces/3'], ['DELETE', '/workspaces/3'], ['POST', '/workspaces/3/invites'],
      ['GET', '/workspaces/3/agents'], ['POST', '/workspaces/3/agents'], ['POST', '/workspaces/3/agents/1/tokens'], ['GET', '/workspaces/3/audit'],
      ['DELETE', '/workspaces/3/members/9'], ['POST', '/invites/abc/accept'], ['GET', '/me/api-tokens'], ['POST', '/me/calendar-link'],
      ['PUT', '/me/notify-settings'], ['GET', '/workspaces/3/workload'], ['POST', '/workspaces/3/transfer'], ['GET', '/ai/quota'],
      ['GET', '/workspaces/3/builtin-budget'], ['PUT', '/workspaces/3/builtin-budget'], ['GET', '/workspaces/3/agents/1/runs']] as const) {
      assert.equal(agentTopRouteAllowed(m, p), false, `${m} ${p}`);
    }
  });
  it('token giới hạn dự án ⇒ không tìm xuyên dự án', () => {
    assert.equal(agentTopRouteAllowed('GET', '/search', true), false);
    assert.equal(agentTopRouteAllowed('GET', '/me/work', true), true);
  });
});

describe('AI agent — hàm quyền thuần (lớp phủ principal)', async () => {
  const P = await import('./permissions.js');
  it('AGENT_DENIED_ACTIONS thắng vai ADMIN; approval.create / handoff.create / issue.edit vẫn mở', () => {
    for (const a of P.AGENT_DENIED_ACTIONS) {
      assert.equal(P.can('ADMIN', a, { membersManageSprints: true }, 'AGENT'), false, a);
      assert.equal(P.can('ADMIN', a, {}, 'HUMAN'), true, `${a} (người ADMIN vẫn được)`);
    }
    for (const a of ['issue.create', 'issue.edit', 'issue.transition', 'comment.create', 'attachment.add', 'approval.create', 'handoff.create', 'page.edit'] as const) {
      assert.equal(P.can('MEMBER', a, {}, 'AGENT'), true, a);
    }
  });
  it('cấp không gian: agent chỉ workspace.view', () => {
    assert.equal(P.canWorkspace('OWNER', 'workspace.view', 'AGENT'), true);
    for (const a of ['workspace.settings', 'workspace.members', 'workspace.createProject', 'workspace.delete', 'workspace.teams'] as const) {
      assert.equal(P.canWorkspace('OWNER', a, 'AGENT'), false, a);
    }
  });
  it('agent không tự xoá thẻ mình báo; không quyết bước duyệt đứng tên mình', () => {
    assert.equal(P.canDeleteIssue('MEMBER', 5, 5, 'AGENT'), false);
    assert.equal(P.canDeleteIssue('MEMBER', 5, 5, 'HUMAN'), true);
    const ap = { status: 'PENDING', mode: 'PARALLEL', steps: [{ id: 1, approverId: 5, position: 0, decision: 'PENDING' }] };
    assert.equal(P.canDecideApprovalStep('MEMBER', 5, ap, 1, 'AGENT'), false);
    assert.equal(P.canDecideApprovalStep('MEMBER', 5, ap, 1, 'HUMAN'), true);
  });
  it('bình luận của agent luôn INTERNAL, kể cả khi xin PUBLIC trên thẻ đã chia sẻ', () => {
    const modules = { clientPortal: true } as never;
    assert.equal(P.commentVisibilityFor({ role: 'MEMBER', modules, principal: 'AGENT' }, true, 'PUBLIC'), 'INTERNAL');
    assert.equal(P.commentVisibilityFor({ role: 'MEMBER', modules, principal: 'HUMAN' }, true, 'PUBLIC'), 'PUBLIC');
  });
  it('agentOptionsOf: thiếu ⇒ mặc định chặt (doneToReview BẬT, self-assign TẮT); rác ⇒ mặc định', () => {
    assert.deepEqual(P.agentOptionsOf(null), { doneToReview: true, reviewStatusId: null, allowCreateIssues: true, allowSelfAssign: false, maxOpenLeases: 3, leaseMinutes: 30, reviewerIds: [] });
    const o = P.agentOptionsOf({ agents: { doneToReview: 'no', reviewStatusId: -1, maxOpenLeases: 999, leaseMinutes: 2, allowSelfAssign: 1, reviewerIds: [3, 'x', 0] } });
    assert.equal(o.doneToReview, true);
    assert.equal(o.reviewStatusId, null);
    assert.equal(o.maxOpenLeases, 3);
    assert.equal(o.leaseMinutes, 30);
    assert.equal(o.allowSelfAssign, false);
    assert.deepEqual(o.reviewerIds, [3]);
    assert.equal(P.agentOptionsOf({ agents: { doneToReview: false } }).doneToReview, false);
  });
});
