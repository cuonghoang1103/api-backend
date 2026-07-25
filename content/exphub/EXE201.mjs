/**
 * Exp Hub guide for EXE201 — launch & growth toolkit (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Academy EXE201 bài 0.4 links its "Công cụ" card to /exp-hub/exe201-cong-cu-launch.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'exe201-cong-cu-launch',
    title: 'EXE201 — Bộ công cụ launch & tăng trưởng: no-code builder, Analytics, kênh, metrics sheet',
    kind: 'NOTE',
    language: 'text',
    status: 'PUBLISHED',
    description: 'Bộ công cụ miễn phí để xây, launch và đo lường sản phẩm EXE201: công cụ dựng no-code (Glide/Softr/Carrd), Google Analytics, kênh launch, và một sheet chỉ số hàng tuần theo dõi activation & retention. Kèm mẫu sheet metrics.',
    referenceUrl: 'https://www.ycombinator.com/library',
    codeBlocks: [
      {
        name: 'Mẫu sheet chỉ số hàng tuần (tạo trong Google Sheets)',
        language: 'text',
        code: `# Moi tuan mot dong. Cot chinh:
Tuan | Acquisition | Activation | Retention W1 | Referral | Ghi chu thay doi
W4   | 15          | 10         | -            | 2        | silent launch 10 nguoi
W5   | 55          | 30         | 45%          | 8        | dang group FB
W6   | 120         | 45         | 30%          | 20       | TikTok + lop truong
W7   | 160         | 95         | 60%          | 35       | sua onboarding (form 8->3)
# => W7 activation nhay vot sau khi cat form: day la cau chuyen Outcome 3.

# Activation = % nguoi moi lam HANH DONG LOI (vd: dang 1 mon)
# Retention W1 = % nguoi tuan truoc quay lai tuan nay`,
      },
      {
        name: 'Khung kế hoạch acquisition (Outcome 2)',
        language: 'text',
        code: `KHACH HANG MUC TIEU: ____ (cu the: SV FPT nam 1-2 ...)
HO O DAU: ____ (group FB campus / TikTok / lop truong ...)
THONG DIEP: [noi dau cua ho] -> [su nhe nhom] -> [1 loi keu goi]
KENH THU (Bullseye - chon 2-3 thu re):
  1) ____  ket qua: __ signup / __ gio
  2) ____  ket qua: __ signup / __ gio
  3) ____  ket qua: __ signup / __ gio
=> DON LUC vao kenh chuyen doi tot nhat tren moi cong suc.`,
      },
    ],
    noteContent: `
<span class="eyebrow">Công cụ launch & tăng trưởng · EXE201</span>
<h2>Bộ công cụ để xây, launch & đo lường</h2>
<p class="lead">EXE201 chấm trên sản phẩm <strong>đã ship</strong> và <strong>dữ liệu launch</strong>. Ngoài bộ EXE101 (kho YC, Forms, Canva, Notion), bạn cần một công cụ dựng, các kênh launch, và cách đo activation/retention. Tất cả miễn phí.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Xây</div><div class="lz-t">No-code builder</div><div class="lz-d">Glide / Softr / Carrd</div></div>
  <div class="lz-step"><div class="lz-k">Đo</div><div class="lz-t">Analytics</div><div class="lz-d">GA / metrics sheet</div></div>
  <div class="lz-step"><div class="lz-k">Launch</div><div class="lz-t">Kênh</div><div class="lz-d">FB/Zalo/TikTok/lớp trưởng</div></div>
  <div class="lz-step"><div class="lz-k">Giữ</div><div class="lz-t">Email/form</div><div class="lz-d">cập nhật + phản hồi</div></div>
</div>

<h3>🛠️ 1 — Công cụ dựng no-code (biến MVP thành thứ dùng được)</h3>
<p>Nếu đội không có dev, dùng no-code để dựng một sản phẩm người dùng thật chạm được: Glide (app từ Google Sheet), Softr (web app từ Airtable), hoặc Carrd (landing page + waitlist trong 1 giờ).</p>
<a class="link-card dl" href="https://www.glideapps.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📱</span>
  <span class="lc-body"><span class="lc-title">Glide</span><span class="lc-sub">glideapps.com · app từ Google Sheet, không cần code</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://carrd.co/" target="_blank" rel="noopener">
  <span class="lc-ico">🧾</span>
  <span class="lc-body"><span class="lc-title">Carrd</span><span class="lc-sub">carrd.co · landing page + nút đăng ký trong 1 giờ</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>📈 2 — Analytics & metrics sheet (đo activation/retention)</h3>
<p>Cài Google Analytics (nếu là web) để đo người dùng rơi ở bước nào, và giữ một <strong>metrics sheet hàng tuần</strong> (xem tab ở trên) — đây là nguồn cho biểu đồ tăng trưởng của Outcome 3.</p>
<a class="link-card dl" href="https://analytics.google.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Google Analytics</span><span class="lc-sub">analytics.google.com · miễn phí, gắn TRƯỚC khi launch</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<div class="pitfall">Gắn đo <strong>trước</strong> lần launch đầu. Nếu không, lần launch đầu tiên (giàu thông tin nhất) sẽ không tạo ra dữ liệu nào để phân tích cho CLO4.</div>

<h3>📣 3 — Kênh launch (tới nơi người dùng đã ở)</h3>
<p>Đừng dàn mỏng. Chọn 1-2 kênh nơi đúng khách hàng của bạn tụ tập: group Facebook/Zalo campus, TikTok/Reels, lớp trưởng/đại sứ, cộng đồng ngách. Thử rẻ 2-3 kênh (Bullseye) rồi dồn lực vào kênh chuyển đổi tốt nhất.</p>
<a class="link-card dl" href="https://www.ycombinator.com/library/6-how-to-launch-again-and-again" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">YC — How to Launch (Again and Again)</span><span class="lc-sub">ycombinator.com/library · triết lý launch liên tục</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🖌️ 4 — Figma (phác/hoàn thiện sản phẩm)</h3>
<p>Dùng Figma để phác màn hình MVP bấm được hoặc thiết kế giao diện trước khi dựng. Có gói Education miễn phí cho sinh viên.</p>
<a class="link-card dl" href="https://www.figma.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🎨</span>
  <span class="lc-body"><span class="lc-title">Figma</span><span class="lc-sub">figma.com · thiết kế + prototype, gói sinh viên miễn phí</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<div class="callout ok"><strong>Nhớ:</strong> điểm cao ở EXE201 = một <em>sản phẩm thật đã ship</em> × <em>launch trên kênh thật</em> × <em>một chỉ số đã tăng</em> × <em>phản hồi biến thành cải tiến</em>. Dùng no-code để ship, Analytics + sheet để đo, kênh để launch, và luôn khép vòng phản hồi → thay đổi → kết quả.</div>
`,
  },
};
