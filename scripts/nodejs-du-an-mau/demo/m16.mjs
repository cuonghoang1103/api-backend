import express from 'express';
import autocannon from 'autocannon';

// 50 000 waterings in memory stand in for a table
const waterings = Array.from({ length: 50_000 }, (_, i) => ({ plantId: i % 500, at: 1_700_000_000_000 + i * 60_000 }));

function statsSlow() {                                   // what the first version did on EVERY request
  const byPlant = {};
  for (const w of [...waterings].sort((a, b) => b.at - a.at)) (byPlant[w.plantId] ??= []).push(w.at);
  return Object.keys(byPlant).length;
}
let cached = null;                                       // the fix: compute once, invalidate on write
function statsFast() { return (cached ??= statsSlow()); }

const app = express();
app.get('/stats/slow', (req, res) => res.json({ plants: statsSlow() }));
app.get('/stats/fast', (req, res) => res.json({ plants: statsFast() }));
const server = app.listen(3016, async () => {
  for (const path of ['/stats/slow', '/stats/fast']) {
    const r = await autocannon({ url: 'http://localhost:3016' + path, connections: 20, duration: 5 });
    console.log(path.padEnd(12), 'req/s avg', Math.round(r.requests.average), '| p50', r.latency.p50, 'ms | p99', r.latency.p99, 'ms | errors', r.errors);
  }
  server.close();
});
