/**
 * Kiểu dữ liệu cho phần NỘI DUNG HỌC của khoá IELTS (tách khỏi `roadmap.ts`,
 * file đó chỉ mô tả lộ trình 4 chặng).
 *
 * Nguyên tắc soạn, áp cho cả bốn chặng band về sau:
 *
 *  1. **Không chép đề Cambridge / British Council.** Mọi bài đọc, transcript
 *     nghe, đề viết ở đây đều TỰ VIẾT theo đúng DẠNG đề. Chép đề thật là vi
 *     phạm bản quyền; mà tự viết còn cho phép giải thích tường tận từng đáp
 *     án — thứ đề thật không có.
 *
 *  2. **Mỗi câu hỏi phải có lời giải thích vì sao đúng VÀ vì sao các phương
 *     án kia sai.** Người học sai mà chỉ được xem đáp án thì lần sau sai lại
 *     y hệt.
 *
 *  3. **Bài nghe dùng transcript tự viết + giọng đọc của trình duyệt** thay
 *     vì nhúng video có sẵn. Lý do: nhúng video thì không thể tự viết câu hỏi
 *     bám đúng nội dung (phải bịa), lại còn chết link theo thời gian. Video
 *     nhúng vẫn có, nhưng nằm ở mục "nguồn nghe mở rộng" và mọi ID đều đã
 *     kiểm bằng oembed trước khi đưa vào — xem `listening.ts`.
 */

/* ─────────────────────────  TỪ VỰNG  ───────────────────────── */

export interface VocabWord {
  en: string;
  ipa: string;
  vi: string;
  /** Từ loại: n, v, adj, adv, prep, phr… */
  pos?: string;
  /** Câu ví dụ — bắt buộc, vì học từ trơ không dùng được khi viết. */
  ex: string;
  exVi: string;
}

export interface VocabTopic {
  id: string;
  title: string;
  icon: string;
  /** Vì sao chủ đề này cần cho IELTS ở chặng đang xét. */
  why: string;
  words: VocabWord[];
}

/* ─────────────────────────  BÀI HỌC  ───────────────────────── */

/** Một điểm ngữ pháp trong bài học. */
export interface GrammarBlock {
  /** Công thức viết gọn, ví dụ: "S + am/is/are + N/Adj". */
  formula?: string;
  /** Giảng bằng tiếng Việt, thẳng vào cách dùng chứ không định nghĩa hàn lâm. */
  explain: string;
  examples: { en: string; vi: string }[];
  /** Lỗi người Việt hay mắc ở đúng điểm này — phần đáng giá nhất của bài. */
  mistake?: { wrong: string; right: string; why: string };
}

/** Một bài học nhỏ. 40 bài của chặng 1 chia thành 8 chủ điểm. */
export interface Lesson {
  id: string;
  /** Số thứ tự 1–40, hiện trên thẻ bài. */
  n: number;
  title: string;
  /** Học xong bài này thì LÀM ĐƯỢC gì — viết bằng động từ, không nói chung chung. */
  goal: string;
  /** Phần giảng chính. */
  blocks: GrammarBlock[];
  /** Từ/cụm cần thuộc ngay trong bài. */
  keyWords?: { en: string; ipa: string; vi: string }[];
  /** Việc tự làm sau bài — phải kiểm được, không phải "ôn lại bài". */
  practice: string[];
}

export interface LessonUnit {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  lessons: Lesson[];
}

/* ─────────────────────────  BÀI TẬP  ───────────────────────── */

/**
 * Năm dạng bài tập, xếp theo mức khó tăng dần.
 *
 * `fix` (sửa lỗi) là dạng quan trọng nhất và cố ý chiếm tỉ lệ cao: người học
 * NHẬN RA lỗi trong câu người khác dễ hơn nhiều so với nhận ra lỗi trong câu
 * mình vừa viết, mà nhận ra được rồi thì mới tự soát bài được. `translate`
 * (dịch Việt → Anh) đặt cuối vì nó bắt bật ra câu từ con số 0 — đúng thứ phải
 * làm khi nói và viết thật.
 */
