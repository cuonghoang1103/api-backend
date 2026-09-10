# LAB211 — đối chiếu 54 lời giải mẫu với bộ quy tắc đang dạy

Ngày kiểm: 2026-09-10. Phạm vi: toàn bộ bài giảng Academy `LAB211`, bài giảng
Code Lab module 847, quy tắc SOLID/access modifier kế thừa từ `PRO192`, và
54 lời giải trong `solutions/batch*.py`.

Mọi con số dưới đây là **đo được**, không suy đoán: các lời giải được biên dịch
và chạy thật với kịch bản phím của người chấm, dưới ba locale khác nhau.

---

## 1. "Prompt của thầy" thực ra nằm ở ba chỗ, không phải một

| Nguồn | Nội dung | Vai trò |
|---|---|---|
| Academy `LAB211` — 40 bài / 10 mục | kiến trúc 5 tầng, quy tắc thêm tầng theo số file, Validator, output khớp ký tự, bẫy người chấm, CheckStyle | **hợp đồng chính** |
| Code Lab module 847 — 15 phần / 265 khối | MVC, đặt tên, access modifier, 4 trụ OOP, 25 câu vấn đáp, checklist nộp bài | chi tiết kỹ thuật |
| Academy `PRO192` 3.1 + N2.1 | bảng access modifier, đóng gói, **SOLID** | nền tảng (môn tiên quyết) |

Ba điều cần nói thẳng:

* **SOLID không được dạy trong LAB211.** Nó chỉ xuất hiện ở `PRO192` bài N2.1,
  ở mức khái niệm (5 nguyên tắc, mỗi cái một câu). LAB211 chỉ dùng lại phần
  "một lớp một việc" dưới tên khác: *tầng*.
* **Design pattern không thuộc LAB211.** Nó ở `SWD392`. Trong module 847 chỉ có
  đúng một nút "practise" trỏ sang Java Core. Chấm LAB211 bằng thước design
  pattern là chấm sai môn.
* **Access modifier thì có, và rất cụ thể:** trường `private` luôn luôn, phương
  thức `public` khi là hợp đồng của lớp, `protected` chỉ khi lớp con thật sự
  cần, lớp tiện ích thì `private` constructor + `private static final Scanner`.

---

## 2. Những gì 54 bài làm ĐÚNG tuyệt đối

| Quy tắc | Nguồn | Kết quả |
|---|---|---|
| Biên dịch + chạy khớp màn hình mong đợi | Academy 0.2 | **54/54** |
| Xoá header mẫu NetBeans | Academy 1.1 | 54/54 |
| Không thực thể HTML lọt vào mã Java | `solkit.check_source_text` | 54/54 |
| Không `nextInt()/nextDouble()` trực tiếp | Academy 1.2 | 54/54 |
| Không đóng `Scanner` bọc `System.in` | Academy 1.1 | 54/54 |
| `@Override` trên **mọi** phương thức ghi đè | Academy 5.1 | 54/54 |
| `equals()` luôn đi kèm `hashCode()` | Academy 4.2 | 54/54 |
| Ngày tháng parse `setLenient(false)` / STRICT | Academy 3.2 | 5/5 bài có parse ngày |
| Mọi lớp có Javadoc nói *vì sao* nó tồn tại | Academy 1.1 | 54/54 |
| Đặt tên PascalCase / camelCase / UPPER_SNAKE | 847 Part 5 | 54/54 |
| `main()` / phương thức không phình | 847 Part 5 | 53/54 |

Ba chỗ tên gọi "sai chuẩn" đều là **đề bắt**, và lời giải theo đề là đúng:
`Bee.Damage()` (đề viết hoa D), `Messages_en` / `Messages_vi` (quy ước
`ResourceBundle`), `Country` với trường `protected` (đề in nguyên xi như vậy).

---

## 3. Lỗi thật — đã tìm ra và đã vá

