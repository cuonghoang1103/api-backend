/**
 * CỔNG CLAUDE CHÍNH HÃNG phía APP (17/10/2026) — hợp đồng `docs/cong-anthropic-chinh-hang.md`.
 *
 * Chạy `chayLuot` THẬT với một `fetch` giả nói SSE như máy chủ. Kiểm đúng
 * những thứ mà đọc mã không chứng minh được:
 *   • `khoiAnthropic` (thinking có CHỮ KÝ) đi NGUYÊN VĂN: hội thoại → file phiên
 *     → mở lại → quay lui → tách nhánh → `/compact` → lượt sau gửi lên.
 *   • vé `congAnthropicVe` có ở MỌI lượt (chính + phụ); `CONG_ANTHROPIC_KHOA` xoá vé.
 *   • khung `cong` `CONG_CHINH_HONG_FREE` ⇒ sự kiện có `cacCong`, tab giữ Free và
 *     gửi `congPhu` tường minh (không để máy chủ hiểu nhầm là "app cũ muốn modelapi").
 *   • `mucModelPhu` của lượt phụ: tham số tool thắng khoá `model:` trong file agent.
 *   • PDF gốc chỉ gửi ở cổng `cl-*`.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const THU_MUC = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-cch-'));
vi.mock('electron', () => ({ app: { getPath: () => THU_MUC, isPackaged: false }, BrowserWindow: { getAllWindows: () => [] } }));

const caiDat: Record<string, unknown> = {};
vi.mock('../store', () => ({
  getSettings: () => caiDat,
  setSetting: (k: string, v: unknown) => { caiDat[k] = v; },
}));
vi.mock('../ipc/auth', () => ({ readStoredSession: () => ({ userId: 7, sessionToken: 'tok-thu' }) }));
vi.mock('../config', () => ({ API_ORIGIN: 'http://may-chu-gia.test', WEB_ORIGIN: 'http://web-gia.test', IS_DEV: true }));

const loop = await import('./loop');
const { docPhien } = await import('./phien');
const { chuanHoaMucModelPhu, docModelDauFile } = await import('./agentPhu');
const { timPdfTrongCau, docKhoiPdf, laCongChinhHang } = await import('./pdfGoc');
const { goiCompact } = await import('./lenhMayChu');
const { ghepTomTat } = await import('./thanGui');

type Khung = Record<string, unknown>;
/** Mỗi lời gọi `/agent/turn` lấy một kịch bản: mảng khung SSE, hoặc `{ http, json }`. */
let kichBan: Array<Khung[] | { http: number; json: unknown }> = [];
let daGui: Array<Record<string, any>> = [];

function sse(khung: Khung[]): Response {
  const chu = khung.map((k) => `data: ${JSON.stringify(k)}\n\n`).join('');
  return new Response(new ReadableStream({
    start(c) { c.enqueue(new TextEncoder().encode(chu)); c.close(); },
  }), { status: 200, headers: { 'content-type': 'text/event-stream' } });
}

vi.stubGlobal('fetch', async (url: string | URL, init?: RequestInit) => {
  const u = String(url);
  if (u.endsWith('/api/v1/agent/turn')) {
    daGui.push(JSON.parse(String(init?.body ?? '{}')));
    const k = kichBan.shift();
    if (!k) throw new Error('hết kịch bản');
    if (!Array.isArray(k)) return new Response(JSON.stringify(k.json), { status: k.http, headers: { 'content-type': 'application/json' } });
    return sse(k);
  }
  return new Response('{}', { status: 404 });
});

const KHOI = [
  { type: 'thinking', thinking: '', signature: 'CHU-KY-GOC-khong-duoc-sua==' },
  { type: 'text', text: 'Xong.' },
];
const xong = (append: unknown[], stop = 'end'): Khung => ({
  type: 'done', append, stop, usage: { inputTokens: 1, outputTokens: 1, costUsd: 0.0123 }, tienUsd: 0.0123,
  quota: { daDung: 1, tran: 100, phanTram: 1, hoiLucNao: null },
});

beforeEach(() => {
  kichBan = [];
  daGui = [];
  for (const k of Object.keys(caiDat)) delete caiDat[k];
});

async function chay(cuocId: string, cau: string, boiCanh: Partial<Parameters<typeof loop.chayLuot>[2]> = {}) {
  const sk: any[] = [];
  await loop.chayLuot(cuocId, cau, { goc: null, ...boiCanh }, (e) => sk.push(e));
  return sk;
}

