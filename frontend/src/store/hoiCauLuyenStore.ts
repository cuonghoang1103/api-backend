/**
 * ============================================================
 * HỎI AI TỪNG CÂU KHI LUYỆN CHƯƠNG — một cuộc, hai chỗ hỏi
 * ============================================================
 *
 * Người dùng 22/09/2026: "thêm tính năng AI hỏi chuyên sâu từng câu quiz …
 * khi vào quiz sẽ có icon AI kia (con robot) ấn vào sẽ hiện all câu hỏi tự
 * chọn như slide giảng dạy chi tiết … ấn vào câu đó và để AI hướng dẫn làm".
 *
 * Nên gia sư của đề luyện chương có HAI lối vào, giống hệt gia sư bài học:
 *   • nút robot ngay trên từng câu (trong `ChapterQuiz`);
 *   • con robot nổi ở góc màn hình (`GiaSuTrongRobot` đổi sang thẻ "Câu đang
 *     luyện" khi có một phiên luyện đang mở).
 *
 * Kho này nối hai lối đó:
 *   • `cuoc`  — hội thoại xếp theo `ExamQuestion.id`, KHÔNG theo số câu trên
 *     màn hình: bộ "10 câu ngẫu nhiên" đánh số lại từ 1 mỗi lần, nên "Câu 3"
 *     của lượt này và lượt sau là hai câu khác nhau.
 *   • `phien` — phiên luyện đang mở: danh sách câu + câu đang xem + hàm nhảy
 *     câu. Robot nổi đọc chỗ này để biết có đang luyện không và đang ở câu nào.
 *   • `dangHoi` — câu đang chờ AI. MỘT lượt một lúc cho cả trang: hai lối vào
 *     cùng bấm thì chỉ một lượt đi, mà mỗi lượt là một lần tính tiền.
 *
 * ⚠️ KHÔNG `persist` — cùng lý do với `giaSuBaiStore`: hội thoại sống theo
 * phiên xem trang, cất xuống localStorage thì nó lớn dần vô hạn.
 */

'use client';

import { create } from 'zustand';

export interface LuotAI {
  role: 'user' | 'assistant';
  content: string;
  /** Đang gõ dở → hoãn render KaTeX tới khi xong. */
  streaming?: boolean;
  /** Câu trả lời lấy từ cache (bình luận CuongMini đã có) → nhãn "⚡ có sẵn". */
  cached?: boolean;
}

export type TrangThaiCau = 'chua' | 'dung' | 'sai';

/** Một câu trong phiên — đủ để vẽ danh sách "Hỏi theo câu". */
export interface CauTomTat {
  /** `ExamQuestion.id` — khoá của hội thoại và của route hỏi AI. */
  id: number;
  /** Số câu người học đang thấy trên màn hình (1, 2, 3…). */
  soThuTu: number;
  /** Đề rút gọn, chữ thuần, một dòng. */
  tomTat: string;
  trangThai: TrangThaiCau;
}

export interface PhienLuyen {
  /** Định danh của khối `ChapterQuiz` đang giữ phiên — một trang có thể có hai. */
  khoa: string;
  /** "Chương 1 — Fundamentals of testing" */
  tieuDe: string;
  dsCau: CauTomTat[];
  /** Vị trí câu đang xem trong `dsCau`. */
  idx: number;
  /** Nhảy khối luyện tới câu thứ `i` (theo vị trí trong `dsCau`). */
  chonCau: (i: number) => void;
}

interface HoiCauLuyenState {
  cuoc: Record<number, LuotAI[]>;
  datCuoc: (qid: number, f: (cu: LuotAI[]) => LuotAI[]) => void;

  dangHoi: number | null;
  datDangHoi: (qid: number | null) => void;

  phien: PhienLuyen | null;
  datPhien: (p: PhienLuyen | null) => void;
  /** Chỉ xoá nếu phiên đang giữ ĐÚNG là của khối này — xem chú thích trong hàm. */
  boPhien: (khoa: string) => void;
}

export const useHoiCauLuyenStore = create<HoiCauLuyenState>((set) => ({
  cuoc: {},
  datCuoc: (qid, f) => set((s) => ({ cuoc: { ...s.cuoc, [qid]: f(s.cuoc[qid] ?? []) } })),

  dangHoi: null,
  datDangHoi: (qid) => set({ dangHoi: qid }),

  phien: null,
  datPhien: (p) => set({ phien: p }),
  /* Hai khối luyện trên cùng một trang (đầu trang quiz + trong Lộ trình học)
     có thể thay nhau mở. Khối cũ đóng SAU khi khối mới đã ghi phiên của nó —
     xoá vô điều kiện là robot mất phiên đúng lúc vừa có. */
  boPhien: (khoa) => set((s) => (s.phien?.khoa === khoa ? { phien: null } : s)),
}));
