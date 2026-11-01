type User = { readonly id: number; name: string };
const users: User[] = [{ id: 1, name: 'Nguyen Van An' }, { id: 2, name: 'Tran Thi Binh' }];

// Ids arrive at runtime: an open key set. Two ways to index.
const byId: Record<number, User> = {};
for (const u of users) byId[u.id] = u;

const byIdMap = new Map<number, User>();
for (const u of users) byIdMap.set(u.id, u);

console.log(byId[2]?.name, byIdMap.get(2)?.name);
console.log(byId[99], byIdMap.get(99), byIdMap.size, Object.keys(byId));
const name: string = byId[2].name;
