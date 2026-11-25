/**
 * 6.3 — Form đăng bài kèm ảnh và form bình luận (soạn 24/11/2026, agent fsp).
 * Output THẬT: Chrome 150 headless (playwright-core 1.65.1), Vite 8.3.8, React 19.3; API ChiaSe tag ch5 + MinIO (Chainguard)
 * với MINIO_API_CORS_ALLOW_ORIGIN=http://localhost:41811 (bài 4.2). Repo chiase commit 8d67c74 (nhánh ch6/frontend).
 * Phát hiện thật 24/11: form trống ⇒ 400 với details title/body hiện đúng ô; GIF chặn ở trình duyệt, không request nào;
 * ảnh thật: POST /uploads 201 ⇒ PUT thẳng MinIO ⇒ POST /posts 201 ⇒ trang bài, ảnh posts/<uuid>.webp rộng 800 px;
 * bấm ĐÚP: 1 bài (React 19 xử lý click là sự kiện rời rạc, nút đã disabled ở cú thứ hai) — kể cả khi bỏ chặn bằng ref;
 * NHƯNG requestSubmit() hai lần trong cùng một tác vụ: không ref ⇒ 2 POST /posts, có ref ⇒ 1;
 * oxlint set-state-in-effect với URL xem trước ⇒ tạo/thu hồi blob: trong sự kiện; bình luận "<img onerror=…>" hiện CHỮ, 0 thẻ img;
 * đổi tạm sang dangerouslySetInnerHTML ⇒ mã chèn chạy, gọi /auth/refresh bằng cookie httpOnly và lấy được access token MỚI
 * (2 lần, mỗi lần tải trang) — token trong bộ nhớ + httpOnly không ngăn XSS hành động thay người dùng.
 * Nguồn (GET 200, 24/11/2026): Wikipedia "TweetDeck" (XSS 11/06/2014, tweet tự retweet, hơn 83.000 người dùng, dẫn ZDNet);
 * React docs (dangerouslySetInnerHTML).
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const TAI_ANH = `import { api } from './client';
import { ApiError } from './loi';

// Khớp với API (apps/api/src/schemas/upload.schema.ts). Kiểm ở trình duyệt chỉ để báo SỚM cho người dùng —
// API vẫn kiểm lại (vé ký đúng loại + kích thước) và duyệt ảnh bằng sharp (bài 4.3). Đừng bao giờ chỉ kiểm ở client.
export const LOAI_ANH = ['image/jpeg', 'image/png', 'image/webp'];
export const ANH_TOI_DA = 5 * 1024 * 1024;

type Ve = { key: string; url: string; method: 'PUT'; headers: Record&lt;string, string&gt; };

// Luồng 3 bước của bài 4.2: (1) xin vé ở API ⇒ (2) PUT THẲNG tệp lên kho (MinIO/R2), không đi qua API ⇒ (3) trả khoá tmp/…
// để tạo bài. Dùng XMLHttpRequest thay fetch vì fetch chưa báo tiến độ TẢI LÊN (upload progress).
export async function taiAnh(
  tep: File,
  tienDo: (phanTram: number) =&gt; void,
  signal?: AbortSignal,
): Promise&lt;string&gt; {
  if (!LOAI_ANH.includes(tep.type))
    throw new ApiError(400, 'LOAI_ANH_SAI', 'Chỉ nhận ảnh JPEG, PNG hoặc WebP', [
      { field: 'image', code: 'LOAI_ANH_SAI', message: 'Chỉ nhận ảnh JPEG, PNG hoặc WebP' },
    ]);
  if (tep.size &gt; ANH_TOI_DA)
    throw new ApiError(400, 'ANH_QUA_LON', 'Ảnh tối đa 5 MB', [
      {
        field: 'image',
        code: 'ANH_QUA_LON',
        message: \`Ảnh \${(tep.size / 1048576).toFixed(1)} MB — tối đa 5 MB\`,
      },
    ]);

  const ve = await api&lt;Ve&gt;('/uploads', {
    method: 'POST',
    body: { contentType: tep.type, size: tep.size },
    signal,
  });

  await new Promise&lt;void&gt;((xong, hong) =&gt; {
    const xhr = new XMLHttpRequest();
    xhr.open(ve.method, ve.url);
    for (const [k, v] of Object.entries(ve.headers)) xhr.setRequestHeader(k, v);
    xhr.upload.onprogress = (e) =&gt; e.lengthComputable &amp;&amp; tienDo(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () =&gt;
      xhr.status &lt; 300
        ? xong()
        : hong(new ApiError(xhr.status, 'TAI_ANH_HONG', \`Kho ảnh từ chối (HTTP \${xhr.status}) — thử lại\`));
    xhr.onerror = () =&gt; hong(new ApiError(0, 'MAT_KET_NOI', 'Mất kết nối khi tải ảnh lên'));
    signal?.addEventListener('abort', () =&gt; xhr.abort());
    xhr.onabort = () =&gt; hong(new DOMException('Đã huỷ', 'AbortError'));
    xhr.send(tep); // Content-Length do trình duyệt tự đặt = tep.size — đúng con số đã khai trong vé
  });
  return ve.key;
}`;

const VIET_BAI = `import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { api } from '../api/client';
import { ApiError } from '../api/loi';
import { taiAnh } from '../api/tai-anh';
import type { Bai } from '../api/types';
import HopLoi from '../components/HopLoi';
import OTruong from '../components/OTruong';

type Buoc = 'nhap' | 'tai-anh' | 'tao-bai';

export default function VietBai() {
  const di = useNavigate();
  const [anh, setAnh] = useState&lt;{ tep: File; url: string } | null&gt;(null);
  const [buoc, setBuoc] = useState&lt;Buoc&gt;('nhap');
  const [tienDo, setTienDo] = useState(0);
  const [loi, setLoi] = useState&lt;ApiError | null&gt;(null);
  const dangGui = useRef(false); // chặn gửi 2 lần NGAY LẬP TỨC — không đợi lượt render sau mới thấy nút disabled
  const huy = useRef&lt;AbortController | null&gt;(null);

  // Ảnh xem trước là URL "blob:" trỏ vào tệp trong bộ nhớ ⇒ phải thu hồi khi đổi ảnh và khi rời trang, nếu không rò bộ nhớ.
  // Tạo/thu hồi ngay trong sự kiện chọn tệp (không dùng effect + setState — oxlint: set-state-in-effect).
  const urlDangDung = useRef&lt;string | null&gt;(null);
  function chonAnh(t: File | undefined) {
    if (urlDangDung.current) URL.revokeObjectURL(urlDangDung.current);
    urlDangDung.current = t ? URL.createObjectURL(t) : null;
    setAnh(t &amp;&amp; urlDangDung.current ? { tep: t, url: urlDangDung.current } : null);
  }
  useEffect(
    () =&gt; () =&gt; {
      if (urlDangDung.current) URL.revokeObjectURL(urlDangDung.current);
    },
    [],
  );

  useEffect(() =&gt; () =&gt; huy.current?.abort(), []); // rời trang giữa chừng ⇒ huỷ tải lên

  async function gui(e: FormEvent&lt;HTMLFormElement&gt;) {
    e.preventDefault();
    if (dangGui.current) return;
    dangGui.current = true;
    setLoi(null);
    const f = new FormData(e.currentTarget);
    const ac = new AbortController();
    huy.current = ac;
    try {
      let imageKey: string | undefined;
      if (anh) {
        setBuoc('tai-anh');
        imageKey = await taiAnh(anh.tep, setTienDo, ac.signal);
      }
      setBuoc('tao-bai');
      const bai = await api&lt;Bai&gt;('/posts', {
        method: 'POST',
        signal: ac.signal,
        body: { title: f.get('title'), body: f.get('body'), status: f.get('status'), imageKey },
      });
      di(\`/bai/\${bai.id}\`, { replace: true });
    } catch (err) {
      if (ac.signal.aborted) return;
      setLoi(err instanceof ApiError ? err : new ApiError(0, 'KHONG_RO', String(err)));
      setBuoc('nhap');
    } finally {
      dangGui.current = false;
    }
  }

  const ban = buoc !== 'nhap';
  const loiChung = loi &amp;&amp; loi.details.length === 0 ? loi : null;
  return (
    &lt;section&gt;
      &lt;h1&gt;Viết bài&lt;/h1&gt;
      &lt;form onSubmit={gui} noValidate&gt;
        &lt;OTruong nhan="Tiêu đề" name="title" maxLength={120} disabled={ban} loi={loi?.loiTruong('title')} /&gt;
        &lt;label&gt;
          Nội dung
          &lt;textarea
            name="body"
            rows={8}
            disabled={ban}
            aria-invalid={loi?.loiTruong('body') ? true : undefined}
          /&gt;
          {loi?.loiTruong('body') &amp;&amp; &lt;span className="loi-truong"&gt;{loi.loiTruong('body')}&lt;/span&gt;}
        &lt;/label&gt;
        &lt;label&gt;
          Ảnh (tuỳ chọn — JPEG/PNG/WebP, tối đa 5 MB)
          &lt;input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp"
            disabled={ban}
            onChange={(e) =&gt; chonAnh(e.target.files?.[0])}
          /&gt;
          {(loi?.loiTruong('image') ?? loi?.loiTruong('imageKey')) &amp;&amp; (
            &lt;span className="loi-truong"&gt;{loi?.loiTruong('image') ?? loi?.loiTruong('imageKey')}&lt;/span&gt;
          )}
        &lt;/label&gt;
        {anh &amp;&amp; &lt;img src={anh.url} alt="Ảnh sẽ đăng" width={300} /&gt;}
        &lt;label&gt;
          Trạng thái
          &lt;select name="status" defaultValue="published" disabled={ban}&gt;
            &lt;option value="published"&gt;Đăng ngay&lt;/option&gt;
            &lt;option value="draft"&gt;Lưu nháp&lt;/option&gt;
          &lt;/select&gt;
        &lt;/label&gt;
        {buoc === 'tai-anh' &amp;&amp; &lt;progress max={100} value={tienDo} aria-label="Tiến độ tải ảnh" /&gt;}
        {loiChung &amp;&amp; &lt;HopLoi loi={loiChung} /&gt;}
        &lt;button disabled={ban}&gt;
          {buoc === 'tai-anh' ? \`Đang tải ảnh \${tienDo}%…\` : buoc === 'tao-bai' ? 'Đang đăng…' : 'Đăng bài'}
        &lt;/button&gt;
      &lt;/form&gt;
    &lt;/section&gt;
  );
}`;

const DANG_BAI = `[ 1330 ms] → POST http://localhost:41811/api/auth/login
[ 1404 ms] ← 200 POST http://localhost:41811/api/auth/login
[ 1613 ms] → POST http://localhost:41811/api/posts
[ 1620 ms] ← 400 POST http://localhost:41811/api/posts
[ 2247 ms] trống: lỗi title="không được để trống" · body="không được để trống"
[ 2926 ms] GIF: Chỉ nhận ảnh JPEG, PNG hoặc WebP
[ 3074 ms] xem trước: blob:http://localhost:41811/9a499e79-3ffc-4637-a078-986121ec1b91
[ 3251 ms] → POST http://localhost:41811/api/uploads
[ 3282 ms] ← 201 POST http://localhost:41811/api/uploads
[ 3342 ms] → POST http://localhost:41811/api/posts
[ 3552 ms] ← 201 POST http://localhost:41811/api/posts
[ 4432 ms] sang /bai/01a20e01-da0d-73cf-94a2-b7073d1cc83f · ảnh http://localhost:41813/chiase/posts/7e014517-bc00-434f-9fb2-d38adacdd7fa.webp · naturalWidth=800`;

const DUP_KHONG_REF = `[  983 ms] → POST http://localhost:41811/api/auth/refresh
[  990 ms] ← 401 POST http://localhost:41811/api/auth/refresh
[ 1134 ms] → POST http://localhost:41811/api/auth/login
[ 1216 ms] ← 200 POST http://localhost:41811/api/auth/login
[ 1411 ms] → POST http://localhost:41811/api/posts
[ 1416 ms] ← 400 POST http://localhost:41811/api/posts
[ 2862 ms] → POST http://localhost:41811/api/uploads
[ 2873 ms] ← 201 POST http://localhost:41811/api/uploads
[ 2913 ms] → POST http://localhost:41811/api/posts
[ 3045 ms] ← 201 POST http://localhost:41811/api/posts
[ 3924 ms] sang /bai/01a20e02-082f-7355-9844-dff9ce0f5900 · ảnh http://localhost:41813/chiase/posts/1b02c716-29cc-4bd1-9d71-317d7f611ef0.webp · naturalWidth=800`;

const HAI_SUBMIT = `== chặn bằng ref: co
[ 1688 ms] → POST http://localhost:41811/api/posts
== chặn bằng ref: khong
[ 1118 ms] → POST http://localhost:41811/api/posts
[ 1119 ms] → POST http://localhost:41811/api/posts`;

const FORM_BL = `import { useRef, useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router';
import { api } from '../api/client';
import { ApiError } from '../api/loi';
import type { BinhLuan } from '../api/types';
import { useAuth } from '../auth/ngu-canh';
import HopLoi from './HopLoi';

export default function FormBinhLuan({
  postId,
  khiXong,
}: {
  postId: string;
  khiXong: (b: BinhLuan) =&gt; void;
}) {
  const auth = useAuth();
  const o = useLocation();
  const [loi, setLoi] = useState&lt;ApiError | null&gt;(null);
  const [dangGui, setDangGui] = useState(false);
  const dangGuiRef = useRef(false);

  if (auth.kieu !== 'da-dang-nhap')
    return (
      &lt;p&gt;
        &lt;Link to={\`/dang-nhap?tiep=\${encodeURIComponent(o.pathname)}\`}&gt;Đăng nhập&lt;/Link&gt; để bình luận.
      &lt;/p&gt;
    );

  async function gui(e: FormEvent&lt;HTMLFormElement&gt;) {
    e.preventDefault();
    if (dangGuiRef.current) return;
    dangGuiRef.current = true;
    const form = e.currentTarget;
    setDangGui(true);
    setLoi(null);
    try {
      const bl = await api&lt;BinhLuan&gt;(\`/posts/\${postId}/comments\`, {
        method: 'POST',
        body: { body: new FormData(form).get('body') },
      });
      form.reset();
      khiXong(bl); // thêm vào đầu danh sách ngay — không tải lại cả trang
    } catch (err) {
      setLoi(err instanceof ApiError ? err : new ApiError(0, 'KHONG_RO', String(err)));
    } finally {
      dangGuiRef.current = false;
      setDangGui(false);
    }
  }

  return (
    &lt;form onSubmit={gui} noValidate&gt;
      &lt;label&gt;
        Bình luận của bạn
        &lt;textarea
          name="body"
          rows={3}
          maxLength={1000}
          aria-invalid={loi?.loiTruong('body') ? true : undefined}
        /&gt;
        {loi?.loiTruong('body') &amp;&amp; &lt;span className="loi-truong"&gt;{loi.loiTruong('body')}&lt;/span&gt;}
      &lt;/label&gt;
      {loi &amp;&amp; loi.details.length === 0 &amp;&amp; &lt;HopLoi loi={loi} /&gt;}
      &lt;button disabled={dangGui}&gt;{dangGui ? 'Đang gửi…' : 'Gửi bình luận'}&lt;/button&gt;
    &lt;/form&gt;
  );
}`;

const PAYLOAD = `&lt;img src=x onerror="fetch('/api/auth/refresh',{method:'POST'}).then(r=&gt;r.json()).then(j=&gt;console.log('XSS lấy được access token: '+j.accessToken.slice(0,24)+'…'))"&gt;`;

const XSS_CHU = `[ 5168 ms] bình luận đầu tiên hiện ra: &lt;img src=x onerror="fetch('/api/auth/refresh',{method:'POST'}).then(r=…
[ 5172 ms] số thẻ &lt;img&gt; trong khu bình luận: 0`;

const XSS_HTML = `[  745 ms] → POST http://localhost:41811/api/auth/refresh
[  751 ms] ← 401 POST http://localhost:41811/api/auth/refresh
[  857 ms] → POST http://localhost:41811/api/auth/login
[  936 ms] ← 200 POST http://localhost:41811/api/auth/login
[ 1845 ms] → POST http://localhost:41811/api/auth/refresh
[ 1934 ms] ← 200 POST http://localhost:41811/api/auth/refresh
[ 1934 ms] → POST http://localhost:41811/api/auth/refresh
[ 1980 ms] ← 200 POST http://localhost:41811/api/auth/refresh
[ 1981 ms] console.log: XSS lấy được access token: eyJhbGciOiJIUzI1NiIsInR5…
[ 2171 ms] → POST http://localhost:41811/api/auth/refresh
[ 2207 ms] ← 200 POST http://localhost:41811/api/auth/refresh
[ 2226 ms] → POST http://localhost:41811/api/auth/refresh
[ 2252 ms] ← 200 POST http://localhost:41811/api/auth/refresh
[ 2253 ms] console.log: XSS lấy được access token: eyJhbGciOiJIUzI1NiIsInR5…
[ 3679 ms] bình luận đầu tiên hiện ra: …
[ 3685 ms] số thẻ &lt;img&gt; trong khu bình luận: 1`;

const THE = [
  lienKet({ khoa: 'react', bai: 'rx-3-2-react-hook-form', title: 'React 3.2 — React Hook Form + Zod', sub: 'Khi form lớn hơn: register, một schema cho luật, lỗi từ server đổ vào setError.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'react', bai: 'rx-3-3-loi', title: 'React 3.3 — Lỗi, đang gửi và trạng thái submit', sub: 'Lỗi đúng chỗ, không gửi hai lần, giữ dữ liệu khi lỗi.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'react', bai: 'rx-13-4-bao-mat-i18n', title: 'React 13.4 — HTML an toàn (XSS, DOMPurify)', sub: 'Khi BẮT BUỘC phải hiện HTML người dùng: làm sạch thế nào.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'object-storage', bai: 'os-4-1-vi-sao', title: 'Object Storage 4.1 — Vì sao upload thẳng từ trình duyệt', sub: 'Nền của luồng vé → PUT trong bài này.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'object-storage', bai: 'os-5-1-vi-sao-cors', title: 'Object Storage 5.1 — CORS cho upload từ trình duyệt', sub: 'Vì sao PUT sang kho (origin khác) cần CORS của bucket — thứ ta đã đặt cho MinIO.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('🕵️', 'Wikipedia — TweetDeck (lỗ hổng XSS 11/06/2014)', 'en.wikipedia.org', 'https://en.wikipedia.org/wiki/TweetDeck'),
  nguon('⚛️', 'React — Dangerously setting the inner HTML', 'react.dev', 'https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html'),
].join('\n');

const MERMAID = `sequenceDiagram
  participant U as Form React
  participant A as API
  participant K as Kho ảnh (MinIO/R2)
  U->>U: kiểm loại + cỡ (chỉ để báo sớm)
  U->>A: POST /api/uploads {contentType, size}
  A-->>U: 201 {key: tmp/…, url ký sẵn}
  U->>K: PUT url (XMLHttpRequest, có tiến độ)
  K-->>U: 200
  U->>A: POST /api/posts {title, body, status, imageKey}
  A->>K: đọc tmp/…, duyệt bằng sharp, ghi posts/….webp
  A-->>U: 201 bài mới ⇒ chuyển sang /bai/:id`;

export default {
  title: '6.3 — The post form with an image, and the comment form|||6.3 — Form đăng bài kèm ảnh, và form bình luận',
  slug: 'fp-6-3-form-dang-bai',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Form viết bài đi đúng luồng của Chương 4 từ trình duyệt: xin vé → PUT thẳng lên kho có thanh tiến độ → tạo bài. Lỗi từng trường từ details[] của API, ảnh xem trước không rò bộ nhớ, và đo thật chuyện gửi hai lần: bấm đúp thì React 19 tự chặn, nhưng hai requestSubmit() cùng tác vụ tạo hai bài nếu thiếu chặn bằng ref. Form bình luận hiện chữ an toàn — và đo hậu quả nếu dùng dangerouslySetInnerHTML: mã chèn lấy được access token mới dù token không nằm trong storage. Kèm vụ TweetDeck 2014.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Frontend foundation</span>
<h2>A form that uploads, reports every error in the right place, and never posts twice</h2>
<p class="lead">Chapter 4 built the upload flow and tested it with curl: ask the API for a ticket, PUT the file straight to object storage, then create the post with the temporary key. Now a person does it from a form, with a slow connection, a wrong file, an impatient double click. This lesson builds the "write a post" page and the comment box, measures what actually goes wrong in Chrome, and ends with the most important line in any frontend that shows user content.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. The upload helper</h3>
<pre><code class="language-ts">${TAI_ANH}</code></pre>
<p>Three notes. The checks in the browser are for <em>speed of feedback only</em> — the API signs the declared type and size into the URL and Chapter 4's <code>duyetAnh</code> decodes the image with sharp; a user who edits this JavaScript gains nothing. The client errors use the same <code>ApiError</code> shape with a <code>details[]</code> entry for the field <code>image</code>, so the form has one way to show errors whether they came from the API or not. And the PUT uses <code>XMLHttpRequest</code> because <code>fetch</code> still has no upload progress event; on a phone, a 3 MB photo without a progress bar looks frozen.</p>
<p>The PUT goes to another origin (MinIO on 41813, R2 in production). That is the one place ChiaSe needs CORS — on the <em>bucket</em>, which we configured in lesson 4.2 for <code>http://localhost:41811</code>.</p>

<h3>2. The page</h3>
<pre><code class="language-tsx">${VIET_BAI}</code></pre>
<p>The preview uses a <code>blob:</code> URL that points at the file in memory. The first draft created it in an effect and stored it with <code>setState</code> — oxlint flagged <code>set-state-in-effect</code> again (lesson 6.1). The better design is the event: when the user picks a file, revoke the previous URL, create the new one, set state once. One effect remains, with no state: revoke on unmount.</p>

<h3>3. Measured in Chrome</h3>
<p>A script logs in, submits the empty form, picks a GIF, then picks a real photo and <strong>double-clicks</strong> "Đăng bài":</p>
<div class="out">${DANG_BAI}</div>
<ul>
<li>Empty form: the API answered 400 with <code>details</code> for <code>title</code> and <code>body</code>; both messages appear under their inputs, <code>aria-invalid</code> set.</li>
<li>GIF: stopped in the browser — no request in the log.</li>
<li>Real photo: one ticket (201), the PUT to MinIO (not shown: the filter prints only <code>/api/</code>), one <code>POST /posts</code> (201), navigation to the new post, and the image served from <code>posts/&lt;uuid&gt;.webp</code> at 800 px — resized and stripped of EXIF by the API (lesson 4.3).</li>
<li>The double click produced <strong>one</strong> post.</li>
</ul>

<h3>4. Do we even need the ref guard?</h3>
<p>The form has two guards against double submission: the button is <code>disabled</code> while sending, and <code>dangGui.current</code> (a ref) returns early. To see which one matters, we removed the ref and double-clicked again:</p>
<div class="out">${DUP_KHONG_REF}</div>
<p>Still one post. React 19 handles a click as a <em>discrete</em> event and commits its state update before the browser delivers the next click, so the second click lands on a disabled button. But clicks are not the only way to submit. We called <code>form.requestSubmit()</code> twice in the same task — what a script, a browser extension, or a fast Enter key handler can do — with and without the ref:</p>
<div class="out">${HAI_SUBMIT}</div>
<p>Without the ref: <strong>two posts</strong>. Both submit events ran before React re-rendered, so both saw <code>disabled = false</code>. A ref changes immediately, not on the next render. Keep both: <code>disabled</code> tells the user, the ref protects the data. The real cure for duplicates lives on the server (an idempotency key per submission) — a good exercise, and a topic in Chapter 8's tests.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — testing double submit with a mouse.</strong> "I clicked fast twice and got one post, so it's fine." The measurement above shows why that proves little: the dangerous path is two submits in one task, which a mouse cannot produce. Test with <code>requestSubmit()</code> twice, or a slow network and Enter.</p></div>

<h3>5. Comments — and the one line that matters</h3>
<pre><code class="language-tsx">${FORM_BL}</code></pre>
<p>A new comment is added to the top of the list from the API's response — no reload — and the count goes up by one. On the post page each comment is rendered with <code>{c.body}</code>, as <em>text</em>. We posted this as Bình's comment:</p>
<pre><code class="language-html">${PAYLOAD}</code></pre>
<div class="out">${XSS_CHU}</div>
<p>Displayed verbatim, zero <code>&lt;img&gt;</code> elements: React escapes <code>&lt;</code>, <code>&gt;</code>, <code>&amp;</code> and quotes when it puts a string into the DOM. Then we changed one line to what tutorials sometimes do to "support formatting" — <code>dangerouslySetInnerHTML={{ __html: c.body }}</code> — and opened the post as a logged-in user:</p>
<div class="out">${XSS_HTML}</div>
<p>The injected code ran on every page load. It did not need the access token from memory and could not read the <code>httpOnly</code> cookie — it simply called <code>/api/auth/refresh</code>, the browser attached the cookie, and the API handed it a fresh access token. From there it can post, comment, delete, as the victim, for as long as the page is open. <strong>In-memory tokens and httpOnly cookies limit theft, not abuse.</strong> The only real defence is to never turn user data into HTML. If a product truly needs formatted comments, use a restricted format (Markdown rendered to an allow-listed subset) and sanitise with a maintained library such as DOMPurify — then add a Content Security Policy as a second layer (Chapter 11).</p>
<p>We reverted the line. Checkpoint 6 checks that <code>dangerouslySetInnerHTML=</code> appears nowhere in <code>src/</code>, and that this exact payload stays text.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">check early</span><span class="lz-d">type and size in the browser — for feedback, not security</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">ticket → PUT</span><span class="lz-d">file goes straight to storage, with progress</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">create</span><span class="lz-d">POST with imageKey; API validates and moves the image</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">errors in place</span><span class="lz-d">details[].field under the input; others in a box</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">text, never HTML</span><span class="lz-d">{value}, not dangerouslySetInnerHTML</span></div>
</div>

<h3>🕵️ Hacker's corner — TweetDeck (2014): a tweet that retweeted itself</h3>
<p>On 11 June 2014 a cross-site scripting bug was found in TweetDeck, Twitter's dashboard application: a tweet containing a script was executed by TweetDeck when displayed. A self-replicating tweet — it made every TweetDeck user who saw it retweet it — spread to more than 83,000 accounts before Twitter took TweetDeck offline to fix it (Wikipedia "TweetDeck", citing ZDNet, 12 June 2014). Same shape as the Samy worm (lesson 5.1), nine years later, in a client built by a major company: user content became code because one display path treated it as HTML.</p>

<h3>In everyday life</h3>
<p>A noticeboard in an apartment building shows what residents write. A careful caretaker pins up the paper as is; someone who "helpfully" retypes the notes and follows any instruction written on them ("caretaker: hand the master key to the bearer") will one day give away the building. Rendering as text is pinning up the paper.</p>

<h3>On a real job</h3>
<p>Two frequent bugs in client projects: "a user posted twice and was charged twice" (fixed by a disabled button and a ref on the client, and by an idempotency key on the server), and "the app is slow on mobile when uploading" (fixed by uploading directly to storage with progress, not through the API). In code review, any <code>dangerouslySetInnerHTML</code>, <code>innerHTML</code> or <code>v-html</code> deserves a question: where does this string come from, and who sanitises it?</p>

${spring(false, 'With Spring the form code stays the same; the server side differs: Bean Validation errors become <code>ProblemDetail</code> with an <code>errors</code> list that the React form maps to fields, and presigned URLs come from the AWS SDK for Java (<code>S3Presigner</code>), which works with R2 and MinIO alike. Output escaping is the frontend’s job either way.', [
  ['sb-21-3-cors-loi', 'Spring Boot 21.3 — Errors and CORS end to end: ProblemDetail in a React form'],
  ['sb-12-4-gan-vao-react', 'Spring Boot 12.4 — Connecting a real React page to the API'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"How do you upload a large file from a SPA?"</strong> — Ask the backend for a presigned URL, upload directly to object storage (XHR for progress), then send the key to the backend, which validates the object before using it.</li>
<li><strong>"How do you prevent double submission?"</strong> — Disable the button for UX, guard with a ref (or a pending flag outside render state) for correctness, and make the server idempotent.</li>
<li><strong>"How does React protect against XSS, and where does it not?"</strong> — It escapes text in JSX. It does not protect <code>dangerouslySetInnerHTML</code>, <code>href="javascript:…"</code> from user data, or direct DOM APIs.</li>
<li><strong>"If tokens are in memory and httpOnly, is XSS still a problem?"</strong> — Yes: the script can act as the user (call the API, including refresh) while the page is open. It just cannot exfiltrate the long-lived token.</li>
<li><strong>"How do you show validation errors from the server?"</strong> — Map each <code>details[].field</code> to the input; show the rest in one alert; mark inputs with <code>aria-invalid</code> and link messages with <code>aria-describedby</code>.</li>
</ol>

<h3>🧪 Lab 6.3 (90 minutes)</h3>
<div class="callout ok">
<ol>
<li>Write <code>api/tai-anh.ts</code> and <code>pages/VietBai.tsx</code>. Upload a real photo from your phone; confirm the post shows a WebP from <code>posts/</code>.</li>
<li>Throttle the network to "Slow 3G" in DevTools and watch the progress bar.</li>
<li>Remove the ref guard; call <code>document.querySelector('form').requestSubmit()</code> twice in the console; count posts in the database. Restore the guard.</li>
<li>Write <code>FormBinhLuan</code>. Post the <code>&lt;img onerror&gt;</code> payload; prove it is text. Then (locally only) switch to <code>dangerouslySetInnerHTML</code>, observe the payload calling <code>/auth/refresh</code> in the Network tab, and switch back.</li>
</ol>
<p><strong>Done when:</strong> a post with an image goes from form to page in one flow with progress, API field errors appear under the right inputs, two synchronous submits create one post, and HTML in a comment is displayed as text.</p>
<p><strong>Rubric (10):</strong> upload with progress (2) · client checks with the same error shape (1) · preview URL revoked (1) · field errors + aria (1) · double-submit measured both ways (2) · comment appended without reload (1) · XSS demonstrated and reverted, with an explanation of what httpOnly does not stop (2).</p>
</div>
<details><summary>Solution</summary>
<p>Commit <code>8d67c74</code> on <code>ch6/frontend</code>: <code>src/api/tai-anh.ts</code>, <code>src/pages/VietBai.tsx</code>, <code>src/components/FormBinhLuan.tsx</code>, <code>src/pages/BaiViet.tsx</code> (form wired in, count updated). If the PUT fails with a CORS error in the console, the bucket's CORS does not list your page's origin (MinIO: <code>MINIO_API_CORS_ALLOW_ORIGIN</code>; R2: bucket CORS policy). If it fails with 403 <code>SignatureDoesNotMatch</code>, the <code>content-type</code> you send differs from the one in the ticket.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">presigned URL</span><span class="v">Time-limited URL signed by the backend that lets the browser PUT one object.</span></div>
  <div class="kv"><span class="k">upload progress</span><span class="v">xhr.upload.onprogress; fetch has no equivalent yet.</span></div>
  <div class="kv"><span class="k">blob: URL</span><span class="v">URL to an in-memory file; must be revoked with URL.revokeObjectURL.</span></div>
  <div class="kv"><span class="k">discrete event</span><span class="v">Event such as click or submit whose updates React commits before the next one.</span></div>
  <div class="kv"><span class="k">XSS</span><span class="v">Cross-site scripting: user data executed as code in another user's page.</span></div>
  <div class="kv"><span class="k">idempotency key</span><span class="v">Client-generated id per action so the server can ignore repeats.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The browser follows Chapter 4's flow: ticket → direct PUT with progress → create post with the key.</li>
<li>Client checks only speed up feedback; errors from both sides share one shape and land under the right input.</li>
<li>Double click: React 19 already blocks it. Two submits in one task: only a ref blocks it — measured 2 posts vs 1.</li>
<li>User content is rendered as text. With <code>dangerouslySetInnerHTML</code> an injected comment obtained a fresh access token via the refresh cookie.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Nền frontend</span>
<h2>Một form biết tải ảnh, báo mọi lỗi đúng chỗ, và không bao giờ đăng hai lần</h2>
<p class="lead">Chương 4 dựng luồng tải ảnh và thử bằng curl: xin API một vé, PUT tệp thẳng lên kho, rồi tạo bài với khoá tạm. Giờ một con người làm việc đó từ form, với mạng chậm, tệp sai, và cú bấm đúp sốt ruột. Bài này dựng trang "viết bài" và ô bình luận, đo thật những gì hỏng trong Chrome, và kết thúc bằng dòng quan trọng nhất của mọi frontend hiển thị nội dung người dùng.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Hàm tải ảnh</h3>
<pre><code class="language-ts">${TAI_ANH}</code></pre>
<p>Ba ghi chú. Phép kiểm ở trình duyệt chỉ để <em>báo lỗi sớm</em> — API ký loại và kích thước đã khai vào URL, và <code>duyetAnh</code> của Chương 4 giải mã ảnh bằng sharp; người dùng sửa JavaScript này cũng chẳng được gì. Lỗi phía client dùng đúng hình dạng <code>ApiError</code> với một dòng <code>details[]</code> cho trường <code>image</code>, nên form chỉ có một cách hiện lỗi dù lỗi từ API hay không. Và PUT dùng <code>XMLHttpRequest</code> vì <code>fetch</code> vẫn chưa có sự kiện tiến độ tải lên; trên điện thoại, ảnh 3 MB mà không có thanh tiến độ thì trông như bị treo.</p>
<p>PUT đi sang origin khác (MinIO cổng 41813, production là R2). Đó là chỗ duy nhất ChiaSe cần CORS — CORS của <em>bucket</em>, đã đặt ở bài 4.2 cho <code>http://localhost:41811</code>.</p>

<h3>2. Trang viết bài</h3>
<pre><code class="language-tsx">${VIET_BAI}</code></pre>
<p>Ảnh xem trước dùng URL <code>blob:</code> trỏ vào tệp trong bộ nhớ. Bản nháp đầu tạo nó trong effect rồi lưu bằng <code>setState</code> — oxlint lại báo <code>set-state-in-effect</code> (bài 6.1). Thiết kế tốt hơn là xử lý ở sự kiện: người dùng chọn tệp thì thu hồi URL cũ, tạo URL mới, set state một lần. Còn đúng một effect, không có state: thu hồi khi rời trang.</p>

<h3>3. Đo trong Chrome</h3>
<p>Một script đăng nhập, gửi form trống, chọn một ảnh GIF, rồi chọn ảnh thật và <strong>bấm đúp</strong> "Đăng bài":</p>
<div class="out">${DANG_BAI}</div>
<ul>
<li>Form trống: API trả 400 kèm <code>details</code> cho <code>title</code> và <code>body</code>; hai câu lỗi hiện dưới đúng ô, có <code>aria-invalid</code>.</li>
<li>GIF: chặn ở trình duyệt — log không có request nào.</li>
<li>Ảnh thật: một vé (201), PUT lên MinIO (không hiện: bộ lọc chỉ in <code>/api/</code>), một <code>POST /posts</code> (201), chuyển sang bài mới, ảnh phục vụ từ <code>posts/&lt;uuid&gt;.webp</code> rộng 800 px — API đã thu nhỏ và bỏ EXIF (bài 4.3).</li>
<li>Bấm đúp ra <strong>một</strong> bài.</li>
</ul>

<h3>4. Có thật cần chặn bằng ref không?</h3>
<p>Form có hai lớp chặn gửi hai lần: nút <code>disabled</code> khi đang gửi, và <code>dangGui.current</code> (một ref) thoát sớm. Để biết lớp nào quan trọng, ta bỏ ref rồi bấm đúp lại:</p>
<div class="out">${DUP_KHONG_REF}</div>
<p>Vẫn một bài. React 19 xử lý click là sự kiện <em>rời rạc</em> và áp cập nhật state trước khi trình duyệt giao cú click tiếp theo, nên cú thứ hai rơi vào nút đã bị vô hiệu. Nhưng click không phải cách duy nhất để gửi form. Ta gọi <code>form.requestSubmit()</code> hai lần trong cùng một tác vụ — điều mà một script, một tiện ích trình duyệt, hay một hàm bắt phím Enter nhanh tay làm được — có và không có ref:</p>
<div class="out">${HAI_SUBMIT}</div>
<p>Không có ref: <strong>hai bài</strong>. Cả hai sự kiện submit chạy trước khi React render lại, nên cả hai đều thấy <code>disabled = false</code>. Ref đổi ngay lập tức, không đợi lượt render sau. Giữ cả hai: <code>disabled</code> để báo người dùng, ref để bảo vệ dữ liệu. Thuốc thật cho chuyện trùng nằm ở máy chủ (khoá idempotency cho mỗi lần gửi) — một bài tập hay, và là chủ đề trong test ở Chương 8.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — thử gửi hai lần bằng chuột.</strong> "Mình bấm nhanh hai lần chỉ ra một bài, vậy là ổn." Số đo trên cho thấy vì sao điều đó chứng minh rất ít: đường nguy hiểm là hai lần submit trong một tác vụ, chuột không tạo ra được. Thử bằng <code>requestSubmit()</code> hai lần, hoặc mạng chậm + phím Enter.</p></div>

<h3>5. Bình luận — và dòng quan trọng nhất</h3>
<pre><code class="language-tsx">${FORM_BL}</code></pre>
<p>Bình luận mới được thêm vào đầu danh sách từ chính phản hồi của API — không tải lại — và bộ đếm tăng một. Ở trang bài, mỗi bình luận hiện bằng <code>{c.body}</code>, dạng <em>chữ</em>. Ta gửi đoạn này dưới tên Bình:</p>
<pre><code class="language-html">${PAYLOAD}</code></pre>
<div class="out">${XSS_CHU}</div>
<p>Hiện nguyên văn, không có thẻ <code>&lt;img&gt;</code> nào: React thoát <code>&lt;</code>, <code>&gt;</code>, <code>&amp;</code> và dấu nháy khi đưa chuỗi vào DOM. Rồi ta đổi một dòng thành thứ mà tutorial đôi khi làm để "hỗ trợ định dạng" — <code>dangerouslySetInnerHTML={{ __html: c.body }}</code> — và mở bài bằng một người dùng đã đăng nhập:</p>
<div class="out">${XSS_HTML}</div>
<p>Mã chèn chạy ở mỗi lần tải trang. Nó không cần access token trong bộ nhớ và không đọc được cookie <code>httpOnly</code> — nó chỉ việc gọi <code>/api/auth/refresh</code>, trình duyệt tự gắn cookie, và API trao cho nó một access token mới. Từ đó nó đăng bài, bình luận, xoá — nhân danh nạn nhân — chừng nào trang còn mở. <strong>Token trong bộ nhớ và cookie httpOnly hạn chế bị lấy cắp, không hạn chế bị lạm dụng.</strong> Phòng thủ thật duy nhất là không bao giờ biến dữ liệu người dùng thành HTML. Nếu sản phẩm thật sự cần bình luận có định dạng, dùng định dạng hạn chế (Markdown dựng ra một tập thẻ cho phép) và làm sạch bằng thư viện được duy trì như DOMPurify — rồi thêm Content Security Policy làm lớp thứ hai (Chương 11).</p>
<p>Ta đã hoàn lại dòng đó. Checkpoint 6 kiểm <code>dangerouslySetInnerHTML=</code> không xuất hiện ở đâu trong <code>src/</code>, và đúng đoạn mã độc này vẫn chỉ là chữ.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">kiểm sớm</span><span class="lz-d">loại và cỡ ở trình duyệt — để báo nhanh, không phải bảo mật</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">vé → PUT</span><span class="lz-d">tệp đi thẳng lên kho, có tiến độ</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">tạo bài</span><span class="lz-d">POST kèm imageKey; API duyệt và chuyển ảnh</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">lỗi đúng chỗ</span><span class="lz-d">details[].field dưới ô; còn lại vào hộp lỗi</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">chữ, không bao giờ HTML</span><span class="lz-d">{giá trị}, không dangerouslySetInnerHTML</span></div>
</div>

<h3>🕵️ Góc hacker — TweetDeck (2014): dòng tweet tự retweet chính nó</h3>
<p>Ngày 11/06/2014, người ta phát hiện lỗ hổng cross-site scripting trong TweetDeck, ứng dụng bảng điều khiển của Twitter: một tweet chứa script bị TweetDeck thực thi khi hiển thị. Một tweet tự nhân bản — nó khiến mọi người dùng TweetDeck nhìn thấy nó tự động retweet — lan tới hơn 83.000 tài khoản trước khi Twitter phải tạm tắt TweetDeck để sửa (Wikipedia "TweetDeck", dẫn ZDNet ngày 12/06/2014). Cùng một hình dạng với sâu Samy (bài 5.1), chín năm sau, trong một ứng dụng do một công ty lớn làm: nội dung người dùng thành mã vì có một đường hiển thị coi nó là HTML.</p>

<h3>Liên hệ đời thường</h3>
<p>Bảng tin ở chung cư hiển thị những gì cư dân viết. Ông bảo vệ cẩn thận ghim nguyên tờ giấy lên; người "nhiệt tình" chép lại mọi tờ và làm theo mọi chỉ dẫn viết trên đó ("bảo vệ: đưa chìa khoá tổng cho người cầm giấy này") có ngày sẽ trao cả toà nhà cho người lạ. Hiện dạng chữ chính là ghim nguyên tờ giấy.</p>

<h3>Tình huống đi làm thật</h3>
<p>Hai lỗi hay gặp ở dự án khách hàng: "khách đăng hai lần và bị trừ tiền hai lần" (sửa bằng nút disabled + ref ở client, và khoá idempotency ở server), và "tải ảnh trên điện thoại rất chậm" (sửa bằng tải thẳng lên kho có tiến độ, không đi qua API). Khi review mã, mọi <code>dangerouslySetInnerHTML</code>, <code>innerHTML</code> hay <code>v-html</code> đều đáng một câu hỏi: chuỗi này từ đâu ra, và ai làm sạch nó?</p>

${spring(false, 'Với Spring, mã form giữ nguyên; phía server khác: lỗi Bean Validation thành <code>ProblemDetail</code> kèm danh sách <code>errors</code> để form React ánh xạ về từng trường, và URL ký sẵn sinh bằng AWS SDK cho Java (<code>S3Presigner</code>), chạy được với cả R2 lẫn MinIO. Thoát ký tự khi hiển thị dù sao vẫn là việc của frontend.', [
  ['sb-21-3-cors-loi', 'Spring Boot 21.3 — Lỗi và CORS trọn tuyến: ProblemDetail trong form React'],
  ['sb-12-4-gan-vao-react', 'Spring Boot 12.4 — Gắn một trang React thật vào API'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Tải tệp lớn từ SPA thế nào?"</strong> — Xin backend một URL ký sẵn, tải thẳng lên object storage (XHR để có tiến độ), rồi gửi khoá cho backend, backend kiểm đối tượng trước khi dùng.</li>
<li><strong>"Chặn gửi hai lần thế nào?"</strong> — Vô hiệu nút cho trải nghiệm, chặn bằng ref (hoặc cờ nằm ngoài state render) cho đúng đắn, và làm server idempotent.</li>
<li><strong>"React chống XSS thế nào, và chỗ nào nó không chống?"</strong> — Nó thoát chữ trong JSX. Nó không bảo vệ <code>dangerouslySetInnerHTML</code>, <code>href="javascript:…"</code> lấy từ dữ liệu người dùng, hay thao tác DOM trực tiếp.</li>
<li><strong>"Token trong bộ nhớ và httpOnly rồi, XSS còn là vấn đề không?"</strong> — Còn: script hành động được thay người dùng (gọi API, kể cả refresh) khi trang còn mở. Nó chỉ không mang token dài hạn đi được.</li>
<li><strong>"Hiện lỗi validate từ server thế nào?"</strong> — Ánh xạ từng <code>details[].field</code> về ô nhập; phần còn lại vào một hộp lỗi; đánh dấu ô bằng <code>aria-invalid</code> và nối câu lỗi bằng <code>aria-describedby</code>.</li>
</ol>

<h3>🧪 Lab 6.3 (90 phút)</h3>
<div class="callout ok">
<ol>
<li>Viết <code>api/tai-anh.ts</code> và <code>pages/VietBai.tsx</code>. Tải một ảnh chụp từ điện thoại của bạn; xác nhận bài hiện ảnh WebP từ <code>posts/</code>.</li>
<li>Bóp mạng xuống "Slow 3G" trong DevTools và xem thanh tiến độ.</li>
<li>Bỏ chặn bằng ref; gọi <code>document.querySelector('form').requestSubmit()</code> hai lần trong console; đếm bài trong CSDL. Đặt lại phép chặn.</li>
<li>Viết <code>FormBinhLuan</code>. Gửi đoạn <code>&lt;img onerror&gt;</code>; chứng minh nó là chữ. Rồi (chỉ trên máy mình) đổi sang <code>dangerouslySetInnerHTML</code>, nhìn đoạn mã gọi <code>/auth/refresh</code> trong tab Network, rồi đổi lại.</li>
</ol>
<p><strong>Xong khi:</strong> bài có ảnh đi từ form tới trang bài trong một luồng có tiến độ, lỗi từng trường của API hiện dưới đúng ô, hai lần submit đồng bộ chỉ tạo một bài, và HTML trong bình luận hiện dạng chữ.</p>
<p><strong>Thang điểm (10):</strong> tải lên có tiến độ (2) · kiểm phía client cùng hình dạng lỗi (1) · thu hồi URL xem trước (1) · lỗi theo trường + aria (1) · đo gửi hai lần cả hai cách (2) · bình luận thêm vào không cần tải lại (1) · trình diễn XSS rồi hoàn lại, giải thích httpOnly không chặn được gì (2).</p>
</div>
<details><summary>Lời giải</summary>
<p>Commit <code>8d67c74</code> trên <code>ch6/frontend</code>: <code>src/api/tai-anh.ts</code>, <code>src/pages/VietBai.tsx</code>, <code>src/components/FormBinhLuan.tsx</code>, <code>src/pages/BaiViet.tsx</code> (gắn form, cập nhật bộ đếm). Nếu PUT hỏng với lỗi CORS trong console, CORS của bucket chưa có origin của trang (MinIO: <code>MINIO_API_CORS_ALLOW_ORIGIN</code>; R2: chính sách CORS của bucket). Nếu hỏng với 403 <code>SignatureDoesNotMatch</code>, <code>content-type</code> bạn gửi khác cái đã ghi trong vé.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">URL ký sẵn</span><span class="v">URL có hạn do backend ký, cho trình duyệt PUT đúng một đối tượng.</span></div>
  <div class="kv"><span class="k">tiến độ tải lên</span><span class="v">xhr.upload.onprogress; fetch chưa có cái tương đương.</span></div>
  <div class="kv"><span class="k">URL blob:</span><span class="v">URL trỏ vào tệp trong bộ nhớ; phải thu hồi bằng URL.revokeObjectURL.</span></div>
  <div class="kv"><span class="k">sự kiện rời rạc</span><span class="v">Sự kiện như click, submit mà React áp cập nhật trước khi tới sự kiện sau.</span></div>
  <div class="kv"><span class="k">XSS</span><span class="v">Cross-site scripting: dữ liệu người dùng bị chạy như mã trong trang của người khác.</span></div>
  <div class="kv"><span class="k">khoá idempotency</span><span class="v">Mã do client sinh cho mỗi hành động để server bỏ qua lần lặp.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Trình duyệt đi đúng luồng Chương 4: vé → PUT thẳng có tiến độ → tạo bài kèm khoá.</li>
<li>Kiểm phía client chỉ để báo nhanh; lỗi hai phía cùng một hình dạng và nằm dưới đúng ô.</li>
<li>Bấm đúp: React 19 đã tự chặn. Hai submit trong một tác vụ: chỉ ref chặn được — đo được 2 bài so với 1.</li>
<li>Nội dung người dùng hiện dạng chữ. Với <code>dangerouslySetInnerHTML</code>, một bình luận chèn mã lấy được access token mới qua cookie refresh.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
