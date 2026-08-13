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

// ─── Xuất ĐÚNG THỨ ĐANG HIỆN TRÊN MÀN HÌNH ────────────────────────
//
// Hàm `downloadPdf` phía trên dựng lại PDF TỪ CHỮ MARKDOWN THÔ, nên công
// thức ra thành `$\frac{a}{b}$` và hình vẽ mất sạch — tải một lời giải toán
// về thì gần như vô dụng.
//
// Ở đây làm ngược lại: câu trả lời TRÊN MÀN HÌNH đã dựng đúng rồi (KaTeX đã
// thành công thức, khối ```svg đã thành hình). Việc còn lại chỉ là chụp lại
// đúng khối đó. Không dựng lại thì không có gì để dựng sai.
//
// Ba việc phải làm khi chụp, thiếu cái nào cũng ra file hỏng:
//
//  1. CHÉP RA NGOÀI MÀN HÌNH rồi mới chụp. Chụp thẳng node đang hiển thị thì
//     dính bề rộng cửa sổ người dùng (điện thoại ra file dài ngoẵng), dính cả
//     hàng nút Chép/Tải và khối "đang suy luận".
//  2. ÉP NỀN TRẮNG CHỮ ĐEN (lớp `.chat-export-sheet`). File mang đi in hoặc
//     gửi cho thầy cô — nền đen là vô dụng ở mọi chỗ đó.
//  3. ĐỢI FONT SẴN SÀNG. html2canvas đo chữ ngay lúc gọi; font toán của KaTeX
//     mà chưa nạp xong thì công thức bị lệch hoặc mất dấu.

const BE_RONG_TRANG = 820; // px — cố định để file không phụ thuộc cửa sổ người dùng

/** Dựng một "tờ giấy" ngoài màn hình chứa bản sao của câu trả lời đã dựng. */
function dungToGiay(node: HTMLElement): HTMLElement {
  const to = document.createElement('div');
  to.className = 'chat-export-sheet';
  to.style.cssText = [
    'position:fixed', 'left:-99999px', 'top:0',
    `width:${BE_RONG_TRANG}px`, 'padding:40px 44px',
    'background:#ffffff', 'box-sizing:border-box', 'z-index:-1',
  ].join(';');
  to.innerHTML = node.innerHTML;

  // Bỏ những thứ chỉ có nghĩa trên web, không có nghĩa trong file.
  const bo = ['.chat-actions', '.katex-html + .katex-mathml', '[data-export-skip]'];
  to.querySelectorAll(bo.join(',')).forEach((el) => el.remove());
  // Khối "đang suy luận" — các bước nghĩ, không phải lời giải.
  to.querySelectorAll('button').forEach((b) => {
    if (b.textContent?.includes('suy luận')) b.closest('div')?.remove();
    else b.remove();
  });

  document.body.appendChild(to);
  return to;
}

/** Chụp một node đã dựng thành canvas, nền trắng, nét gấp đôi cho chữ sắc. */
async function chup(node: HTMLElement): Promise<HTMLCanvasElement> {
  const [{ default: html2canvas }] = await Promise.all([
    import('html2canvas'),
    // Font toán chưa nạp xong thì html2canvas đo sai bề rộng chữ.
    document.fonts?.ready ?? Promise.resolve(),
  ]);
  const to = dungToGiay(node);
  try {
    return await html2canvas(to, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: BE_RONG_TRANG,
    });
  } finally {
    to.remove();
  }
}

/** Tải câu trả lời đã dựng thành ảnh PNG — đúng như đang thấy trên màn hình. */
export async function downloadRenderedPng(node: HTMLElement, filename: string): Promise<void> {
  const canvas = await chup(node);
  const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, 'image/png'));
  if (!blob) throw new Error('không tạo được ảnh');
  triggerDownload(blob, filename);
}

/**
 * Tải câu trả lời đã dựng thành PDF.
 *
 * Ảnh chụp thường CAO HƠN một trang A4 rất nhiều, nên phải CẮT theo chiều
 * cao trang rồi dán từng lát vào từng trang. Nhét nguyên ảnh vào một trang
 * thì cả bài co lại thành con tem không đọc nổi.
 */
export async function downloadRenderedPdf(node: HTMLElement, filename: string): Promise<void> {
  const canvas = await chup(node);
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  const rongTrang = doc.internal.pageSize.getWidth();
  const caoTrang = doc.internal.pageSize.getHeight();
  const le = 24;
  const rongAnh = rongTrang - le * 2;
  // Số điểm ảnh tương ứng một trang giấy, sau khi thu ảnh cho vừa bề ngang.
  const tyLe = rongAnh / canvas.width;
  const caoLatPx = Math.floor((caoTrang - le * 2) / tyLe);

  const lat = document.createElement('canvas');
  const ctx = lat.getContext('2d');
  if (!ctx) throw new Error('không mở được canvas');

  let y = 0;
  let trangDau = true;
  while (y < canvas.height) {
    const cao = Math.min(caoLatPx, canvas.height - y);
    lat.width = canvas.width;
    lat.height = cao;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, lat.width, lat.height);
    ctx.drawImage(canvas, 0, y, canvas.width, cao, 0, 0, canvas.width, cao);

    if (!trangDau) doc.addPage();
    doc.addImage(lat.toDataURL('image/jpeg', 0.92), 'JPEG', le, le, rongAnh, cao * tyLe);
    trangDau = false;
    y += cao;
  }
  doc.save(filename);
}
