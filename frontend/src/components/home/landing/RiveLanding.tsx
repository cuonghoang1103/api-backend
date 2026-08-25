'use client';

/**
 * Trang chủ "/" — cửa vào CuongThai.
 *
 * ─── VÌ SAO VIẾT LẠI (30/7/2026) ─────────────────────────────────────────────
 * Bản cũ bị chê thẳng là "nhìn như AI làm". Audit bằng skill hallmark đếm được
 * 8 lỗi critical + 8 major, và tất cả đều là DẤU HIỆU CÓ TÊN:
 *
 *   · aurora-blob background   — 3 quả mờ tím/lam/hồng trôi vô hạn
 *   · purple-gradient hero     — chữ gradient tím→lam
 *   · full-viewport centred hero + huy hiệu viên thuốc có chấm xanh
 *   · 3-column feature grid    — 6 thẻ icon đều tăm tắp
 *   · icon-tile feature card   — ô bo góc nhuộm màu + icon lucide, lặp 6 lần
 *   · shadow-glow on dark      — đổ bóng theo màu nhấn
 *   · universal hover:scale + fade-up áp cho MỌI khối
 *   · invented metrics         — 4 con số gõ cứng, không đếm từ đâu cả
 *
 * Sửa từng cái một thì vẫn ra khuôn cũ. Nên đổi hẳn CẤU TRÚC:
 *
 * ─── CẤU TRÚC: Ecosystem Index ───────────────────────────────────────────────
 * Không phải phễu tiếp thị (hero → 3 cột → CTA → footer) mà là NHIỀU DẢI NỘI
 * DUNG ĐỂ DUYỆT. Lý do: thứ đáng giá nhất của site này là bề rộng nội dung
 * thật — hàng nghìn bài tập, hàng chục môn, hàng trăm chương. Trang chủ nên cho
 * người ta THẤY và ĐI VÀO, chứ không phải thuyết phục bằng lời.
 * Cùng họ với Are.na, Figma Community, Behance.
 *
 * ─── LUẬT GIỮ KHI SỬA TIẾP ───────────────────────────────────────────────────
 * 1. KHÔNG căn giữa cả trang. Lề trái là trục — đó là thứ tạo ra nhịp đọc.
 * 2. KHÔNG gradient trên chữ, KHÔNG glow theo màu nhấn, KHÔNG blob mờ.
 * 3. Hover chỉ đổi ĐƯỜNG VIỀN và MÀU CHỮ. Không `scale`, không nhấc lên.
 * 4. Mọi con số phải đến từ `useLandingStats()`. Không đếm được thì ẨN, không
 *    bịa, không thay bằng 0.
 * 5. Màu lấy từ TOKEN, không gán mã hex thẳng vào lớp — xem luật mới ngay dưới.
 *
 * ─── LỚP MÀU RIÊNG (07/08/2026) ──────────────────────────────────────────────
 * User chê "chữ màu trắng và nền chưa nổi bật". Đúng, và nguyên nhân không nằm
 * ở trang này: trang chủ đang mượn nguyên bảng token toàn site — bảng kiểu
 * Facebook, `#18191a` nền / `#e4e6eb` chữ / `#3e4042` viền, CHROMA BẰNG 0 ở cả
 * ba. Bảng đó đúng cho Feed và Messenger (nội dung là ảnh, giao diện phải lùi
 * lại) nhưng đặt lên trang chủ thì thành xám chết.
 *
 * Nay trang chủ có LỚP MÀU RIÊNG: class `landing-root` (định nghĩa ở cuối
 * `globals.css`) ghi đè các token đó CHỈ TRONG PHẠM VI trang này — nền ngả xanh
 * mực và tối sâu hơn, chữ sáng gần trắng ngà, nhấn đổi sang hổ phách ấm. Luật
 * số 5 vẫn nguyên: component KHÔNG được gán hex, chỉ dùng `var(...)`; muốn màu
 * mới thì thêm biến vào khối `.landing-root` rồi gọi ra. Đó là điều kiện để nút
 * đổi sáng/tối còn chạy đúng.
 *
 * Kèm hai lớp chất liệu, cũng khai báo ở `globals.css`:
 *   · `.landing-grain`   — hạt nhiễu ~4%, đứng yên khi cuộn. Nền phẳng tuyệt
 *                          đối đọc ra "trống"; có hạt mới đọc ra "sâu".
 *   · `.landing-measure` — hai kẻ dọc đúng mép khổ chữ, chạy suốt trang, giao
 *                          với các đường ngang của từng dải thành một lưới.
 * Cả hai KHÔNG phải blob mờ và KHÔNG phải glow — vẫn đúng luật 2.
 */
