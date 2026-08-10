import type { Metadata } from 'next';
import OnThiJPD113Client from './OnThiJPD113Client';

/**
 * Trang ôn thi JPD113 — route TĨNH nằm cạnh route động /tech-trends/[slug].
 * Next ưu tiên segment tĩnh nên nó không bao giờ bị [slug] nuốt, kể cả khi
 * sau này có bài viết trùng slug "on-thi-jpd113".
 *
 * Trang này không gọi API — toàn bộ nội dung là dữ liệu tĩnh trong ./data,
 * nên nó prerender được và mở rất nhanh trên điện thoại lúc ôn bài.
 */

export const metadata: Metadata = {
  title: 'Học lại JPD113 + JPD123 — Lộ trình 30 ngày (Nghe · Đọc · Nói · Trắc nghiệm)',
  description:
    'Lộ trình 30 ngày học lại tiếng Nhật từ gốc, song song JPD113 (Kỳ 3) và JPD123 (Kỳ 4): kana và ' +
    'nhịp đọc, số & thời gian, luyện NGHE HIỂU mỗi ngày, 13 bài đọc chia theo cụm có furigana, ' +
    'ngữ pháp A1.1 + A1.2, kanji, và 35 đề thật. Có checklist tích tiến độ theo từng ngày.',
  openGraph: {
    title: 'Học lại JPD113 + JPD123 — Lộ trình 30 ngày | CuongThai',
    description:
      'Năm giai đoạn: đọc ra được chữ → số & lỗ tai → ngữ pháp lõi + kanji → thi nói & FE → đi trước JPD123. ' +
      'Khu Nghe hiểu, khu Đọc to chia cụm, bảng tra cứu và 35 đề thật.',
    url: 'https://cuongthai.com/tech-trends/on-thi-jpd113',
    type: 'article',
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: 'https://cuongthai.com/tech-trends/on-thi-jpd113',
  },
};

export default function OnThiJPD113Page() {
  return <OnThiJPD113Client />;
}
