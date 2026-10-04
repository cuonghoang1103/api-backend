/**
 * ============================================================
 * THÔNG BÁO trong app desktop (04/10/2026)
 * ============================================================
 *
 * Người dùng: "trên appdesktop có mục thông báo gì chưa? tin nhắn, admin update,
 * hay bất cứ thứ gì mới". Trước đây: KHÔNG — socket của app không nghe
 * `social:notification` / `admin:announcement`, nút "thông báo mới" ở Tổng quan
 * dẫn vào đường dẫn trống.
 *
 * Dùng lại NGUYÊN hook của web (`useNotificationSocket`): nhận realtime, phát âm
 * thanh theo cài đặt ở /settings/notifications (tin nhắn / thông báo / admin),
 * nạp lại khi nối lại, giữ `unreadCount` đúng. App chỉ thêm:
 *  • cắm socket của app vào `lib/socket` (`camSocketDesktop`) — làm ở đây cho
 *    MỌI trang, trước đó chỉ Tin nhắn và CT Work cắm;
 *  • thông báo HỆ ĐIỀU HÀNH khi app đang ở nền (cửa sổ không được focus) — bấm
 *    vào thì mở app đúng trang Thông báo. Tắt được trong Cài đặt.
 */
import { useEffect } from 'react';
import { useNotificationSocket } from '@/hooks/useNotificationSocket';
import { connectSocket } from '@/lib/socket';
import { useAppState } from '../../app-state';
import { camSocketDesktop } from '../../shims/web-socket-adapter';
import { datTruyVanCho } from '../../shims/next-navigation';
import { useSession } from '../../auth/session';

const KHOA_OS = 'ct-thong-bao-os';
export function docThongBaoOs(): boolean {
  try { return localStorage.getItem(KHOA_OS) !== '0'; } catch { return true; }
}
export function ghiThongBaoOs(bat: boolean): void {
  try { localStorage.setItem(KHOA_OS, bat ? '1' : '0'); } catch { /* bỏ qua */ }
}

interface GoiThongBao {
  type?: string;
  sender?: { displayName?: string | null; username?: string | null } | null;
}

/** Câu ngắn cho từng loại thông báo (gói chỉ có `type` + người gửi, không có chữ sẵn). */
const CAU: Record<string, string> = {
  NEW_POST: 'vừa đăng bài mới', NEW_REACTION: 'đã bày tỏ cảm xúc về bài của bạn',
  NEW_COMMENT: 'đã bình luận bài của bạn', NEW_REPLY: 'đã trả lời bình luận của bạn',
  NEW_MENTION: 'đã nhắc tới bạn', FRIEND_REQUEST: 'đã gửi lời mời kết bạn',
  FRIEND_ACCEPT: 'đã chấp nhận lời mời kết bạn', NEW_FOLLOW: 'đã theo dõi bạn',
  NOTE_SHARE: 'đã chia sẻ một thư mục ghi chú với bạn', NOTE_COMMENT: 'đã bình luận ghi chú',
  NOTE_REPLY: 'đã trả lời trong ghi chú', ADMIN_ANNOUNCEMENT: 'đăng thông báo mới',
};

function ten(p: GoiThongBao['sender']): string {
  return p?.displayName || p?.username || 'Ai đó';
}

export function ThongBaoHost() {
  const { navigate } = useAppState();
  const { userId } = useSession();
  // Cắm socket TRƯỚC khi hook web gọi `connectSocket()`.
  camSocketDesktop();
  useNotificationSocket();

  useEffect(() => {
    let huy = false;
    let go: (() => void) | null = null;
    void connectSocket().then((s) => {
      if (huy || !s) return;
      const bao = (tieuDe: string, than: string, den: string, khiBam?: () => void) => {
        if (!docThongBaoOs() || document.hasFocus()) return;
        if (typeof Notification === 'undefined') return;
        if (Notification.permission === 'default') { void Notification.requestPermission(); return; }
        if (Notification.permission !== 'granted') return;
        const n = new Notification(tieuDe, { body: than.slice(0, 180), silent: true });
        n.onclick = () => { window.focus(); khiBam?.(); navigate(den); };
      };
      const onTb = (p: GoiThongBao) => {
        bao('🔔 Thông báo mới', `${ten(p.sender)} ${CAU[p.type ?? ''] ?? 'có hoạt động mới'}`, '/notifications');
      };
      const onAdmin = () => bao('📣 Admin vừa đăng thông báo', 'Mở để xem chi tiết', '/notifications');
      /* Tin nhắn đến KHÔNG đi kênh thông báo (backend chưa phát NEW_MESSAGE) mà đi
         `thread:new-message`. Kho tin nhắn của web chỉ gắn bộ nghe (và tự kêu
         "tin đến") sau khi trang Tin nhắn mở lần đầu — `_messagingWired`. Chưa gắn
         thì app tự kêu, đã gắn thì để kho kêu ⇒ KHÔNG BAO GIỜ kêu hai lần. */
      const onTin = (g: { threadId: number; message?: { senderId?: number; content?: string | null; sender?: GoiThongBao['sender'] } }) => {
        if (!g?.message || g.message.senderId === userId) return;
        if (!(s as unknown as { _messagingWired?: boolean })._messagingWired) {
          void import('@/lib/sound').then(({ playSound }) => playSound('message')).catch(() => {});
        }
        // Chỉ chọn sẵn cuộc trò chuyện KHI BẤM vào thông báo — đặt ngay lúc tin đến
        // thì người đang ở trang Tin nhắn bị nhảy sang cuộc trò chuyện khác.
        bao(`💬 ${ten(g.message.sender)}`, g.message.content || 'Đã gửi một tệp', '/messages',
          () => datTruyVanCho('/messages', `thread=${g.threadId}`));
      };
      s.on('social:notification', onTb);
      s.on('admin:announcement', onAdmin);
      s.on('thread:new-message', onTin);
      go = () => { s.off('social:notification', onTb); s.off('admin:announcement', onAdmin); s.off('thread:new-message', onTin); };
    }).catch(() => { /* chưa nối được — hook web sẽ thử lại */ });
    return () => { huy = true; go?.(); };
  }, [navigate, userId]);

  return null;
}
