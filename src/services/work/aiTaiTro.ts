/**
 * ============================================================
 * CT WORK — TÀI TRỢ CUONGMINI THEO GÓI PRO (22/10/2026)
 * ============================================================
 *
 * Sự cố 22/10: thành viên hỏi trợ lý CT Work ⇒ "Chưa được trả lời" vì `checkTokenQuota` (trần token/người/ngày DÙNG CHUNG
 * cả web: 300k, Pro 1M) chạm sau vài chục câu — mỗi câu CT Work nạp sẵn nhiều ngữ cảnh. Chủ web chốt:
 *
 *   • Người hỏi tự có Pro (`isProEffective` — gồm admin web) ⇒ ĐƯỢC TÀI TRỢ.
 *   • "Người + trưởng nhóm dùng tài khoản Pro là CẢ NHÓM được tài trợ": dự án có TRƯỞNG NHÓM là Pro ⇒ MỌI thành viên dự
 *     án đó (kể cả không Pro) được tài trợ khi dùng CuongMini TRONG dự án đó. Trưởng nhóm = MỘT trong:
 *       – trưởng dự án (`work_projects.lead_id`),
 *       – ADMIN của dự án (`work_project_members.role = 'ADMIN'`),
 *       – chủ không gian (`work_spaces.owner_id`),
 *       – OWNER/ADMIN của không gian (`work_members.role`).
 *     Chỉ tài khoản NGƯỜI (không agent). Trưởng nhóm phải còn là thành viên thật của nơi đó (đọc từ đúng bảng thành viên).
 *   • Được tài trợ ⇒ KHÔNG áp trần token/ngày chung. Chống spam (theo phút / ngày / IP, admin chỉnh ở
 *     `/admin/commerce?tab=anthropic`, 0 = tắt) — đếm CÂU HỎI MỚI (một request HTTP = một câu), không đếm bước nội bộ
 *     (vòng đọc, lượt sửa đề xuất). Trần TIỀN/ngày của cả web (`llm/budget.ts`) vẫn áp như mọi lời gọi.
 *   • Không được tài trợ ⇒ giữ hạn mức cũ (trần token/ngày chung + `WORK_AI_FREE_DAILY` nếu đặt) — lỗi nói rõ cách được
 *     tài trợ (nâng Pro, hoặc nhờ trưởng nhóm dùng Pro).
 *
 * Đếm chống spam trong BỘ NHỚ tiến trình (dùng lại lớp `BoDemDefault` của CuongMini Default). Khởi động lại ⇒ đếm ngày của
 * người được nạp lại từ số câu hỏi đã lưu hôm nay (`work_ai_messages` role user); đếm IP bắt đầu lại.
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { BoDemDefault } from '../agent/defaultGioiHan.js';
import { dauNgayVn } from '../agent/anthropicChinhHang/hanMuc.js';
import { checkTokenQuota } from '../interview/llm/index.js';

// ─── Ngữ cảnh một request (IP + "câu hỏi này đã được đếm") ──────────

interface LuotCtx { ip: string | null; projectId: number | null; daDem: Set<string> }
const luotCtx = new AsyncLocalStorage<LuotCtx>();

/**
 * Middleware tuyến CT Work: chạy phần còn lại của request trong ngữ cảnh có IP chống spam + dự án của tuyến
 * (`/projects/:pid/…`) — để mọi service AI (sơ đồ, SRS, soát đặc tả, biên bản…) biết dự án mà không phải đổi chữ ký hàm.
 */
export function chayTrongLuot<T>(ip: string | null, projectId: number | null, fn: () => T): T {
  return luotCtx.run({ ip, projectId, daDem: new Set() }, fn);
}

// ─── Ai tài trợ ─────────────────────────────────────────────────

export type VaiTruongNhom = 'project_lead' | 'project_admin' | 'workspace_owner' | 'workspace_admin';
export interface NhaTaiTroPro { id: number; username: string; ten: string; vai: VaiTruongNhom }
export type TaiTro =
  | { sponsored: true; by: 'self' }
  | { sponsored: true; by: 'lead'; sponsor: NhaTaiTroPro }
  | { sponsored: false };

type KiemPro = (userId: number) => Promise<boolean>;
const kiemProThat: KiemPro = async (id) => (await import('../pro.service.js')).isProEffective(id);
let kiemPro: KiemPro = kiemProThat;
/** CHỈ cho test. */
export function _datKiemProChoTest(f: KiemPro | null): void {
  kiemPro = f ?? kiemProThat;
  nhoTruong.clear();
  nhoTaiTro.clear();
}

