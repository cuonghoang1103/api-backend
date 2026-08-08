// Shared studio constants — anything that needs to know
// the meaning of a status / type / phase lives here so the
// Dashboard, Pipeline, Calendar, List and Editor all paint
// the same way.
//
// Why a single source of truth: six surfaces render the same
// enums. Inline strings scattered across files drift — that is
// exactly how `CODE` vs `CODE_REVIEW` survived here undetected.
//
// Labels are bilingual (`{ vi, en }`) rather than plain strings.
// Read them through `pick(meta.label, lang)` from studio-i18n —
// the compiler then flags any call site that forgets the
// language, which a plain string could not.

import type { StudioText } from './studio-i18n';
import type {
 ContentStatus,
 ContentType,
 SceneType,
 ShotType,
 ContentPlatform,
 ChecklistPhase,
 IdeaStatus,
} from '@/types';

// ─── Status meta ────────────────────────────────────────────────────────────

export interface ContentStatusMeta {
 label: StudioText;
 /** Tailwind classes for the pill background + text. */
 pillClass: string;
 /** Tailwind classes for the column header strip + dot. */
 accentClass: string;
 /** Hex colour for canvas / SVG / sparkline usage. */
 color: string;
 /** Sort weight — lower = earlier in the pipeline. */
 order: number;
 /** Short description shown in tooltips / dashboards. */
 description: StudioText;
}

export const CONTENT_STATUS_META: Record<ContentStatus, ContentStatusMeta> = {
 IDEA: {
 label: { vi: 'Ý tưởng', en: 'Idea' },
 pillClass: 'bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30',
 accentClass: 'text-slate-300',
 color: '#94a3b8',
 order: 0,
 description: { vi: 'Đã ghi lại tia sáng, chưa có kịch bản.', en: 'Spark captured, no script yet.' },
 },
 SCRIPTING: {
 label: { vi: 'Viết kịch bản', en: 'Scripting' },
 pillClass: 'bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30',
 accentClass: 'text-blue-300',
 color: '#60a5fa',
 order: 1,
 description: { vi: 'Đang dựng dàn ý và viết bản nháp.', en: 'Outline + draft in progress.' },
 },
 FILMING: {
 label: { vi: 'Đang quay', en: 'Filming' },
 pillClass: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
 accentClass: 'text-amber-300',
 color: '#F59E0B',
 order: 2,
 description: { vi: 'Máy đang chạy.', en: 'Cameras rolling.' },
 },
 EDITING: {
 label: { vi: 'Đang dựng', en: 'Editing' },
 pillClass: 'bg-purple-500/15 text-purple-300 ring-1 ring-purple-500/30',
 accentClass: 'text-purple-300',
 color: '#a855f7',
 order: 3,
 description: { vi: 'Cắt, chỉnh màu, xử lý âm thanh.', en: 'Cut + colour + sound in post.' },
 },
 SCHEDULED: {
 label: { vi: 'Đã lên lịch', en: 'Scheduled' },
 pillClass: 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30',
 accentClass: 'text-cyan-300',
 color: '#22d3ee',
 order: 4,
 description: { vi: 'Đã chốt. Sắp lên sóng.', en: 'Locked in. Going live soon.' },
 },
 PUBLISHED: {
 label: { vi: 'Đã đăng', en: 'Published' },
 pillClass: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
 accentClass: 'text-emerald-300',
 color: '#10b981',
 order: 5,
 description: { vi: 'Đã ra mắt khán giả.', en: 'Out in the world.' },
 },
};

/** Ordered list for the Kanban columns + agenda. */
export const STATUS_ORDER: ContentStatus[] = [
 'IDEA',
 'SCRIPTING',
 'FILMING',
 'EDITING',
 'SCHEDULED',
 'PUBLISHED',
];

// ─── Type meta ──────────────────────────────────────────────────────────────

export interface ContentTypeMeta {
 label: StudioText;
 emoji: string;
 color: string;
 /** What this format is for — shown under the radio in the
  * create modal so the right one is picked first time. */
 hint: StudioText;
 /** True for the teaching formats (lecture / exam / exercise /
  * project). These get the Academy binding panel and the
  * teaching checklist presets. */
 academic?: boolean;
}

