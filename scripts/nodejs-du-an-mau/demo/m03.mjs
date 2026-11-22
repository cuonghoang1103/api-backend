import http from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { EventEmitter } from 'node:events';

const FILE = new URL('./plants.json', import.meta.url);
const events = new EventEmitter();
events.on('plant.created', (p) => console.log('[event] plant.created', p.name));

async function load() { try { return JSON.parse(await readFile(FILE, 'utf8')); } catch { return []; } }
async function readBody(req) { const chunks = []; for await (const c of req) chunks.push(c); return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); }
function send(res, status, data) { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(data)); }

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/plants') return send(res, 200, await load());
  if (req.method === 'POST' && req.url === '/plants') {
    const body = await readBody(req);
    const list = await load();
    const plant = { id: list.length + 1, name: body.name };
    list.push(plant); await writeFile(FILE, JSON.stringify(list, null, 2));
    events.emit('plant.created', plant);
    return send(res, 201, plant);
  }
  send(res, 404, { error: 'Not found' });
});

await writeFile(FILE, '[]');
server.listen(3003, async () => {
  const base = 'http://localhost:3003';
  let r = await fetch(base + '/plants', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Monstera' }) });
  console.log('POST /plants ->', r.status, await r.text());
  r = await fetch(base + '/plants'); console.log('GET  /plants ->', r.status, await r.text());
  r = await fetch(base + '/nope'); console.log('GET  /nope   ->', r.status, await r.text());
  server.close();
});
