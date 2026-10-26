# Lab CT Shop — khuôn cho Lab 3–9 (khoá /courses/postgresql)

Lab 1 (`lab-1.mjs`, sau Ch3) và Lab 2 (`lab-2.mjs`, sau Ch4) là mẫu. Một lab = **1 bài web + tệp tải về + 1 deck slide + 1–2 tập video**.
Quy trình từng bước theo `~/Documents/video-bai-giang/_PROMPT-AGENT-PG.md`; chỉ khác những điểm dưới đây.

## 1. Dữ liệu
- Lược đồ chuẩn `sql/ctshop-schema.sql` (schema `shop`, 8 bảng) + dữ liệu tất định `sql/ctshop-data.sql` (`setseed`) — **không đổi lược đồ**.
  Con số đếm chuẩn ghi ở đầu `ctshop-data.sql`; sửa dữ liệu ⇒ đo lại và ghi lại ở đó.
- Lab ≥ 3 **bắt đầu sạch**: `lab<N>-start.sql` = schema + data chuẩn (không phụ thuộc lab trước đã sửa gì).
- Chạy thật trên container `pgcourse17`, DB nháp riêng (vd `ctlab`), luôn `SET TimeZone = 'Asia/Ho_Chi_Minh'` (ảnh Docker mặc định UTC).
- Output cho người học so: chạy tệp bằng `psql -f` qua TTY (stdout/stderr đúng thứ tự, có `psql:/tmp/<tệp>:<dòng>:` trước lỗi) —
  thêm `\pset pager off` đầu tệp. Mỗi con số trong bài phải lấy từ output thật.

- Tên container: bài 0.3 dạy `pg17`, còn lệnh các lab viết `pgdemo`. Mỗi lab dùng `pgdemo` PHẢI có callout ở mục 3 (Tệp tải về): "`pgdemo` = container PostgreSQL 17 của bạn; dựng theo 0.3 thì tên `pg17` — thay tên hoặc `docker rename pg17 pgdemo`" (EN + VI). Lab 8 dùng `pglab8-*` tự dựng nên không cần.

## 2. Bài web — `lab/lab-N.mjs`
- `export default { title: 'Lab N — CT Shop: …|||Lab N — CT Shop: …', slug: 'postgresql-lab-N-<ten-khong-dau>', type: 'LESSON', description, content }`.
- `content = \`${G}${EN}${VI}\``: `G` = giảng slide (`giang/pg-lab-N.mjs`, `walkPg('pg-lab-N', …)`), rồi khối `ml-en` và `ml-vi` cùng bố cục:
  1 Đề bài (bối cảnh CT Shop như việc thật) · 2 Yêu cầu đánh số + **tiêu chí đạt** (callout ok, con số kiểm được) · 3 Tệp tải về (link-card) + lệnh chuẩn bị ·
  4 Hướng dẫn từng bước (việc phải làm, gợi ý, **đáp án trong `<details>`**, output thật trong `<div class="out">`) · 5 Đáp án đầy đủ (`<details>`) ·
  6 Bẫy (`.pitfall`, có output thật) · 7 Tự kiểm (truy vấn + con số + 3 câu, đáp án `<details>`) · 8 Nối sang lab sau.
- Mã SQL/output nhét qua hàm `code()` / `out()` (tự `esc` `< > &`); output dài thì **sinh từ tệp output thật** bằng script (như CHK của Lab 1, O của Lab 2), không gõ tay.
- Chỉ dùng kiến thức tới chương mà lab đứng sau; công cụ mới thật cần (vd `\copy`, `EXCLUDED`) thì giảng ngắn ngay trong lab.
- Kiểm: `node scripts/course-content-check.mjs ./content/courses/postgresql.mjs` ⇒ 0 lỗi (bộ kiểm KHÔNG soi nguồn lab-N.mjs — tự soát `\` và backtick).

## 3. Nối vào khoá — `lab/index.mjs`
```js
import lab3 from './lab-3.mjs';
export const LAB_SAU = { 3: [lab1], 4: [lab2], 6: [lab3] };   // chương: [bài lab] — chèn sau bài học, trước *-quiz
```
Không sửa tệp chương sNN, không sửa manifest `postgresql.mjs`.

## 4. Tệp tải về
- Đặt ở `lab/sql/`: `labN-start.sql` (khởi đầu, có TODO), `labN-solution.sql` (đáp án, chú thích con số thật), thêm `labN-check.sql` / `labN-*.csv` nếu cần.
- Upload R2 key `PG/labs/v1/<tên>` ⇒ `https://media.cuongthai.com/files/academy/PG/labs/v1/<tên>` (kiểm `curl -sI` 200).
  Upload thẳng: `node --env-file=.env scripts/upload-academy-file.mjs --file content/courses/postgresql/lab/sql/<tên> --key PG/labs/v1/<tên>` — script NAY nhận `.sql`/`.csv`
  (commit 4b1c17368; content-type `text/plain`/`text/csv; charset=utf-8`). Lab 1–2 từng dùng bản sao trong scratchpad trước khi script được sửa.
- Sửa tệp sau khi đã upload ⇒ key **v2** (Cloudflare giữ bytes cũ) và đổi `F` trong lab-N.mjs.

## 5. Slide — `scripts/slides-src/pg-lab-N.mjs`
- Khuôn `_pg-chung.mjs`: `lamDeck({ chuong: 'Lab N · CT Shop', bai: '' }, [...])`, deck key `pg-lab-N`, prefix R2 `PG/v1`. ERD/hình dùng chung: `pg-lab-hinh.mjs`.
- `two(a, b)` là lưới 2 ô: mỗi bên phải là **một** phần tử — gói nhiều khối bằng `col(...)` (xem pg-lab-1.mjs), nếu không bố cục vỡ.
- Dòng psql dài > ~120 ký tự ở `sm`: bẻ lệnh bằng dấu nhắc tiếp `ctshop-#` hoặc ghi rõ "(wrapped)" trên tiêu đề khung; không bịa output.
- Render + xem tấm ghép từng slide, upload, đo toạ độ (`_pg-do-toa-do.mjs`).

## 6. Video — `~/Documents/video-bai-giang/src/bai/pg-lab-N[-2]/`
- `CHUONG = CHUONG_PG[<chương lab đứng sau>]`, `BAI.so = 'Lab N'` / `'Lab Nb'`, `BAI.slug = '<NN>-5x-lab-N-…'` (số 50+ để khỏi đụng tập chương), `slugWeb` = slug bài web.
- Tập > 10′ giả ⇒ tách `-2` (slide giữ số gốc). Mỗi tập ≥ 2 mô phỏng động; dùng `src/khung/pg/clab-hinh.tsx` (ErdShop, TheL, HangDong) + `dbi/hinh` (PsqlDbi).
- Output thật lưu `src/khung/pg/that/pg-lab-N.sql|.out.txt`. Soát still ⇒ thêm id vào `scratchpad/hang-giong.txt` + `tu-dong-sau-giong.txt`.

## 7. Commit
Index riêng `.git/idx-lab` (hoặc idx-labN), chỉ add tệp của lab: `lab/*`, `giang/pg-lab-*`, `scripts/slides-src/pg-lab-*`. Không push, không deploy.
