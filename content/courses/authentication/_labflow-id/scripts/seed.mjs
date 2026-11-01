// scripts/seed.mjs — create the three LabFlow users through the real sign-up endpoint (server must be running).
const BASE = process.env.BASE ?? 'http://localhost:4800';
const USERS = [
  { email: 'an@student.labflow.example', password: 'an-lab-2026', name: 'Nguyen Van An' },
  { email: 'binh@student.labflow.example', password: '123456', name: 'Tran Thi Binh' },
  { email: 'lan@labflow.example', password: 'lan-lab-2026', name: 'Co Lan' },
];
for (const u of USERS) {
  const res = await fetch(BASE + '/sign-up', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(u),
  });
  console.log(res.status, u.email, JSON.stringify(await res.json()));
}
