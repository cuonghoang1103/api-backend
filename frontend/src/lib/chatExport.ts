// chatExport.ts — download an AI chat reply as .txt / .md / .pdf.
// The PDF path reuses the Vietnamese-capable Noto Sans font already bundled for
// notes/invoices, and renders text (not HTML) so it's light and paginates.
import { NOTO_SANS_VI_BASE64 } from '@/lib/fonts/notoSansVi';

const VI_FONT = 'NotoSansVi';

/** Force a browser download of a Blob. */
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Download raw text as .txt or .md (extension decides the filename only). */
export function downloadTextFile(content: string, filename: string): void {
  triggerDownload(new Blob([content], { type: 'text/plain;charset=utf-8' }), filename);
}

interface Block { text: string; size: number; bold: boolean; gap: number }

/**
 * Turn markdown into a flat list of print blocks. Intentionally simple: headings
 * become larger/bold lines, bullets get a "• " prefix, code fences are kept as
 * plain lines, and inline markdown (**bold**, `code`, [links](url)) is stripped.
 */
function mdToBlocks(md: string): Block[] {
  const stripInline = (s: string): string =>
    s
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, '$1$2')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1');

  const blocks: Block[] = [];
  let inFence = false;
  for (const rawLine of (md || '').split('\n')) {
    const line = rawLine.replace(/\t/g, '    ');
    if (/^\s*```/.test(line)) { inFence = !inFence; continue; }
    if (inFence) { blocks.push({ text: line || ' ', size: 9.5, bold: false, gap: 2 }); continue; }
    const trimmed = line.trim();
    if (!trimmed) { blocks.push({ text: ' ', size: 6, bold: false, gap: 2 }); continue; }
    const h = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (h) {
      const level = h[1].length;
      blocks.push({ text: stripInline(h[2]), size: level <= 1 ? 16 : level === 2 ? 14 : 12, bold: true, gap: 6 });
      continue;
    }
    const bullet = /^[-*+]\s+(.*)$/.exec(trimmed);
    if (bullet) { blocks.push({ text: '•  ' + stripInline(bullet[1]), size: 11, bold: false, gap: 3 }); continue; }
    const numbered = /^(\d+)\.\s+(.*)$/.exec(trimmed);
    if (numbered) { blocks.push({ text: `${numbered[1]}.  ${stripInline(numbered[2])}`, size: 11, bold: false, gap: 3 }); continue; }
    blocks.push({ text: stripInline(trimmed), size: 11, bold: false, gap: 5 });
  }
  return blocks;
}

/** Render text/markdown to a multi-page A4 PDF and download it. */
export async function downloadPdf(content: string, filename: string): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  doc.addFileToVFS('NotoSansVi.ttf', NOTO_SANS_VI_BASE64);
  doc.addFont('NotoSansVi.ttf', VI_FONT, 'normal');
  doc.addFont('NotoSansVi.ttf', VI_FONT, 'bold');

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const maxW = pageW - margin * 2;
  let y = margin;

  for (const b of mdToBlocks(content)) {
    doc.setFont(VI_FONT, b.bold ? 'bold' : 'normal');
    doc.setFontSize(b.size);
    const lineH = b.size * 1.35;
    const wrapped: string[] = doc.splitTextToSize(b.text, maxW);
    for (const line of wrapped) {
      if (y + lineH > pageH - margin) { doc.addPage(); y = margin; }
      doc.text(line, margin, y);
      y += lineH;
    }
    y += b.gap;
  }
  doc.save(filename);
}
