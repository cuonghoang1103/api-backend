/**
 * CT Work — đợt S4 (04/10/2026): SAO LƯU / XUẤT TRỌN DỰ ÁN (ZIP).
 *
 * Không phải mô-đun: chỉ ADMIN dự án (khách không bao giờ — tuyến /exports nằm ngoài danh sách trắng
 * cổng khách ⇒ 403 CLIENT_PORTAL_ONLY; vai CLIENT/GUEST ở dự án không bật cổng ⇒ 403 ở đây).
 *
 * Định dạng (`formatVersion: 1`, `format: "ctwork-project-export"`):
 *   manifest.json            — phiên bản định dạng, dự án, thời điểm, số dòng từng bảng, danh sách tệp
 *   data/<bảng>.json         — mỗi bảng một tệp, dòng nguyên văn từ DB (ngày dạng ISO), khoá bí mật đã
 *                              xoá (secret/token của GitHub/GitLab, URL webhook chat, token link công khai)
 *   attachments/manifest.json — mọi tệp đính kèm: id, thẻ, key R2, tên, kiểu, cỡ, có kèm nội dung không
 *   files/<id>-<tên>         — nội dung tệp, CHỈ khi người xuất chọn và tổng ≤ WORK_EXPORT_MAX_FILE_MB (mặc định
 *                              VÀ trần 200)
 *
 * Không xuất: lời mời đang chờ (email + mã băm), khoá chỉnh sửa cá nhân, hội thoại AI riêng tư của người
 * khác (visibility PRIVATE). Người dùng chỉ có trường công khai (không email — common.PUBLIC_USER).
 *
 * NHẬP LẠI (đợt S5c): projectImport.service.ts — tạo dự án MỚI từ tệp này. Từ S5c manifest có thêm `checksums`
 * (SHA-256 từng tệp data/*.json + attachments/manifest.json) và `users[].emailHash` (+ `userHashSalt`) — vẫn
 * `formatVersion: 1` (chỉ thêm trường tuỳ chọn; tệp cũ thiếu chúng vẫn nhập được).
 *
 * LƯU TRỮ = Cloudflare R2, KHÔNG BAO GIỜ đĩa VPS (VPS từng chết vì đầy đĩa — Postgres chung đĩa). ZIP dựng
 * THEO LUỒNG (JSZip generateNodeStream, tệp đính kèm đọc lười từ R2 từng cái một) ra MỘT tệp tạm trong
 * os.tmpdir(), upload lên R2 key `work-exports/<projectId>/<exportId>.zip`, rồi XOÁ tệp tạm trong `finally`
 * (cả khi lỗi). R2 chưa cấu hình ⇒ 503 WORK_EXPORT_NO_STORAGE (không rơi về đĩa). Chạy đồng thời: tối đa 1
 * lần xuất / dự án (409) và 2 / toàn hệ thống (429). Tải: link HMAC 15 phút (kiểm lại ADMIN lúc bấm) ⇒ 302 sang
 * presigned URL R2 hạn 5 phút. Hết 72 giờ ⇒ cron xoá object R2 (EXPIRED). Cột `file_path` giữ KEY R2.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { GetObjectCommand, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import JSZip from 'jszip';
import { config } from '../../config/env.js';
import { prisma } from '../../config/database.js';
import { deleteObject, getR2Client, getSignedDownloadUrl } from '../../config/r2.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { PUBLIC_USER } from './common.js';
import { requireProject } from './permissions.js';

export const EXPORT_FORMAT = 'ctwork-project-export';
export const EXPORT_FORMAT_VERSION = 1;
const EXPIRY_HOURS = 72;
const LINK_TTL_S = 15 * 60;
const PRESIGN_TTL_S = 5 * 60;
const MAX_FILE_MB = 200;
const MAX_RUNNING_GLOBAL = 2;

/** Giới hạn tổng tệp đính kèm được KÈM nội dung: env WORK_EXPORT_MAX_FILE_MB, mặc định và TRẦN 200 MB. */
function maxFileBytes(): number {
  const mb = Number(process.env.WORK_EXPORT_MAX_FILE_MB ?? MAX_FILE_MB);
  return Math.min(Number.isFinite(mb) && mb >= 0 ? mb : MAX_FILE_MB, MAX_FILE_MB) * 1024 * 1024;
}

export const exportKey = (projectId: number, exportId: number) => `work-exports/${projectId}/${exportId}.zip`;

