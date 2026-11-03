import type { ContentType } from './content.ts';
// Import the real type — a renamed value is now a compile error, not a run-time break.
export const rows: { type: ContentType }[] = [{ type: 'CODE_REVIEW' }];
