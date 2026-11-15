// "Cut a title so that title + '…' fits in maxW pixels" — what src/services/work/reportBuilder.ts › fitText does
// for PDF reports. Width is monotone in the number of characters kept, so: the LONGEST prefix that fits
// = (first k whose prefix does NOT fit) - 1. The real code measures glyphs with a font; here a fixed table.
const W: Record<string, number> = { ' ': 3, i: 3, l: 3, m: 9, w: 9, M: 10, W: 11, '…': 8 };
const width = (s: string) => [...s].reduce((sum, ch) => sum + (W[ch] ?? 6), 0);
let measures = 0;
function firstTrue(lo: number, hi: number, ok: (i: number) => boolean): number {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (ok(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}

// #region fit
function fitText(text: string, maxW: number): string {
  if (width(text) <= maxW) return text;
  const tooWide = (k: number) => { measures++; return width(text.slice(0, k) + '…') > maxW; };   // F...F T...T in k
  const keep = firstTrue(0, text.length + 1, tooWide) - 1;   // last k that fits
  return text.slice(0, Math.max(0, keep)) + '…';
}
// #endregion

const title = 'Weekly report — Sprint 14 — Mobile money transfer module';
for (const maxW of [400, 200, 120, 60, 10]) {
  measures = 0;
  const r = fitText(title, maxW);
  console.log(`maxW=${String(maxW).padStart(3)}: "${r}"  width ${width(r)}  (${measures} measurements, the title has ${title.length} chars)`);
}
