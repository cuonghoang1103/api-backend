type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED'; // EXPIRED added

// A closed table keyed by the union: a new status with no entry is a compile error.
const LABEL: Record<Status, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
};
export { LABEL };
