# Lời giải Chương 3 — Dựng lưới an toàn (soạn 24/11/2026)

Chép đè lên repo lab rồi chạy. Mọi output trong bài 3.1–3.5 sinh ra từ đúng các tệp này.

## legacy-thu-vien/
- `pom.xml` — thêm JUnit 5.11.4 + vintage + Mockito 4.11 + ApprovalTests 32.2.0 + plugin PIT 1.17.4 (Java 8 vẫn chạy được).
- `src/test/resources/du-lieu-test.sql` + `src/test/java/.../testutil/DuLieuTest.java` — fixture ngày cố định (available = quantity, để trigger tự trừ).
- `BookServletMuonSachTest` (13 test, gồm 3 test diệt đột biến sống ở Lab 3.5), `TokenUtilDacTaTest`, `ExportServletDacTaTest` + `.approved.txt`.
- `BookServletTraSachTest` — CẦN seam `bayGio()` (xem `seam/seam-baygio-wrap-xuat.diff`), không chạy được trên mã gốc.
- `seam/` — diff seam bayGio + wrap TV-91 + factory method ExportServlet; `sprout-tv90.diff` (demo, làm đỏ đúng 3 test đặc tả).
- `tools/golden.sh` + `golden/` — golden master HTML qua HTTP.
- `e2e/` — module Maven RIÊNG, Java 17 + Testcontainers 2.0.5: `cd e2e && mvn test` (chỉ cần Docker + JDK 17).

Chạy test Java 8:
```bash
docker compose up -d
export DB_URL="jdbc:mysql://localhost:18306/thuvien?useUnicode=true&characterEncoding=UTF-8&useSSL=false&allowPublicKeyRetrieval=true"
mvn -B test                                         # cảnh báo: ghi đè dữ liệu lab
mvn -B test-compile org.pitest:pitest-maven:mutationCoverage -DoutputFormats=XML,HTML
```

## legacy-express/
`__tests__/` — characterization (supertest), snapshot quá hạn, seam `jest.mock` (kho giả + kho thật).
`npm install && npx jest` trên Node 14 (`.nvmrc`).
