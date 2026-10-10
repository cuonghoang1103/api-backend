/**
 * CT Work đợt 7c (C25 / CTW-21) — SỔ TÀI SẢN & GIẤY PHÉP của dự án.
 *
 * Ghi: phần mềm, license, tài khoản dịch vụ, thiết bị, font/ảnh/âm thanh/mô hình 3D, thư viện, dataset… kèm loại
 * giấy phép (MIT/Apache/GPL/CC BY/CC0/OFL/thương mại…), nguồn, người phụ trách, ngày hết hạn, chi phí, ghi công bắt buộc.
 * Nhắc trước hạn (cron hằng ngày, mỗi hạn ĐÚNG MỘT lần — `remindedFor`), xuất THIRD_PARTY_LICENSES / CREDITS,
 * liên kết tới thẻ / trang Docs dùng tài sản đó.
 *
 * ⚠️ KHÔNG BAO GIỜ lưu mật khẩu / khoá bí mật ở đây (tài khoản dịch vụ: chỉ ghi "ai giữ, để ở kho mật khẩu nào").
 *    `assertNoSecret` chặn những mẫu lộ liễu (sk-…, ghp_…, AKIA…, "password:") trong ghi chú.
 *
 * Quyền: xem = đội dự án + giảng viên (không khách cổng — route chốt ở clientPortalRouteAllowed); sửa = ADMIN/MEMBER
 * (`issue.edit`); xoá = người tạo hoặc ADMIN dự án. Agent: chỉ ĐỌC (AGENT_DENIED_ROUTES chặn ghi /assets).
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { PUBLIC_USER } from './common.js';
import { notifyWork } from './notify.js';
import { isClientScoped, loadProjectAccess, requireProject } from './permissions.js';

export const ASSET_CATEGORIES = ['SOFTWARE', 'LICENSE', 'SERVICE', 'DEVICE', 'FONT', 'IMAGE', 'AUDIO', 'VIDEO', 'MODEL_3D', 'LIBRARY', 'DATASET', 'OTHER'] as const;
export const LICENSE_TYPES = [
  'MIT', 'APACHE_2', 'BSD', 'GPL', 'LGPL', 'MPL', 'ISC', 'UNLICENSE',
  'CC0', 'CC_BY', 'CC_BY_SA', 'CC_BY_NC', 'CC_BY_ND', 'OFL',
  'COMMERCIAL', 'SUBSCRIPTION', 'EDUCATION', 'FREEWARE', 'PROPRIETARY', 'CUSTOM', 'UNKNOWN',
] as const;
export const ASSET_STATUSES = ['ACTIVE', 'EXPIRED', 'RETIRED'] as const;
export const BILLING = ['FREE', 'ONE_TIME', 'MONTHLY', 'YEARLY'] as const;

/** Tên đầy đủ + giấy phép có BẮT BUỘC ghi công không (gợi ý mặc định cho ô "Attribution required"). */
export const LICENSE_INFO: Record<(typeof LICENSE_TYPES)[number], { label: string; attribution: boolean; spdx: string | null }> = {
  MIT: { label: 'MIT License', attribution: true, spdx: 'MIT' },
  APACHE_2: { label: 'Apache License 2.0', attribution: true, spdx: 'Apache-2.0' },
  BSD: { label: 'BSD License', attribution: true, spdx: 'BSD-3-Clause' },
  GPL: { label: 'GNU GPL', attribution: true, spdx: 'GPL-3.0-or-later' },
  LGPL: { label: 'GNU LGPL', attribution: true, spdx: 'LGPL-3.0-or-later' },
  MPL: { label: 'Mozilla Public License 2.0', attribution: true, spdx: 'MPL-2.0' },
  ISC: { label: 'ISC License', attribution: true, spdx: 'ISC' },
  UNLICENSE: { label: 'The Unlicense', attribution: false, spdx: 'Unlicense' },
  CC0: { label: 'CC0 1.0 (public domain)', attribution: false, spdx: 'CC0-1.0' },
  CC_BY: { label: 'Creative Commons Attribution 4.0', attribution: true, spdx: 'CC-BY-4.0' },
  CC_BY_SA: { label: 'Creative Commons Attribution-ShareAlike 4.0', attribution: true, spdx: 'CC-BY-SA-4.0' },
  CC_BY_NC: { label: 'Creative Commons Attribution-NonCommercial 4.0', attribution: true, spdx: 'CC-BY-NC-4.0' },
  CC_BY_ND: { label: 'Creative Commons Attribution-NoDerivatives 4.0', attribution: true, spdx: 'CC-BY-ND-4.0' },
  OFL: { label: 'SIL Open Font License 1.1', attribution: true, spdx: 'OFL-1.1' },
  COMMERCIAL: { label: 'Commercial license', attribution: false, spdx: null },
  SUBSCRIPTION: { label: 'Subscription', attribution: false, spdx: null },
  EDUCATION: { label: 'Education / student license', attribution: false, spdx: null },
  FREEWARE: { label: 'Freeware', attribution: false, spdx: null },
  PROPRIETARY: { label: 'Proprietary', attribution: false, spdx: null },
  CUSTOM: { label: 'Custom license', attribution: false, spdx: null },
  UNKNOWN: { label: 'Unknown — check before release', attribution: false, spdx: null },
};

