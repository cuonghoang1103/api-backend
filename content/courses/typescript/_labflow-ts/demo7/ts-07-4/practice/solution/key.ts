type Resource = 'lab' | 'booking' | 'user';
type Method = 'get' | 'create' | 'delete';

export type PermissionKey = `${Resource}:${Method}`;

const ok: PermissionKey = 'lab:get';
const another: PermissionKey = 'booking:delete';
console.log(ok, another);
