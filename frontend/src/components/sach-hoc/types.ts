/**
 * Kiểu dữ liệu của một khoá học kiểu "sách" (IELTS, tiếng Nhật Dekiru…).
 * Nội dung mỗi khoá nằm cạnh route của nó (vd. app/language/[code]/ielts/),
 * còn bộ khung hiển thị dùng chung ở thư mục này.
 *
 * Chữ trong `text`/`q`/`vi`… hiểu một cú pháp nhỏ (xem Inline trong Blocks.tsx):
 * `**đậm**` · `==dạ quang==` · `~~câu sai~~` · `{漢字|かんじ}` → chữ có furigana.
 */
/** Câu ví dụ: `en` = câu ngoại ngữ (tiếng Anh HOẶC tiếng Nhật), `ro` = romaji (khoá tiếng Nhật). */
export type Ex = { en: string; vi: string; ro?: string };

export type Block =
  | { t: 'h'; text: string }
  | { t: 'p'; text: string }
  | { t: 'patterns'; rows: { formula: string; vi: string; examples: Ex[] }[] }
  | { t: 'table'; head: string[]; rows: string[][]; caption?: string }
  | { t: 'note'; title: string; items: string[] }
  | { t: 'examples'; items: Ex[] }
  /** Từ vựng. Khoá tiếng Nhật: `ipa` = romaji của từ, `exRo` = romaji của câu ví dụ. */
  /**
   * `more` (tuỳ chọn): một dòng mở rộng dưới ví dụ — cụm từ hay đi kèm
   * (collocation), họ từ, lỗi hay gặp. Viết gọn, có thể dùng markup Inline.
   * Khối có nút "Che nghĩa / Che từ" để tự kiểm tra (không cần khai gì thêm).
   */
  | { t: 'vocab'; items: { w: string; pos: string; ipa: string; vi: string; ex: string; exVi: string; exRo?: string; more?: string }[] }
  /**
   * Tóm tắt đầu bài / đầu buổi: 3–6 ý "hôm nay học gì, cần nhớ gì" — khung 🎯
   * nổi bật ở ngay đầu bài. `title` mặc định "Tóm tắt nhanh".
   */
  | { t: 'recap'; title?: string; items: string[] }
  /**
   * "Công thức 1 dòng" — chốt cuối mỗi điểm ngữ pháp: một dòng công thức (tô
   * màu S/V/O… như `patterns`) + một câu tiếng Việt nói nó dùng khi nào.
   */
  | { t: 'rule'; formula: string; vi?: string }
  /** Tra cứu toàn bộ từ vựng của khoá (lấy từ mục lục các buổi): tìm, lọc theo buổi, thẻ nhớ. */
  | { t: 'vocabAll' }
  | { t: 'alphabet'; groups: { sound: string; letters: { l: string; ipa: string }[] }[] }
  | { t: 'dictation'; id: string; title?: string; items: { label: string; spell: string; answer: string }[] }
  | {
      t: 'quiz'; id: string; title: string; kind: 'fill' | 'translate';
      /** Cấu trúc ngữ pháp dùng cho cả bài — hiện trong ô 💡 Gợi ý của từng câu. */
      grammar?: string;
      items: { q: string; answers: string[]; hint?: string }[];
    }
  | { t: 'mcq'; id: string; title: string; items: { q: string; options: string[]; correct: number; why: string }[] }
  /* ── Khối cho các kỹ năng (Blocks2.tsx) ── */
  /** Bài đọc: đoạn có nhãn A, B, C… như đề Reading thật. */
  | { t: 'passage'; title: string; intro?: string; paras: { label?: string; text: string }[] }
  /** Bài nghe: file giọng Anh (máy chủ sinh), lời thoại ẩn cho tới khi người học muốn xem. */
  | { t: 'listen'; id: string; title: string; note?: string; lines: { who?: string; voice?: Voice; text: string; ro?: string; vi?: string }[] }
  /** Hội thoại mẫu có nhân vật (Speaking): mỗi dòng một người, bấm nghe từng câu hoặc cả bài. */
  | { t: 'dialogue'; title?: string; lines: { who: string; role: Role; text: string; vi?: string; ro?: string }[] }
  /** Ô viết bài + AI chấm theo 4 tiêu chí (POST /ielts/ai/cham-viet). */
  | { t: 'essay'; id: string; task: 'Task 1' | 'Task 2'; prompt: string; minWords: number; tips?: string[] }
  /** Biểu đồ cho Writing Task 1 (vẽ SVG, không dùng ảnh). */
  | { t: 'chart'; kind: 'line' | 'bar'; title: string; unit?: string; labels: string[]; series: { name: string; values: number[] }[] }
  /** Luyện nói: nghe câu hỏi → ghi âm → nghe lại → AI chấm (POST /ielts/ai/cham-noi). */
  | { t: 'speak'; id: string; part: '1' | '2' | '3'; questions: string[] }
  /** Luyện phát âm: đọc câu cho sẵn, Azure chấm từng từ/từng âm. `ipa` mỗi từ một cụm, cách nhau dấu cách. */
  | { t: 'phatam'; id: string; title?: string; note?: string; items: { text: string; ipa: string; vi?: string }[] }
  /**
   * Ghép câu: cho nghĩa tiếng Việt + các mảnh từ đã xáo, người học bấm theo
   * đúng thứ tự để dựng câu. `answer` là thứ tự đúng (có thể nhiều cách đúng
   * qua `alt`); `chips` = các mảnh (đúng + vài mảnh gây nhiễu nếu muốn).
   */
  /**
   * Đọc chữ Hán KHÔNG furigana (như đề thi): câu viết `{漢字|かな}` nhưng hiện
   * chữ trần; người học tự đọc to → bấm hiện cách đọc + nghe → tự chấm.
   */
  | { t: 'readkanji'; id: string; title: string; note?: string; items: { text: string; ro: string; vi: string }[] }
  | { t: 'build'; id: string; title: string; items: { vi: string; chips: string[]; answer: string[]; alt?: string[][]; ro?: string }[] }
  /**
   * Tập viết tay (Apple Pencil / chuột): mỗi chữ một hàng — ô mẫu chạy thứ tự
   * nét (KanjiVG) + ba ô luyện, rồi ✨ AI xem chữ (POST /ielts/ai/xem-chu-viet).
   */
  | { t: 'write'; id: string; title: string; chars: string[]; note?: string }
  /**
   * Thẻ "Chữ Hán của lớp" như slide của cô: chữ to, Hán Việt, On/Kun, cách nhớ,
   * từ đi chung — chữ lấy theo danh sách lớp của bài `bai` (dữ liệu tải chậm qua
   * `course.kanji()`); chạm vào thẻ mở thẻ chi tiết (KanjiSheet).
   */
  | { t: 'hanlop'; bai: number }
  /** Công cụ chia động từ & tính từ tiếng Nhật (bảng quy tắc + ô tra nhanh + bài tập) — nhat/ChiaDongTu.tsx. */
  | { t: 'chia' };

