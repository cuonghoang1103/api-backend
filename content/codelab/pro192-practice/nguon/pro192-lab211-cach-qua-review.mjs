/**
 * PRO192 · L.0 🎓 LAB211 thực chiến — cách qua review của thầy: khung chung Note Management (8 package) dựng từ TODO, rồi ba đề
 * "sửa lỗi thầy đã bắt" (cài vào đúng đáp án): lỗi hay gặp (in ở controller, ArrayList khai báo, Scanner static, System.exit, số
 * viết thẳng), service giữ repository (P0011 26/10), cú pháp Java mới không chạy trên JDK 8 phòng lab. Nguồn: gen/lab/l211-review.
 */
import { moDun, deLab, c } from './_chung.mjs';

const TIEU_DE_KHUNG = { en: 'L.0 — The LAB211 frame: Note Management in 8 packages', vi: 'L.0 — Khung LAB211: Note Management đủ 8 package' };

const goiYChung = [
  { en: 'Main reads and checks every value (Validation throws an Exception carrying the Message text), then calls the controller ONCE per menu option.', vi: 'Main đọc và kiểm mọi giá trị (Validation ném Exception mang câu của Message), rồi gọi controller ĐÚNG MỘT LẦN cho mỗi lựa chọn menu.' },
  { en: 'The controller builds a ResponseDTO, hands it to the view (setResponseDTO) and calls display() once — it never prints itself.', vi: 'Controller dựng ResponseDTO, đưa cho view (setResponseDTO) rồi gọi display() một lần — nó không tự in.' },
  { en: 'Run node cham.mjs --case 1 --show to see your whole screen next to the input.', vi: 'Chạy node cham.mjs --case 1 --show để xem cả màn hình của bạn bên cạnh input.' },
];

