/**
 * CT Work — đợt S5c (05/10/2026): NHẬP LẠI DỰ ÁN từ ZIP xuất trọn (S4, `format: ctwork-project-export`, `formatVersion: 1`).
 *
 * Luôn tạo DỰ ÁN MỚI trong không gian đích với mã (key) người dùng chọn — KHÔNG BAO GIỜ ghi đè dự án cũ.
 * Chỉ OWNER/ADMIN không gian (`workspace.settings`); khách GUEST / khách cổng không tới được.
 *
 * Luồng:
 *   1. POST /workspaces/:wsId/imports (multipart `file`, ≤ 200 MB — multer ghi tạm os.tmpdir) ⇒ KIỂM TOÀN VẸN
 *      (`analyzeZip`: đúng ZIP, có manifest, đúng format + formatVersion, mỗi data/<bảng>.json khớp số dòng của
 *      manifest, khớp SHA-256 `checksums` nếu có) ⇒ CHẠY THỬ (`buildPlan`: số dòng sẽ nhập từng bảng, ánh xạ người,
 *      bộ phận sẽ dùng lại/tạo mới, tệp đính kèm có/thiếu nội dung, cảnh báo) ⇒ đẩy ZIP lên R2 (kho CHUNG với xuất
 *      — `exportStore()`; KHÔNG giữ trên đĩa VPS) ⇒ dòng `work_project_imports` trạng thái UPLOADED + `plan`.
 *      Tệp tạm xoá trong `finally`. R2 chưa cấu hình ⇒ 503 WORK_EXPORT_NO_STORAGE.
 *   2. POST /workspaces/:wsId/imports/:id/start { key, name } ⇒ QUEUED ⇒ chạy NỀN (setImmediate) có tiến trình:
 *      tải ZIP từ R2 vào bộ nhớ, kiểm lại, nhập từng bảng theo thứ tự cha → con, xong xoá ZIP trên R2.
 *      Đồng thời: tối đa 1 lần nhập / không gian (409) và 2 / toàn hệ thống (429 WORK_IMPORT_BUSY).
 *   3. GET …/imports, GET …/imports/:id (tiến trình), DELETE …/imports/:id (huỷ bản chưa chạy / xoá dòng đã xong).
 *
 * Cách nhập — MỘT bộ máy chung đọc lược đồ Prisma (`Prisma.dmmf`), không chép tay cột từng bảng:
 *   - cột khoá ngoại tới bảng đã nhập ⇒ ánh xạ id cũ → id mới; tới bảng nhập SAU (hoặc chính nó: cha/con) ⇒ để null rồi
 *     ĐIỀN LẠI ở vòng cuối (cột phải nullable — đúng với mọi vòng lặp hiện có: thẻ cha, trang cha, họp trước, thẻ cổng
 *     của giai đoạn, trang của phê duyệt…); tới WorkProject ⇒ dự án mới; tới WorkSpace ⇒ không gian đích;
 *   - cột NGƯỜI (khoá ngoại tới users, hoặc cột người không FK của S4/S5a theo tên) ⇒ người trong không gian đích có
 *     CÙNG EMAIL (`users[].emailHash` của bản xuất từ S5c; bản xuất cũ không có ⇒ chỉ khớp khi CÙNG tài khoản trên
 *     cùng máy chủ: trùng id + trùng username). Không khớp ⇒ để trống + ghi "Imported from <tên>" (bình luận: dòng đầu
 *     thân; thẻ: một sự kiện lịch sử `imported`). Cột bắt buộc mà không khớp: bỏ dòng (thành viên, cảm xúc, người theo
 *     dõi, giờ làm, người dự họp, chữ ký phê duyệt) — đếm trong cảnh báo; bộ lọc/dashboard ⇒ chủ = người nhập; cột người
 *     KHÔNG FK bắt buộc (timesheet) ⇒ id ÂM của người gốc (giữ được "ai là ai" + ràng buộc unique, không trỏ nhầm ai).
 *   - thẻ GIỮ SỐ (dự án mới nên không trùng), trang/CR/RAID/họp/mốc thanh toán giữ số của chúng.
 *   - bộ phận ánh xạ theo MÃ trong không gian đích, thiếu thì TẠO.
 *   - tệp đính kèm: ZIP có nội dung ⇒ tải lại lên R2 (key `work/<dự án mới>/<thẻ mới>/…`); không có ⇒ giữ bản ghi như
 *     LIÊN KẾT HỎNG (key `work-import-missing/…`, tải về báo không có) + cảnh báo.
 *   - KHÔNG nhập: kết nối GitHub/GitLab, webhook chat, link công khai (bí mật đã bị xoá khi xuất), hội thoại AI, nhật ký
 *     luật tự động, audit log cũ (dự án mới có audit riêng `project.import`), bí danh mã thẻ cũ. Luật tự động nhập ở
 *     trạng thái TẮT (cấu hình có thể trỏ id cũ). Phê duyệt đang CHỜ ⇒ CANCELLED (bản sao lưu không mở lại yêu cầu ký).
 *   - Dự án được tạo ở trạng thái ẨN (deletedAt) trong lúc nhập; lỗi giữa chừng ⇒ XOÁ CỨNG dự án dở (cascade) + bộ phận
 *     vừa tạo ⇒ không để rác. Xong ⇒ hiện ra + settings.importedFrom.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Readable } from 'node:stream';
import { Prisma } from '@prisma/client';
import JSZip from 'jszip';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ConflictError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { audit } from './audit.js';
import { PROJECT_KEY_RE } from './constants.js';
import { requireWorkspace } from './permissions.js';
import { EXPORT_FORMAT, EXPORT_FORMAT_VERSION, EXPORT_TABLES, emailHash, exportStore, sha256Hex } from './projectExport.service.js';

export const IMPORT_MAX_BYTES = 200 * 1024 * 1024;
const MAX_RUNNING_GLOBAL = 2;
const UPLOAD_TTL_HOURS = 24;

type Row = Record<string, unknown>;
type Tables = Record<string, Row[]>;

// ─── Bảng ⇒ model Prisma ─────────────────────────────────────────

/** Bảng KHÔNG nhập và vì sao (hiện trong chạy thử). */
export const SKIPPED_TABLES: Record<string, string> = {
  githubConnection: 'GitHub connection — its secret was removed on export; connect the repository again',
  gitlabConnection: 'GitLab connection — its token was removed on export; connect again',
  publicLinks: 'Public links — tokens were removed on export; create new links',
  chatHooks: 'Chat notifications — webhook URLs were removed on export; set them up again',
  aiThreads: 'AI conversations are not imported',
  aiMessages: 'AI conversations are not imported',
  automationLogs: 'Automation run logs are not imported',
  auditLog: 'The old audit log stays with the export file; the new project starts its own (with an import entry)',
  issueAliases: 'Old issue keys from earlier moves are not carried over',
};

