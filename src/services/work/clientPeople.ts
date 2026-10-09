/**
 * CT Work — NGƯỜI mà khách (cổng khách S2b) được thấy. MỘT luật, MỘT hàm lọc, dùng
 * ở MỌI đường trả người cho khách bị cách ly (thành viên dự án/không gian, gợi ý
 * @nhắc, assignee/reporter, người duyệt, tác giả bình luận PUBLIC, activity cổng,
 * chủ trang, người tải tệp, cảm xúc bình luận, bảng tra JQL).
 *
 * Khách bị cách ly ở dự án P thấy đúng những người sau của P:
 *   1. chính mình;
 *   2. các khách khác của P (cùng phía, thường cùng công ty — họ cùng nhận phê duyệt);
 *   3. "lead" dự án (người đứng tên chịu trách nhiệm với khách);
 *   4. người CÓ tương tác công khai với khách: tác giả trả lời PUBLIC trên thẻ đã
 *      chia sẻ · assignee của thẻ đã chia sẻ · người duyệt + người gửi của phê duyệt
 *      có khách đứng tên · (đợt S3b) người tổ chức + người được mời của cuộc họp CÓ
 *      MỜI khách (khách đã thấy nhau trong lời mời họp) · (đợt 6a) người được @nhắc trong nội dung
 *      khách đọc được — mô tả thẻ đã chia sẻ, bình luận PUBLIC trên thẻ đã chia sẻ, trang CLIENT (nhãn
 *      @nhắc mang tên thật, và nhân viên tự chọn nêu tên người đó với khách — che ở danh sách thành viên
 *      mà để lộ trong nội dung thì vô nghĩa và khó hiểu).
 * Ai khác (kể cả khi dự án mở cho cả không gian) ⇒ không bao giờ xuất hiện; chỗ nào
 * cần hiện "một người" thì hiện `TEAM_USER` ("Project team", id 0). Không bao giờ email
 * (mọi select dùng PUBLIC_USER — không có cột email).
 *
 * Vì sao một tập id thay vì lọc từng chỗ theo ngữ cảnh: tập này tính từ dữ liệu công
 * khai (thứ khách đã thấy được), nên mọi đường cho cùng một câu trả lời — không có
 * chuyện danh sách thành viên giấu một người mà ô "reporter" lại lộ chính người đó.
 */

import { prisma } from '../../config/database.js';
import { isClientScoped, type ProjectAccess } from './permissions.js';
import { clientMemberIds } from './portalNotify.js';

/** Chỗ đứng cho người khách không được biết tên. */
export const TEAM_USER = { id: 0, username: 'team', fullName: null, displayName: 'Project team', avatarUrl: null } as const;
export const TEAM_NAME = 'The team';

/** Tập id người khách của dự án `projectId` được thấy (xem luật ở đầu file). `viewerId` null = xem trước. */
export async function clientPeopleIds(projectId: number, viewerId: number | null): Promise<Set<number>> {
  const sharedIssue = { projectId, deletedAt: null, clientVisible: true };
  const clients = await clientMemberIds(projectId);
  const [project, authors, assignees, approvals, meetings, mentioned] = await Promise.all([
    prisma.workProject.findUnique({ where: { id: projectId }, select: { leadId: true } }),
    prisma.workComment.findMany({ where: { deletedAt: null, visibility: 'PUBLIC', isAi: false, issue: sharedIssue }, distinct: ['authorId'], select: { authorId: true } }),
    prisma.workIssue.findMany({ where: { ...sharedIssue, assigneeId: { not: null } }, distinct: ['assigneeId'], select: { assigneeId: true } }),
    // Phê duyệt "của khách" (cùng luật với portal.service clientApprovalWhere).
    clients.length
      ? prisma.workApproval.findMany({
        where: { projectId, steps: { some: { approverId: { in: clients } } } },
        select: { createdById: true, steps: { select: { approverId: true } } },
      })
      : Promise.resolve([]),
    // Cuộc họp có mời khách (đợt S3b, meetings.service portalMeetings cùng luật).
    clients.length
      ? prisma.workMeeting.findMany({
        where: { projectId, deletedAt: null, attendees: { some: { userId: { in: clients } } } },
        select: { organizerId: true, attendees: { select: { userId: true } } },
        take: 500,
      })
      : Promise.resolve([]),
    publicMentionIds(projectId),
  ]);
  const out = new Set<number>(clients);
  for (const id of mentioned) out.add(id);
  if (viewerId) out.add(viewerId);
  if (project?.leadId) out.add(project.leadId);
  for (const c of authors) if (c.authorId) out.add(c.authorId);
  for (const i of assignees) if (i.assigneeId) out.add(i.assigneeId);
  for (const a of approvals) {
    if (a.createdById) out.add(a.createdById);
    for (const s of a.steps) out.add(s.approverId);
  }
  for (const m of meetings) {
    if (m.organizerId) out.add(m.organizerId);
    for (const at of m.attendees) out.add(at.userId);
  }
  // CTW-28: cổng khách KHÔNG BAO GIỜ lộ AI agent — agent là assignee của thẻ đã chia sẻ ⇒ khách thấy "Project team".
  if (out.size) {
    const agents = await prisma.user.findMany({ where: { id: { in: [...out] }, kind: 'AGENT' }, select: { id: true } });
    for (const a of agents) if (a.id !== viewerId) out.delete(a.id);
  }
  return out;
}

/** Id người được @nhắc (node `mention`, attrs.id) trong nội dung khách của dự án đọc được. */
async function publicMentionIds(projectId: number): Promise<number[]> {
  const rows = await prisma.$queryRaw<Array<{ id: string | null }>>`
    SELECT DISTINCT (m->'attrs'->>'id') AS id FROM (
      SELECT description_json AS j FROM work_issues
        WHERE project_id = ${projectId} AND deleted_at IS NULL AND client_visible = true AND description_json IS NOT NULL
      UNION ALL
      SELECT c.body_json FROM work_comments c JOIN work_issues i ON i.id = c.issue_id
        WHERE i.project_id = ${projectId} AND i.deleted_at IS NULL AND i.client_visible = true AND c.deleted_at IS NULL AND c.visibility = 'PUBLIC'
      UNION ALL
      SELECT content_json FROM work_pages
        WHERE project_id = ${projectId} AND deleted_at IS NULL AND visibility = 'CLIENT' AND content_json IS NOT NULL
    ) s, LATERAL jsonb_path_query(s.j, 'strict $.**') m
    WHERE jsonb_typeof(m) = 'object' AND m->>'type' = 'mention'
    LIMIT 500`;
  return rows.map((r) => Number(r.id)).filter((n) => Number.isInteger(n) && n > 0);
}

/** Bộ lọc người cho một người xem: null = không lọc (nhân viên). */
export type PeopleFilter = Set<number> | null;

export async function peopleFilterFor(access: Pick<ProjectAccess, 'projectId' | 'role' | 'modules'>, viewerId: number): Promise<PeopleFilter> {
  return isClientScoped(access) ? clientPeopleIds(access.projectId, viewerId) : null;
}

type UserLike = { id: number };

/** Người được phép ⇒ giữ nguyên; không ⇒ TEAM_USER. null giữ null. */
export function maskUser<T extends UserLike>(u: T | null, f: PeopleFilter): T | typeof TEAM_USER | null {
  if (!u || !f) return u;
  return f.has(u.id) ? u : TEAM_USER;
}

/** Lọc một danh sách người (bỏ hẳn người không được thấy). */
export function filterPeople<T extends UserLike>(list: T[], f: PeopleFilter): T[] {
  return f ? list.filter((u) => f.has(u.id)) : list;
}
