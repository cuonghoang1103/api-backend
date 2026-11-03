type Slot = { kind: 'free' } | { kind: 'booked' } | { kind: 'held' };
function assertNever(x: never): never { throw new Error('unhandled: ' + JSON.stringify(x)); }
export function label(s: Slot): string {
  switch (s.kind) {
    case 'free': return 'open';
    case 'booked': return 'taken';
    // 'held' is not handled — s is not 'never' here, so assertNever refuses it.
    default: return assertNever(s);
  }
}
