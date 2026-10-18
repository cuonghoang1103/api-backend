/**
 * ĐỢT 6 — vòng lặp agent (máy chủ AI GIẢ qua `fetch`, server MCP CT Work GIẢ):
 *   • nạp tool theo nhu cầu: thân gửi mang MỤC LỤC + capability `mcp_nap`; `nap_tool_mcp` chạy tại app ⇒ lượt sau tool có schema;
 *   • (lỗi đợt trước) gõ thêm giữa lượt rồi Esc ⇒ tin TRẢ VỀ (`traChen`), không mất;
 *   • (lỗi đợt trước) "3. Không, và bảo CuongMini làm khác đi" ⇒ lượt DỪNG chờ người dùng (`huy` lyDo `tuChoi`), tool_call còn
 *     lại nhận kết quả "bỏ qua", KHÔNG gọi máy chủ thêm vòng nào;
 *   • thư mục gắn dự án CHỈ ĐỌC ⇒ tool GHI CT Work bị từ chối, không thẻ duyệt, không gọi;
 *   • AGENTS.md của NHÓM (trang Docs) gộp vào ghi chú dự án gửi lên + báo MỘT lần; thân gửi mang `ctworkDuAn` (hạn mức nhóm).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const THU_MUC = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-dot6loop-'));
vi.mock('electron', () => ({ app: { getPath: () => THU_MUC, isPackaged: false, getVersion: () => '1' }, BrowserWindow: { getAllWindows: () => [] }, safeStorage: { isEncryptionAvailable: () => false } }));
const caiDat: Record<string, unknown> = {};
vi.mock('../store', () => ({ getSettings: () => caiDat, setSetting: (k: string, v: unknown) => { caiDat[k] = v; } }));
vi.mock('../ipc/auth', () => ({ readStoredSession: () => ({ userId: 7, sessionToken: 'tok-thu' }) }));
vi.mock('../config', () => ({ API_ORIGIN: 'http://may-chu-gia.test', WEB_ORIGIN: 'http://web-gia.test', IS_DEV: true }));

const M = await import('./ctworkMauThu');
type ToolGia = { ten: string; server: string; tenGoc: string; moTa: string; thamSo: Record<string, unknown>; chiDoc?: boolean };
const mk = (tenGoc: string, ghi: boolean): ToolGia => ({ ten: `mcp__ctwork__${tenGoc}`, server: 'ctwork', tenGoc, moTa: `CT Work ${tenGoc}`, thamSo: { type: 'object' }, ...(ghi ? {} : { chiDoc: true }) });
const LOI = [mk('my_work', false), mk('get_issue', false), mk('comment', true)];
const MUC_LUC = [mk('srs_get', false), mk('fpt_unit_add_cases', true)];
const daNap = new Map<string, string[]>();
const daGoiMcp: Array<[string, Record<string, unknown>]> = [];
let treMcp = 0;
vi.mock('./mcp', async (goc) => ({
  ...(await goc<typeof import('./mcp')>()),
  toolMcpHienCo: () => LOI,
  toolGuiChoCuoc: (id: string, o: { boGhiCtwork?: boolean } = {}) => [...LOI, ...MUC_LUC.filter((t) => (daNap.get(id) ?? []).includes(t.ten))].filter((t) => !o.boGhiCtwork || t.chiDoc),
  mucLucChoCuoc: () => MUC_LUC.map((t) => ({ name: t.ten, mo: t.moTa })),
  napToolChoCuoc: (id: string, ten: string[]) => {
    const co = MUC_LUC.filter((t) => ten.includes(t.ten));
    daNap.set(id, [...(daNap.get(id) ?? []), ...co.map((t) => t.ten)]);
    return { daNap: co, khongCo: ten.filter((x) => !MUC_LUC.some((t) => t.ten === x) && !LOI.some((t) => t.ten === x)), daCo: ten.filter((x) => LOI.some((t) => t.ten === x)) };
  },
  timToolMcp: (t: string) => [...LOI, ...MUC_LUC].find((x) => x.ten === t),
  laToolMcp: (t: string) => t.startsWith('mcp__'),
  laCtworkTinCay: (sv: string) => sv === 'ctwork',
  trangThaiServer: () => [{ ten: 'ctwork', ok: true, soTool: 3 }],
  toolCuaServer: () => [...LOI, ...MUC_LUC],
  hanMucMcp: () => ({ daDung: 1, tran: 200 }),
  goiToolMcp: async (ten: string, args: Record<string, unknown>) => {
    const t = [...LOI, ...MUC_LUC].find((x) => x.ten === ten)!;
    daGoiMcp.push([t.tenGoc, args]);
    if (treMcp) await new Promise((ok) => setTimeout(ok, treMcp));
    return { noiDung: t.tenGoc === 'my_work' ? M.MAU_MY_WORK : '{"ok":true}', anh: [], loi: false };
  },
  goiToolMcpTrucTiep: async (_sv: string, tenGoc: string, args: Record<string, unknown>) => {
    daGoiMcp.push([tenGoc, args]);
    if (tenGoc === 'list_pages') return { noiDung: M.mauListPages(), anh: [], loi: false };
    if (tenGoc === 'get_page') return { noiDung: M.mauGetPage(Number(args.page), M.MAU_TRANG_AGENTS), anh: [], loi: false };
    if (tenGoc === 'sprint_current') return { noiDung: M.mauSprintCurrent(5), anh: [], loi: false };
    if (tenGoc === 'get_issue') return { noiDung: M.mauGetIssue(String(args.issue)), anh: [], loi: false };
    return { noiDung: 'ok', anh: [], loi: false };
  },
}));

const loop = await import('./loop');
const { traLoi } = await import('./xinPhep');
const H = await import('./ctworkHe');
const DD = await import('./ctworkDanDuong');

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
const goiTool = (calls: Array<[string, string, Record<string, unknown>]>): Khung[] => [
  ...calls.map(([id, name, args]) => ({ type: 'tool_call', id, name, args })),
  xong([{ role: 'assistant', content: null, tool_calls: calls.map(([id, name, args]) => ({ id, type: 'function', function: { name, arguments: JSON.stringify(args) } })) }], 'tool_calls'),
];
beforeEach(() => { kichBan = []; daGui = []; daGoiMcp.length = 0; daNap.clear(); treMcp = 0; for (const k of Object.keys(caiDat)) delete caiDat[k]; H._xoaDem(); DD._xoaDemDanDuong(); });

async function chay(cuocId: string, cau: string, goc: string | null, onSk?: (e: any) => void) {
  const sk: any[] = [];
  await loop.chayLuot(cuocId, cau, { goc }, (e) => { sk.push(e); onSk?.(e); });
  return sk;
}

describe('ĐỢT 6 trong vòng lặp agent', () => {
  it('nạp tool theo nhu cầu: mục lục + mcp_nap trong thân; nap_tool_mcp ⇒ lượt sau có schema, gọi được', async () => {
    const id = loop.taoCuoc();
    kichBan.push(
      goiTool([['n1', 'nap_tool_mcp', { ten: ['mcp__ctwork__srs_get', 'mcp__ctwork__khong_co'] }]]),
      goiTool([['s1', 'mcp__ctwork__srs_get', { project: 'LF' }]]),
      [xong([{ role: 'assistant', content: 'xong' }])],
    );
    const sk = await chay(id, 'đọc SRS', null);
    expect(daGui[0]!.mcpMucLuc.map((x: any) => x.name)).toEqual(['mcp__ctwork__srs_get', 'mcp__ctwork__fpt_unit_add_cases']);
    expect(daGui[0]!.toolMcp.map((t: any) => t.name)).not.toContain('mcp__ctwork__srs_get');
    expect(daGui[1]!.toolMcp.map((t: any) => t.name)).toContain('mcp__ctwork__srs_get');
    const kq = daGui[1]!.messages.find((m: any) => m.role === 'tool').content;
    expect(kq).toMatch(/ĐÃ NẠP 1 tool[\s\S]*mcp__ctwork__srs_get[\s\S]*KHÔNG có trong mục lục: mcp__ctwork__khong_co/);
    expect(sk.find((e) => e.loai === 'tool' && e.id === 'n1').tomTat).toBe('nạp srs_get');
    expect(daGoiMcp.map(([t]) => t)).toContain('srs_get');
  });

  it('LỖI: gõ thêm giữa lượt rồi Esc ⇒ tin trả về (traChen), không bị nhét vào kết quả tool', async () => {
    const id = loop.taoCuoc();
    treMcp = 150;
    kichBan.push(goiTool([['t1', 'mcp__ctwork__my_work', {}]]), [xong([{ role: 'assistant', content: 'không tới đây' }])]);
    const sk = await chay(id, 'việc của tôi', null, (e) => {
      if (e.loai === 'toolBatDau') { expect(loop.chenTinCua(id, 'à, làm LF-19 trước')).toBe(true); setTimeout(() => loop.huyLuotCua(id), 20); }
    });
    expect(sk.find((e) => e.loai === 'traChen')).toEqual({ loai: 'traChen', ds: ['à, làm LF-19 trước'] });
    expect(sk.some((e) => e.loai === 'huy')).toBe(true);
    expect(sk.some((e) => e.loai === 'daChen')).toBe(false);
    // Lượt sau KHÔNG mang tin cũ (đã trả về giao diện).
    kichBan.push([xong([{ role: 'assistant', content: 'ok' }])]);
    await chay(id, 'tiếp', null);
    expect(JSON.stringify(daGui.at(-1)!.messages)).not.toContain('làm LF-19 trước');
  });

  it('LỖI: "Không, và bảo CuongMini làm khác đi" ⇒ dừng lượt chờ người dùng; tool còn lại nhận "bỏ qua"; không gọi máy chủ thêm', async () => {
    const id = loop.taoCuoc();
    kichBan.push(goiTool([['w1', 'mcp__ctwork__comment', { project: 'LF', issue: 'LF-18', markdown: 'x' }], ['r2', 'mcp__ctwork__get_issue', { project: 'LF', issue: 'LF-18' }]]));
    const sk = await chay(id, 'bình luận', null, (e) => {
      if (e.loai === 'xinPhepMcp') setTimeout(() => { loop.datDungChiDan(id); traLoi(e.id, 'tuChoi'); }, 5);
    });
    expect(sk.at(-1)).toEqual({ loai: 'huy', lyDo: 'tuChoi' });
    expect(daGui).toHaveLength(1); // không vòng nào nữa
    expect(daGoiMcp.some(([t]) => t === 'comment' || t === 'get_issue')).toBe(false);
    // Lượt sau: hội thoại đúng giao thức (mọi tool_call có kết quả) + câu chỉ dẫn mới.
    kichBan.push([xong([{ role: 'assistant', content: 'ok, làm khác' }])]);
    await chay(id, 'đừng bình luận, chỉ đọc thôi', null);
    const tools = daGui.at(-1)!.messages.filter((m: any) => m.role === 'tool');
    expect(tools.map((m: any) => m.tool_call_id)).toEqual(['w1', 'r2']);
    expect(tools[0].content).toMatch(/NGƯỜI DÙNG TỪ CHỐI/);
    expect(tools[1].content).toMatch(/BỎ QUA — người dùng đã dừng lượt/);
  });

  it('gắn CHỈ ĐỌC ⇒ tool GHI CT Work bị từ chối (không thẻ duyệt, không gọi); thân không mời tool ghi', async () => {
    const goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-dot6loop-doc-'));
    await H.ghiGan(goc, { key: 'LF', projectId: 2, workspaceId: 3, quyen: 'doc' });
    const id = loop.taoCuoc();
    loop.datGocChoCuoc(id, goc);
    kichBan.push(goiTool([['w1', 'mcp__ctwork__comment', { project: 'LF', issue: 'LF-18', markdown: 'x' }]]), [xong([{ role: 'assistant', content: 'ok' }])]);
    const sk = await chay(id, 'bình luận', goc);
    expect(sk.some((e) => e.loai === 'xinPhepMcp')).toBe(false);
    expect(daGoiMcp.some(([t]) => t === 'comment')).toBe(false);
    expect(daGui[0]!.toolMcp.map((t: any) => t.name)).not.toContain('mcp__ctwork__comment');
    expect(daGui[0]!.ctwork).toMatchObject({ key: 'LF', chiDoc: true });
    expect(daGui[1]!.messages.find((m: any) => m.role === 'tool').content).toMatch(/CHỈ ĐỌC/);
  });

  it('AGENTS.md của NHÓM gộp vào ghi chú dự án gửi lên (cục bộ thắng) + báo một lần; thân mang ctworkDuAn', async () => {
    const goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-dot6loop-nhom-'));
    await fs.writeFile(path.join(goc, 'AGENTS.md'), '# Repo\n## Vai trò\nViết code thoải mái.\n');
    await H.ghiGan(goc, { key: 'LF', projectId: 2, workspaceId: 3 });
    const id = loop.taoCuoc();
    loop.datGocChoCuoc(id, goc);
    kichBan.push([xong([{ role: 'assistant', content: 'ok' }])], [xong([{ role: 'assistant', content: 'ok' }])]);
    const sk = await chay(id, 'chào', goc);
    const gc = daGui[0]!.ghiChuDuAn;
    expect(gc.ten).toBe('AGENTS.md + CT Work');
    expect(gc.noiDung).toMatch(/Viết code thoải mái/);
    expect(gc.noiDung).not.toMatch(/CuongMini là MENTOR/); // mục "Vai trò" trùng ⇒ cục bộ thắng
    expect(gc.noiDung).toMatch(/Hướng dẫn của NHÓM \(CT Work · LF-DOC-5[\s\S]*Quy ước git/);
    expect(sk.filter((e) => e.loai === 'ctwHuongDanNhom')).toHaveLength(1);
    expect(daGui[0]!.ctworkDuAn).toBe(2);
    const sk2 = await chay(id, 'lần hai', goc);
    expect(sk2.some((e) => e.loai === 'ctwHuongDanNhom')).toBe(false); // một lần mỗi cuộc
    expect(daGoiMcp.filter(([t]) => t === 'get_page')).toHaveLength(1); // đệm theo updatedAt
  });
});
