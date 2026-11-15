# Kế hoạch + bàn giao — khoá "IT Interview Prep" (/courses/interview-prep)

> Đọc HẾT file này trước khi sửa. Khoá trước 15/11/2026 chỉ là KHUNG (`khung('pv', …)`). Từ 15/11 soạn trọn,
> mỗi chương một file `interview-prep/sNN-*.mjs`. Người học chính = chủ kênh (SV SE FPTU K17, làm CV 20–29/11/2026,
> hạn đăng ký OJT SP27 giữa 12/2026). Ưu tiên số 1 lúc này. Chất lượng > tốc độ.

## 1. Luật cứng

1. **GIỮ slug bài khung** (URL đã công khai): `pv-N-M-<ten>` như bảng mục 3. **GIỮ title CHƯƠNG** đúng từng ký tự
   (seeder neo chương theo title). Title BÀI được đổi.
2. Chỉ sửa `content/courses/interview-prep.mjs` + `content/courses/interview-prep/**`. Không push, không deploy, không seed.
3. Commit từng chương: `git add <tệp> && git commit -m "content(interview-prep): …" -- <tệp>` (+ dòng Claude-Session).
4. Không bịa số liệu lương/thống kê. Có nguồn công khai + năm thì ghi; không có thì dạy CÁCH tra.
5. Không lộ bí mật/khoá/IP/email riêng của dự án. Kể sự cố bằng tên thành phần (nginx, Prisma…), không địa chỉ máy.
6. **Trung thực về AI**: cuongthai.com được xây với trợ lý AI viết phần lớn mã — khoá dạy kể ĐÚNG vai trò thật
   (kiến trúc, duyệt mã, vận hành, chẩn đoán sự cố, quy trình deploy). LabFlow AI = tự code tay ⇒ bằng chứng kỹ năng code.
   "Chỉ ghi vào CV điều bạn giải thích được khi bị hỏi đào sâu 3 tầng."

## 2. Định dạng (khuôn khoá Redis, KHÔNG slide ảnh)

- Mỗi chương: `export default { title, description, lessons: [...] }`. Bài: `{ title:'N.M — EN|||N.M — VI', slug, type:'LESSON'|'QUIZ', isFreePreview:true, description (VI 1 câu), content }`.
- Mỗi bài dạy = khối `<div class="ml-en">…</div>` + `<div class="ml-vi">…</div>` (VI là bản chính, EN song song đủ ý).
  Thứ tự trong mỗi khối: eyebrow · h2 · lead · các h3 nội dung (liên tưởng đời thường, ví dụ thật từ cuongthai.com/LabFlow,
  tình huống "nếu…", góc kẻ xấu khi hợp) · ≥1 `flow()`/`stack()` · ≥1 `bay()` · (vòng kỹ thuật: 6–10 `qa()`) ·
  `thucHanh()` · `thuatNgu()` 5–8 mục · `tomTat()` 5–6 ý · `lienQuan()` ≥2 thẻ (bài trên trang + video YT + nguồn).
- Độ dài: khối VI 7–10k ký tự, EN 5–8k ⇒ ≥ 12k/bài (sàn audit: TB ≥ 9.000 tính cả quiz; ≥1 sơ đồ + ≥1 bẫy mỗi bài lý thuyết; ≥2 link-card/bài).
- Helper: `_pv.mjs` (ma, ra, lienKet, nguon, yt, flow, stack, kv, bang, bay, keXau, doiThuong, neu, qa, thucHanh, thuatNgu, tomTat, lienQuan, rubric, cau).
- Thoát ký tự: không backtick trần (`&#96;`), không `${` trong chữ (`&#36;{`), không gạch chéo ngược. `<` `>` `&` trong chữ ⇒ `&lt; &gt; &amp;`.
- Bài Lab (N.5): đề như việc thật · bước đánh số · mẫu/khung tải được (dán trong `ra()`) · gợi ý từng bậc trong `<details>` ·
  `rubric()` tự chấm · thử thách thêm.
- Quiz (N.6): `type:'QUIZ'`, content = eyebrow + h2 + lead + "Tự kiểm trước khi làm" (ul 5 dòng). `quiz:{ timeLimitSeconds: 900, questions: [10 × cau(...)] }`,
  tình huống thật, `explanation: 'EN: …|||VI: …'` nói vì sao đúng + vì sao phương án hấp dẫn nhất sai; đáp án rải A/B/C/D mỗi vị trí 2–3 lần;
  phương án sai hợp lý, độ dài tương đương.
- Video YT: mỗi bài dạy 1 video (`yt()` trong `lienQuan`), tìm bằng `node scripts/yt-search.mjs "…"`, kiểm bằng
  `node $TMPDIR/pv-nhap/ytok.mjs <id>` (phải `OK · embed=true · cc=en`) — kênh uy tín (Indeed, Harvard Business Review,
  freeCodeCamp, Fireship, Hussein Nasser, ByteByteGo, NeetCode, Google Career Certificates, Exponent, Jeff Su, CareerVidz…),
  loại kênh vô danh/AI/lỗi thời. Ghi thêm một dòng vào `_video-yt.tsv` (slug · id · kênh — tiêu đề) để người điều phối gắn
  luồng YT ở `content/course-videos/interview-prep.mjs` (ngoài phạm vi tệp của khoá).

