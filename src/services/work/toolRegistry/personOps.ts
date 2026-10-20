/**
 * Registry lệnh — 19/10/2026: CuongMini (và mọi AI cầm token ctw_ của MỘT NGƯỜI) LÀM ĐƯỢC MỌI VIỆC NGƯỜI ĐÓ LÀM TRÊN WEB.
 *
 * Sự cố gốc: nhờ CuongMini gắn sơ đồ (ảnh nằm trong Google Doc) vào thẻ NT-13 ⇒ AI không có đường nào tải ảnh đó, bảo
 * người dùng tự lưu PNG rồi kéo vào chat. Cùng lúc thiếu hẳn: liên kết thẻ, cờ chặn, theo dõi, web link, thêm/đổi vai/bớt
 * thành viên dự án, mời vào không gian, tạo/bắt đầu/kết thúc sprint.
 *
 *   Tệp từ link:  gdoc_images (ảnh nhúng trong Google Doc / trang web công khai, đánh số) · attach_from_url (máy chủ tự tải
 *                 — rào SSRF `taiCongKhai`; link Google tự đổi sang URL xuất: Drawings⇒PNG, Docs⇒PDF, Slides⇒PDF/PNG,
 *                 Sheets⇒XLSX, Drive⇒tải thẳng).
 *   Thẻ:          issue_link / issue_unlink, issue_flag, issue_watch, issue_web_link_add.
 *   Thành viên:   project_member_add / project_member_set_role / project_member_remove (ADMIN dự án), workspace_invite
 *                 (OWNER/ADMIN không gian) — `personOnly`: agent không thấy, và vẫn bị chặn ở tuyến + service.
 *   Sprint:       sprint_create / sprint_start / sprint_complete (`sprint.manage` — ADMIN, hoặc MEMBER khi dự án bật
 *                 "Allow members to manage sprints").
 *
 * Luật như mọi lệnh registry: lệnh ghi `requireWrite` + `projectFor` với TUYẾN REST TƯƠNG ĐƯƠNG (AGENT_DENIED_ROUTES, cổng
 * khách), rồi gọi THẲNG service mà tuyến REST gọi ⇒ kết quả quyền y hệt web. Không có đường ghi mới nào bỏ qua `can()`.
 */

import { z } from 'zod';
import { prisma } from '../../../config/database.js';
import { putObject } from '../../../config/r2.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../../middleware/errorHandler.js';
import { issueIdOf, issueNumber, projectFor, requireWrite, touchLease, type McpCtx, type ProjectHit } from '../../../mcp/context.js';
import { untrusted } from '../../../mcp/protocol.js';
import { issueArg, projectArg } from '../../../mcp/tools/read.js';
import { LoiTai } from '../../linkNgoai/taiAnToan.js';
import { anhCuaLink, coDataUri, loiChoNguoi, taiAnh, taiTepTuLink, tenVaKieu, TEN_NGUON, type LoaiNguon } from '../../linkNgoai/taiTep.js';
import { auditProject } from '../audit.js';
import { LINK_TYPES, PROJECT_ROLES, WORKSPACE_ROLES, type LinkType } from '../constants.js';
import * as issues from '../issues.service.js';
import { agentForbidden, agentTopRouteAllowed, can } from '../permissions.js';
import * as projects from '../projects.service.js';
import * as resources from '../resources.service.js';
import * as sprints from '../sprints.service.js';
import * as teams from '../teams.service.js';
import * as workspaces from '../workspaces.service.js';
import { defineTool, type ToolDef } from './types.js';

const ymd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const userArg = z.string().min(1).max(254).describe('Username (with or without @) or email of a workspace member');

/** Thẻ + chốt tầng tuyến (như issueCtx của write.ts). */
async function issueHit(ctx: McpCtx, project: string, issue: unknown, routes: (n: number) => Array<[string, string]>): Promise<{ p: ProjectHit; n: number; key: string }> {
  requireWrite(ctx);
  const head = String(project ?? '').trim();
  const n = issueNumber((head.includes('/') ? head.split('/')[1] : head).toUpperCase(), issue);
  const p = await projectFor(ctx, project, routes(n));
  return { p, n, key: `${p.key}-${n}` };
}

/** Lệnh chỉ dành cho NGƯỜI — agent bị từ chối kèm tên owner (như mọi chốt agent). */
async function chiNguoi(ctx: McpCtx, verb: string): Promise<void> {
  if (ctx.agent) throw await agentForbidden(ctx.agent.userId, verb);
}

