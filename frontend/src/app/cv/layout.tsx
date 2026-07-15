import type { Metadata } from 'next';

// Client pages can't export metadata, so SEO lives here in the server layout
// (same pattern as /interview, /language).
export const metadata: Metadata = {
  title: 'CV Builder — CV thật, đi phỏng vấn được | CuongThai',
  description:
    'Trình xây CV trung thực cho kỹ sư IT. Không bịa số liệu — moi ra điều bạn thực sự đã làm, chỉ ra chỗ yếu và kỹ năng thiếu bằng chứng trước khi nhà tuyển dụng loại bạn. Rules-engine miễn phí; AI tuỳ chọn.',
  alternates: { canonical: '/cv' },
  openGraph: {
    title: 'CV Builder — CV thật, đi phỏng vấn được',
    description: 'Xây hồ sơ sự nghiệp gốc, tạo CV theo từng job, và được chấm như một senior khó tính.',
    url: '/cv',
    type: 'website',
  },
};

export default function CvLayout({ children }: { children: React.ReactNode }) {
  return children;
}