export interface AssetInput {
  name?: string;
  category?: (typeof ASSET_CATEGORIES)[number];
  licenseType?: (typeof LICENSE_TYPES)[number];
  licenseName?: string | null;
  licenseUrl?: string | null;
  source?: string | null;
  sourceUrl?: string | null;
  version?: string | null;
  ownerId?: number | null;
  status?: (typeof ASSET_STATUSES)[number];
  expiresAt?: string | null; // YYYY-MM-DD
  remindDays?: number;
  cost?: number | null;
  currency?: string;
  billing?: (typeof BILLING)[number];
  seats?: number | null;
  attributionRequired?: boolean;
  attribution?: string | null;
  notes?: string | null;
}

const DAY = 86_400_000;
const SECRET_RE = /(sk-[A-Za-z0-9_-]{16,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|xox[baprs]-[A-Za-z0-9-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|\b(pass(word)?|pwd|mật khẩu)\s*[:=]\s*\S{4,})/i;

/** Chặn dán bí mật vào sổ (hàm thuần — test bằng bảng). */
export function assertNoSecret(...texts: Array<string | null | undefined>): void {
  for (const t of texts) {
    if (t && SECRET_RE.test(t)) {
      throw new BadRequestError('This looks like a password or secret key. Never store secrets in the asset register — write who holds it and which password manager it is in.', 'WORK_ASSET_SECRET');
    }
  }
}

function httpUrl(u: string | null | undefined, field: string): string | null {
  const s = (u ?? '').trim();
  if (!s) return null;
  try {
    const x = new URL(s);
    if (x.protocol !== 'https:' && x.protocol !== 'http:') throw new Error();
    return s.slice(0, 500);
  } catch {
    throw new BadRequestError(`${field} must be an http(s) link`, 'VALIDATION_ERROR');
  }
}

/** Trạng thái hạn (thuần): EXPIRED / EXPIRING (trong `remindDays`) / OK / NONE. */
export function expiryState(expiresAt: Date | null, remindDays: number, now = new Date()): { state: 'NONE' | 'OK' | 'EXPIRING' | 'EXPIRED'; daysLeft: number | null } {
  if (!expiresAt) return { state: 'NONE', daysLeft: null };
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const days = Math.round((expiresAt.getTime() - today) / DAY);
  if (days < 0) return { state: 'EXPIRED', daysLeft: days };
  if (days <= remindDays) return { state: 'EXPIRING', daysLeft: days };
  return { state: 'OK', daysLeft: days };
}

/** Chi phí quy năm (để tổng hợp): MONTHLY ×12, YEARLY ×1, ONE_TIME/FREE như ghi. */
export function annualCost(cost: number | null, billing: string): number {
  if (!cost) return 0;
  return billing === 'MONTHLY' ? cost * 12 : cost;
}

async function teamCtx(userId: number, projectId: number, action: 'project.view' | 'issue.edit') {
  const access = await requireProject(userId, projectId, action);
  if (isClientScoped(access)) throw new NotFoundError('Project not found');
  return access;
}

const ASSET_SELECT = {
  id: true, number: true, name: true, category: true, licenseType: true, licenseName: true, licenseUrl: true, source: true, sourceUrl: true,
  version: true, ownerId: true, status: true, expiresAt: true, remindDays: true, remindedFor: true, cost: true, currency: true, billing: true,
  seats: true, attributionRequired: true, attribution: true, notes: true, createdById: true, createdAt: true, updatedAt: true,
  links: { select: { id: true, issueId: true, pageId: true } },
} satisfies Prisma.WorkAssetSelect;
type Row = Prisma.WorkAssetGetPayload<{ select: typeof ASSET_SELECT }>;

async function present(projectId: number, key: string, rows: Row[]) {
  const ownerIds = [...new Set(rows.map((r) => r.ownerId).filter((x): x is number => !!x))];
  const issueIds = [...new Set(rows.flatMap((r) => r.links.map((l) => l.issueId)).filter((x): x is number => !!x))];
  const pageIds = [...new Set(rows.flatMap((r) => r.links.map((l) => l.pageId)).filter((x): x is number => !!x))];
  const [owners, issues, pages] = await Promise.all([
    ownerIds.length ? prisma.user.findMany({ where: { id: { in: ownerIds } }, select: PUBLIC_USER }) : [],
    issueIds.length ? prisma.workIssue.findMany({ where: { id: { in: issueIds }, projectId, deletedAt: null }, select: { id: true, number: true, title: true } }) : [],
    pageIds.length ? prisma.workPage.findMany({ where: { id: { in: pageIds }, projectId, deletedAt: null }, select: { id: true, number: true, title: true } }) : [],
  ]);
  return rows.map((r) => {
    const exp = expiryState(r.expiresAt, r.remindDays);
    return {
      ...r,
      key: `AST-${r.number}`,
      cost: r.cost === null ? null : Number(r.cost),
      expiresAt: r.expiresAt ? r.expiresAt.toISOString().slice(0, 10) : null,
      remindedFor: undefined,
      expiry: exp,
      licenseLabel: r.licenseType === 'CUSTOM' && r.licenseName ? r.licenseName : LICENSE_INFO[r.licenseType as keyof typeof LICENSE_INFO]?.label ?? r.licenseType,
      owner: owners.find((o) => o.id === r.ownerId) ?? null,
      links: r.links.flatMap((l): Array<{ kind: 'ISSUE' | 'PAGE'; number: number; key: string; title: string }> => {
        if (l.issueId) { const i = issues.find((x) => x.id === l.issueId); return i ? [{ kind: 'ISSUE' as const, number: i.number, key: `${key}-${i.number}`, title: i.title }] : []; }
        const p = pages.find((x) => x.id === l.pageId);
        return p ? [{ kind: 'PAGE' as const, number: p.number, key: `DOC-${p.number}`, title: p.title }] : [];
      }),
    };
  });
}

export async function listAssets(userId: number, projectId: number, q: { category?: string; status?: string; expiring?: boolean } = {}) {
  const access = await teamCtx(userId, projectId, 'project.view');
  const rows = await prisma.workAsset.findMany({
    where: { projectId, deletedAt: null, ...(q.category ? { category: q.category } : {}), ...(q.status ? { status: q.status } : {}) },
    orderBy: [{ number: 'asc' }], take: 2000, select: ASSET_SELECT,
  });
  let items = await present(projectId, access.key, rows);
  if (q.expiring) items = items.filter((a) => a.expiry.state === 'EXPIRING' || a.expiry.state === 'EXPIRED');
  const active = items.filter((a) => a.status === 'ACTIVE');
  const byCurrency: Record<string, number> = {};
  for (const a of active) { const c = annualCost(a.cost, a.billing); if (c > 0) byCurrency[a.currency] = (byCurrency[a.currency] ?? 0) + c; }
  return {
    items,
    summary: {
      total: items.length,
      active: active.length,
      expiring: items.filter((a) => a.expiry.state === 'EXPIRING' && a.status === 'ACTIVE').length,
      expired: items.filter((a) => a.expiry.state === 'EXPIRED' && a.status !== 'RETIRED').length,
      needsAttribution: active.filter((a) => a.attributionRequired).length,
      unknownLicense: active.filter((a) => a.licenseType === 'UNKNOWN').length,
      annualCost: byCurrency,
    },
    canEdit: access.role === 'ADMIN' || access.role === 'MEMBER',
    options: { categories: ASSET_CATEGORIES, licenses: LICENSE_TYPES.map((k) => ({ key: k, ...LICENSE_INFO[k] })), statuses: ASSET_STATUSES, billing: BILLING },
  };
}

async function findAsset(projectId: number, number: number) {
  const a = await prisma.workAsset.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true, createdById: true, name: true, expiresAt: true } });
  if (!a) throw new NotFoundError('Asset not found');
  return a;
}

