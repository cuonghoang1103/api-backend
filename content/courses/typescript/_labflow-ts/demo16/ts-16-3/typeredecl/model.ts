// A type alias cannot be declared twice.
type User = { id: number };
type User = { name: string };
export const u: User = { id: 1 };
