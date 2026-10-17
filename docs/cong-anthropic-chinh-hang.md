# Cổng Claude chính hãng — hợp đồng API (17/10/2026)

Cổng gọi thẳng `api.anthropic.com` bằng key của chủ app. Hai vai:

1. **CuongMini Free.** Khi rambo hỏng, AI Code (`agent_code`) và CuongMini trong thi (`exam_tutor`) **tự chuyển ngay** sang model rẻ nhất của cổng này (mặc định `claude-haiku-5-5`, đổi bằng `ANTHROPIC_CHINH_HANG_MODEL_FREE`). Không cần mật khẩu: ai được dùng AI Code (`duocDungAiCode`) đều dùng được. Phần này vẫn tính vào **trần Free** theo gói/người.
2. **Model cao.** Gồm Sonnet 5.5, Opus 5.5 và Fable 5.1. Người dùng nhập **mật khẩu riêng của cổng này** để nhận vé 30 ngày. Admin không cần vé và không bao giờ bị giới hạn.

Chat web và các việc AI khác vẫn đi qua modelapi như cũ.

Mã nguồn: `src/services/agent/anthropicChinhHang/` (`cauHinh`, `gia`, `maHoa`, `khoKey`, `goi`, `hanMuc`, `ve`, `dinhTuyen`, `thongKe`, `doiChieu`), `src/services/agent/turn.ts`, `src/services/examTutor.service.ts`, `src/routes/agent.routes.ts`, `src/routes/congAnthropicAdmin.routes.ts`. Trang admin: `/admin/commerce?tab=anthropic`.

---

## 1. Thứ tự định tuyến

### AI Code (`POST /api/v1/agent/turn`)

| Trường hợp | Đi đâu |
|---|---|
| `model` là mã `cl-*` (người dùng chọn tay) | Đi thẳng cổng chính hãng, không qua rambo. Model cao cần vé hoặc admin. Gặp hết trần hoặc hết key thì lùi modelapi nếu có vé dự phòng, không có vé thì báo lỗi. |
| Mã thường, rambo khoẻ, không giữ cổng phụ | Đi rambo như cũ. |
| Rambo **đang được đánh dấu hỏng**, hoặc tab đang giữ cổng phụ (`duPhongGiu: true`) | Đi **modelapi** nếu người dùng muốn (`congPhu: 'modelapi'`, hoặc app cũ có `duPhongGiu` kèm vé dự phòng thật). Nếu không thì đi **CuongMini Free**. Free không chạy được thì đi modelapi (vé dự phòng, admin không cần vé). Không còn đường nào thì báo `RAMBO_BAO_TRI`. |
| Rambo **hỏng giữa lượt** (lỗi không phải 4xx) | Như dòng trên: máy chủ gọi lại đúng bước đó ở cổng phụ và phát khung `cong`. |
| Cổng chính hãng hỏng giữa lượt (hết key hoặc mọi key lỗi) | Lùi modelapi nếu có vé dự phòng (hoặc là admin). Không có vé thì báo `CONG_ANTHROPIC_HET_KEY` hoặc `CONG_ANTHROPIC_HONG`. |

Khi rambo sống lại thì lượt sau tự về rambo, vì cầu dao do mũi dò sẵn có tự đóng. Nếu app còn gửi `duPhongGiu: true` thì máy chủ vẫn để tab ở cổng phụ cho tới khi người dùng bấm "Quay về", giống cổng dự phòng hiện nay.

### CuongMini trong thi (`exam_tutor`, chế độ tự động)

Thứ tự: rambo (trần 40 giây chờ chữ đầu), rồi cổng chính hãng, rồi `chat_max` (modelapi) như cũ.

Ở cổng chính hãng: nếu có vé hoặc là admin thì chạy model cao tương đương (`opus-4-8` thành `claude-opus-5-5`). Nếu không, hoặc hạng cao đã chạm trần, thì chạy CuongMini Free.

Đã có chữ mà luồng gãy thì báo lỗi, **không** trộn sang model khác. Các route `/exam/.../ai/ask` và `/ask-stream` nhận thêm `congAnthropicVe` trong thân yêu cầu.

---

## 2. Endpoint cho client (app desktop, extension VS Code, CLI, web)

Mọi endpoint cần đăng nhập. Các endpoint `chiPro` cho qua tài khoản Pro, admin, hoặc người có key terminal còn hạn.

### `GET /api/v1/agent/tools?congAnthropicVe=<vé>`

`data.models` giờ gồm model của bảng hiện hành (rambo hoặc modelapi, có thêm trường `cong: 'rambo' | 'modelapi'`) **cộng thêm** 4 mục chính hãng (chỉ khi `pro: true`):

```jsonc
{
  "id": "cl-free",                 // mã gửi lên trong `model`
  "model": "claude-haiku-5-5",     // tên thật (chỉ để hiển thị)
  "ten": "CuongMini Free",
  "mo": "Tự bật khi cổng chính gặp sự cố — …",
  "hang": "free",                  // 'free' | 'cao'
  "cong": "anthropic",
  "mienPhi": true,                 // true chỉ với cl-free
  "canMoKhoa": false,              // true = phải nhập mật khẩu cổng này trước (model cao, chưa có vé, không phải admin)
  "dungDuoc": true,                // máy chủ đang có ít nhất một key dùng được
  "dat": true                      // chỉ có ở cl-fable-5-1 — hiện cảnh báo đắt
}
```

Các mã: `cl-free`, `cl-sonnet-5-5`, `cl-opus-5-5`, `cl-fable-5-1`. `cl-haiku-5-5` là bí danh cũ, máy chủ hiểu là `cl-free`.

### `GET /api/v1/agent/cong-anthropic?ve=<vé>&veDuPhong=<vé dự phòng>`

