// Node.js — the shape of the stdin boilerplate HackerRank puts in its JavaScript (Node.js) editor:
// collect chunks on 'data', split into lines on 'end', then call main(). We only fill in main().
// #region khuon
process.stdin.resume();
process.stdin.setEncoding('utf-8');
let inputString = '';
let currentLine = 0;
process.stdin.on('data', (chunk) => { inputString += chunk; });
process.stdin.on('end', () => {
  inputString = inputString.split('\n');
  main();
});
function readLine() { return inputString[currentLine++]; }

function main() {
  const n = parseInt(readLine().trim(), 10);
  const a = [];
  while (a.length < n) {                                // numbers may continue on the next lines
    for (const t of readLine().trim().split(/\s+/)) if (t.length > 0) a.push(parseInt(t, 10));
  }
  let sum = 0, max = -Infinity;
  for (const x of a) { sum += x; if (x > max) max = x; }
  console.log(`sum=${sum} max=${max}`);
}
// #endregion
