/**
 * pro-l211-p0011 — PRO192 · 🎓 LAB211 thực chiến · L.1 "J1.S.P0011 Change Base Number System" (slide EN, khuôn _pro-chung,
 * agent pro-lab211 27/10/2026). Code + output ĐỌC THẲNG từ flm-nguon/_repo/PRO192/gen/lab/l211-p0011 (bản sửa theo thầy 26/10 +
 * soát checklist: lint.py ✓ sạch, check PASS 87/87, JDK 8 thật trùng máy; bay/truoc-khi-sua = bản bị trả lại, lint 15 vi phạm THẬT).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pro-l211-p0011.mjs --out <dir>   ⇒ <dir>/l211-p0011/NNN.webp
 */
import { lamDeck, sql, psql, two, box, steps, tbl, c, vsd, esc } from './_pro-chung.mjs';
import { ham, tep, ra, col, boChuThich, luong, tangLab, PG, NAU, XANH, CAM, TIM, DO } from './pro-lab-hinh.mjs';

export const deck = { key: 'l211-p0011', code: 'PRO192 · LAB211 P0011', title: 'LAB211 · J1.S.P0011 — Change Base Number System', sub: 'BIN · DEC · HEX · two hand-written conversions · CRUD out of the service' };

const S = 'l211-p0011/solution/src';
const T = 'l211-p0011/bay/truoc-khi-sua/src';
const j = (src, o = {}) => sql(src, { lang: 'java', sm: true, ...o });
const P = (t, o) => psql(t, o).replace('<pre>', '<pre style="white-space:pre-wrap">');
const MENU = /^(?:Choose the INPUT base: |Choose the OUTPUT base: |Enter the input value: )+/;
const boNhac = (t) => t.split('\n').map((x) => x.replace(MENU, '')).join('\n');
const R = (a, b) => boNhac(ra('l211-p0011/solution:run', [a, b]));

/* Hình: chia liên tiếp 535 ÷ 16, đọc số dư từ dưới lên */
function hinhChia() {
  const W = 1110, h = 300;
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 22}" ${o.b ? 'font-weight="700"' : ''} fill="${o.m || '#262626'}" ${o.mono ? 'font-family="Menlo,monospace"' : ''} text-anchor="${o.a || 'start'}">${esc(s)}</text>`;
  let s = `<svg viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" font-family="Arial"><defs><marker id="mch" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${DO}"/></marker></defs>`;
  const hang = [['535 ÷ 16', '33', '7'], ['33 ÷ 16', '2', '1'], ['2 ÷ 16', '0', '2']];
  s += t(20, 32, 'DEC → HEX: divide, keep the remainder', { b: true, m: PG, fs: 21 });
  s += t(40, 70, 'division', { b: true, fs: 18, m: '#555' }) + t(250, 70, 'quotient', { b: true, fs: 18, m: '#555' }) + t(380, 70, 'remainder', { b: true, fs: 18, m: '#555' });
  hang.forEach(([p, q, r], i) => {
    const y = 110 + i * 52;
    s += `<rect x="20" y="${y - 32}" width="500" height="44" rx="8" fill="${i % 2 ? '#fff' : '#f4f7fb'}" stroke="#d5dde8"/>` +
      t(40, y, p, { mono: true }) + t(270, y, q, { mono: true }) + `<circle cx="412" cy="${y - 9}" r="20" fill="${CAM}22" stroke="${CAM}" stroke-width="2"/>` + t(412, y - 1, r, { mono: true, b: true, a: 'middle', m: CAM });
  });
  s += `<line x1="460" y1="214" x2="460" y2="96" stroke="${DO}" stroke-width="3" marker-end="url(#mch)"/>` + t(472, 160, 'read up', { fs: 17, m: DO, b: true });
  s += t(40, 270, 'append 7, 1, 2  →  "712"  →  reverse()  →  217', { mono: true, b: true, fs: 20, m: XANH });
  s += `<rect x="600" y="10" width="500" height="270" rx="14" fill="#f1f9f4" stroke="${XANH}" stroke-width="2.5"/>`;
  s += t(620, 44, 'HEX → DEC: multiply and add, left to right', { b: true, m: XANH, fs: 19 });
  [['start', 'result = 0'], ['digit 2', '0 × 16 + 2 = 2'], ['digit 1', '2 × 16 + 1 = 33'], ['digit 7', '33 × 16 + 7 = 535']].forEach(([a, b], i) => {
    s += t(630, 92 + i * 42, a, { fs: 18, m: '#555' }) + t(760, 92 + i * 42, b, { mono: true, fs: 20 });
  });
  s += t(620, 262, 'check BEFORE × : result > (MAX − digit) / radix ⇒ too big', { fs: 16, m: DO });
  return s + '</svg>';
}

