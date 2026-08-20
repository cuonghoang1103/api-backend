/**
 * Lớp bọc `fetch` — kiểm bằng một `fetch` giả, không gọi mạng thật.
 *
 * Vì sao đáng kiểm: nó đứng chắn TRƯỚC mọi lời gọi mạng của app. Bọc sai một
 * nhánh là hỏng thứ chẳng liên quan gì tới Xưởng mô phỏng, và hỏng câm.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { datCauHinhChoKiem, vaFetch } from './web-api-adapter';

const goc = globalThis.fetch;
let daGoi: Array<{ url: string; auth: string | null }>;

beforeEach(() => {
  daGoi = [];
  globalThis.fetch = vi.fn(async (dau: RequestInfo | URL, tuy?: RequestInit) => {
    const url = typeof dau === 'string' ? dau : dau instanceof URL ? dau.href : dau.url;
    const h = new Headers(tuy?.headers ?? undefined);
    daGoi.push({ url, auth: h.get('Authorization') });
    return new Response('{}', { status: 200 });
  }) as typeof fetch;

  datCauHinhChoKiem({ apiBase: 'https://cuongthai.com', getToken: () => 'tok-123' });
  vaFetch();
});

afterEach(() => { globalThis.fetch = goc; });

describe('vaFetch', () => {
  it('viết lại đường dẫn /api/ tương đối thành URL tuyệt đối + gắn Bearer', async () => {
    // Đúng lời gọi thật của `RecorderStudio` trong Xưởng mô phỏng.
    await fetch('/api/v1/simulation/convert-mp4', { method: 'POST' });
    expect(daGoi[0]?.url).toBe('https://cuongthai.com/api/v1/simulation/convert-mp4');
    expect(daGoi[0]?.auth).toBe('Bearer tok-123');
  });

  it('KHÔNG đụng vào URL tuyệt đối', async () => {
    await fetch('https://youtube.com/watch');
    expect(daGoi[0]?.url).toBe('https://youtube.com/watch');
    expect(daGoi[0]?.auth, 'gắn token cho bên thứ ba là RÒ RỈ').toBeNull();
  });

  it('KHÔNG đụng vào đường dẫn tương đối khác', async () => {
    await fetch('/assets/anh.png');
    expect(daGoi[0]?.url).toBe('/assets/anh.png');
  });

  it('giữ nguyên Authorization mà bên gọi đã tự đặt', async () => {
    await fetch('/api/v1/x', { headers: { Authorization: 'Bearer rieng' } });
    expect(daGoi[0]?.auth).toBe('Bearer rieng');
  });

  it('không có token thì không gắn header rỗng', async () => {
    datCauHinhChoKiem({ apiBase: 'https://cuongthai.com', getToken: () => null });
    await fetch('/api/v1/x');
    expect(daGoi[0]?.auth).toBeNull();
  });

  it('đọc cấu hình MỚI NHẤT, không phải cấu hình lúc bọc', async () => {
    // Lớp bọc chỉ gắn một lần. Chộp cấu hình lúc đó thì đổi token (đăng nhập
    // lại, làm mới phiên) sẽ không bao giờ tới được nó.
    datCauHinhChoKiem({ apiBase: 'https://khac.example', getToken: () => 'tok-moi' });
    await fetch('/api/v1/x');
    expect(daGoi[0]?.url).toBe('https://khac.example/api/v1/x');
    expect(daGoi[0]?.auth).toBe('Bearer tok-moi');
  });

  it('gọi lại vaFetch() không bọc chồng lên nhau', async () => {
    vaFetch(); vaFetch();
    await fetch('/api/v1/x');
    // Bọc chồng thì URL bị ghép gốc hai lần.
    expect(daGoi[0]?.url).toBe('https://cuongthai.com/api/v1/x');
    expect(daGoi).toHaveLength(1);
  });
});