```jsonc
{
  "coKey": true,                 // có key dùng được
  "daBat": true,                 // admin đã đặt mật khẩu model cao
  "laAdmin": false,
  "veHopLe": true,               // vé `ve` còn hiệu lực (false với admin vì admin không cần vé)
  "modelCaoDuoc": true,          // admin HOẶC vé hợp lệ
  "congChinhDangHong": false,    // cầu dao rambo đang mở
  "hanMuc": {
    "free": { "khongGioiHan": false, "daDungThang": 0.12, "daDungNgay": 0.01, "tranThang": 3, "tranNgay": 0.5, "het": false },
    "cao":  { "khongGioiHan": false, "daDungThang": 1.4,  "daDungNgay": 0.2,  "tranThang": 20, "tranNgay": null, "het": false }
  },                              // USD tự đo; null = không giới hạn
  "models": [ /* như mục trong /agent/tools */ ],
  "cacCong": [ /* như trong khung `cong` — xem mục 3 */ ]
}
```

### `POST /api/v1/agent/cong-anthropic/mo-khoa` với thân `{ "matKhau": "…" }`

Thành công trả `200 { ve, hetHan }`. Vé dạng `ca.<userId>.<phiên bản>.<hạn ms>.<chữ ký>`, sống 30 ngày. App lưu vé **theo tài khoản** và gửi kèm mỗi lượt.

| HTTP | `code` | Ý nghĩa |
|---|---|---|
| 409 | `CONG_ANTHROPIC_CHUA_BAT` | Admin chưa đặt mật khẩu |
| 403 | `CONG_ANTHROPIC_SAI_MAT_KHAU` | Sai mật khẩu |
| 429 | `CONG_ANTHROPIC_THU_QUA_NHIEU` | Sai 5 lần trong 15 phút. Bộ đếm **dùng chung** với `/agent/du-phong/mo-khoa` |

Khi admin đổi hoặc tắt mật khẩu thì mọi vé cũ chết ngay. Lượt kế tiếp sẽ nhận `CONG_ANTHROPIC_KHOA`, app xoá vé rồi hỏi lại mật khẩu.

Cổng modelapi giữ nguyên `GET /agent/du-phong` và `POST /agent/du-phong/mo-khoa` (vé dự phòng riêng). **Mỗi cổng có mật khẩu và vé riêng.**

### `POST /api/v1/agent/turn`: các trường mới

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `model` | `string` | Có thể là mã `cl-*` |
| `messages[].khoiAnthropic` | mảng | Khối Anthropic gốc của tin assistant, app gửi lại nguyên văn (mục 3b) |
| `messages[].content[]` `{type:'file'}` | khối | PDF đính kèm (mục 3b) |
| `mucNoLuc` | `string` | Quyết định cả `effort` ở cổng chính hãng (mục 3b) |
| `mucModelPhu` | `string?` | Chỉ lượt phụ (`laPhu: true`): mức model của việc phụ (mục 3b) |
| `congAnthropicVe` | `string?` | Vé cổng chính hãng. Đặt cạnh `duPhongVe` |
| `congPhu` | `'modelapi'?` | Khi rambo hỏng hoặc tab đang giữ, người dùng **muốn modelapi** (GPT) thay cho CuongMini Free. Bỏ trống thì đi Free |

Các trường cũ `duPhongVe`, `duPhongModel`, `duPhongGiu` giữ nguyên nghĩa.

**Lỗi trước khi mở SSE (HTTP):**

| HTTP | `code` | Khi nào | App làm gì |
|---|---|---|---|
| 403 | `CONG_ANTHROPIC_KHOA` | Chọn model cao `cl-*` mà không có vé hợp lệ, và không phải admin. `data: { model, daBat }` | Hiện ô mật khẩu cổng chính hãng. Nếu `daBat: false` thì báo "Quản trị chưa bật" |

**Khung SSE mới hoặc mở rộng:**

```jsonc
// start: thêm giá trị 'anthropic'
{ "type": "start", "model": "claude-haiku-5-5", "buoc": 1, "tranBuoc": 30, "cong": "chinh" | "du-phong" | "anthropic" }

// rambo hỏng ⇒ tự sang CuongMini Free (phát ngay sau `start` hoặc giữa lượt)
{
  "type": "cong",
  "cong": "anthropic",
  "model": "claude-haiku-5-5",
  "ten": "CuongMini Free",
  "ma": "CONG_CHINH_HONG_FREE",
  "thongDiep": "Cổng chính đang gặp sự cố — đang tự chuyển sang model CuongMini Free.",
  "moiNangCap": true,
  "cacCong": [
    { "cong": "anthropic", "ten": "Anthropic chính hãng", "daBat": true, "canMatKhau": true,
      "models": [ { "id": "cl-sonnet-5-5", "ten": "Claude Sonnet 5.5 · chính hãng", "mo": "…", "dungDuoc": true },
                  { "id": "cl-opus-5-5", … }, { "id": "cl-fable-5-1", …, "dat": true } ] },
    { "cong": "modelapi", "ten": "modelapi", "daBat": true, "canMatKhau": true,
      "models": [ { "id": "gpt-6-sol", "ten": "GPT 6 Sol", "mo": "…", "dungDuoc": true }, … ] }
  ]
}

// lùi sang modelapi (như cũ; có thể kèm ma/thongDiep)
{ "type": "cong", "cong": "du-phong", "model": "gpt-6-sol", "ma": "DOI_CONG", "thongDiep": "…" }
```

App cũ: khung `cong` bất kỳ vẫn rơi vào `danhDauDuPhong()`, tức là tab giữ cổng phụ và lượt sau gửi `duPhongGiu: true`. Phía máy chủ, Free vẫn được chọn trừ khi app cầm vé dự phòng thật. Nghĩa là app cũ chạy được ngay, chỉ chưa có lời mời nâng cấp.

