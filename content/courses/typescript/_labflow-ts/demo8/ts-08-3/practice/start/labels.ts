type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

// A plain object map: CANCELLED was forgotten, and nothing warns.
const LABELS: { [k: string]: string } = { PENDING: 'Chờ', CONFIRMED: 'Đã nhận' };
function label(s: Status): string { return LABELS[s] ?? s; }
console.log(label('CANCELLED'));