// ─── Người theo username / email ─────────────────────────────────

/** "@an" / "an" / "an@x.com" ⇒ người dùng (chưa kiểm thuộc không gian). Không thấy ⇒ null. */
async function timNguoi(ref: string): Promise<{ id: number; username: string; email: string } | null> {
  const s = ref.trim().replace(/^@/, '');
  if (!s) return null;
  return prisma.user.findFirst({
    where: s.includes('@') ? { email: { equals: s, mode: 'insensitive' } } : { username: { equals: s, mode: 'insensitive' } },
    select: { id: true, username: true, email: true },
  });
}

/**
 * Người được giao: "me" ⇒ chính mình, "nobody"/"none"/"unassigned" ⇒ null, còn lại = username/email của một thành viên
 * KHÔNG GIAN của dự án. Người đó có được giao việc không (vai sửa được thẻ) ⇒ applyIssueChange kiểm (WORK_BAD_ASSIGNEE).
 */
export async function assigneeIdOf(ctx: McpCtx, p: Pick<ProjectHit, 'workspaceId' | 'key'>, ref: string): Promise<number | null> {
  const s = ref.trim().toLowerCase();
  if (s === 'me' || s === 'myself') return ctx.userId;
  if (['nobody', 'none', 'unassigned', 'null', ''].includes(s)) return null;
  const u = await timNguoi(ref);
  const inWs = u ? await prisma.workMember.findFirst({ where: { workspaceId: p.workspaceId, userId: u.id }, select: { userId: true } }) : null;
  if (!u || !inWs) throw new AppError(`"${ref}" is not a member of this workspace — use a username from the project's people (or "me" / "nobody")`, 400, 'WORK_BAD_USER');
  return u.id;
}

/** Mức ưu tiên: "Highest|High|Medium|Low|Lowest" hoặc 1–5 (1 = cao nhất, như Jira). */
export const PRIORITY_NAMES = ['highest', 'high', 'medium', 'low', 'lowest'] as const;
export const priorityArg = z.union([z.enum(['Highest', 'High', 'Medium', 'Low', 'Lowest', 'highest', 'high', 'medium', 'low', 'lowest']), z.number().int().min(1).max(5)])
  .describe('Highest | High | Medium | Low | Lowest (or 1–5, 1 = highest)');
export function priorityOf(v: string | number): number {
  return typeof v === 'number' ? v : PRIORITY_NAMES.indexOf(v.toLowerCase() as (typeof PRIORITY_NAMES)[number]) + 1;
}

export const sprintRefArg = z.union([z.string().min(1).max(120), z.number().int().positive()]);

