import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CH — Tiếng Trung từ 0 đến HSK 6',
  description: 'Học tiếng Trung phổ thông từ con số 0 theo chuẩn HSK: pinyin, thanh điệu, hội thoại, từ vựng, ngữ pháp, chữ Hán (xem nét, tập viết), nghe, nói — chấm phát âm và luyện nói với gia sư AI CuongMini.',
  alternates: { canonical: 'https://cuongthai.com/language/zh/ch' },
};

export default function ChLayout({ children }: { children: React.ReactNode }) {
  return children;
}
