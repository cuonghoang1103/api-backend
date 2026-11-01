// The single source of truth for post types (like the enum in prisma/schema.prisma).
// 8 Aug 2026: the value CODE was renamed to CODE_REVIEW, here and everywhere it was imported.
export type ContentType = 'VLOG' | 'ARTICLE' | 'CODE_REVIEW' | 'QUIZ';
