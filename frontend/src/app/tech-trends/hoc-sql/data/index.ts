import type { Chapter } from './types';
import { CH00 } from './ch00';
import { CH01 } from './ch01';
import { CH02 } from './ch02';
import { CH03 } from './ch03';
import { CH04 } from './ch04';
import { CH05 } from './ch05';
import { CH06 } from './ch06';
import { CH07 } from './ch07';
import { OUTLINE_CHAPTERS } from './outline';

export * from './types';
export { MSSQL_ROWS, MSSQL_GROUPS } from './mssql';

/** Toàn bộ 21 chương, xếp theo số thứ tự. */
export const CHAPTERS: Chapter[] = [
  CH00, CH01, CH02, CH03, CH04, CH05, CH06, CH07,
  ...OUTLINE_CHAPTERS,
].sort((a, b) => a.no - b.no);

/** Bốn chặng — chia để người học thấy đường đi, không phải một danh sách 21 mục phẳng. */
export interface Stage {
  id: number;
  title: string;
  subtitle: string;
  /** Số chương đầu và cuối (bao gồm cả hai đầu). */
  from: number;
  to: number;
  color: string;
}

export const STAGES: Stage[] = [
  {
    id: 1,
    title: 'Chặng 1 · Nền móng',
    subtitle: 'Từ chưa biết gì tới đọc hiểu và tự viết được câu truy vấn',
    from: 0,
    to: 3,
    color: 'emerald',
  },
  {
    id: 2,
    title: 'Chặng 2 · Truy vấn thật',
    subtitle: 'Gộp nhóm, ghép bảng, chẻ bài toán khó — đủ để làm báo cáo',
    from: 4,
    to: 7,
    color: 'sky',
  },
  {
    id: 3,
    title: 'Chặng 3 · Đi sâu',
    subtitle: 'Hàm cửa sổ, index, JSON, và các kiểu dữ liệu riêng của Postgres',
    from: 8,
    to: 13,
    color: 'violet',
  },
  {
    id: 4,
    title: 'Chặng 4 · Chạy thật',
    subtitle: 'Bảo mật, vận hành, đồng thời, sao lưu — thứ phân biệt dev và người vận hành hệ thống',
    from: 14,
    to: 20,
    color: 'amber',
  },
];

export function stageOf(no: number): Stage {
  return STAGES.find((s) => no >= s.from && no <= s.to) ?? STAGES[0];
}

/** Khoá localStorage — đổi hậu tố khi cấu trúc dữ liệu tiến độ thay đổi. */
export const PROGRESS_KEY = 'hoc-sql:done:v1';

/** Đường dẫn track Code Lab mà mọi liên kết bài tập trỏ tới. */
export const LAB_TRACK = 'postgresql';
/** Tham số để Code Lab hiện nút "Quay lại: …". */
export const LAB_REF_QS =
  '?ref=%2Ftech-trends%2Fhoc-sql&reflabel=' + encodeURIComponent('Học SQL từ số 0');

/** Link tới một module Code Lab (mở đúng chủ đề, kèm nút quay lại). */
export function labModuleHref(moduleId: number): string {
  return `/code-lab/${LAB_TRACK}${LAB_REF_QS}#module-${moduleId}`;
}

/** Link tới một bài tập cụ thể. */
export function labExerciseHref(slug: string): string {
  return `/code-lab/${LAB_TRACK}/${slug}${LAB_REF_QS}`;
}

/**
 * Số liệu hiện ở đầu trang.
 *
 * ĐẾM TỪ DỮ LIỆU, không viết tay. Bài học từ những trang trước: con số cứng
 * trong JSX sẽ lệch ngay lần đầu có người thêm nội dung mà quên sửa nó.
 */
function countBlocks(pred: (b: Chapter['blocks'][number]) => boolean): number {
  return CHAPTERS.reduce((n, c) => n + c.blocks.filter(pred).length, 0);
}

export const STATS = {
  chapters: CHAPTERS.length,
  chaptersFull: CHAPTERS.filter((c) => c.status === 'full').length,
  minutes: CHAPTERS.reduce((n, c) => n + c.minutes, 0),
  labExercises: CHAPTERS.reduce((n, c) => n + c.labCount, 0),
  quizzes: countBlocks((b) => b.kind === 'quiz'),
  widgets: countBlocks((b) => b.kind === 'widget'),
  figures: countBlocks((b) => b.kind === 'figure'),
  codeBlocks: countBlocks((b) => b.kind === 'code'),
  mssqlBoxes: countBlocks((b) => b.kind === 'mssql'),
  flashcards: CHAPTERS.reduce((n, c) => n + (c.flash?.length ?? 0), 0),
};

/**
 * Bỏ dấu tiếng Việt để tìm kiếm gõ không dấu vẫn ra.
 *
 * Dùng dãy escape `̀-ͯ` chứ không dán ký tự tổ hợp trực tiếp vào
 * regex: ký tự tổ hợp trong mã nguồn vô hình với mắt thường và hay bị công cụ
 * định dạng làm hỏng.
 */
export function deaccent(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}
