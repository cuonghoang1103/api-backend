/**
 * ============================================================
 * CUONGMINI CHO CẢ NHÓM — HẠN MỨC CỦA TRƯỞNG NHÓM (đợt 6, 18/10/2026)
 * ============================================================
 *
 * Chủ app chốt: người KHÔNG có Pro nhưng là thành viên một dự án CT Work mà trưởng nhóm (ADMIN/lead của dự án) có Pro
 * còn hạn ⇒ được dùng CuongMini (CLI · app desktop · VS Code) CHO DỰ ÁN ĐÓ, bằng hạn mức của trưởng nhóm.
 *
 * ⛔ Quyết định ở MÁY CHỦ (route `/agent/*` › `chiPro`), theo thứ tự:
 *   1. người gọi có Pro (hoặc key terminal) ⇒ dùng của họ — đường này KHÔNG bao giờ chạm tới hạn mức nhóm;
 *   2. không Pro, cuộc gắn `projectId` (`ctworkDuAn` trong thân/URL — app lấy từ `.cuongmini/ctwork.json`), người gọi
 *      là NGƯỜI (không phải agent) vào được dự án với vai khác CLIENT, nhà tài trợ (trưởng nhóm) có Pro còn hạn, và
 *      nhóm đang BẬT chia sẻ ⇒ dùng hạn mức trưởng nhóm, sổ ghi theo CẢ HAI id: `user_id` = người gọi,
 *      `step` = `nhom:p<projectId>:u<chủ>`;
 *   3. còn lại ⇒ 403 kèm câu hướng dẫn (song ngữ).
 *
 * Trần: mỗi thành viên mỗi NGÀY (USD) + cả nhóm mỗi THÁNG (USD), giờ Việt Nam — đếm từ sổ có sẵn
 * `interview_llm_call_logs` (feature `agent`, cột `step` mang dấu nhóm). Chỉ model FREE (khoá `free` của
 * `bangModel.ts`); model cần khoá vẫn cần khoá — và người dùng đường nhóm không có khoá.
 *
 * Cấu hình nằm trong `work_projects.settings.cuongMiniNhom` (JSON sẵn có — KHÔNG đổi schema):
 *   { bat: boolean, tranNgayNguoiUsd: number, tranThangNhomUsd: number, chuId?: number }
 * Không có cấu hình ⇒ MẶC ĐỊNH BẬT (chủ app muốn) với trần vừa phải. Trưởng nhóm chỉnh ở Project settings →
 * "CuongMini cho cả nhóm" (`GET/PUT /work/projects/:pid/cuongmini-team`, ADMIN dự án; agent CT Work bị chặn ở
 * `AGENT_DENIED_ROUTES`).
 */
import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { BadRequestError } from '../../middleware/errorHandler.js';
import { loadProjectAccess, requireProject } from '../work/permissions.js';
import { dauNgayVn, dauThangVn } from './anthropicChinhHang/hanMuc.js';

export interface CauHinhNhom {
  bat: boolean;
  /** USD mỗi thành viên mỗi ngày (giờ VN). */
  tranNgayNguoiUsd: number;
  /** USD cả nhóm mỗi tháng (giờ VN). */
  tranThangNhomUsd: number;
  /** Trưởng nhóm tài trợ (ADMIN dự án có Pro). `null` ⇒ tự chọn: lead ⇒ ADMIN cũ nhất có Pro. */
  chuId: number | null;
}

export const MAC_DINH_NHOM: CauHinhNhom = { bat: true, tranNgayNguoiUsd: 1, tranThangNhomUsd: 15, chuId: null };
const TRAN_TOI_DA_NGAY = 50;
const TRAN_TOI_DA_THANG = 1000;

const so = (v: unknown, mac: number, max: number): number =>
  (typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= max ? Math.round(v * 100) / 100 : mac);

