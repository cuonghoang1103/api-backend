/**
 * ============================================================
 * NHÓM CT WORK CÓ ADMIN WEB ⇒ CUONGMINI KHÔNG GIỚI HẠN TIỀN (đợt 8A, 19/10/2026)
 * ============================================================
 *
 * Chủ app chốt: phiên CuongMini (CLI · app desktop · VS Code) GẮN một dự án CT Work mà ADMIN WEB (vai admin của site —
 * `pro.service.ts › laAdmin`) là thành viên / trưởng dự án / chủ không gian ⇒ MỌI thành viên dự án đó dùng được
 * CuongMini Sonic 5.5, Heshin 5.5 (chính hãng), Solid — và Default / Classic như mọi người — ADMIN WEB TRẢ, KHÔNG trần $.
 * Chỉ chống spam (dùng lại bộ đếm `defaultGioiHan.ts`): ≤ 10 câu/phút/người, ≤ 300 câu/ngày/người, ≤ 1500 câu/ngày/IP.
 *
 * Xây trên hạn mức nhóm đợt 6 (`hanMucNhom.ts`) — nhà tài trợ = admin web, trần null — nhưng tách SỔ riêng:
 *   `step = taitro:p<projectId>:u<adminId>` (câu hỏi MỚI thêm `:l`) ⇒ sổ theo người dùng (user_id) + nhà tài trợ + dự án,
 *   KHÔNG ăn trần $ nhóm đợt 6 (`nhom:` của trưởng nhóm), KHÔNG ăn ví 5 giờ / trần model riêng của người dùng
 *   (`viTien.ts`, `tranModel.ts` bỏ `taitro:`), lượt chính hãng ghi `viec = agent_taitro` (không ăn trần chính hãng riêng).
 *
 * ĐỒNG Ý của nhà tài trợ: admin có MỘT công tắc "Tài trợ CuongMini cho mọi dự án tôi tham gia" — MẶC ĐỊNH BẬT theo yêu
 * cầu chủ app — và tắt được TỪNG dự án. Lưu ở `app_settings.cuongmini_tai_tro_admin` = `{ "<adminId>": { bat, tatDuAn } }`
 * (không đổi schema). Agent CT Work (kind AGENT) không bao giờ đi đường này. Rambo sập ⇒ Default chạy Solid (admin trả),
 * KHÔNG báo bảo trì như Free.
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { loadProjectAccess } from '../work/permissions.js';
import { BoDemDefault, docGioiHanDefault, kiemThuan, type GioiHanDefault, type KetQuaKiem } from './defaultGioiHan.js';
import { dauNgayVn } from './anthropicChinhHang/hanMuc.js';
import { MA_DEFAULT } from './bangModel.js';

const KHOA = 'cuongmini_tai_tro_admin';

/** Model nhà tài trợ trả: Sonic 5.5 · Heshin 5.5 (chính hãng) · Solid + Default + nhóm Classic (rambo). */
/* 27/10/2026: tài trợ = CuongMini Pro (+ đích dự phòng ngầm). Pro 2 / Max / Fable Max vẫn cần khoá riêng. */
export const MODEL_TAI_TRO: ReadonlySet<string> = new Set([MA_DEFAULT, 'cm-solid']);
export function dungChoTaiTro(m: { id?: string }): boolean {
  return typeof m.id === 'string' && MODEL_TAI_TRO.has(m.id);
}

/** Trần ngày theo NGƯỜI của đường tài trợ (cao — chỉ chống spam). */
export const NGAY_TAI_TRO = 300;

export interface CauHinhTaiTro { bat: boolean; tatDuAn: number[] }
export const MAC_DINH_TAI_TRO: CauHinhTaiTro = Object.freeze({ bat: true, tatDuAn: [] }) as CauHinhTaiTro;