import Link from 'next/link';
import PlaygroundGate from './PlaygroundGate';
import DeepDives from './DeepDives';
import { useLandingStats, fmt } from './useLandingStats';
export { default } from './LandingExperience';

/**
 * Một dải nội dung: số thứ tự + nhãn + tiêu đề + các mục đi vào.
 *
 * `index` ("01", "02"…) là NGÔN NGỮ PHÂN CÁCH của Ecosystem Index — nó nói cho
 * người đọc biết trang này có mấy phần và đang ở phần nào, giống mục lục sách.
 * Đây KHÔNG phải "eyebrow trên mọi section" (thứ bị chấm là dấu hiệu AI): kia là
 * nhãn trang trí lặp lại vô nghĩa, còn đây là chỉ mục có thật và đếm được.
 */
interface Rail {
  index: string;
  label: string;
  title: string;
  blurb: string;
  items: { name: string; href: string; note: string }[];
}

const RAILS: Rail[] = [
  {
    index: '01',
    label: 'Learn',
    title: 'Structured, from the first line',
    blurb: 'Full curricula rather than scattered tutorials — each with its own order, exercises and exams.',
    items: [
      { name: 'Code Lab', href: '/code-lab', note: 'Graded exercises across every stack' },
      { name: 'Academy', href: '/academy', note: 'University subjects, worked end to end' },
      { name: 'Courses', href: '/courses', note: 'Long-form courses, chapter by chapter' },
      { name: 'RoadMap', href: '/roadmap', note: 'What to learn, in what order' },
      { name: 'My Language', href: '/language', note: 'English · Japanese · Chinese' },
      { name: 'Exam Room', href: '/exam', note: 'Sit the real paper, timed' },
    ],
  },
  {
    index: '02',
    label: 'Build',
    title: 'Things that make the work easier',
    blurb: 'The tools that sit beside the learning — notes, snippets, diagrams, a CV that gets read.',
    items: [
      { name: 'Exp Hub', href: '/exp-hub', note: 'Snippets and notes worth keeping' },
      { name: 'Simulation', href: '/simulation', note: 'Watch systems run, step by step' },
      { name: 'Algorithms', href: '/algorithms', note: 'Visualise the code as it executes' },
      { name: 'CV Builder', href: '/cv', note: 'An IT résumé that survives the filter' },
      { name: 'Notes', href: '/notes', note: 'Write, organise, share' },
      { name: 'AI Chat', href: '/chat', note: 'Ask about code, docs, ideas' },
    ],
  },
  {
    index: '03',
    label: 'Practice & play',
    title: 'Where it stops being theory',
    blurb: 'Rehearse under pressure, then go somewhere that has nothing to do with work.',
    items: [
      { name: 'Interview', href: '/interview', note: 'Mock interviews, graded out loud' },
      { name: 'Blog', href: '/tech-trends', note: 'Sự cố production, bài mổ lỗi, hướng dẫn sâu' },
      { name: 'Forum', href: '/forum', note: 'Ask, argue, help' },
      { name: 'Games', href: '/games', note: 'Short games, real leaderboards' },
      { name: 'Music', href: '/music', note: 'Listen together' },
      { name: 'Feed', href: '/feed', note: 'What people are posting' },
    ],
  },
];

