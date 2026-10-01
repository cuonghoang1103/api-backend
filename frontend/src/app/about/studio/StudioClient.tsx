'use client';

/**
 * /about/studio — BƯỚC 1/3 của luồng "Studio doanh nghiệp": Giới thiệu.
 *
 * ⛔ Cùng luật với /about (đọc đầu `app/about/page.tsx`): mọi con số phải ĐẾM
 * ĐƯỢC từ đúng hai nguồn — `useAboutStats()` (DB) và `codebaseStats.json`
 * (sinh lúc deploy). Không đếm được ⇒ ẨN ô đó, không thay bằng 0.
 * Không số khách, không logo khách, không lời khen, không "N năm kinh nghiệm".
 * Mô tả sản phẩm lấy từ chính repo (README, package.json), không phóng đại.
 */
import Link from 'next/link';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { useAboutStats, fmt } from '@/components/about/useAboutData';
import codebase from '@/data/codebaseStats.json';
import {
  Bullets,
  NextStep,
  Section,
  SectionHeader,
  STUDIO_EMAIL,
  StudioShell,
  T,
  useStudioLang,
} from '@/components/studio/StudioUI';

type Bi = readonly [string, string];

interface Product {
  id: string;
  name: string;
  kind: Bi;
  what: Bi;
  stack: string[];
  status: Bi;
  href?: string;
  linkLabel?: Bi;
  external?: boolean;
}

/** Sản phẩm THẬT, mô tả theo README / package.json của repo. */
const PRODUCTS: Product[] = [
  {
    id: 'site',
    name: 'cuongthai.com',
    kind: ['Nền tảng học tập song ngữ', 'Bilingual learning platform'],
    what: [
      'Khoá học, gia sư AI đọc phụ đề bài giảng và trích dẫn mốc thời gian, phòng thi, code lab, kèm ứng dụng desktop và iOS dùng chung một API.',
      'Courses, an AI tutor that reads lecture transcripts and cites timestamps, an exam room and a code lab, with desktop and iOS apps on the same API.',
    ],
    stack: ['Next.js', 'Express', 'TypeScript', 'PostgreSQL', 'Prisma', 'Docker', 'nginx', 'Cloudflare R2'],
    status: ['Đang chạy production trên VPS tự quản trị', 'In production on a self-administered VPS'],
    href: '/',
    linkLabel: ['Mở trang chủ', 'Open the site'],
  },
  {
    id: 'ctwork',
    name: 'CT Work',
    kind: ['Quản lý dự án kiểu Jira', 'Jira-style project management'],
    what: [
      'Board, backlog, sprint, báo cáo burndown/velocity, quản lý kiểm thử và trợ lý AI. Đây là công cụ chạy dự án khách hàng theo quy trình ở bước 3 — khách theo dõi tiến độ qua link chia sẻ.',
      'Boards, backlog, sprints, burndown/velocity reports, test management and an AI assistant. It runs client projects through the process in step 3 — clients follow progress via a share link.',
    ],
    stack: ['Next.js', 'Express', 'PostgreSQL', 'WebSocket'],
    status: ['Đang dùng hằng ngày', 'In daily use'],
    href: '/work',
    linkLabel: ['Mở CT Work', 'Open CT Work'],
  },
  {
    id: 'desktop',
    name: 'CuongThai Desktop',
    kind: ['Ứng dụng máy tính', 'Desktop app'],
    what: [
      'Ứng dụng Electron cho macOS, Windows và Linux, tự cập nhật qua GitHub Releases; có công cụ lập trình AI làm việc trên thư mục dự án của người dùng.',
      'An Electron app for macOS, Windows and Linux with auto-update via GitHub Releases, including an AI coding tool that works on the user’s project folder.',
    ],
    stack: ['Electron', 'React', 'TypeScript'],
    status: ['Phát hành công khai, tự cập nhật', 'Publicly released, auto-updating'],
    href: '/download',
    linkLabel: ['Trang tải về', 'Download page'],
  },
  {
    id: 'ios',
    name: 'CuongThai iOS',
    kind: ['Ứng dụng iPhone & iPad', 'iPhone & iPad app'],
    what: [
      'Ứng dụng SwiftUI đồng bộ với cuongthai.com: học theo ngành, vở viết tay trên iPad, thư viện sách.',
      'A SwiftUI app synced with cuongthai.com: study by major, handwritten notebooks on iPad, a book library.',
    ],
    stack: ['SwiftUI', 'Swift'],
    status: ['Phát hành thử nghiệm qua TestFlight', 'Shipped to TestFlight'],
  },
  {
    id: 'labflow',
    name: 'LabFlow AI',
    kind: ['Đồ án tốt nghiệp', 'Graduation project'],
    what: [
      'Hệ thống đặt phòng lab và mượn thiết bị (đồ án SWP391 → SEP490, Đại học FPT). Được lên kế hoạch và quản lý theo đúng quy trình trên trang này: yêu cầu, cổng chất lượng, hồ sơ bảo vệ — tất cả nằm trên CT Work.',
      'A lab and equipment booking system (SWP391 → SEP490 capstone, FPT University), planned and run with the very process on this site: requirements, quality gates, defence documents — all on CT Work.',
    ],
    stack: ['Java 21', 'Spring Boot 3', 'React', 'PostgreSQL', 'ESP32'],
    status: ['Kế hoạch 20 tuần, bắt đầu 05/10/2026', '20-week plan starting 5 Oct 2026'],
    href: '/projects/labflow-ai',
    linkLabel: ['Xem hồ sơ dự án', 'Read the project file'],
  },
];