// ─── Kho lưu (R2) — tách thành giao diện để test thay bằng kho giả ───

export interface ExportStore {
  enabled(): boolean;
  /** Kích thước object, hoặc null khi không có. */
  head(key: string): Promise<number | null>;
  read(key: string): Promise<Readable>;
  /** Upload một tệp trên đĩa (đọc theo luồng). */
  putFile(key: string, filePath: string, size: number, contentType: string): Promise<void>;
  signedUrl(key: string, ttlSeconds: number, fileName: string): Promise<string>;
  remove(key: string): Promise<void>;
}

export const r2ExportStore: ExportStore = {
  enabled: () => config.r2.enabled,
  async head(key) {
    try {
      const r = await getR2Client().send(new HeadObjectCommand({ Bucket: config.r2.bucketName, Key: key }));
      return Number(r.ContentLength ?? 0);
    } catch {
      return null;
    }
  },
  async read(key) {
    const r = await getR2Client().send(new GetObjectCommand({ Bucket: config.r2.bucketName, Key: key }));
    return r.Body as Readable;
  },
  async putFile(key, filePath, size, contentType) {
    await getR2Client().send(new PutObjectCommand({
      Bucket: config.r2.bucketName, Key: key, Body: fs.createReadStream(filePath), ContentLength: size,
      ContentType: contentType, CacheControl: 'private, no-store',
    }));
  },
  signedUrl: (key, ttl, fileName) => getSignedDownloadUrl(key, ttl, fileName),
  remove: (key) => deleteObject(key),
};

let store: ExportStore = r2ExportStore;
/** Chỉ cho test: thay kho R2 bằng kho giả (null ⇒ về R2 thật). */
export function _setExportStoreForTests(s: ExportStore | null): void {
  store = s ?? r2ExportStore;
}

function assertStorage() {
  if (!store.enabled()) {
    throw new AppError('Project export needs cloud storage (Cloudflare R2), which is not configured on this server', 503, 'WORK_EXPORT_NO_STORAGE');
  }
}

async function adminCtx(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  if (access.role !== 'ADMIN' || access.workspaceRole === 'GUEST') {
    throw new ForbiddenError('Only project admins can export the whole project');
  }
  return access;
}

// ─── Bảng cần xuất ────────────────────────────────────────────────

type Rows = Array<Record<string, unknown>>;
type Loader = (pid: number, ctx: { issueIds: number[] }) => Promise<Rows>;

/** Xoá giá trị bí mật trong một dòng (theo tên cột). */
const REDACT: Record<string, string[]> = {
  githubConnection: ['secret'],
  gitlabConnection: ['token'],
  chatHooks: ['url'],
  publicLinks: ['token'],
};

const byIssue = (ctx: { issueIds: number[] }) => ({ issueId: { in: ctx.issueIds.length ? ctx.issueIds : [-1] } });

/**
 * Danh sách bảng theo thứ tự nhập lại về sau (cha trước con). Thêm bảng mới của CT Work có projectId
 * ⇒ thêm vào đây (work.s4.db.test.ts kiểm "đủ bảng").
 */