export const CONTENT_TYPE_META: Record<ContentType, ContentTypeMeta> = {
 LECTURE: {
 label: { vi: 'Bài giảng', en: 'Lecture' },
 emoji: '🎓',
 color: '#22d3ee',
 hint: {
 vi: 'Dạy một chương / một bài của môn trong Academy.',
 en: 'Teach one chapter or lesson of an Academy course.',
 },
 academic: true,
 },
 EXAM_SOLVING: {
 label: { vi: 'Chữa đề thi', en: 'Exam solving' },
 emoji: '📝',
 color: '#f43f5e',
 hint: {
 vi: 'Giải chi tiết một đề thi FE/PE, từng câu một.',
 en: 'Work through an FE/PE exam paper question by question.',
 },
 academic: true,
 },
 EXERCISE: {
 label: { vi: 'Chữa bài tập', en: 'Exercise' },
 emoji: '✏️',
 color: '#a78bfa',
 hint: {
 vi: 'Chữa một bài tập / lab, tập trung vào cách nghĩ.',
 en: 'Walk through one exercise or lab, focused on the reasoning.',
 },
 academic: true,
 },
 PROJECT_BUILD: {
 label: { vi: 'Làm dự án', en: 'Project build' },
 emoji: '🏗️',
 color: '#34d399',
 hint: {
 vi: 'Dựng một dự án từ đầu đến khi chạy được.',
 en: 'Build a project end to end until it runs.',
 },
 academic: true,
 },
 TUTORIAL: {
 label: { vi: 'Hướng dẫn', en: 'Tutorial' },
 emoji: '🧭',
 color: '#38bdf8',
 hint: {
 vi: 'Chỉ cách dùng một công cụ hoặc kỹ thuật cụ thể.',
 en: 'Show how to use one specific tool or technique.',
 },
 },
 VLOG: {
 label: { vi: 'Vlog', en: 'Vlog' },
 emoji: '🎬',
 color: '#f59e0b',
 hint: {
 vi: 'Kể chuyện đời thường, cá nhân, hậu trường.',
 en: 'Personal storytelling, day-in-the-life, behind the scenes.',
 },
 },
 CODE_REVIEW: {
 label: { vi: 'Đọc code', en: 'Code review' },
 emoji: '⌨️',
 color: '#3b82f6',
 hint: {
 vi: 'Đọc và nhận xét một đoạn code có sẵn.',
 en: 'Read through and critique an existing codebase.',
 },
 },
 REVIEW: {
 label: { vi: 'Đánh giá', en: 'Review' },
 emoji: '🔍',
 color: '#8b5cf6',
 hint: {
 vi: 'Đánh giá một sản phẩm, khoá học hoặc công cụ.',
 en: 'Review a product, course or tool.',
 },
 },
 SHORTS: {
 label: { vi: 'Video ngắn', en: 'Shorts' },
 emoji: '⚡',
 color: '#fb7185',
 hint: {
 vi: 'Video dọc dưới 60 giây — một ý duy nhất.',
 en: 'Vertical video under 60 seconds — exactly one idea.',
 },
 },
 AFFILIATE: {
 label: { vi: 'Tiếp thị liên kết', en: 'Affiliate' },
 emoji: '🛒',
 color: '#ec4899',
 hint: {
 vi: 'Giới thiệu sản phẩm có link hoa hồng.',
 en: 'Product placement with commission links.',
 },
 },
 LIVESTREAM: {
 label: { vi: 'Phát trực tiếp', en: 'Livestream' },
 emoji: '🔴',
 color: '#ef4444',
 hint: {
 vi: 'Buổi phát trực tiếp — cần kịch bản khung, không đọc từng chữ.',
 en: 'A live session — needs a loose outline, not a word-for-word script.',
 },
 },
 IDEA: {
 label: { vi: 'Ý tưởng', en: 'Idea' },
 emoji: '💡',
 color: '#94a3b8',
 hint: {
 vi: 'Chưa chốt định dạng — mới chỉ là ý.',
 en: 'Format not decided yet — still just an idea.',
 },
 },
 OTHER: {
 label: { vi: 'Khác', en: 'Other' },
 emoji: '📦',
 color: '#64748b',
 hint: { vi: 'Không thuộc nhóm nào ở trên.', en: 'None of the above.' },
 },
};

/**
 * Display order for type pickers.
 *
 * Teaching formats come first, deliberately: this studio's day job
 * is recording Academy material, so the format the user reaches
 * for most should not be buried under VLOG.
 */
