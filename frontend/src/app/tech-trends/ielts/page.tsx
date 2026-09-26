import { permanentRedirect } from 'next/navigation';

/**
 * IELTS đã chuyển vào My Language → Tiếng Anh (26/09/2026): người dùng không
 * muốn hai chỗ học IELTS tách rời. Giữ route này để link cũ và kết quả tìm
 * kiếm vẫn tới được trang mới.
 *
 * Các file giao diện cũ trong thư mục này (IeltsClient, *View.tsx, data/) KHÔNG
 * còn được trang nào dùng, nhưng CHƯA xoá: `data/**` vẫn là nguồn để
 * `scripts/ielts-dung-json.mts` dựng nội dung IELTS cho app iOS, và
 * `src/services/ielts/nguon.test.ts` đối chiếu với nó.
 */
export default function IeltsMovedPage() {
  permanentRedirect('/language/en/ielts');
}
