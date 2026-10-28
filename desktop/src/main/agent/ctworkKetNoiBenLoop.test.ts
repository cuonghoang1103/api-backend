/**
 * 20/10/2026 — vòng lặp agent với CT Work "làm ngầm" (máy chủ AI GIẢ qua `fetch`, server MCP CT Work GIẢ):
 *   • `attach_file { path }` ⇒ thẻ duyệt hiện tên + cỡ (không base64) ⇒ CuongMini tự đọc file, gửi base64;
 *   • ảnh dán trong chat ⇒ lưu file + ghi chú đường dẫn trong câu hỏi;
 *   • phạm vi "tất cả dự án" ⇒ tool CT Work có mặt kể cả không có thư mục, ghi chú phạm vi MỘT lần mỗi cuộc;
 *   • tool trình duyệt nhắm giao diện CT Work ⇒ từ chối ngay ở `chayToolAgent`.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const THU_MUC = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-ben-loop-'));
vi.mock('electron', () => ({ app: { getPath: () => THU_MUC, isPackaged: false, getVersion: () => '1' }, BrowserWindow: { getAllWindows: () => [] }, safeStorage: { isEncryptionAvailable: () => false } }));
const caiDat: Record<string, unknown> = {};
vi.mock('../store', () => ({ getSettings: () => caiDat, setSetting: (k: string, v: unknown) => { caiDat[k] = v; } }));
vi.mock('../ipc/auth', () => ({ readStoredSession: () => ({ userId: 7, sessionToken: 'tok-thu' }) }));
vi.mock('../config', () => ({ API_ORIGIN: 'http://may-chu-gia.test', WEB_ORIGIN: 'http://web-gia.test', IS_DEV: true }));

type ToolGia = { ten: string; server: string; tenGoc: string; moTa: string; thamSo: Record<string, unknown>; chiDoc?: boolean };
const TOOL: ToolGia[] = [
  { ten: 'mcp__ctwork__attach_file', server: 'ctwork', tenGoc: 'attach_file', moTa: '', thamSo: {} },
  { ten: 'mcp__ctwork__my_work', server: 'ctwork', tenGoc: 'my_work', moTa: '', thamSo: {}, chiDoc: true },
];
const daGoiMcp: Array<[string, Record<string, unknown>]> = [];
vi.mock('./mcp', async (goc) => ({
  ...(await goc<typeof import('./mcp')>()),
  toolMcpHienCo: () => TOOL,
  toolGuiChoCuoc: (_c: string, o: { boCtwork?: boolean } = {}) => (o.boCtwork ? [] : TOOL),
  mucLucChoCuoc: () => [],
  timToolMcp: (t: string) => TOOL.find((x) => x.ten === t),
  laToolMcp: (t: string) => t.startsWith('mcp__'),
  laCtworkTinCay: (sv: string) => sv === 'ctwork',
  trangThaiServer: () => [{ ten: 'ctwork', ok: true, soTool: 2 }],
  hanMucMcp: () => ({ daDung: 1, tran: 200 }),
  goiToolMcp: async (ten: string, args: Record<string, unknown>) => { daGoiMcp.push([ten, args]); return { noiDung: '{"ok":true}', anh: [], loi: false }; },
  goiToolMcpTrucTiep: async (_sv: string, tenGoc: string, args: Record<string, unknown>) => { daGoiMcp.push([tenGoc, args]); return { noiDung: '{"attachmentId":5,"issue":"NT-13"}', anh: [], loi: false }; },
}));

const loop = await import('./loop');
const { traLoi } = await import('./xinPhep');
const H = await import('./ctworkHe');
const { chayToolAgent } = await import('./tools');

type Khung = Record<string, unknown>;
let kichBan: Khung[][] = [];
let daGui: Array<Record<string, any>> = [];
function sse(khung: Khung[]): Response {
  const chu = khung.map((k) => `data: ${JSON.stringify(k)}\n\n`).join('');
  return new Response(new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode(chu)); c.close(); } }), { status: 200, headers: { 'content-type': 'text/event-stream' } });
}
vi.stubGlobal('fetch', async (url: string | URL, init?: RequestInit) => {
  if (String(url).endsWith('/api/v1/agent/turn')) {
    daGui.push(JSON.parse(String(init?.body ?? '{}')));
    const k = kichBan.shift();
    if (!k) throw new Error('hết kịch bản');
    return sse(k);
  }
  return new Response('{}', { status: 404 });
});
const xong = (append: unknown[], stop = 'end'): Khung => ({ type: 'done', append, stop, usage: { inputTokens: 1, outputTokens: 1, costUsd: 0.001 }, quota: null });
const goiTool = (id: string, name: string, args: Record<string, unknown>): Khung[] => [
  { type: 'tool_call', id, name, args },
  xong([{ role: 'assistant', content: null, tool_calls: [{ id, type: 'function', function: { name, arguments: JSON.stringify(args) } }] }], 'tool_calls'),
];
beforeEach(() => { kichBan = []; daGui = []; daGoiMcp.length = 0; for (const k of Object.keys(caiDat)) delete caiDat[k]; H._xoaDem(); });

const cauNguoiDung = (i: number): string => {
  const tin = daGui[i]!.messages.filter((m: any) => m.role === 'user').at(-1);
  return typeof tin.content === 'string' ? tin.content : tin.content[0].text;
};

describe('CT Work làm ngầm trong vòng lặp agent', () => {
  it('attach_file { path } ⇒ thẻ duyệt: tên + cỡ, KHÔNG base64; đồng ý ⇒ CuongMini đọc file, gửi base64 + fileName/contentType', async () => {
    const goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-ben-loop-duan-'));
    await fs.writeFile(path.join(goc, 'erd.png'), Buffer.from([137, 80, 78, 71, 13, 10]));
    await H.ghiGan(goc, { key: 'NT', projectId: 7, workspaceId: 4 });
    const id = loop.taoCuoc();
    loop.datGocChoCuoc(id, goc);
    kichBan.push(goiTool('a1', 'mcp__ctwork__attach_file', { project: 'NT', issue: 'NT-13', path: 'erd.png' }), [xong([{ role: 'assistant', content: 'ok' }])]);
    const sk: any[] = [];
    await loop.chayLuot(id, 'đính kèm erd.png vào NT-13', { goc }, (e) => { sk.push(e); if (e.loai === 'xinPhepMcp') setTimeout(() => traLoi(e.id, 'choPhep'), 5); });
    const the = sk.find((e) => e.loai === 'xinPhepMcp');
    expect(the.xemTruoc).toMatchObject({ the: 'NT-13', viec: 'Đính kèm tệp' });
    expect(the.xemTruoc.noiDung).toMatch(/^erd\.png · 6 B · image\/png/);
    expect(the.args).not.toMatch(/base64/);
    expect(daGoiMcp.filter(([t]) => t.startsWith('attach'))).toEqual([['attach_file', { project: 'NT', issue: 'NT-13', fileName: 'erd.png', contentType: 'image/png', base64: Buffer.from([137, 80, 78, 71, 13, 10]).toString('base64') }]]);
    const kq = daGui[1]!.messages.find((m: any) => m.role === 'tool').content;
    expect(kq).toMatch(/^Đã đính kèm erd\.png \(6 B\)/);
  });

  it('attach_file với file ngoài vùng đọc ⇒ lỗi chỉ cách kéo vào, KHÔNG hỏi duyệt, không gọi CT Work', async () => {
    const id = loop.taoCuoc();
    kichBan.push(goiTool('a2', 'mcp__ctwork__attach_file', { project: 'NT', issue: 'NT-13', path: '/etc/hosts' }), [xong([{ role: 'assistant', content: 'ok' }])]);
    caiDat.ctworkMacDinh = JSON.stringify({ tatCa: true });
    const sk: any[] = [];
    await loop.chayLuot(id, 'đính kèm', { goc: null }, (e) => sk.push(e));
    expect(sk.some((e) => e.loai === 'xinPhepMcp')).toBe(false);
    expect(daGoiMcp).toEqual([]);
    expect(daGui[1]!.messages.find((m: any) => m.role === 'tool').content).toMatch(/xin_quyen_thu_muc/);
  });

  it('ảnh dán ⇒ lưu ra dinh-kem/ + ghi chú đường dẫn; phạm vi "tất cả" ⇒ tool CT Work có mặt không cần thư mục, ghi chú phạm vi MỘT lần', async () => {
    caiDat.ctworkMacDinh = JSON.stringify({ tatCa: true });
    const id = loop.taoCuoc();
    kichBan.push([xong([{ role: 'assistant', content: 'ok' }])], [xong([{ role: 'assistant', content: 'ok' }])]);
    await loop.chayLuot(id, 'gắn ảnh này vào NT-13', { goc: null, anh: ['data:image/png;base64,iVBORw0KGgo='] }, () => undefined);
    const chu = cauNguoiDung(0);
    expect(chu).toMatch(/phạm vi: MỌI dự án của người dùng/);
    const m = /ảnh người dùng dán đã lưu trên máy: (\S+\.png)/.exec(chu);
    expect(m).not.toBeNull();
    expect((await fs.stat(m![1]!)).isFile()).toBe(true);
    expect(m![1]!.startsWith(path.join(THU_MUC, 'dinh-kem'))).toBe(true);
    expect(daGui[0]!.ctwork).toEqual({ phamVi: 'tatCa' });
    expect(daGui[0]!.toolMcp.map((t: any) => t.name)).toContain('mcp__ctwork__attach_file');
    await loop.chayLuot(id, 'còn gì nữa', { goc: null }, () => undefined);
    expect(cauNguoiDung(1)).toBe('còn gì nữa');
  });

  it('đã nối nhưng chưa chọn phạm vi + không thư mục ⇒ coi như TẤT CẢ dự án (tool CT Work vẫn tới model)', async () => {
    const id = loop.taoCuoc();
    kichBan.push([xong([{ role: 'assistant', content: 'ok' }])]);
    await loop.chayLuot(id, 'chào', { goc: null }, () => undefined);
    expect(daGui[0]!.ctwork).toMatchObject({ phamVi: 'tatCa' });
    expect(daGui[0]!.toolMcp.length).toBeGreaterThan(0);
  });

  it('tool trình duyệt nhắm cuongthai.com/work ⇒ từ chối ngay ở chayToolAgent, chỉ đường mcp__ctwork__*', async () => {
    const goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-ben-loop-web-'));
    const r = await chayToolAgent(goc, 'web_mo', { url: 'https://cuongthai.com/work/prj301/issues/NT-13' });
    expect(r.noiDung).toMatch(/^TỪ CHỐI[\s\S]*mcp__ctwork__/);
    expect(r.tomTat).toBe('CT Work — dùng tool ngầm');
  });
});
