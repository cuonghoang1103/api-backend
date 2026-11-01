// One day of lab BE-201, in the order the bookings were MADE (id 1 first).
// range = [start, end] in minutes since 00:00 — 480 is 08:00.
export type ScheduleEntry = { id: number; lab: string; range: [number, number]; bookedBy: string };

export function today(): ScheduleEntry[] {
  return [
    { id: 1, lab: 'BE-201', range: [780, 900], bookedBy: 'An' },     // 13:00–15:00
    { id: 2, lab: 'BE-201', range: [480, 600], bookedBy: 'Binh' },   // 08:00–10:00
    { id: 3, lab: 'BE-201', range: [600, 720], bookedBy: 'Chi' },    // 10:00–12:00
  ];
}
