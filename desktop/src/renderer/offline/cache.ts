/**
 * Tầng cache: đọc được khi mất mạng, và luôn nói rõ dữ liệu cũ hay mới.
 *
 * Khuôn mẫu chính là stale-while-revalidate: trả ngay bản đã lưu (kể cả cũ) để
 * giao diện có gì đó hiện lên, đồng thời gọi mạng nền để làm mới. Người dùng
 * thấy nội dung tức thì thay vì một vòng xoay, và vẫn nhận được bản mới vài
 * trăm mili giây sau.
 *
 * Điều KHÔNG được làm: giấu chuyện dữ liệu đã cũ. Mỗi kết quả trả về đều kèm
 * `isStale` và `cachedAt` để màn hình hiển thị được "cập nhật 2 giờ trước".
 */
import { db, type CacheRecord } from './db';

/** Mặc định: coi là cũ sau 5 phút. Từng tính năng có thể tự đặt. */
const DEFAULT_TTL_MS = 5 * 60 * 1000;

/** Cache quá hạn này thì bị dọn, kể cả chưa ai đụng tới. */
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export interface CachedValue<T> {
  value: T;
  cachedAt: number;
  isStale: boolean;
}

function compositeId(userId: number, key: string): string {
  return `${userId}:${key}`;
}

export async function readCache<T>(
  userId: number,
  key: string,
): Promise<CachedValue<T> | null> {
  const record = await db.cache.get(compositeId(userId, key));
  if (!record) return null;
  return {
    value: record.value as T,
    cachedAt: record.cachedAt,
    isStale: Date.now() > record.staleAt,
  };
}

export async function writeCache(
  userId: number,
  key: string,
  value: unknown,
  ttlMs: number = DEFAULT_TTL_MS,
): Promise<void> {
  const now = Date.now();
  const record: CacheRecord = {
    id: compositeId(userId, key),
    userId,
    key,
    value,
    cachedAt: now,
    staleAt: now + ttlMs,
  };

  try {
    await db.cache.put(record);
  } catch (error) {
    // Hết hạn mức lưu trữ. KHÔNG để lỗi này lan lên: cache là thứ tăng tốc,
    // không phải thứ bắt buộc — mất chỗ ghi cache thì tính năng vẫn phải chạy
    // được bằng mạng. Dọn bớt rồi thử lại một lần.
    if (isQuotaError(error)) {
      await evictOldest(userId, 50);
      try {
        await db.cache.put(record);
      } catch {
        console.warn('[cache] vẫn hết dung lượng sau khi dọn — bỏ qua ghi cache');
      }
      return;
    }
    throw error;
  }
}

function isQuotaError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === 'QuotaExceededError' ||
      // Dexie bọc lỗi gốc lại, nên phải soi cả tên bọc ngoài.
      error.name === 'DexieError' ||
      error.message.toLowerCase().includes('quota'))
  );
}

/** Xoá `count` mục cũ nhất của một người dùng. Chỉ đụng `cache`. */
async function evictOldest(userId: number, count: number): Promise<void> {
  const victims = await db.cache
    .where('userId')
    .equals(userId)
    .sortBy('cachedAt');
  const ids = victims.slice(0, count).map((record) => record.id);
  await db.cache.bulkDelete(ids);
}

/**
 * Dọn định kỳ: bỏ mục quá `MAX_AGE_MS`.
 *
 * Chỉ theo TUỔI, không theo dung lượng — dọn theo dung lượng cần đo kích thước
 * từng bản ghi, mà IndexedDB không cho biết, nên mọi ước lượng đều là đoán.
 */
export async function pruneCache(maxAgeMs: number = MAX_AGE_MS): Promise<number> {
  const cutoff = Date.now() - maxAgeMs;
  return db.cache.where('cachedAt').below(cutoff).delete();
}

/**
 * Stale-while-revalidate.
 *
 * `fetcher` chỉ được gọi khi có mạng. Không có mạng thì trả bản cache (dù cũ)
 * và KHÔNG ném lỗi — mất mạng là trạng thái bình thường của app này, không
 * phải ngoại lệ.
 *
 * Ném lỗi CHỈ khi vừa không có cache vừa không lấy được từ mạng — lúc đó thật
 * sự không có gì để hiện.
 */
export async function swr<T>(options: {
  userId: number;
  key: string;
  fetcher: () => Promise<T>;
  ttlMs?: number;
  online: boolean;
  /** Gọi khi bản mới về, để giao diện cập nhật lần hai. */
  onRefreshed?: (value: T) => void;
}): Promise<CachedValue<T>> {
  const { userId, key, fetcher, ttlMs, online, onRefreshed } = options;
  const cached = await readCache<T>(userId, key);

  if (cached && (!cached.isStale || !online)) {
    return cached;
  }

  if (!online) {
    if (cached) return cached;
    throw new OfflineUnavailableError(key);
  }

  if (cached?.isStale) {
    // Có bản cũ: trả ngay, làm mới ở nền. Lỗi mạng lúc làm mới chỉ ghi log —
    // người dùng đã có nội dung để đọc, không cần bị làm phiền.
    void fetcher()
      .then(async (fresh) => {
        await writeCache(userId, key, fresh, ttlMs);
        onRefreshed?.(fresh);
      })
      .catch((error: unknown) => {
        console.warn(`[cache] làm mới nền thất bại (${key}):`, error);
      });
    return cached;
  }

  const fresh = await fetcher();
  await writeCache(userId, key, fresh, ttlMs);
  return { value: fresh, cachedAt: Date.now(), isStale: false };
}

/** Không có mạng và cũng chưa từng lưu — thật sự không có gì để hiện. */
export class OfflineUnavailableError extends Error {
  constructor(public readonly key: string) {
    super('Nội dung này chưa được tải về nên không xem được khi ngoại tuyến.');
    this.name = 'OfflineUnavailableError';
  }
}
