/**
 * ĐỢT 5 — server MCP CT Work DỰNG SẴN (`mcp.ts › datNguonServerDungSan`) với một server MCP HTTP GIẢ:
 * có mặt mà không cần dòng nào trong mcp.json, tool xếp theo ưu tiên + `chiDoc` từ `readOnlyHint`, tắt
 * được bằng `/mcp` (ghi `{ "disabled": true }`), bật lại gỡ dòng đó; mục người dùng tự viết thắng.
 */
import { describe, it, expect, vi, afterAll } from 'vitest';
import fs from 'node:fs/promises';
import { createServer } from 'node:http';
import os from 'node:os';
import path from 'node:path';

const THU_MUC = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-dot5mcp-'));
vi.mock('electron', () => ({ app: { getPath: () => THU_MUC, isPackaged: false, getVersion: () => '1' } }));

const M = await import('./ctworkMauThu');
let soGoiList = 0;
const may = createServer((req, res) => {
  let than = '';
  req.on('data', (c) => { than += c; });
  req.on('end', () => {
    if (req.method !== 'POST') { res.writeHead(405).end(); return; }
    if (req.headers.authorization !== 'Bearer ctw_gia') { res.writeHead(401, { 'content-type': 'application/json' }).end('{"error":"invalid token"}'); return; }
    const tin = JSON.parse(than) as { id?: number; method: string; params?: { name?: string } };
    if (tin.id === undefined) { res.writeHead(202).end(); return; }
    const kq = tin.method === 'initialize' ? { protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'ctwork-gia', version: '1' } }
      : tin.method === 'tools/list' ? (soGoiList += 1, { tools: M.MAU_TOOLS.map((t) => ({ name: t.name, description: t.name, inputSchema: { type: 'object', properties: {} }, annotations: { title: t.name, readOnlyHint: !t.ghi } })) })
        : tin.method === 'tools/call' ? { content: [{ type: 'text', text: tin.params?.name === 'sprint_current' ? M.mauSprintCurrent(5) : 'ok' }], isError: false } : {};
    res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ jsonrpc: '2.0', id: tin.id, result: kq }));
  });
});
await new Promise<void>((ok) => may.listen(0, '127.0.0.1', ok));
const cong = (may.address() as { port: number }).port;
(globalThis as { __congCtw?: number }).__congCtw = cong;
vi.mock('../config', () => ({ API_ORIGIN: `http://127.0.0.1:${(globalThis as { __congCtw?: number }).__congCtw}`, WEB_ORIGIN: 'http://web-gia.test', IS_DEV: true }));
afterAll(() => { may.close(); });

const mcp = await import('./mcp');
const URL_MCP = `http://127.0.0.1:${cong}/api/v1/work/mcp`;
process.env.CTWORK_GIA_TOKEN = 'ctw_gia';