/** Thuần: `settings` của dự án ⇒ cấu hình nhóm (thiếu/hỏng ⇒ mặc định từng ô). */
export function docCauHinhNhom(settings: unknown): CauHinhNhom {
  const s = (settings && typeof settings === 'object' ? settings : {}) as Record<string, unknown>;
  const c = (s.cuongMiniNhom && typeof s.cuongMiniNhom === 'object' ? s.cuongMiniNhom : {}) as Record<string, unknown>;
  return {
    bat: typeof c.bat === 'boolean' ? c.bat : MAC_DINH_NHOM.bat,
    tranNgayNguoiUsd: so(c.tranNgayNguoiUsd, MAC_DINH_NHOM.tranNgayNguoiUsd, TRAN_TOI_DA_NGAY),
    tranThangNhomUsd: so(c.tranThangNhomUsd, MAC_DINH_NHOM.tranThangNhomUsd, TRAN_TOI_DA_THANG),
    chuId: typeof c.chuId === 'number' && Number.isInteger(c.chuId) && c.chuId > 0 ? c.chuId : null,
  };
}

/** Dấu nhóm ghi vào cột `step` (≤ 40 ký tự). */
export function stepNhom(projectId: number, chuId: number): string { return `nhom:p${projectId}:u${chuId}`; }
const tienToNhom = (projectId: number): string => `nhom:p${projectId}:`;

/** Thuần: `ctworkDuAn` app gửi (số hoặc chuỗi số) ⇒ id dự án. */
export function docDuAnId(v: unknown): number | null {
  const n = typeof v === 'number' ? v : typeof v === 'string' && /^\d{1,9}$/.test(v) ? Number(v) : NaN;
  return Number.isInteger(n) && n > 0 && n < 1e9 ? n : null;
}

// ─── Nhà tài trợ (trưởng nhóm) ────────────────────────────────────

type KiemPro = (userId: number) => Promise<boolean>;
let kiemPro: KiemPro = async (userId) => (await import('../pro.service.js')).isProEffective(userId);
/** CHỈ cho test. */
export function _datKiemPro(f: KiemPro | null): void {
  kiemPro = f ?? (async (userId) => (await import('../pro.service.js')).isProEffective(userId));
}

export interface ChuNhom { id: number; username: string; ten: string }

/**
 * Trưởng nhóm tài trợ của dự án: `chuId` đã cấu hình (vẫn phải là ADMIN + Pro), không có thì project lead (nếu là
 * ADMIN), rồi các ADMIN theo thứ tự vào dự án. Chỉ NGƯỜI (kind HUMAN), Pro CÒN HẠN. `null` = không ai tài trợ.
 */
export async function timChuNhom(projectId: number, cauHinh?: CauHinhNhom): Promise<ChuNhom | null> {
  const p = await prisma.workProject.findFirst({
    where: { id: projectId, deletedAt: null },
    select: {
      leadId: true, settings: true,
      members: { where: { role: 'ADMIN' }, orderBy: { createdAt: 'asc' }, select: { userId: true, user: { select: { id: true, username: true, fullName: true, displayName: true, kind: true } } } },
    },
  });
  if (!p) return null;
  const ch = cauHinh ?? docCauHinhNhom(p.settings);
  const admins = p.members.filter((m) => m.user.kind !== 'AGENT');
  const thuTu = [
    ...(ch.chuId ? [ch.chuId] : []),
    ...(p.leadId ? [p.leadId] : []),
    ...admins.map((m) => m.userId),
  ].filter((v, i, a) => a.indexOf(v) === i);
  for (const id of thuTu) {
    const m = admins.find((x) => x.userId === id);
    if (!m) continue; // phải là ADMIN của dự án
    if (await kiemPro(id).catch(() => false)) {
      return { id, username: m.user.username, ten: m.user.displayName || m.user.fullName || m.user.username };
    }
    if (ch.chuId === id) return null; // trưởng nhóm đã chọn hết Pro ⇒ không tự chuyển sang người khác
  }
  return null;
}

// ─── Sổ: đã dùng bao nhiêu ────────────────────────────────────────

async function tongUsd(where: Prisma.InterviewLLMCallLogWhereInput): Promise<number> {
  const s = await prisma.interviewLLMCallLog.aggregate({ where: { feature: 'agent', ...where }, _sum: { costUsd: true } });
  return Math.round(Number(s._sum.costUsd ?? 0) * 10_000) / 10_000;
}

export async function daDungNhomThang(projectId: number, luc = new Date()): Promise<number> {
  return tongUsd({ step: { startsWith: tienToNhom(projectId) }, createdAt: { gte: dauThangVn(luc) } });
}

