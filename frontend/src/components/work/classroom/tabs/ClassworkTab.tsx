'use client';

/**
 * CTW đợt 9 — tab CLASSWORK. Khung (9a) xếp ba phần, mỗi phần một chủ:
 *   1. <AssignmentsSlot/>  bài tập (9b)          — `&a=<id>` mở một bài ⇒ CHỈ hiện phần này
 *   2. <QuizzesSlot/>      quiz trắc nghiệm (9c) — `&q=<id|bank>`      ⇒ CHỈ hiện phần này
 *   3. <MaterialsSection/> tài liệu theo chủ đề/tuần (9a) — `&m=<id>` mở sẵn một mục
 */

import { useSearchParams } from 'next/navigation';
import AssignmentsSlot from '../slots/AssignmentsSlot';
import QuizzesSlot from '../slots/QuizzesSlot';
import type { ClassSlotProps } from '../slots/types';
import MaterialsSection from './MaterialsSection';

export default function ClassworkTab(props: ClassSlotProps) {
  const search = useSearchParams();
  if (search?.get('a')) return <AssignmentsSlot {...props} />;
  if (search?.get('q')) return <QuizzesSlot {...props} />;
  return (
    <div className="space-y-6">
      <AssignmentsSlot {...props} />
      <QuizzesSlot {...props} />
      <MaterialsSection {...props} />
    </div>
  );
}
