import type { Metadata } from 'next';
import ExamPortalClient from './ExamPortalClient';

export const metadata: Metadata = {
  title: 'Phòng thi — Exam Room',
  description: 'Thi thử FE (trắc nghiệm) và PE (code / viết / nói) với đề thật, chấm điểm tự động và AI.',
};

export const dynamic = 'force-dynamic';

export default function ExamPortalPage() {
  return <ExamPortalClient />;
}