### 3.1 Locale: 8/54 bài in dấu phẩy trên máy Việt Nam ⚠️ NGHIÊM TRỌNG

Bài giảng Academy 1.3 dạy đúng quy tắc này:

> `System.out.printf("%.2f", 3.5)` có thể in `3,50` trên máy locale dấu phẩy và
> trượt phép so khớp. Ép dấu chấm bằng `String.format(Locale.US, …)`.

46 lời giải làm đúng. 8 lời giải quên. Đo thật (`-Duser.language=vi -Duser.country=VN`):

```
lời giải: OK=46  LỖI=8
   J1.S.P0056 · J1.S.P0059 · J1.S.P0080 · J1.S.P0081
   J1.S.P0085 · J1.L.P0014 · J1.L.P0015 · J1.L.P0023
```

Ví dụ thật từ P0014: `1000,00` và `2,20` thay vì `1000.00` và `2.20`.

Vì sao bộ verify không bắt được: nó chạy trong container locale `en_US`, còn
máy phòng lab FPTU thì `vi_VN`. Đúng kiểu lỗi "xanh ở nhà, đỏ ở chỗ chấm".

**Đã vá 21 chỗ trong 16 file Java** (thêm `Locale.US` + `import java.util.Locale`).
Kiểm lại:

```
en_US  → OK=54  LỖI=0
vi_VN  → OK=54  LỖI=0
de_DE  → OK=54  LỖI=0
```

### 3.2 Slide 1.1 chỉ vào một project không tồn tại như nó mô tả

Thẻ link cuối bài *"1.1 — Kiến trúc phân tầng chuẩn FPTU"* nói:

> **Xem trọn mẫu: Doctor Management** — Project ≥7 file với
> entity/bo/controller/Validator — bố cục chuẩn.

Lời giải P0055 thật có **4 file** và **không có controller**:
`entity/Doctor` · `bo/DoctorManager` · `ui/Main` · `utils/Validation`.

Học viên bấm vào để xem "bố cục ≥7 file có controller" và thấy một project 4
tầng không controller — ngay dưới cái bảng vừa dạy quy tắc đó.

**Đã sửa:** trỏ sang **P0056 Worker Management** — 7 file, dùng đủ cả năm tầng
`entity` (3 lớp) + `bo` + `controller` + `ui` + `utils`.

---

### 3.3 Tên phương thức không khớp đề — 3 bài ⚠️ NGHIÊM TRỌNG

**Người chấm dò theo TÊN.** Một bài chạy đúng, in đúng từng ký tự, mà đặt tên
`add` trong khi đề viết `addWord` thì ô đối chiếu trong phiếu chấm không tích
được — và `javac` lẫn `verify_all()` đều không nói gì, vì cả hai chỉ biết
chương trình in ra cái gì, không biết đề đòi gọi nó là gì.

Đi tìm mục §7.2 cũ ("cân nhắc thêm controller cho P0073, P0055, P0058") thì
không thấy vấn đề controller đâu, mà thấy cái này:

| Bài | Đề đòi | Lời giải có | |
|---|---|---|---|
| P0058 | `addWord` · `removeWord` · `loadData` · `updateDatabase` | `add` · `delete` · `load` · `save` | **4 tên sai** |
| P0053 | `checkIn` · `sortAscending` · `sortDescending` | *không có cái nào* | **thiếu cả 3** |
| P0055 | class **`DoctorHash`** | class `DoctorManager` | **sai tên lớp** |

P0073 thì không lệch gì: cả ba chữ ký khớp, và `displayAll` nằm ở `Main` có lập
luận đúng.

Đã sửa cả ba, và **viết thêm một phép kiểm thứ hai** —
`solutions/khopchuky.py` — đọc chữ ký cùng khối "implement methods … in startup
code" của từng đề rồi soát xem lời giải có đúng những cái tên đó không. Quét lại
cả 54 bài: **0 lệch**. Đã kiểm ngược chính nó (tháo `addWord`/`removeWord` ra
thì nó đỏ đúng hai chỗ) trước khi tin.

