// Milestone 6 starter: a tiny REST API with no library (node:http).
// Sample topic: "Recipe notebook". Replace "recipes" with your own resource.
import http from 'node:http';

const PORT = Number(process.env.PORT || 3471);
let nextId = 3;
const recipes = [
  { id: 1, name: 'Pho bo', minutes: 90, category: 'main' },
  { id: 2, name: 'Banh flan', minutes: 40, category: 'dessert' },
];

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body === undefined ? '' : JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => { raw += c; if (raw.length > 10000) reject(new Error('too big')); });
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error('bad json')); } });
  });
}

// One rule set for create AND update, so the two can never disagree.
function validate(input, partial) {
  const errors = {};
  if (!partial || 'name' in input) {
    if (typeof input.name !== 'string' || input.name.trim().length < 2) errors.name = 'at least 2 characters';
  }
  if (!partial || 'minutes' in input) {
    if (!Number.isInteger(input.minutes) || input.minutes <= 0) errors.minutes = 'a positive whole number';
  }
  return errors;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const match = url.pathname.match(/^\/api\/recipes(?:\/(\d+))?$/);
  if (!match) return send(res, 404, { error: 'route not found' });
  const id = match[1] ? Number(match[1]) : null;
  const found = id ? recipes.find((r) => r.id === id) : null;
  if (id && !found) return send(res, 404, { error: 'recipe ' + id + ' not found' });

  try {
    if (req.method === 'GET' && !id) {
      const q = (url.searchParams.get('q') || '').toLowerCase();
      const limit = Math.min(Number(url.searchParams.get('limit')) || 20, 100);
      const items = recipes.filter((r) => r.name.toLowerCase().includes(q)).slice(0, limit);
      return send(res, 200, { items, total: items.length });
    }
    if (req.method === 'GET') return send(res, 200, found);
    if (req.method === 'POST' && !id) {
      const input = await readJson(req);
      const errors = validate(input, false);
      if (Object.keys(errors).length) return send(res, 400, { errors });
      const recipe = { id: nextId++, name: input.name.trim(), minutes: input.minutes, category: input.category || 'main' };
      recipes.push(recipe);
      return send(res, 201, recipe);
    }
    if (req.method === 'PATCH' && id) {
      const input = await readJson(req);
      const errors = validate(input, true);
      if (Object.keys(errors).length) return send(res, 400, { errors });
      // Copy only the fields a client may change. Object.assign(found, input) would let
      // a request body like {"id": 1} overwrite the id (mass assignment).
      for (const key of ['name', 'minutes', 'category']) if (key in input) found[key] = input[key];
      return send(res, 200, found);
    }
    if (req.method === 'DELETE' && id) {
      recipes.splice(recipes.indexOf(found), 1);
      return send(res, 204);
    }
    return send(res, 405, { error: req.method + ' not allowed here' });
  } catch (err) {
    return send(res, 400, { error: err.message });
  }
});

server.listen(PORT, () => console.log('API on http://localhost:' + PORT));