export async function getAsset(userId: number, projectId: number, number: number) {
  const access = await teamCtx(userId, projectId, 'project.view');
  const a = await findAsset(projectId, number);
  const row = await prisma.workAsset.findUniqueOrThrow({ where: { id: a.id }, select: ASSET_SELECT });
  return (await present(projectId, access.key, [row]))[0];
}

async function cleanInput(projectId: number, input: AssetInput, creating: boolean): Promise<Prisma.WorkAssetUncheckedUpdateInput> {
  const d: Prisma.WorkAssetUncheckedUpdateInput = {};
  if (input.name !== undefined || creating) {
    const n = (input.name ?? '').trim();
    if (!n) throw new BadRequestError('Name is required', 'WORK_NAME_REQUIRED');
    d.name = n.slice(0, 160);
  }
  if (input.category !== undefined) d.category = input.category;
  if (input.licenseType !== undefined) d.licenseType = input.licenseType;
  if (input.licenseName !== undefined) d.licenseName = input.licenseName?.trim().slice(0, 120) || null;
  if (input.licenseUrl !== undefined) d.licenseUrl = httpUrl(input.licenseUrl, 'License link');
  if (input.source !== undefined) d.source = input.source?.trim().slice(0, 300) || null;
  if (input.sourceUrl !== undefined) d.sourceUrl = httpUrl(input.sourceUrl, 'Source link');
  if (input.version !== undefined) d.version = input.version?.trim().slice(0, 60) || null;
  if (input.status !== undefined) d.status = input.status;
  if (input.expiresAt !== undefined) {
    if (input.expiresAt && !/^\d{4}-\d{2}-\d{2}$/.test(input.expiresAt)) throw new BadRequestError('Use YYYY-MM-DD for the expiry date', 'VALIDATION_ERROR');
    d.expiresAt = input.expiresAt ? new Date(`${input.expiresAt}T00:00:00.000Z`) : null;
    d.remindedFor = null; // hạn mới ⇒ nhắc lại
  }
  if (input.remindDays !== undefined) {
    if (!Number.isInteger(input.remindDays) || input.remindDays < 0 || input.remindDays > 365) throw new BadRequestError('Reminder must be 0–365 days before expiry', 'VALIDATION_ERROR');
    d.remindDays = input.remindDays;
  }
  if (input.cost !== undefined) {
    if (input.cost !== null && (!Number.isFinite(input.cost) || input.cost < 0 || input.cost > 1e12)) throw new BadRequestError('Cost must be a positive number', 'VALIDATION_ERROR');
    d.cost = input.cost;
  }
  if (input.currency !== undefined) {
    if (!/^[A-Z]{3}$/.test(input.currency)) throw new BadRequestError('Currency must be a 3-letter code (VND, USD…)', 'VALIDATION_ERROR');
    d.currency = input.currency;
  }
  if (input.billing !== undefined) d.billing = input.billing;
  if (input.seats !== undefined) d.seats = input.seats;
  if (input.attributionRequired !== undefined) d.attributionRequired = input.attributionRequired;
  if (input.attribution !== undefined) d.attribution = input.attribution?.trim().slice(0, 4000) || null;
  if (input.notes !== undefined) d.notes = input.notes?.trim().slice(0, 8000) || null;
  if (input.ownerId !== undefined) {
    if (input.ownerId !== null) {
      const a = await loadProjectAccess(input.ownerId, projectId);
      if (!a || isClientScoped(a)) throw new BadRequestError('The owner must be a member of this project', 'VALIDATION_ERROR');
    }
    d.ownerId = input.ownerId;
  }
  assertNoSecret(input.notes, input.attribution, input.source, input.name);
  return d;
}

