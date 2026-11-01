// src/hello.ts — the first TypeScript file of LabFlow TS.
export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}

const lab: string = process.env.LAB ?? 'BE-201';
const opensAt: number = 7 * 60;
console.log('Lab ' + lab + ' opens at ' + formatTime(opensAt));
