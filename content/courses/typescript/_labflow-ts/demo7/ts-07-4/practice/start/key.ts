type Resource = 'lab' | 'booking' | 'user';
type Method = 'get' | 'create' | 'delete';

// permissionKey should be "<resource>:<method>", but it is typed string, so any string slips.
export type PermissionKey = string;

const ok: PermissionKey = 'lab:get';
const bad: PermissionKey = 'labget';   // no separator — should be a type error, but string accepts it
export { ok, bad };