const CAPABILITIES: { area: Bi; items: string[]; note: Bi }[] = [
  {
    area: ['Web & giao diện', 'Web & front end'],
    items: ['Next.js (App Router)', 'React', 'TypeScript', 'Tailwind CSS', 'framer-motion'],
    note: ['Responsive từ 360px, sáng/tối, song ngữ.', 'Responsive from 360px, light/dark, bilingual.'],
  },
  {
    area: ['Backend & dữ liệu', 'Back end & data'],
    items: ['Node.js · Express', 'PostgreSQL', 'Prisma', 'pgvector', 'Redis', 'WebSocket'],
    note: ['Migration viết tay, có kiểm lệch schema trước khi triển khai.', 'Hand-written migrations, schema drift checked before deploy.'],
  },
  {
    area: ['Ứng dụng', 'Apps'],
    items: ['SwiftUI (iOS, iPadOS)', 'Electron (macOS, Windows, Linux)'],
    note: ['Một API chung cho web, desktop và di động.', 'One API shared by web, desktop and mobile.'],
  },
  {
    area: ['Hạ tầng & vận hành', 'Infrastructure & operations'],
    items: ['Docker', 'GHCR', 'nginx', 'Cloudflare', 'Linux VPS', 'GitHub Actions'],
    note: ['Build ở máy riêng, máy chủ chỉ kéo ảnh và tráo; có smoke-test sau mỗi lần triển khai.', 'Images built off-server; the server only pulls and swaps, with a smoke test after every deploy.'],
  },
  {
    area: ['AI & LLM', 'AI & LLM'],
    items: ['Cổng LLM nhiều nhà cung cấp', 'Định tuyến model theo việc', 'RAG', 'Trần chi phí theo ngày'],
    note: ['Chọn model bằng đo thật (giá, độ trễ, đúng/sai), không theo bảng giá niêm yết.', 'Models chosen by measurement (cost, latency, accuracy), not list prices.'],
  },
];

