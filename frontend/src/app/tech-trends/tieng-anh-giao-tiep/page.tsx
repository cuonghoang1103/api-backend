import type { Metadata } from 'next';
import TiengAnhClient from './TiengAnhClient';

/**
 * Khoá "Tiếng Anh Giao Tiếp" — route TĨNH nằm cạnh route động
 * /tech-trends/[slug], nên Next luôn ưu tiên nó và bài viết có slug trùng
 * cũng không nuốt được trang này.
 *
 * Toàn bộ nội dung là dữ liệu tĩnh trong ./data nên trang prerender được và
 * mở rất nhanh trên điện thoại — điều kiện cần vì người học sẽ mở nó mỗi ngày.
 */

export const metadata: Metadata = {
  title: 'Tiếng Anh Giao Tiếp — Lộ trình 20 ngày từ câu chào tới kể chuyện',
  description:
    'Học nói tiếng Anh trong 20 ngày: những câu dùng hằng ngày (chào hỏi, hôm nay làm gì, ăn gì, '
    + 'hẹn giờ) rồi tới tiếng Anh công việc. Mỗi ngày có câu hỏi kèm nhiều cách trả lời, hội thoại '
    + 'mẫu, từ vựng có phiên âm, ngữ pháp và một âm khó để luyện. Có nút đọc to từng câu.',
  openGraph: {
    title: 'Tiếng Anh Giao Tiếp — Lộ trình 20 ngày | CuongThai',
    description:
      'Câu giao tiếp hằng ngày → tiếng Anh công việc. Hỏi–đáp, hội thoại, từ vựng, ngữ pháp, '
      + 'phát âm và nút nghe cho từng câu.',
    url: 'https://cuongthai.com/tech-trends/tieng-anh-giao-tiep',
    type: 'article',
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: 'https://cuongthai.com/tech-trends/tieng-anh-giao-tiep',
  },
};

export default function TiengAnhGiaoTiepPage() {
  return <TiengAnhClient />;
}