**Mã lỗi trong khung `error` (SSE):**

| `code` | Ý nghĩa | App làm gì |
|---|---|---|
| `CONG_ANTHROPIC_KHOA` | Như mục HTTP ở trên, khi đi đường không qua route | Hỏi mật khẩu |
| `CONG_ANTHROPIC_HET_HAN_MUC` | Chạm trần USD tháng hoặc ngày, ở hạng Free hoặc cao. `error` là câu tiếng Việt nói rõ. Nếu người dùng có vé dự phòng thì máy chủ **đã tự lùi** modelapi, không phát lỗi này | Hiện câu. Có thể mời mở modelapi |
| `CONG_ANTHROPIC_HET_KEY` | Không còn key nào dùng được (hết credit, chạm ngân sách tháng, lỗi hoặc tắt) | Báo, mời dùng modelapi |
| `CONG_ANTHROPIC_HONG` | Mọi key đều lỗi tạm thời (429/529/5xx/mất mạng) | Cho thử lại sau |
| `RAMBO_BAO_TRI` | Rambo hỏng, CuongMini Free không chạy được, và không có vé modelapi | Như cũ: hỏi mật khẩu dự phòng |

### Việc client cần làm (app desktop, extension VS Code, CLI)

1. Đọc `info.models`. Nhóm theo `cong`. Mục có `canMoKhoa: true` thì hiện ổ khoá; bấm vào thì hỏi mật khẩu, gọi `mo-khoa`, lưu vé.
2. Gửi `congAnthropicVe` ở **mọi** lượt (cùng chỗ với `duPhongVe`), và ở `/agent/tools?congAnthropicVe=`.
3. Gặp HTTP 403 hoặc khung `error` có `CONG_ANTHROPIC_KHOA` thì xoá vé đang giữ (nếu có) và hiện ô mật khẩu cổng chính hãng.
4. Nhận khung `cong` có `ma: 'CONG_CHINH_HONG_FREE'` thì hiện dòng thông tin `thongDiep` (kiểu `DOI_CONG`, mức `info`) và lời mời nâng cấp từ `cacCong`. Người dùng chọn cổng, nhập mật khẩu nếu `canMatKhau` (gọi `mo-khoa` của cổng đó), rồi chọn model:
   - chọn cổng **anthropic** thì gửi `model: 'cl-…'` kèm `congAnthropicVe`;
   - chọn cổng **modelapi** thì gửi `congPhu: 'modelapi'`, `duPhongVe`, `duPhongModel` và `duPhongGiu: true`.
5. Giữ nguyên luồng "giữ cổng phụ" và "rambo sống lại thì hỏi quay về" hiện có (`GET /agent/du-phong?kiem=1`). Khi quay về, bỏ `cl-*` khỏi lựa chọn nếu đó là Free do máy chủ tự bật (Free không phải lựa chọn bền).
6. CuongMini web (phòng thi) gửi `congAnthropicVe` trong thân `/exam/.../ai/ask(-stream)` nếu người dùng có vé.
7. **Giữ nguyên `khoiAnthropic`** trên tin assistant (lưu đĩa, gửi lại). Đây là việc bắt buộc để thinking và compaction hoạt động đúng.
8. Có thể hiện "Đang suy nghĩ…" khi nhận khung `nghi`, và hiện chi phí lượt từ `done.tienUsd`.
9. Lượt phụ: gửi `mucModelPhu`. Lấy từ tham số `model` của tool `giao_viec_phu`; nếu không có thì lấy từ khoá `model:` của file agent phụ.
10. PDF: gửi khối `{type:'file', file:{filename, file_data}}` khi đang ở cổng chính hãng; ở cổng khác thì app tự rút chữ như cũ.

---

## 3. Kho key và tự chuyển key

- Bảng `anthropic_keys` lưu: nhãn, `khoaMaHoa`, `duoiKhoa` (4 ký tự cuối), `vanTay` (sha256, để chặn trùng), `thuTu`, `nganSachThangUsd`, `ngayLamMoi` (1–28), `hetHanLuc`, `trangThai` (`hoatDong` | `hetCredit` | `loi` | `tat`), `loiCuoi`, `loiCuoiLuc`, `hetCreditLuc`.
- Mã hoá dùng `utils/crypto.ts` (AES-256-GCM, `APP_ENCRYPTION_KEY`, token `v1.`) nếu biến đó có mặt. Nếu không, mã hoá AES-256-GCM với khoá HKDF dẫn xuất từ `JWT_SECRET` (token `j1.`). **Đổi một trong hai bí mật thì key cũ không giải được**: key chuyển sang `loi` và admin phải dán lại.
- **Nạp lần đầu** từ `ANTHROPIC_CHINH_HANG_KEYS`, chỉ khi bảng rỗng (xem `.env.example`). Từ đó về sau, mọi chỉnh sửa làm trên trang admin.
- **Luật cho một lời gọi**, thử theo thứ tự ưu tiên:

  | Phản hồi | Hành động |
  |---|---|
  | 400 "credit balance is too low", hoặc 402 `billing_error` | Đánh dấu `hetCredit`, thử key kế |
  | 401 / 403 | Đánh dấu `loi`, thử key kế |
  | 429 / 529 / 5xx / 408 / mất mạng | Thử key kế, không đổi trạng thái (chỉ ghi `loiCuoi`) |
  | 400 khác (yêu cầu sai) | Ném luôn, không xoay key |