export async function daDungNguoiNgay(projectId: number, userId: number, luc = new Date()): Promise<number> {
  return tongUsd({ userId, step: { startsWith: tienToNhom(projectId) }, createdAt: { gte: dauNgayVn(luc) } });
}

// ─── Quyết định nguồn hạn mức ─────────────────────────────────────

export interface NguonNhom {
  loai: 'nhom';
  projectId: number;
  key: string;
  chu: ChuNhom;
  tranNgayNguoiUsd: number;
  tranThangNhomUsd: number;
  daDungNgay: number;
  daDungThang: number;
}
export type QuyetDinhNhom =
  | NguonNhom
  | { loai: 'tuChoi'; ma: 'NHOM_KHONG_GAN' | 'NHOM_KHONG_THANH_VIEN' | 'NHOM_AGENT' | 'NHOM_TAT' | 'NHOM_KHONG_CHU' | 'NHOM_HET_TRAN'; cau: string };

const tuChoi = (ma: Extract<QuyetDinhNhom, { loai: 'tuChoi' }>['ma'], vi: string, en: string): QuyetDinhNhom => ({ loai: 'tuChoi', ma, cau: `${vi} / ${en}` });

/**
 * Người KHÔNG có Pro gọi CuongMini cho dự án `projectId` — được dùng hạn mức trưởng nhóm không? (Người có Pro không
 * bao giờ tới đây: route chọn đường riêng trước.) `kiemTran: false` ⇒ chỉ kiểm quyền (dùng cho `/agent/tools`).
 */
export async function quyetDinhNhom(userId: number, projectId: number | null, o: { kiemTran?: boolean; luc?: Date } = {}): Promise<QuyetDinhNhom> {
  if (!projectId) {
    return tuChoi('NHOM_KHONG_GAN',
      'CuongMini cần gói Pro. Nếu bạn ở trong một nhóm CT Work mà trưởng nhóm có Pro: gắn thư mục với dự án đó (gõ /ctwork → Chọn dự án) rồi hỏi lại.',
      'CuongMini needs a Pro plan. If you are in a CT Work team whose lead has Pro, bind this folder to that project (/ctwork → Pick project) and ask again.');
  }
  try {
    const u = await prisma.user.findUnique({ where: { id: userId }, select: { kind: true } });
    if (!u || u.kind === 'AGENT') {
      return tuChoi('NHOM_AGENT', 'AI agent của CT Work không dùng hạn mức nhóm của CuongMini.', 'CT Work AI agents cannot use the team CuongMini allowance.');
    }
    const access = await loadProjectAccess(userId, projectId).catch(() => null);
    if (!access || access.principal === 'AGENT' || access.role === 'CLIENT') {
      return tuChoi('NHOM_KHONG_THANH_VIEN',
        'Bạn không phải thành viên dự án CT Work đang gắn với thư mục này, nên không dùng được hạn mức của nhóm. Cần gói Pro, hoặc nhờ trưởng nhóm thêm bạn vào dự án.',
        'You are not a member of the CT Work project bound to this folder, so the team allowance does not apply. Get Pro, or ask the team lead to add you to the project.');
    }
    const p = await prisma.workProject.findUnique({ where: { id: projectId }, select: { settings: true, key: true } });
    const ch = docCauHinhNhom(p?.settings);
    if (!ch.bat) {
      return tuChoi('NHOM_TAT',
        `Trưởng nhóm đã TẮT "CuongMini cho cả nhóm" ở dự án ${access.key}. Nhờ trưởng nhóm bật lại (Project settings → CuongMini cho cả nhóm), hoặc dùng gói Pro của bạn.`,
        `The team lead turned OFF "CuongMini for the whole team" in ${access.key}. Ask them to turn it back on (Project settings → CuongMini for the team), or use your own Pro plan.`);
    }
    const chu = await timChuNhom(projectId, ch);
    if (!chu) {
      return tuChoi('NHOM_KHONG_CHU',
        `Dự án ${access.key} chưa có trưởng nhóm (ADMIN) nào có gói Pro còn hạn, nên chưa có hạn mức nhóm để dùng.`,
        `No admin of ${access.key} has an active Pro plan, so there is no team allowance to use.`);
    }
    const luc = o.luc ?? new Date();
    const [daDungNgay, daDungThang] = await Promise.all([daDungNguoiNgay(projectId, userId, luc), daDungNhomThang(projectId, luc)]);
    const nguon: NguonNhom = {
      loai: 'nhom', projectId, key: access.key, chu,
      tranNgayNguoiUsd: ch.tranNgayNguoiUsd, tranThangNhomUsd: ch.tranThangNhomUsd, daDungNgay, daDungThang,
    };
    if (o.kiemTran !== false) {
      const het = chamTranNhom(nguon);
      if (het) return het;
    }
    return nguon;
  } catch (err) {
    /* Sổ/CSDL hỏng ⇒ TỪ CHỐI (tiền của người khác — khác ví của chính mình ở `quota.ts` được cho qua). */
    logger.warn('[cuongmini-nhom] không quyết định được nguồn hạn mức nhóm', { error: (err as Error).message });
    return tuChoi('NHOM_KHONG_GAN', 'Không kiểm được hạn mức nhóm lúc này — thử lại sau.', 'Could not check the team allowance right now — try again later.');
  }
}

