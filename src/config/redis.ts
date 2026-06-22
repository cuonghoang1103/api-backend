/**
 * Shared Redis client (lazy init, used by quota + OTP + captcha services).
 *
 * Why this module?
 * - Avoids creating multiple Redis connections (one per service).
 * - Centralizes error handling and connection management.
 * - Provides a single `getRedis()` helper that callers can `await`.
 */
import { createClient, type RedisClientType } from 'redis';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

let _redis: RedisClientType | null = null;
let _connecting: Promise<RedisClientType> | null = null;

/**
 * Returns a connected Redis client. Safe to call from anywhere.
 * Connection is established lazily on first use.
 */
export async function getRedis(): Promise<RedisClientType> {
  if (_redis && _redis.isOpen) return _redis;

  if (_connecting) return _connecting;

  _connecting = (async () => {
    const client: RedisClientType = createClient({
      socket: {
        host: config.redisHost,
        port: config.redisPort,
        // Auto-reconnect with exponential backoff
        reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
      },
      password: config.redisPassword || undefined,
      database: config.redisDb,
    });

 client.on('error', (err: Error) => {
 logger.error('redis client error', { error: err.message });
 });
 client.on('reconnecting', () => {
 logger.warn('redis reconnecting');
 });
 client.on('ready', () => {
 logger.info('redis connection ready');
 });

    await client.connect();
    _redis = client;
    _connecting = null;
    return client;
  })();

  return _connecting;
}

/**
 * Ping Redis to check connectivity. Returns true if PONG received.
 */
export async function pingRedis(): Promise<boolean> {
  try {
    const r = await getRedis();
    return (await r.ping()) === 'PONG';
  } catch {
    return false;
  }
}

/**
 * Graceful shutdown — call from process exit handlers.
 */
export async function closeRedis(): Promise<void> {
  if (_redis && _redis.isOpen) {
    await _redis.quit();
    _redis = null;
  }
}