/** THUẦN: JSON đã lưu ⇒ cấu hình của một admin (thiếu ⇒ mặc định BẬT). */
export function docCauHinhTaiTro(tatCa: unknown, adminId: number): CauHinhTaiTro {
  const o = (tatCa && typeof tatCa === 'object' ? (tatCa as Record<string, unknown>)[String(adminId)] : null) as Record<string, unknown> | null;
  if (!o || typeof o !== 'object') return { ...MAC_DINH_TAI_TRO, tatDuAn: [] };
  return {
    bat: typeof o.bat === 'boolean' ? o.bat : true,
    tatDuAn: Array.isArray(o.tatDuAn) ? [...new Set(o.tatDuAn.filter((x): x is number => typeof x === 'number' && Number.isInteger(x) && x > 0))].slice(0, 500) : [],
  };
}

let nhoCauHinh: { luc: number; v: Record<string, unknown> } | null = null;
async function docTatCa(): Promise<Record<string, unknown>> {
  if (nhoCauHinh && Date.now() - nhoCauHinh.luc < 30_000) return nhoCauHinh.v;
  let v: Record<string, unknown> = {};
  try {
    const r = await prisma.appSetting.findUnique({ where: { key: KHOA } });
    if (r?.value) v = JSON.parse(r.value) as Record<string, unknown>;
  } catch { /* hỏng ⇒ mặc định */ }
  nhoCauHinh = { luc: Date.now(), v };
  return v;
}

export async function cauHinhTaiTroCua(adminId: number): Promise<CauHinhTaiTro> {
  return docCauHinhTaiTro(await docTatCa(), adminId);
}

/** Admin đổi công tắc chung (`bat`) và/hoặc một dự án (`duAn`). */
export async function datCauHinhTaiTro(adminId: number, o: { bat?: boolean; duAn?: { id: number; bat: boolean } }): Promise<CauHinhTaiTro> {
  const tatCa = { ...(await docTatCa()) };
  const cu = docCauHinhTaiTro(tatCa, adminId);
  const moi: CauHinhTaiTro = { bat: typeof o.bat === 'boolean' ? o.bat : cu.bat, tatDuAn: [...cu.tatDuAn] };
  if (o.duAn) {
    moi.tatDuAn = o.duAn.bat ? moi.tatDuAn.filter((x) => x !== o.duAn!.id) : [...new Set([...moi.tatDuAn, o.duAn.id])];
  }
  tatCa[String(adminId)] = moi;
  const value = JSON.stringify(tatCa);
  await prisma.appSetting.upsert({ where: { key: KHOA }, update: { value }, create: { key: KHOA, value } });
  nhoCauHinh = { luc: Date.now(), v: tatCa };
  nhoQuyetDinh.clear();
  nhoNha.clear();
  logger.info('[tai-tro-admin] đổi công tắc', { adminId, bat: moi.bat, soDuAnTat: moi.tatDuAn.length });
  return moi;
}

// ─── Admin web nào tài trợ dự án này ─────────────────────────────

type KiemAdmin = (userId: number) => Promise<boolean>;
let kiemAdmin: KiemAdmin = async (id) => (await import('../pro.service.js')).laAdmin(id);
/** CHỈ cho test. */
export function _datKiemAdmin(f: KiemAdmin | null): void {
  kiemAdmin = f ?? (async (id) => (await import('../pro.service.js')).laAdmin(id));
  nhoQuyetDinh.clear();
  nhoNha.clear();
}

export interface NhaTaiTro { id: number; username: string; ten: string }

