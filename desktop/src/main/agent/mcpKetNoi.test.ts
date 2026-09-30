/**
 * Kiểm MCP bằng server THẬT nói đúng giao thức — cả ba kiểu kết nối.
 *
 * Phần dễ sai nhất của MCP không nằm ở logic mà ở KHUNG: stdio mỗi dòng một
 * JSON, Streamable HTTP trả JSON hoặc SSE tuỳ server, SSE cũ trả lời qua một
 * luồng khác với luồng gửi. Đọc mã thì cái nào cũng "trông đúng" — nên ở đây
 * dựng server thật (tiến trình con / `http.createServer`) rồi cắm vào.
 */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import type { AddressInfo } from 'node:net';

const USER_DATA = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-mcpkn-'));
vi.mock('electron', () => ({ app: { getPath: () => USER_DATA, getVersion: () => '9.9.9' }, BrowserWindow: {} }));

const mcp = await import('./mcp');
const { KetNoiMcp, taoStdio, docSse, kieuCua, laLenhTaiGoi, gonThanLoi } = await import('./mcpKetNoi');
const { chuyenKetQua, tenToolAnToan, chuanSchema, moRongBien, MAX_KET_QUA } = await import('./mcpNoiDung');

const ANH_1PX = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

// ─── Server stdio giả ──────────────────────────────────────────────

/**
 * Một server stdio tối giản nhưng ĐỦ những thói quen khó của server thật:
 *  - `tools/list` PHÂN TRANG (nextCursor)
 *  - HỎI NGƯỢC client một `ping` trước khi trả kết quả tool — client không
 *    trả lời thì tool đó treo vĩnh viễn
 *  - trả ảnh, trả lỗi `isError`, tự chết kèm dòng stderr
 */
const SERVER_STDIO = `
import readline from 'node:readline';
const rl = readline.createInterface({ input: process.stdin });
const gui = (o) => process.stdout.write(JSON.stringify(o) + '\\n');
let choPing = null;
if (process.env.CAN_KEY && !process.env.MY_KEY) { process.stderr.write('Error: thiếu MY_KEY\\n'); process.exit(3); }
rl.on('line', (d) => {
  const m = JSON.parse(d);
  if (m.id === 'ping-1' && choPing && m.result && !m.error) { /* chỉ nhận trả lời ĐÚNG, không nhận lỗi */ const x = choPing; choPing = null; gui({ jsonrpc: '2.0', id: x, result: { content: [{ type: 'text', text: 'pong đã về' }] } }); return; }
  if (m.method === 'initialize') gui({ jsonrpc: '2.0', id: m.id, result: { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'gia' } } });
  else if (m.method === 'tools/list') {
    if (!m.params || !m.params.cursor) gui({ jsonrpc: '2.0', id: m.id, result: { tools: [{ name: 'chao', description: 'chào', inputSchema: { type: 'object', properties: { ten: { type: 'string' } } } }, { name: 'tên có dấu cách!', description: 'x' }], nextCursor: 'trang2' } });
    else gui({ jsonrpc: '2.0', id: m.id, result: { tools: [{ name: 'anh' }, { name: 'hoi_nguoc' }, { name: 'chet' }, { name: 'cham' }] } });
  }
  else if (m.method === 'tools/call') {
    const n = m.params.name;
    if (n === 'chao') gui({ jsonrpc: '2.0', id: m.id, result: { content: [{ type: 'text', text: 'Xin chào ' + m.params.arguments.ten + ' · ' + (process.env.MY_KEY || '') }] } });
    else if (n === 'anh') gui({ jsonrpc: '2.0', id: m.id, result: { content: [{ type: 'text', text: 'frame' }, { type: 'image', mimeType: 'image/png', data: '${ANH_1PX}' }] } });
    else if (n === 'hoi_nguoc') { choPing = m.id; gui({ jsonrpc: '2.0', id: 'ping-1', method: 'ping' }); }
    else if (n === 'chet') { process.stderr.write('panic: hết bộ nhớ giả\\n'); process.exit(7); }
    else if (n === 'cham') { /* không bao giờ trả lời */ }
  }
});
`;

let thuMuc = '';
let fileServer = '';

