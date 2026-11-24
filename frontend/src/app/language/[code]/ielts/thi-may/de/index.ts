/**
 * Mục lục đề phòng thi máy tính. Thêm đề mới:
 *   1. tạo `de/<id>.ts` (xem types.ts — quy ước `[[n]]`, `ev` nguyên văn),
 *   2. thêm MỘT dòng vào MUC_LUC + một dòng trong `TEP_DE`,
 *   3. gom vào một bộ trong `BO_DE` (Đề N đủ 4 kỹ năng — docs/ielts-lo-trinh-0-8.md mục 4.2),
 *   4. thêm đề vào `frontend/src/lib/ielts/thiMayCham.test.ts` rồi chạy
 *      `npx tsx --test frontend/src/lib/ielts/thiMayCham.test.ts` — duyệt đủ đáp án,
 *      `ev` là chuỗi con thật, đáp án có trong bài, số câu 1–40 liên tục, đáp án chuẩn ra 40/40.
 * Nội dung đề tải lười (import() theo id) ⇒ trang chọn đề không tải cả kho.
 *
 * 12/11/2026: thêm kỹ năng `noi` (Speaking, giám khảo AI) và `sangloc` (10′ sàng lọc của Đề 0 — test đầu vào);
 * Đề 0 (`sangloc-00`, `nghe-00`, `doc-00`, `viet-00`, `noi-00`, phiên soạn đề) đã đăng ký. Bộ đề tham chiếu id chưa
 * có tệp ⇒ giao diện hiện "sắp có" cho kỹ năng đó, không hỏng.
 */
import type { BoDeDu, De, KyNang, MucDe } from './types';

