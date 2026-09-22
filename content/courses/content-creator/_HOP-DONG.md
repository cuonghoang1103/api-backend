# Hợp đồng soạn bài — khoá "Content Creator: Quay, Dựng & Đăng Video"

> Đọc HẾT file này trước khi viết một dòng nào. Mọi chương của khoá được nhiều
> phiên/agent soạn song song; file này là thứ giữ cho 28 phần trông như do MỘT
> người viết. Chỗ nào file này không nói, bắt chước `s00-gioi-thieu.mjs` (bài mẫu
> do người điều phối viết) và bộ slide `scripts/slides-src/cr-00.mjs`.

Khoá nằm trong **/courses** của cuongthai.com (khoá GENERAL, không thuộc Academy).
Manifest: `content/courses/content-creator.mjs` · mỗi chương một file
`content/courses/content-creator/sNN-<ten>.mjs` · slide: `scripts/slides-src/cr-NN.mjs`.

---

## 1. Người học là ai (viết cho ĐÚNG người này)

- **Cường** — sinh viên CNTT FPTU, lập trình viên web (tự dựng cuongthai.com bằng Next.js + Node.js).
  Rành máy tính, terminal, script — nên được phép đưa lệnh `ffmpeg`/bash khi hữu ích.
- **Mới hoàn toàn về làm video.** Chưa biết quay, lên ý tưởng, viết kịch bản, phân cảnh, dựng, chỉnh màu.
- **Yếu tiếng Anh.** Mọi thuật ngữ tiếng Anh phải có nghĩa tiếng Việt NGAY cạnh lần đầu xuất hiện:
  "shutter speed (tốc độ màn trập)", "B-roll (cảnh phụ minh hoạ)". Mỗi bài có một ô **Thuật ngữ** (xem mục 4).
- **Thói quen hỏng cần sửa:** bật Pocket 3 quay một lèo 20–30 phút rồi về mới cắt, vì không biết phân cảnh →
  **tràn thẻ nhớ**, mất hàng giờ tua tìm đoạn hay. Chương nào chạm được tới vấn đề này thì nối lại với nó.
- **Đồ nghề đang có — ví dụ phải dùng đúng các máy này, đừng khuyên mua máy ảnh mới:**
  | Thiết bị | Vai trò chính trong khoá |
  |---|---|
  | **DJI Osmo Pocket 3** | vlog, quay ngoài đường, B-roll, talking head gọn nhẹ |
  | **iPhone 16 Pro Max** | máy A/B, quay 4K/ProRes Log, ảnh thumbnail 48MP, webcam cho Mac (Continuity Camera) |
  | **iPad Pro M5** | vẽ storyboard bằng Pencil, teleprompter, màn hình phụ, dựng trên iPad (CapCut / DaVinci Resolve for iPad) |
  | **Mac M1 Max** | trạm dựng chính (DaVinci Resolve, CapCut, Final Cut Pro nếu muốn) |
  | **Máy Linux ở nhà (có GPU)** | máy phụ: sao lưu, chuyển mã bằng ffmpeg, chạy Whisper làm phụ đề, DaVinci Resolve bản Linux (lưu ý giới hạn codec) |
- **Mục tiêu:** đăng YouTube · TikTok · Facebook · Instagram để **xây thương hiệu cá nhân** và **kéo người về
  cuongthai.com**. Làm video **cả tiếng Việt lẫn tiếng Anh** tuỳ video. Ba loại chính: **video giảng dạy**
  (lập trình/học tập), **vlog**, **nội dung creator** (video ngắn, chia sẻ hành trình).
- **Công cụ riêng đã có trên web của Cường** — dùng nó trong phần thực hành khi hợp:
  `/creator` (Xưởng nội dung, chỉ admin): `/creator/ideas` kho ý tưởng · `/creator/calendar` lịch đăng ·
  `/creator/pipeline` bảng tiến độ · `/creator/projects` dự án có **tab Kịch bản** (9 mẫu dựng sẵn:
  Bài giảng 15', Chữa đề, Chữa bài tập, Làm dự án, Hướng dẫn công cụ, **Vlog kể chuyện**, Code review,
  **Video ngắn — một ý duy nhất**, Livestream), **lưu phiên bản kịch bản**, và **Teleprompter** (phím Space/R/F/↑↓).
  Khoá học trên web có **3 luồng video mỗi bài: VI / EN (tự quay) và YT** — chương bài giảng sẽ dạy đưa video lên đó.