export function LegacyRiveLanding() {
  const stats = useLandingStats();

  // Chỉ giữ ô nào ĐẾM ĐƯỢC. `null` là không đếm được ⇒ biến mất khỏi hàng,
  // không hiện "0", không hiện dấu gạch.
  const counts = [
    { n: stats?.exercises, label: 'graded exercises' },
    { n: stats?.modules, label: 'modules' },
    { n: stats?.subjects, label: 'subjects & courses' },
    { n: stats?.examQuestions, label: 'exam questions' },
    { n: stats?.vocabWords, label: 'vocabulary entries' },
    { n: stats?.hanziChars, label: 'kanji & hanzi' },
  ].filter((c) => typeof c.n === 'number' && c.n > 0);

  return (
    // `isolate` bọc kín ngữ cảnh xếp lớp: hai lớp chất liệu bên dưới dùng
    // `position: fixed` + `z-index`, `isolate` bảo đảm chúng KHÔNG bao giờ leo
    // lên trên Navbar (Navbar nằm ngoài div này, trong layout).
    <div className="landing-root relative isolate min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div aria-hidden className="landing-grain" />
      <div aria-hidden className="landing-measure hidden xl:block" />

      {/* Toàn bộ nội dung nằm trên hai lớp chất liệu. */}
      <div className="relative z-[2]">
        {/* ── Mở đầu ──────────────────────────────────────────────────────
            Lề trái, không căn giữa, không huy hiệu, không gradient. Một câu nói
            rõ đây là cái gì, rồi đi thẳng vào nội dung. */}
        <header className="mx-auto max-w-5xl px-5 pb-16 pt-24 sm:px-8 sm:pt-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
            CuongThai — learning platform
          </p>
          {/* `text-balance` để dòng cuối không rớt lại một hai chữ lẻ — tiêu đề
              lớn mà cụt đuôi là thứ mắt bắt được ngay dù không gọi tên được.
              `landing-mark` gạch một vệt hổ phách dưới cụm chốt câu: đây là chỗ
              thay cho chữ gradient (luật 2 cấm gradient trên chữ) và cũng là
              điểm màu duy nhất của phần mở đầu. */}
          {/* Cỡ chữ theo BA CHẶNG, không phải hai. Bản đầu để 2.75rem cho mọi
              màn hình dưới 640px: trên máy 390px nó cắt thành BẢY dòng và ăn
              trọn màn hình đầu tiên, cuộn cả trang mới thấy đến nút. 2.05rem ở
              chặng gốc cho khoảng năm dòng — vẫn là chữ lớn, vẫn đọc ra tuyên
              ngôn, mà nút bấm còn nằm trong tầm nhìn. */}
          <h1 className="landing-display mt-5 max-w-none text-balance font-editorial text-[2.15rem] font-semibold leading-[1.08] tracking-[-0.014em] sm:max-w-[20ch] sm:text-[3.5rem] lg:max-w-[21ch] lg:text-[4.4rem] lg:leading-[1.05]">
            Everything I know about building software, written down and{' '}
            <span className="landing-mark">made practisable</span>.
          </h1>
          <p className="mt-7 max-w-[58ch] text-lg leading-[1.65] text-[var(--text-secondary)]">
            Curricula, graded exercises, past exam papers, language study and the tools that go with
            them. Free to read. Nothing here is a placeholder.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2.5">
            <Link
              href="/code-lab"
              className="rounded-lg bg-[var(--text-primary)] px-5 py-3 text-sm font-semibold text-[var(--bg-primary)] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]"
            >
              Start with an exercise
            </Link>
            <Link
              href="/roadmap"
              className="rounded-lg border border-[var(--border-color)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--text-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]"
            >
              Or see what to learn first
            </Link>
          </div>

          {/* Số liệu ĐẾM THẬT. Trước đây viết thành một dòng chạy ngang, số và
              nhãn cùng cỡ nên không đọc ra được cái nào là số. Nay xếp thành
              hàng ô kiểu trang bản quyền sách: nhãn mono nhỏ ở trên, số lớn
              tabular ở dưới — mắt bắt số trước, đọc nhãn sau.
              KHÔNG kẻ ô, KHÔNG đổ bóng: đây vẫn là chú thích, không phải thẻ
              thống kê phát sáng (xem danh sách dấu hiệu ở đầu file).
              Chưa tải xong thì cả khối không hiện — không bịa, không hiện 0. */}
          {counts.length > 0 && (
            <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-[var(--border-color)] pt-8 sm:grid-cols-3 lg:grid-cols-6">
              {counts.map((c) => (
                <div key={c.label} className="min-w-0">
                  {/* `min-h` bằng đúng HAI dòng nhãn. Nhãn dài ("subjects &
                      courses", "vocabulary entries") xuống dòng còn nhãn ngắn
                      thì không, nên nếu để cao tự nhiên thì các CON SỐ tụt lệch
                      nhau — hàng thống kê mất đường chân chung và trông như xếp
                      ẩu. Ghim chiều cao nhãn thì số luôn thẳng hàng. */}
                  <dt className="min-h-[1.6rem] font-mono text-[10px] uppercase leading-tight tracking-[0.16em] text-[var(--text-muted)]">
                    {c.label}
                  </dt>
                  <dd className="mt-1.5 font-heading text-[1.6rem] font-bold leading-none tabular-nums tracking-tight">
                    {fmt(c.n!)}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </header>

        {/* ── Sân chơi 3D — mục nổi bật ───────────────────────────────────
            Đặt ngay dưới phần mở đầu vì đây là thứ khác biệt nhất của site, và
            cũng là thứ khách sẽ nhớ. Bấm vào KHÔNG đi thẳng: `PlaygroundGate`
            mở hộp thoại cảnh báo dùng GPU máy khách + nặng ~35MB trước đã. */}
        {/* ⚠️ ĐỪNG đưa lại `border-t-2 border-t-[var(--accent-color)]` vào đây.
            Vạch xanh 2px từng chạy ngang hết bề rộng trang, cắt đôi trang chủ và
            user chê xấu (30/7) — bỏ rồi. Khối này được đánh dấu "nổi bật" bằng
            ★ + nhãn "Featured", và bằng nền `--bg-card` nay đã SÁNG HƠN nền
            trang một bậc thấy rõ (bảng màu mới, xem chú thích đầu file) — trước
            kia `#242526` trên `#18191a` gần như không phân biệt được. Muốn nhấn
            thêm thì nhấn TRONG khối, đừng kẻ ngang toàn trang. */}
        <section className="border-y border-[var(--border-color)] bg-[var(--bg-card)]">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
              <span className="text-[var(--accent-color)]">★</span> Featured — the front door
            </p>
            <div className="mt-5 flex flex-col gap-9 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-balance font-editorial text-[1.95rem] font-semibold leading-[1.14] tracking-[-0.01em] sm:text-[2.6rem]">
                  Drive into the site instead of clicking through it
                </h2>
                {/* ⚠️ ĐỪNG bỏ ghi công ở NƠI KHÁC.
                    Câu "Built on Bruno Simon's open-source folio-2025" từng nằm
                    ở đây, đã bỏ theo yêu cầu — trang chủ không phải chỗ đặt ghi
                    công, và giấy phép MIT không đòi nó phải ở đây.
                    Phần BẮT BUỘC vẫn đang chạy, đã kiểm trong bản dựng:
                      · `sources/data/consoleLog.js` — khối Credits in ra console,
                        có nguyên văn "Bruno Simon - Copyright (c) 2025, MIT"
                      · hộp "Behind the scene" — mục "Original project" + link MIT
                      · `playground-3d/license.md` + `ATTRIBUTION.md` trong kho mã
                    Gỡ bất kỳ cái nào trong ba cái đó là VI PHẠM giấy phép. */}
                <p className="mt-5 max-w-[56ch] leading-relaxed text-[var(--text-secondary)]">
                  A 3D island you steer around. Every gate opens a part of CuongThai; smash a brick
                  wall and it hands you an English vocabulary question.
                </p>
                <p className="mt-3 text-sm text-[var(--text-muted)]">
                  Runs on your own graphics card — we&rsquo;ll tell you what that means before you
                  go in.
                </p>
              </div>

              <PlaygroundGate className="group shrink-0 rounded-lg border border-[var(--text-primary)] bg-[var(--text-primary)] px-6 py-3.5 text-sm font-semibold text-[var(--bg-primary)] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]">
                <span className="inline-flex items-center gap-2">
                  Explore CuongThai in 3D
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </PlaygroundGate>
            </div>
          </div>
        </section>

        {/* ── Deep Dives — chèn GIỮA dải nổi bật và rail 01, đúng chỗ user
            chỉ định. Đánh số 00 nên nó đứng trước 01/02/03 mà không phá
            mạch đếm của ba dải. */}
        <DeepDives />

        {/* ── Các dải nội dung ────────────────────────────────────────────
            Đây là phần "index" của Ecosystem Index: bày ra để duyệt, mỗi mục là
            một đường vào thật. */}
        {RAILS.map((rail) => (
          <section key={rail.label} className="border-b border-[var(--border-color)]">
            <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
              <div className="max-w-2xl">
                <p className="flex flex-wrap items-baseline gap-x-3 font-mono text-[11px] uppercase tracking-[0.22em]">
                  {/* Số thứ tự là chỗ DUY NHẤT trong dải dùng màu nhấn. Một điểm
                      màu cho mỗi phần — đủ để mắt bắt được nhịp, không đủ để
                      thành trang trí. Dùng `--accent-color` (nay là hổ phách,
                      định nghĩa trong `.landing-root`), không gán hex, để còn
                      đổi theo chế độ sáng/tối. */}
                  <span className="text-[var(--accent-color)]">{rail.index}</span>
                  <span className="text-[var(--text-muted)]">{rail.label}</span>
                  {/* Đếm từ chính mảng đang vẽ — không gõ tay, không lệch khi
                      thêm bớt mục. Luật 4: mọi con số phải đếm được. */}
                  <span aria-hidden className="text-[var(--border-color)]">/</span>
                  <span className="text-[var(--text-muted)]">{rail.items.length} entries</span>
                </p>
                <h2 className="mt-3.5 text-balance font-editorial text-[1.65rem] font-semibold leading-[1.14] tracking-[-0.01em] sm:text-[2.2rem]">
                  {rail.title}
                </h2>
                <p className="mt-3.5 max-w-[58ch] leading-relaxed text-[var(--text-secondary)]">
                  {rail.blurb}
                </p>
              </div>

              {/* Lưới hai cột, đường kẻ mảnh giữa các mục — kiểu mục lục sách,
                  không phải thẻ bo góc đổ bóng. */}
              <ul className="mt-10 grid gap-x-12 sm:grid-cols-2">
                {rail.items.map((it) => (
                  <li key={it.href} className="border-t border-[var(--border-color)]">
                    <Link
                      href={it.href}
                      className="group relative flex items-baseline gap-4 py-[1.15rem] pl-0 transition-[padding,background-color] duration-200 hover:bg-[var(--bg-surface-hover)] hover:pl-3.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent-color)]"
                    >
                      {/* Vạch nhấn trượt vào ở mép trái khi hover. Đây là thứ
                          thay cho `hover:scale` và `hover:-translate-y` — nó chỉ
                          ĐÁNH DẤU dòng đang trỏ tới chứ không làm cả hàng nhảy,
                          nên đọc bảng mục lục không bị giật. Chỉ chạy scale-Y
                          (transform), không đụng layout. */}
                      <span
                        aria-hidden
                        className="absolute bottom-2 left-0 top-2 w-[2px] origin-center scale-y-0 bg-[var(--accent-color)] transition-transform duration-200 group-hover:scale-y-100"
                      />
                      <span className="font-heading text-[15px] font-semibold tracking-[-0.01em] transition-colors group-hover:text-[var(--accent-color)]">
                        {it.name}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--text-muted)]">
                        {it.note}
                      </span>
                      <span
                        aria-hidden
                        className="text-[var(--text-muted)] transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--accent-color)]"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}

        {/* ── Chân trang ──────────────────────────────────────────────────
            Một dòng. Không bốn cột link, không hàng icon mạng xã hội — đó là
            "the AI footer" trong danh sách dấu hiệu. */}
        <footer className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
            <p>Built and written by CuongHoang.</p>
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/about" className="transition-colors hover:text-[var(--text-primary)]">
                About
              </Link>
              <Link
                href="/tech-trends"
                className="transition-colors hover:text-[var(--text-primary)]"
              >
                Writing
              </Link>
              <Link href="/register" className="transition-colors hover:text-[var(--text-primary)]">
                Create an account
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
