const REF = '?ref=%2Fcourses%2Fobject-storage%2Flearn&reflabel=Object%20Storage';
export default {
  title: 'Chapter 10 — What survived measurement, and a final exam|||Chương 10 — Cái sống qua đo lường, và đề thi cuối',
  slug: 'os-ch10-on-thi',
  description: 'Hai bài. Bài 10.1 sắp ba cột (luôn đúng, đo mới đúng, trực giác thua đo). Bài 10.2 đề thi 10 câu.',
  sortOrder: 11,
  lessons: [

    {
      title: '10.1 — What survived measurement|||10.1 — Cái SỐNG QUA đo lường',
      slug: 'os-10-1-song-qua',
      type: 'VIDEO',
      description: 'Ba cột phân biệt quy luật vs kho này vs trực giác thua đo.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>What survived measurement</h2>
<p class="lead">Nine chapters generated concepts and numbers. Some hold in any S3-compatible project. Some are properties of THIS repo. Some are intuitions measurement contradicted.</p>

<h3>Cột A — LUÔN ĐÚNG</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Object storage flat keys, no directories</span><span class="lz-lnote">&quot;/&quot; is just a character. No rename. Bài 0.1</span></div>
<div class="lz-layer"><span class="lz-lname">Bucket + key + object = 3-tier model</span><span class="lz-lnote">Every S3-compatible service. Bài 0.2</span></div>
<div class="lz-layer"><span class="lz-lname">Presigned PUT default signs only &#39;host&#39;</span><span class="lz-lnote">Explicit <code>signableHeaders</code> required cho content-type binding. Bài 4.2</span></div>
<div class="lz-layer"><span class="lz-lname">CORS chặn cross-origin PUT trước khi request</span><span class="lz-lnote">Bucket CORS config required. Bài 5.1</span></div>
<div class="lz-layer"><span class="lz-lname">Incomplete multipart upload chiếm cost invisible</span><span class="lz-lnote">Lifecycle rule cần thiết. Bài 6.1</span></div>
</div>

<h3>Cột B — CHỈ ĐÚNG KHI ĐO</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Kho này 331 dòng r2.ts + 291 dòng upload.service.ts</span><span class="lz-lnote">Số của bạn khác. Nguyên tắc lazy init + wrapper pattern giữ nguyên</span></div>
<div class="lz-layer"><span class="lz-lname">R2 vs S3 chênh 46× cho 10 TB/mo egress</span><span class="lz-lnote">Số cụ thể phụ thuộc scenario. Đo trên kho của bạn</span></div>
<div class="lz-layer"><span class="lz-lname">Cache hit ratio ~95% cho immutable assets</span><span class="lz-lnote">Số bạn phụ thuộc traffic pattern</span></div>
</div>

<h3>Cột C — LUÔN SAI</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;S3 storage class rẻ nhất&quot;</span><span class="lz-lnote">SAI cho media apps — egress dominant, R2 zero egress win. Bài 2.1</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;PutObject với ContentType đủ security&quot;</span><span class="lz-lnote">SAI. Cần signableHeaders explicit. Bài 4.2 kho này bug thật</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;Storage cost thấp so với egress&quot;</span><span class="lz-lnote">SAI cho write-heavy — Class A ops có thể dominate. Bài 7.1</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;Migrate S3 → R2 zero-cost&quot;</span><span class="lz-lnote">SAI. Pay S3 egress in migration ($0.09/GB one-time). Bài 8.1</span></div>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Object storage quy luật (flat keys, presigned signature scope, CORS, multipart cleanup) áp cho mọi kho; số cụ thể (repo code size, R2 vs S3 delta, cache ratio) đo lại cho kho bạn; và trực giác về pricing + security thường SAI — đọc doc + đo thật trước conclusion.</p>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Cái SỐNG QUA đo lường</h2>
<p class="lead">Chín chương tạo ra concept và số. Một số đúng ở mọi S3-compatible project. Một số là property của KHO NÀY. Một số là trực giác measurement contradict.</p>

<h3>Cột A — LUÔN ĐÚNG</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Object storage flat keys, không directory</span><span class="lz-lnote">&quot;/&quot; chỉ là ký tự. Không rename. Bài 0.1</span></div>
<div class="lz-layer"><span class="lz-lname">Bucket + key + object = 3-tier model</span><span class="lz-lnote">Mọi S3-compatible service. Bài 0.2</span></div>
<div class="lz-layer"><span class="lz-lname">Presigned PUT default sign chỉ &#39;host&#39;</span><span class="lz-lnote">Explicit <code>signableHeaders</code> cần thiết cho content-type binding. Bài 4.2</span></div>
<div class="lz-layer"><span class="lz-lname">CORS chặn cross-origin PUT trước request</span><span class="lz-lnote">Bucket CORS config cần thiết. Bài 5.1</span></div>
<div class="lz-layer"><span class="lz-lname">Incomplete multipart upload chiếm cost invisible</span><span class="lz-lnote">Lifecycle rule cần thiết. Bài 6.1</span></div>
</div>

<h3>Cột B — CHỈ ĐÚNG KHI ĐO</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Kho này 331 dòng r2.ts + 291 dòng upload.service.ts</span><span class="lz-lnote">Số bạn khác. Nguyên tắc lazy init + wrapper pattern giữ nguyên</span></div>
<div class="lz-layer"><span class="lz-lname">R2 vs S3 chênh 46× cho 10 TB/mo egress</span><span class="lz-lnote">Số cụ thể phụ thuộc scenario. Đo trên kho bạn</span></div>
<div class="lz-layer"><span class="lz-lname">Cache hit ratio ~95% cho immutable assets</span><span class="lz-lnote">Số bạn phụ thuộc traffic pattern</span></div>
</div>

<h3>Cột C — LUÔN SAI</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;S3 storage class rẻ nhất&quot;</span><span class="lz-lnote">SAI cho media apps — egress dominant, R2 zero egress win. Bài 2.1</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;PutObject với ContentType đủ security&quot;</span><span class="lz-lnote">SAI. Cần signableHeaders explicit. Bài 4.2 kho này bug thật</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;Storage cost thấp so với egress&quot;</span><span class="lz-lnote">SAI cho write-heavy — Class A ops có thể dominate. Bài 7.1</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;Migrate S3 → R2 zero-cost&quot;</span><span class="lz-lnote">SAI. Pay S3 egress in migration ($0.09/GB one-time). Bài 8.1</span></div>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Object storage quy luật (flat keys, presigned signature scope, CORS, multipart cleanup) áp cho mọi kho; số cụ thể (repo code size, R2 vs S3 delta, cache ratio) đo lại cho kho bạn; và trực giác về pricing + security thường SAI — đọc doc + đo thật trước conclusion.</p>
</div>
</div>
`,
    },

    {
      title: '10.2 — Final exam|||10.2 — Đề thi cuối',
      slug: 'os-10-2-de-thi',
      type: 'QUIZ',
      description: 'Mười câu, 15 phút.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 10 · Final exam</span><h2>10 câu, 15 phút</h2></div><div class="ml-vi"><span class="eyebrow">Chương 10 · Đề thi cuối</span><h2>10 câu, 15 phút</h2></div>`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Rename &quot;photos/2026/&quot; to &quot;photos/2025/&quot; in R2/S3?|||Rename &quot;photos/2026/&quot; thành &quot;photos/2025/&quot; trong R2/S3?',
            options: [
              'COPY each object + DELETE original. No directory concept — &quot;/&quot; is just a character in flat keys|||COPY từng object + DELETE gốc. Không có directory — &quot;/&quot; chỉ là ký tự trong flat key',
              'S3 mv command|||S3 mv command',
              'Rename folder|||Rename folder',
              'Alias|||Alias',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'R2 setting for AWS SDK region?|||Setting R2 cho AWS SDK region?',
            options: [
              '<code>region: &quot;auto&quot;</code> — R2 ignores region but SDK requires string. Any other value silently ignored|||<code>region: &quot;auto&quot;</code> — R2 ignore region nhưng SDK cần string. Value khác silently ignore',
              '&quot;us-east-1&quot;|||&quot;us-east-1&quot;',
              '&quot;global&quot;|||&quot;global&quot;',
              '&quot;undefined&quot;|||&quot;undefined&quot;',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'For public avatars serve to browser, which URL?|||Serve avatar public cho browser, URL nào?',
            options: [
              'Custom domain (media.cuongthai.com) — through CDN cache, zero egress, no auth. Not R2 endpoint URL (needs auth) or signed URL (no cache)|||Custom domain (media.cuongthai.com) — qua CDN cache, zero egress, không auth. Không R2 endpoint URL (cần auth) hay signed URL (không cache)',
              'R2 endpoint|||R2 endpoint',
              'Signed URL|||Signed URL',
              'Any works|||Cái nào cũng được',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Presigned PUT signed only host header. Vulnerability?|||Presigned PUT sign chỉ host header. Vulnerability?',
            options: [
              'Attacker PUT with Content-Type: text/html instead of intended type → stored XSS on media domain. Fix: <code>signableHeaders: new Set([&#39;host&#39;, &#39;content-type&#39;])</code>|||Attacker PUT với Content-Type: text/html thay vì type intended → stored XSS trên media domain. Fix: <code>signableHeaders: new Set([&#39;host&#39;, &#39;content-type&#39;])</code>',
              'No vulnerability|||Không vulnerability',
              'DDoS|||DDoS',
              'Overwrite|||Overwrite',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Cost for media app with 10 TB/mo egress: S3 vs R2?|||Cost cho media app với 10 TB/mo egress: S3 vs R2?',
            options: [
              'S3 ~$928/mo (egress dominant $900), R2 ~$20/mo (zero egress). ~46x cheaper for R2 — main reason to choose R2|||S3 ~$928/mo (egress dominant $900), R2 ~$20/mo (zero egress). ~46x rẻ hơn R2 — lý do chính chọn R2',
              'Same|||Bằng nhau',
              'R2 more expensive|||R2 đắt hơn',
              'Depends|||Phụ thuộc',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Cache-Control for user avatar that changes occasionally?|||Cache-Control cho user avatar đôi khi đổi?',
            options: [
              'Best: use versioned URL (avatar-v42.jpg) + <code>max-age=31536000, immutable</code>. Avatar changes = new URL, cache doesn\'t fight|||Tốt nhất: dùng versioned URL (avatar-v42.jpg) + <code>max-age=31536000, immutable</code>. Avatar đổi = URL mới, cache không đấu',
              'no-cache always|||no-cache luôn',
              'max-age=0|||max-age=0',
              '10 seconds|||10 giây',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Bill shows 200 GB but bucket listing shows 50 GB. Cause?|||Bill hiện 200 GB nhưng bucket listing hiện 50 GB. Cause?',
            options: [
              'Orphan multipart uploads — invisible via ListObjectsV2 but stored + billed. Set lifecycle rule to abort after 7 days|||Orphan multipart uploads — invisible qua ListObjectsV2 nhưng stored + billed. Set lifecycle rule abort sau 7 ngày',
              'Bug|||Bug',
              'Ignore|||Bỏ qua',
              'Contact support|||Contact support',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Browser upload 500 MB video failing at 100 MB. Cause?|||Browser upload video 500 MB fail ở 100 MB. Cause?',
            options: [
              'Cloudflare proxy caps request body at 100 MB (free/pro). Solution: direct upload with presigned PUT — client uploads directly to R2, bypassing your server + Cloudflare|||Cloudflare proxy cap request body ở 100 MB (free/pro). Giải pháp: direct upload với presigned PUT — client upload trực tiếp tới R2, bypass server + Cloudflare',
              'File too big for R2|||File quá lớn cho R2',
              'Buy Cloudflare business|||Mua Cloudflare business',
              'Compress|||Compress',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Migrate 5 TB S3 → R2. Cost?|||Migrate 5 TB S3 → R2. Cost?',
            options: [
              'One-time S3 egress ~$450 to AWS. R2 Migrator tool free. Ongoing egress after migration is $0|||One-time S3 egress ~$450 tới AWS. R2 Migrator tool free. Ongoing egress sau migration là $0',
              'Free|||Free',
              '$4500|||$4500',
              'R2 pays for it|||R2 trả',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Storage cost vs Class A ops for write-heavy app?|||Storage cost vs Class A ops cho write-heavy app?',
            options: [
              'Class A ops may dominate — 10M PUT/mo = $45. Write-heavy needs to optimize batching/dedup, not just storage. Storage 100 GB = $1.50/mo — trivial|||Class A ops có thể dominate — 10M PUT/mo = $45. Write-heavy cần optimize batching/dedup, không chỉ storage. Storage 100 GB = $1.50/mo — trivial',
              'Storage always dominates|||Storage luôn dominate',
              'Free|||Free',
              'Equal|||Bằng nhau',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
