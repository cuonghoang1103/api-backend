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
  title: 'Ôn thi JPD113 — Lộ trình 5 ngày (Đọc · Nói · Trắc nghiệm)',
  description:
    'Lộ trình ôn thi JPD113 (Elementary Japanese 1) từ số 0 trong 5 ngày: kana, số & thời gian, ' +
    'trợ từ, kanji, ngân hàng 13 bài đọc và 22 câu hỏi thi nói, cùng 14 đề trắc nghiệm thật. ' +
    'Có checklist tích tiến độ và bảng tra cứu đầy đủ.',
  openGraph: {
    title: 'Ôn thi JPD113 — Lộ trình 5 ngày | CuongThai',
    description:
      'Kana → số & thời gian → ngữ pháp → kanji → thi nói. Checklist tích tiến độ, bảng tra cứu, ' +
      'ngân hàng đề nói và 14 đề FE thật.',
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
