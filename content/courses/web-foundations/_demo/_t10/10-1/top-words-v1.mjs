// Lesson 10.1 — the FIRST version: written in one go, before thinking about edge cases
export function topWords(text, n = 3) {
  const counts = {};
  for (const w of text.split(' ')) counts[w] = (counts[w] || 0) + 1;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([word, count]) => ({ word, count }));
}
