/**
 * Dùng chung cho /roadmap và /roadmap/[slug]: nhãn giao diện EN/VI (theo ngôn ngữ chung của web — LocaleContext)
 * và cách hiện từng LOẠI chỗ học ngay trên web (slide, video, mô phỏng…).
 */
import {
  Presentation, PlayCircle, FileText, ListChecks, FlaskConical, MonitorPlay, Code2, Compass, type LucideIcon,
} from 'lucide-react';
import type { RoadmapLessonKind } from '@/lib/api';

export type Lang = 'en' | 'vi';

export const LESSON_KIND: Record<RoadmapLessonKind, { icon: LucideIcon; color: string; en: string; vi: string }> = {
  slide: { icon: Presentation, color: '#f59e0b', en: 'Slides', vi: 'Slide' },
  video: { icon: PlayCircle, color: '#ef4444', en: 'Video lesson', vi: 'Video bài giảng' },
  'bai-doc': { icon: FileText, color: '#3b82f6', en: 'Lesson', vi: 'Bài giảng' },
  quiz: { icon: ListChecks, color: '#8b5cf6', en: 'Quiz', vi: 'Kiểm tra' },
  lab: { icon: FlaskConical, color: '#10b981', en: 'Hands-on lab', vi: 'Lab thực hành' },
  'mo-phong': { icon: MonitorPlay, color: '#06b6d4', en: 'Simulation', vi: 'Mô phỏng' },
  'code-lab': { icon: Code2, color: '#22c55e', en: 'Code Lab', vi: 'Code Lab' },
  trang: { icon: Compass, color: '#ec4899', en: 'Interactive tool', vi: 'Công cụ học' },
};

export const RES_KIND: Record<string, { color: string; en: string; vi: string }> = {
  article: { color: '#eab308', en: 'Article', vi: 'Bài viết' },
  video: { color: '#ef4444', en: 'Video', vi: 'Video' },
  course: { color: '#a855f7', en: 'Course', vi: 'Khoá học' },
  official: { color: '#3b82f6', en: 'Official', vi: 'Chính thức' },
  feed: { color: '#14b8a6', en: 'Feed', vi: 'Feed' },
};

