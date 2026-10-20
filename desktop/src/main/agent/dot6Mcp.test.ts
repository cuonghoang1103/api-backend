/**
 * ĐỢT 6 — MCP: (việc 9) DÙNG ĐƯỢC MỌI tool CT Work (~150) bằng nạp theo nhu cầu với máy chủ MCP HTTP GIẢ đủ ~153 tool;
 * (lỗi đợt 5) nạp lại RIÊNG một server — server MCP khác TREO (nhận kết nối mà không trả lời) không giữ CT Work 30–45 s.
 */
import { describe, it, expect, vi, afterAll } from 'vitest';
import fs from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import os from 'node:os';
import path from 'node:path';

const THU_MUC = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-dot6mcp-'));
vi.mock('electron', () => ({ app: { getPath: () => THU_MUC, isPackaged: false, getVersion: () => '1' } }));

const M = await import('./ctworkMauThu');
const daGoi: string[] = [];
const may = createServer((req, res) => {
  let than = '';
  req.on('data', (c) => { than += c; });
  req.on('end', () => {
    if (req.method !== 'POST') { res.writeHead(405).end(); return; }
    const tin = JSON.parse(than) as { id?: number; method: string; params?: { name?: string; cursor?: string } };
    if (tin.id === undefined) { res.writeHead(202).end(); return; }
    // Phân trang 50 tool/trang như máy chủ lớn — lõi phải đọc ĐỦ (trước đây dừng ở 40).
    const tu = Number(tin.params?.cursor ?? 0);
    const trang = M.MAU_TOOLS_DAY_DU.slice(tu, tu + 50);
    if (tin.method === 'tools/call') daGoi.push(String(tin.params?.name));
    const kq = tin.method === 'initialize' ? { protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'ctwork-gia', version: '1' } }
      : tin.method === 'tools/list' ? {
        tools: trang.map((t) => ({ name: t.name, description: `${t.mo}\nchi tiết dòng 2`, inputSchema: { type: 'object', properties: { project: { type: 'string' } } }, annotations: { title: t.name, readOnlyHint: !t.ghi } })),
        ...(tu + 50 < M.MAU_TOOLS_DAY_DU.length ? { nextCursor: String(tu + 50) } : {}),
      }
        : tin.method === 'tools/call' ? { content: [{ type: 'text', text: 'ok' }], isError: false } : {};
    res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ jsonrpc: '2.0', id: tin.id, result: kq }));
  });
});
/** Server MCP "khác" TREO: nhận kết nối, không bao giờ trả lời. */
const treo: Server = createServer(() => { /* im lặng */ });
await new Promise<void>((ok) => may.listen(0, '127.0.0.1', ok));
await new Promise<void>((ok) => treo.listen(0, '127.0.0.1', ok));
const cong = (may.address() as { port: number }).port;
const congTreo = (treo.address() as { port: number }).port;
(globalThis as { __congCtw6?: number }).__congCtw6 = cong;
vi.mock('../config', () => ({ API_ORIGIN: `http://127.0.0.1:${(globalThis as { __congCtw6?: number }).__congCtw6}`, WEB_ORIGIN: 'http://web-gia.test', IS_DEV: true }));
afterAll(() => { may.close(); treo.closeAllConnections?.(); treo.close(); });

const mcp = await import('./mcp');
const URL_MCP = `http://127.0.0.1:${cong}/api/v1/work/mcp`;