const lowerFirst = (s: string) => s[0].toLowerCase() + s.slice(1);

/** Bảng xuất ⇒ tên model (đọc từ mã EXPORT_TABLES: `prisma.<delegate>.find…`). */
function tableModels(): Map<string, string> {
  const out = new Map<string, string>();
  for (const [name, load] of EXPORT_TABLES) {
    const m = /prisma\.(\w+)\.find/.exec(load.toString());
    if (m) out.set(name, m[1][0].toUpperCase() + m[1].slice(1));
  }
  return out;
}

type DmmfModel = (typeof Prisma.dmmf.datamodel.models)[number];
type DmmfField = DmmfModel['fields'][number];
const MODELS = new Map<string, DmmfModel>(Prisma.dmmf.datamodel.models.map((m) => [m.name, m]));

/** Cột FK một-cột ⇒ model đích. */
function fkTargets(model: DmmfModel): Map<string, string> {
  const out = new Map<string, string>();
  for (const f of model.fields) if (f.kind === 'object' && f.relationFromFields?.length === 1) out.set(f.relationFromFields[0], f.type);
  return out;
}

/** Cột trỏ tới người mà KHÔNG có FK (S4/S5a cố ý — số liệu sống lâu hơn tài khoản). Khớp USER_COLS của bản xuất. */
const USER_COL = /^(userId|assigneeId|reporterId|leadId|authorId|actorId|uploaderId|createdById|ownerId|requesterId|approverId|organizerId|invitedById|decidedById|lastEditedById|fromUserId|toUserId|updatedById|reopenedById|requestedById|firstResponseById)$/;

/** Cột id KHÔNG FK trỏ tới bảng khác của dự án (model.cột ⇒ model đích). */
const LOOSE_REFS: Record<string, string> = {
  'WorkTimesheetLine.worklogId': 'WorkWorklog',
  'WorkTimesheetLine.issueId': 'WorkIssue',
  'WorkTimesheetLine.teamId': 'WorkTeam',
  'WorkTimesheetLine.stageId': 'WorkStage',
  'WorkPaymentMilestone.triggeredByApprovalId': 'WorkApproval',
  'WorkAutomationLog.issueId': 'WorkIssue',
};

/** Cột người BẮT BUỘC mà không khớp thì người nhập đứng tên (chỉ cấu hình cá nhân, không phải bằng chứng). */
const IMPORTER_OWNS = new Set(['WorkSavedFilter.ownerId', 'WorkDashboard.ownerId']);

// ─── Kiểm toàn vẹn ────────────────────────────────────────────────

export interface Analysis {
  manifest: Row & { tables: Record<string, number>; project: { id: number; key: string; name: string }; workspace?: { name?: string } };
  tables: Tables;
  attachments: Array<Row & { id: number; included?: boolean; path?: string; missing?: boolean }>;
  zip: JSZip;
  checksumsVerified: number;
}

const bad = (msg: string) => new BadRequestError(msg, 'WORK_IMPORT_BAD_FILE');

