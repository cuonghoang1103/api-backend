import express from 'express';
const app = express();
app.get('/plants/slow-report', async (req, res) => { await new Promise((r) => setTimeout(r, 1500)); res.json({ ok: true }); });
const server = app.listen(3017, () => console.log('listening, pid', process.pid));

process.on('SIGTERM', () => {                             // docker stop / a deploy sends SIGTERM first
  console.log('SIGTERM: stop accepting, finish in-flight requests');
  server.close(() => { console.log('all requests done, closing DB/Redis, exit 0'); process.exit(0); });
  setTimeout(() => { console.log('forced exit after 10 s'); process.exit(1); }, 10_000).unref();
});

if (process.argv[2] === 'demo') {
  setTimeout(async () => {
    const t = Date.now();
    const p = fetch('http://localhost:3017/plants/slow-report').then(async (r) => console.log('in-flight request finished:', r.status, await r.text(), 'after', Date.now() - t, 'ms'));
    setTimeout(() => process.kill(process.pid, 'SIGTERM'), 200);     // the deploy happens mid-request
    await p;
  }, 100);
}
