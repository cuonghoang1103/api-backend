/**
 * ĐỢT 4 — vòng lặp agent (máy chủ GIẢ qua `fetch`): gõ thêm GIỮA lượt, ngày giờ gửi lên, capability
 * `may_tinh` theo công tắc, thao tác máy LUÔN hỏi kể cả "Bỏ qua hết" (tầng HĐH giả — không bấm thật).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { writeFileSync } from 'node:fs';

const THU_MUC = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-dot4loop-'));
vi.mock('electron', () => ({ app: { getPath: () => THU_MUC, isPackaged: false }, BrowserWindow: { getAllWindows: () => [] } }));
const caiDat: Record<string, unknown> = {};
vi.mock('../store', () => ({ getSettings: () => caiDat, setSetting: (k: string, v: unknown) => { caiDat[k] = v; } }));
vi.mock('../ipc/auth', () => ({ readStoredSession: () => ({ userId: 7, sessionToken: 'tok-thu' }) }));
vi.mock('../config', () => ({ API_ORIGIN: 'http://may-chu-gia.test', WEB_ORIGIN: 'http://web-gia.test', IS_DEV: true }));

const loop = await import('./loop');
const may = await import('./mayTinh');
const { traLoi } = await import('./xinPhep');

type Khung = Record<string, unknown>;
let kichBan: Array<{ khung: Khung[]; truoc?: () => void }> = [];
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
    k.truoc?.();
    return sse(k.khung);
  }
  return new Response('{}', { status: 404 });
});

const xong = (append: unknown[], stop = 'end'): Khung => ({ type: 'done', append, stop, usage: { inputTokens: 1, outputTokens: 1, costUsd: 0.001 }, quota: null });
const goiTool = (id: string, name: string, args: Record<string, unknown>): Khung[] => [
  { type: 'tool_call', id, name, args },
  xong([{ role: 'assistant', content: null, tool_calls: [{ id, type: 'function', function: { name, arguments: JSON.stringify(args) } }] }], 'tool_calls'),
];

beforeEach(() => { kichBan = []; daGui = []; for (const k of Object.keys(caiDat)) delete caiDat[k]; });

async function chay(cuocId: string, cau: string, onSk?: (e: any) => void) {
  const sk: any[] = [];
  await loop.chayLuot(cuocId, cau, { goc: null }, (e) => { sk.push(e); onSk?.(e); });
  return sk;
}

describe('gõ thêm khi agent đang chạy', () => {
  it('chèn vào KẾT QUẢ TOOL kế tiếp (không chờ hết lượt) + sự kiện daChen', async () => {
    const id = loop.taoCuoc();
    expect(loop.chenTinCua(id, 'x')).toBe(false); // không chạy ⇒ giao diện gửi như lượt mới
    kichBan.push({ khung: goiTool('c1', 'cap_nhat_ke_hoach', { viec: [{ ten: 'a', trangThai: 'dang' }] }), truoc: () => { expect(loop.chenTinCua(id, 'dùng pnpm thay npm')).toBe(true); } });
    kichBan.push({ khung: [xong([{ role: 'assistant', content: 'Ok.' }])] });
    const sk = await chay(id, 'làm việc A');
    const tool = daGui[1]!.messages.find((m: any) => m.role === 'tool');
    expect(tool.content).toMatch(/NGƯỜI DÙNG VỪA GÕ THÊM GIỮA LƯỢT[\s\S]*> dùng pnpm thay npm/);
    expect(sk.find((e) => e.loai === 'daChen')).toMatchObject({ text: 'dùng pnpm thay npm', cach: 'tool' });
    expect(sk.at(-1).loai).toBe('xong');
  });

  it('model đã viết xong mà còn tin chèn ⇒ đi tiếp NGAY một vòng với tin đó (cùng lượt)', async () => {
    const id = loop.taoCuoc();
    kichBan.push({ khung: [xong([{ role: 'assistant', content: 'Xong rồi.' }])], truoc: () => { loop.chenTinCua(id, 'à, thêm test nữa'); } });
    kichBan.push({ khung: [xong([{ role: 'assistant', content: 'Đã thêm test.' }])] });
    const sk = await chay(id, 'việc B');
    expect(daGui).toHaveLength(2);
    expect(daGui[1]!.messages.at(-1)).toMatchObject({ role: 'user' });
    expect(daGui[1]!.messages.at(-1).content).toMatch(/à, thêm test nữa/);
    expect(sk.filter((e) => e.loai === 'xong')).toHaveLength(1);
    expect(sk.find((e) => e.loai === 'daChen')?.cach).toBe('cuoiLuot');
  });
});

describe('ngày giờ + capability may_tinh', () => {
  it('thân gửi lên mang ngày + múi giờ (chỉ NGÀY); may_tinh chỉ khi bật công tắc', async () => {
    const id = loop.taoCuoc();
    kichBan.push({ khung: [xong([{ role: 'assistant', content: 'a' }])] });
    await chay(id, 'một');
    expect(daGui[0]!.ngayGio.ngay).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(typeof daGui[0]!.ngayGio.tz).toBe('string');
    expect(daGui[0]!.ngayGio).not.toHaveProperty('gio');
    expect(daGui[0]!.capabilities).not.toContain('may_tinh');
    loop.datMayTinh(true);
    kichBan.push({ khung: [xong([{ role: 'assistant', content: 'b' }])] });
    await chay(id, 'hai');
    expect(daGui[1]!.capabilities).toContain('may_tinh');
  });

  it('"Bỏ qua tất cả" vẫn HỎI từng cú bấm; chụp thì không hỏi; từ chối ⇒ không bấm', async () => {
    const goi: string[] = [];
    may._datChay(async (lenh, args) => {
      goi.push(`${lenh} ${args[3] ?? args.join(' ')}`);
      if (lenh === 'screencapture') {
        const b = Buffer.alloc(33); b.writeUInt32BE(0x89504e47, 0); b.writeUInt32BE(800, 16); b.writeUInt32BE(600, 20);
        writeFileSync(args.at(-1)!, b);
      }
      if (lenh === 'osascript' && args[3]!.includes('CGPreflight')) return { ma: 0, ra: '{"chup":true,"dieuKhien":true}', loi: '' };
      if (lenh === 'osascript' && args[3]!.includes('NSScreen')) return { ma: 0, ra: '{"w":800,"h":600}', loi: '' };
      return { ma: 0, ra: 'ok', loi: '' };
    }, 'darwin');
    loop.datMayTinh(true);
    const id = loop.taoCuoc();
    loop.datCheDoQuyen(id, 'boQuaHet');
    kichBan.push({ khung: goiTool('m1', 'may_chup', {}) });
    kichBan.push({ khung: goiTool('m2', 'may_bam', { x: 10, y: 20, chup_sau: false }) });
    kichBan.push({ khung: goiTool('m3', 'may_bam', { x: 30, y: 40, chup_sau: false }) });
    kichBan.push({ khung: [xong([{ role: 'assistant', content: 'xong' }])] });
    let lan = 0;
    const sk = await chay(id, 'bấm giúp', (e) => {
      if (e.loai === 'xinPhepLenh') { lan += 1; setTimeout(() => traLoi(e.id, lan === 1 ? 'choPhep' : 'tuChoi'), 5); }
    });
    const the = sk.filter((e) => e.loai === 'xinPhepLenh');
    expect(the).toHaveLength(2);
    expect(the[0].lenh).toMatch(/Bấm chuột trái tại \(10, 20\)/);
    expect(the[0].phanLoai.choNho).toBe(false);
    expect(daGui[1]!.messages.find((m: any) => m.role === 'tool' && m.tool_call_id === 'm1').anh?.[0]?.media_type).toBe('image/png');
    expect(goi.filter((g) => g.startsWith('osascript') && g.includes('CGEventCreateMouseEvent'))).toHaveLength(1); // lần 2 bị từ chối
    expect(daGui[3]!.messages.find((m: any) => m.tool_call_id === 'm3').content).toMatch(/NGƯỜI DÙNG TỪ CHỐI/);
    may._datChay(null);
  });
});
