type Resource = 'lab' | 'booking' | 'user';
type Method = 'get' | 'create' | 'delete';

export type PermissionKey = `${Resource}:${Method}`;

const ok: PermissionKey = 'lab:get';
const bad: PermissionKey = 'labget';   // now a type error — no 'labget' in the union
export { ok, bad };
