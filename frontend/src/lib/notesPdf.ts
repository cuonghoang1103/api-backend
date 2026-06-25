// notesPdf.ts — Phase 3d PDF export for a single note.
// Renders the server-supplied HTML inside an offscreen iframe so
// the styles don't leak into the host page, then snapshots it
// with html2canvas + jspdf. Lazy-loaded: both libraries are heavy
// and only fetched the first time the user clicks "Xuất PDF".
//
// jspdf + html2canvas are loaded via dynamic import inside the
// function body so they don't end up in the initial /notes bundle
// (they total ~400KB minified combined).

interface ExportPayload {
  id: number;
  title: string;
  contentHtml: string;
  updatedAt: string;
}

let pdfLibs: { jsPDF: typeof import('jspdf').jsPDF; html2canvas: typeof import('html2canvas').default } | null = null;

/** Cached after first successful load. */
async function loadPdfLibs() {
  if (pdfLibs) return pdfLibs;
  const [jspdfMod, h2cMod] = await Promise.all([
    import('jspdf') as Promise<{ jsPDF: typeof import('jspdf').jsPDF }>,
    import('html2canvas') as Promise<{ default: typeof import('html2canvas').default }>,
  ]);
  pdfLibs = { jsPDF: jspdfMod.jsPDF, html2canvas: h2cMod.default };
  return pdfLibs;
}

/**
 * Convert a note to a downloadable PDF. The function returns once
 * the file has been triggered for download. Throws on failure.
 */
export async function exportNoteAsPdf(payload: ExportPayload): Promise<void> {
  // Build a printable HTML doc. The iframe lets us scope CSS to the
  // export without polluting the host page. Inline styles keep the
  // PDF self-contained — no external fonts, no Tailwind, no images
  // that would be blocked by CORS.
  const safeTitle = (payload.title || 'Ghi chú').replace(/[<&>]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] ?? c));
  const safeDate = new Date(payload.updatedAt).toLocaleString('vi-VN');
  const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<title>${safeTitle}</title>
<style>
  /* Self-contained print stylesheet — mirrors the .note-prose rules
     the editor uses so headings, code, callout, list look the same
     in the PDF as on the web. */
  * { box-sizing: border-box; }
  html, body { background: #fff; color: #0f172a; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Helvetica Neue", Arial, sans-serif; margin: 0; padding: 32px 28px; line-height: 1.55; }
  h1, h2, h3 { color: #0f172a; line-height: 1.25; }
  h1 { font-size: 24px; margin: 0 0 6px; }
  h2 { font-size: 18px; margin: 22px 0 6px; }
  h3 { font-size: 15px; margin: 18px 0 4px; }
  p { margin: 6px 0; color: #1e293b; }
  a { color: #0d9488; text-decoration: underline; text-underline-offset: 2px; }
  ul, ol { padding-left: 1.4em; margin: 6px 0; }
  li { margin: 2px 0; }
  blockquote { border-left: 3px solid #cbd5e1; padding: 4px 12px; color: #475569; margin: 8px 0; background: #f1f5f9; }
  code { font-family: "JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace; font-size: 0.92em; background: #f1f5f9; padding: 1px 4px; border-radius: 3px; color: #0f172a; }
  pre { background: #0f172a; color: #e2e8f0; padding: 12px 14px; border-radius: 8px; overflow: auto; font-size: 12.5px; }
  pre code { background: none; color: inherit; padding: 0; }
  hr { border: none; border-top: 1px solid #cbd5e1; margin: 16px 0; }
  img { max-width: 100%; height: auto; border-radius: 6px; }
  table { border-collapse: collapse; width: 100%; margin: 8px 0; }
  th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; vertical-align: top; }
  th { background: #f1f5f9; font-weight: 600; }
  aside[data-type="callout"] { border-left: 3px solid #14b8a6; background: #f0fdfa; padding: 8px 12px; border-radius: 6px; margin: 10px 0; display: flex; gap: 8px; }
  aside[data-type="callout"][data-kind="warning"] { border-color: #f59e0b; background: #fffbeb; }
  aside[data-type="callout"][data-kind="note"] { border-color: #0ea5e9; background: #f0f9ff; }
  ul[data-type="taskList"] { list-style: none; padding-left: 0; }
  ul[data-type="taskList"] li { display: flex; gap: 6px; align-items: flex-start; }
  ul[data-type="taskList"] li[data-checked="true"] > div { text-decoration: line-through; color: #64748b; }
  .export-title { margin: 0 0 2px; }
  .export-meta { font-size: 11px; color: #64748b; margin: 0 0 18px; }
  .export-body > * + * { margin-top: 8px; }
</style>
</head>
<body>
<h1 class="export-title">${safeTitle}</h1>
<p class="export-meta">Cập nhật: ${safeDate} · ID #${payload.id}</p>
<div class="export-body">${payload.contentHtml || '<p><em>Ghi chú trống.</em></p>'}</div>
</body>
</html>`;

  // Spin up an off-DOM iframe so styles don't bleed and CORS
  // blockers on the parent don't trip html2canvas.
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;left:-99999px;top:0;width:794px;height:1123px;border:0;';
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  try {
    const doc = iframe.contentDocument;
    if (!doc) throw new Error('Không thể tạo tài liệu in.');
    doc.open();
    doc.write(html);
    doc.close();

    // Wait for the iframe's resources (images, fonts) to finish
    // before we snapshot — otherwise the PDF is missing late-
    // arriving elements.
    await waitForIframeLoad(iframe);

    const target = doc.body;
    const { html2canvas, jsPDF } = await loadPdfLibs();
    const canvas = await html2canvas(target, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });
    const imgData = canvas.toDataURL('image/png');

    // A4 portrait at 96dpi → 794×1123. We paginate so a long note
    // doesn't get squashed onto a single stretched page.
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 18;
    const imgW = pageW - margin * 2;
    const imgH = (canvas.height * imgW) / canvas.width;

    if (imgH <= pageH - margin * 2) {
      pdf.addImage(imgData, 'PNG', margin, margin, imgW, imgH);
    } else {
      // Slice the rendered image into A4-height pages.
      const pageContentH = pageH - margin * 2;
      const ratio = imgW / canvas.width;
      const sliceCanvasH = pageContentH / ratio;
      let drawn = 0;
      while (drawn < canvas.height) {
        const slice = document.createElement('canvas');
        slice.width = canvas.width;
        slice.height = Math.min(sliceCanvasH, canvas.height - drawn);
        const ctx = slice.getContext('2d');
        if (ctx) ctx.drawImage(canvas, 0, drawn, canvas.width, slice.height, 0, 0, canvas.width, slice.height);
        const sliceImg = slice.toDataURL('image/png');
        const sliceH = slice.height * ratio;
        if (drawn > 0) pdf.addPage();
        pdf.addImage(sliceImg, 'PNG', margin, margin, imgW, sliceH);
        drawn += slice.height;
      }
    }

    pdf.save(`${safeTitle}.pdf`);
  } finally {
    document.body.removeChild(iframe);
  }
}

function waitForIframeLoad(iframe: HTMLIFrameElement): Promise<void> {
  return new Promise((resolve) => {
    const doc = iframe.contentDocument;
    if (!doc) { resolve(); return; }
    if (doc.readyState === 'complete') { resolve(); return; }
    const done = () => resolve();
    doc.addEventListener('DOMContentLoaded', done, { once: true });
    iframe.addEventListener('load', done, { once: true });
    // Hard fallback: never wait longer than 2s even if some image
    // is stuck. The PDF is still usable — just without that image.
    setTimeout(done, 2000);
  });
}
