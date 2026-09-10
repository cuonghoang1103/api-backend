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

## 4. Lệch quy tắc — cần bạn quyết, không tự sửa

### 4.1 Quy tắc "số file → tầng" bị chính lời giải mẫu phá 24/54 lần

Quy tắc đang dạy (Academy 1.1 + `AUTHORING-BRIEF.md`): 2–4 file → `entity+ui+utils`
không `bo`; 4–6 file → thêm `bo`; ≥7 file → thêm `controller`.

| Kiểu lệch | Số bài | Bài |
|---|---|---|
| ≤3 file mà đã có `bo` | 16 | P0001–P0006, P0008, P0009, P0010, P0053, P0058, P0067, P0069, P0075, P0076, P0079 |
| 4–6 file mà **không** có `bo` | 2 | P0060 (4f), P0061 (6f) |
| ≥7 file mà **không** có `controller` | 2 | P0081 (7f), P0080 (10f) |
| <7 file mà đã có `controller` | 4 | P0085 (5f), P0071, P0072, L.P0025 (6f) |

Đọc kỹ thì 16 ca đầu **không phải code sai** — chúng là các bài thuật toán
(bubble/selection/insertion/quick/merge sort, tìm kiếm, xử lý tệp) không có
entity nào cả, và lớp `bo` ở đó giữ đúng thuật toán. Chính quy tắc mới là thứ
phát biểu chưa chuẩn: nó đếm **file**, trong khi thứ quyết định thật là **có
mấy loại trách nhiệm**.

Hai lựa chọn, nên chọn (a):

* **(a) Sửa quy tắc, giữ code.** Phát biểu lại theo trách nhiệm: "`bo` xuất hiện
  khi có luật nghiệp vụ hoặc thuật toán tách được khỏi màn hình — kể cả project
  3 file; `controller` xuất hiện khi `ui` phải điều phối nhiều hơn một `bo`."
  Rồi bổ sung bảng số file như một *chỉ dấu*, không phải luật.
* **(b) Sửa 24 lời giải cho khớp bảng.** Tốn công, và làm P0001 tệ đi: nhét
  thuật toán sort vào `ui/Main` là bước lùi.

Dù chọn cách nào, **P0080 (10 file, không controller)** vẫn nên thêm controller
— đó là ca duy nhất mà bảng và lẽ thường nói cùng một điều.

### 4.2 `bo` in ra màn hình — 3 bài

Quy tắc (Academy 1.1, và là **đáp án đúng của Quiz 4 câu 5**): "`bo` giữ
collection và ném Exception kèm thông báo; nó **KHÔNG** in ra màn hình."

| Bài | Chỗ vi phạm |
|---|---|
| P0054 | `bo/ContactManager.java:63,66,68` — in cả bảng danh bạ |
| P0063 | `bo/PersonManager.java:41,42` — in "Information of Person you have entered:" |
| P0068 | `bo/StudentManager.java:25,26` — in danh sách sinh viên |

Đây là vi phạm thật, và là **đúng thứ mentor hay hỏi** ("bỏ menu đi thì `bo`
còn biên dịch được không?"). Sửa: chuyển phần in sang `ui`, để `bo` trả về
`List`/`String`. Không ảnh hưởng output nên verify vẫn xanh.

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

## 7. Việc đề nghị làm tiếp (theo thứ tự ưu tiên)

1. Phát biểu lại quy tắc tầng theo **trách nhiệm**, không theo **số file** (§4.1).
2. Bỏ `System.out` khỏi `bo` ở P0054, P0063, P0068 (§4.2).
3. Nới quy tắc `Serializable` thành "khi có ghi tệp" (§4.3).
4. Thêm controller cho P0080 (10 file) (§4.1).
5. Thêm đoạn "vì sao entity ở bài này được phép in" vào walkthrough P0061 (§4.4).
6. Đổi `System.exit()` trong `L.P0013/Validator` thành exception (§4.5).
7. **Thêm một lượt verify dưới locale `vi_VN` vào quy trình** — đó là thứ duy
   nhất bắt được lỗi §3.1, và nó là locale của máy chấm.