export const EXPORT_TABLES: Array<[name: string, load: Loader]> = [
  ['project', async (pid) => [await prisma.workProject.findUniqueOrThrow({ where: { id: pid } }) as unknown as Record<string, unknown>]],
  ['projectMembers', (pid) => prisma.workProjectMember.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['workflows', (pid) => prisma.workWorkflow.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['statuses', (pid) => prisma.workStatus.findMany({ where: { workflow: { projectId: pid } } }) as unknown as Promise<Rows>],
  ['transitions', (pid) => prisma.workTransition.findMany({ where: { workflow: { projectId: pid } } }) as unknown as Promise<Rows>],
  ['issueTypes', (pid) => prisma.workIssueType.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['labels', (pid) => prisma.workLabel.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['components', (pid) => prisma.workComponent.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['customFields', (pid) => prisma.workCustomField.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['sprints', (pid) => prisma.workSprint.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['sprintSnapshots', (pid) => prisma.workSprintSnapshot.findMany({ where: { sprint: { projectId: pid } } }) as unknown as Promise<Rows>],
  ['versions', (pid) => prisma.workVersion.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['stages', (pid) => prisma.workStage.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['teams', (pid) => prisma.workTeam.findMany({ where: { issues: { some: { projectId: pid } } } }) as unknown as Promise<Rows>],
  ['issues', (pid) => prisma.workIssue.findMany({ where: { projectId: pid }, orderBy: { number: 'asc' } }) as unknown as Promise<Rows>],
  ['issueAliases', (pid) => prisma.workIssueAlias.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['issueLinks', (_pid, c) => prisma.workIssueLink.findMany({ where: { OR: [{ fromIssueId: { in: c.issueIds.length ? c.issueIds : [-1] } }, { toIssueId: { in: c.issueIds.length ? c.issueIds : [-1] } }] } }) as unknown as Promise<Rows>],
  ['issueLabels', (_pid, c) => prisma.workIssueLabel.findMany({ where: byIssue(c) }) as unknown as Promise<Rows>],
  ['issueComponents', (_pid, c) => prisma.workIssueComponent.findMany({ where: byIssue(c) }) as unknown as Promise<Rows>],
  ['customValues', (_pid, c) => prisma.workCustomValue.findMany({ where: byIssue(c) }) as unknown as Promise<Rows>],
  ['comments', (_pid, c) => prisma.workComment.findMany({ where: byIssue(c) }) as unknown as Promise<Rows>],
  ['commentReactions', (_pid, c) => prisma.workCommentReaction.findMany({ where: { comment: byIssue(c) } }) as unknown as Promise<Rows>],
  ['attachments', (_pid, c) => prisma.workAttachment.findMany({ where: byIssue(c) }) as unknown as Promise<Rows>],
  // CTW đợt 5b K-1: độ dài + phiên âm voice note (audio đi cùng tệp đính kèm).
  ['voiceNotes', (_pid, c) => prisma.workVoiceNote.findMany({ where: { attachment: byIssue(c) } }) as unknown as Promise<Rows>],
  ['history', (_pid, c) => prisma.workHistory.findMany({ where: byIssue(c), orderBy: { id: 'asc' } }) as unknown as Promise<Rows>],
  ['watchers', (_pid, c) => prisma.workWatcher.findMany({ where: byIssue(c) }) as unknown as Promise<Rows>],
  ['worklogs', (_pid, c) => prisma.workWorklog.findMany({ where: byIssue(c) }) as unknown as Promise<Rows>],
  ['testCases', (_pid, c) => prisma.workTestCase.findMany({ where: byIssue(c) }) as unknown as Promise<Rows>],
  ['testSteps', (_pid, c) => prisma.workTestStep.findMany({ where: { testCase: byIssue(c) } }) as unknown as Promise<Rows>],
  ['testPlans', (pid) => prisma.workTestPlan.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['testPlanCases', (pid) => prisma.workTestPlanCase.findMany({ where: { plan: { projectId: pid } } }) as unknown as Promise<Rows>],
  ['testCycles', (pid) => prisma.workTestCycle.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['testRuns', (pid) => prisma.workTestRun.findMany({ where: { cycle: { projectId: pid } } }) as unknown as Promise<Rows>],
  ['testStepResults', (pid) => prisma.workTestStepResult.findMany({ where: { run: { cycle: { projectId: pid } } } }) as unknown as Promise<Rows>],
  ['testRunDefects', (pid) => prisma.workTestRunDefect.findMany({ where: { run: { cycle: { projectId: pid } } } }) as unknown as Promise<Rows>],
  ['savedFilters', (pid) => prisma.workSavedFilter.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['dashboards', (pid) => prisma.workDashboard.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['automationRules', (pid) => prisma.workAutomationRule.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['automationLogs', (pid) => prisma.workAutomationLog.findMany({ where: { rule: { projectId: pid } }, orderBy: { id: 'desc' }, take: 5000 }) as unknown as Promise<Rows>],
  ['githubConnection', (pid) => prisma.workGithubConnection.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['gitlabConnection', (pid) => prisma.workGitlabConnection.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['devActivity', (pid) => prisma.workDevActivity.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['publicLinks', (pid) => prisma.workPublicLink.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['chatHooks', (pid) => prisma.workChatHook.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['aiThreads', (pid) => prisma.workAiThread.findMany({ where: { projectId: pid, visibility: { not: 'PRIVATE' } } }) as unknown as Promise<Rows>],
  ['aiMessages', (pid) => prisma.workAiMessage.findMany({ where: { thread: { projectId: pid, visibility: { not: 'PRIVATE' } } } }) as unknown as Promise<Rows>],
  ['approvals', (pid) => prisma.workApproval.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['approvalSteps', (pid) => prisma.workApprovalStep.findMany({ where: { approval: { projectId: pid } } }) as unknown as Promise<Rows>],
  ['handoffs', (pid) => prisma.workHandoff.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['pages', (pid) => prisma.workPage.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['pageVersions', (pid) => prisma.workPageVersion.findMany({ where: { page: { projectId: pid } } }) as unknown as Promise<Rows>],
  ['pageIssueLinks', (pid) => prisma.workPageIssueLink.findMany({ where: { page: { projectId: pid } } }) as unknown as Promise<Rows>],
  ['pageComments', (pid) => prisma.workPageComment.findMany({ where: { page: { projectId: pid } } }) as unknown as Promise<Rows>],
  ['uatRequests', (pid) => prisma.workUatRequest.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['changeRequests', (pid) => prisma.workChangeRequest.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['changeRequestLinks', (pid) => prisma.workChangeRequestLink.findMany({ where: { changeRequest: { projectId: pid } } }) as unknown as Promise<Rows>],
  ['raidItems', (pid) => prisma.workRaidItem.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['raidLinks', (pid) => prisma.workRaidLink.findMany({ where: { raid: { projectId: pid } } }) as unknown as Promise<Rows>],
  ['raidHistory', (pid) => prisma.workRaidHistory.findMany({ where: { raid: { projectId: pid } } }) as unknown as Promise<Rows>],
  ['meetings', (pid) => prisma.workMeeting.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['meetingAttendees', (pid) => prisma.workMeetingAttendee.findMany({ where: { meeting: { projectId: pid } } }) as unknown as Promise<Rows>],
  ['meetingActions', (pid) => prisma.workMeetingAction.findMany({ where: { meeting: { projectId: pid } } }) as unknown as Promise<Rows>],
  ['financeSettings', (pid) => prisma.workFinanceSettings.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['rates', (pid) => prisma.workRate.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['timesheets', (pid) => prisma.workTimesheet.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['timesheetLines', (pid) => prisma.workTimesheetLine.findMany({ where: { timesheet: { projectId: pid } } }) as unknown as Promise<Rows>],
  ['budgetLines', (pid) => prisma.workBudgetLine.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['expenses', (pid) => prisma.workExpense.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['paymentMilestones', (pid) => prisma.workPaymentMilestone.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['reportSchedule', (pid) => prisma.workReportSchedule.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['clientReports', (pid) => prisma.workClientReport.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  // Đợt S5a: service desk & SLA.
  ['deskSettings', (pid) => prisma.workDeskSettings.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['deskProblems', (pid) => prisma.workDeskProblem.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['deskTickets', (_pid, c) => prisma.workDeskTicket.findMany({ where: byIssue(c) }) as unknown as Promise<Rows>],
  ['slaEvents', (_pid, c) => prisma.workSlaEvent.findMany({ where: { ticket: byIssue(c) }, orderBy: { id: 'asc' } }) as unknown as Promise<Rows>],
  // Resources (06/10/2026): nhóm + link + Web links trên thẻ.
  ['resourceGroups', (pid) => prisma.workResourceGroup.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['resources', (pid) => prisma.workResource.findMany({ where: { projectId: pid } }) as unknown as Promise<Rows>],
  ['issueWebLinks', (_pid, c) => prisma.workIssueWebLink.findMany({ where: byIssue(c) }) as unknown as Promise<Rows>],
  ['auditLog', (pid) => prisma.workAuditLog.findMany({ where: { projectId: pid }, orderBy: { id: 'asc' } }) as unknown as Promise<Rows>],
];

function redact(table: string, rows: Rows): Rows {
  const keys = REDACT[table];
  if (!keys) return rows;
  return rows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, keys.includes(k) && v ? '[redacted]' : v])));
}

/** Mọi id người xuất hiện trong dữ liệu (cột *Id / *_id trỏ tới người) ⇒ bảng users công khai. */
const USER_COLS = /^(userId|assigneeId|reporterId|leadId|authorId|actorId|uploaderId|createdById|ownerId|requesterId|approverId|organizerId|invitedById|decidedById|lastEditedById|fromUserId|toUserId|updatedById|reopenedById|requestedById|firstResponseById)$/;

function collectUserIds(tables: Record<string, Rows>): number[] {
  const ids = new Set<number>();
  for (const rows of Object.values(tables)) for (const r of rows) for (const [k, v] of Object.entries(r)) if (USER_COLS.test(k) && typeof v === 'number') ids.add(v);
  return [...ids];
}

const json = (v: unknown) => Buffer.from(JSON.stringify(v, (_k, val) => (typeof val === 'bigint' ? Number(val) : val), 2));

/**
 * Luồng đọc LƯỜI: chỉ mở object R2 khi JSZip thật sự đọc tới tệp này — không giữ hàng trăm kết nối mở
 * cùng lúc, và mỗi lúc chỉ một tệp chảy qua bộ nhớ.
 */
function lazyStream(open: () => Promise<Readable>): Readable {
  let src: Readable | null = null;
  let opening = false;
  const out = new Readable({
    read() {
      if (src) { src.resume(); return; }
      if (opening) return;
      opening = true;
      open().then((s) => {
        src = s;
        s.on('data', (c: Buffer) => { if (!out.push(c)) s.pause(); });
        s.on('end', () => out.push(null));
        s.on('error', (e) => out.destroy(e));
      }, (e) => out.destroy(e));
    },
  });
  return out;
}

/** Đợt S5c: băm email để ánh xạ người khi nhập lại (dùng chung với projectImport.service). */
export function emailHash(salt: string, email: string): string {
  return crypto.createHash('sha256').update(`${salt}:${email.trim().toLowerCase()}`).digest('hex');
}
export const sha256Hex = (buf: Buffer) => crypto.createHash('sha256').update(buf).digest('hex');
/** Kho đang dùng (R2 hoặc kho giả của test) — nhập lại (S5c) dùng CHUNG kho với xuất. */
export const exportStore = (): ExportStore => store;

// ─── Chạy một lần xuất ────────────────────────────────────────────

async function progress(id: number, progressPct: number, stage: string) {
  await prisma.workProjectExport.update({ where: { id }, data: { progress: Math.max(0, Math.min(100, Math.round(progressPct))), stage: stage.slice(0, 120) } });
}

/** Tệp tạm của một lần xuất (os.tmpdir — không phải đĩa dữ liệu; xoá trong finally). */
export const exportTempPath = (exportId: number) => path.join(os.tmpdir(), `ctwork-export-${exportId}-${process.pid}.zip`);

/** Dựng ZIP (gọi trong nền) ⇒ R2. Lỗi ⇒ FAILED + error, không ném ra ngoài. Tệp tạm LUÔN bị xoá. */
export async function runExport(exportId: number): Promise<void> {
  const ex = await prisma.workProjectExport.findUnique({ where: { id: exportId } });
  if (!ex || ex.status !== 'QUEUED') return;
  await prisma.workProjectExport.update({ where: { id: exportId }, data: { status: 'RUNNING', startedAt: new Date(), progress: 1, stage: 'Starting' } });
  const tmp = exportTempPath(exportId);
  try {
    assertStorage();
    const pid = ex.projectId;
    const project = await prisma.workProject.findUniqueOrThrow({ where: { id: pid }, select: { key: true, name: true, workspaceId: true, workspace: { select: { slug: true, name: true } } } });
    const issueIds = (await prisma.workIssue.findMany({ where: { projectId: pid }, select: { id: true } })).map((i) => i.id);
    const tables: Record<string, Rows> = {};
    let i = 0;
    for (const [name, load] of EXPORT_TABLES) {
      // CTW-6: bỏ cột sinh tự động (title_fold…) — dữ liệu suy ra, CSDL đích tự tính lại.
      tables[name] = redact(name, (await load(pid, { issueIds })).map(({ titleFold: _t, descriptionFold: _d, contentFold: _c, ...r }) => r));
      i += 1;
      if (i % 6 === 0) await progress(exportId, 5 + (i / EXPORT_TABLES.length) * 55, `Reading ${name}`);
    }
    // Đợt S5c: kèm `emailHash` = SHA-256(muối của lần xuất + email chữ thường) để NHẬP LẠI ánh xạ được người theo
    // email trong không gian đích mà KHÔNG lộ email trong tệp (muối ngẫu nhiên mỗi lần xuất, ghi ở manifest).
    const userHashSalt = crypto.randomBytes(16).toString('hex');
    tables.users = (await prisma.user.findMany({ where: { id: { in: collectUserIds(tables) } }, select: { ...PUBLIC_USER, email: true } }))
      .map(({ email, ...u }) => ({ ...u, emailHash: email ? emailHash(userHashSalt, email) : null })) as unknown as Rows;

    // Tệp đính kèm: manifest luôn có; nội dung chỉ khi chọn + tổng ≤ giới hạn. HEAD trước để tệp mất
    // trên R2 chỉ bị ghi "missing" thay vì làm hỏng cả lần xuất.
    const atts = tables.attachments as Array<{ id: number; issueId: number; r2Key: string; fileName: string; mime: string; size: number; clientVisible: boolean; deliverable: boolean }>;
    const issueNum = new Map((tables.issues as Array<{ id: number; number: number }>).map((x) => [x.id, x.number]));
    const totalBytes = atts.reduce((s2, a) => s2 + (a.size || 0), 0);
    const limit = maxFileBytes();
    const withFiles = ex.includeFiles && totalBytes <= limit;
    const zip = new JSZip();
    const fileEntries: Array<Record<string, unknown>> = [];
    let included = 0;
    let done = 0;
    for (const a of atts) {
      const entry: Record<string, unknown> = { id: a.id, issueKey: `${project.key}-${issueNum.get(a.issueId) ?? '?'}`, r2Key: a.r2Key, fileName: a.fileName, mime: a.mime, size: a.size, clientVisible: a.clientVisible, deliverable: a.deliverable, included: false };
      if (withFiles) {
        const size = await store.head(a.r2Key);
        if (size === null) {
          entry.missing = true;
        } else {
          const zipPath = `files/${a.id}-${a.fileName.replace(/[\\/:*?"<>|]+/g, '_').slice(-150)}`;
          zip.file(zipPath, lazyStream(() => store.read(a.r2Key)) as unknown as Buffer, { binary: true });
          entry.included = true;
          entry.path = zipPath;
          included += 1;
        }
        done += 1;
        if (done % 10 === 0) await progress(exportId, 60 + (done / Math.max(1, atts.length)) * 10, `Checking files (${done}/${atts.length})`);
      }
      fileEntries.push(entry);
    }
    const counts = Object.fromEntries(Object.entries(tables).map(([k, v]) => [k, v.length]));
    // Đợt S5c: dựng sẵn từng tệp data/*.json để ghi SHA-256 vào manifest — nhập lại kiểm toàn vẹn từng tệp.
    const dataFiles = new Map(Object.entries(tables).map(([name, rows]) => [`data/${name}.json`, json(rows)]));
    const attManifest = json(fileEntries);
    const checksums: Record<string, string> = { 'attachments/manifest.json': sha256Hex(attManifest) };
    for (const [pathName, buf] of dataFiles) checksums[pathName] = sha256Hex(buf);
    const manifest = {
      format: EXPORT_FORMAT,
      formatVersion: EXPORT_FORMAT_VERSION,
      exportedAt: new Date().toISOString(),
      exportedById: ex.requestedById,
      project: { id: pid, key: project.key, name: project.name },
      workspace: { id: project.workspaceId, slug: project.workspace.slug, name: project.workspace.name },
      tables: counts,
      checksums,
      userHashSalt,
      files: {
        count: atts.length, totalBytes, requested: ex.includeFiles, included, limitBytes: limit,
        note: ex.includeFiles && !withFiles ? `File contents skipped: ${totalBytes} bytes is over the ${limit}-byte limit. Only the manifest is included.` : undefined,
      },
      notes: [
        'Import it as a NEW project from Workspace settings → Import project (CT Work S5c). checksums = SHA-256 of each data file.',
        'Secrets are redacted: GitHub/GitLab secrets, chat webhook URLs, public link tokens. Pending invitations, personal edit locks and private AI chats are not exported.',
        'Users carry public fields only (no email addresses); emailHash = SHA-256(userHashSalt + lower-case email) lets an import match people already in the target workspace.',
      ],
    };
    zip.file('manifest.json', json(manifest));
    for (const [pathName, buf] of dataFiles) zip.file(pathName, buf);
    zip.file('attachments/manifest.json', attManifest);
    zip.file('README.txt', [
      `CT Work project export — ${project.key} ${project.name}`,
      `Format ${EXPORT_FORMAT} v${EXPORT_FORMAT_VERSION}, exported ${manifest.exportedAt}.`,
      '',
      'manifest.json — what is inside and how many rows each table has.',
      'data/*.json — one file per table, rows exactly as stored (dates in ISO 8601, UTC).',
      'attachments/manifest.json — every attachment (storage key, name, size); files/ has the contents when included.',
      '',
      'Restore: Workspace settings → Import project creates a NEW project from this file (the original is never overwritten).',
    ].join('\n'));
    await progress(exportId, 72, 'Writing archive');
    await pipeline(zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true, compression: 'DEFLATE', compressionOptions: { level: 6 } }), fs.createWriteStream(tmp));
    const size = (await fs.promises.stat(tmp)).size;
    await progress(exportId, 90, 'Uploading to storage');
    const key = exportKey(pid, exportId);
    await store.putFile(key, tmp, size, 'application/zip');
    const fileName = `${project.key}-export-${new Date().toISOString().slice(0, 10)}-${exportId}.zip`;
    await prisma.workProjectExport.update({
      where: { id: exportId },
      data: {
        status: 'DONE', progress: 100, stage: 'Ready', filePath: key, fileName, size, tableCounts: counts,
        attachmentCount: atts.length, attachmentBytes: totalBytes, filesIncluded: included,
        finishedAt: new Date(), expiresAt: new Date(Date.now() + EXPIRY_HOURS * 3600_000),
      },
    });
  } catch (err) {
    logger.warn('[work] xuất dự án lỗi', { exportId, err: (err as Error).message });
    await prisma.workProjectExport.update({ where: { id: exportId }, data: { status: 'FAILED', error: (err as Error).message.slice(0, 2000), finishedAt: new Date() } }).catch(() => {});
  } finally {
    await fs.promises.rm(tmp, { force: true }).catch(() => {});
  }
}

// ─── API ──────────────────────────────────────────────────────────

const EXPORT_SELECT = {
  id: true, status: true, progress: true, stage: true, includeFiles: true, fileName: true, size: true, tableCounts: true, attachmentCount: true,
  attachmentBytes: true, filesIncluded: true, error: true, expiresAt: true, createdAt: true, startedAt: true, finishedAt: true, requestedById: true,
} as const;

/** Lần xuất kẹt RUNNING/QUEUED quá 30 phút (máy chủ khởi động lại giữa chừng) ⇒ FAILED — mọi dự án (chốt toàn hệ thống). */
async function sweepStale() {
  await prisma.workProjectExport.updateMany({
    where: { status: { in: ['RUNNING', 'QUEUED'] }, createdAt: { lt: new Date(Date.now() - 30 * 60_000) } },
    data: { status: 'FAILED', error: 'The export was interrupted (server restart). Start a new one.' },
  });
}

export async function startExport(userId: number, projectId: number, input: { includeFiles?: boolean }) {
  await adminCtx(userId, projectId);
  assertStorage();
  await sweepStale();
  // Khoá tư vấn toàn cục: hai người bấm cùng lúc không cùng lọt qua phép đếm.
  const ex = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(31006::int, 0::int)`;
    const mine = await tx.workProjectExport.count({ where: { projectId, status: { in: ['QUEUED', 'RUNNING'] } } });
    if (mine) throw new AppError('An export of this project is already running', 409, 'WORK_EXPORT_RUNNING');
    const all = await tx.workProjectExport.count({ where: { status: { in: ['QUEUED', 'RUNNING'] } } });
    if (all >= MAX_RUNNING_GLOBAL) throw new AppError('The server is busy with other project exports. Try again in a few minutes.', 429, 'WORK_EXPORT_BUSY');
    return tx.workProjectExport.create({ data: { projectId, requestedById: userId, includeFiles: input.includeFiles === true, stage: 'Queued' }, select: { id: true } });
  });
  await auditProject(projectId, { actorId: userId, action: 'project.export', targetType: 'export', targetId: ex.id, summary: `Started a full project export${input.includeFiles ? ' (with files)' : ''}` });
  setImmediate(() => { void runExport(ex.id); });
  return prisma.workProjectExport.findUniqueOrThrow({ where: { id: ex.id }, select: EXPORT_SELECT });
}

export async function listExports(userId: number, projectId: number) {
  await adminCtx(userId, projectId);
  await sweepStale();
  return {
    items: await prisma.workProjectExport.findMany({ where: { projectId }, orderBy: { createdAt: 'desc' }, take: 20, select: EXPORT_SELECT }),
    maxFileBytes: maxFileBytes(),
    formatVersion: EXPORT_FORMAT_VERSION,
    storageReady: store.enabled(),
  };
}

export async function getExport(userId: number, projectId: number, exportId: number) {
  await adminCtx(userId, projectId);
  const ex = await prisma.workProjectExport.findFirst({ where: { id: exportId, projectId }, select: EXPORT_SELECT });
  if (!ex) throw new NotFoundError('Export not found');
  return ex;
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', `${config.jwtSecret}:ctwork-export`).update(payload).digest('base64url');
}

/** Link tải ký HMAC, hạn 15 phút. Chỉ ADMIN; ghi audit. */
export async function downloadLink(userId: number, projectId: number, exportId: number) {
  await adminCtx(userId, projectId);
  const ex = await prisma.workProjectExport.findFirst({ where: { id: exportId, projectId }, select: { id: true, status: true, expiresAt: true } });
  if (!ex) throw new NotFoundError('Export not found');
  if (ex.status !== 'DONE' || !ex.expiresAt || ex.expiresAt < new Date()) throw new AppError('This export is not ready or has expired', 410, 'WORK_EXPORT_EXPIRED');
  const exp = Math.floor(Date.now() / 1000) + LINK_TTL_S;
  const payload = `${ex.id}.${exp}.${userId}`;
  await auditProject(projectId, { actorId: userId, action: 'project.export.download', targetType: 'export', targetId: ex.id, summary: 'Created a download link for a project export' });
  return { url: `/api/v1/work/exports/download/${payload}.${sign(payload)}`, expiresAt: new Date(exp * 1000).toISOString() };
}

/**
 * Tuyến tải KHÔNG cần đăng nhập — chỉ tin chữ ký + hạn; kiểm lại người ký vẫn là ADMIN, rồi trả presigned
 * URL R2 hạn 5 phút (route chuyển hướng 302 tới đó — tệp không bao giờ đi qua máy chủ).
 */
export async function resolveDownload(token: string): Promise<{ url: string }> {
  const m = /^(\d+)\.(\d+)\.(\d+)\.([A-Za-z0-9_-]+)$/.exec(token);
  if (!m) throw new NotFoundError('Download link not found');
  const payload = `${m[1]}.${m[2]}.${m[3]}`;
  const expected = sign(payload);
  if (expected.length !== m[4].length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(m[4]))) throw new NotFoundError('Download link not found');
  if (Number(m[2]) * 1000 < Date.now()) throw new AppError('This download link has expired. Create a new one from Project settings → Export.', 410, 'WORK_EXPORT_LINK_EXPIRED');
  const ex = await prisma.workProjectExport.findUnique({ where: { id: Number(m[1]) }, select: { projectId: true, status: true, filePath: true, fileName: true, expiresAt: true } });
  if (!ex || ex.status !== 'DONE' || !ex.filePath || !ex.expiresAt || ex.expiresAt < new Date()) throw new AppError('This export has expired', 410, 'WORK_EXPORT_EXPIRED');
  await adminCtx(Number(m[3]), ex.projectId).catch(() => { throw new NotFoundError('Download link not found'); });
  assertStorage();
  return { url: await store.signedUrl(ex.filePath, PRESIGN_TTL_S, ex.fileName ?? 'project-export.zip') };
}

/** Cron: xoá object R2 quá hạn 72 giờ (đánh dấu EXPIRED). R2 lỗi ⇒ để lại, lần sau thử tiếp. */
export async function purgeExpiredExports(now = new Date()): Promise<number> {
  if (!store.enabled()) return 0;
  const rows = await prisma.workProjectExport.findMany({ where: { status: 'DONE', expiresAt: { lt: now } }, select: { id: true, filePath: true } });
  let n = 0;
  for (const r of rows) {
    try {
      if (r.filePath) await store.remove(r.filePath);
      await prisma.workProjectExport.update({ where: { id: r.id }, data: { status: 'EXPIRED', filePath: null } });
      n += 1;
    } catch (err) {
      logger.warn('[work] xoá tệp xuất hết hạn lỗi', { exportId: r.id, err: (err as Error).message });
    }
  }
  return n;
}

/** Đầu vào kiểm cho route. */
export function assertExportInput(v: unknown): { includeFiles: boolean } {
  if (v !== undefined && v !== null && typeof v !== 'object') throw new BadRequestError('Invalid input', 'VALIDATION_ERROR');
  return { includeFiles: (v as { includeFiles?: unknown } | null)?.includeFiles === true };
}
