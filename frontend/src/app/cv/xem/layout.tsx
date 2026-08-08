import type { Metadata } from 'next';

// Layout riêng để KHÔNG thừa hưởng metadata của /cv (đó là trang giới thiệu
// công cụ CV Builder — tiêu đề "CV Builder — CV thật, đi phỏng vấn được" sai
// hẳn cho một trang đang hiển thị CV của một người cụ thể).
//
// `noindex`: trang này là CV cá nhân. Chủ site chủ động chia sẻ link cho nhà
// tuyển dụng, chứ không có lý do gì để nó nằm trong kết quả tìm kiếm — CV bị
// index là cách thông tin cá nhân đi xa hơn ý định của người đăng.
export const metadata: Metadata = {
  title: 'CV',
  description: 'CV của CuongHoang — xem trực tiếp hoặc tải về PDF / DOCX / TXT.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
