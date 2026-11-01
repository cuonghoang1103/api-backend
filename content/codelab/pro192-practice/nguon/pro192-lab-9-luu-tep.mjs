/** PRO192 · Lab 9 — CT Library: lưu dữ liệu ra tệp (FileBookRepository, CSV UTF-8, dòng hỏng, tệp tạm, đổi một dòng). Nguồn: gen/lab/lab9. */
import { moDun, deLab } from './_chung.mjs';

const de = deLab('lab9', {
  tieuDe: { en: 'Lab 9 — CT Library: saving to a file', vi: 'Lab 9 — CT Library: lưu dữ liệu ra tệp' },
  phut: 180,
  khaiNiem: ['FileBookRepository implements IBookRepository', 'CSV in UTF-8 (BOM, quotes)', 'broken lines skipped with their number', 'write to a temp file then replace'],
  moTa: {
    en: `<p><b>Ticket CTL-9.</b> The data must survive switching the computer off. <code>FileBookRepository</code> implements the same <code>IBookRepository</code> as the in-memory one (Lab 5), on <code>data/books.csv</code> in UTF-8: a BOM at the start is skipped, a title containing a comma is quoted, a broken line is skipped and reported with its line number, and saving writes a temporary file first and then replaces the real one (a crash in the middle never leaves half a file). Switching from memory to file is <b>one line</b> in the controller.</p>
<p>The grader runs the program <b>twice in the same folder</b> (case 1 = <code>harness/input.txt</code>, then <code>harness/input-2.txt</code> after a restart) starting from the lab’s <code>data/books.csv</code> — what the first run saved must be there in the second. Your TODOs are listed below; the walkthrough is lesson <b>Lab 9</b> of the course.</p>`,
    vi: `<p><b>Ticket CTL-9.</b> Dữ liệu phải sống qua lần tắt máy. <code>FileBookRepository</code> cài cùng <code>IBookRepository</code> với kho trong bộ nhớ (Lab 5), trên <code>data/books.csv</code> mã UTF-8: BOM ở đầu được bỏ qua, tên có dấu phẩy được đặt trong ngoặc kép, dòng hỏng bị bỏ kèm số dòng, và lưu thì ghi ra tệp tạm trước rồi mới thay tệp thật (sập giữa chừng không để lại nửa tệp). Đổi từ bộ nhớ sang tệp là <b>một dòng</b> trong controller.</p>
<p>Máy chấm chạy chương trình <b>hai lần trong cùng thư mục</b> (ca 1 = <code>harness/input.txt</code>, rồi <code>harness/input-2.txt</code> sau khi mở lại) bắt đầu từ <code>data/books.csv</code> của lab — thứ lần đầu đã lưu phải còn ở lần sau. Các TODO liệt kê bên dưới; hướng dẫn là bài <b>Lab 9</b> của khoá.</p>`,
  },
  thay: [['clean code, a handbook', 'the clean coder, a guide'], ['robert martin', 'uncle   bob']],
  menuRac: '2',
  goiY: [
    { en: 'Reading: new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8); if the first line starts with \\uFEFF, cut that character off.', vi: 'Đọc: new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8); dòng đầu bắt đầu bằng \\uFEFF thì cắt ký tự đó.' },
    { en: 'Writing a field that contains a comma: wrap it in double quotes (and double any quote inside). Reading must understand the same quoting.', vi: 'Ghi trường có dấu phẩy: bọc trong ngoặc kép (và nhân đôi ngoặc kép bên trong). Phần đọc phải hiểu đúng cách bọc đó.' },
    { en: 'Save = write books.csv.tmp completely, close it, then replace books.csv with it.', vi: 'Lưu = ghi trọn books.csv.tmp, đóng lại, rồi thay books.csv bằng nó.' },
  ],
  loiHayGap: [
    { en: 'new FileReader / FileWriter without a charset — on Windows with JDK 8–17 "Mắt Biếc" is saved as "M?t Bi?c".', vi: 'new FileReader / FileWriter không chỉ bảng mã — trên Windows với JDK 8–17 "Mắt Biếc" bị lưu thành "M?t Bi?c".' },
    { en: 'Forgetting to close (or flush) the writer — the second run finds an empty or truncated file.', vi: 'Quên đóng (hoặc flush) writer — lần chạy thứ hai thấy tệp rỗng hoặc bị cắt.' },
    { en: 'split(",") on a quoted title — "Refactoring, Second Edition" becomes two fields and the line is reported as broken.', vi: 'split(",") trên tên có ngoặc kép — "Refactoring, Second Edition" thành hai trường và dòng bị báo hỏng.' },
  ],
  giaiThich: { en: '<p>The reference solution is the course’s Lab 9 solution (lint.py clean, javac --release 8, same output on JDK 8; collection declarations switched to List/Map/Set per the 29/10 LAB211 rule). The controller still talks to IBookRepository only — the file implementation slots in behind the interface prepared in Lab 5.</p>', vi: '<p>Lời giải là đáp án Lab 9 của khoá (sạch lint.py, javac --release 8, cùng output trên JDK 8; khai báo collection đổi sang List/Map/Set theo luật LAB211 29/10). Controller vẫn chỉ nói chuyện với IBookRepository — lớp lưu tệp cắm vào sau interface đã chuẩn bị từ Lab 5.</p>' },
});

export default moDun({ slug: 'pro192-lab-9-luu-tep', ten: '9.3 Lab 9 — CT Library: saving to a file', de: [de] });
