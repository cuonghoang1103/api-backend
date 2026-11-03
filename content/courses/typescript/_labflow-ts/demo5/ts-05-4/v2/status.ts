type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED'; // a product manager added EXPIRED

function assertNever(x: never): never {
  throw new Error('Unhandled status: ' + String(x));
}

export function colour(s: Status): string {
  switch (s) {
    case 'PENDING':   return 'amber';
    case 'CONFIRMED': return 'green';
    case 'CANCELLED': return 'grey';
    default:          return assertNever(s); // s is now 'EXPIRED', not never
  }
}
