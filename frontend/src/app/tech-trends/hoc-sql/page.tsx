import type { Metadata } from 'next';
import HocSqlClient from './HocSqlClient';

/**
 * Khoá "Học SQL & Database từ số 0" — route TĨNH nằm cạnh route động
 * /tech-trends/[slug], nên Next luôn ưu tiên nó và một bài viết có slug trùng
 * cũng không nuốt được trang này.
 *
 * Toàn bộ nội dung là dữ liệu tĩnh trong ./data nên trang prerender được;
 * riêng các widget tương tác nạp động phía client (xem ./widgets/index.tsx).
 */
export const metadata: Metadata = {
  title: 'Học SQL & Database từ số 0 — PostgreSQL, kèm đối chiếu SQL Server',
  description:
    'Khoá SQL 21 chương cho người chưa biết gì về database: bảng, SELECT, WHERE, GROUP BY, JOIN, '
    + 'CTE, transaction, index. Có sơ đồ giải thích, hình bấm được để tự thử, câu hỏi kiểm tra, '
    + '210 bài tập chạy trên PostgreSQL thật, và bảng tra cứu SQL Server ↔ PostgreSQL cho sinh viên '
    + 'học SQL Server ở trường.',
  keywords: [
    'học SQL', 'SQL cơ bản', 'PostgreSQL tiếng Việt', 'SQL Server và PostgreSQL',
    'JOIN', 'GROUP BY', 'index B+Tree', 'transaction', 'bài tập SQL',
  ],
  openGraph: {
    title: 'Học SQL & Database từ số 0 | CuongThai',
    description:
      'Từ "database là cái gì" tới JOIN, CTE, transaction và index. Sơ đồ, hình bấm được, '
      + 'câu hỏi kiểm tra, 210 bài tập trên PostgreSQL thật, kèm bảng đối chiếu SQL Server.',
    url: 'https://cuongthai.com/tech-trends/hoc-sql',
    type: 'article',
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: 'https://cuongthai.com/tech-trends/hoc-sql',
  },
};

export default function HocSqlPage() {
  return <HocSqlClient />;
}
