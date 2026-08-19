/**
 * Xuất ghi chú ra Markdown · Word · PDF.
 *
 * MỘT bộ phân tích, BA bộ kết xuất. HTML của ghi chú được bóc thành danh sách
 * "khối" trung gian (`Khoi`), rồi mỗi định dạng chỉ việc vẽ lại danh sách đó.
 * Viết ba bộ bóc HTML riêng là ba lần cùng một lỗi, và ba chỗ để quên sửa.
 *
 * ⚠️ PDF PHẢI NHÚNG FONT CÓ DẤU. pdfkit mặc định dùng Helvetica — nó không có
 * glyph cho chữ Việt, nên chữ có dấu ra ô vuông mà KHÔNG có lỗi nào. Dự án đã
 * nhúng sẵn Noto Sans (bản OFL, có dấu) cho CV Builder; dùng lại đúng font đó.
 */
import { Buffer } from 'node:buffer';

export type Khoi =
  | { loai: 'tieu-de'; muc: 1 | 2 | 3; chu: string }
  | { loai: 'doan'; chu: string }
  | { loai: 'gach-dau-dong'; cac: string[]; danhSo: boolean }
  | { loai: 'trich-dan'; chu: string }
  | { loai: 'ma'; chu: string }
  | { loai: 'ngan-cach' };

