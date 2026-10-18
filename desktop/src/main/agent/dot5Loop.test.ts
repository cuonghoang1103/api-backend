/**
 * ĐỢT 5 — vòng lặp agent với CT Work (máy chủ AI GIẢ qua `fetch`, server MCP CT Work GIẢ):
 *   • tool CT Work CHỈ ĐỌC ⇒ không hỏi, tóm tắt một dòng + bảng gọn;
 *   • tool CT Work GHI ⇒ LUÔN hỏi kèm xem trước (thẻ nào, việc gì) — kể cả "Bỏ qua hết", trừ `/ctwork tu-ghi on`;
 *   • server MCP khác giữ luật cũ ("Bỏ qua hết" ⇒ không hỏi);
 *   • `LF-18` trong câu ⇒ tóm tắt thẻ đính kèm + chip; thân gửi lên mang `ctwork` (dự án đã gắn).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const THU_MUC = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-dot5loop-'));
vi.mock('electron', () => ({ app: { getPath: () => THU_MUC, isPackaged: false, getVersion: () => '1' }, BrowserWindow: { getAllWindows: () => [] }, safeStorage: { isEncryptionAvailable: () => false } }));
const caiDat: Record<string, unknown> = {};
vi.mock('../store', () => ({ getSettings: () => caiDat, setSetting: (k: string, v: unknown) => { caiDat[k] = v; } }));
vi.mock('../ipc/auth', () => ({ readStoredSession: () => ({ userId: 7, sessionToken: 'tok-thu' }) }));
vi.mock('../config', () => ({ API_ORIGIN: 'http://may-chu-gia.test', WEB_ORIGIN: 'http://web-gia.test', IS_DEV: true }));

const M = await import('./ctworkMauThu');
type ToolGia = { ten: string; server: string; tenGoc: string; moTa: string; thamSo: Record<string, unknown>; chiDoc?: boolean };
const TOOL: ToolGia[] = [
  { ten: 'mcp__ctwork__sprint_current', server: 'ctwork', tenGoc: 'sprint_current', moTa: '', thamSo: {}, chiDoc: true },
  { ten: 'mcp__ctwork__comment', server: 'ctwork', tenGoc: 'comment', moTa: '', thamSo: {} },
  { ten: 'mcp__ctwork__get_issue', server: 'ctwork', tenGoc: 'get_issue', moTa: '', thamSo: {}, chiDoc: true },
  { ten: 'mcp__khac__xoa_db', server: 'khac', tenGoc: 'xoa_db', moTa: '', thamSo: {} },
];
const daGoiMcp: Array<[string, Record<string, unknown>]> = [];
const traMcp = (tenGoc: string, args: Record<string, unknown>) => ({
  noiDung: tenGoc === 'sprint_current' ? M.mauSprintCurrent(5) : tenGoc === 'get_issue' ? M.mauGetIssue(String(args.issue)) : tenGoc === 'comment' ? '{"commentId":9,"issue":"LF-18"}' : 'ok',
  anh: [], loi: false,
});
vi.mock('./mcp', async (goc) => ({
  ...(await goc<typeof import('./mcp')>()),
  toolMcpHienCo: () => TOOL,
  laToolMcp: (t: string) => t.startsWith('mcp__'),
  laCtworkTinCay: (sv: string) => sv === 'ctwork',
  trangThaiServer: () => [{ ten: 'ctwork', ok: true, soTool: 3 }],
  hanMucMcp: () => ({ daDung: 1, tran: 200 }),
  goiToolMcp: async (ten: string, args: Record<string, unknown>) => { const t = TOOL.find((x) => x.ten === ten)!; daGoiMcp.push([t.tenGoc, args]); return traMcp(t.tenGoc, args); },
  goiToolMcpTrucTiep: async (_sv: string, tenGoc: string, args: Record<string, unknown>) => { daGoiMcp.push([tenGoc, args]); return traMcp(tenGoc, args); },
}));

const loop = await import('./loop');
const { traLoi } = await import('./xinPhep');
const H = await import('./ctworkHe');

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

async function chay(cuocId: string, cau: string, goc: string | null, onSk?: (e: any) => void) {
  const sk: any[] = [];
  await loop.chayLuot(cuocId, cau, { goc }, (e) => { sk.push(e); onSk?.(e); });
  return sk;
}

describe('CT Work trong vòng lặp agent', () => {
  it('ĐỌC (readOnlyHint) ⇒ không thẻ duyệt; dòng tóm tắt "Sprint 2 · 5 thẻ · còn 5 ngày" + bảng gọn, không JSON', async () => {
    const id = loop.taoCuoc();
    kichBan.push(goiTool('t1', 'mcp__ctwork__sprint_current', { project: 'LF' }), [xong([{ role: 'assistant', content: 'ok' }])]);
    const sk = await chay(id, 'sprint thế nào', null);
    expect(sk.some((e) => e.loai === 'xinPhepMcp')).toBe(false);
    const t = sk.find((e) => e.loai === 'tool' && e.id === 't1');
    expect(t.tomTat).toBe('Sprint 2 · 5 thẻ · còn 5 ngày');
    expect(t.xemGon).toMatch(/\*\*To Do\*\*/);
    expect(t.xemGon).not.toMatch(/"key":/);
    expect(daGui[1]!.messages.find((m: any) => m.role === 'tool').content).toContain('"Sprint 2"'); // model vẫn đọc bản đầy đủ
  });

  it('GHI ⇒ hỏi kèm xem trước KỂ CẢ "Bỏ qua hết"; từ chối ⇒ không gọi', async () => {
    const id = loop.taoCuoc();
    loop.datCheDoQuyen(id, 'boQuaHet');
    kichBan.push(goiTool('w1', 'mcp__ctwork__comment', { project: 'LF', issue: 'LF-18', markdown: 'Đã vẽ ERD v1' }), [xong([{ role: 'assistant', content: 'ok' }])]);
    const sk = await chay(id, 'ghi bình luận', null, (e) => { if (e.loai === 'xinPhepMcp') setTimeout(() => traLoi(e.id, 'tuChoi'), 5); });
    const the = sk.find((e) => e.loai === 'xinPhepMcp');
    expect(the).toMatchObject({ ctwork: true, xemTruoc: { the: 'LF-18', viec: 'Bình luận', noiDung: 'Đã vẽ ERD v1' } });
    expect(daGoiMcp.some(([t]) => t === 'comment')).toBe(false);
  });

  it('GHI + đồng ý ⇒ chạy; `/ctwork tu-ghi on` ⇒ không hỏi', async () => {
    const id = loop.taoCuoc();
    kichBan.push(goiTool('w2', 'mcp__ctwork__comment', { project: 'LF', issue: 'LF-18', markdown: 'x' }), [xong([{ role: 'assistant', content: 'ok' }])]);
    const sk = await chay(id, 'ghi', null, (e) => { if (e.loai === 'xinPhepMcp') setTimeout(() => traLoi(e.id, 'choPhep'), 5); });
    expect(sk.filter((e) => e.loai === 'xinPhepMcp')).toHaveLength(1);
    expect(sk.find((e) => e.loai === 'tool' && e.id === 'w2').tomTat).toBe('đã bình luận vào LF-18');
    caiDat.ctworkTuGhi = true;
    kichBan.push(goiTool('w3', 'mcp__ctwork__comment', { project: 'LF', issue: 'LF-18', markdown: 'y' }), [xong([{ role: 'assistant', content: 'ok' }])]);
    const sk2 = await chay(id, 'ghi nữa', null);
    expect(sk2.some((e) => e.loai === 'xinPhepMcp')).toBe(false);
    expect(daGoiMcp.filter(([t]) => t === 'comment')).toHaveLength(2);
  });

  it('server MCP KHÁC: luật cũ — "Bỏ qua hết" ⇒ không hỏi, không có xemTruoc', async () => {
    const id = loop.taoCuoc();
    loop.datCheDoQuyen(id, 'boQuaHet');
    kichBan.push(goiTool('k1', 'mcp__khac__xoa_db', { bang: 'x' }), [xong([{ role: 'assistant', content: 'ok' }])]);
    const sk = await chay(id, 'xoá', null);
    expect(sk.some((e) => e.loai === 'xinPhepMcp')).toBe(false);
    expect(sk.find((e) => e.loai === 'tool' && e.id === 'k1').tomTat).toMatch(/khac · 1\/200 lượt hôm nay/);
  });

  it('`LF-18` trong câu ⇒ tóm tắt thẻ nối vào tin + chip; thân gửi `ctwork` của thư mục đã gắn', async () => {
    const goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-dot5loop-duan-'));
    await H.ghiGan(goc, { key: 'LF', projectId: 2, workspaceId: 3, ten: 'LabFlow AI' });
    const id = loop.taoCuoc();
    loop.datGocChoCuoc(id, goc);
    kichBan.push([xong([{ role: 'assistant', content: 'đã đọc' }])]);
    const sk = await chay(id, 'giải thích LF-18 giúp mình', goc);
    expect(sk.find((e) => e.loai === 'dinhKemCtwork')).toEqual({ loai: 'dinhKemCtwork', khoa: ['LF-18'] });
    const tin = daGui[0]!.messages.filter((m: any) => m.role === 'user').at(-1);
    const chu = typeof tin.content === 'string' ? tin.content : tin.content[0].text;
    expect(chu).toMatch(/^giải thích LF-18 giúp mình\n\n\[App: người dùng nhắc LF-18/);
    expect(chu).toContain('<ctwork-content source="issue LF-18 (summary)" untrusted="true">');
    expect(daGui[0]!.ctwork).toMatchObject({ key: 'LF', projectId: 2, workspaceId: 3, ten: 'LabFlow AI' });
    // Không nhắc thẻ ⇒ không đính kèm, vẫn mang ctwork.
    kichBan.push([xong([{ role: 'assistant', content: 'ok' }])]);
    const sk2 = await chay(id, 'chào', goc);
    expect(sk2.some((e) => e.loai === 'dinhKemCtwork')).toBe(false);
    expect(daGui[1]!.ctwork?.key).toBe('LF');
  });
});