const PRINCIPLES: { title: Bi; body: Bi }[] = [
  {
    title: ['Tiến độ nhìn thấy được', 'Progress you can see'],
    body: [
      'Mỗi dự án có một board chung trên CT Work và báo cáo hằng tuần: đã xong gì, tuần tới làm gì, rủi ro nào, cần bạn quyết gì.',
      'Every project has a shared CT Work board and a weekly report: what’s done, what’s next, which risks, which decisions we need from you.',
    ],
  },
  {
    title: ['Có tài liệu ở mọi bước', 'Documents at every step'],
    body: [
      'Mỗi giai đoạn kết thúc bằng tài liệu bàn giao và một cổng chất lượng có điều kiện rõ ràng — không sang bước sau bằng cảm giác.',
      'Each stage ends with a deliverable and a quality gate with explicit criteria — no moving on by feel.',
    ],
  },
  {
    title: ['Bàn giao trọn vẹn', 'A complete handover'],
    body: [
      'Mã nguồn, quyền truy cập, tài liệu vận hành và hướng dẫn sử dụng thuộc về bạn. Không giữ lại thứ gì để bạn phụ thuộc.',
      'Source code, access rights, runbooks and user guides are yours. Nothing is held back to keep you dependent.',
    ],
  },
  {
    title: ['Ghi lại sự cố thật', 'Real incidents, written down'],
    body: [
      'Nhật ký vận hành của cuongthai.com ghi từng sự cố production — nguyên nhân thật và chốt kiểm đã thêm để nó không lặp lại. Dự án của bạn được vận hành theo cùng thói quen đó.',
      'The cuongthai.com operations log records every production incident — the real cause and the check added so it can’t recur. Your project is run with the same habit.',
    ],
  },
];

