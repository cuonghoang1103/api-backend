// A lab id comes from two places: the URL (a string) and an old table (a number).
function badge(id) {
  return 'LAB-' + id.padStart(4, '0');
}
console.log(badge('42'));   // from the URL
console.log(badge(42));     // from the old table
