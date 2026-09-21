/**
 * ============================================================
 * TỜ "CODING CHECK SHEET" CỦA THẦY — 25 MỤC, CHÉP TỪ TỜ GIẤY
 * ============================================================
 *
 * Thầy LAB211 phát tờ này ngày 21/09/2026 và review bài bằng CHÍNH NÓ: mỗi bài
 * có 3 cột tự soát, mục nào OK thì sinh viên điền "O", cả cột đủ "O" mới được
 * xin review. Sai một mục là bị reject.
 *
 * Tờ giấy CHẶT HƠN mọi thứ trang web dạy trước ngày đó (Guide.xlsx + lời thầy
 * buổi 1): repository bắt buộc, View nhận ResponseDTO qua THUỘC TÍNH và chỉ in
 * một lần mỗi luồng, Main làm hết nhập/validate/đọc file/mã hoá, tên biến phải
 * có đuôi List/Set/Map/Array, khai báo gom đầu block, dòng trống trước mọi
 * comment, ngoặc quanh từng phép so sánh… Phần lớn các mục chép gần nguyên từ
 * Java Code Conventions của Sun — chính tệp thầy phát (2.6 = §6.2, 3.7 = §6.3,
 * 2.8 = §8.1, 3.3 = §10.5.1).
 *
 * ─── MỘT DANH SÁCH, BA CHỖ DÙNG ───
 *   • prompt của mọi tính năng AI LAB211 (`CHECKLIST_CHO_PROMPT`)
 *   • bộ soát máy `soatJava.ts` — chấm các mục đo được bằng máy
 *   • bảng checklist bên phải Phòng Lab (API `GET /lab-rooms/checklist-thay`)
 * Chép tay danh sách này ra chỗ thứ tư là mầm lệch nhau — lần sau thầy đổi một
 * mục, ba bản chép còn lại âm thầm dạy sai.
 */

export type NhomMuc = 'Common' | 'Coding Convention' | 'Performance';

/**
 * Ai chấm được mục này:
 *   may    — máy đo chắc chắn (tên, dòng trống, ngoặc…); AI không được cãi
 *   ai     — cần hiểu nghĩa (danh từ/động từ, SOLID, hoa thường có chủ đích)
 *   ca-hai — máy bắt phần đo được, AI bắt phần còn lại (MVC, comment)
 */
export type AiCham = 'may' | 'ai' | 'ca-hai';

export interface MucChecklist {
  stt: string;
  nhom: NhomMuc;
  /** Nhãn ngắn cho bảng bên phải — đọc trên điện thoại. */
  ngan: string;
  /** Câu trên tờ giấy, giữ nguyên chữ của thầy. */
  nguyenVan: string;
  /** Làm thế nào cho đúng, một câu, có ví dụ. */
  cachDung: string;
  cham: AiCham;
}

/** Đổi khi LUẬT đổi: mọi bài giảng / kết quả chấm lưu trước đó bị coi là cũ. */
export const PHIEN_BAN_LUAT = '2026-09-21-to-giay';