export type ExerciseKind = 'choice' | 'gap' | 'fix' | 'order' | 'translate';

export interface Exercise {
  kind: ExerciseKind;
  /** Đề bài. Với `order` là các từ đã xáo trộn, ngăn bằng " / ". */
  q: string;
  /** Gợi ý tiếng Việt — với `translate` chính là câu cần dịch. */
  hint?: string;
  /** Chỉ dạng `choice`. */
  options?: string[];
  answer: string;
  /** Cách viết khác cũng được tính đúng. Khai tường minh, không đoán. */
  alt?: string[];
  /** Vì sao đáp án đúng — luôn nối về điểm ngữ pháp của bài. */
  why: string;
}

/** Bộ bài tập gắn với MỘT bài học, hiện ngay dưới bài đó. */
export interface ExerciseSet {
  lessonId: string;
  items: Exercise[];
}

/* ─────────────────────  DẠNG CÂU HỎI (chặng 2)  ───────────────────── */

/**
 * Hướng dẫn từng DẠNG câu hỏi của đề thi thật.
 *
 * Đây là phần lõi của chặng 2, đúng theo `keyFocus` trong lộ trình: không biết
 * dạng thì làm bao nhiêu đề cũng sai y như cũ, vì mỗi dạng có cách làm và bẫy
 * riêng. Người học chặng 2 nên đọc hết một lượt rồi mỗi tuần luyện kỹ MỘT dạng.
 */
export interface QuestionTypeGuide {
  id: string;
  skill: 'Nghe' | 'Đọc';
  /** Tên tiếng Anh — chính là tên ghi trong đề thật. */
  name: string;
  nameVi: string;
  /** Đề trông như thế nào, để nhận ra ngay khi mở đề. */
  looks: string;
  /** Thường xuất hiện bao nhiêu câu, ở phần nào. */
  frequency: string;
  /** Độ khó với người ở chặng 2: 1 dễ, 2 vừa, 3 khó. */
  hard: 1 | 2 | 3;
  /** Các bước làm, ĐÚNG THỨ TỰ. Làm sai thứ tự là mất thời gian. */
  steps: string[];
  /** Bẫy riêng của dạng này. */
  traps: string[];
  /** Ví dụ minh hoạ ngắn — tự viết, không lấy từ đề thật. */
  example?: { q: string; answer: string; why: string };
}

/* ─────────────────────  ĐỜI SỐNG & VIỆC LÀM  ───────────────────── */

/**
 * Tình huống dùng tiếng Anh THẬT, ngoài phòng thi.
 *
 * Có mục này vì phần lớn người học bỏ cuộc do không thấy tiếng Anh dùng được
 * vào đâu — học mãi chỉ để thi thì rất khó duy trì. Mỗi tình huống ở đây đều
 * là việc có thể gặp trong tháng tới, và từ vựng dùng lại được cho kỳ thi.
 */
export interface LifeSituation {
  id: string;
  /** Nhóm để lọc: đời sống hằng ngày, công việc, hay riêng cho lập trình viên. */
  group: 'Đời sống' | 'Công việc' | 'Lập trình viên';
  title: string;
  titleVi: string;
  icon: string;
  /** Khi nào bạn thật sự cần tới tình huống này. */
  when: string;
  /** Phần này liên quan gì tới kỳ thi — để người học thấy không phải học lệch. */
  examLink: string;
  dialogue: { who: string; en: string; vi: string }[];
  phrases: { en: string; vi: string; note?: string }[];
  items: Exercise[];
  tips: string[];
}

/* ─────────────────────────  CẨM NANG THI  ───────────────────────── */

export interface ExamBlock {
  id: string;
  title: string;
  icon: string;
  /** Phần giải thích chính. */
  body: string;
  /** Bảng hai cột (cấu trúc đề, quy đổi điểm…). */
  rows?: { k: string; v: string }[];
  bullets?: string[];
  /** Cảnh báo quan trọng, hiện nền đỏ. */
  warn?: string;
}

/* ─────────────────────────  ĐỌC  ───────────────────────── */