- Key `hetCredit` **tự mở lại** khi qua mốc `ngayLamMoi` (giờ Việt Nam). Key `loi` chỉ mở lại khi admin bật lại, hoặc khi "Thử kết nối" thành công.
- Key bị **bỏ qua** (không đổi trạng thái) khi đã quá `hetHanLuc`, hoặc khi số tự đo trong chu kỳ đã chạm `nganSachThangUsd`. Lý do: credit ưu đãi hết thì thẻ của chủ app bắt đầu bị trừ.
- **Prefill:** các model 5.5 từ chối prefill. Vì vậy khi viết tiếp, máy chủ tự thêm một tin `user` xin viết tiếp.
- **Lùi khi model từ chối:** Opus 5.5, Sonnet 5.5 và Fable 5.1 được gửi kèm `fallbacks: "default"` với beta `server-side-fallback-2026-07-01` (theo khuyến nghị của Anthropic). Tắt bằng `ANTHROPIC_CHINH_HANG_FALLBACKS=false`. Bộ đọc luồng bỏ mọi `thinking`/`tool_use` đứng trước khối `fallback`.
- Thân yêu cầu đầy đủ, thinking, caching và dọn ngữ cảnh: xem **mục 3b**.

## 3b. Thân yêu cầu lượt agent — chất lượng trước, không đốt token vô ích

Chủ app chốt ngày 17/10/2026: **chất lượng trước**. Mọi điểm dưới đây đều không làm giảm chất lượng. Mã nằm ở `anthropicChinhHang/thanYeuCau.ts` và `cauHinh.ts`.

Giới hạn thật của cả 4 model (đo bằng `GET /v1/models/{id}`, 17/10): `max_input_tokens` 1.000.000, `max_tokens` 128.000. Máy chủ đọc lại các giới hạn này rồi nhớ 1 ngày (`caiDat.ts › gioiHanModel`). Nếu không đọc được thì dùng hai số trên. Admin xem ở `GET /admin/cong-anthropic/gioi-han`.

| Tham số | Giá trị |
|---|---|
| `thinking` | `{type:'adaptive', block_binding:{prefix_mismatch_behavior:'drop_block'}}` và beta `thinking-binding-controls-2026-08-01`. Model 5.5 chỉ nhận `adaptive`. `drop_block`: nếu một chỗ trong lịch sử đã bị sửa thì chỉ khối thinking ở đó bị bỏ, cả lượt **không** bị 400 (tài khoản tạo sau 31/08/2026 bị kiểm chặt) |
| `output_config.effort` | Theo **đúng** mức người dùng chọn: `thap`→low, `vua`→medium, `cao`→high, `ratCao`→xhigh, `toiDa`/`ultracode`→max. Không chọn thì **high** (`ANTHROPIC_CHINH_HANG_EFFORT` chỉ đổi mức mặc định). Không bao giờ tự hạ. Lưu ý: Opus 5.5 và Haiku 5.5 tự mặc định medium nếu không gửi, nên máy chủ luôn gửi |
| `max_tokens` | 64.000 cho lượt agent (`ANTHROPIC_CHINH_HANG_MAX_TOKENS`, tối đa 128.000), kẹp theo giới hạn của model. Lời gọi văn bản (CuongMini trong thi) tối thiểu 16.000. Thinking cũng tính vào trần này |
| `context_management.edits` | Theo thứ tự (`clear_thinking` **phải** đứng đầu): `clear_thinking_20251015 {keep:'all'}`, rồi `clear_tool_uses_20250919` (chỉ khi đã có ≥ 600.000 token vào, giữ **25** kết quả gần nhất, mỗi lần dọn ≥ 50.000), rồi `compact_20260112` (trigger 300.000, đổi bằng `ANTHROPIC_CHINH_HANG_COMPACT_TOKENS`; đặt `0` để tắt). Ưu tiên **compact** hơn xoá kết quả tool. Beta: `context-management-2025-06-27` và `compact-2026-01-12` |
| `fallbacks` | `"default"` cho Opus 5.5, Sonnet 5.5, Fable 5.1 |
| Prompt caching | 4 mốc, vị trí ổn định giữa các vòng: tool cuối (tool hàm **sắp theo tên**, nên thứ tự không phụ thuộc thứ tự app gửi), cuối system (prompt không chứa giờ hay giá trị ngẫu nhiên), khối cuối của tin `user` cuối, và khối cuối của tin `user` kế cuối (điểm cắt trượt) |
| Server tool | `web_search_20260209` hoặc `code_execution_20260521`: **mặc định TẮT**, admin bật trên trang (`PUT /admin/cong-anthropic/server-tools`). Bật cả hai thì chỉ khai `web_search`, vì bản 20260209 đã gồm code execution để lọc. Tìm web tính riêng $10 / 1.000 lần (`ANTHROPIC_CHINH_HANG_GIA_TIM_WEB`). Gặp `pause_turn` thì máy chủ gửi lại nguyên tin assistant để model làm tiếp |
| PDF | Khối `file` của người dùng (hình dạng OpenAI: `{type:'file', file:{filename, file_data:'data:application/pdf;base64,…'}}`, tối đa 4 tệp/tin, mỗi tệp khoảng 6MB) được gửi thành khối **`document` gốc** (base64), **không** rút chữ. Rambo và modelapi nhận một dòng báo "không đọc được PDF gốc" |

**Không lược ngữ cảnh ở phía mình khi chọn tay model cao.** Các đường rambo/modelapi lược kết quả tool cũ (`compact.ts`) và giữ trần 600.000 ký tự. Lượt `cl-sonnet/opus/fable`:
- **không** lược kết quả tool cũ, nên tiền tố đứng yên và đệm trúng;
- trần hội thoại là **2.400.000 ký tự** (khoảng 60–70% cửa sổ 1M);
- trần cắt một kết quả tool vẫn giữ như AI Code hiện có (60.000 ký tự ở máy chủ, app cắt trước), không siết thêm;
- phần quá lớn để `compact` / `clear_tool_uses` phía Anthropic lo.

CuongMini Free (tự bật khi rambo hỏng) đi như đường thường: có lược, trần 600.000 ký tự.

