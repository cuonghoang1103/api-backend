# CT Work — trợ lý dự án bản stream (SSE)

20/10/2026. Bản STREAM của `POST /api/v1/work/projects/:pid/ai/chat`. Route cũ **giữ nguyên** (web + bản iOS đang chạy).
Mã: `src/routes/work.routes.ts` (route), `src/services/work/ai.service.ts` (`chat`/`askWithReads`/`motLuotTraLoi`),
`src/services/work/aiTraLoi.ts` (giao thức trả lời 22/10 — đọc câu trả lời, `TraLoiStreamer`, viết tiếp, tool đọc),
`src/services/work/aiCong.ts` (chuỗi cổng rambo → chính hãng → modelapi), `src/services/work/aiReplyStream.ts` (rút
`reply` khỏi JSON kiểu cũ). Test: `src/services/work/aiTraLoi.test.ts`, `aiReplyStream.test.ts`, `aiCong.test.ts`,
`WORK_DB_TEST=1 npx tsx --test src/routes/work.aiStream.db.test.ts`.

> **22/10/2026 — hợp đồng SSE KHÔNG đổi** (cùng sự kiện, cùng `done` = data của `/ai/chat`). App iOS/web không phải sửa.
> Đổi ở phía máy chủ: model viết Markdown thường (không còn JSON) ⇒ hết lỗi "AI trả về câu trả lời không đọc được";
> câu trả lời không còn trần ~300 từ; cổng hỏng thì tự chuyển cổng / tự viết tiếp. Chi tiết ở các mục cuối.

## Yêu cầu

`POST /api/v1/work/projects/:pid/ai/chat/stream` — cùng xác thực (Bearer/cookie), cùng thân như `/ai/chat`:

```json
{ "message": "Việc của tôi tuần này?", "issueNumber": 12, "threadId": 34, "retryMessageId": null }
```

- `retryMessageId` (thêm, tuỳ chọn): hỏi lại câu đã lưu mà chưa có trả lời — như `POST /ai/messages/:mid/retry`.
  `message` vẫn phải khác rỗng nhưng bị bỏ qua (gửi lại chính câu đó).
- Nên gửi `Accept: text/event-stream`.

**Lỗi TRƯỚC khi mở luồng** trả JSON thường y như `/ai/chat` (không phải SSE): 400 `VALIDATION_ERROR`, 403/404 quyền,
`CLIENT_PORTAL_ONLY`, 402 `WORK_AI_QUOTA_EXCEEDED`, 429 `WORK_AI_TOKEN_CAP`, 503 `WORK_AI_UNAVAILABLE`. Client kiểm
`Content-Type`: không phải `text/event-stream` ⇒ đọc JSON lỗi `{success:false, message, code}`.

## Luồng sự kiện

HTTP 200, `Content-Type: text/event-stream`. Mỗi sự kiện:

```
event: <type>
data: {"type":"<type>", ...}

```

`data` luôn là MỘT dòng JSON và luôn có `type` (client chỉ đọc `data:` cũng đủ). Dòng `: ping` mỗi 15 s là nhịp tim
(bỏ qua). Có một dòng `retry: 5000` lúc mở — **đừng tự kết nối lại** (POST; hỏi lại = gửi yêu cầu mới).

| type | data | ý nghĩa |
|---|---|---|
| `progress` | `{phase:"preparing", threadId, questionId}` | Câu hỏi đã lưu (hội thoại mới cũng đã có id). Luôn là sự kiện đầu. |
| `progress` | `{phase:"reading", round, items:["LFD-75","Docs #3 — How to run LFD"], prefetched?:true}` | Đang đọc dữ liệu dự án. `round:0, prefetched:true` = mã đọc sẵn trước lượt model đầu; `round≥1` = model xin đọc. `items` là nhãn hiển thị được. |
| `progress` | `{phase:"thinking", round}` | Đang gọi model (mỗi vòng một lần; tối đa ~4–5 lần). |
| `progress` | `{phase:"checking"}` | Đề xuất lệnh không hợp lệ, model đang sửa một lượt (chữ lượt này không stream). |
| `delta` | `{text}` | Mẩu Markdown của câu trả lời — **nối** vào bản nháp. |
| `reset` | `{}` | **Xoá** bản nháp (lượt đó hoá ra là lượt xin đọc, cổng thử lại đoạn đang viết, hoặc nháp lệch bản chuẩn). Các `delta` sau là câu mới — thường bắt đầu bằng MỘT `delta` chứa lại phần đã chắc chắn. Hiếm từ 22/10 (xem dưới). |
| `done` | `{reply, actions, quota, threadId, question, answer}` | Kết thúc OK. Đúng `data` mà `/ai/chat` trả. `reply` là bản **chuẩn** ⇒ thay nháp bằng nó (có thể khác nháp, vd. thêm dòng "N suggested change(s) were dropped"). `actions` CHỈ có ở đây. |
| `error` | `{code, message, status}` | Kết thúc lỗi. Mã như `/ai/chat`: `WORK_AI_BAD_OUTPUT` (502), `BUDGET_EXCEEDED` (429), `WORK_AI_TOKEN_CAP`, `WORK_AI_NOTHING_TO_RETRY`, `INTERNAL_ERROR` (lỗi lạ, câu chung)… Câu hỏi đã được đánh dấu lỗi ⇒ hiện nút Hỏi lại (`retryMessageId = questionId` từ `preparing`). |

