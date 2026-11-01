// Solution: handle the missing case; the never check stays for the next one.
export type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export function statusLabel(status: Status): string {
  switch (status) {
    case 'PENDING': return 'Chờ duyệt';
    case 'CONFIRMED': return 'Đã xác nhận';
    case 'CANCELLED': return 'Đã huỷ';
    default: {
      const unreachable: never = status;
      throw new Error('Unknown status: ' + String(unreachable));
    }
  }
}

const all: Status[] = ['PENDING', 'CONFIRMED', 'CANCELLED'];
for (const s of all) console.log(s, '→', statusLabel(s));
