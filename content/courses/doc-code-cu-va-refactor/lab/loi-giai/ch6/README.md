# Lời giải Chương 6 — Code chết, thư viện cũ và nợ bảo mật

Áp lên trạng thái sau Chương 5 (nhánh `ch5` của bạn, hoặc master + các patch `loi-giai/ch5/`):

```bash
cd legacy-thu-vien && git switch -c ch6 && git am ../loi-giai/ch6/java/*.patch     # 12 commit, 33 → 49 test
cd ../legacy-express && git switch -c ch6 && git am ../loi-giai/ch6/node/*.patch    # 1 commit, 21 test
```

| Patch | Bài | Nội dung |
|---|---|---|
| java/0001 | 6.1 | Xoá ExportServlet (TV-103) + test đặc tả + khối web.xml đã comment + `Constants.EXPORT_DIR` |
| java/0002–0003 | 6.4 | Xoá `BookDAO.findById`, hằng không dùng; gỡ `xoaSach` (TV-104) + test khoá hành vi mới |
| java/0004–0008 | 6.3 | TV-102 (PreparedStatement mượn/trả), CWE-209, XSS books.jsp, TV-105 đăng nhập + PBKDF2, công cụ `BamMatKhauCu` |
| java/0009 | 6.4 | Injection còn lại: tìm sách, thêm sách, thêm/xoá độc giả; thoát HTML readers.jsp + header.jsp |
| java/0010–0012 | 6.4 | log4j 1.2.17 → reload4j 1.2.27; Connector/J 5.1.49 → 9.7.0 → 26.10.0 |
| node/0001 | 6.2 | express 4.17.1 → 4.22.3, moment 2.24.0 → 2.31.0 |

Trước khi triển khai bản 0007: chạy `db/migrations/V6_3__mat_khau_bam.sql`, rồi `tools/chay-bam.sh` (băm một lượt).

Công cụ (`tools/`): `mot-ngay.sh` (giả lập một ngày dùng ứng dụng), `compose.jacoco.yml` (JaCoCo agent trong Tomcat),
`export-chet.js` (export/tệp JS không ai dùng — bản đơn giản để đọc hiểu), `chay-bam.sh` (migration + băm một lượt).
`tan-cong.sh` — tấn công CHÍNH bản lab trên máy bạn, chạy trước và sau khi vá. Chỉ dùng trên máy của mình.

Còn lại có chủ đích: cookie "ghi nhớ" giả được (TV-96, Chương 8), dò tên đăng nhập qua thời gian phản hồi (thử thách thêm 6.4),
race ghi `data/phieu.json` (TV-98, lab 8.5), Jest 26 + 47 lỗ hổng ở devDependencies (Chương 7).
