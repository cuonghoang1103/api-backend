/**
 * ============================================================
 * GIA SƯ BÀI HỌC — một cuộc trò chuyện, hai chỗ hỏi
 * ============================================================
 *
 * Người dùng 15/09/2026: "đang học ở trên nhiều lúc phải lướt xuống dưới để
 * chat và hỏi riêng từng slide … rất là phiền".
 *
 * Nên gia sư giờ có HAI lối vào: mục cuối bài như cũ, và con robot nổi ở góc
 * màn hình. Kho này là thứ nối hai lối đó lại:
 *
 *   • `bai`  — trang học đang mở bài nào. Trang `learn` ghi vào lúc mở, xoá
 *     lúc rời. Robot đọc chỗ này để biết có nên hiện chế độ gia sư hay không.
 *     Không có bài nào ⇒ robot là trợ lý thường, y như trước.
 *
 *   • `cuoc` — hội thoại, xếp theo KHOÁ chứ không theo component. Hỏi ở dưới
 *     bài rồi cuộn lên mở robot là thấy nguyên mạch, hỏi tiếp được ngay. Nếu
 *     mỗi vỏ giữ `useState` riêng thì mở robot ra sẽ là một cuộc TRỐNG, và
 *     người học phải kể lại từ đầu — đúng cái phiền mà việc này sinh ra để bỏ.
 *
 * ⚠️ KHOÁ KHÔNG PHẢI `lessonId` TRẦN. Đề luyện cuối chương (`ChapterQuiz`)
 * dựng gia sư trên CÙNG một `lessonId` nhưng ngữ cảnh khác hẳn (nó biết đề và
 * đáp án từng câu). Chung khoá là hai cuộc trộn vào nhau: học viên hỏi về bài,
 * gia sư trả lời về câu 3 của đề. Xem `khoaGiaSu()`.
 *
 * ⚠️ KHÔNG `persist`. Hội thoại sống theo phiên xem trang. Cất xuống
 * localStorage thì mở lại máy hôm sau vẫn thấy mạch chat cũ giữa chừng của
 * một bài đã học xong — và nó lớn dần vô hạn, mỗi bài một cuộc.
 */

'use client';

import { create } from 'zustand';

export interface LuotGiaSu {
  role: 'user' | 'assistant';
  content: string;
  /** Câu hỏi sinh ra câu trả lời này → để bấm "Bản tiếng Anh" / "Hỏi lại mới". */
  srcQuestion?: string;
  /** `cacheKey` của chip (nếu có) → bản EN dùng lại để cache đúng khoá. */
  srcCacheKey?: string;
  /** Đây LÀ bản tiếng Anh (không mời dịch tiếp). */
  english?: boolean;
  /** Đang gõ dở → hoãn render KaTeX tới khi xong. */
  streaming?: boolean;
  /** Đã xin bản tiếng Anh cho câu này rồi. */
  enDone?: boolean;
  /** Câu trả lời lấy từ cache → gắn nhãn "⚡ có sẵn". */
  cached?: boolean;
  /**
   * Ảnh người học đã dán kèm lượt hỏi này — CHỈ để hiện lại trong bong bóng.
   *
   * ⚠️ KHÔNG bao giờ đi vào phần lịch sử gửi lên (`toMsg` chỉ lấy role +
   * content). Hội thoại được gửi lại TOÀN BỘ ở mỗi lượt, nên một tấm ảnh nằm
   * trong lịch sử là ~1.500 token nhân với mọi câu hỏi còn lại của buổi học.
   */
  anh?: string[];
}

export interface BaiDangHoc {
  lessonId: number;
  /**
   * Slide của bài, đọc từ chính nội dung bài (xem `docSlide.ts`).
   *
   * Có nó thì robot hiện được mục "hỏi theo slide" — người học bấm một cái
   * thay vì chụp màn hình từng tấm rồi dán vào. Bài không có slide thì mảng
   * rỗng và mục đó ẩn hẳn.
   */
  slides?: import('@/components/academy/docSlide').Slide[];
  courseCode?: string;
  courseTitle?: string;
  lessonTitle?: string;
  /** Đường dẫn trang học — robot dùng để mời quay lại đúng chỗ. */
  duongDan?: string;
}

/** Khoá của một cuộc. Đề luyện tách riêng khỏi bài — xem chú thích đầu file. */
export function khoaGiaSu(lessonId: number, trongDe = false): string {
  return `${lessonId}${trongDe ? ':de' : ''}`;
}

interface GiaSuBaiState {
  bai: BaiDangHoc | null;
  datBai: (b: BaiDangHoc | null) => void;

  cuoc: Record<string, LuotGiaSu[]>;
  /** Cập nhật một cuộc. Nhận hàm để mọi chỗ ghi đều thuần và không giẫm nhau. */
  datCuoc: (khoa: string, f: (cu: LuotGiaSu[]) => LuotGiaSu[]) => void;
  xoaCuoc: (khoa: string) => void;
}

export const useGiaSuBaiStore = create<GiaSuBaiState>((set) => ({
  bai: null,
  datBai: (b) => set({ bai: b }),

  cuoc: {},
  datCuoc: (khoa, f) => set((s) => ({ cuoc: { ...s.cuoc, [khoa]: f(s.cuoc[khoa] ?? []) } })),
  xoaCuoc: (khoa) => set((s) => {
    /* Xoá HẲN khoá thay vì gán mảng rỗng: mỗi bài đã xem để lại một khoá, học
       một buổi là vài chục khoá rỗng nằm lại trong bộ nhớ. */
    if (!(khoa in s.cuoc)) return s;
    const con = { ...s.cuoc };
    delete con[khoa];
    return { cuoc: con };
  }),
}));
