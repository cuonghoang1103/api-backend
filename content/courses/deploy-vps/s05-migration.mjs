const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';

export default {
  title: 'Chapter 5 — The database: migrations and the window between them|||Chương 5 — Cơ sở dữ liệu: migration và cái cửa sổ nằm giữa',
  description: 'Chương chứa những sự cố deploy tệ nhất. Mã và lược đồ được deploy ở hai thời điểm khác nhau, và khoảng giữa hai thời điểm ấy là nơi website vỡ — đo trên PostgreSQL 16.13 thật, kèm cái trạng thái migration kẹt mà chính kho mã này đã từng rơi vào.',
  lessons: [

    /* ─────────────────────────── 5.1 ─────────────────────────── */
    {
      title: '5.1 — Code and schema deploy at different moments|||5.1 — Mã và lược đồ được deploy ở hai thời điểm khác nhau',
      slug: 'deploy-5-1-hai-thoi-diem-khac-nhau',
      type: 'LESSON',
      description: 'Một lệnh đổi tên cột chạy xong trong vài mili giây, và mã cũ vẫn còn chạy thêm vài giây nữa. Bài này đo cái cửa sổ đó, rồi chỉ ra vì sao chính bước tráo không-gián-đoạn ở Chương 3 lại làm nó TỆ HƠN.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Code and schema deploy at different moments</h2>
<p class="lead">Chapter 3 got the swap down to zero dropped requests. That result assumed one thing quietly: that both versions of the application could run at the same time. Add a schema change and that assumption becomes a question — because the database is shared, and only one version of it exists.</p>

<h3>The simplest possible schema change, measured</h3>
<p>Renaming a column. Old code selects <code>email</code>; new code selects <code>dia_chi_email</code>:</p>
<div class="out">── CACH NGAY THO: migration doi ten cot, roi moi deploy ma moi ──
  ── ngay sau migration, ma CU van dang chay: ──
    ERROR:  column "email" does not exist
    LINE 1: select ten, email from nguoi_dung limit 1;
  ── ma MOI (chua deploy xong): ──
    nd1|nd1@x.com

  → CUA SO GIAN DOAN = tu luc migration chay toi luc ma moi phuc vu</div>
<div class="callout warn"><strong>The rename succeeded in milliseconds and broke every request the old code was serving.</strong> Not some requests — every one that touches that table. The outage runs from the instant the migration commits until the last old process stops, and nothing about it is visible in the migration's own output: the migration reported success.</div>

<h3>Zero-downtime deploys make this worse, not better</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The naive swap has a short window</span><span class="lz-d">Stop old, migrate, start new. The old code is already dead when the schema changes, so nothing queries the old shape. You get the outage measured in Lesson 3.1 instead — 168 dropped requests — but no schema mismatch.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The blue-green swap deliberately overlaps them</span><span class="lz-d">Chapter 3's whole technique is running both versions at once. That is exactly the condition under which a renamed column breaks the old one. The better deploy has a <em>longer</em> window of mixed versions, not a shorter one.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">And a rollback re-opens it</span><span class="lz-d">Rolling back the code does not roll back the schema. Going back to the previous release puts old code in front of a new database — the same mismatch, arriving at the worst moment, which is during an incident.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">So the schema must satisfy both versions</span><span class="lz-d">Not "the new one". Both. For as long as both can run — which includes the rollback window, so in practice for at least one deploy cycle after the code change. Lesson 5.2 is the pattern that achieves it.</span></div>
</div>
<div class="callout ok"><strong>The rule the rest of this chapter follows.</strong> Every migration must leave the database in a state where the <em>previous</em> release still works. If that is impossible in one step, it takes more than one deploy — and that is normal, not a failure of planning.</div>

<h3>Which changes are safe on their own</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Safe: adding a nullable column</span><span class="v">Old code does not know it exists and does not select it. New code uses it. No version breaks.</span></div>
  <div class="kv"><span class="k">Safe: adding a new table, a new index</span><span class="v">Nothing that exists refers to it. The only cost is time and locks — Lesson 5.3.</span></div>
  <div class="kv"><span class="k">Unsafe: renaming or dropping anything</span><span class="v">Column, table, constraint. The old code refers to the old name and gets an error, immediately, on every request.</span></div>
  <div class="kv"><span class="k">Unsafe: adding a NOT NULL column without a default</span><span class="v">Old code inserts rows without it and every insert fails. Adding <code>NOT NULL DEFAULT</code> is safe; adding <code>NOT NULL</code> alone is not.</span></div>
  <div class="kv"><span class="k">Unsafe: narrowing a type or adding a constraint</span><span class="v"><code>varchar(255)</code> to <code>varchar(50)</code>, or a new <code>UNIQUE</code>. Old code writes values the new rules reject — and existing rows may already violate them, which is measured in Lesson 5.4.</span></div>
  <div class="kv"><span class="k">Depends: changing a default</span><span class="v">Harmless for old code that supplies the value explicitly; a behaviour change for old code that relies on the default. Which one it is depends on the code, not the schema.</span></div>
</div>

<h3>When the migration runs, relative to everything else</h3>
<pre><code><span class="tok-comment"># thu tu trong mot script deploy — migration nam O DAU?</span>

<span class="tok-comment"># A) TRUOC khi trao (pho bien nhat)</span>
migrate up            <span class="tok-comment"># luoc do doi TRUOC, ma cu VAN dang chay</span>
&lt;trao sang ban moi&gt;   <span class="tok-comment"># → luoc do moi phai chieu duoc MA CU</span>

<span class="tok-comment"># B) SAU khi trao</span>
&lt;trao sang ban moi&gt;   <span class="tok-comment"># ma moi chay TRUOC khi luoc do doi</span>
migrate up            <span class="tok-comment"># → ma moi phai chieu duoc LUOC DO CU</span>

<span class="tok-comment"># C) Nhu MOT BUOC RIENG, khong dinh vao deploy nao</span>
migrate up            <span class="tok-comment"># chay khi ban chon, thuong la truoc — Bai 5.2</span></code></pre>
<div class="pitfall"><strong>Bẫy — there is no ordering that makes an unsafe migration safe.</strong> Running it before the swap breaks the old code; running it after breaks the new code; running it during breaks both in turn. People discover this and conclude they need a maintenance window, which works and costs an outage. The actual answer is that the <em>migration</em> has to change — split into steps that are each individually safe. Ordering only matters once every step already satisfies both versions.</div>

<h3>Why this chapter is the one with the real outages</h3>
<p>Everything before this chapter is recoverable. A bad artifact is replaced by a good one; a failed transport is retried; a broken swap is reversed by moving a symlink back. A migration is different in one specific way: <strong>it changes data</strong>, and Chapter 6 will measure exactly which of those changes can be undone. A dropped column does not come back because you deployed the old code again.</p>
<div class="note-ct">This repository has been in the failed state. A migration failed partway through on a production deploy, leaving the tracking table saying the migration had started and not finished, and every subsequent deploy refused to run — the <code>P3009</code> state. The project's own instructions now say, in capital letters, not to auto-resolve that condition, because the automatic fixes can silently corrupt the schema further. Lesson 5.4 reproduces the state and explains what actually gets you out of it.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — ALTER TABLE and its lock levels</span><span class="lc-sub">postgresql.org/docs/current/sql-altertable.html — which variants rewrite the table and which are metadata-only, measured in Lesson 5.3.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — ParallelChange (expand and contract)</span><span class="lc-sub">martinfowler.com/bliki/ParallelChange.html — the two-page statement of the pattern Lesson 5.2 measures.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — XII. Admin processes</span><span class="lc-sub">12factor.net/admin-processes — running a migration as a one-off process against the same release, which is what makes option C above coherent.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Prisma ORM — migrations, and what the migration table records</span><span class="lc-sub">/courses/prisma-orm/learn${REF} — the tracking table behind the stuck state, and what each of its columns means.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Mã và lược đồ được deploy ở hai thời điểm khác nhau</h2>
<p class="lead">Chương 3 đã đưa bước tráo về không request nào bị rơi. Kết quả đó ngầm giả định MỘT điều: rằng hai phiên bản của ứng dụng CHẠY ĐƯỢC cùng lúc. Thêm một thay đổi lược đồ vào thì cái giả định ấy thành một CÂU HỎI — vì cơ sở dữ liệu là DÙNG CHUNG, và chỉ tồn tại đúng MỘT phiên bản của nó.</p>

<h3>Thay đổi lược đồ đơn giản nhất có thể, đo thật</h3>
<p>Đổi tên một cột. Mã cũ chọn <code>email</code>; mã mới chọn <code>dia_chi_email</code>:</p>
<div class="out">── CACH NGAY THO: migration doi ten cot, roi moi deploy ma moi ──
  ── ngay sau migration, ma CU van dang chay: ──
    ERROR:  column "email" does not exist
    LINE 1: select ten, email from nguoi_dung limit 1;
  ── ma MOI (chua deploy xong): ──
    nd1|nd1@x.com

  → CUA SO GIAN DOAN = tu luc migration chay toi luc ma moi phuc vu</div>
<div class="callout warn"><strong>Lệnh đổi tên thành công trong vài mili giây và làm hỏng MỌI request mà mã cũ đang phục vụ.</strong> Không phải MỘT SỐ request — mà MỌI request có chạm vào bảng đó. Cái gián đoạn chạy từ khoảnh khắc migration được ghi nhận cho tới khi tiến trình cũ CUỐI CÙNG dừng lại, và chẳng có gì trong kết quả của chính migration cho thấy điều đó: migration BÁO THÀNH CÔNG.</div>

<h3>Deploy không-gián-đoạn làm chuyện này TỆ HƠN, không phải tốt hơn</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cú tráo ngây thơ có cửa sổ NGẮN</span><span class="lz-d">Dừng cũ, migrate, khởi động mới. Mã cũ ĐÃ CHẾT sẵn khi lược đồ đổi, nên chẳng có gì truy vấn theo hình dạng cũ. Bạn nhận cái gián đoạn đo ở Bài 3.1 — 168 request rơi — nhưng KHÔNG có lệch lược đồ.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cú tráo xanh-lam CỐ Ý cho chúng chồng lên nhau</span><span class="lz-d">Toàn bộ kỹ thuật của Chương 3 là chạy CẢ HAI phiên bản cùng lúc. Mà đó chính xác là điều kiện để một cột bị đổi tên làm vỡ bản cũ. Lần deploy TỐT HƠN lại có cửa sổ trộn phiên bản DÀI HƠN, chứ không ngắn hơn.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Và một cú lùi bản MỞ LẠI cái cửa sổ đó</span><span class="lz-d">Lùi MÃ không lùi LƯỢC ĐỒ. Quay về bản phát hành trước là đặt mã cũ trước một cơ sở dữ liệu mới — vẫn cái lệch ấy, tới vào đúng thời điểm tệ nhất, tức là giữa một sự cố.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nên lược đồ phải làm hài lòng CẢ HAI phiên bản</span><span class="lz-d">Không phải "phiên bản mới". CẢ HAI. Trong suốt khoảng thời gian cả hai còn có thể chạy — mà khoảng đó bao gồm cả cửa sổ lùi bản, nên trên thực tế là ít nhất một chu kỳ deploy SAU khi mã đã đổi. Bài 5.2 là khuôn mẫu đạt được điều đó.</span></div>
</div>
<div class="callout ok"><strong>Cái luật mà phần còn lại của chương này tuân theo.</strong> Mọi migration đều phải để cơ sở dữ liệu ở một trạng thái mà bản phát hành <em>TRƯỚC ĐÓ</em> vẫn chạy được. Nếu điều đó không làm được trong một bước thì nó cần NHIỀU HƠN một lần deploy — và đó là chuyện BÌNH THƯỜNG, không phải một thất bại về kế hoạch.</div>

<h3>Những thay đổi nào tự thân đã an toàn</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">An toàn: thêm một cột cho phép NULL</span><span class="v">Mã cũ không biết nó tồn tại và không chọn nó. Mã mới thì dùng nó. Không phiên bản nào vỡ.</span></div>
  <div class="kv"><span class="k">An toàn: thêm bảng mới, thêm chỉ mục mới</span><span class="v">Chẳng có gì đang tồn tại tham chiếu tới nó. Cái giá duy nhất là THỜI GIAN và KHOÁ — Bài 5.3.</span></div>
  <div class="kv"><span class="k">KHÔNG an toàn: đổi tên hay xoá bất cứ thứ gì</span><span class="v">Cột, bảng, ràng buộc. Mã cũ tham chiếu tới tên cũ và nhận lỗi, NGAY LẬP TỨC, trên MỌI request.</span></div>
  <div class="kv"><span class="k">KHÔNG an toàn: thêm cột NOT NULL mà không có giá trị mặc định</span><span class="v">Mã cũ chèn dòng mà không có nó và MỌI lệnh chèn đều hỏng. Thêm <code>NOT NULL DEFAULT</code> thì an toàn; thêm mỗi <code>NOT NULL</code> thì không.</span></div>
  <div class="kv"><span class="k">KHÔNG an toàn: thu hẹp kiểu dữ liệu hay thêm ràng buộc</span><span class="v"><code>varchar(255)</code> xuống <code>varchar(50)</code>, hoặc một <code>UNIQUE</code> mới. Mã cũ ghi những giá trị mà luật mới từ chối — và những dòng ĐANG CÓ có thể đã vi phạm sẵn, chuyện được đo ở Bài 5.4.</span></div>
  <div class="kv"><span class="k">Tuỳ: đổi giá trị mặc định</span><span class="v">Vô hại với mã cũ vốn tự cấp giá trị tường minh; là một thay đổi HÀNH VI với mã cũ vốn dựa vào giá trị mặc định. Nó là cái nào thì phụ thuộc vào MÃ, không phụ thuộc vào lược đồ.</span></div>
</div>

<h3>Migration chạy vào lúc nào, so với mọi thứ khác</h3>
<pre><code><span class="tok-comment"># thu tu trong mot script deploy — migration nam O DAU?</span>

<span class="tok-comment"># A) TRUOC khi trao (pho bien nhat)</span>
migrate up            <span class="tok-comment"># luoc do doi TRUOC, ma cu VAN dang chay</span>
&lt;trao sang ban moi&gt;   <span class="tok-comment"># → luoc do moi phai chieu duoc MA CU</span>

<span class="tok-comment"># B) SAU khi trao</span>
&lt;trao sang ban moi&gt;   <span class="tok-comment"># ma moi chay TRUOC khi luoc do doi</span>
migrate up            <span class="tok-comment"># → ma moi phai chieu duoc LUOC DO CU</span>

<span class="tok-comment"># C) Nhu MOT BUOC RIENG, khong dinh vao deploy nao</span>
migrate up            <span class="tok-comment"># chay khi ban chon, thuong la truoc — Bai 5.2</span></code></pre>
<div class="pitfall"><strong>Bẫy — KHÔNG có thứ tự nào làm cho một migration KHÔNG AN TOÀN trở nên an toàn.</strong> Chạy nó trước bước tráo thì vỡ mã cũ; chạy sau thì vỡ mã mới; chạy giữa chừng thì vỡ lần lượt cả hai. Người ta phát hiện ra điều này rồi kết luận rằng phải có một cửa sổ bảo trì, cách đó CHẠY ĐƯỢC và tốn một lần gián đoạn. Câu trả lời THẬT là chính cái <em>MIGRATION</em> phải đổi — tách thành những bước mà từng bước tự nó đã an toàn. Thứ tự chỉ quan trọng KHI mọi bước đã làm hài lòng cả hai phiên bản.</div>

<h3>Vì sao đây là chương chứa những sự cố thật</h3>
<p>Mọi thứ TRƯỚC chương này đều KHÔI PHỤC ĐƯỢC. Một tạo tác hỏng thì thay bằng một cái tốt; một lần vận chuyển hỏng thì thử lại; một cú tráo hỏng thì đảo ngược bằng cách di chuyển symlink về. Migration khác ở đúng MỘT điểm: <strong>nó thay đổi DỮ LIỆU</strong>, và Chương 6 sẽ đo chính xác những thay đổi nào trong số đó hoàn tác được. Một cái cột đã bị xoá KHÔNG quay lại chỉ vì bạn deploy lại mã cũ.</p>
<div class="note-ct">Kho mã này đã từng rơi vào cái trạng thái hỏng đó. Một migration hỏng nửa chừng trên một lần deploy production, để lại bảng theo dõi ghi rằng migration ĐÃ BẮT ĐẦU và CHƯA XONG, và mọi lần deploy sau đó đều từ chối chạy — trạng thái <code>P3009</code>. Chính hướng dẫn của dự án bây giờ ghi bằng chữ in hoa rằng ĐỪNG tự động gỡ cái tình trạng đó, vì mấy cách sửa tự động có thể âm thầm làm hỏng lược đồ thêm nữa. Bài 5.4 tái hiện lại trạng thái ấy và nói cái gì mới THẬT SỰ đưa bạn ra khỏi nó.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — ALTER TABLE và các mức khoá của nó</span><span class="lc-sub">postgresql.org/docs/current/sql-altertable.html — biến thể nào ghi lại cả bảng và biến thể nào chỉ đụng siêu dữ liệu, đo ở Bài 5.3.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — ParallelChange (mở rộng và thu hẹp)</span><span class="lc-sub">martinfowler.com/bliki/ParallelChange.html — phát biểu hai trang của khuôn mẫu mà Bài 5.2 đem đi đo.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — XII. Admin processes</span><span class="lc-sub">12factor.net/admin-processes — chạy migration như một tiến trình một-lần trên cùng bản phát hành, và đó là thứ làm cho phương án C ở trên mạch lạc.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Prisma ORM — migration, và bảng theo dõi ghi lại những gì</span><span class="lc-sub">/courses/prisma-orm/learn${REF} — cái bảng theo dõi nằm sau trạng thái kẹt, và mỗi cột của nó nghĩa là gì.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.2 ─────────────────────────── */
    {
      title: '5.2 — Expand and contract: the rename that never breaks|||5.2 — Mở rộng và thu hẹp: cú đổi tên không bao giờ làm vỡ',
      slug: 'deploy-5-2-mo-rong-thu-hep',
      type: 'LESSON',
      description: 'Cùng cú đổi tên cột đã làm vỡ mọi request ở Bài 5.1, làm lại theo bốn giai đoạn. Đo cả bốn: có một giai đoạn mà mã CŨ ghi một dòng và mã MỚI đọc được nó ngay.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Expand and contract: the rename that never breaks</h2>
<p class="lead">Lesson 5.1 measured a column rename breaking every request. The fix is not a cleverer rename — it is refusing to rename at all, and instead going through a state where <em>both</em> names exist. Four phases, four deploys, and no moment where either version is broken.</p>

<h3>The four phases, measured</h3>
<div class="out">── GD1: truoc khi bat dau ──
    ma CU:  nd1|nd1@x.com
    ma MOI: ERROR:  column "dia_chi_email" does not exist

── GD2: THEM cot moi + dong bo (migration nay AN TOAN voi ma cu) ──
    ma CU:  nd1|nd1@x.com
    ma MOI: nd1|nd1@x.com
  ma CU ghi mot dong moi, loi? 0
  → ma MOI doc duoc dong do khong: nd_cu@x.com

── GD3: deploy ma MOI (doc/ghi cot moi). Ca hai cung chay ──
    ma CU:  nd1|nd1@x.com
    ma MOI: nd1|nd1@x.com

── GD4: THU HEP — bo cot cu, sau khi khong con ma cu nao ──
    ma CU:  ERROR:  column "email" does not exist
    ma MOI: nd1|nd1@x.com</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Phase 2 is a schema change with no code change</span><span class="v">Add the column, copy the data, add a trigger to keep them in sync. Old code keeps working because nothing it uses was touched — and new code would already work if it were deployed.</span></div>
  <div class="kv"><span class="k">The measured line that matters</span><span class="v">Old code inserted a row (<code>loi? 0</code> — no error) and new code read <code>nd_cu@x.com</code> out of the <em>new</em> column. The trigger filled it in. During the overlap, writes from either version are visible to both.</span></div>
  <div class="kv"><span class="k">Phase 3 is a code change with no schema change</span><span class="v">Deploy the new release. Both columns still exist, both versions still work, and the rollback target is still valid.</span></div>
  <div class="kv"><span class="k">Phase 4 is the only destructive step</span><span class="v">And by the time it runs, no code refers to the old column. The error it produces for old code is correct — old code is not supposed to exist any more.</span></div>
</div>

<h3>The migration for phase 2</h3>
<pre><code><span class="tok-comment">-- 1. them cot moi (cho NULL — an toan voi ma cu)</span>
alter table nguoi_dung add column dia_chi_email text;

<span class="tok-comment">-- 2. chep du lieu dang co</span>
update nguoi_dung set dia_chi_email = email;

<span class="tok-comment">-- 3. giu hai cot dong bo, du BEN NAO ghi</span>
create or replace function dong_bo() returns trigger as \$\$
  begin
    if NEW.dia_chi_email is null then NEW.dia_chi_email := NEW.email; end if;
    if NEW.email is null then NEW.email := NEW.dia_chi_email; end if;
    return NEW;
  end
\$\$ language plpgsql;

create trigger tg_dong_bo before insert or update on nguoi_dung
  for each row execute function dong_bo();</code></pre>
<div class="callout ok"><strong>The trigger is what makes the overlap safe in both directions.</strong> Without it, old code writing to <code>email</code> leaves <code>dia_chi_email</code> null, and new code sees a row with no address. The measurement above confirms it works: a row written by old code was immediately readable by new code. Application-level double-writing is the alternative and it is worse — it only covers the version that has the double-write, so the <em>other</em> version's writes are still missed.</div>
<div class="pitfall"><strong>Bẫy — step 2 is an <code>UPDATE</code> over the whole table, and on a large table it is not free.</strong> A single <code>update ... set x = y</code> across ten million rows takes a long lock and writes a new version of every row, which can bloat the table and stall writes. Batch it — a few thousand rows at a time, in a loop with a short pause — and let the trigger handle everything written while the backfill runs. Lesson 5.3 measures the timings that make this concrete.</div>

<h3>The same shape, for other changes</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Making a column NOT NULL</span><span class="lz-lnote">Expand: add a <code>DEFAULT</code> so old inserts get a value. Backfill the nulls. Deploy code that always supplies it. Contract: add the <code>NOT NULL</code>. In Postgres, add it as <code>NOT VALID</code> first and validate separately — Lesson 5.3.</span></div>
  <div class="lz-layer"><span class="lz-lname">Splitting one column into two</span><span class="lz-lnote">Add both new columns, backfill from the old, trigger to keep all three in sync, deploy code that reads the new pair, then drop the old. Three names alive at once, briefly.</span></div>
  <div class="lz-layer"><span class="lz-lname">Changing a column type</span><span class="lz-lnote">Add a new column of the new type rather than altering in place — an <code>ALTER TYPE</code> rewrites the table under a lock and cannot be reversed cheaply. Same four phases.</span></div>
  <div class="lz-layer"><span class="lz-lname">Moving a column to another table</span><span class="lz-lnote">The same pattern with a join instead of a column read, and the trigger writing across tables. Longer, and no different in shape.</span></div>
</div>

<h3>What it costs</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Four deploys instead of one</span><span class="lz-d">Spread over days, because phase 4 must wait until no old release could be rolled back to. This is the real cost, and it is why people skip it for "small" changes and then have the outage.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">A period where the schema is untidy</span><span class="lz-d">Two columns holding the same thing, plus a trigger. It looks like a mistake to anyone reading the schema, so write down why it is there and when phase 4 happens — a comment on the column works: <code>comment on column … is 'tam thoi, bo o GD4 sau 2026-09-01'</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Phase 4 gets forgotten</span><span class="lz-d">The common failure. The system works after phase 3, so nobody is motivated to finish. Two years later the table has six abandoned columns and three triggers, and nobody knows which are live. Schedule phase 4 when you write phase 2.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">In exchange: every phase is individually reversible</span><span class="lz-d">Which is the point. At no step does rolling back the code leave the database in a shape the previous version cannot read — the property Lesson 5.1 established as the rule.</span></div>
</div>
<div class="note-ct">For a project with one developer and no traffic at 3 a.m., a maintenance window is a legitimate alternative: stop the app, migrate, start it. Two minutes of downtime, one deploy, no trigger. The reason to know expand–contract anyway is that "we have no traffic right now" stops being true at some point, usually without a decision being made about it — and the pattern is much easier to learn before you need it than during.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — ParallelChange</span><span class="lc-sub">martinfowler.com/bliki/ParallelChange.html — expand, migrate, contract, stated in two pages and applicable well beyond databases.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — CREATE TRIGGER</span><span class="lc-sub">postgresql.org/docs/current/sql-createtrigger.html — <code>BEFORE INSERT OR UPDATE ... FOR EACH ROW</code>, which is the exact form the sync trigger needs.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — COMMENT ON</span><span class="lc-sub">postgresql.org/docs/current/sql-comment.html — attaching the "this is temporary, remove after" note to the schema itself rather than to a ticket.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — triggers, and what BEFORE gives you that AFTER does not</span><span class="lc-sub">/courses/postgresql/learn${REF} — why the sync trigger must be BEFORE to modify the row being written.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Mở rộng và thu hẹp: cú đổi tên không bao giờ làm vỡ</h2>
<p class="lead">Bài 5.1 đã đo một cú đổi tên cột làm vỡ mọi request. Cách sửa KHÔNG phải một cú đổi tên khôn ngoan hơn — mà là TỪ CHỐI đổi tên hẳn, và thay vào đó đi qua một trạng thái mà <em>CẢ HAI</em> cái tên cùng tồn tại. Bốn giai đoạn, bốn lần deploy, và không có khoảnh khắc nào mà một trong hai phiên bản bị vỡ.</p>

<h3>Bốn giai đoạn, đo thật</h3>
<div class="out">── GD1: truoc khi bat dau ──
    ma CU:  nd1|nd1@x.com
    ma MOI: ERROR:  column "dia_chi_email" does not exist

── GD2: THEM cot moi + dong bo (migration nay AN TOAN voi ma cu) ──
    ma CU:  nd1|nd1@x.com
    ma MOI: nd1|nd1@x.com
  ma CU ghi mot dong moi, loi? 0
  → ma MOI doc duoc dong do khong: nd_cu@x.com

── GD3: deploy ma MOI (doc/ghi cot moi). Ca hai cung chay ──
    ma CU:  nd1|nd1@x.com
    ma MOI: nd1|nd1@x.com

── GD4: THU HEP — bo cot cu, sau khi khong con ma cu nao ──
    ma CU:  ERROR:  column "email" does not exist
    ma MOI: nd1|nd1@x.com</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Giai đoạn 2 là thay đổi LƯỢC ĐỒ mà KHÔNG đổi mã</span><span class="v">Thêm cột, chép dữ liệu, thêm một trigger giữ hai bên đồng bộ. Mã cũ vẫn chạy vì chẳng thứ gì nó dùng bị đụng tới — và mã mới thì đã chạy được rồi NẾU nó được deploy.</span></div>
  <div class="kv"><span class="k">Dòng đo quan trọng nhất</span><span class="v">Mã CŨ chèn một dòng (<code>loi? 0</code> — không lỗi) và mã MỚI đọc ra <code>nd_cu@x.com</code> từ cột <em>MỚI</em>. Cái trigger đã điền vào. Trong khoảng chồng lấn, lệnh ghi từ phiên bản nào cũng nhìn thấy được ở cả hai bên.</span></div>
  <div class="kv"><span class="k">Giai đoạn 3 là thay đổi MÃ mà KHÔNG đổi lược đồ</span><span class="v">Deploy bản mới. Cả hai cột vẫn còn, cả hai phiên bản vẫn chạy, và cái đích lùi bản vẫn còn hợp lệ.</span></div>
  <div class="kv"><span class="k">Giai đoạn 4 là bước PHÁ HUỶ duy nhất</span><span class="v">Và tới lúc nó chạy thì chẳng còn mã nào tham chiếu cột cũ. Cái lỗi nó sinh ra cho mã cũ là ĐÚNG — mã cũ lẽ ra không còn tồn tại nữa.</span></div>
</div>

<h3>Migration cho giai đoạn 2</h3>
<pre><code><span class="tok-comment">-- 1. them cot moi (cho NULL — an toan voi ma cu)</span>
alter table nguoi_dung add column dia_chi_email text;

<span class="tok-comment">-- 2. chep du lieu dang co</span>
update nguoi_dung set dia_chi_email = email;

<span class="tok-comment">-- 3. giu hai cot dong bo, du BEN NAO ghi</span>
create or replace function dong_bo() returns trigger as \$\$
  begin
    if NEW.dia_chi_email is null then NEW.dia_chi_email := NEW.email; end if;
    if NEW.email is null then NEW.email := NEW.dia_chi_email; end if;
    return NEW;
  end
\$\$ language plpgsql;

create trigger tg_dong_bo before insert or update on nguoi_dung
  for each row execute function dong_bo();</code></pre>
<div class="callout ok"><strong>Cái trigger mới là thứ làm cho khoảng chồng lấn an toàn theo CẢ HAI CHIỀU.</strong> Thiếu nó thì mã cũ ghi vào <code>email</code> sẽ để <code>dia_chi_email</code> rỗng, và mã mới nhìn thấy một dòng không có địa chỉ. Phép đo ở trên xác nhận nó chạy: một dòng do mã cũ ghi ra thì mã mới ĐỌC ĐƯỢC NGAY. Phương án thay thế là ghi-đôi ở tầng ứng dụng, và nó TỆ HƠN — nó chỉ phủ được cái phiên bản CÓ đoạn ghi-đôi, nên lệnh ghi của phiên bản KIA vẫn bị bỏ sót.</div>
<div class="pitfall"><strong>Bẫy — bước 2 là một lệnh <code>UPDATE</code> trên TOÀN BỘ bảng, và trên một bảng lớn thì nó không miễn phí.</strong> Một lệnh <code>update ... set x = y</code> chạy qua mười triệu dòng sẽ giữ khoá lâu và ghi ra một phiên bản mới của MỌI dòng, làm bảng phình lên và làm nghẽn các lệnh ghi. Hãy CHIA LÔ — vài nghìn dòng một lần, trong một vòng lặp có nghỉ ngắn — và để cái trigger lo mọi thứ được ghi trong lúc lấp dữ liệu chạy. Bài 5.3 đo những con số làm chuyện này thành cụ thể.</div>

<h3>Cùng hình dạng đó, cho những thay đổi khác</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Biến một cột thành NOT NULL</span><span class="lz-lnote">Mở rộng: thêm một <code>DEFAULT</code> để lệnh chèn của mã cũ có giá trị. Lấp đầy các ô null. Deploy mã luôn tự cấp giá trị. Thu hẹp: thêm ràng buộc <code>NOT NULL</code>. Trong Postgres, hãy thêm nó dạng <code>NOT VALID</code> trước rồi mới xác thực riêng — Bài 5.3.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tách một cột thành hai</span><span class="lz-lnote">Thêm cả hai cột mới, lấp từ cột cũ, trigger giữ cả BA đồng bộ, deploy mã đọc cặp mới, rồi bỏ cột cũ. Ba cái tên cùng sống một lúc, trong chốc lát.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đổi kiểu dữ liệu của một cột</span><span class="lz-lnote">Thêm một cột MỚI mang kiểu mới chứ đừng sửa tại chỗ — một lệnh <code>ALTER TYPE</code> ghi lại cả bảng dưới một cái khoá và không đảo ngược lại rẻ được. Vẫn bốn giai đoạn đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chuyển một cột sang bảng khác</span><span class="lz-lnote">Vẫn khuôn mẫu đó, chỉ thay việc đọc cột bằng một phép nối bảng, và trigger thì ghi xuyên bảng. Dài hơn, và không khác gì về hình dạng.</span></div>
</div>

<h3>Nó tốn gì</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bốn lần deploy thay vì một</span><span class="lz-d">Trải ra nhiều ngày, vì giai đoạn 4 phải CHỜ tới khi không còn bản phát hành cũ nào có thể bị lùi về. Đây mới là cái giá thật, và nó là lý do người ta bỏ qua nó với những thay đổi "nhỏ" rồi lãnh trọn cái gián đoạn.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Một khoảng thời gian lược đồ trông LUỘM THUỘM</span><span class="lz-d">Hai cột giữ cùng một thứ, cộng một cái trigger. Với bất cứ ai đọc lược đồ thì nó TRÔNG như một sai sót, nên hãy ghi lại vì sao nó ở đó và khi nào giai đoạn 4 xảy ra — một chú thích trên cột là đủ: <code>comment on column … is 'tam thoi, bo o GD4 sau 2026-09-01'</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Giai đoạn 4 bị QUÊN</span><span class="lz-d">Kiểu hỏng phổ biến. Hệ thống chạy ngon sau giai đoạn 3, nên chẳng ai có động lực làm nốt. Hai năm sau cái bảng có sáu cột bỏ hoang và ba cái trigger, và chẳng ai biết cái nào còn sống. Hãy lên lịch cho giai đoạn 4 NGAY LÚC bạn viết giai đoạn 2.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Đổi lại: MỌI giai đoạn đều tự nó đảo ngược được</span><span class="lz-d">Mà đó chính là mục đích. Không ở bước nào việc lùi mã lại để cơ sở dữ liệu ở một hình dạng mà phiên bản trước đọc không nổi — đúng cái tính chất mà Bài 5.1 đã đặt thành luật.</span></div>
</div>
<div class="note-ct">Với một dự án chỉ có một lập trình viên và không có lưu lượng lúc 3 giờ sáng thì một cửa sổ bảo trì là phương án hợp lệ: dừng ứng dụng, migrate, khởi động lại. Hai phút gián đoạn, một lần deploy, không cần trigger. Lý do vẫn nên biết mở-rộng–thu-hẹp là cái câu "giờ chúng ta chẳng có lưu lượng nào" sẽ thôi đúng vào một lúc nào đó, mà thường là chẳng ai ra quyết định gì về chuyện ấy cả — và khuôn mẫu này học TRƯỚC khi cần thì dễ hơn hẳn học ĐANG LÚC cần.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — ParallelChange</span><span class="lc-sub">martinfowler.com/bliki/ParallelChange.html — mở rộng, chuyển, thu hẹp, phát biểu trong hai trang và áp dụng được xa hơn hẳn phạm vi cơ sở dữ liệu.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — CREATE TRIGGER</span><span class="lc-sub">postgresql.org/docs/current/sql-createtrigger.html — dạng <code>BEFORE INSERT OR UPDATE ... FOR EACH ROW</code>, đúng dạng mà trigger đồng bộ cần.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — COMMENT ON</span><span class="lc-sub">postgresql.org/docs/current/sql-comment.html — gắn cái ghi chú "tạm thời, bỏ sau ngày…" vào chính lược đồ chứ không vào một cái ticket.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — trigger, và BEFORE cho bạn thứ mà AFTER không có</span><span class="lc-sub">/courses/postgresql/learn${REF} — vì sao trigger đồng bộ BẮT BUỘC phải là BEFORE mới sửa được cái dòng đang được ghi.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.3 ─────────────────────────── */
    {
      title: '5.3 — Locks: the migration that takes the table with it|||5.3 — Khoá: cái migration kéo cả cái bảng đi theo',
      slug: 'deploy-5-3-khoa-va-thoi-gian',
      type: 'LESSON',
      description: 'Ba lệnh ADD COLUMN trên cùng một bảng 400.000 dòng: 53 ms, 37 ms, và 2.606 ms. Bài này đo vì sao cái thứ ba chậm hơn 49 lần, rồi đo xem trong lúc nó chạy thì các lệnh ghi khác ra sao.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Locks: the migration that takes the table with it</h2>
<p class="lead">A migration that is <em>safe</em> in the Lesson 5.1 sense can still take a production database down, for a completely different reason: it holds a lock, and everything else queues behind it. The difference between a harmless migration and an outage is often one word in the statement.</p>

<h3>Three <code>ADD COLUMN</code> statements, one table</h3>
<p>A table with 400,000 rows, 101 MB on disk:</p>
<div class="out">════ 1) ALTER TABLE ... ADD COLUMN (khong mac dinh) ════
    53 ms
════ 2) ADD COLUMN ... DEFAULT (hang so) — Postgres 11+ ════
    37 ms
════ 3) ADD COLUMN ... DEFAULT (HAM BIEN THIEN) ════
    2606 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The first two are metadata only</span><span class="v">53 ms and 37 ms on a 101 MB table — the size is irrelevant because no row is touched. Since PostgreSQL 11, a constant default is recorded in the catalogue and applied on read.</span></div>
  <div class="kv"><span class="k">The third rewrites every row</span><span class="v">2,606 ms — forty-nine times slower. <code>gen_random_uuid()</code> is volatile, so every row needs its own value, so every row is written.</span></div>
  <div class="kv"><span class="k">The statements look almost identical</span><span class="v"><code>DEFAULT 'mac-dinh'</code> against <code>DEFAULT gen_random_uuid()</code>. One is instant on any table; the other scales with your data.</span></div>
  <div class="kv"><span class="k">And 400,000 rows is small</span><span class="v">Multiply by twenty-five for ten million rows: about a minute of the table being unavailable. That is the shape of the incident.</span></div>
</div>
<div class="callout warn"><strong>The Postgres 11 change is why old advice is wrong.</strong> Guidance written before 2018 says never to add a column with a default because it rewrites the table — true then, false now for a <em>constant</em> default. Still true for a volatile one. Check your version and check whether the default is constant, rather than following a rule whose reason has expired.</div>

<h3>What "holds a lock" means for your users</h3>
<p>The same 2.6-second migration, with writes running against the table throughout:</p>
<div class="out">════ A) khong co migration nao chay — moc doi chieu ════
    ghi OK: 60   bi CHAN/het gio:  0   (trong 2179 ms)

════ B) trong luc ALTER TABLE ADD COLUMN DEFAULT gen_random_uuid() ════
    ghi OK: 55   bi CHAN/het gio:  5   (trong 4742 ms)</div>