const khung = deLab('l211-review', {
  tieuDe: TIEU_DE_KHUNG,
  phut: 90,
  khaiNiem: ['8 packages of the Guide (constants, model, dto, repository, controller, view, utils, main)', 'Main reads + validates, controller calls once per option', 'Validation throws the Message text', 'View prints from its ResponseDTO'],
  moTa: {
    en: `<p><b>The frame every LAB211 assignment reuses.</b> A tiny note book — 1 Add Note · 2 Delete Note · 3 Display Note · 4 Exit — written exactly the way the lecturer reviews: every sentence in ${c('Message')}, every number in ${c('Constants')}, the keyboard only in ${c('main')}, the data only in ${c('NoteRepository')}, the screen only in ${c('NoteView')}. A new note gets ID = last ID + 1 (the first one, or the first after everything was deleted, gets 1). A wrong menu choice, a blank content or an ID that is not a number prints a sentence that says what is wrong and what to type, and the menu comes back — the program never stops on bad input.</p>
<p>The given code keeps the constants, model, DTOs, view and the menu loop of ${c('main')}; you write the controller, the repository, the checks of ${c('Validation')} and the input methods of ${c('Main')}. Lesson <b>L.0</b> of the course walks through the same project file by file.</p>`,
    vi: `<p><b>Khung mà mọi bài LAB211 dùng lại.</b> Một sổ ghi chú nhỏ — 1 Add Note · 2 Delete Note · 3 Display Note · 4 Exit — viết đúng cách thầy review: mọi câu chữ ở ${c('Message')}, mọi con số ở ${c('Constants')}, bàn phím chỉ ở ${c('main')}, dữ liệu chỉ ở ${c('NoteRepository')}, màn hình chỉ ở ${c('NoteView')}. Ghi chú mới có ID = ID cuối + 1 (cái đầu tiên, hoặc cái đầu tiên sau khi xoá hết, được 1). Chọn menu sai, nội dung trống hay ID không phải số đều in một câu nói rõ sai gì và phải nhập gì, rồi menu hiện lại — chương trình không bao giờ dừng vì nhập sai.</p>
<p>Code cho sẵn giữ constants, model, DTO, view và vòng menu của ${c('main')}; bạn viết controller, repository, các phép kiểm của ${c('Validation')} và các hàm nhập của ${c('Main')}. Bài <b>L.0</b> của khoá đi qua đúng dự án này từng tệp.</p>`,
  },
  thay: [['Mua sach PRO192', 'Nop bai LAB211 P0071'], ['Hoc LAB211 moi toi', 'Doc slide PRO192 chuong 8']],
  menuRac: '3', menuThoat: '4',
  ca: [
    { ten: { en: 'delete everything, the next note gets ID 1 again; deleting twice is refused', vi: 'xoá hết, ghi chú kế tiếp lại có ID 1; xoá hai lần bị từ chối' }, vao: '1\nA\n1\nB\n2\n1\n2\n1\n2\n2\n3\n1\nC\n2\n 7 \n3\n4\n', an: true },
  ],
  goiY: goiYChung,
  loiHayGap: [
    { en: 'Printing in the controller or the repository ("Them xong") — the lecturer opens the file, sees System.out outside view/main and stops the review (rule T1).', vi: 'In ở controller hoặc repository ("Them xong") — thầy mở tệp, thấy System.out ngoài view/main là dừng review (luật T1).' },
    { en: 'ID = size() + 1: after deleting note 1 of [1, 2] the next note gets 2 again — a duplicate ID. Use the last ID + 1.', vi: 'ID = size() + 1: xoá ghi chú 1 trong [1, 2] thì ghi chú sau lại được 2 — trùng ID. Dùng ID cuối + 1.' },
    { en: 'Integer.parseInt("") without a try/catch — a blank line crashes the program instead of printing the message and showing the menu again.', vi: 'Integer.parseInt("") không try/catch — một dòng trống làm sập chương trình thay vì in câu báo và hiện lại menu.' },
  ],
  giaiThich: { en: '<p>The reference is the course’s LAB211 frame (lint.py clean, javac --release 8, checklist 0 violations; declarations switched to List per the 29/10 rule). The four layers each have one job, so the lecturer’s usual questions — "where is the data?", "who prints?", "where is the check?" — each have a one-file answer.</p>', vi: '<p>Lời giải là khung LAB211 của khoá (sạch lint.py, javac --release 8, tờ checklist 0 vi phạm; khai báo đổi sang List theo luật 29/10). Bốn tầng mỗi tầng một việc, nên các câu thầy hay hỏi — "dữ liệu ở đâu?", "ai in?", "kiểm ở đâu?" — đều trả lời bằng đúng một tệp.</p>' },
});