## 2. Giọng văn & chiều sâu

- Viết như một người thầy làm nghề thật, nói chuyện với một người bạn thông minh nhưng chưa biết gì về video.
  **Dẫn "vì sao" TRƯỚC "làm thế nào"**. Ví von đời thường. Không sáo rỗng ("Trong thế giới ngày nay…",
  "Hãy cùng khám phá…"). Không tâng bốc.
- **Cụ thể đến mức làm theo được:** con số thật (fps, 1/50s, −12 dBFS, −14 LUFS, 1920×1080…), tên menu thật,
  thứ tự bấm thật. "Chỉnh cho hợp lý" là câu vô dụng.
- **Nói thẳng khi nào KHÔNG nên** (vd: không quay D-Log M nếu không định chỉnh màu; không cần 4K120 cho talking head).
- **Sai lầm thật của người mới** → khối `.pitfall`. Mỗi bài ≥ 1.
- Tiếng Việt tự nhiên, có dấu đầy đủ. Vế tiếng Anh là bản song song ĐẦY ĐỦ ý (không phải tóm tắt), câu ngắn, rõ.

## 3. Độ chính xác — luật cứng

1. **Thông số thiết bị, giới hạn nền tảng, giá, điều kiện kiếm tiền… phải kiểm từ nguồn chính thức** bằng
   WebSearch/WebFetch trước khi viết: dji.com, support.apple.com, apple.com, blackmagicdesign.com,
   support.google.com/youtube, blog.youtube, creators.youtube.com, capcut.com, support.tiktok.com,
   newsroom.tiktok.com, help.instagram.com, facebook.com/business, about.fb.com… Không kiểm được thì
   **không viết con số**, hoặc viết kèm "tuỳ firmware/phiên bản — kiểm lại trong app".
2. Thứ hay đổi (giá, ngưỡng kiếm tiền, độ dài tối đa của Shorts…) ghi rõ mốc: **"(tính đến 09/2026)"**.
3. **Mọi lệnh shell/ffmpeg in trong bài phải CHẠY THẬT** trên máy này (có `/opt/homebrew/bin/ffmpeg`, `ffprobe`)
   với một clip thử tự sinh (`ffmpeg -f lavfi -i testsrc2=size=1920x1080:rate=25 -t 3 …`). Output in trong bài
   là output thật. Làm trong thư mục scratch, không để file rác trong repo.
4. **Mọi URL phải GET thật** (theo redirect, user-agent trình duyệt) → 200 (403 do Cloudflare coi là sống).
   27% link do model tự nhớ là link chết — ưu tiên trang gốc/URL ngắn. **Thà ít link còn hơn link sai.**
5. Không bịa trích dẫn, không bịa số liệu nghiên cứu. Có nguồn thì nêu nguồn trong câu ("theo YouTube Help…").

## 4. Cấu trúc MỘT chương (một file `sNN-*.mjs`)

```js
/**
 * Content Creator — Chương N: <tên>. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 */
import { gallery, slide } from './_slides.mjs';

export default {
  title: 'Chapter N — <English>|||Chương N — <Tiếng Việt>',
  description: '<1–2 câu tiếng Việt: chương này giải quyết vấn đề gì của người học>',
  lessons: [ /* N.0 slide · N.1–N.4 bài dạy · N.5 kiểm tra */ ],
};
```

| Bài | slug | type | Nội dung |
|---|---|---|---|
| N.0 | `cr-NN-0-slides` | `DOCUMENT` | Bộ slide của chương: khối `.ml-en` + khối `.ml-vi` (mỗi khối 2 đoạn dẫn), rồi **MỘT** lần `gallery('cr-NN', [[1,'Bìa'],…])` đặt SAU hai khối, NGOÀI khối ngôn ngữ (nội dung ngoài `.ml-*` hiện cho cả hai ngôn ngữ) — liệt kê **đủ mọi slide** |
| N.1–N.4 | theo bảng mục 9 | `VIDEO` | Bài dạy chính (video YT gắn sau bằng file map riêng — KHÔNG tự thêm `video:`) |
| N.5 | `cr-NN-5-quiz` | `QUIZ` | `content` = tóm tắt chương + checklist tự kiểm; `quiz` 10 câu |

Mọi bài: `isFreePreview: true`. `title` dạng `'N.M — English|||N.M — Tiếng Việt'`, **cả chuỗi ≤ 180 ký tự**
(cột VarChar(255) — vượt là seed chết giữa chừng mà deploy vẫn báo xanh). `description` 1 câu tiếng Việt.