<p>Five writes hit their half-second timeout and failed. The batch that took 2,179 ms with no migration took 4,742 ms during one — more than twice as long, because writes were queuing behind the lock rather than executing.</p>
<div class="pitfall"><strong>Bẫy — <code>ALTER TABLE</code> takes an <code>ACCESS EXCLUSIVE</code> lock, which conflicts with <em>everything</em>, including <code>SELECT</code>.</strong> Not just writes — reads too. And the lock is taken at the <em>start</em> of the statement and held until it commits, so a two-second rewrite is two seconds during which the table does not exist as far as your application is concerned. Worse: the <code>ALTER</code> must first <em>wait</em> for existing transactions on the table to finish, and while it waits, every new query queues behind it. One long-running <code>SELECT</code> can turn a fast migration into a total stall — the migration waits for the query, and everything else waits for the migration.</div>
<pre><code><span class="tok-comment">-- chan viec cho khoa VO HAN: tha hong nhanh con hon lam nghen ca bang</span>
SET lock_timeout = '3s';
ALTER TABLE lon ADD COLUMN moi text;

<span class="tok-comment">-- va gioi han thoi gian chay cua chinh lenh do</span>
SET statement_timeout = '30s';</code></pre>
<div class="callout ok"><strong><code>lock_timeout</code> is the single most valuable line in a migration file.</strong> Without it, a migration that cannot get its lock waits indefinitely <em>while blocking every query behind it</em> — the classic "the site went down and the migration had not even started" incident. With it, the migration fails after three seconds, nothing is blocked for longer than that, and you retry when the long transaction has finished.</div>

