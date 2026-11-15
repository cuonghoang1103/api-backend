// @java: LichThi.java
// Real life: put exams into time slots so that no student has two exams in the same slot.
// Exams = nodes, "share at least one student" = edge, slot = colour. Backtracking graph colouring.

// #region xep
function schedule(nExams: number, conflicts: [number, number][], slots: number): number[] | null {
  const adj: number[][] = Array.from({ length: nExams }, () => []);
  for (const [a, b] of conflicts) { adj[a].push(b); adj[b].push(a); }
  const slotOf = new Array<number>(nExams).fill(-1);
  function bt(e: number): boolean {
    if (e === nExams) return true;                         // every exam has a slot
    for (let s = 0; s < slots; s++) {
      if (adj[e].some((o) => slotOf[o] === s)) continue;   // prune: a conflicting exam already sits in slot s
      slotOf[e] = s;                                       // choose
      if (bt(e + 1)) return true;
      slotOf[e] = -1;                                      // unchoose
    }
    return false;
  }
  return bt(0) ? slotOf : null;
}
// #endregion

const exams = ['SWT301', 'FER202', 'SWR302', 'JPD123', 'LAB211', 'MAS291'];
// Pairs of exams that share at least one student (made-up data in the shape of a real term).
const conflicts: [number, number][] = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [3, 4], [4, 0], [5, 0], [5, 2], [4, 5]];
for (const slots of [2, 3]) {
  const plan = schedule(exams.length, conflicts, slots);
  if (!plan) { console.log(slots + ' slots: impossible'); continue; }
  console.log(slots + ' slots: ' + exams.map((x, i) => x + '->' + (plan[i] + 1)).join(', '));
}
