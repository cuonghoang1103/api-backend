#!/usr/bin/env node
/**
 * @cuongthai/ctwork-mcp — cầu stdio ⇄ Streamable HTTP cho CT Work MCP.
 *
 * MCP server thật chạy trong backend CT Work (POST /api/v1/work/mcp). Gói này chỉ dành cho client MCP
 * CHƯA nói được HTTP: nó đọc JSON-RPC từng dòng trên stdin, POST lên server kèm token, và in phản hồi ra stdout.
 * Không có phụ thuộc nào (Node ≥ 18 có sẵn fetch). Không bao giờ in token.
 *
 *   CTWORK_TOKEN=ctw_…  [CTWORK_URL=https://cuongthai.com/api/v1/work/mcp]  npx -y @cuongthai/ctwork-mcp
 */

import { createInterface } from 'node:readline';

const VERSION = '0.1.0';
const DEFAULT_URL = 'https://cuongthai.com/api/v1/work/mcp';
const TIMEOUT_MS = Number(process.env.CTWORK_TIMEOUT_MS) > 0 ? Number(process.env.CTWORK_TIMEOUT_MS) : 90_000;

const log = (...a) => process.stderr.write(`[ctwork-mcp] ${a.join(' ')}\n`);

function fail(msg) {
  log(msg);
  process.exit(2);
}

const args = process.argv.slice(2);
if (args.includes('--version') || args.includes('-v')) {
  process.stdout.write(`${VERSION}\n`);
  process.exit(0);
}
if (args.includes('--help') || args.includes('-h')) {
  process.stdout.write([
    `ctwork-mcp ${VERSION} — stdio bridge to the CT Work MCP server`,
    '',
    'Environment:',
    '  CTWORK_TOKEN   (required) a CT Work API token: ctw_…  (agent token or your personal token)',
    `  CTWORK_URL     MCP endpoint (default ${DEFAULT_URL})`,
    '  CTWORK_TIMEOUT_MS  per-request timeout (default 90000)',
    '',
    'Claude Code can talk to the server directly instead:',
    `  claude mcp add --transport http ctwork ${DEFAULT_URL} --header "Authorization: Bearer <token>"`,
    '',
  ].join('\n'));
  process.exit(0);
}

const token = (process.env.CTWORK_TOKEN || '').trim();
if (!/^ctw_[0-9a-f]{8}_[A-Za-z0-9_-]{20,64}$/.test(token)) fail('CTWORK_TOKEN is missing or is not a CT Work token (ctw_…). Create one in CT Work → Developer, or on the agent page.');
let url;
try {
  url = new URL(process.env.CTWORK_URL || DEFAULT_URL);
} catch {
  fail('CTWORK_URL is not a valid URL');
}
const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '::1';
if (url.protocol !== 'https:' && !(url.protocol === 'http:' && local)) fail('CTWORK_URL must be https:// (http:// only for localhost) — the token must never travel in clear text');

/** Phiên bản giao thức đã thương lượng (gửi lại trong header MCP-Protocol-Version như đặc tả yêu cầu). */
let protocolVersion = null;
let pending = 0;
let stdinClosed = false;
/** Lệnh sau `initialize` chờ nó xong. */
let gate = Promise.resolve();

function write(msg) {
  process.stdout.write(`${JSON.stringify(msg)}\n`);
}

function rpcError(id, code, message) {
  return { jsonrpc: '2.0', id: id ?? null, error: { code, message } };
}

/** Đọc thân text/event-stream ⇒ các thông điệp JSON trong dòng `data:`. */
function parseSse(text) {
  const out = [];
  for (const block of text.split(/\r?\n\r?\n/)) {
    const data = block.split(/\r?\n/).filter((l) => l.startsWith('data:')).map((l) => l.slice(5).replace(/^ /, '')).join('\n');
    if (!data) continue;
    try { out.push(JSON.parse(data)); } catch { /* bỏ dòng hỏng */ }
  }
  return out;
}

async function forward(msg) {
  const id = msg && typeof msg === 'object' && 'id' in msg ? msg.id : undefined;
  const isRequest = id !== undefined && typeof msg.method === 'string';
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
    Authorization: `Bearer ${token}`,
    'User-Agent': `ctwork-mcp/${VERSION} (node ${process.version})`,
  };
  if (protocolVersion) headers['MCP-Protocol-Version'] = protocolVersion;
  let res;
  try {
    res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(msg), signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (err) {
    log(`request failed: ${err && err.name === 'TimeoutError' ? 'timeout' : (err && err.message) || err}`);
    if (isRequest) write(rpcError(id, -32603, `CT Work server unreachable (${url.host})`));
    return;
  }
  if (res.status === 202 || res.status === 204) return;
  const type = res.headers.get('content-type') || '';
  const text = await res.text().catch(() => '');
  let messages = [];
  if (type.includes('text/event-stream')) messages = parseSse(text);
  else {
    try {
      const parsed = JSON.parse(text);
      messages = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      messages = [];
    }
  }
  if (!res.ok) {
    // Lỗi HTTP (401 token sai, 403 agent bị retire…) mang thân JSON-RPC với id null ⇒ gắn lại id của request.
    const body = messages.find((m) => m && m.error);
    if (isRequest) write(rpcError(id, body?.error?.code ?? -32603, body?.error?.message ?? `HTTP ${res.status} from CT Work`));
    if (res.status === 401) log('the token was rejected (401) — check CTWORK_TOKEN');
    return;
  }
  for (const m of messages) {
    if (m && typeof m === 'object' && m.result && msg.method === 'initialize' && typeof m.result.protocolVersion === 'string') protocolVersion = m.result.protocolVersion;
    write(m);
  }
}

function maybeExit() {
  // Chờ stdout xả hết (pipe ghi bất đồng bộ) rồi mới thoát — không cắt cụt phản hồi cuối.
  if (stdinClosed && pending === 0) process.stdout.write('', () => process.exit(0));
}

const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on('line', (line) => {
  const s = line.trim();
  if (!s) return;
  let msg;
  try {
    msg = JSON.parse(s);
  } catch {
    write(rpcError(null, -32700, 'Parse error'));
    return;
  }
  pending += 1;
  // initialize phải xong trước (để có MCP-Protocol-Version); các lệnh sau nó chờ rồi chạy song song.
  const isInit = msg && msg.method === 'initialize';
  const run = (isInit ? forward(msg) : gate.then(() => forward(msg)))
    .catch((err) => log(`bridge error: ${(err && err.message) || err}`))
    .finally(() => { pending -= 1; maybeExit(); });
  if (isInit) gate = run;
});
rl.on('close', () => {
  stdinClosed = true;
  maybeExit();
});
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