beforeAll(async () => {
  thuMuc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-mcp-srv-'));
  fileServer = path.join(thuMuc, 'server.mjs');
  await fs.writeFile(fileServer, SERVER_STDIO, 'utf8');
});

// ─── Server Streamable HTTP + SSE cũ giả ───────────────────────────

interface ServerHttp { url: string; dong: () => Promise<void>; datLai: () => void; dem: { post: number; del: number } }

/**
 * `kieu: 'http'` — Streamable HTTP: `initialize` trả JSON + `mcp-session-id`,
 *   `tools/call` trả một LUỒNG SSE, thông báo trả 202. `datLai()` giả server
 *   khởi động lại: phiên cũ ⇒ 404.
 * `kieu: 'sse'` — SSE cũ: GET mở luồng, sự kiện `endpoint`, POST trả 202 và câu
 *   trả lời đi về qua luồng GET. POST vào `/mcp` trả 405 (để thử lùi).
 */
async function dungServerHttp(kieu: 'http' | 'sse', canToken = false): Promise<ServerHttp> {
  let phien = `p-${Math.random().toString(36).slice(2)}`;
  const dem = { post: 0, del: 0 };
  let luongSse: http.ServerResponse | null = null;
  const traLoi = (m: { id?: unknown; method?: string; params?: { name?: string } }) => {
    if (m.method === 'initialize') return { jsonrpc: '2.0', id: m.id, result: { protocolVersion: '2025-06-18', capabilities: {} } };
    if (m.method === 'tools/list') return { jsonrpc: '2.0', id: m.id, result: { tools: [{ name: 'get_screenshot', description: 'chụp frame', inputSchema: { type: 'object' } }] } };
    if (m.method === 'tools/call') return { jsonrpc: '2.0', id: m.id, result: { content: [{ type: 'text', text: `ok ${kieu}` }, { type: 'image', mimeType: 'image/png', data: ANH_1PX }] } };
    return null;
  };
  const srv = http.createServer((req, res) => {
    let than = '';
    req.on('data', (c) => { than += c; });
    req.on('end', () => {
      if (canToken && req.headers.authorization !== 'Bearer bi-mat') { res.writeHead(401); res.end('unauthorized'); return; }
      if (kieu === 'sse') {
        if (req.method === 'GET') {   // luồng mở ở bất kỳ đường dẫn nào
          res.writeHead(200, { 'content-type': 'text/event-stream' });
          res.write(`event: endpoint\ndata: /messages?sid=${phien}\n\n`);
          luongSse = res;
          return;
        }
        if (req.method === 'POST' && req.url?.startsWith('/messages')) {
          dem.post++;
          const m = JSON.parse(than);
          res.writeHead(202); res.end();
          const r = traLoi(m);
          if (r && luongSse) luongSse.write(`event: message\ndata: ${JSON.stringify(r)}\n\n`);
          return;
        }
        res.writeHead(405); res.end('dùng /sse'); return;
      }
      // Streamable HTTP
      if (req.method === 'DELETE') { dem.del++; res.writeHead(200); res.end(); return; }
      if (req.method !== 'POST') { res.writeHead(405); res.end(); return; }
      dem.post++;
      const m = JSON.parse(than);
      if (m.method !== 'initialize' && req.headers['mcp-session-id'] !== phien) { res.writeHead(404); res.end('phiên không tồn tại'); return; }
      if (m.method !== 'initialize' && req.headers['mcp-protocol-version'] !== '2025-06-18') { res.writeHead(400); res.end('thiếu mcp-protocol-version'); return; }
      if (m.id === undefined) { res.writeHead(202); res.end(); return; }
      const r = traLoi(m);
      if (m.method === 'tools/call') {
        // Trả lời bằng SSE, cắt đôi thông điệp qua hai lần ghi để thử bộ đệm.
        res.writeHead(200, { 'content-type': 'text/event-stream' });
        const s = `event: message\ndata: ${JSON.stringify(r)}\n\n`;
        res.write(s.slice(0, 20));
        setTimeout(() => { res.end(s.slice(20)); }, 10);
        return;
      }
      res.writeHead(200, { 'content-type': 'application/json', 'mcp-session-id': phien });
      res.end(JSON.stringify(r));
    });
  });
  await new Promise<void>((r) => srv.listen(0, '127.0.0.1', r));
  const cong = (srv.address() as AddressInfo).port;
  return {
    url: `http://127.0.0.1:${cong}${kieu === 'sse' ? '/sse' : '/mcp'}`,
    dem,
    datLai: () => { phien = `p-${Math.random().toString(36).slice(2)}`; },
    dong: () => new Promise<void>((r) => { luongSse?.end(); srv.closeAllConnections?.(); srv.close(() => r()); }),
  };
}

