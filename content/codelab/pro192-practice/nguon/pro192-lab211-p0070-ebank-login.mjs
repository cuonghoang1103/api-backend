/** PRO192 · L.4 🎓 LAB211 J1.S.P0070 Ebank Login (150 LOC) — ResourceBundle 2 tệp .properties + captcha NGẪU NHIÊN ⇒ máy chấm đọc captcha từ màn hình rồi gõ lại ({CAP1}/{CAPMID}/{CAP}), che thành XXXXX. Nguồn: gen/lab/l211-p0070. */
import { moDun, deLab, c } from './_chung.mjs';

const de = deLab('l211-p0070', {
  tieuDe: { en: 'L.4 — LAB211 J1.S.P0070: Ebank Login (two languages, random captcha)', vi: 'L.4 — LAB211 J1.S.P0070: Đăng nhập Ebank (hai ngôn ngữ, captcha ngẫu nhiên)' },
  phut: 150,
  khaiNiem: ['ResourceBundle + Language_en/_vi.properties', 'regex: 10 digits, 8–31 alphanumeric with letters and digits', 'random captcha (Random → index → char)', 'captcha checked with contains(), blank refused', 'captcha checked BEFORE the account'],
  captcha: { show: 'Captcha: ([A-Za-z0-9]{5})(?![A-Za-z0-9])', as: 'XXXXX', prompt: '(Enter a Captcha incorrect characters|Nhap 1 ky tu captcha): $' },
  moTa: {
    en: `<p><b>J1.S.P0070 (150 LOC).</b> Menu 1 Vietnamese · 2 English · 3 Exit; choosing a language switches every sentence (${c('Resource.setLocate')} loads ${c('constants/Language_vi.properties')} or ${c('Language_en.properties')} — both files are given in ${c('src/constants/')}), then a login asks, each one again until it is right: the account number (exactly 10 digits — ${c('checkAccountNumber')}), the password (8 to 31 characters, letters and digits, at least one of each — ${c('checkPassword')}), and a captcha: ${c('generateCaptcha')} makes 5 random characters (A–Z, a–z, 0–9) <b>new at every login</b>, prints ${c('Captcha: Xy7Qa')}, and the user types one or more of its characters — ${c('checkCaptcha')} accepts a non-blank text that the captcha ${c('contains()')}. Only after the captcha is right does the controller ask the repository whether the account and password match (4 sample accounts) and print success or failure. The sentences are the brief’s, mistakes included ("must is a number").</p>
<p><b>How a random captcha is graded:</b> the input files contain ${c('{CAP1}')} (the 1st character of the captcha), ${c('{CAPMID}')} (the 2nd and 3rd) or ${c('{CAP}')} (all 5). The grader types the input line by line; at such a line it waits until your program waits at the captcha prompt, reads the <b>last</b> ${c('Captcha: …')} you printed and types those characters. In the comparison every captcha shows as ${c('XXXXX')}. A captcha that is not 5 letters/digits stays visible and the line differs; the same captcha at every login (3 or more) fails the case. The ${c('.properties')} files are copied next to your classes, so ${c('ResourceBundle.getBundle("constants/Language", locale)')} finds them.</p>`,
    vi: `<p><b>J1.S.P0070 (150 LOC).</b> Menu 1 Vietnamese · 2 English · 3 Exit; chọn ngôn ngữ là đổi mọi câu chữ (${c('Resource.setLocate')} nạp ${c('constants/Language_vi.properties')} hoặc ${c('Language_en.properties')} — hai tệp có sẵn trong ${c('src/constants/')}), rồi đăng nhập, ô nào sai hỏi lại ô đó: số tài khoản (đúng 10 chữ số — ${c('checkAccountNumber')}), mật khẩu (8 tới 31 ký tự, chữ và số, mỗi loại ít nhất một — ${c('checkPassword')}), và captcha: ${c('generateCaptcha')} sinh 5 ký tự ngẫu nhiên (A–Z, a–z, 0–9) <b>mới ở mỗi lần đăng nhập</b>, in ${c('Captcha: Xy7Qa')}, người dùng gõ một hay nhiều ký tự của nó — ${c('checkCaptcha')} nhận chuỗi không trống mà captcha ${c('contains()')}. Chỉ khi captcha đúng thì controller mới hỏi repository xem tài khoản và mật khẩu có khớp (4 tài khoản mẫu) rồi in thành công hay thất bại. Câu chữ giữ nguyên của đề, kể cả lỗi tiếng Anh ("must is a number").</p>
<p><b>Chấm captcha ngẫu nhiên thế nào:</b> tệp input có ${c('{CAP1}')} (ký tự thứ 1 của captcha), ${c('{CAPMID}')} (ký tự 2 và 3) hoặc ${c('{CAP}')} (cả 5). Máy chấm gõ input từng dòng; tới dòng như vậy nó đợi chương trình của bạn dừng ở lời nhắc captcha, đọc ${c('Captcha: …')} <b>cuối cùng</b> bạn in rồi gõ đúng các ký tự đó. Khi so, mọi captcha hiện thành ${c('XXXXX')}. Captcha không phải 5 chữ/số thì giữ nguyên và lệch dòng; cùng một captcha ở mọi lần đăng nhập (từ 3 lần) thì trượt ca. Các tệp ${c('.properties')} được chép cạnh các lớp đã biên dịch, nên ${c('ResourceBundle.getBundle("constants/Language", locale)')} tìm thấy.</p>`,
  },
  thay: [['1029817261', '1059817261'], ['matkhau123a', 'tpbank2026AB'], ['0123456789', '9876543210']],
  menuRac: '2\n1029817261\nmatkhau123a\n{CAPMID}', menuThoat: '3',
  ca: [
    {
      ten: { en: 'four logins (VI, EN, EN, VI): whole captcha, wrong captcha "#", too long, blank, wrong password, 11 digits, a password without digits', vi: 'bốn lần đăng nhập (VI, EN, EN, VI): cả captcha, captcha sai "#", quá dài, trống, sai mật khẩu, 11 chữ số, mật khẩu không có số' },
      vao: '1\n1049817261\nebank789xyz1\n#\n{CAP}\n2\n1059817261\ntpbank2026AB\nxxxxxxxxx\n\n{CAPMID}\n2\n1029817261\nmatkhau123b\n{CAP1}\n1\n12345678901\n1039817261\nnganhang\nnganhang4567\n{CAP1}\n3\n',
      an: true,
    },
  ],
  goiY: [
    { en: 'Random random = new Random(); for 5 times: append CHARS.charAt(random.nextInt(CHARS.length())) — create the captcha inside the login, not once in main().', vi: 'Random random = new Random(); lặp 5 lần: nối CHARS.charAt(random.nextInt(CHARS.length())) — sinh captcha bên trong mỗi lần đăng nhập, không phải một lần ở main().' },
    { en: 'Regex in Constants: "^[0-9]{10}$" for the account, "^(?=.*[A-Za-z])(?=.*\\\\d)[A-Za-z\\\\d]{8,31}$" for the password.', vi: 'Regex trong Constants: "^[0-9]{10}$" cho số tài khoản, "^(?=.*[A-Za-z])(?=.*\\\\d)[A-Za-z\\\\d]{8,31}$" cho mật khẩu.' },
    { en: 'Every sentence goes through Resource.getString(key) so that switching the language switches all of them.', vi: 'Mọi câu chữ đi qua Resource.getString(key) để đổi ngôn ngữ là đổi hết.' },
  ],
  loiHayGap: [
    { en: 'captcha.contains("") is true — a blank line must be refused before contains().', vi: 'captcha.contains("") luôn true — dòng trống phải bị từ chối trước contains().' },
    { en: 'Checking the account in the repository before the captcha — the lecturer’s P0070 remark: the captcha comes first.', vi: 'Kiểm tài khoản trong repository trước captcha — đúng chỗ thầy nhận xét ở P0070: captcha trước.' },
    { en: 'Creating one captcha in main() and reusing it for every login.', vi: 'Sinh một captcha ở main() rồi dùng lại cho mọi lần đăng nhập.' },
  ],
  giaiThich: { en: '<p>The reference is the course’s P0070 after the 29/10 review (captcha checked in Main before the controller touches the repository, no pass-through service, the view prints once). Randomness is kept — the grader adapts to it instead of asking you to fake it.</p>', vi: '<p>Lời giải là P0070 của khoá sau buổi review 29/10 (captcha kiểm ở Main trước khi controller đụng repository, bỏ service chỉ chuyển tiếp, view in một lần). Tính ngẫu nhiên được giữ — máy chấm tự thích nghi chứ không bắt bạn làm giả.</p>' },
});

export default moDun({ slug: 'pro192-lab211-p0070-ebank-login', ten: '10.4 🎓 L.4 LAB211 J1.S.P0070 — Ebank Login', de: [de] });
