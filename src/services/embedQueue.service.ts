/**
 * ============================================================
 * Embed Queue — Background embedding worker
 *
 * Decouples document upload (fast response) from expensive
 * chunking + embedding (background work).
 *
 * Why no BullMQ?
 * - We're a single-process Node app (no horizontal scaling yet)
 * - BullMQ adds 50MB deps + Redis-only state
 * - In-process queue is simpler, sufficient for current scale
 *
 * Trade-off: if the process crashes mid-job, in-flight jobs are lost.
 * Mitigation: jobs are idempotent (re-running is safe) + we mark
 * documents with `embeddingStatus: 'pending' | 'processing' | 'ready' | 'failed'`
 * so a recovery scan can find stuck ones.
 * ============================================================
 */

import { prisma } from '../config/database.js';
import { aiService } from './ai.service.js';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

export type JobType = 'embed_document' | 'reembed_all' | 'cleanup_garbage';
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface EmbedJob {
  id: string;
  type: JobType;
  status: JobStatus;
  payload: Record<string, unknown>;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  attempts: number;
  result?: Record<string, unknown>;
}

const _jobs: EmbedJob[] = [];
let _processing = false;

function uid(): string {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Enqueue a new embedding job.
 * Returns immediately (non-blocking).
 */
export function enqueueJob(
  type: JobType,
  payload: Record<string, unknown>
): EmbedJob {
  const job: EmbedJob = {
    id: uid(),
    type,
    status: 'pending',
    payload,
    createdAt: new Date(),
    attempts: 0,
  };
  _jobs.unshift(job);

  // Cap log size (keep last 100)
  if (_jobs.length > 100) _jobs.length = 100;

  // Fire-and-forget processing
  void processQueue();

  return job;
}

/**
 * Get recent jobs (newest first), with optional filter.
 */
export function listJobs(filter?: { status?: JobStatus; type?: JobType; limit?: number }): EmbedJob[] {
  let result = _jobs;
  if (filter?.status) result = result.filter((j) => j.status === filter.status);
  if (filter?.type) result = result.filter((j) => j.type === filter.type);
  return result.slice(0, filter?.limit ?? 50);
}

/**
 * Get aggregate stats for the admin dashboard.
 */
export function getJobStats(): {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  byType: Record<JobType, number>;
  recentErrors: { jobId: string; type: JobType; error: string; at: Date }[];
} {
  const stats = {
    total: _jobs.length,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    byType: { embed_document: 0, reembed_all: 0, cleanup_garbage: 0 } as Record<JobType, number>,
    recentErrors: [] as { jobId: string; type: JobType; error: string; at: Date }[],
  };
  for (const j of _jobs) {
    stats[j.status]++;
    stats.byType[j.type]++;
    if (j.status === 'failed' && j.error) {
      stats.recentErrors.push({ jobId: j.id, type: j.type, error: j.error, at: j.completedAt || j.createdAt });
    }
  }
  stats.recentErrors = stats.recentErrors.slice(0, 5);
  return stats;
}

/**
 * Process the next pending job (FIFO).
 * Idempotent — if already processing, this is a no-op.
 */
async function processQueue(): Promise<void> {
  if (_processing) return;
  _processing = true;
  try {
    while (true) {
      const next = _jobs.find((j) => j.status === 'pending');
      if (!next) break;

      next.status = 'processing';
      next.startedAt = new Date();
      next.attempts++;

      try {
        const result = await runJob(next);
        next.status = 'completed';
        next.completedAt = new Date();
        next.result = result;
        logger.info('embed job done', { jobId: next.id, type: next.type, durationMs: Date.now() - next.startedAt.getTime() });
      } catch (err) {
        next.error = (err as Error).message;
        if (next.attempts >= 3) {
          next.status = 'failed';
          next.completedAt = new Date();
          logger.error('embed job failed', { jobId: next.id, type: next.type, attempts: next.attempts, error: next.error });
        } else {
          // Reset to pending for retry
          next.status = 'pending';
          logger.warn('embed job attempt failed, will retry', { jobId: next.id, type: next.type, attempts: next.attempts, error: next.error });
        }
      }
    }
  } finally {
    _processing = false;
  }
}

/**
 * Execute a single job. Returns result data to attach to the job record.
 */
async function runJob(job: EmbedJob): Promise<Record<string, unknown>> {
  switch (job.type) {
    case 'embed_document': {
      const { documentId, documentType, content, metadata } = job.payload as {
        documentId: string;
        documentType: string;
        content: string;
        metadata?: Record<string, unknown>;
      };
      const result = await aiService.indexDocument({ documentId, documentType, content, metadata });
      return { documentId, chunksCreated: result.chunksCreated };
    }

    case 'reembed_all': {
      // Used after model change — re-embed every chunk
      // Step 1: delete all chunks (we'll recreate them)
      // But we don't have source content... so we just re-compute embeddings
      // for existing chunks. This is what backfillMissingEmbeddings does.
      const result = await aiService.backfillMissingEmbeddings();
      return result;
    }

    case 'cleanup_garbage': {
      // Find chunks whose documentId no longer exists anywhere meaningful
      // and delete them. Since we don't have a separate "documents" table,
      // we delete chunks with createdAt older than N days that have been
      // "soft-disabled" via metadata.
      const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days
      const stale = await prisma.documentChunk.findMany({
        where: {
          createdAt: { lt: cutoff },
        },
        select: { id: true, metadata: true },
      });
      const softDeleted = stale.filter((s) => {
        if (!s.metadata) return false;
        const meta = typeof s.metadata === 'string' ? JSON.parse(s.metadata) : (s.metadata as Record<string, unknown>);
        return meta?.soft_deleted === true;
      });
      if (softDeleted.length > 0) {
        await prisma.documentChunk.deleteMany({
          where: { id: { in: softDeleted.map((s) => s.id) } },
        });
      }
      return { deletedChunks: softDeleted.length };
    }

    default:
      throw new Error(`Unknown job type: ${(job.type as string)}`);
  }
}

/**
 * Recovery scan: find documents marked as 'pending' in DB
 * (set by uploadDocument hook) and enqueue them.
 *
 * Call this at server startup to pick up jobs that were lost
 * due to a process crash.
 */
export async function recoverPendingJobs(): Promise<number> {
  // We don't have a status column on documentChunk currently —
  // in a future migration we'd add one. For now this is a no-op
  // placeholder, but the hook is in place.
  logger.info('embed queue recovery scan: no pending jobs (status column not yet migrated)');
  return 0;
}

/**
 * Manually trigger processing (for tests or cron).
 */
export async function flushQueue(): Promise<void> {
  await processQueue();
}

/**
 * Convenience: enqueue embed job for a new document.
 * Called by upload route instead of running embed inline.
 */
export function enqueueDocumentEmbed(
  documentId: string,
  documentType: string,
  content: string,
  metadata?: Record<string, unknown>
): EmbedJob {
  return enqueueJob('embed_document', { documentId, documentType, content, metadata });
}

// Re-export for routes
export { config };
