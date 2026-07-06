import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const upper = (code || '').toUpperCase();
  return {
    title: `Học ${upper}`,
    description: `Học ${upper}: bảng chữ cái, từ vựng, ngữ pháp, nghe, giao tiếp, đọc và Q&A.`,
  };
}

export default function LanguageCodeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
