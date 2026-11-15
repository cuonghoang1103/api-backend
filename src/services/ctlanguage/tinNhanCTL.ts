/**
 * CT Language › Tin nhắn (15/11/2026) — hai đường riêng của app; phần nhắn tin dùng nguyên hệ `/api/v1/messages/*`.
 *
 *   timNguoi   — nút "+" Nhắn tin mới: tìm người theo tên hiển thị TRONG cộng đồng CT Language (người đã đăng bài / trả
 *                lời, hoặc có quan hệ theo dõi với mình). KHÔNG phải danh bạ toàn bộ người dùng của web.
 *   trucTuyen  — dải "Đang trực tuyến": người đã nhắn với mình ∪ người theo dõi nhau trong cộng đồng, ĐANG online và
 *                được phép thấy theo luật chung `presencePrivacy.ts` (công tắc của họ + của mình, chặn, quan hệ).
 *
 * Riêng tư: không trả email/mốc hoạt động của người không được phép thấy; người chặn nhau (bất kỳ chiều) không thấy nhau;
 * tài khoản bị khoá/vô hiệu hoá và AI agent không hiện.
 */
import { prisma } from '../../config/database.js';
import { dsChan, TAC_GIA, TAC_GIA_SONG, tacGiaGon } from './congDong.js';
import { loadPresenceViewer, presenceFor } from '../presencePrivacy.js';
import { nguoiQuen } from '../loiMoiTinNhan.js';

const TOI_DA = 20;

export interface NguoiTimTN {
  id: number;
  ten: string;
  avatarUrl: string | null;
  username: string;
  /** Mình đang theo dõi họ trong cộng đồng. */
  daTheoDoi: boolean;
  /** Gửi được tin đầu tiên: họ nhận tin người lạ, hoặc hai bên đã quen / đã có cuộc trò chuyện. */
  nhanTinDuoc: boolean;
}

/** Chuẩn hoá ô tìm: gọn khoảng trắng, bỏ "@" đầu, tối đa 60 ký tự. Rỗng ⇒ null (trả gợi ý). */
export function chuanHoaTim(q: unknown): string | null {
  const s = String(q ?? '').replace(/\s+/g, ' ').trim().replace(/^@+/, '').slice(0, 60);
  return s.length ? s : null;
}

const NGUOI_THAT = { ...TAC_GIA_SONG, kind: { not: 'AGENT' } } as const;

/**
 * Tìm người để nhắn. `q` rỗng ⇒ gợi ý: người mình đang theo dõi trong cộng đồng (mới nhất trước).
 * `q` có ⇒ người có hoạt động trong cộng đồng CT Language (bài / trả lời không phải AI) hoặc có quan hệ theo dõi với
 * mình, khớp tên hiển thị / họ tên / tên đăng nhập.
 */
export async function timNguoi(viewerId: number, qGoc: unknown): Promise<NguoiTimTN[]> {
  const q = chuanHoaTim(qGoc);
  const chan = await dsChan(viewerId);
  const boQua = [viewerId, ...chan];

  let users: Array<{ id: number; username: string; fullName: string | null; displayName: string | null; avatarUrl: string | null; allowMessagesFromStrangers: boolean }>;
  const chon = { ...TAC_GIA, allowMessagesFromStrangers: true } as const;
  if (!q) {
    const theo = await prisma.ctlTheoDoi.findMany({
      where: { nguoiId: viewerId, duocId: { notIn: boQua }, duoc: NGUOI_THAT },
      orderBy: { createdAt: 'desc' },
      take: TOI_DA,
      select: { duoc: { select: chon } },
    });
    users = theo.map((t) => t.duoc);
  } else {
    users = await prisma.user.findMany({
      where: {
        id: { notIn: boQua },
        ...NGUOI_THAT,
        OR: [
          { displayName: { contains: q, mode: 'insensitive' } },
          { fullName: { contains: q, mode: 'insensitive' } },
          { username: { contains: q, mode: 'insensitive' } },
        ],
        AND: [{
          OR: [
            { ctlBai: { some: { anLuc: null } } },
            { ctlTraLoi: { some: { anLuc: null, laAi: false } } },
            { ctlNguoiTheoDoi: { some: { nguoiId: viewerId } } },
            { ctlDangTheoDoi: { some: { duocId: viewerId } } },
          ],
        }],
      },
      orderBy: [{ displayName: 'asc' }, { id: 'asc' }],
      take: TOI_DA,
      select: chon,
    });
  }
  if (!users.length) return [];

  const ids = users.map((u) => u.id);
  const [quen, theoDoi, coHoiThoai] = await Promise.all([
    nguoiQuen(viewerId, ids),
    prisma.ctlTheoDoi.findMany({ where: { nguoiId: viewerId, duocId: { in: ids } }, select: { duocId: true } }),
    prisma.messageThread.findMany({
      where: {
        type: 'USER',
        OR: [{ userAId: viewerId, userBId: { in: ids } }, { userBId: viewerId, userAId: { in: ids } }],
      },
      select: { userAId: true, userBId: true },
    }),
  ]);
  const dangTheo = new Set(theoDoi.map((t) => t.duocId));
  const daCo = new Set(coHoiThoai.map((t) => (t.userAId === viewerId ? t.userBId : t.userAId)));
  return users.map((u) => ({
    ...tacGiaGon(u),
    username: u.username,
    daTheoDoi: dangTheo.has(u.id),
    nhanTinDuoc: u.allowMessagesFromStrangers || quen.has(u.id) || daCo.has(u.id),
  }));
}

