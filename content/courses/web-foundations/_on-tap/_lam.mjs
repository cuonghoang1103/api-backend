/**
 * Tờ ôn trước bài kiểm tra chương (02/11/2026). Mỗi file _on-tap/<slug-quiz>.mjs export default:
 *   { bai: [[tieuDeEn, tieuDeVi, [ýEn…], [ýVi…]], …],   // mỗi bài của chương 2–4 ý
 *     bay: [[en, vi], …],                               // lỗi chương này cảnh báo
 *     hoi: [[hỏiEn, đápEn, hỏiVi, đápVi], …] }          // tự kiểm, đáp án gập trong <details>
 * onTap(du) ⇒ hai khối .ml-en / .ml-vi nối vào cuối content của bài quiz.
 */
const ul = (xs) => `<ul>${xs.map((x) => `<li>${x}</li>`).join('')}</ul>`;

export function onTap(du) {
  const ben = (lang) => {
    const en = lang === 'en';
    const bai = du.bai.map(([te, tv, ye, yv]) => `<h4>${en ? te : tv}</h4>${ul(en ? ye : yv)}`).join('');
    const bay = ul(du.bay.map(([e, v]) => (en ? e : v)));
    const hoi = du.hoi.map(([qe, ae, qv, av]) =>
      `<details class="tu-kiem"><summary>${en ? qe : qv}</summary><p>${en ? ae : av}</p></details>`).join('');
    return `<div class="ml-${lang}">` +
      `<h3>${en ? '🔁 Review sheet — read this before you start' : '🔁 Tờ ôn — đọc trước khi làm bài'}</h3>` +
      `<p>${en ? 'One short block per lesson of the chapter: the ideas the questions are built on. If a line feels unfamiliar, reopen that lesson before you answer.' : 'Mỗi bài của chương một khối ngắn: những ý mà các câu hỏi dựa vào. Dòng nào thấy lạ thì mở lại bài đó trước khi làm.'}</p>` +
      bai +
      `<h3>${en ? '⚠️ Mistakes this chapter warns about' : '⚠️ Những lỗi chương này cảnh báo'}</h3>${bay}` +
      `<h3>${en ? '🧠 Self-check — answer out loud, then open' : '🧠 Tự kiểm — trả lời thành tiếng rồi mới mở'}</h3>${hoi}` +
      `</div>`;
  };
  return `\n${ben('en')}\n${ben('vi')}\n`;
}