export const CHECKLIST_THAY: readonly MucChecklist[] = [
  {
    stt: '1.1', nhom: 'Common', cham: 'ca-hai',
    ngan: 'MVC đúng tầng · có repository · View 1 lần/luồng qua ResponseDTO',
    nguyenVan: 'Đã đúng MVC chưa? + Main chỉ làm việc với Controller, DTO, Utils. Toàn bộ việc nhập dữ liệu/Validate/đọc từ file/mã hóa thực hiện ở Main. + Controller nhận input từ main qua DTO, gửi/nhận data qua Services (Repository), không làm việc với Model, chỉ gửi kết quả cần hiển thị sang View. Không thực hiện print thông tin gì ở controller. + Repository chỉ chứa data và CRUD methods đơn giản. Nếu có nghiệp vụ tính toán thì cần thêm Services và đảm bảo layer: Controller <-> Services <-> Repository <-> Model. Bắt buộc phải có repository. Cần hiển thị thông tin gì thì gọi qua View. Việc rendering khi gọi view chỉ được gọi 1 lần cho 1 luồng xử lý (Mỗi luồng tính là 1 switch - case ở Main). + Services/Repository nhận data từ controller (Có thể thông qua param nếu số param < 3) -> xử lý nghiệp vụ và trả kết quả về controller. Được giao tiếp với Model. Không thực hiện print thông tin gì ở đây. + Model chỉ làm nhiệm vụ miêu tả thực thể, không làm việc với View. Không thực hiện print thông tin gì ở đây. + View: Chỉ nhận thông tin từ Controller. Không nên truyền qua param mà phải nhận qua thuộc tính (Nên để ResponseDTO giống ví dụ).',
    cachDung: 'Main: Scanner + Validation (+ FileUtils/MD5Utils/CaptchaUtils), gói RequestDTO, mỗi case gọi controller đúng 1 lần. Controller → service → repository → model; nhận ResponseDTO, view.setResponseDTO(...) rồi view.display() một lần. Repository luôn có (bài thuật toán: giữ mảng số).',
  },
  {
    stt: '1.2', nhom: 'Common', cham: 'may',
    ngan: 'Package chữ thường, có nghĩa',
    nguyenVan: '+ Package là chữ thường, thể hiện được ý nghĩa chung của package',
    cachDung: 'constants · model · dto · repository · service · controller · view · utils · main.',
  },
  {
    stt: '1.3', nhom: 'Common', cham: 'ca-hai',
    ngan: 'Class chữ hoa, danh từ · interface I… · exception …Exception',
    nguyenVan: '+ Class bắt đầu bằng chữ hoa + Tên class bắt đầu bằng danh từ mô tả ý nghĩa của class. + Phải thể hiện được ý nghĩa mục đích của method + Đảm bảo S trong SOLID + Tên của class exception kết thúc bằng "Exception" + Tên của interface bắt đầu bằng "I"',
    cachDung: 'ISortStrategy, IDoctorRepository, CarException — không SortStrategy, ExceptionCar.',
  },
  {
    stt: '1.4', nhom: 'Common', cham: 'ca-hai',
    ngan: 'Method chữ thường, mở đầu bằng động từ, một việc',
    nguyenVan: '+ Method bắt đầu bằng chữ thường + Tên method bắt đầu bằng động từ mô tả chức năng của method. + Phải thể hiện được ý nghĩa mục đích của method + Đảm bảo SRP trong SOLID',
    cachDung: 'calculateFibonacci, sortByBubble, findDoctor — không fibonacci(), bubbleSort(), Damage().',
  },
  {
    stt: '1.5', nhom: 'Common', cham: 'may',
    ngan: 'Biến có nghĩa · …List …Set …Map …Array · viết Id',
    nguyenVan: '+ Tên biến bắt đầu bằng chữ thường và có ý nghĩa + tên biến kiểu collection (list, colection) kết thúc bằng "List" + tên biến kiểu set (Set, HashSet,...) kết thúc bằng "Set" + tên biến kiểu Map (Map, HashMap, TreeMap,...) kết thúc bằng "Map" + tên biến kiểu Array kết thúc bằng Array + khi refer đến ID thì thống nhất viết là "Id" không viết là "ID"',
    cachDung: 'doctorList, codeSet, doctorMap, int[] numberArray, String[] partArray, studentId.',
  },
  {
    stt: '1.6', nhom: 'Common', cham: 'ca-hai',
    ngan: 'Comment cho MỌI method và MỌI block',
    nguyenVan: 'Comment ngắn gọn, rõ ràng. Dùng Javadoc cho class/method nếu cần. Ví dụ: /** This method gets user by ID */. Đã có comment ở các vị trí sau hay chưa? - Mỗi method đều phải có comment miêu tả ý nghĩa của method - Mỗi block source đều phải có comment giải thích block đó làm gì',
    cachDung: 'Một dòng // trên mọi method (kể cả getter/setter, private) và trước mọi if/for/while/switch/try và mọi khối lệnh liền nhau.',
  },
  {
    stt: '2.1', nhom: 'Coding Convention', cham: 'may',
    ngan: '{ cuối dòng, } đầu dòng',
    nguyenVan: '"{" nằm ở kết thúc của line. "}" nằm ở bắt đầu của line',
    cachDung: 'Alt+Shift+F (NetBeans) lo được.',
  },
  {
    stt: '2.2', nhom: 'Coding Convention', cham: 'may',
    ngan: 'Block 1 dòng vẫn có { }',
    nguyenVan: 'Dù block có 1 dòng code cũng đặt trong {}',
    cachDung: 'if (x) { xuống dòng return; xuống dòng }.',
  },
  {
    stt: '2.3', nhom: 'Coding Convention', cham: 'may',
    ngan: '≤ 100 ký tự · ngắt SAU && ||, TRƯỚC + -',
    nguyenVan: '1 line (không tính comment) không dài quá 100 kí tự. Khi line dài hơn 100 ký tự thì break ở các vị trí sau: + sau toán tử logic (and, or,...) + hạn chế break giữa biểu thức trong () + trước toán hạng (+, -, *,...)',
    cachDung: 'Dòng dài kết thúc bằng && hoặc ||; dòng nối tiếp phép cộng chuỗi bắt đầu bằng +.',
  },
  {
    stt: '2.4', nhom: 'Coding Convention', cham: 'may',
    ngan: 'Mỗi dòng một khai báo biến',
    nguyenVan: 'Mỗi khai báo biến để trên 1 dòng.',
    cachDung: 'Không viết int i = 0, j = 1;',
  },
  {
    stt: '2.5', nhom: 'Coding Convention', cham: 'may',
    ngan: 'Mảng khai báo Type[] name',
    nguyenVan: 'Khai báo array thống nhất theo 1 kiểu Type [] anArray;',
    cachDung: 'int[] numberArray — không int numberArray[].',
  },
  {
    stt: '2.6', nhom: 'Coding Convention', cham: 'may',
    ngan: 'Khai báo gom ở ĐẦU mỗi block',
    nguyenVan: 'Biến được khai báo tập trung ở đầu mỗi block code.',
    cachDung: 'String line = ""; ở đầu block, trong vòng lặp chỉ gán line = sc.nextLine();',
  },
  {
    stt: '2.7', nhom: 'Coding Convention', cham: 'may',
    ngan: 'Mỗi dòng một câu lệnh',
    nguyenVan: 'Mỗi statement nằm trên 1 line.',
    cachDung: 'Không viết a = 1; b = 2; hay case 1: doIt(); break; trên một dòng.',
  },
  {
    stt: '2.8', nhom: 'Coding Convention', cham: 'may',
    ngan: 'Dòng trống: giữa method, sau khai báo, trước comment, giữa khối',
    nguyenVan: 'Có 1 blank line giữa các method, giữa vùng khai báo biến và vùng còn lại, trước block comment, trước line comment, giữa các block code sử lý logic',
    cachDung: 'Alt+Shift+F KHÔNG tự chèn các dòng này — phải tự gõ.',
  },
  {
    stt: '2.9', nhom: 'Coding Convention', cham: 'may',
    ngan: 'Dấu cách trước (, sau , và quanh toán tử',
    nguyenVan: 'Có 1 space ở các vị trí: + trước ( + sau "," + trước và sau các phép tính (=, +, - *,; (trong for)...)',
    cachDung: 'if (x == 1) · a, b · i = i + 1 · for (int i = 0; i < n; i++).',
  },
  {
    stt: '2.10', nhom: 'Coding Convention', cham: 'may',
    ngan: 'Hằng số ở Constants.java, static final, CHU_HOA',
    nguyenVan: 'Tất cả hằng số cần để vào một class riêng đặt (Constants.java) + constant viết chữ hoa, phân cách bằng "_" + constant khai báo static final',
    cachDung: 'public static final int MAX_SIZE = 1000; trong Constants — không viết số thẳng trong code.',
  },
  {
    stt: '2.11', nhom: 'Coding Convention', cham: 'may',
    ngan: 'Câu chữ ở Message.java, static final, CHU_HOA',
    nguyenVan: 'Tất cả message cần để vào một constant class riêng đặt (Message.java) + constant viết chữ hoa, phân cách bằng "_" + constant khai báo static final',
    cachDung: 'Mọi chữ trong dấu nháy nằm ở Message.java.',
  },
  {
    stt: '3.1', nhom: 'Performance', cham: 'ai',
    ngan: 'Gọi static qua tên class',
    nguyenVan: 'Sử dụng class để truy cập vào biến, method static',
    cachDung: 'Validation.getChoice(...), Constants.MAX_SIZE — không gọi qua một đối tượng.',
  },
  {
    stt: '3.2', nhom: 'Performance', cham: 'may',
    ngan: 'Không biến local trùng tên field',
    nguyenVan: 'Không khai báo biến local trùng tên với biến higher level',
    cachDung: 'Tham số setter kiểu this.x = x là mẫu IDE sinh; biến local thì đặt tên khác field.',
  },
  {
    stt: '3.3', nhom: 'Performance', cham: 'may',
    ngan: '() quanh từng phép so sánh cạnh && ||',
    nguyenVan: 'Sử dụng () để làm tường minh thứ tự các phép tính',
    cachDung: 'if ((choice < min) || (choice > max)) — đúng như code mẫu Validation của thầy; (x >= 0) ? x : -x.',
  },
  {
    stt: '3.4', nhom: 'Performance', cham: 'may',
    ngan: 'Class toàn static: final + private constructor',
    nguyenVan: 'Class chỉ có static method thì phải có private contructor, Và khai báo class là final.',
    cachDung: 'public final class Validation { private Validation() { } ... } — kể cả Main nếu Main chỉ có hàm static.',
  },
  {
    stt: '3.5', nhom: 'Performance', cham: 'ca-hai',
    ngan: 'String so bằng equals · đã nghĩ tới hoa/thường',
    nguyenVan: '+ Khi so sánh giá trị của object chẳng hạn như là String thì phải dùng phương thức equals chứ không được dùng toán tử 「==」 + Khi so sánh text thì đã chú ý đến case sensitive chưa?',
    cachDung: 'equals / equalsIgnoreCase có chủ đích, ghi comment vì sao phân biệt (hoặc không) hoa thường.',
  },
  {
    stt: '3.6', nhom: 'Performance', cham: 'may',
    ngan: 'Không biến / tham số / field / import thừa',
    nguyenVan: 'Không được có biến khai báo mà không dùng ở đâu cả.',
    cachDung: 'Kể cả tham số không dùng và field chỉ gán mà không bao giờ đọc.',
  },
  {
    stt: '3.7', nhom: 'Performance', cham: 'may',
    ngan: 'Khai báo là khởi tạo luôn',
    nguyenVan: 'Biến có declare khi bắt đầu xử lý và thực hiện khởi tạo',
    cachDung: 'int choice = 0; — không int choice;',
  },
  {
    stt: '3.8', nhom: 'Performance', cham: 'may',
    ngan: 'Không String += · nối chuỗi bằng StringBuilder',
    nguyenVan: 'Khi thực hiện cộng string thì sẽ dùng StringBuilder. không dùng String += String',
    cachDung: 'StringBuilder khi ghép; khi in thì in từng phần hoặc String.format(Message.X, ...).',
  },
];

