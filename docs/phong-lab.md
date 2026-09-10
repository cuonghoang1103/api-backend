# Phòng Lab — luyện LAB211 theo mục tiêu LOC, có gia sư AI kèm

Người học chọn một nhóm bài trong track, tổng LOC cộng dồn lên màn hình, rồi lập
một **phòng** có mục tiêu LOC (mặc định **750**). Trong phòng, mỗi lần làm đúng
một bài, với bốn việc AI làm cho bài đó — và cả bốn đứng trên **cùng một bộ quy
tắc của thầy**.

## Đường đi của người học

```
/code-lab/lab211                 bấm "Chọn bài lập phòng Lab" → tick từng bài
      │                          thanh dưới đáy cộng dồn LOC + đặt mục tiêu
      │                          ô đích: tạo phòng MỚI, hoặc THÊM vào phòng có sẵn
      ▼
/code-lab/phong-lab/<id>         phòng riêng
      ├── Giảng đề              AI đọc đề, nói nó THẬT SỰ hỏi gì, kiến trúc nào,
      │                         làm theo thứ tự nào, bẫy của riêng đề này
      ├── Trợ giảng             chat: từng dòng, từng method, từng lớp, từng package
      ├── Nộp bài               tải .zip project → AI chấm THAY THẦY, hỏi vặn
      │                         "vòng for này để làm gì", "method này có comment chưa"
      └── Review với thầy       chỉ mở sau khi ĐẠT: kịch bản trình bày, mở file nào,
                                nói câu gì, thầy hỏi gì thì trả lời ra sao
```

Đạt bài nào thì **LOC của bài đó** cộng vào phòng. Hai con số cố ý khác nhau:

| | nghĩa |
|---|---|
| **đã chọn** | tổng LOC mọi bài trong phòng — lộ trình người học tự vạch |
| **đã đạt** | chỉ LOC của bài đã qua vòng chấm — tiến bộ thật |

Gộp hai cái vào một thanh là biến mục tiêu thành thứ đạt được bằng cách tick thêm
bài, chứ không phải bằng cách làm xong bài.

## Nhặt thêm bài vào phòng đang có

Không phải lần chọn nào cũng là lần đầu. Chỉ có nút "Tạo phòng Lab" thì người đã
có phòng và muốn thêm ba bài nữa sẽ tạo phòng thứ hai — rồi tiến độ LOC nằm rải
ở hai chỗ và không chỗ nào nói đúng sự thật.

* Thanh chọn bài có **ô đích**: mặc định *Tạo phòng mới*, kèm mọi phòng **của
  đúng track này** (phòng LAB211 không nhận được bài track khác — backend chặn,
  nên không bày ra để người dùng chọn rồi ăn lỗi).
* Trong phòng, link *"+ Chọn thêm bài từ track"* mở
  `/code-lab/<track>?chon=<roomId>` — trang track mở **đã ở chế độ chọn** và
  **ghim sẵn phòng đó** làm đích. Quên đổi ô một lần là có phòng thứ hai.
* Bài đã nằm trong phòng ghim hiện nhãn *"đã có trong phòng"* và **không tick
  được**. Không có nó thì người dùng tick mù rồi nhận về "đã có sẵn rồi" mà
  không biết bài nào trùng.
* Ba chốt chặn cái bug "vô tình đẻ thêm phòng":
  1. danh sách phòng CHƯA về thì nút chưa bấm được (bấm sớm sẽ rơi vào nhánh
     tạo mới);
  2. phòng ghim trong URL đã bị xoá / thuộc track khác thì rơi về *Tạo phòng
     mới* thay vì để nút chết cứng không lời giải thích;
  3. `themBai` **ném lỗi có chữ** khi không thêm được bài nào, thay vì im lặng
     trả phòng y nguyên.
* Khi đích là một phòng có sẵn, thanh tiến độ đo theo **mục tiêu của phòng đó**,
  không phải ô nhập trên thanh — hai màn hình phải nói cùng một con số.

## Bộ quy tắc của thầy

`src/services/labRoom/quyTacThay.ts` là **nguồn sự thật duy nhất**, rút từ chính
tài liệu đang chạy trên web:

* Academy `LAB211` — 40 bài / 10 mục (`content/academy/LAB211.mjs`)
* Bài giảng Code Lab module 847 — 15 phần (`docs/codelab-authoring/lab211/lesson/`)
* Academy `PRO192` 3.1 (access modifier) và N2.1 (SOLID) — môn tiên quyết
* `docs/codelab-authoring/lab211/solutions/AUTHORING-BRIEF.md`
* `docs/codelab-authoring/lab211/AUDIT-QUY-TAC.md` — bản ĐÃ SỬA sau đợt đối chiếu 10/09/2026

Ba điều bộ quy tắc nói thẳng, và AI bắt buộc phải theo:

1. **Guidelines của đề là hợp đồng**, ảnh màn hình thì không. Vênh nhau thì theo
   Guidelines và NÓI RA là mình thấy vênh.
2. **"in startup code"** nghĩa là phương thức nằm trong lớp khởi động, không phải
   trong lớp manager. Ba chữ đó quyết định bố cục.