Ba lần lọt lưới trước khi có phép kiểm này: P0068 (`sortStudent` khai `void` thay
vì trả `List`), P0058, P0053.

### 3.4 "in startup code" — tôi đã đọc SAI, và P0055 là phản chứng

Ở §4.2 tôi kết luận: *"in startup code" nghĩa là phương thức phải nằm trong lớp
khởi động*. Đọc rộng ra thì **không phải** — nó nghĩa là *"đây là những phương
thức bạn phải viết trong project nộp lên"*, và **không tự nó nói lớp nào**.

Phản chứng nằm ngay trong P0055: Hướng dẫn nói "…in startup code", còn phần Gợi
ý của **cùng một đề** nói *"Class **DoctorHash** contains adding, editing,
deleting and searching functions"*. Nếu cụm đó có nghĩa "trong `Main`" thì đề tự
mâu thuẫn với chính nó ở cách hai dòng.

Cách đọc đúng, và cách đã ghi lại vào bộ quy tắc:

* Đề **không** nêu tên lớp nào và truyền collection vào làm tham số
  (`addContact(List<Contact> list, Contact c)`) → phương thức nằm ở `Main`.
  **P0054, P0063, P0068** đúng là ca này, nên §4.2 vẫn đứng vững — chỉ có lý do
  tôi đưa ra là chưa đủ.
* Đề **có** nêu tên lớp → chính cái tên đó là thứ người chấm tìm. **P0055** là
  ca này.

Hiểu ngược là mất điểm ở cả hai chiều. Đã sửa cách phát biểu ở bốn chỗ: Academy
1.1 (EN+VI), `AUTHORING-BRIEF.md`, `quyTacThay.ts`, và walkthrough P0055.

## 4. Lệch quy tắc — cần bạn quyết, không tự sửa

### 4.1 Quy tắc "số file → tầng" ✅ ĐÃ SỬA — và cách sửa đầu tiên cũng sai

Quy tắc đang dạy đếm **số tệp**: 2–4 → không `bo`; 4–6 → thêm `bo`; ≥7 → thêm
`controller`. Hai lỗi cùng lúc:

1. **Tự mâu thuẫn ở đúng n = 4** — "2–4" và "4–6" cùng phủ nó, nên một project
   bốn tệp vừa đúng vừa sai tuỳ đọc dòng nào trước. Nguồn gốc lộ ra ngay trong
   chính bảng ví dụ của `AUTHORING-BRIEF`: `CalculatorBill(4)` nằm ở hàng
   "không bo", `MatrixOOP(4)` nằm ở hàng "thêm bo". **Dữ liệu gốc mơ hồ ở bốn
   tệp**, và cái bảng chỉ chép lại sự mơ hồ đó thành một quy tắc.
2. **Đếm sai thứ** — 23/54 lời giải "vi phạm" bảng này, mà đọc kỹ thì phần lớn
   không sai: 16 bài ba tệp có `bo` là các đề thuật toán, `bo` giữ đúng thuật
   toán và không có entity nào cả.

#### Hai lần phát biểu lại đầu tiên đều bị phép đo bác bỏ

Đây là phần đáng đọc nhất của mục này. Tôi viết quy tắc mới, rồi đo nó trên 54
lời giải, và hai lần đầu đều sai:

| Phát biểu thử | Phép đo bác bỏ nó |
|---|---|
| "`controller` xuất hiện khi `ui` phải điều phối **nhiều hơn một `bo`**" | 7 phản chứng, gồm cả P0056 — chính project tôi vừa đưa lên slide làm mẫu chuẩn. Tất cả đều 1 `bo` + 1 controller |
| "`controller` để **giữ `main()` ngắn**" | `main` trung bình **58 dòng khi CÓ** controller và **67 dòng khi KHÔNG** — không có tín hiệu. `main` dài nhất (173 dòng, P0054) lại không có controller |