export async function createAsset(userId: number, projectId: number, input: AssetInput & { name: string }) {
  await teamCtx(userId, projectId, 'issue.edit');
  const licenseType = input.licenseType ?? 'UNKNOWN';
  const data = await cleanInput(projectId, { ...input, licenseType, category: input.category ?? 'OTHER' }, true);
  if (input.attributionRequired === undefined) data.attributionRequired = LICENSE_INFO[licenseType]?.attribution ?? false;
  const count = await prisma.workAsset.count({ where: { projectId, deletedAt: null } });
  if (count >= 2000) throw new BadRequestError('A project can have at most 2000 assets', 'WORK_LIMIT');
  const num = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${31707}::int, ${projectId}::int)`;
    const agg = await tx.workAsset.aggregate({ where: { projectId }, _max: { number: true } });
    const n = (agg._max.number ?? 0) + 1;
    await tx.workAsset.create({ data: { ...(data as Prisma.WorkAssetUncheckedCreateInput), projectId, number: n, createdById: userId } });
    return n;
  });
  await auditProject(projectId, { actorId: userId, action: 'asset.create', targetType: 'asset', targetId: num, summary: `Added asset AST-${num} "${String(data.name)}" (${licenseType})` });
  return getAsset(userId, projectId, num);
}

export async function updateAsset(userId: number, projectId: number, number: number, input: AssetInput) {
  await teamCtx(userId, projectId, 'issue.edit');
  const a = await findAsset(projectId, number);
  const data = await cleanInput(projectId, input, false);
  if (Object.keys(data).length) await prisma.workAsset.update({ where: { id: a.id }, data });
  return getAsset(userId, projectId, number);
}

export async function deleteAsset(userId: number, projectId: number, number: number) {
  const access = await teamCtx(userId, projectId, 'issue.edit');
  const a = await findAsset(projectId, number);
  if (access.role !== 'ADMIN' && a.createdById !== userId) throw new ForbiddenError('Only the person who added this asset or a project admin can delete it');
  await prisma.workAsset.update({ where: { id: a.id }, data: { deletedAt: new Date() } });
  await auditProject(projectId, { actorId: userId, action: 'asset.delete', targetType: 'asset', targetId: number, summary: `Deleted asset AST-${number} "${a.name}"` });
  return { deleted: true };
}

/** Thay toàn bộ liên kết: issueKeys ("KEY-12" hoặc "12"), pageNumbers. */
export async function setAssetLinks(userId: number, projectId: number, number: number, input: { issues?: Array<string | number>; pages?: number[] }) {
  const access = await teamCtx(userId, projectId, 'issue.edit');
  const a = await findAsset(projectId, number);
  const nums = (input.issues ?? []).map((x) => Number(String(x).replace(/^[A-Za-z][A-Za-z0-9]*-/, ''))).filter((n) => Number.isInteger(n) && n > 0);
  if (nums.length > 50 || (input.pages?.length ?? 0) > 50) throw new BadRequestError('Link at most 50 issues and 50 documents', 'WORK_LIMIT');
  const [issues, pages] = await Promise.all([
    nums.length ? prisma.workIssue.findMany({ where: { projectId, number: { in: nums }, deletedAt: null }, select: { id: true, number: true } }) : [],
    input.pages?.length ? prisma.workPage.findMany({ where: { projectId, number: { in: input.pages }, deletedAt: null }, select: { id: true, number: true } }) : [],
  ]);
  const missing = nums.filter((n) => !issues.some((i) => i.number === n));
  if (missing.length) throw new BadRequestError(`Issue ${access.key}-${missing[0]} not found`, 'VALIDATION_ERROR');
  await prisma.$transaction([
    prisma.workAssetLink.deleteMany({ where: { assetId: a.id } }),
    prisma.workAssetLink.createMany({ data: [...issues.map((i) => ({ assetId: a.id, issueId: i.id })), ...pages.map((p) => ({ assetId: a.id, pageId: p.id }))], skipDuplicates: true }),
  ]);
  return getAsset(userId, projectId, number);
}

/** Tài sản đang dùng trong một thẻ (khung bên thẻ). */
export async function assetsOfIssue(userId: number, projectId: number, issueNumber: number) {
  await teamCtx(userId, projectId, 'project.view');
  const i = await prisma.workIssue.findFirst({ where: { projectId, number: issueNumber, deletedAt: null }, select: { id: true } });
  if (!i) throw new NotFoundError('Issue not found');
  const rows = await prisma.workAsset.findMany({ where: { projectId, deletedAt: null, links: { some: { issueId: i.id } } }, select: { number: true, name: true, licenseType: true, expiresAt: true, status: true } });
  return rows.map((r) => ({ ...r, key: `AST-${r.number}`, expiresAt: r.expiresAt?.toISOString().slice(0, 10) ?? null }));
}

// ─── Xuất ────────────────────────────────────────────────────────

/**
 * THIRD_PARTY_LICENSES (markdown/txt) hoặc CREDITS (chỉ phần cần ghi công). Bỏ tài sản RETIRED. Gom theo loại giấy phép.
 * Giấy phép UNKNOWN vẫn liệt kê kèm cảnh báo — bản phát hành không được im lặng bỏ sót.
 */
export function renderLicenses(project: { key: string; name: string }, rows: Array<{ name: string; version: string | null; licenseType: string; licenseName: string | null; licenseUrl: string | null; source: string | null; sourceUrl: string | null; attributionRequired: boolean; attribution: string | null; category: string; status: string }>, kind: 'licenses' | 'credits', format: 'md' | 'txt'): string {
  const md = format === 'md';
  const live = rows.filter((r) => r.status !== 'RETIRED' && (kind === 'licenses' || r.attributionRequired));
  const h1 = (s: string) => (md ? `# ${s}` : `${s}\n${'='.repeat(s.length)}`);
  const h2 = (s: string) => (md ? `## ${s}` : `${s}\n${'-'.repeat(s.length)}`);
  const out: string[] = [h1(kind === 'credits' ? `${project.name} — Credits` : `${project.name} — Third-party licenses`), ''];
  out.push(kind === 'credits'
    ? 'This project uses the following third-party works. Their licenses require this attribution.'
    : `This file lists third-party software and assets used by ${project.name} (${project.key}) and their licenses. Generated by CT Work from the project asset register.`);
  out.push('');
  const unknown = live.filter((r) => r.licenseType === 'UNKNOWN');
  if (unknown.length && kind === 'licenses') {
    out.push(md ? `> ⚠️ ${unknown.length} item(s) have an UNKNOWN license — confirm before releasing.` : `WARNING: ${unknown.length} item(s) have an UNKNOWN license — confirm before releasing.`, '');
  }
  const groups = new Map<string, typeof live>();
  for (const r of live) {
    const label = r.licenseType === 'CUSTOM' && r.licenseName ? r.licenseName : LICENSE_INFO[r.licenseType as keyof typeof LICENSE_INFO]?.label ?? r.licenseType;
    groups.set(label, [...(groups.get(label) ?? []), r]);
  }
  for (const [label, list] of [...groups].sort((a, b) => a[0].localeCompare(b[0]))) {
    out.push(h2(label), '');
    for (const r of list.sort((a, b) => a.name.localeCompare(b.name))) {
      const title = `${r.name}${r.version ? ` ${r.version}` : ''}`;
      const bits = [r.source && `by ${r.source}`, r.sourceUrl, r.licenseUrl && `license: ${r.licenseUrl}`].filter(Boolean).join(' · ');
      out.push(md ? `- **${title}**${bits ? ` — ${bits}` : ''}` : `* ${title}${bits ? ` — ${bits}` : ''}`);
      if (r.attribution) out.push(md ? `  - ${r.attribution.replace(/\n+/g, ' ')}` : `    ${r.attribution.replace(/\n+/g, ' ')}`);
    }
    out.push('');
  }
  if (!live.length) out.push(kind === 'credits' ? 'No assets require attribution.' : 'No third-party items recorded.', '');
  return `${out.join('\n').trimEnd()}\n`;
}

