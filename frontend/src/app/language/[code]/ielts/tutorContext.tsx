'use client';

import { createContext, useContext } from 'react';

export type TutorAsk = {
  /** Chữ hiện trên bong bóng câu hỏi trong khung gia sư. */
  label: string;
  /** Ý đặt sẵn của backend (giang | huongdan | vidu | kiemtra | nghia | ...). */
  y?: string;
  cauHoi?: string;
  /** Phần đang hỏi — mặc định là tên bài hoặc chữ người học đang bôi đen. */
  chu?: string;
};

/**
 * Những gì một khối bài học cần từ trang: hỏi gia sư, và báo điểm một bài
 * tập vừa làm (để tổng quan buổi + tiến độ đồng bộ giữa laptop và iPad).
 */
export const TutorCtx = createContext<{
  ask: (a: TutorAsk) => void;
  report: (quizId: string, pct: number) => void;
}>({ ask: () => {}, report: () => {} });
export const useTutor = () => useContext(TutorCtx);
