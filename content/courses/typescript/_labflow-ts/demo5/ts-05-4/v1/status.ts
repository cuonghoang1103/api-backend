type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

function assertNever(x: never): never {
  throw new Error('Unhandled status: ' + String(x));
}

// Every case returns; the default hands an impossible value to assertNever.
export function colour(s: Status): string {
  switch (s) {
    case 'PENDING':   return 'amber';
    case 'CONFIRMED': return 'green';
    case 'CANCELLED': return 'grey';
    default:          return assertNever(s); // s has type never here
  }
}

console.log(colour('PENDING'), colour('CANCELLED'));
