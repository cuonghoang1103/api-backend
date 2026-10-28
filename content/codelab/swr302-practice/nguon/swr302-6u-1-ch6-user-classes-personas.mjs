/**
 * SWR302 · 2.7 — User classes and personas (Wiegers Ch.6 slides 1–9).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'User classes 1 — favored, disfavored or ignored?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Wiegers: some user classes are <b>favored</b> (their needs come first because they matter most to the business objectives), some are <b>disfavored</b> (you do not want them to use the product — for legal, security or safety reasons) and some may be <b>ignored</b> (the team decides not to design for them). Classify the user classes of an online exam system.</p>', vi: '<p>Wiegers: có lớp người dùng <b>ưu tiên</b> (nhu cầu được đặt trước vì quan trọng nhất với mục tiêu), <b>không mong muốn</b> (không muốn họ dùng sản phẩm — vì pháp lý, bảo mật, an toàn) và <b>bỏ qua</b> (đội quyết định không thiết kế cho họ). Phân loại lớp người dùng của hệ thống thi trực tuyến.</p>' },
  cot: 'Kind', luaChon: ['Favored', 'Disfavored', 'Ignored'],
  hang: [
    ['Students who take the exam.', 'Favored'],
    ['People who try to sit the exam for someone else.', 'Disfavored'],
    ['Lecturers who create and grade the exams.', 'Favored'],
    ['Alumni who want to browse old exams — the faculty decided not to support them.', 'Ignored'],
    ['Students who try to open other students’ answers.', 'Disfavored'],
  ],
  giaiThich: '<p>Favored classes drive decisions; disfavored classes lead to security requirements (identity checks, access control); ignored classes are a conscious scope decision, written down so nobody builds for them by accident.</p>',
  goiY: ['Không mong muốn ≠ bỏ qua: lớp không mong muốn sinh ra yêu cầu bảo mật để CHẶN họ.', 'Bỏ qua là quyết định phạm vi có ghi lại.'],
  loiHayGap: ['Coi người gian lận là "ignored" — họ là disfavored, phải chặn.', 'Không ghi lại lớp bị bỏ qua.'],
  thuatNgu: tn('userClass'),
  khaiNiem: ['favored / disfavored user classes'],
});

const E2 = tracNghiem({
  tieuDe: 'User classes 2 — personas',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>A <b>persona</b> is a description of a hypothetical, generic person who represents a user class: a name, a photo, background, goals, frustrations, skills, a typical day. Personas help the team think about real people instead of "the user".</p>', vi: '<p><b>Persona</b> là mô tả một người giả định, điển hình, đại diện cho một lớp người dùng: tên, ảnh, hoàn cảnh, mục tiêu, khó chịu, kỹ năng, một ngày điển hình. Persona giúp đội nghĩ về người thật thay vì "người dùng" chung chung.</p>' },
  cau: [
    { en: 'A persona represents…', vi: 'Một persona đại diện cho…', lc: [['a', 'one real customer the team interviewed'], ['b', 'a user class, through a believable fictional person'], ['c', 'the whole market'], ['d', 'the product owner']], dap: 'b', giai: ['A persona is a stand-in for a user class.', 'Persona đứng thay cho một lớp người dùng.'] },
    { en: 'Which detail is most useful in a persona?', vi: 'Chi tiết nào hữu ích nhất trong persona?', lc: [['a', 'Favourite colour'], ['b', 'Goals and frustrations related to the product'], ['c', 'Shoe size'], ['d', 'Zodiac sign']], dap: 'b', giai: ['Goals and pain points drive requirements.', 'Mục tiêu và điểm đau dẫn tới yêu cầu.'] },
    { en: 'Can a persona replace talking to real users?', vi: 'Persona có thay được việc nói chuyện với người dùng thật không?', lc: [['a', 'Yes'], ['b', 'No — personas complement, not replace, real user representatives'], ['c', 'Only on agile projects'], ['d', 'Only for small projects']], dap: 'b', giai: ['Personas come from research and are validated with real users.', 'Persona đến từ nghiên cứu và được kiểm với người dùng thật.'] },
  ],
  goiY: ['Persona = một người hư cấu đại diện cho lớp người dùng.', 'Chi tiết hữu ích là chi tiết ảnh hưởng tới yêu cầu.'],
  loiHayGap: ['Viết persona như một hồ sơ cá nhân đầy chi tiết vô ích.', 'Dùng persona thay cho phỏng vấn người dùng thật.'],
  giaiThich: '<p>Answers: b · b · b.</p>',
  thuatNgu: tn('persona', 'userClass'),
  khaiNiem: ['personas'],
});

const E3 = baiJs({
  tieuDe: 'User classes 3 — write a persona for a user class',
  doKho: 'MEDIUM', phut: 10,
  moTa: { en: '<p>The online exam system has the user class <b>Proctor</b>: staff who watch 30–60 students taking an exam remotely, raise flags on suspicious behaviour and must react within one minute. Write a persona for this class in <code>PERSONA</code>: <code>name, userClass, age, background, goals[] (≥2), frustrations[] (≥2), techSkill ("low" | "medium" | "high"), quote</code>.</p>', vi: '<p>Hệ thống thi trực tuyến có lớp người dùng <b>Proctor</b> (giám thị): cán bộ giám sát 30–60 sinh viên thi từ xa, gắn cờ hành vi đáng ngờ và phải phản ứng trong một phút. Viết persona cho lớp này trong <code>PERSONA</code>.</p>' },
  yeuCau: [{ en: 'Goals and frustrations must be about proctoring an online exam.', vi: 'Mục tiêu và khó chịu phải nói về việc giám sát thi trực tuyến.' }],
  viDu: [{ input: "userClass: 'Proctor'", output: 'the persona represents the Proctor class', explanation: 'A persona always belongs to one user class.|||Persona luôn thuộc một lớp người dùng.' }],
  tep: { 'persona.js': [
    "const PERSONA = { name: '', userClass: 'Proctor', age: 0, background: '', goals: [], frustrations: [], techSkill: '', quote: '' };\n",
    "const PERSONA = {\n  name: 'Ms Thu Ha',\n  userClass: 'Proctor',\n  age: 41,\n  background: 'Administrative officer of the examination office, proctors about ten online exams per term.',\n  goals: ['See every student\\'s webcam and screen status on one page', 'Flag suspicious behaviour and contact the student within one minute'],\n  frustrations: ['Switching between many browser tabs to watch 60 students', 'Not knowing whether a frozen video is cheating or a bad connection'],\n  techSkill: 'medium',\n  quote: 'I cannot watch sixty faces at once — tell me where to look.',\n};\n",
  ] },
  kiem: [
    kiemTuy({ en: 'every field is filled with real content', vi: 'mọi trường có nội dung thật' }, function () {
      if (typeof PERSONA === 'undefined' || !PERSONA) return 'PERSONA is missing';
      if (!String(PERSONA.name).trim() || !String(PERSONA.background).trim() || !String(PERSONA.quote).trim()) return 'name, background and quote are required';
      if (!(Number(PERSONA.age) >= 18 && Number(PERSONA.age) <= 80)) return 'age: a believable adult age';
      if (['low', 'medium', 'high'].indexOf(String(PERSONA.techSkill).toLowerCase()) < 0) return 'techSkill: low | medium | high';
      if (!Array.isArray(PERSONA.goals) || PERSONA.goals.length < 2 || !Array.isArray(PERSONA.frustrations) || PERSONA.frustrations.length < 2) return 'at least two goals and two frustrations';
      return 'OK';
    }),
    kiemTuy({ en: 'the persona represents the Proctor class', vi: 'persona đại diện lớp Proctor' }, function () {
      if (typeof PERSONA === 'undefined' || !PERSONA) return 'PERSONA is missing';
      return String(PERSONA.userClass).trim().toLowerCase() === 'proctor' ? 'OK' : 'userClass must be Proctor';
    }),
    kiemTuy({ en: 'goals and frustrations are about proctoring an online exam', vi: 'mục tiêu và khó chịu nói về giám sát thi trực tuyến' }, function () {
      if (typeof PERSONA === 'undefined' || !PERSONA) return 'PERSONA is missing';
      var t = [].concat(PERSONA.goals || [], PERSONA.frustrations || []).join(' ').toLowerCase();
      return /student|exam|cheat|webcam|camera|screen|flag|suspicious|watch|monitor/.test(t) ? 'OK' : 'write goals and frustrations about watching students, flagging behaviour, reacting fast';
    }),
  ],
  goiY: ['Bắt đầu từ mô tả lớp: giám sát 30–60 sinh viên, gắn cờ, phản ứng trong 1 phút.', 'Khó chịu thường đến từ quá tải thông tin và tín hiệu mơ hồ.'],
  loiHayGap: ['Persona không gắn với lớp người dùng nào.', 'Mục tiêu chung chung ("work efficiently").'],
  giaiThich: '<p>A useful persona makes the class concrete: what the proctor wants (one overview, quick contact) and what hurts (too many tabs, ambiguous signals) translate directly into requirements.</p>',
  thuatNgu: tn('persona', 'userClass'),
  khaiNiem: ['personas'],
});

const E4 = phanLoai({
  tieuDe: 'User classes 4 — a user class or a market segment?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Group users into classes by how they use the product: access level, tasks, features used, frequency, domain and computer expertise, platform, language, direct or indirect use. Location or company type alone defines <b>market segments</b>, not user classes. Classify each grouping for a banking app.</p>', vi: '<p>Lớp người dùng nhóm theo cách dùng sản phẩm; nhóm theo vị trí hay loại công ty chỉ là phân khúc thị trường.</p>' },
  cot: 'Grouping', luaChon: ['User class', 'Market segment'],
  hang: [
    ['Tellers who process cash deposits many times a day', 'User class'],
    ['Customers in the northern provinces', 'Market segment'],
    ['Loan officers who approve credit applications', 'User class'],
    ['Small companies with fewer than 50 employees', 'Market segment'],
    ['Auditors with read-only access to transaction logs', 'User class'],
  ],
  giaiThich: '<p>A user class is defined by what people do with the product and how; a market segment by who they are or where they are.</p>',
  goiY: ['Theo nhiệm vụ / quyền / tần suất ⇒ lớp người dùng.', 'Theo vùng / quy mô công ty ⇒ phân khúc thị trường.'],
  loiHayGap: ['Lấy vùng miền làm lớp người dùng.', 'Bỏ qua lớp chỉ đọc (kiểm toán).'],
  thuatNgu: tn('userClass'),
  khaiNiem: ['user classes'],
});

export default moDun({
  slug: 'swr302-6u-1-ch6-user-classes-personas',
  ten: '2.19 User classes and personas',
  moTaModule: 'Lớp người dùng ưu tiên / không mong muốn / bỏ qua, persona là gì và dùng thế nào, tự viết persona cho lớp Proctor của hệ thống thi trực tuyến.',
  de: [E1, E2, E3, E4],
});
