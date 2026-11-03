type LabCode = 'BE-201' | 'BE-202' | 'AL-301';

// Record<Keys, Value> is a mapped type over a union of keys — one entry per key (4.4, 5.4).
type SeatMap = { [K in LabCode]: number };     // same as Record<LabCode, number>

const seats: SeatMap = { 'BE-201': 40, 'BE-202': 40, 'AL-301': 30 };
console.log(seats['AL-301']);
