/**
 * Kiểu dữ liệu cho khoá "Tiếng Anh Giao Tiếp".
 *
 * Thiết kế xoay quanh một sự thật: người học nói được KHÔNG phải vì thuộc
 * nhiều từ, mà vì có sẵn CẶP hỏi–đáp trong đầu. Nên đơn vị nhỏ nhất ở đây
 * không phải "từ" mà là `QAPair` — một câu hỏi kèm NHIỀU cách trả lời thật,
 * để người học chọn câu hợp với mình rồi dùng luôn.
 *
 * Mọi câu tiếng Anh đều có `ipa` để đọc đúng ngay từ đầu; sửa phát âm sai
 * sau khi đã quen miệng tốn gấp nhiều lần.
 */

/** Một câu tiếng Anh + nghĩa + phiên âm + ghi chú cách dùng. */
export interface Phrase {
  en: string;
  vi: string;
  /** Phiên âm IPA cho cả câu (hoặc phần trọng âm chính). */
  ipa?: string;
  /** Ghi chú: sắc thái, mức trang trọng, lỗi người Việt hay mắc. */
  note?: string;
}

/** Một câu hỏi kèm các cách trả lời thật dùng được. */
export interface QAPair {
  q: Phrase;
  answers: Phrase[];
}

/** Hội thoại mẫu — đọc để thấy các câu ghép lại thành cuộc nói chuyện. */
export interface Dialogue {
  title: string;
  titleVi: string;
  /** `who` là nhãn ngắn hiện trên bong bóng chat (A/B, Nam/Linh…). */
  lines: { who: string; en: string; vi: string }[];
}

/** Một điểm ngữ pháp — luôn kèm công thức, ví dụ và lỗi hay gặp. */
export interface GrammarPoint {
  title: string;
  /** Giải thích bằng tiếng Việt, ngắn và thẳng vào việc dùng. */
  explain: string;
  formula?: string;
  examples: { en: string; vi: string }[];
  /** Lỗi người Việt hay mắc ở đúng điểm ngữ pháp này. */
  mistake?: string;
}

/** Một âm khó — nhóm theo âm chứ không theo chữ cái. */
export interface SoundDrill {
  /** Ký hiệu IPA, ví dụ /θ/ */
  sound: string;
  /** Cách đặt lưỡi/môi, mô tả bằng tiếng Việt. */
  how: string;
  /** Từ luyện — mỗi từ kèm nghĩa để không luyện vẹt. */
  words: { en: string; ipa: string; vi: string }[];
  /** Câu luyện chứa nhiều lần âm đó. */
  sentence?: { en: string; vi: string };
  /** Âm mà người Việt hay đọc nhầm thành. */
  trap?: string;
}

/** Một từ vựng có ví dụ. */
export interface VocabItem {
  en: string;
  ipa: string;
  vi: string;
  /** Từ loại: n, v, adj, adv, phr… */
  pos?: string;
  ex?: string;
  exVi?: string;
}

/** Một ngày học trong lộ trình 20 ngày. */
export interface DayLesson {
  day: number;
  /** Tiêu đề tiếng Việt — hiện trên thẻ ngày. */
  title: string;
  icon: string;
  /** Mục tiêu: học xong ngày này thì NÓI được cái gì. */
  goal: string;
  /** Cặp hỏi–đáp: phần xương sống, học thuộc là nói được. */
  qa: QAPair[];
  /** Hội thoại ghép các câu trên thành tình huống thật. */
  dialogues: Dialogue[];
  vocab: VocabItem[];
  grammar: GrammarPoint[];
  /** Âm luyện của ngày — rải đều 20 âm khó qua 20 ngày. */
  sound?: SoundDrill;
  /** Việc tự luyện cuối ngày (nói to, ghi âm, viết…). */
  practice: string[];
}

/** Một tuần gom 5 ngày, có chủ đề chung. */
export interface WeekBlock {
  week: number;
  title: string;
  subtitle: string;
  days: DayLesson[];
}
