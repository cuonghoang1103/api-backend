/**
 * Figma bằng token cất trên máy (19/10/2026): `/ket-noi figma` kiểm token bằng /v1/me rồi cất file 0600; tool
 * `figma_doc` gọi Figma REST NGAY TRÊN MÁY — header token CHỈ tới api.figma.com, không đi theo chuyển hướng sang host
 * khác, token không lộ trong kết quả; host ngoài Figma bị chặn; gỡ token ⇒ hết capability. Fetch GIẢ.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const THU_MUC = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-figma-'));
vi.mock('electron', () => ({
  app: { getPath: () => THU_MUC },
  safeStorage: { isEncryptionAvailable: () => false, encryptString: (s: string) => Buffer.from(s), decryptString: (b: Buffer) => b.toString() },
}));

const F = await import('./figmaKetNoi');
const TOKEN = 'gia-lap-figma-desktop-5';
type Goi = { url: string; headers: Record<string, string> };
let nhat: Goi[] = [];
const json = (j: unknown, status = 200) => new Response(JSON.stringify(j), { status, headers: { 'content-type': 'application/json' } });

beforeEach(() => { nhat = []; delete process.env.FIGMA_TOKEN; });

function mang(tra: (url: string) => Response) {
  F.__datFetchFigma(async (url, init) => { nhat.push({ url, headers: init.headers }); return tra(url); });
}

describe('kết nối Figma', () => {
  it('token sai ⇒ không lưu, câu lỗi không nhắc lại token', async () => {
    mang(() => json({ status: 403 }, 403));
    const r = await F.ketNoiFigma(TOKEN);
    expect(r.ok).toBe(false);
    expect(r.loi).not.toContain(TOKEN);
    expect(await F.coTokenFigma()).toBe(false);
  });

  it('token đúng ⇒ cất file 0600 trong bi-mat/, trả handle (không trả token)', async () => {
    mang((u) => (u === 'https://api.figma.com/v1/me' ? json({ handle: 'Long', email: 'x@y.z' }) : json({}, 404)));
    const r = await F.ketNoiFigma(TOKEN);
    expect(r).toEqual({ ok: true, coToken: true, handle: 'Long' });
    expect(JSON.stringify(r)).not.toContain(TOKEN);
    const file = path.join(THU_MUC, 'bi-mat', 'figma.bin');
    const st = await fs.stat(file);
    if (process.platform !== 'win32') expect(st.mode & 0o777).toBe(0o600);
    expect(nhat[0]!.headers['X-Figma-Token']).toBe(TOKEN);
    expect(await F.coTokenFigma()).toBe(true);
    expect((await F.trangThaiFigma()).coToken).toBe(true);
  });
});

describe('tool figma_doc', () => {
  it('đọc trang/frame/chữ/bình luận; token chỉ tới api.figma.com, không tới host ảnh; kết quả bọc untrusted, không lộ token', async () => {
    mang((u) => {
      if (u.includes('/v1/files/AbCdEf1234567890xyz?depth=2')) return json({ name: 'App SV', document: { type: 'DOCUMENT', children: [{ type: 'CANVAS', name: 'Màn', children: [{ id: '1:2', type: 'FRAME', name: 'Đăng nhập' }] }] } });
      if (u.includes('/nodes?ids=')) return json({ nodes: { '1:2': { document: { id: '1:2', type: 'FRAME', name: 'Đăng nhập', children: [{ type: 'TEXT', characters: 'Quên mật khẩu?' }] } } } });
      if (u.includes('/comments')) return json({ comments: [{ message: 'Đổi màu nút', user: { handle: 'An' } }] });
      if (u.includes('/v1/images/')) return json({ images: { '1:2': 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/abc' } });
      return new Response('khong-phai-anh', { status: 200 });
    });
    const r = await F.toolFigmaDoc({ url: 'https://www.figma.com/design/AbCdEf1234567890xyz/App?node-id=1-2' });
    expect(r.noiDung).toContain('<noi-dung-ngoai untrusted="true">');
    expect(r.noiDung).toContain('Quên mật khẩu?');
    expect(r.noiDung).toContain('Đổi màu nút');
    expect(r.noiDung).not.toContain(TOKEN);
    const anh = nhat.find((g) => g.url.includes('amazonaws.com'));
    expect(anh).toBeTruthy();
    expect(anh!.headers['X-Figma-Token']).toBeUndefined();
    for (const g of nhat.filter((x) => new URL(x.url).hostname === 'api.figma.com')) expect(g.headers['X-Figma-Token']).toBe(TOKEN);
  });

  it('chuyển hướng ra ngoài Figma ⇒ dừng (không gọi tới host lạ)', async () => {
    mang((u) => (u.includes('api.figma.com') ? new Response(null, { status: 302, headers: { location: 'https://evil.example.com/x' } }) : json({})));
    const r = await F.toolFigmaDoc({ url: 'https://www.figma.com/design/AbCdEf1234567890xyz/App', anh: false });
    expect(r.noiDung).toMatch(/LỖI Figma: .*evil\.example\.com/);
    expect(nhat.some((g) => g.url.includes('evil.example.com'))).toBe(false);
  });

  it('link không phải Figma ⇒ báo sai link; gỡ token ⇒ hết capability, tool nói cách kết nối', async () => {
    expect((await F.toolFigmaDoc({ url: 'https://example.com/x' })).tomTat).toBe('link sai');
    await F.ngatFigma();
    expect(await F.coTokenFigma()).toBe(false);
    expect((await F.toolFigmaDoc({ url: 'https://www.figma.com/design/AbCdEf1234567890xyz/App' })).noiDung).toContain('/ket-noi figma');
  });
});