describe('khoiAnthropic đi NGUYÊN VĂN', () => {
  it('lượt sau gửi lại đúng mảng khối + vé; file phiên giữ; mở lại / quay lui / tách nhánh / compact không làm rơi', async () => {
    caiDat.agentAnthropicVe = 'ca.7.1.999.chuky';
    const id = loop.taoCuoc();
    kichBan.push([
      { type: 'start', model: 'claude-sonnet-5-5', buoc: 1, tranBuoc: 30, cong: 'anthropic' },
      { type: 'nghi' },
      { type: 'text', delta: 'Xong.' },
      xong([{ role: 'assistant', content: 'Xong.', khoiAnthropic: KHOI }]),
    ]);
    const sk1 = await chay(id, 'câu một', { model: 'cl-sonnet-5-5' });
    expect(sk1.some((e) => e.loai === 'nghi'), 'khung `nghi` ⇒ sự kiện nhẹ cho "Đang suy nghĩ…"').toBe(true);
    expect(sk1.find((e) => e.loai === 'xong')?.tienUsd).toBe(0.0123);
    expect(daGui[0]!.congAnthropicVe).toBe('ca.7.1.999.chuky');

    kichBan.push([xong([{ role: 'assistant', content: 'Hai.' }])]);
    await chay(id, 'câu hai', { model: 'cl-sonnet-5-5' });
    const tinTroLy = daGui[1]!.messages.find((m: any) => m.role === 'assistant');
    expect(tinTroLy.khoiAnthropic).toEqual(KHOI);
    expect(daGui[1]!.congAnthropicVe).toBe('ca.7.1.999.chuky');

    // File phiên trên đĩa (ghi ở `finally`, bất đồng bộ).
    await new Promise((r) => setTimeout(r, 80));
    const p = await docPhien(id);
    expect(p?.hoiThoai.find((m) => m.role === 'assistant')?.khoiAnthropic).toEqual(KHOI);

    // Mở lại phiên vào tab MỚI rồi gõ tiếp.
    const tab2 = loop.taoCuoc();
    loop.napPhien(tab2, p!.id, p!.hoiThoai, p!.duAn, null);
    kichBan.push([xong([{ role: 'assistant', content: 'Ba.' }])]);
    await chay(tab2, 'câu ba', { model: 'cl-sonnet-5-5' });
    expect(daGui[2]!.messages.find((m: any) => m.role === 'assistant').khoiAnthropic).toEqual(KHOI);

    // Quay lui về câu 2 ⇒ tin assistant của câu 1 vẫn còn khối gốc.
    expect(loop.quayLui(tab2, 2).ok).toBe(true);
    expect((loop.hoiThoaiCua(tab2)[1] as any).khoiAnthropic).toEqual(KHOI);

    // Tách nhánh ⇒ file mới vẫn mang khối gốc.
    const nhanh = await loop.tachNhanhCuoc(tab2);
    const pn = await docPhien(nhanh!.id);
    expect(pn?.hoiThoai.find((m) => m.role === 'assistant')?.khoiAnthropic).toEqual(KHOI);

    // /compact: thân gửi máy chủ tóm tắt KHÔNG mang khoiAnthropic; bản ghép gửi model vẫn mang ở phần giữ nguyên.
    const hoi = [
      { role: 'user' as const, content: 'cũ' },
      { role: 'assistant' as const, content: 'cũ', khoiAnthropic: KHOI },
      { role: 'user' as const, content: 'mới' },
      { role: 'assistant' as const, content: 'mới', khoiAnthropic: KHOI },
      { role: 'user' as const, content: 'tiếp' },
    ];
    let thanCompact: any = null;
    const kq = await goiCompact({
      origin: 'http://x', token: 't', hoiThoai: hoi,
      fetchFn: (async (_u: string, init: RequestInit) => {
        thanCompact = JSON.parse(String(init.body));
        return new Response(JSON.stringify({ data: { tomTat: 'TT', soTinDaGop: 2, soLuotDaGop: 1 } }), { status: 200 });
      }) as never,
    });
    expect(thanCompact.messages.some((m: any) => 'khoiAnthropic' in m)).toBe(false);
    expect(kq.ok && 'tomTat' in kq).toBe(true);
    const ghep = ghepTomTat(hoi, (kq as any).tomTat);
    expect((ghep.find((m) => m.content === 'mới' && m.role === 'assistant') as any).khoiAnthropic).toEqual(KHOI);
  });
});