async function ghiCauHinh(servers: unknown): Promise<void> {
  await fs.writeFile(path.join(USER_DATA, 'mcp.json'), JSON.stringify({ servers }, null, 2), 'utf8');
}

afterEach(async () => { await mcp.tatHet(); });
afterAll(async () => { await mcp.tatHet(); });

// ─── Biến đổi thuần ────────────────────────────────────────────────

describe('chuyenKetQua — ảnh, tài nguyên, cắt có báo', () => {
  it('ảnh đi tới model thay vì bị vứt im lặng', () => {
    const kq = chuyenKetQua({ content: [{ type: 'text', text: 'a' }, { type: 'image', mimeType: 'image/png', data: ANH_1PX }] }, 's');
    expect(kq.anh).toHaveLength(1);
    expect(kq.anh[0]!.media_type).toBe('image/png');
    expect(kq.noiDung).toContain('a');
    expect(kq.noiDung).toContain('đính kèm');
  });

  it('định dạng lạ / ảnh quá lớn ⇒ BỎ nhưng NÓI ra', () => {
    const lon = 'A'.repeat(2_000_000);
    const kq = chuyenKetQua({ content: [{ type: 'image', mimeType: 'image/svg+xml', data: 'x' }, { type: 'image', mimeType: 'image/png', data: lon }] }, 's');
    expect(kq.anh).toHaveLength(0);
    expect(kq.noiDung).toMatch(/svg\+xml.*đã bỏ/);
    expect(kq.noiDung).toMatch(/quá trần/);
  });

  it('image/jpg được chuẩn hoá thành image/jpeg', () => {
    expect(chuyenKetQua({ content: [{ type: 'image', mimeType: 'image/jpg', data: ANH_1PX }] }, 's').anh[0]!.media_type).toBe('image/jpeg');
  });

  it('resource chữ, resource_link, structuredContent', () => {
    const kq = chuyenKetQua({ content: [
      { type: 'resource', resource: { uri: 'file:///a.css', mimeType: 'text/css', text: '.x{}' } },
      { type: 'resource_link', uri: 'figma://node/1', name: 'Nút' },
    ] }, 's');
    expect(kq.noiDung).toContain('.x{}');
    expect(kq.noiDung).toContain('figma://node/1');
    expect(chuyenKetQua({ content: [], structuredContent: { mau: '#fff' } }, 's').noiDung).toContain('#fff');
  });

  it('kết quả quá dài bị cắt VÀ báo cho model biết', () => {
    const kq = chuyenKetQua({ content: [{ type: 'text', text: 'x'.repeat(MAX_KET_QUA + 500) }] }, 's');
    expect(kq.noiDung.length).toBeLessThan(MAX_KET_QUA + 400);
    expect(kq.noiDung).toContain('KẾT QUẢ BỊ CẮT');
  });

  it('isError ⇒ loi = true, có tên server', () => {
    const kq = chuyenKetQua({ isError: true, content: [{ type: 'text', text: 'hết quota' }] }, 'figma');
    expect(kq.loi).toBe(true);
    expect(kq.noiDung).toBe('LỖI từ figma: hết quota');
  });
});

