import express from 'express';
import pino from 'pino';
import client from 'prom-client';
import { randomUUID } from 'node:crypto';

const log = pino({ base: { service: 'plant-care-api' }, timestamp: pino.stdTimeFunctions.isoTime });
const httpDuration = new client.Histogram({ name: 'http_request_duration_seconds', help: 'HTTP latency', labelNames: ['method', 'route', 'status'], buckets: [0.05, 0.1, 0.5, 1] });

const app = express();
app.use((req, res, next) => {
  req.id = req.get('x-request-id') ?? randomUUID();          // one id through every layer
  req.log = log.child({ reqId: req.id });
  res.set('x-request-id', req.id);
  const end = httpDuration.startTimer();
  res.on('finish', () => {
    const route = req.route?.path ?? 'unmatched';             // route TEMPLATE, never the raw URL (label explosion)
    end({ method: req.method, route, status: res.statusCode });
    req.log.info({ method: req.method, route, status: res.statusCode }, 'request done');
  });
  next();
});
app.get('/plants/:id', (req, res) => { req.log.info({ plantId: req.params.id }, 'loading plant'); res.json({ id: req.params.id }); });
app.get('/healthz', (req, res) => res.json({ status: 'ok' }));
app.get('/metrics', async (req, res) => { res.type(client.register.contentType); res.send(await client.register.metrics()); });

const server = app.listen(3015, async () => {
  const base = 'http://localhost:3015';
  await fetch(base + '/plants/10', { headers: { 'x-request-id': 'demo-req-1' } });
  await fetch(base + '/plants/11');
  const m = await (await fetch(base + '/metrics')).text();
  console.log(m.match(/^http_request_duration_seconds_count.*$/gm).join(' | '));
  server.close();
});
