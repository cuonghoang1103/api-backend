'use client';

/**
 * ChatsPanel — bảng "Đoạn chat" thả xuống từ icon tin nhắn trên thanh đầu trang (11/11/2026).
 *
 * Giống Facebook: bấm icon Messenger ⇒ một bảng nổi ĐÈ lên trang đang xem (không chuyển
 * trang), có ô tìm, tab Tất cả / Chưa đọc / Hỗ trợ, danh sách hội thoại; bấm một hội thoại
 * ⇒ mở khung chat nhỏ (MiniChatDock) ngay trên trang. Chỉ nút "mở rộng" và
 * "Xem tất cả trong Messenger" mới sang trang /messages.
 *
 * Không có hệ thống mới: đọc/ghi qua `useMessagingStore` — cùng dữ liệu `MessageThread`
 * (ADMIN/USER) mà trang /messages dùng. Hội thoại hỗ trợ (ADMIN) và màn hẹp mở /messages
 * vì khung chat nhỏ chỉ dựng được hội thoại 1-1 theo người (startUserThread).
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Archive, Check, Loader2, Maximize2, MessageCircle, MoreHorizontal, Search, SquarePen, X,
} from 'lucide-react';
import { useMessagingStore } from '@/store/messagingStore';
import { useAuthStore } from '@/store/authStore';
import { socialUserApi, type DiscoverUser, type MessagingThread } from '@/lib/api';
import { moChatNho } from '@/lib/miniChat';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Tab = 'all' | 'unread' | 'support';

interface Props {
  anchor: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

/** "5 phút" · "2 giờ" · "3 ngày" · "2 tuần" — gọn như Messenger. */
function thoiGianGon(iso?: string | null): string {
  if (!iso) return '';
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return '';
  const s = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (s < 60) return 'vừa xong';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} phút`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} ngày`;
  if (d < 35) return `${Math.floor(d / 7)} tuần`;
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

function tenHoiThoai(t: MessagingThread): string {
  if (t.type === 'ADMIN' && !t.peer) return 'Hỗ trợ CuongThai';
  return t.peer?.alias || t.peer?.displayName || t.peer?.username || 'Người dùng';
}

function xemTruoc(t: MessagingThread, selfId: number | null): string {
  const lm = t.lastMessage;
  if (!lm) return 'Chưa có tin nhắn';
  const ban = lm.senderId === selfId ? 'Bạn: ' : '';
  if (lm.content?.trim()) return ban + lm.content.trim();
  if (lm.hasAttachment) {
    if (lm.attachmentMime?.startsWith('image/')) return `${ban}đã gửi một ảnh`;
    if (lm.attachmentMime?.startsWith('audio/')) return `${ban}đã gửi tin nhắn thoại`;
    if (lm.attachmentMime?.startsWith('video/')) return `${ban}đã gửi một video`;
    return `${ban}đã gửi một tệp`;
  }
  return `${ban}đã gửi một nhãn dán`;
}

function laChuaDoc(t: MessagingThread): boolean {
  return (t.unreadCount ?? 0) > 0 || !!t.preferences?.markedUnreadAt;
}