describe('tên, schema, biến môi trường', () => {
  it('tên tool luôn khớp khuôn máy chủ', () => {
    expect(tenToolAnToan('tên có dấu cách!')).toMatch(/^[a-zA-Z0-9_.-]{1,48}$/);
    expect(tenToolAnToan('a'.repeat(80))).toHaveLength(48);
  });
  it('schema thiếu type/properties được vá thành object', () => {
    expect(chuanSchema(undefined)).toEqual({ type: 'object', properties: {} });
    expect(chuanSchema({ properties: { a: {} } })).toMatchObject({ type: 'object', properties: { a: {} } });
  });
  it('${BIEN} và ${BIEN:-mặc định}; thiếu thì ghi lại tên', () => {
    const thieu = new Set<string>();
    expect(moRongBien('Bearer ${T}', { T: 'k' }, thieu)).toBe('Bearer k');
    expect(moRongBien('${X:-mac}', {}, thieu)).toBe('mac');
    moRongBien('${KHONG_CO}', {}, thieu);
    expect([...thieu]).toEqual(['KHONG_CO']);
  });
  it('đoán kiểu kết nối', () => {
    expect(kieuCua({ command: 'npx' })).toBe('stdio');
    expect(kieuCua({ url: 'http://a/mcp' })).toBe('http');
    expect(kieuCua({ url: 'http://a/sse' })).toBe('sse');
    expect(kieuCua({ type: 'streamable-http', url: 'http://a' })).toBe('http');
    expect(kieuCua({ type: 'websocket', url: 'ws://a' })).toBeNull();
    expect(kieuCua({ args: ['x'] })).toBeNull();
    expect(laLenhTaiGoi('npx')).toBe(true);
    expect(laLenhTaiGoi('/usr/bin/node')).toBe(false);
  });
});

describe('gonThanLoi', () => {
  it('trang lỗi HTML của Express ⇒ một dòng chữ', () => {
    expect(gonThanLoi('<!DOCTYPE html><html><head><title>Error</title></head><body><pre>Cannot POST /mcp</pre></body></html>'))
      .toBe('Cannot POST /mcp');
    expect(gonThanLoi('{"error":"invalid_token"}')).toBe('{"error":"invalid_token"}');
  });
});

describe('docSse', () => {
  it('ghép sự kiện bị cắt giữa hai mẩu, nhiều dòng data, bỏ chú thích', async () => {
    const mau = ['event: message\nda', 'ta: {"a":1}\n\n: giữ kết nối\n', 'data: dòng1\r\ndata: dòng2\r\n\r\n'];
    const body = new ReadableStream<Uint8Array>({
      start(c) { for (const m of mau) c.enqueue(new TextEncoder().encode(m)); c.close(); },
    });
    const ra: Array<{ event: string; data: string }> = [];
    await docSse(body, (e) => ra.push(e));
    expect(ra).toEqual([{ event: 'message', data: '{"a":1}' }, { event: 'message', data: 'dòng1\ndòng2' }]);
  });
});

// ─── stdio thật ────────────────────────────────────────────────────

describe('stdio — tiến trình con thật', () => {
  it('bắt tay, phân trang, tên được chuẩn hoá, gọi tool, trả lời ping của server', async () => {
    const kn = new KetNoiMcp('gia', 'stdio', taoStdio({ command: process.execPath, args: [fileServer], env: process.env }));
    await kn.vc.mo();
    await kn.goi('initialize', {}, 5000);
    const ds = (await kn.goi('tools/list', {}, 5000)) as { nextCursor?: string };
    expect(ds.nextCursor).toBe('trang2');
    // Server hỏi ngược `ping` rồi mới trả kết quả — không trả lời ping là treo.
    const kq = (await kn.goi('tools/call', { name: 'hoi_nguoc', arguments: {} }, 3000)) as { content: Array<{ text: string }> };
    expect(kq.content[0]!.text).toBe('pong đã về');
    await kn.dong();
  });

  it('huỷ bằng signal ⇒ trả ngay, không chờ hết hạn', async () => {
    const kn = new KetNoiMcp('gia', 'stdio', taoStdio({ command: process.execPath, args: [fileServer], env: process.env }));
    await kn.vc.mo();
    const ac = new AbortController();
    const t0 = Date.now();
    const p = kn.goi('tools/call', { name: 'cham', arguments: {} }, 30_000, ac.signal);
    setTimeout(() => ac.abort(), 50);
    await expect(p).rejects.toThrow('đã huỷ');
    expect(Date.now() - t0).toBeLessThan(2000);
    await kn.dong();
  });
});

// ─── Toàn bộ đường đi qua mcp.ts ───────────────────────────────────