/** Đọc + kiểm một tệp ZIP. Mọi lỗi định dạng ⇒ 400 WORK_IMPORT_BAD_FILE với câu nói rõ hỏng ở đâu. */
export async function analyzeZip(buf: Buffer): Promise<Analysis> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(buf);
  } catch {
    throw bad('This file is not a ZIP archive. Choose the .zip you downloaded from Project settings → Export → Export the whole project.');
  }
  const mf = zip.file('manifest.json');
  if (!mf) throw bad('manifest.json is missing — this ZIP is not a CT Work project export.');
  let manifest: Analysis['manifest'];
  try {
    manifest = JSON.parse(await mf.async('string'));
  } catch {
    throw bad('manifest.json is not valid JSON — the file is damaged.');
  }
  if (!manifest || manifest.format !== EXPORT_FORMAT) throw bad(`This ZIP is not a CT Work project export (format "${String(manifest?.format ?? 'unknown')}").`);
  const v = Number(manifest.formatVersion);
  if (v > EXPORT_FORMAT_VERSION) throw bad(`This export was made by a newer version of CT Work (format version ${v}). This server can import version ${EXPORT_FORMAT_VERSION}.`);
  if (v !== EXPORT_FORMAT_VERSION) throw bad(`Unsupported export format version "${String(manifest.formatVersion)}".`);
  if (!manifest.tables || typeof manifest.tables !== 'object') throw bad('manifest.json has no table list — the file is damaged.');
  if (!manifest.project?.key) throw bad('manifest.json does not say which project was exported.');
  const checksums = (manifest.checksums && typeof manifest.checksums === 'object' ? manifest.checksums : {}) as Record<string, string>;
  let verified = 0;
  const readChecked = async (name: string): Promise<string> => {
    const f = zip.file(name);
    if (!f) throw bad(`${name} is missing from the ZIP — the file is incomplete.`);
    const b = await f.async('nodebuffer');
    if (checksums[name]) {
      if (sha256Hex(b) !== checksums[name]) throw bad(`${name} does not match its checksum — the file was changed or damaged.`);
      verified += 1;
    }
    return b.toString('utf8');
  };
  const tables: Tables = {};
  for (const [name, count] of Object.entries(manifest.tables)) {
    let rows: unknown;
    try {
      rows = JSON.parse(await readChecked(`data/${name}.json`));
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw bad(`data/${name}.json is not valid JSON — the file is damaged.`);
    }
    if (!Array.isArray(rows)) throw bad(`data/${name}.json is not a list of rows.`);
    if (rows.length !== Number(count)) throw bad(`data/${name}.json has ${rows.length} rows but the manifest says ${count} — the file is damaged.`);
    tables[name] = rows as Row[];
  }
  for (const req of ['project', 'issues', 'workflows', 'statuses', 'issueTypes']) if (!tables[req]) throw bad(`The export has no ${req} table — the file is incomplete.`);
  if (tables.project.length !== 1) throw bad('The export must contain exactly one project.');
  let attachments: Analysis['attachments'] = [];
  if (zip.file('attachments/manifest.json')) {
    try {
      attachments = JSON.parse(await readChecked('attachments/manifest.json'));
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw bad('attachments/manifest.json is not valid JSON.');
    }
  }
  return { manifest, tables, attachments: Array.isArray(attachments) ? attachments : [], zip, checksumsVerified: verified };
}

// ─── Ánh xạ người ────────────────────────────────────────────────

interface Person { id: number; username: string; name: string; emailHash?: string | null }
interface Member { id: number; username: string; email: string | null }

/** Người của bản xuất ⇒ người trong không gian đích (hàm thuần — test s5c.test.ts). */
export function mapPeople(exported: Person[], members: Member[], salt: string | null): Map<number, { to: Member | null; how: 'email' | 'same-account' | null }> {
  const out = new Map<number, { to: Member | null; how: 'email' | 'same-account' | null }>();
  const byHash = new Map<string, Member>();
  if (salt) for (const m of members) if (m.email) byHash.set(emailHash(salt, m.email), m);
  for (const p of exported) {
    const viaEmail = p.emailHash ? byHash.get(p.emailHash) : undefined;
    if (viaEmail) { out.set(p.id, { to: viaEmail, how: 'email' }); continue; }
    // Bản xuất cũ (không emailHash): chỉ tin khi CÙNG tài khoản trên CÙNG máy chủ — trùng id lẫn username.
    const same = members.find((m) => m.id === p.id && m.username === p.username);
    out.set(p.id, same ? { to: same, how: 'same-account' } : { to: null, how: null });
  }
  return out;
}

async function workspaceMembers(workspaceId: number): Promise<Member[]> {
  const ws = await prisma.workSpace.findUniqueOrThrow({ where: { id: workspaceId }, select: { owner: { select: { id: true, username: true, email: true } } } });
  const rows = await prisma.workMember.findMany({ where: { workspaceId }, select: { user: { select: { id: true, username: true, email: true } } } });
  const all = [ws.owner, ...rows.map((r) => r.user)];
  return [...new Map(all.map((u) => [u.id, u])).values()];
}

const personName = (u: Row | undefined) => (u ? String(u.displayName || u.fullName || u.username || `user #${u.id}`) : 'unknown user');

// ─── Chạy thử (dry-run) ──────────────────────────────────────────

export interface ImportPlan {
  source: { key: string; name: string; workspace: string | null; exportedAt: string | null };
  suggestedKey: string;
  tables: Array<{ table: string; rows: number; import: boolean; note?: string }>;
  people: Array<{ id: number; username: string; name: string; mappedTo: { id: number; username: string } | null; how: string | null }>;
  teams: Array<{ key: string; name: string; action: 'reuse' | 'create' }>;
  files: { total: number; withContent: number; missing: number; bytes: number };
  checksumsVerified: number;
  warnings: string[];
}

async function freeKey(workspaceId: number, want: string): Promise<string> {
  const base = (PROJECT_KEY_RE.test(want) ? want : 'IMP').slice(0, 8);
  const used = new Set((await prisma.workProject.findMany({ where: { workspaceId }, select: { key: true } })).map((p) => p.key));
  if (!used.has(want) && PROJECT_KEY_RE.test(want)) return want;
  for (let i = 2; i < 100; i++) if (!used.has(`${base}${i}`)) return `${base}${i}`;
  return `IMP${Date.now() % 10_000}`;
}

