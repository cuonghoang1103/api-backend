'use client';

/** /work/hoc-tap/mon/:id — một môn (việc theo tuần, tỷ lệ trượt, trình độ) trong khung CT Work. Dùng lại TrangMon của /hoc-tap. */

import { useParams } from 'next/navigation';
import TrangMon from '@/components/hoc-tap/TrangMon';

export default function WorkHocTapMonRoute() {
  const p = useParams<{ id: string }>();
  const id = Number(p?.id);
  if (!Number.isInteger(id) || id <= 0) return <p className="p-8 text-center text-sm text-text-muted">Không tìm thấy môn.</p>;
  return <TrangMon id={id} nhung />;
}
