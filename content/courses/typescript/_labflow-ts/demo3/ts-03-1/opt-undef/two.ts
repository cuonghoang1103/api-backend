// Two signatures that LOOK the same.
export function a(start: number, end?: number): number { return end ?? start; }
export function b(start: number, end: number | undefined): number { return end ?? start; }

a(480);
b(480);
b(480, undefined);