describe('khung `cong` — cổng chính hỏng ⇒ CuongMini Free', () => {
  const CAC_CONG = [
    { cong: 'anthropic', ten: 'Anthropic chính hãng', daBat: true, canMatKhau: true, models: [{ id: 'cl-opus-5-5', ten: 'Claude Opus 5.5 · chính hãng', mo: '…', dungDuoc: true }] },
    { cong: 'modelapi', ten: 'modelapi', daBat: true, canMatKhau: true, models: [{ id: 'gpt-6-sol', ten: 'GPT 6 Sol', mo: '…', dungDuoc: true }] },
  ];

  it('phát sự kiện `loi` mã CONG_CHINH_HONG_FREE kèm cacCong; tab giữ Free, gửi `congPhu` tường minh', async () => {
    caiDat.agentDuPhongVe = 've-du-phong-that'; // có vé dự phòng: im lặng `congPhu` là bị kéo sang GPT
    const id = loop.taoCuoc();
    kichBan.push([
      { type: 'start', model: 'claude-haiku-5-5', buoc: 1, tranBuoc: 30, cong: 'anthropic' },
      { type: 'cong', cong: 'anthropic', model: 'claude-haiku-5-5', ten: 'CuongMini Free', ma: 'CONG_CHINH_HONG_FREE',
        thongDiep: 'Cổng chính đang gặp sự cố — đang tự chuyển sang model CuongMini Free.', moiNangCap: true, cacCong: CAC_CONG },
      xong([{ role: 'assistant', content: 'ok' }]),
    ]);
    const sk = await chay(id, 'xin chào', { model: 'sonnet-5' });
    const e = sk.find((x) => x.loai === 'loi' && x.ma === 'CONG_CHINH_HONG_FREE');
    expect(e).toBeTruthy();
    expect(e.moiNangCap).toBe(true);
    expect(e.cacCong).toEqual(CAC_CONG);
    expect(e.thongDiep).toMatch(/CuongMini Free/);
    expect(loop.congPhuCuaCuoc(id)).toEqual({ giu: true, congPhu: 'anthropic' });

    kichBan.push([xong([{ role: 'assistant', content: 'ok2' }])]);
    await chay(id, 'tiếp', { model: 'sonnet-5' });
    expect(daGui[1]!.duPhongGiu).toBe(true);
    expect(daGui[1]!.congPhu).toBe('anthropic');

    // Người dùng chọn modelapi trong lời mời ⇒ lượt sau `congPhu:'modelapi'` + vé dự phòng.
    loop.datCongPhuCua(id, 'modelapi');
    kichBan.push([xong([{ role: 'assistant', content: 'ok3' }])]);
    await chay(id, 'tiếp nữa', { model: 'sonnet-5' });
    expect(daGui[2]).toMatchObject({ congPhu: 'modelapi', duPhongGiu: true, duPhongVe: 've-du-phong-that' });

    // Quay về cổng chính ⇒ không còn giữ, không gửi congPhu.
    loop.veCongChinh(id);
    kichBan.push([xong([{ role: 'assistant', content: 'ok4' }])]);
    await chay(id, 'về', { model: 'sonnet-5' });
    expect(daGui[3]!.duPhongGiu).toBe(false);
    expect(daGui[3]!.congPhu).toBeUndefined();
  });

  it('tab chưa từng đổi cổng ⇒ KHÔNG gửi congPhu', async () => {
    const id = loop.taoCuoc();
    kichBan.push([xong([{ role: 'assistant', content: 'ok' }])]);
    await chay(id, 'a', { model: 'sonnet-5' });
    expect(daGui[0]!.congPhu).toBeUndefined();
    expect(daGui[0]!.congAnthropicVe).toBeUndefined();
  });
});

describe('CONG_ANTHROPIC_KHOA ⇒ xoá vé, giao diện hỏi mật khẩu', () => {
  it('HTTP 403 trước SSE: phát lỗi có `daBat`, vé bị xoá', async () => {
    caiDat.agentAnthropicVe = 've-cu-da-chet';
    const id = loop.taoCuoc();
    kichBan.push({ http: 403, json: { success: false, code: 'CONG_ANTHROPIC_KHOA', message: 'Claude Opus 5.5 · chính hãng cần mật khẩu…', data: { model: 'cl-opus-5-5', daBat: false } } });
    const sk = await chay(id, 'a', { model: 'cl-opus-5-5' });
    const e = sk.find((x) => x.loai === 'loi');
    expect(e).toMatchObject({ ma: 'CONG_ANTHROPIC_KHOA', daBat: false });
    expect(caiDat.agentAnthropicVe).toBe('');
  });

  it('khung `error` SSE cũng xoá vé', async () => {
    caiDat.agentAnthropicVe = 've-cu';
    const id = loop.taoCuoc();
    kichBan.push([{ type: 'error', code: 'CONG_ANTHROPIC_KHOA', error: 'cần mật khẩu' }]);
    const sk = await chay(id, 'a', { model: 'cl-opus-5-5' });
    expect(sk.find((x) => x.loai === 'loi')?.ma).toBe('CONG_ANTHROPIC_KHOA');
    expect(caiDat.agentAnthropicVe).toBe('');
  });
});

