// Lesson 10.1 — "the 3 most common words in a post", built one small step at a time
const STOP = new Set(['the', 'a', 'an', 'is', 'and', 'of', 'to', 'in', 'it']);

export function topWords(text, n = 3) {
  const words = text.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? [];   // 1. split into words (letters in any language)
  const counts = new Map();
  for (const w of words) {                                          // 2. count, skipping stop words
    if (!STOP.has(w)) counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return [...counts]                                                // 3. sort: most frequent first,
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))        //    ties in alphabetical order
    .slice(0, n)                                                    // 4. keep the first n
    .map(([word, count]) => ({ word, count }));
}

// trace: run the plan by hand on one example, printing what each step produced
if (process.argv[2] === '--trace') {
  const text = 'The cache is fast. The cache is small; a small cache is a fast cache!';
  const words = text.toLowerCase().match(/[\p{L}\p{N}']+/gu);
  console.log('1. words  ', JSON.stringify(words));
  const kept = words.filter((w) => !STOP.has(w));
  console.log('2. kept   ', JSON.stringify(kept));
  const counts = new Map();
  for (const w of kept) counts.set(w, (counts.get(w) ?? 0) + 1);
  console.log('3. counts ', JSON.stringify([...counts]));
  console.log('4. top 3  ', JSON.stringify(topWords(text)));
}