export const slides = lamDeck({ chuong: '🎓 LAB211 in practice', bai: 'L.1 · P0011' }, [
  /* 1 */
  { cover: true, t: 'J1.S.P0011 —<br>Change Base Number System', sub: 'Short assignment · 100 LOC · BIN, DEC, HEX · two hand-written conversions · the version fixed after a real review' },

  /* 2 */
  { t: 'The brief', body: two(
    col(steps([
      'choose the <b>input</b> base: 1 BIN · 2 DEC · 3 HEX',
      'choose the <b>output</b> base',
      'enter the value · print the equivalent',
      'repeat until the user closes the program',
    ]), box('No screen, no method names', `<p style="margin:0">Only four worked examples — so we keep the class's reference screen and write <b>both conversions by hand</b>. ${c('Integer.parseInt(s, 16)')} skips what the lab tests.</p>`, 'lam')),
    P(boNhac(ra('l211-p0011/solution:run', [1, 9])).replace(/^(Choose.*)$/m, '$1'), { title: 'the screen (real run)' }), 'r46'), giua: true },

  /* 3 */
  { t: 'Every road goes through decimal', body: hinhChia() + box('Two algorithms, nine pairs', `<p style="margin:0">base in → ${c('long')} → base out. BIN→HEX, HEX→BIN, DEC→DEC… all reuse the same two methods; base 8 later = one enum constant.</p>`, 'ok') },

  /* 4 */
  { t: 'The class design', body: tangLab({ h: 400, ten: { controller: 'ConvertController', repository: 'BaseNumberRepository', service: 'ConvertService', view: 'ConvertView', model: 'BaseNumber', dto: 'ConvertRequestDTO · ConvertResponseDTO', constants: 'Message · Constants · enum Base' } }) +
    `<div class="nho" style="text-align:center">The controller saves (CRUD), the service converts what it is given, the view prints once. The enum <b>Base</b> lives in constants.</div>` },

  /* 5 */
  { t: 'What the lecturer rejected', body: vsd(
    j(['// BEFORE — service/ConvertService.java', 'import repository.BaseNumberRepository;', '', 'private BaseNumberRepository baseNumberRepository;', '', 'public ConvertResponseDTO convert(', '        ConvertRequestDTO convertRequestDTO) {', '    baseNumberRepository.save(new BaseNumber(…));', '    BaseNumber baseNumber =', '            baseNumberRepository.findLast();', '    …'].join('\n')),
    j(['// AFTER — controller/ConvertController.java', 'baseNumberRepository.save(convertRequestDTO);', '', 'convertResponseDTO = convertService.convert(', '        baseNumberRepository.findLast(),', '        convertRequestDTO.getOutputBase());', '', '// service/ConvertService.java: no repository', 'public ConvertResponseDTO convert(', '        BaseNumber baseNumber, Base outputBase)'].join('\n')),
    '✗ "CRUD must not be in the service"', '✓ controller does CRUD, service converts') +
    box('Same day, same version', `<p style="margin:0">lint.py: <b>15 violations</b> (no Javadoc, ${c('List')}, no empty constructor) and errors like ${c('"You must input a number."')}.</p>`, 'do2') },

  /* 6 */
  { t: 'constants: the Base enum and the messages', body: two(
    j(['public enum Base {', '    BINARY(1, 2, "BIN"),', '    DECIMAL(2, 10, "DEC"),', '    HEXADECIMAL(3, 16, "HEX");', '', '    private int menuChoice;', '    private int radix;', '    private String label;', '    …', boChuThich(ham(`${S}/constants/Base.java`, 'getAllowedDigits')).split('\n').map((l) => '    ' + l).join('\n'), boChuThich(ham(`${S}/constants/Base.java`, 'findByChoice')).split('\n').map((l) => '    ' + l).join('\n'), '}'].join('\n')),
    col(box('An error says what is wrong', `<p style="margin:0">${c('"1G" khong phai so he HEX hop le.')}<br>${c('He HEX chi dung cac chu so: 0123456789ABCDEF.')}</p>`, 'ok'),
      box('Why an enum', `<p style="margin:0">Three fixed values with data (menu number, radix, label). ${c('findByChoice')} can only return one of them — never an invalid base.</p>`, 'lam')), 'r64') },

  /* 7 */
  { t: 'Validation: check the digits before converting', body: two(
    j(boChuThich(ham(`${S}/utils/Validation.java`, 'checkValue')).replace('public static void checkValue(String value, Base base) throws Exception {', 'public static void checkValue(String value, Base base)\n        throws Exception {').replace('if (digits.startsWith(Constants.MINUS) || digits.startsWith(Constants.PLUS)) {', 'if (digits.startsWith(Constants.MINUS)\n            || digits.startsWith(Constants.PLUS)) {').replace('int digitValue = Constants.DIGITS.indexOf(digits.charAt(i));', 'int digitValue =\n            Constants.DIGITS.indexOf(digits.charAt(i));').replace("throw new Exception(String.format(Message.INVALID_VALUE, value, base.getLabel(),\n                    base.getLabel(), base.getAllowedDigits()));", 'throw new Exception(…INVALID_VALUE…);').replace("throw new Exception(String.format(Message.INVALID_VALUE, value, base.getLabel(),\n                        base.getLabel(), base.getAllowedDigits()));", 'throw new Exception(…INVALID_VALUE…);')),
    col(steps(['upper-case: "ff" = "FF"', 'drop one leading + or −', 'a sign alone ⇒ error', `each char: ${c('indexOf')} in "0123456789ABCDEF"`, `−1 or ≥ radix ⇒ error`]),
      P(R(37, 37) + '\n' + R(44, 44), { title: 'real', sm: true })), 'r64') },

  /* 8 */
  { t: 'Repository: save and findLast', body: two(
    j(boChuThich(ham(`${S}/repository/BaseNumberRepository.java`, 'save')) + '\n\n' + boChuThich(ham(`${S}/repository/BaseNumberRepository.java`, 'findLast'))),
    col(box('DTO in, model stored', `<p style="margin:0">The repository is the layer that turns the request into a ${c('BaseNumber')} — so the controller never imports ${c('model')}.</p>`, 'ok'),
      box('Names and types', `<p style="margin:0">${c('ArrayList<BaseNumber> baseNumberList')} — concrete type (V5), name ending in ${c('List')} (1.5).</p>`, 'lam')), 'r64'), giua: true },

  /* 9 */
  { t: 'Service: any base to decimal, without overflow', body: two(
    j(boChuThich(ham(`${S}/service/ConvertService.java`, 'convertToDecimal')), { hl: [11, 12, 14] }),
    col(box('Check before multiplying', `<p style="margin:0">${c('result * radix + digit')} must stay ≤ ${c('Long.MAX_VALUE')}. Turned around: ${c('result > (MAX − digit) / radix')} ⇒ too big.</p>`, 'do2'),
      P(R(80, 80), { title: '65 binary ones — real', sm: true }),
      box('Why long', `<p style="margin:0">${c('int')} stops at 2 147 483 647 — 32 binary digits already overflow it.</p>`, 'lam')), 'r64') },

  /* 10 */
  { t: 'Service: decimal to any base with a StringBuilder', body: vsd(
    j(['// BEFORE (checklist 3.8 ✗)', 'String result = "";', 'while (left > 0) {', '    result = DIGITS.charAt((int) (left % radix))', '            + result;', '    left = left / radix;', '}'].join('\n')),
    j(boChuThich(ham(`${S}/service/ConvertService.java`, 'convertFromDecimal')).split('\n').slice(3, 14).join('\n').replace(/^ {4}/gm, '').replace('digitBuilder.append(Constants.DIGITS.charAt((int) (remainingValue % radix)));', 'digitBuilder.append(Constants.DIGITS.charAt(\n            (int) (remainingValue % radix)));')),
    '✗ a new String every turn', '✓ append, then reverse() once') + P(R(9, 9) + '\n' + R(59, 59), { title: 'real', sm: true }) },

  /* 11 */
  { t: 'Controller and Main: one call, three steps', body: two(
    j(boChuThich(ham(`${S}/controller/ConvertController.java`, 'convert')).replace('public void convert(ConvertRequestDTO convertRequestDTO) throws Exception {', 'public void convert(ConvertRequestDTO convertRequestDTO)\n        throws Exception {').replace('convertResponseDTO = convertService.convert(baseNumberRepository.findLast(),\n            convertRequestDTO.getOutputBase());', 'convertResponseDTO = convertService.convert(\n            baseNumberRepository.findLast(),\n            convertRequestDTO.getOutputBase());')),
    col(box('Main, each turn', `<p style="margin:0">menu → ${c('promptInputBase')} (0 = Goodbye) → build the DTO with ${c('promptOutputBase')}, ${c('promptValue')} → ${c('Validation.checkValue')} → <b>one</b> ${c('convertController.convert(dto)')} → a throw is printed by the ${c('catch')}.</p>`, 'lam'),
      box('Checklist', `<p style="margin:0">four variables declared at the <b>top</b> of ${c('main')} (2.6) · ${c('return')}, never ${c('System.exit')} · ${c('Scanner')} local.</p>`, 'ok')), 'r64') +
    luong([['Main', 'checkValue, then\none call', PG], ['Repository', 'save · findLast', XANH], ['Service', 'convert', CAM], ['View', 'display()', PG]], { h: 140, fs: 16 }) },

  /* 12 */
  { t: 'The real run, lint and JDK 8', body: two(
    P(boNhac(ra('l211-p0011/solution:run', [7, 9])) + '\n' + R(16, 16) + '\n' + R(23, 23) + '\n' + R(30, 30) + '\n' + R(51, 52) + '\n' + R(66, 66) + '\n' + R(73, 73), { title: 'test keys — real output (prompts hidden)', sm: true }),
    col(psql(ra('l211-p0011/solution:lint'), { title: 'python3 lint.py' }), psql(ra('l211-p0011/solution:check'), { title: './check.sh' }),
      box('JDK 8', `<p style="margin:0">a real ${c('eclipse-temurin:8-jdk')} prints the same 87 lines · paper checklist audit: <b>0 violations</b>.</p>`, 'ok')), 'r64') },

  /* 13 */
  { t: 'What the lecturer asks', body: tbl(['Question', 'Answer'], [
    ['Why does the service not call the repository?', 'service = business work, repository = data, controller directs (S of SOLID)'],
    ['Why does the controller not import model?', `it passes ${c('findLast()')} straight to the service; the repository builds the model`],
    ['An algorithm lab — why a repository?', 'checklist 1.1: compulsory · it keeps the history'],
    ['535 → 217?', '÷16 remainders 7, 1, 2, read upwards'],
    ['Why long? A huge number?', 'int overflows at 2³¹−1 · checked before × ⇒ message'],
    ['Add base 8?', `${c('OCTAL(4, 8, "OCT")')} + ${c('BASE_MAX = 4')} + menu — no algorithm changes`],
  ]), giua: true },
]);
