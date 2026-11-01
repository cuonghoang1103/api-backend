// "May be absent" (?:) is not the same as "present, but maybe undefined" (| undefined).
type Optional = { id: number; cancelledAt?: string };
type MaybeUndefined = { id: number; cancelledAt: string | undefined };

const a: Optional = { id: 1 };                              // fine: the key may be left out
const b: MaybeUndefined = { id: 1 };                        // refused: the key is required
const c: MaybeUndefined = { id: 1, cancelledAt: undefined }; // fine: present, value undefined
const d: Optional = { id: 2, cancelledAt: null };           // refused: null is not undefined

console.log(a, c, 'cancelledAt' in a, 'cancelledAt' in c);