### Khung một bài dạy (lặp y hệt trong `.ml-en` và `.ml-vi`)

```html
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Tiêu đề bài — nói ra lợi ích</h2>
<p class="lead">1–3 câu: vấn đề người học đang gặp + bài này cho họ cái gì.</p>

<h3>…</h3>
<p>… định nghĩa thuật ngữ ngay lần đầu, ví von, vì sao …</p>
${slide('cr-05', 6, 'Tam giác phơi sáng')}          ← chèn slide minh hoạ NGAY cạnh đoạn giảng về nó

<div class="kv-grid">
  <div class="kv"><span class="k">Pocket 3</span><span class="v">… <small>ghi chú</small></span></div>
</div>

<div class="callout ok"><p><strong>Mẹo:</strong> …</p></div>        ← ok | warn | danger
<div class="pitfall co-tieu-de"><p><strong>Bẫy — …</strong> …</p></div>   ← có tiêu đề riêng thì PHẢI thêm co-tieu-de (không thì site chèn thêm nhãn "⚠️ Bẫy thường gặp" trùng lặp)
<p class="note-ct"><strong>Nối với chương sau:</strong> …</p>

<h3>🎬 Thực hành (15–30 phút)</h3>
<div class="callout ok"><ol><li>…</li></ol><p><strong>Đạt khi:</strong> tiêu chí đo được.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid"><div class="kv"><span class="k">Shutter speed</span><span class="v">Tốc độ màn trập — …</span></div></div>

<h3>📌 Tóm tắt</h3>
<ul><li>…</li></ul>

<div class="link-card"><a href="https://…" target="_blank" rel="noopener">Tên nguồn — vì sao nên đọc</a></div>
</div>
```

**Khối được phép dùng** (đều đã có CSS trên site): `.eyebrow` `.lead` `h3` `p` `ul/ol` `table` (bảng HTML
thường có `<th>`), `.kv-grid>.kv>.k/.v`, `.callout.ok|.warn|.danger`, `.pitfall`, `.note-ct`,
`.lz-flow>.lz-step>.lz-k/.lz-t/.lz-d` (chuỗi bước), `.lz-stack>.lz-layer>.lz-k/.lz-t/.lz-d` (các tầng),
`.link-card`, `.khoi-sach>.the-sach` (sách — xem dưới), ảnh slide qua `slide()`, và **mermaid**
(`<pre><code class="language-mermaid">flowchart TB …</code></pre>` — dùng `TB` khi > 5 nút).
Mã: `<pre><code class="language-bash">…</code></pre>` (trang tự tô màu kiểu VS Code + nút Sao chép).
Output lệnh: `<div class="out">…</div>`. **KHÔNG** iframe, script, style inline phức tạp (bị lọc).

**Sách / tài liệu học sâu phải là THẺ, không phải link chữ thường:**
```html
<div class="khoi-sach">
  <a class="the-sach chinh" href="https://…" target="_blank" rel="noopener">
    <span class="sach-ico">📗</span>
    <span class="sach-than"><span class="sach-ten">Tên sách</span>
      <span class="sach-phu">Tác giả · NXB · năm</span>
      <span class="sach-nhan-nhom"><span class="sach-nhan mien-phi">Miễn phí</span></span></span>
    <span class="sach-nut">Đọc →</span></a>
  <div class="the-sach khong-link"><span class="sach-ico">📘</span><span class="sach-than">
    <span class="sach-ten">Sách giấy</span><span class="sach-phu">Tác giả · năm</span>
    <span class="sach-nhan-nhom"><span class="sach-nhan giay">Sách giấy</span></span></span></div>
</div>
```
Nhãn: `chinh` · `mien-phi` · `tham-khao` · `giay`. Sách giấy không link ⇒ `div.khong-link`, bỏ `.sach-nut`.

**Độ dài mục tiêu:** mỗi bài dạy khối `.ml-vi` khoảng **7.000–11.000 ký tự**, `.ml-en` tương đương.
Mỗi bài dạy chèn **2–4 slide** của chương bằng `slide()` ở đúng chỗ (cả hai khối ngôn ngữ — slide bằng tiếng Việt, vẫn dùng cho khối EN).

