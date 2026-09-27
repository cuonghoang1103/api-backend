/**
 * Rút CHỮ từ file Excel (.xlsx) và PowerPoint (.pptx) cho AI Chat (27/09/2026).
 *
 * Trước đây AI Chat chỉ đọc PDF/Word/TXT/MD/CSV; người dùng gửi bảng tính hay
 * bài thuyết trình thì bị từ chối ngay ở bước chọn file. Cả hai định dạng đều
 * là ZIP chứa XML ⇒ đọc bằng `jszip` (đã có sẵn), không kéo thêm thư viện
 * Excel nặng nề nào.
 *
 * Mục tiêu là cho MODEL ĐỌC, không phải dựng lại file y hệt: Excel ra dạng
 * CSV từng trang (kèm tên trang), PowerPoint ra chữ từng slide theo thứ tự.
 * Công thức Excel lấy GIÁ TRỊ đã tính lưu trong file (thẻ `<v>`), vì đó là thứ
 * người dùng nhìn thấy.
 */
import JSZip from 'jszip';

/** Trần mỗi trang tính — bảng 50.000 dòng không có ích gì trong một prompt. */
const TRAN_DONG = 400;
const TRAN_COT = 40;

function giaiMaXml(s: string): string {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&');
}

/** Toàn bộ chữ trong các thẻ `<t>`/`<a:t>` của một đoạn XML, nối lại. */
function chuTrong(xml: string, the: 't' | 'a:t'): string {
  const re = the === 't' ? /<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g : /<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>/g;
  let ra = '';
  for (const m of xml.matchAll(re)) ra += giaiMaXml(m[1]!);
  return ra;
}

/** "B12" ⇒ chỉ số cột 1 (0-based). */
function cotCua(ref: string): number {
  const chu = /^[A-Z]+/.exec(ref)?.[0] ?? 'A';
  let n = 0;
  for (const c of chu) n = n * 26 + (c.charCodeAt(0) - 64);
  return n - 1;
}

function oCsv(s: string): string {
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function extractXlsx(buf: Buffer): Promise<{ text: string; pages: number }> {
  const zip = await JSZip.loadAsync(buf);
  const sharedXml = await zip.file('xl/sharedStrings.xml')?.async('string');
  const shared = sharedXml ? [...sharedXml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => chuTrong(m[1]!, 't')) : [];

  // Tên trang theo thứ tự trong workbook ↔ file sheetN qua quan hệ rId.
  const wb = (await zip.file('xl/workbook.xml')?.async('string')) ?? '';
  const rels = (await zip.file('xl/_rels/workbook.xml.rels')?.async('string')) ?? '';
  const dich = new Map<string, string>();
  for (const m of rels.matchAll(/<Relationship\b[^>]*\bId="([^"]+)"[^>]*\bTarget="([^"]+)"/g)) dich.set(m[1]!, m[2]!);
  for (const m of rels.matchAll(/<Relationship\b[^>]*\bTarget="([^"]+)"[^>]*\bId="([^"]+)"/g)) dich.set(m[2]!, m[1]!);
  const trang = [...wb.matchAll(/<sheet\b[^>]*\bname="([^"]+)"[^>]*\br:id="([^"]+)"/g)]
    .map((m) => ({ ten: giaiMaXml(m[1]!), file: `xl/${(dich.get(m[2]!) ?? '').replace(/^\/?xl\//, '')}` }));

  const phan: string[] = [];
  for (const { ten, file } of trang) {
    const xml = await zip.file(file)?.async('string');
    if (!xml) continue;
    const dong: string[] = [];
    let soDong = 0;
    let bi_cat = false;
    for (const r of xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
      if (soDong >= TRAN_DONG) { bi_cat = true; break; }
      const o: string[] = [];
      for (const c of r[1]!.matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const thuoc = c[1] ?? '';
        const than = c[2] ?? '';
        const ref = /\br="([A-Z]+\d+)"/.exec(thuoc)?.[1] ?? '';
        const kieu = /\bt="([^"]+)"/.exec(thuoc)?.[1] ?? '';
        // `<v></v>` rỗng (openpyxl ghi thế cho ô công thức chưa tính) = chưa có giá trị.
        const v = /<v>([\s\S]*?)<\/v>/.exec(than)?.[1] || undefined;
        let gt = '';
        if (kieu === 's' && v !== undefined) gt = shared[Number(v)] ?? '';
        else if (kieu === 'inlineStr') gt = chuTrong(than, 't');
        else if (v !== undefined) gt = giaiMaXml(v);
        // Ô công thức CHƯA có giá trị đã tính (file do thư viện ghi, chưa mở
        // bằng Excel) ⇒ đưa chính công thức, đừng để ô rỗng như không có gì.
        else {
          const f = /<f>([\s\S]*?)<\/f>/.exec(than)?.[1];
          if (f) gt = `=${giaiMaXml(f)}`;
        }
        const cot = ref ? cotCua(ref) : o.length;
        if (cot >= TRAN_COT) continue;
        while (o.length < cot) o.push('');
        o[cot] = gt;
      }
      if (o.some((x) => x !== '')) { dong.push(o.map(oCsv).join(',')); soDong++; }
    }
    if (!dong.length) continue;
    phan.push(`## Trang tính "${ten}"\n${dong.join('\n')}${bi_cat ? `\n[… chỉ lấy ${TRAN_DONG} dòng đầu]` : ''}`);
  }
  return { text: phan.join('\n\n'), pages: trang.length };
}

export async function extractPptx(buf: Buffer): Promise<{ text: string; pages: number }> {
  const zip = await JSZip.loadAsync(buf);
  const slide = Object.keys(zip.files)
    .map((f) => /^ppt\/slides\/slide(\d+)\.xml$/.exec(f))
    .filter((m): m is RegExpExecArray => !!m)
    .map((m) => ({ so: Number(m[1]), file: m[0] }))
    .sort((a, b) => a.so - b.so);
  const phan: string[] = [];
  for (const { so, file } of slide) {
    const xml = (await zip.file(file)?.async('string')) ?? '';
    // Mỗi đoạn `<a:p>` là một dòng chữ trên slide.
    const doan = [...xml.matchAll(/<a:p\b[^>]*>([\s\S]*?)<\/a:p>/g)].map((m) => chuTrong(m[1]!, 'a:t').trim()).filter(Boolean);
    // Ghi chú của người trình bày — lần theo QUAN HỆ của slide, không theo số:
    // `notesSlide1.xml` là ghi chú của slide ĐẦU TIÊN CÓ ghi chú, chưa chắc slide 1.
    const relXml = (await zip.file(`ppt/slides/_rels/slide${so}.xml.rels`)?.async('string')) ?? '';
    const fileGhi = /Target="\.\.\/notesSlides\/(notesSlide\d+\.xml)"/.exec(relXml)?.[1];
    const ghi = fileGhi ? await zip.file(`ppt/notesSlides/${fileGhi}`)?.async('string') : undefined;
    const ghiChu = ghi ? [...ghi.matchAll(/<a:p\b[^>]*>([\s\S]*?)<\/a:p>/g)].map((m) => chuTrong(m[1]!, 'a:t').trim()).filter(Boolean) : [];
    phan.push(`## Slide ${so}\n${doan.join('\n') || '[slide không có chữ — có thể chỉ có hình]'}${ghiChu.length ? `\n(Ghi chú: ${ghiChu.join(' ')})` : ''}`);
  }
  return { text: phan.join('\n\n'), pages: slide.length };
}