export const TYPE_ORDER: ContentType[] = [
 'LECTURE',
 'EXAM_SOLVING',
 'EXERCISE',
 'PROJECT_BUILD',
 'TUTORIAL',
 'VLOG',
 'CODE_REVIEW',
 'REVIEW',
 'SHORTS',
 'AFFILIATE',
 'LIVESTREAM',
 'IDEA',
 'OTHER',
];

// ─── Scene / shot / platform / phase meta ───────────────────────────────────

export const SCENE_TYPE_META: Record<SceneType, { label: StudioText; short: string; color: string }> = {
 OPENING: { label: { vi: 'Mở màn', en: 'Opening' }, short: 'OP', color: '#a855f7' },
 HOOK: { label: { vi: 'Hook', en: 'Hook' }, short: 'HK', color: '#f43f5e' },
 INTRO: { label: { vi: 'Giới thiệu', en: 'Intro' }, short: 'IN', color: '#3b82f6' },
 BODY: { label: { vi: 'Nội dung', en: 'Body' }, short: 'BD', color: '#94a3b8' },
 BROLL: { label: { vi: 'Cảnh chèn', en: 'B-roll' }, short: 'BR', color: '#22d3ee' },
 CTA: { label: { vi: 'Kêu gọi hành động', en: 'Call to action' }, short: 'CT', color: '#10b981' },
 OUTRO: { label: { vi: 'Kết', en: 'Outro' }, short: 'OU', color: '#f59e0b' },
};

export const SHOT_TYPE_META: Record<ShotType, { label: StudioText; icon: string }> = {
 CLOSEUP: { label: { vi: 'Cận cảnh', en: 'Close-up' }, icon: '◉' },
 MEDIUM: { label: { vi: 'Trung cảnh', en: 'Medium' }, icon: '⊙' },
 WIDE: { label: { vi: 'Toàn cảnh', en: 'Wide' }, icon: '○' },
 POV: { label: { vi: 'Góc nhìn thứ nhất', en: 'POV' }, icon: '◐' },
 OVERHEAD: { label: { vi: 'Từ trên xuống', en: 'Overhead' }, icon: '⬢' },
};

export const PLATFORM_META: Record<ContentPlatform, { label: StudioText; color: string }> = {
 TIKTOK: { label: { vi: 'TikTok', en: 'TikTok' }, color: '#000000' },
 YOUTUBE: { label: { vi: 'YouTube', en: 'YouTube' }, color: '#ff0000' },
 FACEBOOK: { label: { vi: 'Facebook', en: 'Facebook' }, color: '#1877f2' },
 INSTAGRAM: { label: { vi: 'Instagram', en: 'Instagram' }, color: '#e1306c' },
};

export const CHECKLIST_PHASE_META: Record<ChecklistPhase, { label: StudioText; color: string }> = {
 PRE: { label: { vi: 'Trước khi quay', en: 'Pre-production' }, color: '#94a3b8' },
 PRODUCTION: { label: { vi: 'Khi quay', en: 'Production' }, color: '#f59e0b' },
 POST: { label: { vi: 'Hậu kỳ', en: 'Post-production' }, color: '#a855f7' },
 PUBLISH: { label: { vi: 'Đăng tải', en: 'Publish' }, color: '#10b981' },
};

// ─── Idea Status meta ───────────────────────────────────────────────────────
// The four idea lifecycle stages. Colour-coded to feel distinct
// from project status (slightly lighter palette — ideas are softer
// than committed projects).
export const IDEA_STATUS_META: Record<
 IdeaStatus,
 { label: StudioText; color: string; tint: string }
> = {
 CAPTURED: { label: { vi: 'Đã ghi', en: 'Captured' }, color: '#fbbf24', tint: 'rgba(251, 191, 36, 0.12)' },
 REFINED: { label: { vi: 'Đã gọt', en: 'Refined' }, color: '#60a5fa', tint: 'rgba(96, 165, 250, 0.12)' },
 PROMOTED: { label: { vi: 'Đã nâng', en: 'Promoted' }, color: '#10b981', tint: 'rgba(16, 185, 129, 0.12)' },
 ARCHIVED: { label: { vi: 'Đã cất', en: 'Archived' }, color: '#64748b', tint: 'rgba(100, 116, 139, 0.12)' },
};