const NHO_MS = 60_000;
const nhoTruong = new Map<number, { luc: number; v: NhaTaiTroPro | null }>();
const nhoTaiTro = new Map<string, { luc: number; v: TaiTro }>();

/** Trưởng nhóm Pro ĐẦU TIÊN của dự án (thứ tự: trưởng dự án → ADMIN dự án → chủ không gian → OWNER/ADMIN không gian). */
export async function timTruongNhomPro(projectId: number): Promise<NhaTaiTroPro | null> {
  const nho = nhoTruong.get(projectId);
  if (nho && Date.now() - nho.luc < NHO_MS) return nho.v;
  const v = await timTruongNhomProGoc(projectId);
  if (nhoTruong.size > 5000) nhoTruong.clear();
  nhoTruong.set(projectId, { luc: Date.now(), v });
  return v;
}

async function timTruongNhomProGoc(projectId: number): Promise<NhaTaiTroPro | null> {
  const p = await prisma.workProject.findFirst({
    where: { id: projectId, deletedAt: null, workspace: { deletedAt: null } },
    select: {
      leadId: true,
      workspaceId: true,
      members: { where: { role: 'ADMIN' }, orderBy: { createdAt: 'asc' }, take: 20, select: { userId: true } },
      workspace: {
        select: {
          ownerId: true,
          members: { where: { role: { in: ['OWNER', 'ADMIN'] } }, orderBy: { joinedAt: 'asc' }, take: 20, select: { userId: true, role: true } },
        },
      },
    },
  });
  if (!p) return null;
  const ungVien: Array<{ id: number; vai: VaiTruongNhom }> = [];
  const them = (id: number | null | undefined, vai: VaiTruongNhom) => { if (id && !ungVien.some((x) => x.id === id)) ungVien.push({ id, vai }); };
  // Trưởng dự án chỉ tính khi còn là thành viên (dự án / không gian) — tránh lead_id cũ của người đã rời nhóm.
  if (p.leadId) {
    const conO = await prisma.workProjectMember.findFirst({ where: { projectId, userId: p.leadId }, select: { id: true } })
      ?? await prisma.workMember.findFirst({ where: { workspaceId: p.workspaceId, userId: p.leadId }, select: { id: true } });
    if (conO) them(p.leadId, 'project_lead');
  }
  for (const m of p.members) them(m.userId, 'project_admin');
  them(p.workspace.ownerId, 'workspace_owner');
  for (const m of p.workspace.members) them(m.userId, m.role === 'OWNER' ? 'workspace_owner' : 'workspace_admin');
  if (!ungVien.length) return null;
  const users = await prisma.user.findMany({
    where: { id: { in: ungVien.map((x) => x.id) }, kind: { not: 'AGENT' } },
    select: { id: true, username: true, fullName: true, displayName: true },
  });
  for (const c of ungVien) {
    const u = users.find((x) => x.id === c.id);
    if (!u) continue;
    if (!(await kiemPro(c.id).catch(() => false))) continue;
    return { id: u.id, username: u.username, ten: u.displayName || u.fullName || u.username, vai: c.vai };
  }
  return null;
}

/** Người này có được tài trợ CuongMini trong dự án này không (đệm 60 s). */
export async function taiTroCua(userId: number, projectId: number | null | undefined): Promise<TaiTro> {
  const k = `${userId}:${projectId ?? 0}`;
  const nho = nhoTaiTro.get(k);
  if (nho && Date.now() - nho.luc < NHO_MS) return nho.v;
  let v: TaiTro = { sponsored: false };
  if (await kiemPro(userId).catch(() => false)) v = { sponsored: true, by: 'self' };
  else if (projectId) {
    const sponsor = await timTruongNhomPro(projectId).catch((err) => {
      logger.warn('[ctwork-ai] không tìm được trưởng nhóm Pro', { projectId, error: (err as Error).message });
      return null;
    });
    if (sponsor) v = { sponsored: true, by: 'lead', sponsor };
  }
  if (nhoTaiTro.size > 20_000) nhoTaiTro.clear();
  nhoTaiTro.set(k, { luc: Date.now(), v });
  return v;
}

// ─── Chống spam (admin chỉnh) ───────────────────────────────────

const KHOA = 'ctwork_ai_tai_tro_gioi_han';
export interface GioiHanTaiTro {
  /** Câu hỏi/phút/người. 0 = tắt. */
  phutNguoi: number;
  /** Câu hỏi/ngày/người (giờ VN). 0 = tắt. */
  ngayNguoi: number;
  /** Câu hỏi/ngày/IP. 0 = tắt. */
  ngayIp: number;
}
export const GIOI_HAN_TAI_TRO_MAC_DINH: GioiHanTaiTro = Object.freeze({ phutNguoi: 8, ngayNguoi: 400, ngayIp: 1500 });

