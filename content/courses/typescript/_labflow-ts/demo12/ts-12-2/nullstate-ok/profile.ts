import { useState, useRef } from './react.ts';
type User = { id: number; name: string };
const [user, setUser] = useState<User | null>(null);
const inputRef = useRef<{ focus(): void }>(null);
// Narrow before reading; the ref's .current is also T | null.
export const label = user === null ? 'guest' : user.name;
export function focus(): void { inputRef.current?.focus(); }
setUser({ id: 1, name: 'Mai' });
console.log('label:', label);
