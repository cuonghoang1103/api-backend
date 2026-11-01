import type { User } from '../base/entity.ts';

const an: User = { id: 1, createdAt: '2026-11-01T08:00:00Z', email: 'an.nv@fpt.edu.vn', name: 'Nguyen Van An', role: 'STUDENT' };
const fromForm: User = { email: 'binh.tt@fpt.edu.vn', name: 'Tran Thi Binh', role: 'LECTURER' }; // the database sets id + createdAt
an.id = 2;
export { fromForm };