describe('napLaiMcp + goiToolMcp — đầu cuối', () => {
  it('stdio: 6 tool qua 2 trang, env được truyền, ảnh về tới kết quả', async () => {
    await ghiCauHinh({ gia: { command: process.execPath, args: [fileServer], env: { MY_KEY: 'k123' } } });
    const kq = await mcp.napLaiMcp();
    expect(kq.server[0]).toMatchObject({ ten: 'gia', ok: true, kieu: 'stdio', soTool: 6 });
    const ten = kq.tool.map((t) => t.ten);
    expect(ten).toContain('mcp__gia__chao');
    expect(ten.every((t) => /^mcp__[a-zA-Z0-9_-]{1,32}__[a-zA-Z0-9_.-]{1,48}$/.test(t))).toBe(true);

    const chao = await mcp.goiToolMcp('mcp__gia__chao', { ten: 'Cường' });
    expect(chao.noiDung).toBe('Xin chào Cường · k123');

    const anh = await mcp.goiToolMcp('mcp__gia__anh', {});
    expect(anh.anh).toHaveLength(1);
    expect(anh.noiDung).toContain('frame');
  });

  it('server chết giữa chừng ⇒ lỗi KÈM stderr, bảng cập nhật, tool bị gỡ', async () => {
    await ghiCauHinh({ gia: { command: process.execPath, args: [fileServer] } });
    await mcp.napLaiMcp();
    const kq = await mcp.goiToolMcp('mcp__gia__chet', {});
    expect(kq.loi).toBe(true);
    expect(kq.noiDung).toContain('panic: hết bộ nhớ giả');
    expect(mcp.trangThaiServer()[0]).toMatchObject({ ok: false, soTool: 0 });
    expect(mcp.toolMcpHienCo()).toHaveLength(0);
    const lai = await mcp.goiToolMcp('mcp__gia__chao', { ten: 'x' });
    expect(lai.noiDung).toMatch(/không có tool|không còn chạy/);
  });

  it('server chết lúc khởi động ⇒ bảng hiện câu stderr, không phải "hết giờ"', async () => {
    await ghiCauHinh({ gia: { command: process.execPath, args: [fileServer], env: { CAN_KEY: '1' } } });
    const kq = await mcp.napLaiMcp();
    expect(kq.server[0]!.ok).toBe(false);
    expect(kq.server[0]!.loi).toContain('thiếu MY_KEY');
  });

  it('lệnh không tồn tại ⇒ báo ngay, không chờ hạn', async () => {
    await ghiCauHinh({ x: { command: 'lenh-khong-ton-tai-ct-123' } });
    const t0 = Date.now();
    const kq = await mcp.napLaiMcp();
    expect(kq.server[0]!.loi).toMatch(/không chạy được/);
    expect(Date.now() - t0).toBeLessThan(5000);
  });

  it('Streamable HTTP: header token, phiên, luồng SSE bị cắt đôi, ảnh; server khởi động lại ⇒ tự bắt tay lại', async () => {
    const s = await dungServerHttp('http', true);
    try {
      process.env.CT_TEST_TOKEN = 'bi-mat';
      await ghiCauHinh({ fig: { type: 'http', url: s.url, headers: { Authorization: 'Bearer ${CT_TEST_TOKEN}' } } });
      const kq = await mcp.napLaiMcp();
      expect(kq.server[0]).toMatchObject({ ok: true, kieu: 'http', soTool: 1 });
      const r = await mcp.goiToolMcp('mcp__fig__get_screenshot', {});
      expect(r.noiDung).toContain('ok http');
      expect(r.anh).toHaveLength(1);

      s.datLai();   // phiên cũ giờ trả 404
      const r2 = await mcp.goiToolMcp('mcp__fig__get_screenshot', {});
      expect(r2.noiDung).toContain('ok http');

      await mcp.tatHet();
      expect(s.dem.del).toBe(1);   // có báo server dọn phiên
    } finally {
      delete process.env.CT_TEST_TOKEN;
      await s.dong();
    }
  });

  it('HTTP sai token ⇒ lỗi 401 rõ ràng, KHÔNG lùi sang SSE', async () => {
    const s = await dungServerHttp('http', true);
    try {
      await ghiCauHinh({ fig: { url: s.url, headers: { Authorization: 'Bearer sai' } } });
      const kq = await mcp.napLaiMcp();
      expect(kq.server[0]!.ok).toBe(false);
      expect(kq.server[0]!.loi).toMatch(/HTTP 401/);
      expect(kq.server[0]!.loi).not.toMatch(/SSE/);
    } finally { await s.dong(); }
  });

  it('SSE kiểu cũ: khai type sse', async () => {
    const s = await dungServerHttp('sse');
    try {
      await ghiCauHinh({ cu: { type: 'sse', url: s.url } });
      const kq = await mcp.napLaiMcp();
      expect(kq.server[0]).toMatchObject({ ok: true, kieu: 'sse', soTool: 1 });
      expect((await mcp.goiToolMcp('mcp__cu__get_screenshot', {})).noiDung).toContain('ok sse');
    } finally { await s.dong(); }
  });

  it('url không khai type + server chỉ nói SSE ⇒ tự lùi (405 ⇒ SSE)', async () => {
    const s = await dungServerHttp('sse');
    try {
      // URL không kết thúc bằng /sse ⇒ đoán http ⇒ POST nhận 405 ⇒ lùi sang SSE.
      await ghiCauHinh({ cu: { url: s.url.replace(/\/sse$/, '/mcp') } });
      const kq = await mcp.napLaiMcp();
      expect(kq.server[0]).toMatchObject({ ok: true, soTool: 1 });
    } finally { await s.dong(); }
  });

  it('⛔ mcp.json sai cú pháp ⇒ báo lỗi, KHÔNG ghi đè file của người dùng', async () => {
    const p = path.join(USER_DATA, 'mcp.json');
    const hong = '{ "servers": { "figma": { "command": "npx", } } ';   // thiếu ngoặc + phẩy thừa
    await fs.writeFile(p, hong, 'utf8');
    await mcp.napLaiMcp();
    expect(mcp.loiCauHinh()).toMatch(/sai cú pháp JSON/);
    expect(await fs.readFile(p, 'utf8')).toBe(hong);
  });

  it('chưa có file ⇒ ghi mẫu có Figma; nhận cả khoá mcpServers', async () => {
    const p = path.join(USER_DATA, 'mcp.json');
    await fs.rm(p, { force: true });
    await mcp.napLaiMcp();
    const mau = JSON.parse(await fs.readFile(p, 'utf8'));
    expect(mau._vidu.figma.args).toContain('figma-developer-mcp');
    expect(mau.servers).toEqual({});

    await fs.writeFile(p, JSON.stringify({ mcpServers: { gia: { command: process.execPath, args: [fileServer] } } }), 'utf8');
    expect((await mcp.napLaiMcp()).server[0]).toMatchObject({ ten: 'gia', ok: true });
  });

  it('tên server sai khuôn / thiếu biến / kiểu lạ ⇒ lỗi nói rõ phải sửa gì', async () => {
    await ghiCauHinh({
      'figma dev': { command: process.execPath, args: [fileServer] },
      thieu: { url: 'http://127.0.0.1:1/mcp', headers: { Authorization: 'Bearer ${CT_KHONG_CO_BIEN_NAY}' } },
      la: { type: 'websocket', url: 'ws://a' },
    });
    const kq = await mcp.napLaiMcp();
    const loi = Object.fromEntries(kq.server.map((s) => [s.ten, s.loi]));
    expect(loi['figma dev']).toMatch(/tên server/);
    expect(loi.thieu).toMatch(/CT_KHONG_CO_BIEN_NAY/);
    expect(loi.la).toMatch(/không hỗ trợ/);
  });

  it('hai lần nạp chồng nhau không để lại server mồ côi', async () => {
    await ghiCauHinh({ gia: { command: process.execPath, args: [fileServer] } });
    const [a, b] = await Promise.all([mcp.napLaiMcp(), mcp.napLaiMcp()]);
    expect(a.server[0]!.ok).toBe(true);
    expect(b.server[0]!.ok).toBe(true);
    expect(mcp.toolMcpHienCo()).toHaveLength(6);   // không nhân đôi
  });
});
