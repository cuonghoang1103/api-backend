# HỢP ĐỒNG SOẠN KHOÁ TỰ SOẠN — môn trường KHÔNG công bố syllabus trên FLM

Đọc hết trước khi viết. Bạn soạn TRỌN khung một môn Academy cho cuongthai.com — sinh viên FPTU học thật.
Môn này **không có syllabus trên FLM** (đã dò mã, mã biến thể và tên ngày 09/11/2026). Vì vậy bạn TỰ dựng
khung chương ↔ bài theo **giáo trình chuẩn quốc tế** của đúng môn đó, và nói thẳng với sinh viên điều này.

Repo: `/Users/admin/Downloads/api-backend` · File môn (CHỈ ĐỌC, KHÔNG SỬA): `content/academy/<MÃ>.mjs`

⚠️ Nhiều agent chạy CÙNG LÚC: mọi file nháp (phần bài, script kiểm, venv, danh sách link) để trong thư mục RIÊNG
`$TMPDIR/<mã-thường>-nhap/` — KHÔNG dùng thư mục scratchpad chung (đã có agent bị ghi đè `parts/`, `links1.txt`).

## 1. Nộp gì

MỘT file `content/academy/_tu-soan/<MÃ>.mjs` — ghép vào môn lúc seed bằng `scripts/lib/academy-muc0-flm.mjs`
(đứng sau khối mở đầu sẵn có, trước các chương cũ). File môn gốc và bài cũ GIỮ NGUYÊN (không cắt, không sửa).

```js
// Khoá TỰ SOẠN cho <MÃ> — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
export default [
  { title: 'Section 0 — Course framework (self-authored, no FLM syllabus)|||Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
    description: '…', lessons: [ /* 0.1, 0.2 */ ] },
  { title: 'Chapter 1 — …|||Chương 1 — …', description: '…', lessons: [ /* bài 1.1 … + quiz chương */ ] },
  // … 8–12 chương …
];
```

Mỗi bài: `{ title, slug, type: 'DOCUMENT', description, content }`. Quiz: `{ title, slug, type: 'QUIZ', description,
quiz: { timeLimitSeconds, questions: [{ id, question, options:[4], correctIndex, points:1, explanation }] } }`.

## 2. Nội dung bắt buộc

**Mục 0 (2 bài):**
- 0.1 Giới thiệu môn: môn học gì, để làm gì (đi làm/đồ án), học xong làm được gì (6–8 chuẩn đầu ra tự soạn),
  môn liên quan trong khung FPTU (tiên quyết/học tiếp nếu biết chắc), và **khung ⚠️ nói rõ**: "Trường chưa công bố
  syllabus của <MÃ> trên FLM — khung này soạn theo giáo trình chuẩn; cách tính điểm/lịch thi theo giảng viên".
- 0.2 Giáo trình & tài liệu: 2–4 sách CHUẨN có thật (tác giả · NXB · năm · lần xuất bản · **ISBN có thật**), khoá học
  mở uy tín (MIT OCW, Coursera, edX, Khan Academy, tài liệu chính thức…). Mọi link phải **mở được** (xem §4).

**8–12 chương**, mỗi chương 3–5 bài + **1 quiz 8–10 câu** cuối chương. Mỗi bài (cả hai thứ tiếng):
1. Mục tiêu bài (2–4 gạch).
2. **Bài giảng**: khái niệm chính giải thích dễ hiểu, ví dụ cụ thể (toán/kỹ thuật: ví dụ giải từng bước; ngôn ngữ:
   từ vựng + mẫu câu + hội thoại; kinh tế/kinh doanh: tình huống thật), lỗi hay gặp.
3. **📌 Tóm tắt** 3–6 ý.
4. **🔗 Học thêm**: 2–4 link NGOÀI chất lượng, đúng chủ đề bài (đã kiểm mở được).
5. **🧪 Tự luyện**: 2–3 câu hỏi/bài tập ngắn, có đáp án trong `<div class="dap-an">`.
Độ dài: mỗi thứ tiếng ~500–900 chữ/bài — đủ để HỌC ĐƯỢC, không lan man.

## 3. Luật cứng (vi phạm là seed chết hoặc trang hỏng)

1. `title` song ngữ `EN|||VI` (tiếng Anh trước). **Mỗi nửa ≤ 120 ký tự** (cột DB 255).
2. `content` song ngữ đúng khuôn: `<div class="ml-en">…HTML tiếng Anh…</div>\n<div class="ml-vi">…HTML tiếng Việt…</div>`.
   Quiz: MỌI chuỗi `question`/`options[i]`/`explanation` dạng `EN|||VI`. `description` chỉ tiếng Việt.
3. **slug**: `<mã-thường>-ts-<chương>-<bài>` (vd `cal111-ts-3-2`), quiz `<mã-thường>-ts-quiz-<chương>`, Mục 0
   `<mã-thường>-ts-0-1`, `-ts-0-2`. Duy nhất, ≤ 80 ký tự, không trùng slug có sẵn trong file môn.
4. Viết bằng chuỗi thường hoặc template literal NHƯNG **không `${`** và không backtick lồng.
5. HTML phải escape `<` `>` `&` trong code/công thức (`a &lt; b`). Không `<script>`, `<style>`, `style=`, không màu inline.
6. **Công thức: KHÔNG LaTeX** (web không render). Dùng HTML: `x<sup>2</sup>`, `a<sub>n</sub>`, ký hiệu Unicode
   (∫ ∑ √ ≤ ≥ ≠ π ∞ → ∈ θ Δ), khối nổi bật `<div class="formula"><span class="lbl">Tên</span>…</div>` (xem mẫu MAE101.mjs).
7. Code (nếu có): `<pre><code class="language-python">…</code></pre>` — PHẢI chạy thật, dán output thật vào
   `<div class="out">…</div>`. Ngôn ngữ khác: `language-java`, `language-sql`, `language-cpp`, `language-js`.
8. Lớp CSS dùng được: `eyebrow lead nhan note-ct ghi-chu callout pitfall meo formula dap-an kv-grid kv k v out`.

## 4. Link ngoài & sách — KHÔNG BỊA

- Mỗi link đưa vào phải được bạn **mở thử** (WebFetch) và trả nội dung đúng chủ đề. Không mở được ⇒ bỏ.
- Ưu tiên: tài liệu chính thức, MIT OCW, Khan Academy, OpenStax (sách mở), Coursera/edX (trang khoá), kênh YouTube
  chính chủ của trường/tổ chức uy tín (link video cụ thể đã mở được). Không link tải lậu, không link rút gọn.
- ISBN: chỉ ghi ISBN bạn đã thấy trên trang NXB/thư viện/Google Books. Không chắc ⇒ ghi sách không kèm ISBN.

## 5. Tự kiểm trước khi nộp

```bash
node scripts/academy-kiem-tu-soan.mjs --ma <MÃ>      # PHẢI ✓ (title, slug, khuôn song ngữ, quiz, link, LaTeX…)
node scripts/academy-seed-course.mjs --file ./content/academy/<MÃ>.mjs --dry   # phải chạy hết, không lỗi
```

## 6. Báo cáo cuối (ngắn)

Số chương / bài / quiz · sách chính (kèm ISBN) · số link ngoài đã kiểm · phần nào chưa chắc (nói thẳng).
KHÔNG commit, KHÔNG deploy — người điều phối gom và kiểm.
