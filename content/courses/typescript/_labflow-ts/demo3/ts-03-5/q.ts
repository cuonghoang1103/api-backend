// Q1 a parameter typed "| undefined" is still required
function describeSeats(seats: number, note: string | undefined): string {
  return seats + ' seats' + (note === undefined ? '' : ' — ' + note);
}
describeSeats(30);

// Q2 a default replaces undefined, not null
function label(lab: string, note: string | null = '(no note)'): string {
  return lab + ': ' + note;
}
console.log('Q2', label('BE-201'), '|', label('BE-201', undefined), '|', label('BE-201', null));

// Q4 map(parseInt)
console.log('Q4', ['08', '09', '10'].map(parseInt));
