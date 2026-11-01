// authz-matrix.mjs — bài 6.2: thử MỌI người dùng × MỌI lượt đặt trên một endpoint, so với chính sách mong đợi
const BASE = 'http://localhost:4000/v2';
const PEOPLE = [['usr_1', 'an@student.labflow.example', 'an-lab-2026', 'STUDENT'],
  ['usr_2', 'binh@student.labflow.example', 'binh-lab-2026', 'STUDENT'],
  ['usr_3', 'lan@labflow.example', 'lan-lab-2026', 'LAB_MANAGER']];
const login = async (email, password) =>
  (await (await fetch(`${BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }) })).json()).accessToken;

const owners = {};                                    // ai sở hữu lượt đặt nào — hỏi bằng tài khoản quản lý
const lan = await login(PEOPLE[2][1], PEOPLE[2][2]);
for (const b of (await (await fetch(`${BASE}/bookings?limit=100`, { headers: { Authorization: `Bearer ${lan}` } })).json()).data) owners[b.id] = b.userId;
const ids = Object.keys(owners).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));

let violations = 0;
for (const [id, email, password, role] of PEOPLE) {
  const token = await login(email, password);
  const cells = [];
  for (const bk of ids) {
    const status = (await fetch(`${BASE}/bookings/${bk}/receipt`, { headers: { Authorization: `Bearer ${token}` } })).status;
    const expected = role === 'LAB_MANAGER' || owners[bk] === id ? 200 : 404;
    if (status !== expected) violations++;
    cells.push(`${bk.slice(3)}:${status}${status === expected ? '' : '✗'}`);
  }
  console.log(`${id} ${role.padEnd(11)} ${cells.join(' ')}`);
}
console.log(violations ? `✗ ${violations} ô sai chính sách` : '✓ 0 ô sai chính sách');
