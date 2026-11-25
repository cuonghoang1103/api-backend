# Lời giải Chương 5 — Refactor theo từng bước nhỏ (soạn 24/11/2026)

Mọi output trong bài 5.1–5.6 sinh ra từ đúng các bản vá này. Mỗi tệp `.patch` = MỘT commit, test xanh sau từng commit.

## Điểm xuất phát
- `legacy-thu-vien`: repo sau lời giải Chương 3 (test JUnit 5 + Mockito + fixture) và Chương 4 (`pom-ch4.xml`, `tools/smell-pmd.xml`,
  `tools/do-phuc-tap.xml`). Commit đầu của chuỗi (`seam: bayGio()`) đưa seam + `BookServletTraSachTest` của Ch3 vào nhánh chính.
- `legacy-express`: repo gốc (commit `df6b894 api muon sach cho app mobile`) + 8 test Ch3 trong `__tests__/`.

Áp: `git am loi-giai/ch5/legacy-thu-vien/ch5/*.patch` (tương tự cho legacy-express). Nhánh phụ áp trên ch5:
`ch5-tv41/` (sửa lỗi TV-41 — thay đổi hành vi, PR riêng), `ch5-ncs/` (tính năng TV-95 sau khi đã dọn đường).

## legacy-thu-vien/ch5 — 18 commit (21 → 33 test)
5.1 Slide Statements · Extract Function ×4 · Rename Variable · Replace Magic Literal + Split Variable
5.2 test cookie (7) · Guard Clauses · gom 3 switch · enum `LoaiDocGia` (Replace Conditional with Polymorphism) · Inline Function
5.3 Extract Class `PhieuMuonDAO` (2 bước) · Introduce Parameter Object `KhoangMuon` · Move Function vào `PhieuCanTra` ·
    Extract Class `MuonTraService` · test service với DAO giả · Move Statements: SQL khỏi `header.jsp` → `ThongKeDAO`
5.4 Replace Primitive with Object `Tien` (giữ cách in "18000.0")

Chạy: `docker compose up -d db` rồi `mvn -B test`. Kiểm từng commit:
`for c in $(git rev-list --reverse ch4..ch5); do git checkout -q $c; mvn -B -o -q test || break; done`

## legacy-express/ch5 — 11 commit (16 → 21 test)
test POST /api/muon (8) + `jest --runInBand` · Extract Function ×2 bằng TypeScript language service · Rename · Separate Query ·
bỏ tham số chết · bảng luật `lib/luat.js` (3 commit) · Move Function `kho.ghi` · `lib/so-phieu.js` (Encapsulate Collection)

## tools/
- `ts-sua.mjs` — gọi TypeScript Language Service (bộ máy refactor của VS Code) không cần giao diện: `liet-ke`, `tach`, `doi-ten`, `bo-tham-so`.
  Cần gói `typescript` (5.x): `TS_PATH=$(npm root -g)/typescript node ts-sua.mjs routes/muon.js liet-ke 31 34`.
- `tcr.sh` — test && commit || revert.
- `phuc-tap.py` — bảng cyclomatic/cognitive từ `target/pmd.xml` (chạy `mvn pmd:pmd -Dpmd.boLuat=tools/do-phuc-tap.xml` trước).

## Cố ý CHƯA sửa (để dành chương sau)
SQL nối chuỗi trong `PhieuMuonDAO` (6.3) · `>` của TV-41 trên nhánh chính (nhánh `ch5-tv41`) · Node `Math.ceil` ≠ Java ·
`==` trong Node (đổi sang `===` làm đỏ test "docGia dạng chuỗi") · race ghi `data/phieu.json` (ticket ở 8.5 — test tái hiện trong bài 5.5) ·
mojibake menu `header.jsp` (golden master khoá nguyên) · cách in phí "18000.0" (ticket TV-97).
