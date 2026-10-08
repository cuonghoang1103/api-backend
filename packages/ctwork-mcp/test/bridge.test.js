// Cầu stdio ⇄ HTTP: chạy bin thật, trỏ vào server HTTP giả trên localhost.
//   (cd packages/ctwork-mcp && npm test)
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import http from 'node:http';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const BIN = fileURLToPath(new URL('../bin/ctwork-mcp.js', import.meta.url));
const TOKEN = 'ctw_0123abcd_' + 'x'.repeat(32);

function fakeServer() {
  const seen = [];
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      const msg = JSON.parse(body);
      seen.push({ headers: req.headers, msg });
      if (req.headers.authorization !== `Bearer ${TOKEN}`) {
        res.writeHead(401, { 'content-type': 'application/json' });
        return res.end(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32001, message: 'Invalid API token' } }));
      }
      if (!('id' in msg)) { res.writeHead(202); return res.end(); }
      if (msg.method === 'initialize') {
        res.writeHead(200, { 'content-type': 'application/json' });
        return res.end(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: { protocolVersion: '2025-06-18', capabilities: {}, serverInfo: { name: 'fake' } } }));
      }
      // tools/list trả dạng SSE để kiểm cả nhánh text/event-stream.
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      res.end(`event: message\ndata: ${JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: { tools: [{ name: 'whoami' }] } })}\n\n`);
    });
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, seen, url: `http://127.0.0.1:${server.address().port}/api/v1/work/mcp` })));
}

function runBridge(env, lines) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, [BIN], { env: { ...process.env, ...env }, stdio: ['pipe', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    p.stdout.on('data', (c) => { out += c; });
    p.stderr.on('data', (c) => { err += c; });
    p.on('close', (code) => resolve({ code, out: out.trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)), err }));
    for (const l of lines) p.stdin.write(`${JSON.stringify(l)}\n`);
    p.stdin.end();
  });
}

test('chuyển tiếp initialize + notification + tools/list (SSE), gửi token + MCP-Protocol-Version, không in token', async () => {
  const { server, seen, url } = await fakeServer();
  try {
    const r = await runBridge({ CTWORK_TOKEN: TOKEN, CTWORK_URL: url }, [
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 't', version: '1' } } },
      { jsonrpc: '2.0', method: 'notifications/initialized' },
      { jsonrpc: '2.0', id: 2, method: 'tools/list' },
    ]);
    assert.equal(r.code, 0);
    assert.equal(r.out.length, 2, 'notification không có phản hồi');
    assert.equal(r.out.find((m) => m.id === 1).result.protocolVersion, '2025-06-18');
    assert.equal(r.out.find((m) => m.id === 2).result.tools[0].name, 'whoami');
    assert.equal(seen.length, 3);
    assert.equal(seen[2].headers['mcp-protocol-version'], '2025-06-18');
    assert.match(seen[0].headers.accept, /application\/json/);
    assert.ok(!r.err.includes(TOKEN) && !JSON.stringify(r.out).includes(TOKEN));
  } finally {
    server.close();
  }
});

test('token sai ⇒ lỗi JSON-RPC mang đúng id của request (không id null)', async () => {
  const { server, url } = await fakeServer();
  try {
    const bad = 'ctw_0123abcd_' + 'y'.repeat(32);
    const r = await runBridge({ CTWORK_TOKEN: bad, CTWORK_URL: url }, [{ jsonrpc: '2.0', id: 7, method: 'tools/list' }]);
    assert.equal(r.out[0].id, 7);
    assert.equal(r.out[0].error.code, -32001);
    assert.match(r.err, /401/);
  } finally {
    server.close();
  }
});

test('thiếu token / http:// ra ngoài ⇒ thoát mã 2, không gửi gì', async () => {
  const a = await runBridge({ CTWORK_TOKEN: '', CTWORK_URL: 'http://127.0.0.1:1/x' }, []);
  assert.equal(a.code, 2);
  const b = await runBridge({ CTWORK_TOKEN: TOKEN, CTWORK_URL: 'http://example.com/api/v1/work/mcp' }, []);
  assert.equal(b.code, 2);
  assert.match(b.err, /https/);
});

test('server không tới được ⇒ lỗi -32603 cho request, tiến trình vẫn thoát sạch', async () => {
  const r = await runBridge({ CTWORK_TOKEN: TOKEN, CTWORK_URL: 'http://127.0.0.1:9/api/v1/work/mcp' }, [{ jsonrpc: '2.0', id: 'a', method: 'ping' }]);
  assert.equal(r.code, 0);
  assert.equal(r.out[0].id, 'a');
  assert.equal(r.out[0].error.code, -32603);
});