**Không thêm** câu nào kiểu "trả lời ngắn để tiết kiệm" vào system prompt.

**80% ngữ cảnh:** khung `done.nguCanh` (`kyTu`/`tran`/`phanTram`) đã có sẵn. Trần ký tự ở trên giữ hội thoại dưới khoảng 70% của 1M, và compact phía máy chủ chạy ở 300K, nên chưa cần cảnh báo riêng.

**Gửi lại bản tối giản một lần.** Các tham số beta trên **chưa đo được bằng key thật** trong phiên làm tính năng này. Vì vậy, khi Anthropic trả 400 có nhắc tới `block_binding`/`context_management`/`compact`/`fallbacks`/`thinking`/beta…, máy chủ gửi lại **một lần, cùng key**, bản tối giản (`thanAnToan`):
- bỏ mọi beta;
- bỏ khối thinking/compaction trong lịch sử;
- giữ `thinking:{type:'adaptive'}`, effort và caching.

Lần gửi lại này ghi log WARN `[anthropic] 400 vì tham số beta/thinking`. **Lần đầu dùng key thật, xem log này.** Nếu nó xuất hiện thì có một tham số cần chỉnh.

### Khối Anthropic gốc trong lịch sử (`khoiAnthropic`): app PHẢI giữ nguyên

Tin `assistant` trong `done.append` do cổng chính hãng sinh ra có thêm trường:

```jsonc
{ "role": "assistant", "content": "Để tôi đọc file.", "tool_calls": [ … ],
  "khoiAnthropic": [
    { "type": "thinking", "thinking": "", "signature": "…" },   // chữ ký BẮT BUỘC giữ nguyên
    { "type": "text", "text": "Để tôi đọc file." },
    { "type": "tool_use", "id": "toolu_1", "name": "read_file", "input": { "path": "a.ts" } }
  ] }
```

- App **lưu và gửi lại nguyên văn** trường này ở mọi lượt sau. Không sửa, không sắp lại. Lý do: API đòi khối thinking có chữ ký không bị sửa khi lịch sử có `tool_use`; và khối `compaction` (khi compact phía máy chủ chạy) phải đi lại thì máy chủ mới bỏ phần đã tóm tắt, không tóm tắt (và tính tiền) lại.
- Máy chủ chỉ nhận lại khi: các kiểu khối nằm trong danh sách trắng (thinking, redacted_thinking, text, tool_use, compaction, các khối server tool); tổng dung lượng dưới 4MB; và các `tool_use` khớp **đúng** `tool_calls` của tin đó. Sai bất kỳ điều nào thì bỏ cả trường và dựng lại tin từ `content`/`tool_calls`.
- Rambo và modelapi bỏ qua trường này.

### Khung SSE / trường mới cho lượt agent

- `{ "type": "nghi" }`: phát **một lần mỗi lời gọi**, khi khối thinking đầu tiên bắt đầu (chữ thinking bị ẩn). App có thể hiện "Đang suy nghĩ…". App cũ bỏ qua khung này.
- `done.tienUsd`: USD của lượt, tính theo bảng giá chính thức, gồm đọc/ghi đệm, lượt compact (`usage.iterations`) và số lần tìm web (`usage.server_tool_use`). `done.usage.costUsd` cũng mang đúng số này.
- `done.dem: { doc, ghi }`: token đọc/ghi đệm của lượt.

### Agent phụ chọn model theo việc (giống Claude Code)

- Tool `giao_viec_phu` có thêm tham số tuỳ chọn `model`: `ke_thua` (**mặc định**, cùng model chính) | `manh` | `can_bang` | `nhanh`. Mô tả tool chỉ dặn dùng `nhanh` cho việc dò tìm, liệt kê hoặc đọc lướt đơn giản, và không thúc model tiết kiệm.
- File agent phụ của dự án (`.claude/agents/<loai>.md`, định dạng Claude Code) có thể khai `model: haiku|sonnet|opus|inherit` trong phần đầu file. Ánh xạ: haiku→`nhanh`, sonnet→`can_bang`, opus→`manh`, inherit→`ke_thua`. **Tham số của tool thắng khai báo trong file.**
- **Hợp đồng:** lượt phụ gửi `laPhu: true`, `model: <mã model chính>` (giống lượt chính, kể cả `cl-*`, kèm `congAnthropicVe` nếu có) và **`mucModelPhu`** (`nhanh`/`can_bang`/`manh`/`ke_thua`, hoặc thẳng `haiku`/`sonnet`/`opus`/`inherit`).
- Máy chủ ánh xạ theo cổng **đang chạy** (`modelPhu.ts`):

  | Cổng | `nhanh` | `can_bang` | `manh` |
  |---|---|---|---|
  | Chính hãng | `claude-haiku-5-5` | `claude-sonnet-5-5` | model chính |
  | Rambo | `claude-haiku-4-5` | `claude-sonnet-5` | model chính |
  | modelapi | `gpt-5.6-luna` | `gpt-6-sol` | model chính |

  Máy chủ **không bao giờ** chọn model đắt hơn model chính (so cả giá vào lẫn giá ra). Model phụ **vẫn tính trần** cùng hạng (free/cao) với lượt chính, cùng ví và hạn mức 5 giờ.
- Việc NỀN do máy chủ tự chạy (đặt tên việc `/agent/dat-ten`, tóm tắt lượt cũ, `/agent/compact`) giữ nguyên đường cũ: model rẻ của modelapi, không đi cổng chính hãng.

## 4. Đo dùng và trần

