/**
 * Content Creator — Chương 8: Ánh sáng. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 *
 * Chương 5 dạy máy quay ĐỌC sáng thế nào (khẩu độ/màn trập/ISO). Chương này dạy
 * TẠO ra ánh sáng đúng trước khi máy kịp đọc — không lặp lại tam giác phơi sáng,
 * chỉ nối mạch tới nó (180° màn trập ↔ hướng đặt đèn, Kelvin cân bằng trắng ↔
 * Kelvin khi mua/trộn đèn, điện 50Hz ↔ nhấp nháy PWM).
 *
 * Nguồn số liệu chính (đầy đủ trong báo cáo bàn giao):
 *  - Luật bình phương nghịch đảo (chính xác cho nguồn điểm, gần đúng cho nguồn
 *    lớn/gần): petapixel.com/inverse-square-law-light,
 *    digital-photography-school.com/an-introduction-to-the-inverse-square-law.
 *  - CRI — chuẩn CIE, thang 0–100: waveformlighting.com/tech/what-is-cri-color-rendering-index.
 *  - TLCI — chuẩn EBU (Tech 3355 / "TLCI-2012"), thang 0–100, ≥85 = máy quay
 *    gần như không cần chỉnh màu lại: gossen-photo.de/en/tlci-television-lighting-consistency-index.
 *  - Nhấp nháy do PWM dimming (khác nhấp nháy 100Hz điện lưới đã nói ở Chương 5):
 *    waveformlighting.com/film-photography/an-introduction-to-flicker-free-led-strip-dimming.
 *  - 4 kiểu sáng mặt Rembrandt/loop/butterfly/split:
 *    digital-photography-school.com/6-portrait-lighting-patterns-every-photographer-should-know.
 *  - Tỉ lệ key:fill theo stop (quy ước ĐƠN GIẢN — so trực tiếp độ sáng 2 đèn,
 *    khác công thức (key+fill):fill của ASC): studiobinder.com/blog/lighting-ratios.
 *  - DJI Osmo Pocket 3 — cảm biến 1 inch, f/2.0 cố định: dji.com/osmo-pocket-3/specs
 *    (đã dùng ở Chương 5, nhắc lại khi nói khẩu độ không đổi được ảnh hưởng gì tới ánh sáng cần).
 *  - Điện Việt Nam 220V/50Hz: worldstandards.eu/electricity/plug-voltage-by-country/vietnam
 *    (đã dùng ở Chương 5, nhắc lại khi nói nhấp nháy 100Hz).
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa chương'],
  [2, 'Bản đồ chương'],
  [3, 'Ánh sáng cứng/mềm & ba hướng chiếu'],
  [4, 'Luật bình phương nghịch đảo'],
  [5, 'Kelvin, CRI & TLCI'],
  [6, 'Cửa sổ 45°'],
  [7, 'Ngược sáng sai vs cửa sổ đúng'],
  [8, 'Nắng trưa Việt Nam — vấn đề & cách sửa'],
  [9, 'Ba điểm: Key · Fill · Back'],
  [10, 'Tỉ lệ key:fill theo stop'],
  [11, 'Chỉ có một đèn? Thêm tấm hắt'],
  [12, 'Bốn kiểu sáng mặt'],
  [13, 'Setup bàn làm việc tại nhà'],
  [14, 'Setup tại nhà — sai vs đúng'],
  [15, 'Bảng tra nhanh cả chương'],
  [16, 'Thực hành'],
];

export default {
  title: 'Chapter 8 — Light|||Chương 8 — Ánh sáng',
  description: 'Bản chất ánh sáng (cứng/mềm, luật bình phương nghịch đảo, Kelvin, CRI/TLCI), ánh sáng tự nhiên trong nhà VN, ba điểm & 4 kiểu sáng mặt, và dựng một góc quay tại nhà với ngân sách thấp.',
  lessons: [
    /* ─────────────────── 8.0 slide bài giảng ─────────────────── */
    {
      title: '8.0 — Chapter 8 in 16 slides|||8.0 — Chương 8 trong 16 slide',
      slug: 'cr-08-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Toàn bộ Chương 8 trong 16 slide: bản chất ánh sáng, luật bình phương nghịch đảo, Kelvin/CRI/TLCI, ánh sáng tự nhiên, ba điểm và 4 kiểu sáng mặt, setup tại nhà.',
      content: `
<div class="ml-en"><h2>📑 Chapter 8 in 16 slides</h2>
<p>Chapter 5 taught the camera side of exposure — aperture, shutter, ISO. This chapter teaches the other half: what you point the camera AT. Light is the one variable that is almost entirely under your control before you ever press record, and it is the fastest way to make a video shot on a phone look like it was shot on a real camera. Slide 4 (the inverse-square law) and slide 12 (the four face-lighting patterns) are the two you will come back to the most.</p>
<p>Nothing here needs new gear. Every diagram in this chapter works with a window, a desk lamp, and a piece of white cardboard — the same kit you already have in your room in Vietnam.</p></div>
<div class="ml-vi"><h2>📑 Chương 8 trong 16 slide</h2>
<p>Chương 5 dạy phần máy quay của phơi sáng — khẩu độ, màn trập, ISO. Chương này dạy nửa còn lại: bạn CHĨA máy quay vào cái gì. Ánh sáng là biến số gần như hoàn toàn nằm trong tay bạn trước cả khi bấm quay, và là cách nhanh nhất biến một video quay bằng điện thoại trông như quay bằng máy chuyên nghiệp. Slide 4 (luật bình phương nghịch đảo) và slide 12 (bốn kiểu sáng mặt) là hai slide bạn sẽ quay lại nhiều nhất.</p>
<p>Không cần mua thêm đồ gì cho chương này. Mọi sơ đồ trong chương đều chạy được với một cửa sổ, một đèn bàn, và một tấm bìa cứng trắng — đúng những gì bạn đang có sẵn trong phòng ở Việt Nam.</p></div>
${gallery('cr-08', SLIDES)}
`,
    },

    /* ─────────────────── 8.1 bản chất ánh sáng ─────────────────── */
    {
      title: '8.1 — What light actually does|||8.1 — Bản chất của ánh sáng',
      slug: 'cr-08-1-ban-chat-anh-sang',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Cứng vs mềm, ba hướng chiếu, luật bình phương nghịch đảo bằng số thật, Kelvin khi mua đèn, CRI/TLCI, và vì sao đèn LED vặn nhỏ vẫn nhấp nháy dù bạn đã chỉnh đúng màn trập theo Chương 5.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Light is not "turn on a lamp" — it is four numbers you can actually calculate</h2>
<p class="lead">Chapter 5 taught the camera how to READ light (aperture, shutter, ISO). This lesson teaches you to CREATE the right light before the camera ever reads it. A clip shot in 4K ProRes under bad light still looks bad; a clip shot in plain 1080p under good light still looks good. Everything below runs on a window, a desk lamp, and a piece of white cardboard — no new purchase required.</p>

<h3>Hard and soft — not about brightness, about the SIZE of the source</h3>
<p>Beginners guess that "hard light" means strong and "soft light" means weak. Both are wrong. <strong>Hard vs soft</strong> (cứng vs mềm) is entirely about the APPARENT SIZE of the light source relative to your subject, not its power. A small or distant source — the midday sun (blazing but tiny in the sky), a bare LED panel — sends nearly parallel rays, so the shadow it casts has a crisp, sharp edge: that is hard light. A large or close source — a softbox pressed near a face, an overcast sky (the entire sky becomes one giant source) — sends light from many angles at once, so the shadow edge fades gradually: that is soft light.</p>
${slide('cr-08', 3, 'Ánh sáng cứng/mềm & ba hướng chiếu')}
<p>This gives you a free way to soften any light without buying anything: move it CLOSER to the subject, or put something translucent (a sheet, a shower curtain, baking paper) between the source and the subject. Distance and size are the only two dials — power is not one of them.</p>

<h3>Three directions: front, side, back</h3>
<p>Light from the FRONT (on the camera axis) is flat and hides texture and depth — useful when you want an evenly lit, no-surprises look, bad when you want a face to look three-dimensional. Light from the SIDE (45–90°) reveals shape and texture — skin, fabric, a whiteboard all show more depth. Light from BEHIND the subject either separates them from the background (a thin rim of light around hair and shoulders) or, if there is no light hitting the front of their face at all, turns them into a pure silhouette. Lesson 8.2 shows exactly how that silhouette mistake happens with a window.</p>

<h3>The inverse-square law — a number, not a feeling</h3>
${slide('cr-08', 4, 'Luật bình phương nghịch đảo')}
<p>Light intensity follows <strong>I = 1/d²</strong>: double the distance between a light and your subject, and the subject receives not half the light, but a QUARTER. That is exactly 2 stops lost (since 4 = 2², and each stop is a doubling or halving of light).</p>
<table><tr><th>Distance</th><th>Light received</th><th>Change from 1 m</th></tr>
<tr><td>1 m (reference)</td><td>100%</td><td>—</td></tr>
<tr><td>2 m</td><td>25%</td><td>−2 stops</td></tr>
<tr><td>4 m</td><td>6.25%</td><td>−4 stops</td></tr>
<tr><td>8 m</td><td>1.5625%</td><td>−6 stops</td></tr>
</table>
<div class="callout warn"><p><strong>This is exact for a POINT source</strong> — a small bare LED, a torch, the sun (effectively a point at that distance). For a large source like a softbox held close to the subject, light falls off MORE SLOWLY than this formula predicts, because different parts of the panel are at meaningfully different distances from the subject. The law is a close approximation once your distance to the light is large compared to the light's own physical size — not an exact match at arm's length.</p></div>
<p>The practical use: if a shot looks too bright or too dark and you do not want to touch ISO or shutter (which you locked for a reason in Chapter 5), move the light instead of turning a dial. Pull it back to lose brightness fast, or bring it in to gain it fast — moving from 1 m to 2 m loses 2 full stops, more than most brightness dials can even reach in one twist.</p>

<h3>Kelvin, and the two numbers that grade a light's colour quality</h3>
${slide('cr-08', 5, 'Kelvin, CRI & TLCI')}
<p>Chapter 5 used the Kelvin scale for white balance. Here it matters for a different decision: which light to BUY and how to MIX the ones you own. Warm household bulbs sit around 2700–3200K, neutral LED panels around 4000K, daylight near 5600K, overcast sky 6500K and up, open shade 9000K+.</p>
<p>Two more numbers matter once you are comparing lights to buy, because Kelvin alone does not tell you if a light's colour is any GOOD:</p>
<table><tr><th>Scale</th><th>Defined by</th><th>Range</th><th>"Good enough"</th></tr>
<tr><td>CRI (Ra)</td><td>CIE</td><td>0–100</td><td>≥95 — a common marketing bar, not a mandatory standard</td></tr>
<tr><td>TLCI</td><td>EBU (Tech 3355)</td><td>0–100</td><td>≥85 — footage needs little or no colour correction</td></tr>
</table>
<p><strong>CRI</strong> (Colour Rendering Index) compares how a light source renders a set of standard colour swatches against a daylight/incandescent reference, judged the way a human eye sees it directly. <strong>TLCI</strong> (Television Lighting Consistency Index) was built by the EBU specifically because CRI does not predict how a light will look once it passes through a CAMERA sensor and then a DISPLAY — it simulates that whole video pipeline using 18 reference colours instead. A light can score well on CRI and still look slightly "off" on camera if its spectrum has narrow spikes that CRI's limited swatches do not catch — which is exactly the gap TLCI was created to close.</p>

<h3>Flicker has more than one cause</h3>
<p>Chapter 5 covered mains-frequency flicker: Vietnam's 220V/50Hz grid makes ordinary LED and fluorescent bulbs flicker 100 times a second, and your shutter speed has to be a clean multiple of that (1/50 at 25fps, 1/100 at 50fps) to avoid banding.</p>
<p>There is a second, unrelated cause specific to LED FIXTURES with a brightness dial: <strong>PWM dimming</strong> (Pulse-Width Modulation — điều biến độ rộng xung). Instead of truly reducing current, many dimmable LED lights switch fully on and off very fast and vary how much of the time they spend "on" to fake a lower brightness. If that switching frequency is low, a camera's shutter can catch the light mid-"off", causing flicker that has nothing to do with the 100Hz mains rhythm — and matching your shutter to Chapter 5's formula will NOT fix it, because the two flicker sources are unrelated.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — you set the exact shutter speed Chapter 5 taught you, and the LED light still flickers once you turn its brightness dial down.</strong> That is the signature of PWM dimming, not mains flicker. Two fixes: raise the light back up and instead reduce brightness by moving it FARTHER away (the inverse-square law from earlier in this lesson), or check the manufacturer's spec sheet for "flicker-free" or a stated PWM frequency before buying a dimmable light.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 8.2 applies hard/soft and direction to the light you already have for free — the window in your room, and the harsh midday sun outside it.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Film 5 seconds of your hand under direct window sun, then 5 seconds under an ordinary ceiling bulb in the same room — name which one is harder and which is softer, out loud, before reading back.</li>
<li>Find a lamp at home with a brightness dial. Turn it down to its lowest setting and film 5 seconds — check for flicker or banding.</li>
<li>Set a desk lamp at 1 m from a plain white sheet of paper, film 3 seconds, then move it to 2 m and 4 m, filming 3 seconds at each distance without touching any camera setting. Compare brightness on a real screen.</li>
</ol><p><strong>Done when:</strong> you can explain, without looking back, why a "strong" light can still be soft, and why moving a light matters more than its wattage.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Hard light</span><span class="v">Ánh sáng cứng — a small or distant source; crisp, sharp-edged shadows.</span></div>
<div class="kv"><span class="k">Soft light</span><span class="v">Ánh sáng mềm — a large or close source; shadows fade gradually at the edge.</span></div>
<div class="kv"><span class="k">Inverse-square law</span><span class="v">Luật bình phương nghịch đảo — doubling distance to a point source cuts light to a quarter (−2 stops).</span></div>
<div class="kv"><span class="k">Stop</span><span class="v">A doubling or halving of light quantity — the same unit used for aperture, shutter and ISO in Chapter 5.</span></div>
<div class="kv"><span class="k">CRI</span><span class="v">Colour Rendering Index — CIE standard, 0–100, how accurately a light reveals colour to the human eye.</span></div>
<div class="kv"><span class="k">TLCI</span><span class="v">Television Lighting Consistency Index — EBU standard, 0–100, how a light performs through a camera and display.</span></div>
<div class="kv"><span class="k">PWM dimming</span><span class="v">A light dims by switching on/off very fast rather than truly lowering current — low PWM frequency can flicker on camera.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Hard vs soft depends on the light's SIZE relative to the subject, not its brightness.</li>
<li>Doubling the distance from a point light cuts intensity to a quarter — exactly 2 stops, exact for point sources, approximate for large sources up close.</li>
<li>CRI grades colour for the human eye; TLCI grades it for a camera-and-display pipeline — buy video lights by TLCI when it is published, by CRI ≥95 when it is not.</li>
<li>A dimmable LED that flickers only at low brightness is a PWM problem, not a mains-frequency problem — Chapter 5's shutter fix will not solve it.</li>
</ul>
<div class="link-card"><a href="https://petapixel.com/inverse-square-law-light/" target="_blank" rel="noopener">PetaPixel — understanding the inverse-square law of light</a></div>
<div class="link-card"><a href="https://www.waveformlighting.com/tech/what-is-cri-color-rendering-index" target="_blank" rel="noopener">Waveform Lighting — what is CRI (Color Rendering Index)</a></div>
<div class="link-card"><a href="https://www.gossen-photo.de/en/tlci-television-lighting-consistency-index/" target="_blank" rel="noopener">Gossen — TLCI, Television Lighting Consistency Index</a></div>
<div class="link-card"><a href="https://www.waveformlighting.com/film-photography/an-introduction-to-flicker-free-led-strip-dimming" target="_blank" rel="noopener">Waveform Lighting — an introduction to flicker-free LED dimming (PWM)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Ánh sáng không phải "bật đèn lên" — đó là bốn con số bạn tính được thật sự</h2>
<p class="lead">Chương 5 dạy máy quay ĐỌC ánh sáng thế nào (khẩu độ, màn trập, ISO). Bài này dạy bạn TẠO ra ánh sáng đúng trước khi máy kịp đọc. Một cảnh quay 4K ProRes dưới ánh sáng tệ vẫn xấu; một cảnh quay 1080p thường dưới ánh sáng đúng vẫn đẹp. Mọi thứ dưới đây chạy được với một cửa sổ, một đèn bàn, và một tấm bìa cứng trắng — không cần mua gì thêm.</p>

<h3>Cứng và mềm — không phải về độ sáng, mà về KÍCH THƯỚC nguồn</h3>
<p>Người mới hay đoán "ánh sáng cứng" nghĩa là mạnh, "ánh sáng mềm" nghĩa là yếu. Cả hai đều sai. <strong>Cứng vs mềm</strong> hoàn toàn nằm ở KÍCH THƯỚC BIỂU KIẾN của nguồn sáng so với chủ thể, không phải công suất đèn. Một nguồn nhỏ hoặc ở xa — nắng giữa trưa (cực mạnh nhưng nhỏ xíu trên bầu trời), một đèn LED trần nhỏ — chiếu ra các tia gần như song song, nên bóng đổ có viền sắc, rõ: đó là ánh sáng cứng. Một nguồn lớn hoặc ở gần — softbox áp sát mặt, bầu trời âm u (cả bầu trời trở thành một nguồn sáng khổng lồ) — chiếu sáng từ rất nhiều góc cùng lúc, nên viền bóng mờ dần: đó là ánh sáng mềm.</p>
${slide('cr-08', 3, 'Ánh sáng cứng/mềm & ba hướng chiếu')}
<p>Đây là cách làm mềm bất kỳ nguồn sáng nào mà không tốn tiền: đưa nó LẠI GẦN chủ thể hơn, hoặc đặt một thứ trong mờ (tấm vải, rèm tắm, giấy nến) giữa nguồn và chủ thể. Khoảng cách và kích thước là hai núm vặn duy nhất — công suất không phải là một trong số đó.</p>

<h3>Ba hướng chiếu: trước, bên, sau</h3>
<p>Ánh sáng từ TRƯỚC MẶT (cùng trục máy quay) phẳng và giấu mất chiều sâu/kết cấu — hữu ích khi bạn muốn hình đều sáng, không bất ngờ; dở khi bạn muốn khuôn mặt trông có khối. Ánh sáng từ BÊN (45–90°) lộ ra hình khối và kết cấu — da, vải, bảng trắng đều trông có chiều sâu hơn. Ánh sáng từ SAU LƯNG chủ thể hoặc tách họ khỏi nền (một viền sáng mỏng quanh tóc và vai), hoặc — nếu KHÔNG có ánh sáng nào chiếu vào mặt trước của họ — biến họ thành bóng đen thuần tuý (silhouette). Bài 8.2 sẽ chỉ đúng cách lỗi silhouette này xảy ra với một cửa sổ.</p>

<h3>Luật bình phương nghịch đảo — một con số, không phải cảm tính</h3>
${slide('cr-08', 4, 'Luật bình phương nghịch đảo')}
<p>Cường độ ánh sáng tuân theo <strong>I = 1/d²</strong>: gấp đôi khoảng cách giữa đèn và chủ thể, chủ thể KHÔNG nhận còn một nửa sáng, mà chỉ còn MỘT PHẦN TƯ. Đó là mất đúng 2 stop (vì 4 = 2², và mỗi stop là một lần gấp đôi hoặc giảm nửa lượng sáng).</p>
<table><tr><th>Khoảng cách</th><th>Sáng nhận được</th><th>Thay đổi so với 1 m</th></tr>
<tr><td>1 m (mốc)</td><td>100%</td><td>—</td></tr>
<tr><td>2 m</td><td>25%</td><td>−2 stop</td></tr>
<tr><td>4 m</td><td>6,25%</td><td>−4 stop</td></tr>
<tr><td>8 m</td><td>1,5625%</td><td>−6 stop</td></tr>
</table>
<div class="callout warn"><p><strong>Điều này CHÍNH XÁC cho một NGUỒN ĐIỂM</strong> — một đèn LED trần nhỏ, một đèn pin, mặt trời (coi như một điểm ở khoảng cách đó). Với một nguồn lớn như softbox đặt gần chủ thể, ánh sáng tắt CHẬM HƠN công thức này dự đoán, vì các phần khác nhau của tấm softbox có khoảng cách khác nhau đáng kể tới chủ thể. Luật này là một phép gần đúng tốt khi khoảng cách tới đèn lớn hơn nhiều lần kích thước vật lý của chính đèn — không khớp chính xác khi đèn ở ngay sát tầm tay.</p></div>
<p>Ứng dụng thực tế: nếu một cảnh quá sáng hoặc quá tối mà bạn không muốn đụng vào ISO hay màn trập (thứ bạn đã khoá có lý do từ Chương 5), hãy di chuyển đèn thay vì vặn núm. Đẩy đèn ra xa để mất sáng nhanh, kéo lại gần để được sáng nhanh — di chuyển từ 1m sang 2m đã mất trọn 2 stop, nhiều hơn hầu hết núm chỉnh sáng vặn được trong một vòng.</p>

<h3>Kelvin, và hai con số chấm điểm chất lượng màu của đèn</h3>
${slide('cr-08', 5, 'Kelvin, CRI & TLCI')}
<p>Chương 5 dùng thang Kelvin cho cân bằng trắng. Ở đây nó phục vụ một quyết định khác: MUA đèn nào và TRỘN các đèn đang có ra sao. Bóng đèn gia dụng ấm rơi vào khoảng 2700–3200K, panel LED trung tính khoảng 4000K, ánh sáng ban ngày gần 5600K, trời nhiều mây 6500K trở lên, bóng râm ngoài trời 9000K+.</p>
<p>Có thêm hai con số quan trọng khi bạn bắt đầu so sánh đèn để MUA, vì riêng Kelvin không nói được màu của đèn có TỐT hay không:</p>
<table><tr><th>Thang đo</th><th>Ai định nghĩa</th><th>Khoảng</th><th>Mức "đủ tốt"</th></tr>
<tr><td>CRI (Ra)</td><td>CIE</td><td>0–100</td><td>≥95 — tiêu chí quảng cáo phổ biến, không phải chuẩn bắt buộc</td></tr>
<tr><td>TLCI</td><td>EBU (Tech 3355)</td><td>0–100</td><td>≥85 — cảnh quay gần như không cần chỉnh màu lại</td></tr>
</table>
<p><strong>CRI</strong> (Color Rendering Index) so sánh cách một nguồn sáng thể hiện một bộ mẫu màu chuẩn so với một nguồn tham chiếu (ánh sáng ban ngày/đèn sợi đốt), chấm theo cách MẮT NGƯỜI nhìn trực tiếp. <strong>TLCI</strong> (Television Lighting Consistency Index) do EBU dựng lên chính vì CRI không dự đoán được đèn đó sẽ trông ra sao SAU KHI đi qua cảm biến MÁY QUAY rồi tới MÀN HÌNH — nó mô phỏng nguyên cả đường đi video đó bằng 18 màu tham chiếu thay vì bộ mẫu của CRI. Một đèn có thể đạt điểm CRI cao mà vẫn trông hơi "sai sai" qua ống kính nếu quang phổ của nó có những đỉnh nhọn mà bộ mẫu giới hạn của CRI không bắt được — đúng là khoảng trống mà TLCI sinh ra để lấp.</p>

<h3>Nhấp nháy có nhiều hơn một nguyên nhân</h3>
<p>Chương 5 đã nói về nhấp nháy do tần số điện lưới: lưới điện 220V/50Hz của Việt Nam khiến đèn LED và huỳnh quang thường nhấp nháy 100 lần mỗi giây, và màn trập của bạn phải là bội số sạch của con số đó (1/50 ở 25fps, 1/100 ở 50fps) để tránh sọc.</p>
<p>Có một nguyên nhân THỨ HAI, hoàn toàn không liên quan, riêng cho các ĐÈN LED có núm chỉnh độ sáng: <strong>PWM dimming</strong> (Pulse-Width Modulation — điều biến độ rộng xung). Thay vì thật sự giảm dòng điện, nhiều đèn LED chỉnh được độ sáng tắt/mở HOÀN TOÀN rất nhanh và thay đổi tỉ lệ thời gian "mở" để giả lập một mức sáng thấp hơn. Nếu tần số tắt/mở đó THẤP, màn trập máy quay có thể bắt trúng đúng lúc đèn đang "tắt", gây nhấp nháy chẳng liên quan gì tới nhịp 100Hz của điện lưới — và khớp màn trập theo đúng công thức Chương 5 sẽ KHÔNG sửa được, vì hai nguồn nhấp nháy này độc lập với nhau.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — bạn đã đặt đúng màn trập theo đúng công thức Chương 5, mà đèn LED vẫn nhấp nháy ngay khi vặn núm độ sáng xuống thấp.</strong> Đó là dấu hiệu của lỗi PWM dimming, không phải lỗi tần số điện lưới. Hai cách sửa: vặn đèn sáng trở lại rồi giảm độ sáng bằng cách đẩy đèn RA XA hơn (đúng luật bình phương nghịch đảo vừa học ở trên), hoặc kiểm thông số kỹ thuật của nhà sản xuất xem có ghi "flicker-free" hay tần số PWM cụ thể không TRƯỚC KHI mua một đèn chỉnh được độ sáng.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 8.2 áp dụng cứng/mềm và hướng chiếu vào nguồn sáng bạn đang có SẴN MIỄN PHÍ — cửa sổ trong phòng, và cả nắng trưa gắt bên ngoài nó.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Quay 5 giây bàn tay bạn dưới nắng trực tiếp qua cửa sổ, rồi 5 giây dưới một bóng đèn trần bình thường trong cùng phòng — gọi tên được đâu là cứng, đâu là mềm, nói thành lời trước khi đọc lại bài.</li>
<li>Tìm một đèn trong nhà có núm chỉnh độ sáng. Vặn xuống mức thấp nhất và quay 5 giây — kiểm xem có sọc/nhấp nháy không.</li>
<li>Đặt một đèn bàn cách một tờ giấy trắng 1m, quay 3 giây, rồi dời ra 2m và 4m, quay 3 giây ở mỗi khoảng cách mà KHÔNG đụng vào bất kỳ cài đặt nào của máy. So độ sáng trên một màn hình thật.</li>
</ol><p><strong>Đạt khi:</strong> bạn giải thích được, không cần xem lại, vì sao một đèn "mạnh" vẫn có thể là ánh sáng mềm, và vì sao di chuyển đèn quan trọng hơn công suất (watt) của nó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Ánh sáng cứng</span><span class="v">Hard light — nguồn nhỏ hoặc ở xa; bóng đổ có viền sắc, rõ.</span></div>
<div class="kv"><span class="k">Ánh sáng mềm</span><span class="v">Soft light — nguồn lớn hoặc ở gần; viền bóng mờ dần.</span></div>
<div class="kv"><span class="k">Luật bình phương nghịch đảo</span><span class="v">Gấp đôi khoảng cách tới nguồn điểm làm sáng còn 1/4 (−2 stop).</span></div>
<div class="kv"><span class="k">Stop</span><span class="v">Một lần gấp đôi hoặc giảm nửa lượng sáng — cùng đơn vị dùng cho khẩu độ, màn trập, ISO ở Chương 5.</span></div>
<div class="kv"><span class="k">CRI</span><span class="v">Color Rendering Index — chuẩn CIE, 0–100, đo độ chính xác màu cho MẮT NGƯỜI.</span></div>
<div class="kv"><span class="k">TLCI</span><span class="v">Television Lighting Consistency Index — chuẩn EBU, 0–100, đo hiệu năng đèn qua MÁY QUAY + MÀN HÌNH.</span></div>
<div class="kv"><span class="k">PWM dimming</span><span class="v">Đèn giảm sáng bằng cách tắt/mở rất nhanh thay vì giảm dòng thật — tần số thấp có thể gây nhấp nháy khi quay.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cứng vs mềm phụ thuộc KÍCH THƯỚC nguồn so với chủ thể, không phải độ sáng.</li>
<li>Gấp đôi khoảng cách tới nguồn điểm làm sáng còn 1/4 — đúng 2 stop, chính xác cho nguồn điểm, gần đúng cho nguồn lớn ở gần.</li>
<li>CRI chấm màu cho mắt người; TLCI chấm màu qua cả máy quay lẫn màn hình — mua đèn quay video theo TLCI nếu có công bố, theo CRI ≥95 nếu không.</li>
<li>Một đèn LED chỉnh sáng chỉ nhấp nháy khi vặn xuống thấp là lỗi PWM, không phải lỗi tần số điện lưới — cách sửa màn trập của Chương 5 không giải quyết được.</li>
</ul>
<div class="link-card"><a href="https://petapixel.com/inverse-square-law-light/" target="_blank" rel="noopener">PetaPixel — giải thích luật bình phương nghịch đảo của ánh sáng</a></div>
<div class="link-card"><a href="https://www.waveformlighting.com/tech/what-is-cri-color-rendering-index" target="_blank" rel="noopener">Waveform Lighting — CRI (Color Rendering Index) là gì</a></div>
<div class="link-card"><a href="https://www.gossen-photo.de/en/tlci-television-lighting-consistency-index/" target="_blank" rel="noopener">Gossen — TLCI, Television Lighting Consistency Index</a></div>
<div class="link-card"><a href="https://www.waveformlighting.com/film-photography/an-introduction-to-flicker-free-led-strip-dimming" target="_blank" rel="noopener">Waveform Lighting — giới thiệu về nhấp nháy do PWM và cách tránh</a></div>
</div>
`,
    },

    /* ─────────────────── 8.2 ánh sáng tự nhiên ─────────────────── */
    {
      title: '8.2 — Natural light: windows and the Vietnamese noon sun|||8.2 — Ánh sáng tự nhiên: cửa sổ và nắng trưa Việt Nam',
      slug: 'cr-08-2-anh-sang-tu-nhien',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Cửa sổ 45° đúng cách, vì sao đứng quay lưng về cửa sổ biến bạn thành cái bóng, giờ vàng/giờ xanh, và cách sửa nắng trưa gắt ở Việt Nam bằng bóng râm, tấm tản và tấm hắt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>The best light in your room is already free — you just have to face it correctly</h2>
<p class="lead">Before you spend one đồng on a light, learn to use the one already coming through your window. Window light is naturally soft (a whole sky behind it), naturally flattering, and available every single day — the only skill is standing in the right spot relative to it.</p>

<h3>Window light at 45°</h3>
${slide('cr-08', 6, 'Cửa sổ 45°')}
<p>Turn your face straight AT the window and light goes flat — you lose the sense of depth that makes a face look three-dimensional on camera. Turn almost fully sideways to it and one whole side of your face goes dark, with nothing to fill the shadow. The sweet spot most photographers default to is roughly <strong>45°</strong>: enough angle to shape the face with a soft gradient from bright to shadow, not enough to lose half the face to darkness.</p>
<div class="callout good"><p><strong>How to find it fast:</strong> sit or stand near the window, then rotate your chair or your body until the shadow under your nose points roughly toward one corner of your mouth instead of straight down or straight sideways. That is close enough to 45° for a talking-head shot.</p></div>

<h3>Backlit by accident — the most common beginner mistake</h3>
${slide('cr-08', 7, 'Ngược sáng sai vs cửa sổ đúng')}
<p>Sit with your BACK to the window — a completely natural instinct, since the window is now behind your screen and out of your eyeline — and your camera's auto-exposure reads the bright window and darkens everything else to compensate. Your face turns into a silhouette. This is not a camera malfunction; it is the camera correctly averaging what it sees, and what it sees is mostly a bright rectangle behind a dark person.</p>
<p>The fix costs nothing: turn your desk, or your chair, 180° so the window faces YOU instead of your back. If that is not possible in your room's layout, at minimum add a light in front of your face — even a phone flashlight or a lamp — to fill in what the window is stealing.</p>

<h3>Golden hour and blue hour</h3>
<p>Outdoors, the hour or so after sunrise and before sunset is often called <strong>golden hour</strong> — the sun sits low, its light travels through more atmosphere and arrives warmer and softer, with longer, more flattering shadows than the harsh light of midday. <strong>Blue hour</strong> is the shorter window just before sunrise or just after sunset, when the sun itself is below the horizon but the sky still glows a deep, even blue — a favourite for city and skyline shots. Both shift with your latitude and the season, so treat them as "roughly this time of day," not a fixed clock — a weather or sun-position app will give you the exact times for your location on any given day.</p>

<h3>Midday sun in Vietnam</h3>
${slide('cr-08', 8, 'Nắng trưa Việt Nam — vấn đề & cách sửa')}
<p>Between roughly 11am and 2pm the sun sits almost directly overhead in Vietnam. That produces the hardest, least flattering light of the day: short, harsh shadows carved straight down under the eyes, nose and chin, high contrast, and a subject who cannot stop squinting. This is exactly the "hard light" from Lesson 8.1 — a small, intense source, at its most extreme.</p>
<p>Three fixes, all free or nearly free: find OPEN SHADE (a shop awning, under a tree, just inside a doorway or large window — the light softens immediately once direct sun cannot hit the subject); hold a DIFFUSER (a sheer white cloth) between the sun and the subject to turn hard light soft, the same close-the-source-or-the-distance trick from 8.1; or use a white BOUNCE card (foam board, cardboard, even a large sheet of paper) to reflect light back up into the harsh shadows under the eyes and soften contrast.</p>
<div class="callout ok"><p><strong>An overcast sky is a free diffuser the size of the entire sky.</strong> Clouds scatter harsh sunlight into an enormous, soft source that covers the whole horizon — many beginners think a cloudy day is bad luck for filming. It is often the opposite: it is one of the easiest lighting conditions for a flattering portrait.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — "window light is always soft" is not quite true.</strong> A small window facing directly into low, harsh afternoon sun (common on a west-facing wall in a rented room) can still push hard, high-contrast light straight through, with sharp shadows just like direct outdoor sun. If that happens, hang a thin curtain or sheer cloth over the window — you have just built a diffuser, turning hard light soft exactly the way Lesson 8.1 described.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 8.3 takes this same 45° instinct and turns it into a repeatable three-light system — key, fill and back — plus four named face-lighting patterns you can build with a single light.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Sit with your back to a window and record 10 seconds of yourself talking. Then turn 180° and record 10 seconds facing the window at roughly 45°. Compare both clips on a real screen.</li>
<li>If you can, film the same spot at midday and again during golden hour (or the closest equivalent you can arrange) and compare shadow length and hardness.</li>
<li>At midday, hold a white sheet of paper below your face just out of frame while someone (or a tripod) films you — watch the shadows under your eyes lighten in real time.</li>
</ol><p><strong>Done when:</strong> you can walk into any room in your home, find the window, and correctly predict — before recording anything — whether sitting to face it will look flattering or flat.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Window light</span><span class="v">Ánh sáng cửa sổ — naturally soft, free, available daily; direction still matters.</span></div>
<div class="kv"><span class="k">Backlit / silhouette</span><span class="v">Ngược sáng — light source behind the subject with no fill in front turns them into a dark shape.</span></div>
<div class="kv"><span class="k">Golden hour</span><span class="v">Giờ vàng — roughly the hour after sunrise / before sunset; warm, soft, low-angle light.</span></div>
<div class="kv"><span class="k">Blue hour</span><span class="v">Giờ xanh — the short window around sunrise/sunset when the sky glows deep blue.</span></div>
<div class="kv"><span class="k">Diffuser</span><span class="v">Tấm tản sáng — translucent material placed between a hard source and the subject to soften it.</span></div>
<div class="kv"><span class="k">Bounce</span><span class="v">Tấm hắt sáng — a reflective surface (white board, paper) that redirects existing light into shadows.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Face a window at roughly 45° for flattering, soft, free light — straight-on is flat, fully sideways loses half the face.</li>
<li>Sitting with your back to a window turns you into a silhouette — the camera exposes for the bright window, not for you.</li>
<li>Midday sun in Vietnam is harsh; fix it with shade, a diffuser, or a bounce card — an overcast sky is a free diffuser the size of the horizon.</li>
<li>Not all window light is automatically soft — a small window facing harsh direct sun still needs a curtain to diffuse it.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Ánh sáng tốt nhất trong phòng bạn đã MIỄN PHÍ sẵn — chỉ cần quay mặt đúng hướng</h2>
<p class="lead">Trước khi tiêu một đồng nào cho đèn, hãy học cách dùng đúng nguồn sáng đang chiếu qua cửa sổ nhà bạn. Ánh sáng cửa sổ tự nhiên đã mềm (cả bầu trời đứng sau nó), tự nhiên đã đẹp, và có sẵn mỗi ngày — kỹ năng duy nhất là đứng đúng vị trí so với nó.</p>

<h3>Ánh sáng cửa sổ ở 45°</h3>
${slide('cr-08', 6, 'Cửa sổ 45°')}
<p>Quay mặt thẳng VỀ PHÍA cửa sổ, ánh sáng sẽ phẳng — bạn mất cảm giác chiều sâu vốn làm khuôn mặt trông có khối trên máy quay. Quay gần như hoàn toàn nghiêng sang một bên, cả một nửa mặt tối om, không có gì bù sáng lại. Điểm cân bằng mà đa số nhiếp ảnh gia mặc định dùng là khoảng <strong>45°</strong>: đủ góc để tạo khối cho khuôn mặt với một dải chuyển từ sáng sang tối mềm mại, không đủ để mất hẳn nửa mặt vào bóng tối.</p>
<div class="callout good"><p><strong>Cách tìm nhanh:</strong> ngồi hoặc đứng gần cửa sổ, rồi xoay ghế hoặc xoay người cho tới khi bóng dưới mũi bạn chỉ chếch về một góc khoé miệng thay vì chỉ thẳng xuống hoặc chỉ thẳng sang một bên. Vậy là đủ gần 45° cho một cảnh talking head.</p></div>

<h3>Ngược sáng ngoài ý muốn — lỗi phổ biến nhất của người mới</h3>
${slide('cr-08', 7, 'Ngược sáng sai vs cửa sổ đúng')}
<p>Ngồi QUAY LƯNG về cửa sổ — một bản năng hoàn toàn tự nhiên, vì lúc này cửa sổ nằm sau màn hình và ngoài tầm mắt bạn — chế độ đo sáng tự động của máy quay sẽ đọc theo cửa sổ đang sáng chói và làm tối mọi thứ khác để bù lại. Mặt bạn biến thành một cái bóng đen. Đây KHÔNG phải máy quay bị lỗi; nó đang tính trung bình đúng những gì nó thấy, và cái nó thấy chủ yếu là một hình chữ nhật sáng chói đứng sau một người tối thui.</p>
<p>Cách sửa không tốn một đồng nào: xoay bàn, hoặc xoay ghế, 180° để cửa sổ chiếu VÀO BẠN thay vì sau lưng bạn. Nếu bố cục phòng không cho phép, ít nhất hãy thêm một nguồn sáng phía trước mặt — thậm chí đèn pin điện thoại hay một cây đèn bàn — để bù lại phần sáng mà cửa sổ đang "ăn cắp" mất.</p>

<h3>Giờ vàng và giờ xanh</h3>
<p>Ngoài trời, khoảng một giờ sau bình minh và trước hoàng hôn thường được gọi là <strong>giờ vàng (golden hour)</strong> — mặt trời nằm thấp, ánh sáng của nó đi qua nhiều lớp khí quyển hơn nên tới nơi ấm hơn và mềm hơn, bóng đổ dài và đẹp hơn hẳn ánh nắng gắt giữa trưa. <strong>Giờ xanh (blue hour)</strong> là khoảng thời gian ngắn hơn ngay trước bình minh hoặc ngay sau hoàng hôn, khi mặt trời đã khuất dưới đường chân trời nhưng bầu trời vẫn còn ngả một màu xanh lam sâu, đều — được ưa chuộng cho cảnh thành phố/đường chân trời. Cả hai đều đổi theo vĩ độ và mùa, nên coi đó là "khoảng thời gian này trong ngày", không phải một mốc giờ cố định — một app thời tiết hoặc vị trí mặt trời sẽ cho bạn giờ chính xác theo đúng địa điểm, đúng ngày hôm đó.</p>

<h3>Nắng trưa ở Việt Nam</h3>
${slide('cr-08', 8, 'Nắng trưa Việt Nam — vấn đề & cách sửa')}
<p>Khoảng 11h đến 14h, mặt trời gần như đứng thẳng trên đỉnh đầu ở Việt Nam. Điều đó tạo ra ánh sáng gắt nhất, xấu nhất trong ngày: bóng đổ ngắn, gắt, khoét thẳng xuống dưới mắt, mũi, cằm, tương phản cao, và chủ thể không ngừng nheo mắt. Đây chính xác là "ánh sáng cứng" ở Bài 8.1 — một nguồn nhỏ, cực mạnh, ở mức cực đoan nhất.</p>
<p>Ba cách sửa, đều miễn phí hoặc gần như miễn phí: tìm BÓNG RÂM (mái hiên cửa hàng, dưới tán cây, ngay trong cửa ra vào hoặc cửa sổ lớn — ánh sáng dịu lại ngay khi nắng trực tiếp không chạm được vào chủ thể); cầm một TẤM TẢN SÁNG (vải mờ) giữa nắng và chủ thể để biến ánh sáng cứng thành mềm, đúng mẹo "che bớt nguồn hoặc đổi khoảng cách" từ Bài 8.1; hoặc dùng một tấm HẮT SÁNG trắng (bìa mút, bìa cứng, thậm chí một tờ giấy lớn) để hắt sáng ngược trở lại vào vùng bóng gắt dưới mắt, làm dịu tương phản.</p>
<div class="callout ok"><p><strong>Một bầu trời âm u là một tấm tản sáng miễn phí, to bằng cả bầu trời.</strong> Mây tán xạ ánh nắng gắt thành một nguồn sáng khổng lồ, mềm mại phủ khắp đường chân trời — nhiều người mới nghĩ trời nhiều mây là xui xẻo khi đi quay. Thường thì ngược lại: đó là một trong những điều kiện dễ quay chân dung đẹp nhất.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "ánh sáng cửa sổ lúc nào cũng mềm" không hẳn đúng.</strong> Một cửa sổ nhỏ hướng thẳng vào nắng chiều thấp và gắt (thường gặp ở bức tường hướng Tây của phòng trọ) vẫn có thể hắt thẳng ánh sáng cứng, tương phản cao, bóng đổ sắc y như nắng ngoài trời trực tiếp. Nếu gặp trường hợp này, treo một tấm rèm mỏng hoặc vải mờ lên cửa sổ — vậy là bạn vừa tự làm một tấm tản sáng, biến ánh sáng cứng thành mềm đúng như Bài 8.1 đã nói.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 8.3 lấy đúng bản năng 45° này và biến nó thành một hệ thống ba đèn lặp lại được — key, fill, back — cùng bốn kiểu sáng mặt có tên riêng mà bạn dựng được chỉ với một đèn.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Ngồi quay lưng về cửa sổ và quay 10 giây bạn đang nói chuyện. Rồi xoay 180° và quay 10 giây với mặt hướng về cửa sổ ở khoảng 45°. So sánh cả hai đoạn trên một màn hình thật.</li>
<li>Nếu có thể, quay cùng một vị trí vào giữa trưa và lại vào giờ vàng (hoặc thời điểm gần giống nhất bạn sắp xếp được) rồi so độ dài và độ gắt của bóng đổ.</li>
<li>Giữa trưa, cầm một tờ giấy trắng dưới mặt bạn, ngoài khung hình, trong khi ai đó (hoặc chân máy) quay bạn — quan sát bóng dưới mắt dịu đi ngay trước mắt.</li>
</ol><p><strong>Đạt khi:</strong> bạn bước vào bất kỳ phòng nào trong nhà, tìm ra cửa sổ, và đoán đúng — TRƯỚC KHI quay bất cứ gì — ngồi quay mặt về nó sẽ đẹp hay sẽ phẳng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Ánh sáng cửa sổ</span><span class="v">Window light — tự nhiên đã mềm, miễn phí, có mỗi ngày; hướng vẫn quan trọng.</span></div>
<div class="kv"><span class="k">Ngược sáng / silhouette</span><span class="v">Backlit — nguồn sáng sau lưng chủ thể mà không có gì bù phía trước biến họ thành một hình bóng đen.</span></div>
<div class="kv"><span class="k">Giờ vàng</span><span class="v">Golden hour — khoảng một giờ sau bình minh / trước hoàng hôn; ánh sáng ấm, mềm, chiếu thấp.</span></div>
<div class="kv"><span class="k">Giờ xanh</span><span class="v">Blue hour — khoảng thời gian ngắn quanh bình minh/hoàng hôn khi trời ngả xanh lam sâu.</span></div>
<div class="kv"><span class="k">Tấm tản sáng</span><span class="v">Diffuser — vật liệu trong mờ đặt giữa nguồn cứng và chủ thể để làm mềm ánh sáng.</span></div>
<div class="kv"><span class="k">Tấm hắt sáng</span><span class="v">Bounce — bề mặt phản chiếu (bìa trắng, giấy) hắt lại ánh sáng đang có vào vùng tối.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Quay mặt về cửa sổ ở khoảng 45° cho ánh sáng đẹp, mềm, miễn phí — thẳng góc thì phẳng, nghiêng hẳn sang bên thì mất nửa mặt.</li>
<li>Ngồi quay lưng về cửa sổ biến bạn thành cái bóng — máy quay đo sáng theo cửa sổ đang chói, không theo bạn.</li>
<li>Nắng trưa ở Việt Nam gắt; sửa bằng bóng râm, tấm tản, hoặc tấm hắt — trời âm u là một tấm tản sáng miễn phí to bằng cả đường chân trời.</li>
<li>Không phải ánh sáng cửa sổ nào cũng tự động mềm — cửa sổ nhỏ hứng thẳng nắng gắt vẫn cần một tấm rèm để tản sáng.</li>
</ul>
</div>
`,
    },

    /* ─────────────────── 8.3 ba điểm & kiểu sáng mặt ─────────────────── */
    {
      title: '8.3 — Three-point lighting and face patterns|||8.3 — Ba điểm và các kiểu sáng mặt',
      slug: 'cr-08-3-ba-diem-kieu-sang-mat',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Key/fill/back, tỉ lệ key:fill theo stop, ánh sáng có lý do (motivated) và đèn trang trí (practical), cách dựng khi chỉ có một đèn, và bốn kiểu sáng mặt Rembrandt/loop/butterfly/split.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Three lights, three jobs — and four named shadows that tell you exactly where they are</h2>
<p class="lead">Everything in Lesson 8.1 (hard/soft, direction, distance) and 8.2 (a single window) comes together here into the standard system professionals reach for by default: three lights, each with one specific job. Then you will learn to read the SHADOW a single light leaves on a face and name exactly where that light was standing — a skill that works on any video you watch, not just your own.</p>

<h3>Key, fill, back — three lights, three jobs</h3>
${slide('cr-08', 9, 'Ba điểm: Key · Fill · Back')}
<p>The <strong>key light</strong> is the main light — the strongest one, positioned to one side (often around that same 45° from Lesson 8.2), and it decides where the main shadows fall. The <strong>fill light</strong> softens those shadows without creating strong shadows of its own — it is usually weaker than the key and sits roughly on the opposite side, or it might not be a light at all but a bounce card doing the same job for free. The <strong>back light</strong> (also called a rim light) sits behind or above the subject, out of the camera's direct view, and separates them from the background with a thin edge of light around hair and shoulders — without it, a subject in a dim room can visually "stick" to the background behind them.</p>
<p>Missing a light is not a crisis: with only two, keep key and back and let a wall or ceiling bounce enough ambient light to act as fill; with only one, Lesson 8.2's bounce-card trick returns — more on that below.</p>

<h3>Lighting ratio — key to fill, measured in stops</h3>
${slide('cr-08', 10, 'Tỉ lệ key:fill theo stop')}
<p>How dramatic a face looks is mostly decided by how much darker the fill side is than the key side — the <strong>lighting ratio</strong>. This lesson uses the simple, beginner-friendly convention: compare the two lights' OUTPUT directly (the two brightness dial settings on your LED panels), which matches gear with a percentage dial rather than a professional light meter.</p>
<table><tr><th>Key:fill ratio</th><th>Difference</th><th>Feel</th><th>Common use</th></tr>
<tr><td>1:1</td><td>0 stops</td><td>Flat, low drama</td><td>News, tutorials where every detail must stay visible</td></tr>
<tr><td>2:1</td><td>1 stop</td><td>Gentle shape, still natural</td><td>Vlogs, how-to videos, talking heads</td></tr>
<tr><td>4:1</td><td>2 stops</td><td>Clear depth, starting to feel dramatic</td><td>Storytelling, serious interviews</td></tr>
<tr><td>8:1</td><td>3 stops</td><td>Strongly dramatic, near-black shadows</td><td>Film-style, moody scenes</td></tr>
</table>
<div class="callout warn"><p>This is a SIMPLIFIED convention — comparing the two lights' brightness settings directly. Professional cinematographers use a light meter and a different formula that compares (key+fill) against fill alone, which gives different numbers for the same physical setup. That level of precision is outside what this lesson covers; the simple version above is exactly what you need for LED panels with a percentage dial.</p></div>

<h3>Motivated light and practicals</h3>
<p>A light looks "right" to an audience when it appears to come from somewhere believable in the scene — a lamp, a window, a screen — even if the actual fixture creating it is hidden. That is called <strong>motivated lighting</strong>: the light has a reason to exist that the viewer's eye accepts without question. A <strong>practical</strong> is a real light source visible IN the frame — a desk lamp, an LED strip, a neon sign — that doubles as both a prop and an actual light source. A practical placed behind a subject is a favourite trick for creators: it adds a small pool of colour and depth to an otherwise flat background, and it explains itself instantly to the viewer.</p>

<h3>Only one light? Add a bounce</h3>
${slide('cr-08', 11, 'Chỉ có một đèn? Thêm tấm hắt')}
<p>A single key light plus a bounce card on the shadow side recreates most of what a second light would do, for free. The bounce does not produce light — it redirects light the key is already "wasting" into empty space, back toward the shadow side of the face, gently lifting it without creating a second set of shadows. White foam board or plain white cardboard is enough; you do not need a purpose-built reflector to start.</p>

<h3>Four face-lighting patterns — one key light, four positions</h3>
${slide('cr-08', 12, 'Bốn kiểu sáng mặt')}
<p>Move a single key light around a face and the SHAPE of the shadow it leaves has a name — learning these four lets you both set up lighting on purpose and read any video's lighting by eye:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Split</span><span class="v">Light at roughly 90° to the side, at face height — splits the face exactly in half, one side lit, one side dark. Dramatic, often associated with tension or conflict.</span></div>
<div class="kv"><span class="k">Loop</span><span class="v">Light around 30–45° off-axis and slightly above eye level — casts a small shadow of the nose that "loops" down the cheek without touching the cheek's own shadow. A common, flattering default.</span></div>
<div class="kv"><span class="k">Rembrandt</span><span class="v">Light positioned so the nose shadow MERGES with the cheek shadow, leaving one small, isolated triangle of light on the shadowed cheek, just under the eye. Named after the painter — moody, classic.</span></div>
<div class="kv"><span class="k">Butterfly</span><span class="v">Light directly in front of and above the face, on the camera axis — casts a small, symmetrical shadow shaped like a butterfly directly under the nose. Flattering for cheekbones, common in beauty/fashion work.</span></div>
</div>
<p>The difference between loop and Rembrandt is subtle and comes down to one detail: does the nose's shadow stay small and separate (loop), or does it connect to the cheek's shadow and isolate a little triangle of light (Rembrandt)? Once you can spot that on a real face, you can read almost any interview or film shot and describe how it was lit.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — you added all three lights (key, fill, back) and the shot still looks flat, like a ceiling bulb.</strong> The most common cause is a fill set almost as bright as the key — a ratio close to 1:1 kills the shape you just spent three lights building. Turn the fill DOWN (or move the bounce card farther away, using the inverse-square law from Lesson 8.1) until you can actually see a ratio, roughly 2:1 or higher, between the two sides of the face.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 8.4 turns key, fill/bounce and a practical into one concrete desk setup for recording at home — including the one light source in your room you should never trust as a key: your monitor.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Build a two-light setup (or one light plus a bounce) with a 2:1 ratio, then push it to 4:1 by turning the fill/bounce further down — compare the two on a real screen.</li>
<li>Standing in front of a mirror or filming yourself, move a single lamp or phone flashlight around your face until you can produce split, loop and butterfly lighting — Rembrandt is the hardest to nail on the first try, so attempt it last.</li>
<li>Watch 2 minutes of any interview-style video and pause on three different frames — name the lighting pattern on the subject's face in each one.</li>
</ol><p><strong>Done when:</strong> you can look at a still frame from any video and correctly name which of the four face-lighting patterns it is, without this lesson open.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Key light</span><span class="v">Đèn chính — the strongest light, decides the main shadow direction.</span></div>
<div class="kv"><span class="k">Fill light</span><span class="v">Đèn phụ — softens the key's shadows without casting strong shadows of its own.</span></div>
<div class="kv"><span class="k">Back / rim light</span><span class="v">Đèn viền — behind/above the subject, separates them from the background.</span></div>
<div class="kv"><span class="k">Lighting ratio</span><span class="v">Tỉ lệ ánh sáng — how much darker the fill side is than the key side, in stops.</span></div>
<div class="kv"><span class="k">Motivated light</span><span class="v">Ánh sáng có lý do trong cảnh (a lamp, a window) even if the real fixture is hidden.</span></div>
<div class="kv"><span class="k">Practical</span><span class="v">Đèn trang trí — a real light source visible in frame, doubling as a prop.</span></div>
<div class="kv"><span class="k">Split / Loop / Rembrandt / Butterfly</span><span class="v">Four named shadow patterns produced by one key light at four different positions.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Key decides the shadow, fill softens it, back separates the subject from the background — missing lights can be substituted with a bounce or ambient wall/ceiling light.</li>
<li>Lighting ratio (key:fill, in stops) controls drama — 2:1 is a natural default, 8:1 is film-dramatic.</li>
<li>Motivated light and practicals make artificial lighting look intentional instead of unexplained.</li>
<li>One key light, four positions: split (half/half), loop (small isolated nose shadow), Rembrandt (triangle of light on the shadow cheek), butterfly (symmetrical shadow under the nose).</li>
</ul>
<div class="link-card"><a href="https://digital-photography-school.com/6-portrait-lighting-patterns-every-photographer-should-know/" target="_blank" rel="noopener">Digital Photography School — 6 portrait lighting patterns every photographer should know</a></div>
<div class="link-card"><a href="https://www.studiobinder.com/blog/lighting-ratios/" target="_blank" rel="noopener">StudioBinder — lighting ratios explained</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Ba đèn, ba nhiệm vụ — và bốn kiểu bóng có tên riêng, nói đúng đèn đang đứng ở đâu</h2>
<p class="lead">Mọi thứ ở Bài 8.1 (cứng/mềm, hướng, khoảng cách) và 8.2 (một cửa sổ) hội tụ lại ở đây thành hệ thống chuẩn mà dân chuyên nghiệp mặc định dùng: ba đèn, mỗi đèn một nhiệm vụ riêng. Sau đó bạn sẽ học cách ĐỌC cái bóng mà một đèn duy nhất để lại trên khuôn mặt và gọi tên chính xác đèn đó đang đứng ở đâu — kỹ năng dùng được trên bất kỳ video nào bạn xem, không chỉ video của bạn.</p>

<h3>Key, fill, back — ba đèn, ba nhiệm vụ</h3>
${slide('cr-08', 9, 'Ba điểm: Key · Fill · Back')}
<p><strong>Đèn key</strong> là đèn chính — mạnh nhất, đặt lệch một bên (thường quanh đúng góc 45° ở Bài 8.2), và nó quyết định bóng đổ chính rơi ở đâu. <strong>Đèn fill</strong> làm dịu những bóng đó mà không tạo ra bóng đổ mạnh của riêng nó — thường yếu hơn key và đứng gần như đối diện, hoặc thậm chí không phải một cây đèn nào cả mà là một tấm hắt làm đúng việc đó miễn phí. <strong>Đèn back</strong> (còn gọi đèn viền) đứng sau/trên chủ thể, ngoài tầm nhìn trực tiếp của máy quay, tách họ khỏi nền bằng một viền sáng mỏng quanh tóc và vai — thiếu nó, một chủ thể trong phòng thiếu sáng dễ bị "dính" hẳn vào nền phía sau.</p>
<p>Thiếu một đèn không phải thảm hoạ: chỉ có hai đèn thì giữ key và back, để tường hoặc trần hắt đủ ánh sáng môi trường làm fill; chỉ có một đèn thì quay lại mẹo tấm hắt của Bài 8.2 — nói kỹ hơn ngay dưới đây.</p>

<h3>Tỉ lệ ánh sáng — key so với fill, đo bằng stop</h3>
${slide('cr-08', 10, 'Tỉ lệ key:fill theo stop')}
<p>Một khuôn mặt trông kịch tính tới đâu phần lớn do bên fill tối hơn bên key bao nhiêu — gọi là <strong>tỉ lệ ánh sáng (lighting ratio)</strong>. Bài này dùng quy ước đơn giản, dễ cho người mới: so trực tiếp ĐỘ SÁNG hai đèn (hai mức % bạn vặn trên đèn LED), khớp với đồ có núm chỉnh phần trăm hơn là một máy đo sáng chuyên nghiệp.</p>
<table><tr><th>Tỉ lệ key:fill</th><th>Chênh lệch</th><th>Cảm giác</th><th>Hay dùng cho</th></tr>
<tr><td>1:1</td><td>0 stop</td><td>Phẳng, ít kịch tính</td><td>Tin tức, hướng dẫn cần thấy rõ mọi chi tiết</td></tr>
<tr><td>2:1</td><td>1 stop</td><td>Có khối nhẹ, vẫn tự nhiên</td><td>Vlog, video hướng dẫn, talking head</td></tr>
<tr><td>4:1</td><td>2 stop</td><td>Chiều sâu rõ, bắt đầu kịch tính</td><td>Kể chuyện, phỏng vấn nghiêm túc</td></tr>
<tr><td>8:1</td><td>3 stop</td><td>Kịch tính mạnh, bóng gần như đen</td><td>Phong cách điện ảnh, cảnh tâm trạng u tối</td></tr>
</table>
<div class="callout warn"><p>Đây là quy ước ĐƠN GIẢN HOÁ — so trực tiếp mức độ sáng bạn vặn trên hai đèn. Dân quay phim chuyên nghiệp dùng máy đo sáng và một công thức khác, so (key+fill) với riêng fill, ra con số khác cho cùng một setup vật lý. Mức độ chính xác đó nằm ngoài phạm vi bài này; phiên bản đơn giản ở trên là đúng thứ bạn cần cho đèn LED có núm chỉnh phần trăm.</p></div>

<h3>Ánh sáng có lý do (motivated) và đèn trang trí (practical)</h3>
<p>Một nguồn sáng trông "hợp lý" với khán giả khi nó có vẻ đến từ một chỗ đáng tin trong cảnh — một cây đèn, một cửa sổ, một màn hình — dù đèn thật sự tạo ra nó có thể đang giấu ngoài khung hình. Đó gọi là <strong>ánh sáng có lý do (motivated lighting)</strong>: ánh sáng có một lý do tồn tại mà mắt người xem chấp nhận không cần hỏi thêm. Một <strong>đèn trang trí (practical)</strong> là một nguồn sáng THẬT xuất hiện NGAY TRONG khung hình — đèn bàn, dải LED, biển neon — vừa là đạo cụ vừa là nguồn sáng thật. Một đèn trang trí đặt sau lưng chủ thể là mẹo ưa thích của nhiều creator: nó thêm một vệt màu và chiều sâu cho một nền vốn phẳng lì, và tự giải thích được ngay với người xem.</p>

<h3>Chỉ có một đèn? Thêm tấm hắt</h3>
${slide('cr-08', 11, 'Chỉ có một đèn? Thêm tấm hắt')}
<p>Một đèn key duy nhất cộng một tấm hắt ở phía bóng tối tái tạo lại gần hết những gì đèn thứ hai sẽ làm, miễn phí. Tấm hắt không tự phát sáng — nó chuyển hướng ánh sáng mà đèn key đang "lãng phí" vào khoảng không, hắt trở lại phía tối của khuôn mặt, nâng nhẹ độ sáng mà không tạo thêm một lớp bóng đổ mới. Bìa mút trắng hoặc bìa cứng trắng thường là đủ; bạn không cần một tấm phản quang chuyên dụng để bắt đầu.</p>

<h3>Bốn kiểu sáng mặt — một đèn key, bốn vị trí</h3>
${slide('cr-08', 12, 'Bốn kiểu sáng mặt')}
<p>Di chuyển một đèn key duy nhất quanh khuôn mặt, và HÌNH DẠNG của cái bóng nó để lại có tên riêng — học bốn kiểu này giúp bạn vừa dựng đèn có chủ đích, vừa đọc được cách một video bất kỳ được chiếu sáng chỉ bằng mắt:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Split</span><span class="v">Đèn ở khoảng 90° ngang mặt — chia đúng nửa mặt sáng, nửa tối. Kịch tính, hay gắn với căng thẳng/xung đột.</span></div>
<div class="kv"><span class="k">Loop</span><span class="v">Đèn ở khoảng 30–45° lệch trục, hơi cao hơn tầm mắt — đổ bóng mũi nhỏ "vòng" xuống má mà KHÔNG chạm bóng của gò má. Một mặc định phổ biến, dễ nhìn.</span></div>
<div class="kv"><span class="k">Rembrandt</span><span class="v">Đèn đặt sao cho bóng mũi HOÀ VÀO bóng gò má, để lại một tam giác sáng nhỏ, tách biệt trên gò má bên tối, ngay dưới mắt. Đặt theo tên hoạ sĩ — trầm, cổ điển.</span></div>
<div class="kv"><span class="k">Butterfly</span><span class="v">Đèn chính diện và ở cao, ngay trên trục máy quay — đổ một bóng nhỏ, đối xứng hình "cánh bướm" ngay dưới mũi. Tôn gò má, hay dùng trong ảnh làm đẹp/thời trang.</span></div>
</div>
<p>Khác biệt giữa loop và Rembrandt khá tinh tế, nằm ở đúng một chi tiết: bóng mũi có ở nhỏ và tách rời (loop), hay nó nối liền với bóng gò má và cô lập một tam giác sáng nhỏ (Rembrandt)? Một khi nhận ra được điều đó trên một khuôn mặt thật, bạn đọc được gần như mọi cảnh phỏng vấn hay cảnh phim và mô tả được nó được chiếu sáng ra sao.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — bạn đã thêm đủ cả ba đèn (key, fill, back) mà cảnh vẫn trông phẳng như đèn trần.</strong> Nguyên nhân phổ biến nhất là fill đặt gần bằng độ sáng của key — tỉ lệ gần 1:1 giết chết đúng cái khối bạn vừa tốn công dựng bằng ba đèn. Vặn fill XUỐNG (hoặc đẩy tấm hắt ra xa hơn, dùng đúng luật bình phương nghịch đảo ở Bài 8.1) tới khi thật sự thấy được một tỉ lệ, khoảng 2:1 trở lên, giữa hai bên khuôn mặt.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 8.4 gộp key, fill/tấm hắt và một đèn trang trí thành một setup bàn làm việc cụ thể để quay tại nhà — kể cả nguồn sáng duy nhất trong phòng bạn KHÔNG BAO GIỜ nên tin làm key: màn hình máy tính.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng một setup hai đèn (hoặc một đèn + một tấm hắt) với tỉ lệ 2:1, rồi đẩy lên 4:1 bằng cách vặn fill/tấm hắt xuống thêm — so sánh cả hai trên một màn hình thật.</li>
<li>Đứng trước gương hoặc tự quay chính mình, di chuyển một đèn hoặc đèn pin điện thoại quanh mặt cho tới khi tạo được split, loop và butterfly — Rembrandt khó "trúng" nhất ngay lần đầu nên để thử sau cùng.</li>
<li>Xem 2 phút một video kiểu phỏng vấn bất kỳ và dừng lại ở ba khung hình khác nhau — gọi tên kiểu sáng mặt trên khuôn mặt chủ thể ở từng khung.</li>
</ol><p><strong>Đạt khi:</strong> bạn nhìn một khung hình tĩnh từ video bất kỳ và gọi đúng tên một trong bốn kiểu sáng mặt, không cần mở lại bài này.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Đèn key</span><span class="v">Key light — đèn mạnh nhất, quyết định hướng bóng đổ chính.</span></div>
<div class="kv"><span class="k">Đèn fill</span><span class="v">Fill light — làm dịu bóng của key mà không tạo bóng đổ mạnh riêng.</span></div>
<div class="kv"><span class="k">Đèn back / viền</span><span class="v">Back/rim light — sau/trên chủ thể, tách họ khỏi nền.</span></div>
<div class="kv"><span class="k">Tỉ lệ ánh sáng</span><span class="v">Lighting ratio — bên fill tối hơn bên key bao nhiêu, đo bằng stop.</span></div>
<div class="kv"><span class="k">Ánh sáng có lý do</span><span class="v">Motivated light — trông như đến từ một nguồn hợp lý trong cảnh (đèn bàn, cửa sổ) dù đèn thật đang giấu đi.</span></div>
<div class="kv"><span class="k">Đèn trang trí</span><span class="v">Practical — nguồn sáng thật xuất hiện trong khung hình, vừa là đạo cụ vừa là đèn.</span></div>
<div class="kv"><span class="k">Split / Loop / Rembrandt / Butterfly</span><span class="v">Bốn kiểu bóng có tên riêng, tạo bởi một đèn key ở bốn vị trí khác nhau.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Key quyết định bóng đổ, fill làm dịu nó, back tách chủ thể khỏi nền — thiếu đèn nào có thể thay bằng tấm hắt hoặc ánh sáng môi trường từ tường/trần.</li>
<li>Tỉ lệ ánh sáng (key:fill, theo stop) điều khiển độ kịch tính — 2:1 là mặc định tự nhiên, 8:1 là kịch tính kiểu điện ảnh.</li>
<li>Ánh sáng có lý do và đèn trang trí làm ánh sáng nhân tạo trông có chủ đích thay vì vô cớ.</li>
<li>Một đèn key, bốn vị trí: split (nửa/nửa), loop (bóng mũi nhỏ tách rời), Rembrandt (tam giác sáng trên gò má tối), butterfly (bóng đối xứng dưới mũi).</li>
</ul>
<div class="link-card"><a href="https://digital-photography-school.com/6-portrait-lighting-patterns-every-photographer-should-know/" target="_blank" rel="noopener">Digital Photography School — 6 kiểu sáng chân dung mọi người quay/chụp nên biết</a></div>
<div class="link-card"><a href="https://www.studiobinder.com/blog/lighting-ratios/" target="_blank" rel="noopener">StudioBinder — giải thích tỉ lệ ánh sáng (lighting ratios)</a></div>
</div>
`,
    },

    /* ─────────────────── 8.4 góc quay tại nhà ─────────────────── */
    {
      title: '8.4 — Building a budget setup at home|||8.4 — Dựng góc quay tại nhà với ngân sách thấp',
      slug: 'cr-08-4-goc-quay-tai-nha',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Setup bàn làm việc cho phòng trọ/nhà ở Việt Nam: key softbox 45°, tắt đèn trần, tấm hắt, đèn RGB phía sau, vì sao màn hình máy tính không phải đèn key, và danh sách mua theo 3 mức ngân sách.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Your desk is your studio — you just have not arranged it like one yet</h2>
<p class="lead">You already have almost everything Lessons 8.1–8.3 described: a window, a lamp, a wall. This lesson turns that into one repeatable desk setup for recording at home — the exact place you will actually film your coding tutorials and talking-head videos — and gives you a way to grow the setup as your budget allows, without buying anything you do not need yet.</p>

<h3>A budget desk setup</h3>
${slide('cr-08', 13, 'Setup bàn làm việc tại nhà')}
<p>The core setup from this chapter, applied to a real desk: a KEY light (softbox or a lamp with a diffuser taped over it) at roughly 45° from your face, at or slightly above eye height; the ceiling light turned OFF, because it lights you from directly overhead and fights with the key, carving harsh shadows under your eyes and nose; a white bounce card or wall on the fill side if you do not yet own a second light; and, optionally, an RGB or practical light behind you for a small pool of colour and separation from the background — the same "practical" idea from Lesson 8.3.</p>
<div class="callout warn"><p><strong>Your monitor is not a key light.</strong> Its brightness and colour change constantly with whatever is on screen — a light IDE theme flashes bright, a dark theme drops the light back down — and it skews strongly toward blue. Let it be a secondary, background light at most; never your main source. This matters directly for programming tutorials, where the monitor is right in front of your face for the entire recording.</p></div>
<div class="callout ok"><p><strong>Why your gear still matters a little:</strong> Pocket 3&#8217;s 1-inch sensor (larger than an ordinary phone sensor) gathers more light per pixel, so it handles a dim room with less visible noise on the nights you do need to push ISO. That headroom does not fix bad light direction or a source that is too small and hard — it only buys a little more margin once the setup above is already right.</p></div>

<h3>Setup mistakes vs fixes</h3>
${slide('cr-08', 14, 'Setup tại nhà — sai vs đúng')}
<p>A rented room in Vietnam usually comes with one ceiling bulb, thin walls, and not much floor space — which rules out large studio light stands but does not rule out good light. Clamp-on lights, a lamp you already own with a diffuser taped over it, and a bounce card propped against a book all work in a small room. The pattern to avoid: mixing an untouched ceiling bulb, a too-close pale wall, and an unlocked white balance all at once — any ONE of those is manageable, but stacked together they fight each other and the fix becomes hard to diagnose.</p>

<h3>Same desk, day versus night</h3>
<p>A desk setup is not "arrange once, forget forever." A window that acts as a perfect key light at 10am can turn into a distracting, unpredictable backlight by 4pm as the sun moves, and it contributes nothing at all after dark. Two practical habits fix this: if you record several episodes of the same series across different days, try to record around the same time of day so the light stays consistent from one episode to the next — mismatched natural light between two halves of one video is one of the more noticeable, hardest-to-fix continuity problems in editing. And once natural light is gone for the day, your artificial key needs to fully take over the job the window was doing — same rough 45° angle, similar brightness — instead of leaving the room lit only by whatever ceiling bulb you had turned off for daytime shooting.</p>

<h3>Buying gear by budget tier — type of equipment, not a shopping list</h3>
<p>Prices for lighting gear move too often and vary too much between stores to print a number here with any confidence — none were verified during this lesson's research, so none are printed. What is stable is the TYPE of equipment and the criteria to judge it by, at three budget levels:</p>
<table><tr><th>Tier</th><th>What you already have covers it</th><th>What to add</th><th>Buying criteria</th></tr>
<tr><td>Free / near-free</td><td>Window + a homemade bounce (white foam board, cardboard, even a large sheet of paper) + a curtain as a diffuser</td><td>Nothing — arrange what you already own using Lessons 8.1–8.3</td><td>N/A</td></tr>
<tr><td>First small light</td><td>One small clip-on or handheld LED video light</td><td>A stand or clamp if the room allows one</td><td>Adjustable brightness (%), adjustable colour temperature (bi-colour, roughly 3200–5600K at minimum), published CRI — ≥90, ideally ≥95</td></tr>
<tr><td>A proper two-light kit</td><td>The small light above becomes fill or back</td><td>A second light as key, plus a proper stand for a stable 45° angle instead of a temporary clamp</td><td>Both TLCI and CRI published if possible, app or physical dial control, diffusion built in or attachable</td></tr>
</table>
<div class="pitfall co-tieu-de"><p><strong>Trap — buying a light before using the free light you already have.</strong> The single most common beginner mistake is spending money on gear to solve a problem that turning your desk 180° toward the window (Lesson 8.2) or turning off a fighting ceiling bulb (this lesson) would have solved for free. Exhaust the free fixes first — window angle, ceiling light off, a homemade bounce — before adding anything to a shopping cart.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Chapter 9 covers sound while filming — and the same desk setup you just built for light usually needs the same care for the room's echo and background noise.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Rearrange your actual recording desk using this lesson's checklist: ceiling light off, key at 45°, a bounce or second light on the fill side.</li>
<li>Record 15 seconds before and 15 seconds after the rearrangement, same framing, same clothes — compare them side by side.</li>
<li>Write down, for your own room, which budget tier you are realistically at today, and what the ONE next thing you would add is — not a wish list, just the next single item.</li>
</ol><p><strong>Done when:</strong> your desk setup is something you can rebuild from memory in under two minutes before every recording session.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Desk setup</span><span class="v">Setup bàn làm việc — a repeatable arrangement of key, fill/bounce and background light for recording at the same spot.</span></div>
<div class="kv"><span class="k">Clamp-on light</span><span class="v">A small light with a clip instead of a floor stand — useful in a small rented room.</span></div>
<div class="kv"><span class="k">Bi-colour</span><span class="v">A light that can shift its colour temperature (commonly ~3200–5600K) instead of a fixed single value.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A key at 45°, ceiling light off, a bounce or second light for fill, and an optional practical behind you covers most talking-head recording at home.</li>
<li>A monitor is a secondary light at best — its brightness and colour shift constantly and skew blue.</li>
<li>Buy by TYPE and criteria (adjustable brightness, adjustable colour temperature, published CRI/TLCI) rather than by brand name — and use every free fix (window angle, ceiling light off, a homemade bounce) before spending anything.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Bàn làm việc của bạn chính là trường quay — chỉ là bạn chưa sắp xếp nó như vậy</h2>
<p class="lead">Bạn đã có gần như mọi thứ Bài 8.1–8.3 vừa nói: một cửa sổ, một cây đèn, một bức tường. Bài này gộp tất cả thành một setup bàn làm việc lặp lại được để quay tại nhà — đúng chỗ bạn sẽ thật sự quay video dạy lập trình và talking head — và cho bạn cách để setup đó LỚN DẦN theo ngân sách, không mua thứ gì mình chưa cần tới.</p>

<h3>Setup bàn làm việc ngân sách thấp</h3>
${slide('cr-08', 13, 'Setup bàn làm việc tại nhà')}
<p>Lõi của cả chương này, áp vào một bàn làm việc thật: một đèn KEY (softbox hoặc một cây đèn bàn dán thêm một lớp vải mờ) ở khoảng 45° so với mặt bạn, ngang hoặc hơi cao hơn tầm mắt; TẮT đèn trần, vì nó chiếu thẳng từ trên đầu xuống và đá nhau với key, khoét ra những bóng gắt dưới mắt và mũi; một tấm hắt trắng hoặc một bức tường sáng ở phía fill nếu bạn chưa có đèn thứ hai; và, nếu muốn, một đèn RGB hoặc đèn trang trí phía sau lưng để thêm một vệt màu và tách bạn khỏi nền — đúng ý tưởng "đèn trang trí (practical)" ở Bài 8.3.</p>
<div class="callout warn"><p><strong>Màn hình máy tính KHÔNG phải đèn key.</strong> Độ sáng và màu của nó đổi liên tục theo bất cứ thứ gì đang hiển thị — một theme IDE sáng loé lên, một theme tối kéo sáng xuống lại — và nó luôn ngả mạnh về xanh dương. Hãy để nó làm nguồn sáng phụ, ở mức nhiều nhất là hậu cảnh; không bao giờ để nó làm nguồn chính. Điều này ảnh hưởng trực tiếp tới video dạy lập trình, nơi màn hình nằm ngay trước mặt bạn suốt cả buổi quay.</p></div>
<div class="callout ok"><p><strong>Vì sao đồ nghề vẫn có chút ảnh hưởng:</strong> cảm biến 1 inch của Pocket 3 (lớn hơn cảm biến điện thoại thường) thu được nhiều sáng hơn trên mỗi điểm ảnh, nên nó xử lý một phòng thiếu sáng với ít nhiễu nhìn thấy hơn vào những tối bạn buộc phải đẩy ISO lên. Dư địa đó không sửa được hướng sáng sai hay một nguồn quá nhỏ/quá cứng — nó chỉ mua thêm một chút biên độ một khi setup ở trên đã đúng rồi.</p></div>

<h3>Setup sai vs sửa đúng</h3>
${slide('cr-08', 14, 'Setup tại nhà — sai vs đúng')}
<p>Một phòng trọ ở Việt Nam thường chỉ có một bóng đèn trần, tường mỏng, và không nhiều diện tích sàn — điều đó loại bỏ những chân đèn studio cỡ lớn nhưng không loại bỏ ánh sáng đẹp. Đèn kẹp nhỏ, một cây đèn bạn đã có sẵn dán thêm vải mờ, và một tấm hắt dựa vào chồng sách đều chạy tốt trong một phòng nhỏ. Kiểu cần tránh: trộn cùng lúc một bóng đèn trần chưa tắt, một bức tường trắng quá gần phía sau, và cân bằng trắng chưa khoá — từng cái MỘT MÌNH thì vẫn quản được, nhưng chồng lên nhau thì chúng đá nhau và rất khó chẩn đoán ra chỗ sửa.</p>

<h3>Cùng một bàn, ban ngày khác ban đêm</h3>
<p>Setup bàn làm việc không phải kiểu "dựng một lần rồi quên mãi mãi." Một cửa sổ đóng vai key light hoàn hảo lúc 10 giờ sáng có thể trở thành một nguồn ngược sáng gây phân tâm, khó lường vào khoảng 4 giờ chiều khi mặt trời dịch chuyển, và chẳng đóng góp gì cả sau khi trời tối. Hai thói quen thực tế giúp sửa việc này: nếu bạn quay nhiều tập của cùng một series qua nhiều ngày, cố quay vào khoảng cùng một giờ trong ngày để ánh sáng nhất quán từ tập này sang tập khác — ánh sáng tự nhiên lệch nhau giữa hai nửa của cùng một video là một trong những lỗi liên tục (continuity) dễ nhận ra và khó sửa nhất lúc dựng. Và một khi ánh sáng tự nhiên đã hết trong ngày, đèn key nhân tạo của bạn cần THAY THẾ HOÀN TOÀN việc cửa sổ vừa làm — vẫn khoảng góc 45° đó, độ sáng tương tự — thay vì để cả phòng chỉ còn mỗi bóng đèn trần mà bạn đã tắt lúc quay ban ngày.</p>

<h3>Mua đồ theo mức ngân sách — LOẠI thiết bị, không phải danh sách sản phẩm</h3>
<p>Giá đồ chiếu sáng đổi quá thường xuyên và chênh lệch quá nhiều giữa các cửa hàng để in một con số ở đây với đủ độ tin cậy — không con số nào được kiểm chứng trong quá trình soạn bài này, nên không con số nào được in ra. Thứ ổn định là LOẠI thiết bị và tiêu chí để đánh giá nó, ở ba mức ngân sách:</p>
<table><tr><th>Mức</th><th>Đồ đang có đã đủ dùng</th><th>Thêm gì</th><th>Tiêu chí chọn</th></tr>
<tr><td>Miễn phí / gần như miễn phí</td><td>Cửa sổ + tấm hắt tự chế (bìa mút trắng, bìa cứng, thậm chí một tờ giấy lớn) + một tấm rèm làm tấm tản</td><td>Không cần thêm gì — sắp xếp lại đúng những gì đang có theo Bài 8.1–8.3</td><td>Không áp dụng</td></tr>
<tr><td>Đèn nhỏ đầu tiên</td><td>Một đèn LED video nhỏ dạng kẹp hoặc cầm tay</td><td>Một chân đèn hoặc kẹp nếu phòng cho phép</td><td>Chỉnh được độ sáng (%), chỉnh được nhiệt màu (bi-color, tối thiểu khoảng 3200–5600K), có công bố CRI — ≥90, tốt nhất ≥95</td></tr>
<tr><td>Bộ hai đèn nghiêm túc</td><td>Đèn nhỏ ở trên chuyển sang làm fill hoặc back</td><td>Một đèn thứ hai làm key, cộng một chân đèn đúng nghĩa để giữ góc 45° ổn định thay vì kẹp tạm</td><td>Công bố cả TLCI lẫn CRI nếu có, điều khiển qua app hoặc núm vặn vật lý, có tản sáng sẵn hoặc gắn thêm được</td></tr>
</table>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — mua đèn trước khi dùng đúng ánh sáng miễn phí đang có sẵn.</strong> Lỗi phổ biến nhất của người mới là tiêu tiền mua đồ để giải quyết một vấn đề mà chỉ cần xoay bàn 180° về phía cửa sổ (Bài 8.2) hoặc tắt bóng đèn trần đang đá nhau (bài này) là đã giải quyết được, miễn phí. Dùng hết mọi cách sửa miễn phí trước — góc cửa sổ, tắt đèn trần, một tấm hắt tự chế — trước khi bỏ bất cứ gì vào giỏ hàng.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Chương 9 nói về âm thanh khi quay — và đúng cái bàn làm việc bạn vừa dựng cho ánh sáng thường cũng cần chăm y hệt vậy cho tiếng vang phòng và tiếng ồn nền.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Sắp xếp lại đúng bàn quay thật của bạn theo checklist bài này: tắt đèn trần, key ở 45°, một tấm hắt hoặc đèn thứ hai ở phía fill.</li>
<li>Quay 15 giây trước và 15 giây sau khi sắp xếp lại, cùng khung hình, cùng trang phục — so sánh cạnh nhau.</li>
<li>Ghi lại, cho đúng phòng của bạn, hôm nay bạn thật sự đang ở mức ngân sách nào, và thứ TIẾP THEO duy nhất bạn sẽ thêm là gì — không phải một danh sách ước mơ, chỉ một món kế tiếp.</li>
</ol><p><strong>Đạt khi:</strong> setup bàn quay của bạn là thứ bạn dựng lại được từ trí nhớ trong dưới hai phút, trước mỗi buổi quay.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Setup bàn làm việc</span><span class="v">Desk setup — cách bố trí key, fill/tấm hắt và đèn nền lặp lại được để quay đúng một chỗ.</span></div>
<div class="kv"><span class="k">Đèn kẹp</span><span class="v">Clamp-on light — đèn nhỏ có kẹp thay vì chân đứng sàn — hữu ích trong phòng trọ nhỏ.</span></div>
<div class="kv"><span class="k">Bi-color</span><span class="v">Đèn đổi được nhiệt độ màu (thường khoảng 3200–5600K) thay vì chỉ một mức cố định.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Key ở 45°, tắt đèn trần, một tấm hắt hoặc đèn thứ hai làm fill, và một đèn trang trí sau lưng (tuỳ chọn) đã đủ cho phần lớn video talking head tại nhà.</li>
<li>Màn hình máy tính nhiều nhất chỉ là nguồn sáng phụ — độ sáng và màu của nó đổi liên tục và ngả xanh.</li>
<li>Mua theo LOẠI và tiêu chí (chỉnh được độ sáng, chỉnh được nhiệt màu, có công bố CRI/TLCI) thay vì theo tên thương hiệu — và dùng hết mọi cách sửa miễn phí (góc cửa sổ, tắt đèn trần, tấm hắt tự chế) trước khi tiêu tiền.</li>
</ul>
</div>
`,
    },

    /* ─────────────────── 8.5 quiz ─────────────────── */
    {
      title: '8.5 — Chapter 8 check|||8.5 — Kiểm tra chương 8',
      slug: 'cr-08-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tóm tắt chương 8 và bài kiểm tra 10 câu tình huống: cứng/mềm, luật bình phương nghịch đảo, CRI/TLCI, nhấp nháy PWM, ngược sáng, ba điểm, tỉ lệ ánh sáng, và bốn kiểu sáng mặt.',
      content: `
<div class="ml-en">
<h2>📌 Chapter 8 summary</h2>
<p>Every idea in this chapter reduces to where you put a light and how big it is. Hard vs soft is about the source's apparent size, not its power. The inverse-square law turns "move the light" into an exact number of stops. CRI and TLCI grade a light's colour quality for the eye and for a camera-and-display pipeline respectively. Three lights each get one job — key shapes, fill softens, back separates — and a single key light's position alone produces four named, recognisable shadow patterns on a face. None of it requires new gear to start: a window, a lamp and a piece of white cardboard cover most of it.</p>
<h3>Self-check before Chapter 9</h3>
<div class="callout ok"><ul>
<li>I can explain why a light's SIZE relative to the subject, not its wattage, decides hard vs soft.</li>
<li>I can state what doubling the distance to a point light does to its brightness, in stops.</li>
<li>I know the difference between CRI and TLCI, and which one a video light should be judged by.</li>
<li>I know a dimmable LED that flickers only at low brightness is a PWM problem, not a mains-frequency problem.</li>
<li>I never sit with my back to my main window during a recording.</li>
<li>I can name key, fill and back and what happens if one of them is missing.</li>
<li>I can look at a face in any video and name which of split/loop/Rembrandt/butterfly lit it.</li>
</ul></div>
<p>If any box is unchecked, revisit that lesson before Chapter 9 — it assumes you can already control light on purpose and moves on to controlling sound the same way.</p>
</div>
<div class="ml-vi">
<h2>📌 Tóm tắt Chương 8</h2>
<p>Mọi ý trong chương này đều quy về việc bạn đặt đèn ở đâu và nó lớn cỡ nào. Cứng vs mềm là về KÍCH THƯỚC biểu kiến của nguồn, không phải công suất. Luật bình phương nghịch đảo biến "di chuyển đèn" thành một con số stop chính xác. CRI và TLCI chấm điểm chất lượng màu của đèn, lần lượt cho mắt người và cho cả đường đi qua máy quay lẫn màn hình. Ba đèn mỗi đèn một nhiệm vụ — key tạo khối, fill làm dịu, back tách nền — và chỉ riêng vị trí của một đèn key đã tạo ra bốn kiểu bóng có tên riêng, nhận ra được trên khuôn mặt. Không thứ nào trong đó cần mua đồ mới để bắt đầu: một cửa sổ, một cây đèn và một tấm bìa cứng trắng đã lo được phần lớn.</p>
<h3>Tự kiểm trước khi sang Chương 9</h3>
<div class="callout ok"><ul>
<li>Tôi giải thích được vì sao KÍCH THƯỚC của đèn so với chủ thể, không phải công suất, quyết định cứng vs mềm.</li>
<li>Tôi nói được gấp đôi khoảng cách tới một nguồn điểm làm giảm độ sáng bao nhiêu stop.</li>
<li>Tôi biết khác biệt giữa CRI và TLCI, và nên chấm một đèn quay video theo cái nào.</li>
<li>Tôi biết một đèn LED chỉnh sáng chỉ nhấp nháy ở mức sáng thấp là lỗi PWM, không phải lỗi tần số điện lưới.</li>
<li>Tôi không bao giờ ngồi quay lưng về cửa sổ chính khi đang quay.</li>
<li>Tôi gọi tên được key, fill, back và điều gì xảy ra nếu thiếu một trong ba.</li>
<li>Tôi nhìn một khuôn mặt trong video bất kỳ và gọi đúng tên nó được chiếu bằng split/loop/Rembrandt/butterfly.</li>
</ul></div>
<p>Nếu còn ô nào chưa tích được, quay lại đúng bài đó trước khi sang Chương 9 — chương đó giả định bạn đã điều khiển được ánh sáng có chủ đích, và chuyển sang điều khiển âm thanh theo đúng cách tương tự.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A softbox and a bare LED bulb both output the same power. Why does the softbox produce softer shadows?|||Một softbox và một bóng đèn LED trần cùng công suất như nhau. Vì sao softbox lại cho bóng đổ mềm hơn?',
            options: [
              'The softbox is physically larger relative to the subject, so light reaches it from more angles|||Softbox có kích thước vật lý lớn hơn so với chủ thể, nên ánh sáng tới từ nhiều góc hơn',
              'The softbox uses a lower colour temperature|||Softbox dùng nhiệt độ màu thấp hơn',
              'The softbox has a higher CRI|||Softbox có CRI cao hơn',
              'The softbox is closer to the ceiling|||Softbox đặt gần trần nhà hơn',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'Hard vs soft depends on the apparent SIZE of the source relative to the subject, not power, colour temperature or CRI — a larger source lights the subject from many angles at once, fading the shadow edge gradually instead of leaving a sharp line.|||Cứng vs mềm phụ thuộc KÍCH THƯỚC biểu kiến của nguồn so với chủ thể, không phải công suất, nhiệt độ màu hay CRI — nguồn lớn hơn chiếu sáng chủ thể từ nhiều góc cùng lúc, làm viền bóng mờ dần thay vì để lại một đường sắc.',
          },
          {
            question: 'You move a small LED light from 1 metre to 2 metres away from your subject, changing nothing else. What happens to the light hitting the subject?|||Bạn dời một đèn LED nhỏ từ cách chủ thể 1 mét ra 2 mét, không đổi gì khác. Lượng sáng chiếu vào chủ thể thay đổi thế nào?',
            options: [
              'It drops to half (1 stop less)|||Giảm còn một nửa (mất 1 stop)',
              'It stays the same, only the shadow size changes|||Không đổi, chỉ kích thước bóng đổ thay đổi',
              'It drops to a quarter (2 stops less)|||Giảm còn một phần tư (mất 2 stop)',
              'It drops to an eighth (3 stops less)|||Giảm còn một phần tám (mất 3 stop)',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'The inverse-square law: doubling the distance to a point-like source cuts intensity to 1/4 (since intensity follows 1/d² and 2² = 4), which is exactly 2 stops. Half (1 stop) and an eighth (3 stops) are common miscalculations of the same rule.|||Luật bình phương nghịch đảo: gấp đôi khoảng cách tới một nguồn gần như điểm làm cường độ còn 1/4 (vì cường độ tuân theo 1/d² và 2²=4), đúng bằng 2 stop. Một nửa (1 stop) và một phần tám (3 stop) là hai lỗi tính sai phổ biến của cùng quy tắc này.',
          },
          {
            question: 'Two video lights both advertise "CRI 96". One still makes skin tones look slightly off on your camera; the other looks accurate. What metric would most reliably have predicted this difference before buying?|||Hai đèn quay video đều quảng cáo "CRI 96". Một cái vẫn khiến tông da trông hơi sai qua máy quay; cái kia trông chuẩn. Chỉ số nào đáng tin hơn để dự đoán khác biệt này TRƯỚC KHI mua?',
            options: [
              'TLCI, which simulates the light through a camera and display, not just the eye|||TLCI, vì nó mô phỏng ánh sáng qua cả máy quay lẫn màn hình, không chỉ qua mắt',
              'A higher wattage rating|||Công suất (watt) cao hơn',
              'A higher Kelvin number|||Số Kelvin cao hơn',
              'The physical size of the light panel|||Kích thước vật lý của tấm đèn',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'CRI is calculated for how the human eye perceives colour directly and can miss spectral spikes that a camera sensor reacts to differently. TLCI was built by the EBU specifically to simulate a full camera-and-display pipeline, which is why two equal-CRI lights can still look different on camera.|||CRI được tính theo cách mắt người nhìn màu trực tiếp và có thể bỏ sót những đỉnh quang phổ mà cảm biến máy quay phản ứng khác đi. TLCI do EBU dựng riêng để mô phỏng nguyên cả đường đi qua máy quay và màn hình, đó là lý do hai đèn cùng CRI vẫn có thể trông khác nhau qua ống kính.',
          },
          {
            question: 'You set your shutter exactly as Chapter 5 recommends for 25fps under Vietnam mains power, but a dimmable LED light still flickers on camera once you turn its brightness dial down low. What is the most likely cause?|||Bạn đặt màn trập đúng như Chương 5 khuyên cho 25fps dưới điện lưới Việt Nam, nhưng một đèn LED chỉnh được độ sáng vẫn nhấp nháy khi quay lúc bạn vặn núm sáng xuống thấp. Nguyên nhân nhiều khả năng nhất là gì?',
            options: [
              'The camera needs a higher ISO|||Máy quay cần ISO cao hơn',
              'The white balance is not locked|||Cân bằng trắng chưa khoá',
              'The aperture is too wide|||Khẩu độ đang quá rộng',
              'The light dims using PWM at a frequency unrelated to the 100Hz mains flicker|||Đèn giảm sáng bằng PWM ở một tần số không liên quan tới nhịp nhấp nháy 100Hz của điện lưới',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'A correctly matched shutter fixes mains-frequency flicker, but PWM dimming is an unrelated second cause specific to the light fixture itself — its on/off switching frequency, not the mains, is what your shutter would need to match, and often cannot. ISO, white balance and aperture do not control flicker.|||Màn trập khớp đúng sửa được nhấp nháy do tần số điện lưới, nhưng PWM dimming là nguyên nhân thứ hai, độc lập, riêng của chính cây đèn — tần số tắt/mở của nó, không phải điện lưới, mới là thứ màn trập cần khớp, mà thường không khớp được. ISO, cân bằng trắng và khẩu độ đều không điều khiển nhấp nháy.',
          },
          {
            question: 'You are recording at your desk with your back to the only window in the room. Your face looks like a dark silhouette. Why?|||Bạn đang quay tại bàn, lưng quay về phía cửa sổ duy nhất trong phòng. Mặt bạn trông như một cái bóng đen. Vì sao?',
            options: [
              'Your camera lens is dirty|||Ống kính máy quay bị bẩn',
              'The camera exposes for the bright window behind you, darkening everything else including your face|||Máy quay đo sáng theo cửa sổ sáng chói sau lưng bạn, làm tối mọi thứ khác kể cả mặt bạn',
              'The frame rate does not match the window light|||Frame rate không khớp với ánh sáng cửa sổ',
              'The white balance is set to tungsten|||Cân bằng trắng đang đặt ở tungsten',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'This is backlighting without fill: the camera correctly averages the brightness it sees, and a bright window dominates that average, pushing everything darker in front of it — including your face. Turning around so the window faces you (or adding a light in front of your face) fixes it, at no cost.|||Đây là ngược sáng mà không có gì bù: máy quay tính trung bình độ sáng đúng những gì nó thấy, và cửa sổ sáng chói lấn át mức trung bình đó, đẩy mọi thứ phía trước nó tối xuống — kể cả mặt bạn. Xoay người lại để cửa sổ chiếu vào bạn (hoặc thêm một nguồn sáng phía trước mặt) sửa được, miễn phí.',
          },
          {
            question: 'You have only one video light. What is the standard low-cost way to approximate what a second (fill) light would do?|||Bạn chỉ có một đèn quay video. Cách chuẩn, ít tốn kém nhất để mô phỏng lại tác dụng của đèn thứ hai (fill) là gì?',
            options: [
              'Turn the single light’s brightness up as high as possible|||Vặn độ sáng đèn duy nhất lên mức cao nhất có thể',
              'Switch the single light to a cooler colour temperature|||Đổi đèn duy nhất sang nhiệt độ màu lạnh hơn',
              'Move the camera closer to the subject|||Đưa máy quay lại gần chủ thể hơn',
              'Add a white bounce card on the shadow side to reflect the key light back into it|||Thêm một tấm hắt trắng ở phía bóng tối để hắt lại ánh sáng của đèn key vào đó',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'A bounce card does not produce light — it redirects light the key is already casting back into the shadow side, softening contrast for free. Raising brightness, changing colour temperature, or moving the camera do not address the missing fill light at all.|||Tấm hắt không tự phát sáng — nó hắt lại ánh sáng đèn key đang chiếu ra vào đúng phía bóng tối, làm dịu tương phản miễn phí. Tăng độ sáng, đổi nhiệt độ màu, hay đưa máy quay lại gần đều không giải quyết được việc thiếu đèn fill.',
          },
          {
            question: 'You add a key, fill and back light, but the shot still looks nearly as flat as under a bare ceiling bulb. What is the most likely cause?|||Bạn đã thêm đủ đèn key, fill và back, nhưng cảnh vẫn trông gần như phẳng y hệt dưới một bóng đèn trần trơ. Nguyên nhân nhiều khả năng nhất là gì?',
            options: [
              'The back light is too strong|||Đèn back quá mạnh',
              'The key light is not motivated|||Đèn key không có "lý do" trong cảnh',
              'The fill light is set almost as bright as the key, giving a ratio close to 1:1|||Đèn fill đang đặt gần bằng độ sáng đèn key, cho tỉ lệ gần 1:1',
              'The white balance is too warm|||Cân bằng trắng đang quá ấm',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'A lighting ratio near 1:1 (key and fill at nearly equal brightness) removes the shadow contrast that gives a face its sense of shape — exactly what a bare ceiling bulb does. Lowering the fill (or moving its bounce farther away) restores a visible ratio, roughly 2:1 or higher.|||Tỉ lệ ánh sáng gần 1:1 (key và fill gần bằng độ sáng nhau) xoá mất độ tương phản bóng đổ vốn tạo cảm giác khối cho khuôn mặt — đúng như một bóng đèn trần trơ làm. Hạ fill xuống (hoặc đẩy tấm hắt của nó ra xa hơn) khôi phục lại một tỉ lệ nhìn thấy được, khoảng 2:1 trở lên.',
          },
          {
            question: 'In a photo, a face is split exactly in half: one side fully lit, the other side fully in shadow, with a straight vertical line between them. Which lighting pattern is this?|||Trong một tấm ảnh, khuôn mặt bị chia đúng làm đôi: một nửa sáng hoàn toàn, nửa kia tối hoàn toàn, với một đường thẳng đứng phân chia rõ. Đây là kiểu sáng nào?',
            options: ['Butterfly|||Butterfly', 'Split|||Split', 'Loop|||Loop', 'Rembrandt|||Rembrandt'],
            correctIndex: 1,
            points: 1,
            explanation: 'Split lighting places the key light at roughly 90° to the side, at face height, dividing the face exactly in half. Butterfly is symmetrical and centred, loop leaves a small isolated nose shadow, and Rembrandt leaves a small triangle of light on the shadowed cheek — none of them cut a straight line through the centre of the face.|||Split đặt đèn key ở khoảng 90° ngang mặt, chia đúng khuôn mặt làm đôi. Butterfly đối xứng và ở giữa, loop để lại một bóng mũi nhỏ tách rời, còn Rembrandt để lại một tam giác sáng nhỏ trên gò má tối — không kiểu nào trong ba kiểu đó cắt một đường thẳng qua giữa mặt.',
          },
          {
            question: 'A face shows a small, isolated triangle of light on the shadowed cheek, just under the eye, where the nose shadow has merged with the cheek shadow. Which pattern is this, and what is the closest related pattern it is often confused with?|||Một khuôn mặt có một tam giác sáng nhỏ, tách biệt, trên gò má tối, ngay dưới mắt, nơi bóng mũi đã hoà vào bóng gò má. Đây là kiểu nào, và nó hay bị nhầm với kiểu gần giống nào nhất?',
            options: [
              'Butterfly, often confused with split|||Butterfly, hay bị nhầm với split',
              'Split, often confused with butterfly|||Split, hay bị nhầm với butterfly',
              'Rembrandt, often confused with loop|||Rembrandt, hay bị nhầm với loop',
              'Loop, often confused with Rembrandt|||Loop, hay bị nhầm với Rembrandt',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'The triangle of light on the shadowed cheek is the defining trait of Rembrandt lighting. It is most often confused with loop lighting, whose nose shadow stays small and separate instead of merging with the cheek shadow — the two use a similar light angle and differ only in that one detail.|||Tam giác sáng trên gò má tối là đặc điểm định nghĩa của kiểu Rembrandt. Nó hay bị nhầm nhất với loop, vì bóng mũi của loop vẫn nhỏ và tách rời thay vì hoà vào bóng gò má — hai kiểu dùng góc đèn khá giống nhau và chỉ khác nhau ở đúng chi tiết đó.',
          },
          {
            question: 'While recording a coding tutorial at your desk at night, your only light source is your monitor. What is the most accurate description of the problem?|||Khi quay video dạy lập trình tại bàn vào buổi tối, nguồn sáng duy nhất là màn hình máy tính của bạn. Mô tả chính xác nhất vấn đề này là gì?',
            options: [
              'The monitor’s brightness and colour shift with on-screen content and skew blue, so it should be secondary, not the main source|||Độ sáng và màu màn hình đổi theo nội dung hiển thị và ngả xanh, nên nó chỉ nên là nguồn phụ, không phải nguồn chính',
              'There is no problem — a monitor is a perfectly stable key light|||Không có vấn đề gì — màn hình là một đèn key hoàn toàn ổn định',
              'The only issue is that the monitor is too bright and should be turned off entirely|||Vấn đề duy nhất là màn hình quá sáng và nên tắt hẳn đi',
              'The monitor causes flicker banding regardless of shutter speed|||Màn hình luôn gây sọc nhấp nháy bất kể màn trập đặt bao nhiêu',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'A monitor constantly changes brightness and colour as whatever is on screen changes (a light IDE theme vs a dark one), and it leans cool/blue — exactly the opposite of a stable, controllable key light. The fix from Lesson 8.4 is to add a dedicated key light and let the monitor stay a secondary or background light at most.|||Màn hình liên tục đổi độ sáng và màu theo nội dung hiển thị (theme IDE sáng so với tối), và ngả lạnh/xanh — ngược hẳn với một đèn key ổn định, điều khiển được. Cách sửa ở Bài 8.4 là thêm một đèn key riêng và để màn hình nhiều nhất chỉ làm nguồn sáng phụ/hậu cảnh.',
          },
        ],
      },
    },
  ],
};
