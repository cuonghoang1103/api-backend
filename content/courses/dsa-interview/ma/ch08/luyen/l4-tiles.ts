// @java: L4Tiles.java
// LC 1079 · Letter Tile Possibilities — count every non-empty sequence; choose by LETTER, not by tile.

// #region giai
function numTilePossibilities(tiles: string): number {
  const cnt = new Array<number>(26).fill(0);
  for (const ch of tiles) cnt[ch.charCodeAt(0) - 65]++;
  function bt(): number {
    let total = 0;
    for (let c = 0; c < 26; c++) {
      if (cnt[c] === 0) continue;
      cnt[c]--;                  // choose letter c for the next position
      total += 1 + bt();         // the sequence ending here (1) + every longer one that starts with it
      cnt[c]++;                  // unchoose
    }
    return total;
  }
  return bt();
}
// #endregion

for (const t of ['AAB', 'AAABBC', 'V', 'ABCDEFG']) console.log('"' + t + '" -> ' + numTilePossibilities(t));