<h3>The operations worth knowing the lock level of</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Metadata only — instant at any size</span><span class="lz-lnote"><code>ADD COLUMN</code> without a default, or with a constant default (PG 11+). <code>DROP COLUMN</code> — the data stays on disk but the column is gone logically. Renames. All still take <code>ACCESS EXCLUSIVE</code>, so they still need <code>lock_timeout</code> — they just hold it briefly.</span></div>
  <div class="lz-layer"><span class="lz-lname">Rewrites the table — scales with rows</span><span class="lz-lnote"><code>ADD COLUMN</code> with a volatile default (measured: 2,606 ms), most <code>ALTER COLUMN TYPE</code>, <code>SET NOT NULL</code> on a large table. Assume minutes, not seconds, on real data.</span></div>
  <div class="lz-layer"><span class="lz-lname">Blocks writes but not reads</span><span class="lz-lnote"><code>CREATE INDEX</code> takes a <code>SHARE</code> lock: <code>SELECT</code> continues, <code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code> wait. <code>CREATE INDEX CONCURRENTLY</code> avoids that, at the cost of two table scans and an inability to run inside a transaction.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cheap in two steps</span><span class="lz-lnote">Adding a constraint: <code>ADD CONSTRAINT ... NOT VALID</code> is instant and applies to new rows, then <code>VALIDATE CONSTRAINT</code> scans existing rows under a weaker lock. Two statements, no outage — instead of one statement that locks the table for the length of a full scan.</span></div>
