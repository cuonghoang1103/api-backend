type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED'; // EXPIRED added

// No assertNever: a friendly catch-all. tsc is happy; EXPIRED silently becomes 'grey'.
export function colour(s: Status): string {
  switch (s) {
    case 'PENDING':   return 'amber';
    case 'CONFIRMED': return 'green';
    case 'CANCELLED': return 'grey';
    default:          return 'grey';
  }
}

console.log('EXPIRED shows as:', colour('EXPIRED'));
