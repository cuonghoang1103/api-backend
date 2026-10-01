'use client';

/**
 * /about/quy-trinh/to-chuc — sơ đồ tổ chức, luồng liên kết bộ phận và RACI tổng.
 *
 * Dữ liệu: `departments.ts` (DEPARTMENTS, raciOverview()). RACI tổng KHÔNG gõ
 * tay — gộp từ RACI từng giai đoạn trong data.ts (vai mạnh nhất A > R > C > I).
 * "Bộ phận" là VAI, không phải số người — trang nói rõ điều đó.
 */
import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { NextStep, Section, SectionHeader, StudioShell, T, studioCss as css, useStudioLang } from '@/components/studio/StudioUI';
import { DEPT_NAMES, PHASES, STAGES, phaseOf, pick, stageHref, type RaciRole } from '../data';
import { DEPARTMENTS, DEPT_ORDER, raciOverview } from '../departments';
import OrgFlow from './OrgFlow';

const RACI_CLS: Record<RaciRole, string> = { R: css.raciR, A: css.raciA, C: css.raciC, I: css.raciI };

export default function OrgPage() {
  const { lang, L } = useStudioLang();
  const overview = useMemo(() => raciOverview(), []);
  const nInternal = DEPARTMENTS.filter((d) => !d.external).length;
  const nHandoffs = DEPARTMENTS.reduce((a, d) => a + d.handoffs.length, 0);

  return (
    <StudioShell step={3}>
      <section className="pt-10 sm:pt-14 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/about/quy-trinh" className="inline-flex items-center gap-1.5 text-[0.8rem] text-[color:var(--s-muted)] hover:text-[color:var(--s-ink)]">
            <ArrowLeft className="w-3.5 h-3.5" /> {L('Quy trình', 'Process')}
          </Link>
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 items-end">
            <div className="min-w-0">
              <p className={T.label}>{L('Tổ chức', 'Organisation')}</p>
              <h1 className={`${T.display} mt-4`}>{L('Ai làm gì, và chuyển gì cho ai.', 'Who does what, and hands what to whom.')}</h1>
            </div>
            <p className={`${T.lead} min-w-0`}>
              {L(
                `${nInternal} bộ phận cùng khách hàng, nối với nhau bằng ${nHandoffs} chuyển giao có tên. Mỗi bộ phận là một VAI chứ không phải một phòng ban đông người: ở dự án nhỏ một người kiêm nhiều vai, nhưng người làm (R) vẫn tách khỏi người duyệt (A) khi có thể.`,
                `${nInternal} functions plus the client, connected by ${nHandoffs} named hand-offs. Each function is a ROLE, not a large department: on small projects one person holds several roles, but the doer (R) is still kept apart from the approver (A) wherever possible.`,
              )}
            </p>
          </div>
        </div>
      </section>

      <Section band>
        <SectionHeader
          label={L('Luồng liên kết', 'Hand-offs')}
          title={L('Sơ đồ chuyển giao giữa các bộ phận', 'Hand-off map between functions')}
        />
        <OrgFlow lang={lang} />
      </Section>

      <Section>
        <SectionHeader
          label="RACI"
          title={L('Ma trận RACI tổng', 'Overall RACI matrix')}
          lead={L(
            'Mỗi ô là vai mạnh nhất của bộ phận trong giai đoạn đó (A > R > C > I), gộp tự động từ RACI chi tiết của từng giai đoạn. Ô trống: không tham gia. Bấm số giai đoạn để xem RACI theo từng hoạt động.',
            'Each cell is the function’s strongest role in that stage (A > R > C > I), merged automatically from each stage’s detailed RACI. Empty: not involved. Click a stage number for the per-activity RACI.',
          )}
        />
        <div className={css.tableWrap}>
          <table className={css.table}>
            <thead>
              <tr>
                <th scope="col" className={css.stickyCol}>{L('Bộ phận', 'Function')}</th>
                {STAGES.map((s) => (
                  <th key={s.slug} scope="col" className={css.center} style={{ boxShadow: `inset 0 3px 0 ${phaseOf(s.phase).color}` }}>
                    <Link href={stageHref(s)} title={pick(s.title, lang)} className="tabular-nums hover:text-[color:var(--s-accent)]">
                      {String(s.n).padStart(2, '0')}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEPT_ORDER.map((k) => (
                <tr key={k}>
                  <th scope="row" className={`${css.stickyCol} font-normal text-[color:var(--s-ink)]`}>
                    {pick(DEPT_NAMES[k], lang)}
                  </th>
                  {overview.map((row) => {
                    const v = row.cells[k];
                    return (
                      <td key={row.slug} className={css.center}>
                        {v ? (
                          <span className={`${css.raci} ${RACI_CLS[v]}`} title={`${pick(DEPT_NAMES[k], lang)} · ${pick(STAGES[row.n].title, lang)}: ${v}`}>
                            {v}
                          </span>
                        ) : (
                          <span className="sr-only">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[0.8rem] text-[color:var(--s-body)]">
          {(
            [
              ['R', L('trực tiếp làm', 'does the work')],
              ['A', L('chịu trách nhiệm giải trình, duyệt cuối', 'accountable, final sign-off')],
              ['C', L('được hỏi ý kiến trước', 'consulted before')],
              ['I', L('được báo sau', 'informed after')],
            ] as [RaciRole, string][]
          ).map(([r, t]) => (
            <span key={r} className="inline-flex items-center gap-2">
              <span className={`${css.raci} ${RACI_CLS[r]}`}>{r}</span>
              {t}
            </span>
          ))}
        </div>
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {PHASES.map((ph) => {
            const ns = STAGES.filter((s) => s.phase === ph.key).map((s) => String(s.n).padStart(2, '0'));
            return (
              <li key={ph.key} className="flex items-center gap-1.5 text-[0.78rem] text-[color:var(--s-muted)]">
                <span className="w-3 h-1 rounded-full" style={{ background: ph.color }} />
                {pick(ph.label, lang)} ({ns[0]}–{ns[ns.length - 1]})
              </li>
            );
          })}
        </ul>
        <p className={`${T.small} mt-4 max-w-[72ch]`}>
          {L(
            'Ở bảng tổng, một giai đoạn có thể có nhiều chữ A vì mỗi hoạt động có người giải trình riêng; ở RACI chi tiết của giai đoạn, mỗi hoạt động có đúng một A.',
            'In the overview a stage can show several A’s because each activity has its own accountable owner; in a stage’s detailed RACI every activity has exactly one A.',
          )}
        </p>
      </Section>

      <NextStep
        href="/about/nhan-du-an#gui-yeu-cau"
        step={L('Bắt đầu từ giai đoạn 00', 'Start at stage 00')}
        title={L('Gửi yêu cầu dự án', 'Send a project request')}
        desc={L('Phiếu yêu cầu là giai đoạn đầu tiên của quy trình. Chưa cần tài liệu — mô tả vấn đề là đủ.', 'The request form is the first stage of the process. No documents needed — describing the problem is enough.')}
        cta={L('Mở phiếu yêu cầu', 'Open the request form')}
      />
    </StudioShell>
  );
}
