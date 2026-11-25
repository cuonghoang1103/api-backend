# Kho web (25/11/2026): thân các khoá giả đã thay bằng chỗ giữ chỗ (…GIA-VI-DU, ghp_GIAxxx…VIDU) để qua chốt gitleaks; chạy lại lab thì điền khoá giả ĐÚNG định dạng (ghp_ + 36 ký tự, sk_live_ + ≥10, AKIA + 16) — output đã ghi là của lượt chạy gốc.
# tao-log.py — sinh 3 tệp log "của đồng nghiệp" có cài sẵn bí mật GIẢ (không có giá trị thật nào) để luyện quét.
import json, os, random
os.makedirs("logs", exist_ok=True)
random.seed(16)
app = []
for i in range(400):
    app.append(json.dumps({"time": f"2026-11-23T08:{i//60:02d}:{i%60:02d}Z", "level": "info", "msg": "request completed", "url": f"/api/san-pham/{i}", "status": 200, "ms": random.randint(3, 90)}))
app[57]  = json.dumps({"time": "2026-11-23T08:00:57Z", "level": "debug", "msg": "gọi S3", "aws_access_key_id": "AKIA…GIA-VI-DU", "aws_secret_access_key": "q8Vt2LgZ16+GiaKhongThat0x/Rk3mPw9sYcN4bHf"}, ensure_ascii=False)
app[212] = json.dumps({"time": "2026-11-23T08:03:32Z", "level": "error", "msg": "Stripe lỗi", "key": "sk_live_xxxx…GIA-VI-DU"}, ensure_ascii=False)
app[301] = json.dumps({"time": "2026-11-23T08:05:01Z", "level": "info", "msg": "kéo mã nguồn", "remote": "https://ghp_GIAxxxxxxxxxxxxxxxxxxxxxxxxxxxVIDU@github.com/cty/du-an.git"}, ensure_ascii=False)
open("logs/app.log", "w").write("\n".join(app) + "\n")
web = [f'10.0.0.{i%50} - - [23/Nov/2026:08:{i//60:02d}:{i%60:02d} +0700] "GET /san-pham?trang={i%9} HTTP/1.1" 200 512 "-" "Mozilla/5.0"' for i in range(300)]
web[120] = '10.0.0.20 - - [23/Nov/2026:08:02:00 +0700] "GET /api/me?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1XzQyIiwibmFtZSI6IkdJQSJ9.dGhpcy1pcy1hLWZha2Utc2lnbmF0dXJlLWxnejE2 HTTP/1.1" 200 88 "-" "Mozilla/5.0"'
open("logs/access.log", "w").write("\n".join(web) + "\n")
ho = ["2026-11-23 08:10:00 INFO  dang-ky - khách mới: Nguyễn Văn An, CCCD 001203016789, thẻ 4111 1111 1111 1111",
      "2026-11-23 08:10:01 INFO  dang-ky - xác nhận đơn 8812 cho u_42"]
open("logs/dang-ky.log", "w").write("\n".join(ho) + "\n")
