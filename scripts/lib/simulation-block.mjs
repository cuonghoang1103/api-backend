/**
 * simulation-block.mjs — dựng khối "mô phỏng" chèn vào THÂN bài giảng.
 * ─────────────────────────────────────────────────────────────────────────────
 * Dùng chung cho `course-seed.mjs` (khoá CuongThai) và `academy-seed-course.mjs`
 * (49 môn FPTU). Trước đây chỉ course-seed có, nên không môn Academy nào nối
 * được với /simulation — tách ra đây để hai seeder không bao giờ lệch nhau.
 *
 * KHUNG HÌNH CHÍNH của bài học thuộc về video bài giảng của giảng viên, nên
 * khối này nằm trong thân bài, ngay sau đoạn mở đầu.
 *
 * HAI DẠNG KHỐI:
 *   1. Có `url`  → thẻ <video> (đã dựng sẵn mp4 trên R2) + link mở bản tương tác.
 *   2. Không `url` → thẻ chỉ dẫn, chỉ có link. Dùng cho kịch bản chưa dựng video:
 *      bài học vẫn có ĐƯỜNG VÀO mô phỏng thay vì phải chờ đủ video mới nối được.
 *
 * ĐƯỜNG VỀ: link luôn mang `fromCourse`/`fromLesson`, để trang /simulation dựng
 * được nút "← Quay lại bài học" trỏ đúng bài đang đọc — kể cả khi một kịch bản
 * được nhiều bài của nhiều môn cùng dùng.
 *
 * SPEC TRONG FILE NỘI DUNG (đặt cạnh `slug` của bài):
 *   simulation: {                      // hoặc simulations: [ {…}, {…} ]
 *     scenario: 'cpu-cycle',           // id kịch bản trong scenarios/index.ts
 *     options: { mode: 'pipeline' },   // tuỳ chọn — chọn sẵn nhánh của kịch bản
 *     url, poster, durationSeconds,    // tuỳ chọn — có thì render <video>
 *     caption: { en:'…', vi:'…' },
 *   }
 */