export default function ChatsPanel({ anchor, open, onClose }: Props) {
  const router = useRouter();
  const threads = useMessagingStore((s) => s.threads);
  const threadsLoaded = useMessagingStore((s) => s.threadsLoaded);
  const threadsLoading = useMessagingStore((s) => s.threadsLoading);
  const presence = useMessagingStore((s) => s.presence);
  const selfId = useAuthStore((s) => s.user?.id ?? null);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number; maxH: number } | null>(null);
  const [tab, setTab] = useState<Tab>('all');
  const [q, setQ] = useState('');
  const [nguoi, setNguoi] = useState<DiscoverUser[]>([]);
  const [timNguoi, setTimNguoi] = useState(false);
  const [dangMo, setDangMo] = useState<number | null>(null);
  const [menuId, setMenuId] = useState<number | null>(null);
  /** Bạn bè + người mình theo dõi (GET /users/network) — để nhắn người CHƯA từng nhắn mà không phải gõ tìm. */
  const [lienHe, setLienHe] = useState<Array<{ id: number; username: string; displayName: string | null; avatarUrl: string | null; isOnline: boolean }>>([]);

  // Neo dưới icon tin nhắn; màn hẹp thì gần tràn ngang.
  useLayoutEffect(() => {
    if (!open || !anchor) return;
    const place = () => {
      const r = anchor.getBoundingClientRect();
      const width = Math.min(380, window.innerWidth - 16);
      const left = Math.max(8, Math.min(window.innerWidth - width - 8, r.right - width));
      const top = r.bottom + 8;
      setPos({ top, left, width, maxH: Math.max(320, window.innerHeight - top - 16) });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open, anchor]);

  // Mỗi lần mở: làm mới danh sách (socket lo phần cập nhật sau đó).
  useEffect(() => {
    if (!open) return;
    const st = useMessagingStore.getState();
    if (!st.threadsLoading) void st.loadThreads();
    setMenuId(null);
    socialUserApi.getNetwork(60)
      .then((res: any) => { const d = res.data?.data; setLienHe(Array.isArray(d) ? d : []); })
      .catch(() => {});
  }, [open]);

  // Bấm ra ngoài / Esc ⇒ đóng.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (panelRef.current?.contains(t)) return;
      if (anchor?.contains(t)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (menuId != null) setMenuId(null);
      else onClose();
    };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, anchor, onClose, menuId]);

  // Ô tìm: lọc hội thoại tại chỗ + tìm thêm NGƯỜI để bắt đầu chat mới (như Messenger).
  useEffect(() => {
    if (!open) return;
    const kw = q.trim();
    if (!kw) { setNguoi([]); setTimNguoi(false); return; }
    setTimNguoi(true);
    const id = window.setTimeout(async () => {
      try {
        const res = await socialUserApi.discover(kw, 8);
        setNguoi(res.data.data.users ?? []);
      } catch {
        setNguoi([]);
      } finally {
        setTimNguoi(false);
      }
    }, 250);
    return () => window.clearTimeout(id);
  }, [q, open]);

  const coHoTro = useMemo(() => threads.some((t) => t.type === 'ADMIN'), [threads]);

  const danhSach = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return threads.filter((t) => {
      if (t.preferences?.archivedAt) return false;
      if (tab === 'unread' && !laChuaDoc(t)) return false;
      if (tab === 'support' && t.type !== 'ADMIN') return false;
      if (!kw) return true;
      const ten = `${tenHoiThoai(t)} ${t.peer?.username ?? ''}`.toLowerCase();
      return ten.includes(kw) || (t.lastMessage?.content ?? '').toLowerCase().includes(kw);
    });
  }, [threads, tab, q]);

  // Người liên hệ chưa có hội thoại (đang hoạt động lên trước — server đã sắp).
  const lienHeMoi = useMemo(() => {
    const daCo = new Set(threads.map((t) => t.peer?.id).filter(Boolean));
    const kw = q.trim().toLowerCase();
    return lienHe.filter((u) => u.id !== selfId && !daCo.has(u.id)
      && (!kw || `${u.displayName ?? ''} ${u.username}`.toLowerCase().includes(kw)));
  }, [lienHe, threads, selfId, q]);

  // Người tìm được mà CHƯA có hội thoại trong danh sách.
  const nguoiMoi = useMemo(() => {
    const daCo = new Set(threads.map((t) => t.peer?.id).filter(Boolean));
    const daLienHe = new Set(lienHeMoi.map((u) => u.id));
    return nguoi.filter((u) => u.id !== selfId && !daCo.has(u.id) && !daLienHe.has(u.id));
  }, [nguoi, threads, selfId, lienHeMoi]);

  if (!open || typeof document === 'undefined' || !pos) return null;

  const moHoiThoai = (t: MessagingThread) => {
    // MỌI hội thoại (USER lẫn HỖ TRỢ/ADMIN) mở thành khung chat nổi trên trang hiện tại — như Facebook.
    // Trước đây hội thoại ADMIN rơi sang /messages; tài khoản admin có nhiều loại này nên gần như bấm đâu
    // cũng chuyển trang (11/11/2026). Truyền threadId để khung mở ĐÚNG hội thoại đó.
    const ok = moChatNho({
      id: t.peer?.id ?? -t.id,
      username: t.peer?.username ?? 'ho-tro',
      displayName: t.peer ? (t.peer.alias || t.peer.displayName || t.peer.username) : tenHoiThoai(t),
      avatarUrl: t.peer?.avatarUrl ?? null,
      threadId: t.id,
    });
    onClose();
    if (!ok) router.push(`/messages?thread=${t.id}`);
  };

  const moNguoi = async (u: DiscoverUser) => {
    const ok = moChatNho({
      id: u.id,
      username: u.username,
      displayName: u.displayName || u.fullName || u.username,
      avatarUrl: u.avatarUrl,
    });
    if (ok) { onClose(); return; }
    setDangMo(u.id);
    onClose();
    router.push(`/messages?peer=${u.id}`);
    setDangMo(null);
  };

  const hanhDong = async (fn: () => Promise<unknown>, ok: string) => {
    setMenuId(null);
    try { await fn(); toast.success(ok); } catch { toast.error('Không thực hiện được, thử lại sau'); }
  };

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Đoạn chat"
      className="chats-panel fixed z-[1000] flex flex-col overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-text-primary shadow-[0_12px_28px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.1)]"
      style={{ top: pos.top, left: pos.left, width: pos.width, maxHeight: Math.min(pos.maxH, 720) }}
    >
      {/* Đầu bảng */}
      <div className="flex items-center justify-between px-4 pb-1 pt-3">
        <h2 className="text-2xl font-bold">Đoạn chat</h2>
        <div className="flex items-center gap-1">
          <Link
            href="/messages"
            onClick={onClose}
            title="Mở Messenger toàn màn hình"
            aria-label="Mở Messenger toàn màn hình"
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-[var(--bg-surface-hover)]"
          >
            <Maximize2 className="h-[18px] w-[18px]" />
          </Link>
          <button
            type="button"
            onClick={() => { setQ(''); setTab('all'); inputRef.current?.focus(); }}
            title="Tin nhắn mới — gõ tên người cần nhắn"
            aria-label="Tin nhắn mới"
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-[var(--bg-surface-hover)]"
          >
            <SquarePen className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {/* Ô tìm */}
      <div className="px-4 py-2">
        <label className="flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--text-primary)_9%,var(--bg-card))] px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-text-muted" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm kiếm trên Messenger"
            aria-label="Tìm kiếm trên Messenger"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          {q && (
            <button type="button" onClick={() => setQ('')} aria-label="Xoá tìm kiếm" className="text-text-muted hover:text-text-primary">
              <X className="h-4 w-4" />
            </button>
          )}
        </label>
      </div>

      {/* Tab */}
      <div className="flex gap-1.5 px-4 pb-2" role="tablist">
        {([
          ['all', 'Tất cả'],
          ['unread', 'Chưa đọc'],
          ...(coHoTro ? [['support', 'Hỗ trợ'] as const] : []),
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id as Tab)}
            className={cn(
              'rounded-full px-3 py-1.5 text-[15px] font-semibold transition-colors',
              tab === id
                ? 'bg-[color-mix(in_srgb,var(--accent-color)_14%,transparent)] text-[var(--accent-color)]'
                : 'text-text-primary hover:bg-[var(--bg-surface-hover)]',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Danh sách */}
      <div className="min-h-[200px] flex-1 overflow-y-auto px-2 pb-2">
        {!threadsLoaded && threadsLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-text-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> Đang tải đoạn chat…
          </div>
        ) : (
          <>
            {danhSach.length === 0 && nguoiMoi.length === 0 && !timNguoi && (tab !== 'all' || lienHeMoi.length === 0) && (
              <div className="flex flex-col items-center px-6 py-10 text-center">
                <MessageCircle className="mb-2 h-10 w-10 text-text-muted opacity-60" />
                <p className="text-sm text-text-secondary">
                  {q ? 'Không tìm thấy đoạn chat hay người nào' : tab === 'unread' ? 'Không có đoạn chat chưa đọc' : 'Chưa có đoạn chat nào'}
                </p>
                {!q && tab === 'all' && (
                  <button type="button" onClick={() => inputRef.current?.focus()} className="mt-2 text-sm font-semibold text-[var(--accent-color)] hover:underline">
                    Bắt đầu một đoạn chat
                  </button>
                )}
              </div>
            )}

            <ul>
              {danhSach.map((t) => {
                const ten = tenHoiThoai(t);
                const chuaDoc = laChuaDoc(t);
                const online = !!(t.peer && presence.byUserId[t.peer.id]?.online);
                return (
                  <li key={t.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => moHoiThoai(t)}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 pr-10 text-left transition-colors hover:bg-[var(--bg-surface-hover)]"
                    >
                      <AnhDaiDien src={t.peer?.avatarUrl} ten={ten} online={online} size={56} />
                      <div className="min-w-0 flex-1">
                        <p className={cn('truncate text-[15px]', chuaDoc ? 'font-bold' : 'font-medium')}>
                          {ten}
                          {t.type === 'ADMIN' && (
                            <span className="ml-1.5 rounded bg-amber-500/15 px-1.5 py-px align-middle text-[10px] font-bold text-amber-600">HỖ TRỢ</span>
                          )}
                        </p>
                        <p className={cn('flex min-w-0 items-center gap-1 text-[13px]', chuaDoc ? 'font-semibold text-text-primary' : 'text-text-secondary')}>
                          <span className="truncate">{xemTruoc(t, selfId)}</span>
                          {t.lastMessageAt && <span className="shrink-0">· {thoiGianGon(t.lastMessageAt)}</span>}
                        </p>
                      </div>
                      {chuaDoc && (
                        <span aria-label="Chưa đọc" className={cn('h-3 w-3 shrink-0 rounded-full bg-[var(--accent-color)] transition-opacity group-hover:opacity-0', menuId === t.id && 'opacity-0')} />
                      )}
                    </button>

                    {/* Nút ⋯ từng hội thoại (hiện khi rê chuột / đang mở) */}
                    <button
                      type="button"
                      aria-label={`Tuỳ chọn cho ${ten}`}
                      aria-haspopup="menu"
                      aria-expanded={menuId === t.id}
                      onClick={() => setMenuId((m) => (m === t.id ? null : t.id))}
                      className={cn(
                        'absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-text-secondary shadow-sm transition-opacity hover:bg-[var(--bg-surface)]',
                        menuId === t.id ? 'opacity-100' : 'opacity-0 focus:opacity-100 group-hover:opacity-100',
                      )}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {menuId === t.id && (
                      <div role="menu" className="absolute right-3 top-[calc(50%+20px)] z-10 w-60 overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] p-1 shadow-xl">
                        <MenuItem
                          icon={<Check className="h-4 w-4" />}
                          label={chuaDoc ? 'Đánh dấu là đã đọc' : 'Đánh dấu là chưa đọc'}
                          onClick={() => hanhDong(
                            async () => {
                              const st = useMessagingStore.getState();
                              if (chuaDoc) {
                                if (t.preferences?.markedUnreadAt) await st.unmarkThreadUnread(t.id);
                                await st.markRead(t.id);
                              } else {
                                await st.markThreadUnread(t.id);
                              }
                            },
                            chuaDoc ? 'Đã đánh dấu là đã đọc' : 'Đã đánh dấu là chưa đọc',
                          )}
                        />
                        <MenuItem
                          icon={<Maximize2 className="h-4 w-4" />}
                          label="Mở trong Messenger"
                          onClick={() => { setMenuId(null); onClose(); router.push(`/messages?thread=${t.id}`); }}
                        />
                        <MenuItem
                          icon={<Archive className="h-4 w-4" />}
                          label="Lưu trữ đoạn chat"
                          onClick={() => hanhDong(() => useMessagingStore.getState().archiveThread(t.id), 'Đã lưu trữ đoạn chat')}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            {tab === 'all' && lienHeMoi.length > 0 && (
              <div className="mt-1 border-t border-[var(--border-color)] pt-2">
                <p className="px-2 pb-1 text-[13px] font-semibold text-text-secondary">Người liên hệ</p>
                <ul>
                  {lienHeMoi.slice(0, q.trim() ? 8 : 30).map((u) => {
                    const ten = u.displayName || u.username;
                    return (
                      <li key={`lh-${u.id}`}>
                        <button
                          type="button"
                          onClick={() => moNguoi({ id: u.id, username: u.username, displayName: u.displayName, fullName: null, avatarUrl: u.avatarUrl, isOnline: u.isOnline, isFollowing: true, friendStatus: 'none' })}
                          className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-[var(--bg-surface-hover)]"
                        >
                          <AnhDaiDien src={u.avatarUrl} ten={ten} online={u.isOnline || !!presence.byUserId[u.id]?.online} size={40} />
                          <span className="min-w-0 flex-1 truncate text-[15px] font-medium">{ten}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {q.trim() && (nguoiMoi.length > 0 || timNguoi) && (
              <div className="mt-1 border-t border-[var(--border-color)] pt-2">
                <p className="px-2 pb-1 text-[13px] font-semibold text-text-secondary">Người khác</p>
                {timNguoi && nguoiMoi.length === 0 ? (
                  <div className="flex items-center gap-2 px-2 py-3 text-sm text-text-muted">
                    <Loader2 className="h-4 w-4 animate-spin" /> Đang tìm…
                  </div>
                ) : (
                  <ul>
                    {nguoiMoi.map((u) => {
                      const ten = u.displayName || u.fullName || u.username;
                      return (
                        <li key={u.id}>
                          <button
                            type="button"
                            onClick={() => moNguoi(u)}
                            disabled={dangMo === u.id}
                            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-[var(--bg-surface-hover)]"
                          >
                            <AnhDaiDien src={u.avatarUrl} ten={ten} online={u.isOnline} size={40} />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[15px] font-medium">{ten}</p>
                              <p className="truncate text-[12px] text-text-muted">@{u.username}</p>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Chân bảng */}
      <div className="border-t border-[var(--border-color)] py-2.5 text-center">
        <Link href="/messages" onClick={onClose} className="text-[15px] font-semibold text-[var(--accent-color)] hover:underline">
          Xem tất cả trong Messenger
        </Link>
      </div>
    </div>,
    document.body,
  );
}

function MenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-sm font-medium text-text-primary hover:bg-[var(--bg-surface-hover)]"
    >
      <span className="text-text-secondary">{icon}</span>
      {label}
    </button>
  );
}

/** Ảnh đại diện tròn + chấm xanh đang hoạt động NẰM NGOÀI vùng cắt tròn (không bị ảnh che). */
function AnhDaiDien({ src, ten, online, size }: { src?: string | null; ten: string; online: boolean; size: number }) {
  const [loi, setLoi] = useState(false);
  const dot = Math.round(size * 0.27);
  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }}>
      <span className="block h-full w-full overflow-hidden rounded-full">
        {src && !loi ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={ten} className="h-full w-full object-cover" onError={() => setLoi(true)} />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#06B6D4,#6366F1)', fontSize: size * 0.4 }}
          >
            {ten.charAt(0).toUpperCase()}
          </span>
        )}
      </span>
      {online && (
        <span
          title="Đang hoạt động"
          className="absolute rounded-full bg-[#31a24c]"
          style={{
            width: dot, height: dot,
            right: Math.round(size * 0.02), bottom: Math.round(size * 0.02),
            boxShadow: '0 0 0 2.5px var(--bg-card)',
          }}
        />
      )}
    </span>
  );
}
