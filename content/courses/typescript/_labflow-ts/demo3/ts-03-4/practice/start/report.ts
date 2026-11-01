// Collect the problems of one booking into a small report, then print it.
import type { Problem } from '../../lost/validator.ts';

type Report = { title: string; lines: string[]; add(line: string): void; print(): void };

const report: Report = {
  title: 'Booking BE-201 08:15–10:00',
  lines: [],
  add(line) {
    this.lines.push(line);
  },
  print() {
    console.log(this.title);
    for (const line of this.lines) console.log('  - ' + line);
  },
};

const problems: Problem[] = [
  { code: 'OFF_GRID', message: '08:15 is not on the 30-minute grid' },
  { code: 'TOO_MANY_SEATS', message: 'At most 40 seats' },
];
problems.map((p) => p.message).forEach(report.add);
report.print();
