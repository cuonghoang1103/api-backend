const raw: any = JSON.parse('{"seats":"31"}');

const seats: number = raw.seats;   // any: no check
console.log('seats + 1 =', seats + 1);