describe('agent phụ: `mucModelPhu`', () => {
  it('map tên Claude Code ⇒ mức', () => {
    expect(chuanHoaMucModelPhu('haiku')).toBe('nhanh');
    expect(chuanHoaMucModelPhu('sonnet')).toBe('can_bang');
    expect(chuanHoaMucModelPhu('opus')).toBe('manh');
    expect(chuanHoaMucModelPhu('inherit')).toBe('ke_thua');
    expect(chuanHoaMucModelPhu('can-bang')).toBe('can_bang');
    expect(chuanHoaMucModelPhu('gpt-9')).toBeNull();
    expect(chuanHoaMucModelPhu(undefined)).toBeNull();
    expect(docModelDauFile('---\nname: a\ndescription: b\nmodel: "haiku"\n---\nthân')).toBe('nhanh');
    expect(docModelDauFile('---\nname: a\n---\nmodel: opus')).toBeNull(); // nằm trong THÂN, không tính
  });

  async function duAnCoAgent(model: string | null): Promise<string> {
    const goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-cch-da-'));
    await fs.mkdir(path.join(goc, '.claude', 'agents'), { recursive: true });
    await fs.writeFile(path.join(goc, '.claude', 'agents', 'do-tim.md'),
      `---\nname: do-tim\ndescription: Dò tìm nhanh\n${model ? `model: ${model}\n` : ''}---\nBạn là agent dò tìm.`, 'utf8');
    return goc;
  }

  let skCuoi: any[] = [];
  async function chayCoViecPhu(goc: string, args: Record<string, unknown>): Promise<Record<string, any>> {
    const id = loop.taoCuoc();
    loop.datGocChoCuoc(id, goc);
    kichBan.push(
      [{ type: 'tool_call', id: 'call_1', name: 'giao_viec_phu', args },
        xong([{ role: 'assistant', content: null, tool_calls: [{ id: 'call_1', type: 'function', function: { name: 'giao_viec_phu', arguments: JSON.stringify(args) } }] }], 'tool_calls')],
      [{ type: 'text', delta: 'CHU-CUA-AGENT-PHU' }, xong([{ role: 'assistant', content: 'Kết quả dò.' }])], // lượt PHỤ
      [xong([{ role: 'assistant', content: 'Xong cả.' }])],
    );
    skCuoi = await chay(id, 'giao việc', { goc, model: 'cl-sonnet-5-5' });
    const phu = daGui.find((b) => b.laPhu === true);
    expect(phu, 'phải có một lượt phụ').toBeTruthy();
    return phu!;
  }

  it('sự kiện agent phụ: phuBatDau (nhiệm vụ ĐỦ) → phuSuKien bọc → phuXong cộng tiền/token; chữ phụ không đi trần', async () => {
    const goc = await duAnCoAgent('haiku');
    const dai = `dò ${'rất '.repeat(40)}kỹ`;
    await chayCoViecPhu(goc, { nhiem_vu: dai, loai: 'do-tim' });
    const bd = skCuoi.find((e) => e.loai === 'phuBatDau');
    expect(bd).toMatchObject({ phuId: 'call_1', kieuAgent: 'do-tim', nhiemVu: dai, model: 'cl-sonnet-5-5' });
    const con = skCuoi.filter((e) => e.loai === 'phuSuKien');
    expect(con.every((e) => e.phuId === 'call_1')).toBe(true);
    expect(con.some((e) => e.e.loai === 'chu' && e.e.delta === 'CHU-CUA-AGENT-PHU')).toBe(true);
    expect(con.some((e) => e.e.loai === 'xong' && e.e.tienUsd === 0.0123)).toBe(true);
    expect(skCuoi.some((e) => e.loai === 'chu' && e.delta === 'CHU-CUA-AGENT-PHU'), 'chữ phụ lọt ra trần').toBe(false);
    expect(skCuoi.find((e) => e.loai === 'phuXong')).toMatchObject({ phuId: 'call_1', ok: true, tomTat: 'Kết quả dò.', tienUsd: 0.0123, tokenVao: 1, tokenRa: 1 });
    expect(skCuoi.findIndex((e) => e.loai === 'phuBatDau')).toBeLessThan(skCuoi.findIndex((e) => e.loai === 'phuXong'));
  });

  it('tham số `model` của tool THẮNG khoá `model:` trong file', async () => {
    caiDat.agentAnthropicVe = 've-phu';
    const goc = await duAnCoAgent('opus');
    const phu = await chayCoViecPhu(goc, { nhiem_vu: 'dò file cấu hình', loai: 'do-tim', model: 'nhanh' });
    expect(phu.mucModelPhu).toBe('nhanh');
    expect(phu.model).toBe('cl-sonnet-5-5');
    expect(phu.congAnthropicVe).toBe('ve-phu');
  });

  it('không có tham số ⇒ lấy từ file agent (haiku → nhanh)', async () => {
    const goc = await duAnCoAgent('haiku');
    const phu = await chayCoViecPhu(goc, { nhiem_vu: 'dò', loai: 'do-tim' });
    expect(phu.mucModelPhu).toBe('nhanh');
  });

  it('không có cả hai ⇒ không gửi (máy chủ kế thừa)', async () => {
    const goc = await duAnCoAgent(null);
    const phu = await chayCoViecPhu(goc, { nhiem_vu: 'dò' });
    expect(phu.mucModelPhu).toBeUndefined();
  });

  it('lượt CHÍNH không bao giờ mang mucModelPhu', async () => {
    const goc = await duAnCoAgent('haiku');
    await chayCoViecPhu(goc, { nhiem_vu: 'dò', loai: 'do-tim' });
    expect(daGui.filter((b) => !b.laPhu).every((b) => b.mucModelPhu === undefined)).toBe(true);
  });
});

