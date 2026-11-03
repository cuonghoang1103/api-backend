// Still a hand-copied union — self-consistent, so tsc passes, but it will drift again.
type ContentType = 'VLOG' | 'BLOG' | 'CODE_REVIEW';
export const rows: { type: ContentType }[] = [{ type: 'CODE_REVIEW' }];
