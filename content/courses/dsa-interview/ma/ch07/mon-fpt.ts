// @java: MonFpt.java
// Real prerequisites of FPTU Software Engineering subjects, copied from the "Pre-Requisite" field of the syllabi in
// content/academy/_syllabus-flm/<CODE>.json (15/11/2026). "X or Y" prerequisites are simplified to the SE route.
// Kahn's algorithm BY LEVELS: level k = subjects whose prerequisites are all in levels < k = the earliest term.
const EDGES: [string, string][] = [   // [before, after]
  ['PRF192', 'PRO192'], ['PRO192', 'CSD201'], ['PRO192', 'LAB211'], ['PRO192', 'PRJ301'], ['DBI202', 'PRJ301'],
  ['PRO192', 'SWE201c'], ['PRJ301', 'SWP391'], ['SWE201c', 'SWP391'], ['LAB211', 'SWP391'], ['WED201c', 'FER202'],
  ['FER202', 'SDN302'], ['DBI202', 'SDN302'], ['FER202', 'MMA301'], ['PRO192', 'PRN212'], ['DBI202', 'PRN212'],
  ['SWE201c', 'SWT301'], ['SWE201c', 'SWR302'], ['JPD113', 'JPD123'],
];

// #region tang
function levels(edges: [string, string][]): { levels: string[][]; stuck: string[] } {
  const out = new Map<string, string[]>(), indeg = new Map<string, number>();
  for (const [a, b] of edges) for (const x of [a, b]) if (!out.has(x)) { out.set(x, []); indeg.set(x, 0); }
  for (const [a, b] of edges) { out.get(a)!.push(b); indeg.set(b, indeg.get(b)! + 1); }
  let level = [...indeg.keys()].filter((x) => indeg.get(x) === 0).sort();
  const result: string[][] = [];
  let done = 0;
  while (level.length > 0) {
    result.push(level);
    done += level.length;
    const next: string[] = [];
    for (const u of level) for (const v of out.get(u)!) {
      indeg.set(v, indeg.get(v)! - 1);
      if (indeg.get(v) === 0) next.push(v);
    }
    level = next.sort();                                   // sorted only to make the output stable
  }
  const stuck = [...indeg.keys()].filter((x) => indeg.get(x)! > 0).sort();
  return { levels: result, stuck };
}
// #endregion

const r = levels(EDGES);
r.levels.forEach((l, i) => console.log(`term ${i + 1}: ${l.join(', ')}`));
console.log(`subjects: ${r.levels.flat().length}, minimum terms: ${r.levels.length}, stuck: ${JSON.stringify(r.stuck)}`);
// A typo in a curriculum file: "PRO192 requires SWP391" closes a loop PRO192 → PRJ301 → SWP391 → PRO192.
const bad = levels([...EDGES, ['SWP391', 'PRO192']]);
console.log(`with the typo: ${bad.levels.flat().length} subjects placed, stuck: ${JSON.stringify(bad.stuck)}`);
