/**
 * CT Work — LINK NGOÀI trong thẻ (19/10/2026): trưởng nhóm gắn link Figma / Google Docs / Sheets / Slides / Drive /
 * GitHub vào mô tả, bình luận, web links ⇒ trợ lý AI đọc luôn NỘI DUNG (trước đây chỉ thấy tiêu đề + URL).
 *
 *   - `docLinkCuaThe`   chữ của thẻ ⇒ ≤ 3 link ngoài ⇒ nội dung (trần mỗi link + trần tổng, đệm 10 phút theo URL —
 *                       xem `linkNgoai/docLink.ts`), bọc `untrusted()` vì là chữ của người khác.
 *   - Token Figma CỦA DỰ ÁN (personal access token CHỈ ĐỌC, scope file_content:read) do ADMIN dự án dán ở
 *     Cài đặt dự án → Figma. Lưu mã hoá (`sealToken`, AAD gắn đúng dự án) trong `app_settings` (khoá
 *     `work.figma.p<id>`) — không đổi schema. KHÔNG BAO GIỜ trả về client, không vào log, không vào câu lỗi;
 *     đệm kết quả đọc bằng token tách theo dự án (dự án khác không đọc ké qua đệm).
 *
 * Agent (token ctw_) không đổi được token (tuyến `/figma/**` nằm trong AGENT_DENIED_ROUTES).
 */
import { prisma } from '../../config/database.js';
import { BadRequestError } from '../../middleware/errorHandler.js';
import { untrusted } from '../../mcp/protocol.js';
import { docLinkNgoai, dongDauKetQua, __xoaDemLinkNgoai } from '../linkNgoai/docLink.js';
import { timLinkNgoai } from '../linkNgoai/nhanDien.js';
import { LoiTai, taiCoRao } from '../linkNgoai/taiAnToan.js';
import { auditProject } from './audit.js';
import { openToken, sealToken } from './oauth/crypto.js';
import { requireProject } from './permissions.js';

export const LINK_NGOAI_LIMITS = {
  /** Số link ngoài tối đa đọc cho một thẻ. */
  links: 3,
  /** Trần chữ mỗi link. */
  perLink: 5_000,
  /** Trần tổng cho một thẻ. */
  total: 12_000,
} as const;

const khoaCaiDat = (projectId: number) => `work.figma.p${projectId}`;
const aad = (projectId: number) => `figma:project:${projectId}`;

interface DongLuu { t: string; h?: string | null; luc?: string }

async function docDong(projectId: number): Promise<DongLuu | null> {
  const r = await prisma.appSetting.findUnique({ where: { key: khoaCaiDat(projectId) } });
  if (!r?.value) return null;
  try { return JSON.parse(r.value) as DongLuu; } catch { return null; }
}

/** Token Figma của dự án (đã giải mã) — CHỈ dùng trong tiến trình, không bao giờ trả ra ngoài. */
export async function figmaTokenDuAn(projectId: number): Promise<string | null> {
  const d = await docDong(projectId).catch(() => null);
  return d ? openToken(d.t, aad(projectId)) : null;
}

/** Hình dạng token Figma (không gọi đi): in được, không khoảng trắng, 20–200 ký tự. */
export function hinhDangTokenFigma(t: string): boolean {
  return /^[\x21-\x7e]{20,200}$/.test(t);
}

/** Trạng thái cho trang cài đặt — KHÔNG có token. */
export async function trangThaiFigma(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const d = await docDong(projectId);
  return { hasToken: !!d && !!openToken(d.t, aad(projectId)), handle: d?.h ?? null, savedAt: d?.luc ?? null, canEdit: access.role === 'ADMIN' };
}

/** Kiểm token bằng GET /v1/me ⇒ handle (tên hiển thị Figma). Sai / thu hồi ⇒ BadRequest (không nhắc lại token). */
export async function kiemTokenFigma(token: string): Promise<string | null> {
  try {
    const r = await taiCoRao('figma', 'https://api.figma.com/v1/me', { tranByte: 64 * 1024, headers: { 'X-Figma-Token': token }, hetGioMs: 12_000 });
    const j = JSON.parse(r.byte.toString('utf8')) as { handle?: string };
    return typeof j.handle === 'string' ? j.handle.slice(0, 80) : null;
  } catch (e) {
    if (e instanceof LoiTai && e.ma === 'RIENG_TU') throw new BadRequestError('Figma rejected this token — create a personal access token with the file_content:read scope', 'WORK_FIGMA_TOKEN_INVALID');
    throw new BadRequestError('Could not reach Figma to check the token — try again in a moment', 'WORK_FIGMA_UNREACHABLE');
  }
}

export async function datTokenFigma(userId: number, projectId: number, token: string | null) {
  await requireProject(userId, projectId, 'project.settings');
  if (token === null || token.trim() === '') {
    await prisma.appSetting.deleteMany({ where: { key: khoaCaiDat(projectId) } });
    __xoaDemLinkNgoai();
    await auditProject(projectId, { actorId: userId, action: 'figma.token_remove', targetType: 'project', targetId: projectId, summary: 'Removed the Figma read-only token' });
    return { hasToken: false, handle: null as string | null };
  }
  const t = token.trim();
  if (!hinhDangTokenFigma(t)) throw new BadRequestError('That does not look like a Figma access token', 'WORK_FIGMA_TOKEN_SHAPE');
  const handle = await kiemTokenFigma(t);
  const value = JSON.stringify({ t: sealToken(t, aad(projectId)), h: handle, luc: new Date().toISOString() } satisfies DongLuu);
  await prisma.appSetting.upsert({ where: { key: khoaCaiDat(projectId) }, update: { value }, create: { key: khoaCaiDat(projectId), value } });
  __xoaDemLinkNgoai(); // đổi token ⇒ bỏ đệm cũ
  await auditProject(projectId, { actorId: userId, action: 'figma.token_set', targetType: 'project', targetId: projectId, summary: 'Saved a Figma read-only token for the AI assistant' });
  return { hasToken: true, handle };
}

/**
 * Link ngoài trong chữ của một thẻ (mô tả + bình luận + web links) ⇒ khối "Content of external links" cho trợ lý.
 * Không có link ⇒ ''. Không bao giờ ném (link hỏng ⇒ một dòng nói lý do).
 */
export async function docLinkCuaThe(projectId: number, chu: string, o: { tong?: number } = {}): Promise<string> {
  const ds = timLinkNgoai(chu, LINK_NGOAI_LIMITS.links);
  if (!ds.length) return '';
  const coFigma = ds.some((l) => l.loai === 'figma');
  const token = coFigma ? await figmaTokenDuAn(projectId).catch(() => null) : null;
  let con = o.tong ?? LINK_NGOAI_LIMITS.total;
  const phan: string[] = [];
  for (const l of ds) {
    if (con < 600) break;
    const kq = await docLinkNgoai(l, { tranChu: Math.min(LINK_NGOAI_LIMITS.perLink, con), ...(l.loai === 'figma' && token ? { figmaToken: token, nganDem: `p${projectId}` } : {}) });
    const dau = dongDauKetQua(kq);
    if (kq.trangThai === 'ok') {
      con -= kq.chu.length;
      phan.push(`--- ${dau} ---\n${kq.chu}`);
    } else {
      phan.push(`--- ${dau} --- (not read) ${kq.chu}`);
    }
  }
  return `Content of external links on this issue (read automatically; cached ~10 min):\n${untrusted('external links', phan.join('\n\n'))}`;
}