describe('server CT Work dựng sẵn', () => {
  it('có mặt KHÔNG cần mcp.json; dungSan + tin cậy; tool ưu tiên (my_work, get_issue… trước), chiDoc theo readOnlyHint', async () => {
    mcp.datNguonServerDungSan(() => ({ ctwork: { type: 'http', url: URL_MCP, headers: { Authorization: 'Bearer ${CTWORK_GIA_TOKEN}' } } as never }));
    const kq = await mcp.napLaiMcp(null);
    const sv = kq.server.find((s) => s.ten === 'ctwork')!;
    expect(sv).toMatchObject({ ok: true, dungSan: true, kieu: 'http' });
    expect(mcp.laCtworkTinCay('ctwork')).toBe(true);
    expect(mcp.laServerDungSan('ctwork')).toBe(true);
    const ds = mcp.toolMcpHienCo().map((t) => t.tenGoc);
    expect(ds.slice(0, 4)).toEqual(['my_work', 'get_issue', 'search_issues', 'sprint_current']);
    expect(mcp.toolMcpHienCo().find((t) => t.tenGoc === 'get_issue')!.chiDoc).toBe(true);
    expect(mcp.toolMcpHienCo().find((t) => t.tenGoc === 'comment')!.chiDoc).toBeUndefined();
    const f = await fs.readFile(mcp.duongDanCauHinh(), 'utf8');
    expect(f).not.toMatch(/"ctwork"/); // KHÔNG ghi dòng nào
  });

  it('app gọi thẳng (menu / dòng trạng thái) — không tính vào trần 200 lượt của model', async () => {
    const truoc = mcp.hanMucMcp().daDung;
    const r = await mcp.goiToolMcpTrucTiep('ctwork', 'sprint_current', { project: 'LF' });
    expect(r.loi).toBe(false);
    expect(r.noiDung).toMatch(/Sprint 2/);
    expect(mcp.hanMucMcp().daDung).toBe(truoc);
    expect((await mcp.goiToolMcpTrucTiep('ctwork', 'khong_co', {})).loi).toBe(true);
  });

  it('tắt từ /mcp ⇒ ghi {"disabled": true} (tôn trọng khi nạp); bật lại ⇒ gỡ dòng đó', async () => {
    expect((await mcp.batTatServer('ctwork', false)).ok).toBe(true);
    let j = JSON.parse(await fs.readFile(mcp.duongDanCauHinh(), 'utf8'));
    expect(j.servers.ctwork.disabled).toBe(true);
    expect(mcp.trangThaiServer().find((s) => s.ten === 'ctwork')).toMatchObject({ ok: false, tat: true, dungSan: true });
    expect(mcp.toolMcpHienCo().some((t) => t.server === 'ctwork')).toBe(false);
    expect((await mcp.batTatServer('ctwork', true)).ok).toBe(true);
    j = JSON.parse(await fs.readFile(mcp.duongDanCauHinh(), 'utf8'));
    expect(j.servers.ctwork).toBeUndefined();
    expect(mcp.trangThaiServer().find((s) => s.ten === 'ctwork')?.ok).toBe(true);
  });

  it('mục `ctwork` người dùng TỰ viết (có url) thắng bản dựng sẵn; url chính thức vẫn được tin', async () => {
    const j = JSON.parse(await fs.readFile(mcp.duongDanCauHinh(), 'utf8'));
    j.servers.ctwork = { type: 'http', url: URL_MCP, headers: { Authorization: 'Bearer ctw_gia' } };
    j.servers.khac = { type: 'http', url: `http://127.0.0.1:${cong}/khac/mcp`, headers: { Authorization: 'Bearer ctw_gia' } };
    await fs.writeFile(mcp.duongDanCauHinh(), JSON.stringify(j));
    await mcp.napLaiMcp(null);
    expect(mcp.trangThaiServer().find((s) => s.ten === 'ctwork')).toMatchObject({ ok: true });
    expect(mcp.trangThaiServer().find((s) => s.ten === 'ctwork')!.dungSan).toBeUndefined();
    expect(mcp.laCtworkTinCay('ctwork')).toBe(true);
    expect(mcp.laCtworkTinCay('khac')).toBe(false); // url khác ⇒ không tin readOnlyHint
    expect(mcp.toolMcpHienCo().filter((t) => t.server === 'khac').every((t) => t.chiDoc === undefined || t.chiDoc === true)).toBe(true);
    await mcp.tatHet();
  });

  it('token sai ⇒ server báo lỗi 401 (giao diện đề nghị cấp lại)', async () => {
    const { LOI_XAC_THUC } = await import('./ctworkKetNoi');
    mcp.datNguonServerDungSan(() => ({ ctwork2: { type: 'http', url: URL_MCP, headers: { Authorization: 'Bearer sai' } } as never }));
    await mcp.napLaiMcp(null);
    const sv = mcp.trangThaiServer().find((s) => s.ten === 'ctwork2')!;
    expect(sv.ok).toBe(false);
    expect(LOI_XAC_THUC.test(sv.loi ?? '')).toBe(true);
    await mcp.tatHet();
    expect(soGoiList).toBeGreaterThan(0);
  });
});
