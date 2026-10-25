/**
 * SWR302 · Luyện thi PE — Đề 25 (SU26, "AI-Powered Mental Health Support Platform"), đề PE mới nhất, chữa trọn trong loạt
 * MỘT VIDEO 42 phút / MỘT bài (25/10/2026, luật chủ kênh ~/Documents/video-bai-giang/LUAT-VIDEO-CHUA-DE.md).
 * Phòng thi: content/exams/SWR302-PE25.mjs — đề, lời giải mẫu song ngữ, rubric lấy THẲNG từ đó (một nguồn sự thật).
 * 7 phần swr-pe25-{0,1,2,3a,3b,4a,4b} cùng slugWeb `swr302-pe25-su26-chua-tron-de`, ghép bằng xuat/ghep-phan.mts (bản -tron),
 * video gắn qua content/course-videos/software-requirements.mjs (track VI/R2).
 * Mục này đặt CUỐI danh sách section của SWR302.mjs: exam_chapter_map lưu sortOrder của section ⇒ chèn giữa sẽ làm lệch
 * chương của mọi câu FE gắn sau đó.
 */
import PE25 from '../../exams/SWR302-PE25.mjs';

const DE = PE25.exams[0];
const Q = DE.questions; // [Q1 bìa SRS, Q2 context, Q3 use case, Q4 state]
const LINK = (slug, t) => `<a href="/courses/software-requirements/learn?lessonSlug=${slug}">${t}</a>`;
const tach = (s, en) => String(s).split('|||')[en ? 0 : 1] ?? String(s);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const giaiMa = (s) => String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
/** Trang bài giảng chỉ vẽ `code.language-mermaid` (LearnPageClient), Phòng thi dùng `<pre class="mermaid">` ⇒ đổi khuôn. */
const mermaid = (html) => String(html).replace(/<pre class="mermaid">([\s\S]*?)<\/pre>/g, (_, m) => `<pre><code class="language-mermaid">${esc(giaiMa(m))}</code></pre>`);
/** Lấy khối ml-en / ml-vi của một đoạn HTML song ngữ (không có khối ⇒ trả nguyên). */
const khoi = (html, en) => {
  const m = String(html).match(new RegExp(`<div class="ml-${en ? 'en' : 'vi'}">([\\s\\S]*?)</div>(?=\\s*<div class="ml-|\\s*$)`));
  return m ? m[1] : String(html);
};
const anh = (k, en) => `<div class="anh-slide"><img src="${Q[k].imageUrl}" alt="SWR302 PE25 (SU26) — original paper, question ${k + 1}" loading="lazy" />` +
  `<p class="chu-thich">📄 <strong>PE25 · SU26</strong> — ${en ? `original paper, question ${k + 1}` : `ảnh đề gốc, câu ${k + 1}`}</p></div>`;
const rubric = (k, en) => `<div class="table-wrap"><table><thead><tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Points' : 'Điểm'}</th></tr></thead><tbody>` +
  Q[k].rubric.map((r) => `<tr><td>${tach(r.criterion, en)}</td><td>${r.maxScore}</td></tr>`).join('') + '</tbody></table></div>';
const PHONG = (en) => en
  ? '<div class="callout">🧪 <strong>Practise it timed:</strong> <a href="/exam?course=SWR302">Exam room</a> → SWR302 → <strong>"Practical Exam Đề 25 (SU26)"</strong>. Download the paper and the Word template there, set a 90-minute timer, and only compare with this lesson afterwards.</div>'
  : '<div class="callout">🧪 <strong>Luyện có bấm giờ:</strong> <a href="/exam?course=SWR302">Phòng thi</a> → SWR302 → <strong>"Đề thi thực hành số 25 (SU26)"</strong>. Tải đề + template Word ở đó, bấm giờ 90 phút, làm xong mới so với bài này.</div>';

