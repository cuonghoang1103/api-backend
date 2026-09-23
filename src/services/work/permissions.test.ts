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
});