/** Thuần: đã chạm trần nhóm chưa ⇒ câu từ chối, `null` = còn. */
export function chamTranNhom(n: Pick<NguonNhom, 'key' | 'tranNgayNguoiUsd' | 'tranThangNhomUsd' | 'daDungNgay' | 'daDungThang'>): QuyetDinhNhom | null {
  const usd = (x: number) => `${x.toLocaleString('en-US', { maximumFractionDigits: 2 })} $`;
  if (n.daDungNgay >= n.tranNgayNguoiUsd) {
    return tuChoi('NHOM_HET_TRAN',
      `Bạn đã dùng hết hạn mức nhóm ${n.key} hôm nay (${usd(n.daDungNgay)}/${usd(n.tranNgayNguoiUsd)}); làm mới lúc 0 giờ (giờ Việt Nam). Trưởng nhóm nới trần ở Project settings → CuongMini cho cả nhóm.`,
      `You have used today's ${n.key} team allowance (${usd(n.daDungNgay)}/${usd(n.tranNgayNguoiUsd)}); it resets at midnight (Vietnam time). The team lead can raise it in Project settings.`);
  }
  if (n.daDungThang >= n.tranThangNhomUsd) {
    return tuChoi('NHOM_HET_TRAN',
      `Nhóm ${n.key} đã dùng hết hạn mức tháng này (${usd(n.daDungThang)}/${usd(n.tranThangNhomUsd)}); làm mới đầu tháng sau. Trưởng nhóm nới trần ở Project settings → CuongMini cho cả nhóm.`,
      `Team ${n.key} has used this month's allowance (${usd(n.daDungThang)}/${usd(n.tranThangNhomUsd)}); it resets next month. The team lead can raise it in Project settings.`);
  }
  return null;
}

/** Dự án mà người KHÔNG Pro này dùng được đường nhóm (cho `/agent/tools` — app biết không hiện lời mời nâng cấp). */
export async function duAnNhomCuaNguoi(userId: number): Promise<Array<{ projectId: number; key: string }>> {
  try {
    const u = await prisma.user.findUnique({ where: { id: userId }, select: { kind: true } });
    if (!u || u.kind === 'AGENT') return [];
    const rows = await prisma.workProjectMember.findMany({
      where: { userId, role: { not: 'CLIENT' }, project: { deletedAt: null, archivedAt: null, workspace: { deletedAt: null } } },
      select: { projectId: true, project: { select: { key: true, settings: true } } },
      take: 50,
    });
    const ra: Array<{ projectId: number; key: string }> = [];
    for (const r of rows) {
      const ch = docCauHinhNhom(r.project.settings);
      if (!ch.bat) continue;
      if (await timChuNhom(r.projectId, ch)) ra.push({ projectId: r.projectId, key: r.project.key });
      if (ra.length >= 20) break;
    }
    return ra;
  } catch {
    return [];
  }
}

// ─── Trang cài đặt dự án ──────────────────────────────────────────

export interface BangNhom {
  cauHinh: CauHinhNhom;
  chu: ChuNhom | null;
  daDungThang: number;
  /** Ai dùng bao nhiêu (tháng này + hôm nay), nhiều nhất trước. */
  nguoi: Array<{ userId: number; username: string; ten: string; thang: number; homNay: number; soLuot: number }>;
  /** Người xem có quyền sửa không (ADMIN dự án). */
  sua: boolean;
  /** ADMIN có Pro chọn được làm trưởng nhóm tài trợ. */
  ungVien: Array<{ id: number; username: string; ten: string; pro: boolean }>;
}

