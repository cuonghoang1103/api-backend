type LabCode = 'BE-201' | 'BE-202' | 'AL-301';

// Record<Keys, V> builds a table with one entry per key — and tsc checks it is complete.
const seats: Record<LabCode, number> = { 'BE-201': 40, 'BE-202': 24, 'AL-301': 30 };

console.log(seats['AL-301']);