function docSo(v: unknown, mac: number): number {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1_000_000 ? Math.floor(v) : mac;
}
/** THUẦN: JSON đã lưu ⇒ đủ ba ô. */
export function gopGioiHanTaiTro(o: unknown, goc: GioiHanTaiTro = GIOI_HAN_TAI_TRO_MAC_DINH): GioiHanTaiTro {
  const x = (o && typeof o === 'object' ? o : {}) as Record<string, unknown>;
  return { phutNguoi: docSo(x.phutNguoi, goc.phutNguoi), ngayNguoi: docSo(x.ngayNguoi, goc.ngayNguoi), ngayIp: docSo(x.ngayIp, goc.ngayIp) };
}

let nhoGh: { luc: number; v: GioiHanTaiTro } | null = null;
export async function docGioiHanTaiTro(): Promise<GioiHanTaiTro> {
  if (nhoGh && Date.now() - nhoGh.luc < 60_000) return nhoGh.v;
  let v = { ...GIOI_HAN_TAI_TRO_MAC_DINH };
  try {
    const r = await prisma.appSetting.findUnique({ where: { key: KHOA } });
    if (r?.value) v = gopGioiHanTaiTro(JSON.parse(r.value));
  } catch { /* hỏng ⇒ mặc định */ }
  nhoGh = { luc: Date.now(), v };
  return v;
}
export async function datGioiHanTaiTro(moi: unknown): Promise<GioiHanTaiTro> {
  const v = gopGioiHanTaiTro(moi, await docGioiHanTaiTro());
  const value = JSON.stringify(v);
  await prisma.appSetting.upsert({ where: { key: KHOA }, update: { value }, create: { key: KHOA, value } });
  nhoGh = { luc: Date.now(), v };
  return v;
}

export type KetQuaChongSpam =
  | { ok: true }
  | { ok: false; ma: 'WORK_AI_TOO_FAST' | 'WORK_AI_DAILY_CAP' | 'WORK_AI_IP_CAP'; cau: string; thuLaiSauGiay: number };

function giayToiNgayMai(now: number): number {
  return Math.max(1, Math.ceil((dauNgayVn(new Date(now)).getTime() + 86_400_000 - now) / 1000));
}
function moTaGio(giay: number): string {
  const gio = Math.floor(giay / 3600);
  const phut = Math.ceil((giay % 3600) / 60);
  return gio > 0 ? `${gio} giờ ${phut} phút` : `${phut} phút`;
}

/** THUẦN (test được): câu hỏi MỚI được tài trợ này có được chạy không. Chỉ kiểm — ghi bằng `bo.ghi`. */
export function kiemChongSpamThuan(bo: BoDemDefault, gh: GioiHanTaiTro, o: { userId: number; ip: string | null; now: number }): KetQuaChongSpam {
  const { userId, ip, now } = o;
  if (gh.phutNguoi > 0) {
    const ds = bo.soPhut(userId, now);
    if (ds.length >= gh.phutNguoi) {
      const giay = Math.max(1, Math.ceil((ds[0]! + 60_000 - now) / 1000));
      return { ok: false, ma: 'WORK_AI_TOO_FAST', thuLaiSauGiay: giay, cau: `Bạn hỏi CuongMini hơi nhanh (tối đa ${gh.phutNguoi} câu/phút) — đợi khoảng ${giay} giây rồi gửi tiếp nhé.` };
    }
  }
  if (gh.ngayNguoi > 0 && bo.soNgayNguoi(userId, now) >= gh.ngayNguoi) {
    const giay = giayToiNgayMai(now);
    return { ok: false, ma: 'WORK_AI_DAILY_CAP', thuLaiSauGiay: giay, cau: `Hôm nay bạn đã hỏi CuongMini ${gh.ngayNguoi} câu (trần chống spam của lượt được tài trợ) — dùng lại sau 0:00 (còn khoảng ${moTaGio(giay)}).` };
  }
  if (ip && gh.ngayIp > 0 && bo.soNgayIp(ip, now) >= gh.ngayIp) {
    const giay = giayToiNgayMai(now);
    return { ok: false, ma: 'WORK_AI_IP_CAP', thuLaiSauGiay: giay, cau: `Mạng bạn đang dùng đã hỏi CuongMini quá ${gh.ngayIp} câu hôm nay (nhiều tài khoản cùng một địa chỉ IP) — dùng lại sau 0:00 (còn khoảng ${moTaGio(giay)}).` };
  }
  return { ok: true };
}

