// chay: tay — an id in the URL is not permission. Two versions of GET /api/notes/:id, called as user "an" (Node 22).
// node content/courses/web-foundations/_demo/_t6/idor.mjs > content/courses/web-foundations/_demo/_t6/out/idor.out.txt
import http from 'node:http';

const notes = [
  { id: 12, owner: 'an', text: 'Buy milk' },
  { id: 13, owner: 'binh', text: 'Bank PIN hint: birthday' },
];
const userFrom = (req) => ({ 'token-an': 'an', 'token-binh': 'binh' })[req.headers.authorization?.replace('Bearer ', '')];

function app(checkOwner) {
  return http.createServer((req, res) => {
    const user = userFrom(req);
    if (!user) { res.writeHead(401); return res.end(); }
    const id = Number(req.url.split('/').pop());                       // '/api/notes/13' → 13
    const note = checkOwner
      ? notes.find((n) => n.id === id && n.owner === user)              // ✅ exists AND belongs to the caller
      : notes.find((n) => n.id === id);                                 // ❌ only "does it exist?"
    if (!note) { res.writeHead(404, { 'Content-Type': 'application/json' }); return res.end('{"error":"Not found"}'); }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(note));
  });
}

for (const [label, checkOwner] of [['without owner check', false], ['with owner check', true]]) {
  const server = app(checkOwner);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  console.log(`--- ${label} — logged in as "an" ---`);
  for (const id of [12, 13]) {
    const res = await fetch(`${base}/api/notes/${id}`, { headers: { Authorization: 'Bearer token-an' } });
    console.log(`GET /api/notes/${id} → ${res.status} ${await res.text()}`);
  }
  server.close();
}