export async function exportLicenses(userId: number, projectId: number, kind: 'licenses' | 'credits', format: 'md' | 'txt' | 'csv') {
  await teamCtx(userId, projectId, 'project.view');
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, name: true } });
  const rows = await prisma.workAsset.findMany({ where: { projectId, deletedAt: null }, orderBy: { number: 'asc' } });
  if (format === 'csv') {
    const esc = (v: unknown) => { const s = v === null || v === undefined ? '' : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const head = ['Key', 'Name', 'Category', 'Version', 'License', 'License URL', 'Source', 'Source URL', 'Owner ID', 'Status', 'Expires', 'Cost', 'Currency', 'Billing', 'Seats', 'Attribution required', 'Attribution'];
    const lines = rows.map((r) => [`AST-${r.number}`, r.name, r.category, r.version, r.licenseType === 'CUSTOM' && r.licenseName ? r.licenseName : r.licenseType, r.licenseUrl, r.source, r.sourceUrl, r.ownerId, r.status, r.expiresAt?.toISOString().slice(0, 10), r.cost === null ? '' : Number(r.cost), r.currency, r.billing, r.seats, r.attributionRequired ? 'yes' : 'no', r.attribution].map(esc).join(','));
    return { fileName: `${p.key}-asset-register.csv`, mime: 'text/csv; charset=utf-8', body: `﻿${[head.join(','), ...lines].join('\n')}\n` };
  }
  const body = renderLicenses(p, rows, kind, format === 'md' ? 'md' : 'txt');
  const base = kind === 'credits' ? 'CREDITS' : 'THIRD_PARTY_LICENSES';
  return { fileName: `${base}.${format}`, mime: format === 'md' ? 'text/markdown; charset=utf-8' : 'text/plain; charset=utf-8', body };
}