export type Voice = 'uk-nu' | 'uk-nam' | 'us-nu' | 'us-nam' | 'ja-nu' | 'ja-nam';
/** Nhân vật trong hội thoại — mỗi vai một hình và một giọng cố định. */
export type Role = 'examiner' | 'candidate' | 'a' | 'b' | 'c';

/**
 * Loại bài. Tám loại đầu dùng chung; `conversation` (hội thoại theo tình huống),
 * `kanji` (chữ Hán), `kana` (bảng chữ cái Nhật) và `review` (ôn tập) cho khoá
 * tiếng Nhật.
 */
export type Kind =
  | 'intro' | 'grammar' | 'vocab' | 'listening' | 'reading' | 'writing' | 'speaking' | 'homework'
  | 'conversation' | 'kanji' | 'kana' | 'review';

export type Lesson = {
  id: string;
  kind: Kind;
  title: string;
  /** Một câu: học xong bài này thì làm được gì. */
  goal: string;
  minutes: number;
  blocks?: Block[];
  /**
   * Chỉ có ở mục lục (manifest.ts sinh tự động): bài đã soạn nhưng nội dung
   * chưa tải. Không có thì "đã soạn" = có blocks. Đọc qua `isReady()`.
   */
  ready?: boolean;
};

export type Day = { n: number; lessons: Lesson[] };

/** Một video bài giảng YouTube gắn với một bài (CourseDef.videos). */
export type LessonVideo = {
  /** videoId 11 ký tự. */
  id: string;
  /** Đúng `author_name — title` mà oEmbed trả về (scripts/yt-check.mjs). */
  credit: string;
  /** Thời lượng hiển thị, vd "12:30". */
  dur: string;
  lang: 'en' | 'vi';
  /** Một câu tiếng Việt: video nói gì, xem đoạn nào. */
  note: string;
  /** Giây bắt đầu (tuỳ chọn). */
  start?: number;
};

