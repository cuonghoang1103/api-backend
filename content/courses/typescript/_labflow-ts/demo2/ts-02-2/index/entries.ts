// Object.entries turns an object into a list of [key, value] pairs — tuples.
const minutesByLab = { 'BE-201': 360, 'BE-202': 120, 'AL-301': 0 };

for (const [lab, minutes] of Object.entries(minutesByLab)) {
  console.log(lab.padEnd(7), String(minutes).padStart(3), 'min');
}
const pairs: [number, number][] = Object.entries(minutesByLab);
