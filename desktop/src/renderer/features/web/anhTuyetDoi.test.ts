/**
 * URL ảnh tương đối → tuyệt đối. Chỗ này sai thì ẢNH VỠ TRÊN APP mà web vẫn
 * bình thường — không lỗi mạng nào dễ thấy, chỉ còn chữ alt lòi ra khỏi thẻ.
 *
 * Đo thật 07/09/2026: bài Tech Trends có hai dạng ảnh bìa trong DB —
 * `https://media.cuongthai.com/...` (chạy mọi nơi) và `/deepdives/....svg`
 * (file tĩnh của web). Dạng thứ hai giải vào BUNDLE khi trang chạy ở origin
 * `app://cuongthai`.
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';

/* Bề mặt tối thiểu mà `configureWebApi` đụng tới: defaults + interceptors.
   Thiếu `interceptors` thì nó nổ "Cannot read properties of undefined". */
const api = {
  defaults: { baseURL: '' as string | undefined, withCredentials: false },
  interceptors: { request: { use: () => 0 } },
};
vi.mock('@/lib/api', () => ({ api, default: api }));

const { anhTuyetDoi } = await import('@/lib/anhTuyetDoi');

describe('anhTuyetDoi — trên WEB (baseURL tương đối)', () => {
  beforeEach(() => { api.defaults.baseURL = '/api/v1'; });

  it('KHÔNG đổi gì cả — tương đối trên web là đúng rồi', () => {
    expect(anhTuyetDoi('/deepdives/vue/x.svg')).toBe('/deepdives/vue/x.svg');
  });
});

describe('anhTuyetDoi — trong APP (baseURL tuyệt đối)', () => {
  beforeEach(() => { api.defaults.baseURL = 'https://cuongthai.com/api/v1'; });

  it('ảnh tương đối được ghép gốc site — KHÔNG kèm /api/v1', () => {
    expect(anhTuyetDoi('/deepdives/vue/x.svg')).toBe('https://cuongthai.com/deepdives/vue/x.svg');
  });

  it('thiếu dấu / ở đầu vẫn ghép đúng, không dính hai đoạn vào nhau', () => {
    expect(anhTuyetDoi('deepdives/x.svg')).toBe('https://cuongthai.com/deepdives/x.svg');
  });

  it('URL đã TUYỆT ĐỐI thì để nguyên — đừng ghép gốc vào đầu', () => {
    const u = 'https://media.cuongthai.com/images/post/u1/a.webp';
    expect(anhTuyetDoi(u)).toBe(u);
    expect(anhTuyetDoi('http://x.test/a.png')).toBe('http://x.test/a.png');
    expect(anhTuyetDoi('//x.test/a.png')).toBe('//x.test/a.png');
  });

  it('data:/blob: để nguyên — ghép gốc vào là hỏng ảnh xem trước lúc vừa tải lên', () => {
    expect(anhTuyetDoi('data:image/png;base64,AAA')).toBe('data:image/png;base64,AAA');
    expect(anhTuyetDoi('blob:app://cuongthai/abc')).toBe('blob:app://cuongthai/abc');
  });

  it('rỗng/null/undefined ⇒ chuỗi rỗng, không ra "https://cuongthai.com/"', () => {
    expect(anhTuyetDoi('')).toBe('');
    expect(anhTuyetDoi(null)).toBe('');
    expect(anhTuyetDoi(undefined)).toBe('');
    expect(anhTuyetDoi('   ')).toBe('');
  });
});

/**
 * Phía DESKTOP: `configureWebApi()` phải đặt biến toàn cục `__CT_GOC_SITE__`.
 *
 * Đây là nguồn CHÍNH của `anhTuyetDoi`, và lý do nó tồn tại: `api.defaults
 * .baseURL` chỉ được đặt trong một effect của `TrangWeb`, mà thẻ ảnh dựng
 * TRƯỚC effect đó — đo thật 07/09/2026, lúc vẽ nó vẫn là `/api/v1`.
 */
describe('configureWebApi đặt gốc site toàn cục', () => {
  it('đặt __CT_GOC_SITE__ NGAY, không đợi effect nào', async () => {
    const g = globalThis as { __CT_GOC_SITE__?: string };
    delete g.__CT_GOC_SITE__;
    const { configureWebApi } = await import('../../shims/web-api-adapter');
    configureWebApi({ apiBase: 'https://cuongthai.com', getToken: () => null });
    expect(g.__CT_GOC_SITE__).toBe('https://cuongthai.com');
  });
});
