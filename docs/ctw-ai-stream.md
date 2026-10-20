# CT Work — trợ lý dự án bản stream (SSE)

20/10/2026. Bản STREAM của `POST /api/v1/work/projects/:pid/ai/chat`. Route cũ **giữ nguyên** (web + bản iOS đang chạy).
Mã: `src/routes/work.routes.ts` (route), `src/services/work/ai.service.ts` (`chat`/`askWithReads` nhận `hooks`),
`src/services/work/aiReplyStream.ts` (rút `reply` khỏi JSON đang viết). Test: `src/services/work/aiReplyStream.test.ts`,
`WORK_DB_TEST=1 npx tsx --test src/routes/work.aiStream.db.test.ts`.

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
| `reset` | `{}` | **Xoá** bản nháp (lượt đó hoá ra là lượt xin đọc, hoặc nháp lệch bản chuẩn). Các `delta` sau là câu mới. |
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

Client đóng luồng (rời màn hình, mất mạng) ⇒ máy chủ không gọi thêm lượt model nào và đánh dấu câu hỏi lỗi
(`WORK_AI_CANCELLED`, "The connection closed before the answer was ready") ⇒ không có câu hỏi treo "đang chờ". Lượt model
đang chạy dở không huỷ được (`llmComplete` chưa nhận `AbortSignal`); nếu đó là lượt CUỐI và xong thì câu trả lời vẫn được
lưu — mở lại hội thoại là thấy.

## Stream token hoạt động thế nào

Mỗi lượt gọi model truyền `onToken` cho `llmComplete` (buộc stream cả tuyến OpenAI lẫn Anthropic/rambo). Model viết JSON
`{"reply":"…","actions":[…]}`; `ReplyStreamer` đọc tiền tố JSON, giải mã escape (`\n`, `\"`, `\uXXXX`, cặp surrogate) và
phát phần `reply` ngay khi tới (bỏ rào ```json, bỏ `reply` lồng trong `actions`, im lặng nếu khoá `reads` đứng trước
`reply`). Xong lượt, câu chuẩn (`readModelOutput`) được so với nháp: thiếu đuôi ⇒ `delta` nốt; lệch ⇒ `reset` + trọn câu.
Model/cổng không stream được ⇒ cả câu đến trong MỘT `delta` trước `done` (vẫn có `progress`).

## nginx

Không cần sửa: `location /api/v1/` đã `proxy_buffering off`, `proxy_read_timeout 300s` (nhịp tim 15 s giữ kết nối).
Route đặt `Cache-Control: no-cache, no-transform` (middleware `compression` bỏ qua) và `X-Accel-Buffering: no`.
