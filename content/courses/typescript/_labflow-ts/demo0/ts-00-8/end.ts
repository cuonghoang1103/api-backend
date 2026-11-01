// The same function in TypeScript: two type annotations added, nothing else changed.
function endMinute(startMinute: number, length: number): number {
  return startMinute + length;
}

console.log(endMinute(480, 120));   // 08:00 + 2 hours
console.log(endMinute('480', 120)); // the start came from a form field: a string