export async function buildPlan(a: Analysis, workspaceId: number): Promise<ImportPlan> {
  const models = tableModels();
  const members = await workspaceMembers(workspaceId);
  const salt = typeof a.manifest.userHashSalt === 'string' ? a.manifest.userHashSalt : null;
  const exportedPeople = (a.tables.users ?? []) as unknown as Person[];
  const map = mapPeople(exportedPeople.map((u) => ({ ...u, name: personName(u as unknown as Row) })), members, salt);
  const people = exportedPeople.map((u) => {
    const m = map.get(u.id);
    return { id: u.id, username: u.username, name: personName(u as unknown as Row), mappedTo: m?.to ? { id: m.to.id, username: m.to.username } : null, how: m?.how ?? null };
  });
  const teams = await Promise.all((a.tables.teams ?? []).map(async (t) => {
    const hit = await prisma.workTeam.findFirst({ where: { workspaceId, key: String(t.key) }, select: { id: true } });
    return { key: String(t.key), name: String(t.name), action: hit ? 'reuse' as const : 'create' as const };
  }));
  const files = {
    total: a.attachments.length,
    withContent: a.attachments.filter((f) => f.included && f.path && a.zip.file(String(f.path))).length,
    missing: 0, bytes: a.attachments.reduce((s, f) => s + Number(f.size || 0), 0),
  };
  files.missing = files.total - files.withContent;
  const tables = Object.entries(a.tables).filter(([t]) => t !== 'users').map(([table, rows]) => {
    if (SKIPPED_TABLES[table]) return { table, rows: rows.length, import: false, note: SKIPPED_TABLES[table] };
    if (!models.has(table)) return { table, rows: rows.length, import: false, note: 'Unknown table — ignored' };
    return { table, rows: rows.length, import: true };
  });
  const warnings: string[] = [];
  const unmapped = people.filter((p) => !p.mappedTo);
  if (unmapped.length) {
    warnings.push(`${unmapped.length} ${unmapped.length === 1 ? 'person is' : 'people are'} not in this workspace (${unmapped.slice(0, 6).map((p) => p.name).join(', ')}${unmapped.length > 6 ? '…' : ''}): their fields are left empty and marked “Imported from …”; their memberships, work logs, reactions, watches and approval signatures are skipped.`);
  }
  if (!salt && exportedPeople.length) warnings.push('This export was made before people could be matched by email — only accounts that are the very same account on this server are matched. Invite the rest to the workspace first if you want them matched.');
  if (files.missing) warnings.push(`${files.missing} of ${files.total} attachments have no file content in this ZIP — they are imported as broken links (export again with “Include files” to bring the files).`);
  if ((a.tables.automationRules ?? []).length) warnings.push('Automation rules are imported turned OFF — review them before turning them on (they may point to old statuses or people).');
  const pendingApprovals = (a.tables.approvals ?? []).filter((x) => x.status === 'PENDING').length;
  if (pendingApprovals) warnings.push(`${pendingApprovals} approval request${pendingApprovals === 1 ? ' was' : 's were'} still waiting — they are imported as Cancelled; send them again if needed.`);
  const createdTeams = teams.filter((t) => t.action === 'create').length;
  if (createdTeams) warnings.push(`${createdTeams} team${createdTeams === 1 ? '' : 's'} will be created in this workspace (no members yet).`);
  if (a.checksumsVerified === 0) warnings.push('This export has no checksums (made before CT Work S5c) — row counts were checked, file checksums could not be.');
  const proj = a.tables.project[0];
  return {
    source: { key: String(proj.key), name: String(proj.name), workspace: a.manifest.workspace?.name ?? null, exportedAt: typeof a.manifest.exportedAt === 'string' ? a.manifest.exportedAt : null },
    suggestedKey: await freeKey(workspaceId, String(proj.key)),
    tables, people, teams, files, checksumsVerified: a.checksumsVerified, warnings,
  };
}

// ─── Kho (dùng chung với xuất) ──────────────────────────────────────

const importKey = (workspaceId: number, token: string) => `work-imports/${workspaceId}/${token}.zip`;

function assertStorage() {
  if (!exportStore().enabled()) throw new AppError('Project import needs cloud storage (Cloudflare R2), which is not configured on this server', 503, 'WORK_EXPORT_NO_STORAGE');
}

async function readAll(s: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const c of s) {
    total += (c as Buffer).length;
    if (total > IMPORT_MAX_BYTES) throw bad('The file is larger than 200 MB.');
    chunks.push(c as Buffer);
  }
  return Buffer.concat(chunks);
}

const IMPORT_SELECT = {
  id: true, workspaceId: true, status: true, progress: true, stage: true, fileName: true, size: true, sourceKey: true, sourceName: true,
  projectKey: true, projectName: true, projectId: true, plan: true, result: true, error: true, expiresAt: true, createdAt: true, startedAt: true,
  finishedAt: true, requestedById: true,
} as const;

/** Bản đã tải lên mà không ai bấm nhập sau 24 giờ ⇒ xoá ZIP trên R2 (EXPIRED); bản kẹt RUNNING > 60 phút ⇒ FAILED. */
async function sweep() {
  await prisma.workProjectImport.updateMany({
    where: { status: { in: ['QUEUED', 'RUNNING'] }, createdAt: { lt: new Date(Date.now() - 60 * 60_000) } },
    data: { status: 'FAILED', error: 'The import was interrupted (server restart). Upload the file again.' },
  });
  const old = await prisma.workProjectImport.findMany({ where: { status: 'UPLOADED', expiresAt: { lt: new Date() } }, select: { id: true, filePath: true }, take: 50 });
  for (const r of old) {
    try {
      if (r.filePath && exportStore().enabled()) await exportStore().remove(r.filePath);
      await prisma.workProjectImport.update({ where: { id: r.id }, data: { status: 'EXPIRED', filePath: null } });
    } catch (err) {
      logger.warn('[work] xoá ZIP nhập quá hạn lỗi', { importId: r.id, err: (err as Error).message });
    }
  }
}

// ─── API ──────────────────────────────────────────────────────────