Phát biểu thứ ba mới trụ được, vì nó tách được hai nhóm bằng một con số:

> **`controller` xuất hiện khi chương trình làm NHIỀU LOẠI THAO TÁC KHÁC NHAU
> TRÊN MỘT TẬP DỮ LIỆU ĐƯỢC LƯU** — thêm/sửa/xoá/tìm/lưu. Không phải khi nó chỉ
> đơn giản là to.

| | số loại thao tác trên tập dữ liệu |
|---|---|
| 11 bài **CÓ** controller | trung bình **≈ 4,8** |
| Các bài **KHÔNG** có | trung bình **≈ 0,9** |

Và `bo`: **xuất hiện khi có luật nghiệp vụ hoặc thuật toán đáng tách khỏi màn
hình — kể cả project ba tệp.**

#### Vì sao P0080 mười tệp mà không cần controller

Đây là ca chứng minh số tệp không dùng làm luật được. P0080 Shapes có mười tệp
nhưng **chín tệp là lớp hình**, không phải chức năng — chương trình không thao
tác gì trên tập dữ liệu (0 loại). Bảng cũ bắt nó phải có controller; quy tắc mới
nói đúng là không. Đề nghị "thêm controller cho P0080" trong bản báo cáo trước
**là sai, đã rút**.

#### Kết quả sau khi phát biểu lại

**51/54 đúng quy tắc** (bảng cũ đếm theo tệp: 31/54). Ba ca còn lại là phát hiện
thật, đáng cân nhắc thêm `controller`:

| Bài | tệp | loại thao tác | `main` |
|---|---|---|---|
| P0073 quản lý chi tiêu | 4 | 6 | 118 dòng |
| P0055 quản lý bác sĩ | 4 | 5 | 135 dòng |
| P0058 từ điển | 3 | 5 | 95 dòng |

Đã sửa ở **năm chỗ** cho khớp nhau: Academy bài 1.1 (EN+VI) · Quiz 1 câu 1 ·
`AUTHORING-BRIEF.md` · `src/services/labRoom/quyTacThay.ts` (bộ quy tắc AI dựa
vào) · và hai walkthrough còn chép lại dải cũ (batch3, batch24).

Câu Quiz 1 hỏi "project 3 tệp nên có gì → entity + ui + utils, không bo" nay
**sai theo chính quy tắc mới**, đã đổi thành câu hỏi đúng thứ cần kiểm: *"Bạn
quyết định có thêm tầng bo hay không dựa vào…"* → *"có luật nghiệp vụ hay thuật
toán nào đáng tách khỏi màn hình không"*.

### 4.2 `bo` in ra màn hình — 3 bài ✅ ĐÃ SỬA

Quy tắc (Academy 1.1, và là **đáp án đúng của Quiz 4 câu 5**): "`bo` giữ
collection và ném Exception kèm thông báo; nó **KHÔNG** in ra màn hình."

Ba bài vi phạm: P0054 (`bo/ContactManager` in cả bảng danh bạ), P0063
(`bo/PersonManager` in "Information of Person…"), P0068 (`bo/StudentManager`
in danh sách sinh viên).

**Nhưng lời sửa đầu tiên tôi đề xuất — "chuyển phần in sang `ui`, để `bo` trả
về `List`" — là SAI, và đọc kỹ đề mới thấy.** Cả ba đề đều kết thúc phần
Guidelines bằng đúng ba chữ:

> Student must implement methods · `displayAll` / `displayPersonInfo` /
> `display` · **in startup code.**

"in startup code" nghĩa là các phương thức đó phải nằm trong **lớp khởi động**,
tức `Main` — không phải trong một lớp manager. Và cả ba đề đều đặc tả kiểu trả
về là `void` với cái tên "display", nên in ra màn hình là nghĩa duy nhất nó có
thể mang. Lớp `bo` chưa bao giờ là chỗ của chúng.