</div>
<div class="note-ct">An honest note about one measurement in this lesson: an attempt to show <code>CREATE INDEX</code> blocking writes found nothing — 25 of 25 writes succeeded under both the plain and the <code>CONCURRENTLY</code> form. The index built in about 600 ms, faster than the probe could sample meaningfully, so the test proved only that the operation was short. The blocking measurement above uses the 2.6-second <code>ALTER</code> instead, where the effect is large enough to see. A benchmark that finds nothing because the operation was too fast is not evidence that nothing happens.</div>

<h3>The checklist before running a migration on production</h3>
<pre><code><span class="tok-comment">-- 1. co giao dich nao dang chay lau khong? (chung se CHAN migration)</span>
select pid, now()-xact_start as lau, left(query,60)
from pg_stat_activity
where xact_start is not null and now()-xact_start &gt; interval '30 seconds'
order by lau desc;

<span class="tok-comment">-- 2. bang to co nao? (quyet dinh giua "tuc thi" va "vai phut")</span>
select relname, n_live_tup, pg_size_pretty(pg_total_relation_size(relid))
from pg_stat_user_tables order by n_live_tup desc limit 5;

<span class="tok-comment">-- 3. trong luc migration chay: ai dang cho ai?</span>
select pid, wait_event_type, wait_event, left(query,50)
from pg_stat_activity where wait_event_type = 'Lock';</code></pre>
<div class="note-ct">Query 1 is the one to run <em>before</em> every migration. A transaction that has been open for twenty minutes — an idle-in-transaction connection from a crashed job, a report someone is running — will block your <code>ALTER TABLE</code>, and your <code>ALTER TABLE</code> will block the entire application. Finding it first turns a potential outage into a thirty-second wait for someone to close a laptop.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — Explicit Locking, the conflict matrix</span><span class="lc-sub">postgresql.org/docs/current/explicit-locking.html — the table showing which lock modes conflict, which is the reference for everything above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL 11 release notes — ADD COLUMN with a default</span><span class="lc-sub">postgresql.org/docs/11/release-11.html — the change that made half the old advice obsolete.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">strong_migrations — the list of unsafe operations</span><span class="lc-sub">github.com/ankane/strong_migrations — a Rails gem whose README is the best plain-language catalogue of dangerous migrations and their safe replacements, regardless of language.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — locks, MVCC and pg_stat_activity</span><span class="lc-sub">/courses/postgresql/learn${REF} — why a reader does not block a writer, and why <code>ALTER TABLE</code> is the exception that blocks both.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Khoá: cái migration kéo cả cái bảng đi theo</h2>
<p class="lead">Một migration <em>AN TOÀN</em> theo nghĩa của Bài 5.1 vẫn có thể làm sập một cơ sở dữ liệu production, vì một lý do hoàn toàn khác: nó GIỮ MỘT CÁI KHOÁ, và mọi thứ khác xếp hàng phía sau. Khác biệt giữa một migration vô hại và một sự cố thường chỉ là MỘT TỪ trong câu lệnh.</p>

<h3>Ba câu lệnh <code>ADD COLUMN</code>, một cái bảng</h3>
<p>Một bảng 400.000 dòng, 101 MB trên đĩa:</p>
<div class="out">════ 1) ALTER TABLE ... ADD COLUMN (khong mac dinh) ════
    53 ms
════ 2) ADD COLUMN ... DEFAULT (hang so) — Postgres 11+ ════
    37 ms
════ 3) ADD COLUMN ... DEFAULT (HAM BIEN THIEN) ════
    2606 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hai cái đầu chỉ đụng SIÊU DỮ LIỆU</span><span class="v">53 ms và 37 ms trên một bảng 101 MB — kích thước KHÔNG liên quan vì chẳng dòng nào bị đụng tới. Từ PostgreSQL 11, một giá trị mặc định HẰNG SỐ được ghi vào danh mục và áp dụng lúc ĐỌC.</span></div>
  <div class="kv"><span class="k">Cái thứ ba ghi lại MỌI dòng</span><span class="v">2.606 ms — chậm hơn bốn mươi chín lần. <code>gen_random_uuid()</code> là hàm biến thiên, nên mỗi dòng cần giá trị riêng, nên mỗi dòng đều bị ghi.</span></div>
  <div class="kv"><span class="k">Hai câu lệnh trông GẦN NHƯ giống hệt</span><span class="v"><code>DEFAULT 'mac-dinh'</code> so với <code>DEFAULT gen_random_uuid()</code>. Một cái tức thì trên mọi cỡ bảng; cái kia thì tăng theo dữ liệu của bạn.</span></div>
  <div class="kv"><span class="k">Và 400.000 dòng là NHỎ</span><span class="v">Nhân hai mươi lăm lần cho mười triệu dòng: khoảng một PHÚT mà cái bảng không dùng được. Đó chính là hình dạng của sự cố.</span></div>
</div>
<div class="callout warn"><strong>Cái thay đổi ở Postgres 11 là lý do lời khuyên cũ giờ SAI.</strong> Hướng dẫn viết trước 2018 nói đừng bao giờ thêm cột kèm giá trị mặc định vì nó ghi lại cả bảng — ĐÚNG hồi đó, SAI bây giờ với giá trị mặc định <em>HẰNG SỐ</em>. Vẫn đúng với hàm biến thiên. Hãy kiểm phiên bản của bạn và kiểm xem giá trị mặc định có phải hằng số không, thay vì đi theo một cái luật mà lý do của nó đã hết hạn.</div>

<h3>"Giữ một cái khoá" nghĩa là gì với người dùng của bạn</h3>
<p>Vẫn cái migration 2,6 giây đó, với các lệnh ghi chạy vào bảng suốt thời gian ấy:</p>
<div class="out">════ A) khong co migration nao chay — moc doi chieu ════
    ghi OK: 60   bi CHAN/het gio:  0   (trong 2179 ms)

════ B) trong luc ALTER TABLE ADD COLUMN DEFAULT gen_random_uuid() ════
    ghi OK: 55   bi CHAN/het gio:  5   (trong 4742 ms)</div>
<p>Năm lệnh ghi chạm hạn nửa giây và HỎNG. Cái lô mất 2.179 ms khi không có migration thì mất 4.742 ms khi có một cái — hơn GẤP ĐÔI, vì các lệnh ghi đang XẾP HÀNG sau cái khoá chứ không được thực thi.</p>
<div class="pitfall"><strong>Bẫy — <code>ALTER TABLE</code> lấy khoá <code>ACCESS EXCLUSIVE</code>, thứ xung đột với <em>MỌI THỨ</em>, kể cả <code>SELECT</code>.</strong> Không chỉ lệnh ghi — cả lệnh đọc. Và cái khoá được lấy ngay ở ĐẦU câu lệnh rồi giữ tới khi nó được ghi nhận, nên một lần ghi lại bảng mất hai giây là hai giây mà cái bảng KHÔNG TỒN TẠI dưới góc nhìn của ứng dụng bạn. Tệ hơn: lệnh <code>ALTER</code> trước hết phải <em>CHỜ</em> các giao dịch đang có trên bảng kết thúc, và TRONG LÚC NÓ CHỜ thì mọi truy vấn mới đều xếp hàng phía sau nó. Một lệnh <code>SELECT</code> chạy lâu có thể biến một migration nhanh thành một cú nghẽn toàn tập — migration chờ cái truy vấn, và mọi thứ khác chờ migration.</div>
<pre><code><span class="tok-comment">-- chan viec cho khoa VO HAN: tha hong nhanh con hon lam nghen ca bang</span>
SET lock_timeout = '3s';
ALTER TABLE lon ADD COLUMN moi text;

<span class="tok-comment">-- va gioi han thoi gian chay cua chinh lenh do</span>
SET statement_timeout = '30s';</code></pre>
<div class="callout ok"><strong><code>lock_timeout</code> là dòng giá trị nhất trong một tệp migration.</strong> Thiếu nó, một migration không lấy được khoá sẽ chờ VÔ HẠN <em>trong lúc chặn mọi truy vấn phía sau nó</em> — đúng cái sự cố kinh điển "website sập mà migration còn chưa kịp bắt đầu". Có nó, migration hỏng sau ba giây, không thứ gì bị chặn lâu hơn chừng đó, và bạn thử lại khi cái giao dịch dài kia đã xong.</div>

<h3>Những thao tác đáng biết mức khoá của chúng</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Chỉ siêu dữ liệu — tức thì ở mọi cỡ</span><span class="lz-lnote"><code>ADD COLUMN</code> không kèm mặc định, hoặc kèm mặc định hằng số (PG 11+). <code>DROP COLUMN</code> — dữ liệu vẫn nằm trên đĩa nhưng cột thì biến mất về mặt logic. Đổi tên. Tất cả VẪN lấy <code>ACCESS EXCLUSIVE</code>, nên vẫn cần <code>lock_timeout</code> — chỉ là chúng giữ nó rất ngắn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Ghi lại cả bảng — tăng theo số dòng</span><span class="lz-lnote"><code>ADD COLUMN</code> kèm mặc định biến thiên (đo được: 2.606 ms), phần lớn <code>ALTER COLUMN TYPE</code>, <code>SET NOT NULL</code> trên bảng lớn. Hãy tính bằng PHÚT chứ không phải giây, trên dữ liệu thật.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chặn GHI nhưng không chặn ĐỌC</span><span class="lz-lnote"><code>CREATE INDEX</code> lấy khoá <code>SHARE</code>: <code>SELECT</code> chạy tiếp, còn <code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code> thì chờ. <code>CREATE INDEX CONCURRENTLY</code> né được chuyện đó, đổi lại là hai lượt quét bảng và không chạy được bên trong một giao dịch.</span></div>
  <div class="lz-layer"><span class="lz-lname">Rẻ nếu chia làm hai bước</span><span class="lz-lnote">Thêm một ràng buộc: <code>ADD CONSTRAINT ... NOT VALID</code> là tức thì và áp cho dòng MỚI, rồi <code>VALIDATE CONSTRAINT</code> quét các dòng đang có dưới một cái khoá YẾU HƠN. Hai câu lệnh, không gián đoạn — thay vì một câu lệnh khoá cả bảng suốt độ dài một lượt quét toàn bảng.</span></div>
</div>
<div class="note-ct">Một ghi chú trung thực về một phép đo trong bài này: một nỗ lực chứng minh <code>CREATE INDEX</code> chặn lệnh ghi đã KHÔNG tìm thấy gì — 25 trên 25 lệnh ghi đều thành công ở cả dạng thường lẫn dạng <code>CONCURRENTLY</code>. Cái chỉ mục dựng xong trong khoảng 600 ms, nhanh hơn khả năng lấy mẫu có ý nghĩa của phép thử, nên phép thử chỉ chứng minh được rằng thao tác đó NGẮN. Phép đo chặn ở trên dùng lệnh <code>ALTER</code> 2,6 giây thay thế, chỗ mà hiệu ứng đủ lớn để nhìn thấy. Một phép đo không tìm ra gì vì thao tác quá nhanh thì KHÔNG phải bằng chứng rằng không có gì xảy ra.</div>

<h3>Danh mục kiểm trước khi chạy một migration trên production</h3>
<pre><code><span class="tok-comment">-- 1. co giao dich nao dang chay lau khong? (chung se CHAN migration)</span>
select pid, now()-xact_start as lau, left(query,60)
from pg_stat_activity
where xact_start is not null and now()-xact_start &gt; interval '30 seconds'
order by lau desc;

