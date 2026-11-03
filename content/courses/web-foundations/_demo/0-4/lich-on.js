// Spaced repetition: review a lesson again after 1, 3, 7, 14 and 30 days.
const start = new Date(2026, 10, 2);   // 2 Nov 2026 (months count from 0)
const gaps = [1, 3, 7, 14, 30];
const fmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
console.log('learned 0.4 on', fmt.format(start));
for (const g of gaps) {
  const d = new Date(start);
  d.setDate(d.getDate() + g);
  console.log(`+${String(g).padStart(2)} days → review on ${fmt.format(d)}`);
}
