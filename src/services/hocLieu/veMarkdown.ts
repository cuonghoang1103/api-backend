/**
 * HỌC LIỆU CHO CUONGMINI — phần THUẦN (không DB, không mạng) để kiểm bằng test: đổi nội dung bài học sang markdown gọn
 * cho model đọc. Dùng bởi `hocLieu.service.ts` (công cụ `hoc_lieu`, 24/11/2026).
 *
 * Ba loại đầu vào:
 *   1. HTML bài của Courses/Academy (song ngữ `.ml-en/.ml-vi`) ⇒ giữ MỘT thứ tiếng (boNgonNguKhac của gia sư khoá học) ⇒ markdown.
 *   2. Khối của khoá kiểu sách (Dekiru/JP/CH/IELTS — `components/sach-hoc/types.ts › Block`) ⇒ markdown, BÀI TẬP KÈM ĐÁP ÁN
 *      (đây là tài liệu tự học của chính người dùng; trang web cũng chấm tại chỗ và hiện đáp án khi bấm "Xem đáp án").
 *   3. Phụ đề video (cues) ⇒ lời giảng theo mốc thời gian.
 */
import { boNgonNguKhac } from '../courseTutor.context.js';

/** Thực thể HTML hay gặp. */
function boThucThe(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&');
}

/** HTML bài học ⇒ markdown đọc được (không cần đẹp hoàn hảo — cần ĐỦ chữ, đủ code, đủ bảng). */
export function htmlSangMd(html: string | null | undefined, english = false): string {
  let s = boNgonNguKhac(String(html || ''), english);
  // Khối code trước (giữ nguyên xuống dòng, không bóc thẻ con thành khoảng trắng lung tung).
  const code: string[] = [];
  s = s.replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi, (_m, inner: string) => {
    const lang = /class\s*=\s*["'][^"']*language-([\w+-]+)/i.exec(inner)?.[1] ?? '';
    const txt = boThucThe(inner.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ''));
    code.push('```' + lang + '\n' + txt.replace(/\n+$/, '') + '\n```');
    return `\n\u0000${code.length - 1}\u0000\n`;
  });
  s = s
    .replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_m, n: string, t: string) => `\n${'#'.repeat(Math.min(6, Number(n) + 1))} ${t.replace(/<[^>]+>/g, '').trim()}\n`)
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**')
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, '_$2_')
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_m, t: string) => '`' + t.replace(/<[^>]+>/g, '') + '`')
    .replace(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, h: string, t: string) => {
      const ten = t.replace(/<[^>]+>/g, '').trim();
      return ten && ten !== h ? `[${ten}](${h})` : h;
    })
    .replace(/<img\b[^>]*alt\s*=\s*["']([^"']*)["'][^>]*>/gi, (_m, a: string) => (a ? `[hình: ${a}]` : ''))
    .replace(/<li\b[^>]*>/gi, '\n- ')
    .replace(/<\/(td|th)>\s*/gi, ' | ')
    .replace(/<tr\b[^>]*>/gi, '\n| ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|ul|ol|table|tr|blockquote|section|li|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, '');
  s = boThucThe(s)
    .replace(/[ \t]+\n/g, '\n').replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\u0000(\d+)\u0000/g, (_m, i: string) => code[Number(i)] ?? '')
    .trim();
  return s;
}

/** Cú pháp chữ nội tuyến của khoá sách: `{漢字|かな}` ⇒ `漢字(かな)`, `==x==` ⇒ `x`; giữ `**đậm**`. */
export function chuNoiTuyen(s: unknown): string {
  return String(s ?? '')
    .replace(/\{([^{}|]+)\|([^{}]+)\}/g, '$1($2)')
    .replace(/==([^=]+)==/g, '$1')
    .trim();
}

type K = Record<string, unknown> & { t?: string };
const arr = (v: unknown): any[] => (Array.isArray(v) ? v : []);
const c = chuNoiTuyen;

/**
 * Một khối của khoá sách ⇒ markdown. `dapAn` (mặc định true): ghi đáp án bài tập để gia sư chấm.
 * Khối chỉ là công cụ tương tác (ô viết tay, ôn thẻ, bảng chia…) ⇒ một dòng mô tả, để model biết trên trang có gì.
 */
