import type { Metadata } from 'next';

// Client pages can't export metadata, so the SEO lives here in the server layout
// (same pattern as /language, /exp-hub).
export const metadata: Metadata = {
  title: 'Interview Simulator — Luyện phỏng vấn kỹ thuật | CuongThai',
  description:
    'Luyện phỏng vấn kỹ thuật (Node.js, Database, System Design, Behavioral…) với ngân hàng câu hỏi có đáp án mẫu và rubric. Tự chấm + máy chấm khách quan, hoàn toàn miễn phí.',
  alternates: { canonical: '/interview' },
  openGraph: {
    title: 'Interview Simulator — Luyện phỏng vấn kỹ thuật',
    description: 'Mock interview với đáp án mẫu, rubric và tự đánh giá. Miễn phí, không cần AI.',
    url: '/interview',
    type: 'website',
  },
};

export default function InterviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