/** Mốc của video ghép (mo-ta-chuong.txt của 27-25-0-pe25-mo-dau-tron, 42:23). */
const MOC = [
  ['0:00', 'Reading the paper, rubric & timing', 'Đọc đề trên ảnh gốc, rubric & chia giờ'],
  ['8:29', 'Q1 — the SRS cover page & the template', 'Câu 1 — trang bìa SRS & cách dùng template'],
  ['13:07', 'Q2 — the context diagram step by step', 'Câu 2 — sơ đồ ngữ cảnh vẽ từng bước'],
  ['19:04', 'Q3 (1) — actors & use cases', 'Câu 3 (1) — actor & use case'],
  ['24:57', 'Q3 (2) — include, extend & the two tables', 'Câu 3 (2) — include, extend & hai bảng template'],
  ['30:12', 'Q4 (1) — what a state machine is (new in SU26)', 'Câu 4 (1) — sơ đồ trạng thái là gì (dạng mới SU26)'],
  ['36:18', 'Q4 (2) — drawing the 8 states & the state table', 'Câu 4 (2) — vẽ 8 trạng thái & bảng State'],
];
const mocHtml = (en) => `<ul>${MOC.map(([t, e, v], i) => `<li><b>${t}</b> — ${en ? `Part ${i + 1}` : `Phần ${i + 1}`}: ${en ? e : v}</li>`).join('')}</ul>`;

/** Luật B.0 (25/10): mỗi đề = MỘT video, MỘT bài ⇒ mỗi phần chỉ trả thân HTML { en, vi }, bài web ghép lại. */
const trang = ({ h2En, h2Vi, leadEn, leadVi, thanEn, thanVi }) => ({
  en: `<h3>${h2En}</h3>\n<p>${leadEn}</p>\n${thanEn}`,
  vi: `<h3>${h2Vi}</h3>\n<p>${leadVi}</p>\n${thanVi}`,
});

/** Bài Qk: ảnh câu gốc → đề (song ngữ) → lời giải mẫu → rubric → chỗ video làm khác lời giải mẫu (nếu có). */
const cau = (k, { titleEn, titleVi, phut, leadEn, leadVi, ghiChuEn = [], ghiChuVi = [] }) => trang({
    h2En: titleEn, h2Vi: titleVi, leadEn: `${leadEn} 🎬 In the video from ${phut}.`, leadVi: `${leadVi} 🎬 Trong video từ ${phut}.`,
    thanEn: `${anh(k - 1, true)}
<h3>The question</h3>${khoi(Q[k - 1].prompt, true)}
<h3>Model answer</h3>${mermaid(khoi(Q[k - 1].sampleSolution, true))}
<h3>Rubric (${Q[k - 1].points} points)</h3>${rubric(k - 1, true)}
${ghiChuEn.length ? `<div class="callout warn"><strong>Where the video is stricter than the model answer</strong><ul>${ghiChuEn.map((x) => `<li>${x}</li>`).join('')}</ul></div>` : ''}`,
    thanVi: `${anh(k - 1, false)}
<h3>Đề bài</h3>${khoi(Q[k - 1].prompt, false)}
<h3>Lời giải mẫu</h3>${mermaid(khoi(Q[k - 1].sampleSolution, false))}
<h3>Thang chấm (${Q[k - 1].points} điểm)</h3>${rubric(k - 1, false)}
${ghiChuVi.length ? `<div class="callout warn"><strong>Chỗ video làm chặt hơn lời giải mẫu</strong><ul>${ghiChuVi.map((x) => `<li>${x}</li>`).join('')}</ul></div>` : ''}`,
});

const LEAD_EN = 'The newest SWR302 practical paper (Summer 2026): 90 minutes, 10 points, four questions answered in the official Word template — an SRS cover page (0.5), a context diagram (2.5), a use case diagram with two description tables (4.0) and — <b>new in SU26, replacing the ERD of every earlier paper</b> — a UML state transition diagram (3.0). One video (42 min) solves the whole paper: it reads every question on the original image, then draws and fills each answer step by step.';
const LEAD_VI = 'Đề thực hành SWR302 mới nhất (Summer 2026): 90 phút, 10 điểm, bốn câu làm trong template Word của đề — trang bìa SRS (0.5), sơ đồ ngữ cảnh (2.5), sơ đồ use case kèm hai bảng mô tả (4.0) và — <b>mới ở SU26, thay cho ERD của mọi đề trước</b> — sơ đồ chuyển trạng thái UML (3.0). Một video (42 phút) chữa trọn đề: đọc từng câu trên ảnh gốc, rồi vẽ và điền từng câu theo từng bước.';

