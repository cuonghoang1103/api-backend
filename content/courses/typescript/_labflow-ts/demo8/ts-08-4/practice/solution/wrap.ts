function checkSlot(start: string, end: string): { ok: boolean; minutes: number } {
  return { ok: true, minutes: 120 };
}

// Derive the return type with ReturnType — the wrapper tracks checkSlot.
export function logged(start: string, end: string): ReturnType<typeof checkSlot> {
  return checkSlot(start, end);
}