const escAttr = (v) => String(v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const escText = (v) => String(v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Tách nửa ngôn ngữ của một chuỗi song ngữ 'EN|||VI'. */
const half = (text, lang) => {
  const s = String(text ?? '');
  if (!s.includes('|||')) return s;
  const [en, vi] = s.split('|||');
  return lang === 'vi' ? (vi ?? en) : en;
};

/**
 * Đường dẫn tới kịch bản, kèm ngữ cảnh để quay về.
 *
 * `ctx` = { courseSlug, lessonSlug, lessonTitle } của BÀI ĐANG CHÈN — không
 * phải bài "chính chủ" khai trong `scenario.lesson`. Nhờ vậy CSI104 1.3 và
 * CEA201 3.1 cùng mở `cpu-cycle` nhưng mỗi bên quay về đúng chỗ của mình.
 */
function simulationHref(sim, lang, ctx = {}) {
  const sp = [];
  sp.push('scenario=' + encodeURIComponent(sim.scenario));
  for (const [k, v] of Object.entries(sim.options ?? {})) {
    if (v === undefined || v === null || v === '') continue;
    sp.push(encodeURIComponent(k) + '=' + encodeURIComponent(String(v)));
  }
  sp.push('lang=' + lang);
  if (ctx.courseSlug) sp.push('fromCourse=' + encodeURIComponent(ctx.courseSlug));
  if (ctx.lessonSlug) sp.push('fromLesson=' + encodeURIComponent(ctx.lessonSlug));
  if (ctx.lessonTitle) sp.push('fromTitle=' + encodeURIComponent(half(ctx.lessonTitle, lang)));
  // `&` trong thuộc tính href của HTML phải là `&amp;`.
  return '/simulation?' + sp.join('&amp;');
}

export function simulationBlock(sim, lang, ctx = {}) {
  const vi = lang === 'vi';
  const caption = (vi ? sim.caption?.vi : sim.caption?.en) || (vi ? 'Mô phỏng bài học' : 'Lesson simulation');
  const tag = vi ? 'Mô phỏng' : 'Simulation';
  const openLabel = sim.url
    ? (vi ? 'Mở bản tương tác' : 'Open the interactive version')
    : (vi ? 'Mở mô phỏng tương tác' : 'Open the interactive simulation');
  const link = sim.scenario
    ? '<a class="sim-open" href="' + simulationHref(sim, lang, ctx) + '" target="_blank" rel="noopener">' + openLabel + ' →</a>'
    : '';

  /* Dạng 2 — chưa có video: một thẻ chỉ dẫn gọn, không có khung <video> rỗng. */
  if (!sim.url) {
    if (!sim.scenario) return '';
    const hint = vi
      ? 'Chạy từng bước ngay trong trình duyệt, có thể tua và đổi nhánh.'
      : 'Step through it in the browser — scrub the timeline, switch branches.';
    return '<figure class="sim-card">\n' +
      '  <figcaption><span class="sim-tag">' + tag + '</span> ' + escText(caption) +
      ' <span class="sim-hint">' + hint + '</span> ' + link + '</figcaption>\n' +
      '</figure>';
  }

  /* Dạng 1 — đã dựng mp4.
     `<video controls>` có sẵn nút toàn màn hình; `playsinline` chặn iOS cướp
     video sang trình phát riêng của nó, thứ làm biến mất phần chữ đang đọc. */
  const hint = vi
    ? 'Bấm nút toàn màn hình để xem nét ở cỡ lớn.'
    : 'Use the fullscreen button to watch it full size.';
  const poster = sim.poster ? ' poster="' + escAttr(sim.poster) + '"' : '';
  return '<figure class="sim-video">\n' +
    '  <video controls playsinline preload="metadata"' + poster + ' src="' + escAttr(sim.url) + '"></video>\n' +
    '  <figcaption><span class="sim-tag">' + tag + '</span> ' + escText(caption) +
    ' <span class="sim-hint">' + hint + '</span>' + (link ? ' ' + link : '') + '</figcaption>\n' +
    '</figure>';
}

/**
 * Chèn khối vào CẢ HAI nửa ngôn ngữ của thân bài.
 *
 * Neo ngay sau `<p class="lead">…</p>` khi có — đoạn lead đặt ra câu hỏi mà
 * hoạt hình trả lời, nên clip đọc như một câu trả lời chứ không phải đồ trang
 * trí. Không có lead thì neo sau `<h2>`, cuối cùng mới là đầu nửa đó. Nội dung
 * không có vỏ `ml-*` được trả về nguyên vẹn, nên một bài viết sai định dạng
 * không bao giờ mất chữ.
 *
 * `lesson` là cả object bài học trong spec: hàm tự đọc `simulation`/`simulations`
 * và tự dựng ngữ cảnh quay về từ `slug` + `title`.
 */
export function withSimulation(content, lesson, courseSlug) {
  if (!content || !lesson) return content;

  const list = [
    ...(Array.isArray(lesson.simulations) ? lesson.simulations : []),
    ...(lesson.simulation ? [lesson.simulation] : []),
  ].filter((s) => s && (s.url || s.scenario));
  if (list.length === 0) return content;
  if (content.includes('class="sim-video"') || content.includes('class="sim-card"')) return content; // đã chèn rồi

  const ctx = { courseSlug, lessonSlug: lesson.slug, lessonTitle: lesson.title };

  return content.replace(
    /<div class="ml-(en|vi)">([\s\S]*?)<\/div>\s*(?=<div class="ml-(?:en|vi)">|$)/g,
    (whole, lang, body) => {
      const block = '\n' + list.map((s) => simulationBlock(s, lang, ctx)).filter(Boolean).join('\n') + '\n';
      const lead = body.match(/<p class="lead">[\s\S]*?<\/p>/);
      if (lead) {
        const at = lead.index + lead[0].length;
        return '<div class="ml-' + lang + '">' + body.slice(0, at) + block + body.slice(at) + '</div>';
      }
      const h2 = body.match(/<h2>[\s\S]*?<\/h2>/);
      if (h2) {
        const at = h2.index + h2[0].length;
        return '<div class="ml-' + lang + '">' + body.slice(0, at) + block + body.slice(at) + '</div>';
      }
      return '<div class="ml-' + lang + '">' + block + body + '</div>';
    }
  );
}