export type ReadingQuestionKind =
  | 'TFNG'          // True / False / Not Given — hỏi THÔNG TIN
  | 'YNNG'          // Yes / No / Not Given — hỏi QUAN ĐIỂM tác giả (từ chặng 2)
  | 'MCQ'           // Trắc nghiệm 1 đáp án
  | 'GAP'           // Điền từ lấy từ bài (Sentence / Summary Completion)
  | 'MATCH'         // Nối thông tin với đoạn, hoặc nối phát biểu với người
  | 'HEADING';      // Chọn tiêu đề cho đoạn

export interface ReadingQuestion {
  kind: ReadingQuestionKind;
  /** Đề bài của câu hỏi. */
  q: string;
  /** Các lựa chọn. Với GAP thì bỏ trống, người học tự gõ. */
  options?: string[];
  /** Đáp án đúng — với GAP là chuỗi cần gõ (so khớp không phân biệt hoa thường). */
  answer: string;
  /** Chấp nhận thêm các cách viết khác cho dạng GAP. */
  alt?: string[];
  /** Vì sao đáp án này đúng — trích đúng chỗ trong bài. */
  why: string;
  /** Vì sao các phương án còn lại sai (dạng có lựa chọn). */
  whyNot?: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  titleVi: string;
  /** Mức độ — ở chặng 1 là A2/B1 chứ chưa phải độ khó đề thật. */
  level: string;
  /** Số từ, để người học tự canh tốc độ đọc. */
  words: number;
  /** Thời gian nên đặt đồng hồ. */
  minutes: number;
  /** Bài đọc, tách sẵn theo đoạn; nhãn A, B, C… dùng cho dạng nối đoạn. */
  paragraphs: { label: string; text: string }[];
  /** Từ khó trong bài, giải nghĩa sẵn để không phải rời trang đi tra. */
  glossary: { en: string; ipa: string; vi: string }[];
  questions: ReadingQuestion[];
  /** Mẹo làm đúng dạng câu hỏi có trong bài này. */
  strategy: string[];
  /** Bản dịch tiếng Việt — bật ra xem SAU khi đã làm xong câu hỏi. */
  translation: string;
}

/* ─────────────────────────  NGHE  ───────────────────────── */

export interface ListeningQuestion {
  /** Câu hỏi hoặc dòng cần điền, ví dụ "Name: ______". */
  q: string;
  answer: string;
  alt?: string[];
  why: string;
}

export interface ListeningExercise {
  id: string;
  title: string;
  titleVi: string;
  /** Dạng đề tương ứng trong bài thi thật. */
  kind: string;
  level: string;
  /** Bối cảnh cho người học biết sắp nghe gì — đề thật cũng đọc phần này. */
  context: string;
  /**
   * Transcript TỰ VIẾT. Trình duyệt đọc từng dòng bằng speechSynthesis nên
   * người học nghe được ngay mà không cần file âm thanh nào.
   */
  lines: { who: string; text: string }[];
  questions: ListeningQuestion[];
  /** Bản đồ / sơ đồ cho dạng Map Labelling. */
  figure?: Figure;
  /** Từ khoá cần bắt được khi nghe. */
  listenFor: string[];
  tips: string[];
}

/** Nguồn nghe ngoài — ID đã kiểm bằng oembed, kênh chính chủ. */
export interface ListeningSource {
  /** Tên nguồn. */
  name: string;
  channel: string;
  /** 'playlist' hoặc 'video' — quyết định URL nhúng. */
  kind: 'playlist' | 'video';
  /** ID playlist (PL…) hoặc ID video. */
  ytId: string;
  level: string;
  /** Dùng nguồn này ở chặng 1 như thế nào cho đúng. */
  how: string;
}

/* ─────────────────────────  HÌNH ẢNH  ───────────────────────── */

