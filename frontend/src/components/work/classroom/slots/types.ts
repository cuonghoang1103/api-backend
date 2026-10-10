/**
 * CTW đợt 9 — HỢP ĐỒNG ĐIỂM CẮM của trang lớp (khung do 9a sở hữu: `ClassShell.tsx`).
 *
 * Trang lớp: `/work/classes?id=<lớp>&tab=<tab>` — tab ỔN ĐỊNH: stream · classwork · people · grades · calendar.
 *   stream     9a  Bảng tin (thông báo GV + dòng tự động của bài tập/quiz/tài liệu — backend `postStreamItem()`)
 *   classwork  9a  Tài liệu theo chủ đề/tuần  +  <AssignmentsSlot/> (9b)  +  <QuizzesSlot/> (9c)
 *   people     9a  mã lớp, nhóm, danh sách sinh viên (đợt 5)
 *   grades     9b  <GradesSlot/>
 *   calendar   9a  buổi học định kỳ + điểm danh + hạn bài (backend `addCalendarItem()` của 9b/9c)
 *
 * 9b/9c CHỈ thay nội dung tệp slot của mình (`slots/AssignmentsSlot.tsx`, `slots/QuizzesSlot.tsx`, `slots/GradesSlot.tsx`)
 * — giữ nguyên tên export default + kiểu props dưới đây. Tham số URL phụ của slot: dùng tiền tố riêng (`a=` cho bài tập,
 * `q=` cho quiz) để không đụng `id`/`tab`/`checkin` của khung.
 */

import type { ClassDetail } from '@/components/work/teaching/teachingApi';

export const CLASS_TABS = ['stream', 'classwork', 'people', 'grades', 'calendar'] as const;
export type ClassTab = (typeof CLASS_TABS)[number];

export interface ClassSlotProps {
  /** Chi tiết lớp (GET /classes/:id). `cls.manage` = OWNER/TEACHER; `cls.role` = OWNER | TEACHER | STUDENT. */
  cls: ClassDetail;
  /** Mở tab khác của cùng lớp (vd. từ dòng Stream sang Classwork) — `extra` là tham số URL phụ. */
  goTab: (tab: ClassTab, extra?: Record<string, string>) => void;
}
