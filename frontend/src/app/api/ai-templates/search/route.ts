import { NextResponse } from 'next/server';
import { getSearchIndex } from '@/lib/ai-templates/data.server';

/**
 * Chỉ mục tìm kiếm cho bảng lệnh ⌘K của kho AI Templates.
 *
 * Vì sao là một route riêng chứ không nhúng thẳng vào trang: chỉ mục gộp cả
 * 1.877 component (~110 KB). Nhúng vào layout thì MỌI trang trong kho đều phải
 * cõng ngần ấy byte, kể cả người chỉ vào đọc một trang chi tiết. Tách ra thì
 * chỉ ai thật sự bấm ⌘K mới tải, và tải đúng một lần cho cả phiên.
 *
 * `force-static` cho Next sinh sẵn tệp này lúc build — không có tính toán nào
 * lúc chạy, chỉ là JSON tĩnh nằm sau CDN cache.
 */
export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json(getSearchIndex(), {
    headers: {
      // Dữ liệu chỉ đổi khi build lại, nên cache thoải mái.
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