- Bảng `anthropic_usage_logs` ghi **mỗi lời gọi**, kể cả lời gọi hỏng: key, người dùng, việc, hạng (`free`/`cao`), model, token vào / ra / đọc đệm / ghi đệm, USD, thời gian, thời gian tới byte đầu. Sổ chung `interview_llm_call_logs` vẫn nhận USD đúng nên cầu dao `budget.ts` thấy được khoản này.
- **USD là số tự đo**: `usage` Anthropic trả về nhân với bảng giá trong `gia.ts`. Bảng giá lấy theo giá chính thức: ghi đệm ×1,25; đọc đệm ×0,1, riêng Opus 5.5 là $0,20 và Fable 5.1 là $0,25; Haiku 5.5 có bậc giá khi prompt trên 100K token. Sửa bằng `ANTHROPIC_CHINH_HANG_GIA`.
- **Trần** tính theo tháng và ngày lịch giờ Việt Nam, tách hai phần **Free** và **cao**:

  | Gói | Free / tháng | Free / ngày | Cao / tháng | Cao / ngày |
  |---|---|---|---|---|
  | `pro` (mặc định) | 3 $ | 0,5 $ | 20 $ | — |
  | `key_terminal` (mặc định) | 2 $ | 0,3 $ | 10 $ | — |
  | Không Pro, không key | 0 | 0 | 0 | 0 |
  | Admin | không giới hạn (vẫn đếm) | | | |

  Admin sửa trần gói ở `app_settings.anthropic_chinh_hang_tran_goi`. Trần riêng từng người ở `anthropic_user_caps`, ghi đè trần gói theo từng ô; ô để `null` thì theo gói. Nếu không đọc được sổ thì **chặn** (đây là tiền thật).

### 4b. `tim_web` cho MỌI cổng (đợt 2, 18/10/2026)

Tool máy chủ `tim_web` (`src/services/agent/timWeb.ts`) chạy cho cả rambo, modelapi lẫn chính hãng. Thử lần lượt
`searxng` (SearXNG tự dựng, miễn phí) → `tavily` (khi có khoá) → `anthropic`: `claude-haiku-5-5` + server tool
`web_search_20250305` (Haiku KHÔNG nhận bản lọc động `_20260209`; `caiDat.kieuWebSearch` chọn bản theo model — áp
cả cho server tool admin bật ở lượt agent). Nhánh `anthropic`:
- ghi sổ `viec: 'tim_web'`, `hang: 'free'` ⇒ tính vào trần **CuongMini Free** của người dùng (USD = token Haiku + $0,01/lần tìm);
- chặn khi hết trần Free, khi tài khoản không Pro/không key terminal, hoặc khi đã tìm `AGENT_TIM_WEB_LUOT_NGAY` (mặc định 40) lần trong ngày (giờ VN);
- admin không giới hạn (vẫn ghi sổ).
Lỗi/hết hạn mức trả "LỖI: …" (không bao giờ thành "0 kết quả"). Kết quả: danh sách {tiêu đề, URL, đoạn trích từ
`citations[].cited_text`, ngày `page_age`} + ghi chú ngắn của bộ tìm; model được dặn mở trang (`web_mo`/`doc_web`) và ghi nguồn.

## 5. API admin: `/api/v1/admin/cong-anthropic` (ROLE_ADMIN)

| Method | Đường | Thân / Trả |
|---|---|---|
| GET | `/` | `{ keys, daBatMatKhau, tranGoi, modelFree, models (kèm giá), bangGia, coAdminKey, goc, ghiChu }` |
| POST | `/keys` | `{ nhan, khoa, nganSachThangUsd?, ngayLamMoi?, hetHanLuc?, thuTu? }` trả `{ id, keys }` (409 nếu trùng) |
| PATCH | `/keys/:id` | Bất kỳ trường nào trong `nhan`, `khoa` (thay key, trạng thái về `hoatDong`), `nganSachThangUsd`, `ngayLamMoi`, `hetHanLuc`, `thuTu`, `trangThai` |
| DELETE | `/keys/:id` | Xoá key. Dòng sổ giữ lại, `keyId` thành null |
| PUT | `/keys/thu-tu` | `{ ids: number[] }` theo thứ tự mới |
| POST | `/keys/:id/thu` | "Thử kết nối": gọi `GET /v1/models`, không tốn tiền. Trả `{ ok, status, ms, loi, soModel, thieuModel, keys }`. Thành công thì mở lại key đang `loi` |
| GET | `/dung?soNgay=30` | `{ thangNay, theoNguoi, theoModel, theoNgay }` |
| GET | `/doi-chieu` | Dùng Admin API của Anthropic (mục 6) |
| PUT | `/server-tools` | `{ webSearch?: bool, codeExecution?: bool }`, mặc định cả hai đều tắt |
| GET | `/gioi-han` | Giới hạn thật của từng model (`/v1/models/{id}`, nhớ 1 ngày) |
| GET | `/tran` | `{ tranGoi, rieng[] }` (có số đã dùng) |
| PUT | `/tran/goi` | `{ pro?: { free?: {thang, ngay}, cao?: {…} }, key_terminal?: … }` (`null` là không giới hạn) |
| GET | `/tran/tim?q=` | Tìm người (email, username, tên, id): gói, đã dùng / trần (free + cao), trần riêng |
| GET / PUT / DELETE | `/tran/nguoi/:id` | Trần riêng `{ tranThangUsd, tranNgayUsd, freeThangUsd, freeNgayUsd, ghiChu }` |
| PUT | `/mat-khau` | `{ matKhau }` để đặt hoặc đổi (vé cũ chết theo); `{ matKhau: null }` để tắt model cao với người thường |

`keys[]` **không bao giờ** chứa khoá thô, chỉ `duoiKhoa`. Mỗi mục kèm `chuKy`, `daDungUsd`, `conLaiUocUsd`, `soLuot`, `soLoi`, `tbThoiGianMs`, `tbTtfbMs`, `boQua` và `tiLeTrungDem` (đọc đệm chia cho tổng token vào, trong chu kỳ). `GET /` có thêm `serverTool` và `thamSo` (effort mặc định, max_tokens, ngưỡng compact/dọn tool, trần ký tự). `GET /dung` có `thangNay.tiLeTrungDem`.

