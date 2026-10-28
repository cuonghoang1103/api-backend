# Hướng dẫn từng bước của phòng lab — dòng thời gian cho video

> Tệp này SINH TỰ ĐỘNG bởi `npx tsx scripts/labs-tours.mts --md` (từ `frontend/`). Đừng sửa tay — sửa kịch bản ở
> `tour/tours-cpu.ts`, `tour/tours-os.ts` rồi chạy lại. Số đo thật: `--measure <base-url>` ghi `tours.timing.json`.

## Cách quay một tour

1. Mở `<site>/<cpu-lab|os-lab>?record=1&tour=<id>&lang=vi` (thêm `&rate=2` để chạy nhanh gấp đôi khi thử). Chế độ quay chỉ còn
   mô phỏng trên nền phẳng (che hết thanh điều hướng của site), tour tự bắt đầu sau 0,9 s và tự đi hết, không ngẫu nhiên
   (phòng máy "bí ẩn" luôn là sự cố đầu tiên). Viewport khuyên dùng 1280×800 (16:9 sau khi cắt) hoặc 1080×1350 (dọc).
2. Playwright: `page.goto(url)` → quay màn hình → chờ `document.documentElement.dataset.labTour === "done"` → dừng quay.
   Trạng thái sống: `window.__labTour = { id, idx, total, phase, stuck, missing }` (`stuck`/`missing` rỗng = tour chạy đúng).
3. Mốc thời gian thật của từng bước: `window.__labTourLog = [{ t, idx, phase }]` (ms, tính từ lúc tour bắt đầu — cộng 900 ms
   nếu tính từ lúc trang mở). Remotion dùng mốc này để chèn lời đọc / phụ đề đúng bước.
4. Âm thanh: quay màn hình không thu tiếng. Mọi tiếng "cute" phát ra (kể cả khi tắt loa) được ghi ở
   `window.__labSfxLog = [{ t, name }]` — Remotion chèn lại bằng cùng bộ tổng hợp (`labs/sfx.ts`, tên tiếng → nốt) hoặc tệp tiếng tương ứng.
5. Mỗi bước: tour tự làm `do` (đặt bit, nạp chương trình, nhảy vi bước…), đọc lời trong thẻ; bước có việc thì chờ 35% thời
   lượng rồi tự "làm giúp", chờ điều kiện đạt, nghỉ thêm 25%. Cuối tour: câu hỏi hiện 2,6 s rồi tự chọn đáp án đúng, giữ tới 7 s.

Thời lượng danh nghĩa một bước = 1,2 s + 62 ms × số ký tự (tiêu đề + lời), kẹp 3,5–11 s; khoảng nghỉ giữa hai hành động 120 ms; câu hỏi 7 s.
Số đo thật: 2026-10-28 (record=1, rate=1, viewport 1280×800, lang=vi).

## Mục lục

