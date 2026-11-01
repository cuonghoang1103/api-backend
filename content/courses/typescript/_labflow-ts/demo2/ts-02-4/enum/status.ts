// The erasable way: an ordinary object (it exists at runtime) + a type derived from it.
export const STATUS = { Pending: 'PENDING', Confirmed: 'CONFIRMED' } as const;
export type Status = (typeof STATUS)[keyof typeof STATUS];   // 'PENDING' | 'CONFIRMED'

export function label(s: Status): string {
  return s === STATUS.Pending ? 'waiting for approval' : 'confirmed';
}

console.log(STATUS.Pending, '·', label('CONFIRMED'), '·', Object.values(STATUS));
