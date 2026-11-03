// Branches are checked from top to bottom. The first true one wins.
function gradeWrong(score) {
  if (score >= 5) return 'Pass';
  if (score >= 8) return 'Good';    // never reached
  return 'Fail';
}
function gradeRight(score) {
  if (score >= 8) return 'Good';
  if (score >= 5) return 'Pass';
  return 'Fail';
}
for (const s of [9, 6, 3]) console.log(s, gradeWrong(s), gradeRight(s));