/** `stageCount` do page.tsx (server) đếm từ data.ts — để data.ts (~200 KB) không vào gói JS của trang này. */
export default function StudioClient({ stageCount }: { stageCount: number }) {
  const { lang, L } = useStudioLang();
  const stats = useAboutStats();
  const n = (v: number | null | undefined) => fmt(v, lang);
  const p = (b: Bi) => (lang === 'en' ? b[1] : b[0]);

  // Ngày cập nhật số liệu mã nguồn — hiện kèm để người đọc biết số "của hôm nào".
  const codeDate = new Date(codebase.generatedAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'vi-VN');

  const codeRows: [string, number | null][] = [
    [L('Commit trong lịch sử Git', 'Git commits'), codebase.commits],
    [L('Trang web (route)', 'Web pages (routes)'), codebase.pages],
    [L('Nhóm API (router)', 'API routers'), codebase.apiRouters],
    [L('Bảng dữ liệu (Prisma model)', 'Data models (Prisma)'), codebase.prismaModels],
    [L('Migration cơ sở dữ liệu', 'Database migrations'), codebase.migrations],
    [L('Dòng mã nguồn', 'Lines of source code'), codebase.sourceLines],
  ];
  const contentRows: [string, number | null][] = [
    [L('Khoá học', 'Courses'), stats?.courses ?? null],
    [L('Bài học', 'Lessons'), stats?.lessons ?? null],
    [L('Bài tập lập trình', 'Coding exercises'), stats?.exercises ?? null],
    [L('Câu hỏi thi', 'Exam questions'), stats?.examQuestions ?? null],
    [L('Câu hỏi phỏng vấn', 'Interview questions'), stats?.interviewQuestions ?? null],
  ];

  return (
    <StudioShell step={1}>
      {/* ── Mở đầu ─────────────────────────────────────────────────────── */}
      <section className="pt-14 sm:pt-20 pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 items-start">
          <div className="min-w-0">
            <p className={T.label}>CuongHoang Studio</p>
            <h1 className={`${T.display} mt-4`}>
              {L('Phần mềm cho doanh nghiệp, làm có quy trình và bàn giao đến nơi.', 'Software for businesses, built to a process and handed over properly.')}
            </h1>
            <p className={`${T.lead} mt-6 max-w-[60ch]`}>
              {L(
                'Studio phần mềm độc lập do Cường (Cuong Hoang) — sinh viên Kỹ thuật phần mềm, Đại học FPT — dựng và vận hành. Studio làm web, ứng dụng di động, công cụ nội bộ và tích hợp AI; mỗi dự án đi qua các giai đoạn có tài liệu, có cổng chất lượng và có người chịu trách nhiệm rõ ràng.',
                'An independent software studio founded and run by Cường (Cuong Hoang), a Software Engineering student at FPT University. The studio builds web, mobile, internal tools and AI integrations; every project moves through documented stages, quality gates and clear ownership.',
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about/nhan-du-an" className={T.btnPrimary}>
                {L('Gửi yêu cầu dự án', 'Send a project request')}
              </Link>
              <Link href="/about/quy-trinh" className={T.btnGhost}>
                {L(`Xem quy trình ${stageCount} giai đoạn`, `See the ${stageCount}-stage process`)}
              </Link>
            </div>
          </div>

          {/* Hồ sơ tóm tắt — chỉ những dòng kiểm chứng được */}
          <aside className={`${T.card} p-6 sm:p-7 min-w-0`} aria-label={L('Hồ sơ tóm tắt', 'Studio profile')}>
            <p className={T.h3}>{L('Hồ sơ tóm tắt', 'Studio profile')}</p>
            <dl className="mt-5 divide-y divide-[color:var(--s-line)] text-sm">
              {[
                [L('Hình thức', 'Type'), L('Studio phần mềm độc lập', 'Independent software studio')],
                [L('Người phụ trách', 'Lead'), L('Cường — kỹ sư chính, chịu trách nhiệm toàn bộ dự án', 'Cường — lead engineer, accountable for the whole project')],
                [L('Quy mô', 'Size'), L('Một kỹ sư chính; mời thêm cộng sự theo vai khi dự án cần, ghi rõ trong đề xuất', 'One lead engineer; specialists join by role when a project needs them, named in the proposal')],
                [L('Sản phẩm đang vận hành', 'Running in production'), 'cuongthai.com'],
                [L('Tài liệu', 'Documents'), L('Tiếng Việt, kèm thuật ngữ tiếng Anh', 'Vietnamese, with English terminology')],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-3 py-3 first:pt-0">
                  <dt className="text-[color:var(--s-muted)]">{k}</dt>
                  <dd className="text-[color:var(--s-ink)] min-w-0">{v}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[8.5rem_1fr] gap-3 pt-3">
                <dt className="text-[color:var(--s-muted)]">{L('Liên hệ', 'Contact')}</dt>
                <dd className="min-w-0">
                  <a href={`mailto:${STUDIO_EMAIL}`} className="text-[color:var(--s-ink)] underline decoration-[color:var(--s-accent)] underline-offset-4 break-all">
                    {STUDIO_EMAIL}
                  </a>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      {/* ── Số liệu đếm được ──────────────────────────────────────────── */}
      <Section band>
        <SectionHeader
          label={L('Bằng chứng', 'Evidence')}
          title={L('Số liệu đếm từ sản phẩm thật', 'Numbers counted from a real product')}
          lead={L(
            'Không có con số nào trên trang này được gõ tay. Số mã nguồn đếm từ kho Git mỗi lần triển khai; số nội dung đếm trực tiếp từ cơ sở dữ liệu lúc bạn mở trang. Ô nào chưa đếm được thì không hiện.',
            'No number on this page is typed by hand. Code figures are counted from the Git repository at each deploy; content figures are counted live from the database when you open the page. Anything that can’t be counted is not shown.',
          )}
        />
        <div className="grid gap-6 md:grid-cols-2">
          <Register
            title={L('Mã nguồn cuongthai.com', 'cuongthai.com codebase')}
            note={L(`Đếm ngày ${codeDate}`, `Counted on ${codeDate}`)}
            rows={codeRows}
            fmt={n}
          />
          <Register
            title={L('Nội dung đang phục vụ người học', 'Content serving learners')}
            note={stats ? L('Đếm trực tiếp từ cơ sở dữ liệu', 'Counted live from the database') : L('Đang tải từ cơ sở dữ liệu…', 'Loading from the database…')}
            rows={contentRows}
            fmt={n}
          />
        </div>
      </Section>

      {/* ── Sản phẩm ──────────────────────────────────────────────────── */}
      <Section>
        <SectionHeader
          label={L('Sản phẩm', 'Work')}
          title={L('Đã làm và đang vận hành', 'Built and running')}
          lead={L(
            'Các sản phẩm dưới đây do studio thiết kế, lập trình, triển khai và tự vận hành. Đây là sản phẩm của chính studio, không phải dự án khách hàng.',
            'These products were designed, built, deployed and are operated by the studio itself. They are the studio’s own products, not client work.',
          )}
        />
        <ol className="border-t border-[color:var(--s-line)]">
          {PRODUCTS.map((pr) => (
            <li
              key={pr.id}
              className="grid gap-4 py-7 border-b border-[color:var(--s-line)] md:grid-cols-[minmax(0,4fr)_minmax(0,6fr)_minmax(0,3fr)] md:gap-8"
            >
              <div className="min-w-0">
                <p className={T.small}>{p(pr.kind)}</p>
                <h3 className="mt-1 font-editorial text-[1.5rem] leading-tight text-[color:var(--s-ink)]">{pr.name}</h3>
              </div>
              <div className="min-w-0">
                <p className={T.body}>{p(pr.what)}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={L('Công nghệ', 'Stack')}>
                  {pr.stack.map((t) => (
                    <li key={t} className="px-2 py-0.5 rounded text-[0.75rem] text-[color:var(--s-ink-2)] bg-[var(--s-band)] border border-[color:var(--s-line)]">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="min-w-0 flex flex-col gap-3 md:items-end md:text-right">
                <p className="text-sm text-[color:var(--s-ink)]">
                  <span aria-hidden className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--s-accent)] mr-2 align-middle" />
                  {p(pr.status)}
                </p>
                {pr.href && pr.linkLabel && (
                  <Link href={pr.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--s-ink)] hover:text-[color:var(--s-accent)]">
                    {p(pr.linkLabel)} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Năng lực ──────────────────────────────────────────────────── */}
      <Section band>
        <SectionHeader
          label={L('Năng lực', 'Capabilities')}
          title={L('Công nghệ đang dùng trong production', 'Technology in production today')}
          lead={L(
            'Chỉ liệt kê những gì đang chạy thật trong các sản phẩm ở trên. Công nghệ ngoài danh sách vẫn nhận được, nhưng sẽ ghi rõ là cần thời gian tìm hiểu trong đề xuất.',
            'Only what runs in the products above is listed. Other technology is possible, but the proposal will say plainly that it needs ramp-up time.',
          )}
        />
        <div className="grid gap-px rounded-xl overflow-hidden border border-[color:var(--s-line)] bg-[var(--s-line)] sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c) => (
            <div key={c.area[0]} className="bg-[var(--s-raise)] p-6 min-w-0">
              <h3 className={T.h3}>{p(c.area)}</h3>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-[color:var(--s-ink-2)]">{c.items.join(', ')}</p>
              <p className={`${T.small} mt-3`}>{p(c.note)}</p>
            </div>
          ))}
          <div className="bg-[var(--s-raise)] p-6 min-w-0 flex flex-col justify-between gap-4">
            <p className={T.body}>
              {L(
                'Nền tảng học thuật đi theo chương trình Kỹ thuật phần mềm: yêu cầu phần mềm, kiến trúc & thiết kế, kiểm thử, cơ sở dữ liệu.',
                'The academic foundation follows the Software Engineering curriculum: requirements, architecture & design, testing, databases.',
              )}
            </p>
            <Link href="/academy" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--s-ink)] hover:text-[color:var(--s-accent)]">
              {L('Xem các môn trên Academy', 'See the subjects on Academy')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ── Cách làm việc ─────────────────────────────────────────────── */}
      <Section>
        <SectionHeader
          label={L('Cách làm việc', 'How we work')}
          title={L('Bốn cam kết với mọi dự án', 'Four commitments on every project')}
        />
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
          {PRINCIPLES.map((pr, i) => (
            <div key={pr.title[0]} className="grid grid-cols-[2.25rem_1fr] gap-4 min-w-0">
              <span className="font-editorial text-[1.6rem] leading-none text-[color:var(--s-accent)] tabular-nums">{i + 1}</span>
              <div className="min-w-0">
                <h3 className={T.h3}>{p(pr.title)}</h3>
                <p className={`${T.body} mt-2`}>{p(pr.body)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={`${T.card} mt-14 p-6 sm:p-8 grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10`}>
          <div className="min-w-0">
            <h3 className="font-editorial text-[1.4rem] leading-tight text-[color:var(--s-ink)]">
              {L('Nói trước về quy mô', 'A word on size')}
            </h3>
          </div>
          <div className="min-w-0">
            <Bullets
              items={[
                L('Studio là một kỹ sư chính. Dự án cần nhiều vai cùng lúc (thiết kế UX chuyên sâu, kiểm thử bảo mật độc lập…) sẽ có cộng sự riêng cho từng vai, nêu tên và phạm vi trong đề xuất.', 'The studio is one lead engineer. Projects that need several roles at once (dedicated UX, independent security testing…) bring in specialists per role, named and scoped in the proposal.'),
                L('Nếu yêu cầu vượt năng lực hoặc thời hạn không khả thi, bạn sẽ nhận câu trả lời “không” kèm lý do ngay ở bước đánh giá — trước khi có bất kỳ cam kết nào.', 'If a request is beyond what we can deliver or the deadline isn’t feasible, you get a “no” with reasons at the assessment step — before any commitment.'),
                L('Không có danh sách khách hàng hay lời giới thiệu trên trang này. Thứ để bạn đánh giá là sản phẩm đang chạy, mã nguồn công khai và quy trình được viết ra đầy đủ.', 'There is no client list or testimonial here. What you can judge is the running product, the public code and a fully written-out process.'),
              ]}
            />
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <a href="https://github.com/cuonghoang1103" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[color:var(--s-ink)] hover:text-[color:var(--s-accent)]">
                <Github className="w-4 h-4" /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/cuong-hoang-843a37258/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[color:var(--s-ink)] hover:text-[color:var(--s-accent)]">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
              <a href={`mailto:${STUDIO_EMAIL}`} className="inline-flex items-center gap-2 text-[color:var(--s-ink)] hover:text-[color:var(--s-accent)]">
                <Mail className="w-4 h-4" /> Email
              </a>
              <Link href="/about" className="inline-flex items-center gap-2 text-[color:var(--s-ink)] hover:text-[color:var(--s-accent)]">
                {L('Trang cá nhân đầy đủ', 'Full personal page')}
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <NextStep
        href="/about/nhan-du-an"
        step={L('Bước 2 / 3', 'Step 2 of 3')}
        title={L('Nhận dự án', 'Start a project')}
        desc={L(
          'Dịch vụ, mô hình hợp tác, những gì bạn nhận khi bàn giao — và phiếu gửi yêu cầu dự án.',
          'Services, engagement models, what you receive at handover — and the project request form.',
        )}
        cta={L('Sang bước 2', 'Go to step 2')}
      />
    </StudioShell>
  );
}

/** Bảng "sổ đăng ký" số liệu: ẩn dòng không đếm được. */
function Register({
  title,
  note,
  rows,
  fmt: f,
}: {
  title: string;
  note: string;
  rows: [string, number | null][];
  fmt: (v: number | null | undefined) => string;
}) {
  const shown = rows.filter(([, v]) => typeof v === 'number');
  return (
    <div className={`${T.card} p-6 sm:p-7 min-w-0`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className={T.h3}>{title}</h3>
        <p className={T.small}>{note}</p>
      </div>
      {shown.length > 0 && (
        <dl className="mt-5">
          {shown.map(([k, v]) => (
            <div key={k} className="flex items-baseline gap-3 py-2.5 border-t border-[color:var(--s-line)]">
              <dt className="text-sm text-[color:var(--s-body)] min-w-0">{k}</dt>
              <span aria-hidden className="flex-1 border-b border-dotted border-[color:var(--s-line-strong)] translate-y-[-4px]" />
              <dd className="font-editorial text-[1.35rem] text-[color:var(--s-ink)] tabular-nums">{f(v)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