/**
 * Hình cho đề Writing Task 1 và cho bài nghe Map Labelling.
 *
 * Vẽ bằng SVG NỘI TUYẾN, không tải ảnh từ đâu cả. Ba lý do:
 *  1. CSP của trang chỉ cho `img-src` từ self và R2 — ảnh ngoài bị chặn.
 *  2. Đề Task 1 thật là biểu đồ; mô tả biểu đồ bằng chữ thì người học đọc số
 *     có sẵn chứ không tập được kỹ năng ĐỌC BIỂU ĐỒ, mà đó mới là việc khó.
 *  3. SVG nội tuyến co giãn theo màn hình và tự đổi màu theo nền tối.
 *
 * Dữ liệu tách khỏi cách vẽ: cùng một `values` có thể vẽ cột hay đường, và
 * số trong hình luôn khớp số trong bài mẫu vì cả hai đọc chung một nguồn.
 */
export type FigureKind = 'bar' | 'line' | 'pie' | 'table' | 'process' | 'map';

export interface FigureSeries {
  name: string;
  values: number[];
  /** Mã màu; bỏ trống thì lấy theo bảng màu mặc định. */
  color?: string;
}

/** Bản đồ đơn giản cho Map Labelling — khối chữ nhật + lối đi + vị trí trống. */
export interface MapSpec {
  /** Kích thước lưới, toạ độ mọi thứ tính theo ô lưới này. */
  cols: number;
  rows: number;
  /** Khối: phòng, toà nhà, khu vực. `blank` là nhãn cần điền (A, B, C…). */
  boxes: {
    x: number; y: number; w: number; h: number;
    label?: string;
    blank?: string;
  }[];
  /** Lối đi / đường — vẽ thành dải mờ. */
  paths?: { x: number; y: number; w: number; h: number; label?: string }[];
  /** Mốc: lối vào, chỗ đứng. */
  pins?: { x: number; y: number; label: string }[];
}

export interface Figure {
  kind: FigureKind;
  title: string;
  /** Nguồn số liệu — luôn ghi rõ là số liệu tự đặt cho bài luyện. */
  note?: string;
  /** Nhãn trục ngang (năm, hạng mục). */
  categories?: string[];
  series?: FigureSeries[];
  /** Đơn vị hiện ở trục dọc. */
  unit?: string;
  /** Cho kind 'pie'. */
  slices?: { label: string; value: number; color?: string }[];
  /** Cho kind 'process'. */
  steps?: { label: string; note?: string }[];
  /** Cho kind 'map'. */
  map?: MapSpec;
}

/* ─────────────────────────  VIẾT  ───────────────────────── */

export interface WritingTask {
  id: string;
  /** Biểu đồ của đề — Task 1 Academic gần như luôn có. */
  figure?: Figure;
  /** 'Task 1' | 'Task 2' | 'Nền tảng' — chặng 1 có cả bài tập viết câu. */
  task: string;
  title: string;
  /** Đề bài. */
  prompt: string;
  promptVi: string;
  minWords: number;
  minutes: number;
  /** Dàn ý từng đoạn. */
  outline: { part: string; what: string }[];
  /** Cụm từ dùng được ngay cho dạng đề này. */
  phrases: { en: string; vi: string }[];
  /** Bài mẫu mức đang nhắm tới ở chặng này. */
  sample: { band: string; text: string; note: string };
  /** Bài mẫu KÉM để đối chiếu — nhìn cái sai mới nhớ cái đúng. */
  weakSample?: { band: string; text: string; problems: string[] };
  /** Lỗi người Việt hay mắc ở đúng đề này. */
  mistakes: { wrong: string; right: string; why: string }[];
}

/* ─────────────────────────  NÓI  ───────────────────────── */

export interface SpeakingQuestion {
  q: string;
  qVi: string;
  /** Câu trả lời cụt — mức band 4, để thấy vì sao bị điểm thấp. */
  weak: string;
  /** Câu trả lời đủ ý — mức đang nhắm tới. */
  good: string;
  goodVi: string;
  /** Vì sao câu sau được điểm cao hơn. */
  why: string;
}

export interface SpeakingTopic {
  id: string;
  part: string;
  title: string;
  titleVi: string;
  questions: SpeakingQuestion[];
  /** Cụm nối câu dùng chung cho cả chủ đề. */
  phrases?: { en: string; vi: string }[];
}