const P0 = trang({
    h2En: 'Reading the paper: actors, the four questions, rubric & timing', h2Vi: 'Đọc đề: tác nhân, bốn câu, thang chấm & chia giờ',
    leadEn: 'Every paragraph of the context is read on the original image, separating what is outside the system from what is inside. 🎬 In the video from 0:00.',
    leadVi: 'Đọc từng đoạn bối cảnh trên ảnh gốc, tách cái gì ở ngoài hệ thống và cái gì ở trong. 🎬 Trong video từ 0:00.',
    thanEn: `${anh(0, true)}
<h3>Outside vs inside the system</h3>
<ul><li><b>External actors (6):</b> User · Counselor · Content management team · Administrator · External calendar service · Emergency services API.</li>
<li><b>Inside the system — never actors:</b> the AI chatbot / companion, the emotion-recognition and crisis-detection engine, the recommendation logic. They are what the platform <i>is</i>, so they live inside the circle of Q2 and the boundary of Q3.</li></ul>
<h3>The four questions</h3>
<div class="table-wrap"><table><thead><tr><th>#</th><th>Task</th><th>Points</th><th>Suggested time</th></tr></thead><tbody>
<tr><td>—</td><td>Read the paper, underline actors and data</td><td>—</td><td>5 min</td></tr>
<tr><td>Q1</td><td>Fill the 4 placeholders of the SRS cover page</td><td>${Q[0].points}</td><td>3 min</td></tr>
<tr><td>Q2</td><td>Context diagram — system as one bubble, every external actor, labelled data flows</td><td>${Q[1].points}</td><td>15 min</td></tr>
<tr><td>Q3</td><td>Use case diagram + Actor table + Use case table (UC-01…)</td><td>${Q[2].points}</td><td>30 min</td></tr>
<tr><td>Q4</td><td>State transition diagram of the <i>User Mental Health Case</i>, ≥ 5 states, <code>event [guard] / action</code>, state table</td><td>${Q[3].points}</td><td>27 min</td></tr>
<tr><td>—</td><td>Check: actor names match between Q2 and Q3, tables complete, template hints removed</td><td>—</td><td>10 min</td></tr>
</tbody></table></div>
<h3>Traps</h3>
<ul><li>Drawing the AI chatbot or the crisis engine as an actor.</li>
<li>Forgetting the two external systems: the calendar service (appointments) and the emergency services API (crisis escalation).</li>
<li>Q4: drawing a flowchart (steps someone does) instead of states (conditions the case is in). A state is a noun or adjective — <i>At-Risk</i>, <i>Resolved</i>; the arrow carries the event.</li></ul>`,
    thanVi: `${anh(0, false)}
<h3>Bên ngoài và bên trong hệ thống</h3>
<ul><li><b>Tác nhân bên ngoài (6):</b> User · Counselor (chuyên viên tư vấn) · Nhóm quản lý nội dung · Quản trị viên · Dịch vụ lịch bên ngoài · API dịch vụ cấp cứu.</li>
<li><b>Bên trong hệ thống — không bao giờ là tác nhân:</b> chatbot / AI đồng hành, bộ nhận diện cảm xúc và phát hiện khủng hoảng, phần gợi ý chương trình. Chúng chính là nền tảng, nên nằm trong vòng tròn của câu 2 và trong khung hệ thống của câu 3.</li></ul>
<h3>Bốn câu của đề</h3>
<div class="table-wrap"><table><thead><tr><th>#</th><th>Việc phải làm</th><th>Điểm</th><th>Thời gian gợi ý</th></tr></thead><tbody>
<tr><td>—</td><td>Đọc đề, gạch chân tác nhân và dữ liệu</td><td>—</td><td>5 phút</td></tr>
<tr><td>Câu 1</td><td>Điền 4 chỗ trống của trang bìa SRS</td><td>${Q[0].points}</td><td>3 phút</td></tr>
<tr><td>Câu 2</td><td>Sơ đồ ngữ cảnh — hệ thống là một hình tròn, đủ tác nhân ngoài, luồng dữ liệu có nhãn</td><td>${Q[1].points}</td><td>15 phút</td></tr>
<tr><td>Câu 3</td><td>Sơ đồ use case + bảng Actor + bảng Use case (UC-01…)</td><td>${Q[2].points}</td><td>30 phút</td></tr>
<tr><td>Câu 4</td><td>Sơ đồ chuyển trạng thái của <i>User Mental Health Case</i>, ≥ 5 trạng thái, nhãn <code>event [guard] / action</code>, bảng mô tả trạng thái</td><td>${Q[3].points}</td><td>27 phút</td></tr>
<tr><td>—</td><td>Soát: tên tác nhân câu 2 và câu 3 khớp nhau, bảng đủ dòng, đã xoá dòng chữ hướng dẫn của template</td><td>—</td><td>10 phút</td></tr>
</tbody></table></div>
<h3>Bẫy</h3>
<ul><li>Vẽ chatbot AI hoặc bộ phát hiện khủng hoảng thành tác nhân.</li>
<li>Quên hai hệ thống bên ngoài: dịch vụ lịch (đặt hẹn) và API cấp cứu (chuyển ca khẩn cấp).</li>
<li>Câu 4: vẽ lưu đồ (các bước ai đó làm) thay vì trạng thái (tình trạng của ca). Trạng thái là danh từ/tính từ — <i>At-Risk</i>, <i>Resolved</i>; mũi tên mới mang sự kiện.</li></ul>`,
});

