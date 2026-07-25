/**
 * Exp Hub guide for PRM392 — Android Studio setup (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Academy PRM392 bài 0.4 links its "Cài đặt" card to /exp-hub/prm392-cai-dat-android-studio.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'prm392-cai-dat-android-studio',
    title: 'PRM392 — Cài đặt Android Studio + máy ảo AVD (Java)',
    kind: 'NOTE',
    language: 'text',
    status: 'PUBLISHED',
    description: 'Hướng dẫn cài Android Studio, JDK, SDK và tạo máy ảo AVD (hoặc chạy trên điện thoại thật) để học PRM392. Kèm lệnh kiểm tra, cách bật chế độ nhà phát triển trên điện thoại, và các lỗi cài đặt hay gặp.',
    referenceUrl: 'https://developer.android.com/studio',
    codeBlocks: [
      {
        name: 'Checklist cài đặt trước buổi học đầu tiên',
        language: 'text',
        code: `[ ] Laptop: >=16GB RAM, >=25GB trong o cung TRUOC khi cai
[ ] Tai Android Studio (ban moi nhat) tu developer.android.com/studio
[ ] Chay installer -> chon "Standard" (tu tai SDK + emulator)
[ ] Mo Android Studio -> More Actions -> SDK Manager
      - SDK Platforms: tick 1 ban Android (vd API 34)
      - SDK Tools: Android SDK Build-Tools, Platform-Tools, Emulator
[ ] Tao may ao: Device Manager -> Create Device -> Pixel + system image
[ ] Tao project mau "Empty Views Activity" (Language: Java) -> Run
[ ] Thay app chay tren emulator = XONG`,
      },
      {
        name: 'Chạy trên ĐIỆN THOẠI THẬT (nhanh hơn emulator trên máy yếu)',
        language: 'text',
        code: `# Tren dien thoai Android:
1) Settings -> About phone -> bam "Build number" 7 lan (bat Developer options)
2) Settings -> Developer options -> bat "USB debugging"
3) Cam dien thoai vao laptop bang cap USB
4) Tren dien thoai bam "Allow" khi hoi tin may tinh nay

# Tren laptop, kiem thiet bi da nhan chua:
adb devices
# -> thay 1 dong <serial>  device  la OK
# adb nam trong: <SDK>/platform-tools/  (them vao PATH neu can)`,
      },
    ],
    noteContent: `
<span class="eyebrow">Cài đặt môi trường · PRM392</span>
<h2>Cài Android Studio để học Lập trình di động</h2>
<p class="lead">PRM392 là môn <strong>code Android native bằng Java</strong>. Bạn cần <strong>Android Studio</strong> (IDE chính thức của Google, đã kèm SDK + emulator) và một nơi để chạy app: máy ảo <strong>AVD</strong> hoặc một <strong>điện thoại Android thật</strong>. Syllabus yêu cầu cài đủ TRƯỚC buổi đầu.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Tải</div><div class="lz-t">Android Studio</div><div class="lz-d">kèm SDK + emulator</div></div>
  <div class="lz-step"><div class="lz-k">SDK</div><div class="lz-t">SDK Manager</div><div class="lz-d">1 bản Android + tools</div></div>
  <div class="lz-step"><div class="lz-k">Chạy</div><div class="lz-t">AVD / điện thoại</div><div class="lz-d">máy ảo hoặc máy thật</div></div>
  <div class="lz-step"><div class="lz-k">Kiểm</div><div class="lz-t">Run app mẫu</div><div class="lz-d">thấy chạy = xong</div></div>
</div>

<h3>🤖 1 — Tải & cài Android Studio</h3>
<p>Tải bản mới nhất từ trang chính chủ. Khi cài chọn <strong>Standard</strong> để nó tự tải SDK và một emulator. Đây là bản tải lớn (vài GB) — làm ở nhà, đừng làm trong lớp.</p>
<a class="link-card dl" href="https://developer.android.com/studio" target="_blank" rel="noopener">
  <span class="lc-ico">🤖</span>
  <span class="lc-body"><span class="lc-title">Android Studio (chính chủ Google)</span><span class="lc-sub">developer.android.com/studio · Windows / macOS / Linux</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<div class="pitfall">Cần <strong>≥16GB RAM</strong> và <strong>≥25GB trống</strong> trước khi cài (SDK + một system image emulator ăn phần lớn dung lượng). Máy yếu thì chạy trên điện thoại thật qua USB — nhanh hơn emulator nhiều.</div>

<h3>📦 2 — Cấu hình SDK (SDK Manager)</h3>
<p>Mở Android Studio → <strong>More Actions → SDK Manager</strong>. Ở tab <em>SDK Platforms</em> tick một bản Android (vd API 34); ở tab <em>SDK Tools</em> đảm bảo có Build-Tools, Platform-Tools và Emulator. Xem tab "Checklist cài đặt" ở trên.</p>

<h3>📱 3 — Tạo máy ảo AVD hoặc dùng điện thoại thật</h3>
<p>Máy ảo: <strong>Device Manager → Create Device</strong> → chọn Pixel + tải một system image. Điện thoại thật: bật <em>Developer options</em> + <em>USB debugging</em> (xem tab "Chạy trên điện thoại thật"). Điện thoại thật thường mượt hơn emulator trên laptop cấu hình vừa.</p>
<a class="link-card dl" href="https://developer.android.com/studio/run/managing-avds" target="_blank" rel="noopener">
  <span class="lc-ico">📱</span>
  <span class="lc-body"><span class="lc-title">Hướng dẫn tạo & quản lý AVD</span><span class="lc-sub">developer.android.com · Android Virtual Device</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>📚 4 — Tài liệu & luyện tập</h3>
<p>Tài liệu chính thức và khoá học nền tảng của Google, cộng với các track Code Lab để luyện Java/SQLite/API dùng xuyên suốt Android.</p>
<a class="link-card dl" href="https://developer.android.com/courses/android-basics-compose/course" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">Android Basics (Google, miễn phí)</span><span class="lc-sub">developer.android.com · khoá nền tảng chính chủ</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card codelab" href="/code-lab/java-core#module-246">
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">Code Lab — Java core</span><span class="lc-sub">nền Java cho mọi Activity/Adapter</span></span>
  <span class="lc-cta">LUYỆN →</span>
</a>
<a class="link-card codelab" href="/code-lab/sqlite#module-1461">
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">Code Lab — SQLite</span><span class="lc-sub">đúng engine Android dùng cho Room</span></span>
  <span class="lc-cta">LUYỆN →</span>
</a>

<div class="callout ok"><strong>Kiểm nhanh đã sẵn sàng:</strong> tạo project mẫu "Empty Views Activity" (Language chọn <strong>Java</strong>), bấm <strong>Run</strong>, thấy app "Hello World" chạy trên emulator/điện thoại = môi trường OK. Nếu Gradle sync lỗi, kiểm mạng và để nó tải xong dependency lần đầu.</div>
`,
  },
};
