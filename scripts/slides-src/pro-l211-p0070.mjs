/**
 * pro-l211-p0070 — PRO192 · 🎓 LAB211 thực chiến · L.4 "J1.S.P0070 Ebank Login (TPBank)" (slide EN, khuôn _pro-chung,
 * agent pro-lab211 đợt 2, 27/10/2026). Code + output ĐỌC THẲNG từ flm-nguon/_repo/PRO192/gen/lab/l211-p0070 (bản ĐÃ SỬA theo thầy:
 * lint.py ✓ sạch, soát 25 mục 0 vi phạm, JDK 8 thật trùng máy; captcha ngẫu nhiên ⇒ bàn phím đọc màn hình gen/lib/phim-captcha.mjs,
 * chuỗi captcha chuẩn hoá XXXXX; bay/truoc-khi-sua = bản thầy review, ẩn tên: lint 171 vi phạm THẬT).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pro-l211-p0070.mjs --out <dir>   ⇒ <dir>/l211-p0070/NNN.webp
 */
import { lamDeck, sql, psql, two, box, steps, tbl, c, vsd } from './_pro-chung.mjs';
import { ham, tep, ra, col, boChuThich, luong, boc, PG, XANH, CAM, DO, TIM } from './pro-lab-hinh.mjs';

export const deck = { key: 'l211-p0070', code: 'PRO192 · LAB211 P0070', title: 'LAB211 · J1.S.P0070 — Ebank Login (TPBank)', sub: 'Two languages · regex · a random captcha checked first · no service' };

const S = 'l211-p0070/solution/src';
const B = 'l211-p0070/bay/truoc-khi-sua/src';
const j = (src, o = {}) => sql(boc(src, o.max || 60), { lang: 'java', sm: true, ...o });
const P = (t, o) => psql(t, o).replace('<pre>', '<pre style="white-space:pre-wrap">');
const R = (a, b) => ra('l211-p0070/solution:run', [a, b]);

