/**
 * Phần NHẸ của mỗi chặng — nhãn, band, một dòng mô tả, và kiểu dữ liệu dùng chung.
 *
 * File này tồn tại để `IeltsClient` và `RoadmapTab` dựng được toàn bộ khung
 * trang (thanh chuyển chặng, thanh tab, con số ở đầu trang) mà KHÔNG phải nạp
 * một byte nội dung học nào. Trước khi tách, hai file đó import `STAGES` nên
 * kéo theo cả 1,23 MB nội dung năm chặng vào gói đầu tiên — người mở trang chỉ
 * để xem lộ trình vẫn phải tải trọn bộ bài đọc, transcript và đề viết.
 *
 * Nguyên tắc giữ file này: **chỉ được chứa chuỗi gõ tay, tuyệt đối không chứa
 * số liệu.** Số đếm (bao nhiêu bài học, bao nhiêu từ) nằm ở `stats.generated.ts`
 * và do máy sinh — xem lời cảnh báo trong file đó.
 */

export type StageId = 'stage1' | 'stage2' | 'stage3' | 'stage4' | 'stage5';

/** Số đếm nội dung của một chặng. Mọi giá trị đều SINH TỪ dữ liệu, không gõ tay. */
export interface StageStats {
  lessons: number;
  units: number;
  words: number;
  topics: number;
  readings: number;
  readingQuestions: number;
  listenings: number;
  listeningQuestions: number;
  sources: number;
  writings: number;
  speakingTopics: number;
  speakingQuestions: number;
  grammarPoints: number;
  exercises: number;
  gradedTotal: number;
}

export interface StageMeta {
  id: StageId;
  /** Nhãn ngắn hiện trên nút chuyển chặng. */
  label: string;
  band: string;
  /** Một dòng nói chặng này dạy gì — hiện dưới bộ chuyển chặng. */
  focus: string;
  /** Khoá localStorage riêng cho từng chặng. Tiến độ chặng này không đè chặng kia. */
  keys: { lessonDone: string; vocabKnown: string };
}

export const STAGE_META: StageMeta[] = [
  {
    id: 'stage1',
    label: 'Chặng 1',
    band: 'Band 0 → 4.0',
    focus: 'Xây nền: âm, câu cơ bản, 1.500 từ nền. Chưa đụng đề thi thật.',
    keys: { lessonDone: 'ielts:s1:lessons:v1', vocabKnown: 'ielts:s1:vocab-known:v1' },
  },
  {
    id: 'stage2',
    label: 'Chặng 2',
    band: 'Band 4.0 → 5.5',
    focus: 'Vào đề thi thật: học DẠNG câu hỏi, paraphrase, và khung viết/nói đủ 5.5.',
    keys: { lessonDone: 'ielts:s2:lessons:v1', vocabKnown: 'ielts:s2:vocab-known:v1' },
  },
  {
    id: 'stage3',
    label: 'Chặng 3',
    band: 'Band 5.5 → 6.5',
    focus: 'Chặng kẹt lâu nhất, gần như luôn vì Writing không ai sửa. Trọng tâm: tự chấm và tự sửa bài.',
    keys: { lessonDone: 'ielts:s3:lessons:v1', vocabKnown: 'ielts:s3:vocab-known:v1' },
  },
  {
    id: 'stage4',
    label: 'Chặng 4',
    band: 'Band 6.5 → 7.5',
    focus: 'Không học kiến thức mới nữa — chặng này ăn nhau ở việc GIẢM LỖI và dùng từ chính xác.',
    keys: { lessonDone: 'ielts:s4:lessons:v1', vocabKnown: 'ielts:s4:vocab-known:v1' },
  },
  {
    id: 'stage5',
    label: 'Chặng 5',
    band: 'Band 7.5 → 8.0',
    focus: 'Chặng KHÔNG có sách. Chỉ còn bốn việc: thuộc band descriptors · có người chấm bài · nguồn vào khó hơn đề thi · nhật ký lỗi.',
    keys: { lessonDone: 'ielts:s5:lessons:v1', vocabKnown: 'ielts:s5:vocab-known:v1' },
  },
];

export const STAGE_IDS: StageId[] = STAGE_META.map((s) => s.id);

export function metaFor(id: StageId): StageMeta {
  const m = STAGE_META.find((s) => s.id === id);
  if (!m) throw new Error(`Không có chặng "${id}" trong STAGE_META`);
  return m;
}