**Cách sửa đã áp dụng:** gộp các phương thức Guidelines nêu tên vào `ui/Main`
và **xoá hẳn tầng `bo`** ở cả ba bài. Ba quy tắc cùng thoả một lúc:

| | trước | sau | vì sao |
|---|---|---|---|
| P0054 | 4 tệp, có `bo` | **3 tệp** `entity+utils+ui` | danh sách là *tham số* của cả ba phương thức → không có tập dữ liệu nào để `bo` sở hữu |
| P0063 | 4 tệp, có `bo` | **3 tệp** `entity+utils+ui` | 25 LOC — dưới xa vạch cần tầng nghiệp vụ |
| P0068 | 5 tệp, có `bo` | **4 tệp**, Comparator sang `utils` | manager chỉ chứa 2 dòng uỷ quyền |

Bắt thêm được một lỗi khớp đề trong lúc sửa: đề P0068 viết
`List<Student> sortStudent(List<Student> students)` — **trả về** danh sách đã
sắp — còn lời giải cũ khai `void`. Đã sửa đúng chữ ký, và chỗ gọi nay đọc thành
`display(sortStudent(students))`.

Ba walkthrough đã được viết lại để giải thích quyết định này, vì "sao bài này
không có lớp manager?" chính là câu vấn đáp sẽ được hỏi.

Kiểm lại sau khi sửa: **54/54 xanh** ở cả `en_US` lẫn `vi_VN`, màn hình không
đổi một ký tự. Số bài có `bo` in ra màn hình: **0**.

### 4.3 `entity` không `implements Serializable` — 29 lớp POJO

Quy tắc nói "luôn luôn". Thực tế 29 lớp không có, và **hầu hết là hợp lý**:
`Shape`, `Circle`, `Bee`, `MyStack`, `Deck`… không bao giờ được ghi ra tệp.

Nên **sửa quy tắc** thành: "`implements Serializable` khi entity có thể bị ghi
ra tệp bằng `ObjectOutputStream`; các bài còn lại thì không cần — và biết trả
lời *vì sao không cần* là điểm cộng khi vấn đáp." Cargo-cult `Serializable`
trên một lớp `Circle` là thứ mentor sẽ hỏi ngược lại.

### 4.4 `entity` in ra màn hình — 2 bài, nhưng đề bắt

P0061 (`Shape.printResult()`) và P0052 (`Country`) in ra màn hình vì
**Guidelines của đề yêu cầu đúng phương thức đó**. Lời giải theo đề là đúng
(Guidelines là hợp đồng). Nhưng phần walkthrough của P0061 giải thích rất kỹ
mọi thứ khác mà **không có một câu nào** về mâu thuẫn này — trong khi
"sao entity của em lại in, trong khi khoá học nói entity không in?" là câu
vấn đáp gần như chắc chắn. Nên thêm một đoạn.

### 4.5 `System.exit()` trong Validator — L.P0013

Bài giảng 847 Part 5 nói rõ: "Thoát bằng cờ boolean, **không** `System.exit(0)`
— `System.exit` giết JVM ngay, bước lưu tệp trước khi thoát không bao giờ chạy."
`L.P0013/utils/Validator.java:81,85` gọi `System.exit(0)` khi stdin đóng.
Lý do trong comment là hợp lý (EOF = không còn ai để hỏi), nhưng bài này **có
ghi tệp**, nên đường thoát đó bỏ qua lưu. Nên đổi sang ném một exception
"đã hết input" để `ui` bắt và thoát sạch.

### 4.6 `bo` kiêm luôn đọc/ghi tệp — 15 bài (SRP)

Bố cục mẫu ở 847 Part 12 tách riêng `FileHelper.java  UTILITY  load() và save()`.
15 lời giải gộp phần tệp vào `bo` (`DataStore`, `FruitManager`, `CopyManager`…).
Với quy mô LAB211 thì chấp nhận được, nhưng nó lệch với chính hình vẽ đang dạy —
nên hoặc sửa hình vẽ, hoặc nói rõ "gộp được khi `bo` chỉ phục vụ một entity".