### Bài kiểm tra N.5
```js
{ title: 'N.5 — Chapter N check|||N.5 — Kiểm tra chương N', slug: 'cr-NN-5-quiz', type: 'QUIZ', isFreePreview: true,
  description: '…',
  content: `<div class="ml-en">…tóm tắt chương + checklist…</div>\n<div class="ml-vi">…</div>`,
  quiz: { timeLimitSeconds: 900, questions: [
    { question: 'EN …|||VI …', options: ['EN|||VI', …4 phương án], correctIndex: 0..3, points: 1,
      explanation: 'EN: vì sao đúng + vì sao phương án hấp dẫn nhất lại sai|||VI: …' },
  ] } }
```
10 câu, **tình huống thực tế** ("Bạn quay dưới đèn trong nhà thấy sọc nhấp nháy…") hơn là hỏi định nghĩa.
Mỗi câu có `explanation` song ngữ. **Rải đáp án đúng** (đừng để toàn A). Phương án chỉ gồm số/code giống nhau
hai ngôn ngữ thì không cần `|||`.

## 5. Slide của chương — `scripts/slides-src/cr-NN.mjs`

```js
import { S, cover, cards, box, steps, table, vs, kpis, flow, tag, two, list, code, tree, mindmap, calendar,
  kelvin, wheels, seg, nodes, bars, hud, ui, shotLadder, frame, personShot, exposureTriangle, shutterDemo,
  timeline, lightPlot, meter, audioWave, chart, vectorscope, lumaScope, phone, axis180, fov, funnel, curve,
  dof, aspect, storyboard, backup321, note, cap, quote } from './_cr-chung.mjs';

export const deck = { key: 'cr-05', code: 'CR · CHƯƠNG 5', title: 'Máy quay hoạt động thế nào', sub: 'Content Creator · Chương 5' };
export const slides = S([
  cover({ t: 'Chương 5 — …', sub: '…', chap: 'CHƯƠNG 5' }),
  { t: 'Bản đồ chương', body: mindmap('…', '…', [ {t,d,c} ×4–6 ]) },
  …
]);
```
- **12–16 slide/chương**: bìa → bản đồ chương (mindmap) → các slide khái niệm → 1 slide "bảng tra nhanh /
  checklist" → 1 slide "Thực hành". **Ưu tiên HÌNH** (hàm vẽ sẵn trong `_cr-chung.mjs`, đọc đầu file để biết
  tham số; hoặc tự vẽ `<svg>` nội tuyến) hơn chữ. Slide chỉ toàn gạch đầu dòng là slide hỏng.
- Chữ trên slide: tiếng Việt, ngắn. Tối đa ~45 từ/slide ngoài hình.
- Mọi tham số chữ đưa vào hàm SVG là chữ thường (hàm tự escape); tham số HTML (cards/box/steps) tự viết `&amp;`.
- Kiểm tràn khung: `node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/cr-NN.mjs` (phải "không slide nào tràn").
- Render: `node scripts/_render-slides.mjs --deck scripts/slides-src/cr-NN.mjs --out <SCRATCH>/cr-render`
  ⇒ `<SCRATCH>/cr-render/cr-NN/001.webp …`
- ⛔ **MỞ TỪNG ẢNH RA NHÌN** bằng công cụ Read (bộ đo tràn KHÔNG thấy chữ đè nhau, nhãn bị cắt trong SVG,
  hình lệch). Sửa đến khi mọi slide sạch. Chữ SF Pro rộng ~0,52×cỡ chữ; chữ đơn cách ~0,6×.
- ⛔ KHÔNG sửa `scripts/_render-slides.mjs` và KHÔNG sửa `_cr-chung.mjs` (dùng chung). Cần hình mới thì vẽ
  `<svg>` ngay trong deck của mình.

## 6. Thoát ký tự trong template literal (bộ kiểm sẽ chặn)

- Không backtick trần → `&#96;`. `${` trong mã mẫu → `\${`. Gạch chéo ngược → `\\`.
- Trong `<pre><code>`: `<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;`.
- Khối `.out` mở `<div class="out">` đóng `</div>` (đừng đóng `</code></pre>`).
- Phím tắt/nút bấm viết trong `<code>` — bộ lọc HTML của site (`sanitizeHtml`) **gỡ thẻ `<kbd>`** (giữ chữ, mất định dạng).
- Trong chuỗi JS nháy đơn (title, quiz…): KHÔNG viết `\\'` (hai gạch + nháy là lỗi cú pháp); dùng dấu `’` hoặc chuỗi nháy kép.
- `.pitfall`/`.callout`: viết `<p>` bên trong ngay từ đầu. `link-card` đóng đúng MỘT `</div>`.
- Kiểm: `node scripts/course-content-check.mjs ./content/courses/content-creator/sNN-*.mjs` → phải ✅ 0 lỗi.
  Và `node -e "import('./content/courses/content-creator/sNN-….mjs').then(m=>{for(const l of m.default.lessons){if(typeof l.content!=='string')throw l.slug; if(l.title.length>180)throw l.slug+' title dài'}; console.log('ok')})"`

