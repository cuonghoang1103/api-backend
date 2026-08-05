import type { Metadata } from 'next';
import ViecLamClient from './ViecLamClient';

/**
 * Route TĨNH nằm cạnh route động /tech-trends/[slug] — Next luôn ưu tiên
 * segment tĩnh nên bài viết có slug trùng cũng không nuốt được trang này.
 *
 * Toàn bộ nội dung là dữ liệu tĩnh trong ./data nên trang prerender được.
 */

export const metadata: Metadata = {
  title: 'Việc làm Claude Code — 108 tin đã kiểm chứng, học gì để apply',
  description:
    'Kiểm chứng 108 tin tuyển dụng có nhắc Claude Code: tin nào còn thật, người ở Việt Nam nộp '
    + 'được cái nào, và lộ trình 20 tuần + 8 dự án thật để đủ sức ứng tuyển. Kỹ năng đo từ toàn văn '
    + 'mô tả công việc, không đoán.',
  openGraph: {
    title: 'Việc làm Claude Code — 108 tin đã kiểm chứng | CuongThai',
    description:
      '106/108 tin xác minh còn sống. Phân nhóm theo mức độ nộp được từ Việt Nam, kèm lộ trình '
      + '20 tuần và 8 dự án thật.',
    url: 'https://cuongthai.com/tech-trends/viec-lam-claude-code',
    type: 'article',
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: 'https://cuongthai.com/tech-trends/viec-lam-claude-code',
  },
};

export default function ViecLamClaudeCodePage() {
  return <ViecLamClient />;
}
