import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db, type CacheRecord } from './db';
import {
  OfflineUnavailableError,
  pruneCache,
  readCache,
  swr,
  writeCache,
} from './cache';

/**
 * TTL âm = "đã cũ từ trước". KHÔNG dùng 0: với TTL 0 thì `staleAt === cachedAt`,
 * mà phép kiểm cũ/mới là `Date.now() > staleAt` (so sánh nghiêm ngặt), nên nếu
 * đọc rơi vào đúng mili-giây vừa ghi thì bản ghi bị coi là CÒN MỚI và test
 * thỉnh thoảng đỏ mà mã thì không sai. Đây là lỗi của bài kiểm, không phải của
 * thứ được kiểm — và loại lỗi này rất tốn thời gian nếu để nó thành flaky.
 */
const ALREADY_STALE = -1000;

const USER = 1;
const OTHER = 2;

beforeEach(async () => {
  await db.cache.clear();
  await db.queue.clear();
});

describe('cache — tách theo người dùng', () => {
  it('cùng một khoá ở hai tài khoản không đè lên nhau', async () => {
    await writeCache(USER, 'cv:1', { ten: 'A' });
    await writeCache(OTHER, 'cv:1', { ten: 'B' });

    expect((await readCache<{ ten: string }>(USER, 'cv:1'))?.value).toEqual({ ten: 'A' });
    expect((await readCache<{ ten: string }>(OTHER, 'cv:1'))?.value).toEqual({ ten: 'B' });
  });
});

describe('cache — cũ/mới', () => {
  /*
   * ⚠️ KHÔNG dùng TTL ngắn + `setTimeout` để thử "đã cũ chưa".
   *
   * Bản trước ghi với TTL 50ms rồi khẳng định NGAY là chưa cũ. Trên máy rảnh
   * thì qua; trên máy đang dựng thứ khác thì 50ms đó trôi mất TRƯỚC khi đọc, và
   * phép kiểm đỏ vì lý do chẳng liên quan gì tới cache. Đo thật 22/08/2026: nó
   * đỏ khi chạy song song với `next build`, xanh ở bốn lượt chạy sau — tức là
   * một phép kiểm CHỚP, loại tệ nhất, vì người ta chạy lại cho tới khi nó xanh
   * rồi đi tiếp.
   *
   * Cách chắc chắn là LÙI MỐC GHI, đúng như phép kiểm `pruneCache` ngay dưới:
   * không phụ thuộc bộ lập lịch, và nhanh hơn vì bỏ luôn 80ms ngủ.
   */
  it('đánh dấu cũ sau khi hết TTL', async () => {
    await writeCache(USER, 'k', { v: 1 }, 60_000);
    expect((await readCache(USER, 'k'))?.isStale).toBe(false);

    // ⚠️ `isStale` đọc `staleAt`, KHÔNG đọc `cachedAt` (xem `cache.ts`) —
    // lùi nhầm trường thì phép kiểm đỏ mà chẳng có gì hỏng.
    await db.cache.update(`${USER}:k`, { staleAt: Date.now() - 1 });
    expect((await readCache(USER, 'k'))?.isStale).toBe(true);
  });

  it('pruneCache xoá mục quá tuổi', async () => {
    await writeCache(USER, 'cu', { v: 1 });
    await db.cache.update(`${USER}:cu`, { cachedAt: Date.now() - 10_000 });
    await writeCache(USER, 'moi', { v: 2 });

    const removed = await pruneCache(5_000);

    expect(removed).toBe(1);
    expect(await readCache(USER, 'cu')).toBeNull();
    expect(await readCache(USER, 'moi')).not.toBeNull();
  });
});