## 6. Đối chiếu số thật (tuỳ chọn)

`ANTHROPIC_ADMIN_KEY` (dạng `sk-ant-admin01-…`; nhiều khoá thì ngăn bằng dấu phẩy, mỗi tổ chức một khoá). Khi có biến này, `GET /doi-chieu` gọi:

- `/v1/organizations/api_keys`: khớp key với `partial_key_hint` qua 4 ký tự cuối;
- `/v1/organizations/usage_report/messages` (`group_by[]=api_key_id,model`, `bucket_width=1d`, từ đầu tháng): token thật theo key;
- `/v1/organizations/cost_report`: USD thật của cả tổ chức (chuỗi thập phân tính bằng **cent**).

Không có biến này thì trang admin ẩn mục đối chiếu. Hình dạng phản hồi được đọc phòng thủ, **chưa đo thật** bằng khoá admin nào.

## 7. Biến môi trường (máy chủ: `/opt/cuonghoangdev/.env`)

| Biến | Bắt buộc | Định dạng |
|---|---|---|
| `ANTHROPIC_CHINH_HANG_KEYS` | Lần đầu | `nhan|ngansach|key,nhan|ngansach|key` theo thứ tự ưu tiên. Ví dụ: `Key 2 (100$)|100|sk-ant-…,Key 1 (200$)|200|sk-ant-…`. Có thể thêm ngày làm mới: `nhan|ngansach|ngay|key` |
| `APP_ENCRYPTION_KEY` | ⛔ KHÔNG thêm trên prod | base64 32 byte. Thiếu thì dẫn xuất từ `JWT_SECRET` — đó là cách prod đang chạy (18/10/2026). Token OAuth CT Work (`work/oauth/crypto.ts`) và bí mật intake (`intakeRules.ts`) cũng đọc biến này và đã mã hoá bằng khoá dẫn xuất ⇒ thêm vào là chúng giải không ra |
| `ANTHROPIC_CHINH_HANG_MODEL_FREE` | Không | Mặc định `claude-haiku-5-5` |
| `ANTHROPIC_CHINH_HANG_EFFORT` | Không | Mức effort MẶC ĐỊNH khi người dùng không chọn (mặc định `high`) |
| `ANTHROPIC_CHINH_HANG_MAX_TOKENS` | Không | Trần ra lượt agent (mặc định 64000, tối đa 128000) |
| `ANTHROPIC_CHINH_HANG_COMPACT_TOKENS` | Không | Ngưỡng compact phía máy chủ (mặc định 300000, tối thiểu 50000; `0` để tắt) |
| `ANTHROPIC_CHINH_HANG_GIA_TIM_WEB` | Không | USD mỗi lần tìm web của server tool (mặc định 0.01) |
| `ANTHROPIC_CHINH_HANG_FALLBACKS` | Không | `false` để tắt |
| `ANTHROPIC_CHINH_HANG_GIA` | Không | JSON giá USD/MTok |
| `ANTHROPIC_CHINH_HANG_MAP` | Không | JSON từ model rambo sang model chính hãng (CuongMini trong thi) |
| `ANTHROPIC_CHINH_HANG_BASE_URL` | Không | Chỉ dùng cho test hoặc proxy |
| `ANTHROPIC_ADMIN_KEY` | Không | Đối chiếu số thật |
| `AGENT_TIM_WEB_NGUON` | Không | Thứ tự nguồn của `tim_web`, mặc định `searxng,tavily,anthropic` (bỏ `anthropic` = không bao giờ tiêu tiền cổng chính hãng cho tìm web) |
| `AGENT_TIM_WEB_LUOT_NGAY` | Không | Trần số lần `tim_web` qua cổng chính hãng / người / ngày (mặc định 40; admin không giới hạn) |
| `AGENT_TIM_WEB_MODEL` | Không | Model bộ tìm (mặc định `claude-haiku-5-5`) |

Sau khi đặt biến thì **tạo lại container** backend (xem CLAUDE.md mục env). Migration: `prisma/migrations/20261018000000_anthropic_chinh_hang` chỉ tạo bảng mới.

## 8. Kiểm

```bash
npx tsx --test src/services/agent/anthropicChinhHang/chinhHang.test.ts          # thuần (đã có trong npm test)
# CSDL test trống + máy chủ Anthropic GIẢ trên 127.0.0.1 (không bao giờ gọi API thật):
psql -d postgres -c "CREATE DATABASE ctw_anthropic_test"
DATABASE_URL=postgresql://<user>@localhost:5432/ctw_anthropic_test node scripts/db-test-tu-migration.mjs
WORK_DB_TEST=1 DATABASE_URL=postgresql://<user>@localhost:5432/ctw_anthropic_test \
  npx tsx --test src/services/agent/anthropicChinhHang/chinhHang.db.test.ts
```

Khi đang chạy test, nếu `ANTHROPIC_CHINH_HANG_BASE_URL` trỏ vào `*.anthropic.com` thì `gocChinhHang()` **ném lỗi**.

---

## 9. Phía client đã làm (18/10/2026) — và việc còn lại của CuongMini CLI

**Đã có trong lõi dùng chung** (`desktop/src/main/agent/loop.ts`, `desktop/src/main/ipc/agent.ts` — chạy cả trong app desktop lẫn `packages/cuongmini-core` cho VS Code/CLI):

