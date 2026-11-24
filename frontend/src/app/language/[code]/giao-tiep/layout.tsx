import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tiếng Anh giao tiếp — 30 ngày từ A2 lên B2',
  description: 'Tiếng Anh giao tiếp 30 ngày: hội thoại đời sống, công sở, đi lại, sức khoẻ, video call, kết bạn, đón khách, phàn nàn, kể chuyện — nghe nhiều giọng, mẫu câu, phát âm, nhập vai, viết tin nhắn/email.',
  alternates: { canonical: 'https://cuongthai.com/language/en/giao-tiep' },
};

export default function GiaoTiepLayout({ children }: { children: React.ReactNode }) {
  return children;
}
