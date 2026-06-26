# Hướng dẫn bật GitHub Secret Scanning

## Bước 1: Truy cập Settings

Mở link sau (đã điền sẵn repo của bạn):

🔗 **https://github.com/cuonghoang1103/api-backend/settings/security_analysis**

Hoặc thủ công:
1. Vào https://github.com/cuonghoang1103/api-backend
2. Click tab **Settings** (góc phải, cạnh Insights)
3. Trong sidebar trái: **Code security and analysis**

## Bước 2: Bật Secret Scanning

Tại mục **Secret scanning**:

```
Secret scanning                                          [ Enable  ]  ← Click
├─ Push protection                                        [ Enable  ]  ← Click (khuyến nghị)
└─ All historical secrets                                 [ Enable  ]  ← Click (optional)
```

### Giải thích 3 tùy chọn:

| Tùy chọn | Tác dụng |
|---|---|
| **Secret scanning** | GitHub quét tất cả commits (kể cả history) + cảnh báo khi tìm thấy secret |
| **Push protection** | GitHub **CHẶN push** nếu phát hiện secret (bạn phải bypass manually) |
| **All historical secrets** | Quét lại toàn bộ git history (có thể mất 5-10 phút) |

## Bước 3: Verify đã bật

Sau khi enable, GitHub sẽ:
- Quét repo trong vài phút
- Gửi email nếu tìm thấy secret
- Hiển thị alerts trong tab **Security** → **Secret scanning**

## Bước 4: Xử lý alerts (nếu có)

GitHub có thể phát hiện **~5 secrets cũ** trong lịch sử của bạn:

1. Vào tab **Security** → **Secret scanning**
2. Mỗi alert có nút **Close as** → chọn lý do:
   - **Revoked** (nếu bạn đã rotate key)
   - **False positive** (nếu là false positive)
   - **Used in tests** (nếu chỉ là test/example)
3. Nếu secret thật → click **Revoke** để GitHub tự revoke (nếu provider hỗ trợ)

## Lợi ích

- **Tự động phát hiện** secrets thật trong code (không phải example)
- **Hỗ trợ revoke** tự động cho GitHub, AWS, Stripe, ...
- **Miễn phí** cho public repos (và cho private repos trong gói Advanced Security)
- **Hoạt động 24/7** — không cần bạn làm gì sau khi bật

## Screenshot hướng dẫn

```
┌──────────────────────────────────────────────────────────┐
│ Settings → Code security and analysis                    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  GitHub Advanced Security                               │
│  Code scanning                                           │
│  ┌────────────────────────────────────────────┐         │
│  │ CodeQL analysis         [ Enable ▶]        │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  Secret scanning                                         │
│  ┌────────────────────────────────────────────┐         │
│  │ Secret scanning       ✅ Enabled            │         │
│  │ Push protection      ❌ Disabled  [Enable]  │ ← Click│
│  └────────────────────────────────────────────┘         │
│                                                          │
│  Dependencies                                            │
│  ┌────────────────────────────────────────────┐         │
│  │ Dependabot alerts      [ Enable ▶]        │         │
│  │ Dependabot security    [ Enable ▶]        │ ← Bonus │
│  └────────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────────┘
```

## Note: Tại sao KHÔNG bật ngay được từ CLI?

GitHub Secret Scanning yêu cầu:
- Repository admin permission
- Xác thực qua GitHub UI (OAuth)
- Bạn phải tự bật trong Settings

Nếu bạn muốn tôi hướng dẫn từng bước qua teamviewer/screenshot, cho tôi biết.

## Lưu ý quan trọng

⚠️ **Nếu bạn bật "Push protection"**: lần push tiếp theo có thể bị chặn nếu commit hiện tại chứa secret cũ. Nếu xảy ra:

```bash
# Option 1: Bypass (nếu bạn đã rotate secret)
git push --no-verify

# Option 2: Dùng GitHub UI "Allow secret" trong alert
```

## So sánh với Pre-commit hook (Option 1)

| | Pre-commit hook | GitHub Secret Scanning |
|---|---|---|
| Chạy khi nào | Trước `git commit` (local) | Sau `git push` (server) |
| Phát hiện | Tất cả pattern defaults | Chỉ secrets đã verify với provider |
| Block hay warn | **Block** commit | Warn (hoặc block nếu bật push protection) |
| Bypass dễ không | `--no-verify` | Cần click trong GitHub UI |
| Chi phí | Free | Free (public), trả phí (private) |
| **Khuyến nghị** | ✅ Dùng cả 2 | ✅ Dùng cả 2 |

→ **Nên dùng CẢ HAI**: hook để chặn sớm, GitHub để backup layer.
