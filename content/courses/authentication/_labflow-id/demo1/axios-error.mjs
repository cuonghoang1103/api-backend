// demo1/axios-error.mjs — lesson 1.5: an error object carries the request that failed — Authorization header included.
import http from 'node:http';
import axios from 'axios';
import pino from 'pino';

const log = pino({ base: null, timestamp: false });
// A partner API that is having a bad day.
const partner = http.createServer((req, res) => { res.statusCode = 500; res.end('{"error":"upstream down"}'); });
await new Promise((r) => partner.listen(4803, r));

try {
  await axios.get('http://127.0.0.1:4803/v1/payments', { headers: { Authorization: `Bearer ${process.env.PARTNER_API_KEY}` } });
} catch (err) {
  log.error({ err }, 'payment API failed'); // ← the line that ends up in your log platform
  log.error({ status: err.response?.status, code: err.code, error: err.message }, 'payment API failed (safe)');
}
partner.close();
