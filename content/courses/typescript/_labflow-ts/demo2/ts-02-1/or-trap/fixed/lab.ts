// capacity: null = not recorded yet (use the default), 0 = closed for maintenance.
export type Lab = { code: string; capacity: number | null };
export const DEFAULT_CAPACITY = 40;

export function capacityOf(lab: Lab): number {
  return lab.capacity ?? DEFAULT_CAPACITY;
}

export function noteOf(note: string | null): string {
  return note ?? '(no note)';
}
