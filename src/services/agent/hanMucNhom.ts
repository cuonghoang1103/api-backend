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
 * Không có cấu hình ⇒ MẶC ĐỊNH BẬT (chủ app muốn) với trần vừa phải: 5 $/người/ngày, 20 $/nhóm/tháng (19/10/2026 — trước
 * là 1 và 15; dự án đã LƯU số riêng giữ số đó, vì `docCauHinhNhom` chỉ lấy mặc định cho ô thiếu).
 * Chạm trần người/ngày ⇒ thành viên nhập MÃ GIA HẠN (`maGiaHanTien.ts`, trần `nhom:<pid>`): lần 1 trong ngày cộng ngay
 * một mức (= trần người/ngày), lần 2+ chờ nhà tài trợ hoặc admin web duyệt. Trưởng nhóm chỉnh ở Project settings →
 * "CuongMini cho cả nhóm" (`GET/PUT /work/projects/:pid/cuongmini-team`, ADMIN dự án; agent CT Work bị chặn ở
 * `AGENT_DENIED_ROUTES`).
 */
import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { BadRequestError } from '../../middleware/errorHandler.js';
import { loadProjectAccess, requireProject } from '../work/permissions.js';
import { dauNgayVn, dauThangVn } from './anthropicChinhHang/hanMuc.js';
import { tienGiaHanTheoKy } from './giaHanTienSo.js';

export interface CauHinhNhom {
  bat: boolean;
  /** USD mỗi thành viên mỗi ngày (giờ VN). */
  tranNgayNguoiUsd: number;
  /** USD cả nhóm mỗi tháng (giờ VN). */
  tranThangNhomUsd: number;
  /** Trưởng nhóm tài trợ (ADMIN dự án có Pro). `null` ⇒ tự chọn: lead ⇒ ADMIN cũ nhất có Pro. */
  chuId: number | null;
  /**
   * QA đợt 6 (🔴 lạm dụng): ADMIN đã TỰ đồng ý tài trợ (tự chọn chính mình ở tab CuongMini). Người TẠO dự án coi như đã
   * đồng ý. Không có ⇒ không bao giờ là nhà tài trợ — kể cả có Pro: ai cũng mời thẳng được một người Pro (biết email) làm
   * ADMIN dự án của mình (`inviteByEmail` thêm thẳng tài khoản có sẵn, không cần chấp nhận) rồi tiêu hạn mức của họ.
   */
  dongY: number[];
}

/** 19/10/2026 (chủ app chốt): 5 $/người/ngày · 20 $/nhóm/tháng — trước là 1 và 15. */
export const MAC_DINH_NHOM: CauHinhNhom = { bat: true, tranNgayNguoiUsd: 5, tranThangNhomUsd: 20, chuId: null, dongY: [] };
/** Dòng thành viên tạo cùng lúc với dự án (≤ ngần này) = người tạo dự án. */
const CUA_SO_NGUOI_TAO_MS = 5 * 60_000;
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
    dongY: Array.isArray(c.dongY) ? [...new Set(c.dongY.filter((x): x is number => typeof x === 'number' && Number.isInteger(x) && x > 0))].slice(0, 50) : [],
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
      leadId: true, settings: true, createdAt: true,
      members: { where: { role: 'ADMIN' }, orderBy: { createdAt: 'asc' }, select: { userId: true, createdAt: true, user: { select: { id: true, username: true, fullName: true, displayName: true, kind: true } } } },
    },
  });
  if (!p) return null;
  const ch = cauHinh ?? docCauHinhNhom(p.settings);
  const tao = await nguoiTaoDuAn(projectId, p.createdAt);
  /* Chỉ ADMIN đã ĐỒNG Ý (tự chọn mình ở tab CuongMini) hoặc người tạo dự án — xem `CauHinhNhom.dongY`. */
  const admins = p.members.filter((m) => m.user.kind !== 'AGENT' && (m.userId === tao || ch.dongY.includes(m.userId)));
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

