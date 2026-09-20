/**
 * DTG304 — Principles of Compositing (Nguyên lý ghép hình / hậu kỳ hình ảnh).
 * Ngành Thiết kế mỹ thuật số, kỳ 5, FPTU. Giáo trình: Ron Brinkmann "The Art
 * and Science of Digital Compositing"; Steve Wright "Digital Compositing for
 * Film and Video"; tài liệu Nuke (Foundry) & After Effects. Song ngữ VI+EN.
 * Giữ NGUYÊN slug/semester/thumb/courseCode. ⚠️ KHÔNG backtick/${; "<"→&lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dtg304-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách nền tảng (Brinkmann, Wright), tài liệu chính thức Nuke & After Effects, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">DTG304 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>digital compositing</strong> — the art and science of combining images from different sources into one seamless shot — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal, industry-standard resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for DTG304 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.routledge.com/The-Art-and-Science-of-Digital-Compositing/Brinkmann/p/book/9780123706386" target="_blank" rel="noopener"><em>The Art and Science of Digital Compositing</em> — Ron Brinkmann</a> (the field's foundational text)</li>
<li><a href="https://www.routledge.com/Digital-Compositing-for-Film-and-Video/Wright/p/book/9781138859074" target="_blank" rel="noopener"><em>Digital Compositing for Film and Video</em> — Steve Wright</a> (practical, technique-first)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://learn.foundry.com/nuke" target="_blank" rel="noopener">Foundry Nuke — official learning &amp; docs</a></li>
<li><a href="https://helpx.adobe.com/after-effects/user-guide.html" target="_blank" rel="noopener">Adobe After Effects — user guide</a></li>
<li><a href="https://www.blackmagicdesign.com/products/davinciresolve/fusion" target="_blank" rel="noopener">DaVinci Resolve Fusion (free) — node compositing</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@CompositingAcademy" target="_blank" rel="noopener">Compositing Academy</a> — Nuke keying, roto, integration</li>
<li><a href="https://www.youtube.com/@HugosDesk" target="_blank" rel="noopener">Hugo's Desk</a> — Nuke fundamentals</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.foundry.com/products/nuke-family/nuke-non-commercial" target="_blank" rel="noopener">Nuke Non-commercial</a> — free node compositor for learning</li>
<li><a href="https://www.blackmagicdesign.com/products/davinciresolve" target="_blank" rel="noopener">DaVinci Resolve (free)</a> — grading + Fusion compositing</li>
<li><a href="https://www.openexr.com/" target="_blank" rel="noopener">OpenEXR</a> — the multichannel HDR format compositing runs on</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what compositing is, the VFX pipeline, colour space, alpha &amp; premultiply.</li>
<li><strong>Extraction</strong> — keying green screen, rotoscoping and masking to isolate elements.</li>
<li><strong>Integration</strong> — blending modes, colour matching, tracking / match-move, 3D multi-pass.</li>
<li><strong>Finishing</strong> — motion blur, depth of field, grain and final render/delivery.</li>
</ol></div>`,
    `<span class="eyebrow">DTG304 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>ghép hình kỹ thuật số (compositing)</strong> — nghệ thuật và khoa học gộp nhiều nguồn ảnh khác nhau thành một cảnh liền mạch — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp, chuẩn công nghiệp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DTG304 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.routledge.com/The-Art-and-Science-of-Digital-Compositing/Brinkmann/p/book/9780123706386" target="_blank" rel="noopener"><em>The Art and Science of Digital Compositing</em> — Ron Brinkmann</a> (sách nền tảng của ngành)</li>
<li><a href="https://www.routledge.com/Digital-Compositing-for-Film-and-Video/Wright/p/book/9781138859074" target="_blank" rel="noopener"><em>Digital Compositing for Film and Video</em> — Steve Wright</a> (thiên về kỹ thuật thực hành)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://learn.foundry.com/nuke" target="_blank" rel="noopener">Foundry Nuke — học &amp; tài liệu chính thức</a></li>
<li><a href="https://helpx.adobe.com/after-effects/user-guide.html" target="_blank" rel="noopener">Adobe After Effects — hướng dẫn sử dụng</a></li>
<li><a href="https://www.blackmagicdesign.com/products/davinciresolve/fusion" target="_blank" rel="noopener">DaVinci Resolve Fusion (miễn phí) — ghép hình theo node</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@CompositingAcademy" target="_blank" rel="noopener">Compositing Academy</a> — keying, roto, tích hợp trong Nuke</li>
<li><a href="https://www.youtube.com/@HugosDesk" target="_blank" rel="noopener">Hugo's Desk</a> — nền tảng Nuke</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.foundry.com/products/nuke-family/nuke-non-commercial" target="_blank" rel="noopener">Nuke Non-commercial</a> — bản node compositor miễn phí để học</li>
<li><a href="https://www.blackmagicdesign.com/products/davinciresolve" target="_blank" rel="noopener">DaVinci Resolve (miễn phí)</a> — chỉnh màu + ghép hình Fusion</li>
<li><a href="https://www.openexr.com/" target="_blank" rel="noopener">OpenEXR</a> — định dạng HDR đa kênh mà compositing dựa vào</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — compositing là gì, pipeline VFX, không gian màu, alpha &amp; premultiply.</li>
<li><strong>Tách phần tử</strong> — keying phông xanh, rotoscoping và masking để cô lập đối tượng.</li>
<li><strong>Tích hợp</strong> — blending modes, khớp màu, tracking / match-move, đa lớp render 3D.</li>
<li><strong>Hoàn thiện</strong> — motion blur, depth of field, grain và kết xuất/giao nộp cuối.</li>
</ol></div>`,
  ]]);

const intro = doc('dtg304-0-1-overview', 'Course overview: Principles of Compositing|||Tổng quan: Nguyên lý ghép hình',
  'Compositing làm gì; vì sao "một cảnh cuối = nhiều lớp"; lộ trình 8 chương: pipeline → màu/alpha → keying → roto → blend/grade → node vs layer → tracking/3D → finishing.',
  [[
    `<span class="eyebrow">DTG304 · Lesson 0.1 · Overview</span>
<h2>Principles of Compositing</h2>
<p class="lead">Compositing is <strong>the art and science of combining visual elements from separate sources into a single, believable image</strong>. A live-action plate, a green-screen actor, a 3D spaceship, matte paintings, smoke and lens flares can all live in one final frame — and the compositor's job is to make the audience believe they were photographed together.</p>
<h3>Why "one shot = many layers"</h3>
<p>Almost nothing in a modern film or ad is a single photograph. Elements are shot or rendered separately so each can be controlled independently, then layered and blended. The final look — colour, light, grain, focus — is unified in the composite.</p>
<h3>Roadmap</h3>
<p>Pipeline &amp; the VFX process → colour space, alpha &amp; premultiply → keying (green screen) → rotoscoping &amp; masking → blending modes &amp; colour matching → node-based (Nuke) vs layer-based (After Effects) → tracking, match-move &amp; 3D multi-pass → motion blur, depth of field, grain &amp; final render.</p>
<div class="callout"><span class="badge">Golden rule</span> "If you can see the composite, it isn't finished." A great composite is invisible — the seams disappear.</div>`,
    `<span class="eyebrow">DTG304 · Bài 0.1 · Tổng quan</span>
<h2>Nguyên lý ghép hình</h2>
<p class="lead">Compositing là <strong>nghệ thuật và khoa học gộp các phần tử hình ảnh từ những nguồn riêng biệt thành một khung hình duy nhất, đáng tin</strong>. Một cảnh quay thật, một diễn viên trên phông xanh, một phi thuyền 3D, tranh nền vẽ (matte painting), khói và lóa ống kính đều có thể cùng nằm trong một khung cuối — và việc của người ghép hình là khiến khán giả tin rằng chúng được chụp cùng lúc.</p>
<h3>Vì sao "một cảnh = nhiều lớp"</h3>
<p>Gần như không có gì trong phim hay quảng cáo hiện đại là một tấm ảnh đơn. Các phần tử được quay hoặc render riêng để mỗi thứ kiểm soát độc lập, rồi xếp lớp và hòa trộn. Diện mạo cuối — màu, sáng, grain, độ nét — được thống nhất ở bước ghép.</p>
<h3>Lộ trình</h3>
<p>Pipeline &amp; quy trình VFX → không gian màu, alpha &amp; premultiply → keying (phông xanh) → rotoscoping &amp; masking → blending modes &amp; khớp màu → theo node (Nuke) vs theo lớp (After Effects) → tracking, match-move &amp; đa lớp 3D → motion blur, depth of field, grain &amp; kết xuất cuối.</p>
<div class="callout"><span class="badge">Quy tắc vàng</span> "Nếu bạn nhìn ra được chỗ ghép, tức là chưa xong." Một bản ghép giỏi là bản vô hình — mọi đường nối biến mất.</div>`,
  ]]);

const c1 = doc('dtg304-1-1-pipeline', '1.1 — Compositing overview & the VFX pipeline|||1.1 — Tổng quan compositing & pipeline VFX',
  'Compositing đứng ở đâu trong VFX pipeline; các bước plate → CG → comp → grade → delivery; vai trò compositor; định dạng EXR & linear.',
  [[
    `<span class="eyebrow">DTG304 · Chapter 1 · Lesson 1.1</span>
<h2>Compositing overview &amp; the VFX pipeline</h2>
<h3>Where compositing sits</h3>
<p>Visual effects work flows through a <strong>pipeline</strong> — an ordered set of departments. Compositing is almost always the <em>last</em> creative stage before final grade and delivery: every other department feeds into it.</p>
<pre><code>VFX PIPELINE (simplified)
  Plate (shot footage) ─┐
  Matchmove / Tracking ─┤
  Roto / Prep          ─┤
  Modeling ─ Texturing ─┤
  Rigging ─ Animation  ─┼──&gt; COMPOSITING ──&gt; Grade ──&gt; Delivery
  Lighting / Rendering ─┤       (assemble,
  FX (smoke/fire/water)─┘        integrate, finish)
</code></pre>
<h3>The compositor's job</h3>
<ul>
<li><strong>Assemble</strong> — bring together plate, CG renders, matte paintings, FX and layer them correctly.</li>
<li><strong>Integrate</strong> — make CG "sit" in the plate: matching colour, light, contrast, grain, defocus, edges.</li>
<li><strong>Fix &amp; finish</strong> — remove rigs/wires, clean plates, add atmosphere, and deliver the final frames.</li>
</ul>
<h3>Working format</h3>
<p>Compositing works in <strong>linear light</strong> (not the display-gamma image you see) and usually in <strong>OpenEXR</strong>, a floating-point, multichannel format that can hold values brighter than white (HDR) and many render passes in one file.</p>
<div class="callout"><span class="badge">Key idea</span> The pipeline exists so each element can be created and controlled separately — compositing is where they finally become one image.</div>`,
    `<span class="eyebrow">DTG304 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan compositing &amp; pipeline VFX</h2>
<h3>Compositing đứng ở đâu</h3>
<p>Công việc kỹ xảo hình ảnh chạy qua một <strong>pipeline</strong> — chuỗi các bộ phận có thứ tự. Compositing gần như luôn là công đoạn sáng tạo <em>cuối cùng</em> trước khi chỉnh màu và giao nộp: mọi bộ phận khác đều đổ dồn về nó.</p>
<pre><code>PIPELINE VFX (rút gọn)
  Plate (cảnh quay)   ─┐
  Matchmove / Tracking ─┤
  Roto / Prep          ─┤
  Model ─ Texture      ─┤
  Rig ─ Animation      ─┼──&gt; COMPOSITING ──&gt; Grade ──&gt; Giao nộp
  Lighting / Render    ─┤       (lắp ráp,
  FX (khói/lửa/nước)  ─┘        tích hợp, hoàn thiện)
</code></pre>
<h3>Việc của người ghép hình</h3>
<ul>
<li><strong>Lắp ráp</strong> — đưa plate, render CG, matte painting, FX về đúng thứ tự lớp.</li>
<li><strong>Tích hợp</strong> — làm CG "ngồi" vào plate: khớp màu, ánh sáng, tương phản, grain, độ mờ nét, viền.</li>
<li><strong>Sửa &amp; hoàn thiện</strong> — xóa rig/dây cáp, dọn plate, thêm không khí (atmosphere), và xuất khung cuối.</li>
</ul>
<h3>Định dạng làm việc</h3>
<p>Compositing làm việc ở <strong>ánh sáng tuyến tính (linear)</strong> (không phải ảnh gamma hiển thị mà bạn nhìn thấy) và thường dùng <strong>OpenEXR</strong> — định dạng dấu phẩy động, đa kênh, chứa được giá trị sáng hơn trắng (HDR) và nhiều render pass trong một file.</p>
<div class="callout"><span class="badge">Ý chính</span> Pipeline tồn tại để mỗi phần tử được tạo và kiểm soát riêng — compositing là nơi chúng cuối cùng hợp thành một khung hình.</div>`,
  ]]);

const c1q = quiz('dtg304-quiz-1', 'Quiz 1 — Pipeline|||Quiz 1 — Pipeline', [
  { id: 'q1', question: 'Trong pipeline VFX, compositing thường nằm ở đâu?', options: ['Ngay sau khi quay, trước mọi thứ', 'Công đoạn sáng tạo cuối, trước grade & giao nộp', 'Song song với modeling', 'Chỉ dùng khi không có CG'], correctIndex: 1, explanation: 'Mọi bộ phận (plate, CG, FX...) đổ về compositing — công đoạn cuối trước chỉnh màu và giao nộp.' },
  { id: 'q2', question: 'Định dạng nào là chuẩn cho compositing vì chứa HDR & đa kênh?', options: ['JPEG', 'PNG 8-bit', 'OpenEXR (float, đa kênh)', 'GIF'], correctIndex: 2, explanation: 'OpenEXR là dấu phẩy động, giữ được giá trị sáng hơn trắng và nhiều render pass trong một file.' },
  { id: 'q3', question: '"Tích hợp" (integrate) một phần tử CG vào plate nghĩa là gì?', options: ['Đổi định dạng file', 'Khớp màu, sáng, grain, độ nét, viền để CG hòa vào plate', 'Xóa toàn bộ CG', 'Tăng độ phân giải'], correctIndex: 1, explanation: 'Tích hợp là làm CG "ngồi" vào plate: khớp màu/sáng/tương phản/grain/defocus/viền.' },
]);

const c2 = doc('dtg304-2-1-color-alpha', '2.1 — Colour space, alpha channel & premultiply|||2.1 — Không gian màu, kênh alpha & premultiply',
  'RGB + kênh alpha; linear vs gamma/sRGB; premultiplied vs straight (unmatte/matte); công thức Over của Porter-Duff; vì sao viền đen/sáng là do sai premultiply.',
  [[
    `<span class="eyebrow">DTG304 · Chapter 2 · Lesson 2.1</span>
<h2>Colour space, alpha channel &amp; premultiply</h2>
<h3>The alpha channel</h3>
<p>An image has three colour channels — <strong>R, G, B</strong> — plus a fourth <strong>alpha (A)</strong> channel that stores <em>opacity</em>: 0 = fully transparent, 1 = fully opaque. Alpha is what lets one element be laid over another.</p>
<h3>Linear vs display colour</h3>
<p>Your monitor shows <strong>gamma-encoded</strong> (e.g. sRGB) images, but light adds up <em>linearly</em>. Compositing math (blends, blur, defocus) must run in <strong>linear light</strong>, then be converted back to display gamma for viewing. Compositing in the wrong space gives dark, muddy edges and wrong blur.</p>
<h3>Premultiplied vs straight alpha</h3>
<pre><code>STRAIGHT (unmatted):  RGB stored at full value, A separate
PREMULTIPLIED:        RGB already multiplied by A
   premult:  Rp = R * A,  Gp = G * A,  Bp = B * A
   unpremult (to grade): R = Rp / A   (A &gt; 0)
</code></pre>
<p>The <strong>Over</strong> operation (Porter-Duff) that stacks a foreground over a background assumes <em>premultiplied</em> input:</p>
<pre><code>OVER:  out = Fg + Bg * (1 - Fg_alpha)
</code></pre>
<h3>The classic bug</h3>
<p>A <strong>dark fringe</strong> around a keyed element usually means it was composited premultiplied twice; a <strong>bright fringe</strong> means it should have been premultiplied but wasn't. Colour-correct in <em>unpremultiplied</em> space, then re-premultiply before the Over.</p>
<div class="callout"><span class="badge">Rule of thumb</span> Grade unpremultiplied, composite premultiplied. Get this order wrong and every edge turns dark or bright.</div>`,
    `<span class="eyebrow">DTG304 · Chương 2 · Bài 2.1</span>
<h2>Không gian màu, kênh alpha &amp; premultiply</h2>
<h3>Kênh alpha</h3>
<p>Một ảnh có ba kênh màu — <strong>R, G, B</strong> — cộng thêm kênh thứ tư <strong>alpha (A)</strong> lưu <em>độ mờ đục</em>: 0 = trong suốt hoàn toàn, 1 = đục hoàn toàn. Alpha chính là thứ cho phép đặt phần tử này lên phần tử kia.</p>
<h3>Linear vs màu hiển thị</h3>
<p>Màn hình cho bạn xem ảnh <strong>mã hóa gamma</strong> (vd sRGB), nhưng ánh sáng cộng dồn <em>tuyến tính</em>. Toán compositing (blend, blur, defocus) phải chạy ở <strong>ánh sáng tuyến tính</strong> rồi mới đổi lại gamma hiển thị để xem. Ghép sai không gian sẽ cho viền tối, đục và blur sai.</p>
<h3>Premultiplied vs straight alpha</h3>
<pre><code>STRAIGHT (chưa nhân):  RGB lưu giá trị đầy đủ, A riêng
PREMULTIPLIED:         RGB đã nhân sẵn với A
   premult:   Rp = R * A,  Gp = G * A,  Bp = B * A
   unpremult (để grade): R = Rp / A   (A &gt; 0)
</code></pre>
<p>Phép <strong>Over</strong> (Porter-Duff) xếp foreground lên background giả định đầu vào là <em>premultiplied</em>:</p>
<pre><code>OVER:  out = Fg + Bg * (1 - Fg_alpha)
</code></pre>
<h3>Lỗi kinh điển</h3>
<p><strong>Viền tối</strong> quanh phần tử vừa key thường là do bị premultiply hai lần; <strong>viền sáng</strong> là do đáng lẽ phải premultiply mà chưa làm. Hãy chỉnh màu ở không gian <em>chưa premultiply</em>, rồi premultiply lại trước khi Over.</p>
<div class="callout"><span class="badge">Mẹo nhớ</span> Grade khi unpremultiplied, composite khi premultiplied. Sai thứ tự này là mọi đường viền hóa tối hoặc sáng.</div>`,
  ]]);

const c2q = quiz('dtg304-quiz-2', 'Quiz 2 — Colour & alpha|||Quiz 2 — Màu & alpha', [
  { id: 'q1', question: 'Kênh alpha lưu thông tin gì?', options: ['Độ sáng', 'Độ mờ đục (opacity): 0 trong suốt, 1 đục', 'Nhiệt độ màu', 'Độ nét'], correctIndex: 1, explanation: 'Alpha lưu opacity — cho phép xếp lớp phần tử này lên phần tử kia.' },
  { id: 'q2', question: 'Vì sao phải composite ở không gian tuyến tính (linear)?', options: ['Vì file nhỏ hơn', 'Vì ánh sáng cộng dồn tuyến tính; blend/blur ở gamma sẽ cho viền tối, blur sai', 'Vì màn hình chỉ hiện linear', 'Không cần thiết'], correctIndex: 1, explanation: 'Toán ánh sáng (blend, blur, defocus) đúng ở linear; làm ở gamma cho kết quả tối và sai.' },
  { id: 'q3', question: 'Thứ tự đúng khi chỉnh màu một phần tử đã key rồi ghép Over?', options: ['Premultiply → grade → Over', 'Grade khi chưa premultiply (unpremult) → premultiply → Over', 'Over → grade', 'Không cần quan tâm premultiply'], correctIndex: 1, explanation: 'Grade ở unpremultiplied rồi re-premultiply trước Over — nếu không, viền sẽ tối/sáng.' },
]);

const c3 = doc('dtg304-3-1-keying', '3.1 — Keying: chroma key, luma key & green screen|||3.1 — Keying: chroma key, luma key & phông xanh',
  'Nguyên lý key; vì sao dùng xanh/lam; chroma vs luma key; despill; core matte vs edge matte; garbage matte; cắm sáng phông đều để key sạch.',
  [[
    `<span class="eyebrow">DTG304 · Chapter 3 · Lesson 3.1</span>
<h2>Keying: chroma key, luma key &amp; green screen</h2>
<h3>What keying does</h3>
<p><strong>Keying</strong> generates an alpha (matte) automatically by telling the software which colour or brightness is "background". A <strong>chroma key</strong> keys on a colour (usually green or blue); a <strong>luma key</strong> keys on brightness.</p>
<h3>Why green or blue?</h3>
<p>Green and blue are furthest from human skin tones, so the software can separate the subject cleanly. Green is brighter and needs less light; blue is used when the subject wears green or for finer hair detail.</p>
<h3>Anatomy of a good key</h3>
<pre><code>Green plate ──&gt; Keyer ──&gt; raw matte
   ├─ Core matte   : solid interior (fully opaque)
   ├─ Edge matte   : soft hair / motion-blur edges
   ├─ Despill      : remove green light spilled on subject
   └─ Garbage matte: hand-drawn mask to cut rigs / lights
</code></pre>
<h3>Despill</h3>
<p>A green screen bounces green light onto the subject's edges and skin. <strong>Despill</strong> neutralises that green tint — without it the composite looks like a bad 90s effect.</p>
<div class="callout"><span class="badge">Shoot for the key</span> A clean key starts on set: light the screen evenly, keep the subject far from it (less spill), and expose correctly. You cannot key a badly lit screen well.</div>`,
    `<span class="eyebrow">DTG304 · Chương 3 · Bài 3.1</span>
<h2>Keying: chroma key, luma key &amp; phông xanh</h2>
<h3>Keying làm gì</h3>
<p><strong>Keying</strong> tự sinh ra alpha (matte) bằng cách chỉ cho phần mềm biết màu hay độ sáng nào là "nền". <strong>Chroma key</strong> key theo màu (thường xanh lá hoặc lam); <strong>luma key</strong> key theo độ sáng.</p>
<h3>Vì sao xanh lá hoặc lam?</h3>
<p>Xanh lá và lam cách xa tông da người nhất, nên phần mềm tách được chủ thể sạch sẽ. Xanh lá sáng hơn, cần ít đèn hơn; lam dùng khi chủ thể mặc đồ xanh lá hoặc để giữ chi tiết tóc mảnh.</p>
<h3>Giải phẫu một cú key tốt</h3>
<pre><code>Plate xanh ──&gt; Keyer ──&gt; matte thô
   ├─ Core matte   : phần ruột đặc (đục hoàn toàn)
   ├─ Edge matte   : viền tóc mềm / mờ do chuyển động
   ├─ Despill      : bỏ ánh xanh hắt lên chủ thể
   └─ Garbage matte: mask vẽ tay để cắt rig / đèn
</code></pre>
<h3>Despill</h3>
<p>Phông xanh hắt ánh xanh lên viền và da chủ thể. <strong>Despill</strong> trung hòa sắc xanh đó — thiếu nó, bản ghép trông như hiệu ứng dở của thập niên 90.</p>
<div class="callout"><span class="badge">Quay để mà key</span> Cú key sạch bắt đầu từ hiện trường: chiếu sáng phông đều, để chủ thể xa phông (ít spill), và phơi sáng đúng. Không thể key đẹp một tấm phông chiếu sáng tệ.</div>`,
  ]]);

const c3q = quiz('dtg304-quiz-3', 'Quiz 3 — Keying|||Quiz 3 — Keying', [
  { id: 'q1', question: 'Vì sao phông thường dùng màu xanh lá hoặc lam?', options: ['Vì rẻ nhất', 'Vì xa tông da người nhất, dễ tách chủ thể sạch', 'Vì mắt người thích màu đó', 'Vì máy quay không thấy màu khác'], correctIndex: 1, explanation: 'Xanh/lam cách xa tông da nhất nên phần mềm tách chủ thể sạch; xanh sáng hơn, cần ít đèn hơn.' },
  { id: 'q2', question: '"Despill" trong keying là gì?', options: ['Làm mờ viền', 'Trung hòa ánh xanh của phông hắt lên chủ thể', 'Tăng độ tương phản', 'Vẽ mask bằng tay'], correctIndex: 1, explanation: 'Phông xanh hắt sắc xanh lên da/viền; despill loại bỏ sắc xanh đó để hòa vào cảnh mới.' },
  { id: 'q3', question: '"Garbage matte" dùng để làm gì?', options: ['Tạo viền tóc mềm', 'Mask vẽ tay để cắt bỏ rig/đèn/mép phông ngoài vùng key', 'Tự động sinh alpha theo màu', 'Chỉnh màu chủ thể'], correctIndex: 1, explanation: 'Garbage matte là mask thô vẽ tay để loại rig, đèn, mép phông mà keyer không xử lý.' },
]);

const c4 = doc('dtg304-4-1-roto-mask', '4.1 — Rotoscoping & masking|||4.1 — Rotoscoping & masking',
  'Khi keying không được thì roto; bezier/spline shape, keyframe theo thời gian; feather viền; tracking hỗ trợ roto; motion blur trên shape; chia mảnh theo khớp cử động.',
  [[
    `<span class="eyebrow">DTG304 · Chapter 4 · Lesson 4.1</span>
<h2>Rotoscoping &amp; masking</h2>
<h3>When you can't key</h3>
<p>Not everything is shot on green. To isolate an actor on a real location, or to cut a hole for an element, you <strong>rotoscope</strong>: draw an animated shape (a <strong>mask</strong>) frame by frame that follows the subject.</p>
<h3>Splines, keyframes &amp; feather</h3>
<ul>
<li><strong>Spline / bezier shape</strong> — control points define the outline; fewer points animate more smoothly.</li>
<li><strong>Keyframes</strong> — set the shape on key frames; the software interpolates in between. Only re-touch where it drifts.</li>
<li><strong>Feather</strong> — a soft edge on the mask so the cut isn't razor-hard and matches the subject's real edge softness.</li>
</ul>
<h3>Work smart, not frame-by-frame</h3>
<pre><code>ROTO STRATEGY
  1. Break the subject into parts by JOINT
     (upper arm, forearm, hand...) — each moves simply
  2. Track a shape to motion where possible (less manual work)
  3. Add motion blur to the shape to match the plate
  4. Feather to match the subject's real edge softness
</code></pre>
<div class="callout"><span class="badge">Divide by motion</span> Split a figure into separately-moving pieces along its joints — each piece follows a simple path, so you set far fewer keyframes than rotoing the whole body at once.</div>`,
    `<span class="eyebrow">DTG304 · Chương 4 · Bài 4.1</span>
<h2>Rotoscoping &amp; masking</h2>
<h3>Khi không thể key</h3>
<p>Không phải cảnh nào cũng quay trên phông xanh. Để cô lập diễn viên ở bối cảnh thật, hay khoét một lỗ cho phần tử khác, ta <strong>rotoscope</strong>: vẽ một hình động (<strong>mask</strong>) theo từng khung, bám theo chủ thể.</p>
<h3>Spline, keyframe &amp; feather</h3>
<ul>
<li><strong>Hình spline / bezier</strong> — các điểm điều khiển định đường viền; ít điểm thì chuyển động mượt hơn.</li>
<li><strong>Keyframe</strong> — đặt hình ở các khung mốc; phần mềm nội suy khung giữa. Chỉ chỉnh lại nơi bị lệch.</li>
<li><strong>Feather</strong> — viền mềm cho mask để đường cắt không cứng như dao, khớp với độ mềm viền thật của chủ thể.</li>
</ul>
<h3>Làm khôn, đừng làm từng khung</h3>
<pre><code>CHIẾN LƯỢC ROTO
  1. Chia chủ thể thành mảnh theo KHỚP
     (cánh tay trên, cẳng tay, bàn tay...) — mỗi mảnh chuyển động đơn giản
  2. Track hình theo chuyển động nếu được (đỡ làm tay)
  3. Thêm motion blur cho hình để khớp plate
  4. Feather để khớp độ mềm viền thật của chủ thể
</code></pre>
<div class="callout"><span class="badge">Chia theo chuyển động</span> Tách một nhân vật thành các mảnh chuyển động riêng theo khớp — mỗi mảnh đi một đường đơn giản, nên bạn đặt ít keyframe hơn nhiều so với roto cả thân một lúc.</div>`,
  ]]);

const c4q = quiz('dtg304-quiz-4', 'Quiz 4 — Roto & masking|||Quiz 4 — Roto & masking', [
  { id: 'q1', question: 'Khi nào cần rotoscope thay vì keying?', options: ['Luôn luôn', 'Khi phần tử không quay trên phông xanh / không tách được bằng màu', 'Khi file quá lớn', 'Chỉ khi làm phim hoạt hình'], correctIndex: 1, explanation: 'Roto dùng khi không có phông màu để key — phải vẽ mask động bám theo chủ thể.' },
  { id: 'q2', question: '"Feather" của một mask là gì?', options: ['Tăng số điểm điều khiển', 'Viền mềm để đường cắt không cứng, khớp độ mềm viền chủ thể', 'Đổi màu mask', 'Xóa keyframe'], correctIndex: 1, explanation: 'Feather tạo viền mềm cho mask, tránh mép cắt cứng như dao và khớp viền thật.' },
  { id: 'q3', question: 'Cách hiệu quả để giảm số keyframe khi roto một nhân vật?', options: ['Vẽ cả thân bằng một hình lớn', 'Chia thân thành mảnh theo khớp, mỗi mảnh chuyển động đơn giản', 'Tăng độ phân giải', 'Tắt motion blur'], correctIndex: 1, explanation: 'Chia theo khớp cử động: mỗi mảnh đi đường đơn giản nên cần ít keyframe hơn hẳn.' },
]);

const c5 = doc('dtg304-5-1-blend-grade', '5.1 — Blending modes & colour grading/matching|||5.1 — Blending modes & chỉnh & khớp màu',
  'Công thức blend (multiply/screen/add/over); lift-gamma-gain; scopes (waveform, vectorscope); khớp black point/white point/màu để phần tử ngồi vào plate.',
  [[
    `<span class="eyebrow">DTG304 · Chapter 5 · Lesson 5.1</span>
<h2>Blending modes &amp; colour grading / matching</h2>
<h3>Blending modes as maths</h3>
<p>A blending mode is just a formula combining a foreground value <code>a</code> with a background value <code>b</code> (both 0-1, per channel):</p>
<pre><code>Multiply : out = a * b            (darkens; good for shadows/dirt)
Screen   : out = 1 - (1-a)*(1-b)  (brightens; good for light/glow)
Add      : out = a + b            (linear light: fire, flares)
Over     : out = a + b*(1 - alpha)(stacking with alpha)
</code></pre>
<h3>Grading with lift / gamma / gain</h3>
<ul>
<li><strong>Lift</strong> — raises the shadows / black point.</li>
<li><strong>Gamma</strong> — bends the midtones without moving black or white.</li>
<li><strong>Gain</strong> — scales the highlights / white point.</li>
</ul>
<h3>Matching an element into a plate</h3>
<p>To make a foreground "belong", match it to the plate in order:</p>
<pre><code>MATCH ORDER
  1. Black point  — do the darkest darks agree?
  2. White point  — do the brightest brights agree?
  3. Midtones/hue — match colour cast &amp; contrast
  4. Then: grain, defocus, atmosphere
</code></pre>
<h3>Trust the scopes</h3>
<p>Eyes adapt and lie. Read the <strong>waveform</strong> (brightness), <strong>vectorscope</strong> (hue/saturation) and <strong>histogram</strong> to match objectively — line the black and white levels up on the scope, not by feel.</p>
<div class="callout"><span class="badge">Match by numbers</span> Set black point and white point first, then colour. A foreground that shares the plate's blacks and whites already looks half-integrated.</div>`,
    `<span class="eyebrow">DTG304 · Chương 5 · Bài 5.1</span>
<h2>Blending modes &amp; chỉnh &amp; khớp màu</h2>
<h3>Blending mode chính là toán</h3>
<p>Một blending mode chỉ là công thức kết hợp giá trị foreground <code>a</code> với background <code>b</code> (đều 0-1, theo từng kênh):</p>
<pre><code>Multiply : out = a * b            (làm tối; hợp bóng/bụi bẩn)
Screen   : out = 1 - (1-a)*(1-b)  (làm sáng; hợp ánh sáng/glow)
Add      : out = a + b            (linear: lửa, lóa sáng)
Over     : out = a + b*(1 - alpha)(xếp lớp có alpha)
</code></pre>
<h3>Chỉnh màu bằng lift / gamma / gain</h3>
<ul>
<li><strong>Lift</strong> — nâng vùng tối / điểm đen.</li>
<li><strong>Gamma</strong> — uốn vùng trung mà không dịch đen hay trắng.</li>
<li><strong>Gain</strong> — co giãn vùng sáng / điểm trắng.</li>
</ul>
<h3>Khớp một phần tử vào plate</h3>
<p>Để foreground "thuộc về" plate, khớp theo thứ tự:</p>
<pre><code>THỨ TỰ KHỚP
  1. Điểm đen  — vùng tối nhất có trùng nhau?
  2. Điểm trắng — vùng sáng nhất có trùng nhau?
  3. Trung/màu — khớp sắc &amp; tương phản
  4. Rồi: grain, defocus, không khí (atmosphere)
</code></pre>
<h3>Tin vào scope</h3>
<p>Mắt thích nghi và đánh lừa. Hãy đọc <strong>waveform</strong> (độ sáng), <strong>vectorscope</strong> (sắc/độ bão hòa) và <strong>histogram</strong> để khớp khách quan — canh mức đen/trắng trên scope, đừng canh bằng cảm giác.</p>
<div class="callout"><span class="badge">Khớp bằng con số</span> Đặt điểm đen và điểm trắng trước, rồi mới màu. Foreground chia chung đen-trắng với plate là đã tích hợp được một nửa.</div>`,
  ]]);

const c5q = quiz('dtg304-quiz-5', 'Quiz 5 — Blend & grade|||Quiz 5 — Blend & grade', [
  { id: 'q1', question: 'Công thức blend "Multiply" (out = a × b) thường dùng cho?', options: ['Làm sáng, thêm glow', 'Làm tối — bóng đổ, bụi bẩn', 'Xóa nền', 'Tăng độ phân giải'], correctIndex: 1, explanation: 'Multiply nhân hai giá trị nên luôn làm tối; hợp cho bóng, vết bẩn, ám bóng.' },
  { id: 'q2', question: 'Trong lift/gamma/gain, "gamma" tác động chủ yếu tới?', options: ['Điểm đen', 'Vùng trung (midtones), không dịch đen/trắng', 'Điểm trắng', 'Độ bão hòa'], correctIndex: 1, explanation: 'Gamma uốn vùng trung mà giữ nguyên đen và trắng; lift nâng đen, gain co trắng.' },
  { id: 'q3', question: 'Vì sao nên dùng scope (waveform/vectorscope) khi khớp màu?', options: ['Vì trông chuyên nghiệp', 'Vì mắt thích nghi và đánh lừa; scope cho số khách quan để canh đen/trắng/sắc', 'Vì nhanh hơn', 'Vì bắt buộc mới xuất được'], correctIndex: 1, explanation: 'Mắt tự thích nghi nên chủ quan; scope cho phép khớp black/white point và hue một cách khách quan.' },
]);

const c6 = doc('dtg304-6-1-node-vs-layer', '6.1 — Node-based (Nuke) vs layer-based (After Effects)|||6.1 — Theo node (Nuke) vs theo lớp (After Effects)',
  'Hai mô hình dòng dữ liệu; node graph đọc từ dưới lên, không phá hủy, dễ nhánh; layer stack trực quan, mạnh về animation/motion graphics; khi nào chọn cái nào.',
  [[
    `<span class="eyebrow">DTG304 · Chapter 6 · Lesson 6.1</span>
<h2>Node-based (Nuke) vs layer-based (After Effects)</h2>
<h3>Two ways to think about a comp</h3>
<p>A composite can be built as a <strong>node graph</strong> (Nuke, Fusion) or a <strong>layer stack</strong> (After Effects). Both combine images — they organise the work very differently.</p>
<h3>Node graph</h3>
<pre><code>Read(plate) ─┐
             Merge(over) ── Grade ── Write(out)
Read(CG) ─ Key ─┘
</code></pre>
<ul>
<li>Data flows through connected <strong>nodes</strong>; you read the tree and see exactly what feeds what.</li>
<li><strong>Non-destructive &amp; branchable</strong> — tap any point, reuse a matte in ten places, scale to huge shots.</li>
<li>Industry standard for film VFX.</li>
</ul>
<h3>Layer stack</h3>
<ul>
<li>Elements are <strong>stacked layers</strong>, top over bottom, each with transforms, effects and keyframes.</li>
<li>Very visual and fast for <strong>motion graphics, titles and animation</strong>; timeline-centric.</li>
<li>Can get tangled on very complex, multi-element VFX shots.</li>
</ul>
<div class="callout"><span class="badge">Pick the tool for the job</span> Heavy film integration, many passes, reused mattes → nodes (Nuke). Motion graphics, quick animated layers, design work → layers (After Effects).</div>`,
    `<span class="eyebrow">DTG304 · Chương 6 · Bài 6.1</span>
<h2>Theo node (Nuke) vs theo lớp (After Effects)</h2>
<h3>Hai cách nghĩ về một bản comp</h3>
<p>Một bản ghép có thể dựng bằng <strong>đồ thị node</strong> (Nuke, Fusion) hoặc <strong>ngăn lớp</strong> (After Effects). Cả hai đều gộp ảnh — nhưng tổ chức công việc rất khác nhau.</p>
<h3>Đồ thị node</h3>
<pre><code>Read(plate) ─┐
             Merge(over) ── Grade ── Write(out)
Read(CG) ─ Key ─┘
</code></pre>
<ul>
<li>Dữ liệu chảy qua các <strong>node</strong> nối với nhau; nhìn cây là thấy rõ cái gì nuôi cái gì.</li>
<li><strong>Không phá hủy &amp; dễ rẽ nhánh</strong> — trích bất kỳ điểm nào, tái dùng một matte ở mười chỗ, mở rộng cho cảnh khổng lồ.</li>
<li>Chuẩn công nghiệp cho VFX điện ảnh.</li>
</ul>
<h3>Ngăn lớp</h3>
<ul>
<li>Phần tử là các <strong>lớp xếp chồng</strong>, trên đè dưới, mỗi lớp có transform, hiệu ứng và keyframe.</li>
<li>Rất trực quan và nhanh cho <strong>motion graphics, tiêu đề và animation</strong>; xoay quanh timeline.</li>
<li>Dễ rối khi cảnh VFX rất phức tạp, nhiều phần tử.</li>
</ul>
<div class="callout"><span class="badge">Chọn đúng công cụ</span> Tích hợp điện ảnh nặng, nhiều pass, matte dùng lại → node (Nuke). Motion graphics, lớp động nhanh, thiết kế → lớp (After Effects).</div>`,
  ]]);

const c6q = quiz('dtg304-quiz-6', 'Quiz 6 — Node vs layer|||Quiz 6 — Node vs layer', [
  { id: 'q1', question: 'Ưu điểm chính của mô hình node-based (Nuke)?', options: ['Đẹp hơn', 'Không phá hủy, dễ rẽ nhánh & tái dùng matte, mở rộng tốt cho cảnh lớn', 'Không cần render', 'Chỉ dùng cho 2D'], correctIndex: 1, explanation: 'Node graph cho luồng dữ liệu rõ ràng, không phá hủy, dễ trích/tái dùng — chuẩn cho VFX phim.' },
  { id: 'q2', question: 'After Effects (layer-based) mạnh nhất ở việc gì?', options: ['Cảnh VFX nhiều pass phức tạp', 'Motion graphics, tiêu đề, animation nhanh & trực quan', 'Render 3D nặng', 'Keying tự động tuyệt đối'], correctIndex: 1, explanation: 'Ngăn lớp xoay quanh timeline, rất hợp motion graphics/tiêu đề/animation.' },
  { id: 'q3', question: 'Trong node graph, dữ liệu tổ chức thế nào?', options: ['Các lớp xếp chồng trên đè dưới', 'Chảy qua các node nối nhau, nhìn cây thấy cái gì nuôi cái gì', 'Ngẫu nhiên', 'Theo bảng tính'], correctIndex: 1, explanation: 'Node-based: ảnh chảy qua các node kết nối; cấu trúc cây thể hiện rõ luồng xử lý.' },
]);

const c7 = doc('dtg304-7-1-tracking-3d', '7.1 — Tracking, match-move & 3D integration|||7.1 — Tracking, match-move & tích hợp 3D',
  '2D tracking (point/planar) vs 3D camera tracking (match-move/solve); multi-pass render & AOV (beauty, diffuse, spec, shadow, depth, normal); dựng lại comp từ pass để kiểm soát.',
  [[
    `<span class="eyebrow">DTG304 · Chapter 7 · Lesson 7.1</span>
<h2>Tracking, match-move &amp; 3D integration</h2>
<h3>Tracking: lock elements to motion</h3>
<ul>
<li><strong>2D point track</strong> — follow a feature to stabilise or attach a 2D element (a sign, a screen replacement).</li>
<li><strong>Planar track</strong> — track a flat surface (wall, phone screen) even as it turns.</li>
<li><strong>3D camera track (match-move / solve)</strong> — reconstruct the real camera's 3D path so CG can be placed in the scene and stay locked as the camera moves.</li>
</ul>
<h3>Multi-pass render &amp; AOVs</h3>
<p>3D is rendered not as one flat image but as many <strong>AOVs</strong> (Arbitrary Output Variables / passes) the compositor recombines:</p>
<pre><code>AOV PASSES (typical)
  beauty    : the full combined render (reference)
  diffuse   : surface colour under light
  specular  : highlights / reflections
  shadow    : shadow contribution (matte)
  depth (Z) : distance from camera -&gt; defocus, fog
  normal    : surface direction -&gt; relight, edges
  cryptomatte: per-object IDs -&gt; isolate any object
</code></pre>
<h3>Why rebuild from passes</h3>
<p>Recombining passes (<code>diffuse + specular + ...</code>) lets the compositor tweak each contribution — dim a reflection, deepen a shadow, add fog by depth — <em>without</em> re-rendering the 3D scene. That control is the whole reason multi-pass exists.</p>
<div class="callout"><span class="badge">Match-move first</span> Nothing integrates until the CG is locked to the plate's camera. A drifting track ruins even a perfect grade.</div>`,
    `<span class="eyebrow">DTG304 · Chương 7 · Bài 7.1</span>
<h2>Tracking, match-move &amp; tích hợp 3D</h2>
<h3>Tracking: khóa phần tử vào chuyển động</h3>
<ul>
<li><strong>2D point track</strong> — bám một điểm để ổn định hình hoặc gắn phần tử 2D (biển hiệu, thay màn hình).</li>
<li><strong>Planar track</strong> — track một mặt phẳng (tường, màn hình điện thoại) kể cả khi nó xoay.</li>
<li><strong>3D camera track (match-move / solve)</strong> — dựng lại đường đi 3D của máy quay thật để đặt CG vào cảnh và giữ khóa khi máy di chuyển.</li>
</ul>
<h3>Render đa lớp &amp; AOV</h3>
<p>3D không render thành một ảnh phẳng mà thành nhiều <strong>AOV</strong> (Arbitrary Output Variables / các pass) để người ghép tái kết hợp:</p>
<pre><code>CÁC PASS AOV (điển hình)
  beauty    : bản render gộp đầy đủ (đối chiếu)
  diffuse   : màu bề mặt dưới ánh sáng
  specular  : highlight / phản chiếu
  shadow    : phần bóng đổ (matte)
  depth (Z) : khoảng cách tới máy quay -&gt; defocus, sương
  normal    : hướng bề mặt -&gt; chiếu sáng lại, viền
  cryptomatte: ID từng vật -&gt; cô lập bất kỳ đối tượng nào
</code></pre>
<h3>Vì sao dựng lại từ pass</h3>
<p>Tái kết hợp các pass (<code>diffuse + specular + ...</code>) cho phép người ghép tinh chỉnh từng phần — hạ phản chiếu, làm đậm bóng, thêm sương theo độ sâu — mà <em>không</em> phải render lại cảnh 3D. Chính khả năng kiểm soát đó là lý do multi-pass tồn tại.</p>
<div class="callout"><span class="badge">Match-move trước đã</span> Không gì tích hợp được cho đến khi CG khóa vào máy quay của plate. Track trôi thì grade hoàn hảo cũng hỏng.</div>`,
  ]]);

const c7q = quiz('dtg304-quiz-7', 'Quiz 7 — Tracking & 3D|||Quiz 7 — Tracking & 3D', [
  { id: 'q1', question: '"3D camera track" (match-move) làm gì?', options: ['Xóa nền xanh', 'Dựng lại đường đi 3D của máy quay thật để đặt CG khóa vào cảnh', 'Chỉnh màu', 'Thêm grain'], correctIndex: 1, explanation: 'Match-move giải ra chuyển động camera thật, để CG đặt vào không gian và giữ khóa khi máy di chuyển.' },
  { id: 'q2', question: 'Pass "depth (Z)" trong render đa lớp dùng để?', options: ['Đổi màu bề mặt', 'Biểu diễn khoảng cách tới máy quay — dùng cho defocus, sương', 'Tạo highlight', 'Cô lập từng vật'], correctIndex: 1, explanation: 'Z-depth lưu khoảng cách tới camera, phục vụ depth-of-field (defocus) và sương/fog theo độ sâu.' },
  { id: 'q3', question: 'Lợi ích chính của việc dựng comp lại từ nhiều AOV/pass?', options: ['File nhỏ hơn', 'Tinh chỉnh từng phần (phản chiếu, bóng, sương) mà không render lại 3D', 'Không cần tracking', 'Tự động key'], correctIndex: 1, explanation: 'Tái kết hợp pass cho phép kiểm soát riêng từng contribution mà khỏi render lại cảnh 3D tốn kém.' },
]);

const c8 = doc('dtg304-8-1-finishing', '8.1 — Motion blur, depth of field, grain & final render|||8.1 — Motion blur, depth of field, grain & kết xuất cuối',
  'Các bước "làm cho có vẻ được quay": motion blur khớp shutter, defocus theo Z, thêm grain/noise khớp plate, lens distortion; kết xuất & giao nộp đúng chuẩn màu/định dạng.',
  [[
    `<span class="eyebrow">DTG304 · Chapter 8 · Lesson 8.1</span>
<h2>Motion blur, depth of field, grain &amp; final render</h2>
<h3>The finishing layer — making CG look photographed</h3>
<p>A perfectly sharp, clean CG element looks fake because <em>real cameras aren't perfect</em>. The finishing pass adds back the imperfections that sell the shot.</p>
<ul>
<li><strong>Motion blur</strong> — moving objects streak. Match the plate's shutter so CG blurs the same amount as real motion.</li>
<li><strong>Depth of field</strong> — use the depth (Z) pass to defocus elements at the plate's focal distance, matching the lens.</li>
<li><strong>Grain / noise</strong> — every plate has film grain or sensor noise. Add matching grain <em>on top</em> so CG doesn't look unnaturally clean.</li>
<li><strong>Lens effects</strong> — distortion, chromatic aberration, vignette and flares tie CG to the real lens.</li>
</ul>
<h3>Order matters</h3>
<pre><code>FINISHING ORDER
  integrate (grade/edges) ──&gt; motion blur ──&gt; defocus (Z)
     ──&gt; lens distortion ──&gt; add grain LAST ──&gt; render
</code></pre>
<p>Grain goes <strong>last</strong>, over the whole frame, so CG and plate share one grain structure — otherwise the CG reads as a separate, cleaner layer.</p>
<h3>Final render &amp; delivery</h3>
<p>Render in the required <strong>colour space and format</strong> (e.g. ACES / EXR for mastering, or a delivery codec) at the correct resolution and frame range. Wrong colour space or a missing grain match is the most common reason a shot gets kicked back.</p>
<div class="callout"><span class="badge">Add imperfection last</span> Sharp + clean = fake. Match the plate's blur, focus and grain, and add grain over everything at the very end.</div>`,
    `<span class="eyebrow">DTG304 · Chương 8 · Bài 8.1</span>
<h2>Motion blur, depth of field, grain &amp; kết xuất cuối</h2>
<h3>Lớp hoàn thiện — làm CG trông như được quay</h3>
<p>Một phần tử CG sắc lẹm, sạch bong lại trông giả vì <em>máy quay thật không hoàn hảo</em>. Bước hoàn thiện thêm lại những khiếm khuyết khiến cảnh đáng tin.</p>
<ul>
<li><strong>Motion blur</strong> — vật chuyển động bị nhòe vệt. Khớp shutter của plate để CG nhòe đúng bằng chuyển động thật.</li>
<li><strong>Depth of field</strong> — dùng pass depth (Z) để làm mờ nét phần tử theo tiêu cự của plate, khớp ống kính.</li>
<li><strong>Grain / noise</strong> — mọi plate đều có hạt phim hoặc nhiễu cảm biến. Thêm grain khớp <em>lên trên</em> để CG không sạch bất thường.</li>
<li><strong>Hiệu ứng ống kính</strong> — méo hình, quang sai màu, vignette và lóa gắn CG vào ống kính thật.</li>
</ul>
<h3>Thứ tự quan trọng</h3>
<pre><code>THỨ TỰ HOÀN THIỆN
  tích hợp (grade/viền) ──&gt; motion blur ──&gt; defocus (Z)
     ──&gt; méo ống kính ──&gt; thêm grain CUỐI CÙNG ──&gt; render
</code></pre>
<p>Grain đặt <strong>cuối cùng</strong>, phủ cả khung, để CG và plate chung một cấu trúc hạt — nếu không, CG lộ ra là một lớp riêng, sạch hơn.</p>
<h3>Kết xuất cuối &amp; giao nộp</h3>
<p>Render đúng <strong>không gian màu và định dạng</strong> yêu cầu (vd ACES / EXR để master, hoặc codec giao nộp) ở đúng độ phân giải và dải khung. Sai không gian màu hay thiếu khớp grain là lý do phổ biến nhất khiến một cảnh bị trả về.</p>
<div class="callout"><span class="badge">Thêm khiếm khuyết cuối cùng</span> Sắc + sạch = giả. Khớp blur, focus và grain của plate, và phủ grain lên tất cả ở bước cuối cùng.</div>`,
  ]]);

const c8q = quiz('dtg304-quiz-8', 'Quiz 8 — Finishing|||Quiz 8 — Hoàn thiện', [
  { id: 'q1', question: 'Vì sao CG sắc lẹm, sạch bong lại trông giả trong một cảnh quay thật?', options: ['Vì độ phân giải thấp', 'Vì máy quay thật không hoàn hảo (có blur, defocus, grain) mà CG thì hoàn hảo', 'Vì sai định dạng file', 'Vì thiếu alpha'], correctIndex: 1, explanation: 'Plate thật có motion blur, depth of field, grain; CG "hoàn hảo" lộ ngay nếu không thêm lại các khiếm khuyết đó.' },
  { id: 'q2', question: 'Trong lớp hoàn thiện, grain thường được thêm khi nào?', options: ['Đầu tiên, trước khi tích hợp', 'Cuối cùng, phủ cả khung để CG & plate chung một cấu trúc hạt', 'Không bao giờ', 'Chỉ trên phần CG'], correctIndex: 1, explanation: 'Grain đặt cuối cùng, phủ toàn khung — nếu không CG sẽ lộ là lớp riêng sạch hơn.' },
  { id: 'q3', question: 'Pass nào dùng để tạo depth of field (defocus) khớp ống kính?', options: ['Specular', 'Depth (Z)', 'Diffuse', 'Shadow'], correctIndex: 1, explanation: 'Pass depth (Z) cho khoảng cách tới camera, dùng để làm mờ nét theo tiêu cự của plate.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'DTG304',
    slug: 'dtg304-principles-of-compositing',
    title: 'Principles of Compositing',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DTG304.webp',
    shortDescription: 'The art & science of digital compositing — VFX pipeline, colour & alpha/premultiply, green-screen keying, rotoscoping, blending & colour matching, node (Nuke) vs layer (AE), tracking & 3D multi-pass, motion blur & grain. Bilingual, with quizzes.|||Nghệ thuật & khoa học ghép hình — pipeline VFX, màu & alpha/premultiply, keying phông xanh, rotoscoping, blend & khớp màu, node (Nuke) vs lớp (AE), tracking & đa lớp 3D, motion blur & grain. Song ngữ, có quiz.',
    description: 'Môn <strong>DTG304 — Principles of Compositing</strong> (kỳ 5, Thiết kế mỹ thuật số) dạy <strong>ghép hình kỹ thuật số</strong>: gộp nhiều nguồn ảnh thành một cảnh liền mạch, đáng tin. Từ <strong>pipeline VFX</strong> → <strong>không gian màu, alpha &amp; premultiply</strong> → <strong>keying phông xanh</strong> → <strong>rotoscoping &amp; masking</strong> → <strong>blending &amp; khớp màu</strong> → <strong>node (Nuke) vs lớp (After Effects)</strong> → <strong>tracking, match-move &amp; đa lớp 3D (AOV)</strong> → <strong>motion blur, depth of field, grain &amp; kết xuất cuối</strong>. Bám giáo trình Brinkmann &amp; Wright cùng tài liệu Nuke/After Effects, song ngữ, quiz mỗi chương.',
    whatYouLearn: 'Vị trí compositing trong pipeline VFX; kênh alpha, linear vs gamma, premultiplied vs straight & phép Over; chroma/luma key, despill, core/edge/garbage matte; rotoscoping bằng spline, feather, chia theo khớp; blending modes (multiply/screen/add/over), lift-gamma-gain, khớp black/white point bằng scope; node-based (Nuke) vs layer-based (After Effects); 2D/planar/3D tracking, match-move, render đa lớp & AOV (diffuse/spec/shadow/Z/normal/cryptomatte); motion blur, depth of field, grain và kết xuất/giao nộp đúng chuẩn màu.',
    requirements: 'Kiến thức xử lý ảnh số cơ bản (RGB, độ phân giải). Nên cài Nuke Non-commercial hoặc DaVinci Resolve Fusion (miễn phí) và After Effects để thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách Brinkmann & Wright, tài liệu Nuke/After Effects, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Compositing là gì, vì sao một cảnh = nhiều lớp, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Pipeline VFX|||Chapter 1 — VFX pipeline', description: 'Compositing trong pipeline, vai trò compositor, EXR & linear.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Màu, alpha & premultiply|||Chapter 2 — Colour, alpha & premultiply', description: 'Alpha, linear vs gamma, premultiplied vs straight, phép Over.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Keying|||Chapter 3 — Keying', description: 'Chroma/luma key, phông xanh, despill, các loại matte.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Rotoscoping & masking|||Chapter 4 — Rotoscoping & masking', description: 'Spline/feather, keyframe, chia theo khớp, tracking hỗ trợ roto.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Blend & khớp màu|||Chapter 5 — Blend & colour matching', description: 'Công thức blend, lift-gamma-gain, khớp black/white point, scope.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Node vs lớp|||Chapter 6 — Node vs layer', description: 'Nuke (node) vs After Effects (layer), khi nào chọn cái nào.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Tracking & 3D|||Chapter 7 — Tracking & 3D', description: 'Match-move, 2D/planar/3D track, render đa lớp & AOV.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Hoàn thiện & kết xuất|||Chapter 8 — Finishing & render', description: 'Motion blur, depth of field, grain, kết xuất & giao nộp cuối.', lessons: [c8, c8q] },
  ],
};