const BO = new BoDemDefault();
/** CHỈ cho test: đếm lại từ đầu. */
export function _xoaBoDemChoTest(): void {
  BO.phut.clear(); BO.ngayNguoi.clear(); BO.ngayIp.clear();
}

async function napNgayTuSo(userId: number, now: number): Promise<void> {
  if (BO.coNgayNguoi(userId, now)) return;
  let so = 0;
  try {
    so = await prisma.workAiMessage.count({ where: { authorId: userId, role: 'user', createdAt: { gte: dauNgayVn(new Date(now)) } } });
  } catch (err) {
    logger.warn('[ctwork-ai] không đọc được số câu hôm nay — đếm từ 0', { error: (err as Error).message });
  }
  if (!BO.coNgayNguoi(userId, now)) BO.datNgayNguoi(userId, so, now);
}

// ─── Cửa hạn mức chung của mọi lời gọi AI trong CT Work ─────────────

/** Câu báo khi KHÔNG được tài trợ mà chạm trần token/ngày chung. */
export const CAU_HET_HAN_MUC = 'Hôm nay bạn đã dùng hết hạn mức AI miễn phí của tài khoản (trần token/ngày dùng chung cả web). '
  + 'Để dùng CuongMini KHÔNG giới hạn trong CT Work: nâng cấp Pro, hoặc nhờ trưởng nhóm (trưởng dự án / ADMIN dự án / chủ không gian) '
  + 'dùng tài khoản Pro — khi đó CẢ NHÓM được tài trợ. Hạn mức tự làm mới lúc 0:00.';

/**
 * Cửa hạn mức của MỌI lời gọi AI trong CT Work (trợ lý, việc một chạm, sơ đồ, SRS, soát đặc tả…).
 *   • Được tài trợ ⇒ bỏ trần token/ngày; câu hỏi MỚI đi qua chống spam (một request chỉ đếm MỘT lần dù gọi model nhiều
 *     vòng — `chayTrongLuot`). `chiKiem` = kiểm mà chưa ghi (dùng trước khi mở luồng SSE; lượt thật ghi sau).
 *   • Không được tài trợ ⇒ trần token/ngày chung như cũ (429 WORK_AI_TOKEN_CAP, câu tiếng Việt chỉ cách được tài trợ).
 * Trả quyết định tài trợ để nơi gọi hiện "Được tài trợ bởi …".
 */
export async function kiemHanMucAi(userId: number, projectIdVao: number | null | undefined, o: { chiKiem?: boolean } = {}): Promise<TaiTro> {
  const ctx = luotCtx.getStore();
  const projectId = projectIdVao ?? ctx?.projectId ?? null;
  const tt = await taiTroCua(userId, projectId);
  if (tt.sponsored) {
    const khoaDem = `${projectId ?? 0}`;
    if (ctx?.daDem.has(khoaDem)) return tt;
    const now = Date.now();
    const gh = await docGioiHanTaiTro();
    await napNgayTuSo(userId, now);
    const ip = ctx?.ip ?? null;
    const kq = kiemChongSpamThuan(BO, gh, { userId, ip, now });
    if (!kq.ok) {
      logger.info('[ctwork-ai] chạm chống spam (lượt tài trợ)', { userId, projectId: projectId ?? null, ma: kq.ma });
      throw new AppError(kq.cau, 429, kq.ma, { retryAfterSec: kq.thuLaiSauGiay, sponsored: true });
    }
    if (!o.chiKiem) {
      BO.ghi(userId, ip, now);
      ctx?.daDem.add(khoaDem);
    }
    return tt;
  }
  if (!(await checkTokenQuota(userId))) {
    throw new AppError(CAU_HET_HAN_MUC, 429, 'WORK_AI_TOKEN_CAP', { upgradeUrl: '/pro', sponsored: false, howToSponsor: 'pro_or_lead_pro' });
  }
  return tt;
}

/** Dạng gửi cho giao diện (không lộ gì ngoài tên người tài trợ — tên đó ai trong nhóm cũng thấy). */
export function taiTroChoGiaoDien(tt: TaiTro): { sponsored: boolean; by: 'self' | 'lead' | null; sponsor: { username: string; name: string; role: VaiTruongNhom } | null } {
  if (!tt.sponsored) return { sponsored: false, by: null, sponsor: null };
  if (tt.by === 'self') return { sponsored: true, by: 'self', sponsor: null };
  return { sponsored: true, by: 'lead', sponsor: { username: tt.sponsor.username, name: tt.sponsor.ten, role: tt.sponsor.vai } };
}