export function khoiSangMd(k: K, o: { dapAn?: boolean } = {}): string {
  const dapAn = o.dapAn !== false;
  switch (k.t) {
    case 'h': return `### ${c(k.text)}`;
    case 'p': return c(k.text);
    case 'recap': return `**${c(k.title || 'Tóm tắt nhanh')}**\n` + arr(k.items).map((x) => `- ${c(x)}`).join('\n');
    case 'rule': return `**Công thức:** ${c(k.formula)}${k.vi ? ` — ${c(k.vi)}` : ''}`;
    case 'note': return `> **${c(k.title)}**\n` + arr(k.items).map((x) => `> - ${c(x)}`).join('\n');
    case 'examples': return arr(k.items).map((e) => `- ${c(e.en)}${e.ro ? ` (${e.ro})` : ''} — ${c(e.vi)}`).join('\n');
    case 'patterns': return arr(k.rows).map((r) => `- **${c(r.formula)}** — ${c(r.vi)}\n` + arr(r.examples).map((e) => `  - ${c(e.en)}${e.ro ? ` (${e.ro})` : ''} — ${c(e.vi)}`).join('\n')).join('\n');
    case 'table': {
      const head = arr(k.head).map(c);
      const rows = arr(k.rows).map((r) => '| ' + arr(r).map(c).join(' | ') + ' |');
      return (k.caption ? `_${c(k.caption)}_\n` : '') + (head.length ? `| ${head.join(' | ')} |\n|${head.map(() => '---').join('|')}|\n` : '') + rows.join('\n');
    }
    case 'vocab': return arr(k.items).map((v) => `- **${c(v.w)}** · ${v.ipa ?? ''} · ${c(v.vi)}${v.pos ? ` _(${v.pos})_` : ''}${v.ex ? `\n  - VD: ${c(v.ex)}${v.exRo ? ` (${v.exRo})` : ''} — ${c(v.exVi)}` : ''}${v.more ? `\n  - ${c(v.more)}` : ''}`).join('\n');
    case 'hinh': return (k.title ? `**${c(k.title)}**\n` : '') + arr(k.items).map((v) => `- ${c(v.w)} (${v.ro}) — ${c(v.vi)}`).join('\n');
    case 'dialogue': return (k.title ? `**${c(k.title)}**\n` : '') + arr(k.lines).map((l) => `- **${c(l.who)}:** ${c(l.text)}${l.ro ? ` (${l.ro})` : ''}${l.vi ? ` — _${c(l.vi)}_` : ''}`).join('\n');
    case 'listen': return `**🎧 Nghe: ${c(k.title)}**${k.note ? ` — ${c(k.note)}` : ''}\n_Lời thoại (che khi luyện nghe):_\n` + arr(k.lines).map((l) => `- ${l.who ? `**${c(l.who)}:** ` : ''}${c(l.text)}${l.vi ? ` — _${c(l.vi)}_` : ''}`).join('\n');
    case 'passage': return `**📄 ${c(k.title)}**${k.intro ? `\n${c(k.intro)}` : ''}\n` + arr(k.paras).map((p) => `${p.label ? `**${p.label}.** ` : ''}${c(p.text)}`).join('\n\n');
    case 'quiz': return `**✍️ Bài tập: ${c(k.title)}** (${k.kind === 'translate' ? 'dịch' : 'điền'}; id ${k.id})${k.grammar ? `\n_Cấu trúc: ${c(k.grammar)}_` : ''}\n` + arr(k.items).map((q, i) => `${i + 1}. ${c(q.q)}${q.hint ? ` _(gợi ý: ${c(q.hint)})_` : ''}${dapAn ? `\n   - Đáp án: ${arr(q.answers).slice(0, 3).map(c).join(' / ')}` : ''}`).join('\n');
    case 'mcq': return `**☑️ Trắc nghiệm: ${c(k.title)}** (id ${k.id})\n` + arr(k.items).map((q, i) => `${i + 1}. ${c(q.q)}\n` + arr(q.options).map((op, j) => `   ${String.fromCharCode(65 + j)}. ${c(op)}`).join('\n') + (dapAn ? `\n   - Đáp án: ${String.fromCharCode(65 + Number(q.correct))}${q.why ? ` — ${c(q.why)}` : ''}` : '')).join('\n');
    case 'dictation': return `**🎙 Chính tả: ${c(k.title || k.id)}**\n` + arr(k.items).map((d, i) => `${i + 1}. ${c(d.label)}${dapAn ? ` — đáp án: ${c(d.answer)}` : ''}`).join('\n');
    case 'build': return `**🧱 Ghép câu: ${c(k.title)}** (id ${k.id})\n` + arr(k.items).map((b, i) => `${i + 1}. ${c(b.vi)} — mảnh: ${arr(b.chips).map(c).join(' · ')}${dapAn ? `\n   - Đáp án: ${arr(b.answer).map(c).join(' ')}` : ''}`).join('\n');
    case 'readkanji': return `**🀄 Đọc chữ Hán: ${c(k.title)}**${k.note ? ` — ${c(k.note)}` : ''}\n` + arr(k.items).map((x, i) => `${i + 1}. ${String(x.text ?? '').replace(/\{([^{}|]+)\|[^{}]+\}/g, '$1')}${dapAn ? ` — đọc: ${x.ro}; nghĩa: ${c(x.vi)}` : ''}`).join('\n');
    case 'speak': return `**🗣 Luyện nói (Part ${k.part})**\n` + arr(k.questions).map((q, i) => `${i + 1}. ${c(q)}`).join('\n');
    case 'phatam': return `**🔊 Phát âm: ${c(k.title || '')}**\n` + arr(k.items).map((x) => `- ${c(x.text)} (${x.ipa})${x.vi ? ` — ${c(x.vi)}` : ''}`).join('\n');
    case 'essay': return `**📝 Viết (${k.task}, ≥ ${k.minWords} từ):** ${c(k.prompt)}` + (arr(k.tips).length ? '\n' + arr(k.tips).map((t) => `- ${c(t)}`).join('\n') : '');
    case 'write': return `**✏️ Tập viết: ${c(k.title)}** — ${arr(k.chars).join(' ')}`;
    case 'slides': return `**📽️ Slide: ${c(k.title)}** (${arr(k.slides).length} slide)\n` + arr(k.slides).map((sl, i) => `- Slide ${i + 1}: ${c(sl.title ?? sl.tieuDe ?? '')}${arr(sl.items ?? sl.dong).length ? ' — ' + arr(sl.items ?? sl.dong).map(c).join('; ') : ''}`).join('\n');
    case 'canh': return `_[Cảnh minh hoạ: ${c(k.caption)}]_`;
    case 'hanlop': return `_[Thẻ "Chữ Hán của lớp" Bài ${k.bai} — mở trên trang để xem từng chữ]_`;
    case 'alphabet': return arr(k.groups).map((g) => `- ${c(g.sound)}: ` + arr(g.letters).map((l) => `${l.l}(${l.ipa})`).join(' ')).join('\n');
    case 'chart': case 'figure': return `_[Hình/biểu đồ: ${c(k.title ?? (k.fig as K | undefined)?.title ?? '')}]_`;
    case 'timeline': case 'flow': case 'mindmap': case 'compare': return `_[Sơ đồ ${k.t}${k.title ? `: ${c(k.title)}` : ''}]_`;
    case 'vocabAll': return '_[Tra cứu toàn bộ từ vựng khoá — trên trang]_';
    case 'onthe': return '_[Ôn tập bằng thẻ (thẻ lật, trắc nghiệm, gõ) — trên trang]_';
    case 'luyenKana': return '_[Luyện bảng chữ hiragana/katakana — trên trang]_';
    case 'chia': return '_[Công cụ chia động từ/tính từ — trên trang]_';
    default: return k.t ? `_[khối ${k.t}]_` : '';
  }
}