/** Bước 1: nhận tệp (đã nằm ở tệp tạm của multer), kiểm + chạy thử, đẩy lên R2. Tệp tạm do route xoá. */
export async function uploadImport(userId: number, workspaceId: number, file: { path: string; originalName: string; size: number }) {
  await requireWorkspace(userId, workspaceId, 'workspace.settings');
  assertStorage();
  await sweep();
  if (file.size > IMPORT_MAX_BYTES) throw bad('The file is larger than 200 MB.');
  const buf = await fs.promises.readFile(file.path);
  const a = await analyzeZip(buf);
  const plan = await buildPlan(a, workspaceId);
  const key = importKey(workspaceId, crypto.randomUUID());
  await exportStore().putFile(key, file.path, file.size, 'application/zip');
  const row = await prisma.workProjectImport.create({
    data: {
      workspaceId, requestedById: userId, status: 'UPLOADED', stage: 'Checked — ready to import', filePath: key,
      fileName: file.originalName.slice(0, 200), size: file.size, sourceKey: plan.source.key.slice(0, 10), sourceName: plan.source.name.slice(0, 120),
      projectKey: plan.suggestedKey, projectName: plan.source.name.slice(0, 120), plan: plan as unknown as Prisma.InputJsonValue,
      expiresAt: new Date(Date.now() + UPLOAD_TTL_HOURS * 3600_000),
    },
    select: IMPORT_SELECT,
  });
  await audit({ workspaceId, actorId: userId, action: 'project.import.upload', targetType: 'import', targetId: row.id, summary: `Uploaded a project export (${plan.source.key} “${plan.source.name}”) for import` });
  return row;
}

export async function listImports(userId: number, workspaceId: number) {
  await requireWorkspace(userId, workspaceId, 'workspace.settings');
  await sweep();
  return {
    items: await prisma.workProjectImport.findMany({ where: { workspaceId }, orderBy: { createdAt: 'desc' }, take: 20, select: IMPORT_SELECT }),
    maxBytes: IMPORT_MAX_BYTES, formatVersion: EXPORT_FORMAT_VERSION, storageReady: exportStore().enabled(),
  };
}

export async function getImport(userId: number, workspaceId: number, importId: number) {
  await requireWorkspace(userId, workspaceId, 'workspace.settings');
  const r = await prisma.workProjectImport.findFirst({ where: { id: importId, workspaceId }, select: IMPORT_SELECT });
  if (!r) throw new NotFoundError('Import not found');
  return r;
}

export async function cancelImport(userId: number, workspaceId: number, importId: number) {
  await requireWorkspace(userId, workspaceId, 'workspace.settings');
  const r = await prisma.workProjectImport.findFirst({ where: { id: importId, workspaceId }, select: { id: true, status: true, filePath: true } });
  if (!r) throw new NotFoundError('Import not found');
  if (r.status === 'QUEUED' || r.status === 'RUNNING') throw new ConflictError('This import is running — wait for it to finish');
  if (r.filePath) await exportStore().remove(r.filePath).catch(() => {});
  await prisma.workProjectImport.update({ where: { id: r.id }, data: { status: r.status === 'UPLOADED' ? 'CANCELLED' : r.status, filePath: null } });
  return { cancelled: true };
}

