type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

// Record<Status, string> forces a label for every status — CANCELLED can't be forgotten.
const LABELS: Record<Status, string> = { PENDING: 'Chờ', CONFIRMED: 'Đã nhận', CANCELLED: 'Đã huỷ' };
function label(s: Status): string { return LABELS[s]; }
console.log(label('CANCELLED'));