<span class="tok-comment">-- 2. bang to co nao? (quyet dinh giua "tuc thi" va "vai phut")</span>
select relname, n_live_tup, pg_size_pretty(pg_total_relation_size(relid))
from pg_stat_user_tables order by n_live_tup desc limit 5;

<span class="tok-comment">-- 3. trong luc migration chay: ai dang cho ai?</span>
select pid, wait_event_type, wait_event, left(query,50)
from pg_stat_activity where wait_event_type = 'Lock';</code></pre>
<div class="note-ct">Truy vấn 1 là truy vấn nên chạy <em>TRƯỚC</em> mọi migration. Một giao dịch đã mở suốt hai mươi phút — một kết nối idle-in-transaction từ một job đã chết, một bản báo cáo ai đó đang chạy — sẽ CHẶN lệnh <code>ALTER TABLE</code> của bạn, và lệnh <code>ALTER TABLE</code> của bạn sẽ chặn TOÀN BỘ ứng dụng. Tìm ra nó trước sẽ biến một sự cố tiềm tàng thành ba mươi giây chờ ai đó gập laptop lại.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — Explicit Locking, bảng ma trận xung đột</span><span class="lc-sub">postgresql.org/docs/current/explicit-locking.html — cái bảng cho thấy mức khoá nào xung đột với mức nào, và đó là nguồn tra cứu cho mọi thứ ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Ghi chú phát hành PostgreSQL 11 — ADD COLUMN kèm mặc định</span><span class="lc-sub">postgresql.org/docs/11/release-11.html — cái thay đổi đã làm cho một nửa lời khuyên cũ trở nên lỗi thời.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">strong_migrations — danh sách các thao tác không an toàn</span><span class="lc-sub">github.com/ankane/strong_migrations — một gem của Rails mà tệp README của nó là bản danh mục dễ hiểu nhất về migration nguy hiểm và cách thay thế an toàn, bất kể bạn dùng ngôn ngữ nào.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — khoá, MVCC và pg_stat_activity</span><span class="lc-sub">/courses/postgresql/learn${REF} — vì sao người đọc không chặn người ghi, và vì sao <code>ALTER TABLE</code> là ngoại lệ chặn cả hai.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.4 ─────────────────────────── */
    {
      title: '5.4 — The migration that half-applied|||5.4 — Cái migration áp dụng NỬA CHỪNG',
      slug: 'deploy-5-4-migration-nua-chung',
      type: 'LESSON',
      description: 'Một migration ba câu lệnh, câu thứ ba hỏng. Đo trạng thái còn lại: bảng TỒN TẠI, dữ liệu ĐÃ CHÈN, ràng buộc KHÔNG CÓ, sổ theo dõi ghi "chưa xong" — và chạy lại thì hỏng ở câu ĐẦU TIÊN.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>The migration that half-applied</h2>
<p class="lead">This is the state the project instructions warn about in capital letters. A migration fails partway, the tracking table says it started and did not finish, and every subsequent deploy refuses to run. This lesson reproduces it deliberately, so the recovery is a decision rather than a guess.</p>

<h3>Producing the state</h3>
<p>A three-statement migration whose third statement fails on data that already exists:</p>
<pre><code>create table don_hang(id serial primary key, ma text);
insert into don_hang(ma) values ('A'),('B'),('A');
alter table don_hang add constraint uq_ma unique (ma);   <span class="tok-comment">-- SE HONG: co 'A' trung</span></code></pre>
<div class="out">    ERROR:  could not create unique index "uq_ma"
    DETAIL:  Key (ma)=(A) is duplicated.

  --- migration hong. Trang thai con lai la gi? ---
    bang don_hang co ton tai khong: 1
    so dong da chen:                3
    rang buoc unique co khong:      0
    _migrations ghi gi:             m001 xong=false

    psql: ERROR:  relation "don_hang" already exists</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Two of three statements applied</span><span class="v">The table exists with three rows. The constraint does not. The database is in a shape that no version of the schema ever intended.</span></div>
  <div class="kv"><span class="k">The ledger says "started, not finished"</span><span class="v"><code>xong=false</code>. Most migration tools treat that as a hard stop: they will not run the next migration, and they will not re-run this one, because they cannot know how much of it happened.</span></div>
  <div class="kv"><span class="k">Re-running fails at statement one</span><span class="v"><code>relation "don_hang" already exists</code>. The obvious recovery — "just run it again" — fails immediately, and fails on a <em>different</em> error than the original, which sends the investigation somewhere unhelpful.</span></div>
  <div class="kv"><span class="k">And every deploy is now blocked</span><span class="v">Not just this migration. The tool refuses to proceed at all, so an unrelated urgent fix cannot ship either. That is what turns a schema problem into an outage.</span></div>
</div>
<div class="callout warn"><strong>This repository has been here.</strong> A migration failed on a production deploy and left the tracking table in exactly this condition — the <code>P3009</code> state. The instructions written afterwards say: <strong>stop, do not auto-fix</strong>. Do not run <code>migrate resolve --rolled-back</code> or <code>--applied</code> reflexively, and do not rewrite the migration with <code>CREATE TABLE IF NOT EXISTS</code> to force it through. Both make the immediate error go away and can leave the schema permanently inconsistent with the migration history, which is a much harder problem than the one you started with.</div>

<h3>The prevention: one transaction</h3>
<p>The identical migration, wrapped in <code>BEGIN</code>/<code>COMMIT</code>:</p>
<div class="out">════ CUNG migration do, boc trong BEGIN/COMMIT ════
    ERROR:  could not create unique index "uq_ma"
  --- trang thai sau khi hong ---
    bang don_hang co ton tai khong: 0
    → KHONG con dau vet nao. Chay lai duoc ngay sau khi sua du lieu.</div>
<div class="callout ok"><strong>Same error, no wreckage.</strong> PostgreSQL supports transactional DDL — <code>CREATE TABLE</code> and <code>ALTER TABLE</code> roll back like any other statement. The table does not exist, the rows were never inserted, and the migration can be corrected and re-run immediately. This is a genuine advantage over MySQL, where most DDL commits implicitly and the half-applied state is unavoidable.</div>
<div class="pitfall"><strong>Bẫy — not everything can go inside a transaction, and the two exceptions are ones migrations use.</strong> Measured:
<br>· <code>ERROR: CREATE INDEX CONCURRENTLY cannot run inside a transaction block</code>
<br>· <code>ERROR: CREATE DATABASE cannot run inside a transaction block</code>
<br>So the very statement recommended in Lesson 5.3 for avoiding write locks is the one that cannot be made atomic. Put it in its own migration file, alone, and make that file idempotent — <code>CREATE INDEX CONCURRENTLY IF NOT EXISTS</code>, plus a check for the <code>INVALID</code> index a failed concurrent build leaves behind.</div>
<pre><code><span class="tok-comment">-- mot lan CREATE INDEX CONCURRENTLY hong de lai mot chi muc INVALID</span>
<span class="tok-comment">-- no KHONG duoc dung, va no VAN chiem cho. Tim va don:</span>
select indexrelid::regclass as ten
from pg_index where not indisvalid;

drop index concurrently if exists idx_hong;</code></pre>

<h3>Getting out of the stuck state</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Find out exactly how far it got</span><span class="lz-d">Read the migration file statement by statement and check each one against the live schema — does the table exist, does the column exist, does the constraint exist, is the index valid. This is the step people skip, and it is the only one that makes the rest safe.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Decide: finish it, or undo it</span><span class="lz-d">If most of it applied and the remainder is safe, apply the remaining statements by hand and mark the migration applied. If little applied, undo those few statements by hand and mark it rolled back. Either is fine; guessing which state you are in is not.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Make the ledger match reality — deliberately</span><span class="lz-d"><code>migrate resolve --applied</code> or <code>--rolled-back</code> is the right tool <em>after</em> steps 1 and 2, because now you know which one is true. The instruction against auto-resolving is against running it <em>before</em> you know.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Verify against the schema, not the ledger</span><span class="lz-d"><code>prisma migrate diff --from-migrations ./prisma/migrations --to-database-url "\$DATABASE_URL" --script</code> prints the difference between what the history says and what the database is. Empty output means they agree. Anything else is drift you have not resolved yet.</span></div>
</div>
<div class="note-ct">Step 4 is the one that catches an incomplete recovery. A ledger that says "applied" and a schema that is missing a constraint will deploy cleanly today and fail in three weeks, when a later migration assumes the constraint exists. The diff is cheap, it is non-destructive, and it is the only mechanical check that the two halves agree.</div>

<h3>Writing migrations that cannot get stuck</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">One logical change per file</span><span class="lz-lnote">The three-statement migration above failed because it did three things. Split across files, the failure would have been isolated to the constraint, with the table and data already committed and recorded.</span></div>
  <div class="lz-layer"><span class="lz-lname">Wrap in a transaction unless you cannot</span><span class="lz-lnote">Most tools do this by default; check yours rather than assuming. And when a statement cannot be wrapped, that file gets nothing else in it.</span></div>
  <div class="lz-layer"><span class="lz-lname">Check the data before adding a constraint</span><span class="lz-lnote">The measured failure was a duplicate <code>'A'</code> that already existed. Run the equivalent <code>select … group by … having count(*) &gt; 1</code> against production first. A constraint migration should never be the thing that discovers your data is inconsistent.</span></div>
  <div class="lz-layer"><span class="lz-lname">Run migrations against a copy of production first</span><span class="lz-lnote">Not against an empty test database. The failure above only exists because of the data — an empty database would have applied that migration perfectly and told you nothing.</span></div>
</div>
<div class="callout warn"><strong>This project cannot use <code>prisma migrate dev</code> at all.</strong> One deployed migration creates a unique constraint and then a plain index with the same name, so it can never replay on a shadow database — <code>P3006</code>, permanently. The instructions accept that: new migrations are hand-written SQL under <code>prisma/migrations/&lt;timestamp&gt;_&lt;name&gt;/migration.sql</code> and applied with <code>migrate deploy</code>, which does not use a shadow database. The migration cannot be edited because it is already deployed. It is a good example of the rule that migration history is append-only in practice, whatever the tooling claims.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — transactional DDL</span><span class="lc-sub">postgresql.org/docs/current/sql-begin.html — the property that makes the clean-rollback measurement above possible, and which most other databases do not have.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — migrate resolve and the P3009 state</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing — the official recovery, including the warning about resolving before you have inspected.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_index and invalid indexes</span><span class="lc-sub">postgresql.org/docs/current/catalog-pg-index.html — <code>indisvalid</code>, and what a failed CONCURRENTLY build leaves behind.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Prisma ORM — the migrations table and migrate diff</span><span class="lc-sub">/courses/prisma-orm/learn${REF} — what each column of the ledger means, and how to read a drift diff.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Cái migration áp dụng NỬA CHỪNG</h2>
<p class="lead">Đây là cái trạng thái mà hướng dẫn của dự án cảnh báo bằng chữ in hoa. Một migration hỏng nửa chừng, bảng theo dõi ghi rằng nó đã bắt đầu và chưa xong, và MỌI lần deploy sau đó đều từ chối chạy. Bài này tái hiện nó một cách CÓ CHỦ Ý, để việc khôi phục là một QUYẾT ĐỊNH chứ không phải một phỏng đoán.</p>

<h3>Tạo ra cái trạng thái đó</h3>
<p>Một migration ba câu lệnh mà câu thứ ba hỏng vì dữ liệu vốn đã có sẵn:</p>
<pre><code>create table don_hang(id serial primary key, ma text);
insert into don_hang(ma) values ('A'),('B'),('A');
alter table don_hang add constraint uq_ma unique (ma);   <span class="tok-comment">-- SE HONG: co 'A' trung</span></code></pre>
<div class="out">    ERROR:  could not create unique index "uq_ma"
    DETAIL:  Key (ma)=(A) is duplicated.

  --- migration hong. Trang thai con lai la gi? ---
    bang don_hang co ton tai khong: 1
    so dong da chen:                3
    rang buoc unique co khong:      0
    _migrations ghi gi:             m001 xong=false

    psql: ERROR:  relation "don_hang" already exists</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hai trên ba câu lệnh ĐÃ áp dụng</span><span class="v">Cái bảng tồn tại với ba dòng. Cái ràng buộc thì không. Cơ sở dữ liệu đang ở một hình dạng mà KHÔNG phiên bản lược đồ nào từng dự tính tới.</span></div>
  <div class="kv"><span class="k">Cuốn sổ ghi "đã bắt đầu, chưa xong"</span><span class="v"><code>xong=false</code>. Phần lớn công cụ migration coi đó là một cú DỪNG CỨNG: chúng sẽ không chạy migration kế tiếp, và cũng sẽ không chạy lại cái này, vì chúng KHÔNG BIẾT được bao nhiêu phần của nó đã xảy ra.</span></div>
  <div class="kv"><span class="k">Chạy lại thì hỏng ở câu lệnh SỐ MỘT</span><span class="v"><code>relation "don_hang" already exists</code>. Cách khôi phục hiển nhiên — "cứ chạy lại thôi" — hỏng ngay lập tức, và hỏng ở một lỗi KHÁC với lỗi ban đầu, thứ đẩy cuộc điều tra đi về một hướng vô ích.</span></div>
  <div class="kv"><span class="k">Và giờ MỌI lần deploy đều bị chặn</span><span class="v">Không chỉ cái migration này. Công cụ từ chối đi tiếp hoàn toàn, nên một bản vá khẩn chẳng liên quan gì cũng không ship được. Đó chính là thứ biến một vấn đề lược đồ thành một SỰ CỐ.</span></div>
</div>
<div class="callout warn"><strong>Kho mã này đã từng ở đây.</strong> Một migration hỏng trên một lần deploy production và để lại bảng theo dõi ở đúng cái tình trạng này — trạng thái <code>P3009</code>. Hướng dẫn viết ra sau đó nói: <strong>DỪNG, ĐỪNG tự động sửa</strong>. Đừng chạy <code>migrate resolve --rolled-back</code> hay <code>--applied</code> theo phản xạ, và đừng viết lại migration bằng <code>CREATE TABLE IF NOT EXISTS</code> để ép nó đi qua. Cả hai đều làm cái lỗi trước mắt biến mất và có thể để lược đồ mâu thuẫn VĨNH VIỄN với lịch sử migration, mà đó là một bài toán khó hơn hẳn cái bạn khởi đầu.</div>

<h3>Cách phòng: MỘT giao dịch</h3>
<p>Vẫn migration ấy, bọc trong <code>BEGIN</code>/<code>COMMIT</code>:</p>
<div class="out">════ CUNG migration do, boc trong BEGIN/COMMIT ════
    ERROR:  could not create unique index "uq_ma"
  --- trang thai sau khi hong ---
    bang don_hang co ton tai khong: 0
    → KHONG con dau vet nao. Chay lai duoc ngay sau khi sua du lieu.</div>
<div class="callout ok"><strong>Cùng cái lỗi, KHÔNG có đống đổ nát.</strong> PostgreSQL hỗ trợ DDL có giao dịch — <code>CREATE TABLE</code> và <code>ALTER TABLE</code> lùi lại được y như mọi câu lệnh khác. Cái bảng không tồn tại, mấy dòng kia chưa từng được chèn, và migration có thể sửa rồi chạy lại NGAY. Đây là một lợi thế THẬT so với MySQL, nơi phần lớn DDL tự động ghi nhận và cái trạng thái nửa chừng là KHÔNG TRÁNH ĐƯỢC.</div>
<div class="pitfall"><strong>Bẫy — KHÔNG phải thứ gì cũng nhét vào giao dịch được, và hai ngoại lệ lại đúng là thứ migration hay dùng.</strong> Đo thật:
<br>· <code>ERROR: CREATE INDEX CONCURRENTLY cannot run inside a transaction block</code>
<br>· <code>ERROR: CREATE DATABASE cannot run inside a transaction block</code>
<br>Nghĩa là chính cái câu lệnh được khuyên dùng ở Bài 5.3 để né khoá ghi lại là cái KHÔNG làm cho nguyên tử được. Hãy đặt nó vào một tệp migration RIÊNG, một mình, và làm cho tệp đó bất biến khi lặp lại — <code>CREATE INDEX CONCURRENTLY IF NOT EXISTS</code>, cộng thêm một phép kiểm cái chỉ mục <code>INVALID</code> mà một lần dựng concurrently hỏng để lại.</div>
<pre><code><span class="tok-comment">-- mot lan CREATE INDEX CONCURRENTLY hong de lai mot chi muc INVALID</span>
<span class="tok-comment">-- no KHONG duoc dung, va no VAN chiem cho. Tim va don:</span>
select indexrelid::regclass as ten
from pg_index where not indisvalid;

drop index concurrently if exists idx_hong;</code></pre>

<h3>Thoát ra khỏi trạng thái kẹt</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tìm ra CHÍNH XÁC nó đã đi được tới đâu</span><span class="lz-d">Đọc tệp migration từng câu lệnh một và đối chiếu từng cái với lược đồ đang sống — bảng có tồn tại không, cột có không, ràng buộc có không, chỉ mục có hợp lệ không. Đây là bước người ta bỏ qua, và nó là bước DUY NHẤT làm cho phần còn lại an toàn.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Quyết định: LÀM NỐT, hay HOÀN TÁC</span><span class="lz-d">Nếu phần lớn đã áp dụng và phần còn lại an toàn thì chạy nốt các câu lệnh còn lại bằng tay rồi đánh dấu migration là đã áp dụng. Nếu mới áp dụng được ít thì hoàn tác vài câu đó bằng tay rồi đánh dấu là đã lùi. Cách nào cũng được; ĐOÁN xem mình đang ở trạng thái nào thì không được.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Làm cho cuốn sổ khớp thực tế — MỘT CÁCH CÓ CHỦ Ý</span><span class="lz-d"><code>migrate resolve --applied</code> hay <code>--rolled-back</code> là công cụ ĐÚNG <em>SAU</em> bước 1 và 2, vì lúc đó bạn ĐÃ BIẾT cái nào là đúng. Cái chỉ dẫn cấm tự-động-gỡ là cấm chạy nó TRƯỚC khi bạn biết.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Kiểm lại bằng LƯỢC ĐỒ, đừng kiểm bằng cuốn sổ</span><span class="lz-d"><code>prisma migrate diff --from-migrations ./prisma/migrations --to-database-url "\$DATABASE_URL" --script</code> in ra khác biệt giữa thứ lịch sử NÓI và thứ cơ sở dữ liệu ĐANG LÀ. Kết quả rỗng nghĩa là hai bên đồng ý. Bất cứ thứ gì khác là trôi dạt mà bạn chưa xử lý xong.</span></div>
</div>
<div class="note-ct">Bước 4 là bước bắt được một cuộc khôi phục LÀM DỞ. Một cuốn sổ ghi "đã áp dụng" trong khi lược đồ thiếu một ràng buộc thì hôm nay deploy sạch sẽ và ba tuần nữa mới hỏng, khi một migration về sau giả định rằng cái ràng buộc đó tồn tại. Lệnh diff thì rẻ, nó không phá gì, và nó là phép kiểm MÁY MÓC duy nhất cho việc hai nửa có đồng ý với nhau không.</div>

<h3>Viết migration sao cho KHÔNG kẹt được</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một thay đổi LOGIC cho mỗi tệp</span><span class="lz-lnote">Cái migration ba câu lệnh ở trên hỏng vì nó làm BA việc. Tách ra thành nhiều tệp thì cú hỏng đã cô lập được ở cái ràng buộc, với bảng và dữ liệu đã được ghi nhận và ghi sổ xong.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bọc trong giao dịch, trừ khi không bọc được</span><span class="lz-lnote">Phần lớn công cụ làm sẵn chuyện này; hãy KIỂM công cụ của bạn chứ đừng giả định. Và khi một câu lệnh không bọc được thì tệp đó không chứa thứ gì khác nữa.</span></div>
  <div class="lz-layer"><span class="lz-lname">Kiểm DỮ LIỆU trước khi thêm một ràng buộc</span><span class="lz-lnote">Cú hỏng đo được là một giá trị <code>'A'</code> trùng vốn đã tồn tại sẵn. Hãy chạy câu <code>select … group by … having count(*) &gt; 1</code> tương ứng trên production TRƯỚC. Một migration thêm ràng buộc KHÔNG BAO GIỜ nên là thứ phát hiện ra rằng dữ liệu của bạn không nhất quán.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chạy migration trên một BẢN SAO của production trước</span><span class="lz-lnote">Đừng chạy trên một cơ sở dữ liệu thử RỖNG. Cú hỏng ở trên chỉ tồn tại VÌ CÓ DỮ LIỆU — một cơ sở dữ liệu rỗng sẽ áp dụng migration đó hoàn hảo và chẳng nói cho bạn biết gì.</span></div>
</div>
<div class="callout warn"><strong>Dự án này hoàn toàn KHÔNG dùng được <code>prisma migrate dev</code>.</strong> Một migration đã deploy tạo một ràng buộc unique rồi tạo tiếp một chỉ mục thường TRÙNG TÊN, nên nó không bao giờ phát lại được trên cơ sở dữ liệu bóng — <code>P3006</code>, vĩnh viễn. Hướng dẫn chấp nhận điều đó: migration mới là SQL viết tay đặt dưới <code>prisma/migrations/&lt;timestamp&gt;_&lt;name&gt;/migration.sql</code> rồi áp bằng <code>migrate deploy</code>, lệnh không dùng cơ sở dữ liệu bóng. Cái migration kia KHÔNG sửa được vì nó đã deploy rồi. Đó là một ví dụ tốt cho cái luật rằng lịch sử migration trên thực tế là CHỈ-THÊM, bất kể công cụ tuyên bố gì.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — DDL có giao dịch</span><span class="lc-sub">postgresql.org/docs/current/sql-begin.html — cái tính chất làm cho phép đo lùi-sạch ở trên khả thi, mà phần lớn cơ sở dữ liệu khác không có.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — migrate resolve và trạng thái P3009</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing — quy trình khôi phục chính thức, kèm lời cảnh báo về việc gỡ trạng thái TRƯỚC khi bạn đã soi kỹ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_index và chỉ mục không hợp lệ</span><span class="lc-sub">postgresql.org/docs/current/catalog-pg-index.html — <code>indisvalid</code>, và một lần dựng CONCURRENTLY hỏng để lại cái gì.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Prisma ORM — bảng migrations và lệnh migrate diff</span><span class="lc-sub">/courses/prisma-orm/learn${REF} — mỗi cột của cuốn sổ nghĩa là gì, và đọc một bản diff trôi dạt thế nào.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.5 ─────────────────────────── */
    {
      title: '5.5 — Backfills, and where the migration goes in the script|||5.5 — Lấp dữ liệu, và migration nằm ở đâu trong script',
      slug: 'deploy-5-5-lap-du-lieu-va-vi-tri',
      type: 'LESSON',
      description: 'Lấp 300.000 dòng một phát mất 1.218 ms; chia thành 30 lô mất 3.065 ms. Cách chậm hơn 2,5 lần lại là cách đúng — bài này đo vì sao, rồi ráp migration vào đúng chỗ trong script deploy ở Chương 3.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Backfills, and where the migration goes in the script</h2>
<p class="lead">Phase 2 of expand–contract copies data from the old column to the new one. On a small table that is one statement. On a real table it is the single most dangerous line in the migration, and the fix makes it slower on purpose.</p>

<h3>One statement against thirty, measured</h3>
<p>300,000 rows to backfill:</p>
<div class="out">════ A) lap MOT PHAT ════
    1218 ms, mot giao dich duy nhat
    bang phinh len: 41 MB

════ B) lap theo LO 10.000 dong ════
    3065 ms, 30 lo
    → moi lo ~102 ms, moi cai la mot giao dich RIENG</div>