/** Bước 2: chọn mã + tên ⇒ chạy nền. */
export async function startImport(userId: number, workspaceId: number, importId: number, input: { key: string; name?: string | null }) {
  await requireWorkspace(userId, workspaceId, 'workspace.settings');
  assertStorage();
  const key = input.key.trim().toUpperCase();
  if (!PROJECT_KEY_RE.test(key)) throw new BadRequestError('Project key: 2–10 characters, starting with a letter, only A–Z and 0–9', 'VALIDATION_ERROR');
  if (await prisma.workProject.findFirst({ where: { workspaceId, key }, select: { id: true } })) {
    throw new ConflictError(`Project key ${key} is already used in this workspace (or by a project in its trash)`);
  }
  await sweep();
  const row = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(31007::int, 0::int)`;
    const r = await tx.workProjectImport.findFirst({ where: { id: importId, workspaceId }, select: { id: true, status: true, filePath: true, sourceName: true } });
    if (!r) throw new NotFoundError('Import not found');
    if (r.status !== 'UPLOADED' || !r.filePath) throw new ConflictError('This upload was already used or has expired — upload the file again');
    if (await tx.workProjectImport.count({ where: { workspaceId, status: { in: ['QUEUED', 'RUNNING'] } } })) throw new AppError('Another import is running in this workspace', 409, 'WORK_IMPORT_RUNNING');
    if ((await tx.workProjectImport.count({ where: { status: { in: ['QUEUED', 'RUNNING'] } } })) >= MAX_RUNNING_GLOBAL) {
      throw new AppError('The server is busy with other imports. Try again in a few minutes.', 429, 'WORK_IMPORT_BUSY');
    }
    return tx.workProjectImport.update({
      where: { id: r.id },
      data: { status: 'QUEUED', stage: 'Queued', progress: 0, projectKey: key, projectName: (input.name?.trim() || r.sourceName || key).slice(0, 120) },
      select: IMPORT_SELECT,
    });
  });
  setImmediate(() => { void runImport(row.id); });
  return row;
}

// ─── Bộ máy nhập ──────────────────────────────────────────────────

interface Ctx {
  workspaceId: number;
  projectId: number;
  importerId: number;
  ids: Map<string, Map<number, number>>; // model ⇒ (id cũ ⇒ id mới)
  done: Set<string>; // model đã nhập xong
  people: Map<number, { to: Member | null }>;
  names: Map<number, string>;
  deferred: Array<{ model: string; delegate: string; id: number; field: string; target: string; old: number }>;
  counts: Record<string, { rows: number; imported: number; skipped: number }>;
  notes: Map<number, string[]>; // thẻ mới ⇒ người không khớp
  createdTeams: number[];
  warnings: string[];
}

const DATE = (v: unknown) => (typeof v === 'string' || v instanceof Date ? new Date(v as string) : v);

/** Người cũ ⇒ id mới, hoặc null (không khớp). */
const personOf = (ctx: Ctx, old: unknown): number | null => (typeof old === 'number' ? ctx.people.get(old)?.to?.id ?? null : null);

type Built = { data: Row; skip?: string; blanked: string[] };

function buildRow(ctx: Ctx, model: DmmfModel, row: Row, order: string[]): Built {
  const fks = fkTargets(model);
  const data: Row = {};
  const blanked: string[] = [];
  const myIdx = order.indexOf(model.name);
  for (const f of model.fields as DmmfField[]) {
    if (f.kind !== 'scalar' && f.kind !== 'enum') continue;
    if (f.isId && f.hasDefaultValue) continue;
    if (!(f.name in row)) continue;
    let v = row[f.name];
    const target = fks.get(f.name) ?? LOOSE_REFS[`${model.name}.${f.name}`] ?? (USER_COL.test(f.name) && f.type === 'Int' ? 'User' : undefined);
    if (target && v !== null && v !== undefined) {
      const loose = !fks.has(f.name);
      if (target === 'WorkProject') v = ctx.projectId;
      else if (target === 'WorkSpace') v = ctx.workspaceId;
      else if (target === 'User') {
        const to = personOf(ctx, v);
        if (to === null) {
          blanked.push(ctx.names.get(v as number) ?? `user #${String(v)}`);
          if (f.isRequired) {
            // Cột người KHÔNG FK bắt buộc (timesheet) ⇒ id âm của người gốc; có FK ⇒ bỏ dòng.
            if (loose) v = -Math.abs(Number(v));
            // Bộ lọc / dashboard của người không khớp ⇒ người nhập làm CHỦ cấu hình (không phải chữ ký của ai).
            else if (IMPORTER_OWNS.has(`${model.name}.${f.name}`)) v = ctx.importerId;
            else return { data, skip: `person not in workspace (${f.name})`, blanked };
          } else v = null;
        } else v = to;
      } else {
        const mapped = ctx.ids.get(target)?.get(v as number);
        if (mapped !== undefined) v = mapped;
        else if (!ctx.done.has(target) && order.indexOf(target) >= myIdx && !f.isRequired) {
          ctx.deferred.push({ model: model.name, delegate: lowerFirst(model.name), id: -1, field: f.name, target, old: v as number });
          v = null;
        } else if (!f.isRequired) v = null;
        else return { data, skip: `missing ${target} #${String(v)} for ${f.name}`, blanked };
      }
    }
    if (v === null || v === undefined) {
      if (f.type === 'Json') v = f.isRequired ? {} : Prisma.DbNull;
      else if (f.isRequired && !f.hasDefaultValue) return { data, skip: `empty required ${f.name}`, blanked };
      else if (f.isRequired) continue;
    } else if (f.type === 'DateTime') v = DATE(v);
    else if (f.type === 'BigInt') v = BigInt(v as number);
    else if (f.type === 'Bytes') continue;
    data[f.name] = v;
  }
  return { data, blanked };
}

const remapIds = (ctx: Ctx, model: string, v: unknown): number[] => (Array.isArray(v) ? v.map((x) => ctx.ids.get(model)?.get(Number(x))).filter((x): x is number => typeof x === 'number') : []);
const noteParagraph = (text: string) => ({ type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'italic' }], text }] });

/** Sửa riêng theo bảng TRƯỚC khi ghi (dữ liệu đã qua buildRow). */
async function tableHook(ctx: Ctx, table: string, row: Row, b: Built): Promise<Built> {
  const d = b.data;
  switch (table) {
    case 'projectMembers':
      if (d.userId === ctx.importerId) return { ...b, skip: 'importer is already an admin' };
      return b;
    case 'transitions': {
      const r = (d.rules && typeof d.rules === 'object' ? { ...(d.rules as Row) } : null);
      if (r && Array.isArray(r.teamIds)) r.teamIds = remapIds(ctx, 'WorkTeam', r.teamIds);
      if (r) d.rules = r;
      return b;
    }
    case 'deskSettings':
      d.pauseStatusIds = remapIds(ctx, 'WorkStatus', row.pauseStatusIds);
      d.responseStatusIds = remapIds(ctx, 'WorkStatus', row.responseStatusIds);
      return b;
    case 'uatRequests':
      d.itemIssueIds = remapIds(ctx, 'WorkIssue', row.itemIssueIds);
      d.attachmentIds = remapIds(ctx, 'WorkAttachment', row.attachmentIds);
      d.createdIssueIds = remapIds(ctx, 'WorkIssue', row.createdIssueIds);
      return b;
    case 'approvals':
      if (d.status === 'PENDING') { d.status = 'CANCELLED'; d.decidedAt = new Date(); }
      return b;
    case 'approvalSteps':
      if (d.decision === 'PENDING') d.decision = 'SKIPPED';
      return b;
    case 'automationRules':
      d.enabled = false;
      return b;
    case 'rates':
      if (row.scope === 'USER' && row.userId && d.userId === null) return { ...b, skip: 'rate for a person not in this workspace' };
      return b;
    case 'comments':
    case 'pageComments':
      if (row.authorId && d.authorId === null && !row.isAi) {
        const who = ctx.names.get(row.authorId as number) ?? 'unknown user';
        const body = (d.bodyJson && typeof d.bodyJson === 'object' ? d.bodyJson : { type: 'doc', content: [] }) as { content?: unknown[] };
        d.bodyJson = { ...body, type: 'doc', content: [noteParagraph(`Imported from ${who}`), ...(body.content ?? [])] };
        if (typeof d.bodyText === 'string') d.bodyText = `Imported from ${who}\n${d.bodyText}`;
      }
      return b;
    default:
      return b;
  }
}

