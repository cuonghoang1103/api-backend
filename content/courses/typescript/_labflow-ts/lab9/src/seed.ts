// A hand-copied union — it still says 'CODE', but content.ts renamed it to 'CODE_REVIEW'.
// It type-checks against its own copy, so the drift is invisible until it breaks at run time.
type ContentType = 'VLOG' | 'BLOG' | 'CODE';
export const rows: { type: ContentType }[] = [{ type: 'CODE' }];