- Vé `agentAnthropicVe` (thiết đặt, cạnh `agentDuPhongVe`) gửi thành `congAnthropicVe` ở MỌI lượt (chính + phụ) và ở `GET /agent/tools?congAnthropicVe=`. `CONG_ANTHROPIC_KHOA` (HTTP 403 hoặc khung `error`) ⇒ lõi tự xoá vé, phát sự kiện `loi` `ma:'CONG_ANTHROPIC_KHOA'` (kèm `daBat` khi máy chủ gửi).
- Kênh mới: `agent:moCongAnthropic {matKhau}` ⇒ `{ ten, hetHan }` (lỗi = câu của máy chủ); `agent:congAnthropic` ⇒ trạng thái `GET /agent/cong-anthropic` + `coVe`; `agent:datCongPhu {cuocId, cong:'modelapi'|null, model?}` (model `gpt-*` lưu như `agentDuPhongModel`).
- Khung `cong` `CONG_CHINH_HONG_FREE` ⇒ sự kiện `{loai:'loi', ma:'CONG_CHINH_HONG_FREE', thongDiep, moiNangCap, cacCong}`; tab giữ cổng phụ (`duPhongGiu:true`) và gửi **`congPhu:'anthropic'`** tường minh. ⚠️ Lý do: `congPhu` bỏ trống + `duPhongGiu` + vé dự phòng thật = "app cũ muốn modelapi" (`muonModelapi` trong `turn.ts`), nên im lặng là kéo người đang ở Free sang GPT tính phí giữa việc. Máy chủ coi mọi giá trị khác `'modelapi'` là Free — giữ nguyên hành vi đó.
- Khung `nghi` ⇒ sự kiện `{loai:'nghi'}`. `done.tienUsd` ưu tiên hơn `usage.costUsd` (cùng số).
- `khoiAnthropic` đi nguyên văn qua hội thoại, file phiên, mở lại, quay lui, tách nhánh; `/compact` chỉ bỏ nó khỏi THÂN gửi lên máy chủ tóm tắt (modelapi bỏ qua trường này), phần giữ nguyên gửi model vẫn mang. Kiểm: `desktop/src/main/agent/congChinhHang.test.ts`.
- Lượt phụ gửi `mucModelPhu`: tham số `model` của `giao_viec_phu` thắng khoá `model:` trong `.claude/agents/<loai>.md` (`agentPhu.ts › chuanHoaMucModelPhu/docModelDauFile`).
- PDF: model `cl-*` ⇒ PDF được nhắc trong câu hỏi (dòng "File tôi vừa đính kèm…" của app, `@duong.pdf` của VS Code/CLI) nằm TRONG thư mục dự án, ≤ 5,9MB, tối đa 4 ⇒ khối `{type:'file'}` gốc (`pdfGoc.ts`). Cổng khác: giữ đường `read_file` rút chữ. PDF gốc của lượt cũ (quá 2 câu hỏi) bị gỡ như ảnh cũ.
- Agent phụ phát `phuBatDau {phuId, kieuAgent, nhiemVu, model}` → `phuSuKien {phuId, e}` (mọi sự kiện con, kể cả `toolBatDau`/`tool`+`duongDan`/`chu`/`xong{tienUsd}`) → `phuXong {phuId, ok, tomTat, tienUsd, tokenVao, tokenRa}`. `tool` của `chay_lenh_nen` có thêm `lenh`. App desktop + extension hiện BỎ QUA ba loại `phu*`.

**App desktop** (`AgentMode.tsx`, `CongAnthropic.tsx`) và **extension VS Code 0.5.0** (`webview/main.ts`, cầu nối `/mo-cong-anthropic` + `KENH_DUOC`) đã có menu model theo cổng, ổ khoá, ô mật khẩu, thẻ mời.

**CuongMini CLI cần làm** (`packages/cuongmini-cli`, chỉ phần giao diện — kênh lõi đã sẵn, gọi bằng `loi.goi(...)` như các kênh `agent:*` khác):

1. Menu `/model`: nhóm theo `info.models[].cong` (`anthropic` ⇒ "Claude chính hãng", còn lại "Cổng chính"); KHÔNG đổi tên model `cong:'anthropic'` thành "Cuong …"; mục `canMoKhoa` hiện 🔒 — chọn vào thì hỏi mật khẩu (ô ẩn ký tự) ⇒ `loi.moCongAnthropic(matKhau)` (hoặc `goi('agent:moCongAnthropic', {matKhau})`) ⇒ `goi('agent:datModel', {model})` ⇒ `goi('agent:getInfo')` để làm mới ổ khoá. `dat:true` ⇒ hỏi xác nhận.
2. Sự kiện `loi` `CONG_CHINH_HONG_FREE`: in `thongDiep` (mức info, KHÔNG kết thúc lượt — lượt vẫn chạy) + lời mời từ `cacCong`: (a) Claude chính hãng: `canMatKhau` ⇒ hỏi mật khẩu như trên, rồi chọn model `cl-*` ⇒ `datModel` + `goi('agent:datCongPhu', {cuocId, cong:null})`; (b) modelapi: `canMatKhau` ⇒ `loi.moDuPhong(matKhau, token)`, rồi chọn model `gpt-*` ⇒ `goi('agent:datCongPhu', {cuocId, cong:'modelapi', model})`. `daBat:false` ⇒ "Quản trị chưa bật".
3. `CONG_ANTHROPIC_KHOA` ⇒ hỏi lại mật khẩu (vé đã bị lõi xoá) rồi gửi lại câu hỏi; `daBat:false` ⇒ báo "Quản trị chưa bật". `CONG_ANTHROPIC_HET_HAN_MUC` / `_HET_KEY` ⇒ in câu + mời mở modelapi (ô mật khẩu dự phòng). `CONG_ANTHROPIC_HONG` lõi đã tự thử lại 4 lần có chờ.
4. `{loai:'nghi'}` ⇒ dòng trạng thái "Đang suy nghĩ…" tới sự kiện kế tiếp.
5. `RAMBO_SONG_LAI` giữ như cũ (nút "quay về" ⇒ `agent:veCongChinh`, xoá luôn `congPhu` của tab).
