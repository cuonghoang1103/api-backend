// The JavaScript version: no types, no default branch.
export function slotMessage(code) {
  switch (code) {
    case 'OFF_GRID': return 'Start and end must be on the 30-minute grid.';
    case 'END_BEFORE_START': return 'The end time must be after the start time.';
    case 'OUTSIDE_HOURS': return 'LabFlow is open from 07:00 to 21:00.';
    case 'TOO_LONG': return 'A booking can last at most 4 hours.';
  }
}

// The new code arrives from the server one day:
console.log('Booking refused: ' + slotMessage('TOO_LONG'));
console.log('Booking refused: ' + slotMessage('LAB_CLOSED'));
