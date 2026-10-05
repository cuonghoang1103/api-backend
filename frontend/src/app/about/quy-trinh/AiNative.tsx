'use client';

/**
 * Mục "Làm dự án với AI" trên /about/quy-trinh (#ai-native).
 * Dữ liệu + nguồn đã kiểm: `ai-native.ts`. Không có con số nào của báo cáo
 * SDAD trên trang này — chỉ khái niệm.
 */
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Section, SectionHeader, T } from '@/components/studio/StudioUI';
import { DOCS, PHASES, STAGES, phaseOf, pick, stageHref } from './data';
import { AI_BY_PHASE, AI_PRINCIPLES, AI_TOOLS, SDAD_URL, SPEC_FIDELITY } from './ai-native';

type Lang = 'vi' | 'en';

const STEPS: [string, string][] = [
  ['Nắm ý định', 'Intent capture'],
  ['Đặc tả máy đọc được', 'Machine-readable spec'],
  ['AI tổng hợp', 'Agentic synthesis'],
  ['Kiểm độc lập + người ký', 'Independent check + human sign-off'],
];

export default function AiNative({ lang }: { lang: Lang }) {
  const L = (vi: string, en: string) => (lang === 'en' ? en : vi);
  const specStage = STAGES.find((s) => s.slug === 'dac-ta-yeu-cau');
  const docLinks = [DOCS.aiPolicy, DOCS.specFidelity];

  return (
    <Section id="ai-native" className="border-t border-[color:var(--s-line)]">
      <SectionHeader
        label={L('Làm dự án với AI', 'AI-native delivery')}
        title={L('AI làm nhanh hơn. Người vẫn chịu trách nhiệm.', 'AI makes it faster. People stay accountable.')}
        lead={L(
          'Studio dùng AI trong hầu hết các pha — nhưng theo luật rõ ràng: đặc tả trước, AI viết, người khác duyệt, mọi thứ có nhãn và truy vết được.',
          'The studio uses AI in almost every phase — under explicit rules: spec first, AI writes, someone else approves, everything labelled and traceable.',
        )}
      />

      {/* Luồng 4 bước */}
      <ol className="grid gap-px rounded-xl overflow-hidden border border-[color:var(--s-line)] bg-[var(--s-line)] grid-cols-2 lg:grid-cols-4" aria-label={L('Bốn bước', 'Four steps')}>
        {STEPS.map((st, i) => (
          <li key={st[1]} className="bg-[var(--s-raise)] p-4 sm:p-5 min-w-0">
            <span className="text-[0.75rem] tabular-nums font-semibold text-[color:var(--s-accent)]">{String(i + 1).padStart(2, '0')}</span>
            <p className="mt-1 text-[0.9rem] font-semibold leading-snug text-[color:var(--s-ink)]">{pick(st, lang)}</p>
          </li>
        ))}
      </ol>

      {/* Nguyên tắc */}
      <h3 className={`${T.h3} mt-12`}>{L('Năm nguyên tắc', 'Five principles')}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AI_PRINCIPLES.map((p, i) => (
          <article key={p.id} className={`${T.card} p-5 sm:p-6 min-w-0 flex flex-col`}>
            <span className="text-[0.75rem] font-semibold text-[color:var(--s-accent)]">{String.fromCharCode(97 + i)}</span>
            <h4 className={`${T.h3} mt-1`}>{pick(p.title, lang)}</h4>
            <p className={`${T.body} mt-2`}>{pick(p.body, lang)}</p>
            {p.href && p.hrefLabel && (
              <Link href={p.href} className="mt-auto pt-3 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-[color:var(--s-ink)] hover:text-[color:var(--s-accent)]">
                {pick(p.hrefLabel, lang)} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </article>
        ))}
      </div>

      {/* AI làm gì / người duyệt gì */}
      <h3 className={`${T.h3} mt-14`}>{L('AI làm gì, người duyệt gì — theo từng pha', 'What AI does, what people approve — by phase')}</h3>
      <div className={`${T.card} overflow-hidden mt-4`}>
        <table className="block sm:table w-full text-left text-sm">
          <thead className="hidden sm:table-header-group bg-[var(--s-band)] text-[color:var(--s-muted)]">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium w-[16%]">{L('Pha', 'Phase')}</th>
              <th scope="col" className="px-5 py-3 font-medium w-[40%]">{L('AI hỗ trợ', 'AI assists with')}</th>
              <th scope="col" className="px-5 py-3 font-medium">{L('Người duyệt & chịu trách nhiệm', 'People approve & own')}</th>
            </tr>
          </thead>
          <tbody className="block sm:table-row-group">
            {AI_BY_PHASE.map((r) => {
              const ph = phaseOf(r.phase);
              return (
                <tr key={r.phase} className="border-t border-[color:var(--s-line)] first:border-t-0 sm:first:border-t block sm:table-row px-5 py-4 sm:p-0 space-y-2 sm:space-y-0">
                  <th scope="row" className="block sm:table-cell sm:px-5 sm:py-4 font-semibold text-[color:var(--s-ink)] align-top">
                    <span className="inline-flex items-center gap-2">
                      <span aria-hidden className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: ph.color }} />
                      {pick(ph.label, lang)}
                    </span>
                  </th>
                  <td className="block sm:table-cell sm:px-5 sm:py-4 text-[color:var(--s-body)] align-top">
                    <span className="sm:hidden text-[0.75rem] font-semibold text-[color:var(--s-muted)] block">{L('AI hỗ trợ', 'AI assists with')}</span>
                    {pick(r.ai, lang)}
                  </td>
                  <td className="block sm:table-cell sm:px-5 sm:py-4 text-[color:var(--s-body)] align-top">
                    <span className="sm:hidden text-[0.75rem] font-semibold text-[color:var(--s-muted)] block">{L('Người duyệt', 'People approve')}</span>
                    {pick(r.human, lang)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className={`${T.small} mt-3`}>
        {L(`${PHASES.length} pha giống đường thời gian ở trên.`, `The same ${PHASES.length} phases as the timeline above.`)}
      </p>

      {/* Spec Fidelity */}
      <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12">
        <div className="min-w-0">
          <h3 className={T.h3}>{L('Cổng Spec Fidelity: đặc tả đủ tốt để giao cho AI chưa?', 'The Spec Fidelity gate: is the spec good enough to hand to AI?')}</h3>
          <p className={`${T.body} mt-3`}>
            {L(
              'Mỗi yêu cầu được chấm theo bốn chiều. Đặc tả chỉ qua cổng khi đạt ngưỡng hai bên đã thoả thuận, và người chấm không phải người viết. Chưa đạt thì sửa đặc tả — không để AI tự đoán phần còn thiếu.',
              'Each requirement is scored on four dimensions. The spec passes only when it meets the threshold both sides agreed, and the scorer is not the author. Below threshold, the spec is fixed — AI is not left to guess the gaps.',
            )}
          </p>
          {specStage && (
            <p className={`${T.small} mt-3`}>
              {L('Là điều kiện ra của giai đoạn ', 'An exit criterion of stage ')}
              <Link href={stageHref(specStage)} className="font-semibold text-[color:var(--s-ink)] underline underline-offset-2 hover:text-[color:var(--s-accent)]">
                {String(specStage.n).padStart(2, '0')} · {pick(specStage.title, lang)}
              </Link>
              .
            </p>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 min-w-0">
          {SPEC_FIDELITY.map((d) => (
            <article key={d.key} className={`${T.card} p-5 min-w-0`}>
              <h4 className={T.h3}>
                {pick(d.name, lang)}
                {lang === 'vi' && <span className="ml-2 text-[0.8rem] font-normal text-[color:var(--s-muted)]">{d.name[1]}</span>}
              </h4>
              <p className={`${T.small} mt-1`}>{pick(d.plain, lang)}</p>
              <dl className="mt-3 space-y-2 text-[0.85rem] leading-relaxed">
                <div className="border-l-2 border-[color:var(--s-line-strong)] pl-3">
                  <dt className="text-[0.72rem] font-semibold uppercase tracking-wide text-[color:var(--s-muted)]">{L('Viết chưa tốt', 'Weak')}</dt>
                  <dd className="text-[color:var(--s-muted)]">{pick(d.bad, lang)}</dd>
                </div>
                <div className="border-l-2 border-[color:var(--s-accent)] pl-3">
                  <dt className="text-[0.72rem] font-semibold uppercase tracking-wide text-[color:var(--s-accent)]">{L('Viết tốt', 'Strong')}</dt>
                  <dd className="text-[color:var(--s-ink)]">{pick(d.good, lang)}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>

      {/* Công cụ + mẫu tài liệu */}
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {AI_TOOLS.map((t) => (
          <article key={t.name} className={`${T.card} p-5 sm:p-6 min-w-0 flex flex-col`}>
            <h4 className={T.h3}>{t.name}</h4>
            <p className={`${T.body} mt-2`}>{pick(t.body, lang)}</p>
            <Link href={t.href} prefetch={false} className="mt-auto pt-3 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-[color:var(--s-ink)] hover:text-[color:var(--s-accent)]">
              {pick(t.cta, lang)} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </article>
        ))}
        <article className={`${T.card} p-5 sm:p-6 min-w-0`}>
          <h4 className={T.h3}>{L('Mẫu tài liệu', 'Templates')}</h4>
          <ul className="mt-2 space-y-2">
            {docLinks.map((d) => (
              <li key={d.href}>
                <a href={d.href} target="_blank" rel="noopener" className="text-[0.9rem] text-[color:var(--s-ink)] underline underline-offset-2 hover:text-[color:var(--s-accent)]">
                  {pick(d.name, lang)}
                </a>
              </li>
            ))}
          </ul>
          <p className={`${T.small} mt-3`}>
            {L('Chính sách AI là mẫu tham khảo, cần luật sư rà soát trước khi đưa vào hợp đồng.', 'The AI policy is a reference template; a lawyer should review it before it goes into a contract.')}
          </p>
        </article>
      </div>

      {/* Nguồn */}
      <div className="mt-10 border-t border-[color:var(--s-line)] pt-5">
        <p className="text-[0.75rem] font-semibold text-[color:var(--s-muted)]">{L('Nguồn tham chiếu', 'References')}</p>
        <ul className="mt-2 space-y-1.5 text-[0.8rem] leading-relaxed text-[color:var(--s-body)]">
          <li>
            ISO/IEC/IEEE 29148:2018 — Systems and software engineering — Life cycle processes — Requirements engineering.{' '}
            {L('Đặc tính của yêu cầu tốt: một nghĩa, đầy đủ, nhất quán, kiểm chứng được.', 'Characteristics of good requirements: unambiguous, complete, consistent, verifiable.')}
          </li>
          <li>
            Vu Hung Nguyen &amp; Thanh Nguyen, “SDAD: Spec-Driven Agentic Development for the AI-Native SDLC”,{' '}
            <a href={SDAD_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-2 text-[color:var(--s-ink)] hover:text-[color:var(--s-accent)]">
              arXiv:2608.20341 <ExternalLink className="w-3 h-3" />
            </a>{' '}
            — technical report, not peer-reviewed.{' '}
            {L(
              'Trang này chỉ dùng khái niệm của bài (4 bước, Spec Fidelity, tách quyền tổng hợp và quyền phát hành, truy vết, vai trò đổi, ước lượng có hiệu chỉnh), không dùng số liệu ước lượng trong bài.',
              'This page borrows only its concepts (the four steps, Spec Fidelity, separating synthesis from release authority, provenance, role shifts, calibrated estimation) — none of its estimated figures.',
            )}
          </li>
        </ul>
      </div>
    </Section>
  );
}
