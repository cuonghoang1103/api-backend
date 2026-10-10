'use client';

/** CTW đợt 9 — tab GRADES: khung (9a) chỉ đặt điểm cắm; nội dung là sổ điểm của 9b (slots/GradesSlot.tsx). */

import GradesSlot from '../slots/GradesSlot';
import type { ClassSlotProps } from '../slots/types';

export default function GradesTab(props: ClassSlotProps) {
  return <GradesSlot {...props} />;
}
