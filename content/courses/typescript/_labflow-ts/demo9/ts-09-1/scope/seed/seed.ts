import type { ContentType } from '../src/content.ts';
// This still uses the OLD value 'CODE' — but it is outside the project, so tsc never looks.
export const rows: { type: ContentType }[] = [{ type: 'CODE' }];