/** Một bài (mục) của khoá sách ⇒ markdown đủ khối. */
export function baiSachSangMd(l: { id: string; title: string; goal?: string; minutes?: number; blocks?: unknown[] }, o: { dapAn?: boolean } = {}): string {
  const dau = `## ${c(l.title)}\n_id: ${l.id}${l.minutes ? ` · ~${l.minutes} phút` : ''}_${l.goal ? `\n**Mục tiêu:** ${c(l.goal)}` : ''}`;
  const than = arr(l.blocks).map((b) => khoiSangMd(b as K, o)).filter(Boolean).join('\n\n');
  return `${dau}\n\n${than}`.trim();
}

/** Phụ đề ⇒ lời giảng có mốc `[mm:ss]`. Cue có thể là {t, en} (YouTube) hoặc {t, vi?, en?} (video riêng). */
export function phuDeSangVanBan(cues: unknown, uuTienVi = true): string {
  const mm = (t: number) => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  return arr(cues)
    .map((q) => {
      const t = Number(q?.t ?? q?.start ?? 0);
      const chu = String((uuTienVi ? q?.vi ?? q?.en : q?.en ?? q?.vi) ?? q?.text ?? '').trim();
      return chu ? `[${mm(t)}] ${chu}` : '';
    })
    .filter(Boolean)
    .join('\n');
}

/** Cắt văn bản dài thành trang theo ký tự, cắt ở ranh đoạn. Trả phần + `tiep` (offset kế tiếp) hoặc null. */
export function catTrang(s: string, offset = 0, maxChars = 24_000): { text: string; tiep: number | null; tong: number } {
  const tong = s.length;
  if (offset >= tong) return { text: '', tiep: null, tong };
  let den = Math.min(tong, offset + maxChars);
  if (den < tong) {
    const cat = s.lastIndexOf('\n\n', den);
    if (cat > offset + maxChars * 0.5) den = cat;
  }
  return { text: s.slice(offset, den), tiep: den < tong ? den : null, tong };
}

/** Tìm không dấu, không hoa/thường. */
export function chuanTim(s: string): string {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}
