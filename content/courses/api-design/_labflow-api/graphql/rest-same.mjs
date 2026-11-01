// graphql/rest-same.mjs — lấy ĐÚNG dữ liệu như câu GraphQL (phòng + thiết bị + 3 lượt đặt) bằng REST /v2
const B = 'http://localhost:4000/v2';
let calls = 0, bytes = 0;
const get = async (path, token) => {
  calls++;
  const text = await (await fetch(B + path, { headers: token ? { Authorization: `Bearer ${token}` } : {} })).text();
  bytes += text.length;
  return JSON.parse(text);
};
const login = await (await fetch(`${B}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'lan@labflow.example', password: 'lan-lab-2026' }) })).json();
const t0 = performance.now();
const { data: labs } = await get('/labs');
await Promise.all(labs.map(async (l) => {
  l.devices = (await get(`/labs/${l.id}/devices`)).data;
  l.bookings = (await get(`/bookings?labId=${l.id}&limit=3&sort=start`, login.accessToken)).data;
}));
console.log(`REST: ${calls} request · ${bytes} byte · ${(performance.now() - t0).toFixed(1)} ms`);
