// "How full is each lab today?" — a teammate's version. Node runs it; look at BE-202.
const CAPACITY: { [code: string]: number } = { 'BE-201': 40, 'BE-202': 40, 'AL-301': 30 };

export function usageLines(booked: { [code: string]: number }): string[] {
  return Object.keys(CAPACITY).map((code) => code + ' ' + Math.round((booked[code] / CAPACITY[code]) * 100) + '%');
}

console.log(usageLines({ 'BE-201': 36, 'AL-301': 25 }));
