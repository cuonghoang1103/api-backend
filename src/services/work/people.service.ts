/**
 * CT Work — "Thành viên" (21/10/2026): MỌI người cùng không gian với tôi, kèm trạng thái hoạt động kiểu Messenger.
 * App iOS CT Work (tab Chat › Thành viên) đọc `GET /api/v1/work/me/people`.
 *
 * Vì sao cần đường riêng (không ghép `GET /workspaces/:id/members` ở client):
 *   · trạng thái hoạt động KHÔNG có ở danh sách thành viên, và socket `presence:update` chỉ phát cho bạn bè ∪ người
 *     đã có hội thoại (messaging.socket.ts) — đồng nghiệp chưa từng nhắn nhau thì không bao giờ có chấm xanh;
 *   · luật riêng tư phải nằm ở MÁY CHỦ: ai tắt `showActiveStatus` thì không lộ mốc/chấm cho ai, và (luật đối ứng của
 *     Messenger) người xem TỰ tắt thì cũng không thấy của người khác. Phần thuần ở `trangThaiCho` (test không cần DB).
 *
 * Phạm vi = đúng thứ `listMembers` cho thấy: khách cổng (GUEST) chỉ thấy người trong dự án của mình; không gian đang bị
 * cổng 2FA chặn thì bỏ qua (bên gọi truyền `boQua`). Agent (`kind = AGENT`) có trong danh sách nhưng không có trạng thái.
 */

import { prisma } from '../../config/database.js';
import { listMembers } from './workspaces.service.js';

/** PHẢI khớp `ONLINE_THRESHOLD_SECONDS` (follow.service.ts) và `TrangThaiHoatDongCTW.nguong` của app iOS. */
export const NGUONG_TRUC_TUYEN_GIAY = 60;

export interface TrangThaiNguoi {
  /** false ⇒ client KHÔNG vẽ chấm, KHÔNG viết "hoạt động … trước" (một trong hai bên tắt, agent, hoặc đã chặn). */
  visible: boolean;
  online: boolean;
  lastActiveAt: Date | null;
}

/**
 * Luật hiển thị trạng thái hoạt động giữa người XEM và một người trong danh sách.
 * - Một trong hai tắt "Hiển thị trạng thái hoạt động" ⇒ ẩn (luật đối ứng như Messenger).
 * - Agent, hoặc hai người chặn nhau (bất kỳ chiều) ⇒ ẩn.
 * - Đang nối socket ⇒ online; không thì mốc `lastActiveAt` còn trong ngưỡng ⇒ online.
 */
export function trangThaiCho(
  xem: { showActiveStatus: boolean },
  nguoi: { showActiveStatus: boolean; lastActiveAt: Date | null; kind?: string | null; dangNoi: boolean; chan?: boolean },
  bayGio: Date = new Date(),
): TrangThaiNguoi {
  if (!xem.showActiveStatus || !nguoi.showActiveStatus || nguoi.kind === 'AGENT' || nguoi.chan) {
    return { visible: false, online: false, lastActiveAt: null };
  }
  const moc = nguoi.lastActiveAt;
  const ganDay = !!moc && (bayGio.getTime() - moc.getTime()) / 1000 <= NGUONG_TRUC_TUYEN_GIAY;
  return { visible: true, online: nguoi.dangNoi || ganDay, lastActiveAt: moc };
}

/** Sắp như Messenger: đang hoạt động trước, rồi mới hoạt động gần nhất, rồi theo tên. */
export function sapXepNguoi<T extends { presence: TrangThaiNguoi; ten: string }>(ds: T[]): T[] {
  return [...ds].sort((a, b) => {
    const o = Number(b.presence.online) - Number(a.presence.online);
    if (o) return o;
    const ta = a.presence.lastActiveAt?.getTime() ?? 0;
    const tb = b.presence.lastActiveAt?.getTime() ?? 0;
    if (ta !== tb) return tb - ta;
    return a.ten.localeCompare(b.ten, 'vi');
  });
}

/** Hai người có cùng ít nhất một không gian CT Work (chưa xoá) không — dùng để định tuyến đẩy tin nhắn riêng. */
export async function coChungKhongGian(a: number, b: number): Promise<boolean> {
  if (a === b) return false;
  const r = await prisma.workMember.findFirst({
    where: { userId: b, workspace: { deletedAt: null, members: { some: { userId: a } } } },
    select: { id: true },
  });
  return !!r;
}

