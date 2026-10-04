/**
 * Cổng khách (đợt S2b) — luật THUẦN: ai bị cách ly, tuyến nào khách được gọi,
 * bình luận mới mang chế độ hiển thị nào, mặc định mô-đun theo loại, nội dung
 * email gửi khách. Không chạm DB: `npx tsx --test src/services/work/portal.test.ts`.
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { clientPortalRouteAllowed, commentVisibilityFor, isClientScoped } from './permissions.js';
import { defaultModulesFor, noModules } from './studio.js';
import { clientEmailContent, portalPath } from './portalNotify.js';

const on = { ...noModules(), clientPortal: true };
const off = noModules();

describe('isClientScoped — chỉ vai CLIENT ở dự án BẬT cổng khách', () => {
  it('bảng vai × mô-đun', () => {
    for (const role of ['ADMIN', 'MEMBER', 'VIEWER', 'TEACHER'] as const) {
      assert.equal(isClientScoped({ role, modules: on }), false, role);
    }
    assert.equal(isClientScoped({ role: 'CLIENT', modules: on }), true);
    // Dự án cũ / không bật cổng khách: hành vi cũ (khách thấy mọi thẻ).
    assert.equal(isClientScoped({ role: 'CLIENT', modules: off }), false);
    assert.equal(isClientScoped({ role: 'CLIENT', modules: null }), false);
    assert.equal(isClientScoped({ role: null, modules: on }), false);
  });
  it('dự án CLIENT mới bật cổng khách mặc định; loại khác thì không', () => {
    assert.equal(defaultModulesFor('CLIENT').clientPortal, true);
    for (const k of ['PERSONAL', 'SCHOOL', 'SOFTWARE'] as const) assert.equal(defaultModulesFor(k).clientPortal, false, k);
  });
});

describe('clientPortalRouteAllowed — danh sách trắng tuyến của khách', () => {
  const allowed: Array<[string, string]> = [
    ['GET', ''], ['GET', '/'], ['GET', '/portal/overview'], ['POST', '/portal/requests'], ['GET', '/portal/uat/5/certificate'],
    ['GET', '/issues'], ['GET', '/board'], ['GET', '/search'], ['GET', '/issues/12'],
    ['GET', '/issues/12/comments'], ['POST', '/issues/12/comments'], ['PATCH', '/issues/12/comments/3'], ['DELETE', '/issues/12/comments/3'],
    ['PUT', '/issues/12/comments/3/reactions/%F0%9F%91%8D'], ['POST', '/issues/12/attachments/presign'], ['POST', '/issues/12/attachments/complete'],
    ['GET', '/attachments/9/url'], ['GET', '/issues/12/pages'], ['GET', '/approvals'], ['GET', '/approvals/4'], ['POST', '/approvals/4/decide'],
    ['GET', '/pages'], ['GET', '/pages/search'], ['GET', '/pages/2'], ['GET', '/pages/2/markdown'], ['HEAD', '/issues'],
  ];
  const blocked: Array<[string, string]> = [
    // Báo cáo, dashboard, worklog, lịch sử, xuất, AI, timeline, backlog, sprint, kiểm thử…
    ['GET', '/backlog'], ['GET', '/reports/burndown'], ['GET', '/reports/velocity'], ['GET', '/reports/epics'], ['GET', '/reports/contributions'],
    ['GET', '/reports/time'], ['GET', '/reports/traceability'], ['GET', '/stats'], ['GET', '/stats/created-resolved'], ['GET', '/dashboards'], ['GET', '/filters'],
    ['GET', '/issues/12/history'], ['GET', '/issues/12/worklogs'], ['POST', '/issues/12/worklogs'], ['GET', '/issues/12/custom-values'],
    ['GET', '/issues/12/dev'], ['GET', '/issues/12/handoffs'], ['GET', '/timeline'], ['GET', '/capacity'], ['GET', '/versions'], ['GET', '/versions/1'],
    ['GET', '/export'], ['GET', '/export/project-tracking'], ['GET', '/sprints'], ['GET', '/tests'], ['GET', '/test-cycles'],
    ['POST', '/ai/chat'], ['GET', '/ai/threads'], ['GET', '/insights'], ['GET', '/similar'], ['GET', '/suggest-assignee'],
    ['GET', '/stages'], ['GET', '/handoffs'], ['GET', '/studio'], ['GET', '/share-links'], ['GET', '/trash'], ['GET', '/automation'],
    ['GET', '/onboarding'], ['GET', '/issue-templates'], ['GET', '/edit-lock'], ['GET', '/custom-fields'],
    // Ghi: khách không sửa/kéo/xoá/chia sẻ/tạo thẻ ngoài cổng.
    ['POST', '/issues'], ['PATCH', '/issues/12'], ['POST', '/issues/12/move'], ['DELETE', '/issues/12'], ['POST', '/issues/12/clone'],
    ['PUT', '/issues/12/client-visible'], ['PATCH', '/attachments/9/client'], ['DELETE', '/attachments/9'], ['POST', '/issues/12/links'],
    ['PUT', '/issues/12/watch'], ['POST', '/issues/12/comments/3/report'], ['GET', '/pages/2/versions'], ['GET', '/pages/2/comments'],
    ['POST', '/pages/2/comments'], ['PATCH', '/pages/2'], ['POST', '/approvals'], ['POST', '/approvals/4/cancel'],
    // Đường trông giống nhưng không khớp đúng.
    ['GET', '/issues/12/comments/3'], ['GET', '/issuesx'], ['GET', '/portalx'], ['POST', '/board'],
  ];
  it('mở đúng tuyến cổng khách cần', () => {
    for (const [m, p] of allowed) assert.equal(clientPortalRouteAllowed(m, p), true, `${m} ${p}`);
  });
  it('chặn mọi tuyến còn lại (báo cáo, worklog, lịch sử, xuất, AI, ghi…)', () => {
    for (const [m, p] of blocked) assert.equal(clientPortalRouteAllowed(m, p), false, `${m} ${p}`);
  });
});

describe('commentVisibilityFor — ghi chú nội bộ vs trả lời khách', () => {
  it('khách bị cách ly luôn viết PUBLIC, kể cả khi xin INTERNAL', () => {
    assert.equal(commentVisibilityFor({ role: 'CLIENT', modules: on }, true, 'INTERNAL'), 'PUBLIC');
    assert.equal(commentVisibilityFor({ role: 'CLIENT', modules: on }, true, undefined), 'PUBLIC');
  });
  it('nhân viên: mặc định INTERNAL; PUBLIC chỉ khi thẻ đã chia sẻ', () => {
    assert.equal(commentVisibilityFor({ role: 'MEMBER', modules: on }, true, undefined), 'INTERNAL');
    assert.equal(commentVisibilityFor({ role: 'MEMBER', modules: on }, true, 'PUBLIC'), 'PUBLIC');
    assert.throws(() => commentVisibilityFor({ role: 'ADMIN', modules: on }, false, 'PUBLIC'), /Share this issue/);
  });
  it('dự án không bật cổng khách: luôn INTERNAL (cột không được đọc)', () => {
    assert.equal(commentVisibilityFor({ role: 'MEMBER', modules: off }, true, 'PUBLIC'), 'INTERNAL');
    assert.equal(commentVisibilityFor({ role: 'CLIENT', modules: off }, true, undefined), 'INTERNAL');
  });
});

describe('thư cho khách — chỉ dữ liệu đã chia sẻ, link vào cổng khách', () => {
  it('portalPath', () => {
    assert.equal(portalPath('acme', 'CL'), '/work/acme/CL/portal');
    assert.equal(portalPath('acme', 'CL', 'requests', 7), '/work/acme/CL/portal?tab=requests&issue=7');
  });
  it('mỗi loại có tiêu đề + nút riêng, không chữ "internal"', () => {
    for (const kind of ['reply', 'approval', 'uat', 'stage', 'deliverable', 'request']) {
      const c = clientEmailContent({ portalKind: kind, projectName: 'Acme', issueKey: 'CL-3', title: 'Login page', excerpt: 'Fixed' });
      assert.ok(c.subject.length > 5 && c.cta.length > 3, kind);
      assert.doesNotMatch(JSON.stringify(c), /internal/i, kind);
    }
    const r = clientEmailContent({ portalKind: 'reply', issueKey: 'CL-3', title: 'Login page', excerpt: 'Fixed in build 12' });
    assert.match(r.subject, /New reply on CL-3/);
    assert.ok(r.lines.some((l) => l.includes('Fixed in build 12')));
  });
});
