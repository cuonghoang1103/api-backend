/**
 * 🎬 Video bài giảng của IELTS Tập 2 — khoá = id bài (`t2dN-…`, `t2-bat-dau`), hiện đầu bài (VideoBai.tsx).
 * Cùng quy trình và định dạng với `../videos.ts` của Tập 1 (oEmbed + playabilityStatus OK + playableInEmbed;
 * kiểm cả loạt: `node scripts/yt-check.mjs <id…>`). Không dùng lại ID đã gắn ở Tập 1 cho cùng nội dung.
 */
import type { LessonVideo } from '@/components/sach-hoc/types';

export const VIDEO_BAI_T2: Record<string, LessonVideo[]> = {};
