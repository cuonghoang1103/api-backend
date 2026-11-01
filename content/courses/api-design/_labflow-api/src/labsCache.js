// labsCache.js — bài 12.5: danh sách phòng là thứ được đọc NHIỀU nhất (mở app là gọi) và gần như không đổi.
// Cache-aside trên Redis của bài 9.2 (serverCache.js): khoá theo bộ lọc, TTL 60 s + jitter, singleflight khi trượt.
import { cached } from './serverCache.js';

export const LABS_TTL_SEC = Number(process.env.LABS_CACHE_SEC ?? 60);
const keyOf = (f) => `labflow:labs:v1:${f.building ?? ''}|${f.minCapacity ?? ''}|${f.q ?? ''}`;
export const cachedLabs = (req, filters, load) => cached(req, keyOf(filters), LABS_TTL_SEC, load);