| tour | phòng lab | mô phỏng | bước | danh nghĩa (vi) | đo thật (vi) | URL quay |
|---|---|---|---|---|---|---|
| [bits-basics](#bits-basics) | cpu-lab | bits | 11 | 117.2 s | 117.2 s | `/cpu-lab?record=1&tour=bits-basics&lang=vi` |
| [bits-convert](#bits-convert) | cpu-lab | bits | 6 | 63.9 s | 63.2 s | `/cpu-lab?record=1&tour=bits-convert&lang=vi` |
| [bits-signed](#bits-signed) | cpu-lab | bits | 6 | 65.5 s | 65.5 s | `/cpu-lab?record=1&tour=bits-signed&lang=vi` |
| [bits-ops](#bits-ops) | cpu-lab | bits | 6 | 63.4 s | 63.4 s | `/cpu-lab?record=1&tour=bits-ops&lang=vi` |
| [data-text](#data-text) | cpu-lab | data | 5 | 52.7 s | 52.7 s | `/cpu-lab?record=1&tour=data-text&lang=vi` |
| [data-float](#data-float) | cpu-lab | data | 5 | 54.8 s | 54.8 s | `/cpu-lab?record=1&tour=data-float&lang=vi` |
| [logic-gates](#logic-gates) | cpu-lab | logic | 5 | 56.4 s | 56.5 s | `/cpu-lab?record=1&tour=logic-gates&lang=vi` |
| [logic-adder](#logic-adder) | cpu-lab | logic | 3 | 32.4 s | 32.5 s | `/cpu-lab?record=1&tour=logic-adder&lang=vi` |
| [logic-ripple](#logic-ripple) | cpu-lab | logic | 4 | 39.3 s | 42.8 s | `/cpu-lab?record=1&tour=logic-ripple&lang=vi` |
| [cpu-first](#cpu-first) | cpu-lab | cpu | 8 | 88.7 s | 88.8 s | `/cpu-lab?record=1&tour=cpu-first&lang=vi` |
| [fetch-decode](#fetch-decode) | cpu-lab | cpu | 12 | 122.8 s | 134.0 s | `/cpu-lab?record=1&tour=fetch-decode&lang=vi` |
| [cpu-bus](#cpu-bus) | cpu-lab | cpu | 7 | 67.9 s | 66.4 s | `/cpu-lab?record=1&tour=cpu-bus&lang=vi` |
| [pipeline-stages](#pipeline-stages) | cpu-lab | pipeline | 8 | 78.7 s | 78.8 s | `/cpu-lab?record=1&tour=pipeline-stages&lang=vi` |
| [cache-basics](#cache-basics) | cpu-lab | cache | 6 | 64.0 s | 73.1 s | `/cpu-lab?record=1&tour=cache-basics&lang=vi` |
| [cache-mapping](#cache-mapping) | cpu-lab | cache | 4 | 45.9 s | 45.9 s | `/cpu-lab?record=1&tour=cache-mapping&lang=vi` |
| [process-shell](#process-shell) | os-lab | process | 7 | 81.8 s | 81.0 s | `/os-lab?record=1&tour=process-shell&lang=vi` |
| [sched-policies](#sched-policies) | os-lab | scheduler | 7 | 67.4 s | 72.6 s | `/os-lab?record=1&tour=sched-policies&lang=vi` |
| [race-lost-update](#race-lost-update) | os-lab | race | 8 | 85.7 s | 84.3 s | `/os-lab?record=1&tour=race-lost-update&lang=vi` |
| [race-deadlock](#race-deadlock) | os-lab | race | 5 | 48.6 s | 55.2 s | `/os-lab?record=1&tour=race-deadlock&lang=vi` |
| [vm-translate](#vm-translate) | os-lab | vm | 6 | 70.3 s | 66.3 s | `/os-lab?record=1&tour=vm-translate&lang=vi` |
| [vm-thrash](#vm-thrash) | os-lab | vm | 4 | 44.3 s | 44.3 s | `/os-lab?record=1&tour=vm-thrash&lang=vi` |
| [sysmon-read](#sysmon-read) | os-lab | sysmon | 7 | 62.9 s | 65.5 s | `/os-lab?record=1&tour=sysmon-read&lang=vi` |
| [eventloop-order](#eventloop-order) | os-lab | eventloop | 6 | 69.6 s | 79.0 s | `/os-lab?record=1&tour=eventloop-order&lang=vi` |
| [eventloop-block](#eventloop-block) | os-lab | eventloop | 5 | 47.2 s | 59.0 s | `/os-lab?record=1&tour=eventloop-block&lang=vi` |
| [deadlock-detect](#deadlock-detect) | os-lab | deadlock | 5 | 58.8 s | 69.6 s | `/os-lab?record=1&tour=deadlock-detect&lang=vi` |
| [deadlock-banker](#deadlock-banker) | os-lab | deadlock | 5 | 50.7 s | 62.4 s | `/os-lab?record=1&tour=deadlock-banker&lang=vi` |
| [process-start](#process-start) | os-lab | process | 5 | 54.6 s | 54.7 s | `/os-lab?record=1&tour=process-start&lang=vi` |
| [scheduler-start](#scheduler-start) | os-lab | scheduler | 5 | 54.6 s | 54.7 s | `/os-lab?record=1&tour=scheduler-start&lang=vi` |
| [race-start](#race-start) | os-lab | race | 5 | 54.6 s | 54.7 s | `/os-lab?record=1&tour=race-start&lang=vi` |
| [memory-start](#memory-start) | os-lab | memory | 5 | 54.8 s | 54.9 s | `/os-lab?record=1&tour=memory-start&lang=vi` |
| [vm-start](#vm-start) | os-lab | vm | 5 | 54.6 s | 54.6 s | `/os-lab?record=1&tour=vm-start&lang=vi` |
| [sysmon-start](#sysmon-start) | os-lab | sysmon | 4 | 46.5 s | 46.5 s | `/os-lab?record=1&tour=sysmon-start&lang=vi` |
| [eventloop-start](#eventloop-start) | os-lab | eventloop | 5 | 57.4 s | 51.8 s | `/os-lab?record=1&tour=eventloop-start&lang=vi` |
| [threadpool-start](#threadpool-start) | os-lab | threadpool | 5 | 57.4 s | 57.4 s | `/os-lab?record=1&tour=threadpool-start&lang=vi` |
| [sync-start](#sync-start) | os-lab | sync | 5 | 57.4 s | 57.4 s | `/os-lab?record=1&tour=sync-start&lang=vi` |
| [deadlock-start](#deadlock-start) | os-lab | deadlock | 5 | 57.2 s | 57.2 s | `/os-lab?record=1&tour=deadlock-start&lang=vi` |
| [cgroup-start](#cgroup-start) | os-lab | cgroup | 5 | 57.4 s | 57.4 s | `/os-lab?record=1&tour=cgroup-start&lang=vi` |
| [cow-start](#cow-start) | os-lab | cow | 5 | 57.4 s | 40.8 s | `/os-lab?record=1&tour=cow-start&lang=vi` |
| [pagecache-start](#pagecache-start) | os-lab | pagecache | 5 | 57.4 s | 57.4 s | `/os-lab?record=1&tour=pagecache-start&lang=vi` |
| [latency-start](#latency-start) | os-lab | latency | 5 | 52.9 s | 53.0 s | `/os-lab?record=1&tour=latency-start&lang=vi` |
| [bits-start](#bits-start) | cpu-lab | bits | 5 | 57.4 s | 40.8 s | `/cpu-lab?record=1&tour=bits-start&lang=vi` |
| [data-start](#data-start) | cpu-lab | data | 5 | 57.4 s | 40.8 s | `/cpu-lab?record=1&tour=data-start&lang=vi` |
| [logic-start](#logic-start) | cpu-lab | logic | 5 | 57.4 s | 40.8 s | `/cpu-lab?record=1&tour=logic-start&lang=vi` |
| [cpu-start](#cpu-start) | cpu-lab | cpu | 5 | 57.4 s | 57.4 s | `/cpu-lab?record=1&tour=cpu-start&lang=vi` |
| [pipeline-start](#pipeline-start) | cpu-lab | pipeline | 5 | 57.4 s | 57.4 s | `/cpu-lab?record=1&tour=pipeline-start&lang=vi` |
| [cache-start](#cache-start) | cpu-lab | cache | 5 | 57.4 s | 57.4 s | `/cpu-lab?record=1&tour=cache-start&lang=vi` |

## bits-basics

**Từ dòng điện tới con số** / From electricity to numbers — cpu-lab · `bits` · preset mặc định của: intro, play

Vì sao máy tính chỉ dùng 0 và 1, một byte mang sáu nghĩa ra sao, đếm nhị phân, hex và số âm.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `head` | Chào bạn! Đây là phòng lab bit | bits.tab("intro") |  |
| 2 | 11.9 s | 11.0 s (en 11.0 s) | 11.9 s | `wire` | Một sợi dây, hai trạng thái | intro.noise(0.3), intro.volts(3.1) |  |
| 3 | 22.9 s | 5.4 s (en 5.7 s) | 22.9 s | `volt-sliders` | Đến lượt bạn: biến nó thành 0 | — | Kéo điện áp xuống dưới 0,8 V. → intro.volts(0.4) +300ms |
| 4 | 28.3 s | 11.0 s (en 11.0 s) | 28.3 s | `wire` | Vì sao chỉ hai mức? | intro.volts(2.3), intro.noise(1) +500ms |  |
| 5 | 39.3 s | 8.1 s (en 8.1 s) | 39.3 s | `bulbs` | Tám sợi dây = một byte | intro.noise(0.3), intro.volts(3.1), intro.pattern(0) | Bật bóng thứ 2 từ trái và bóng cuối cùng bên phải (mẫu 01000001). → intro.pattern(64) +400ms, intro.pattern(65) +500ms |
| 6 | 47.4 s | 11.0 s (en 11.0 s) | 47.4 s | `readings` | Cùng dãy bit, sáu nghĩa | — |  |
| 7 | 58.4 s | 11.0 s (en 11.0 s) | 58.4 s | `bit-row` | Đếm nhị phân | bits.tab("play"), board.width(8), board.set(0), board.inc ×≤5 +700ms |  |
| 8 | 69.4 s | 7.8 s (en 7.4 s) | 69.4 s | `bit-row` | Đến lượt bạn: tạo số 200 | — | Làm cho byte bằng 200. → board.set(128) +300ms, board.set(192) +600ms, board.set(200) +600ms |
| 9 | 77.2 s | 11.0 s (en 11.0 s) | 77.2 s | `hex` | Hệ 16 (hex): nhị phân cho người đọc | — |  |
| 10 | 88.2 s | 11.0 s (en 11.0 s) | 88.2 s | `column-add` | Số âm | bits.tab("signed"), signed.load([127,1,"+",8]) |  |
| 11 | 99.2 s | 11.0 s (en 11.0 s) | 99.2 s | `flags` | CPU biết điều đó: các cờ | — |  |
| ✓ | 110.2 s | 7.0 s | 110.2 s | — | Câu hỏi: Byte 0100 0001 có nghĩa là gì? | đáp án đúng: B | — |

Tiếng (đo thật): 1.8 s start · 27.0 s step-ok · 45.4 s step-ok · 60.4 s tap · 61.2 s tap · 62.0 s tap · 62.9 s tap · 63.7 s tap · 75.5 s step-ok · 113.7 s right · 118.1 s done

## bits-convert

**Đổi thập phân → nhị phân bằng tay** / Decimal → binary by hand — cpu-lab · `bits` · preset mặc định của: convert

Phương pháp chia liên tiếp với số 200, mỗi bước một phép chia, rồi kiểm ngược bằng trọng số — kèm mẹo hex.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 10.5 s (en 11.0 s) | 0.9 s | `division` | Phương pháp | bits.tab("convert"), convert.base(2), convert.n(200), player.seek(0) |  |
| 2 | 11.4 s | 7.6 s (en 7.5 s) | 11.4 s | `division` | Phép chia đầu tiên | player.seek(1) |  |
| 3 | 19.0 s | 10.8 s (en 10.5 s) | 19.0 s | `step` | Đến lượt bạn: chia tiếp | — | Bấm Bước tới phép chia cuối (thương bằng 0). → player.step ×≤8 +550ms |
| 4 | 29.8 s | 8.9 s (en 10.4 s) | 29.1 s | `division` | Đọc từ dưới lên | player.seek(9) |  |
| 5 | 38.6 s | 8.3 s (en 8.7 s) | 38.0 s | `places` | Kiểm lại | player.seek(10) |  |
| 6 | 46.9 s | 9.9 s (en 10.4 s) | 46.3 s | `base` | Hệ 16 cũng vậy | convert.base(16), player.end +300ms |  |
| ✓ | 56.2 s | 7.0 s | 56.2 s | — | Câu hỏi: Khi chia liên tiếp, số dư đầu tiên bạn nhận được là… | đáp án đúng: B | — |

Tiếng (đo thật): 1.8 s start · 12.3 s tick · 23.6 s tick · 24.3 s tick · 24.9 s tick · 25.6 s tick · 26.3 s tick · 27.0 s tick · 27.6 s step-ok · 27.6 s tick · 30.0 s tick · 38.9 s tick · 59.7 s right · 64.1 s done

## bits-signed

**Số âm và tràn số** / Negative numbers and overflow — cpu-lab · `bits` · preset mặc định của: signed

Bù hai trên vòng số 4 bit, cộng theo cột như ALU, và vì sao 127 + 1 = −128.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `two-readings` | Vòng số 4 bit | bits.tab("signed"), signed.load([5,4,"+",4]) |  |
| 2 | 11.9 s | 11.0 s (en 11.0 s) | 11.9 s | `column-add` | 5 + 4 trong bốn bit | — |  |
| 3 | 22.9 s | 11.0 s (en 11.0 s) | 22.9 s | `column-add` | Cộng theo cột, đúng như ALU | signed.load([100,50,"+",8]) |  |
| 4 | 33.9 s | 3.3 s (en 3.6 s) | 33.9 s | `signed-presets` | Đến lượt bạn: ca tràn số nổi tiếng | — | Chọn ví dụ 127 + 1. → signed.load([127,1,"+",8]) +300ms |
| 5 | 37.2 s | 11.0 s (en 11.0 s) | 37.2 s | `flags` | −128 và cờ V | — |  |
| 6 | 48.2 s | 10.3 s (en 11.0 s) | 48.2 s | `column-add` | Phép trừ là phép cộng | signed.load([5,9,"-",8]) |  |
| ✓ | 58.5 s | 7.0 s | 58.5 s | — | Câu hỏi: Trong số có dấu 8 bit, 127 + 1 bằng… | đáp án đúng: B | — |

Tiếng (đo thật): 1.8 s start · 36.8 s step-ok · 62.0 s right · 66.4 s done

## bits-ops

**Mặt nạ bit và dịch bit** / Bit masks and shifts — cpu-lab · `bits` · preset mặc định của: ops

AND giữ bit, OR bật bit, XOR lật bit; dịch bit là nhân/chia 2.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `ops-rows` | AND: chỉ giữ vài bit | bits.tab("ops"), ops.example(0) |  |
| 2 | 11.9 s | 10.1 s (en 10.7 s) | 11.9 s | `ops-rows` | OR: bật bit | ops.example(1) |  |
| 3 | 22.0 s | 9.3 s (en 10.6 s) | 22.0 s | `ops-result` | XOR: lật bit | ops.example(2) |  |
| 4 | 31.3 s | 4.8 s (en 4.9 s) | 31.3 s | `ops-pick` | Đến lượt bạn: dịch bit | — | Chọn phép dịch trái. → ops.example(4) +300ms |
| 5 | 36.1 s | 10.3 s (en 11.0 s) | 36.1 s | `ops-result` | Dịch trái = × 2 | — |  |
| 6 | 46.3 s | 10.1 s (en 11.0 s) | 46.3 s | `ops-result` | Dịch một số âm | ops.example(5) |  |
| ✓ | 56.4 s | 7.0 s | 56.4 s | — | Câu hỏi: Kiểm x có lẻ không bằng một phép toán bit? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 35.1 s step-ok · 59.9 s right · 64.3 s done

## data-text

**Chữ thành byte ra sao** / How text becomes bytes — cpu-lab · `data` · preset mặc định của: text

Mã điểm, khuôn UTF-8, vì sao "ệ" tốn 3 byte còn emoji tốn 4.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 10.4 s (en 11.0 s) | 0.9 s | `char-table` | Mỗi ký tự là một con số | data.tab("text"), text.text("A") |  |
| 2 | 11.3 s | 11.0 s (en 11.0 s) | 11.3 s | `char-table` | Một chữ tiếng Việt | text.text("ệ") |  |
| 3 | 22.3 s | 3.8 s (en 4.3 s) | 22.3 s | `text-input` | Đến lượt bạn: một emoji | — | Gõ một emoji. → text.text("😀") +300ms |
| 4 | 26.1 s | 8.6 s (en 9.9 s) | 26.1 s | `char-table` | Bốn byte | — |  |
| 5 | 34.7 s | 11.0 s (en 11.0 s) | 34.7 s | `text-counts` | Ký tự ≠ byte | text.text("Việt Nam") |  |
| ✓ | 45.7 s | 7.0 s | 45.7 s | — | Câu hỏi: Vì sao "ệ" tốn 3 byte trong UTF-8? | đáp án đúng: B | — |

Tiếng (đo thật): 1.8 s start · 25.5 s step-ok · 49.2 s right · 53.6 s done

## data-float

**Vì sao 0.1 + 0.2 ≠ 0.3** / Why 0.1 + 0.2 ≠ 0.3 — cpu-lab · `data` · preset mặc định của: float

Bit dấu, số mũ và định trị của IEEE-754, giá trị thực sự được lưu, và điều đó nghĩa gì với tiền.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `float-bits` | Ba phần | data.tab("float"), float.fmt("f32"), float.pick("0.5") |  |
| 2 | 11.9 s | 9.9 s (en 10.7 s) | 11.9 s | `float-exact` | 0.1 không lưu được | float.pick("0.1") |  |
| 3 | 21.8 s | 10.4 s (en 11.0 s) | 21.9 s | `float-why` | Vì sao: nó lặp mãi | — |  |
| 4 | 32.3 s | 11.0 s (en 11.0 s) | 32.3 s | `float-sum` | 0.1 + 0.2 | — |  |
| 5 | 43.3 s | 4.5 s (en 5.0 s) | 43.3 s | `float-bits` | Đến lượt bạn: lật bit dấu | — | Lật bit dấu. → float.flip(0) +300ms |
| ✓ | 47.8 s | 7.0 s | 47.8 s | — | Câu hỏi: Cửa hàng nên lưu giá tiền (VNĐ, USD) bằng kiểu nào? | đáp án đúng: B | — |

Tiếng (đo thật): 1.8 s start · 46.9 s step-ok · 51.3 s right · 55.7 s done

## logic-gates

**Cổng logic và dây phát sáng** / Logic gates and glowing wires — cpu-lab · `logic` · preset mặc định của: gates

AND, XOR và NAND với dây điện sống và bảng chân trị.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 10.6 s (en 11.0 s) | 0.9 s | `gate-circuit` | Một cổng: dây vào, một dây ra | logic.tab("gates"), gates.gate("AND"), gates.a(0), gates.b(0) |  |
| 2 | 11.5 s | 6.1 s (en 6.3 s) | 11.5 s | `gate-inputs` | Đến lượt bạn: thắp bóng đèn | — | Làm cho đầu ra bằng 1. → gates.a(1) +300ms, gates.b(1) +600ms |
| 3 | 17.6 s | 9.9 s (en 10.6 s) | 17.6 s | `truth` | Bảng chân trị | — |  |
| 4 | 27.5 s | 10.9 s (en 11.0 s) | 27.5 s | `gate-circuit` | XOR: 1 + 1 = 0, nhớ 1 | gates.gate("XOR"), gates.a(1), gates.b(1) |  |
| 5 | 38.4 s | 11.0 s (en 11.0 s) | 38.5 s | `gate-pick` | NAND dựng được mọi thứ | gates.gate("NAND") |  |
| ✓ | 49.5 s | 7.0 s | 49.5 s | — | Câu hỏi: Cổng nào ra 1 khi hai đầu vào KHÁC nhau? | đáp án đúng: C | — |

Tiếng (đo thật): 1.8 s start · 16.4 s step-ok · 53.0 s right · 57.4 s done

## logic-adder

**Cộng hai bit bằng cổng logic** / Adding two bits with gates — cpu-lab · `logic` · preset mặc định của: adder

Half adder = XOR + AND; full adder cộng thêm bit nhớ từ cột bên phải.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 9.1 s (en 10.4 s) | 0.9 s | `adder-circuit` | Half adder | logic.tab("adder"), adder.full(false), adder.set([1,0,0]) |  |
| 2 | 10.0 s | 4.4 s (en 5.4 s) | 10.0 s | `adder-inputs` | Đến lượt bạn: 1 + 1 | — | Đặt A = 1 và B = 1. → adder.set([1,1,0]) +300ms |
| 3 | 14.4 s | 11.0 s (en 11.0 s) | 14.5 s | `adder-circuit` | Full adder | adder.full(true), adder.set([1,1,1]) |  |
| ✓ | 25.5 s | 7.0 s | 25.5 s | — | Câu hỏi: Ở hệ 2, 1 + 1 bằng… | đáp án đúng: B | — |

Tiếng (đo thật): 1.8 s start · 13.6 s step-ok · 29.0 s right · 33.4 s done

## logic-ripple

**Bộ cộng 8 bit** / The 8-bit adder — cpu-lab · `logic` · preset mặc định của: ripple

Tám full adder xếp hàng và bit nhớ lan từ phải sang trái — vì sao CPU thật cần bộ cộng nhanh hơn.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 6.7 s (en 6.9 s) | 0.9 s | `ripple-inputs` | Hai byte | logic.tab("ripple"), ripple.set([107,53]) |  |
| 2 | 7.6 s | 9.4 s (en 10.7 s) | 7.6 s | `ripple-chain` | Tám full adder | — |  |
| 3 | 17.1 s | 4.2 s (en 4.5 s) | 17.1 s | `play` | Đến lượt bạn: chạy thử | — | Bấm Chạy và chờ cả 8 tầng ổn định. → player.speed(2), player.play +200ms |
| 4 | 21.3 s | 11.0 s (en 11.0 s) | 24.8 s | `explain` | Cái giá của việc chờ | — |  |
| ✓ | 35.8 s | 7.0 s | 35.8 s | — | Câu hỏi: Vì sao bộ cộng nối tiếp nhớ chậm khi số nhiều bit? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 21.0 s tick · 21.4 s tick · 21.9 s tick · 22.3 s tick · 22.8 s tick · 23.2 s tick · 23.7 s tick · 24.1 s tick · 24.1 s step-ok · 39.3 s right · 43.7 s done

## cpu-first

**Làm quen chiếc máy tính** / Meet the computer — cpu-lab · `cpu` · preset mặc định của: add

Đi một vòng quanh con chip, thanh RAM và bus, rồi chạy 5 + 7 tới cuối.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `cpu-board` | Cả chiếc máy tính trên một màn hình | cpu.load("add"), cpu.mode("micro"), player.seek(0) |  |
| 2 | 11.9 s | 11.0 s (en 11.0 s) | 11.9 s | `ram` | Bộ nhớ: những ô có số nhà | — |  |
| 3 | 22.9 s | 11.0 s (en 11.0 s) | 22.9 s | `cpu-listing` | Chương trình, dưới dạng mã máy | — |  |
| 4 | 33.9 s | 11.0 s (en 11.0 s) | 33.9 s | `reg-PC` | PC: đang ở đâu? | — |  |
| 5 | 44.9 s | 11.0 s (en 11.0 s) | 44.9 s | `reg-AC` | AC và ALU | — |  |
| 6 | 55.9 s | 11.5 s (en 11.5 s) | 55.9 s | `step` | Đến lượt bạn: chạy một lệnh | — | Bấm Bước tới khi lệnh đầu chạy xong (AC = 5). → player.step ×≤6 +700ms |
| 7 | 67.4 s | 3.3 s (en 3.6 s) | 67.5 s | `cpu-end` | Chạy tới cuối | — | Chạy chương trình tới Halt. → player.end +300ms |
| 8 | 70.7 s | 11.0 s (en 11.0 s) | 70.8 s | `cpu-output` | 12! | — |  |
| ✓ | 81.8 s | 7.0 s | 81.8 s | — | Câu hỏi: Trong máy von Neumann, chương trình và dữ liệu nằm ở đâu? | đáp án đúng: B | — |

Tiếng (đo thật): 1.8 s start · 61.4 s blip-fetch · 62.2 s blip-fetch · 63.0 s blip-fetch · 63.8 s blip-decode · 64.7 s blip-exec · 65.5 s step-ok · 65.5 s blip-exec · 70.4 s step-ok · 70.4 s done · 85.3 s right · 89.7 s done

## fetch-decode

**Nạp → giải mã → thực thi** / Fetch → decode → execute — cpu-lab · `cpu` · preset mặc định của: sum

"Tổng 1..N" từng lệnh một: mọi thay đổi thanh ghi trong chu trình lệnh, rồi tới vòng lặp.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 10.3 s (en 11.0 s) | 0.9 s | `cpu-listing` | Chương trình | cpu.load("sum"), cpu.mode("micro"), player.seek(0) |  |
| 2 | 11.2 s | 8.5 s (en 10.1 s) | 11.2 s | `reg-PC` | Bật máy | — |  |
| 3 | 19.7 s | 11.0 s (en 11.0 s) | 19.7 s | `reg-MAR` | NẠP ① MAR ← PC | player.seek(1) |  |
| 4 | 30.7 s | 11.0 s (en 11.0 s) | 30.8 s | `reg-IR` | NẠP ② IR ← M[MAR] | player.seek(2) |  |
| 5 | 41.7 s | 9.8 s (en 11.0 s) | 41.8 s | `reg-PC` | NẠP ③ PC ← PC + 1 | player.seek(3) |  |
| 6 | 51.5 s | 8.9 s (en 10.1 s) | 51.5 s | `cu` | GIẢI MÃ | player.seek(4) |  |
| 7 | 60.4 s | 9.1 s (en 10.9 s) | 60.4 s | `reg-MBR` | THỰC THI ① MBR ← M[MAR] | player.seek(5) |  |
| 8 | 69.5 s | 9.9 s (en 11.0 s) | 69.5 s | `reg-AC` | THỰC THI ② AC ← MBR | player.seek(6) |  |
| 9 | 79.4 s | 9.9 s (en 10.7 s) | 79.4 s | `step` | Đến lượt bạn: lệnh tiếp theo | — | Bấm Bước tới khi Store Count xong (2 lệnh). → player.step ×≤6 +650ms |
| 10 | 89.3 s | 10.1 s (en 10.9 s) | 89.3 s | `cpu-mode` | Nhanh hơn: từng lệnh trọn | cpu.mode("instr") |  |
| 11 | 99.4 s | 6.4 s (en 6.3 s) | 99.5 s | `cpu-trace` | Đến lượt bạn: chạy vòng lặp | — | Chạy chương trình tới khi dừng. → player.speed(4), player.play +200ms |
| 12 | 105.8 s | 10.0 s (en 10.5 s) | 117.0 s | `cpu-output` | 15 = 5 · 6 / 2 | — |  |
| ✓ | 127.0 s | 7.0 s | 127.0 s | — | Câu hỏi: Ngay sau pha nạp lệnh, PC trỏ tới… | đáp án đúng: B | — |

Tiếng (đo thật): 1.8 s start · 20.7 s blip-fetch · 31.7 s blip-fetch · 42.7 s blip-fetch · 52.4 s blip-decode · 61.3 s blip-exec · 70.5 s blip-exec · 84.1 s blip-fetch · 84.8 s blip-fetch · 85.6 s blip-fetch · 86.4 s blip-decode · 87.1 s blip-exec · 87.9 s step-ok · 87.9 s blip-exec · 104.4 s blip-exec · 104.7 s blip-exec · 104.9 s blip-exec · 105.2 s blip-exec · 105.4 s blip-exec · 105.7 s blip-exec · 106.0 s blip-exec · 106.2 s blip-exec · 106.5 s blip-exec · 106.7 s blip-exec · 107.0 s blip-exec · 107.2 s blip-exec · 107.5 s blip-exec · 107.7 s blip-exec · 108.0 s blip-exec · 108.3 s blip-exec · 108.5 s blip-exec · 108.8 s blip-exec · 109.0 s blip-exec · 109.3 s blip-exec · 109.5 s blip-exec · 109.8 s blip-exec · 110.0 s blip-exec · 110.3 s blip-exec · 110.5 s blip-exec · 110.8 s blip-exec …

## cpu-bus

**Bus và con trỏ** / The bus and pointers — cpu-lab · `cpu` · preset mặc định của: max

Bus địa chỉ và bus dữ liệu từng lượt truyền, và phép nạp gián tiếp qua con trỏ.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `cpu-board` | Hai loại lưu lượng | cpu.load("max"), cpu.mode("micro"), player.seek(0) |  |
| 2 | 11.9 s | 6.5 s (en 6.8 s) | 11.9 s | `cpu-board` | Một địa chỉ đi ra | player.seek(1) |  |
| 3 | 18.4 s | 7.1 s (en 8.0 s) | 18.4 s | `cpu-board` | Dữ liệu quay về | player.seek(2) |  |
| 4 | 25.5 s | 10.4 s (en 10.8 s) | 25.5 s | `step` | Đến lượt bạn: đếm số chuyến | — | Bấm Bước tới khi lệnh đầu xong. → player.step ×≤6 +650ms |
| 5 | 35.8 s | 11.0 s (en 11.0 s) | 34.3 s | `cpu-memory` | Bảng bộ nhớ | — |  |
| 6 | 46.8 s | 10.2 s (en 11.0 s) | 45.3 s | `cpu-listing` | LoadI: đi theo con trỏ | — |  |
| 7 | 57.0 s | 3.9 s (en 3.6 s) | 55.5 s | `cpu-end` | Đến lượt bạn: chạy hết | — | Chạy tới Halt. → player.end +300ms |
| ✓ | 59.4 s | 7.0 s | 59.4 s | — | Câu hỏi: Thứ gì chạy trên bus địa chỉ? | đáp án đúng: B | — |

Tiếng (đo thật): 1.8 s start · 12.8 s blip-fetch · 19.3 s blip-fetch · 30.4 s blip-fetch · 31.2 s blip-decode · 31.9 s blip-exec · 32.7 s step-ok · 32.7 s blip-exec · 58.8 s step-ok · 58.8 s done · 62.9 s right · 67.3 s done

## pipeline-stages

**Từ mã C tới chương trình chạy** / From C to a running program — cpu-lab · `pipeline` · preset mặc định của: add, sum, max

Sáu chặng với output thật của gcc, và độ dài lệnh x86-64 so với ARM64.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `pipe-stages` | Sáu chặng | pipeline.arch("x86_64"), pipeline.opt("O0"), player.seek(0) |  |
| 2 | 11.9 s | 5.7 s (en 6.2 s) | 11.9 s | `pipe-source` | ① Mã C | — |  |
| 3 | 17.6 s | 8.1 s (en 9.5 s) | 17.6 s | `pipe-view` | ② Hợp ngữ | player.seek(1) |  |
| 4 | 25.6 s | 9.8 s (en 10.4 s) | 25.7 s | `pipe-view` | ③ Mã máy | player.seek(2) |  |
| 5 | 35.5 s | 9.3 s (en 9.5 s) | 35.5 s | `pipe-view` | ④ Tệp thực thi | player.seek(3) |  |
| 6 | 44.8 s | 8.5 s (en 8.5 s) | 44.8 s | `pipe-view` | ⑤ Nạp vào bộ nhớ | player.seek(4) |  |
| 7 | 53.3 s | 11.0 s (en 11.0 s) | 53.4 s | `pipe-view` | ⑥ CPU chạy | player.seek(5) |  |
| 8 | 64.3 s | 7.4 s (en 7.4 s) | 64.4 s | `pipe-config` | Đến lượt bạn: một CPU khác | — | Đổi sang ARM64. → pipeline.arch("aarch64") +300ms, player.seek(2) +300ms |
| ✓ | 71.8 s | 7.0 s | 71.8 s | — | Câu hỏi: Một lệnh ARM64 dài bao nhiêu? | đáp án đúng: B | — |

Tiếng (đo thật): 1.8 s start · 18.5 s tick · 26.6 s tick · 36.4 s tick · 45.7 s tick · 54.3 s tick · 69.4 s step-ok · 75.3 s right · 79.7 s done

## cache-basics

**Trúng, trượt và khối** / Hits, misses and blocks — cpu-lab · `cache` · preset mặc định của: sequential

Địa chỉ tách thành tag | index | offset ra sao, vì sao một lần trượt kéo về cả hàng xóm, và tỉ lệ trúng.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `cache-split` | Ba phần của một địa chỉ | cache.load("sequential"), player.seek(0) |  |
| 2 | 11.9 s | 10.3 s (en 11.0 s) | 11.9 s | `cache-table` | Lần đầu thì trượt | player.seek(1) |  |
| 3 | 22.2 s | 7.9 s (en 8.1 s) | 22.2 s | `step` | Đến lượt bạn: hàng xóm | — | Bấm Bước tới lần truy cập thứ 4. → player.step ×≤3 +700ms |
| 4 | 30.1 s | 11.0 s (en 10.7 s) | 30.1 s | `cache-kpis` | Tỉ lệ trúng và AMAT | — |  |
| 5 | 41.1 s | 5.0 s (en 5.6 s) | 41.1 s | `play` | Đến lượt bạn: cả mảng | — | Chạy hết 32 lần truy cập. → player.speed(4), player.play +200ms |
| 6 | 46.0 s | 11.0 s (en 11.0 s) | 55.1 s | `cache-history` | Hình mẫu | — |  |
| ✓ | 66.1 s | 7.0 s | 66.1 s | — | Câu hỏi: Sau một lần trượt, thứ gì được chép vào cache? | đáp án đúng: B | — |

Tiếng (đo thật): 1.8 s start · 12.8 s miss · 26.9 s hit · 27.8 s hit · 28.6 s step-ok · 28.6 s hit · 45.3 s miss · 45.6 s hit · 45.9 s hit · 46.3 s hit · 46.6 s miss · 46.9 s hit · 47.2 s hit · 47.6 s hit · 47.9 s miss · 48.2 s hit · 48.6 s hit · 48.9 s hit · 49.2 s miss · 49.5 s hit · 49.9 s hit · 50.2 s hit · 50.5 s miss · 50.9 s hit · 51.2 s hit · 51.5 s hit · 51.8 s miss · 52.2 s hit · 52.5 s hit · 52.8 s hit · 53.1 s miss · 53.5 s hit · 53.8 s hit · 54.1 s step-ok · 54.1 s hit · 69.6 s right · 74.0 s done

## cache-mapping

**Trượt xung đột và độ kết hợp** / Conflict misses and associativity — cpu-lab · `cache` · preset mặc định của: textbook, conflict

Hai mảng liên tục đẩy nhau ra trong cache ánh xạ trực tiếp — và cách 2-way sửa điều đó.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `cache-config` | c[i] = a[i] + b[i] | cache.load("conflict"), player.seek(0) |  |
| 2 | 11.9 s | 10.5 s (en 11.0 s) | 11.9 s | `cache-history` | Lần nào cũng trượt | player.end |  |
| 3 | 22.4 s | 5.8 s (en 5.6 s) | 22.4 s | `cache-config` | Đến lượt bạn: hai đường | — | Đặt Đường/tập = 2. → cache.ways(2) +300ms |
| 4 | 28.2 s | 10.6 s (en 10.3 s) | 28.2 s | `cache-kpis` | 12 trên 16 lần trúng | player.end +200ms |  |
| ✓ | 38.9 s | 7.0 s | 38.9 s | — | Câu hỏi: Trượt xung đột xảy ra khi… | đáp án đúng: B | — |

Tiếng (đo thật): 1.8 s start · 12.8 s miss · 26.8 s step-ok · 29.4 s hit · 42.4 s right · 46.8 s done

## process-shell

**Shell chạy một lệnh ra sao** / How a shell runs a command — os-lab · `process` · preset mặc định của: shell

fork → exec → wait → exit, trên cây tiến trình và máy trạng thái cùng lúc.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `proc-code` | Shell là một vòng lặp | process.mode("shell"), player.seek(0) |  |
| 2 | 11.9 s | 11.0 s (en 11.0 s) | 11.9 s | `proc-tree` | Cây gia phả | — |  |
| 3 | 22.9 s | 10.7 s (en 11.0 s) | 22.9 s | `proc-states` | Bạn bấm Enter | player.seek(1) |  |
| 4 | 33.6 s | 11.0 s (en 11.0 s) | 33.7 s | `proc-tree` | fork(): một thành hai | player.seek(2) |  |
| 5 | 44.6 s | 10.7 s (en 11.0 s) | 44.7 s | `proc-tree` | exec(): hoá thành chương trình khác | player.seek(4) |  |
| 6 | 55.4 s | 8.6 s (en 9.0 s) | 55.4 s | `step` | Đến lượt bạn: cho ls chạy xong | — | Bấm Bước tới khi có một zombie. → player.step ×≤3 +700ms |
| 7 | 64.0 s | 10.7 s (en 11.0 s) | 63.3 s | `proc-ps` | wait() dọn zombie | player.step +400ms |  |
| ✓ | 74.0 s | 7.0 s | 74.0 s | — | Câu hỏi: Sau khi exec() thành công, PID của tiến trình… | đáp án đúng: B | — |

Tiếng (đo thật): 1.8 s start · 23.8 s tick · 34.6 s tick · 60.6 s tick · 61.5 s tick · 61.5 s step-ok · 64.6 s tick · 77.5 s right · 81.9 s done

## sched-policies

**Ai được dùng CPU?** / Who gets the CPU? — os-lab · `scheduler` · preset mặc định của: textbook

Đọc sơ đồ Gantt, đo thời gian chờ, và so FCFS với SRTF trên ví dụ giáo trình.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `sched-procs` | Bốn tiến trình | sched.load("textbook"), player.seek(0) |  |
| 2 | 11.9 s | 10.4 s (en 10.6 s) | 11.9 s | `sched-policy` | Chính sách quyết định | — |  |
| 3 | 22.3 s | 4.2 s (en 4.3 s) | 22.3 s | `play` | Đến lượt bạn: chạy thử | — | Chạy tới khi mọi tiến trình xong. → player.speed(4), player.play +200ms |
| 4 | 26.5 s | 10.1 s (en 11.0 s) | 31.7 s | `sched-gantt` | Đọc sơ đồ Gantt | — |  |
| 5 | 36.5 s | 8.0 s (en 8.0 s) | 41.8 s | `sched-kpis` | Thời gian chờ trung bình | — |  |
| 6 | 44.5 s | 4.8 s (en 5.1 s) | 49.7 s | `sched-policy` | Đến lượt bạn: thử SRTF | — | Đổi sang SRTF và chạy tới cuối. → sched.policy("srtf") +300ms, player.end +500ms |
| 7 | 49.4 s | 11.0 s (en 11.0 s) | 54.6 s | `sched-kpis` | 6,5 thay vì 8,75 | — |  |
| ✓ | 65.6 s | 7.0 s | 65.6 s | — | Câu hỏi: "Hiệu ứng đoàn xe" (việc ngắn kẹt sau một việc dài) là đặc trưng của… | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 25.9 s tick · 26.1 s tick · 26.3 s tick · 26.5 s tick · 26.7 s tick · 26.9 s tick · 27.1 s tick · 27.3 s tick · 27.5 s tick · 27.8 s tick · 28.0 s tick · 28.2 s tick · 28.4 s tick · 28.6 s tick · 28.8 s tick · 29.0 s tick · 29.2 s tick · 29.4 s tick · 29.6 s tick · 29.8 s tick · 30.0 s tick · 30.2 s tick · 30.4 s tick · 30.6 s tick · 30.8 s tick · 31.0 s step-ok · 31.0 s tick · 53.8 s step-ok · 69.1 s right · 73.5 s done

## race-lost-update

**Lần tăng bị mất** / The lost update — os-lab · `race` · preset mặc định của: none, mutex, atomic

counter++ tách thành nạp/cộng/ghi, cách xen kẽ làm mất một lần tăng, và cách sửa bằng mutex.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `race-threads` | Hai luồng, một biến đếm | race.mode("none"), race.sched("alt"), race.n(3), player.seek(0) |  |
| 2 | 11.9 s | 6.6 s (en 6.8 s) | 11.9 s | `race-memory` | Bộ nhớ chung | — |  |
| 3 | 18.5 s | 12.8 s (en 12.8 s) | 18.5 s | `step` | Đến lượt bạn: bắt tận tay lỗi | — | Bấm Bước tới khi "lần tăng mất" thành 1. → player.step ×≤8 +650ms |
| 4 | 31.3 s | 11.0 s (en 11.0 s) | 29.7 s | `race-step` | Chuyện gì vừa xảy ra | — |  |
| 5 | 42.3 s | 10.9 s (en 11.0 s) | 40.8 s | `race-memory` | Kết quả cuối | player.end +200ms |  |
| 6 | 53.1 s | 4.7 s (en 5.3 s) | 51.6 s | `race-mode` | Đến lượt bạn: thêm khoá | — | Chuyển chế độ sang Mutex. → race.mode("mutex") +300ms |
| 7 | 57.8 s | 9.9 s (en 11.0 s) | 56.3 s | `race-memory` | Luôn bằng 6 | player.end +300ms |  |
| 8 | 67.7 s | 11.0 s (en 10.0 s) | 66.3 s | `race-hist` | 1.000 lần chạy ngẫu nhiên | race.mode("none"), race.hist +300ms |  |
| ✓ | 77.3 s | 7.0 s | 77.3 s | — | Câu hỏi: Vì sao counter++ không an toàn giữa hai luồng? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 23.9 s tick · 24.7 s tick · 25.5 s tick · 26.2 s tick · 27.0 s tick · 27.8 s step-ok · 27.8 s oops · 41.9 s oops · 55.3 s step-ok · 57.5 s done · 80.8 s right · 85.2 s done

## race-deadlock

**Hai khoá, một deadlock** / Two locks, one deadlock — os-lab · `race` · preset mặc định của: deadlock, ordered

Hai lệnh chuyển tiền khoá tài khoản theo thứ tự ngược nhau và chờ nhau mãi; sửa bằng thứ tự khoá chung.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 10.5 s (en 10.7 s) | 0.9 s | `race-threads` | Hai lệnh chuyển tiền | race.mode("deadlock"), race.sched("alt"), player.seek(0) |  |
| 2 | 11.4 s | 3.1 s (en 3.6 s) | 11.4 s | `play` | Đến lượt bạn: chạy cùng lúc | — | Chạy tới khi hai luồng kẹt. → player.play +200ms |
| 3 | 14.5 s | 11.0 s (en 11.0 s) | 21.0 s | `race-graph` | Một vòng chờ đợi | — |  |
| 4 | 25.5 s | 5.1 s (en 5.6 s) | 32.0 s | `race-mode` | Đến lượt bạn: sửa thứ tự | — | Chuyển sang "Cố định thứ tự khoá". → race.mode("ordered") +300ms |
| 5 | 30.6 s | 11.0 s (en 11.0 s) | 37.2 s | `race-graph` | Không thể có vòng | player.end +300ms |  |
| ✓ | 48.2 s | 7.0 s | 48.2 s | — | Câu hỏi: Thay đổi nào ngăn được deadlock này? | đáp án đúng: B | — |

Tiếng (đo thật): 1.8 s start · 15.3 s tick · 16.4 s tick · 17.5 s tick · 18.6 s tick · 19.7 s tick · 20.8 s step-ok · 20.8 s thud · 36.0 s step-ok · 38.4 s tick · 51.7 s right · 56.1 s done

## vm-translate

**Từ con trỏ tới một byte trong RAM** / From a pointer to a byte in RAM — os-lab · `vm` · preset mặc định của: program, walk

Địa chỉ ảo → TLB → bảng trang → khung vật lý, và lỗi trang thật ra là gì.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `vm-address` | Một địa chỉ ảo | vmtab.tab("tr"), vm.load("program"), player.seek(0) |  |
| 2 | 11.9 s | 10.7 s (en 11.0 s) | 11.9 s | `vm-pagetable` | Bảng trang | player.seek(1) |  |
| 3 | 22.6 s | 9.9 s (en 10.7 s) | 22.6 s | `vm-tlb` | TLB: lối tắt | — |  |
| 4 | 32.5 s | 14.8 s (en 14.8 s) | 32.5 s | `step` | Đến lượt bạn: tìm một lỗi trang | — | Bấm Bước tới lỗi trang tiếp theo. → player.step ×≤10 +700ms |
| 5 | 47.3 s | 11.0 s (en 11.0 s) | 40.0 s | `vm-frames` | Nhân hệ điều hành xử lý | — |  |
| 6 | 58.3 s | 5.0 s (en 4.7 s) | 51.0 s | `play` | Đến lượt bạn: chạy hết chương trình | — | Chạy tới cuối. → player.speed(4), player.play +200ms |
| ✓ | 59.3 s | 7.0 s | 59.3 s | — | Câu hỏi: TLB lưu thứ gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 12.8 s miss · 38.0 s step-ok · 38.0 s miss · 55.3 s miss · 55.7 s hit · 56.2 s miss · 56.6 s hit · 57.0 s hit · 57.4 s hit · 57.9 s miss · 58.3 s step-ok · 58.3 s thud · 62.8 s right · 67.2 s done

## vm-thrash

**Thiếu RAM: thrashing** / Not enough RAM: thrashing — os-lab · `vm` · preset mặc định của: loop

Vòng lặp qua 5 trang với 4 khung thì lần nào cũng lỗi trang; thêm một khung là hết.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 9.7 s (en 9.6 s) | 0.9 s | `thrash-table` | Vòng lặp qua 5 trang | vmtab.tab("rep"), thrash.load("loop"), thrash.algo("lru"), player.end +200ms |  |
| 2 | 10.6 s | 11.0 s (en 11.0 s) | 10.6 s | `thrash-kpis` | Lần nào cũng lỗi | — |  |
| 3 | 21.6 s | 4.7 s (en 5.1 s) | 21.6 s | `thrash-frames` | Đến lượt bạn: thêm một khung | — | Cho nó 5 khung. → thrash.frames(5) +300ms, player.end +300ms |
| 4 | 26.3 s | 11.0 s (en 11.0 s) | 26.3 s | `thrash-curve` | Một vách đá, không phải con dốc | — |  |
| ✓ | 37.3 s | 7.0 s | 37.3 s | — | Câu hỏi: Máy chủ đang thrashing. Điều gì giúp được? | đáp án đúng: B | — |

Tiếng (đo thật): 1.8 s start · 25.1 s step-ok · 40.8 s right · 45.2 s done

## sysmon-read

**Đọc máy chủ như người trực hệ thống** / Read a server like an SRE — os-lab · `sysmon` · preset mặc định của: calm, cpuhog

Thanh đo htop, load average, một sự cố ăn CPU được bơm vào, lệnh để xác nhận, và chẩn đoán.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `sys-meters` | Các thanh đo | sysmon.fresh, player.seek(0) |  |
| 2 | 11.9 s | 10.6 s (en 11.0 s) | 11.9 s | `sys-kpis` | Bốn con số cần nhìn | — |  |
| 3 | 22.5 s | 5.0 s (en 5.7 s) | 22.5 s | `play` | Đến lượt bạn: cho máy chạy | — | Cho chạy 10 giây. → player.speed(4), player.play +200ms |
| 4 | 27.6 s | 9.3 s (en 10.1 s) | 30.0 s | `sys-inject` | Có chuyện xảy ra | player.pause, sysmon.inject("cpuhog") +300ms, player.play +300ms |  |
| 5 | 36.9 s | 5.4 s (en 6.3 s) | 39.3 s | `sys-kpis` | Đến lượt bạn: xem load leo thang | — | Chờ tới khi load > 4. → player.play +200ms |
| 6 | 42.3 s | 9.9 s (en 11.0 s) | 44.9 s | `sys-top` | top tìm ra thủ phạm | player.pause, sysmon.sort("cpu"), sysmon.selTop +300ms |  |
| 7 | 52.2 s | 3.7 s (en 3.6 s) | 54.8 s | `sys-diagnose` | Đến lượt bạn: chẩn đoán | — | Chọn đúng chẩn đoán. → sysmon.answer("cpuhog") +400ms |
| ✓ | 58.5 s | 7.0 s | 58.5 s | — | Câu hỏi: Trên máy 4 lõi, load average 8 nghĩa là… | đáp án đúng: B | — |

Tiếng (đo thật): 1.8 s start · 26.7 s tick · 26.9 s tick · 27.2 s tick · 27.5 s tick · 27.7 s tick · 28.0 s tick · 28.2 s tick · 28.5 s tick · 28.7 s tick · 29.0 s tick · 29.0 s step-ok · 29.2 s tick · 29.5 s tick · 29.7 s tick · 30.0 s tick · 30.3 s tick · 30.5 s tick · 30.8 s tick · 31.3 s tick · 32.0 s tick · 32.3 s tick · 32.5 s tick · 32.8 s tick · 33.0 s tick · 33.3 s tick · 33.5 s tick · 33.8 s tick · 34.0 s tick · 34.3 s tick · 34.5 s tick · 34.8 s tick · 35.0 s tick · 35.3 s tick · 35.5 s tick · 35.8 s tick · 36.1 s tick · 36.3 s tick · 36.6 s tick · 36.8 s tick …

## eventloop-order

**Ai in trước?** / Who prints first? — os-lab · `eventloop` · preset mặc định của: order

Mã đồng bộ, nextTick, microtask Promise, timer, I/O và setImmediate — theo đúng thứ tự của Node.js.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `el-code` | Đoán trước đã | el.mode("order"), player.seek(0) |  |
| 2 | 11.9 s | 9.6 s (en 10.5 s) | 11.9 s | `el-stack` | Một luồng | — |  |
| 3 | 21.5 s | 15.2 s (en 16.0 s) | 21.5 s | `step` | Đến lượt bạn: phần đồng bộ | — | Bấm Bước tới khi "2 sync" xuất hiện. → player.step ×≤14 +550ms |
| 4 | 36.7 s | 10.1 s (en 10.6 s) | 31.3 s | `el-micro` | Microtask chen hàng | — |  |
| 5 | 46.8 s | 5.8 s (en 5.9 s) | 41.5 s | `play` | Đến lượt bạn: chạy vòng lặp | — | Chạy tới cuối. → player.speed(2), player.play +200ms |
| 6 | 52.6 s | 10.1 s (en 11.0 s) | 61.9 s | `el-console` | Từ 1 tới 8 | — |  |
| ✓ | 72.0 s | 7.0 s | 72.0 s | — | Câu hỏi: Cái nào chạy trước: setTimeout(fn, 0) hay Promise.resolve().then(fn)? | đáp án đúng: B | — |

Tiếng (đo thật): 1.8 s start · 26.3 s tick · 27.0 s tick · 27.7 s tick · 28.3 s tick · 29.0 s tick · 29.7 s tick · 29.7 s step-ok · 46.3 s tick · 46.8 s tick · 47.2 s tick · 47.7 s tick · 48.2 s tick · 48.7 s tick · 49.2 s tick · 49.6 s tick · 50.1 s tick · 50.6 s tick · 51.1 s tick · 51.5 s tick · 52.0 s tick · 52.5 s tick · 53.0 s tick · 53.5 s tick · 53.9 s tick · 54.4 s tick · 54.9 s tick · 55.4 s tick · 55.8 s tick · 56.3 s tick · 56.8 s tick · 57.3 s tick · 57.8 s tick · 58.2 s tick · 58.7 s tick · 59.2 s tick · 59.7 s tick · 60.1 s tick · 60.6 s tick · 60.6 s step-ok …

## eventloop-block

**Đừng bao giờ chặn event loop** / Never block the event loop — os-lab · `eventloop` · preset mặc định của: block, offload

Một handler đồng bộ chậm làm trễ mọi request khác; đẩy nó ra ngoài là sửa được độ trễ.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 9.4 s (en 9.5 s) | 0.9 s | `el-code` | Một máy chủ web tí hon | el.mode("block"), el.offload(false), player.seek(0) |  |
| 2 | 10.3 s | 2.5 s (en 2.5 s) | 10.4 s | `play` | Đến lượt bạn: phục vụ chúng | — | Chạy tới cuối. → player.speed(2), player.play +200ms |
| 3 | 12.9 s | 10.6 s (en 11.0 s) | 24.7 s | `el-requests` | Ai cũng phải chờ | — |  |
| 4 | 23.5 s | 6.3 s (en 6.1 s) | 35.4 s | `el-options` | Đến lượt bạn: đẩy nó ra ngoài | — | Chọn đẩy ra ngoài. → el.offload(true) +300ms |
| 5 | 29.9 s | 10.3 s (en 10.5 s) | 41.7 s | `el-requests` | Lại nhanh rồi | player.end +300ms |  |
| ✓ | 52.0 s | 7.0 s | 52.0 s | — | Câu hỏi: Một handler Node.js chạy vòng lặp đồng bộ 200 ms. Các request khác ra sao? | đáp án đúng: B | — |

Tiếng (đo thật): 1.8 s start · 13.3 s tick · 13.8 s tick · 14.2 s tick · 14.7 s tick · 15.2 s tick · 15.7 s tick · 16.2 s tick · 16.6 s tick · 17.1 s tick · 17.6 s tick · 18.1 s tick · 18.5 s tick · 19.0 s tick · 19.5 s tick · 20.0 s tick · 20.5 s tick · 20.9 s tick · 21.4 s tick · 21.9 s tick · 22.4 s tick · 22.8 s tick · 23.3 s tick · 23.8 s tick · 24.3 s tick · 24.8 s tick · 24.8 s step-ok · 40.0 s step-ok · 55.5 s right · 59.9 s done

## deadlock-detect

**Phát hiện deadlock** / Detecting a deadlock — os-lab · `deadlock` · preset mặc định của: detect, cycle, pool

Đồ thị cấp phát tài nguyên và phép quét phát hiện: ai chạy xong được, ai bị kẹt.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `det-graph` | Đồ thị cấp phát tài nguyên | deadlock.tab("detect"), detect.example("textbook"), player.seek(0) |  |
| 2 | 11.9 s | 6.9 s (en 6.9 s) | 11.9 s | `play` | Đến lượt bạn: chạy phép quét | — | Chạy phép quét tới cuối. → player.play +200ms |
| 3 | 18.8 s | 11.0 s (en 11.0 s) | 29.6 s | `det-table` | Ai cũng chờ, mà không ai kẹt | — |  |
| 4 | 29.8 s | 11.0 s (en 11.0 s) | 40.6 s | `det-table` | Thêm một yêu cầu | detect.example("p2more"), player.end +300ms |  |
| 5 | 40.8 s | 11.0 s (en 11.0 s) | 51.6 s | `det-graph` | Cùng lỗi đó trong ứng dụng web | detect.example("pool"), player.end +300ms |  |
| ✓ | 62.6 s | 7.0 s | 62.6 s | — | Câu hỏi: Nhiều tiến trình đang chờ tài nguyên. Chúng có bị deadlock không? | đáp án đúng: B | — |

Tiếng (đo thật): 1.8 s start · 17.8 s tick · 18.7 s tick · 19.6 s tick · 20.5 s tick · 21.4 s tick · 22.3 s tick · 23.2 s tick · 24.1 s tick · 25.0 s tick · 25.9 s tick · 26.8 s tick · 27.7 s tick · 27.7 s step-ok · 27.7 s done · 41.9 s thud · 52.9 s thud · 66.1 s right · 70.5 s done

## deadlock-banker

**Thuật toán Banker** / The Banker's algorithm — os-lab · `deadlock` · preset mặc định của: banker, request

Trạng thái an toàn, kiểm an toàn bằng tay, và vì sao một yêu cầu có thể bị từ chối dù tài nguyên đang rảnh.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 10.4 s (en 11.0 s) | 0.9 s | `bank-table` | Sổ sách của ngân hàng | deadlock.tab("banker"), banker.reset, player.seek(0) |  |
| 2 | 11.3 s | 6.9 s (en 6.9 s) | 11.3 s | `play` | Đến lượt bạn: có an toàn không? | — | Chạy phép kiểm an toàn tới cuối. → player.play +200ms |
| 3 | 18.3 s | 9.7 s (en 9.2 s) | 29.9 s | `bank-sequence` | Một dãy an toàn | — |  |
| 4 | 28.0 s | 5.1 s (en 6.1 s) | 39.6 s | `bank-request` | Đến lượt bạn: P1 xin (1,0,2) | — | Xin (1,0,2) cho P1. → banker.request([1,[1,0,2]]) +400ms |
| 5 | 33.1 s | 10.6 s (en 11.0 s) | 44.7 s | `bank-request` | Bị từ chối dù còn tài nguyên | banker.request([0,[0,2,0]]) +300ms |  |
| ✓ | 55.4 s | 7.0 s | 55.4 s | — | Câu hỏi: Vì sao Banker từ chối một yêu cầu khi tài nguyên đang rảnh? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 17.2 s tick · 18.1 s tick · 19.0 s tick · 19.9 s tick · 20.8 s tick · 21.7 s tick · 22.6 s tick · 23.5 s tick · 24.4 s tick · 25.3 s tick · 26.2 s tick · 27.1 s tick · 28.0 s tick · 28.0 s step-ok · 43.6 s right · 43.6 s step-ok · 46.0 s wrong · 58.9 s right · 63.3 s done

## process-start

**Cách dùng phòng lab này** / How to use this lab — os-lab · `process` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 8.3 s (en 7.8 s) | 0.9 s | `head` | Tiến trình: cây & trạng thái | — |  |
| 2 | 9.2 s | 11.0 s (en 11.0 s) | 9.2 s | `controls` | Thanh điều khiển | — |  |
| 3 | 20.2 s | 5.6 s (en 5.4 s) | 20.2 s | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 25.8 s | 10.9 s (en 11.0 s) | 25.8 s | `explain` | Đọc ô giải thích | — |  |
| 5 | 36.6 s | 11.0 s (en 11.0 s) | 36.7 s | — | Giờ tự khám phá | — |  |
| ✓ | 47.7 s | 7.0 s | 47.7 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 24.1 s tick · 24.8 s step-ok · 24.8 s tick · 51.2 s right · 55.6 s done

## scheduler-start

**Cách dùng phòng lab này** / How to use this lab — os-lab · `scheduler` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 8.3 s (en 8.2 s) | 0.9 s | `head` | Lập lịch CPU | — |  |
| 2 | 9.2 s | 11.0 s (en 11.0 s) | 9.2 s | `controls` | Thanh điều khiển | — |  |
| 3 | 20.2 s | 5.6 s (en 5.4 s) | 20.2 s | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 25.8 s | 10.9 s (en 11.0 s) | 25.8 s | `explain` | Đọc ô giải thích | — |  |
| 5 | 36.6 s | 11.0 s (en 11.0 s) | 36.7 s | — | Giờ tự khám phá | — |  |
| ✓ | 47.7 s | 7.0 s | 47.7 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 24.1 s tick · 24.9 s step-ok · 24.9 s tick · 51.2 s right · 55.6 s done

## race-start

**Cách dùng phòng lab này** / How to use this lab — os-lab · `race` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 8.3 s (en 9.6 s) | 0.9 s | `head` | Race condition & deadlock | — |  |
| 2 | 9.2 s | 11.0 s (en 11.0 s) | 9.2 s | `controls` | Thanh điều khiển | — |  |
| 3 | 20.2 s | 5.6 s (en 5.4 s) | 20.2 s | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 25.8 s | 10.9 s (en 11.0 s) | 25.8 s | `explain` | Đọc ô giải thích | — |  |
| 5 | 36.6 s | 11.0 s (en 11.0 s) | 36.7 s | — | Giờ tự khám phá | — |  |
| ✓ | 47.7 s | 7.0 s | 47.7 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 24.1 s tick · 24.8 s step-ok · 24.8 s tick · 51.2 s right · 55.6 s done

## memory-start

**Cách dùng phòng lab này** / How to use this lab — os-lab · `memory` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 8.5 s (en 8.8 s) | 0.9 s | `head` | Bố cục bộ nhớ tiến trình | — |  |
| 2 | 9.4 s | 11.0 s (en 11.0 s) | 9.4 s | `controls` | Thanh điều khiển | — |  |
| 3 | 20.4 s | 5.6 s (en 5.4 s) | 20.4 s | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 25.9 s | 10.9 s (en 11.0 s) | 26.0 s | `explain` | Đọc ô giải thích | — |  |
| 5 | 36.8 s | 11.0 s (en 11.0 s) | 36.9 s | — | Giờ tự khám phá | — |  |
| ✓ | 47.9 s | 7.0 s | 47.9 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 24.3 s tick · 25.0 s step-ok · 25.0 s tick · 51.4 s right · 55.8 s done

## vm-start

**Cách dùng phòng lab này** / How to use this lab — os-lab · `vm` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 8.2 s (en 8.7 s) | 0.9 s | `head` | Bộ nhớ ảo & thrashing | — |  |
| 2 | 9.1 s | 11.0 s (en 11.0 s) | 9.1 s | `controls` | Thanh điều khiển | — |  |
| 3 | 20.1 s | 5.6 s (en 5.4 s) | 20.1 s | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 25.7 s | 10.9 s (en 11.0 s) | 25.7 s | `explain` | Đọc ô giải thích | — |  |
| 5 | 36.6 s | 11.0 s (en 11.0 s) | 36.6 s | — | Giờ tự khám phá | — |  |
| ✓ | 47.6 s | 7.0 s | 47.6 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 24.1 s miss · 24.8 s step-ok · 24.8 s miss · 51.1 s right · 55.5 s done

## sysmon-start

**Cách dùng phòng lab này** / How to use this lab — os-lab · `sysmon` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `head` | Phòng máy: đọc top/htop | — |  |
| 2 | 11.9 s | 11.0 s (en 11.0 s) | 11.9 s | `controls` | Thanh điều khiển | — |  |
| 3 | 22.9 s | 5.6 s (en 5.4 s) | 22.9 s | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 28.5 s | 11.0 s (en 11.0 s) | 28.5 s | — | Giờ tự khám phá | — |  |
| ✓ | 39.5 s | 7.0 s | 39.5 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 26.9 s tick · 27.6 s step-ok · 27.6 s tick · 43.0 s right · 47.4 s done

## eventloop-start

**Cách dùng phòng lab này** / How to use this lab — os-lab · `eventloop` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `head` | Event loop của Node.js | — |  |
| 2 | 11.9 s | 11.0 s (en 11.0 s) | 11.9 s | `controls` | Thanh điều khiển | — |  |
| 3 | 22.9 s | 5.6 s (en 5.4 s) | — | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 28.5 s | 10.9 s (en 11.0 s) | 22.9 s | `explain` | Đọc ô giải thích | — |  |
| 5 | 39.4 s | 11.0 s (en 11.0 s) | 33.8 s | — | Giờ tự khám phá | — |  |
| ✓ | 44.8 s | 7.0 s | 44.8 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 48.3 s right · 52.7 s done

## threadpool-start

**Cách dùng phòng lab này** / How to use this lab — os-lab · `threadpool` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `head` | Thread pool & định luật Little | — |  |
| 2 | 11.9 s | 11.0 s (en 11.0 s) | 11.9 s | `controls` | Thanh điều khiển | — |  |
| 3 | 22.9 s | 5.6 s (en 5.4 s) | 22.9 s | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 28.5 s | 10.9 s (en 11.0 s) | 28.5 s | `explain` | Đọc ô giải thích | — |  |
| 5 | 39.4 s | 11.0 s (en 11.0 s) | 39.4 s | — | Giờ tự khám phá | — |  |
| ✓ | 50.4 s | 7.0 s | 50.4 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 26.8 s tick · 27.6 s step-ok · 27.6 s tick · 53.9 s right · 58.3 s done

## sync-start

**Cách dùng phòng lab này** / How to use this lab — os-lab · `sync` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `head` | Semaphore & biến điều kiện | — |  |
| 2 | 11.9 s | 11.0 s (en 11.0 s) | 11.9 s | `controls` | Thanh điều khiển | — |  |
| 3 | 22.9 s | 5.6 s (en 5.4 s) | 22.9 s | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 28.5 s | 10.9 s (en 11.0 s) | 28.5 s | `explain` | Đọc ô giải thích | — |  |
| 5 | 39.4 s | 11.0 s (en 11.0 s) | 39.4 s | — | Giờ tự khám phá | — |  |
| ✓ | 50.4 s | 7.0 s | 50.4 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 26.8 s tick · 27.6 s step-ok · 27.6 s tick · 53.9 s right · 58.3 s done

## deadlock-start

**Cách dùng phòng lab này** / How to use this lab — os-lab · `deadlock` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 10.8 s (en 10.8 s) | 0.9 s | `head` | Phòng lab deadlock | — |  |
| 2 | 11.7 s | 11.0 s (en 11.0 s) | 11.7 s | `controls` | Thanh điều khiển | — |  |
| 3 | 22.7 s | 5.6 s (en 5.4 s) | 22.7 s | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 28.3 s | 10.9 s (en 11.0 s) | 28.3 s | `explain` | Đọc ô giải thích | — |  |
| 5 | 39.2 s | 11.0 s (en 11.0 s) | 39.2 s | — | Giờ tự khám phá | — |  |
| ✓ | 50.2 s | 7.0 s | 50.2 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 26.7 s tick · 27.4 s step-ok · 27.4 s tick · 53.7 s right · 58.1 s done

## cgroup-start

**Cách dùng phòng lab này** / How to use this lab — os-lab · `cgroup` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `head` | cgroup: giới hạn bộ nhớ & CPU | — |  |
| 2 | 11.9 s | 11.0 s (en 11.0 s) | 11.9 s | `controls` | Thanh điều khiển | — |  |
| 3 | 22.9 s | 5.6 s (en 5.4 s) | 22.9 s | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 28.5 s | 10.9 s (en 11.0 s) | 28.5 s | `explain` | Đọc ô giải thích | — |  |
| 5 | 39.4 s | 11.0 s (en 11.0 s) | 39.4 s | — | Giờ tự khám phá | — |  |
| ✓ | 50.4 s | 7.0 s | 50.4 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 26.9 s tick · 27.6 s step-ok · 27.6 s tick · 53.9 s right · 58.3 s done

## cow-start

**Cách dùng phòng lab này** / How to use this lab — os-lab · `cow` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `head` | Copy-on-write sau fork() | — |  |
| 2 | 11.9 s | 11.0 s (en 11.0 s) | — | `controls` | Thanh điều khiển | — |  |
| 3 | 22.9 s | 5.6 s (en 5.4 s) | — | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 28.5 s | 10.9 s (en 11.0 s) | 11.9 s | `explain` | Đọc ô giải thích | — |  |
| 5 | 39.4 s | 11.0 s (en 11.0 s) | 22.8 s | — | Giờ tự khám phá | — |  |
| ✓ | 33.8 s | 7.0 s | 33.8 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 37.3 s right · 41.7 s done

## pagecache-start

**Cách dùng phòng lab này** / How to use this lab — os-lab · `pagecache` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `head` | Page cache & read-ahead | — |  |
| 2 | 11.9 s | 11.0 s (en 11.0 s) | 11.9 s | `controls` | Thanh điều khiển | — |  |
| 3 | 22.9 s | 5.6 s (en 5.4 s) | 22.9 s | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 28.5 s | 10.9 s (en 11.0 s) | 28.5 s | `explain` | Đọc ô giải thích | — |  |
| 5 | 39.4 s | 11.0 s (en 11.0 s) | 39.4 s | — | Giờ tự khám phá | — |  |
| ✓ | 50.4 s | 7.0 s | 50.4 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 26.9 s tick · 27.6 s step-ok · 27.6 s tick · 53.9 s right · 58.3 s done

## latency-start

**Cách dùng phòng lab này** / How to use this lab — os-lab · `latency` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 6.6 s (en 6.5 s) | 0.9 s | `head` | Thang độ trễ | — |  |
| 2 | 7.5 s | 11.0 s (en 11.0 s) | 7.5 s | `controls` | Thanh điều khiển | — |  |
| 3 | 18.5 s | 5.6 s (en 5.4 s) | 18.5 s | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 24.1 s | 10.9 s (en 11.0 s) | 24.1 s | `explain` | Đọc ô giải thích | — |  |
| 5 | 34.9 s | 11.0 s (en 11.0 s) | 35.0 s | — | Giờ tự khám phá | — |  |
| ✓ | 46.0 s | 7.0 s | 46.0 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 22.4 s tick · 23.2 s step-ok · 23.2 s tick · 49.5 s right · 53.9 s done

## bits-start

**Cách dùng phòng lab này** / How to use this lab — cpu-lab · `bits` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `head` | Bit & hệ đếm | — |  |
| 2 | 11.9 s | 11.0 s (en 11.0 s) | — | `controls` | Thanh điều khiển | — |  |
| 3 | 22.9 s | 5.6 s (en 5.4 s) | — | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 28.5 s | 10.9 s (en 11.0 s) | 11.9 s | `explain` | Đọc ô giải thích | — |  |
| 5 | 39.4 s | 11.0 s (en 11.0 s) | 22.8 s | — | Giờ tự khám phá | — |  |
| ✓ | 33.8 s | 7.0 s | 33.8 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 37.3 s right · 41.7 s done

## data-start

**Cách dùng phòng lab này** / How to use this lab — cpu-lab · `data` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `head` | Biểu diễn dữ liệu | — |  |
| 2 | 11.9 s | 11.0 s (en 11.0 s) | — | `controls` | Thanh điều khiển | — |  |
| 3 | 22.9 s | 5.6 s (en 5.4 s) | — | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 28.5 s | 10.9 s (en 11.0 s) | 11.9 s | `explain` | Đọc ô giải thích | — |  |
| 5 | 39.4 s | 11.0 s (en 11.0 s) | 22.8 s | — | Giờ tự khám phá | — |  |
| ✓ | 33.8 s | 7.0 s | 33.8 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 37.3 s right · 41.7 s done

## logic-start

**Cách dùng phòng lab này** / How to use this lab — cpu-lab · `logic` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `head` | Cổng logic → mạch | — |  |
| 2 | 11.9 s | 11.0 s (en 11.0 s) | — | `controls` | Thanh điều khiển | — |  |
| 3 | 22.9 s | 5.6 s (en 5.4 s) | — | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 28.5 s | 10.9 s (en 11.0 s) | 11.9 s | `explain` | Đọc ô giải thích | — |  |
| 5 | 39.4 s | 11.0 s (en 11.0 s) | 22.8 s | — | Giờ tự khám phá | — |  |
| ✓ | 33.8 s | 7.0 s | 33.8 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 37.3 s right · 41.7 s done

## cpu-start

**Cách dùng phòng lab này** / How to use this lab — cpu-lab · `cpu` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `head` | CPU đồ chơi (MARIE) | — |  |
| 2 | 11.9 s | 11.0 s (en 11.0 s) | 11.9 s | `controls` | Thanh điều khiển | — |  |
| 3 | 22.9 s | 5.6 s (en 5.4 s) | 22.9 s | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 28.5 s | 10.9 s (en 11.0 s) | 28.5 s | `explain` | Đọc ô giải thích | — |  |
| 5 | 39.4 s | 11.0 s (en 11.0 s) | 39.4 s | — | Giờ tự khám phá | — |  |
| ✓ | 50.4 s | 7.0 s | 50.4 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 26.8 s blip-fetch · 27.6 s step-ok · 27.6 s blip-fetch · 53.9 s right · 58.3 s done

## pipeline-start

**Cách dùng phòng lab này** / How to use this lab — cpu-lab · `pipeline` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `head` | Từ mã C tới chương trình đang chạy | — |  |
| 2 | 11.9 s | 11.0 s (en 11.0 s) | 11.9 s | `controls` | Thanh điều khiển | — |  |
| 3 | 22.9 s | 5.6 s (en 5.4 s) | 22.9 s | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 28.5 s | 10.9 s (en 11.0 s) | 28.5 s | `explain` | Đọc ô giải thích | — |  |
| 5 | 39.4 s | 11.0 s (en 11.0 s) | 39.4 s | — | Giờ tự khám phá | — |  |
| ✓ | 50.4 s | 7.0 s | 50.4 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 26.9 s tick · 27.6 s step-ok · 27.6 s tick · 53.9 s right · 58.3 s done

## cache-start

**Cách dùng phòng lab này** / How to use this lab — cpu-lab · `cache` · tour làm quen (mọi preset chưa có tour riêng)

Một phút làm quen: mô phỏng này cho thấy gì và điều khiển nó ra sao.

| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |
|---|---|---|---|---|---|---|---|
| 1 | 0.9 s | 11.0 s (en 11.0 s) | 0.9 s | `head` | Cache & phân cấp bộ nhớ | — |  |
| 2 | 11.9 s | 11.0 s (en 11.0 s) | 11.9 s | `controls` | Thanh điều khiển | — |  |
| 3 | 22.9 s | 5.6 s (en 5.4 s) | 22.9 s | `step` | Đến lượt bạn: hai bước | — | Bấm Bước hai lần. → player.step ×≤2 +600ms |
| 4 | 28.5 s | 10.9 s (en 11.0 s) | 28.5 s | `explain` | Đọc ô giải thích | — |  |
| 5 | 39.4 s | 11.0 s (en 11.0 s) | 39.4 s | — | Giờ tự khám phá | — |  |
| ✓ | 50.4 s | 7.0 s | 50.4 s | — | Câu hỏi: Ô có viền màu bên trái cho bạn biết gì? | đáp án đúng: A | — |

Tiếng (đo thật): 1.8 s start · 26.9 s miss · 27.6 s step-ok · 27.6 s miss · 53.9 s right · 58.3 s done