<div class="callout warn"><strong>Batching is two and a half times slower in total, and it is the correct choice.</strong> The number that matters is not 1,218 against 3,065 — it is <strong>1,218 against 102</strong>. The single statement holds row locks and an open transaction for its entire duration; the batched version holds them for a tenth of a second at a time, and between batches the database is completely free. Total time is what you pay; longest lock is what your users feel.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">A long transaction blocks more than you think</span><span class="v">It holds locks on every row it has touched, and it prevents <code>VACUUM</code> from cleaning up anywhere in the database — so a twenty-minute backfill degrades tables it never mentions.</span></div>
  <div class="kv"><span class="k">The table grew to 41 MB</span><span class="v">An <code>UPDATE</code> in PostgreSQL writes a new row version and marks the old one dead. Backfilling 300,000 rows doubled the live data. That space is reclaimed by <code>VACUUM</code>, eventually — not immediately, and not while a long transaction is open.</span></div>
  <div class="kv"><span class="k">A batch can be interrupted safely</span><span class="v">Kill the single statement at 90% and all of it rolls back. Kill the batched version and 90% is committed — restart it and it picks up where it stopped, because it selects rows that are still null.</span></div>
  <div class="kv"><span class="k">And it can be paused</span><span class="v">Add a <code>sleep</code> between batches and the backfill becomes something you can run during business hours. The single statement offers no such control.</span></div>
</div>
<pre><code><span class="tok-comment">-- mot lo: chon dong CHUA lap, khoa chung, cap nhat, tra ve so dong</span>
with c as (
  select id from bf
  where moi is null
  limit 10000
  for update skip locked          <span class="tok-comment">-- bo qua dong dang bi giao dich khac giu</span>
)
update bf set moi = cu
from c where bf.id = c.id
returning 1;</code></pre>
<div class="note-ct"><code>for update skip locked</code> is what makes the loop safe to run while the application is writing. Without it, a batch that hits a row locked by a user's transaction waits for that transaction — and the backfill stalls behind ordinary traffic. With it, the batch skips that row and picks it up on a later pass. The loop ends when a batch returns zero rows, which also makes it naturally resumable.</div>

<h3>Where the migration runs in the deploy</h3>
<pre><code><span class="tok-comment">#!/bin/bash — trao.sh, ban co migration</span>
set -euo pipefail
exec 9&gt;/var/lock/trao.lock; flock -w 30 9

