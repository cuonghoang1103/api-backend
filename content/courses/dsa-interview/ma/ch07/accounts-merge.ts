// @java: AccountsMerge.java
// LC 721 · Accounts Merge — accounts that share ANY e-mail belong to one person: union the e-mails of each account.

// #region giai
function accountsMerge(accounts: string[][]): string[][] {
  const id = new Map<string, number>();            // e-mail → integer id, so the DSU can use arrays
  const owner = new Map<string, string>();         // e-mail → name
  for (const acc of accounts) for (const e of acc.slice(1)) {
    if (!id.has(e)) id.set(e, id.size);
    owner.set(e, acc[0]);
  }
  const parent = Array.from({ length: id.size }, (_, i) => i);
  const find = (x: number): number => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };   // path halving
  for (const acc of accounts) {
    const first = id.get(acc[1])!;
    for (const e of acc.slice(2)) parent[find(id.get(e)!)] = find(first);   // every e-mail of an account ~ its first
  }
  const groups = new Map<number, string[]>();
  for (const [e, i] of id) {
    const r = find(i);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r)!.push(e);
  }
  const out = [...groups.values()].map((g) => { g.sort(); return [owner.get(g[0])!, ...g]; });
  return out.sort((a, b) => (a[0] + a[1] < b[0] + b[1] ? -1 : 1));   // order of groups is free on LeetCode; fixed here
}
// #endregion

console.log(JSON.stringify(accountsMerge([
  ['John', 'johnsmith@mail.com', 'john_newyork@mail.com'],
  ['John', 'johnsmith@mail.com', 'john00@mail.com'],
  ['Mary', 'mary@mail.com'],
  ['John', 'johnnybravo@mail.com'],
])));
console.log(JSON.stringify(accountsMerge([
  ['Lan', 'a@x.vn', 'b@x.vn'], ['Lan', 'c@x.vn'], ['Lan', 'c@x.vn', 'b@x.vn'],
])));
