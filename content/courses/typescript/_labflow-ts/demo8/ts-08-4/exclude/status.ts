type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

// Exclude removes members from a union — the states a booking can still move to.
type Active = Exclude<Status, 'CANCELLED'>;
const next: Active = 'CANCELLED';
console.log(next);
