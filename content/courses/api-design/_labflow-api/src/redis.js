// redis.js — bài 12.4: MỘT kết nối Redis cho trạng thái dùng chung ngắn hạn (rate limit, vé realtime).
// Tự nối lại khi Redis khởi động lại; chưa nối được thì `shared.isReady` = false và người dùng tự quyết định lùi về đâu.
import { createClient } from 'redis';
import { config } from './config.js';

export const shared = config.redisUrl && (config.rateLimitStore === 'redis' || config.ticketStore === 'redis')
  ? createClient({ url: config.redisUrl, socket: { reconnectStrategy: (n) => Math.min(n * 200, 2000), connectTimeout: 2000 } })
  : null;
if (shared) {
  shared.on('error', (e) => { if (shared.lastErr !== e.message) console.error('redis shared:', (shared.lastErr = e.message)); });
  shared.on('ready', () => { shared.lastErr = null; });
  await shared.connect().catch((e) => console.error('redis shared: chưa nối được', e.message));
}
