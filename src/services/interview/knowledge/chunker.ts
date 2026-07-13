/**
 * Phase 6 — semantic chunking for the knowledge base.
 *
 * Splits a markdown document by heading structure (NOT fixed-size), so each
 * chunk is a coherent section. Code fences are never split across chunks. Each
 * chunk carries its heading breadcrumb ("Streams > Backpressure") so retrieved
 * context is self-describing. A section longer than the soft cap is split on
 * paragraph boundaries, still never inside a code fence.
 */

export interface RawChunk {
  chunkIndex: number;
  headingPath: string | null;
  content: string;
  tokenCount: number;
}

// Rough token estimate — good enough for budgeting retrieval context. ~4 chars/token.
export function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil((text || '').length / 4));
}

const SOFT_MAX_TOKENS = 350; // a section above this gets paragraph-split
const HARD_MIN_TOKENS = 12; // drop trivially small fragments (e.g. a lone heading)

interface Section {
  headingPath: string[];
  lines: string[];
}

/**
 * Walk the document line by line, tracking heading depth to build a breadcrumb.
 * Lines inside a ``` fence are opaque — heading detection is suppressed there so
 * a `#` in a code comment never starts a new section.
 */
function splitIntoSections(markdown: string): Section[] {
  const lines = (markdown || '').replace(/\r\n/g, '\n').split('\n');
  const sections: Section[] = [];
  const headingStack: { level: number; text: string }[] = [];
  let current: Section = { headingPath: [], lines: [] };
  let inFence = false;

  const pushCurrent = () => {
    if (current.lines.some((l) => l.trim().length)) sections.push(current);
  };

  for (const line of lines) {
    const fenceToggle = /^\s*```/.test(line);
    if (fenceToggle) inFence = !inFence;

    const headingMatch = !inFence && !fenceToggle ? /^(#{1,6})\s+(.*)$/.exec(line) : null;
    if (headingMatch) {
      // New heading → close the current section, update the breadcrumb stack.
      pushCurrent();
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      while (headingStack.length && headingStack[headingStack.length - 1].level >= level) headingStack.pop();
      headingStack.push({ level, text });
      current = { headingPath: headingStack.map((h) => h.text), lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  pushCurrent();
  return sections;
}

/**
 * Paragraph-split an over-long section without ever cutting inside a code fence.
 * Returns one or more content strings.
 */
function splitLongSection(content: string): string[] {
  if (estimateTokens(content) <= SOFT_MAX_TOKENS) return [content];
  const lines = content.split('\n');
  const parts: string[] = [];
  let buf: string[] = [];
  let inFence = false;

  const flush = () => {
    const t = buf.join('\n').trim();
    if (t) parts.push(t);
    buf = [];
  };

  for (const line of lines) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    buf.push(line);
    // Only break on a blank line at the top level (never inside a fence) once
    // the buffer is already large enough.
    if (!inFence && line.trim() === '' && estimateTokens(buf.join('\n')) >= SOFT_MAX_TOKENS) {
      flush();
    }
  }
  flush();
  return parts.length ? parts : [content];
}

/**
 * Chunk a markdown document into retrieval units. Deterministic (no randomness),
 * so re-chunking an unchanged doc yields identical chunks.
 */
export function chunkMarkdown(markdown: string): RawChunk[] {
  const sections = splitIntoSections(markdown);
  const chunks: RawChunk[] = [];
  let idx = 0;

  for (const section of sections) {
    const body = section.lines.join('\n').trim();
    if (!body) continue;
    const breadcrumb = section.headingPath.length ? section.headingPath.join(' > ') : null;
    for (const part of splitLongSection(body)) {
      const tokens = estimateTokens(part);
      if (tokens < HARD_MIN_TOKENS && !breadcrumb) continue; // skip stray tiny fragments
      chunks.push({ chunkIndex: idx++, headingPath: breadcrumb, content: part, tokenCount: tokens });
    }
  }

  // A document with no headings and one short paragraph still yields one chunk.
  if (!chunks.length && (markdown || '').trim()) {
    const t = markdown.trim();
    chunks.push({ chunkIndex: 0, headingPath: null, content: t, tokenCount: estimateTokens(t) });
  }
  return chunks;
}
