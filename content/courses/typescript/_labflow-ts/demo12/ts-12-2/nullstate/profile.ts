import { useState } from './react.ts';
type User = { id: number; name: string };
// Explicit <User | null>: the state starts empty but can hold a User later.
const [user] = useState<User | null>(null);
// Reading .name without checking — the state might still be null.
export const label = user.name;
