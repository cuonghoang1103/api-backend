// The classic TypeScript trap when building an adjacency list: Array(n).fill([]) puts the SAME array in every slot.

// #region sai
const wrong: number[][] = new Array(3).fill([]);
wrong[0].push(1);                       // add edge 0 → 1 …
console.log('fill([])        :', JSON.stringify(wrong), ' wrong[0] === wrong[2]?', wrong[0] === wrong[2]);
// #endregion

// #region dung
const right: number[][] = Array.from({ length: 3 }, () => []);   // the factory runs once PER slot
right[0].push(1);
console.log('Array.from(()=>[]):', JSON.stringify(right), ' right[0] === right[2]?', right[0] === right[2]);
// #endregion

// The same trap in 2-D: a visited grid built with fill(new Array(...)) shares ONE row.
const grid: boolean[][] = new Array(2).fill(new Array(3).fill(false));
grid[0][1] = true;
console.log('visited grid via fill:', JSON.stringify(grid));