## 7. Phạm vi file — ⛔ đọc kỹ

Mỗi agent chỉ được **tạo** đúng 2 file của chương mình: `content/courses/content-creator/sNN-*.mjs` và
`scripts/slides-src/cr-NN.mjs` (+ file tạm trong thư mục scratch được giao). **KHÔNG** sửa manifest
`content-creator.mjs`, `_slides.mjs`, `_cr-chung.mjs`, file chương khác, hay bất kỳ file nào khác trong repo.
**KHÔNG** `git add/commit`, **KHÔNG** seed DB, **KHÔNG** upload R2, **KHÔNG** deploy — người điều phối làm.
Bạn làm MỘT MÌNH, không có agent anh em nào; đừng gửi tin nhắn phối hợp hay chờ ai trả lời.

## 8. Báo cáo cuối (trả về cho người điều phối)

1. Đường dẫn 2 file + số slide đã render + kết quả `_kiem-tran-slide` + kết quả content-check.
2. Danh sách slide `[n, 'chú thích']` (đã nằm trong N.0).
3. Các thông số đã kiểm từ nguồn chính thức (1 dòng/nguồn: điều gì — URL).
4. Chỗ nào CHƯA kiểm được / còn nghi ngờ.
5. Link đã kiểm sống (URL → mã HTTP).

## 9. Giáo trình & slug (KHÔNG đổi slug — video YT và tiến độ học viên bám theo slug)

**Mục 0 — Bắt đầu** `s00-gioi-thieu.mjs` · deck `cr-00` — *người điều phối viết (bài mẫu)*
- `cr-00-1-hanh-trinh-creator` Creator là gì, lịch sử video trực tuyến (YouTube 2005 → TikTok/Reels/Shorts), vì sao video cho thương hiệu cá nhân
- `cr-00-2-do-nghe-cua-ban` Đồ nghề của bạn: vai trò từng máy; mua gì trước (âm thanh > ánh sáng > máy)
- `cr-00-3-quy-trinh-san-xuat` Quy trình sản xuất: ý tưởng → kịch bản → phân cảnh → quay → nhập liệu → dựng → màu/âm → xuất → đăng → đo
- `cr-00-4-lo-trinh-cach-hoc` Lộ trình 5 giai đoạn, cách học bằng cách làm, dùng /creator

**GIAI ĐOẠN 1 — TIỀN KỲ**
- **Ch1 Nền tảng & khán giả** `s01-nen-tang-khan-gia.mjs`: `cr-01-1-bon-nen-tang` (YouTube/TikTok/Facebook/Instagram: định dạng, độ dài, tỉ lệ, người dùng ở VN) · `cr-01-2-thuat-toan-de-xuat` (impression, CTR, thời lượng xem, giữ chân, hài lòng; lời đồn) · `cr-01-3-chon-ngach-khan-gia` (giao điểm giỏi × cần × thích lâu dài; chân dung khán giả) · `cr-01-4-thuong-hieu-ca-nhan` (tên/handle, hồ sơ, trụ cột, website là trung tâm)
- **Ch2 Ý tưởng & chiến lược** `s02-y-tuong-chien-luoc.mjs`: `cr-02-1-nguon-y-tuong` · `cr-02-2-tham-dinh-y-tuong` (chấm điểm, "đóng gói trước") · `cr-02-3-tru-cot-lich-dang` (trụ cột, series, nhịp đăng thực tế, quay dồn, /creator/calendar) · `cr-02-4-tai-su-dung-noi-dung` (kim tự tháp: 1 video dài → nhiều video ngắn → bài viết web)
- **Ch3 Kịch bản & kể chuyện** `s03-kich-ban-ke-chuyen.mjs`: `cr-03-1-hook` (3 giây đầu, 30 giây đầu; hook hình/chữ/lời) · `cr-03-2-cau-truc-cau-chuyen` (3 hồi, but/therefore, vòng mở, cấu trúc theo loại video) · `cr-03-3-viet-kich-ban` (viết cho tai nghe, kịch bản 2 cột A/V, số chữ ↔ thời lượng, CTA, mẫu /creator) · `cr-03-4-len-hinh-tu-nhien` (teleprompter iPad, nhìn ống kính, năng lượng, nói lại câu hỏng)
- **Ch4 Phân cảnh: shot list & storyboard** `s04-phan-canh.mjs`: `cr-04-1-bay-quay-mot-leo` (toán dung lượng, tỉ lệ quay/dùng, "để hậu kỳ lo") · `cr-04-2-canh-shot-take` (scene/shot/take, A-roll/B-roll, coverage, chuỗi 5 shot) · `cr-04-3-shot-list` (cột, mẫu, từ kịch bản ra shot list, ví dụ vlog ngắn 90 giây ~20 shot + short 60s ~8 shot) · `cr-04-4-storyboard-ngay-quay` (vẽ trên iPad, thứ tự quay theo bối cảnh, vỗ tay/slate, đặt tên, clip ngắn)

