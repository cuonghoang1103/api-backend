'use client';

// Nút nổi "Quay lại bài thi" — chỉ hiện khi trang được mở từ link "Bài học
// liên quan" của CuongMini (query ?fromExam=<examId>), để không lạc mất bài
// thi đang làm dở khi bấm xem bài học chi tiết.

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ExamReturnBanner() {
  const sp = useSearchParams();
  const examId = sp.get('fromExam');
  if (!examId || !/^\d+$/.test(examId)) return null;

  return (
    <Link href={`/exam/${examId}`}
      className="fixed left-3 top-3 z-[60] flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-white shadow-lg"
      style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)' }}>
      <ArrowLeft className="h-3.5 w-3.5" /> Quay lại bài thi
    </Link>
  );
}
