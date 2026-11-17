/**
 * 🎬 Video bài giảng của IELTS Tập 3 — khoá = id bài (`t3dN-…`, `t3-bat-dau`), hiện đầu bài (VideoBai.tsx).
 * Cùng quy trình và định dạng với `../videos.ts` của Tập 1 (oEmbed + playabilityStatus OK + playableInEmbed;
 * kiểm cả loạt: `node scripts/yt-check.mjs <id…>`). Không dùng lại ID đã gắn ở Tập 1/2 cho cùng nội dung.
 */
import type { LessonVideo } from '@/components/sach-hoc/types';

export const VIDEO_BAI_T3: Record<string, LessonVideo[]> = {};
