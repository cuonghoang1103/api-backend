/**
 * CV Builder — file text extraction (Phase 2b: PDF / DOCX).
 * ─────────────────────────────────────────────────────────────────────────
 * Turns an uploaded PDF/DOCX into plain text that feeds the SAME heuristic
 * parser used by paste import (parseRawText). Two things matter here:
 *
 *  1. Line structure. A CV parser needs newlines to find sections and items.
 *     mammoth already emits paragraph breaks. pdfjs' flat `extractText` does
 *     NOT — it returns one space-joined blob — so for PDF we reconstruct lines
 *     from per-glyph geometry (group by Y, order by X). This also gives us the
 *     correct reading order.
 *
 *  2. Hidden text. White-on-white / zero-size / off-page text is a real ATS
 *     manipulation trick (and sometimes an accidental template artifact). We
 *     detect the geometric variants deterministically (zero height, positioned
 *     outside the page, invisible render mode) and flag them — worth telling
 *     the user even when it wasn't malicious. A scanned PDF with NO extractable
 *     text is the single most valuable thing we can surface: every ATS read it
 *     as a blank page.
 */
import mammoth from 'mammoth';
import { getDocumentProxy } from 'unpdf';

export interface ExtractResult {
  text: string;
  pages: number;
  hiddenTextFound: boolean;
  /** true when a PDF yielded essentially no selectable text → likely scanned/image-only. */
  imageOnly: boolean;
}

// pdfjs text item (loosely typed — the proxy comes from unpdf's bundled pdfjs).
interface PdfTextItem {
  str: string;
  transform: number[]; // [a, b, c, d, e(x), f(y)]
  width: number;
  height: number;
  hasEOL?: boolean;
}

export async function extractDocx(buffer: Buffer): Promise<ExtractResult> {
  const { value } = await mammoth.extractRawText({ buffer });
  const text = value.replace(/\n{3,}/g, '\n\n').trim();
  return { text, pages: 1, hiddenTextFound: false, imageOnly: false };
}

export async function extractPdf(buffer: Buffer): Promise<ExtractResult> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const pages = pdf.numPages as number;
  const lines: string[] = [];
  let visibleChars = 0;
  let hiddenTextFound = false;

  for (let p = 1; p <= pages; p++) {
    const page = await pdf.getPage(p);
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    const items = (content.items as PdfTextItem[]).filter((it) => 'str' in it);

    // Reconstruct lines: bucket items by Y (PDF origin is bottom-left), then
    // order left→right within a line and top→bottom between lines.
    const rows: { y: number; items: PdfTextItem[] }[] = [];
    for (const it of items) {
      const str = it.str;
      const x = it.transform[4];
      const y = it.transform[5];
      const h = Math.abs(it.height || it.transform[3] || 0);

      // Hidden-text signals (only count on non-blank glyphs).
      if (str.trim()) {
        if (h > 0 && h < 0.6) hiddenTextFound = true; // zero/near-zero size
        else if (x < -10 || y < -10 || x > viewport.width + 60 || y > viewport.height + 60) hiddenTextFound = true; // off page
        else visibleChars += str.trim().length;
      }

      const row = rows.find((r) => Math.abs(r.y - y) <= Math.max(2, h * 0.5));
      if (row) row.items.push(it);
      else rows.push({ y, items: [it] });
    }

    rows.sort((a, b) => b.y - a.y); // top of page first
    for (const row of rows) {
      row.items.sort((a, b) => a.transform[4] - b.transform[4]);
      let line = '';
      let prevEndX: number | null = null;
      for (const it of row.items) {
        const x = it.transform[4];
        if (prevEndX !== null && x - prevEndX > 1.5) line += ' ';
        line += it.str;
        prevEndX = x + (it.width || 0);
      }
      const trimmed = line.replace(/\s+/g, ' ').trim();
      if (trimmed) lines.push(trimmed);
    }
    lines.push(''); // page break → blank line
  }

  const text = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  // "essentially no text" → scanned/image PDF. Threshold guards against a few
  // stray glyphs (page numbers) in an otherwise image-only document.
  const imageOnly = visibleChars < 40;
  return { text, pages, hiddenTextFound, imageOnly };
}

const MAGIC = { PDF: '25504446', ZIP: '504b0304' }; // %PDF ; PK\x03\x04 (docx is a zip)

/** Sniff the real file type from magic bytes (don't trust the client mimetype). */
export function detectFileType(buffer: Buffer): 'PDF' | 'DOCX' | null {
  const head = buffer.subarray(0, 4).toString('hex');
  if (head === MAGIC.PDF) return 'PDF';
  if (head === MAGIC.ZIP) return 'DOCX'; // could also be .pptx/.xlsx — mammoth will fail cleanly if not a Word doc
  return null;
}
