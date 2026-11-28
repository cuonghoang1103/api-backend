import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '1000 câu nền tiếng Anh — dịch 2 chiều Việt ↔ Anh trong 30 ngày',
  description: '30 ngày, hơn 1000 câu tiếng Anh nền tảng cho người mất gốc: mỗi ngày một khung câu, nghe và nhắc lại, dịch Việt → Anh (ghép, gõ, nói), Anh → Việt, viết tay, ôn lặp ngắt quãng, kiểm tra cuối ngày.',
  alternates: { canonical: 'https://cuongthai.com/language/en/cau-nen' },
};

export default function CauNenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
