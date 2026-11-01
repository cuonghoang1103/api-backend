/**
 * Bộ luyện "chữa trọn đề FE" dựng THẲNG từ đề thi thật trong content/exams/DBI202-D31/D32/D3 (50 câu trắc nghiệm song ngữ,
 * đáp án + giải thích của Phòng thi): chia 5 bộ × 10 câu đúng thứ tự đề, mỗi câu kèm ảnh đề gốc. Không sửa nội dung câu hỏi
 * (đề thật) — chỉ tách EN/VI. Dùng: export default feMod('D31', 'dbi202-fe31-sp26-chua-tron-de', 'FE review · Exam 31 (SP26 FE)').
 */
import { mod, cs, q, qn, tn } from './_chung.mjs';

const tach = (html, lang) => {
  const m = String(html || '').match(new RegExp(`<div class="ml-${lang}">([\\s\\S]*?)</div>`));
  return (m ? m[1] : String(html || '')).trim();
};
const chu = (h) => String(h || '').replace(/<\/?p>/g, ' ').replace(/<br\s*\/?>/g, ' ').trim();
/** giải thích của Phòng thi nhắc "(b)" theo thứ tự phương án gốc — ở đây phương án bị xáo nên bỏ nhãn chữ cái đó */
const boNhan = (h) => chu(h).replace(/\(([a-e])\)\s*/g, '');
const huong = (s) => String(s || '').split('|||');

export async function feMod(code, slug, ten) {
  const e = (await import(`../../../exams/DBI202-${code}.mjs`)).default.exams[0];
  const qs = e.questions;
  const nhom = [];
  for (let i = 0; i < qs.length; i += 10) nhom.push(qs.slice(i, i + 10).map((x, j) => [i + j + 1, x]));
  const de = nhom.map((ds, k) => {
    const tu = ds[0][0], den = ds[ds.length - 1][0];
    const cau = ds.map(([so, x]) => {
      const en = tach(x.prompt, 'en'), vi = tach(x.prompt, 'vi');
      const anh = x.imageUrl ? `<br><img src="${x.imageUrl}" alt="Question ${so} — original paper" style="max-width:100%;border:1px solid var(--border,#ddd);border-radius:6px;margin-top:6px" loading="lazy">` : '';
      const dong = (ds2) => ds2.map((o) => huong(o.text)[0].trim());
      const gt = [boNhan(tach(x.explanation, 'en')), boNhan(tach(x.explanation, 'vi'))];
      const deCau = [`<b>Q${so}.</b> ${chu(en)}${anh}`, `<b>Câu ${so}.</b> ${chu(vi)}`];
      const ok = x.correctIndexes || [];
      if (ok.length === 1) {
        const o = dong(x.options); const dung = o[ok[0]];
        return q(`c${so}`, deCau, [dung, ...o.filter((_, i) => i !== ok[0])], gt);
      }
      return qn(`c${so}`, deCau, dong(x.options), ok, gt);
    });
    return cs({
      t: `${ten} — questions ${tu}–${den}`, k: k < 2 ? 'EASY' : 'MEDIUM', p: 12,
      kn: ['final exam review'], tag: ['fe', 'exam-review', code.toLowerCase()],
      en: `<p>Questions ${tu}–${den} of the real paper, in exam-room order (original image under each question). The FE has 50 questions in 60 minutes: aim for about 1 minute per question, then read the explanations of the ones you missed.</p>`,
      vi: `<p>Câu ${tu}–${den} của đề thật, đúng thứ tự Phòng thi (ảnh đề gốc dưới mỗi câu). FE có 50 câu trong 60 phút: tập làm khoảng 1 phút mỗi câu, rồi đọc giải thích những câu sai.</p>`,
      cau,
      gy: [['Read every option before choosing: several are "almost right".', 'Đọc hết các phương án trước khi chọn: nhiều phương án "gần đúng".'], ['For closures and keys, work it out on paper — the options list the usual mistakes.', 'Câu bao đóng và khoá: tính ra giấy — các phương án liệt kê đúng những lỗi hay gặp.']],
      lhg: [['Choosing the first option that sounds familiar.', 'Chọn phương án đầu tiên nghe quen.'], ['Skipping the "NOT" or "EXCEPT" in the question.', 'Bỏ sót chữ "NOT" hoặc "EXCEPT" trong câu hỏi.']],
      tn: [tn('final exam', 'thi cuối kỳ')],
      dangBai: 'practice', // 01/11: 'fe' không thuộc EXERCISE_KINDS ⇒ seed từ chối 15 đề
    });
  });
  return mod(slug, `${ten} — all ${qs.length} questions`, de);
}