export const MUC_LUC: MucDe[] = [
  // Đề 0 — Test đầu vào (phiên soạn đề, 12/11/2026): sàng lọc 10′ + 4 kỹ năng bậc thang band 4.0 → 8.0.
  { id: 'sangloc-00', kyNang: 'sangloc', ten: 'Placement Test — 10-minute screening', boDe: 'Đề 0 · Test đầu vào', capDo: 'A1 → B2 (bậc thang)', phut: 10, soCau: 30,
    moTa: '25 câu ngữ pháp + từ vựng A1 → B2 · 5 câu True/False/Not Given trên đoạn đọc ngắn', dang: ['mcq', 'tfng'] },
  { id: 'nghe-00', kyNang: 'nghe', ten: 'Placement Test — Listening', boDe: 'Đề 0 · Test đầu vào', capDo: 'Band 4.0 → 8.0 (bậc thang)', phut: 30, soCau: 40,
    moTa: 'Pottery course enquiry · City farm induction & map · Museum visitor study (3 speakers) · Lecture on Roman concrete',
    dang: ['form', 'map', 'mcq', 'match-feature', 'mcq2', 'flow', 'note', 'sentence', 'table'] },
  { id: 'doc-00', kyNang: 'doc', ten: 'Placement Test — Academic Reading', boDe: 'Đề 0 · Test đầu vào', capDo: 'Band 4.0 → 8.0 (bậc thang)', phut: 60, soCau: 40,
    moTa: 'A short history of the pencil · The return of the night train · Is handwriting worth saving?',
    dang: ['sentence', 'table', 'tfng', 'heading', 'match-info', 'summary', 'ynng', 'mcq', 'mcq2', 'match-ending'] },
  { id: 'viet-00', kyNang: 'viet', ten: 'Placement Test — Academic Writing', boDe: 'Đề 0 · Test đầu vào', capDo: 'Band 4.0 → 8.0', phut: 60, soCau: 2,
    moTa: 'Task 1: time spent reading by age group (single bar chart) · Task 2: is online learning as effective as the classroom? (opinion)' },
  { id: 'noi-00', kyNang: 'noi', ten: 'Placement Test — Speaking', boDe: 'Đề 0 · Test đầu vào', capDo: 'Band 4.0 → 8.0', phut: 13, soCau: 3,
    moTa: 'Part 1: work or study · hometown · Part 2: a person you admire · Part 3: role models, fame and admiration' },
  // Đề 1 — thi cuối Tập 1 (Ngày 15), band 3.5 → 4.5 (soạn 12/11/2026). Mã tệp `-de1` vì `-01` đã là Đề 6.
  { id: 'nghe-de1', kyNang: 'nghe', ten: 'Listening — Đề 1 (thi cuối Tập 1)', boDe: 'Đề 1', capDo: 'Band 3.5 → 4.5', phut: 30, soCau: 40,
    moTa: 'Joining a public library · Bus service changes & bus station plan · Two students choose a presentation topic · Lecture on sleep',
    dang: ['form', 'note', 'mcq', 'map', 'match-feature', 'summary'] },
  { id: 'doc-de1', kyNang: 'doc', ten: 'Academic Reading — Đề 1 (thi cuối Tập 1)', boDe: 'Đề 1', capDo: 'Band 3.5 → 4.5', phut: 60, soCau: 40,
    moTa: 'The story of the traffic light · Turning the classroom upside down · The barcode: lines that changed shopping',
    dang: ['sentence', 'table', 'tfng', 'match-feature', 'flow', 'short', 'summary-box'] },
  { id: 'viet-de1', kyNang: 'viet', ten: 'Academic Writing — Đề 1 (thi cuối Tập 1)', boDe: 'Đề 1', capDo: 'Band 3.5 → 4.5', phut: 60, soCau: 2,
    moTa: 'Task 1: visitors to three city attractions, 2014–2024 (line graph) · Task 2: should students bring mobile phones to school? (opinion)' },
  { id: 'noi-de1', kyNang: 'noi', ten: 'Speaking — Đề 1 (thi cuối Tập 1)', boDe: 'Đề 1', capDo: 'Band 3.5 → 4.5', phut: 12, soCau: 3,
    moTa: 'Part 1: daily routine · family · Part 2: a place you like to go to · Part 3: places to relax, public places in cities' },
  // Đề 2 — sau Tập 2 Ngày 12, band 4.5 (soạn 12/11/2026). Chỉ dùng dạng câu đã dạy tới T2 N12.
  { id: 'nghe-de2', kyNang: 'nghe', ten: 'Listening — Đề 2 (Tập 2 · Ngày 12)', boDe: 'Đề 2', capDo: 'Band 4.5', phut: 30, soCau: 40,
    moTa: 'Booking a hotel room · Museum introduction & ground-floor plan · Two students review a group project · Lecture on honeybees',
    dang: ['form', 'table', 'mcq', 'map', 'match-feature', 'note'] },
  { id: 'doc-de2', kyNang: 'doc', ten: 'Academic Reading — Đề 2 (Tập 2 · Ngày 12)', boDe: 'Đề 2', capDo: 'Band 4.5', phut: 60, soCau: 40,
    moTa: 'The rise and fall of the plastic bag · The doctor who asked people to wash their hands · Sharing the bicycle',
    dang: ['note', 'tfng', 'heading', 'mcq', 'summary', 'short', 'match-feature', 'sentence'] },
  { id: 'viet-de2', kyNang: 'viet', ten: 'Academic Writing — Đề 2 (Tập 2 · Ngày 12)', boDe: 'Đề 2', capDo: 'Band 4.5', phut: 60, soCau: 2,
    moTa: 'Task 1: weekly consumption of five foods in 2000 and 2020 (bar chart) · Task 2: should schools teach children to cook? (discuss both views)' },
  { id: 'noi-de2', kyNang: 'noi', ten: 'Speaking — Đề 2 (Tập 2 · Ngày 12)', boDe: 'Đề 2', capDo: 'Band 4.5', phut: 12, soCau: 3,
    moTa: 'Part 1: hobbies · weather · Part 2: an object you own that is important to you · Part 3: possessions, keeping and buying things' },
  // Đề 3 — thi cuối Tập 2 (sau Ngày 24), band 5.0 (soạn 12/11/2026).
  { id: 'nghe-de3', kyNang: 'nghe', ten: 'Listening — Đề 3 (thi cuối Tập 2)', boDe: 'Đề 3', capDo: 'Band 5.0', phut: 30, soCau: 40,
    moTa: 'Enquiry about evening courses · Walking tour of an old city · Radio interview with a journalism student · Lecture on tides',
    dang: ['table', 'form', 'mcq', 'match-feature', 'mcq2', 'flow', 'note', 'sentence', 'short'] },
  { id: 'doc-de3', kyNang: 'doc', ten: 'Academic Reading — Đề 3 (thi cuối Tập 2)', boDe: 'Đề 3', capDo: 'Band 5.0', phut: 60, soCau: 40,
    moTa: 'A wheel for a new century (the London Eye) · The long road of the marathon · Why slow news matters',
    dang: ['diagram', 'sentence', 'tfng', 'match-info', 'summary', 'short', 'ynng', 'match-ending', 'mcq'] },
  { id: 'viet-de3', kyNang: 'viet', ten: 'Academic Writing — Đề 3 (thi cuối Tập 2)', boDe: 'Đề 3', capDo: 'Band 5.0', phut: 60, soCau: 2,
    moTa: 'Task 1: main source of news for adults in 2005 and 2025 (two pie charts) · Task 2: large numbers of tourists — advantages and disadvantages for local people' },
  { id: 'noi-de3', kyNang: 'noi', ten: 'Speaking — Đề 3 (thi cuối Tập 2)', boDe: 'Đề 3', capDo: 'Band 5.0', phut: 13, soCau: 3,
    moTa: 'Part 1: food · travel · Part 2: an event you attended and enjoyed · Part 3: public events, celebrations past and present' },
  // Đề 4 — giữa Tập 3 (sau Ngày 15), band 5.5 (soạn 18/11/2026).
  { id: 'nghe-de4', kyNang: 'nghe', ten: 'Listening — Đề 4 (giữa Tập 3)', boDe: 'Đề 4', capDo: 'Band 5.5', phut: 30, soCau: 40,
    moTa: 'Renting a car (US) · Nature reserve talk & map · Three speakers discuss a journal article · Lecture on how children learn language (Canadian speaker)',
    dang: ['table', 'form', 'mcq', 'map', 'match-feature', 'note', 'sentence'] },
  { id: 'doc-de4', kyNang: 'doc', ten: 'Academic Reading — Đề 4 (giữa Tập 3)', boDe: 'Đề 4', capDo: 'Band 5.5', phut: 60, soCau: 40,
    moTa: 'The mark of the criminal (fingerprints) · Cleaning up the sky (space debris) · The slow revolution (the printing press)',
    dang: ['tfng', 'table', 'short', 'heading', 'summary-box', 'mcq2', 'ynng', 'match-ending', 'mcq'] },
  { id: 'viet-de4', kyNang: 'viet', ten: 'Academic Writing — Đề 4 (giữa Tập 3)', boDe: 'Đề 4', capDo: 'Band 5.5', phut: 60, soCau: 2,
    moTa: 'Task 1: how people travelled to work in one city in 2004, 2014 and 2024 (table) · Task 2: young people leaving the countryside — problems and solutions' },
  { id: 'noi-de4', kyNang: 'noi', ten: 'Speaking — Đề 4 (giữa Tập 3)', boDe: 'Đề 4', capDo: 'Band 5.5', phut: 13, soCau: 3,
    moTa: 'Part 1: shopping · technology · Part 2: a skill that took you a long time to learn · Part 3: learning skills, practical skills and the future' },
  // Đề 5 — thi cuối Tập 3 (sau Ngày 30), band 6.0 (soạn 18/11/2026).
  { id: 'nghe-de5', kyNang: 'nghe', ten: 'Listening — Đề 5 (thi cuối Tập 3)', boDe: 'Đề 5', capDo: 'Band 6.0', phut: 30, soCau: 40,
    moTa: 'Contents insurance enquiry (AU + UK) · Community centre talk & plan · Three students plan a research project · Lecture on urban agriculture (New Zealand speaker)',
    dang: ['form', 'short', 'mcq', 'map', 'match-feature', 'mcq2', 'note', 'flow'] },
  { id: 'doc-de5', kyNang: 'doc', ten: 'Academic Reading — Đề 5 (thi cuối Tập 3)', boDe: 'Đề 5', capDo: 'Band 6.0', phut: 60, soCau: 40,
    moTa: 'The paper promise (the history of banknotes) · Seeing with sound (how bats find their way) · Words and worlds (does language shape thought?)',
    dang: ['tfng', 'sentence', 'diagram', 'match-info', 'match-feature', 'summary', 'ynng', 'mcq', 'match-ending'] },
  { id: 'viet-de5', kyNang: 'viet', ten: 'Academic Writing — Đề 5 (thi cuối Tập 3)', boDe: 'Đề 5', capDo: 'Band 6.0', phut: 60, soCau: 2,
    moTa: 'Task 1: how olive oil is produced (process diagram) · Task 2: throwing things away instead of repairing them — why, and is it a positive or negative development? (two-part question)' },
  { id: 'noi-de5', kyNang: 'noi', ten: 'Speaking — Đề 5 (thi cuối Tập 3)', boDe: 'Đề 5', capDo: 'Band 6.0', phut: 13, soCau: 3,
    moTa: 'Part 1: music · sleep · Part 2: a positive change you made in your life · Part 3: change in people\'s lives, change in society' },
  // Đề 6 (đầu Tập 4).
  { id: 'doc-01', kyNang: 'doc', ten: 'Academic Reading — Test 1', boDe: 'Đề 6', capDo: 'Band 6 → 7.5', phut: 60, soCau: 40, moTa: 'Mangroves · The shipping container · The hidden value of boredom',
    dang: ['note', 'diagram', 'tfng', 'heading', 'match-feature', 'summary-box', 'ynng', 'mcq', 'mcq2', 'sentence'] },
  { id: 'nghe-01', kyNang: 'nghe', ten: 'Listening — Test 1', boDe: 'Đề 6', capDo: 'Band 6 → 7.5', phut: 30, soCau: 40, moTa: 'Paddle club form · Market hall map · Urban heat project · Reef sounds lecture',
    dang: ['form', 'map', 'mcq', 'match-feature', 'mcq2', 'flow', 'note'] },
  { id: 'viet-01', kyNang: 'viet', ten: 'Academic Writing — Test 1', boDe: 'Đề 6', capDo: 'Band 6 → 7.5', phut: 60, soCau: 2, moTa: 'Task 1 bar chart (commuting) · Task 2 discuss both views (university purpose)' },
  { id: 'noi-06', kyNang: 'noi', ten: 'Speaking — Test 1', boDe: 'Đề 6', capDo: 'Band 6 → 7.5', phut: 13, soCau: 3,
    moTa: 'Part 1: art · neighbours · Part 2: an important decision you made · Part 3: decisions, advice, choice and technology' },
  // Đề 7 — giữa Tập 4 (sau Ngày 15), band 6.5 (soạn 18/11/2026).
  { id: 'nghe-de7', kyNang: 'nghe', ten: 'Listening — Đề 7 (giữa Tập 4)', boDe: 'Đề 7', capDo: 'Band 6.5', phut: 30, soCau: 40,
    moTa: 'Registering for a conference (US + NZ) · A new health centre & two-floor plan · Four students evaluate their project · Lecture on the reliability of memory (Irish speaker)',
    dang: ['form', 'table', 'mcq', 'map', 'match-feature', 'mcq2', 'note', 'summary'] },
  { id: 'doc-de7', kyNang: 'doc', ten: 'Academic Reading — Đề 7 (giữa Tập 4)', boDe: 'Đề 7', capDo: 'Band 6.5', phut: 60, soCau: 40,
    moTa: 'Sixty-six days (how long a habit takes to form) · The man who fooled the experts (a famous art forgery) · The fear of fewer (is a falling population a disaster?)',
    dang: ['tfng', 'table', 'short', 'heading', 'flow', 'mcq2', 'ynng', 'mcq', 'match-ending'] },
  { id: 'viet-de7', kyNang: 'viet', ten: 'Academic Writing — Đề 7 (giữa Tập 4)', boDe: 'Đề 7', capDo: 'Band 6.5', phut: 60, soCau: 2,
    moTa: 'Task 1: people living alone in four age groups, 1975–2025 (line graph with four lines) · Task 2: is it still necessary for schools to make students memorise facts? (opinion)' },
  { id: 'noi-de7', kyNang: 'noi', ten: 'Speaking — Đề 7 (giữa Tập 4)', boDe: 'Đề 7', capDo: 'Band 6.5', phut: 13, soCau: 3,
    moTa: 'Part 1: books · time management · Part 2: a rule you had to follow at school or at work · Part 3: rules for children, rules in society' },
  // Đề 8 — thi cuối Tập 4 (sau Ngày 30), band 7.0 (soạn 18/11/2026).
  { id: 'nghe-de8', kyNang: 'nghe', ten: 'Listening — Đề 8 (thi cuối Tập 4)', boDe: 'Đề 8', capDo: 'Band 7.0', phut: 30, soCau: 40,
    moTa: 'Booking a removal company (Irish + UK) · A lantern festival guide & site map · A student discusses his dissertation with his supervisor · Lecture on smart cities (New Zealand speaker)',
    dang: ['form', 'sentence', 'mcq', 'map', 'mcq2', 'match-feature', 'note', 'table'] },
  { id: 'doc-de8', kyNang: 'doc', ten: 'Academic Reading — Đề 8 (thi cuối Tập 4)', boDe: 'Đề 8', capDo: 'Band 7.0', phut: 60, soCau: 40,
    moTa: 'The view from above (archaeology from the air) · The long road to cheap sunlight (the solar cell) · The trouble with nudges (the limits of behavioural policy)',
    dang: ['match-info', 'tfng', 'summary', 'heading', 'match-feature', 'summary-box', 'ynng', 'mcq', 'match-ending'] },
  { id: 'viet-de8', kyNang: 'viet', ten: 'Academic Writing — Đề 8 (thi cuối Tập 4)', boDe: 'Đề 8', capDo: 'Band 7.0', phut: 60, soCau: 2,
    moTa: 'Task 1: international students by region of origin, 2005 and 2025, and their subjects in 2025 (bar chart + pie chart) · Task 2: taking a year off between school and university — do the advantages outweigh the disadvantages?' },
  { id: 'noi-de8', kyNang: 'noi', ten: 'Speaking — Đề 8 (thi cuối Tập 4)', boDe: 'Đề 8', capDo: 'Band 7.0', phut: 14, soCau: 3,
    moTa: 'Part 1: plants · noise · Part 2: a piece of advice from a book, video or podcast that changed a habit · Part 3: advice from the media, advice in the future' },
  // Đề 9 — Tập 5 · Ngày 8, band 7.0 → 7.5 (soạn 24/11/2026). Tốc độ thật, giọng trộn; Writing map + Problem / solution.
  { id: 'nghe-de9', kyNang: 'nghe', ten: 'Listening — Đề 9 (Tập 5 · Ngày 8)', boDe: 'Đề 9', capDo: 'Band 7.0 → 7.5', phut: 30, soCau: 40,
    moTa: 'Booking a dog into boarding kennels (Canadian + UK) · Welcome talk for new allotment holders (Australian speaker) · Two students and their tutor discuss a river fieldwork report (US + UK + Irish) · Lecture on citizen science (New Zealand speaker)',
    dang: ['form', 'note', 'mcq', 'match-feature', 'mcq2', 'flow', 'sentence'] },
  { id: 'doc-de9', kyNang: 'doc', ten: 'Academic Reading — Đề 9 (Tập 5 · Ngày 8)', boDe: 'Đề 9', capDo: 'Band 7.0 → 7.5', phut: 60, soCau: 40,
    moTa: 'The foxes of Novosibirsk (an experiment in domestication) · Silver, ships and sweet potatoes (when did globalisation begin?) · Drawing the line (what separates science from pseudoscience?)',
    dang: ['tfng', 'flow', 'sentence', 'heading', 'match-feature', 'mcq2', 'mcq', 'ynng', 'match-ending'] },
  { id: 'viet-de9', kyNang: 'viet', ten: 'Academic Writing — Đề 9 (Tập 5 · Ngày 8)', boDe: 'Đề 9', capDo: 'Band 7.0 → 7.5', phut: 60, soCau: 2,
    moTa: 'Task 1: the harbour area of a town in 1995 and today (two maps) · Task 2: a shortage of skilled manual workers — what problems does it cause, and what could be done?' },
  { id: 'noi-de9', kyNang: 'noi', ten: 'Speaking — Đề 9 (Tập 5 · Ngày 8)', boDe: 'Đề 9', capDo: 'Band 7.0 → 7.5', phut: 14, soCau: 3,
    moTa: 'Part 1: photography · celebrations · Part 2: a time when you persuaded someone to look at a decision differently · Part 3: changing opinions, persuasion and public debate' },
  // Đề 10 — Tập 5 · Ngày 16, band 7.5 (soạn 24/11/2026). (Đề 9 đặt TRƯỚC khối này, Đề 11 đặt SAU.)
  { id: 'nghe-de10', kyNang: 'nghe', ten: 'Listening — Đề 10 (Tập 5 · Ngày 16)', boDe: 'Đề 10', capDo: 'Band 7.5', phut: 30, soCau: 40,
    moTa: 'Renting a self-storage unit (US + AU) · Briefing for heritage weekend volunteers (Irish speaker) · Two students and a tutor discuss an oral history project · Lecture on the acoustics of concert halls',
    dang: ['form', 'table', 'mcq', 'match-feature', 'mcq2', 'flow', 'note', 'summary'] },
  { id: 'doc-de10', kyNang: 'doc', ten: 'Academic Reading — Đề 10 (Tập 5 · Ngày 16)', boDe: 'Đề 10', capDo: 'Band 7.5', phut: 60, soCau: 40,
    moTa: 'Reading the planet from the outside (what earthquakes reveal about the Earth\'s interior) · A language is born (Nicaraguan Sign Language) · The arithmetic of fairness (can an algorithm be unbiased?)',
    dang: ['tfng', 'diagram', 'short', 'heading', 'match-feature', 'sentence', 'ynng', 'mcq', 'summary-box'] },
  { id: 'viet-de10', kyNang: 'viet', ten: 'Academic Writing — Đề 10 (Tập 5 · Ngày 16)', boDe: 'Đề 10', capDo: 'Band 7.5', phut: 60, soCau: 2,
    moTa: 'Task 1: the public library service of one city in 2010 and 2025, and visitors\' reasons for coming in 2025 (table + pie chart) · Task 2: learning new skills throughout working life — why has this become necessary, and who should pay for it? (two-part question)' },
  { id: 'noi-de10', kyNang: 'noi', ten: 'Speaking — Đề 10 (Tập 5 · Ngày 16)', boDe: 'Đề 10', capDo: 'Band 7.5', phut: 14, soCau: 3,
    moTa: 'Part 1: colours · weekends · Part 2: a tradition in your family or community that you hope will continue · Part 3: why traditions survive or die out, traditions and the modern world' },
  // Đề 11 — Tập 5 · Ngày 24, band 8.0 (soạn 24/11/2026). Tốc độ thật + nhiễu nền dựng bằng tình huống; Writing process 2 giai đoạn + Discussion.
  { id: 'nghe-de11', kyNang: 'nghe', ten: 'Listening — Đề 11 (Tập 5 · Ngày 24)', boDe: 'Đề 11', capDo: 'Band 8.0', phut: 30, soCau: 40,
    moTa: 'Changing a ferry booking from a noisy café (Australian + Irish) · Welcome talk at a reopened lido & site plan · Two students and a tutor review a pilot survey of river life · Lecture on the history of weather forecasting',
    dang: ['form', 'table', 'mcq', 'map', 'mcq2', 'flow', 'note'] },
  { id: 'doc-de11', kyNang: 'doc', ten: 'Academic Reading — Đề 11 (Tập 5 · Ngày 24)', boDe: 'Đề 11', capDo: 'Band 8.0', phut: 60, soCau: 40,
    moTa: 'The economy in a water tank (a hydraulic model of the national economy) · The map inside the head (how the brain knows where it is) · Discovered or devised? (the invention of perspective)',
    dang: ['tfng', 'note', 'table', 'match-info', 'match-feature', 'summary', 'ynng', 'mcq', 'match-ending'] },
  { id: 'viet-de11', kyNang: 'viet', ten: 'Academic Writing — Đề 11 (Tập 5 · Ngày 24)', boDe: 'Đề 11', capDo: 'Band 8.0', phut: 60, soCau: 2,
    moTa: 'Task 1: how used plastic bottles are made into fleece jackets (process diagram in two stages) · Task 2: should museums return historical objects to their countries of origin? (discuss both views)' },
  { id: 'noi-de11', kyNang: 'noi', ten: 'Speaking — Đề 11 (Tập 5 · Ngày 24)', boDe: 'Đề 11', capDo: 'Band 8.0', phut: 14, soCau: 3,
    moTa: 'Part 1: numbers · clothes · Part 2: an achievement you did not think you were capable of · Part 3: recognising achievement, success and society' },
  // Đề 12 "Final" — thi cuối Tập 5 · Ngày 30, band 8.0 (soạn 24/11/2026). Đề tổng duyệt: Reading đủ 16 dạng, Listening đủ 12 kiểu câu của phòng thi máy.
  { id: 'nghe-de12', kyNang: 'nghe', ten: 'Listening — Đề 12 (Tập 5 · Ngày 30)', boDe: 'Đề 12', capDo: 'Band 8.0', phut: 30, soCau: 40,
    moTa: 'Hiring a canal boat for a week (New Zealand + UK) · Induction at a community darkroom & floor plan (Canadian speaker) · Two students and a tutor review four hospital sign systems (Irish + US + Australian) · Lecture on qanats, the underground water channels of Iran (US speaker)',
    dang: ['form', 'table', 'short', 'mcq', 'map', 'sentence', 'mcq2', 'match-feature', 'flow', 'note', 'diagram', 'summary'] },
  { id: 'doc-de12', kyNang: 'doc', ten: 'Academic Reading — Đề 12 (Tập 5 · Ngày 30)', boDe: 'Đề 12', capDo: 'Band 8.0', phut: 60, soCau: 40,
    moTa: 'The cure that was lost twice (scurvy and the first clinical trial) · Reading the unreadable (the decipherment of Linear B) · Keeping score (how good are experts at predicting the future?)',
    dang: ['tfng', 'note', 'table', 'flow', 'short', 'heading', 'match-info', 'match-feature', 'diagram', 'sentence', 'ynng', 'mcq', 'mcq2', 'match-ending', 'summary-box', 'summary'] },
  { id: 'viet-de12', kyNang: 'viet', ten: 'Academic Writing — Đề 12 (Tập 5 · Ngày 30)', boDe: 'Đề 12', capDo: 'Band 8.0', phut: 60, soCau: 2,
    moTa: 'Task 1: adults doing regular voluntary work by age group, 2005–2025, and the kind of work done by the youngest and oldest volunteers in 2025 (line graph + bar chart) · Task 2: should citizens have a legal right to deal with a human being rather than a machine when they use public services? (opinion)' },
  { id: 'noi-de12', kyNang: 'noi', ten: 'Speaking — Đề 12 (Tập 5 · Ngày 30)', boDe: 'Đề 12', capDo: 'Band 8.0', phut: 14, soCau: 3,
    moTa: 'Part 1: mirrors · patience · Part 2: a conversation with a stranger that you still remember · Part 3: talking to strangers, trust in society' },
];

