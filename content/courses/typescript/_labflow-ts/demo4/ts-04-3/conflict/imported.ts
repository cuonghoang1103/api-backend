import type { User } from '../base/entity.ts';

// The same mistake as ImportedUser, written with & instead of extends.
export type ImportedUser = User & { id: string };   // no error here

const u: ImportedUser = {
  id: 'U-0007',
  createdAt: '2026-11-01T08:00:00Z',
  email: 'chi.lt@fpt.edu.vn',
  name: 'Le Thi Chi',
  role: 'STUDENT',
};
export { u };