<span class="tok-comment"># 0. MIGRATION TRUOC — va no phai AN TOAN voi ma CU (Bai 5.1)</span>
cd "\$BAN_MOI"
if ! timeout 300 npx prisma migrate deploy; then
  echo "migration HONG — khong trao, ma cu van dang chay" &gt;&amp;2
  exit 1                       <span class="tok-comment"># dung TRUOC khi doi bat cu thu gi</span>
fi

<span class="tok-comment"># 1..5. phan con lai y nhu Bai 3.5</span>
&lt;khoi dong ban moi&gt; &amp;&amp; &lt;cho san sang&gt; &amp;&amp; &lt;chuyen luu luong&gt; &amp;&amp; &lt;kiem&gt; &amp;&amp; &lt;dung ban cu&gt;</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Migration first, and it must fail loudly</span><span class="lz-d">If the migration fails, nothing has been swapped — the old version is still serving from the old schema, which is a consistent state. Exiting here is the cheapest possible failure.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">With a timeout on the whole thing</span><span class="lz-d"><code>timeout 300</code>. A migration waiting forever on a lock (Lesson 5.3) hangs the deploy, which holds the lock from Lesson 2.5, which blocks every other deploy. Bound it.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Backfills do not belong here</span><span class="lz-d">A thirty-minute backfill inside a deploy script is a thirty-minute deploy holding a lock. Run it as a separate job, after the deploy, at your own pace — it is idempotent and resumable, so it does not need to be part of an atomic sequence.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Run it once, not once per server</span><span class="lz-d">With several servers, every one running <code>migrate deploy</code> at the same time is a race. Most tools take an advisory lock so only one wins, but check yours — and a dedicated migration step in the pipeline is clearer than relying on that.</span></div>
</div>