/** Bỏ thẻ, đổi thực thể HTML về ký tự thật. */
function chuThuan(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * HTML → danh sách khối.
 *
 * Dùng regex chứ không dựng cây DOM: đầu vào là HTML do CHÍNH TipTap sinh ra
 * (không phải HTML tuỳ ý ngoài internet), nên tập thẻ hẹp và đoán được. Thêm
 * một bộ phân tích DOM vào backend chỉ để đọc mấy thẻ này là không đáng.
 */
export function bocKhoi(html: string): Khoi[] {
  const ra: Khoi[] = [];
  const re = /<(h[1-3]|p|ul|ol|blockquote|pre)\b[^>]*>([\s\S]*?)<\/\1>|<hr\s*\/?>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const the = (m[1] ?? 'hr').toLowerCase();
    const trong = m[2] ?? '';
    if (the === 'hr') { ra.push({ loai: 'ngan-cach' }); continue; }
    if (the === 'h1' || the === 'h2' || the === 'h3') {
      const chu = chuThuan(trong);
      if (chu) ra.push({ loai: 'tieu-de', muc: Number(the[1]) as 1 | 2 | 3, chu });
      continue;
    }
    if (the === 'ul' || the === 'ol') {
      const muc = [...trong.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
        .map((x) => chuThuan(x[1] ?? ''))
        .filter(Boolean);
      if (muc.length) ra.push({ loai: 'gach-dau-dong', cac: muc, danhSo: the === 'ol' });
      continue;
    }
    if (the === 'blockquote') {
      const chu = chuThuan(trong);
      if (chu) ra.push({ loai: 'trich-dan', chu });
      continue;
    }
    if (the === 'pre') {
      /* Trong <pre> phải GIỮ NGUYÊN xuống dòng và khoảng trắng đầu dòng —
       * `chuThuan` gộp khoảng trắng nên không dùng được ở đây. Mất thụt lề là
       * mất luôn nghĩa của đoạn mã. */
      const chu = trong
        .replace(/<\/?code[^>]*>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/^\n+|\n+$/g, '');
      if (chu) ra.push({ loai: 'ma', chu });
      continue;
    }
    const chu = chuThuan(trong);
    if (chu) ra.push({ loai: 'doan', chu });
  }
  return ra;
}

// ─── Markdown ───────────────────────────────────────────────
export function raMarkdown(tieuDe: string, khoi: Khoi[]): string {
  const dong: string[] = [`# ${tieuDe || '(không tên)'}`, ''];
  for (const k of khoi) {
    if (k.loai === 'tieu-de') dong.push(`${'#'.repeat(k.muc + 1)} ${k.chu}`, '');
    else if (k.loai === 'doan') dong.push(k.chu, '');
    else if (k.loai === 'gach-dau-dong') {
      k.cac.forEach((c, i) => dong.push(k.danhSo ? `${i + 1}. ${c}` : `- ${c}`));
      dong.push('');
    } else if (k.loai === 'trich-dan') dong.push(`> ${k.chu}`, '');
    else if (k.loai === 'ma') dong.push('```', k.chu, '```', '');
    else dong.push('---', '');
  }
  return `${dong.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

// ─── Word ───────────────────────────────────────────────────
export async function raDocx(tieuDe: string, khoi: Khoi[]): Promise<Buffer> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');
  const con: InstanceType<typeof Paragraph>[] = [
    new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: tieuDe || '(không tên)' })] }),
  ];
  const mucTieuDe = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
  } as const;

  for (const k of khoi) {
    if (k.loai === 'tieu-de') {
      con.push(new Paragraph({ heading: mucTieuDe[k.muc], children: [new TextRun({ text: k.chu })] }));
    } else if (k.loai === 'doan') {
      con.push(new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: k.chu })] }));
    } else if (k.loai === 'gach-dau-dong') {
      k.cac.forEach((c, i) => con.push(new Paragraph({
        /* Đánh dấu bằng CHỮ chứ không dùng `numbering` của docx: numbering phải
         * khai ở cấp tài liệu, và khai thiếu thì Word mở ra mất sạch dấu đầu
         * dòng — hỏng câm, chỉ thấy khi mở file thật. */
        children: [new TextRun({ text: `${k.danhSo ? `${i + 1}.` : '•'} ${c}` })],
        indent: { left: 360 },
      })));
    } else if (k.loai === 'trich-dan') {
      con.push(new Paragraph({
        indent: { left: 360 },
        children: [new TextRun({ text: k.chu, italics: true, color: '555555' })],
      }));
    } else if (k.loai === 'ma') {
      for (const d of k.chu.split('\n')) {
        con.push(new Paragraph({
          shading: { fill: 'F3F4F6' },
          // Dòng rỗng phải thành một khoảng trắng, không thì Word nuốt cả dòng.
          children: [new TextRun({ text: d || ' ', font: 'Consolas', size: 19 })],
        }));
      }
      con.push(new Paragraph({ children: [] }));
    } else {
      con.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '———' })] }));
    }
  }

  const doc = new Document({ sections: [{ children: con }] });
  return Packer.toBuffer(doc);
}

// ─── PDF ────────────────────────────────────────────────────
export async function raPdf(tieuDe: string, khoi: Khoi[]): Promise<Buffer> {
  const { default: PDFDocument } = await import('pdfkit');
  const { notoSansViBuffer, notoSansViBoldBuffer } = await import('./cv/export/font.js');

  const doc = new PDFDocument({ size: 'A4', margins: { top: 56, bottom: 56, left: 56, right: 56 } });
  /* ⚠️ Đăng ký font CÓ DẤU trước khi viết chữ đầu tiên. Thiếu bước này thì mọi
   * chữ Việt ra ô vuông và pdfkit không báo gì cả. */
  doc.registerFont('vi', notoSansViBuffer());
  doc.registerFont('vi-dam', notoSansViBoldBuffer());

  const manh: Buffer[] = [];
  doc.on('data', (c: Buffer) => manh.push(c));
  const xong = new Promise<Buffer>((giai) => doc.on('end', () => giai(Buffer.concat(manh))));

  doc.font('vi-dam').fontSize(20).fillColor('#111111').text(tieuDe || '(không tên)');
  doc.moveDown(0.8);

  for (const k of khoi) {
    if (k.loai === 'tieu-de') {
      doc.moveDown(0.4);
      doc.font('vi-dam')
        .fontSize(k.muc === 1 ? 15 : k.muc === 2 ? 13.5 : 12.5)
        .fillColor('#111111')
        .text(k.chu);
      doc.moveDown(0.2);
    } else if (k.loai === 'doan') {
      doc.font('vi').fontSize(11).fillColor('#222222').text(k.chu, { align: 'left' });
      doc.moveDown(0.5);
    } else if (k.loai === 'gach-dau-dong') {
      doc.font('vi').fontSize(11).fillColor('#222222');
      k.cac.forEach((c, i) => doc.text(`${k.danhSo ? `${i + 1}.` : '•'} ${c}`, { indent: 14 }));
      doc.moveDown(0.5);
    } else if (k.loai === 'trich-dan') {
      doc.font('vi').fontSize(11).fillColor('#555555').text(k.chu, { indent: 18 });
      doc.moveDown(0.5);
    } else if (k.loai === 'ma') {
      doc.font('vi').fontSize(9.5).fillColor('#333333').text(k.chu, { indent: 10 });
      doc.moveDown(0.5);
    } else {
      doc.moveDown(0.3);
      doc.strokeColor('#DDDDDD').moveTo(doc.x, doc.y).lineTo(doc.page.width - 56, doc.y).stroke();
      doc.moveDown(0.6);
    }
  }

  doc.end();
  return xong;
}

/**
 * Tên file an toàn cho mọi hệ điều hành.
 *
 * Chặn ký tự Windows cấm (`< > : " / \ | ? *`), dấu chấm ở đầu (thành file ẩn
 * trên Linux/macOS), và cắt còn 80 ký tự — một số hệ thống tệp giới hạn 255
 * byte, mà tiếng Việt có dấu chiếm 2-3 byte mỗi chữ.
 */
export function tenFileAnToan(tieuDe: string, duoi: string): string {
  const sach = (tieuDe || 'ghi-chu')
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/^[.-]+/, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 80)
    .replace(/-+$/, '') || 'ghi-chu';
  return `${sach}.${duoi}`;
}