/**
 * Khối nhét vào prompt: 25 mục NGUYÊN VĂN (tiếng Việt, đúng chữ thầy) + cách
 * hiểu cho model (tiếng Anh). Cố ý đặt LÊN TRÊN mọi quy tắc khác trong
 * `QUY_TAC_LOI`: khi hai bên vênh nhau, tờ giấy thắng — vì thầy chấm bằng nó.
 */
export const CHECKLIST_CHO_PROMPT = [
  '=================================================================',
  "THE LECTURER'S PAPER CHECKLIST — \"Coding check sheet\" (handed out 21/09/2026)",
  '=================================================================',
  'The lecturer reviews every submission against THIS sheet, item by item. The',
  'student fills "O" next to each item they have checked; only when a whole column',
  'is "O" may they ask for a review. One item wrong = the submission is rejected.',
  'THIS SHEET OUTRANKS EVERY OTHER LINE OF THIS PROMPT. If anything below seems to',
  'disagree with it, the sheet wins and you say so.',
  '',
  'The 25 items, verbatim (Vietnamese, the lecturer\'s own words):',
  ...CHECKLIST_THAY.map((m) => `  [${m.stt}] ${m.nguyenVan}`),
  '',
  'HOW TO READ THE SHEET (these readings were checked against the lecturer\'s',
  'Guide.xlsx sample and the Sun Java Code Conventions file he hands out):',
  '  * 1.1 "Bắt buộc phải có repository": EVERY assignment has repository/ — an',
  '    algorithm assignment too (it holds the array / the numbers / the text being',
  '    processed, with plain get/set/add methods); service/ runs the algorithm.',
  '  * 1.1 View: the controller calls view.setXxx(responseDTO) and then',
  '    view.display() — ONE render per menu case. A view method that takes data as',
  '    a PARAMETER (showMessage(String), displayList(ArrayList)) breaks the item.',
  '    Prompts, the menu and e.getMessage() of a caught error may be printed by',
  '    main — the lecturer\'s own Main does exactly that.',
  '  * 1.1 Main does ALL input, validation, file READING and hashing (via',
  '    utils/Validation, FileUtils, MD5Utils, CaptchaUtils), packs a RequestDTO and',
  '    calls the controller ONCE per menu case (Guide.xlsx: "Mỗi workflow chính',
  '    chỉ gọi vào controller 1 lần duy nhất").',
  '  * 1.1 The controller never imports, receives or returns a model class.',
  '  * 1.5 The suffix rule applies to fields, locals AND parameters:',
  '    ArrayList<Doctor> doctorList, HashMap<String, Doctor> doctorMap,',
  '    HashSet<String> codeSet, int[] numberArray, String[] partArray, getStudentId().',
  '  * 2.6 + 3.7 (Sun CC §6.2, §6.3): locals at the TOP of each block, initialised',
  '    there; inside a loop assign, do not declare after a statement.',
  '  * 2.8 (Sun CC §8.1): a blank line before EVERY // or /* comment that follows',
  '    code (field comments included), after the local-declaration region, between',
  '    methods, and between logical blocks. The IDE formatter does not add these.',
  '  * 3.3 (Sun CC §10.5.1): every comparison next to && or || gets its own',
  '    parentheses: if ((a == b) && (c == d)); a ternary condition too:',
  '    (x >= 0) ? x : -x.',
  '  * 3.4: a class whose methods are all static is final with a private',
  '    constructor — utils, constants, and Main too when Main only has static methods.',
  '  * 3.8: never String +=; build text with StringBuilder, print with',
  '    String.format(Message.X, ...) or print piece by piece.',
  '  * Names the BRIEF dictates but the sheet forbids (Damage(), ExceptionCar,',
  '    ExceptionHandle): point out the conflict and tell the student to ask the',
  '    lecturer; the safe default is the sheet\'s form (damage()/takeDamage(),',
  '    CarException) with the brief\'s name kept in the comment.',
].join('\n');

/** Tra một mục theo số thứ tự. */
export function mucTheoStt(stt: string): MucChecklist | undefined {
  return CHECKLIST_THAY.find((m) => m.stt === stt);
}