/** "active" | "next" (sprint chưa bắt đầu đầu tiên) | "backlog" (⇒ null) | tên | id ⇒ id sprint (của dự án). */
export async function sprintIdOf(ctx: McpCtx, projectId: number, ref: string | number, opts: { allowBacklog?: boolean } = {}): Promise<number | null> {
  const list = await sprints.listSprints(ctx.userId, projectId);
  const s = typeof ref === 'string' ? ref.trim().toLowerCase() : ref;
  let hit: { id: number } | undefined;
  if (s === 'backlog' || s === 'none') {
    if (opts.allowBacklog !== false) return null;
  } else if (s === 'active' || s === 'current') hit = list.find((x) => x.state === 'ACTIVE');
  else if (s === 'next') hit = list.find((x) => x.state === 'PLANNED');
  else if (typeof s === 'number') hit = list.find((x) => x.id === s);
  else hit = list.find((x) => x.name.toLowerCase() === s) ?? (/^\d+$/.test(s) ? list.find((x) => x.id === Number(s)) : undefined);
  if (!hit) {
    throw new AppError(`Sprint "${String(ref)}" not found (open sprints: ${list.map((x) => `${x.name} [${x.state}] #${x.id}`).join(', ') || 'none'})`, 400, 'WORK_BAD_SPRINT');
  }
  return hit.id;
}

// ─── Tệp từ link ─────────────────────────────────────────────────

const TRAN_TEP = issues.MAX_ATTACHMENT_BYTES;

/** LoiTai ⇒ AppError đọc được (model chép lại cho người dùng). */
function loiTai(e: unknown, loai: LoaiNguon): AppError {
  if (e instanceof AppError) return e;
  const { msg, code } = loiChoNguoi(e, loai);
  return new AppError(msg, code === 'WORK_URL_FETCH_FAILED' ? 502 : 400, code);
}

/** Tên ảnh từ alt nếu alt trông như tên tệp ("oopif-q3.png"). */
const tenTuAlt = (alt?: string) => (alt && /^[^\\/:*?"<>|\s][^\\/:*?"<>|]{0,120}\.(png|jpe?g|gif|webp|svg|bmp)$/i.test(alt.trim()) ? alt.trim() : undefined);

const gdocImages = defineTool({
  name: 'gdoc_images', title: 'List images in a Google Doc or web page', group: 'issues',
  description: 'Lists the images embedded in a PUBLIC Google Doc ("Anyone with the link") or a public web page, numbered 1…, with alt text and size. A Google Drawings link gives its PNG. Then attach one with attach_from_url {url: the same link, image: <number>}. Use it when the user wants a diagram/screenshot that sits inside a doc.',
  write: false, surfaces: { ask: false, builtin: false },
  input: z.object({ url: z.string().min(8).max(2100).describe('Google Docs / Drawings link or a web page URL') }),
  run: async (_ctx, a) => {
    let r: Awaited<ReturnType<typeof anhCuaLink>>;
    try {
      r = await anhCuaLink(a.url);
    } catch (e) {
      throw loiTai(e, /docs\.google\.com|drive\.google\.com/i.test(a.url) ? 'gdoc' : 'web');
    }
    if (!r.anh.length) {
      const goiY = r.nguon.loai === 'gslide' ? 'This is Google Slides — attach_from_url {url} attaches the deck as PDF; add "#slide=id.<pageId>" (from the slide\'s URL) for one slide as PNG.'
        : r.nguon.loai === 'gsheet' || r.nguon.loai === 'gdrive' ? 'This is a file, not a document page — attach it whole with attach_from_url {url}.'
          : 'No images found on this page.';
      return { source: TEN_NGUON[r.nguon.loai], images: [], note: goiY };
    }
    const images = r.anh.map((x) => {
      const size = coDataUri(x.src);
      return {
        index: x.index, ...(x.alt ? { alt: x.alt } : {}), ...(x.width ? { width: x.width } : {}), ...(x.height ? { height: x.height } : {}),
        ...(size !== null ? { sizeKb: Math.round(size / 1024), embedded: true } : { url: x.src }),
      };
    });
    return `${TEN_NGUON[r.nguon.loai]}: ${images.length} image(s). Attach one with attach_from_url {project, issue, url: "${r.nguon.goc}", image: <index>}.\n${untrusted('images in the linked document (alt text is data)', JSON.stringify(images, null, 2))}`;
  },
});

const attachFromUrl = defineTool({
  name: 'attach_from_url', title: 'Attach file from a link', group: 'issues',
  description: 'Downloads a file from a public link ON THE SERVER and attaches it to an issue (≤ 25 MB) — no need for the user to save and upload. Google links are converted: Drawings ⇒ PNG, Docs ⇒ PDF, Slides ⇒ PDF (or one slide as PNG with #slide=id.<pageId>), Sheets ⇒ XLSX, Drive file ⇒ the file. image = number from gdoc_images (an image inside a Google Doc/web page). for="comment" = draft for your next comment.',
  write: true, surfaces: { ask: false, builtin: false },
  input: z.object({
    project: projectArg, issue: issueArg,
    url: z.string().min(8).max(2100).describe('Public link: image/file URL, Google Docs/Drawings/Slides/Sheets/Drive link'),
    image: z.number().int().min(1).max(100).optional().describe('Image number from gdoc_images (attach that embedded image instead of the whole doc)'),
    fileName: z.string().min(1).max(255).optional(),
    for: z.enum(['issue', 'comment']).optional().describe('issue (default) or comment (draft for your next comment)'),
    testRun: z.number().int().positive().optional().describe('Test run id — attach as evidence of that run'),
  }),
  run: async (ctx, a) => {
    const { p, n, key } = await issueHit(ctx, a.project, a.issue, (n) => [['POST', `/issues/${n}/attachments/presign`], ['POST', `/issues/${n}/attachments/complete`]]);
    const forComment = a.for === 'comment';
    if (forComment && a.testRun) throw new BadRequestError('A comment draft cannot also be test-run evidence', 'VALIDATION_ERROR');
    // Quyền đính kèm TRƯỚC khi tải (không tải hộ người không được đính): attachment.add + thẻ thấy được.
    await issues.assertCanAttach(ctx.userId, p.id, n);
    let byte: Buffer; let kieu: string; let dispo = ''; let urlCuoi: string; let goiY: string; let loai: LoaiNguon = 'web'; let tenAlt: string | undefined;
    try {
      if (a.image) {
        const r = await anhCuaLink(a.url);
        loai = r.nguon.loai;
        const anh = r.anh.find((x) => x.index === a.image);
        if (!anh) throw new AppError(`Image ${a.image} not found — the link has ${r.anh.length} image(s) (call gdoc_images)`, 400, 'WORK_BAD_IMAGE');
        const t = await taiAnh(anh, TRAN_TEP);
        ({ byte, kieu, dispo } = t);
        urlCuoi = t.url || r.nguon.goc;
        goiY = `image-${a.image}`;
        tenAlt = tenTuAlt(anh.alt);
      } else {
        const t = await taiTepTuLink(a.url, TRAN_TEP);
        loai = t.nguon.loai;
        byte = t.kq.byte; kieu = t.kq.kieu; dispo = t.kq.dispo; urlCuoi = t.kq.url;
        goiY = loai === 'gdrawing' ? 'drawing' : 'file';
      }
    } catch (e) {
      throw loiTai(e, loai === 'web' && /docs\.google\.com|drive\.google\.com/i.test(a.url) ? 'gdoc' : loai);
    }
    if (byte.length > TRAN_TEP) throw loiTai(new LoiTai('too large', 'QUA_LON'), loai);
    const { fileName, contentType } = tenVaKieu({ ten: a.fileName ?? tenAlt, dispo, url: urlCuoi, kieu, goiY });
    const pre = await issues.presignAttachment(ctx.userId, p.id, n, { fileName, contentType, size: byte.length, forComment });
    await putObject(pre.key, byte, contentType, 'private, max-age=0');
    const att = await issues.completeAttachment(ctx.userId, p.id, n, { key: pre.key, fileName, forComment, runId: forComment ? null : a.testRun ?? null });
    await touchLease(ctx, await issueIdOf(p.id, n));
    return {
      attachmentId: att.id, issue: key, fileName: att.fileName, size: att.size, contentType, source: TEN_NGUON[loai],
      ...(forComment ? { for: 'comment', next: 'Pass attachmentId in comment.attachments' } : {}), ...(a.testRun ? { testRun: a.testRun } : {}),
    };
  },
});

// ─── Liên kết · cờ · theo dõi · web link ─────────────────────────

const LINK_ARG = ['blocks', 'is_blocked_by', 'relates', 'duplicates', 'clones', 'tests'] as const;
const KEY_RE = /^([A-Za-z][A-Za-z0-9_]{0,19})-(\d{1,9})$/;

const issueLink = defineTool({
  name: 'issue_link', title: 'Link two issues', group: 'issues',
  description: 'Links this issue to another (same workspace): blocks, is_blocked_by, relates, duplicates, clones, tests. target = issue key like "NT-14".',
  write: true,
  input: z.object({ project: projectArg, issue: issueArg, type: z.enum(LINK_ARG), target: z.string().min(3).max(32).describe('Issue key, e.g. "NT-14"') }),
  run: async (ctx, a) => {
    const m = KEY_RE.exec(a.target.trim());
    if (!m) throw new BadRequestError(`"${a.target}" is not an issue key like NT-14`, 'WORK_BAD_KEY');
    if (a.type === 'is_blocked_by') {
      // Chiều ngược: lưu thành "<target> BLOCKS <issue>" ⇒ quyền sửa thẻ ĐÍCH (như bấm từ thẻ đó trên web).
      const here = await issueHit(ctx, a.project, a.issue, (n) => [['GET', `/issues/${n}`]]);
      const tn = Number(m[2]);
      const tp = await projectFor(ctx, `${here.p.workspaceSlug}/${m[1].toUpperCase()}`, [['POST', `/issues/${tn}/links`]]);
      await issues.addLink(ctx.userId, tp.id, tn, { type: 'BLOCKS', targetKey: here.key });
      return { issue: here.key, linked: `${tp.key}-${tn} blocks ${here.key}` };
    }
    const { p, n, key } = await issueHit(ctx, a.project, a.issue, (n) => [['POST', `/issues/${n}/links`]]);
    const type = a.type.toUpperCase() as LinkType;
    if (!(LINK_TYPES as readonly string[]).includes(type)) throw new BadRequestError('Unknown link type', 'VALIDATION_ERROR');
    const l = await issues.addLink(ctx.userId, p.id, n, { type, targetKey: a.target.trim() });
    await touchLease(ctx, await issueIdOf(p.id, n));
    return { issue: key, linkId: l.id, linked: `${key} ${a.type} ${a.target.trim().toUpperCase()}` };
  },
});

const issueUnlink = defineTool({
  name: 'issue_unlink', title: 'Remove an issue link', group: 'issues',
  description: 'Removes the link between this issue and target (either direction). Pass type when the two issues have several links.',
  write: true,
  input: z.object({ project: projectArg, issue: issueArg, target: z.string().min(3).max(32), type: z.enum(LINK_ARG).optional() }),
  run: async (ctx, a) => {
    // Id liên kết chưa biết khi chốt tuyến — luật tuyến chỉ xét dạng đường dẫn, nên dùng id giữ chỗ.
    const { p, n, key } = await issueHit(ctx, a.project, a.issue, (n) => [['DELETE', `/issues/${n}/links/1`]]);
    const m = KEY_RE.exec(a.target.trim());
    if (!m) throw new BadRequestError(`"${a.target}" is not an issue key like NT-14`, 'WORK_BAD_KEY');
    const here = await issueIdOf(p.id, n);
    const target = await prisma.workIssue.findFirst({
      where: { number: Number(m[2]), deletedAt: null, project: { key: m[1].toUpperCase(), workspaceId: p.workspaceId, deletedAt: null } }, select: { id: true },
    });
    if (!here || !target) throw new NotFoundError(`Issue ${!here ? key : a.target.toUpperCase()} not found`);
    const type = a.type ? (a.type === 'is_blocked_by' ? 'BLOCKS' : a.type.toUpperCase()) : undefined;
    const links = await prisma.workIssueLink.findMany({
      where: {
        OR: a.type === 'is_blocked_by' ? [{ fromIssueId: target.id, toIssueId: here }]
          : a.type === 'blocks' ? [{ fromIssueId: here, toIssueId: target.id }]
            : [{ fromIssueId: here, toIssueId: target.id }, { fromIssueId: target.id, toIssueId: here }],
        ...(type ? { type } : {}),
      },
      select: { id: true, type: true },
    });
    if (!links.length) throw new NotFoundError(`${key} has no${a.type ? ` ${a.type}` : ''} link to ${a.target.toUpperCase()}`);
    if (links.length > 1) throw new AppError(`${key} has ${links.length} links to ${a.target.toUpperCase()} (${links.map((l) => l.type.toLowerCase()).join(', ')}) — pass type`, 400, 'WORK_AMBIGUOUS_LINK');
    await issues.removeLink(ctx.userId, p.id, n, links[0].id);
    return { issue: key, removed: `${links[0].type.toLowerCase()} ${a.target.toUpperCase()}` };
  },
});

const issueFlag = defineTool({
  name: 'issue_flag', title: 'Flag or unflag an issue as blocked', group: 'issues',
  description: 'flagged=true marks the issue Blocked (badge on the board) with a reason; flagged=false clears it.',
  write: true,
  input: z.object({ project: projectArg, issue: issueArg, flagged: z.boolean(), reason: z.string().min(1).max(450).optional() }),
  run: async (ctx, a) => {
    const { p, n, key } = await issueHit(ctx, a.project, a.issue, (n) => [[a.flagged ? 'PUT' : 'DELETE', `/issues/${n}/flag`]]);
    if (a.flagged && !a.reason?.trim()) throw new BadRequestError('A reason is required to flag an issue', 'VALIDATION_ERROR');
    await issues.setIssueFlag(ctx.userId, p.id, n, a.flagged ? { flagged: true, reason: a.reason!.trim() } : { flagged: false });
    await touchLease(ctx, await issueIdOf(p.id, n));
    return { issue: key, flagged: a.flagged };
  },
});

const issueWatch = defineTool({
  name: 'issue_watch', title: 'Watch or unwatch an issue', group: 'issues',
  description: 'on=true: you get notifications for this issue; on=false: stop watching.',
  write: true,
  input: z.object({ project: projectArg, issue: issueArg, on: z.boolean() }),
  run: async (ctx, a) => {
    const { p, n, key } = await issueHit(ctx, a.project, a.issue, (n) => [[a.on ? 'PUT' : 'DELETE', `/issues/${n}/watch`]]);
    await issues.setWatching(ctx.userId, p.id, n, a.on);
    return { issue: key, watching: a.on };
  },
});

const issueWebLinkAdd = defineTool({
  name: 'issue_web_link_add', title: 'Add a web link to an issue', group: 'issues',
  description: 'Adds a web link (Google Doc, Figma, GitHub PR, report…) to the issue\'s Web links. To store the file itself use attach_from_url.',
  write: true,
  input: z.object({ project: projectArg, issue: issueArg, url: z.string().min(4).max(2100), title: z.string().max(300).optional() }),
  run: async (ctx, a) => {
    const { p, n, key } = await issueHit(ctx, a.project, a.issue, (n) => [['POST', `/issues/${n}/web-links`]]);
    const list = await resources.addWebLink(ctx.userId, p.id, n, { url: a.url, title: a.title ?? null });
    await touchLease(ctx, await issueIdOf(p.id, n));
    return { issue: key, added: a.url, webLinks: Array.isArray(list) ? list.length : undefined };
  },
});

// ─── Thành viên dự án · lời mời không gian ───────────────────────

const roleArg = z.enum(PROJECT_ROLES);

async function nguoiTrongKhongGian(p: ProjectHit, ref: string): Promise<{ id: number; username: string; email: string } | null> {
  const u = await timNguoi(ref);
  if (!u) return null;
  const m = await prisma.workMember.findFirst({ where: { workspaceId: p.workspaceId, userId: u.id }, select: { userId: true } });
  return m ? u : null;
}

const projectMemberAdd = defineTool({
  name: 'project_member_add', title: 'Add a person to the project', group: 'planning',
  description: 'Project admins: adds a person to this project with a role (ADMIN, MEMBER, VIEWER, TEACHER, CLIENT; default MEMBER). Someone not yet in the workspace is invited by email (workspace admins only).',
  write: true, personOnly: true, surfaces: { builtin: false },
  input: z.object({ project: projectArg, user: userArg, role: roleArg.optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    await chiNguoi(ctx, 'manage project members');
    const role = a.role ?? 'MEMBER';
    const p = await projectFor(ctx, a.project, [['PUT', '/members/0']]);
    const u = await nguoiTrongKhongGian(p, a.user);
    if (u) {
      await projects.setProjectMember(ctx.userId, p.id, u.id, role);
      await auditProject(p.id, { actorId: ctx.userId, action: 'project.member_role', targetType: 'user', targetId: u.id, summary: `Set @${u.username}'s project role to ${role}` });
      return { project: p.key, user: u.username, role, status: 'ADDED' };
    }
    if (!a.user.includes('@')) throw new AppError(`"${a.user}" is not in this workspace — pass their email to invite them`, 400, 'WORK_NOT_IN_WORKSPACE');
    const r = await workspaces.inviteByEmail(ctx.userId, p.workspaceId, { emails: [a.user.trim()], role: 'MEMBER', projectId: p.id, projectRole: role });
    return { project: p.key, email: a.user.trim(), role, status: r[0]?.status ?? 'INVITED' };
  },
});

const projectMemberSetRole = defineTool({
  name: 'project_member_set_role', title: 'Change a project member\'s role', group: 'planning',
  description: 'Project admins: changes a person\'s role in this project (ADMIN, MEMBER, VIEWER, TEACHER, CLIENT).',
  write: true, personOnly: true, surfaces: { builtin: false },
  input: z.object({ project: projectArg, user: userArg, role: roleArg }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    await chiNguoi(ctx, 'manage project members');
    const p = await projectFor(ctx, a.project, [['PUT', '/members/0']]);
    const u = await nguoiTrongKhongGian(p, a.user);
    if (!u) throw new AppError(`"${a.user}" is not in this workspace`, 400, 'WORK_NOT_IN_WORKSPACE');
    await projects.setProjectMember(ctx.userId, p.id, u.id, a.role);
    await auditProject(p.id, { actorId: ctx.userId, action: 'project.member_role', targetType: 'user', targetId: u.id, summary: `Set @${u.username}'s project role to ${a.role}` });
    return { project: p.key, user: u.username, role: a.role };
  },
});

const projectMemberRemove = defineTool({
  name: 'project_member_remove', title: 'Remove a person from the project', group: 'planning',
  description: 'Project admins: removes a person\'s project role (they stay in the workspace; in a workspace-visible project workspace members still see it).',
  write: true, personOnly: true, surfaces: { builtin: false },
  input: z.object({ project: projectArg, user: userArg }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    await chiNguoi(ctx, 'manage project members');
    const p = await projectFor(ctx, a.project, [['DELETE', '/members/0']]);
    const u = await nguoiTrongKhongGian(p, a.user);
    if (!u) throw new AppError(`"${a.user}" is not in this workspace`, 400, 'WORK_NOT_IN_WORKSPACE');
    await projects.removeProjectMember(ctx.userId, p.id, u.id);
    await auditProject(p.id, { actorId: ctx.userId, action: 'project.member_remove', targetType: 'user', targetId: u.id, summary: `Removed @${u.username} from the project` });
    return { project: p.key, removed: u.username };
  },
});

const workspaceInvite = defineTool({
  name: 'workspace_invite', title: 'Invite people to a workspace', group: 'planning',
  description: 'Workspace owners/admins: invites people by email (existing accounts are added at once, others get an invite email). Optional project + projectRole puts them straight into that project.',
  write: true, personOnly: true, surfaces: { builtin: false },
  input: z.object({
    workspace: z.string().min(1).max(80).describe('Workspace slug'),
    emails: z.array(z.string().email()).min(1).max(20),
    role: z.enum(WORKSPACE_ROLES.filter((r) => r !== 'OWNER') as ['ADMIN', 'MEMBER', 'GUEST']).optional().describe('ADMIN | MEMBER (default) | GUEST'),
    project: z.string().min(1).max(20).optional().describe('Project key to add them to'),
    projectRole: roleArg.optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const ws = await prisma.workSpace.findFirst({ where: { slug: a.workspace.trim(), deletedAt: null, members: { some: { userId: ctx.userId } } }, select: { id: true, slug: true } });
    if (!ws) throw new NotFoundError(`Workspace "${a.workspace}" not found, or you are not a member of it.`);
    if (ctx.agent && !agentTopRouteAllowed('POST', `/workspaces/${ws.id}/invites`, !!ctx.agent.projectIds)) throw await agentForbidden(ctx.agent.userId, 'invite people');
    let projectId: number | null = null;
    if (a.project) projectId = (await projectFor(ctx, `${ws.slug}/${a.project}`, [['GET', '']])).id;
    const r = await workspaces.inviteByEmail(ctx.userId, ws.id, { emails: a.emails, role: a.role ?? 'MEMBER', projectId, projectRole: projectId ? a.projectRole ?? 'MEMBER' : null });
    return { workspace: ws.slug, results: r };
  },
});

// ─── Sprint ──────────────────────────────────────────────────────

const sprintCreate = defineTool({
  name: 'sprint_create', title: 'Create a sprint', group: 'planning',
  description: 'Creates a new (not started) sprint. Needs sprint management (project admin, or members when the project allows it).',
  write: true, personOnly: true, surfaces: { builtin: false },
  input: z.object({ project: projectArg, name: z.string().min(1).max(100).optional(), goal: z.string().max(5000).optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/sprints']]);
    const s = await sprints.createSprint(ctx.userId, p.id, { name: a.name, goal: a.goal ?? null }) as { id: number; name: string; state: string };
    return { project: p.key, sprint: { id: s.id, name: s.name, state: s.state } };
  },
});

const sprintStart = defineTool({
  name: 'sprint_start', title: 'Start a sprint', group: 'planning',
  description: 'Starts a sprint that has not started (default "next"). Length: endDate, or weeks (default 2) from startDate (default today).',
  write: true, personOnly: true, surfaces: { builtin: false },
  input: z.object({
    project: projectArg, sprint: sprintRefArg.optional().describe('"next" (default) | sprint name | id'),
    startDate: ymd.optional(), endDate: ymd.optional(), weeks: z.number().int().min(1).max(8).optional(), goal: z.string().max(5000).optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p0 = await projectFor(ctx, a.project, [['GET', '/sprints']]);
    const sid = await sprintIdOf(ctx, p0.id, a.sprint ?? 'next', { allowBacklog: false });
    const p = await projectFor(ctx, a.project, [['POST', `/sprints/${sid}/start`]]);
    const startAt = a.startDate ? new Date(`${a.startDate}T00:00:00.000Z`) : new Date();
    const endAt = a.endDate ? new Date(`${a.endDate}T23:59:00.000Z`) : new Date(startAt.getTime() + (a.weeks ?? 2) * 7 * 86_400_000);
    if (endAt <= startAt) throw new BadRequestError('endDate must be after startDate', 'VALIDATION_ERROR');
    const s = await sprints.startSprint(ctx.userId, p.id, sid!, { startAt, endAt, ...(a.goal !== undefined ? { goal: a.goal } : {}) }) as { id: number; name: string; state: string; endAt?: Date | null };
    return { project: p.key, sprint: { id: s.id, name: s.name, state: s.state, endAt: s.endAt ?? endAt } };
  },
});

const sprintComplete = defineTool({
  name: 'sprint_complete', title: 'Complete the sprint', group: 'planning',
  description: 'Completes the running sprint. Unfinished issues move to moveOpenTo: "backlog" (default), "next" (next sprint, created if none) or a sprint name/id.',
  write: true, personOnly: true, surfaces: { builtin: false },
  input: z.object({ project: projectArg, sprint: sprintRefArg.optional().describe('Default: the active sprint'), moveOpenTo: sprintRefArg.optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p0 = await projectFor(ctx, a.project, [['GET', '/sprints']]);
    const sid = (await sprintIdOf(ctx, p0.id, a.sprint ?? 'active', { allowBacklog: false }))!;
    const p = await projectFor(ctx, a.project, [['POST', `/sprints/${sid}/complete`]]);
    const to = a.moveOpenTo === undefined ? 'backlog' : String(a.moveOpenTo).trim().toLowerCase();
    let moveTo: 'backlog' | 'new' | number;
    if (to === 'backlog') moveTo = 'backlog';
    else if (to === 'next' || to === 'new') {
      const list = await sprints.listSprints(ctx.userId, p.id);
      moveTo = list.find((x) => x.state === 'PLANNED' && x.id !== sid)?.id ?? 'new';
    } else moveTo = (await sprintIdOf(ctx, p.id, a.moveOpenTo!, { allowBacklog: false }))!;
    const r = await sprints.completeSprint(ctx.userId, p.id, sid, moveTo);
    return { project: p.key, completed: sid, movedOpenTo: moveTo, ...(r && typeof r === 'object' ? { result: r } : {}) };
  },
});

// ─── Giao việc cho người khác (dùng chung với issue_assign) ──────

/**
 * Giao thẻ cho `to` (id hoặc null) đúng như web: người sửa được thẻ ⇒ updateIssueAs; trưởng bộ phận của thẻ (kể cả
 * vai VIEWER) ⇒ đường hàng đợi bộ phận (teams.assignFromQueue, canAssignTeamIssue). Agent: service chỉ cho tự nhận/thả.
 */
export async function assignIssue(ctx: McpCtx, p: ProjectHit, n: number, to: number | null): Promise<void> {
  const cur = await prisma.workIssue.findFirst({ where: { projectId: p.id, number: n, deletedAt: null }, select: { id: true, assigneeId: true, version: true, teamId: true } });
  if (!cur) throw new NotFoundError('Issue not found');
  if (!ctx.agent && !can(p.access.role, 'issue.edit', p.access.options) && cur.teamId) {
    await teams.assignFromQueue(ctx.userId, p.workspaceId, cur.teamId, cur.id, to);
    return;
  }
  if (!ctx.agent && !can(p.access.role, 'issue.edit', p.access.options)) throw new ForbiddenError('Your role in this project cannot assign issues');
  await issues.updateIssueAs(ctx.userId, p.id, n, { assigneeId: to }, cur.version);
}

export const PERSON_OPS_COMMANDS: ToolDef[] = [
  gdocImages, attachFromUrl, issueLink, issueUnlink, issueFlag, issueWatch, issueWebLinkAdd,
  projectMemberAdd, projectMemberSetRole, projectMemberRemove, workspaceInvite, sprintCreate, sprintStart, sprintComplete,
];
