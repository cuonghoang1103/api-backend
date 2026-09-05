import type { Metadata } from 'next';
import IeltsClient from './IeltsClient';

/**
 * Route TĨNH cạnh route động /tech-trends/[slug] — Next ưu tiên segment tĩnh
 * nên bài viết trùng slug cũng không nuốt được trang này. Dữ liệu tĩnh nên
 * trang prerender được và mở nhanh trên điện thoại.
 */

export const metadata: Metadata = {
  title: 'Lộ trình IELTS 0 → 8.0 — 5 chặng band, đủ 4 kỹ năng',
  description:
    'Lộ trình IELTS từ số 0 lên 8.0 chia 5 chặng band: mỗi chặng ghi rõ mỗi ngày làm gì cho Nghe, '
    + 'Đọc, Viết, Nói, mốc phải đạt để lên chặng sau, và những sai lầm hay mắc ở đúng chặng đó. '
    + 'Kèm tra cứu band descriptors, bảng quy đổi điểm và trợ lý AI chấm bài Viết/Nói.',
  openGraph: {
    title: 'Lộ trình IELTS 0 → 8.0 | CuongThai',
    description:
      '5 chặng band, kế hoạch hằng ngày cho từng kỹ năng, mốc kiểm tra và bẫy thường gặp.',
    url: 'https://cuongthai.com/tech-trends/ielts',
    type: 'article',
    images: ['/opengraph-image'],
  },
  alternates: { canonical: 'https://cuongthai.com/tech-trends/ielts' },
};

export default function IeltsPage() {
  return <IeltsClient />;
}
