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
import { MakerLabPage } from './features/maker-lab/MakerLabPage';
import { XuongNoiDungPage } from './features/creator/XuongNoiDungPage';
import { DuAnPage } from './features/projects/DuAnPage';
import { ExpHubPage } from './features/exp-hub/ExpHubPage';
import { TaiChinhPage } from './features/finance/TaiChinhPage';
import { HocTapPage } from './features/hocTap/HocTapPage';
import { DienDanPage } from './features/forum/DienDanPage';
import { DaLuuPage } from './features/saved/DaLuuPage';
import { TrangCaNhanPage } from './features/profile/TrangCaNhanPage';
import { MusicPage } from './features/music/MusicPage';
import { XuongRemixPage } from './features/xuong-remix/XuongRemixPage';
import { NotesPage } from './features/notes/NotesPage';
import { ProPage } from './features/pro/ProPage';
import { TechTrendsWebPage } from './features/tech-trends/TechTrendsWebPage';
import { HocVienPage } from './features/academy/HocVienPage';
import { TuVanNganhPage } from './features/academy/TuVanNganhPage';
import { KhoaHocPage } from './features/academy/KhoaHocPage';
import { CodeLabPage } from './features/codelab/CodeLabPage';
import { PhongThiPage } from './features/exam/PhongThiPage';
import { GiongNoiPage } from './features/voice/GiongNoiPage';
import { ThuatToanPage } from './features/algorithms/ThuatToanPage';
import { MoPhongPage } from './features/simulation/MoPhongPage';
import { LoTrinhPage } from './features/roadmap/LoTrinhPage';
import { NgoaiNguPage } from './features/language/NgoaiNguPage';
import { IeltsPage } from './features/ielts/IeltsPage';
import { JpPage, ChPage } from './features/khoaNgonNgu/KhoaNgonNguPage';
import { ThuVienSachPage } from './features/sach/ThuVienSach';
import { ThongBaoPage } from './features/thongBao/ThongBaoPage';
import { PhongVanPage } from './features/interview/PhongVanPage';
import { CtWorkPage } from './features/work/CtWorkPage';
import { MangNhaPage } from './features/mang/MangNhaPage';
import { HoSoPage } from './features/profile/HoSoPage';
import { TroChoiPage } from './features/games/TroChoiPage';
import { QuanTriPage } from './features/admin/QuanTriPage';
import { CaiDatThongBaoPage } from './features/profile/CaiDatThongBaoPage';
import { thuocCayWeb } from './features/web/dinhTuyenWeb';

export const NATIVE_PAGES: Readonly<Record<string, ComponentType>> = {
  '/dashboard': DashboardPage,
  '/feed': FeedPage,
  '/messages': MessagesPage,
  '/friends': FriendsPage,
  '/chat': ChatPage,
  '/cv': CvWebPage,
  '/music': MusicPage,
  '/xuong-remix': XuongRemixPage,
  '/notes': NotesPage,
  '/pro': ProPage,
  '/tech-trends': TechTrendsWebPage,
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
  '/ielts': IeltsPage,
  '/jp': JpPage,
  '/ch': ChPage,
  '/notifications': ThongBaoPage,
  '/interview': PhongVanPage,
  '/maker-lab': MakerLabPage,
  '/creator': XuongNoiDungPage,
  '/projects': DuAnPage,
  '/exp-hub': ExpHubPage,
  '/finance': TaiChinhPage,
  '/hoc-tap': HocTapPage,
  '/forum': DienDanPage,
  '/saved': DaLuuPage,
  '/profile': TrangCaNhanPage,
  '/ho-so': HoSoPage,
  '/games': TroChoiPage,
  '/quan-tri': QuanTriPage,
  '/books': ThuVienSachPage,
  '/settings/notifications': CaiDatThongBaoPage,
  '/work': CtWorkPage,
  '/toc-do-mang': MangNhaPage,
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
  ['/ielts', IeltsPage],
  ['/jp', JpPage],
  ['/ch', ChPage],
  ['/roadmap', LoTrinhPage],
  ['/interview', PhongVanPage],
  ['/code-lab', CodeLabPage],
  ['/cv', CvWebPage],
  ['/maker-lab', MakerLabPage],
  ['/creator', XuongNoiDungPage],
  ['/projects', DuAnPage],
  ['/exp-hub', ExpHubPage],
  ['/finance', TaiChinhPage],
  ['/hoc-tap', HocTapPage],
  ['/forum', DienDanPage],
  ['/saved', DaLuuPage],
  ['/profile', TrangCaNhanPage],
  ['/tech-trends', TechTrendsWebPage],
  /* ⚠️ `/academy` KHỚP CHÍNH XÁC ở `NATIVE_PAGES` nên nó vẫn ra `HocVienPage`
     (bản có đọc ngoại tuyến). Mục này chỉ bắt các trang CON — `tu-van-nganh`,
     `so-do-mon-hoc` — vốn app chưa từng có. Thứ tự trong `nativePageFor` bảo
     đảm điều đó: khớp chính xác trước, cây web sau. */
  ['/academy', TuVanNganhPage],
  ['/work', CtWorkPage],
  /* `/notes/graph` (Đồ thị liên kết) — ⌘K và trang chủ Sổ tay trỏ tới. Chỉ
     trang CON; `/notes` vẫn khớp chính xác ở `NATIVE_PAGES`. `NotesPage` tự
     rẽ theo `route`. */
  ['/notes', NotesPage],
];

export function nativePageFor(path: string): ComponentType | undefined {
  const dung = NATIVE_PAGES[path];
  if (dung) return dung;
  /* Phòng thi là màn NATIVE (không thuộc cây web) nhưng có trang con:
     `/exam/:id` (đề / đang thi) và `/exam/attempt/:id` (kết quả) — 04/10/2026.
     `PhongThiPage` tự rẽ theo `route`. */
  if (path.startsWith('/exam/')) return PhongThiPage;
  /* `/games/<slug>` — chơi một game (TroChoiPage tự rẽ theo route), 05/10/2026. */
  if (path.startsWith('/games/')) return TroChoiPage;
  /* Quản trị (05/10/2026) — `/quan-tri/<mục>`, QuanTriPage tự rẽ theo route. */
  if (path.startsWith('/quan-tri/')) return QuanTriPage;
  /* Library (05/10/2026) — `/books/<slug>` là trình đọc, ThuVienSachPage tự rẽ theo route. */
  if (path.startsWith('/books/')) return ThuVienSachPage;
  /* `/academy/courses/<slug>` — Học viện NATIVE tự mở môn theo đường dẫn (04/10/2026). */
  if (path.startsWith('/academy/courses/')) return HocVienPage;
  // Trang con của một cây web (`/language/ja/vocab`…). Chính trang chủ cây đọc
  // `route` rồi tự chọn màn hình con — xem `TrangWebTheoTuyen`.
  if (!thuocCayWeb(path)) return undefined;
  return CHU_CAY.find(([goc]) => path === goc || path.startsWith(`${goc}/`))?.[1];
}