describe('swr — hành vi khi mất mạng', () => {
  it('ngoại tuyến vẫn trả bản đã lưu, KHÔNG gọi mạng', async () => {
    await writeCache(USER, 'k', { v: 'cũ' }, ALREADY_STALE);
    const fetcher = vi.fn(async () => ({ v: 'mới' }));

    const result = await swr({ userId: USER, key: 'k', fetcher, online: false });

    expect(fetcher).not.toHaveBeenCalled();
    expect(result.value).toEqual({ v: 'cũ' });
    expect(result.isStale).toBe(true);
  });

  it('ngoại tuyến và chưa từng lưu thì báo lỗi rõ ràng, không trả rỗng', async () => {
    const fetcher = vi.fn(async () => ({ v: 1 }));

    await expect(
      swr({ userId: USER, key: 'chua-co', fetcher, online: false }),
    ).rejects.toBeInstanceOf(OfflineUnavailableError);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('còn hạn thì dùng cache, không gọi mạng', async () => {
    await writeCache(USER, 'k', { v: 'cache' }, 60_000);
    const fetcher = vi.fn(async () => ({ v: 'mạng' }));

    const result = await swr({ userId: USER, key: 'k', fetcher, online: true });

    expect(fetcher).not.toHaveBeenCalled();
    expect(result.value).toEqual({ v: 'cache' });
  });

  it('cũ + có mạng: trả NGAY bản cũ rồi làm mới ở nền', async () => {
    await writeCache(USER, 'k', { v: 'cũ' }, ALREADY_STALE);
    let resolveFetch: (value: { v: string }) => void = () => {};
    const fetcher = vi.fn(
      () => new Promise<{ v: string }>((resolve) => (resolveFetch = resolve)),
    );
    const onRefreshed = vi.fn();

    // Trả về trước khi fetcher xong — đây chính là điểm của stale-while-revalidate.
    const result = await swr({ userId: USER, key: 'k', fetcher, online: true, onRefreshed });
    expect(result.value).toEqual({ v: 'cũ' });
    expect(onRefreshed).not.toHaveBeenCalled();

    resolveFetch({ v: 'mới' });
    await vi.waitFor(() => expect(onRefreshed).toHaveBeenCalledWith({ v: 'mới' }));
    expect((await readCache(USER, 'k'))?.value).toEqual({ v: 'mới' });
  });

  it('làm mới nền hỏng thì KHÔNG làm hỏng kết quả đã trả', async () => {
    await writeCache(USER, 'k', { v: 'cũ' }, ALREADY_STALE);
    const fetcher = vi.fn(async () => {
      throw new Error('mạng lỗi');
    });

    const result = await swr({ userId: USER, key: 'k', fetcher, online: true });

    expect(result.value).toEqual({ v: 'cũ' });
    // Bản cũ phải còn nguyên, không bị xoá vì lần làm mới thất bại.
    await vi.waitFor(async () =>
      expect((await readCache(USER, 'k'))?.value).toEqual({ v: 'cũ' }),
    );
  });

  it('chưa có cache + có mạng: lấy từ mạng rồi lưu lại', async () => {
    const fetcher = vi.fn(async () => ({ v: 'mới' }));

    const result = await swr({ userId: USER, key: 'k', fetcher, online: true });

    expect(fetcher).toHaveBeenCalledOnce();
    expect(result.value).toEqual({ v: 'mới' });
    expect(result.isStale).toBe(false);
    expect((await readCache(USER, 'k'))?.value).toEqual({ v: 'mới' });
  });
});

describe('writeCache — hết dung lượng', () => {
  it('hết hạn mức thì dọn bớt rồi ghi lại, KHÔNG ném lỗi lên tính năng', async () => {
    await writeCache(USER, 'cu-1', { v: 1 });
    await writeCache(USER, 'cu-2', { v: 2 });

    // Giả lập hết dung lượng đúng một lần, giống hệt lúc IndexedDB đầy thật.
    const original = db.cache.put.bind(db.cache);
    let failed = false;
    // `as never` ở đây là để khớp `PromiseExtended` của Dexie — kiểu Promise
    // riêng của nó có thêm `.timeout()`. Hành vi lúc chạy không đổi.
    const spy = vi.spyOn(db.cache, 'put').mockImplementation((async (record: CacheRecord) => {
      if (!failed) {
        failed = true;
        const error = new Error('quota exceeded');
        error.name = 'QuotaExceededError';
        throw error;
      }
      return original(record);
    }) as never);

    await expect(writeCache(USER, 'moi', { v: 3 })).resolves.toBeUndefined();
    expect((await readCache(USER, 'moi'))?.value).toEqual({ v: 3 });

    spy.mockRestore();
  });
});
