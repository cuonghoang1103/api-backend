# Lời giải Chương 4 — Code smell (soạn 24/11/2026)

| Tệp | Dùng ở | Ghi chú |
|---|---|---|
| `pom-ch4.xml` | 4.1–4.5 | POM của `legacy-thu-vien` sau Chương 3 + `maven-pmd-plugin` 3.26.0 (PMD 7.7.0), thuộc tính `pmd.boLuat` |
| `smell-pmd.xml` | 4.1–4.3 | đặt vào `tools/` của repo; `mvn -B pmd:check` ⇒ 12 vi phạm; `mvn -B pmd:cpd-check -DminimumTokens=60` ⇒ 2 bản chép |
| `do-phuc-tap.xml` | 4.2, 4.5 | ngưỡng 1 ⇒ in độ phức tạp mọi hàm/lớp: `mvn -B -q pmd:pmd -Dpmd.boLuat=tools/do-phuc-tap.xml -Dformat=xml` |
| `diem-nong.py` | 4.5 | chạy trong thư mục repo sau lệnh trên: `python3 diem-nong.py master` ⇒ BookServlet 150 điểm |
| `eslintrc-smell.json` | 4.4 | đổi tên thành `.eslintrc.json` trong `legacy-express`; cần `npm i -D eslint@8.57.1 jscpd@3.5.10` trên Node 14 ⇒ 36 cảnh báo |

Thí nghiệm "tách vội" (4.1): nhánh `ch4-tach-voi` — chỉ có trong repo làm việc của người soạn; tự làm lại theo mô tả trong bài.
Thí nghiệm ghi đồng thời (4.2): chạy trên BẢN SAO `legacy-express` (route `POST /api/muon` ghi đè `data/phieu.json`); tệp zip không kèm git ⇒ `git init && git add -A && git commit -qm goc` trước, khôi phục bằng `git checkout data/`.
