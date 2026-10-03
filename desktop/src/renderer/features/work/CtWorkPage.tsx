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
 * 3. CHỦ ĐỀ TỐI. `work.css` đổi token bằng `html.theme-dark .work-root`. `VoWeb`
 *    (TrangWeb.tsx) đặt lớp đó cho mọi cây web khi app tối — xem `useLopToiWeb`.
 *
 * 4. REALTIME. `useProjectRealtime` (components/work/hooks.ts) vào phòng
 *    `work:project:<id>` qua `connectSocket()` của `lib/socket.ts`. Ở app, cắm
 *    socket có sẵn của app vào đó (`camSocketDesktop`, giống Tin nhắn). Chưa có
 *    socket thì `connectSocket()` ném và hook nuốt lỗi — trang vẫn chạy, chỉ
 *    không tự cập nhật khi người khác sửa.
 */
import { lazy, useEffect } from 'react';
import { camSocketDesktop } from '../../shims/web-socket-adapter';
import { TrangWebTheoTuyen } from '../web/TrangWeb';
import { useAiPanel } from '@/components/work/ai/store';
/* Font Inter như trên web — `work.css` gọi `var(--font-inter), Inter` kèm
   `cv11`/`ss03`; app chưa từng nạp nên CT Work rơi về font hệ thống và trông lệch
   so với web (04/10/2026). Lấy từ `frontend/node_modules` (CI cài sẵn cho alias `@`),
   chỉ trong chunk của trang này. */
import '@/../node_modules/@fontsource/inter/400.css';
import '@/../node_modules/@fontsource/inter/500.css';
import '@/../node_modules/@fontsource/inter/600.css';
import '@/../node_modules/@fontsource/inter/700.css';

/** Khai ở TẦM MÔ-ĐUN — xem ghi chú của `khung` trong `TrangWebTheoTuyen`. */
const KhungCtWork = lazy(() => import('@/app/work/layout'));


export function CtWorkPage() {

  useEffect(() => {
    camSocketDesktop();
  }, []);

  /* Ngăn AI của CT Work là cột 440px dính mép phải — đúng chỗ con robot Odin nổi,
     nên robot đè lên nút Gửi. Mở ngăn thì gắn lớp lên <html> để robot né sang trái
     (styles.css: `.ct-work-ai-mo .odin-dock`), đóng ngăn hay rời trang là gỡ. */
  const aiMo = useAiPanel((st) => st.open);
  useEffect(() => {
    if (!aiMo) return;
    document.documentElement.classList.add('ct-work-ai-mo');
    return () => document.documentElement.classList.remove('ct-work-ai-mo');
  }, [aiMo]);


  return (
    <div className="ct-work-host" data-khung-fixed>
      <TrangWebTheoTuyen ten="CT Work" khung={KhungCtWork} />
    </div>
  );
}