export const T = {
  en: {
    // landing
    eyebrow: 'Learning paths',
    heroTitle: 'Roadmaps',
    heroLead: 'Step-by-step paths by role and by skill. Every step explains the idea right here and opens the matching slides, lessons, simulations and Code Lab on CuongThai — external links stay as extra reading.',
    statPaths: 'roadmaps', statSteps: 'steps', statLinked: 'steps with on-site lessons',
    searchPaths: 'Search roadmaps — React, DevOps, SQL…',
    all: 'All', role: 'By role', skill: 'By skill',
    roleSub: 'What do you want to become?', skillSub: 'Go deep on one technology',
    continueLearning: 'Continue learning',
    stages: 'stages', steps: 'steps', withLessons: 'with lessons',
    open: 'Open roadmap', noMatch: 'No roadmap matches', empty: 'No roadmaps yet.',
    // detail
    coursesCover: 'Courses on CuongThai that cover this roadmap', coversSteps: (n: number) => `covers ${n} steps`,
    back: 'All roadmaps', contents: 'Contents', done: 'done', resume: 'Continue', start: 'Start here',
    searchSteps: (n: number) => `Search ${n} steps…`,
    fAll: 'All steps', fTodo: 'Not done', fLinked: 'Has lessons', fCore: 'Core only',
    matches: (n: number) => `${n} matching steps`, noSteps: 'No step matches these filters.',
    showMore: (n: number) => `Show ${n} more steps`, collapse: 'Collapse',
    branch: 'Optional', concept: 'Concept', reading: 'Reading', lessonsOnSite: (n: number) => `${n} on-site`,
    next: 'Up next', notFound: 'Roadmap not found.',
    // panel
    learnHere: 'Learn it here on CuongThai', learnHereSub: 'Opens the exact lesson, slides or simulation',
    recommended: 'Recommended', readHere: 'Explained', noBody: 'A full write-up for this step is coming soon — start with the lessons above.',
    moreReading: 'Further reading', moreReadingSub: 'External sources, for going deeper',
    free: 'Free', premium: 'Advanced',
    markDone: 'Mark as done', markedDone: 'Done', loginToSave: 'Sign in to save your progress.',
    prev: 'Previous', nextStep: 'Next step', close: 'Close', newTab: 'Open in new tab', academy: 'Academy',
    trackLabel: { 'code-lab': 'Code Lab track', course: 'Course on CuongThai', roadmap: 'Related roadmap', external: 'Reference' } as Record<string, string>,
  },
  vi: {
    eyebrow: 'Lộ trình học',
    heroTitle: 'Lộ trình',
    heroLead: 'Lộ trình từng bước theo vai trò và theo kỹ năng. Mỗi bước được giảng giải ngay tại đây và mở thẳng slide, bài giảng, mô phỏng, Code Lab đúng chủ đề trên CuongThai — link ngoài giữ lại để đọc thêm.',
    statPaths: 'lộ trình', statSteps: 'bước', statLinked: 'bước có bài học trên web',
    searchPaths: 'Tìm lộ trình — React, DevOps, SQL…',
    all: 'Tất cả', role: 'Theo vai trò', skill: 'Theo kỹ năng',
    roleSub: 'Bạn muốn trở thành gì?', skillSub: 'Học sâu một công nghệ',
    continueLearning: 'Đang học dở',
    stages: 'chặng', steps: 'bước', withLessons: 'có bài học',
    open: 'Xem lộ trình', noMatch: 'Không có lộ trình nào khớp', empty: 'Chưa có lộ trình nào.',
    coursesCover: 'Khoá trên CuongThai phủ lộ trình này', coversSteps: (n: number) => `phủ ${n} bước`,
    back: 'Tất cả lộ trình', contents: 'Mục lục', done: 'xong', resume: 'Học tiếp', start: 'Bắt đầu',
    searchSteps: (n: number) => `Tìm trong ${n} bước…`,
    fAll: 'Tất cả', fTodo: 'Chưa xong', fLinked: 'Có bài học', fCore: 'Bước chính',
    matches: (n: number) => `${n} bước khớp`, noSteps: 'Không có bước nào khớp bộ lọc.',
    showMore: (n: number) => `Xem thêm ${n} bước`, collapse: 'Thu gọn',
    branch: 'Tuỳ chọn', concept: 'Khái niệm', reading: 'Bài đọc', lessonsOnSite: (n: number) => `${n} bài trên web`,
    next: 'Nên học tiếp', notFound: 'Không tìm thấy lộ trình.',
    learnHere: 'Học ngay trên CuongThai', learnHereSub: 'Mở thẳng đúng bài, slide hoặc mô phỏng',
    recommended: 'Đề xuất', readHere: 'Giảng giải', noBody: 'Bài đọc chi tiết cho bước này đang được soạn — hãy bắt đầu từ các bài học phía trên.',
    moreReading: 'Đọc thêm', moreReadingSub: 'Nguồn bên ngoài, để đào sâu hơn',
    free: 'Miễn phí', premium: 'Nâng cao',
    markDone: 'Đánh dấu đã xong', markedDone: 'Đã xong', loginToSave: 'Đăng nhập để lưu tiến độ.',
    prev: 'Bước trước', nextStep: 'Bước tiếp', close: 'Đóng', newTab: 'Mở tab mới', academy: 'Academy',
    trackLabel: { 'code-lab': 'Lộ trình Code Lab', course: 'Khoá học trên CuongThai', roadmap: 'Lộ trình liên quan', external: 'Tài liệu' } as Record<string, string>,
  },
};
export type Strings = (typeof T)['en'];