## 3. Dàn bài (66 bài: 55 bài dạy/lab + 11 quiz)

| Chương (title giữ nguyên) | Bài |
|---|---|
| Mục 0 `s00-intro.mjs` | pv-0-8-bat-dau-tai-day · pv-0-9-bat-dau-khi-khong-co · pv-0-1-tim-viec · pv-0-2-ban-do-ky-nang · **pv-0-3-lab-bang-ung-tuyen** · **pv-0-4-quiz** |
| Ch1 CV, LinkedIn, GitHub `s01-ho-so.mjs` | pv-1-1-cv · pv-1-2-du-an-cv · pv-1-3-github · pv-1-4-linkedin · **pv-1-5-lab-cv** · **pv-1-6-quiz** |
| Ch2 Kể câu chuyện `s02-cau-chuyen.mjs` | pv-2-1-gioi-thieu · pv-2-2-star · pv-2-3-su-co · pv-2-4-cau-hoi-lai · **pv-2-5-lab-tu-gioi-thieu** · **pv-2-6-quiz** |
| Ch3 Hành vi `s03-hanh-vi.mjs` | pv-3-1-nhom · pv-3-2-ap-luc · pv-3-3-hoc · pv-3-4-ngan-hang · **pv-3-5-lab-mock-hanh-vi** · **pv-3-6-quiz** |
| Ch4 Backend `s04-backend.mjs` | pv-4-1-node · pv-4-2-sql · pv-4-3-api · pv-4-4-testing · **pv-4-5-java-oop** · **pv-4-6-lab-mock-backend** · **pv-4-7-quiz** |
| Ch5 DevOps `s05-devops.mjs` | pv-5-1-git · pv-5-2-docker · pv-5-3-cicd · pv-5-4-linux-cloud · **pv-5-5-lab-mock-devops** · **pv-5-6-quiz** |
| Ch6 Frontend `s06-frontend.mjs` | pv-6-1-react · pv-6-2-nextjs · pv-6-3-trinh-duyet · pv-6-4-bai-tap · **pv-6-5-lab-mock-frontend** · **pv-6-6-quiz** |
| Ch7 Coding + SD `s07-coding-sd.mjs` | pv-7-1-coding · pv-7-2-live-coding · pv-7-3-system-design · pv-7-4-take-home · **pv-7-5-lab-mock-coding** · **pv-7-6-quiz** |
| Ch8 Tiếng Anh `s08-tieng-anh.mjs` | pv-8-1-gioi-thieu · pv-8-2-du-an · pv-8-3-ky-thuat · pv-8-4-khi-khong-hieu · **pv-8-5-lab-noi-tieng-anh** · **pv-8-6-quiz** |
| Ch9 Mock + offer `s09-offer.mjs` | pv-9-1-phong-van-thu · pv-9-2-sau-phong-van · pv-9-3-offer · pv-9-4-tong-ket · **pv-9-5-lab-email-offer** · **pv-9-6-quiz** |
| **Ch10 MỚI** `s10-du-an-cuoi.mjs` — title `Chapter 10 — Final project: your complete application kit\|\|\|Chương 10 — Dự án cuối khoá: bộ hồ sơ ứng tuyển hoàn chỉnh` | pv-10-1-de-bai · pv-10-2-ho-so · pv-10-3-nam-cau-chuyen · pv-10-4-mock-cuoi · pv-10-5-kiem-tra-cuoi-khoa (QUIZ 20 câu) |

## 4. Nguồn sự thật để lấy ví dụ (không bịa)

- **cuongthai.com** (repo này): Next.js + Express/TypeScript + PostgreSQL/Prisma (~600 model) + Redis + Cloudflare R2/CDN + nginx,
  Docker Compose trên VPS Ubuntu; ảnh dựng ở máy nhà → GHCR → VPS chỉ tráo (`deploy-nha.sh`, build ~3–6 phút ở nhà so với ~15 phút trên VPS),
  smoke-test route sau deploy, CT Work kiểu Jira (sprint, board, JQL, agent AI qua MCP), app desktop Electron tự cập nhật.
  Sự cố THẬT (CLAUDE.md + `docs/so-loi.md`): 02/07 GIF 404 vì build cũ (404 vs 401 để chẩn đoán) · 02/07 phiên chết sau 24h vì thiếu
  `/auth/refresh` · 03/07 + 06/07 push-to-deploy đua nhau ⇒ feed 500, container Exited(137) ⇒ bỏ deploy theo push · 08/08 đổi tên enum
  qua sạch checklist vẫn vỡ seed production ⇒ thêm `typecheck:seed` · 18/08 ảnh Alpine (musl) mang engine Prisma glibc ⇒ API 502 bảy phút ⇒
  thêm chốt kiểm libc trước khi đẩy · 18/08 cache build 7,6 GB làm đầy đĩa chứa Postgres · 25/08 nginx bind-mount file đơn đổi bằng `mv`
  nên container đọc inode cũ · 19–20/08 app desktop bump 11 lần trong 4,5 giờ, một bản không bao giờ phát hành ⇒ script `phat-hanh` có cửa chặn.