const PHAN = [
  P0,
  cau(1, {
    titleEn: 'Q1: the SRS cover page & using the template', titleVi: 'Câu 1: trang bìa SRS & cách dùng template',
    phut: '8:29',
    leadEn: 'The four placeholders of the cover page, what each one means, and how to work in the Word template (where diagrams go, which hint text to delete).',
    leadVi: 'Bốn chỗ cần điền ở trang bìa, mỗi chỗ nghĩa là gì, và cách làm trong template Word (dán sơ đồ vào đâu, xoá dòng hướng dẫn nào).',
  }),
  cau(2, {
    titleEn: 'Q2: the context diagram step by step', titleVi: 'Câu 2: sơ đồ ngữ cảnh vẽ từng bước',
    phut: '13:07',
    leadEn: 'The whole platform as one process, the six external entities, and a labelled data flow for every interaction the paper describes.',
    leadVi: 'Cả nền tảng là một tiến trình, sáu thực thể bên ngoài, và một luồng dữ liệu có nhãn cho mỗi tương tác đề mô tả.',
  }),
  cau(3, {
    titleEn: 'Q3: use case diagram, include / extend & the two template tables', titleVi: 'Câu 3: sơ đồ use case, include / extend & hai bảng template',
    phut: '19:04',
    leadEn: 'Actors taken from Q2, finding use cases as user goals, drawing the system boundary, purposeful «include» / «extend», then the Actor and Use case tables.',
    leadVi: 'Tác nhân lấy từ câu 2, tìm use case theo mục tiêu người dùng, vẽ khung hệ thống, «include» / «extend» có chủ đích, rồi điền bảng Actor và bảng Use case.',
    ghiChuEn: [
      'UC-11 Book Appointment is linked to the User and the External Calendar Service only (counselor availability comes from the calendar), to avoid crossing lines; the model answer also links the Counselor — both are accepted.',
      'Log In is drawn once with a note "every use case except UC-01 «include» UC-02" instead of four representative arrows — same meaning, cleaner diagram.',
    ],
    ghiChuVi: [
      'UC-11 Book Appointment chỉ nối với User và Dịch vụ lịch bên ngoài (lịch rảnh của counselor lấy từ dịch vụ lịch) để khỏi chéo dây; lời giải mẫu nối thêm Counselor — cả hai cách đều được.',
      'Log In vẽ một lần kèm ghi chú "mọi use case trừ UC-01 «include» UC-02" thay cho bốn mũi tên đại diện — cùng nghĩa, sơ đồ gọn hơn.',
    ],
  }),
  cau(4, {
    titleEn: 'Q4: the state transition diagram (new in SU26)', titleVi: 'Câu 4: sơ đồ chuyển trạng thái (dạng mới SU26)',
    phut: '30:12',
    leadEn: 'What a UML state machine is (with an everyday order example), how it differs from a flowchart and an activity diagram, the notation <code>event [guard] / action</code>, then the 8-state User Mental Health Case and its state table.',
    leadVi: 'Sơ đồ trạng thái UML là gì (qua ví dụ đơn hàng quen thuộc), khác lưu đồ và activity diagram ở đâu, ký pháp <code>event [guard] / action</code>, rồi vẽ 8 trạng thái của User Mental Health Case và bảng mô tả trạng thái.',
    ghiChuEn: [
      'Crisis → Escalated to Emergency: the model answer gives only a guard, no event, which breaks its own <code>event [guard] / action</code> rule. The video labels it <code>alert timeout [no counselor] / call Emergency API</code>.',
      'Resolved → final: the model answer puts a second event ("user closes account") in the action slot; the video uses just <i>case archived</i>.',
      'Escalated to Counselor → Active Program is left out to keep the diagram readable: cases finish through Resolved, and a relapse returns to At-Risk. Every requirement of the question is still met.',
    ],
    ghiChuVi: [
      'Crisis → Escalated to Emergency: lời giải mẫu chỉ ghi điều kiện, không có sự kiện — trái chính quy tắc <code>event [guard] / action</code> đề yêu cầu. Video ghi <code>alert timeout [no counselor] / call Emergency API</code>.',
      'Resolved → kết thúc: lời giải mẫu nhét sự kiện thứ hai ("user closes account") vào chỗ hành động; video chỉ ghi <i>case archived</i>.',
      'Bỏ mũi tên Escalated to Counselor → Active Program cho sơ đồ dễ đọc: ca kết thúc qua Resolved, tái phát thì quay về At-Risk. Vẫn đủ mọi yêu cầu của đề.',
    ],
  }),
];