Sau `done` hoặc `error` máy chủ đóng luồng. Ví dụ:

```
event: progress
data: {"type":"progress","phase":"preparing","threadId":34,"questionId":901}

event: progress
data: {"type":"progress","phase":"thinking","round":0}

event: progress
data: {"type":"progress","phase":"reading","round":1,"items":["LFD-75","Docs #3 — How to run LFD"]}

event: progress
data: {"type":"progress","phase":"thinking","round":1}

event: delta
data: {"type":"delta","text":"### Việc gấp\n1. [LFD-75](/work/"}

event: done
data: {"type":"done","reply":"…","actions":[…],"quota":{…},"threadId":34,"question":{…},"answer":{…}}
```

## Gợi ý hiển thị (iOS / web)

- `preparing` → bong bóng trợ lý trống + "Đang chuẩn bị…"; `reading` → "Đang đọc LFD-75, Docs #3 …"; `thinking` → "Đang suy nghĩ…".
- `delta` đầu tiên → bỏ dòng trạng thái, render Markdown dần (render lại cả nháp mỗi ~50–100 ms là đủ mượt).
- `done` → thay nháp bằng `reply`, hiện thẻ đề xuất từ `actions` (Apply/Dismiss như cũ, theo `answer.id`).

## Ngắt kết nối

Client đóng luồng (rời màn hình, mất mạng) ⇒ máy chủ không gọi thêm lượt model nào (kể cả lượt viết tiếp) và đánh dấu câu
hỏi lỗi (`WORK_AI_CANCELLED`, "The connection closed before the answer was ready") ⇒ không có câu hỏi treo "đang chờ". Lượt
model đang chạy dở không huỷ được (`llmComplete` chưa nhận `AbortSignal`); nếu đó là lượt CUỐI và xong thì câu trả lời vẫn
được lưu — mở lại hội thoại là thấy.

Bản không stream (`/ai/chat`, web): câu trả lời dài hơn trước ⇒ web chờ tới 290 s (`AI_CHO_MS` trong `work-api.ts`;
nginx cắt ở 300 s). Quá giờ thì câu trả lời vẫn được lưu và hiện khi mở lại hội thoại.

## Stream token hoạt động thế nào (giao thức 22/10/2026)

**Vì sao đổi.** Trước 22/10 model phải trả MỘT khối JSON `{"reply":"<markdown>","actions":[…]}`. Đo thật bằng prompt
production (câu "tôi cần hiểu rõ 100% hàm, code, luồng, test…"): Claude Sonnet hay bỏ khuôn với câu hỏi sâu —
(1) viết Markdown thường rồi thêm ```` ```json {"reply":"above","actions":[]} ``` ```` ⇒ người dùng nhận đúng chữ "above";
(2) viết Markdown có code (`{`) mà không có JSON ⇒ `parseJson` ném 502 `WORK_AI_BAD_OUTPUT` ("không đọc được") — lỗi
iOS báo, hỏi lại đôi khi được vì lần sau model lại viết JSON. Kiểu (1) còn làm luồng câm tới cuối (không có `{"reply"`).

**Giao thức mới** (một khuôn cho cả ba cổng):
- Câu trả lời là **Markdown thường, viết trước** — mỗi mẩu token của cổng đi thẳng thành `delta`.
- Đề xuất thao tác (nếu có) nằm **sau**, trong một khối `<ctw-actions>[…]</ctw-actions>` — không bao giờ hiện ra client
  (kể cả lúc mới tới nửa thẻ). Khối cụt/hỏng ⇒ giữ các đề xuất còn nguyên, **chữ trả lời không bao giờ mất**.
- 28/10/2026: thêm tool gốc `find_commands` — tra mô tả + tham số của lệnh chỉ có TÊN trong prompt (nạp lệnh động; xem
  `docs/cuongmini-ctwork-parity.md` mục 7). Hiện ở `progress reading` với nhãn `Commands: …`. Vòng chỉ tra lệnh không ăn trần vòng đọc.
