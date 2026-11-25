# Lời giải Chương 8 — Sửa lỗi trong code của người khác

Áp patch bằng `git am` lên bản lab của bạn (mã băm sẽ khác, nội dung giống).

| Thư mục | Áp lên | Nội dung |
|---|---|---|
| `java/ch8-quy-uoc/` | `legacy-thu-vien` nhánh `ch7` | 8.1 `.editorconfig` (mô tả quy ước đang có, không đổi tệp nào) — tạo ra gốc `744ec02` của các nhánh ticket |
| `java/tv-108/` | gốc trên | 8.2 bản sửa tối thiểu TV-108 (19/10 dòng, 50 test) |
| `java/format-aosp/` | `tv-108` | 8.2 PR định dạng máy sinh (google-java-format 1.27.0 `--aosp`, 2 lượt) — minh hoạ tách PR, KHÔNG merge |
| `java/tv-96/` | gốc trên | 8.5 TV-96 cookie (9/9 dòng, 49 test) |
| `java/tv-109/` | gốc trên | 8.5 TV-109 error.jsp CWE-209 + đảo kỳ vọng e2e (10/3 dòng) |
| `java/ch8-sau-merge/` | `ch8` sau khi merge 3 nhánh | 8.1 `tools/checkstyle-du-an.xml`, 8.3 mẫu PR + `tools/mo-ta-pr.sh`, 8.4 ADR 0001/0002 + ghi chú ReportServlet |
| `node/tv-98/` | `legacy-express` nhánh `ch7` | 8.5 TV-98 race (lib/tuan-tu.js sau review + 2 tệp test, 64/2 dòng, 24 test) |

Công cụ (`tools/`): `ai-biet.py` (bản đồ tri thức/hệ số xe buýt, 8.4), `anh-huong.sql` (phân tích ảnh hưởng dữ liệu TV-108, 8.3),
`gjf.sh` (google-java-format), `tuan-tu-v1.js` + `thu-nem.test.js` (tái hiện lượt review TV-98: `TUAN_TU=$PWD/tuan-tu-v1.js npx jest thu-nem.test.js`
— chép test vào `__tests__/` của legacy-express), `tao-trojan.py` (minh hoạ Trojan Source, 8.1).

Kết quả đã đo trên nhánh `ch8` (máy nhà Linux, 24/11/2026): 50 test JDK 17 xanh, e2e Testcontainers 3/3, golden master 3 trang giống hệt,
Checkstyle bộ luật dự án 0 vi phạm, legacy-express 24 test.
