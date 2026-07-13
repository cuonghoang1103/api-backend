/**
 * Phase 6 — knowledge retrieval (the "R" in RAG).
 *
 * Provider-agnostic by design, mirroring the LLM layer: today retrieval is
 * LEXICAL (Postgres tsvector, config 'simple') because prod runs the postgis
 * image with no pgvector extension and no embedding key is configured. When an
 * embedding provider + a pgvector-capable image land, add a `semantic` branch
 * here and switch `retrievalMode()` — nothing upstream changes.
 *
 * Retrieval is always TOPIC-SCOPED: a chunk is only a candidate if it shares a
 * topic (or track, as a fallback) with the question. This keeps the grader from
 * being fed irrelevant material and makes "no coverage" detectable per topic.
 */
import { prisma } from '../../../config/database.js';
import type { InterviewLanguage } from '@prisma/client';

export interface RetrievedChunk {
  id: number;
  documentId: number;
  documentTitle: string;
  headingPath: string | null;
  content: string;
  rank: number;
}

export type RetrievalMode = 'lexical' | 'semantic';

/** Which retrieval backend is active. Semantic requires an embedding key AND a
 *  vector-capable database — neither is present today, so always lexical. */
export function retrievalMode(): RetrievalMode {
  return process.env.EMBEDDING_API_KEY && process.env.KNOWLEDGE_SEMANTIC === 'true' ? 'semantic' : 'lexical';
}

export interface RetrieveParams {
  query: string;
  topicIds?: number[];
  trackIds?: number[];
  language?: InterviewLanguage;
  k?: number;
}

// websearch_to_tsquery is forgiving, but strip characters that can still make a
// query degenerate to empty, and cap length.
function cleanQuery(q: string): string {
  return (q || '').replace(/[\x00-\x1F]+/g, ' ').trim().slice(0, 400);
}

/**
 * Retrieve the top-k most relevant published chunks for a question's scope.
 * Falls back progressively: topic-scoped → track-scoped → unscoped, so a
 * partially-tagged KB still returns something useful. Never throws — retrieval
 * failure must degrade the grader to ungrounded, not break the turn.
 */
export async function retrieveChunks(params: RetrieveParams): Promise<RetrievedChunk[]> {
  const q = cleanQuery(params.query);
  const k = Math.min(12, Math.max(1, params.k ?? (Number(process.env.RAG_TOP_K) || 5)));
  if (!q) return [];

  const topicIds = (params.topicIds ?? []).filter((n) => Number.isFinite(n));
  const trackIds = (params.trackIds ?? []).filter((n) => Number.isFinite(n));
  const lang = params.language ?? 'VI';

  // Build a scope predicate, widening if the narrower scope has no hits.
  const scopes: string[] = [];
  if (topicIds.length) scopes.push(`topic_ids && ARRAY[${topicIds.join(',')}]::int[]`);
  if (trackIds.length) scopes.push(`track_ids && ARRAY[${trackIds.join(',')}]::int[]`);
  scopes.push('TRUE'); // final widen: unscoped

  for (const scope of scopes) {
    try {
      const rows = await prisma.$queryRawUnsafe<
        Array<{ id: number; document_id: number; heading_path: string | null; content: string; rank: number; title: string }>
      >(
        `SELECT c.id, c.document_id, c.heading_path, c.content, c.language,
                ts_rank(c.search_vector, websearch_to_tsquery('simple', $1)) AS rank,
                d.title
         FROM interview_knowledge_chunks c
         JOIN interview_knowledge_documents d ON d.id = c.document_id
         WHERE c.status = 'PUBLISHED' AND d.status = 'PUBLISHED'
           AND c.search_vector @@ websearch_to_tsquery('simple', $1)
           AND (${scope})
         ORDER BY (c.language = $2::"InterviewLanguage") DESC, rank DESC
         LIMIT $3`,
        q,
        lang,
        k,
      );
      if (rows.length) {
        return rows.map((r) => ({
          id: r.id,
          documentId: r.document_id,
          documentTitle: r.title,
          headingPath: r.heading_path,
          content: r.content,
          rank: Number(r.rank),
        }));
      }
    } catch {
      // tsvector column missing (stray db push) or query error → give up quietly.
      return [];
    }
  }
  return [];
}

/**
 * A topic is a KNOWLEDGE GAP when the KB has zero published chunks scoped to it.
 * Distinct from "retrieval found nothing for this query" — the gap is about
 * coverage, and it feeds the admin heatmap/to-do list.
 */
export async function topicsWithCoverage(topicIds: number[]): Promise<Set<number>> {
  const ids = topicIds.filter((n) => Number.isFinite(n));
  if (!ids.length) return new Set();
  try {
    const rows = await prisma.$queryRawUnsafe<Array<{ topic_id: number }>>(
      `SELECT DISTINCT unnest(topic_ids) AS topic_id
       FROM interview_knowledge_chunks
       WHERE status = 'PUBLISHED' AND topic_ids && ARRAY[${ids.join(',')}]::int[]`,
    );
    return new Set(rows.map((r) => Number(r.topic_id)));
  } catch {
    return new Set();
  }
}
