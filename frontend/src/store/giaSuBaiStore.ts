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
  /**
   * Ngữ cảnh người học GHIM vào lượt hỏi này (một đoạn video / một slide) — CHỈ để hiện thành chip trong bong bóng.
   * Câu hỏi gửi đi đã tự mang đủ mốc/số slide trong chữ, nên lịch sử gửi lên vẫn chỉ là `content`.
   */
  nguCanh?: NguCanhHoi;
}

/**
 * Thứ người học bấm "Hỏi phần này" / "Hỏi đoạn đang xem" / "Hỏi slide này" — ghim vào ô nhập thành một chip gọn
 * (không phải một bức tường chữ). Lượt hỏi kế tiếp mang nó theo rồi nó tự gỡ.
 */
export type NguCanhHoi =
  | {
    loai: 'doan';
    /** Mốc + tên chương. Máy chủ tự cắt phụ đề trong đoạn — client không gửi chữ. */
    doan: { tu: number; den: number; ten?: string };
    /** Đoạn lấy đúng theo một chương của mục lục ⇒ chip hỏi nhanh được cache dùng chung. */
    theoMucLuc?: boolean;
  }
  | { loai: 'slide'; slide: import('@/components/academy/docSlide').Slide };

/**
 * Video ĐANG PHÁT trên trang học — trang `learn` công bố, gia sư (cả mục cuối bài lẫn con robot) đọc để gửi kèm
 * phụ đề + giây đang xem. Hàm đi qua kho (không phải số giây) để không ai phải re-render mỗi giây video chạy.
 */
export interface VideoDangHoc {
  lessonId: number;
  track: 'VI' | 'EN' | 'YT';
  /** Video có phụ đề máy chủ đọc được — không có thì gia sư KHÔNG bật chế độ video (khỏi lời dặn "chưa nghe được"). */
  coPhuDe: boolean;
  thoiLuong?: number | null;
  parts: { t: number; den?: number; ten: string }[];
  layGiay: () => number | null;
  tua: (giay: number) => void;
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

  video: VideoDangHoc | null;
  datVideo: (v: VideoDangHoc | null) => void;

  /** Chip ngữ cảnh đang ghim, theo KHOÁ cuộc (`khoaGiaSu`). */
  ghim: Record<string, NguCanhHoi | undefined>;
  datGhim: (khoa: string, g: NguCanhHoi | null) => void;

  /**
   * Yêu cầu MỞ gia sư (bấm "Hỏi phần này", phím tắt…). Bộ đếm tăng dần — nơi nghe so với số đã thấy, nên bấm hai lần
   * cùng một chương vẫn mở lại được. `robotSan`: nút trợ lý nổi đang hiện ⇒ mở khung robot; không (người dùng ẩn
   * trợ lý) ⇒ mục gia sư cuối bài tự cuộn tới.
   */
  moYeuCau: number;
  yeuCauMo: () => void;
  robotSan: boolean;
  datRobotSan: (v: boolean) => void;

  /**
   * Câu hỏi CHỜ bắn ("Tóm tắt video" ở mục lục): nút ở ngoài không giữ hook gia sư, nên đặt câu vào đây và vỏ gia sư
   * đang nhận (`nhanCauCho` — robot nếu nút nổi đang hiện, không thì mục cuối bài) lấy ra MỘT LẦN (`layCauCho` xoá ngay
   * khi lấy, nên hai vỏ cùng mở cũng không bắn đôi — mỗi lượt là tiền).
   */
  cauCho: { lessonId: number; cau: string; cacheKey?: string } | null;
  datCauCho: (c: { lessonId: number; cau: string; cacheKey?: string } | null) => void;
  layCauCho: (lessonId: number) => { lessonId: number; cau: string; cacheKey?: string } | null;

  cuoc: Record<string, LuotGiaSu[]>;
  /** Cập nhật một cuộc. Nhận hàm để mọi chỗ ghi đều thuần và không giẫm nhau. */
  datCuoc: (khoa: string, f: (cu: LuotGiaSu[]) => LuotGiaSu[]) => void;
  xoaCuoc: (khoa: string) => void;
}

export const useGiaSuBaiStore = create<GiaSuBaiState>((set, get) => ({
  bai: null,
  datBai: (b) => set({ bai: b }),

  video: null,
  datVideo: (v) => set({ video: v }),

  ghim: {},
  datGhim: (khoa, g) => set((s) => {
    if (!g && !(khoa in s.ghim)) return s;
    const con = { ...s.ghim };
    if (g) con[khoa] = g; else delete con[khoa];
    return { ghim: con };
  }),

  moYeuCau: 0,
  yeuCauMo: () => set((s) => ({ moYeuCau: s.moYeuCau + 1 })),
  robotSan: false,
  datRobotSan: (v) => set((s) => (s.robotSan === v ? s : { robotSan: v })),

  cauCho: null,
  datCauCho: (c) => set({ cauCho: c }),
  layCauCho: (lessonId) => {
    const c = get().cauCho;
    if (!c || c.lessonId !== lessonId) return null;
    set({ cauCho: null });
    return c;
  },

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

/** Mục gia sư cuối bài — đích cuộn tới khi không có nút trợ lý nổi (người dùng đã ẩn nó). */
export const ID_GIA_SU_CUOI_BAI = 'gia-su-bai';

/**
 * Mở gia sư của một bài, tuỳ chọn ghim sẵn một ngữ cảnh (đoạn video / slide). Một lối cho mọi nút "Hỏi …":
 * nút trợ lý nổi đang hiện ⇒ mở khung robot; không ⇒ cuộn tới mục gia sư cuối bài (nó tự đặt con trỏ vào ô nhập).
 */
export function moGiaSuBai(lessonId: number, nguCanh?: NguCanhHoi | null): void {
  const s = useGiaSuBaiStore.getState();
  if (nguCanh) s.datGhim(khoaGiaSu(lessonId), nguCanh);
  s.yeuCauMo();
}
