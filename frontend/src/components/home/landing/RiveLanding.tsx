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
 * 5. Màu lấy từ token của site (`var(--text-primary)`…) để trang chủ đổi theo
 *    chế độ sáng/tối như phần còn lại. Không gán mã hex thẳng vào lớp.
 */
import Link from 'next/link';
import PlaygroundGate from './PlaygroundGate';
import { useLandingStats, fmt } from './useLandingStats';

/** Một dải nội dung: nhãn + tiêu đề + các mục đi vào. */
interface Rail {
  label: string;
  title: string;
  blurb: string;
  items: { name: string; href: string; note: string }[];
}

const RAILS: Rail[] = [
  {
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
    label: 'Practice & play',
    title: 'Where it stops being theory',
    blurb: 'Rehearse under pressure, then go somewhere that has nothing to do with work.',
    items: [
      { name: 'Interview', href: '/interview', note: 'Mock interviews, graded out loud' },
      { name: 'Tech Trends', href: '/tech-trends', note: 'What actually shipped this week' },
      { name: 'Forum', href: '/forum', note: 'Ask, argue, help' },
      { name: 'Games', href: '/games', note: 'Short games, real leaderboards' },
      { name: 'Music', href: '/music', note: 'Listen together' },
      { name: 'Feed', href: '/feed', note: 'What people are posting' },
    ],
  },
];

export default function RiveLanding() {
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
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* ── Mở đầu ────────────────────────────────────────────────────────
          Lề trái, không căn giữa, không huy hiệu, không gradient. Một câu nói
          rõ đây là cái gì, rồi đi thẳng vào nội dung. */}
      <header className="mx-auto max-w-5xl px-5 pb-14 pt-24 sm:px-8 sm:pt-32">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
          CuongThai — learning platform
        </p>
        <h1 className="mt-5 max-w-3xl font-heading text-[2.6rem] font-bold leading-[1.06] tracking-tight sm:text-6xl">
          Everything I know about building software, written down and made
          practisable.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]">
          Curricula, graded exercises, past exam papers, language study and the tools that go with
          them. Free to read. Nothing here is a placeholder.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2.5">
          <Link
            href="/code-lab"
            className="rounded-lg bg-[var(--text-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--bg-primary)] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]"
          >
            Start with an exercise
          </Link>
          <Link
            href="/roadmap"
            className="rounded-lg border border-[var(--border-color)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--text-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]"
          >
            Or see what to learn first
          </Link>
        </div>

        {/* Số liệu đếm thật, viết như một dòng chú thích chứ không phải thẻ số
            khổng lồ phát sáng. Chưa tải xong thì cả dòng không hiện. */}
        {counts.length > 0 && (
          <dl className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-[var(--border-color)] pt-6">
            {counts.map((c) => (
              <div key={c.label}>
                <dt className="sr-only">{c.label}</dt>
                <dd>
                  <span className="font-heading text-xl font-bold tabular-nums">{fmt(c.n!)}</span>{' '}
                  <span className="text-sm text-[var(--text-muted)]">{c.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      {/* ── Sân chơi 3D — mục nổi bật ─────────────────────────────────────
          Đặt ngay dưới phần mở đầu vì đây là thứ khác biệt nhất của site, và
          cũng là thứ khách sẽ nhớ. Bấm vào KHÔNG đi thẳng: `PlaygroundGate` mở
          hộp thoại cảnh báo dùng GPU máy khách + nặng ~35MB trước đã. */}
      <section className="border-y border-[var(--border-color)] bg-[var(--bg-card)]">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
            Featured — the front door
          </p>
          <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl font-bold leading-tight sm:text-4xl">
                Drive into the site instead of clicking through it
              </h2>
              {/* ⚠️ ĐỪNG bỏ ghi công ở NƠI KHÁC.
                  Câu "Built on Bruno Simon's open-source folio-2025" từng nằm ở
                  đây, đã bỏ theo yêu cầu — trang chủ không phải chỗ đặt ghi
                  công, và giấy phép MIT không đòi nó phải ở đây.
                  Phần BẮT BUỘC vẫn đang chạy, đã kiểm trong bản dựng:
                    · `sources/data/consoleLog.js` — khối Credits in ra console,
                      có nguyên văn "Bruno Simon - Copyright (c) 2025, MIT"
                    · hộp "Behind the scene" — mục "Original project" + link MIT
                    · `playground-3d/license.md` + `ATTRIBUTION.md` trong kho mã
                  Gỡ bất kỳ cái nào trong ba cái đó là VI PHẠM giấy phép. */}
              <p className="mt-4 text-[var(--text-secondary)]">
                A 3D island you steer around. Every gate opens a part of CuongThai; smash a brick wall
                and it hands you an English vocabulary question.
              </p>
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                Runs on your own graphics card — we&rsquo;ll tell you what that means before you go in.
              </p>
            </div>

            <PlaygroundGate className="group shrink-0 rounded-lg border border-[var(--text-primary)] bg-[var(--text-primary)] px-6 py-3.5 text-sm font-semibold text-[var(--bg-primary)] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]">
              <span className="inline-flex items-center gap-2">
                Explore CuongThai in 3D
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </PlaygroundGate>
          </div>
        </div>
      </section>

      {/* ── Các dải nội dung ──────────────────────────────────────────────
          Đây là phần "index" của Ecosystem Index: bày ra để duyệt, mỗi mục là
          một đường vào thật. */}
      {RAILS.map((rail) => (
        <section key={rail.label} className="border-b border-[var(--border-color)]">
          <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
            <div className="max-w-2xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {rail.label}
              </p>
              <h2 className="mt-3 font-heading text-2xl font-bold leading-tight sm:text-3xl">
                {rail.title}
              </h2>
              <p className="mt-3 text-[var(--text-secondary)]">{rail.blurb}</p>
            </div>

            {/* Lưới hai cột, đường kẻ mảnh giữa các mục — kiểu mục lục sách,
                không phải thẻ bo góc đổ bóng. */}
            <ul className="mt-9 grid gap-x-10 sm:grid-cols-2">
              {rail.items.map((it) => (
                <li key={it.href} className="border-t border-[var(--border-color)]">
                  <Link
                    href={it.href}
                    className="group flex items-baseline gap-4 py-4 transition-colors hover:bg-[var(--bg-surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent-color)]"
                  >
                    <span className="font-heading text-base font-semibold">{it.name}</span>
                    <span className="min-w-0 flex-1 truncate text-sm text-[var(--text-muted)]">
                      {it.note}
                    </span>
                    <span
                      aria-hidden
                      className="text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5"
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

      {/* ── Chân trang ────────────────────────────────────────────────────
          Một dòng. Không bốn cột link, không hàng icon mạng xã hội — đó là
          "the AI footer" trong danh sách dấu hiệu. */}
      <footer className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
          <p>Built and written by CuongHoang.</p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/about" className="transition-colors hover:text-[var(--text-primary)]">
              About
            </Link>
            <Link href="/tech-trends" className="transition-colors hover:text-[var(--text-primary)]">
              Writing
            </Link>
            <Link href="/register" className="transition-colors hover:text-[var(--text-primary)]">
              Create an account
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
