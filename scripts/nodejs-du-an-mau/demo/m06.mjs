import express from 'express';
import { z } from 'zod';

const PlantIn = z.object({ name: z.string().trim().min(2).max(60), everyDays: z.number().int().min(1).max(90) });
const ListQuery = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(50).default(10), sort: z.enum(['name', '-name']).default('name') });

const db = ['Monstera', 'Cactus', 'Basil', 'Fern', 'Aloe'].map((name, i) => ({ id: i + 1, name, everyDays: 7 }));
const app = express();
app.use(express.json());
app.post('/plants', (req, res) => {
  const r = PlantIn.safeParse(req.body);
  if (!r.success) return res.status(400).json({ error: { code: 'VALIDATION', fields: r.error.flatten().fieldErrors } });
  const plant = { id: db.length + 1, ...r.data }; db.push(plant);
  res.status(201).location('/plants/' + plant.id).json(plant);
});
app.get('/plants', (req, res) => {
  const q = ListQuery.parse(req.query);
  const sorted = [...db].sort((a, b) => (q.sort === 'name' ? 1 : -1) * a.name.localeCompare(b.name));
  const items = sorted.slice((q.page - 1) * q.limit, q.page * q.limit);
  res.json({ items, meta: { page: q.page, limit: q.limit, total: db.length } });
});

const server = app.listen(3006, async () => {
  const base = 'http://localhost:3006';
  let r = await fetch(base + '/plants', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'x', everyDays: 0 }) });
  console.log('POST bad  ->', r.status, await r.text());
  r = await fetch(base + '/plants', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: ' Ivy ', everyDays: 5 }) });
  console.log('POST good ->', r.status, r.headers.get('location'), await r.text());
  r = await fetch(base + '/plants?page=2&limit=2&sort=-name');
  console.log('GET page 2 ->', r.status, await r.text());
  server.close();
});
