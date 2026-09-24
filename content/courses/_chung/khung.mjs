/**
 * _chung/khung.mjs — dựng KHUNG cho một khoá /courses mới (24/09/2026): chương + bài + đề cương, CHƯA có bài giảng.
 *
 * Khoá dựng bằng khung để status: 'DRAFT' (người học không thấy — route công khai lọc isPublished). Mỗi bài có nội dung
 * tạm song ngữ: tiêu đề + "Bài này sẽ dạy" (chính là đề cương cho lúc soạn chi tiết theo quy trình khoá Docker/Git:
 * slide + đào sâu + 🧪/🗂/📌 + quiz 10 câu có giải thích — xem content/courses/docker/_HOP-DONG.md).
 * Khi soạn chi tiết một chương: thay phần tử trong `sections` bằng file chương thật (<slug>/sNN-*.mjs), GIỮ NGUYÊN slug bài
 * và title chương đã seed ở đây (seeder neo chương/bài bằng chúng).
 *
 *   khung(PREFIX, [
 *     ['Section 0 — …', 'Mục 0 — …', 'mô tả chương (VI)', [
 *        ['bat-dau-tai-day', 'Start here (1/2) — …', 'Bắt đầu tại đây (1/2) — …', 'ý 1 · ý 2 · ý 3'],
 *        …
 *     ]],
 *   ])
 * ⇒ sections với slug bài `${PREFIX}-${N}-${M}-${ten}` (N = số chương, M = thứ tự bài từ 1), title 'N.M — EN|||N.M — VI'.
 * Bài có ten bắt đầu bằng 'bat-dau' không đánh số trong tiêu đề; slug của chúng dùng số 8, 9 (…-0-8-bat-dau-…).
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function noiDung(n, en, vi, yRaw) {
  const y = yRaw.split(' · ').map((x) => `<li>${esc(x)}</li>`).join('');
  return `
<div class="ml-en">
<span class="eyebrow">${n === 0 ? 'Section 0' : `Chapter ${n}`} · Coming soon</span>
<h2>${esc(en)}</h2>
<p class="lead">This lesson is being written. The outline below is what it will teach — with slides, real terminal output, a hands-on exercise, key terms and a summary, like the Docker and Git courses on this site.</p>
<h3>What this lesson will cover</h3>
<ul>${y}</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">${n === 0 ? 'Mục 0' : `Chương ${n}`} · Đang soạn</span>
<h2>${esc(vi)}</h2>
<p class="lead">Bài này đang được biên soạn. Dưới đây là những gì bài sẽ dạy — kèm slide, output chạy thật, bài tập làm ngay, bảng thuật ngữ và tóm tắt, theo đúng chuẩn khoá Docker và Git trên trang này.</p>
<h3>Bài này sẽ dạy</h3>
<ul>${y}</ul>
</div>
`;
}

export function khung(prefix, chuong) {
  return chuong.map(([tEn, tVi, desc, bai], n) => {
    let m = 0, b = 7;   // bài "bat-dau" đánh số 8, 9 (không đụng số thứ tự bài dạy)
    return {
      title: `${tEn}|||${tVi}`,
      description: desc,
      lessons: bai.map(([ten, en, vi, y]) => {
        const batDau = ten.startsWith('bat-dau');
        const so = batDau ? null : `${n}.${++m}`;
        return {
          title: batDau ? `${en}|||${vi}` : `${so} — ${en}|||${so} — ${vi}`,
          slug: `${prefix}-${n}-${batDau ? ++b : m}-${ten}`,
          type: 'LESSON',
          isFreePreview: true,
          description: y.split(' · ').slice(0, 3).join(', ') + '.',
          content: noiDung(n, batDau ? en : `${so} — ${en}`, batDau ? vi : `${so} — ${vi}`, y),
        };
      }),
    };
  });
}