/** id → hàm tải tệp đề (mỗi tệp một chunk). */
const TEP_DE: Record<string, () => Promise<De>> = {
  'doc-01': () => import('./doc-01').then((m) => m.DOC_01),
  'nghe-01': () => import('./nghe-01').then((m) => m.NGHE_01),
  'viet-01': () => import('./viet-01').then((m) => m.VIET_01),
  'sangloc-00': () => import('./sangloc-00').then((m) => m.SANGLOC_00),
  'nghe-00': () => import('./nghe-00').then((m) => m.NGHE_00),
  'doc-00': () => import('./doc-00').then((m) => m.DOC_00),
  'viet-00': () => import('./viet-00').then((m) => m.VIET_00),
  'noi-00': () => import('./noi-00').then((m) => m.NOI_00),
  'nghe-de1': () => import('./nghe-de1').then((m) => m.NGHE_DE1),
  'doc-de1': () => import('./doc-de1').then((m) => m.DOC_DE1),
  'viet-de1': () => import('./viet-de1').then((m) => m.VIET_DE1),
  'noi-de1': () => import('./noi-de1').then((m) => m.NOI_DE1),
  'nghe-de2': () => import('./nghe-de2').then((m) => m.NGHE_DE2),
  'doc-de2': () => import('./doc-de2').then((m) => m.DOC_DE2),
  'viet-de2': () => import('./viet-de2').then((m) => m.VIET_DE2),
  'noi-de2': () => import('./noi-de2').then((m) => m.NOI_DE2),
  'nghe-de3': () => import('./nghe-de3').then((m) => m.NGHE_DE3),
  'doc-de3': () => import('./doc-de3').then((m) => m.DOC_DE3),
  'viet-de3': () => import('./viet-de3').then((m) => m.VIET_DE3),
  'noi-de3': () => import('./noi-de3').then((m) => m.NOI_DE3),
  'nghe-de4': () => import('./nghe-de4').then((m) => m.NGHE_DE4),
  'doc-de4': () => import('./doc-de4').then((m) => m.DOC_DE4),
  'viet-de4': () => import('./viet-de4').then((m) => m.VIET_DE4),
  'noi-de4': () => import('./noi-de4').then((m) => m.NOI_DE4),
  'nghe-de5': () => import('./nghe-de5').then((m) => m.NGHE_DE5),
  'doc-de5': () => import('./doc-de5').then((m) => m.DOC_DE5),
  'viet-de5': () => import('./viet-de5').then((m) => m.VIET_DE5),
  'noi-de5': () => import('./noi-de5').then((m) => m.NOI_DE5),
  'noi-06': () => import('./noi-06').then((m) => m.NOI_06),
  'nghe-de7': () => import('./nghe-de7').then((m) => m.NGHE_DE7),
  'doc-de7': () => import('./doc-de7').then((m) => m.DOC_DE7),
  'viet-de7': () => import('./viet-de7').then((m) => m.VIET_DE7),
  'noi-de7': () => import('./noi-de7').then((m) => m.NOI_DE7),
  'nghe-de8': () => import('./nghe-de8').then((m) => m.NGHE_DE8),
  'doc-de8': () => import('./doc-de8').then((m) => m.DOC_DE8),
  'viet-de8': () => import('./viet-de8').then((m) => m.VIET_DE8),
  'noi-de8': () => import('./noi-de8').then((m) => m.NOI_DE8),
  'nghe-de9': () => import('./nghe-de9').then((m) => m.NGHE_DE9),
  'doc-de9': () => import('./doc-de9').then((m) => m.DOC_DE9),
  'viet-de9': () => import('./viet-de9').then((m) => m.VIET_DE9),
  'noi-de9': () => import('./noi-de9').then((m) => m.NOI_DE9),
  'nghe-de10': () => import('./nghe-de10').then((m) => m.NGHE_DE10),
  'doc-de10': () => import('./doc-de10').then((m) => m.DOC_DE10),
  'viet-de10': () => import('./viet-de10').then((m) => m.VIET_DE10),
  'noi-de10': () => import('./noi-de10').then((m) => m.NOI_DE10),
  'nghe-de11': () => import('./nghe-de11').then((m) => m.NGHE_DE11),
  'doc-de11': () => import('./doc-de11').then((m) => m.DOC_DE11),
  'viet-de11': () => import('./viet-de11').then((m) => m.VIET_DE11),
  'noi-de11': () => import('./noi-de11').then((m) => m.NOI_DE11),
  'nghe-de12': () => import('./nghe-de12').then((m) => m.NGHE_DE12),
  'doc-de12': () => import('./doc-de12').then((m) => m.DOC_DE12),
  'viet-de12': () => import('./viet-de12').then((m) => m.VIET_DE12),
  'noi-de12': () => import('./noi-de12').then((m) => m.NOI_DE12),
};

