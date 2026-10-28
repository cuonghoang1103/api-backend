/**
 * Kỹ năng nghề · 🎤 4.5 — Kịch bản & đồng hồ: tự viết bộ đo kịch bản (talkStats), rồi cắt một kịch bản 500 từ xuống ≤ 390 từ
 * mà vẫn giữ số liệu, lỗi, câu chốt. Số liệu thật Lab 2 SportShop (113 UTCID · 93 P / 20 F · 82,3% · C0 99,3% · C1 93,5% · SS-19).
 */
import { moDun, baiJs, kiemVB, LUU_Y, TN } from './_chung.mjs';

/* ─────────────── S1 — talkStats ─────────────── */
const DAU_S1 = `/**
 * Return statistics of a talk script.
 *   words     — whitespace-separated tokens that contain at least one letter or digit (any language)
 *   seconds   — Math.round(words / wpm * 60)
 *   numbers   — tokens that contain at least one digit
 *   sentences — pieces after splitting on . ! ? followed by whitespace, that contain a letter or digit
 *   fits3min  — words <= 3 * wpm
 */
function talkStats(script, wpm = 130) {
  return { words: 0, seconds: 0, numbers: 0, sentences: 0, fits3min: true };
}
`;
const GIAI_S1 = `/**
 * Return statistics of a talk script (see the statement for the exact definitions).
 * \\p{L} / \\p{N} with the "u" flag = any letter / digit in ANY language — [A-Za-z] would drop Vietnamese
 * words like "đạt", and \\b is ASCII-only in JavaScript, so it also breaks on Vietnamese.
 */
function talkStats(script, wpm = 130) {
  const text = typeof script === 'string' ? script : '';
  const tokens = text.split(/\\s+/).filter((t) => /[\\p{L}\\p{N}]/u.test(t)); // "—" or "•" alone is not a word
  const words = tokens.length;
  const numbers = tokens.filter((t) => /\\p{N}/u.test(t)).length;          // "82.3%", "93/113", "SS-19"
  const sentences = text
    .split(/(?<=[.!?])\\s+/)                                                 // "82.3%" is not split: no space after the dot
    .filter((s) => /[\\p{L}\\p{N}]/u.test(s)).length;
  const seconds = Math.round((words / wpm) * 60);
  return { words, seconds, numbers, sentences, fits3min: words <= 3 * wpm };
}
`;
const S1 = baiJs({
  tieuDe: 'Script 1 — Write talkStats(): words, seconds, numbers, sentences',
  doKho: 'MEDIUM', phut: 15,
  moTa: {
    en: `<p>Before rehearsing, measure. Write <code>talkStats(script, wpm = 130)</code> that returns <code>{ words, seconds, numbers, sentences, fits3min }</code>:</p>
<ul><li><code>words</code> — whitespace-separated tokens that contain at least one letter or digit, <b>in any language</b> (a lone “—” is not a word; “đạt” is);</li>
<li><code>seconds</code> — <code>Math.round(words / wpm * 60)</code>;</li>
<li><code>numbers</code> — tokens that contain at least one digit (“93/113”, “82.3%”, “SS-19” each count once);</li>
<li><code>sentences</code> — pieces after splitting on <code>.</code> <code>!</code> <code>?</code> <b>followed by whitespace</b>, keeping only pieces that contain a letter or digit (so “82.3%” does not split a sentence);</li>
<li><code>fits3min</code> — <code>words &lt;= 3 * wpm</code>.</li></ul>
<p>You will use the same idea to check your own script in the next exercises.</p>`,
    vi: `<p>Trước khi tập, hãy đo. Viết <code>talkStats(script, wpm = 130)</code> trả <code>{ words, seconds, numbers, sentences, fits3min }</code>: số từ (token tách bởi khoảng trắng có ít nhất một chữ cái hoặc chữ số, <b>mọi ngôn ngữ</b> — "—" đứng riêng không phải từ, "đạt" là từ), số giây = <code>Math.round(words / wpm * 60)</code>, số token có chữ số, số câu (tách tại . ! ? <b>có khoảng trắng theo sau</b>, chỉ giữ mảnh có chữ/số — "82.3%" không bị tách), và <code>fits3min</code> = <code>words &lt;= 3 * wpm</code>.</p>`,
  },
  yeuCau: [
    { en: 'Return all five fields for any string, including the empty string.', vi: 'Trả đủ năm trường với mọi chuỗi, kể cả chuỗi rỗng.' },
    { en: 'Letters and digits mean Unicode letters/digits — Vietnamese words must count.', vi: 'Chữ và số là chữ/số Unicode — từ tiếng Việt phải được đếm.' },
  ],
  viDu: [
    { input: "talkStats('Unit tests: 93 pass, 20 fail. Integration: 16 pass!')", output: '{ words: 9, seconds: 4, numbers: 3, sentences: 2, fits3min: true }', explanation: '9 / 130 × 60 = 4.15 → 4 seconds.|||9 / 130 × 60 = 4,15 → 4 giây.' },
    { input: "talkStats('Em kiểm 113 ca — 93 ca đạt. Còn lại là lỗi thật?')", output: '{ words: 12, seconds: 6, numbers: 2, sentences: 2, fits3min: true }', explanation: 'The lone dash is not a word.|||Dấu gạch đứng riêng không phải từ.' },
  ],
  goiY: [
    'Tách bằng /\\s+/ rồi lọc token có /[\\p{L}\\p{N}]/u — cờ u bắt buộc để \\p{…} hoạt động.',
    'Tách câu bằng lookbehind: text.split(/(?<=[.!?])\\s+/) — dấu chấm trong "82.3%" không có khoảng trắng theo sau nên không tách.',
    'Chuỗi rỗng: split cho [""], lọc xong còn 0 phần tử ⇒ mọi số đếm là 0.',
  ],
  loiHayGap: [
    'Dùng [A-Za-z] hoặc \\w ⇒ "đạt", "lỗi" bị bỏ hoặc bị cắt đôi; \\b của JavaScript cũng chỉ hiểu ASCII.',
    'Đếm "—" hoặc "•" là một từ ⇒ kịch bản bị tính dài hơn thật.',
    'Tách câu tại mọi dấu chấm ⇒ "82.3%" thành hai câu.',
  ],
  giaiThich: {
    en: '<p>The whole function is three filters over the same token list. The two traps are both about Unicode: Vietnamese letters are outside <code>[A-Za-z]</code>, and JavaScript’s <code>\\b</code> is ASCII-only — the same bug once turned “một” into “mộti” in this site’s own subtitle pipeline.</p>',
    vi: '<p>Cả hàm là ba phép lọc trên cùng danh sách token. Hai bẫy đều về Unicode: chữ tiếng Việt nằm ngoài <code>[A-Za-z]</code>, và <code>\\b</code> của JavaScript chỉ hiểu ASCII — chính lỗi này từng biến "một" thành "mộti" trong dây chuyền phụ đề của web.</p>',
  },
  thuatNgu: [TN.wpm, { en: 'token', vi: 'mẩu chữ sau khi tách theo khoảng trắng' }, { en: 'Unicode property escape (\\p{L})', vi: 'lớp ký tự theo thuộc tính Unicode — \\p{L} = mọi chữ cái' }],
  khaiNiem: ['script timing', 'Unicode regex'],
  tep: { 'talk-stats.js': [DAU_S1, GIAI_S1] },
  boYeu: [
    { ten: 'đếm từ bằng \\w (ASCII)', tep: { 'talk-stats.js': GIAI_S1.replace("/[\\p{L}\\p{N}]/u.test(t)); // \"—\"", "/\\w/.test(t)); // \"—\"") }, phaiTruot: ['ASCII'] },
    { ten: 'tách câu tại mọi dấu chấm', tep: { 'talk-stats.js': GIAI_S1.replace('.split(/(?<=[.!?])\\s+/)', '.split(/[.!?]/)') }, phaiTruot: ['does not split a sentence'] },
  ],

  kiem: [
    kiemVB({ en: 'example 1 (English)', vi: 'ví dụ 1 (tiếng Anh)' }, () => { const r = talkStats('Unit tests: 93 pass, 20 fail. Integration: 16 pass!'); const w = { words: 9, seconds: 4, numbers: 3, sentences: 2, fits3min: true }; return JSON.stringify(r) === JSON.stringify(w) ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemVB({ en: 'example 2 (Vietnamese words count, a lone dash does not)', vi: 'ví dụ 2 (từ tiếng Việt được đếm, gạch đứng riêng thì không)' }, () => { const r = talkStats('Em kiểm 113 ca — 93 ca đạt. Còn lại là lỗi thật?'); const w = { words: 12, seconds: 6, numbers: 2, sentences: 2, fits3min: true }; return JSON.stringify(r) === JSON.stringify(w) ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemVB({ en: 'words with no ASCII letter still count (“Ở đó ổn”)', vi: 'từ không có chữ ASCII vẫn được đếm ("Ở đó ổn")' }, () => { const r = talkStats('Ở đó ổn và ở đây ổn.'); return r.words === 7 && r.sentences === 1 ? 'OK' : 'got ' + JSON.stringify(r) + ' — [A-Za-z] or \\w misses Vietnamese words'; }),
    kiemVB({ en: '“82.3%” does not split a sentence; “93/113” and “SS-19” are numbers', vi: '"82.3%" không tách câu; "93/113" và "SS-19" là số' }, () => { const r = talkStats('Successful coverage is 82.3% (93/113). See SS-19.'); return r.sentences === 2 && r.numbers === 3 && r.words === 7 ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemVB({ en: 'exactly 390 words fit in 3 minutes at 130 wpm, 391 do not', vi: 'đúng 390 từ vừa 3 phút ở 130 từ/phút, 391 thì không' }, () => { const a = talkStats(Array(390).fill('word').join(' ')); const b = talkStats(Array(391).fill('word').join(' ')); return a.words === 390 && a.seconds === 180 && a.fits3min === true && a.sentences === 1 && b.fits3min === false ? 'OK' : 'got ' + JSON.stringify(a) + ' / ' + JSON.stringify(b); }),
    kiemVB({ en: 'custom pace: 300 words at 150 wpm = 120 s', vi: 'tốc độ khác: 300 từ ở 150 từ/phút = 120 giây' }, () => { const r = talkStats(Array(300).fill('từ').join(' '), 150); return r.seconds === 120 && r.fits3min === true ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
    kiemVB({ en: 'empty string and extra whitespace', vi: 'chuỗi rỗng và khoảng trắng thừa' }, () => { const a = talkStats(''); const b = talkStats('  multiple   spaces\nnew line  '); return a.words === 0 && a.sentences === 0 && a.numbers === 0 && a.seconds === 0 && b.words === 4 && b.sentences === 1 ? 'OK' : 'got ' + JSON.stringify(a) + ' / ' + JSON.stringify(b); }, { an: true }),
  ],
});

/* ─────────────── S2 — cut a 500-word script ─────────────── */
const KICH_BAN_GIAI = `Why did 20 of our 113 unit tests fail, when none of them touches a database? Because each one points at a real defect in SportShop.

SportShop is a Java Servlet and JSP shop on Tomcat 10 with SQL Server. I own module A: login, register, profile, change password, the AuthFilter and UserDAO, nine classes in total.

In Lab 2 I wrote 113 unit tests with JUnit 5 and Mockito. Mockito replaces the request, the response and the DAO, so every test runs in milliseconds without Tomcat. The servlets create UserDAO with new inside the method, so I used mockConstruction to swap it for a fake.

The results: 93 tests pass and 20 fail, a successful coverage of 82.3%. Line coverage is 99.3% and branch coverage 93.5%. The 8 branches I did not cover are null checks added by the compiler and two dead rs != null checks, so no test can reach them.

The fail I want to show you is SS-19. A guest who opens the dashboard gets HTTP 500 instead of the home page. AuthFilter.java line 45 calls getRole on an account that is null. The unit test for the guest case expects a redirect and receives a NullPointerException.

Two lessons. First, the expected result comes from the requirement, never from the code: if I had copied the actual behaviour, these 20 defects would be invisible. Second, test the paths nobody clicks on purpose, such as a guest typing a protected URL.

So every one of the 20 fails has a ticket, and fixing SS-19 needs one null check. Thank you, I am happy to take questions.`;

const KICH_BAN_DAU = `Good morning teacher and everyone, my name is Cuong and today I would like to present to you about our Lab 2, which is about unit testing, and basically it was quite a lot of work for our team.

So, first of all, let me introduce a little bit about the project. Our project is called SportShop, and it is, you know, a web application for selling sport products like shoes, clothes and some other things. It is written in Java Servlet and JSP and it runs on Tomcat 10 and the database is SQL Server. Our team has five members and each member is responsible for one module, and I am responsible for module A, which is Authentication and Account, and it includes login, register, logout, forgot password, change password, profile, update profile, the AuthFilter and also the UserDAO class, so actually there are nine classes in total.

Next, I would like to talk about what unit testing is. Unit testing is a level of testing where we test a single unit of the code, for example one method, in isolation from the other parts. It is the first level in the V-model and it is usually done by developers. In our lab we used JUnit 5 and also Mockito, which is a very popular framework. Mockito helps us to create fake objects, which are called mocks, so we can test the servlet without running Tomcat and without the database. Basically, because the servlets create the UserDAO with the new keyword inside the method, I had to use a special feature called mockConstruction, which, kind of, replaces every new UserDAO with a fake one inside the test.

So, about the results, I wrote 113 unit tests in total. Out of these, 93 tests passed and 20 tests failed, so the successful coverage is 82.3%. The line coverage is 99.3% and the branch coverage is 93.5%, which is quite good I think. Some branches were not covered, there are 8 branches, and they are null checks that the compiler adds automatically and two rs != null checks that can never be false, so actually no test can reach them.

Now let me show you one of the failed tests, which is SS-19. When a guest, which means a user who is not logged in, opens the dashboard page, the system returns HTTP 500 instead of going to the home page. The reason is that in AuthFilter.java at line 45, the code calls getRole on the account object but the account is null. So the unit test for the guest case expects a redirect but it receives a NullPointerException instead.

About the lessons, I learned many things. First, the expected result must come from the requirement and not from the code, because if we copy the actual behaviour then we cannot find the defects. Second, we should also test the paths that users do not click normally, for example a guest typing a protected URL directly.

So yeah, that's all for my presentation. Thank you for listening.`;

const S2 = baiJs({
  tieuDe: 'Script 2 — Cut a 500-word Lab 2 script to 3 minutes',
  doKho: 'MEDIUM', phut: 25,
  moTa: {
    en: `<p><code>script.js</code> holds a typical first draft of a 3-minute Lab 2 talk (SportShop, module A). Read aloud at 130 words per minute it takes about <b>4 minutes</b>, it opens with a greeting and a name, it explains what unit testing is (the teacher knows), it is full of fillers (“basically”, “you know”, “kind of”), and it ends with “that’s all”.</p>
<p>Edit <code>SCRIPT</code> so that it:</p>
<ul><li>is <b>250–390 words</b> (≈ 2–3 minutes);</li>
<li>opens with a hook — the first sentence contains a number or a question, and is <b>not</b> a greeting or “my name is…”;</li>
<li>keeps the key numbers <b>113</b>, <b>93</b>, <b>20</b> and <b>82.3%</b>, and names the defect <b>SS-19</b>;</li>
<li>contains none of the fillers <i>basically, actually, you know, kind of, sort of, so yeah</i> and none of the vague words <i>quite, many, some, a lot, good</i>…;</li>
<li>ends on a takeaway: the last sentence that is not a thank-you has at least 6 words and is not “that’s all”.</li></ul>
<p>Write inside the backticks; do not use a backtick or <code>\${</code> in your text.</p>`,
    vi: `<p><code>script.js</code> chứa một bản nháp đầu tiên điển hình của bài nói Lab 2 (SportShop, module A). Đọc to ở 130 từ/phút mất khoảng <b>4 phút</b>, mở bằng lời chào và tên, giải thích unit test là gì (cô biết rồi), đầy từ đệm ("basically", "you know", "kind of"), kết bằng "that's all".</p>
<p>Sửa <code>SCRIPT</code> để: dài <b>250–390 từ</b>; câu đầu là câu mở có số hoặc câu hỏi, <b>không</b> phải lời chào/giới thiệu tên; giữ các số <b>113</b>, <b>93</b>, <b>20</b>, <b>82.3%</b> và lỗi <b>SS-19</b>; không còn từ đệm và từ mơ hồ (quite, many, some, a lot, good…); kết bằng câu chốt — câu cuối không phải lời cảm ơn có ít nhất 6 từ và không phải "that's all". Viết trong cặp dấu huyền; đừng dùng dấu huyền hay <code>\${</code> trong lời.</p>`,
  },
  yeuCau: [
    { en: 'Cut background and textbook definitions first, never the numbers or the bug.', vi: 'Cắt bối cảnh và định nghĩa sách trước, không bao giờ cắt số liệu hay lỗi.' },
    LUU_Y,
    { en: 'After it passes: read it aloud with a timer (and record it). The grader counts words; only your voice tells the real time.', vi: 'Đạt rồi thì đọc to có bấm giờ (và ghi âm). Máy chấm đếm từ; chỉ giọng của bạn mới cho thời gian thật.' },
  ],
  viDu: [{ input: 'SCRIPT (draft) → talkStats', output: '≈ 505 words · ≈ 233 s · opens with “Good morning teacher…” → fails 4 checks|||≈ 505 từ · ≈ 233 giây · mở bằng "Good morning teacher…" → trượt 4 kiểm', explanation: 'Your edited SCRIPT must pass every check.|||SCRIPT đã sửa phải đạt mọi kiểm.' }],
  goiY: [
    'Xoá cả đoạn "what unit testing is" — cô dạy môn này. Giữ một câu vì sao cần mockConstruction (đó là điều RIÊNG của code bạn).',
    'Biến câu chào thành câu hỏi có số: "Why did 20 of our 113 unit tests fail…?"',
    'Thay "quite good", "many things" bằng số hoặc xoá hẳn; thay "that\'s all" bằng một câu chốt có SS-19.',
  ],
  loiHayGap: [
    'Cắt bằng cách bỏ đoạn kết quả vì "dài" — mất đúng phần được chấm.',
    'Giữ lời chào rồi đặt câu hỏi ở câu thứ hai — 10 giây đầu vẫn bị phí.',
    'Còn sót "basically"/"kind of" — khi nói to, từ đệm còn nhiều hơn trên giấy.',
  ],
  giaiThich: {
    en: '<p>The model cut removes the greeting, the textbook paragraph and every filler, and keeps one sentence of method that is specific to this code (why <code>mockConstruction</code>). The results paragraph is untouched; the close now carries the takeaway (every fail has a ticket; SS-19 needs one null check). That is how a 4-minute draft becomes a 2½-minute talk without losing a single number.</p>',
    vi: '<p>Bản cắt mẫu bỏ lời chào, đoạn định nghĩa sách và mọi từ đệm, giữ một câu phương pháp riêng của code này (vì sao <code>mockConstruction</code>). Đoạn kết quả giữ nguyên; câu kết mang điều mang về (mọi ca fail đều có thẻ; SS-19 chỉ cần một phép kiểm null). Đó là cách bản nháp 4 phút thành bài nói 2 phút rưỡi mà không mất con số nào.</p>',
  },
  thuatNgu: [TN.wpm, TN.hook, TN.takeaway, { en: 'filler word', vi: 'từ đệm: basically, actually, you know, "kiểu như", "thì là"' }],
  khaiNiem: ['editing a talk', 'time limit'],
  tep: { 'script.js': [`const SCRIPT = ´${KICH_BAN_DAU}´;\n`, `const SCRIPT = ´${KICH_BAN_GIAI}´;\n`] },
  kiem: [
    kiemVB({ en: 'Length: 250–390 words (≈ 2–3 minutes at 130 wpm)', vi: 'Độ dài: 250–390 từ (≈ 2–3 phút ở 130 từ/phút)' }, () => { const n = __V.w(SCRIPT); return n >= 250 && n <= 390 ? 'OK' : n + ' words (' + Math.round(n / 130 * 60) + ' s at 130 wpm) — need 250–390'; }),
    kiemVB({ en: 'Hook: first sentence has a number or a question and is not a greeting', vi: 'Câu mở: câu đầu có số hoặc câu hỏi và không phải lời chào' }, () => { const c = __V.cau(SCRIPT)[0] || ''; if (__V.chao(c)) return 'the first sentence is a greeting/name: “' + c.slice(0, 60) + '…”'; return /\d|\?/.test(c) ? 'OK' : 'the first sentence has no number and no question: “' + c.slice(0, 60) + '…”'; }),
    kiemVB({ en: 'Keeps the key numbers 113, 93, 20, 82.3% and the defect SS-19', vi: 'Giữ các số 113, 93, 20, 82.3% và lỗi SS-19' }, () => { const can = ['113', '93', '20', '82.3%', 'SS-19']; const thieu = can.filter((x) => __V.coTu(SCRIPT, [x]).length === 0); return thieu.length ? 'missing: ' + thieu.join(', ') : 'OK'; }),
    kiemVB({ en: 'No filler words', vi: 'Không còn từ đệm' }, () => { const f = __V.filler(SCRIPT); return f.length ? 'fillers found: ' + f.join(', ') : 'OK'; }),
    kiemVB({ en: 'No vague words', vi: 'Không còn từ mơ hồ' }, () => { const f = __V.vague(SCRIPT); return f.length ? 'vague words found: ' + f.join(', ') : 'OK'; }),
    kiemVB({ en: 'Ends on a takeaway, not on “that’s all”', vi: 'Kết bằng câu chốt, không phải "that\'s all"' }, () => { const cs = __V.cau(SCRIPT).filter((c) => !/^(thank you|thanks|questions\?|cảm ơn|em xin cảm ơn)/i.test(c.trim()) && !/^[^.!?]*\b(happy to take questions|any questions)\b/i.test(c)); const c = cs[cs.length - 1] || ''; if (/that['’]?s all|xin hết/i.test(c)) return 'the close is “' + c + '”'; return __V.w(c) >= 6 ? 'OK' : 'the last real sentence is too short: “' + c + '”'; }),
  ],
  boYeu: [
    { ten: 'cắt đủ ngắn nhưng bỏ hết số liệu', tep: { 'script.js': `const SCRIPT = \`${KICH_BAN_GIAI.replace(/113/g, 'all').replace(/82\.3%/g, 'most')}\`;\n` }, phaiTruot: ['Keeps the key numbers'] },
    { ten: 'giữ lời chào ở câu đầu', tep: { 'script.js': `const SCRIPT = \`Good morning teacher, my name is Cuong. ${KICH_BAN_GIAI}\`;\n` }, phaiTruot: ['Hook'] },
    { ten: 'cắt quá tay còn ~120 từ', tep: { 'script.js': `const SCRIPT = \`${KICH_BAN_GIAI.split('\n\n').filter((_, i) => [0, 3, 6].includes(i)).join('\n\n')}\`;\n` }, phaiTruot: ['Length'] },
    { ten: 'kết bằng "That\'s all for my presentation."', tep: { 'script.js': `const SCRIPT = \`${KICH_BAN_GIAI.replace('Thank you, I am happy to take questions.', "That's all for my presentation.")}\`;\n` }, phaiTruot: ['Ends on a takeaway'] },
  ],
});

export default moDun({
  slug: 'ssg105-4-5-script-timing',
  ten: '4.5 Script and clock: measure, then cut to 3 minutes',
  moTaModule: 'Tự viết talkStats() đo kịch bản (từ, giây ở 130 từ/phút, số liệu, câu — đúng cả tiếng Việt), rồi cắt bản nháp Lab 2 SportShop 500 từ xuống 250–390 từ mà vẫn giữ 113/93/20/82.3% và SS-19, bỏ lời chào, từ đệm, từ mơ hồ, kết bằng câu chốt.',
  baiHoc: 'ssg105-4-1-presentation',
  de: [S1, S2],
});