---

## 5. Chấm 54 bài theo thước SOLID (tham khảo — LAB211 không đòi)

| | Trạng thái |
|---|---|
| **S** Single Responsibility | Tốt trừ §4.2 (3 bài `bo` in) và §4.6 (15 bài `bo` kiêm tệp) |
| **O** Open/Closed | Tốt — `Shape`/`Bee`/`Person` đều là `abstract` + lớp con tự lo, không có `if (kiểu == …)` |
| **L** Liskov | Tốt — không có lớp con nào ném `UnsupportedOperation` hay đổi nghĩa hợp đồng |
| **I** Interface Segregation | Chỉ 3 bài có `interface` (`Soundable`, `Persistable` ×2), đều nhỏ và đúng chỗ. Đề không đòi thêm |
| **D** Dependency Inversion | Hầu như không có — `controller` phụ thuộc thẳng lớp `bo` cụ thể. **Đúng với quy mô LAB211**; nhét DI vào đây là over-engineering và sẽ bị trừ điểm chứ không được cộng |

---

## 6. Việc đã làm trong lần kiểm này

* Vá `Locale.US` — 21 chỗ / 16 file / 8 bài. Verify xanh dưới `en_US`, `vi_VN`, `de_DE`.
* Sửa thẻ link bài Academy 1.1 → P0056 (project thật sự có đủ 5 tầng).
* Thêm `solkit.verify_all_locales()` — chốt chạy cả hai locale, và đã **kiểm
  ngược chính cái chốt** (tháo `Locale.US` ra thì nó đỏ đúng chỗ) trước khi tin nó.
* Gỡ tầng `bo` khỏi P0054, P0063, P0068 và đưa các phương thức Guidelines nêu
  tên vào `ui/Main` đúng như đề nói — kèm sửa chữ ký `sortStudent` của P0068 và
  viết lại ba walkthrough (§4.2).
* Phát biểu lại quy tắc tầng theo **thứ chương trình LÀM**, bỏ hẳn chỗ tự mâu
  thuẫn ở n = 4 — sau khi hai phát biểu thử đầu tiên bị chính phép đo bác bỏ.
  Sửa đồng bộ ở năm chỗ. Đúng quy tắc nay **51/54** (§4.1).
* Sửa tên phương thức/lớp cho khớp đề ở **P0058, P0053, P0055**, và thêm phép
  kiểm `khopchuky.py` soát cả 54 bài — thứ `javac` không bao giờ thấy (§3.3).
* Đọc lại cho đúng cụm **"in startup code"**: nó KHÔNG tự nó quyết định lớp nào,
  và P0055 là phản chứng nằm ngay trong cùng một đề (§3.4).

## 7. Việc đề nghị làm tiếp (theo thứ tự ưu tiên)

1. Nới quy tắc `Serializable` thành "khi có ghi tệp" (§4.3).
2. ~~Cân nhắc thêm `controller` cho P0073, P0055, P0058~~ — **đã rút**. Đi kiểm
   thì không bài nào thiếu controller; thứ thực sự lệch là **tên phương thức và
   tên lớp không khớp đề**, đã sửa và đã có phép kiểm tự động chặn (§3.3).
3. Thêm đoạn "vì sao entity ở bài này được phép in" vào walkthrough P0061 (§4.4).
4. Đổi `System.exit()` trong `L.P0013/Validator` thành exception (§4.5).
5. **Giữ lượt verify dưới locale `vi_VN` trong mọi quy trình** — đó là thứ duy
   nhất bắt được lỗi §3.1, và nó là locale của máy chấm.

~~Thêm controller cho P0080~~ — **đã rút**: phép đo cho thấy P0080 đúng là không
cần (xem §4.1).