const loiHayGap = deLab('l211-review', {
  id: 'pro192-l211-review-loi-thuong-gap',
  tieuDe: { en: 'L.0 — Fix the 5 review errors the lecturer catches first', vi: 'L.0 — Sửa 5 lỗi review thầy bắt đầu tiên' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['System.exit', 'printing outside view', 'List declaration (29/10 rule)', 'static Scanner', 'magic number'],
  moTa: {
    en: `<p>The same Note Management, finished — with five lines copied from real submissions the lecturer rejected. It compiles and almost runs right. Find and fix: a print in the controller, a collection declared with its concrete class, a ${c('static Scanner')} field, a ${c('System.exit')} instead of leaving the loop, a bound of the menu written as a bare number. Fix exactly those five places (the lecturer’s rule: "I caught N things, change N things") — the grader compares the whole screen and checks the rules.</p>`,
    vi: `<p>Vẫn Note Management, đã xong — nhưng có năm dòng chép từ bài nộp thật bị thầy trả lại. Biên dịch được và chạy gần đúng. Tìm và sửa: một lệnh in trong controller, một collection khai báo bằng lớp cụ thể, một trường ${c('static Scanner')}, một ${c('System.exit')} thay cho thoát vòng lặp, một cận của menu viết bằng số trần. Sửa đúng năm chỗ đó (luật của thầy: "thầy bắt N chỗ thì sửa N chỗ") — máy chấm so cả màn hình và soát luật.</p>`,
  },
  bay: {
    thay: [
      { tep: 'controller/NoteController.java', tim: '        int noteId = noteRepository.addNote(requestDTO);\n', thanh: '        int noteId = noteRepository.addNote(requestDTO);\n        System.out.println("Them xong");\n' },
      { tep: 'repository/NoteRepository.java', tim: '    private List<Note> noteList;', thanh: '    private ArrayList<Note> noteList;' },
      { tep: 'main/Main.java', tim: '    // Private constructor: Main only has static methods (checklist 3.4).\n    private Main() {\n    }\n', thanh: '    private static Scanner sc = new Scanner(System.in);\n\n    // Private constructor: Main only has static methods (checklist 3.4).\n    private Main() {\n    }\n' },
      { tep: 'main/Main.java', tim: '        Scanner sc = new Scanner(System.in);\n', thanh: '' },
      { tep: 'main/Main.java', tim: '                        running = false;\n', thanh: '                        System.exit(0);\n' },
      { tep: 'main/Main.java', tim: 'return Validation.getChoice(line, Constants.MENU_MIN, Constants.MENU_EXIT);', thanh: 'return Validation.getChoice(line, Constants.MENU_MIN, 4);' },
    ],
  },
  quyTac: [{ id: 'T5', en: 'no bare number in the menu bounds — use Constants.MENU_MIN / MENU_EXIT', vi: 'không viết số trần ở cận menu — dùng Constants.MENU_MIN / MENU_EXIT', re: String.raw`Validation\s*\.\s*getChoice\s*\([^;]*\b\d+\b`, file: '^main/' }],
  thay: [['Mua sach PRO192', 'Nop bai LAB211 P0071']],
  goiY: [
    { en: 'Run the grader first: the rules L1, L3, T1, T4, T5 print the file and line of each problem.', vi: 'Chạy máy chấm trước: luật L1, L3, T1, T4, T5 in tệp và dòng của từng lỗi.' },
    { en: 'Without System.exit the loop needs a flag: running = false, and the GOODBYE line is printed on the way out.', vi: 'Không System.exit thì vòng lặp cần cờ: running = false, và dòng GOODBYE được in khi ra.' },
  ],
  loiHayGap: [
    { en: 'Moving the Scanner into every input method (new Scanner(System.in) many times) — create it once in main() and pass it as a parameter.', vi: 'Dời Scanner vào từng hàm nhập (new Scanner(System.in) nhiều lần) — tạo một lần trong main() rồi truyền làm tham số.' },
    { en: 'Fixing more than the five lines (renaming, reformatting) — the lecturer then has to re-read the whole project.', vi: 'Sửa lan ra ngoài năm dòng (đổi tên, định dạng lại) — thầy lại phải đọc lại cả dự án.' },
  ],
  giaiThich: { en: '<p>Each trap is one line taken from a rejected submission (course lesson L.0, "common errors" trap, run through lint.py). Since 29/10 the lecturer wants the interface type on the left (List) and the class only after new — the old "declare ArrayList" advice is reversed.</p>', vi: '<p>Mỗi bẫy là một dòng lấy từ bài nộp bị trả lại (bài L.0 của khoá, bẫy "lỗi thường gặp", đã chạy lint.py). Từ 29/10 thầy muốn kiểu interface bên trái (List) và lớp cụ thể chỉ sau new — lời khuyên cũ "khai báo ArrayList" đã bị đảo ngược.</p>' },
});

const serviceGiuRepo = deLab('l211-review', {
  id: 'pro192-l211-review-service-giu-repo',
  tieuDe: { en: 'L.0 — "CRUD must not be in the service": take the repository out', vi: 'L.0 — "CRUD không được nằm trong service": đưa repository ra' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['controller holds the repository', 'service = business only', 'single responsibility'],
  moTa: {
    en: `<p>This version compiles, runs perfectly, and even passes lint.py — and the lecturer still rejected it (P0011, 26/10): ${c('NoteService')} creates its own ${c('NoteRepository')} and calls the CRUD itself, and the controller only talks to the service. "CRUD must not be in the service — take the repository calls out." Restructure: the controller holds the repository and calls it; a service is kept only if it has business work of its own (here it has none — delete it). The screen must stay exactly the same.</p>`,
    vi: `<p>Bản này biên dịch được, chạy đúng hết, qua cả lint.py — vậy mà thầy vẫn trả lại (P0011, 26/10): ${c('NoteService')} tự tạo ${c('NoteRepository')} và tự gọi CRUD, còn controller chỉ nói chuyện với service. "CRUD không được nằm trong service — mấy cái repo gọi trong service đưa ra hết ngoài." Sắp lại: controller giữ repository và gọi nó; service chỉ giữ lại khi có nghiệp vụ riêng (ở đây không có — xoá đi). Màn hình phải giữ nguyên.</p>`,
  },
  bay: {
    tepMoi: {
      'service/NoteService.java': `package service;

import dto.NoteRequestDTO;
import java.util.List;
import repository.NoteRepository;

/**
 * SERVICE (the WRONG version): creates and holds the repository and calls the CRUD itself.
 *
 * @author CuongThai Academy
 */
public class NoteService {

    // The notes - WRONG: a service must not hold the repository.
    private NoteRepository noteRepository;

    // Creates the service together with its repository.
    public NoteService() {
        noteRepository = new NoteRepository();
    }

    // Adds a note: the service calls the repository itself.
    public int addNote(NoteRequestDTO requestDTO) {
        return noteRepository.addNote(requestDTO);
    }

    // Deletes a note: the service calls the repository itself.
    public void deleteNote(NoteRequestDTO requestDTO) throws Exception {
        noteRepository.deleteNote(requestDTO);
    }

    // The rows of the table: the service calls the repository itself.
    public List<String> getDataNotes() {
        return noteRepository.getDataNotes();
    }
}
`,
    },
    thay: [
      { tep: 'controller/NoteController.java', tim: 'import repository.NoteRepository;\n', thanh: 'import service.NoteService;\n' },
      { tep: 'controller/NoteController.java', tim: '    // Where the notes are stored.\n    private NoteRepository noteRepository;', thanh: '    // The service that (wrongly) owns the repository.\n    private NoteService noteService;' },
      { tep: 'controller/NoteController.java', tim: '        noteRepository = new NoteRepository();', thanh: '        noteService = new NoteService();' },
      { tep: 'controller/NoteController.java', tim: '        int noteId = noteRepository.addNote(requestDTO);', thanh: '        int noteId = noteService.addNote(requestDTO);' },
      { tep: 'controller/NoteController.java', tim: '        noteRepository.deleteNote(requestDTO);', thanh: '        noteService.deleteNote(requestDTO);' },
      { tep: 'controller/NoteController.java', tim: '        responseDTO.setRowList(noteRepository.getDataNotes());', thanh: '        responseDTO.setRowList(noteService.getDataNotes());' },
    ],
  },
  goiY: [
    { en: 'Look at the imports: a class under service/ that imports repository.* is the problem the lecturer sees in five seconds.', vi: 'Nhìn phần import: một lớp trong service/ mà import repository.* là thứ thầy thấy trong năm giây.' },
    { en: 'Deleting the whole file src/service/NoteService.java is allowed — a layer without business work is not required.', vi: 'Được xoá hẳn tệp src/service/NoteService.java — tầng không có nghiệp vụ thì không bắt buộc.' },
  ],
  loiHayGap: [
    { en: 'Keeping the service and passing the repository into its constructor — it still holds the repository (rule T3 fails).', vi: 'Giữ service rồi truyền repository vào constructor của nó — nó vẫn giữ repository (luật T3 trượt).' },
    { en: 'Deleting the service but leaving "import service.NoteService;" in the controller — javac stops on the missing package.', vi: 'Xoá service nhưng để lại "import service.NoteService;" trong controller — javac dừng vì thiếu package.' },
  ],
  giaiThich: { en: '<p>The controller decides who is called: repository for data (CRUD), service for computation, view for printing. If the storage changes (file, database) only the repository changes — the S of SOLID, and exactly the sentence the lecturer used on 26/10.</p>', vi: '<p>Controller quyết định gọi ai: repository cho dữ liệu (CRUD), service cho tính toán, view cho việc in. Đổi cách lưu (tệp, cơ sở dữ liệu) thì chỉ repository đổi — chữ S của SOLID, và đúng câu thầy nói ngày 26/10.</p>' },
});

const javaMoi = deLab('l211-review', {
  id: 'pro192-l211-review-java-8',
  tieuDe: { en: 'L.0 — It runs at home, not in the lab room: back to Java 8', vi: 'L.0 — Ở nhà chạy, lên phòng lab thì không: về lại Java 8' },
  doKho: 'EASY', phut: 15,
  khaiNiem: ['javac --release 8', 'var (Java 10)', 'List.of (Java 9)'],
  moTa: {
    en: `<p>The LAB211 room runs <b>JDK 8</b>. This Note Management compiles on the JDK 21 at home and fails in front of the lecturer: one ${c('var')} (Java 10) and one ${c('List.of()')} (Java 9) slipped in. The grader compiles like the lab room (${c('javac --release 8')} when your JDK is newer), so it starts with a compile error. Rewrite those two lines in Java 8 and keep the behaviour.</p>`,
    vi: `<p>Phòng LAB211 chạy <b>JDK 8</b>. Note Management này biên dịch ngon với JDK 21 ở nhà rồi hỏng ngay trước mặt thầy: lọt vào một ${c('var')} (Java 10) và một ${c('List.of()')} (Java 9). Máy chấm biên dịch như phòng lab (${c('javac --release 8')} khi JDK của bạn mới hơn), nên nó báo lỗi biên dịch ngay từ đầu. Viết lại hai dòng đó bằng Java 8, giữ nguyên hành vi.</p>`,
  },
  bay: {
    thay: [
      { tep: 'main/Main.java', tim: '        String line = "";\n', thanh: '        var line = "";\n' },
      { tep: 'repository/NoteRepository.java', tim: '        noteList = new ArrayList<>();', thanh: '        noteList = new ArrayList<>(List.of());' },
    ],
  },
  khoiDauLoi: true,
  goiY: [
    { en: 'var x = "" → String x = ""; new ArrayList<>(List.of()) → new ArrayList<>().', vi: 'var x = "" → String x = ""; new ArrayList<>(List.of()) → new ArrayList<>().' },
    { en: 'In NetBeans: Project Properties › Sources › Source/Binary Format = JDK 8 makes the IDE underline the same lines at home.', vi: 'Trong NetBeans: Project Properties › Sources › Source/Binary Format = JDK 8 thì IDE gạch đỏ đúng các dòng đó ngay ở nhà.' },
  ],
  loiHayGap: [
    { en: 'Testing only on the JDK 21 at home with the default settings — nothing warns you until the lab machine refuses to compile.', vi: 'Chỉ chạy thử trên JDK 21 ở nhà với cài đặt mặc định — không gì cảnh báo cho tới khi máy phòng lab từ chối biên dịch.' },
    { en: 'Records, switch arrows (case 1 ->), text blocks ("""), String.isBlank(), List.of / Map.of — all newer than Java 8.', vi: 'Record, switch mũi tên (case 1 ->), text block ("""), String.isBlank(), List.of / Map.of — đều mới hơn Java 8.' },
  ],
  giaiThich: { en: '<p>--release 8 checks both the syntax and the library against Java 8, which is what the lab machine will do. Setting the project to JDK 8 at home catches it before the review.</p>', vi: '<p>--release 8 kiểm cả cú pháp lẫn thư viện theo Java 8, đúng như máy phòng lab sẽ làm. Đặt dự án về JDK 8 ngay ở nhà là bắt được trước buổi review.</p>' },
});

export default moDun({ slug: 'pro192-lab211-cach-qua-review', ten: '10.0 🎓 L.0 LAB211 in practice — passing the lecturer’s review', de: [khung, loiHayGap, serviceGiuRepo, javaMoi] });