export interface NguoiTrucTuyenTN {
  id: number;
  ten: string;
  avatarUrl: string | null;
  username: string;
  /** id hội thoại sẵn có (chạm ⇒ mở thẳng), null ⇒ chưa nhắn bao giờ (theo dõi nhau). */
  threadId: number | null;
}

/**
 * Người đang online mà mình được phép thấy, trong vòng: đã có hội thoại USER với mình (không tính hội thoại mình đã xoá)
 * ∪ theo dõi nhau ở cộng đồng. `dangNoi` = id đang có socket mở (truyền vào để test không cần socket).
 */
export async function trucTuyen(viewerId: number, dangNoi: number[]): Promise<NguoiTrucTuyenTN[]> {
  const online = new Set(dangNoi.filter((id) => id !== viewerId));
  if (!online.size) return [];
  const [threads, toiTheo, theoToi] = await Promise.all([
    prisma.messageThread.findMany({
      where: { type: 'USER', OR: [{ userAId: viewerId }, { userBId: viewerId }] },
      orderBy: [{ lastMessageAt: { sort: 'desc', nulls: 'last' } }],
      select: { id: true, userAId: true, userBId: true, preferences: true },
    }),
    prisma.ctlTheoDoi.findMany({ where: { nguoiId: viewerId }, select: { duocId: true } }),
    prisma.ctlTheoDoi.findMany({ where: { duocId: viewerId }, select: { nguoiId: true } }),
  ]);
  const threadCua = new Map<number, number>();
  for (const t of threads) {
    const pref = (t.preferences as Record<string, { deletedAt?: string }> | null)?.[String(viewerId)];
    if (pref?.deletedAt) continue;
    const p = t.userAId === viewerId ? t.userBId : t.userAId;
    if (typeof p === 'number' && !threadCua.has(p)) threadCua.set(p, t.id);
  }
  const theoToiSet = new Set(theoToi.map((r) => r.nguoiId));
  const vong = new Set<number>(threadCua.keys());
  for (const r of toiTheo) if (theoToiSet.has(r.duocId)) vong.add(r.duocId);
  const ungVien = [...vong].filter((id) => online.has(id));
  if (!ungVien.length) return [];

  // Luật chung: công tắc của họ + của mình (đối ứng), chặn, AI agent, quan hệ (presenceCircle đã gồm theo dõi nhau).
  const xem = await loadPresenceViewer(viewerId, ungVien);
  if (!xem || !xem.viewerShows) return [];
  const users = await prisma.user.findMany({
    where: { id: { in: ungVien }, ...TAC_GIA_SONG },
    select: { ...TAC_GIA, showActiveStatus: true, lastActiveAt: true, kind: true },
  });
  const thuTu = new Map(ungVien.map((id, i) => [id, i]));
  return users
    .filter((u) => presenceFor(xem, u, { connected: true }).visible)
    .sort((a, b) => (thuTu.get(a.id) ?? 0) - (thuTu.get(b.id) ?? 0))
    .slice(0, 30)
    .map((u) => ({ ...tacGiaGon(u), username: u.username, threadId: threadCua.get(u.id) ?? null }));
}