- Xin **đọc** dữ liệu ⇒ **tool gốc** của cổng (`read_command` / `read_page` / `search_pages`; Anthropic `tool_use`,
  OpenAI `tool_calls`) thay cho `{"reply":"","reads":[…]}`. Lượt có tool đọc: máy chủ giữ ~320 ký tự đầu trước khi phát
  (Sonnet hay viết "Tôi cần đọc thêm… 1. … 2. …" rồi mới gọi tool — không giữ thì đoạn đó hiện ra rồi bị `reset`).
  Câu trả lời ngắn hơn 320 ký tự ở lượt đó tới một lần lúc xong; câu dài vẫn chảy sau ~1–2 s đầu.
- Khuôn JSON cũ vẫn đọc được (và vẫn stream qua `ReplyStreamer`); chữ khác rỗng không theo khuôn nào ⇒ chính nó là câu
  trả lời. Chỉ còn một đường ra `WORK_AI_BAD_OUTPUT`: model trả **rỗng** hai lần liền.
- Bản nháp đã phát luôn là phần đầu câu chuẩn (khoảng trắng cuối, dòng đang mở rào ```` ```json ````, nửa thẻ được giữ
  lại tới khi rõ) ⇒ `done.reply` thường chỉ khác nháp ở link sâu do mã dựng (`lienKetHoa`) hoặc dòng "N suggested
  change(s) were dropped".

## Model viết "gọi tool" thành chữ (22/10/2026, lỗi prod 05:24)

Rambo trả "claude-sonnet-5" mà (ít nhất đôi lúc) là model DeepSeek: vòng 0–2 gọi tool gốc bình thường, vòng 3 (đã gỡ
tool) VIẾT lời gọi tool thành chữ theo khuôn DSML (`<｜DSML｜invoke name="read_command">…`) ⇒ iPad hiện nguyên khối.
`src/services/work/aiMarkupTool.ts` nhận diện mọi khuôn hay gặp (DSML thanh `|`/`｜`, token DeepSeek V3
`<｜tool▁calls▁begin｜>`, Hermes/Qwen `<tool_call>`, XML `<function_calls>`/`<invoke name=…>`, Mistral `[TOOL_CALLS]`,
cả câu là `{"name":…,"arguments":…}`):
- **Không bao giờ ra client**: `phanHien` cắt từ chỗ khối bắt đầu, giữ nửa thẻ ở cuối mẩu (`<｜DS`, `<inv`, `[TOOL_`…),
  câu mở đầu `[{` chờ tới cuối. MỌI lượt giữ ~120 ký tự đầu (lượt có tool: ~320) rồi mới phát (~0,6 s).
- Lượt CÓ tool ⇒ đọc khối thành tool call thật rồi đọc như thường.
- Lượt không có tool (hoặc không đọc được) ⇒ bỏ trắng lượt (không `reset` vì chưa phát gì), làm lại ở CỔNG SAU (rambo →
  chính hãng → modelapi; modelapi là cuối thì làm lại chính nó) với lời dặn "read tools are NOT available now… plain
  Markdown"; tối đa 2 lần, vẫn markup ⇒ `error` `WORK_AI_BAD_OUTPUT`.
- Có ≥ ngưỡng giữ đầu chữ thật đứng TRƯỚC khối ⇒ đó là câu trả lời, khối bị cắt.
- Log WARN `[work] ai: model trả markup gọi tool dạng chữ` {cong, model, huong, lanCuaCongNay, mau}; bảng đếm theo
  cổng+model ở `GET /api/v1/admin/cong-anthropic/ctwork-ai` › `markupTool`.

## Độ dài — không còn trần nhân tạo (22/10/2026)

- Bỏ luật "dưới ~300 từ": model trả lời **dài đúng bằng câu hỏi cần** (hỏi nhanh ⇒ ngắn; "hiểu rõ 100%", giải thích
  code/luồng/test, chuẩn bị thuyết trình ⇒ đầy đủ). Vẫn: câu trả lời thẳng ở 1–2 câu đầu, ### + gạch đầu dòng, không bảng.
  Ngôn ngữ theo câu hỏi (`ngonNguCauHoi`, 12026c1c).
- Trần token ra mỗi lượt: `ASK_LIMITS.answerTokens` = 16.000 (env `WORK_AI_ANSWER_TOKENS`; trước là 4.000). Rambo không
  tôn trọng `max_tokens`; chính hãng và modelapi (gpt-6-sol, tính cả token suy luận) thì có.
- Chạm trần (`stop_reason: max_tokens` / `finish_reason: length`) khi đang viết câu trả lời ⇒ **tự viết tiếp**: gọi lại với
  [câu hỏi gốc · phần đã viết (assistant) · "viết tiếp ĐÚNG chỗ dở"], tối đa 3 lần; phần model lỡ lặp lại ở đầu đoạn mới
  bị cắt trước khi phát, nên nháp nối liền, không `reset`. Không dùng "prefill".
- Trần token/ngày (`checkTokenQuota`), trần $/ngày của web (`budget.ts`) và trần $ riêng của CT Work trên cổng chính
  hãng (`WORK_AI_CHINH_HANG_USD_NGAY` 30 $ / `…_NGUOI_NGAY` 3 $) giữ nguyên — chạm trần chính hãng ⇒ bỏ qua bậc đó.

## Chuyển cổng (22/10/2026)

Chuỗi `aiCong.ts` — chủ web chốt lại 22/10/2026 (thứ tự đổi bằng env `CTWORK_CHUOI_CONG`, không cần sửa mã):
1. **rambo** (gói trọn, 0 $) — trợ lý `claude-fable-5` (`CTWORK_RAMBO_MODEL`; đo từ container prod 22/10: gọi tool đúng
   3/3, ~3–7 s), việc nặng/spec_review `claude-opus-5`; `/v1/models` không có model đã chọn ⇒ `claude-sonnet-5`.
2. **Anthropic chính hãng Sonnet 5.5** — trần riêng CT Work 100 $/ngày, 10 $/người (trước 30/3; chỉ cắn khi rambo hỏng).
3. **Chính hãng Haiku 5.5** — khi Sonnet hỏng HOẶC chạm trần; khoản chồng thêm 20 $/ngày, 2 $/người (tổng ≤ 120/12).
4. **modelapi `gpt-6-sol`** — lùi cuối, nhìn được ảnh.
Trần chung của web (`budget.ts`) nâng theo: mềm 15 → 50, cứng 40 → 150 $/ngày (lượt chính hãng ghi cùng sổ). Rambo trả
câu báo lỗi với HTTP 200 ("Verify your email…", hết số dư…) cũng là hỏng. Bảng chuỗi + số lần markup: admin
`/admin/commerce` › CuongMini CT Work (`GET /api/v1/admin/cong-anthropic/ctwork-ai`). Ngữ nghĩa chuyển:
- Hỏng **trước mẩu chữ đầu** (lỗi HTTP, 410 khoá hết hạn, hết giờ, mất kết nối, trả rỗng) ⇒ chuyển bậc im lặng — client
  chỉ thấy `progress thinking` lâu hơn một chút. Hết giờ chờ theo bậc: rambo 45 s, chính hãng 60 s, modelapi 120 s
  (gpt-6-sol suy luận trước khi viết: đo 22/10 chữ đầu sau 19–34 s, có lượt > 90 s).
- Hỏng **giữa chừng** (đã có chữ tới client) ⇒ bậc sau **viết tiếp** đúng chỗ dở (cùng cơ chế với chạm trần độ dài): nháp
  giữ nguyên, không `reset`, không `error`. Ngoại lệ: modelapi tự thử lại cùng đoạn (`llmComplete` retry) ⇒ `reset` + phát
  lại phần đã chắc rồi viết lại đoạn đó.
- Mọi bậc đều hỏng ⇒ `error` (mã của lỗi bậc cuối), câu hỏi đánh dấu lỗi, Hỏi lại được. Hết trần tiền của web
  (`BUDGET_EXCEEDED`) / client ngắt ⇒ báo thẳng, không lùi sang bậc trả tiền khác.

## Stream theo cổng (đo 22/10/2026)

| Cổng | Stream | Ghi chú |
|---|---|---|
| rambo (Anthropic `/v1/messages`) | chảy thật (308–950 ms giữa mẩu đầu và cuối — CLAUDE.md) | không tôn trọng `max_tokens` |
| Anthropic chính hãng | chảy thật | `thinking: disabled` (`nhanh`), effort medium |
| modelapi `gpt-6-sol` (tuyến OpenAI) | chảy thật: 544 mẩu trong ~15 s | chữ đầu chậm (19–34 s, suy luận); `LLM_EFFORT_WORK_ASSISTANT=low` rút ngắn |
| modelapi + model Claude | **gom**: cả câu tới trong ~0,3 s sau ~10 s chờ | không nằm trong chuỗi CT Work |

Log mỗi lượt gọi: `[work] ai: lượt model` {cong, model, ttftMs, ms, chars, biCat, tools, noiTiep, chuyenCongGiuaChung};
cuối luồng: `[work] ai: stream xong` {ttftMs, ms, replyChars}.

## nginx

Không cần sửa: `location /api/v1/` đã `proxy_buffering off`, `proxy_read_timeout 300s` (nhịp tim 15 s giữ kết nối).
Route đặt `Cache-Control: no-cache, no-transform` (middleware `compression` bỏ qua) và `X-Accel-Buffering: no`.
