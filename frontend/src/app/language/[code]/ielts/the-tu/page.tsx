'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import TheTu from './TheTu';

/** Flashcard IELTS 100 từ/ngày — chỉ có ở mục Tiếng Anh. */
export default function TheTuPage() {
  const code = String(useParams().code);
  if (code !== 'en') {
    return (
      <div style={{ maxWidth: 560, margin: '96px auto', padding: 16, textAlign: 'center' }}>
        Flashcard IELTS chỉ có ở mục Tiếng Anh. <Link href="/language/en/ielts/the-tu" style={{ fontWeight: 600 }}>Mở Flashcards</Link>
      </div>
    );
  }
  return <TheTu />;
}
