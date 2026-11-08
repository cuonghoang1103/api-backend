/**
 * Ba trang Courses của web cho app desktop — GIỐNG WEB 100% (08/11/2026).
 *
 * Người dùng 08/11/2026: *"trang academy + courses + codelab… giao diện và bố cục giống trên web 100%…
 * trên web đã update nhiều rồi mà trên app vẫn như cũ"*. App từng có màn Courses/Học viện VIẾT RIÊNG
 * (`features/academy/KhoaHocPage`, `HocVienPage`, từ 08/2026) — web đổi sang chương trình 15 kỳ, trang khoá
 * mới, trang học mới… còn app đứng yên. Giờ app dựng thẳng component của web.
 *
 * Vì sao cần tệp này thay vì `import('@/app/courses/…/page')` như các cây web khác: ba `page.tsx` của
 * Courses là SERVER COMPONENT (async, `next/headers`, `fetch(... { next: { revalidate } })`) — chỉ chạy
 * được trong máy chủ Next. Phần giao diện thật nằm ở component client bên dưới; ở đây làm đúng việc
 * tối thiểu mà trang máy chủ làm (đọc truy vấn, chuyển hướng) rồi giao cho component client của web,
 * vốn TỰ tải dữ liệu khi không có bản dựng sẵn.
 *
 * ⚠️ Thêm logic vào `page.tsx` của web (đọc thêm truy vấn, chuyển hướng mới) thì soi lại ở đây.
 */
import ChuongTrinhClient from '@/components/courses/chuong-trinh/ChuongTrinhClient';
import { docCheDo } from '@/components/courses/chuong-trinh/chu';
import CoursePageClient from '@/app/courses/[slug]/CoursePageClient';
import LearnPageClient from '@/app/courses/[slug]/learn/LearnPageClient';
import ExamReturnBanner from '@/app/courses/[slug]/learn/ExamReturnBanner';
import { redirect } from '../../shims/next-navigation';

type TruyVan = Record<string, string | string[] | undefined>;
const lay = (sp: TruyVan | undefined, k: string) => {
  const v = sp?.[k];
  return (Array.isArray(v) ? v[0] : v) ?? '';
};

/** `/courses` — chương trình đào tạo (15 kỳ × 5 khoá). Web dựng sẵn bản công khai; app để client tự tải. */
export function KhoaHocDanhSach({ searchParams }: { searchParams?: TruyVan }) {
  if (lay(searchParams, 'tab') === 'academy') redirect('/academy');
  return (
    <ChuongTrinhClient
      banDau={null}
      trangThaiDau={{
        xem: docCheDo(lay(searchParams, 'view')),
        q: lay(searchParams, 'q'),
        level: lay(searchParams, 'level'),
        category: lay(searchParams, 'category'),
      }}
    />
  );
}

/** `/courses/:slug` — trang giới thiệu khoá. Bỏ JSON-LD/metadata (chỉ để SEO, app không cần). */
export function KhoaHocChiTiet() {
  return <CoursePageClient />;
}

/**
 * `/courses/:slug/learn` — trang học. Web kiểm cookie `backend_token` ở máy chủ rồi đẩy về /login; app
 * luôn đã đăng nhập (cửa sổ chính chỉ mở sau khi có phiên), API client của app tự xử lý 401.
 */
export function KhoaHocHoc({ params }: { params?: Record<string, string> }) {
  const slug = params?.slug ?? '';
  return (
    <>
      <ExamReturnBanner />
      <LearnPageClient slug={slug} />
    </>
  );
}
