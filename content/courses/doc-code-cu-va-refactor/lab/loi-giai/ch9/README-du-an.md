# Thư viện — quản lý mượn/trả sách (Servlet/JSP)

Ứng dụng web nội bộ của thư viện trường (từ 2016): sách, độc giả, mượn/trả, phí trễ hạn, báo cáo quá hạn.
Đi kèm một API Node riêng cho app mobile (repo `legacy-express`) — **luật mượn nằm ở CẢ HAI repo** (xem `docs/ban-do.md`).

| | |
|---|---|
| Ngôn ngữ / runtime | Java 21 (từ TV-121), Jakarta Servlet 6.0 / JSP 3.1, JDBC thuần (không ORM) |
| Máy chủ | Tomcat 10.1 (jakarta — WAR **không** chạy trên Tomcat 9) |
| CSDL | MySQL 8.0, một schema `thuvien` (dump: `db/thuvien.sql`) |
| Build | Maven 3.9 (`mvn -B package` ⇒ `target/thuvien.war`) |

## Chạy nhanh bằng Docker (chỉ cần Docker)
```bash
cp .env.example .env                                   # khoá cookie "Ghi nhớ" — để trống thì tính năng Ghi nhớ tắt
sed -i "s/^THUVIEN_REMEMBER_KEY=.*/THUVIEN_REMEMBER_KEY=$(openssl rand -hex 32)/" .env   # macOS: sed -i ''
docker compose up -d --build                           # MySQL 18306, web 18080 — lần đầu tải ảnh nền + thư viện Maven (lâu tuỳ mạng); máy đã có đệm: ~30 s
docker compose ps                                      # db: healthy, web: running
```
Mở <http://localhost:18080/thuvien> — tài khoản thử: `thuthu` / `123456` (thủ thư), `admin` / `admin123`.
Cổng 18080/18306 bận ⇒ sửa phần `ports:` trong `docker-compose.yml` (đừng commit).

## Chạy test
```bash
docker compose up -d db                                # test đơn vị dùng MySQL thật, nạp lại dữ liệu test trước mỗi test
DB_URL='jdbc:mysql://localhost:18306/thuvien?useUnicode=true&characterEncoding=UTF-8&useSSL=false&allowPublicKeyRetrieval=true' \
  mvn -B test                                          # cần JDK 21 (enforcer chặn JDK cũ hơn)
mvn -B -f e2e/pom.xml test                             # e2e qua HTTP: Testcontainers tự dựng MySQL + Tomcat (cần Docker)
B=http://localhost:18080/thuvien bash tools/golden.sh /tmp/gm && diff -r golden /tmp/gm   # golden master 3 trang — phải rỗng
```
Mốc sau sprint 9: xem mục "Mốc kiểm" cuối tệp. Đỏ ở máy bạn mà xanh ở mốc ⇒ xem "Lỗi hay gặp".

## Cấu hình
| Biến môi trường | Ý nghĩa | Mặc định |
|---|---|---|
| `DB_URL` | JDBC URL (ghi đè `db.url` trong `src/main/resources/db.properties`) | `jdbc:mysql://localhost:3306/thuvien…` |
| `THUVIEN_REMEMBER_KEY` | khoá HMAC cho cookie "Ghi nhớ" (≥ 32 ký tự). Đổi khoá = mọi người phải đăng nhập lại | trống ⇒ tắt "Ghi nhớ" |

Tài khoản CSDL của lab là `root/123456` — **chỉ cho lab**, máy chủ thật dùng tài khoản riêng.
Triển khai lên máy đã có CSDL cũ: chạy `db/migrations/V6_3__mat_khau_bam.sql` TRƯỚC khi thả WAR mới (cột mật khẩu đủ chỗ cho bản băm).

## Lỗi hay gặp
| Triệu chứng | Nguyên nhân | Cách xử lý |
|---|---|---|
| `Detected JDK version 17… is not in the allowed range [21,)` | máy dev còn JDK 17 | cài JDK 21, đặt `JAVA_HOME`; IDE: Project SDK = 21 |
| Mọi request 500, log `ClassNotFoundException: javax.servlet…` | thả WAR cũ (javax) vào Tomcat 10 | dùng WAR mới, hoặc tạm thả WAR cũ vào `webapps-javaee/` |
| Test đỏ hàng loạt `Communications link failure` | chưa chạy `docker compose up -d db` hoặc sai `DB_URL` | xem mục Chạy test |
| `Public Key Retrieval is not allowed` | MySQL 8 vừa khởi động lại | giữ `allowPublicKeyRetrieval=true` trong URL **của lab** |
| Nạp lại dump báo lỗi 1304 | dump không có `DROP PROCEDURE` | `tools/golden.sh` đã thêm dòng xoá trước khi nạp |
| Chữ Việt thành `?` khi nạp dữ liệu bằng tay | client `mysql` mặc định latin1 | thêm `--default-character-set=utf8mb4` |

## Bản đồ, quyết định, rủi ro
- `docs/ban-do.md` — sơ đồ hệ thống, 3 luồng chính, bảng chính, chỗ nguy hiểm (đọc 10 phút).
- `docs/adr/` — quyết định khó đảo ngược (phí trễ hạn, hàng đợi TV-98).
- `NANG-CAP.md` — các mốc nâng Java/Tomcat và việc của vận hành.
- `RUI-RO.md` — nợ kỹ thuật và rủi ro còn lại, đã xếp ưu tiên. **Đọc trước khi nhận ticket mới.**

## Quy trình đóng góp
Một ticket = một nhánh `tv-NNN` từ `main` = một PR < 200 dòng, mô tả theo `.github/pull_request_template.md` (nguyên nhân gốc · phạm vi ảnh hưởng · cách kiểm · rủi ro).
Theo `.editorconfig` và `tools/checkstyle-du-an.xml` (cổng chặn: 0 vi phạm). Không format lại cả tệp.
Commit: `loại(TV-NNN): mô tả không dấu` như lịch sử đang có.
