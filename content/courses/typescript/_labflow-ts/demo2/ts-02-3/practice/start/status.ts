// A booking's status, shown to the user in Vietnamese.
export type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export function statusLabel(status: Status): string {
  switch (status) {
    case 'PENDING': return 'Chờ duyệt';
    case 'CONFIRMED': return 'Đã xác nhận';
    default: return '?';
  }
}

const all: Status[] = ['PENDING', 'CONFIRMED', 'CANCELLED'];
for (const s of all) console.log(s, '→', statusLabel(s));
