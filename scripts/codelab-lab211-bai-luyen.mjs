/**
 * codelab-lab211-bai-luyen.mjs — thêm phần "Ba bài luyện" vào module
 * "Kiến trúc 8 package & bộ khung P0055" (track 39).
 *
 * Vì sao: bài giảng đã nhắc tới ba bài luyện ở nhiều chỗ, nhưng chúng mới chỉ
 * tồn tại dưới dạng thư mục trên máy. Không có trên web thì không dùng được.
 *
 * Cả ba đều mô phỏng đúng thứ thầy bảo làm TẠI CHỖ lúc review: "giờ em thêm
 * số điện thoại đi", "em sắp xếp theo tên xem", "bỏ HashMap đi thì sao".
 *
 * Ghi THÊM, không đè: tự cắt phần cũ do chính nó tạo (mốc = tiêu đề part).
 *
 *   node scripts/codelab-lab211-bai-luyen.mjs           # thử khô
 *   node scripts/codelab-lab211-bai-luyen.mjs --apply
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');
const TRACK_ID = 39;
const SLUG = 'lab211-kien-truc-bo-khung';
const MOC = 'Ba bài luyện — làm để thuộc tay';

const B = [];
const head = (text, textVi) => B.push({ type: 'heading', text, textVi });
const p = (html) => B.push({ type: 'prose', html });
const code = (title, titleVi, language, c) => B.push({ type: 'code', title, titleVi, language, code: c });

B.push({
  type: 'part', number: '4',
  text: 'Three drills — until the skeleton is in your fingers',
  textVi: MOC,
  subtitle: 'Each one simulates a change your mentor will ask for on the spot',
  subtitleVi: 'Mỗi bài mô phỏng một thay đổi thầy sẽ bảo làm ngay tại chỗ',
});

p(`<p>Đọc hiểu bộ khung ở phần 3 là chưa đủ. Thầy sẽ <strong>đổi đề một chút ngay tại chỗ</strong> —
"giờ em thêm số điện thoại vào bác sĩ đi", "em sắp xếp theo tên xem", "bỏ <code>HashMap</code> đi thì sửa
thế nào". Lúc đó không có thời gian nghĩ từ đầu.</p>
<p>Ba bài dưới đây là ba thay đổi hay bị yêu cầu nhất. <strong>Cách làm đúng: tự sửa trước, chạy được rồi
mới đọc đáp án.</strong> Đọc đáp án trước thì tay không nhớ gì.</p>`);
code('Compile and run, in any of the three drills', 'Biên dịch và chạy, dùng chung cho cả ba bài', 'bash',
`javac -encoding UTF-8 -d build $(find src -name "*.java")
java -cp build main.Main`);

// ═══ BÀI 1 ═══
head('Drill 1 — Add a phone field', 'Bài luyện 1 — Thêm trường phone vào bác sĩ');
p(`<p><strong>Đề:</strong> thêm số điện thoại vào bác sĩ. Nhập được, hiện được trong bảng, tìm được, và
kiểm tra định dạng (10 chữ số, bắt đầu bằng 0).</p>
<p><strong>Đáp án: sửa 9 file.</strong> Tôi từng ghi "6 chỗ" trong bản đầu — <em>sai</em>, làm thật ra 9.
Đây đúng là lý do phải làm chứ không được đoán.</p>
<table>
  <tr><th>#</th><th>File</th><th>Sửa gì</th></tr>
  <tr><td>1</td><td><code>model/Doctor.java</code></td><td>field <code>phone</code> · tham số constructor · getter/setter · thêm vào <code>toString()</code></td></tr>
  <tr><td>2</td><td><code>dto/DoctorRequestDTO.java</code></td><td>field + getter/setter</td></tr>
  <tr><td>3</td><td><code>dto/DoctorResponseDTO.java</code></td><td>field · tham số constructor · getter · <code>toString()</code></td></tr>
  <tr><td>4</td><td><code>constants/Message.java</code></td><td><code>INPUT_PHONE</code> + <code>INVALID_PHONE</code></td></tr>
  <tr><td>5</td><td><code>constants/Constants.java</code></td><td>thêm cột vào <code>ROW_FORMAT</code> + <code>PHONE_REGEX</code></td></tr>
  <tr><td>6</td><td><code>utils/Validation.java</code></td><td>hàm <code>getPhone()</code></td></tr>
  <tr><td>7</td><td><code>repository/DoctorRepository.java</code></td><td><code>addDoctor</code> · <code>updateDoctor</code> · <code>toResponse</code> · <code>searchDoctor</code></td></tr>
  <tr><td>8</td><td><code>view/DoctorView.java</code></td><td>thêm cột "Phone" vào header</td></tr>
  <tr><td>9</td><td><code>main/Main.java</code></td><td>nhập phone ở <strong>cả hai</strong> chỗ: thêm và cập nhật</td></tr>
</table>
<h4>Điều quan trọng nhất của bài này</h4>
<p><strong><code>controller/DoctorController.java</code> KHÔNG phải sửa một dòng nào.</strong></p>
<p>Vì Controller chỉ nhận <code>DoctorRequestDTO</code> rồi chuyển tiếp — nó không quan tâm bên trong DTO có
mấy trường. Đó <strong>chính là</strong> tiền lãi của luật "không truyền dữ liệu qua lại" ở slide 5, và là
câu trả lời sẵn khi thầy hỏi "gói vào DTO để làm gì".</p>`);
code('The regex, and the trap in the column widths', 'Regex, và cái bẫy ở độ rộng cột', 'java',
`// constants/Constants.java
public static final String PHONE_REGEX = "^0\\\\d{9}$";   // 10 chu so, bat dau bang 0

// ⚠️ BAY: them mot cot thi phai NOI RONG ca dong dinh dang.
// Ban goc:  "%-10s%-20s%-20s%-12s"
// Them phone ma quen sua -> bang bi lech cot, nhin ra ngay la lam au.
public static final String ROW_FORMAT = "%-10s%-18s%-18s%-14s%-12s";
//                                                      ^^^^^ cot Phone`);
p(`<p>⚠️ Cột <code>%-12s</code> vừa khít cho "Availability" nhưng <strong>không đủ</strong> cho một số điện
thoại 10 chữ số cạnh nó — phải nới sang <code>%-14s</code>. Chi tiết vặt, nhưng bảng lệch cột là thứ thầy
nhìn thấy đầu tiên.</p>`);

// ═══ BÀI 2 ═══
head('Drill 2 — Add a sort menu with the Strategy pattern', 'Bài luyện 2 — Thêm menu sắp xếp bằng Strategy');
p(`<p><strong>Đề:</strong> thêm mục "6. Sort and display" với ba kiểu sắp xếp — theo tên A–Z, theo mã tăng
dần, theo số ca trực nhiều trước.</p>
<p>Đây là chỗ <strong>Strategy</strong> tự nhiên nhất trong cả bài, và là pattern dễ bảo vệ nhất trước thầy.</p>
<table>
  <tr><th>Thêm mới (5 file)</th><th>Vai trong Strategy</th></tr>
  <tr><td><code>service/sort/ChienLuocSapXep.java</code></td><td><strong>Strategy</strong> — hợp đồng chung</td></tr>
  <tr><td><code>service/sort/SapXepTheoTen.java</code></td><td>ConcreteStrategy</td></tr>
  <tr><td><code>service/sort/SapXepTheoMa.java</code></td><td>ConcreteStrategy</td></tr>
  <tr><td><code>service/sort/SapXepTheoSoCaTruc.java</code></td><td>ConcreteStrategy</td></tr>
  <tr><td><code>service/DoctorServices.java</code></td><td><strong>Context</strong> — giữ chiến lược, uỷ thác việc sắp xếp</td></tr>
</table>
<table>
  <tr><th>Sửa (6 file)</th><th>Sửa gì</th></tr>
  <tr><td><code>repository/DoctorRepository.java</code></td><td>thêm <code>findAllAsList()</code></td></tr>
  <tr><td><code>view/DoctorView.java</code></td><td>thêm <code>displayList(ArrayList&lt;…&gt;)</code></td></tr>
  <tr><td><code>controller/DoctorController.java</code></td><td>giữ thêm <code>DoctorServices</code>, thêm <code>sapXepVaHienThi()</code></td></tr>
  <tr><td><code>constants/Message.java</code></td><td>menu chính thêm mục 6, thêm <code>MENU_SORT</code></td></tr>
  <tr><td><code>constants/Constants.java</code></td><td><code>MENU_MAX</code> 6 → 7, thêm <code>SORT_MIN</code>/<code>SORT_MAX</code></td></tr>
  <tr><td><code>main/Main.java</code></td><td><code>case 6</code> gọi hàm <code>sapXep()</code>, <code>case 7</code> mới là thoát</td></tr>
</table>
<h4>Vì sao phải thêm <code>findAllAsList()</code> — đây là bài học của bài này</h4>
<p><code>doctorMap</code> là <strong><code>HashMap</code></strong>, mà <strong><code>HashMap</code> KHÔNG giữ
thứ tự</strong>. Sắp xếp xong rồi nhét lại vào <code>Map</code> là <strong>mất sạch công sắp xếp</strong>.
Nên phải đổ sang <code>ArrayList</code> trước khi sắp, và View phải có đường hiển thị theo danh sách.</p>`);
code('Strategy — the interface and one concrete strategy', 'Strategy — hợp đồng và một chiến lược cụ thể', 'java',
`// service/sort/ChienLuocSapXep.java — Strategy
public interface ChienLuocSapXep {
    void sapXep(ArrayList<Doctor> danhSach);
}

// service/sort/SapXepTheoTen.java — ConcreteStrategy
public class SapXepTheoTen implements ChienLuocSapXep {
    @Override
    public void sapXep(ArrayList<Doctor> danhSach) {
        Collections.sort(danhSach,
                Comparator.comparing(Doctor::getName, String.CASE_INSENSITIVE_ORDER));
    }
}

// service/DoctorServices.java — Context: giu chien luoc, KHONG tu sap xep
public void datChienLuoc(ChienLuocSapXep chienLuoc) {
    this.chienLuoc = chienLuoc;
}`);
p(`<h4>⚠️ Dữ liệu thử phải làm BA thứ tự KHÁC NHAU</h4>
<p>Lần đầu tôi viết bộ kiểm cho bài này, dữ liệu tình cờ làm cả ba kiểu sắp xếp ra <em>cùng một thứ tự</em>
— bộ kiểm chạy xanh mà <strong>không chứng minh được gì cả</strong>. Phải chọn dữ liệu sao cho thứ tự theo
tên ≠ thứ tự theo mã ≠ thứ tự theo số ca trực.</p>
<p><strong>Trả lời thầy, đủ bốn ý GoF:</strong> <em>tên</em> Strategy → <em>vấn đề</em>: viết
<code>if/else</code> trong Service thì mỗi lần thêm kiểu sắp xếp phải mở Service ra sửa →
<em>lời giải</em>: interface + mỗi thuật toán một class, Service giữ tham chiếu tới interface →
<em>hệ quả</em>: thêm kiểu mới chỉ là thêm một class, Service đứng yên. Đó là Open/Closed.</p>`);

// ═══ BÀI 3 ═══
head('Drill 3 — Swap HashMap for ArrayList', 'Bài luyện 3 — Đổi kho từ HashMap sang ArrayList');
p(`<p><strong>Đề:</strong> đổi kho dữ liệu trong Repository từ <code>HashMap&lt;String, Doctor&gt;</code>
sang <code>ArrayList&lt;Doctor&gt;</code>. <strong>Không thêm chức năng nào</strong> — chương trình chạy y
hệt. Cái đổi là cấu trúc dữ liệu bên dưới.</p>
<p>Mục đích: trả lời được câu thầy chắc chắn hỏi — <em>"tại sao ở đây em dùng <code>HashMap</code> chứ không
phải <code>ArrayList</code>?"</em>. Đọc bảng so sánh thì hôm sau quên; tự tay viết cả hai thì nhớ.</p>
<table>
  <tr><th>File</th><th>Sửa gì</th></tr>
  <tr><td><code>repository/DoctorRepository.java</code></td><td><strong>Viết lại gần hết</strong></td></tr>
  <tr><td><code>view/DoctorView.java</code></td><td><code>setDoctorMap(Map)</code> → <code>setDanhSach(ArrayList)</code>, <strong>bỏ hẳn <code>displayList()</code></strong></td></tr>
  <tr><td><code>controller/DoctorController.java</code></td><td>đổi kiểu <code>Map</code> → <code>ArrayList</code></td></tr>
  <tr><td><code>service/DoctorServices.java</code></td><td>chỉ sửa <strong>chú thích</strong></td></tr>
</table>
<p><strong><code>model/</code>, <code>dto/</code>, <code>constants/</code>, <code>utils/</code>,
<code>main/</code> — không sửa một chữ nào.</strong> Đổi cả kho dữ liệu mà <code>Main</code> đứng yên: đó là
trừu tượng hoá, và là câu trả lời sẵn cho câu hỏi "abstraction nằm ở đâu trong source em".</p>
<h4>Bốn chỗ phải tự bù khi bỏ <code>HashMap</code></h4>`);
code('1 & 2 — finding by code, and blocking duplicates', '1 & 2 — tìm theo mã, và chặn trùng mã', 'java',
`// HashMap: mot dong, Java lo phan con lai
Doctor doctor = doctorMap.get(code);

// ArrayList: phai TU VIET vong lap
private Doctor timTheoMa(String code) {
    for (Doctor doctor : doctorList) {
        if (doctor.getCode().equals(code)) {   // .equals() chu KHONG phai ==
            return doctor;
        }
    }
    return null;
}

// ⚠️ CHAN TRUNG MA:
// HashMap chan MIEN PHI - put() cung mot khoa thi de len nhau.
// ArrayList thi add() cai gi cung nhan. Quen isDuplicate() -> kho co HAI bac si
// cung ma "D01", va moi ham tim chi thay CAI DAU TIEN. Bug am tham, kho thay.`);
code('3 & 4 — deleting, and the copy that is easy to forget', '3 & 4 — xoá, và bản sao dễ quên nhất', 'java',
`// ❌ SAI: xoa ngay trong vong lap for-each dang duyet chinh danh sach do
for (Doctor d : doctorList) {
    if (d.getCode().equals(code)) {
        doctorList.remove(d);      // -> ConcurrentModificationException luc CHAY
    }
}
// ✅ DUNG: tim ra TRUOC, ra khoi vong lap roi moi xoa
Doctor doctor = timTheoMa(code);
if (doctor == null) { return false; }
return doctorList.remove(doctor);


// ❌ SAI: tra ve CHINH kho du lieu
public ArrayList<Doctor> findAllAsList() { return doctorList; }

// ✅ DUNG: tra ve BAN SAO
public ArrayList<Doctor> findAllAsList() { return new ArrayList<>(doctorList); }
// Vi Collections.sort() sap xep TAI CHO. Tra ve chinh kho thi bam "hien thi theo
// ten" MOT lan la thu tu nhap ban dau mat VINH VIEN.
// Ban HashMap khong dinh loi nay: new ArrayList<>(map.values()) von da la ban sao.`);
p(`<h4>Đổi lại được gì: View từ hai hàm còn một</h4>
<p>Bản <code>HashMap</code> buộc phải có <strong>hai</strong> hàm hiển thị — <code>display()</code> nhận
<code>Map</code>, <code>displayList()</code> nhận <code>ArrayList</code> — vì <code>Map</code> không giữ thứ
tự. Bản <code>ArrayList</code> chỉ còn <strong>một</strong>. Bớt một hàm trùng lặp là câu trả lời thật cho
"vậy <code>ArrayList</code> được gì".</p>

<h4>Bảng đối chiếu — học thuộc bảng này</h4>
<table>
  <tr><th></th><th><code>HashMap&lt;String, Doctor&gt;</code></th><th><code>ArrayList&lt;Doctor&gt;</code></th></tr>
  <tr><td>Tìm theo mã</td><td><code>get(code)</code> — gần như <strong>tức thì</strong>, kho to nhỏ không đổi</td><td>Duyệt từ đầu — <strong>kho càng lớn càng chậm</strong></td></tr>
  <tr><td>Chặn trùng mã</td><td><strong>Miễn phí</strong> (khoá duy nhất)</td><td><strong>Phải tự viết</strong>, quên là hỏng dữ liệu</td></tr>
  <tr><td>Giữ thứ tự nhập</td><td>❌ Không</td><td>✅ Có</td></tr>
  <tr><td>Sắp xếp</td><td>Phải đổ sang <code>ArrayList</code> trước</td><td>Sắp thẳng (nhớ lấy bản sao)</td></tr>
  <tr><td>Số hàm hiển thị cần</td><td>2</td><td>1</td></tr>
</table>
<p><strong>Chọn cái nào:</strong> thao tác chính là <em>tra theo mã</em> → <code>HashMap</code>. Thao tác
chính là <em>duyệt / hiển thị / sắp xếp theo thứ tự</em> → <code>ArrayList</code>. Bài <code>P0055</code>
tra theo mã ở <strong>bốn</strong> chức năng nên <code>HashMap</code> hợp hơn — nhưng phải trả giá bằng việc
mất thứ tự.</p>

<h4>Bộ kiểm — bốn thứ tự phải KHÁC NHAU</h4>
<p>Dữ liệu thử phải làm <em>thứ tự nhập ≠ thứ tự mã ≠ thứ tự tên ≠ thứ tự số ca trực</em>. Trùng nhau thì
phép kiểm không chứng minh được gì. (Lưu ý <code>MAX_AVAILABILITY = 7</code>, nhập 9 là bị chặn.)</p>
<table>
  <tr><th>Nhập vào</th><th>Tên</th><th>Số ca</th></tr>
  <tr><td><code>D03</code></td><td>Tran Van Cuong</td><td>6</td></tr>
  <tr><td><code>D01</code></td><td>Nguyen Van An</td><td>2</td></tr>
  <tr><td><code>D04</code></td><td>Le Thi Dung</td><td>7</td></tr>
  <tr><td><code>D02</code></td><td>Pham Van Binh</td><td>4</td></tr>
</table>
<table>
  <tr><th>Chức năng</th><th>Thứ tự đúng</th></tr>
  <tr><td>5. Display all</td><td><code>D03 · D01 · D04 · D02</code> (đúng thứ tự nhập)</td></tr>
  <tr><td>6 → 1 Tên A–Z</td><td><code>D04 · D01 · D02 · D03</code></td></tr>
  <tr><td>6 → 2 Mã tăng dần</td><td><code>D01 · D02 · D03 · D04</code></td></tr>
  <tr><td>6 → 3 Số ca nhiều trước</td><td><code>D04 · D03 · D02 · D01</code></td></tr>
  <tr><td><strong>5. Display all LẦN NỮA</strong></td><td><strong><code>D03 · D01 · D04 · D02</code></strong> ← quan trọng nhất</td></tr>
</table>
<p><strong>Bước cuối là phép kiểm có giá trị nhất cả bài.</strong> Nếu sau ba lần sắp xếp mà "Display all"
ra thứ tự khác thứ tự nhập, nghĩa là <code>findAllAsList()</code> đang trả về chính kho chứ không phải bản
sao.</p>
<p>Đã thử phá để chắc bộ kiểm có răng: sửa thành <code>return doctorList;</code> thì bước cuối ra
<code>D04 · D03 · D02 · D01</code>. Nó <strong>bắt được</strong> lỗi, không phải chỉ chạy cho vui.</p>`);

head('Answering your mentor on data structures', 'Trả lời thầy về cấu trúc dữ liệu');
p(`<p><strong>"Tại sao dùng <code>HashMap</code> chứ không phải <code>ArrayList</code>?"</strong></p>
<blockquote>"Vì thao tác chính của bài là tra theo mã bác sĩ — sửa, xoá, kiểm tồn tại và chặn trùng đều tra
theo mã. <code>HashMap</code> tra theo khoá gần như tức thì dù kho có bao nhiêu phần tử, còn
<code>ArrayList</code> phải duyệt từ đầu. Thêm nữa khoá của <code>HashMap</code> là duy nhất nên nó chặn
trùng mã luôn. Cái phải đánh đổi là <code>HashMap</code> không giữ thứ tự, nên muốn sắp xếp em phải đổ sang
<code>ArrayList</code> trước — đó là lý do có hàm <code>findAllAsList()</code>."</blockquote>

<p><strong>"Bỏ <code>HashMap</code> đi thì sửa source thế nào?"</strong> — câu này thầy hay hỏi nối theo.</p>
<blockquote>"Em chỉ phải sửa <code>Repository</code>, <code>View</code> và <code>Controller</code>.
<code>Main</code>, <code>Model</code>, <code>DTO</code>, <code>Validation</code> không đổi dòng nào, vì chúng
không biết dữ liệu nằm trong cái gì. Trong <code>Repository</code> em phải tự viết hàm tìm theo mã bằng vòng
lặp, và tự kiểm trùng mã — hai thứ <code>HashMap</code> làm sẵn cho em."</blockquote>

<p><strong>"<code>List</code> với <code>ArrayList</code> khác nhau chỗ nào?"</strong></p>
<blockquote>"<code>List</code> là <strong>interface</strong> — bản hợp đồng, nói có <code>add</code>,
<code>get</code>, <code>size</code>, không nói làm thế nào. <code>ArrayList</code> là <strong>class cài
đặt</strong> hợp đồng đó bằng mảng động: lấy theo chỉ số rất nhanh, chèn/xoá ở giữa thì chậm vì phải dời
phần tử. <code>LinkedList</code> cài cùng hợp đồng bằng danh sách liên kết, ngược lại. Tương tự
<code>Map</code> là hợp đồng, <code>HashMap</code> cài bằng bảng băm nên không giữ thứ tự,
<code>LinkedHashMap</code> giữ thứ tự thêm vào, <code>TreeMap</code> sắp theo khoá."</blockquote>
<p>⚠️ Nhắc lại: thầy yêu cầu <strong>khai báo</strong> bằng <code>ArrayList</code>/<code>HashMap</code>
(kiểu cụ thể), không phải <code>List</code>/<code>Map</code>. Mọi công cụ AI đều sinh ra
<code>List&lt;Doctor&gt; ds = new ArrayList&lt;&gt;();</code> vì đó là chuẩn công nghiệp — dán vào là lộ ngay.</p>`);

head('If you still have time', 'Tự làm thêm nếu còn thời gian');
p(`<ol>
  <li><strong>Thử <code>LinkedHashMap</code></strong> — giữ được cả tốc độ tra khoá <em>lẫn</em> thứ tự
  nhập. Đổi đúng một dòng khai báo trong Repository, chạy lại bộ kiểm ở trên. Trả lời được "vậy sao không
  dùng luôn nó?" là điểm.</li>
  <li><strong>Đo thật.</strong> Nhét 100.000 bác sĩ vào rồi tìm mã cuối cùng, đo bằng
  <code>System.nanoTime()</code> ở cả hai bản. Con số tự đo thuyết phục hơn mọi lời giải thích — và rất ít
  sinh viên làm.</li>
  <li><strong>Thử phá <code>deleteDoctor</code></strong> — sửa thành xoá ngay trong vòng lặp for-each, chạy
  chức năng xoá và đọc <code>ConcurrentModificationException</code> bằng chính mắt mình. Đọc được stack
  trace cũng là một câu thầy hỏi.</li>
</ol>`);

// ─── Ghi vào DB ───────────────────────────────────────────────
const mod = await prisma.codeModule.findFirst({ where: { trackId: TRACK_ID, slug: SLUG } });
if (!mod) { console.error(`Không thấy module ${SLUG}`); process.exit(1); }
const cu = Array.isArray(mod.lessonBlocks) ? mod.lessonBlocks : [];
const cat = cu.findIndex((b) => b && b.type === 'part' && b.textVi === MOC);
const giuLai = cat >= 0 ? cu.slice(0, cat) : cu;
const ketQua = [...giuLai, ...B];

console.log(`Module ${mod.id} (${SLUG}): đang có ${cu.length} block, ${cu.filter((b) => b.type === 'part').length} phần`);
console.log(cat >= 0 ? `Đã có phần "${MOC}" ở vị trí ${cat} — cắt đi và ghi lại.` : `Chưa có phần "${MOC}" — ghi thêm vào cuối.`);
console.log(`Thêm ${B.length} block → tổng ${ketQua.length} block, ${ketQua.filter((b) => b.type === 'part').length} phần`);

if (!APPLY) console.log('\n(thử khô — thêm --apply để ghi thật)');
else {
  await prisma.codeModule.update({ where: { id: mod.id }, data: { lessonBlocks: ketQua, lessonGeneratedAt: new Date() } });
  console.log('✅ Đã ghi.');
}
await prisma.$disconnect();