// ─── Nhắc trước hạn (cron hằng ngày) ─────────────────────────────

/** Mỗi hạn nhắc ĐÚNG MỘT lần: giành `remindedFor = expiresAt` bằng updateMany có điều kiện (hai tiến trình không nhắc đôi). */
export async function runAssetReminders(now = new Date()): Promise<number> {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const rows = await prisma.workAsset.findMany({
    where: { deletedAt: null, status: 'ACTIVE', expiresAt: { not: null, lte: new Date(today.getTime() + 366 * DAY) }, project: { deletedAt: null, archivedAt: null } },
    select: { id: true, number: true, name: true, projectId: true, ownerId: true, createdById: true, expiresAt: true, remindDays: true, remindedFor: true, project: { select: { key: true, workspace: { select: { slug: true } } } } },
    take: 5000,
  });
  let sent = 0;
  for (const a of rows) {
    const st = expiryState(a.expiresAt, a.remindDays, now);
    if (st.state !== 'EXPIRING' && st.state !== 'EXPIRED') continue;
    if (a.remindedFor && a.expiresAt && a.remindedFor.getTime() === a.expiresAt.getTime()) continue;
    const claimed = await prisma.workAsset.updateMany({ where: { id: a.id, OR: [{ remindedFor: null }, { remindedFor: { not: a.expiresAt! } }] }, data: { remindedFor: a.expiresAt } });
    if (!claimed.count) continue;
    const to = new Set<number>([a.ownerId, a.createdById].filter((x): x is number => !!x));
    if (!to.size) {
      const admins = await prisma.workProjectMember.findMany({ where: { projectId: a.projectId, role: 'ADMIN' }, select: { userId: true }, take: 3 });
      admins.forEach((m) => to.add(m.userId));
    }
    const msg = st.state === 'EXPIRED'
      ? `License/asset "${a.name}" expired on ${a.expiresAt!.toISOString().slice(0, 10)}`
      : `License/asset "${a.name}" expires in ${st.daysLeft} day${st.daysLeft === 1 ? '' : 's'} (${a.expiresAt!.toISOString().slice(0, 10)})`;
    for (const uid of to) {
      if (!(await loadProjectAccess(uid, a.projectId))) continue;
      // Chuông cần người gửi khác người nhận: lấy người tạo/owner còn lại, không có thì chính người đó (pushWork chặn tự báo ⇒ chỉ email).
      const sender = [...to].find((x) => x !== uid) ?? a.createdById ?? uid;
      await notifyWork({
        receiverId: uid, senderId: sender, type: 'WORK_ALERT', entityId: a.id,
        payload: { issueKey: `AST-${a.number}`, title: a.name, message: msg, url: `/work/${a.project.workspace.slug}/${a.project.key}/assets?asset=${a.number}` },
      }).catch((err) => logger.warn('[work] nhắc hạn tài sản lỗi', { assetId: a.id, err: (err as Error).message }));
      sent += 1;
    }
  }
  return sent;
}

/** Widget: tài sản sắp/đã hết hạn của dự án (đội dự án). */
export async function expiringAssets(userId: number, projectId: number, withinDays = 60) {
  await teamCtx(userId, projectId, 'project.view');
  const now = new Date();
  const rows = await prisma.workAsset.findMany({
    where: { projectId, deletedAt: null, status: { not: 'RETIRED' }, expiresAt: { not: null, lte: new Date(now.getTime() + withinDays * DAY) } },
    orderBy: { expiresAt: 'asc' }, take: 20,
    select: { number: true, name: true, licenseType: true, expiresAt: true, remindDays: true, cost: true, currency: true, billing: true },
  });
  return rows.map((r) => ({ key: `AST-${r.number}`, number: r.number, name: r.name, licenseType: r.licenseType, expiresAt: r.expiresAt!.toISOString().slice(0, 10), daysLeft: expiryState(r.expiresAt, r.remindDays, now).daysLeft, cost: r.cost === null ? null : Number(r.cost), currency: r.currency, billing: r.billing }));
}