export function taiDe(id: string): Promise<De> | null {
  const f = TEP_DE[id];
  return f ? f() : null;
}

/** Đề có tệp thật chưa (bộ đề có thể tham chiếu id chưa soạn ⇒ "sắp có"). */
export const coDe = (id: string | undefined): id is string => !!id && id in TEP_DE;

export const TEN_KY_NANG: Record<KyNang, string> = { nghe: 'Listening', doc: 'Reading', viet: 'Writing', noi: 'Speaking', sangloc: 'Sàng lọc' };

/** Thứ tự thi thật của một bộ đề đủ: (sàng lọc) → Listening → Reading → Writing → nghỉ → Speaking. */
export const THU_TU_THI: KyNang[] = ['sangloc', 'nghe', 'doc', 'viet', 'noi'];

/**
 * Bộ đề đủ 4 kỹ năng ("Đề N", docs/ielts-lo-trinh-0-8.md mục 4.2). Đề 0 = test đầu vào (mục 4.3).
 * Đề 1 (thi cuối Tập 1) = `nghe-de1` · `doc-de1` · `viet-de1` · `noi-de1` (mã `-de1` vì `-01` đã thuộc Đề 6).
 * Đề 2 (Tập 2 · Ngày 12) = bộ `-de2`; Đề 3 (thi cuối Tập 2) = bộ `-de3` (cùng quy ước mã như Đề 1).
 * Đề 4 (giữa Tập 3, sau Ngày 15) = bộ `-de4`; Đề 5 (thi cuối Tập 3, sau Ngày 30) = bộ `-de5`.
 * Đề 6 (đầu Tập 4) = `nghe-01` · `doc-01` · `viet-01` · `noi-06`.
 * Đề 7 (giữa Tập 4, sau Ngày 15) = bộ `-de7`; Đề 8 (thi cuối Tập 4, sau Ngày 30) = bộ `-de8`.
 * Đề 9 (Tập 5 · Ngày 8) = bộ `-de9`.
 * Đề 10 (Tập 5 · Ngày 16, band 7.5) = bộ `-de10` (`bo-10`). Giữ BO_DE tăng dần theo `so`.
 * Đề 11 (Tập 5 · Ngày 24, band 8.0) = bộ `-de11` (`bo-11`).
 * Đề 12 "Final" (thi cuối Tập 5 · Ngày 30, band 8.0) = bộ `-de12` (`bo-12`).
 */
