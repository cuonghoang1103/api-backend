/**
 * 12.5 — Đề thi thực hành có giờ: dẫn sprint 4 (agl-9-5-de-thi — bài THÊM vào khung 24/11/2026, agent agt; key 'de-thi' để không trùng
 * agl-9-5-qa-cr của Chương 9 dù cùng tiền tố agl-9 do giuSlugDuAnCuoi).
 * Kiểu đề PE: dữ liệu sprint 4 (29/03–16/04/2027) có cài sẵn lỗi: ticket 8 điểm, bản cắt theo ưu tiên làm C5 +4.4 và C2/C3/C4 thiếu việc,
 * PR chờ review 3 ngày, standup "sắp xong / không vướng" trái dữ liệu, một lời phàn nàn công khai. Lời giải CHẠY THẬT: de-thi/giai.sh
 * (scratchpad/agt/lab/ch12) — biên bản 8/8, báo cáo tuần 8/8, thư giảng viên tự đủ, hai tin trả lời 7/7.
 */
import { bang, cl, note, giai, bash, js, out, ag, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L125 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 12 · Timed exam', 'Chương 12 · Đề thi có giờ', `
<h2>${t('12.5 — Timed exam: lead sprint 4', '12.5 — Đề thi có giờ: dẫn sprint 4')}</h2>
<p class="lead">${t(
    'A practical exam in the style of a PE: 120 minutes, five tasks, the same tools, new data. It is Friday 02/04/2027, end of the first week of sprint 4 — the last sprint of iteration 3, demo on 16/04. You are C1. Set a timer before you open the data; do not open the solutions until the timer rings.',
    'Đề thi thực hành kiểu PE: 120 phút, năm câu, cùng bộ công cụ, dữ liệu mới. Hôm nay là thứ Sáu 02/04/2027, cuối tuần đầu của sprint 4 — sprint cuối của iteration 3, demo ngày 16/04. Bạn là C1. Đặt đồng hồ trước khi mở dữ liệu; chưa hết giờ thì đừng mở lời giải.')}</p>

<h3>${t('Setup (not timed)', 'Chuẩn bị (không tính giờ)')}</h3>
<ul>
  <li>${t('Node 22, git. Copy the chapter-12 lab folder (the scripts of lessons 12.1–12.4). Create <code>de-thi/du-lieu/</code> from the files below.', 'Node 22, git. Chép thư mục lab chương 12 (các script của bài 12.1–12.4). Tạo <code>de-thi/du-lieu/</code> từ các tệp dưới đây.')}</li>
  <li>${t('Every script reads the data folder from the environment variable <code>DL</code>: <code>DL=de-thi/du-lieu node nang-luc.mjs</code>. Work on a copy (e.g. <code>de-thi/bai-lam/</code>) so you can compare with the original.', 'Mọi script đọc thư mục dữ liệu từ biến môi trường <code>DL</code>: <code>DL=de-thi/du-lieu node nang-luc.mjs</code>. Làm trên bản sao (vd <code>de-thi/bai-lam/</code>) để còn so với bản gốc.')}</li>
</ul>
${giai(t('Starting data — ticket.csv', 'Dữ liệu khởi đầu — ticket.csv'), out(MA.deTicket))}
${giai(t('Starting data — nang-luc.json', 'Dữ liệu khởi đầu — nang-luc.json'), out(MA.deNangLuc))}
${giai(t('Starting data — su-kien.csv (events up to 02/04)', 'Dữ liệu khởi đầu — su-kien.csv (sự kiện tới 02/04)'), out(MA.deSuKien))}
${giai(t('Starting data — standup/2027-04-02.txt and rui-ro.csv', 'Dữ liệu khởi đầu — standup/2027-04-02.txt và rui-ro.csv'), out(MA.deStandup) + out(MA.deRuiRo))}
${note(t('<code>sprint.json</code> starts with empty lists — producing it is part of task 1. <code>hanh-dong.csv</code> is the retro log of 12.3 (R4-1…R4-3 as rewritten).', '<code>sprint.json</code> bắt đầu với danh sách rỗng — tạo nó là một phần của câu 1. <code>hanh-dong.csv</code> là sổ retro của 12.3 (R4-1…R4-3 bản đã viết lại).'))}

<h3>${t('Tasks', 'Đề bài')}</h3>
${bang(['#', t('Task', 'Yêu cầu'), t('Deliverable', 'Nộp'), t('Points', 'Điểm')], [
    ['1', t('Plan sprint 4 as it should have been planned on 29/03: capacity, per-person balance within −3…+2, no ticket ≥ 8 points (R3-2), carried-over work at its remaining size. Members whose screens are done must not sit idle — give them real work that is not someone else’s screen.', 'Lên kế hoạch sprint 4 như lẽ ra phải làm ngày 29/03: năng lực, cân từng người trong khoảng −3…+2, không ticket ≥ 8 điểm (R3-2), ticket dở tính theo phần còn lại. Người đã xong màn không được ngồi chơi — giao việc thật nhưng không phải màn của người khác.'), t('edited ticket.csv, sprint.json, can-bang output', 'ticket.csv đã sửa, sprint.json, output can-bang'), '20'],
    ['2', t('Write the planning minutes; they must pass <code>kiem-planning.mjs</code> 8/8.', 'Viết biên bản planning; phải qua <code>kiem-planning.mjs</code> 8/8.'), t('bien-ban-planning.md + output', 'bien-ban-planning.md + output'), '20'],
    ['3', t('Run the daily of 02/04. List every problem the data shows, who you talk to after the standup, and what you say — one line each.', 'Chạy daily ngày 02/04. Liệt kê mọi vấn đề dữ liệu cho thấy, sau standup nói chuyện với ai, nói gì — mỗi việc một dòng.'), t('standup output + action list; new risks in rui-ro.csv', 'output standup + danh sách việc; rủi ro mới trong rui-ro.csv'), '20'],
    ['4', t('Produce the weekly report for 29/03–02/04 (8/8) and answer the supervisor’s question of 01/04 in one message that passes <code>soat-tin-nhan.mjs</code>.', 'Sinh báo cáo tuần 29/03–02/04 (8/8) và trả lời câu hỏi ngày 01/04 của giảng viên bằng một tin qua <code>soat-tin-nhan.mjs</code>.'), t('bao-cao.md, thu-gv.txt + outputs', 'bao-cao.md, thu-gv.txt + output'), '20'],
    ['5', t('At 20:10 on 02/04, C3 complains in the team channel: "PR #57 has waited 3 days, is C4 going to review it or not, so slow". Write the public reply and the private message; both must pass <code>soat-tra-loi.mjs</code> 7/7.', '20:10 ngày 02/04, C3 phàn nàn trên kênh nhóm: "PR #57 chờ 3 ngày rồi, C4 có review không vậy, chậm quá". Viết tin trả lời công khai và tin nhắn riêng; cả hai phải qua <code>soat-tra-loi.mjs</code> 7/7.'), t('two .txt files + output', 'hai tệp .txt + output'), '20'],
  ])}

<h3>${t('Rubric', 'Tiêu chí chấm')}</h3>
${bang([t('Task', 'Câu'), t('Full marks when', 'Điểm tối đa khi'), t('Common deductions', 'Hay bị trừ')], [
    ['1', t('LF-78 split; every line within −3…+2; idle members get testing/README/demo-data tickets; no screen changes owner', 'Chia LF-78; mọi dòng trong −3…+2; người rảnh nhận ticket kiểm thử/README/dữ liệu demo; không màn nào đổi chủ'), t('−10 giving C5’s screen to C2 (LOC moves to the person who already has the most); −5 leaving C2 with 2 points', '−10 đưa màn của C5 cho C2 (LOC chuyển sang người vốn cao nhất); −5 để C2 chỉ 2 điểm')],
    ['2', t('8/8 and the goal names users and screens of the iteration-3 demo', '8/8 và mục tiêu nêu người dùng và màn của buổi demo iteration 3'), t('−5 per failed rule', '−5 mỗi luật trượt')],
    ['3', t('Finds: PR #57 waiting 3 days (reviewer named); C5 "almost done / not stuck" vs 4 days without commit; C5 late; C4 missing; C2 idle although the script says ✓', 'Tìm ra: PR #57 chờ 3 ngày (nêu tên người duyệt); C5 "sắp xong / không vướng" trái với 4 ngày không commit; C5 gửi muộn; C4 không gửi; C2 rảnh dù script báo ✓'), t('−10 missing C2 (the script cannot see it — you must)', '−10 bỏ sót C2 (script không thấy — bạn phải thấy)')],
    ['4', t('8/8; the supervisor gets a yes with the PR number and when the rest of the forecast comes', '8/8; giảng viên nhận câu trả lời "được" kèm số PR và khi nào có phần dự báo còn lại'), t('−5 answering without checking that S42 is merged', '−5 trả lời mà không kiểm S42 đã merge chưa')],
    ['5', t('7/7 both; the public one has no judgement of C4, the private one names facts, thanks, and a rule with a date', '7/7 cả hai; tin công khai không phán xét C4, tin riêng có sự việc, lời cảm ơn và một luật có ngày'), t('−10 discussing C4 in the channel', '−10 bàn chuyện C4 trên kênh chung')],
  ])}
${cl('tip', `<p>${t('<strong>Hints, one level at a time.</strong>', '<strong>Gợi ý, từng bậc.</strong>')}</p>${giai(t('Hint 1 — task 1', 'Gợi ý 1 — câu 1'), `<p>${t('Run nang-luc and can-bang on the original data first. Who is over, who is under, by how much?', 'Chạy nang-luc và can-bang trên dữ liệu gốc trước. Ai thừa, ai thiếu, bao nhiêu?')}</p>`)}${giai(t('Hint 2 — task 1', 'Gợi ý 2 — câu 1'), `<p>${t('Iteration 3 needs cross-testing, test cases, demo data and a README that runs on a clean machine (5.5). Those are tickets too.', 'Iteration 3 cần test chéo, test case, dữ liệu demo và README chạy trên máy sạch (5.5). Đó cũng là ticket.')}</p>`)}${giai(t('Hint — task 3', 'Gợi ý — câu 3'), `<p>${t('The script checks each standup against that person’s own cards. A person with no card in progress passes every check.', 'Script soát standup của mỗi người với chính các thẻ của người đó. Người không có thẻ nào đang làm thì qua mọi luật.')}</p>`)}`)}

<h3>${t('Solutions (open after the timer)', 'Lời giải (mở sau khi hết giờ)')}</h3>
${giai(t('What the original data says (before any fix)', 'Dữ liệu gốc nói gì (trước khi sửa)'), out(RA.deThiNangLuc) + `<p>${t('Team capacity is fine (30 points of work vs 38.8); four of five people are not: C5 +4.4, C2 −5.5, C3 −4.1, C4 −5.6 — and LF-78 is 8 points.', 'Năng lực nhóm thừa (30 điểm việc so với 38.8); bốn trên năm người thì không: C5 +4.4, C2 −5.5, C3 −4.1, C4 −5.6 — và LF-78 là 8 điểm.')}</p>`)}
${giai(t('Model solution — files', 'Lời giải mẫu — các tệp'), out(MA.giaiTicket) + out(MA.giaiSprint) + out(MA.giaiBb) + out(MA.giaiThu) + out(MA.giaiNhom) + out(MA.giaiRieng))}
${giai(t('Model solution — the run (de-thi/giai.sh)', 'Lời giải mẫu — chạy (de-thi/giai.sh)'), bash(MA.giaiSh) + out('$ de-thi/giai.sh\n' + RA.deThiGiai) + out(MA.giaiBaoCao) + `<p>${t(
    'Task 3 in words: (1) PR #57 — I review it tonight myself, and C4 hears privately; (2) C5 — "almost done / not stuck" with 40 lines and 4 days without a commit: pair for an hour before 21:30 tomorrow (R3-3), checkpoint PR by 06/04, otherwise LF-68 goes to stretch (R-12); (3) C4 did not post: a private question, not a public reminder — C4 opened PR #58 at 21:00, so probably just forgot; (4) C2 "free, waiting" — the script shows ✓ because C2 has no card in progress; in the fixed plan C2 starts LF-90 (cross-testing) tonight.',
    'Câu 3 bằng lời: (1) PR #57 — tối nay mình tự review, C4 được nhắn riêng; (2) C5 — "sắp xong / không vướng" với 40 dòng và 4 ngày không commit: ngồi cùng một giờ trước 21:30 mai (R3-3), mốc kiểm có PR trước 06/04, không thì LF-68 xuống dự phòng (R-12); (3) C4 không gửi standup: hỏi riêng, không nhắc công khai — C4 vừa mở PR #58 lúc 21:00, có lẽ chỉ quên; (4) C2 "rảnh, chờ việc" — script báo ✓ vì C2 không có thẻ nào đang làm; theo kế hoạch đã sửa, C2 bắt đầu LF-90 (test chéo) ngay tối nay.')}</p>`)}

<h3>${t('Extra challenge', 'Thử thách thêm')}</h3>
<ul>
  <li>${t('Extend <code>standup.mjs</code> so that a member with no card in progress or in review is flagged "no work on the board" — then rerun task 3.', 'Mở rộng <code>standup.mjs</code> để thành viên không có thẻ nào đang làm hay đang review bị cờ "không có việc trên bảng" — rồi chạy lại câu 3.')}</li>
  <li>${t('Forecast iteration 3 again on 02/04 with the sprint-4 merges so far added to the sample (12.3). Does the number move?', 'Dự báo lại iteration 3 ngày 02/04, thêm các lần merge của sprint 4 tới giờ vào mẫu (12.3). Con số có đổi không?')}</li>
</ul>
<p>${t('Next: ', 'Tiếp theo: ')}${ag('agl-9-6-quiz-tong', t('12.6 — Final quiz', '12.6 — Kiểm tra tổng'))}.</p>
`);
};

export default {
  title: '12.5 — Timed exam: lead sprint 4|||12.5 — Đề thi có giờ: dẫn sprint 4',
  slug: 'agl-9-5-de-thi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đề thực hành kiểu PE 120 phút trên dữ liệu sprint 4 có cài lỗi: lên kế hoạch lại (ticket 8 điểm, bản cắt làm C5 +4.4 và ba người thiếu việc), biên bản qua kiem-planning 8/8, daily 02/04 (PR chờ 3 ngày, "sắp xong" trái dữ liệu, người rảnh mà script không thấy), báo cáo tuần + thư giảng viên, trả lời lời phàn nàn công khai; rubric 100 điểm, gợi ý từng bậc, lời giải chạy thật (de-thi/giai.sh).',
  content: L125(true) + L125(false),
};
