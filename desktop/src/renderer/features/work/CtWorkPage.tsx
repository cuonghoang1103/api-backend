/**
 * CT Work — DÙNG LẠI nguyên cây `/work` của web (công cụ quản lý dự án kiểu Jira).
 *
 * Đo 23/09/2026 trước khi làm: 19 trang, toàn bộ là client component; dính
 * Next.js đúng hai module — `next/link` (21) và `next/navigation`
 * (`useRouter` 27 · `usePathname` 19 · `useParams` 16 · `useSearchParams` 16).
 * Không `next/image`, không `next/dynamic`, không trang `async`.
 *
 * Bốn chỗ cây này khác các cây đã port trước, đã xử lý như sau:
 *
 * 1. CÓ BỐ CỤC THẬT. `app/work/layout.tsx` dựng thanh bên CT Work, bảng lệnh
 *    ⌘K, khung AI, `#work-portal` (nơi mọi popover/dialog portal vào — biến màu
 *    `--w-*` chỉ sống trong `.work-root`) và import `work.css`. Router của app
 *    không biết layout của Next, nên truyền nó vào `TrangWebTheoTuyen` qua
 *    `khung`: nó bọc NGOÀI ranh giới `key={route}`, nên đổi trang không làm thanh
 *    bên gắn lại.
 *
 * 2. `.work-root` là `fixed inset-0 z-[45]` — phủ CẢ cửa sổ, tức phủ luôn thanh
 *    bên, thanh tiêu đề và thanh trạng thái của app. `.ct-work-host` đặt
 *    `contain: layout paint` để nó thành khối chứa cho con `fixed`: `inset-0`
 *    giờ là vùng nội dung của app, và z-index của CT Work không vượt ra ngoài.
 *
 * 3. CHỦ ĐỀ TỐI. `work.css` đổi token bằng `html.theme-dark .work-root` — lớp
 *    chủ đề TOÀN CỤC của web. App không đặt lớp đó (nó dùng `data-ct-theme`),
 *    nên không làm gì thì CT Work luôn sáng trong app tối. Đặt `theme-dark` lên
 *    <html> CHỈ khi trang này đang mở và app đang tối, gỡ khi rời trang — không
 *    chép lại bộ token (chép là hai bản lệch nhau lúc nào không hay).
 *    ⚠️ `theme-dark`, KHÔNG phải `dark` — xem CLAUDE.md, lỗi 02/07/2026.
 *
 * 4. REALTIME. `useProjectRealtime` (components/work/hooks.ts) vào phòng
 *    `work:project:<id>` qua `connectSocket()` của `lib/socket.ts`. Ở app, cắm
 *    socket có sẵn của app vào đó (`camSocketDesktop`, giống Tin nhắn). Chưa có
 *    socket thì `connectSocket()` ném và hook nuốt lỗi — trang vẫn chạy, chỉ
 *    không tự cập nhật khi người khác sửa.
 */
import { lazy, useEffect } from 'react';
import { useAppState } from '../../app-state';
import { camSocketDesktop } from '../../shims/web-socket-adapter';
import { TrangWebTheoTuyen } from '../web/TrangWeb';

/** Khai ở TẦM MÔ-ĐUN — xem ghi chú của `khung` trong `TrangWebTheoTuyen`. */
const KhungCtWork = lazy(() => import('@/app/work/layout'));

/** Lớp chủ đề toàn cục của web. */
const LOP_TOI = 'theme-dark';

export function CtWorkPage() {
  const { resolvedTheme } = useAppState();

  useEffect(() => {
    camSocketDesktop();
  }, []);

  useEffect(() => {
    if (resolvedTheme !== 'dark') return;
    const html = document.documentElement;
    // Ai đó khác đã đặt sẵn thì đừng gỡ của họ khi rời trang.
    if (html.classList.contains(LOP_TOI)) return;
    html.classList.add(LOP_TOI);
    return () => { html.classList.remove(LOP_TOI); };
  }, [resolvedTheme]);

  return (
    <div className="ct-work-host">
      <TrangWebTheoTuyen ten="CT Work" khung={KhungCtWork} />
    </div>
  );
}