/** Admin web là thành viên / trưởng dự án / chủ không gian của dự án — và CHƯA tắt tài trợ cho dự án này. */
const nhoNha = new Map<number, { luc: number; v: NhaTaiTro | null }>();
export async function timAdminTaiTro(projectId: number): Promise<NhaTaiTro | null> {
  const nho = nhoNha.get(projectId);
  if (nho && Date.now() - nho.luc < 60_000) return nho.v;
  const v = await timAdminTaiTroGoc(projectId);
  nhoNha.set(projectId, { luc: Date.now(), v });
  if (nhoNha.size > 5000) nhoNha.clear();
  return v;
}
async function timAdminTaiTroGoc(projectId: number): Promise<NhaTaiTro | null> {
  const p = await prisma.workProject.findFirst({
    where: { id: projectId, deletedAt: null, workspace: { deletedAt: null } },
    select: {
      leadId: true,
      workspace: { select: { ownerId: true } },
      members: { where: { role: { not: 'CLIENT' } }, orderBy: { createdAt: 'asc' }, select: { userId: true } },
    },
  });
  if (!p) return null;
  const ids = [...new Set([p.workspace.ownerId, ...(p.leadId ? [p.leadId] : []), ...p.members.map((m) => m.userId)])].slice(0, 300);
  const users = await prisma.user.findMany({ where: { id: { in: ids }, kind: { not: 'AGENT' } }, select: { id: true, username: true, fullName: true, displayName: true } });
  for (const id of ids) {
    const u = users.find((x) => x.id === id);
    if (!u) continue;
    if (!(await kiemAdmin(id).catch(() => false))) continue;
    const ch = await cauHinhTaiTroCua(id);
    if (!ch.bat || ch.tatDuAn.includes(projectId)) continue;
    return { id, username: u.username, ten: u.displayName || u.fullName || u.username };
  }
  return null;
}

export interface NguonTaiTro {
  loai: 'taiTro';
  projectId: number;
  key: string;
  nhaTaiTro: NhaTaiTro;
}
export type QuyetDinhTaiTro =
  | NguonTaiTro
  | { loai: 'khong'; ma: 'TAI_TRO_KHONG_GAN' | 'TAI_TRO_AGENT' | 'TAI_TRO_KHONG_THANH_VIEN' | 'TAI_TRO_KHONG_CO' };

/** Đệm 60 s theo (người, dự án) — mỗi BƯỚC agent là một lời gọi `/turn`. */
const nhoQuyetDinh = new Map<string, { luc: number; v: QuyetDinhTaiTro }>();

export async function quyetDinhTaiTro(userId: number, projectId: number | null): Promise<QuyetDinhTaiTro> {
  if (!projectId) return { loai: 'khong', ma: 'TAI_TRO_KHONG_GAN' };
  const k = `${userId}:${projectId}`;
  const nho = nhoQuyetDinh.get(k);
  if (nho && Date.now() - nho.luc < 60_000) return nho.v;
  let v: QuyetDinhTaiTro;
  try {
    const u = await prisma.user.findUnique({ where: { id: userId }, select: { kind: true } });
    if (!u || u.kind === 'AGENT') v = { loai: 'khong', ma: 'TAI_TRO_AGENT' };
    else {
      const access = await loadProjectAccess(userId, projectId).catch(() => null);
      if (!access || access.principal === 'AGENT' || access.role === 'CLIENT') v = { loai: 'khong', ma: 'TAI_TRO_KHONG_THANH_VIEN' };
      else {
        const nha = await timAdminTaiTro(projectId);
        v = nha ? { loai: 'taiTro', projectId, key: access.key, nhaTaiTro: nha } : { loai: 'khong', ma: 'TAI_TRO_KHONG_CO' };
      }
    }
  } catch (err) {
    logger.warn('[tai-tro-admin] không quyết định được', { error: (err as Error).message });
    return { loai: 'khong', ma: 'TAI_TRO_KHONG_CO' };
  }
  nhoQuyetDinh.set(k, { luc: Date.now(), v });
  if (nhoQuyetDinh.size > 5000) nhoQuyetDinh.clear();
  return v;
}

/** Dấu sổ. `cauMoi` ⇒ thêm `:l` (đếm câu hỏi/ngày sau khởi động lại). ≤ 40 ký tự. */
export function stepTaiTro(projectId: number, adminId: number, cauMoi = false): string {
  return `taitro:p${projectId}:u${adminId}${cauMoi ? ':l' : ''}`;
}
export const TIEN_TO_TAI_TRO = 'taitro:';