/** Người tạo dự án: dòng thành viên SỚM NHẤT, tạo cùng lúc với dự án (cùng transaction `createProject`). */
async function nguoiTaoDuAn(projectId: number, taoLuc: Date): Promise<number | null> {
  const r = await prisma.workProjectMember.findFirst({ where: { projectId }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }], select: { userId: true, createdAt: true } });
  return r && r.createdAt.getTime() - taoLuc.getTime() <= CUA_SO_NGUOI_TAO_MS ? r.userId : null;
}

/** ADMIN này đã đồng ý tài trợ chưa (người tạo dự án ⇒ rồi). */
async function daDongY(projectId: number, ch: CauHinhNhom, userId: number): Promise<boolean> {
  if (ch.dongY.includes(userId)) return true;
  const p = await prisma.workProject.findUnique({ where: { id: projectId }, select: { createdAt: true } });
  return !!p && (await nguoiTaoDuAn(projectId, p.createdAt)) === userId;
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
  /** Mã gia hạn theo $ (19/10/2026): USD đã cấp thêm cho NGƯỜI này hôm nay ở dự án này — trần người/ngày = gốc + phần này. */
  giaHanNgay?: number;
}
export type QuyetDinhNhom =
  | NguonNhom
  | {
    loai: 'tuChoi'; ma: 'NHOM_KHONG_GAN' | 'NHOM_KHONG_THANH_VIEN' | 'NHOM_AGENT' | 'NHOM_TAT' | 'NHOM_KHONG_CHU' | 'NHOM_HET_TRAN'; cau: string;
    /** NHOM_HET_TRAN: trần nào chạm — CHỈ `nguoiNgay` gia hạn được bằng mã (trần tháng của nhóm thì trưởng nhóm nới). */
    tranCham?: 'nguoiNgay' | 'nhomThang';
    nguon?: NguonNhom;
  };

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
        `Dự án ${access.key} chưa có trưởng nhóm (ADMIN) nào có gói Pro còn hạn VÀ đã đồng ý tài trợ, nên chưa có hạn mức nhóm để dùng. Nhờ trưởng nhóm có Pro mở Project settings → CuongMini và chọn chính mình làm người tài trợ.`,
        `No admin of ${access.key} with an active Pro plan has agreed to sponsor, so there is no team allowance yet. Ask a lead with Pro to open Project settings → CuongMini and pick themselves as sponsor.`);
    }
    const luc = o.luc ?? new Date();
    const [daDungNgay, daDungThang, g] = await Promise.all([
      daDungNguoiNgay(projectId, userId, luc), daDungNhomThang(projectId, luc), tienGiaHanTheoKy(userId, `nhom:${projectId}`, luc),
    ]);
    const nguon: NguonNhom = {
      loai: 'nhom', projectId, key: access.key, chu,
      tranNgayNguoiUsd: ch.tranNgayNguoiUsd, tranThangNhomUsd: ch.tranThangNhomUsd, daDungNgay, daDungThang, giaHanNgay: g.ngay,
    };
    if (o.kiemTran !== false) {
      const het = chamTranNhom(nguon);
      if (het) return het.loai === 'tuChoi' ? { ...het, nguon } : het;
    }
    return nguon;
  } catch (err) {
    /* Sổ/CSDL hỏng ⇒ TỪ CHỐI (tiền của người khác — khác ví của chính mình ở `quota.ts` được cho qua). */
    logger.warn('[cuongmini-nhom] không quyết định được nguồn hạn mức nhóm', { error: (err as Error).message });
    return tuChoi('NHOM_KHONG_GAN', 'Không kiểm được hạn mức nhóm lúc này — thử lại sau.', 'Could not check the team allowance right now — try again later.');
  }
}

