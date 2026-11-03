type LabCode = 'BE-201' | 'BE-202' | 'AL-301';

// Leave one lab out and it is a compile error — the table must cover every key.
const seats: Record<LabCode, number> = { 'BE-201': 40, 'BE-202': 24 };
console.log(seats);
