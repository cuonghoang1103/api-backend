'use client';

/**
 * /about/bao-mat — Bảo mật & Tuân thủ (trust center) cho studio nhận dự án.
 *
 * Trả lời sẵn các câu trong bảng đánh giá nhà cung cấp (vendor security
 * questionnaire) mà công ty lớn gửi trước khi ký. Dữ liệu + nguồn kiểm ở
 * `content.ts` — ⛔ chỉ ghi thứ kiểm được trong repo, không hứa thứ chưa có.
 *
 * Theme tối qua `html.theme-dark` (token `--s-*` của studio.module.css), KHÔNG `dark:`.
 */
import { Download, FileText, ShieldCheck } from 'lucide-react';
import {
  Bullets,
  NextStep,
  Section,
  SectionHeader,
  STUDIO_EMAIL,
  StudioShell,
  T,
  studioCss,
  useStudioLang,
} from '@/components/studio/StudioUI';
import {
  AI_POINTS,
  DISCLOSURE,
  FAQ,
  FILE_TRA_LOI,
  GAPS,
  HANDLING,
  LAWS,
  LEGAL_DISCLAIMER,
  PRACTICES,
  PRACTICE_LINKS,
  SUBPROCESSORS,
  SUBPROCESSOR_NOTE,
  type Bi,
} from './content';

const TOC: { id: string; label: Bi }[] = [
  { id: 'du-lieu', label: ['Dữ liệu của khách', 'Client data'] },
  { id: 'ky-thuat', label: ['Thực hành kỹ thuật', 'Technical practice'] },
  { id: 'ben-xu-ly-phu', label: ['Bên xử lý phụ', 'Sub-processors'] },
  { id: 'ai', label: ['AI & dữ liệu', 'AI & data'] },
  { id: 'chua-co', label: ['Chưa có', 'Not yet in place'] },
  { id: 'cau-hoi', label: ['Câu hỏi đánh giá', 'Questionnaire'] },
  { id: 'bao-lo-hong', label: ['Báo lỗ hổng', 'Report a vulnerability'] },
];

function DocLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--s-ink)] underline decoration-[color:var(--s-accent)] underline-offset-[3px] hover:decoration-2"
    >
      <FileText aria-hidden className="w-4 h-4 shrink-0 text-[color:var(--s-accent)]" />
      <span className="min-w-0 break-words">{children}</span>
    </a>
  );
}

