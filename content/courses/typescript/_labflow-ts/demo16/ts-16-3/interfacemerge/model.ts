// Two interfaces of the same name MERGE — useful for augmenting a library type.
interface User { id: number; }
interface User { name: string; }
const u: User = { id: 1, name: 'Mai' };
console.log(u.id, u.name);
