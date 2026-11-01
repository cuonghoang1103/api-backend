// An index signature: ANY string key, each value a Lab.
type Lab = { name: string; capacity: number };

export const LAB_INFO: { [code: string]: Lab } = {
  'BE-201': { name: 'Backend Lab 1', capacity: 40 },
  'BE-202': { name: 'Backend Lab 2', capacity: 40 },
  'AL-301': { name: 'AI Lab', capacity: 30 },
};

export function freeSeats(code: string, booked: number): number {
  return LAB_INFO[code].capacity - booked;
}

console.log('AL-301:', freeSeats('AL-301', 10));
console.log('BE-999:', freeSeats('BE-999', 10));