3. **LAB211 không chấm SOLID và không dạy design pattern** (đó là PRO192 và
   SWD392). AI bị cấm đẩy người học nhét interface / DI / design pattern vào một
   bài 40 dòng — ở môn này đó là over-engineering và MẤT điểm.

Sửa quy tắc thì sửa đúng một file đó; bốn tính năng cùng đổi theo.

## Model

purpose `lab_room` → **`claude-opus-4-8`**, nằm trong `RAMBO_PURPOSES_CO_DINH`
nên **luôn** đi cổng riêng `rambo.ai.vn` và không lùi sang modelapi (modelapi
không phục vụ được model Claude — xem `gateway.ts`).

Cần hai biến ở `/opt/cuonghoangdev/.env` trên VPS:

```bash
AGENT_GATEWAY_BASE_URL=https://rambo.ai.vn/api/claude
AGENT_GATEWAY_API_KEY=sk-...
```

Thiếu thì `congAgent()` trả `null`, lời gọi rơi về modelapi và `modelGoiDuoc()`
đổi sang model tương đương — không chết, nhưng chất lượng chấm bài tụt.

Ghim tạm model khác: `LLM_MODEL_LAB_ROOM`.

## Quyền

Mọi lời gọi AI trong phòng là **Pro**, kiểm ở service chứ không chỉ ở route
(`assertAi`). Tạo/sửa/xoá phòng thì chỉ cần đăng nhập. Quyền sở hữu phòng được
kiểm lại trong `phongCuaToi()` ở mọi thao tác — route chỉ biết "có đăng nhập",
nó không biết phòng này của ai.

## API

Tất cả dưới `/api/v1/code-lab/lab-rooms`, đều `authenticate`.

| Method | Đường | Việc |
|---|---|---|
| GET | `/` | danh sách phòng của tôi |
| POST | `/` | tạo phòng `{trackSlug, exerciseIds[], name?, locGoal?}` |
| GET · PATCH · DELETE | `/:id` | đọc · đổi tên/mục tiêu · xoá |
| POST | `/:id/items` | thêm bài `{exerciseIds[]}` — ném lỗi nếu không có bài nào MỚI |
| DELETE | `/:id/items/:itemId` | bỏ bài |
| POST | `/:id/items/:itemId/select` | mở bài |
| GET · POST | `/:id/items/:itemId/intro` | giảng đề (GET dùng bản đã soạn, POST soạn lại) |
| GET · POST · DELETE | `/:id/items/:itemId/chat` | lịch sử · hỏi · xoá hội thoại |
| POST | `/:id/items/:itemId/submit` | nộp `.zip` (multipart `file`), AI chấm |
| GET | `/:id/items/:itemId/review` | đọc lại kết quả chấm đã lưu (KHÔNG gọi AI) |
| GET · POST | `/:id/items/:itemId/guide` | hướng dẫn review với thầy (chỉ khi ĐẠT) |

`GET /lab-rooms` đã nằm trong danh sách smoke-test của `deploy.sh`
(chưa đăng nhập trả 401 = đã mount).

## Điều kiện "ĐẠT"

Bài chỉ chuyển `PASSED` khi **cả hai** đúng: AI trả `dat: true` **và** điểm ≥ 8.
Chỉ tin một mình cờ `dat` thì một lượt rộng tay là bài được đánh dấu qua trong
khi vẫn thiếu yêu cầu của đề — và người học mang đúng bài đó đi gặp thầy.

## LOC lấy từ đâu

Không có cột LOC trong DB. LOC nằm trong **tiêu đề bài** dạng `... (37 LOC)` —
đo thật: 54/54 bài LAB211 đều có. `locCuaBai()` đọc tiêu đề trước, lùi về
`problemHtml`, cùng lắm trả 0 (không bao giờ `NaN` — `NaN` cộng vào tổng là hỏng
cả thanh tiến độ mà không có lỗi nào ném ra). Bộ kiểm:
`npx tsx --test src/services/labRoom/locCuaBai.test.ts`

**LOC được CHỐT vào `code_lab_room_items.loc` lúc chọn bài**, không đọc lại. Sửa
tiêu đề một bài mà tổng LOC của một phòng đang làm dở nhảy theo là thứ không
giải thích được với người dùng.

## Triển khai

```bash
npx prisma migrate deploy      # 3 bảng + 1 enum, migration VIẾT TAY
```

Migration viết tay chứ không phải `migrate dev` sinh ra: trong kho này
`migrate dev` không chạy được (migration `20260706130000_add_music_and_profile`
có UNIQUE constraint và index trùng tên nên không replay được trên shadow DB —
P3006, đã deploy nên không được sửa).

Đã kiểm bằng Postgres 16 thật (10/09/2026): dựng bảng cha tối thiểu → chạy
`migration.sql` → `prisma migrate diff` so với schema ra **rỗng**, tức SQL tay
tạo ra đúng thứ Prisma mong đợi. Kiểm thêm hành vi khoá ngoại: xoá bài đang mở
thì phòng CÒN và `active_item_id` về NULL; tin nhắn cascade theo bài; bài cascade
theo phòng; một bài không vào cùng một phòng hai lần nhưng vào được nhiều phòng.