export default function BaoMatClient() {
  const { lang, L } = useStudioLang();
  const p = (b: Bi) => b[lang === 'en' ? 1 : 0];

  return (
    <StudioShell step={2}>
      {/* ─── Mở đầu ─────────────────────────────────────────────────── */}
      <header className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <p className={`${T.label} inline-flex items-center gap-2`}>
            <ShieldCheck aria-hidden className="w-4 h-4" />
            {L('Bảo mật & Tuân thủ', 'Security & Compliance')}
          </p>
          <h1 className={`${T.display} mt-4 max-w-[20ch]`}>
            {L('Trả lời trước những câu bạn sẽ hỏi trước khi ký', 'Answers to what you will ask before signing')}
          </h1>
          <p className={`${T.lead} mt-6 max-w-[62ch]`}>
            {L(
              'Trước khi ký, doanh nghiệp thường gửi bảng câu hỏi đánh giá nhà cung cấp. Trang này trả lời sẵn — và chỉ ghi những gì đang thật sự áp dụng. Thứ chưa có được ghi ở mục riêng, kèm cách bù.',
              'Before signing, companies usually send a vendor security questionnaire. This page answers it up front — and lists only what is actually in place. What is not in place has its own section, with how it is offset.',
            )}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={FILE_TRA_LOI} download className={T.btnPrimary}>
              <Download aria-hidden className="w-4 h-4" />
              {L('Tải bảng trả lời (.md)', 'Download answers (.md)')}
            </a>
            <a href="#bao-lo-hong" className={T.btnGhost}>
              {L('Báo lỗ hổng', 'Report a vulnerability')}
            </a>
          </div>
          <nav aria-label={L('Mục lục', 'Contents')} className="mt-10">
            <ol className="flex flex-wrap gap-2">
              {TOC.map((t, i) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--s-line)] px-3 py-1.5 text-[0.8rem] text-[color:var(--s-body)] hover:border-[color:var(--s-ink)] hover:text-[color:var(--s-ink)] transition-colors"
                  >
                    <span className="tabular-nums text-[color:var(--s-accent)] font-semibold">{i + 1}</span>
                    {p(t.label)}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </header>

      {/* ─── 1. Dữ liệu của khách ───────────────────────────────────── */}
      <Section id="du-lieu" band>
        <SectionHeader
          label={L('1 · Dữ liệu của khách', '1 · Client data')}
          title={L('Cách dữ liệu của bạn được xử lý trong dự án', 'How your data is handled in a project')}
          lead={L(
            'Ký trước, nhận dữ liệu sau. Dùng ít nhất có thể. Trả lại và xoá khi kết thúc — có biên bản.',
            'Sign first, receive data after. Use as little as possible. Return and delete at the end — with a signed record.',
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {HANDLING.map((h) => (
            <article key={h.title[0]} className={`${T.card} p-5 sm:p-6 min-w-0`}>
              <h3 className={T.h3}>{p(h.title)}</h3>
              <p className={`${T.body} mt-2`}>{p(h.body)}</p>
              {h.link && (
                <p className="mt-4">
                  <DocLink href={h.link.href}>{p(h.link.label)}</DocLink>
                </p>
              )}
            </article>
          ))}
        </div>

        <h3 className={`${T.h3} mt-12`}>{L('Căn cứ pháp lý tại Việt Nam', 'Vietnamese legal basis')}</h3>
        <ul className="mt-4 divide-y divide-[color:var(--s-line)] border-y border-[color:var(--s-line)]">
          {LAWS.map((l) => (
            <li key={l.name[0]} className="py-4 grid gap-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-8">
              <p className="font-semibold text-[color:var(--s-ink)] text-[0.95rem] min-w-0">{p(l.name)}</p>
              <p className={`${T.body} min-w-0`}>{p(l.note)}</p>
            </li>
          ))}
        </ul>
        <p className={`${T.small} mt-4 max-w-[70ch]`}>{p(LEGAL_DISCLAIMER)}</p>
      </Section>

      {/* ─── 2. Thực hành kỹ thuật ──────────────────────────────────── */}
      <Section id="ky-thuat">
        <SectionHeader
          label={L('2 · Thực hành kỹ thuật', '2 · Technical practice')}
          title={L('Đang chạy thật trên sản phẩm của studio', 'Running today on the studio’s own product')}
          lead={L(
            'Mô tả ở mức nguyên tắc. Địa chỉ máy chủ, cổng, tên cấu hình và chi tiết tường lửa cố ý không công bố — có thể trình bày trực tiếp cho đội bảo mật của khách theo NDA.',
            'Described at the level of principle. Server addresses, ports, config names and firewall details are deliberately not published — they can be walked through with the client’s security team under NDA.',
          )}
        />
        <div className="grid gap-10 lg:grid-cols-2">
          {PRACTICES.map((g) => (
            <div key={g.group[0]} className="min-w-0">
              <p className={`${T.label} mb-3`}>{p(g.group)}</p>
              <dl className="space-y-5">
                {g.items.map((it) => (
                  <div key={it.t[0]} className="border-l-2 border-[color:var(--s-accent)] pl-4">
                    <dt className={T.h3}>{p(it.t)}</dt>
                    <dd className={`${T.body} mt-1`}>{p(it.d)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
          {PRACTICE_LINKS.map((d) => (
            <DocLink key={d.href} href={d.href}>
              {p(d.label)}
            </DocLink>
          ))}
        </div>
      </Section>

      {/* ─── 3. Bên xử lý phụ ───────────────────────────────────────── */}
      <Section id="ben-xu-ly-phu" band>
        <SectionHeader
          label={L('3 · Bên xử lý phụ', '3 · Sub-processors')}
          title={L('Những bên dữ liệu có thể đi qua', 'Where data may pass through')}
          lead={p(SUBPROCESSOR_NOTE)}
        />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SUBPROCESSORS.map((sp) => (
            <li key={sp.name} className={`${T.card} p-5 min-w-0`}>
              <p className="font-semibold text-[color:var(--s-ink)] break-words">{sp.name}</p>
              <p className={`${T.body} mt-1.5`}>{p(sp.use)}</p>
              <p className={`${T.small} mt-3`}>
                <span className="font-semibold text-[color:var(--s-ink-2)]">{L('Dữ liệu: ', 'Data: ')}</span>
                {p(sp.data)}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ─── 4. AI & dữ liệu ────────────────────────────────────────── */}
      <Section id="ai">
        <SectionHeader
          label={L('4 · AI & dữ liệu', '4 · AI & data')}
          title={L('Dữ liệu và mô hình ngôn ngữ', 'Data and language models')}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {AI_POINTS.map((a) => (
            <article key={a.t[0]} className={`${T.card} p-5 sm:p-6 min-w-0`}>
              <h3 className={T.h3}>{p(a.t)}</h3>
              <p className={`${T.body} mt-2`}>{p(a.d)}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* ─── 5. Chưa có ─────────────────────────────────────────────── */}
      <Section id="chua-co" band>
        <SectionHeader
          label={L('5 · Nói thẳng', '5 · Plainly stated')}
          title={L('Những gì studio CHƯA có', 'What the studio does NOT have yet')}
          lead={L(
            'Biết trước để quyết định đúng. Mỗi dòng kèm cách bù đang dùng.',
            'Better known up front. Each line comes with how it is offset today.',
          )}
        />
        <div className={studioCss.tableWrap}>
          <table className={studioCss.table}>
            <thead>
              <tr>
                <th scope="col">{L('Chưa có', 'Not in place')}</th>
                <th scope="col">{L('Cách bù', 'How it is offset')}</th>
              </tr>
            </thead>
            <tbody>
              {GAPS.map((g) => (
                <tr key={g.gap[0]}>
                  <td className="font-semibold text-[color:var(--s-ink)]">{p(g.gap)}</td>
                  <td>{p(g.offset)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ─── 6. Câu hỏi đánh giá nhà cung cấp ───────────────────────── */}
      <Section id="cau-hoi">
        <SectionHeader
          label={L('6 · Đánh giá nhà cung cấp', '6 · Vendor assessment')}
          title={L('Câu hỏi thường gặp', 'Common questions')}
          lead={
            <>
              <p>
                {L(
                  'Bản đầy đủ dạng Markdown để dán vào bảng câu hỏi của bạn hoặc gửi cho bộ phận mua hàng.',
                  'The full version as Markdown, to paste into your questionnaire or send to procurement.',
                )}
              </p>
              <a href={FILE_TRA_LOI} download className={`${T.btnGhost} mt-4`}>
                <Download aria-hidden className="w-4 h-4" />
                {L('Bảng trả lời đánh giá nhà cung cấp', 'Vendor assessment answers')}
              </a>
            </>
          }
        />
        <div className="divide-y divide-[color:var(--s-line)] border-y border-[color:var(--s-line)]">
          {FAQ.map((f) => (
            <details key={f.q[0]} className="group py-4">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-[color:var(--s-ink)] [&::-webkit-details-marker]:hidden">
                <span className="min-w-0">{p(f.q)}</span>
                <span aria-hidden className="shrink-0 text-[color:var(--s-accent)] transition-transform group-open:rotate-45 text-lg leading-none">
                  +
                </span>
              </summary>
              <p className={`${T.body} mt-3 max-w-[75ch]`}>{p(f.a)}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* ─── 7. Báo lỗ hổng ─────────────────────────────────────────── */}
      <Section id="bao-lo-hong" band>
        <SectionHeader
          label={L('7 · Báo lỗ hổng', '7 · Responsible disclosure')}
          title={L('Thấy lỗ hổng? Báo riêng cho studio', 'Found a vulnerability? Tell the studio privately')}
          lead={
            <>
              <p>
                {L('Gửi email tới ', 'Email ')}
                <a
                  href={`mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent('[Bảo mật] Báo lỗ hổng')}`}
                  className="font-semibold text-[color:var(--s-ink)] underline decoration-[color:var(--s-accent)] underline-offset-[3px] break-all"
                >
                  {STUDIO_EMAIL}
                </a>
                {L(' với tiêu đề bắt đầu bằng [Bảo mật].', ' with a subject starting with [Security].')}
              </p>
              <p className="mt-3">
                {L('Thông tin máy đọc được: ', 'Machine-readable: ')}
                <a
                  href="/.well-known/security.txt"
                  className="font-semibold text-[color:var(--s-ink)] underline decoration-[color:var(--s-accent)] underline-offset-[3px]"
                >
                  /.well-known/security.txt
                </a>
              </p>
            </>
          }
        />
        <Bullets items={DISCLOSURE.map(p)} className="max-w-[75ch]" />
      </Section>

      <NextStep
        href="/about/nhan-du-an"
        step={L('Tiếp theo', 'Next')}
        title={L('Sẵn sàng bàn về dự án?', 'Ready to talk about a project?')}
        desc={L(
          'Gửi yêu cầu — NDA được ký trước khi bạn chia sẻ bất kỳ dữ liệu nội bộ nào.',
          'Send a request — the NDA is signed before you share any internal data.',
        )}
        cta={L('Gửi yêu cầu dự án', 'Start a project')}
      />
    </StudioShell>
  );
}