**GIAI ĐOẠN 2 — QUAY**
- **Ch5 Máy quay hoạt động thế nào** `s05-may-quay.mjs`: `cr-05-1-do-phan-giai-fps` (1080p/4K, 24/25/30/50/60/120, **VN điện 50Hz → 25/50fps**) · `cr-05-2-phoi-sang` (tam giác, quy tắc 180°, điện thoại khẩu cố định → ND, zebra/histogram) · `cr-05-3-can-bang-trang-lay-net` (Kelvin, khoá WB, AF/MF, độ sâu trường ảnh) · `cr-05-4-codec-bitrate-log` (H.264/H.265/ProRes, bitrate, 8 vs 10-bit, Log vs HLG vs Normal, HDR/Dolby Vision)
- **Ch6 Cài đặt đồ nghề của bạn** `s06-cai-dat-thiet-bi.mjs`: `cr-06-1-pocket-3` · `cr-06-2-iphone-16-pro-max` (Camera app + Blackmagic Camera, PAL, khoá ống kính/WB, ProRes Log, SSD ngoài) · `cr-06-3-ipad-mac-linux` · `cr-06-4-the-nho-pin-dung-luong` (bảng GB/phút từng chế độ, chọn thẻ, nhiệt, pin, chỗ chứa)
- **Ch7 Bố cục & ngôn ngữ hình ảnh** `s07-bo-cuc.mjs`: `cr-07-1-co-canh` · `cr-07-2-goc-may-tieu-cu` · `cr-07-3-bo-cuc` (1/3, khoảng đầu, khoảng nhìn, đường dẫn, chiều sâu, nền, **vùng an toàn 9:16**) · `cr-07-4-chuyen-dong-may-lien-tuc` (pan/tilt/push/track, gimbal Pocket 3, 180°, 30°, khớp hành động)
- **Ch8 Ánh sáng** `s08-anh-sang.mjs`: `cr-08-1-ban-chat-anh-sang` (cứng/mềm, hướng, luật bình phương nghịch đảo, Kelvin, CRI, nhấp nháy 50Hz) · `cr-08-2-anh-sang-tu-nhien` (cửa sổ, giờ vàng, nắng trưa VN, tấm hắt) · `cr-08-3-ba-diem-kieu-sang-mat` (key/fill/back; Rembrandt/loop/butterfly; tách nền; đèn trang trí) · `cr-08-4-goc-quay-tai-nha` (setup bàn làm việc ngân sách thấp, danh sách mua theo mức tiền)
- **Ch9 Thu âm khi quay** `s09-am-thanh.mjs`: `cr-09-1-am-thanh-quan-trong` (dB, 48kHz, 24-bit/32-bit float) · `cr-09-2-micro-cach-dat` (built-in/lav/wireless/shotgun/USB; DJI Mic với Pocket 3) · `cr-09-3-muc-thu-phong-thu` (−12…−6 dBFS, tai nghe, tiếng vang, điều hoà/quạt/xe máy, room tone, chống gió) · `cr-09-4-thu-hai-he-thong-dong-bo` (ghi dự phòng, vỗ tay, đồng bộ theo sóng âm)
- **Ch10 Quay một mình như dân chuyên** `s10-quay-thuc-chien.mjs`: `cr-10-1-talking-head` · `cr-10-2-b-roll` · `cr-10-3-tu-quay-mot-minh` (ActiveTrack, khoá phơi sáng/nét, đánh dấu vị trí, iPad làm màn hình) · `cr-10-4-ngay-quay-checklist` (checklist trước/trong/sau, quay nơi công cộng ở VN, đổ thẻ cùng ngày)

