/**
 * System statistics — REAL host + infra metrics for the admin dashboard.
 *
 * Runs inside the backend container but reports HOST figures where it matters:
 *  - os.uptime()/totalmem()/freemem()/loadavg() read /proc → the VPS host.
 *  - disk: `df` on the uploads mount → the host disk that volume lives on.
 *  - R2: lists the bucket (existing creds, no new key), cached 10 min.
 *  - DB size via pg_database_size; Redis via INFO memory.
 * Every optional metric degrades to null on error — the endpoint never fails.
 */
import os from 'os';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { getR2Client } from '../config/r2.js';

const pExecFile = promisify(execFile);

interface DiskStats { totalBytes: number; usedBytes: number; availBytes: number; percent: number }

/** Host disk usage via `df` on the uploads mount (the volume lives on the host disk). */
async function getDiskStats(): Promise<DiskStats | null> {
  try {
    const path = process.env.UPLOAD_DIR || '/app/uploads';
    const { stdout } = await pExecFile('df', ['-kP', path], { timeout: 4000 });
    const line = stdout.trim().split('\n').pop() || '';
    const p = line.split(/\s+/);
    const totalKb = Number(p[1]);
    const usedKb = Number(p[2]);
    const availKb = Number(p[3]);
    if (!Number.isFinite(totalKb) || totalKb <= 0) return null;
    return { totalBytes: totalKb * 1024, usedBytes: usedKb * 1024, availBytes: availKb * 1024, percent: Math.round((usedKb / totalKb) * 100) };
  } catch {
    return null;
  }
}

interface R2Usage { objectCount: number; totalBytes: number; truncated: boolean; sampledAt: string }
let r2Cache: { at: number; value: R2Usage } | null = null;
const R2_TTL_MS = 10 * 60 * 1000;
const R2_MAX_PAGES = 200; // ~200k objects cap so a huge bucket can't stall the request

/** Exact R2 usage by listing the bucket (existing R2 creds, no new key). Cached. */
async function getR2Usage(): Promise<R2Usage | null> {
  if (!config.r2?.enabled) return null;
  if (r2Cache && Date.now() - r2Cache.at < R2_TTL_MS) return r2Cache.value;
  try {
    const client = getR2Client();
    let token: string | undefined;
    let count = 0;
    let bytes = 0;
    let pages = 0;
    let truncated = false;
    do {
      const out = await client.send(new ListObjectsV2Command({ Bucket: config.r2.bucketName, ContinuationToken: token, MaxKeys: 1000 }));
      for (const o of out.Contents ?? []) {
        count += 1;
        bytes += Number(o.Size ?? 0);
      }
      token = out.IsTruncated ? out.NextContinuationToken : undefined;
      pages += 1;
      if (pages >= R2_MAX_PAGES) { truncated = !!token; break; }
    } while (token);
    const value: R2Usage = { objectCount: count, totalBytes: bytes, truncated, sampledAt: new Date().toISOString() };
    r2Cache = { at: Date.now(), value };
    return value;
  } catch {
    return null;
  }
}

async function getDbSizeBytes(): Promise<number | null> {
  try {
    const rows = await prisma.$queryRawUnsafe<Array<{ size: bigint }>>('SELECT pg_database_size(current_database()) AS size');
    return rows?.[0]?.size != null ? Number(rows[0].size) : null;
  } catch {
    return null;
  }
}

async function getRedisMemoryBytes(): Promise<number | null> {
  try {
    const { getRedis } = await import('../config/redis.js');
    const redis = await getRedis();
    const info = await redis.info('memory');
    const m = /used_memory:(\d+)/.exec(info);
    return m ? Number(m[1]) : null;
  } catch {
    return null;
  }
}

export async function getSystemStats() {
  const [disk, r2, dbSizeBytes, redisMemoryBytes] = await Promise.all([
    getDiskStats(),
    getR2Usage(),
    getDbSizeBytes(),
    getRedisMemoryBytes(),
  ]);

  const totalmem = os.totalmem();
  const freemem = os.freemem();
  const load = os.loadavg();
  const cores = os.cpus()?.length || 1;

  return {
    host: {
      uptimeSeconds: Math.floor(os.uptime()),
      memTotalBytes: totalmem,
      memFreeBytes: freemem,
      memUsedBytes: totalmem - freemem,
      memPercent: totalmem > 0 ? Math.round(((totalmem - freemem) / totalmem) * 100) : 0,
      cores,
      load1: Number(load[0].toFixed(2)),
      load5: Number(load[1].toFixed(2)),
      load15: Number(load[2].toFixed(2)),
      loadPercent: Math.min(100, Math.round((load[0] / cores) * 100)),
    },
    process: {
      heapUsedBytes: process.memoryUsage().heapUsed,
      rssBytes: process.memoryUsage().rss,
      uptimeSeconds: Math.floor(process.uptime()),
    },
    disk,
    r2,
    dbSizeBytes,
    redisMemoryBytes,
  };
}