const lessons = [{
  title: 'PE review · Paper 25 (SU26, Mental Health Platform) — full walkthrough in one video|||Chữa trọn đề PE25 (SU26 · Mental Health Platform) — một video',
  slug: 'swr302-pe25-su26-chua-tron-de',
  type: 'VIDEO',
  description: 'Chữa trọn đề PE SWR302 mới nhất (SU26) trong một video 42 phút có mốc: đọc đề trên ảnh gốc, trang bìa SRS, sơ đồ ngữ cảnh, use case + hai bảng, sơ đồ chuyển trạng thái (dạng mới thay ERD). Lời giải và rubric khớp Phòng thi.',
  content: `
<div class="ml-en">
<span class="eyebrow">PE practice · real paper, added by this site</span>
<h2>PE Paper 25 (SU26) — AI-Powered Mental Health Support Platform</h2>
<p class="lead">${LEAD_EN}</p>
<h3>Chapters in the video</h3>
${mocHtml(true)}
${PHAN.map((p) => p.en).join('\n')}
${PHONG(true)}
</div>
<div class="ml-vi">
<span class="eyebrow">Luyện thi PE · đề thật, phần web tự thêm</span>
<h2>Đề PE 25 (SU26) — Nền tảng hỗ trợ sức khoẻ tinh thần dùng AI</h2>
<p class="lead">${LEAD_VI}</p>
<h3>Các mốc trong video</h3>
${mocHtml(false)}
${PHAN.map((p) => p.vi).join('\n')}
${PHONG(false)}
</div>`,
}];

export default {
  title: '🎬 PE practice — real papers solved on video|||🎬 Luyện thi PE — chữa đề thực hành thật bằng video',
  description: 'Mục video tự thêm: mỗi đề PE thật là MỘT video chữa trọn có mốc — đọc đề trên ảnh gốc, trang bìa SRS, sơ đồ ngữ cảnh, use case, câu 4 (sơ đồ trạng thái ở SU26, ERD ở SP26). Đề mới nhất trước: PE25 (SU26). Lời giải và rubric khớp Phòng thi.',
  lessons,
};
