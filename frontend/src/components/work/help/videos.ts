/**
 * Loạt video "Hướng dẫn CT Work" (12 tập, giọng tiếng Việt) — nhúng vào bảng Trợ giúp (HelpPanel → ArticleView)
 * và trang /download/ct-work (tập 12). Cả loạt cũng là khoá /courses/huong-dan-ct-work
 * (content/courses/huong-dan-ct-work.mjs + content/course-videos/huong-dan-ct-work.mjs).
 *
 * ⚠️ URL ĐỂ TRỐNG LÀ CỐ Ý: dán link R2 (https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/…mp4) vào
 * `url` của từng tập SAU KHI xuat/len-r2.mts đã đẩy lên. Tập nào `url` rỗng thì KHÔNG hiện khung video nào
 * (không có khung đen chết). CSP `media-src` của web đã cho media.cuongthai.com (frontend/next.config.js),
 * app desktop cho mọi https:.
 *
 * Nguồn vị trí: ~/Documents/video-bai-giang/scratchpad/ctw-playlist-plan.json → placement.in_app_help.map.
 */
import type { HelpVideo } from './content';

export type CtwEpisodeId =
  | 'ctw-01-bat-dau'
  | 'ctw-02-board-hang-ngay'
  | 'ctw-03-the-viec-chi-tiet'
  | 'ctw-04-tro-chuyen-docs-hop'
  | 'ctw-05-moi-nhom-phan-quyen'
  | 'ctw-06-backlog-sprint-timeline'
  | 'ctw-07-docs-so-do-hop'
  | 'ctw-08-bao-cao-dong-gop'
  | 'ctw-09-giang-vien-lop-hoc'
  | 'ctw-10-cong-khach-hang'
  | 'ctw-11-ai-agent-tich-hop'
  | 'ctw-12-app-may-tinh-dien-thoai';

export interface CtwEpisodeVideo { url: string; title: string }

/** Trang khoá học gom cả 12 tập. */
export const CTW_COURSE_HREF = '/courses/huong-dan-ct-work';

