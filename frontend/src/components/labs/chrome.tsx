'use client';
/**
 * Khung mô phỏng (Frame trong os-lab/ui.tsx) hỏi LabShell qua context này: thêm thanh công cụ (nút hướng dẫn, gợi ý
 * "bạn đang xem gì", nút âm thanh) dưới tiêu đề, và lớp phủ tô sáng + thẻ hướng dẫn ở cuối khung. Không có shell
 * (mô phỏng dùng ở chỗ khác) ⇒ khung y như cũ.
 */
import { createContext, useContext, type ReactNode, type RefObject } from 'react';

export interface LabChrome {
  toolbar?: ReactNode;
  overlay?: ReactNode;
  icon?: ReactNode;
  rootRef?: RefObject<HTMLDivElement>;
  /** đang chạy tour ⇒ khung giữ chỗ cho thẻ hướng dẫn */
  touring?: boolean;
}
export const LabChromeContext = createContext<LabChrome | null>(null);
export const useLabChrome = () => useContext(LabChromeContext);