describe('việc 9 — mọi tool CT Work qua nạp theo nhu cầu', () => {
  it('đọc ĐỦ ~153 tool (nhiều trang); gửi model 23 tool hằng ngày (20/10: +nhóm đính kèm) + MỤC LỤC phần còn lại (ổn định); nạp ⇒ có schema ở lượt sau', async () => {
    mcp.datNguonServerDungSan(() => ({ ctwork: { type: 'http', url: URL_MCP } as never }));
    await mcp.napLaiMcp(null);
    const tatCa = mcp.tatCaToolMcp();
    expect(tatCa.length).toBe(M.MAU_TOOLS_DAY_DU.length);
    expect(tatCa.length).toBeGreaterThan(140);
    const loi = mcp.toolGuiChoCuoc('c1');
    expect(loi).toHaveLength(23);
    /* 20/10/2026: attach_file luôn có schema + nhận `path` (CuongMini tự đọc file). */
    const at = loi.find((t) => t.tenGoc === 'attach_file')!;
    expect(at).toBeDefined();
    expect((at.thamSo as { properties: Record<string, unknown> }).properties.path).toBeDefined();
    expect(loi.slice(0, 3).map((t) => t.tenGoc)).toEqual(['my_work', 'issue_guide', 'get_issue']);
    const ml = mcp.mucLucChoCuoc();
    expect(ml.length).toBe(tatCa.length - 23);
    expect(ml.find((x) => x.name === 'mcp__ctwork__fpt_unit_add_cases')!.mo).toBe('CT Work fpt unit add cases'); // một dòng
    const tt = mcp.trangThaiServer().find((s) => s.ten === 'ctwork')!;
    expect(tt).toMatchObject({ ok: true, soTool: 23, soMucLuc: tatCa.length - 23 });
    expect(tt.boBot).toBeUndefined(); // không còn "bỏ bớt" tool nào
    // Nạp theo nhu cầu: chỉ cuộc đã nạp mới có schema; mục lục đứng yên (đệm tiền tố).
    const n = mcp.napToolChoCuoc('c1', ['mcp__ctwork__fpt_unit_add_cases', 'srs_get', 'mcp__ctwork__khong_co', 'mcp__ctwork__my_work']);
    expect(n.daNap.map((t) => t.tenGoc)).toEqual(['fpt_unit_add_cases', 'srs_get']);
    expect(n.khongCo).toEqual(['mcp__ctwork__khong_co']);
    expect(n.daCo).toEqual(['mcp__ctwork__my_work']);
    expect(mcp.toolGuiChoCuoc('c1').map((t) => t.tenGoc)).toEqual(expect.arrayContaining(['fpt_unit_add_cases', 'srs_get']));
    expect(mcp.toolGuiChoCuoc('c2')).toHaveLength(23);
    expect(mcp.mucLucChoCuoc()).toEqual(ml);
    // Tool ở mục lục (đã nạp hay chưa) đều GỌI được — `timToolMcp` thấy.
    expect(mcp.timToolMcp('mcp__ctwork__ext_report_7')?.tenGoc).toBe('ext_report_7');
    const r = await mcp.goiToolMcp('mcp__ctwork__fpt_unit_add_cases', { project: 'LF' });
    expect(r.loi).toBe(false);
    expect(daGoi).toContain('fpt_unit_add_cases');
    // Thư mục gắn CHỈ ĐỌC ⇒ bỏ tool GHI khỏi cả bộ gửi lẫn mục lục.
    expect(mcp.toolGuiChoCuoc('c1', { boGhiCtwork: true }).every((t) => t.chiDoc)).toBe(true);
    expect(mcp.mucLucChoCuoc({ boGhiCtwork: true }).some((x) => x.name === 'mcp__ctwork__fpt_unit_add_cases')).toBe(false);
    // Trần nạp mỗi cuộc: 24 cái mới nhất.
    for (const t of M.MAU_TOOLS_DAY_DU.slice(40, 80)) mcp.napToolChoCuoc('c3', [`mcp__ctwork__${t.name}`]);
    expect(mcp.toolGuiChoCuoc('c3').length).toBe(23 + 24);
    mcp.quenNapCuoc('c3');
    expect(mcp.toolGuiChoCuoc('c3')).toHaveLength(23);
  });

  it('A/B: CUONGMINI_MCP_NAP=0 ⇒ cách cũ (trần 40, không mục lục)', async () => {
    process.env.CUONGMINI_MCP_NAP = '0';
    try {
      await mcp.napLaiMcp(null);
      expect(mcp.toolGuiChoCuoc('x')).toHaveLength(40);
      expect(mcp.mucLucChoCuoc()).toEqual([]);
      expect(mcp.trangThaiServer().find((s) => s.ten === 'ctwork')!.boBot).toBe(M.MAU_TOOLS_DAY_DU.length - 40);
    } finally {
      delete process.env.CUONGMINI_MCP_NAP;
      await mcp.napLaiMcp(null);
    }
  });
});

describe('lỗi đợt 5 — nạp lại RIÊNG một server, không chờ server khác treo', () => {
  it('server "khac" treo bắt tay ⇒ nạp lại ctwork vẫn xong ngay (< 5 s), không đóng/mở lại server khác', async () => {
    await fs.writeFile(mcp.duongDanCauHinh(), JSON.stringify({ servers: { khac: { type: 'http', url: `http://127.0.0.1:${congTreo}/mcp`, startupTimeoutMs: 20_000 } } }), 'utf8');
    // Nạp cả bộ ở NỀN (lần mở app): server "khac" treo 20 s.
    const nen = mcp.napLaiMcp(null);
    await new Promise((ok) => setTimeout(ok, 300));
    const t0 = Date.now();
    const kq = await mcp.napLaiMotServer('ctwork', null);
    const ms = Date.now() - t0;
    expect(ms).toBeLessThan(5000);
    expect(kq.server.find((s) => s.ten === 'ctwork')).toMatchObject({ ok: true });
    expect(mcp.toolGuiChoCuoc(null).length).toBe(23);
    // Lần nạp cả bộ còn dở (của CHÍNH ctwork) về sau KHÔNG đè lần nạp riêng.
    await mcp.napLaiMotServer('ctwork', null);
    expect(mcp.trangThaiServer().filter((s) => s.ten === 'ctwork')).toHaveLength(1);
    void nen.catch(() => undefined);
    await mcp.tatHet();
  }, 30_000);
});