/** Thuần: đã chạm trần nhóm chưa ⇒ câu từ chối, `null` = còn. */
export function chamTranNhom(n: Pick<NguonNhom, 'key' | 'tranNgayNguoiUsd' | 'tranThangNhomUsd' | 'daDungNgay' | 'daDungThang' | 'giaHanNgay'>): QuyetDinhNhom | null {
  const usd = (x: number) => `${x.toLocaleString('en-US', { maximumFractionDigits: 2 })} $`;
  /* Trần tháng của NHÓM trước: nới trần người/ngày bằng mã không gỡ được trần tháng (tiền của nhà tài trợ). */
  if (n.daDungThang >= n.tranThangNhomUsd) {
    return { ...(tuChoi('NHOM_HET_TRAN',
      `Nhóm ${n.key} đã dùng hết hạn mức tháng này (${usd(n.daDungThang)}/${usd(n.tranThangNhomUsd)}); làm mới đầu tháng sau. Trưởng nhóm nới trần ở Project settings → CuongMini cho cả nhóm.`,
      `Team ${n.key} has used this month's allowance (${usd(n.daDungThang)}/${usd(n.tranThangNhomUsd)}); it resets next month. The team lead can raise it in Project settings.`) as Extract<QuyetDinhNhom, { loai: 'tuChoi' }>), tranCham: 'nhomThang' };
  }
  const tranNgay = Math.round((n.tranNgayNguoiUsd + (n.giaHanNgay ?? 0)) * 10_000) / 10_000;
  if (n.daDungNgay >= tranNgay) {
    return { ...(tuChoi('NHOM_HET_TRAN',
      `Bạn đã dùng hết hạn mức nhóm ${n.key} hôm nay (${usd(n.daDungNgay)}/${usd(tranNgay)}); làm mới lúc 0 giờ (giờ Việt Nam). Trưởng nhóm nới trần ở Project settings → CuongMini cho cả nhóm.`,
      `You have used today's ${n.key} team allowance (${usd(n.daDungNgay)}/${usd(tranNgay)}); it resets at midnight (Vietnam time). The team lead can raise it in Project settings.`) as Extract<QuyetDinhNhom, { loai: 'tuChoi' }>), tranCham: 'nguoiNgay' };
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
  /** Ai dùng bao nhiêu (tháng này + hôm nay), nhiều nhất trước. `giaHan`/`soLanGiaHan` = mã gia hạn ĐÃ CẤP tháng này. */
  nguoi: Array<{ userId: number; username: string; ten: string; thang: number; homNay: number; soLuot: number; giaHan: number; soLanGiaHan: number }>;
  /** Mã gia hạn (19/10/2026): yêu cầu của thành viên đang chờ duyệt — ADMIN dự án thấy, NHÀ TÀI TRỢ duyệt được. */
  choDuyet: Array<import('./maGiaHanTien.js').YeuCauView>;
  /** Người xem duyệt được không (= nhà tài trợ đang hiệu lực). */
  duyetDuoc: boolean;
  /** Người xem có quyền sửa không (ADMIN dự án). */
  sua: boolean;
  /** ADMIN có Pro chọn được làm trưởng nhóm tài trợ. */
  ungVien: Array<{ id: number; username: string; ten: string; pro: boolean; dongY: boolean }>;
  /** Người đang xem (giao diện biết "chọn chính mình" = đồng ý). */
  toiId: number;
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
  /* Mã gia hạn: tiền gia hạn ghi rõ theo người (kể cả người có lượt cấp mà chưa có dòng sổ nào — hiếm). */
  const { giaHanCuaNhom } = await import('./maGiaHanTien.js');
  const gh = await giaHanCuaNhom(projectId, luc).catch(() => ({ choDuyet: [], theoNguoi: [] as Array<{ userId: number; usd: number; soLan: number }> }));
  const ids = [...new Set([...nhom.map((x) => x.userId).filter((x): x is number => typeof x === 'number'), ...gh.theoNguoi.map((x) => x.userId)])];
  const [users, homNay] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, username: true, fullName: true, displayName: true } }),
    prisma.interviewLLMCallLog.groupBy({
      by: ['userId'], where: { feature: 'agent', userId: { in: ids }, step: { startsWith: tienToNhom(projectId) }, createdAt: { gte: dauNgayVn(luc) } },
      _sum: { costUsd: true },
    }),
  ]);
  const r4 = (x: unknown) => Math.round(Number(x ?? 0) * 10_000) / 10_000;
  const nguoi = ids.map((uid) => {
    const x = nhom.find((y) => y.userId === uid);
    const u = users.find((y) => y.id === uid);
    const g = gh.theoNguoi.find((y) => y.userId === uid);
    return {
      userId: uid, username: u?.username ?? `#${uid}`, ten: u ? (u.displayName || u.fullName || u.username) : `#${uid}`,
      thang: r4(x?._sum.costUsd), homNay: r4(homNay.find((h) => h.userId === uid)?._sum.costUsd), soLuot: x?._count._all ?? 0,
      giaHan: g?.usd ?? 0, soLanGiaHan: g?.soLan ?? 0,
    };
  }).sort((a, b) => b.thang - a.thang);
  const sua = access.principal === 'HUMAN' && access.role === 'ADMIN';
  const ungVien = sua
    ? await Promise.all(p.members.filter((m) => m.user.kind !== 'AGENT').map(async (m) => ({
      id: m.user.id, username: m.user.username, ten: m.user.displayName || m.user.fullName || m.user.username,
      pro: await kiemPro(m.user.id).catch(() => false),
      dongY: await daDongY(projectId, cauHinh, m.user.id),
    })))
    : [];
  /* Thành viên thường không thấy yêu cầu của người khác — chỉ ADMIN dự án (trưởng nhóm) thấy. */
  return { cauHinh, chu, daDungThang, nguoi, sua, ungVien, toiId: callerId, choDuyet: sua ? gh.choDuyet : [], duyetDuoc: sua && chu?.id === callerId };
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
    /* Chọn NGƯỜI KHÁC làm nhà tài trợ ⇒ người đó phải tự đồng ý trước (chọn chính mình ở tab này). */
    if (input.chuId !== callerId && !(await daDongY(projectId, cu, input.chuId))) {
      throw new BadRequestError('The sponsoring lead must agree first: they open Project settings → CuongMini with their own account and pick themselves', 'WORK_SPONSOR_NO_CONSENT');
    }
  }
  /* Nới trần = tiêu thêm tiền của nhà tài trợ ⇒ chỉ CHÍNH nhà tài trợ đang hiệu lực được nới (ADMIN khác chỉ hạ được). */
  const nangNgay = input.tranNgayNguoiUsd !== undefined && input.tranNgayNguoiUsd > cu.tranNgayNguoiUsd;
  const nangThang = input.tranThangNhomUsd !== undefined && input.tranThangNhomUsd > cu.tranThangNhomUsd;
  if (nangNgay || nangThang) {
    const chuNay = await timChuNhom(projectId, cu);
    if (chuNay && chuNay.id !== callerId && input.chuId !== callerId) {
      throw new BadRequestError(`Only the sponsoring lead (@${chuNay.username}) can raise the CuongMini limits`, 'WORK_SPONSOR_ONLY_RAISE');
    }
  }
  const { dongY: _boQua, ...vao } = input;
  void _boQua; // `dongY` không bao giờ nhận từ thân yêu cầu — chỉ sinh ra khi CHÍNH người đó chọn mình.
  /* Chọn CHÍNH mình ⇒ đồng ý; chọn người khác / "tự chọn" ⇒ rút đồng ý của mình (người tạo dự án vẫn được tính). */
  const dongY = input.chuId === callerId ? [...new Set([...cu.dongY, callerId])]
    : input.chuId !== undefined ? cu.dongY.filter((x) => x !== callerId) : cu.dongY;
  const moi = docCauHinhNhom({
    cuongMiniNhom: {
      ...cu,
      ...Object.fromEntries(Object.entries(vao).filter(([, v]) => v !== undefined)),
      dongY,
    },
  });
  await prisma.workProject.update({ where: { id: projectId }, data: { settings: { ...settings, cuongMiniNhom: moi } as unknown as Prisma.InputJsonValue } });
  logger.info('[cuongmini-nhom] đổi cấu hình', { projectId, callerId, truoc: cu, sau: moi });
  return xemBangNhom(callerId, projectId);
}
