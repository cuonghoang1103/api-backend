'use client';

/**
 * Chữ song ngữ cho KHUNG admin (sidebar, thanh trên, ⌘K, Dashboard, Inbox).
 *
 * Bám đúng MỘT nguồn sự thật với phần còn lại của site: cookie `locale` +
 * sự kiện `locale-changed` (xem hooks/useTranslation.ts). Nút VI/EN trên
 * thanh admin chỉ gọi `setLocale` của hook đó, nên đổi ở admin thì trang
 * ngoài cũng đổi theo, và ngược lại.
 *
 * Vì sao có bảng riêng thay vì nhét vào messages/{vi,en}.json: thiếu một
 * khoá trong `t()` sẽ in thẳng đường dẫn khoá ra màn hình ("admin.nav.x") —
 * trông y như lỗi. Bảng cặp chữ dưới đây không thể "có một nửa".
 */
import { useTranslation } from '@/hooks/useTranslation';

type Cap = readonly [en: string, vi: string];

const T = {
  // ── Khung ──
  search: ['Search…', 'Tìm…'],
  openSite: ['Open site', 'Mở trang web'],
  logOut: ['Log out', 'Đăng xuất'],
  hideSidebar: ['Hide sidebar', 'Ẩn thanh bên'],
  showSidebar: ['Show sidebar', 'Hiện thanh bên'],
  openMenu: ['Open menu', 'Mở menu'],
  admin: ['Admin', 'Quản trị'],
  checkingAccess: ['Checking access…', 'Đang kiểm quyền…'],
  language: ['Language', 'Ngôn ngữ'],

  // ── ⌘K ──
  cmdPlaceholder: ['Search pages and actions…', 'Tìm trang và lệnh…'],
  cmdGoTo: ['Go to', 'Đi tới'],
  cmdActions: ['Actions', 'Lệnh'],
  cmdToggleSidebar: ['Toggle sidebar', 'Ẩn/hiện thanh bên'],
  cmdOpenSite: ['Open public site', 'Mở trang ngoài'],
  cmdNoResult: ['No results for', 'Không có kết quả cho'],
  cmdNavigate: ['navigate', 'di chuyển'],
  cmdOpen: ['open', 'mở'],
  cmdResults: ['results', 'kết quả'],

  // ── Dashboard ──
  overview: ['Overview', 'Tổng quan'],
  visitorsToday: ['Visitors today', 'Khách hôm nay'],
  viewsToday: ['Page views today', 'Lượt xem hôm nay'],
  revenueToday: ['Revenue today', 'Doanh thu hôm nay'],
  revenue30: ['Revenue · 30 days', 'Doanh thu · 30 ngày'],
  users: ['Users', 'Người dùng'],
  aiConversations: ['AI conversations', 'Cuộc trò chuyện AI'],
  online: ['online', 'đang xem'],
  last7: ['last 7 days', '7 ngày qua'],
  paidOrders: ['paid orders', 'đơn đã trả'],
  posts: ['posts', 'bài viết'],
  messages: ['messages', 'tin nhắn'],
  vsYesterday: ['vs yesterday', 'so với hôm qua'],
  needsAttention: ['Needs attention', 'Việc đang chờ'],
  inbox: ['Inbox', 'Hộp thư'],
  recentPosts: ['Recent posts', 'Bài viết mới'],
  allPosts: ['All posts', 'Tất cả bài'],
  revenue30d: ['Revenue · last 30 days', 'Doanh thu · 30 ngày qua'],
  details: ['Details', 'Chi tiết'],
  views30d: ['Page views · last 30 days', 'Lượt xem · 30 ngày qua'],
  traffic: ['Traffic', 'Lượt truy cập'],
  topPages: ['Top pages · 7 days', 'Trang xem nhiều · 7 ngày'],
  aiAssistant: ['AI assistant', 'Trợ lý AI'],
  analytics: ['Analytics', 'Thống kê'],
  conversations: ['Conversations', 'Cuộc trò chuyện'],
  messagesCap: ['Messages', 'Tin nhắn'],
  positiveFeedback: ['Positive feedback', 'Phản hồi tích cực'],
  avgResponse: ['Avg. response time', 'Thời gian trả lời TB'],
  nothingPending: ['Nothing pending', 'Không còn việc chờ'],
  allDone: ['Everything is handled.', 'Mọi việc đã xử lý xong.'],
  noPosts: ['No posts yet', 'Chưa có bài viết nào'],
  noData: ['No data', 'Chưa có số liệu'],
  noRevenue30: ['No revenue in the last 30 days', 'Chưa có doanh thu trong 30 ngày'],
  noViews: ['No page views yet', 'Chưa có lượt xem nào'],
  transfersToConfirm: ['transfers to confirm', 'chuyển khoản chờ duyệt'],
  keyReplacements: ['key replacements', 'yêu cầu đổi key'],
  ordersAwaiting: ['orders awaiting payment', 'đơn chờ thanh toán'],
  checkoutCompletion: ['checkout completion', 'đơn hoàn tất'],
  today: ['Today', 'Hôm nay'],
  visitors: ['visitors', 'khách'],
  viewsUnit: ['views', 'lượt xem'],

  // ── Inbox ──
  pending: ['Pending', 'Đang chờ'],
  unread: ['Unread', 'Chưa đọc'],
  all: ['All', 'Tất cả'],
  allTypes: ['All types', 'Mọi loại'],
  markAllRead: ['Mark all read', 'Đánh dấu đã đọc hết'],
  noNotifications: ['No notifications', 'Chưa có thông báo'],
  noneInFilter: ['Nothing matches this filter.', 'Không có gì ở bộ lọc này.'],
  needsAction: ['Needs action', 'Cần xử lý'],
  done: ['Done', 'Đã xong'],
  open: ['Open', 'Mở'],
  markDone: ['Mark done', 'Đánh dấu xong'],
  waitingOnYou: ['waiting on you', 'việc đang chờ bạn'],
  unreadCount: ['unread', 'chưa đọc'],
} as const satisfies Record<string, Cap>;

export type AdminKey = keyof typeof T;

/** `t('overview')` → chữ theo ngôn ngữ đang chọn; `lang` để tự ghép câu. */
export function useAdminT() {
  const { locale, setLocale } = useTranslation();
  const vi = locale !== 'en';
  return {
    lang: (vi ? 'vi' : 'en') as 'vi' | 'en',
    vi,
    setLocale,
    t: (k: AdminKey) => T[k][vi ? 1 : 0],
    /** Cặp chữ viết thẳng tại chỗ: L('Save', 'Lưu') */
    L: (en: string, viText: string) => (vi ? viText : en),
  };
}