async function progress(id: number, pct: number, stage: string) {
  await prisma.workProjectImport.update({ where: { id }, data: { progress: Math.max(0, Math.min(100, Math.round(pct))), stage: stage.slice(0, 120) } });
}

/** Chạy một lần nhập (nền). Lỗi ⇒ FAILED + xoá dự án dở. Không ném ra ngoài. */
export async function runImport(importId: number): Promise<void> {
  const job = await prisma.workProjectImport.findUnique({ where: { id: importId } });
  if (!job || job.status !== 'QUEUED' || !job.filePath) return;
  await prisma.workProjectImport.update({ where: { id: importId }, data: { status: 'RUNNING', startedAt: new Date(), progress: 1, stage: 'Reading the file' } });
  let projectId = 0;
  const ctx: Ctx = {
    workspaceId: job.workspaceId, projectId: 0, importerId: job.requestedById ?? 0, ids: new Map(), done: new Set(), people: new Map(),
    names: new Map(), deferred: [], counts: {}, notes: new Map(), createdTeams: [], warnings: [],
  };
  const tmpDir = path.join(os.tmpdir(), `ctwork-import-${importId}-${process.pid}`);
  try {
    if (!ctx.importerId) throw new Error('The person who started this import no longer exists');
    const buf = await readAll(await exportStore().read(job.filePath));
    const a = await analyzeZip(buf);
    const plan = await buildPlan(a, job.workspaceId);
    const members = await workspaceMembers(job.workspaceId);
    const salt = typeof a.manifest.userHashSalt === 'string' ? a.manifest.userHashSalt : null;
    const exported = ((a.tables.users ?? []) as unknown as Person[]).map((u) => ({ ...u, name: personName(u as unknown as Row) }));
    ctx.people = mapPeople(exported, members, salt);
    for (const u of exported) ctx.names.set(u.id, u.name);
    const models = tableModels();
    const order = [...models.entries()].filter(([t]) => !SKIPPED_TABLES[t]).map(([, m]) => m);
    await progress(importId, 5, 'Creating the project');

    // 1) Dự án (ẩn trong lúc nhập).
    const src = a.tables.project[0];
    const settings = (src.settings && typeof src.settings === 'object' ? { ...(src.settings as Row) } : {}) as Row;
    const gate = settings.stageGate as { approverIds?: number[]; mode?: string } | undefined;
    if (gate?.approverIds) settings.stageGate = { ...gate, approverIds: gate.approverIds.map((x) => personOf(ctx, x)).filter((x): x is number => !!x) };
    settings.importedFrom = { key: src.key, name: src.name, workspace: a.manifest.workspace?.name ?? null, exportedAt: a.manifest.exportedAt ?? null, importId, at: new Date().toISOString() };
    const project = await prisma.workProject.create({
      data: {
        workspaceId: job.workspaceId, key: job.projectKey!, name: (job.projectName || String(src.name)).slice(0, 120),
        description: (src.description as string | null) ?? null, type: String(src.type ?? 'SCRUM'), template: String(src.template ?? 'BLANK'),
        kind: (src.kind as string | null) ?? null, visibility: String(src.visibility ?? 'WORKSPACE'),
        leadId: personOf(ctx, src.leadId) ?? ctx.importerId, settings: settings as Prisma.InputJsonValue, deletedAt: new Date(),
        archivedAt: src.archivedAt ? new Date(String(src.archivedAt)) : null,
      },
      select: { id: true },
    });
    projectId = project.id;
    ctx.projectId = projectId;
    await prisma.workProjectImport.update({ where: { id: importId }, data: { projectId } });
    ctx.ids.set('WorkProject', new Map([[Number(src.id), projectId]]));
    ctx.done.add('WorkProject');
    await prisma.workProjectMember.create({ data: { projectId, userId: ctx.importerId, role: 'ADMIN' } });

    // 2) Từng bảng theo thứ tự cha → con.
    const attByOld = new Map(a.attachments.map((x) => [Number(x.id), x]));
    const tableList = [...models.entries()].filter(([t]) => t !== 'project' && !SKIPPED_TABLES[t] && a.tables[t]);
    let ti = 0;
    for (const [table, modelName] of tableList) {
      ti += 1;
      const model = MODELS.get(modelName);
      if (!model) continue;
      const rows = a.tables[table];
      const c = ctx.counts[table] = { rows: rows.length, imported: 0, skipped: 0 };
      const delegate = (prisma as unknown as Record<string, { create: (args: unknown) => Promise<Row>; findFirst: (args: unknown) => Promise<Row | null> }>)[lowerFirst(modelName)];
      const idField = model.fields.find((f) => f.isId);
      const ids = ctx.ids.get(modelName) ?? new Map<number, number>();
      ctx.ids.set(modelName, ids);
      if (ti % 4 === 0) await progress(importId, 8 + (ti / tableList.length) * 82, `Importing ${table}`);
      for (const row of rows) {
        // Bộ phận: dùng lại theo MÃ trong không gian đích, thiếu thì tạo.
        if (table === 'teams') {
          const hit = await prisma.workTeam.findFirst({ where: { workspaceId: ctx.workspaceId, key: String(row.key) }, select: { id: true } });
          if (hit) { ids.set(Number(row.id), hit.id); c.imported += 1; continue; }
        }
        const deferBefore = ctx.deferred.length;
        let b = buildRow(ctx, model, row, order);
        b = await tableHook(ctx, table, row, b);
        if (b.skip) {
          ctx.deferred.length = deferBefore;
          c.skipped += 1;
          continue;
        }
        if (table === 'attachments') {
          const e = attByOld.get(Number(row.id));
          const zf = e?.included && e.path ? a.zip.file(String(e.path)) : null;
          const safe = String(row.fileName ?? 'file').replace(/[^\w.\- ]+/g, '_').slice(-120) || 'file';
          if (zf) {
            const key = `work/${projectId}/${String(b.data.issueId)}/${crypto.randomUUID()}/${safe}`;
            await fs.promises.mkdir(tmpDir, { recursive: true });
            const fp = path.join(tmpDir, `${Number(row.id)}.bin`);
            const content = await zf.async('nodebuffer');
            await fs.promises.writeFile(fp, content);
            await exportStore().putFile(key, fp, content.length, String(row.mime || 'application/octet-stream'));
            await fs.promises.rm(fp, { force: true });
            b.data.r2Key = key;
            b.data.size = content.length;
          } else {
            b.data.r2Key = `work-import-missing/${projectId}/${String(row.r2Key ?? row.id)}`.slice(0, 500);
          }
        }
        let created: Row;
        try {
          created = await delegate.create({ data: b.data });
        } catch (err) {
          if (err instanceof Prisma.PrismaClientKnownRequestError && (err.code === 'P2002' || err.code === 'P2003')) {
            ctx.deferred.length = deferBefore;
            c.skipped += 1;
            continue;
          }
          throw new Error(`${table}: ${(err as Error).message.split('\n').slice(-1)[0]}`);
        }
        c.imported += 1;
        const newId = idField ? Number(created[idField.name]) : NaN;
        if (idField && Number.isFinite(newId) && typeof row[idField.name] === 'number') ids.set(row[idField.name] as number, newId);
        for (let k = deferBefore; k < ctx.deferred.length; k++) ctx.deferred[k].id = newId;
        if (table === 'teams') ctx.createdTeams.push(newId);
        if (table === 'issues' && b.blanked.length) ctx.notes.set(newId, b.blanked);
      }
      ctx.done.add(modelName);
    }

    // 3) Điền lại khoá ngoại đã hoãn (cha/con, thẻ cổng, trang của phê duyệt…).
    await progress(importId, 92, 'Linking records');
    for (const d of ctx.deferred) {
      const mapped = ctx.ids.get(d.target)?.get(d.old);
      if (mapped === undefined || d.id < 0) continue;
      await (prisma as unknown as Record<string, { update: (a: unknown) => Promise<unknown> }>)[d.delegate].update({ where: { id: d.id }, data: { [d.field]: mapped } });
    }

    // 4) Bộ đếm số thẻ; sự kiện "imported" cho thẻ có người không khớp; hiện dự án.
    const maxNum = await prisma.workIssue.aggregate({ where: { projectId }, _max: { number: true } });
    for (const [issueId, names] of ctx.notes) {
      await prisma.workHistory.create({ data: { issueId, actorId: null, actorKind: 'SYSTEM', field: 'imported', toValue: `Imported from ${[...new Set(names)].join(', ')}`.slice(0, 2000) } });
    }
    await prisma.workProject.update({ where: { id: projectId }, data: { issueCounter: Math.max(maxNum._max.number ?? 0, Number(src.issueCounter ?? 0)), deletedAt: null } });

    const result = { tables: ctx.counts, warnings: plan.warnings, people: plan.people.filter((p) => p.mappedTo).length, peopleUnmatched: plan.people.filter((p) => !p.mappedTo).length, teamsCreated: ctx.createdTeams.length };
    await prisma.workProjectImport.update({
      where: { id: importId },
      data: { status: 'DONE', progress: 100, stage: 'Done', result: result as unknown as Prisma.InputJsonValue, finishedAt: new Date(), filePath: null },
    });
    await exportStore().remove(job.filePath).catch(() => {});
    await audit({
      workspaceId: job.workspaceId, projectId, actorId: ctx.importerId, action: 'project.import', targetType: 'project', targetId: projectId,
      summary: `Imported project ${job.projectKey} from export of ${String(src.key)} “${String(src.name)}”`,
      detail: { importId, source: plan.source, counts: Object.fromEntries(Object.entries(ctx.counts).map(([k, v]) => [k, v.imported])) },
    });
  } catch (err) {
    logger.warn('[work] nhập dự án lỗi', { importId, err: (err as Error).message });
    // Dọn: dự án dở (cascade mọi bảng con) + bộ phận vừa tạo (chưa ai dùng).
    if (projectId) await prisma.workProject.delete({ where: { id: projectId } }).catch(() => {});
    if (ctx.createdTeams.length) await prisma.workTeam.deleteMany({ where: { id: { in: ctx.createdTeams }, issues: { none: {} } } }).catch(() => {});
    await prisma.workProjectImport.update({
      where: { id: importId },
      data: { status: 'FAILED', error: (err as Error).message.slice(0, 2000), finishedAt: new Date(), projectId: null },
    }).catch(() => {});
  } finally {
    await fs.promises.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

/** Đếm dòng từng bảng của một dự án (để test/so sánh sau khi nhập) — dùng đúng bộ nạp của bản xuất. */
export async function countProjectTables(projectId: number): Promise<Record<string, number>> {
  const issueIds = (await prisma.workIssue.findMany({ where: { projectId }, select: { id: true } })).map((i) => i.id);
  const out: Record<string, number> = {};
  for (const [name, load] of EXPORT_TABLES) out[name] = (await load(projectId, { issueIds })).length;
  return out;
}