**GIAI ĐOẠN 3 — HẬU KỲ**
- **Ch11 Quy trình hậu kỳ & dữ liệu** `s11-quy-trinh-hau-ky.mjs`: `cr-11-1-nhap-lieu-dat-ten` (cấu trúc thư mục, đặt tên, script tạo thư mục, sao chép có checksum) · `cr-11-2-sao-luu-3-2-1` (SSD/HDD/máy Linux/cloud; giữ gì, xoá gì) · `cr-11-3-chon-phan-mem-dung` (CapCut · DaVinci Resolve · Final Cut Pro · Premiere · LumaFusion — chạy trên máy nào; khuyến nghị) · `cr-11-4-proxy-codec-linux` (vì sao H.265 nặng, proxy, ffmpeg → ProRes/DNxHR, giới hạn codec Resolve bản Linux miễn phí)
- **Ch12 Dựng nhanh với CapCut** `s12-capcut.mjs`: `cr-12-1-giao-dien-capcut` · `cr-12-2-cat-dung-co-ban` · `cr-12-3-chu-phu-de-hieu-ung` (phụ đề tự động tiếng Việt/Anh, chữ, hiệu ứng tiết chế, nhạc — lưu ý bản quyền) · `cr-12-4-xuat-quy-trinh-capcut`
- **Ch13 Dựng chuyên nghiệp với DaVinci Resolve** `s13-davinci-resolve.mjs`: `cr-13-1-lam-quen-resolve` (7 trang, project settings, bản miễn phí vs Studio) · `cr-13-2-cong-cu-trang-edit` (phím tắt, trim ripple/roll/slip/slide, 3-point editing, Text+) · `cr-13-3-da-may-dong-bo` (Auto Sync Audio, multicam Pocket 3 + iPhone, trang Cut) · `cr-13-4-resolve-ipad-linux`
- **Ch14 Nghệ thuật cắt dựng** `s14-nghe-thuat-dung.mjs`: `cr-14-1-quy-trinh-dung` (assembly → rough → fine → lock; selects) · `cr-14-2-kieu-cat-chuyen-canh` (jump/J/L/match/cutaway/cut on action; Kuleshov; Rule of Six của Walter Murch) · `cr-14-3-nhip-giu-chan` · `cr-14-4-nhac-thiet-ke-am-thanh`
- **Ch15 Chỉnh màu** `s15-chinh-mau.mjs`: `cr-15-1-mau-la-gi` (correction vs grading, Rec.709, Log, màn hình tham chiếu) · `cr-15-2-doc-scopes` (waveform, parade, vectorscope, đường màu da) · `cr-15-3-log-lut` (D-Log M & Apple Log → Rec.709, LUT chính hãng, CST) · `cr-15-4-node-tao-look` (cây node, khớp màu Pocket 3 ↔ iPhone, look nhất quán, màu trong CapCut)
- **Ch16 Âm thanh hậu kỳ, chữ, đồ hoạ & phụ đề** `s16-am-thanh-chu-phu-de.mjs`: `cr-16-1-mix-am-thanh` (LUFS, −14 LUFS, chuỗi xử lý giọng, ducking) · `cr-16-2-chu-do-hoa` (chữ cho video, lower third, callout, font có đủ dấu tiếng Việt) · `cr-16-3-phu-de` (SRT, phụ đề cứng/mềm, kiểu chữ, song ngữ) · `cr-16-4-whisper-linux` (Whisper/faster-whisper trên GPU máy Linux → SRT tiếng Việt/Anh)

- **Ch17 Chuyển cảnh, keyframe & tốc độ** `s17-chuyen-canh-keyframe.mjs`: `cr-17-1-chuyen-canh-chuyen-nghiep` (các loại chuyển cảnh + quay để chuyển cảnh) · `cr-17-2-keyframe-easing` · `cr-17-3-toc-do-thoi-gian` (slow motion đúng, speed ramp, optical flow, timelapse) · `cr-17-4-he-thong-hieu-ung` (adjustment clip, thư viện hiệu ứng, preset/template, render cache)
- **Ch18 Mask, tracking & VFX thực tế** `s18-mask-tracking-vfx.mjs`: `cr-18-1-mask-rotoscope` · `cr-18-2-tracking-on-dinh` (tracker, làm mờ mặt/biển số, ổn định hình) · `cr-18-3-phong-xanh-tach-nen` · `cr-18-4-vfx-thuc-te` (nhân bản chính mình, thay màn hình, thay trời, xoá vật thể)
- **Ch19 Motion graphics, Fusion & 3D** `s19-motion-fusion-3d.mjs`: `cr-19-1-motion-graphics` · `cr-19-2-fusion-resolve` · `cr-19-3-3d-trong-fusion` · `cr-19-4-blender-cho-creator` (logo/chữ 3D, camera tracking, render trên máy Linux)

