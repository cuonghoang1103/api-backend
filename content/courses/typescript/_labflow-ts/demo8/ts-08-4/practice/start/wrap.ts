function checkSlot(start: string, end: string): { ok: boolean; minutes: number } {
  return { ok: true, minutes: 120 };
}

// The return type is re-declared by hand and has drifted — minutes is string here.
export function logged(start: string, end: string): { ok: boolean; minutes: string } {
  return checkSlot(start, end);
}