export async function xemBangNhom(callerId: number, projectId: number, luc = new Date()): Promise<BangNhom> {
  const access = await requireProject(callerId, projectId, 'project.view');
  const p = await prisma.workProject.findUniqueOrThrow({
    where: { id: projectId },
    select: { settings: true, members: { where: { role: 'ADMIN' }, orderBy: { createdAt: 'asc' }, select: { user: { select: { id: true, username: true, fullName: true, displayName: true, kind: true } } } } },
  });
  const cauHinh = docCauHinhNhom(p.settings);
  const [chu, daDungThang, nhom] = await Promise.all([
    timChuNhom(projectId, cauHinh),
    daDungNhomThang(projectId, luc),
    prisma.interviewLLMCallLog.groupBy({
      by: ['userId'], where: { feature: 'agent', step: { startsWith: tienToNhom(projectId) }, createdAt: { gte: dauThangVn(luc) } },
      _sum: { costUsd: true }, _count: { _all: true },
    }),
  ]);
  const ids = nhom.map((x) => x.userId).filter((x): x is number => typeof x === 'number');
  const [users, homNay] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, username: true, fullName: true, displayName: true } }),
    prisma.interviewLLMCallLog.groupBy({
      by: ['userId'], where: { feature: 'agent', userId: { in: ids }, step: { startsWith: tienToNhom(projectId) }, createdAt: { gte: dauNgayVn(luc) } },
      _sum: { costUsd: true },
    }),
  ]);
  const r4 = (x: unknown) => Math.round(Number(x ?? 0) * 10_000) / 10_000;
  const nguoi = nhom.filter((x) => x.userId !== null).map((x) => {
    const u = users.find((y) => y.id === x.userId);
    return {
      userId: x.userId!, username: u?.username ?? `#${x.userId}`, ten: u ? (u.displayName || u.fullName || u.username) : `#${x.userId}`,
      thang: r4(x._sum.costUsd), homNay: r4(homNay.find((h) => h.userId === x.userId)?._sum.costUsd), soLuot: x._count._all,
    };
  }).sort((a, b) => b.thang - a.thang);
  const sua = access.principal === 'HUMAN' && access.role === 'ADMIN';
  const ungVien = sua
    ? await Promise.all(p.members.filter((m) => m.user.kind !== 'AGENT').map(async (m) => ({
      id: m.user.id, username: m.user.username, ten: m.user.displayName || m.user.fullName || m.user.username,
      pro: await kiemPro(m.user.id).catch(() => false),
    })))
    : [];
  return { cauHinh, chu, daDungThang, nguoi, sua, ungVien };
}

export async function datCauHinhNhom(callerId: number, projectId: number, input: Partial<CauHinhNhom>): Promise<BangNhom> {
  await requireProject(callerId, projectId, 'project.settings');
  const p = await prisma.workProject.findUniqueOrThrow({
    where: { id: projectId },
    select: { settings: true, members: { where: { role: 'ADMIN' }, select: { userId: true, user: { select: { kind: true } } } } },
  });
  const settings = (p.settings ?? {}) as Record<string, unknown>;
  const cu = docCauHinhNhom(settings);
  if (input.chuId !== undefined && input.chuId !== null) {
    const m = p.members.find((x) => x.userId === input.chuId);
    if (!m || m.user.kind === 'AGENT') throw new BadRequestError('The sponsoring lead must be a human ADMIN of this project', 'WORK_BAD_SPONSOR');
    if (!(await kiemPro(input.chuId).catch(() => false))) throw new BadRequestError('The sponsoring lead needs an active Pro plan', 'WORK_SPONSOR_NOT_PRO');
  }
  const moi = docCauHinhNhom({
    cuongMiniNhom: {
      ...cu,
      ...Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined)),
    },
  });
  await prisma.workProject.update({ where: { id: projectId }, data: { settings: { ...settings, cuongMiniNhom: moi } as unknown as Prisma.InputJsonValue } });
  logger.info('[cuongmini-nhom] đổi cấu hình', { projectId, callerId, truoc: cu, sau: moi });
  return xemBangNhom(callerId, projectId);
}