export const slides = lamDeck({ chuong: '🎓 LAB211 in practice', bai: 'L.4 · P0070' }, [
  /* 1 */
  { cover: true, t: 'J1.S.P0070 —<br>Ebank Login (TPBank)', sub: 'Short assignment · 150 LOC · the version the lecturer reviewed, fixed: the captcha comes first, the service goes, the view prints once' },

  /* 2 */
  { t: 'The brief', body: two(
    col(tbl(['Step', 'Rule'], [['1 · menu', '1 Vietnamese · 2 English · 3 Exit'], ['2 · account number', 'a number, <b>exactly 10 digits</b>'], ['3 · password', '<b>8–31</b> characters, letters <b>and</b> digits'], ['4 · captcha', 'random, <b>new at each login</b>; one or more characters, checked with <b>contains()</b>']]),
      box('Methods the brief names', `<p style="margin:0">${c('setLocate')} · ${c('checkAccountNumber')} · ${c('checkPassword')} · ${c('generateCaptcha')} · ${c('checkCaptcha')} — and two ${c('.properties')} files, one per language.</p>`, 'lam')),
    P(R(1, 5).replace(/Account number must is.*$/, '…') + '\n…\n' + R(13, 13), { title: 'the screen (real — the captcha is random, shown as XXXXX)', sm: true }), 'r64'), giua: true },

  /* 3 */
  { t: 'Two languages without one if', body: two(
    sql(tep(`${S}/constants/Language_en.properties`, [2, 5]) + '\n…\n' + tep(`${S}/constants/Language_vi.properties`, [2, 5]), { lang: 'text', sm: true, title: 'constants/Language_en.properties · Language_vi.properties' }),
    col(j(boChuThich(ham(`${S}/utils/Resource.java`, 'setLocate')) + '\n\n' + boChuThich(ham(`${S}/utils/Resource.java`, 'getString'))),
      box('One key, two files', `<p style="margin:0">${c('getBundle("constants/Language", locale)')} picks ${c('Language_vi')} or ${c('Language_en')} — the code names a <b>key</b>, never a sentence. Code ${c('vi')} (language), not ${c('vn')} (country).</p>`, 'ok'),
      box('Java 8 reads .properties as ISO-8859-1', `<p style="margin:0">so the Vietnamese file stays <b>without accents</b>; the two spaces after ${c('So tai khoan:')} are part of the brief.</p>`, 'lam')), 'r64') },

  /* 4 */
  { t: 'Regex, by hand', body: two(
    col(j(tep(`${S}/constants/Constants.java`, [40, 44]), { max: 66 }),
      tbl(['Typed', 'Account ^[0-9]{10}$'], [[c('1'), '✗ one digit'], [c('aaaaaaaaaa'), '✗ not digits'], [c('123456789'), '✗ nine digits'], [c('0123456789'), '✓ ten — kept as a String (leading 0)']])),
    col(tbl(['Typed', 'Password'], [[c('12345678'), '✗ no letter'], [c('aaaaaaaa'), '✗ no digit'], ['32 × ' + c('1'), '✗ too long, no letter'], [c('123456ab'), '✓']]),
      box('Two look-aheads', `<p style="margin:0">${c('(?=.*[A-Za-z])')} "has a letter", ${c('(?=.*\\d)')} "has a digit", then ${c('[A-Za-z\\d]{8,31}')}. ${c('matches')} tests the <b>whole</b> string.</p>`, 'ok')), 'r64') },

  /* 5 */
  { t: '"Put the captcha first"', body: two(
    col(box('The reviewed version', '', 'do2'), luong([['Main', 'account,\npassword', PG], ['Repository', 'right or\nwrong?', XANH], ['Main', 'captcha —\nonly if right', DO]], { h: 150, fs: 16, w: 540 }),
      `<p class="nho">A wrong account never reaches the captcha: anyone can test passwords without solving it.</p>`),
    col(box('The fixed version', '', 'ok'), luong([['Main', 'account,\npassword', PG], ['Main', 'captcha\nchecked', CAM], ['Controller', 'one call →\nrepository', XANH]], { h: 150, fs: 16, w: 540 }),
      `<p class="nho">The input order stays the brief's (account → password → captcha); the captcha is made at the start of each login and passed <b>before</b> anything asks the repository.</p>`), 'r64') +
    box('If he meant "before the account field"', `<p style="margin:0">move two lines in ${c('inputLogin')} (print the captcha, ${c('inputCaptcha')}) above ${c('setAccount')} — nothing else changes. Ask him one question to be sure.</p>`, 'lam') },

  /* 6 */
  { t: '"Something in Main" — what the tools say', body: two(
    P(ra('l211-p0070/bay/truoc-khi-sua:lint', [1, 1]) + '\n' + ['   88  COMMENT    33  HARDCODE   11  STATIC', '   11  HEADER      7  FORMAT      6  FIELD', '    4  STRUCTURE   3  MAGIC       2  PARAMS', '    2  JAVABEAN · SWITCH · EXIT · UTILS · COLLECTION'].join('\n') + '\n\n$ python3 soat_checklist.py …\n== 26 VI PHAM', { title: 'the reviewed version (names hidden) — real', sm: true }),
    tbl(['In the old Main', 'Fixed'], [
      ['prints "Login success / failed" itself', 'the View prints, through the controller'],
      [`${c('control.login()')} after the ${c('switch')}`, 'each case calls the controller once'],
      [`captcha with ${c('equals')}`, `${c('contains()')} as the brief says, empty refused`],
      [`${c('verifyCaptcha(sc, msg, err, captcha)')} — 4 params, public`, 'private helpers, ≤ 2 parameters'],
      [`${c('System.exit(0)')} · ${c('case 1:')}`, `a flag ${c('isRunning')} · ${c('Constants.MENU_*')}`],
      [`${c('Resource.resourceBundle')} public static`, `private + ${c('Resource.getString(key)')}`],
    ]), 'r64') },

  /* 7 */
  { t: 'The trap no one saw: Preferences', body: two(
    j(boChuThich(tep(`${B}/utils/Resource.java`, [22, 39])), { max: 66 }),
    col(box('Run 1: choose 1 (Vietnamese) · quit', `<p style="margin:0">${c('updateLanguage')} stores "vi" in the <b>user preferences of the machine</b>.</p>`, 'do2'),
      box('Run 2: the menu opens in Vietnamese', `<p style="margin:0">the ${c('static { }')} block reads "vi" back — though the comment says "English by default". On Windows it can also print <i>Could not open/create prefs root node</i>.</p>`, 'do2'),
      box('Fixed', `<p style="margin:0">no Preferences, no static block: the bundle starts in English, ${c('setLocate(locale)')} switches it.</p>`, 'ok')), 'r64') },

  /* 8 */
  { t: 'The clean design: no service', body: luong([
    ['Main', 'menu · input\ncaptcha first', PG],
    ['AccountController', 'login(dto)\none call', CAM],
    ['AccountRepository', 'checkLogin\n4 sample accounts', XANH],
    ['AccountView', 'display()\nonce', PG],
  ], { h: 170, fs: 16 }) + two(
    box('Why no service', `<p style="margin:0">the old ${c('AccountService.login')} was one line forwarding to the repository — no computation. The paper: <b>add a service only when there is business computation</b> (same reason as P0071).</p>`, 'lam'),
    box('Names after the class', `<p style="margin:0">${c('Controller')} → ${c('AccountController')}, ${c('Helper')} → ${c('CaptchaUtils')} (the Guide's <i>CapchaUtils</i>), ${c('control')} → ${c('accountController')}.</p>`, 'ok')) },

  /* 9 */
  { t: 'Model and repository', body: two(
    col(j(boChuThich(ham(`${S}/repository/AccountRepository.java`, 'AccountRepository')), { max: 64 }),
      j(boChuThich(ham(`${S}/repository/AccountRepository.java`, 'checkLogin')), { max: 64 })),
    col(j(['public class Account {', '    private String account;', '    private String password;', '    public Account() { }', '    … get / set …', '}'].join('\n'), { max: 44 }),
      box('Sample data in the repository', `<p style="margin:0">the four accounts come from ${c('Constants.SAMPLE_*_ARRAY')} and are loaded in the constructor — not in the controller, not in Main.</p>`, 'ok')), 'r64') },

  /* 10 */
  { t: 'Utils: three checks and one captcha', body: two(
    j(boChuThich(ham(`${S}/utils/Validation.java`, 'checkAccountNumber')) + '\n\n' + boChuThich(ham(`${S}/utils/Validation.java`, 'checkCaptcha')), { max: 64 }),
    col(j(boChuThich(ham(`${S}/utils/CaptchaUtils.java`, 'generateCaptcha')), { max: 42 }),
      box('contains("") is true', `<p style="margin:0">every string contains the empty string — Enter alone would log in. ${c('isEmpty()')} is tested <b>first</b>.</p>`, 'do2')), 'r64') },

  /* 11 */
  { t: 'Main: one login, captcha before the controller', body: two(
    j(boChuThich(ham(`${S}/main/Main.java`, 'inputLogin'))),
    col(j(tep(`${S}/main/Main.java`, [38, 42]).replace(/^ {16}/gm, ''), { max: 42 }),
      box('A new captcha per login', `<p style="margin:0">${c('generateCaptcha()')} is the first line of ${c('inputLogin')}: the brief says <i>in each login</i>. Each case: set the language, input, <b>one</b> ${c('login')} call.</p>`, 'ok')), 'r64') },

  /* 12 */
  { t: 'Controller and view: print once', body: two(
    j(boChuThich(ham(`${S}/controller/AccountController.java`, 'login'))),
    col(j(boChuThich(ham(`${S}/view/AccountView.java`, 'display')), { max: 42 }),
      box('Result in a ResponseDTO', `<p style="margin:0">the controller writes the sentence (already in the chosen language) into ${c('ResponseDTO.message')}, the view prints it — Main never prints a login result.</p>`, 'ok')), 'r64') },

  /* 13 */
  { t: 'The real run, lint and JDK 8', body: two(
    P(R(13, 16) + '\n…\n' + R(21, 22) + '\n…\n' + R(27, 28), { title: 'test keys — real output (captcha → XXXXX)', sm: true }),
    col(psql(ra('l211-p0070/solution:lint'), { title: 'python3 lint.py' }),
      box('A keyboard that reads the screen', `<p style="margin:0">${c('harness/input.txt')} holds ${c('{CAP1}')} (first character) and ${c('{CAPMID}')} (two middle ones): the runner waits for the captcha to appear, then types. A real JDK 8 prints the same 29 lines.</p>`, 'lam'),
      box('No auto-grader', `<p style="margin:0">the captcha changes every run: type the keys, compare with ${c('man-hinh-mong-doi.txt')}.</p>`, 'lam')), 'r64') },

  /* 14 */
  { t: 'What the lecturer asks', body: tbl(['Question', 'Answer'], [
    ['Why is the captcha checked before the account?', 'it stops a machine guessing passwords; checked after, the program tells right from wrong without it'],
    ['Why no service?', 'no business computation — the old service forwarded one line'],
    ['Where is contains(), and an empty input?', `${c('Validation.checkCaptcha')}: empty refused first, then ${c('captcha.contains(text)')}`],
    ['How does the language switch?', `${c('Resource.setLocate')} reloads the bundle; every sentence goes through ${c('Message.getX()')}`],
    ['Why is the account number a String?', 'keeps the leading 0; ten digits overflow an int'],
    ['Why no System.exit?', 'it kills the JVM at once; a flag lets main end normally'],
  ]), giua: true },
]);