describe('PDF gốc chỉ ở cổng chính hãng', () => {
  const PDF = Buffer.from('%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n', 'latin1');

  it('tìm đường dẫn .pdf trong câu (dòng đính kèm của app, @ của VS Code)', () => {
    expect(timPdfTrongCau('xem giúp\n\nFile tôi vừa đính kèm (đọc bằng read_file khi cần):\n- .cuongthai/dinh-kem/de-bai.pdf\n- logs/a.txt'))
      .toEqual(['.cuongthai/dinh-kem/de-bai.pdf']);
    expect(timPdfTrongCau('đọc @docs/spec.PDF và @docs/spec.PDF nhé.')).toEqual(['docs/spec.PDF']);
    expect(laCongChinhHang('cl-opus-5-5')).toBe(true);
    expect(laCongChinhHang('opus-5')).toBe(false);
  });

  it('không đọc PDF ngoài dự án, bỏ file giả', async () => {
    const goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-cch-pdf-'));
    await fs.writeFile(path.join(goc, 'gia.pdf'), 'không phải pdf');
    const ngoai = path.join(os.tmpdir(), `ngoai-${Date.now()}.pdf`);
    await fs.writeFile(ngoai, PDF);
    const r = await docKhoiPdf(goc, ['gia.pdf', ngoai, '../x.pdf']);
    expect(r.khoi).toEqual([]);
    expect(r.boQua.join(' ')).toMatch(/không phải PDF/);
    expect(r.boQua.join(' ')).toMatch(/ngoài thư mục dự án/);
  });

  it('`cl-*` ⇒ tin user có khối `file`; model khác ⇒ chỉ chữ', async () => {
    const goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-cch-pdf2-'));
    await fs.mkdir(path.join(goc, '.cuongthai', 'dinh-kem'), { recursive: true });
    await fs.writeFile(path.join(goc, '.cuongthai', 'dinh-kem', 'de.pdf'), PDF);
    const cau = 'tóm tắt đề\n\nFile tôi vừa đính kèm (đọc bằng read_file khi cần):\n- .cuongthai/dinh-kem/de.pdf';

    const a = loop.taoCuoc();
    kichBan.push([xong([{ role: 'assistant', content: 'ok' }])]);
    await chay(a, cau, { goc, model: 'cl-opus-5-5' });
    const tin = daGui[0]!.messages[0];
    expect(Array.isArray(tin.content)).toBe(true);
    const f = tin.content.find((k: any) => k.type === 'file');
    expect(f.file.filename).toBe('de.pdf');
    expect(f.file.file_data.startsWith('data:application/pdf;base64,')).toBe(true);
    expect(Buffer.from(f.file.file_data.split(',')[1], 'base64').equals(PDF)).toBe(true);

    const b = loop.taoCuoc();
    kichBan.push([xong([{ role: 'assistant', content: 'ok' }])]);
    await chay(b, cau, { goc, model: 'sonnet-5' });
    expect(typeof daGui[1]!.messages[0].content).toBe('string');
  });
});