<h3>The seed script problem</h3>
<div class="callout warn"><strong>A seed script is code that runs against the schema and is usually excluded from every type check.</strong> This project has the incident: renaming an enum value from <code>CODE</code> to <code>CODE_REVIEW</code> passed the entire pre-push checklist — <code>tsc --noEmit</code>, the frontend build, the migration — and broke the seed on production. The reason: <code>tsconfig.json</code> has <code>rootDir: "./src"</code>, so <code>prisma/**</code> could not be in its <code>include</code> and sat in <code>exclude</code> instead. Nothing type-checked it. And <code>seed.ts</code> carried its own hand-written copy of the enum union, so it type-checked <em>against itself</em> and agreed.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Never hand-copy a type that the schema generates</span><span class="lz-lnote">Import it: <code>import type { ContentType } from '@prisma/client'</code>. A hand-written union is a second source of truth that drifts silently, and the drift only appears at runtime.</span></div>
  <div class="lz-layer"><span class="lz-lname">Type-check the seed separately</span><span class="lz-lnote">A second config — <code>tsconfig.seed.json</code> — plus a script that runs it. This project added exactly that afterwards, because the main config structurally cannot cover both.</span></div>
  <div class="lz-layer"><span class="lz-lname">Run the seed as part of the schema checklist</span><span class="lz-lnote">Type-checking is not enough on its own: the failure was runtime behaviour. Actually running <code>prisma db seed</code> against a scratch database is the only check that catches it.</span></div>
  <div class="lz-layer"><span class="lz-lname">And treat the seed as production code</span><span class="lz-lnote">It writes to the database. It deserves the same review, the same type coverage and the same testing as anything in <code>src/</code> — it just does not look like it does, because it lives in a different directory.</span></div>
</div>
<div class="note-ct">The general lesson is broader than seeds: <em>a checklist only covers the files it can see</em>. Any directory excluded from the type checker, the linter or the test runner is a place where a schema change can hide. Worth spending ten minutes once on: list the <code>exclude</code> entries in every config and ask what checks those paths get instead.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — SELECT ... FOR UPDATE SKIP LOCKED</span><span class="lc-sub">postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE — the clause that lets a backfill run alongside live traffic without waiting on it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — VACUUM and dead tuples</span><span class="lc-sub">postgresql.org/docs/current/routine-vacuuming.html — why an UPDATE grows the table, and why a long transaction stops the cleanup everywhere.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — migrate deploy in production</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate/workflows/production-and-testing — why <code>deploy</code> and not <code>dev</code>, and the advisory lock it takes.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — batching large updates</span><span class="lc-sub">/courses/postgresql/learn${REF} — the CTE-plus-limit pattern above, and how to choose a batch size for your own table.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Lấp dữ liệu, và migration nằm ở đâu trong script</h2>
<p class="lead">Giai đoạn 2 của mở-rộng–thu-hẹp chép dữ liệu từ cột cũ sang cột mới. Trên một bảng nhỏ thì đó là một câu lệnh. Trên một bảng THẬT thì nó là dòng NGUY HIỂM NHẤT trong cả migration, và cách sửa lại làm nó CHẬM ĐI một cách có chủ ý.</p>

<h3>Một câu lệnh đấu với ba mươi, đo thật</h3>
<p>300.000 dòng cần lấp:</p>
<div class="out">════ A) lap MOT PHAT ════
    1218 ms, mot giao dich duy nhat
    bang phinh len: 41 MB

════ B) lap theo LO 10.000 dong ════
    3065 ms, 30 lo
    → moi lo ~102 ms, moi cai la mot giao dich RIENG</div>
<div class="callout warn"><strong>Chia lô CHẬM HƠN hai lần rưỡi về tổng thời gian, và nó là lựa chọn ĐÚNG.</strong> Con số quan trọng KHÔNG phải 1.218 so với 3.065 — mà là <strong>1.218 so với 102</strong>. Câu lệnh đơn giữ khoá trên từng dòng và giữ một giao dịch mở suốt cả quãng thời gian của nó; bản chia lô giữ chúng mỗi lần một phần mười giây, và GIỮA các lô thì cơ sở dữ liệu hoàn toàn rảnh. Tổng thời gian là thứ BẠN trả; khoá dài nhất là thứ NGƯỜI DÙNG cảm thấy.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Một giao dịch dài chặn nhiều hơn bạn tưởng</span><span class="v">Nó giữ khoá trên mọi dòng nó đã đụng tới, và nó NGĂN <code>VACUUM</code> dọn dẹp ở BẤT KỲ ĐÂU trong cơ sở dữ liệu — nên một cuộc lấp dữ liệu hai mươi phút làm xuống cấp cả những bảng nó chẳng hề nhắc tới.</span></div>
  <div class="kv"><span class="k">Cái bảng phình lên 41 MB</span><span class="v">Một lệnh <code>UPDATE</code> trong PostgreSQL ghi ra một PHIÊN BẢN DÒNG MỚI rồi đánh dấu cái cũ là chết. Lấp 300.000 dòng đã làm dữ liệu sống tăng gấp đôi. Chỗ đó được <code>VACUUM</code> thu hồi, RỒI SẼ — không phải ngay, và không phải trong lúc một giao dịch dài đang mở.</span></div>
  <div class="kv"><span class="k">Một lô có thể bị cắt ngang một cách AN TOÀN</span><span class="v">Giết câu lệnh đơn ở mốc 90% thì TOÀN BỘ lùi lại. Giết bản chia lô thì 90% ĐÃ ĐƯỢC GHI NHẬN — chạy lại thì nó tiếp tục từ chỗ dừng, vì nó chọn những dòng vẫn còn null.</span></div>
  <div class="kv"><span class="k">Và nó TẠM DỪNG được</span><span class="v">Thêm một lệnh <code>sleep</code> giữa các lô là cuộc lấp dữ liệu thành thứ bạn chạy được ngay trong giờ làm việc. Câu lệnh đơn không cho bạn khả năng kiểm soát nào như vậy.</span></div>
</div>
<pre><code><span class="tok-comment">-- mot lo: chon dong CHUA lap, khoa chung, cap nhat, tra ve so dong</span>
with c as (
  select id from bf
  where moi is null
  limit 10000
  for update skip locked          <span class="tok-comment">-- bo qua dong dang bi giao dich khac giu</span>
)
update bf set moi = cu
from c where bf.id = c.id
returning 1;</code></pre>
<div class="note-ct"><code>for update skip locked</code> là thứ làm cho vòng lặp an toàn khi chạy trong lúc ứng dụng đang ghi. Thiếu nó, một lô đụng phải một dòng đang bị giao dịch của người dùng khoá sẽ CHỜ cái giao dịch đó — và cuộc lấp dữ liệu nghẽn lại phía sau lưu lượng bình thường. Có nó, cái lô bỏ qua dòng ấy và nhặt lại ở lượt sau. Vòng lặp kết thúc khi một lô trả về không dòng nào, và điều đó cũng làm nó tự nhiên có thể chạy tiếp được.</div>

<h3>Migration chạy ở đâu trong quy trình deploy</h3>
<pre><code><span class="tok-comment">#!/bin/bash — trao.sh, ban co migration</span>
set -euo pipefail
exec 9&gt;/var/lock/trao.lock; flock -w 30 9

<span class="tok-comment"># 0. MIGRATION TRUOC — va no phai AN TOAN voi ma CU (Bai 5.1)</span>
cd "\$BAN_MOI"
if ! timeout 300 npx prisma migrate deploy; then
  echo "migration HONG — khong trao, ma cu van dang chay" &gt;&amp;2
  exit 1                       <span class="tok-comment"># dung TRUOC khi doi bat cu thu gi</span>
fi

<span class="tok-comment"># 1..5. phan con lai y nhu Bai 3.5</span>
&lt;khoi dong ban moi&gt; &amp;&amp; &lt;cho san sang&gt; &amp;&amp; &lt;chuyen luu luong&gt; &amp;&amp; &lt;kiem&gt; &amp;&amp; &lt;dung ban cu&gt;</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Migration TRƯỚC, và nó phải hỏng một cách ỒN ÀO</span><span class="lz-d">Nếu migration hỏng thì chưa có gì bị tráo cả — bản cũ vẫn đang phục vụ trên lược đồ cũ, và đó là một trạng thái NHẤT QUÁN. Thoát ra ở đây là kiểu hỏng RẺ NHẤT có thể có.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Kèm một HẠN GIỜ cho toàn bộ việc đó</span><span class="lz-d"><code>timeout 300</code>. Một migration chờ vô hạn trên một cái khoá (Bài 5.3) sẽ treo lần deploy, mà lần deploy đang giữ cái khoá ở Bài 2.5, thứ chặn mọi lần deploy khác. Hãy chặn nó lại.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Lấp dữ liệu KHÔNG thuộc về chỗ này</span><span class="lz-d">Một cuộc lấp ba mươi phút nằm trong script deploy là một lần deploy ba mươi phút đang giữ một cái khoá. Hãy chạy nó như một job RIÊNG, sau khi deploy, theo nhịp của bạn — nó bất biến khi lặp lại và chạy tiếp được, nên nó KHÔNG cần là một phần của một chuỗi nguyên tử.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Chạy nó MỘT lần, không phải mỗi máy chủ một lần</span><span class="lz-d">Với nhiều máy chủ, việc máy nào cũng chạy <code>migrate deploy</code> cùng lúc là một cuộc đua. Phần lớn công cụ lấy một khoá tư vấn để chỉ một cái thắng, nhưng hãy KIỂM công cụ của bạn — và một bước migration riêng trong đường ống thì rõ ràng hơn là trông cậy vào chuyện đó.</span></div>
</div>

<h3>Vấn đề của script seed</h3>
<div class="callout warn"><strong>Một script seed là MÃ chạy trên lược đồ và thường bị loại khỏi MỌI phép kiểm kiểu.</strong> Dự án này có sự cố đó: đổi tên một giá trị enum từ <code>CODE</code> thành <code>CODE_REVIEW</code> qua sạch TOÀN BỘ danh mục kiểm trước khi push — <code>tsc --noEmit</code>, bản dựng frontend, cả migration — rồi làm vỡ seed TRÊN PRODUCTION. Lý do: <code>tsconfig.json</code> có <code>rootDir: "./src"</code>, nên <code>prisma/**</code> không thể nằm trong <code>include</code> của nó và rơi vào <code>exclude</code>. Chẳng có gì kiểm kiểu nó. Và <code>seed.ts</code> lại tự mang theo một bản chép tay của cái union enum, nên nó tự kiểm kiểu <em>VỚI CHÍNH NÓ</em> và tự đồng ý với mình.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">ĐỪNG BAO GIỜ chép tay một kiểu mà lược đồ sinh ra</span><span class="lz-lnote">Hãy import nó: <code>import type { ContentType } from '@prisma/client'</code>. Một union viết tay là một NGUỒN SỰ THẬT THỨ HAI, nó trôi dạt trong im lặng, và sự trôi dạt ấy chỉ lộ ra lúc CHẠY.</span></div>
  <div class="lz-layer"><span class="lz-lname">Kiểm kiểu cho seed RIÊNG</span><span class="lz-lnote">Một cấu hình thứ hai — <code>tsconfig.seed.json</code> — cộng một script chạy nó. Dự án này đã thêm đúng thứ đó sau sự cố, vì cấu hình chính về mặt cấu trúc KHÔNG phủ được cả hai.</span></div>
  <div class="lz-layer"><span class="lz-lname">CHẠY seed như một phần của danh mục kiểm lược đồ</span><span class="lz-lnote">Kiểm kiểu tự nó KHÔNG đủ: cú hỏng đó là hành vi LÚC CHẠY. Thật sự chạy <code>prisma db seed</code> trên một cơ sở dữ liệu nháp là phép kiểm DUY NHẤT bắt được nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Và hãy coi seed là mã PRODUCTION</span><span class="lz-lnote">Nó GHI vào cơ sở dữ liệu. Nó xứng đáng được review, được phủ kiểu và được kiểm thử y như mọi thứ trong <code>src/</code> — nó chỉ TRÔNG như không xứng đáng, vì nó nằm ở một thư mục khác.</span></div>
</div>
<div class="note-ct">Bài học tổng quát rộng hơn chuyện seed: <em>một danh mục kiểm chỉ phủ được những tệp nó NHÌN THẤY</em>. Bất kỳ thư mục nào bị loại khỏi bộ kiểm kiểu, bộ lint hay bộ chạy test đều là một chỗ mà một thay đổi lược đồ có thể ẩn nấp. Đáng bỏ mười phút làm một lần: liệt kê các mục <code>exclude</code> trong mọi tệp cấu hình rồi tự hỏi những đường dẫn đó được kiểm bằng gì thay thế.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — SELECT ... FOR UPDATE SKIP LOCKED</span><span class="lc-sub">postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE — mệnh đề cho phép một cuộc lấp dữ liệu chạy song song với lưu lượng thật mà không phải chờ nó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — VACUUM và tuple chết</span><span class="lc-sub">postgresql.org/docs/current/routine-vacuuming.html — vì sao một lệnh UPDATE làm bảng phình ra, và vì sao một giao dịch dài chặn việc dọn dẹp ở khắp nơi.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — migrate deploy trên production</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate/workflows/production-and-testing — vì sao là <code>deploy</code> chứ không phải <code>dev</code>, và cái khoá tư vấn mà nó lấy.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — chia lô cho các lệnh cập nhật lớn</span><span class="lc-sub">/courses/postgresql/learn${REF} — khuôn CTE-cộng-limit ở trên, và chọn cỡ lô cho chính bảng của bạn thế nào.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.6 ─────────────────────────── */
    {
      title: '5.6 — Quiz: the database|||5.6 — Quiz: cơ sở dữ liệu',
      slug: 'deploy-5-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về một cú đổi tên cột làm vỡ mọi request, hai lệnh ADD COLUMN chênh nhau 49 lần, một migration để lại bảng tồn tại nửa vời, và một cách lấp dữ liệu chậm hơn 2,5 lần lại đúng hơn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.6</span>
<h2>Quiz: the database</h2>
<p class="lead">Eight questions from the chapter where the better deploy makes the problem worse, and the slower backfill is the right one.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> Renaming a column succeeded in milliseconds and broke every request the old code was serving — and blue-green deploys make that <em>worse</em>, because their whole technique is running both versions at once (5.1). Expand–contract fixes it in four phases, measured: after phase 2 a row written by <em>old</em> code was immediately readable by <em>new</em> code, because a <code>BEFORE</code> trigger kept both columns in sync (5.2). On a 400,000-row table, <code>ADD COLUMN</code> took 53 ms, with a constant default 37 ms, and with <code>gen_random_uuid()</code> <strong>2,606 ms</strong> — forty-nine times slower because a volatile default rewrites every row; and during that rewrite, 5 of 60 writes hit their timeout and the batch took 2.2× longer (5.3). A three-statement migration whose third statement failed left the table existing, the rows inserted, the constraint absent, and the ledger saying <code>xong=false</code> — with a re-run failing at statement one; wrapped in a transaction, the identical failure left <em>no trace at all</em>, though <code>CREATE INDEX CONCURRENTLY</code> and <code>CREATE DATABASE</code> both refuse to run inside one (5.4). And backfilling 300,000 rows took 1,218 ms in one statement or 3,065 ms in thirty batches — slower in total, with the longest lock down from 1,218 ms to 102 ms (5.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.6</span>
<h2>Quiz: cơ sở dữ liệu</h2>
<p class="lead">Tám câu ra từ cái chương mà lần deploy TỐT HƠN lại làm vấn đề TỆ HƠN, và cách lấp dữ liệu CHẬM HƠN mới là cách đúng.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Đổi tên một cột thành công trong vài mili giây và làm vỡ MỌI request mà mã cũ đang phục vụ — và deploy xanh-lam làm chuyện đó <em>TỆ HƠN</em>, vì toàn bộ kỹ thuật của nó là chạy cả hai phiên bản cùng lúc (5.1). Mở-rộng–thu-hẹp sửa được bằng bốn giai đoạn, đo thật: sau giai đoạn 2, một dòng do mã <em>CŨ</em> ghi ra thì mã <em>MỚI</em> đọc được NGAY, vì một trigger <code>BEFORE</code> giữ hai cột đồng bộ (5.2). Trên một bảng 400.000 dòng, <code>ADD COLUMN</code> mất 53 ms, kèm mặc định hằng số 37 ms, và kèm <code>gen_random_uuid()</code> thì <strong>2.606 ms</strong> — chậm hơn bốn mươi chín lần vì mặc định biến thiên ghi lại MỌI dòng; và trong lúc ghi lại đó, 5 trên 60 lệnh ghi chạm hạn giờ còn cả lô thì mất gấp 2,2 lần (5.3). Một migration ba câu lệnh mà câu thứ ba hỏng đã để lại bảng TỒN TẠI, dòng ĐÃ CHÈN, ràng buộc KHÔNG CÓ, và cuốn sổ ghi <code>xong=false</code> — chạy lại thì hỏng ở câu lệnh SỐ MỘT; bọc trong một giao dịch thì đúng cú hỏng ấy KHÔNG để lại dấu vết nào, dù <code>CREATE INDEX CONCURRENTLY</code> và <code>CREATE DATABASE</code> đều TỪ CHỐI chạy bên trong giao dịch (5.4). Và lấp 300.000 dòng mất 1.218 ms nếu một câu lệnh hoặc 3.065 ms nếu ba mươi lô — chậm hơn về tổng, nhưng khoá dài nhất giảm từ 1.218 ms xuống 102 ms (5.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why does a zero-downtime blue-green deploy make a column rename more dangerous, not less?|||Vì sao một lần deploy xanh-lam không-gián-đoạn lại làm cú đổi tên cột NGUY HIỂM HƠN chứ không phải ít hơn?',
            options: [
              'It does not; overlap is irrelevant to the schema|||Không hề; chuyện chồng lấn chẳng liên quan gì tới lược đồ',
              'Its entire technique is running both versions at once, which is exactly the condition under which the old code hits a column that no longer exists|||Toàn bộ kỹ thuật của nó là chạy CẢ HAI phiên bản cùng lúc, mà đó chính xác là điều kiện để mã cũ đâm vào một cột không còn tồn tại',
              'It runs migrations twice|||Nó chạy migration hai lần',
              'It skips the migration step|||Nó bỏ qua bước migration',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'In expand-contract, what does the BEFORE trigger added in phase 2 actually buy you?|||Trong mở-rộng–thu-hẹp, cái trigger BEFORE thêm ở giai đoạn 2 thật ra mua được gì?',
            options: [
              'It speeds up the backfill|||Nó làm việc lấp dữ liệu nhanh hơn',
              'Writes from either version become visible to both — measured as a row inserted by old code being readable through the new column|||Lệnh ghi từ phiên bản nào cũng nhìn thấy được ở CẢ HAI — đo được bằng một dòng do mã cũ chèn mà đọc được qua cột mới',
              'It prevents the old code from writing|||Nó ngăn mã cũ ghi dữ liệu',
              'It makes the rename atomic|||Nó làm cú đổi tên thành nguyên tử',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'ADD COLUMN with a constant DEFAULT took 37 ms and with DEFAULT gen_random_uuid() took 2,606 ms on the same table. Why?|||ADD COLUMN kèm một DEFAULT hằng số mất 37 ms còn kèm DEFAULT gen_random_uuid() mất 2.606 ms trên cùng một bảng. Vì sao?',
            options: [
              'UUIDs are larger than strings|||UUID lớn hơn chuỗi',
              'A constant default is stored in the catalogue and applied on read; a volatile function needs a different value per row, so every row is rewritten|||Một mặc định HẰNG SỐ được lưu trong danh mục và áp lúc ĐỌC; một hàm BIẾN THIÊN cần giá trị riêng cho mỗi dòng, nên MỌI dòng đều bị ghi lại',
              'gen_random_uuid() is a slow function|||gen_random_uuid() là một hàm chậm',
              'The second statement rebuilt the indexes|||Câu lệnh thứ hai dựng lại các chỉ mục',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Why is lock_timeout the most valuable line in a migration file?|||Vì sao lock_timeout là dòng giá trị nhất trong một tệp migration?',
            options: [
              'It makes the migration run faster|||Nó làm migration chạy nhanh hơn',
              'Without it, a migration that cannot get its lock waits indefinitely while blocking every query behind it — the site goes down before the migration even starts|||Thiếu nó, một migration không lấy được khoá sẽ chờ VÔ HẠN trong lúc chặn mọi truy vấn phía sau — website sập trước cả khi migration kịp bắt đầu',
              'It prevents deadlocks entirely|||Nó ngăn hẳn được deadlock',
              'It is required by ALTER TABLE|||ALTER TABLE bắt buộc phải có nó',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'A migration failed on statement three of three. Re-running it fails with "relation already exists". What should you do?|||Một migration hỏng ở câu lệnh thứ ba trên ba. Chạy lại thì hỏng với "relation already exists". Bạn nên làm gì?',
            options: [
              'Rewrite the migration with CREATE TABLE IF NOT EXISTS to force it through|||Viết lại migration bằng CREATE TABLE IF NOT EXISTS để ép nó đi qua',
              'Inspect exactly which statements applied, decide whether to finish or undo them by hand, and only then mark the ledger to match|||SOI xem chính xác câu lệnh nào đã áp dụng, quyết định làm nốt hay hoàn tác chúng bằng tay, và CHỈ SAU ĐÓ mới đánh dấu cuốn sổ cho khớp',
              'Run migrate resolve --applied immediately|||Chạy migrate resolve --applied ngay lập tức',
              'Drop the database and restore from backup|||Xoá cơ sở dữ liệu rồi phục hồi từ bản sao lưu',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Wrapping migrations in BEGIN/COMMIT prevents the half-applied state. Which two common statements refuse to run inside a transaction?|||Bọc migration trong BEGIN/COMMIT ngăn được trạng thái nửa chừng. Hai câu lệnh phổ biến nào TỪ CHỐI chạy bên trong một giao dịch?',
            options: [
              'ALTER TABLE and CREATE TABLE|||ALTER TABLE và CREATE TABLE',
              'CREATE INDEX CONCURRENTLY and CREATE DATABASE — so the statement recommended for avoiding write locks is the one that cannot be made atomic|||CREATE INDEX CONCURRENTLY và CREATE DATABASE — nên chính cái câu lệnh được khuyên dùng để né khoá ghi lại là cái không làm cho nguyên tử được',
              'UPDATE and DELETE|||UPDATE và DELETE',
              'None; everything is transactional in PostgreSQL|||Không cái nào; trong PostgreSQL mọi thứ đều có giao dịch',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Backfilling in 30 batches took 3,065 ms against 1,218 ms for one statement. Why is the slower one correct?|||Lấp dữ liệu theo 30 lô mất 3.065 ms so với 1.218 ms của một câu lệnh. Vì sao cái CHẬM HƠN mới đúng?',
            options: [
              'It is not; the single statement is better|||Không đúng; câu lệnh đơn tốt hơn',
              'The number that matters is the longest lock: 102 ms per batch instead of 1,218 ms continuously, and between batches the database is completely free|||Con số quan trọng là KHOÁ DÀI NHẤT: 102 ms mỗi lô thay vì 1.218 ms liên tục, và GIỮA các lô thì cơ sở dữ liệu hoàn toàn rảnh',
              'Batching uses less disk|||Chia lô tốn ít đĩa hơn',
              'The single statement cannot be resumed|||Câu lệnh đơn không chạy tiếp được',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Renaming an enum value passed tsc --noEmit, the frontend build and the migration, then broke the seed on production. What was the root cause?|||Đổi tên một giá trị enum qua được tsc --noEmit, bản dựng frontend và cả migration, rồi làm vỡ seed trên production. Nguyên nhân gốc là gì?',
            options: [
              'The migration was written incorrectly|||Cái migration viết sai',
              'prisma/** sat in tsconfig exclude so nothing type-checked it, and seed.ts carried a hand-written copy of the enum union so it type-checked against itself|||prisma/** nằm trong mục exclude của tsconfig nên chẳng có gì kiểm kiểu nó, và seed.ts lại mang một bản chép tay của union enum nên nó tự kiểm kiểu với chính mình',
              'The database rejected the new value|||Cơ sở dữ liệu từ chối giá trị mới',
              'Prisma does not support enum renames|||Prisma không hỗ trợ đổi tên enum',
            ],
            correctIndex: 1,
            points: 10,
          },
        ],
      },
    },
  ],
};