// ─── Chống spam (dùng lại bộ đếm của CuongMini Default) ──────────

const BO = new BoDemDefault();
export function gioiHanTaiTro(gh: GioiHanDefault): GioiHanDefault {
  return { phutNguoi: gh.phutNguoi, ngayFree: NGAY_TAI_TRO, ngayIp: gh.ngayIp, buocNgayFree: 0 };
}

async function napNgayTuSo(userId: number, now: number): Promise<void> {
  if (BO.coNgayNguoi(userId, now)) return;
  try {
    const so = await prisma.interviewLLMCallLog.count({
      where: { userId, feature: 'agent', step: { startsWith: TIEN_TO_TAI_TRO, endsWith: ':l' }, createdAt: { gte: dauNgayVn(new Date(now)) } },
    });
    if (!BO.coNgayNguoi(userId, now)) BO.datNgayNguoi(userId, so, now);
  } catch {
    BO.datNgayNguoi(userId, 0, now);
  }
}

/** Kiểm + ghi một câu hỏi MỚI trên đường tài trợ. Câu báo đổi tên sản phẩm cho đúng (không phải "Default"). */
export async function kiemVaGhiLuotTaiTro(o: { userId: number; ip: string | null }): Promise<KetQuaKiem> {
  const now = Date.now();
  const gh = gioiHanTaiTro(await docGioiHanDefault());
  await napNgayTuSo(o.userId, now);
  const kq = kiemThuan(BO, gh, { userId: o.userId, ip: o.ip, free: true, now });
  if (kq.ok) BO.ghi(o.userId, o.ip, now);
  else logger.info('[tai-tro-admin] chạm chống spam', { userId: o.userId, ma: kq.ma });
  if (kq.ok) return kq;
  return { ...kq, cau: kq.cau.replace(/CuongMini Default/g, 'CuongMini (nhóm được admin tài trợ)').replace(/Gói Pro không có trần ngày\. |Pro has no daily cap\./g, '') };
}

/** Đếm cho `/usage`: câu trong phút + hôm nay. */
export async function demTaiTro(userId: number): Promise<{ phut: number; ngay: number; tranPhut: number; tranNgay: number }> {
  const now = Date.now();
  await napNgayTuSo(userId, now);
  const gh = gioiHanTaiTro(await docGioiHanDefault());
  return { phut: BO.soPhut(userId, now).length, ngay: BO.soNgayNguoi(userId, now), tranPhut: gh.phutNguoi, tranNgay: gh.ngayFree };
}

/** CHỈ cho test: xoá bộ đếm + đệm. */
export function _datLaiTaiTro(): void {
  BO.phut.clear(); BO.ngayNguoi.clear(); BO.ngayIp.clear();
  nhoQuyetDinh.clear();
  nhoNha.clear();
  nhoCauHinh = null;
}

/** Dự án (≤ 20) người này dùng được đường tài trợ — cho `/agent/tools` (app biết mở AI Code + model nào). */
export async function duAnTaiTroCuaNguoi(userId: number): Promise<Array<{ projectId: number; key: string; nhaTaiTro: string }>> {
  try {
    const u = await prisma.user.findUnique({ where: { id: userId }, select: { kind: true } });
    if (!u || u.kind === 'AGENT') return [];
    const rows = await prisma.workProjectMember.findMany({
      where: { userId, role: { not: 'CLIENT' }, project: { deletedAt: null, archivedAt: null, workspace: { deletedAt: null } } },
      select: { projectId: true, project: { select: { key: true } } },
      orderBy: { createdAt: 'desc' },
      take: 60,
    });
    const ra: Array<{ projectId: number; key: string; nhaTaiTro: string }> = [];
    for (const r of rows) {
      const nha = await timAdminTaiTro(r.projectId);
      if (nha && nha.id !== userId) ra.push({ projectId: r.projectId, key: r.project.key, nhaTaiTro: nha.ten });
      if (ra.length >= 20) break;
    }
    return ra;
  } catch {
    return [];
  }
}
