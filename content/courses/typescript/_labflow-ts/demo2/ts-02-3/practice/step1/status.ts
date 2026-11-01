// Step 1: the default branch now PROVES that nothing is left.
export type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export function statusLabel(status: Status): string {
  switch (status) {
    case 'PENDING': return 'Chờ duyệt';
    case 'CONFIRMED': return 'Đã xác nhận';
    default: {
      const unreachable: never = status;
      throw new Error('Unknown status: ' + String(unreachable));
    }
  }
}

const all: Status[] = ['PENDING', 'CONFIRMED', 'CANCELLED'];
for (const s of all) console.log(s, '→', statusLabel(s));
