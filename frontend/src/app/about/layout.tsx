import type { Metadata } from 'next';

// Metadata-only layout (SEO audit 2026-07-05). The page itself is a client
// component and cannot export metadata; this server layout gives the route its
// own <title> (root template appends " | CuongThai") + description without
// touching any rendering or logic.
//
// Description rewritten 2026-08-08 with the page: the old one ("building web,
// AI, and embedded products") described nothing a reader could check. The page
// now leads with counted evidence, so the snippet should too.
const DESCRIPTION =
  'CuongHoang — full-stack developer. This site is the portfolio: the codebase, the content counted straight from its database, how it deploys, and four production incidents with their fixes. CV available as a direct download.';

export const metadata: Metadata = {
  title: 'About',
  alternates: { canonical: 'https://cuongthai.com/about' },
  description: DESCRIPTION,
  openGraph: {
    title: 'About — CuongHoang',
    description: DESCRIPTION,
    url: 'https://cuongthai.com/about',
    type: 'profile',
  },
};

/**
 * JSON-LD `Person` — dữ liệu có cấu trúc cho máy đọc.
 *
 * VÌ SAO: khi ai đó tìm tên này trên Google, công cụ tìm kiếm chỉ thấy một
 * trang HTML và phải tự đoán đây là người, là công ty hay là bài viết. Khối
 * này nói thẳng: đây là một Person, đây là các hồ sơ chính chủ, đây là nghề.
 * Đó cũng là cách gom các tài khoản rời rạc (GitHub, LinkedIn, X) về một danh
 * tính thay vì để chúng trôi nổi riêng lẻ.
 *
 * Đặt ở layout (server component) chứ không ở page: page là client component,
 * và dữ liệu có cấu trúc thì nên nằm sẵn trong HTML đầu tiên máy quét nhận
 * được, không phải chờ JavaScript chạy.
 *
 * ⚠️ Mọi URL dưới đây phải là hồ sơ CÓ THẬT của chủ site — `sameAs` mà trỏ sai
 * người là khai báo danh tính sai, không phải lỗi hiển thị. Danh sách này khớp
 * với phần liên hệ ở Footer.
 */
const PERSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Cuong Hoang',
  alternateName: 'CuongHoang',
  url: 'https://cuongthai.com/about',
  jobTitle: 'Full-Stack Developer',
  email: 'mailto:cuongthaihnhe176322@gmail.com',
  knowsLanguage: ['vi', 'en'],
  knowsAbout: [
    'TypeScript', 'Node.js', 'Express', 'Next.js', 'React',
    'PostgreSQL', 'Prisma', 'Redis', 'Docker', 'Nginx',
    'WebSocket', 'Large Language Models', 'Retrieval-Augmented Generation',
    'Three.js', 'ESP32',
  ],
  sameAs: [
    'https://github.com/cuonghoang1103',
    'https://www.linkedin.com/in/cuong-hoang-843a37258/',
    'https://x.com/Hncuong311',
    'https://www.facebook.com/CuongHoangswit/',
  ],
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://cuongthai.com/about' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        // Nội dung là hằng số do chính repo này viết, không có dữ liệu người
        // dùng đi vào — nên không có đường nào để chèn mã.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_LD) }}
      />
      {children}
    </>
  );
}