/** episodeId (= slug bài trên /courses) → video. DÁN 12 LINK R2 VÀO ĐÂY. */
export const CTW_EPISODES: Record<CtwEpisodeId, CtwEpisodeVideo> = {
  'ctw-01-bat-dau': { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/01-nguoi-moi-va-thanh-vien/01-01-bat-dau-8715d6aa.mp4', title: 'Tập 1 — CT Work là gì? Tạo không gian và dự án đầu tiên' },
  'ctw-02-board-hang-ngay': { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/01-nguoi-moi-va-thanh-vien/01-02-board-hang-ngay-08fb4f11.mp4', title: 'Tập 2 — Dùng Board mỗi ngày: kéo thẻ, lọc, nhóm theo người và epic' },
  'ctw-03-the-viec-chi-tiet': { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/01-nguoi-moi-va-thanh-vien/01-03-the-viec-chi-tiet-2218a669.mp4', title: 'Tập 3 — Một thẻ việc từ A tới Z: mô tả, việc con, liên kết, bình luận, ghi giờ' },
  'ctw-04-tro-chuyen-docs-hop': { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/01-nguoi-moi-va-thanh-vien/01-04-tro-chuyen-docs-hop-47ada212.mp4', title: 'Tập 4 — Làm việc nhóm: trò chuyện, Docs và đi họp ngay trong CT Work' },
  'ctw-05-moi-nhom-phan-quyen': { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/02-nhom-truong-va-admin/02-05-moi-nhom-phan-quyen-b663e440.mp4', title: 'Tập 5 — Nhóm trưởng: mời thành viên, vai trò và quyền hạn' },
  'ctw-06-backlog-sprint-timeline': { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/02-nhom-truong-va-admin/02-06-backlog-sprint-timeline-3fe817cb.mp4', title: 'Tập 6 — Lập kế hoạch: Backlog, Sprint, Dòng thời gian và danh sách thẻ' },
  'ctw-07-docs-so-do-hop': { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/02-nhom-truong-va-admin/02-07-docs-so-do-hop-c5ac3dca.mp4', title: 'Tập 7 — Tài liệu, sơ đồ và cuộc họp: viết SRS, vẽ ERD, biên bản thành thẻ việc' },
  'ctw-08-bao-cao-dong-gop': { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/02-nhom-truong-va-admin/02-08-bao-cao-dong-gop-fa796fad.mp4', title: 'Tập 8 — Báo cáo cho nhóm trưởng: tiến độ, đóng góp từng người, khối lượng việc' },
  'ctw-09-giang-vien-lop-hoc': { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/03-giang-vien/03-09-giang-vien-lop-hoc-afeaf35e.mp4', title: 'Tập 9 — Giảng viên: tạo lớp, điểm danh QR, giao bài, chấm điểm, quiz' },
  'ctw-10-cong-khach-hang': { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/04-khach-hang/04-10-cong-khach-hang-db469fcd.mp4', title: 'Tập 10 — Làm dự án cho khách: chia sẻ thẻ, cổng khách hàng, duyệt UAT' },
  'ctw-11-ai-agent-tich-hop': { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/05-nang-cao-ai-tich-hop/05-11-ai-agent-tich-hop-b6b82e63.mp4', title: 'Tập 11 — Nâng cao: Trợ lý AI, AI agent và kết nối GitHub, Slack, lịch' },
  'ctw-12-app-may-tinh-dien-thoai': { url: 'https://media.cuongthai.com/videos/bai-giang/huong-dan-ct-work/05-nang-cao-ai-tich-hop/05-12-app-may-tinh-dien-thoai-1d07a889.mp4', title: 'Tập 12 — CT Work trên máy tính và điện thoại: tải app, cập nhật, phím tắt' },
};

/**
 * Bản đồ GỐC của kế hoạch: mỗi tập phục vụ những bài trợ giúp nào (một tập ⇒ nhiều bài).
 * Ba bài có HAI tập (workspaces: 1 + 5 · project-docs, meetings: 4 + 7) — tập được nhúng chọn ở
 * HELP_ARTICLE_EPISODE ngay dưới.
 */
export const CTW_EPISODE_HELP_ARTICLES: Record<CtwEpisodeId, string[]> = {
  'ctw-01-bat-dau': ['getting-started', 'workspaces', 'templates'],
  'ctw-02-board-hang-ngay': ['board'],
  'ctw-03-the-viec-chi-tiet': ['issues'],
  'ctw-04-tro-chuyen-docs-hop': ['project-docs', 'meetings'],
  'ctw-05-moi-nhom-phan-quyen': ['workspaces', 'roles', 'public-links'],
  'ctw-06-backlog-sprint-timeline': ['backlog-sprints', 'timeline', 'issues-list-jql', 'import-export'],
  'ctw-07-docs-so-do-hop': ['project-docs', 'approvals', 'meetings'],
  'ctw-08-bao-cao-dong-gop': ['reports', 'time-capacity', 'portfolio-workload', 'student-guide'],
  'ctw-09-giang-vien-lop-hoc': ['classroom', 'classwork', 'class-quiz'],
  'ctw-10-cong-khach-hang': ['client-portal', 'internal-notes', 'uat-signoff'],
  'ctw-11-ai-agent-tich-hop': ['ai', 'ai-agents', 'connect-claude', 'github', 'gitlab', 'integrations-cloud', 'integrations-notion-slack'],
  'ctw-12-app-may-tinh-dien-thoai': ['apps', 'shortcuts', 'notifications'],
};

/**
 * Bài trợ giúp (id trong content.ts) → MỘT tập được nhúng. Chỗ trùng chọn tập khớp NỘI DUNG bài:
 *  - workspaces ("thành viên & lời mời") → tập 5 (mời bằng email/link, bốn vai trò không gian), không phải tập 1.
 *  - project-docs (mẫu, lịch sử phiên bản, phê duyệt) và meetings (lên lịch, biên bản → thẻ) → tập 7 (bản sâu).
 *    Tập 4 (bản dành cho thành viên) vì thế chưa gắn bài nào — nó có trong khoá học; khi có bài trợ giúp
 *    "Trò chuyện" riêng thì gắn tập 4 vào đó.
 */
export const HELP_ARTICLE_EPISODE: Record<string, CtwEpisodeId> = {
  'getting-started': 'ctw-01-bat-dau',
  templates: 'ctw-01-bat-dau',
  board: 'ctw-02-board-hang-ngay',
  issues: 'ctw-03-the-viec-chi-tiet',
  workspaces: 'ctw-05-moi-nhom-phan-quyen',
  roles: 'ctw-05-moi-nhom-phan-quyen',
  'public-links': 'ctw-05-moi-nhom-phan-quyen',
  'backlog-sprints': 'ctw-06-backlog-sprint-timeline',
  timeline: 'ctw-06-backlog-sprint-timeline',
  'issues-list-jql': 'ctw-06-backlog-sprint-timeline',
  'import-export': 'ctw-06-backlog-sprint-timeline',
  'project-docs': 'ctw-07-docs-so-do-hop',
  approvals: 'ctw-07-docs-so-do-hop',
  meetings: 'ctw-07-docs-so-do-hop',
  reports: 'ctw-08-bao-cao-dong-gop',
  'time-capacity': 'ctw-08-bao-cao-dong-gop',
  'portfolio-workload': 'ctw-08-bao-cao-dong-gop',
  'student-guide': 'ctw-08-bao-cao-dong-gop',
  classroom: 'ctw-09-giang-vien-lop-hoc',
  classwork: 'ctw-09-giang-vien-lop-hoc',
  'class-quiz': 'ctw-09-giang-vien-lop-hoc',
  'client-portal': 'ctw-10-cong-khach-hang',
  'internal-notes': 'ctw-10-cong-khach-hang',
  'uat-signoff': 'ctw-10-cong-khach-hang',
  ai: 'ctw-11-ai-agent-tich-hop',
  'ai-agents': 'ctw-11-ai-agent-tich-hop',
  'connect-claude': 'ctw-11-ai-agent-tich-hop',
  github: 'ctw-11-ai-agent-tich-hop',
  gitlab: 'ctw-11-ai-agent-tich-hop',
  'integrations-cloud': 'ctw-11-ai-agent-tich-hop',
  'integrations-notion-slack': 'ctw-11-ai-agent-tich-hop',
  apps: 'ctw-12-app-may-tinh-dien-thoai',
  shortcuts: 'ctw-12-app-may-tinh-dien-thoai',
  notifications: 'ctw-12-app-may-tinh-dien-thoai',
};

/** Video của một tập, hoặc null khi chưa dán link. */
export function episodeVideo(id: CtwEpisodeId): CtwEpisodeVideo | null {
  const v = CTW_EPISODES[id];
  return v && v.url.trim() ? v : null;
}

/**
 * Video nhúng cho một bài trợ giúp: `video` khai thẳng trên bài (content.ts, có thể kèm `start` giây) thắng;
 * không có thì lấy tập theo HELP_ARTICLE_EPISODE. URL rỗng ⇒ null ⇒ không vẽ gì.
 */
export function helpVideoFor(article: { id: string; video?: HelpVideo }): HelpVideo | null {
  if (article.video?.url?.trim()) return article.video;
  const ep = HELP_ARTICLE_EPISODE[article.id];
  const v = ep ? episodeVideo(ep) : null;
  return v ? { url: v.url, title: v.title } : null;
}