export async function listPeople(viewerId: number, opts: { boQua?: Set<number>; dangNoi?: number[] } = {}) {
  const viewer = await prisma.user.findUnique({ where: { id: viewerId }, select: { showActiveStatus: true } });
  const mine = await prisma.workMember.findMany({
    where: { userId: viewerId, workspace: { deletedAt: null } },
    orderBy: { joinedAt: 'asc' },
    select: { workspace: { select: { id: true, name: true, slug: true } } },
  });

  type Nguoi = {
    id: number; username: string; fullName: string | null; displayName: string | null; avatarUrl: string | null; kind?: string;
    workspaces: Array<{ id: number; name: string; slug: string; role: string }>;
  };
  const theoId = new Map<number, Nguoi>();
  for (const { workspace: ws } of mine) {
    if (opts.boQua?.has(ws.id)) continue;
    // `listMembers` mang sẵn mọi luật quyền (khách cổng chỉ thấy người trong dự án của mình). Lỗi ⇒ bỏ không gian đó.
    const ds = await listMembers(viewerId, ws.id).catch(() => [] as Awaited<ReturnType<typeof listMembers>>);
    for (const m of ds) {
      if (m.id === viewerId) continue;
      const n = theoId.get(m.id) ?? {
        id: m.id, username: m.username, fullName: m.fullName, displayName: m.displayName, avatarUrl: m.avatarUrl,
        kind: (m as { kind?: string }).kind, workspaces: [],
      };
      n.workspaces.push({ id: ws.id, name: ws.name, slug: ws.slug, role: String(m.role) });
      theoId.set(m.id, n);
    }
  }
  const ids = [...theoId.keys()];
  if (!ids.length) return { viewerShowsActiveStatus: viewer?.showActiveStatus ?? true, people: [] };

  // Dự án CHUNG (tôi và họ cùng là thành viên) — dòng phụ "LFD · CTW" dưới tên.
  const duAnCuaToi = await prisma.workProjectMember.findMany({
    where: { userId: viewerId, project: { deletedAt: null, workspace: { deletedAt: null } } },
    select: { project: { select: { id: true, key: true, name: true, workspaceId: true } } },
  });
  const duAn = new Map(duAnCuaToi.filter((r) => !opts.boQua?.has(r.project.workspaceId)).map((r) => [r.project.id, r.project]));
  const chung = duAn.size
    ? await prisma.workProjectMember.findMany({
      where: { projectId: { in: [...duAn.keys()] }, userId: { in: ids } },
      select: { userId: true, projectId: true, role: true },
    })
    : [];
  const duAnTheoNguoi = new Map<number, Array<{ id: number; key: string; name: string; role: string }>>();
  for (const c of chung) {
    const p = duAn.get(c.projectId);
    if (!p) continue;
    const ds = duAnTheoNguoi.get(c.userId) ?? [];
    ds.push({ id: p.id, key: p.key, name: p.name, role: c.role });
    duAnTheoNguoi.set(c.userId, ds);
  }

  const [hoatDong, chan] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, showActiveStatus: true, lastActiveAt: true, enabled: true } }),
    prisma.userBlock.findMany({
      where: { OR: [{ blockerId: viewerId, blockedId: { in: ids } }, { blockedId: viewerId, blockerId: { in: ids } }] },
      select: { blockerId: true, blockedId: true },
    }),
  ]);
  const hd = new Map(hoatDong.map((u) => [u.id, u]));
  const toiChan = new Set(chan.filter((b) => b.blockerId === viewerId).map((b) => b.blockedId));
  const chanToi = new Set(chan.filter((b) => b.blockedId === viewerId).map((b) => b.blockerId));
  const dangNoi = new Set(opts.dangNoi ?? []);
  const bayGio = new Date();
  const xem = { showActiveStatus: viewer?.showActiveStatus ?? true };

  const people = [...theoId.values()]
    .filter((n) => hd.get(n.id)?.enabled !== false && !chanToi.has(n.id))
    .map((n) => {
      const u = hd.get(n.id);
      const presence = trangThaiCho(xem, {
        showActiveStatus: u?.showActiveStatus ?? true, lastActiveAt: u?.lastActiveAt ?? null, kind: n.kind,
        dangNoi: dangNoi.has(n.id), chan: toiChan.has(n.id),
      }, bayGio);
      return {
        ...n,
        projects: (duAnTheoNguoi.get(n.id) ?? []).slice(0, 8),
        blocked: toiChan.has(n.id),
        presence,
        ten: n.displayName || n.fullName || n.username,
      };
    });
  return {
    viewerShowsActiveStatus: xem.showActiveStatus,
    people: sapXepNguoi(people).map(({ ten: _t, ...r }) => r),
  };
}
