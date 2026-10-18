/**
 * Registry lệnh — ĐỌC cho trợ lý Ask AI kiểu mentor (18/10/2026). CHỈ ĐỌC, CHỈ ĐƯỜNG ASK (`mcp: false, builtin: false`):
 * MCP/agent đã có get_issue/my_work; bốn lệnh này cho trợ lý web đọc ĐỦ những thứ trưởng nhóm để lại.
 *
 *   read_issue      — một thẻ đầy đủ: mô tả (Markdown, giữ link + checklist), tiêu chí, bình luận, thẻ con/cha, liên kết,
 *                     web links, trang Docs gắn thẻ / được link trong thẻ, CHỮ của tệp đính kèm (txt/md/PDF/DOCX);
 *   read_attachment — chữ của MỘT tệp đính kèm (thẻ hoặc bình luận);
 *   list_resources  — thư viện link (Resources) của dự án, lọc theo chữ;
 *   member_work     — thẻ đang mở của một thành viên (mặc định: người hỏi), kèm hạn/sprint/đường dẫn.
 *
 * Quyền: như mọi lệnh — `projectFor` chạy lại chốt tầng tuyến của tuyến REST tương đương (khách cổng ⇒ CLIENT_PORTAL_ONLY,
 * token agent ⇒ AGENT_DENIED_ROUTES nếu sau này mở đường agent), rồi service kiểm `requireProject` + luật xem (thẻ/tệp
 * chia sẻ cho khách, trang CLIENT/INTERNAL, link Resources TEAM/CLIENT) bằng userId người hỏi.
 */

import { z } from 'zod';
import { issueNumber, projectFor } from '../../../mcp/context.js';
import { projectArg, issueArg } from '../../../mcp/tools/read.js';
import { MENTOR_LIMITS, memberWorkText, readAttachmentText, readIssueFull, resourcesIndex, workLinks } from '../aiMentor.js';
import { defineTool, type ToolDef } from './types.js';

const ASK_ONLY = { mcp: false, builtin: false } as const;

const readIssue = defineTool({
  name: 'read_issue', title: 'Read issue (everything)', group: 'issues',
  description: 'Reads ONE issue with everything a member needs: description (with its links and checklist), acceptance criteria, comments, parent and subtasks, linked issues, web links, Docs pages linked to it, and the text of its attached files (txt/md/PDF/DOCX). Use it before explaining an issue or saying what to read/do.',
  write: false,
  surfaces: ASK_ONLY,
  input: z.object({ project: projectArg, issue: issueArg, withPages: z.boolean().optional().describe('Also include the content of the Docs pages linked to the issue (max 2)') }),
  run: async (ctx, a) => {
    const p0 = await projectFor(ctx, a.project, []);
    const n = issueNumber(p0.key, a.issue);
    const p = await projectFor(ctx, a.project, [['GET', `/issues/${n}`], ['GET', `/issues/${n}/comments`], ['GET', `/issues/${n}/web-links`]]);
    return readIssueFull(ctx.userId, p.access, workLinks(p.workspaceSlug, p.key), n, { withPages: a.withPages === true });
  },
});

const readAttachment = defineTool({
  name: 'read_attachment', title: 'Read attached file', group: 'issues',
  description: 'Reads the text of ONE file attached to an issue or a comment (txt/md/code/CSV, PDF and DOCX are converted to text). Use the attachment id (#id) shown by read_issue.',
  write: false,
  surfaces: ASK_ONLY,
  input: z.object({ project: projectArg, attachment: z.coerce.number().int().positive().describe('Attachment id, e.g. 42 for "#42"') }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', `/attachments/${a.attachment}/url`]]);
    return readAttachmentText(ctx.userId, p.id, a.attachment, MENTOR_LIMITS.attachmentChars);
  },
});

const listResources = defineTool({
  name: 'list_resources', title: 'List project resources', group: 'docs',
  description: "Lists the project's Resources (the team's link library: repo, design, slides, videos…) with URL, group, description and tags; optional text filter.",
  write: false,
  surfaces: ASK_ONLY,
  input: z.object({ project: projectArg, query: z.string().max(100).optional().describe('Text to find in title/description/URL/tag') }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/resources']]);
    const text = await resourcesIndex(p.access, workLinks(p.workspaceSlug, p.key), { query: a.query, limit: 100 });
    return text || 'Resources are turned off for this project (or not visible to you).';
  },
});

const memberWork = defineTool({
  name: 'member_work', title: "A member's open issues", group: 'issues',
  description: 'Open issues assigned to one project member (default: the person asking), ordered active sprint → earliest due, with status, due date, sprint, parent and in-app link.',
  write: false,
  surfaces: ASK_ONLY,
  input: z.object({ project: projectArg, user: z.string().max(60).optional().describe('Username (without @); omit or "me" for the person asking') }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/issues']]);
    return memberWorkText(ctx.userId, p.access, workLinks(p.workspaceSlug, p.key), a.user);
  },
});

export const ASK_READ_COMMANDS: ToolDef[] = [readIssue, readAttachment, listResources, memberWork];
