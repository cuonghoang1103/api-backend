/**
 * Phát hiện mất mạng THẬT — gõ cửa máy chủ, có trễ chống chập chờn.
 * Đồng hồ và lời gõ đều giả: kiểm luật, không kiểm mạng của máy chạy test.
 */
import { describe, expect, it } from 'vitest';
import { TheoDoiMang, taoGoCua, type KetQuaGoCua, type TrangThaiMang } from './mang';

function dung(kq: KetQuaGoCua[], o: { coGiaoDien?: () => boolean } = {}) {
  const doi: TrangThaiMang[] = [];
  const hen: Array<() => void> = [];
  const t = new TheoDoiMang({
    goCua: async () => kq.shift() ?? 'song',
    khiDoi: (x) => doi.push(x),
    datHen: (fn) => { hen.push(fn); return hen.length; },
    huyHen: () => {},
    ...o,
  });
  return { t, doi, hen };
}

describe('TheoDoiMang', () => {
  it('MỘT lần hỏng chưa đủ kết luận — HAI lần liền mới là mất mạng', async () => {
    const { t, doi } = dung(['hong', 'hong']);
    expect((await t.kiemNgay()).online).toBe(true);
    expect(t.trangThai().hongLienTiep).toBe(1);
    expect(doi).toHaveLength(0);
    expect((await t.kiemNgay()).online).toBe(false);
    expect(doi).toEqual([expect.objectContaining({ online: false, lyDo: 'goCuaHong' })]);
  });

  it('một lần thành công là có mạng lại, và báo ĐÚNG MỘT lần đổi', async () => {
    const { t, doi } = dung(['hong', 'hong', 'song', 'song']);
    await t.kiemNgay(); await t.kiemNgay(); await t.kiemNgay(); await t.kiemNgay();
    expect(doi.map((x) => x.online)).toEqual([false, true]);
  });

  it('hỏng xen kẽ thành công thì KHÔNG bao giờ báo mất mạng (chập chờn một nhịp)', async () => {
    const { t, doi } = dung(['hong', 'song', 'hong', 'song']);
    for (let i = 0; i < 4; i++) await t.kiemNgay();
    expect(doi).toHaveLength(0);
  });

  it('không có card mạng ⇒ mất mạng NGAY, không cần gõ', async () => {
    let goi = 0;
    const t = new TheoDoiMang({
      goCua: async () => { goi += 1; return 'song'; }, coGiaoDien: () => false, datHen: () => 0, huyHen: () => {},
    });
    expect((await t.kiemNgay()).online).toBe(false);
    expect(goi).toBe(0);
  });

  it('hai lời hỏi chồng nhau dùng chung MỘT lần gõ', async () => {
    let goi = 0;
    const t = new TheoDoiMang({
      goCua: async () => { goi += 1; await new Promise((r) => setTimeout(r, 20)); return 'song'; },
      datHen: () => 0, huyHen: () => {},
    });
    await Promise.all([t.kiemNgay(), t.kiemNgay(), t.kiemNgay()]);
    expect(goi).toBe(1);
  });

  it('goCua ném ⇒ tính là hỏng, không làm sập bộ theo dõi', async () => {
    const t = new TheoDoiMang({ goCua: async () => { throw new Error('x'); }, datHen: () => 0, huyHen: () => {} });
    await t.kiemNgay();
    expect((await t.kiemNgay()).online).toBe(false);
  });

  it('đang nghi / mất mạng thì gõ dày (5s), có mạng thì thưa (30s)', async () => {
    const nhip: number[] = [];
    const kq: KetQuaGoCua[] = ['song', 'hong'];
    const t = new TheoDoiMang({ goCua: async () => kq.shift() ?? 'hong', datHen: (_f, ms) => { nhip.push(ms); return 0; }, huyHen: () => {} });
    await t.kiemNgay();
    await t.kiemNgay();
    expect(nhip).toEqual([30_000, 5_000]);
  });
});

describe('taoGoCua', () => {
  const gia = (status: number | 'loi') => (async () => {
    if (status === 'loi') throw new TypeError('fetch failed');
    return new Response('x', { status });
  }) as unknown as typeof fetch;

  it('máy chủ trả lời BẤT KỲ mã nào (kể cả 401/404) ⇒ có mạng', async () => {
    for (const s of [200, 401, 404, 500]) expect(await taoGoCua('http://x', 1000, gia(s))()).toBe('song');
  });
  it('lỗi kết nối, hoặc cổng/Cloudflare trả lời thay (502/503/504/52x) ⇒ hỏng', async () => {
    expect(await taoGoCua('http://x', 1000, gia('loi'))()).toBe('hong');
    for (const s of [502, 503, 504, 521, 522, 524]) expect(await taoGoCua('http://x', 1000, gia(s))()).toBe('hong');
  });
});
