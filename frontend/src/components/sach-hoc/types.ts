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
  /** Bảng chữ. `doc` (tuỳ chọn): chữ máy đọc thay cho `l` — khoá CH: ô "bā" đọc 八 (pinyin Latin không đọc trực tiếp được). */
  | { t: 'alphabet'; groups: { sound: string; letters: { l: string; ipa: string; doc?: string }[] }[] }
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
  | {
      t: 'listen'; id: string; title: string; note?: string; lines: { who?: string; voice?: Voice; text: string; ro?: string; vi?: string }[];
      /**
       * Lời dẫn kiểu băng đề IELTS (nghe.ts). `so`: nhãn bài, vd "Day 3, Recording 1";
       * `boiCanh`: câu tiếng Anh "a talk about…"; `cau`: [từ, đến] câu hỏi đi kèm.
       * Thiếu `dan` thì bài phát thẳng như cũ.
       */
      dan?: { so: string; boiCanh?: string; cau?: [number, number] };
    }
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
   * Tập viết tay (Apple Pencil / chuột): mỗi mục một hàng — ô mẫu chạy thứ tự
   * nét (KanjiVG) + ô luyện, rồi ✨ AI xem chữ (POST /ielts/ai/xem-chu-viet).
   *
   * Mục `chars` là MỘT chữ (`'あ'`, `'学'`) ⇒ hàng cũ: ô mẫu + ba ô tập cùng chữ.
   * Mục là một TỪ nhiều chữ (`'がくせい'`, `'学生'`) ⇒ hàng từ: mẫu cả từ (chạy
   * nét lần lượt từng chữ) + lưới tập, dòng trên có chữ mờ để tô, dòng dưới tự viết.
   * Trộn được hai loại trong một khối. `goi` (tuỳ chọn): gợi ý theo mục — nghĩa /
   * cách đọc, vd `{ '学生': 'がくせい · học sinh' }`; bật "Che mẫu" thì người học
   * chỉ thấy gợi ý + 🔊 và phải tự nhớ ra từ.
   */
  | { t: 'write'; id: string; title: string; chars: string[]; note?: string; goi?: Record<string, string> }
  /**
   * Thẻ "Chữ Hán của lớp" như slide của cô: chữ to, Hán Việt, On/Kun, cách nhớ,
   * từ đi chung — chữ lấy theo danh sách lớp của bài `bai` (dữ liệu tải chậm qua
   * `course.kanji()`); chạm vào thẻ mở thẻ chi tiết (KanjiSheet).
   */
  | { t: 'hanlop'; bai: number }
  /** Công cụ chia động từ & tính từ tiếng Nhật (bảng quy tắc + ô tra nhanh + bài tập) — nhat/ChiaDongTu.tsx. */
  | { t: 'chia' }
  /** Ôn tập bằng thẻ — 8 cách ôn kiểu Quizlet trên từ vựng/chữ Hán/ngữ pháp cả khoá Dekiru — nhat/OnTapThe.tsx. */
  | { t: 'onthe' };

/** `dan` = người dẫn bài nghe (giới thiệu, đánh số câu) — giọng riêng, khác mọi nhân vật. */
export type Voice = 'uk-nu' | 'uk-nam' | 'us-nu' | 'us-nam' | 'ja-nu' | 'ja-nam' | 'zh-nu' | 'zh-nam' | 'dan';
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

/**
 * Một video bài giảng gắn với một bài (CourseDef.videos). Hai loại:
 * - YouTube: `id` = videoId 11 ký tự (iframe youtube-nocookie / trình phát của app).
 * - mp4 tự làm trên R2: có `src` (https://media.cuongthai.com/...) ⇒ thẻ `<video>`;
 *   `id` lúc đó chỉ là khoá ổn định (vd "jp-b6-p1"), không phải videoId.
 */
export type LessonVideo = {
  /** YouTube: videoId 11 ký tự. Video mp4 (`src`): khoá ổn định bất kỳ. */
  id: string;
  /** mp4 trên R2 — có trường này thì phát bằng `<video>`, KHÔNG đi YouTube. */
  src?: string;
  /** Ảnh bìa của video mp4 (tuỳ chọn). */
  poster?: string;
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

/**
 * Một video gắn vào MỘT MỤC của bài (CourseDef.videoNeo) — video mp4 tự làm.
 * Dữ liệu sinh tự động (vd. dekiru/videos.ts do `xuat/gan-sach.mts` ghi).
 */
export type VideoMuc = {
  /** https://media.cuongthai.com/... (mp4 H.264 faststart). */
  src: string;
  tieuDe: string;
  thoiLuongGiay?: number;
  poster?: string;
  /** Mã video ổn định (vd "jp-b6-p1") — khoá React + nhớ vị trí xem. Thiếu thì dùng `src`. */
  id?: string;
  /** Một câu: video nói gì / xem xong thì làm khối nào. */
  ghiChu?: string;
};

/**
 * Bản đồ video theo MỤC: `{ [lessonId]: { [neo]: VideoMuc[] } }`.
 *
 * `lessonId` = id bài (đúng `?bai=…`, vd `b6-ngu-phap`). `neo`:
 * - `'dau-bai'` — đầu bài (ngay dưới "Mục tiêu").
 * - `'#<đầu tiêu đề>'` — ngay dưới khối `h` đầu tiên có chữ BẮT ĐẦU bằng phần sau `#`
 *   (so sau khi bỏ furigana `{漢字|かな}`→漢字 và dấu `** == ~~`, chuẩn NFKC):
 *   `'#ポイント 48'` khớp "ポイント 48 — V ませんか…" nhưng KHÔNG khớp "ポイント 480";
 *   `'#2. Bảng 46 chữ'`, `'#Thể て'`, `'#F.'`.
 * Neo không khớp tiêu đề nào ⇒ video vẫn hiện ở đầu bài (không bao giờ mất).
 */
export type VideoNeoMap = Record<string, Record<string, VideoMuc[]>>;