export const BO_DE: BoDeDu[] = [
  {
    id: 'bo-00', so: 0, ten: 'Test đầu vào', capDo: 'Band 4.0 → 8.0 (bậc thang)', viTri: 'Làm TRƯỚC khi học — xếp đúng tập + ngày',
    sangLoc: 'sangloc-00', nghe: 'nghe-00', doc: 'doc-00', viet: 'viet-00', noi: 'noi-00',
  },
  {
    id: 'bo-01', so: 1, ten: 'Đề 1', capDo: 'Band 3.5 → 4.5', viTri: 'Thi cuối Tập 1 (Ngày 15)',
    nghe: 'nghe-de1', doc: 'doc-de1', viet: 'viet-de1', noi: 'noi-de1',
  },
  {
    id: 'bo-02', so: 2, ten: 'Đề 2', capDo: 'Band 4.5', viTri: 'Giữa Tập 2 (sau Ngày 12)',
    nghe: 'nghe-de2', doc: 'doc-de2', viet: 'viet-de2', noi: 'noi-de2',
  },
  {
    id: 'bo-03', so: 3, ten: 'Đề 3', capDo: 'Band 5.0', viTri: 'Thi cuối Tập 2 (sau Ngày 24)',
    nghe: 'nghe-de3', doc: 'doc-de3', viet: 'viet-de3', noi: 'noi-de3',
  },
  {
    id: 'bo-04', so: 4, ten: 'Đề 4', capDo: 'Band 5.5', viTri: 'Giữa Tập 3 (sau Ngày 15)',
    nghe: 'nghe-de4', doc: 'doc-de4', viet: 'viet-de4', noi: 'noi-de4',
  },
  {
    id: 'bo-05', so: 5, ten: 'Đề 5', capDo: 'Band 6.0', viTri: 'Thi cuối Tập 3 (sau Ngày 30)',
    nghe: 'nghe-de5', doc: 'doc-de5', viet: 'viet-de5', noi: 'noi-de5',
  },
  {
    id: 'bo-06', so: 6, ten: 'Đề 6', capDo: 'Band 6.0 → 7.5', viTri: 'Đầu Tập 4 (Ngày 1)',
    nghe: 'nghe-01', doc: 'doc-01', viet: 'viet-01', noi: 'noi-06',
  },
  {
    id: 'bo-07', so: 7, ten: 'Đề 7', capDo: 'Band 6.5', viTri: 'Giữa Tập 4 (sau Ngày 15)',
    nghe: 'nghe-de7', doc: 'doc-de7', viet: 'viet-de7', noi: 'noi-de7',
  },
  {
    id: 'bo-08', so: 8, ten: 'Đề 8', capDo: 'Band 7.0', viTri: 'Thi cuối Tập 4 (sau Ngày 30)',
    nghe: 'nghe-de8', doc: 'doc-de8', viet: 'viet-de8', noi: 'noi-de8',
  },
  {
    id: 'bo-09', so: 9, ten: 'Đề 9', capDo: 'Band 7.0 → 7.5', viTri: 'Tập 5 · Ngày 8',
    nghe: 'nghe-de9', doc: 'doc-de9', viet: 'viet-de9', noi: 'noi-de9',
  },
  {
    id: 'bo-10', so: 10, ten: 'Đề 10', capDo: 'Band 7.5', viTri: 'Tập 5 · Ngày 16',
    nghe: 'nghe-de10', doc: 'doc-de10', viet: 'viet-de10', noi: 'noi-de10',
  },
  {
    id: 'bo-11', so: 11, ten: 'Đề 11', capDo: 'Band 8.0', viTri: 'Tập 5 · Ngày 24',
    nghe: 'nghe-de11', doc: 'doc-de11', viet: 'viet-de11', noi: 'noi-de11',
  },
  {
    id: 'bo-12', so: 12, ten: 'Đề 12', capDo: 'Band 8.0', viTri: 'Thi cuối Tập 5 (Ngày 30)',
    nghe: 'nghe-de12', doc: 'doc-de12', viet: 'viet-de12', noi: 'noi-de12',
  },
];

/** id các đề (theo kỹ năng) của một bộ — chỉ những kỹ năng có khai. */
export function deCuaBo(b: BoDeDu): { kyNang: KyNang; id: string }[] {
  const ds: { kyNang: KyNang; id: string }[] = [];
  if (b.sangLoc) ds.push({ kyNang: 'sangloc', id: b.sangLoc });
  if (b.nghe) ds.push({ kyNang: 'nghe', id: b.nghe });
  if (b.doc) ds.push({ kyNang: 'doc', id: b.doc });
  if (b.viet) ds.push({ kyNang: 'viet', id: b.viet });
  if (b.noi) ds.push({ kyNang: 'noi', id: b.noi });
  return ds;
}

/** Bộ chứa một đề (để thẻ đề hiện "Đề 6"). */
export const boCuaDe = (deId: string): BoDeDu | undefined => BO_DE.find((b) => deCuaBo(b).some((d) => d.id === deId));
