/**
 * Sổ đăng ký màn hình native.
 *
 * MỘT nguồn sự thật cho câu hỏi "route này đã có màn hình native chưa".
 *
 * Trước đây thông tin này nằm ở hai nơi: cờ `ported` trong `routes.ts` (sidebar
 * đọc để quyết định hiện gì) và một chuỗi `if` trong `App.tsx` (router đọc để
 * dựng màn hình). Hai nơi thì sẽ có ngày lệch nhau, và lệch kiểu nào cũng tệ:
 *   • `ported: true` mà thiếu component → sidebar dẫn vào màn hình "chưa có",
 *     mâu thuẫn với chính nó.
 *   • có component mà `ported: false` → màn hình đã viết xong nhưng không ai
 *     vào được.
 *
 * Giờ `ported` được TÍNH RA từ sổ này (xem `isPorted` trong routes.ts), nên
 * lệch là chuyện không xảy ra được nữa.
 */
import type { ComponentType } from 'react';
import { MauAIPage } from './features/aitemplates/MauAIPage';
import { ChatPage } from './features/chat/ChatPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { FeedPage } from './features/feed/FeedPage';
import { FriendsPage } from './features/friends/FriendsPage';
import { MessagesPage } from './features/messages/MessagesPage';
import { CvWebPage } from './features/cv/CvWebPage';
import { MusicPage } from './features/music/MusicPage';
import { NotesPage } from './features/notes/NotesPage';
import { ProPage } from './features/pro/ProPage';
import { TechTrendsPage } from './features/tech-trends/TechTrendsPage';
import { HocVienPage } from './features/academy/HocVienPage';
import { KhoaHocPage } from './features/academy/KhoaHocPage';
import { CodeLabPage } from './features/codelab/CodeLabPage';
import { PhongThiPage } from './features/exam/PhongThiPage';
import { GiongNoiPage } from './features/voice/GiongNoiPage';
import { ThuatToanPage } from './features/algorithms/ThuatToanPage';
import { MoPhongPage } from './features/simulation/MoPhongPage';
import { LoTrinhPage } from './features/roadmap/LoTrinhPage';
import { NgoaiNguPage } from './features/language/NgoaiNguPage';
import { PhongVanPage } from './features/interview/PhongVanPage';
import { thuocCayWeb } from './features/web/dinhTuyenWeb';

export const NATIVE_PAGES: Readonly<Record<string, ComponentType>> = {
  '/dashboard': DashboardPage,
  '/feed': FeedPage,
  '/messages': MessagesPage,
  '/friends': FriendsPage,
  '/chat': ChatPage,
  '/cv': CvWebPage,
  '/music': MusicPage,
  '/notes': NotesPage,
  '/pro': ProPage,
  '/tech-trends': TechTrendsPage,
  '/ai-templates': MauAIPage,
  '/voice': GiongNoiPage,
  '/academy': HocVienPage,
  '/courses': KhoaHocPage,
  '/code-lab': CodeLabPage,
  '/exam': PhongThiPage,
  '/algorithms': ThuatToanPage,
  '/simulation': MoPhongPage,
  '/roadmap': LoTrinhPage,
  '/language': NgoaiNguPage,
  '/interview': PhongVanPage,
};

/**
 * Trang SỞ HỮU CẢ CÂY con của nó, không chỉ đúng một đường dẫn.
 *
 * `/language`, `/roadmap`, `/interview` và `/cv` dùng lại cây web vốn có đường
 * dẫn động (`/language/ja/vocab`, `/roadmap/frontend`, `/interview/report/12`,
 * `/cv/builder/7`).
 * Bảng `NATIVE_PAGES` khớp chính xác, nên thiếu phần này thì bấm vào một ngôn
 * ngữ — hay mở một bản báo cáo phỏng vấn — là rơi thẳng vào màn hình "Không
 * tìm thấy", đúng lúc trang vừa mới chạy được.
 *
 * Ranh giới nằm ở `thuocCayWeb()`: nó so theo ĐOẠN đường dẫn chứ không so
 * chuỗi trần, nên `/languages` không bị nuốt vào cây Ngoại ngữ.
 */
const CHU_CAY: ReadonlyArray<readonly [string, ComponentType]> = [
  ['/language', NgoaiNguPage],
  ['/roadmap', LoTrinhPage],
  ['/interview', PhongVanPage],
  ['/cv', CvWebPage],
];

export function nativePageFor(path: string): ComponentType | undefined {
  const dung = NATIVE_PAGES[path];
  if (dung) return dung;
  // Trang con của một cây web (`/language/ja/vocab`…). Chính trang chủ cây đọc
  // `route` rồi tự chọn màn hình con — xem `TrangWebTheoTuyen`.
  if (!thuocCayWeb(path)) return undefined;
  return CHU_CAY.find(([goc]) => path === goc || path.startsWith(`${goc}/`))?.[1];
}