**GIAI ĐOẠN 4 — THEO ĐỊNH DẠNG**
- **Ch20 Video ngắn dọc** `s20-video-ngan.mjs`: `cr-20-1-giai-phau-video-ngan` · `cr-20-2-quay-video-ngan` · `cr-20-3-dung-video-ngan` · `cr-20-4-dang-phan-phoi-video-ngan`
- **Ch21 Vlog** `s21-vlog.mjs`: `cr-21-1-vlog-la-ke-chuyen` · `cr-21-2-quay-vlog-pocket-3` · `cr-21-3-dung-vlog` · `cr-21-4-vlog-hoc-tap-thuong-hieu`
- **Ch22 Video bài giảng & quay màn hình** `s22-bai-giang.mjs`: `cr-22-1-thiet-ke-bai-giang` (mục tiêu học, nguyên lý đa phương tiện của Mayer, chia đoạn) · `cr-22-2-quay-man-hinh` (OBS, quay màn hình macOS, cỡ chữ VS Code, iPhone làm webcam, Presenter Overlay) · `cr-22-3-ipad-bang-trang` · `cr-22-4-dung-dua-len-khoa-hoc` (dựng bài giảng, chapter, đưa lên 3 luồng VI/EN/YT của cuongthai.com)
- **Ch23 Video song ngữ Việt – Anh** `s23-song-ngu.mjs`: `cr-23-1-chien-luoc-song-ngu` · `cr-23-2-kich-ban-tieng-anh` (viết đơn giản, luyện phát âm, teleprompter) · `cr-23-3-phu-de-long-tieng` (dịch phụ đề, tiêu đề đa ngôn ngữ, âm thanh đa ngôn ngữ của YouTube, lồng tiếng AI — đồng ý & chất lượng) · `cr-23-4-quy-trinh-hai-phien-ban`

**GIAI ĐOẠN 5 — XUẤT BẢN & PHÁT TRIỂN**
- **Ch24 Xuất file & đăng tải** `s24-xuat-dang.mjs`: `cr-24-1-xuat-file-chuan` · `cr-24-2-dang-youtube-seo` · `cr-24-3-dang-tiktok-facebook-instagram` · `cr-24-4-ban-quyen-luat-choi`
- **Ch25 Thumbnail & tiêu đề** `s25-thumbnail-tieu-de.mjs`: `cr-25-1-packaging` · `cr-25-2-viet-tieu-de` · `cr-25-3-thiet-ke-thumbnail` · `cr-25-4-thu-nghiem-cai-tien`
- **Ch26 Số liệu, tăng trưởng & kiếm tiền** `s26-tang-truong.mjs`: `cr-26-1-doc-analytics` · `cr-26-2-vong-lap-cai-tien` · `cr-26-3-cong-dong` · `cr-26-4-kiem-tien-pheu-website`
- **Ch27 Dự án cuối khoá: 30 ngày ra mắt kênh** `s27-du-an-cuoi-khoa.mjs`: `cr-27-1-ke-hoach-30-ngay` · `cr-27-2-du-an-video-dai` · `cr-27-3-du-an-video-ngan-vlog` · `cr-27-4-tu-danh-gia-buoc-tiep`

Mỗi chương còn `cr-NN-0-slides` và `cr-NN-5-quiz`. Tiêu đề section: `'Chapter N — English|||Chương N — Tiếng Việt'`.

## 10. Kiểm tra ở bước ghép (người điều phối)

- `course-content-check` toàn khoá = 0 lỗi; mọi `content` là chuỗi; title ≤ 180.
- Upload slide → GET từng ảnh mà `slide()`/`gallery()` tham chiếu = 200, `content-length` khớp file trên đĩa.
- Seed local (`course-seed.mjs --apply`), mở trang học trên dev server nhìn tận mắt 2–3 bài.
