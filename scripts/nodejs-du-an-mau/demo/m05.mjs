import express from 'express';

const plants = [{ id: 1, name: 'Monstera' }];
const router = express.Router();
router.get('/', (req, res) => res.json(plants));
router.get('/:id', (req, res) => {
  const p = plants.find((x) => x.id === Number(req.params.id));
  if (!p) throw Object.assign(new Error('Plant not found'), { status: 404 });
  res.json(p);
});
router.get('/:id/crash', async () => { throw new Error('database is down'); }); // async throw: Express 5 forwards it

const app = express();
app.use(express.json());
app.use((req, res, next) => { const t = Date.now(); res.on('finish', () => console.log('[log]', req.method, req.originalUrl, res.statusCode, (Date.now() - t) + 'ms')); next(); });
app.use('/plants', router);
app.use((req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'No route ' + req.method + ' ' + req.path } }));
app.use((err, req, res, next) => {
  const status = err.status ?? 500;
  res.status(status).json({ error: { code: status === 500 ? 'INTERNAL' : 'NOT_FOUND', message: status === 500 ? 'Something went wrong' : err.message } });
});

const server = app.listen(3005, async () => {
  for (const path of ['/plants/1', '/plants/9', '/plants/1/crash', '/pots']) {
    const r = await fetch('http://localhost:3005' + path);
    console.log(path.padEnd(16), r.status, await r.text());
  }
  server.close();
});
