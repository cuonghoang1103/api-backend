/**
 * `/compact` và `/doctor` với `fetch` GIẢ — không gọi máy chủ thật.
 */
import { describe, expect, it } from 'vitest';

import { chanDoan, goiCompact } from './lenhMayChu';
import type { TinGui } from './thanGui';

const hoiThoai: TinGui[] = [
  { role: 'user', content: [{ type: 'text', text: 'đề bài' }, { type: 'image_url', image_url: { url: 'data:image/png;base64,AAAA' } }] },
  { role: 'assistant', content: 'a' },
  { role: 'user', content: 'câu 2' },
  { role: 'assistant', content: 'b' },
  { role: 'user', content: 'câu 3' },
];

function fetchGia(tra: (url: string, init?: RequestInit) => { status: number; body: unknown }) {
  const goi: Array<{ url: string; body?: unknown }> = [];
  const f = (async (url: string, init?: RequestInit) => {
    goi.push({ url, body: init?.body ? JSON.parse(String(init.body)) : undefined });
    const r = tra(url, init);
    return new Response(JSON.stringify(r.body), { status: r.status });
  }) as unknown as typeof fetch;
  return { f, goi };
}

describe('/compact', () => {
  it('gửi hội thoại ĐÃ GỠ ẢNH + ghi chú; dựng bản tóm tắt ghép được', async () => {
    const { f, goi } = fetchGia(() => ({
      status: 200, body: { data: { tomTat: '- Mục tiêu X', deBai: 'đề bài', soTinDaGop: 2, soLuotDaGop: 1 } },
    }));
    const kq = await goiCompact({ origin: 'https://m', token: 't', hoiThoai, ghiChu: ' giữ tên file ', fetchFn: f, bayGio: () => 5 });
    expect(goi[0]!.url).toBe('https://m/api/v1/agent/compact');
    expect(JSON.stringify(goi[0]!.body)).not.toContain('image_url');
    expect((goi[0]!.body as { ghiChu: string }).ghiChu).toBe('giữ tên file');
    expect(kq.ok && kq.soTinDaGop === 2 && 'tomTat' in kq && kq.tomTat.noiDung).toContain('Mục tiêu X');
    expect(kq.ok && 'tomTat' in kq && kq.tomTat.luc).toBe(5);
  });

  it('máy chủ nói không có gì để gộp ⇒ ok, soTinDaGop 0', async () => {
    const { f } = fetchGia(() => ({ status: 200, body: { data: { tomTat: null, soTinDaGop: 0 } } }));
    expect(await goiCompact({ origin: '', token: 't', hoiThoai, fetchFn: f })).toEqual({ ok: true, soTinDaGop: 0 });
  });

  it('máy chủ cũ (404) ⇒ câu rõ ràng, không vỡ', async () => {
    const { f } = fetchGia(() => ({ status: 404, body: {} }));
    const kq = await goiCompact({ origin: '', token: 't', hoiThoai, fetchFn: f });
    expect(kq.ok).toBe(false);
    expect(!kq.ok && kq.loi).toMatch(/deploy backend/);
  });

  it('số tin máy chủ gộp không rơi vào đầu một lượt ⇒ KHÔNG ghép', async () => {
    const { f } = fetchGia(() => ({ status: 200, body: { data: { tomTat: '- x', soTinDaGop: 1, soLuotDaGop: 1 } } }));
    const kq = await goiCompact({ origin: '', token: 't', hoiThoai, fetchFn: f });
    expect(!kq.ok && kq.ma).toBe('LECH');
  });

  it('lỗi máy chủ đi ra nguyên văn', async () => {
    const { f } = fetchGia(() => ({ status: 502, body: { message: 'Không tóm tắt được lúc này', code: 'COMPACT_HONG' } }));
    const kq = await goiCompact({ origin: '', token: 't', hoiThoai, fetchFn: f });
    expect(kq).toEqual({ ok: false, loi: 'Không tóm tắt được lúc này', ma: 'COMPACT_HONG' });
  });
});

describe('/doctor', () => {
  const coBan = {
    origin: 'https://m', token: 't', phienBan: '0.5.150', nenTang: 'darwin', goc: '/du-an',
    matMang: async () => false,
    aiCucBo: async () => ({ ma: 'code', ten: 'Bản lập trình (30B)' }),
    aiCucBoBat: true,
    quyenThuMuc: async () => ({ doc: true, ghi: true }),
  };

  it('mọi thứ ổn ⇒ mọi mục ok', async () => {
    const { f } = fetchGia((u) => (u.includes('/tools')
      ? { status: 200, body: { data: { pro: true, configured: true, model: 'sonnet-5' } } }
      : { status: 200, body: { data: { congChinhSong: true } } }));
    const ds = await chanDoan({ ...coBan, fetchFn: f });
    expect(ds.map((m) => m.ten)).toEqual(
      ['Phiên bản app', 'Mạng', 'Máy chủ', 'Đăng nhập', 'AI máy chủ', 'Cổng AI', 'AI ngoại tuyến', 'Thư mục dự án']);
    expect(ds.every((m) => m.muc === 'ok')).toBe(true);
  });

  it('phiên hết hạn (401) + cổng chính hỏng + thư mục chỉ đọc ⇒ nói đúng từng chỗ', async () => {
    const { f } = fetchGia((u) => (u.includes('/tools')
      ? { status: 401, body: {} }
      : { status: 200, body: { data: { congChinhSong: false, daBat: true, ten: 'GPT 6 Sol' } } }));
    const ds = await chanDoan({ ...coBan, fetchFn: f, quyenThuMuc: async () => ({ doc: true, ghi: false }) });
    const theo = Object.fromEntries(ds.map((m) => [m.ten, m]));
    expect(theo['Đăng nhập']!.muc).toBe('loi');
    expect(theo['Cổng AI']!.chiTiet).toMatch(/dự phòng/);
    expect(theo['Thư mục dự án']!.muc).toBe('canh');
  });

  it('mất mạng + fetch ném ⇒ không ném ra ngoài, báo lỗi máy chủ', async () => {
    const f = (async () => { throw new Error('fetch failed'); }) as unknown as typeof fetch;
    const ds = await chanDoan({ ...coBan, fetchFn: f, matMang: async () => true, aiCucBo: async () => null });
    expect(ds.find((m) => m.ten === 'Mạng')!.muc).toBe('loi');
    expect(ds.find((m) => m.ten === 'Máy chủ')!.muc).toBe('loi');
    expect(ds.find((m) => m.ten === 'AI ngoại tuyến')!.muc).toBe('canh');
  });
});
