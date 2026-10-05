import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JP — Tiếng Nhật từ 0 đến N1',
  description: 'Học tiếng Nhật từ con số 0 tới N1 theo chuẩn JLPT: bảng chữ, hội thoại, từ vựng, ngữ pháp, chữ Hán, nghe, nói — chấm phát âm và luyện nói với gia sư AI CuongMini.',
  alternates: { canonical: 'https://cuongthai.com/language/ja/jp' },
};

export default function JpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