- **LabFlow AI**: đồ án SWP391→SEP490, Spring Boot + React + PostgreSQL + AIoT, modular monolith "monolith-first", TỰ CODE TAY,
  quản lý trên CT Work (46 Req, gate theo tuần). Đang làm — kể đúng trạng thái "đang làm", không phóng đại.
- Học vụ (memory chủ kênh): OJT khi nợ ≤ 2 môn; hạn đăng ký OJT SP27 giữa 12/2026; ~10/12 chưa có nơi nhận ⇒ đăng ký công ty trường xếp.

## 5. Liên kết chéo đã kiểm (slug thật, đọc từ content)

Courses: git (git-15-1-ho-so-github, git-3-4-rebase-vs-merge, git-4-4-reflog, git-6-1-giai-phau-pr, git-8-3-go-bi-mat) · docker (dk-1-1-container-la-gi,
dk-6-2-chon-anh-nen, dk-11-2-han-muc-137, dk-12-1-phuong-phap) · github-actions (ga-9-1-push-de-deploy, ga-10-1-build-cu, ga-10-2-seed-vo, ga-15-4-van-hanh-pipeline) ·
nodejs (nodejs-2-2-event-loop, nodejs-1-4-bat-dong-bo, nodejs-7-4-quan-he-va-n-plus-1, nodejs-8-2-jwt-access-refresh) · postgresql (postgresql-9-1-chi-muc-la-gi,
postgresql-11-3-muc-co-lap, postgresql-10-1-doc-explain) · api-design (api-1-3-status, api-5-1-idempotency, api-6-2-phan-quyen, api-11-2-rut-gon-link) ·
testing (tst-0-1-kim-tu-thap, tst-3-1-phan-loai, tst-10-4-phong-van) · react (rx-2-1-use-state, rx-4-1-use-effect, rx-9-4-phong-van, rx-14-4-phong-van) ·
nextjs (nextjs-9-1-mac-dinh-la-server-component, nextjs-17-1-bon-cach-render, nextjs-17-5-core-web-vitals) · linux-bash (lnx-5-1-tien-trinh-la-gi, lnx-12-1-phuong-phap) ·
networking-for-developers (netdev-0-2-go-dia-chi, netdev-12-1-cau-hoi, netdev-10-4-ma-loi-gateway) · authentication (auth-4-5-cat-token-o-dau, auth-9-1-phan-quyen-la-gi).
⚠️ dsa-interview, system-design, agile-teamwork, spring-boot, web-security, cloud-aws hiện là KHUNG ("Đang soạn") — trỏ được, nhưng nội dung cốt lõi phải có NGAY trong bài.
Academy: OJT202 `ojt202-on-the-job-training` (ojt202-1-1-what-is-ojt, ojt202-2-1-cv-portfolio, ojt202-3-1-find-apply) · PRO192 `object-oriented-programming` ·
PRJ301 `java-web-application-development` · SWP391 `software-development-project` · SWT301 `software-testing` · CSD201 `data-structures-and-algorithms` ·
DBI202 `introduction-to-databases` · FER202 `front-end-web-development-with-react` · SSG104 `communication-and-in-group-working-skills`.
(Slug bài Academy chưa liệt kê ⇒ đọc tệp `content/academy/<MÃ>.mjs` trước khi trỏ.)

## 6. Tiến độ (cập nhật sau mỗi chương)

| Chương | Trạng thái | Commit | Ghi chú |
|---|---|---|---|
| Mục 0 | ✅ xong (6 bài, 110k ký tự, audit đạt) | 857f6f07d | 6 video YT đã kiểm OK/embed/cc=en |
| Ch1 | ✅ xong (6 bài, 126k ký tự, audit đạt) | e959cb865 | 5 video YT |
| Ch2–Ch3 | đang soạn (nhánh A) | — | |
| Ch4–Ch5 | đang soạn (nhánh B) | — | |
| Ch6–Ch7 | đang soạn (nhánh C) | — | |
| Ch8–Ch10 | đang soạn (nhánh D) | — | Ch10 là chương MỚI ⇒ thêm vào manifest |

Manifest `interview-prep.mjs`: chương đã soạn thay vào mảng khung THEO VỊ TRÍ (`((K) => [s00, s01, ...K.slice(2)])(khung(...))`);
khi đủ 10 chương cũ thì bỏ hẳn `khung()` và thêm s10. Công cụ kiểm phụ (ngoài repo, trong `$TMPDIR/pv-nhap/`):
`kiem-link.mjs` (liên kết nội bộ + slug trùng + video trùng), `ytok.mjs` (video sống/nhúng/phụ đề), `sua-dong-dong.py` (tách dòng đóng template).
