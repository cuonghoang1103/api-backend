export function sameText(a: string | number, b: string): boolean {
  if (a === b) {
    // a must be the string branch here — it just equalled a string.
    return a.length === b.length;
  }
  return false;
}

console.log(sameText('BE-201', 'BE-201'));
console.log(sameText(201, 'BE-201'));
